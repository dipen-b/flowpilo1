# FlowPilot — Multi-Tenancy Architecture

## 1. Tenant Model

```
organization (tenant boundary, billing boundary, plan boundary)
└── workspaces (org-internal grouping: departments/teams)
    └── projects → sprints → work_items
memberships: (org_id, user_id, role_key[, workspace_id])
users are GLOBAL — one account, many orgs (consultant use case)
```

- **`organization` is the tenant.** Every scoped row carries `org_id`; isolation, quotas, rate limits, billing, and audit all key on it.
- **Workspaces are not isolation boundaries** — they are access-control scopes inside a tenant. A membership with `workspace_id = NULL` is org-wide; a non-null value confines a guest/member to one workspace.
- Roles: `owner` (billing + delete org), `admin` (members, SSO, automations), `member` (full product), `guest` (single workspace, no exports). Permission matrix lives in `roles.permissions` (`03-database-schema.md` §1).

## 2. Isolation Strategy: Pooled Postgres + RLS

Chosen model: **one shared PostgreSQL cluster, shared schema, Row-Level Security** on every tenant-scoped table.

| Option | Verdict |
|---|---|
| Pooled + RLS (chosen) | Cheapest to operate, one migration path, defense-in-depth at the DB; right for thousands of small/mid tenants |
| Schema-per-tenant | Migration fan-out pain at >100 tenants; reserved as enterprise option (§7) |
| DB-per-tenant | Only for top-tier enterprise/regulated; offered as paid add-on (§7) |

RLS policy pattern (full list of covered tables in `03-database-schema.md` §10):

```sql
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_items FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON work_items
  USING (org_id = current_setting('app.org_id')::uuid);
```

Guarantees this buys us:

1. A missing `WHERE org_id =` in any query returns zero foreign rows instead of leaking data.
2. The **RAG/vector store inherits isolation** — `embeddings` has the same policy, so similarity search physically cannot cross tenants.
3. `FORCE` + a non-owner app role (`flowpilot_app`) means no code path bypasses policies. Support tooling uses `flowpilot_admin` (RLS-exempt); every such session writes an `audit_logs` entry with reason.

## 3. Tenant Context Propagation

```mermaid
sequenceDiagram
    participant C as Client
    participant API as core-api
    participant PG as Postgres
    participant Q as BullMQ worker
    participant AI as ai-orchestrator
    C->>API: Bearer JWT + X-Org-Id
    API->>API: TenantGuard: membership(org_id,user_id) exists?
    API->>PG: BEGIN; SET LOCAL app.org_id = '…'; …queries…; COMMIT
    API->>Q: enqueue job { payload, ctx: {org_id, acting_user_id, traceparent} }
    Q->>PG: SET LOCAL app.org_id from job ctx
    API->>AI: internal call, service JWT {org_id, acting_user_id}
    AI->>API: tool execution → same guard chain as a user request
```

Rules:

- **HTTP:** `TenantGuard` validates membership; `TenantContextInterceptor` opens the transaction and runs `SET LOCAL app.org_id` (`SET LOCAL` scopes to the transaction — safe with RDS Proxy pooling because it never leaks across pooled sessions).
- **Jobs:** every BullMQ payload embeds `ctx.org_id`; a worker-side wrapper refuses to run any job without it and sets the GUC before touching the DB.
- **AI:** ai-orchestrator never gets raw DB access to domain tables' write paths; tools call core-api's internal API with a short-lived service JWT carrying `{org_id, acting_user_id}`, so role checks, plan limits, and RLS apply to the copilot exactly as to the human it acts for (`05-ai-architecture.md` §2).
- **Realtime:** Socket.IO rooms are `org:{org_id}` / `project:{project_id}`; room joins re-verify membership server-side.
- **Cache keys** always prefix `org_id` (`cache:{org_id}:…`); S3 keys prefix `{org_id}/` and presigned URLs are generated only after a tenant check.

Invariants enforced in CI (lint rules + integration tests):

1. No repository/query method compiles without a tenant-scoped connection type (TypeScript branding on the datasource).
2. Every new table migration must either add the RLS policy or be explicitly registered in the `GLOBAL_TABLES` allowlist — the migration linter fails otherwise.
3. Every BullMQ `enqueue` call site must pass `ctx` (ESLint rule on the wrapper signature).
4. The cross-tenant probe suite (§5) runs on every merge to main.

## 4. Per-Tenant AI Metering & Quotas

Two layers, consistent with `05-ai-architecture.md` §11:

1. **Hot path (Redis):** `INCRBY ai_budget:{org_id}:{yyyymm}` after every LLM call with total tokens. Checked *before* each call; soft-warn at 80% of `plans.limits.ai_tokens_month`, hard-block at 100% for free/pro (error `PLAN_LIMIT_EXCEEDED`, upgrade CTA), alert-only for enterprise (invoiced overage).
2. **System of record (Postgres):** one `ai_usage_events` row per call (feature, model, tokens, cost). Nightly reconciliation corrects Redis drift; monthly rollup feeds Stripe metered billing and the `/admin/usage` dashboard.

Plan quota matrix (from `plans.limits`):

| Limit | Free | Pro | Enterprise |
|---|---|---|---|
| Users | 5 | unlimited | unlimited |
| Projects | 3 | unlimited | unlimited |
| AI tokens / month | 200k | 5M | custom/unmetered |
| AI features | copilot Q&A, project setup | + sprint planning, insights, meetings, voice, reports | + dedicated models, portfolio analysis |
| Automations | 3 | 100 | unlimited |
| Audit log retention | — | 30 days | 2 years + export |

Enforcement points: `PlanLimitGuard` on create endpoints (users, projects, automations), ai-orchestrator budget check for tokens, feature flags resolved from `plan_key` cached 60s in Redis.

## 5. Data Isolation Guarantees (what we promise customers)

- Row-level enforcement in the database for every tenant-scoped table, including vector embeddings; verified by an automated **cross-tenant probe suite** in CI (creates two orgs, attempts 100+ cross-access patterns through API, WS, RAG search, exports — must be all-deny).
- Encryption: TLS in transit; SSE-KMS at rest (RDS, S3, ElastiCache). Attachments served via short-lived presigned URLs only.
- Tenant deletion: org offboarding job hard-deletes all rows by `org_id` + S3 prefix within 30 days, produces a signed deletion certificate; backups age out at 35 days.
- AI: prompts are never used to train shared models; retrieval corpus is tenant-scoped by construction (§2); LLM vendor zero-retention terms on enterprise.
- Backups: PITR 35 days; restore drills quarterly; per-tenant logical export (`/admin` → export) for portability.

## 6. SSO: SAML & OIDC (Enterprise)

- Built on the existing `identities` table (`provider IN ('saml','oidc')`); config stored per org via `PUT /admin/sso` (IdP metadata URL/XML, attribute mapping, allowed email domains).
- **SP-initiated and IdP-initiated** SAML 2.0; OIDC authorization-code with PKCE. Okta, Entra ID, Google Workspace tested first-class.
- JIT provisioning: first SSO login auto-creates the user + membership with a default role mapped from IdP groups (`flowpilot-admins` → `admin`). SCIM v2 for deprovisioning on the roadmap Phase 3 (`08-roadmap.md`).
- **Enforced SSO** toggle: when on, OTP/social login is rejected for the org's claimed domains, existing sessions from other methods are revoked within 15 min (access-token TTL).
- Session policy per org: max session length, re-auth for admin actions.

## 7. Enterprise Isolation Options

| Tier | Offering |
|---|---|
| Enterprise (standard) | Pooled + RLS, enforced SSO, audit logs, zero-retention AI, custom rate limits |
| Enterprise — dedicated schema | Same cluster, tenant-private schema for domain tables; migrations fan out via orchestrated runner; +20% list price |
| Enterprise — dedicated DB | Isolated RDS instance (optionally customer-region), dedicated Redis logical DB, single-tenant workers; custom pricing, 99.95% SLA |

Application code is isolation-agnostic: a `TenantConnectionResolver` maps `org_id → connection/schema` at request start; pooled tenants all resolve to the shared pool, so the dedicated tiers are additive, not a fork.

## 8. Tenant Lifecycle

**Provisioning** (synchronous, < 2s, inside onboarding `02-ux-flows.md` §1):
1. `POST /orgs` creates `organizations` + default `workspaces` row + `owner` membership in one transaction.
2. `subscriptions` row on `free` (or `trialing` Pro for 14 days when arriving via the pricing page).
3. Seed job (BullMQ): welcome notification, sample "Getting started" document, feature-flag defaults, Redis quota counters.

**Plan changes:** Stripe webhook → `subscriptions.plan_key` update → plan-limit cache invalidated (60s TTL anyway) → over-limit resources on downgrade become read-only (never deleted): projects beyond 3 lock, users beyond 5 lose access in seat order (most recent first) with owner notified.

**Offboarding:** owner-initiated delete → 14-day grace (org suspended, exportable) → hard-delete job walks every tenant-scoped table by `org_id`, purges S3 prefixes and embeddings, revokes tokens, emits deletion certificate to the owner's email. Stripe subscription cancelled immediately.

## 9. Noisy-Neighbor Controls

- Per-org API and AI rate limits (`04-api-structure.md` §7) are the first line; limits scale with plan, not with load.
- BullMQ queues use per-org job grouping with a max-concurrency of 4 jobs per org per queue — one tenant's 500-meeting backfill cannot starve others.
- Postgres: `statement_timeout 10s` for the app role (30s for analytics endpoints on replicas); per-request query budget logged, top offenders dashboarded weekly.
- LLM provider concurrency is a shared pool with per-org fair-share scheduling (weighted by plan) inside ai-orchestrator.
- Any org exceeding 5% of global request volume trips a review alert (possible abuse or a customer who should be on enterprise).

## 10. Audit Logging

- `audit_logs` (append-only, monthly partitions, no UPDATE/DELETE grants — `03-database-schema.md` §9) records: auth events (login, SSO config change, session revoke), membership/role changes, plan/billing changes, exports, API token lifecycle, admin RLS-bypass sessions, automation changes, AI auto-approve setting changes.
- Distinct from `activity_log` (product-level "who moved the card") — audit is the compliance trail.
- Enterprise: `GET /admin/audit-logs` with filters, CSV/JSON export, optional streaming to customer SIEM (S3 drop or HTTPS webhook, Phase 3).
- Retention by plan (§4 table); clock source is DB `now()`; rows carry `actor_ip` and `request_id` for forensics.

## 11. Compliance Posture

- SOC 2 Type II controls live from Phase 1, audit window in Phase 3 (`08-roadmap.md`); the tenant-isolation probe suite, audit logs, and access-review process are the core evidence set.
- GDPR: DPA + subprocessor list (AWS, OpenAI, Anthropic, Stripe); data-subject deletion rides the same per-`org_id`/per-`user_id` deletion machinery as offboarding (§8).
- Data residency: pooled tenants are us-east-1; EU residency ships with the dedicated-DB tier (§7) rather than as a shared-cluster promise we cannot keep.
