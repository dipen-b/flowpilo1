# FlowPilot — Multi-Tenancy

## Tenant model

```
Organization (billing boundary, plan)
  └─ Workspace (team boundary)
       └─ Projects → WorkItems → …
User belongs to an Organization via Membership (role per org).
```

The schema is multi-tenant today; the **enforcement** is single-tenant: signup joins the
demo organization, and queries read the first workspace. This document specifies the
work to make tenancy real.

## Plan of record

1. **Signup creates an org.** New signup → `Organization` + default `Workspace` +
   owner `Membership`. Joining an existing org happens via invite links
   (`/api/invites` with signed tokens, 7-day expiry).
2. **Session → tenant context.** `getSessionUser()` already returns the user with
   `orgId`; every query in `src/lib/queries.ts` takes the caller's org and filters
   `workspace.orgId = :orgId`. No query may omit the tenant filter — enforced by a
   lint rule and code review checklist.
3. **Route-handler guard.** A small `requireUser()` helper wraps handlers: resolves
   the session, 401s when absent, and passes `{user, orgId}` so handlers can't forget.
4. **Postgres row-level security (Phase 2 defense-in-depth).**
   ```sql
   ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
   CREATE POLICY tenant_isolation ON "Project"
     USING (workspace_id IN (SELECT id FROM "Workspace"
                             WHERE org_id = current_setting('app.org_id')::text));
   ```
   The app sets `app.org_id` per connection; even a buggy query cannot cross tenants.

## Plan limits (replaces usage metering)

| Plan | Users | Projects | Extras |
|---|---|---|---|
| Free | 5 | 3 | core views |
| Pro | unlimited | unlimited | timeline, analytics, automations, integrations |
| Enterprise | unlimited | unlimited | SSO (SAML/OIDC), audit log export, data residency |

Limits are enforced at write time (`POST /api/projects` checks project count vs plan;
invite acceptance checks seat count) and surfaced in `/admin` → Billing.

## Isolation guarantees

- One pooled database; isolation by `orgId` scoping + RLS (Phase 2).
- Enterprise option: dedicated schema or dedicated instance — the Prisma layer is
  identical, only `DATABASE_URL` resolution changes (per-org connection map).
- Sessions are org-agnostic (a user has one account); org switching (a user in
  multiple orgs) reads Membership and re-scopes context — UI ships with Enterprise.

## Audit logging

`ActivityLog` gains `orgId, actorId, entity, entityId, action, metadata` and every
mutating handler writes one row. `/admin` → Audit Log reads it; Enterprise adds CSV
export and retention configuration.
