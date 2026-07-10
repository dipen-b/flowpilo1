# FlowPilot — Production Roadmap

Strategy: ship a genuinely usable PM tool fast (Phase 1), then win on the AI copilot moat (Phase 2), then sell up-market (Phase 3). Cross-references: architecture `01`, schema `03`, AI `05`, tenancy `06`.

## Phase 0 — Foundations (4 weeks, pre-MVP)

- Monorepo (Turborepo): `apps/web`, `apps/api`, `apps/ai-orchestrator`, `apps/workers`, `packages/ui`, `packages/contracts` (shared Zod schemas → API types + tool registry).
- Terraform baseline: 3 AWS accounts (dev/staging/prod), VPC, ECS cluster, RDS, ElastiCache, S3, CloudFront (`01` §4). CI/CD: GitHub Actions → ECR → CodeDeploy blue/green.
- Postgres schema v1 with RLS from day one (`03`) — retrofitting RLS is the classic SaaS trap; cross-tenant probe suite in CI (`06` §5).
- Auth core: OTP + Google/GitHub/Microsoft OAuth, sessions, JWT, TenantGuard chain (`04` §8).
- Design system seed: tokens, Button/Card/Badge/Input/Avatar, dark+light (`07`).
- Observability from commit one: OTel, structured logs, Sentry, dashboards (`01` §6).

**Exit criteria:** deploy-to-prod pipeline green; a user can sign up, create an org, and see an empty authenticated shell; RLS probe suite passing.

## Phase 1 — MVP (12 weeks, week-by-week)

Goal: private beta → public launch of a lovable core PM tool with the first AI wow-moment (AI project setup + copilot Q&A).

| Week | Deliverables |
|---|---|
| 1 | Projects + work_items CRUD (single-table hierarchy), project keys/numbering; list view; workspace nav |
| 2 | Kanban board: drag-drop (dnd-kit), fractional `sort_order`, optimistic updates; work-item slide-over panel |
| 3 | realtime-gateway live: WS events for items/comments/presence (`04` §9); comments + @mentions + notifications table |
| 4 | Sprints CRUD, backlog view, start/complete flow; estimates, priorities, labels; keyboard layer (⌘K palette, C, E/S/D row actions) |
| 5 | BullMQ workers + notification-service: email (SES), in-app inbox, digest batching; attachments via presigned S3 |
| 6 | **AI foundation:** ai-orchestrator service, model routing, `ai_conversations`/`ai_messages`, streaming over WS; copilot panel UI with read-only tools (`search_knowledge`, `get_project_state`) |
| 7 | RAG pipeline: ingestion queue, chunking, pgvector embeddings, hybrid retrieval (`05` §3); copilot cites sources |
| 8 | **AI project setup interview** + `create_project`/`create_tasks` tools with approval cards + undo (`02` §1, §3); onboarding flow end-to-end |
| 9 | Billing: Stripe integration, plans/subscriptions, PlanLimitGuard (5 users / 3 projects on free), upgrade flow; AI token metering + budgets (`06` §4) |
| 10 | Analytics v1: velocity, burndown, `GET /analytics/forecast` heuristic v0; Daily Brief generation job |
| 11 | Hardening: load test to GA targets (`01` §5), injection red-team suite, a11y audit (WCAG AA), pen-test fixes, rate limiting, status page |
| 12 | Private beta (20 design-partner teams) → fix top friction → **public launch**: marketing site, docs, Product Hunt |

**MVP cut-line (explicitly out):** meetings, voice, automations UI, SSO, mobile PWA polish, public API tokens.

## Phase 2 — AI Differentiation (weeks 13–26)

- **Sprint planning copilot:** `plan_sprint` with capacity math + proposal board (`02` §5); predicted completion % on live board.
- **Delivery prediction v1** (Monte Carlo) + **risk detection engine** → `ai_insights`, Daily Brief upgrade, at-risk banners (`05` §5–6).
- **Meeting-to-tasks** pipeline + review screen; calendar bot integration (Google Meet/Zoom recordings) (`05` §7).
- **Voice-to-tickets** on web + mobile PWA (`05` §8).
- **Git/PR auto status:** GitHub + GitLab webhooks, branch/PR linking, automation-driven transitions (`05` §9).
- **Automations builder UI** (trigger/condition/action) on the `automations` engine; outbound webhooks; `generate_report` scheduled reports.
- Public API (PATs + scopes), Slack app (notifications + copilot in Slack).
- Eval harness expansion + prompt canary infrastructure (`05` §11).

**Exit criteria:** ≥ 50% of weekly active orgs use ≥ 2 AI features; meeting extraction accept-all ≥ 80%; prediction calibration error < 10%.

Phase 2 sequencing (two-week blocks):

| Weeks | Focus |
|---|---|
| 13–14 | `plan_sprint` tool + proposal board UI; capacity model |
| 15–16 | Delivery prediction v1 + forecast API + at-risk banners |
| 17–18 | Risk engine (rules + LLM pass), Daily Brief v2, insight lifecycle |
| 19–20 | Meeting pipeline end-to-end + review screen |
| 21–22 | Voice-to-tickets; mobile PWA polish; GitHub/GitLab webhooks + auto status |
| 23–24 | Automations builder UI, outbound webhooks, scheduled reports |
| 25–26 | Public API + PATs, Slack app, eval-harness expansion, prompt canaries |

## Phase 3 — Enterprise (weeks 27–40)

- SAML/OIDC SSO, enforced SSO, JIT provisioning; SCIM v2 (`06` §6).
- Audit log UI + export + SIEM streaming; retention controls (`06` §10).
- Noisy-neighbor hardening and fair-share LLM scheduling under enterprise load (`06` §9).
- Dedicated-schema and dedicated-DB isolation tiers via `TenantConnectionResolver` (`06` §7); customer-region option.
- SOC 2 Type II audit window (controls live from Phase 1); DPA/zero-retention AI agreements; dedicated model endpoints.
- Portfolio-level AI: cross-project analysis (Claude Opus tier), exec reporting, custom roles/permissions, guest hardening.
- Delivery prediction v2 (learned model, shadow-scored) (`05` §5).

## Critical-Path Dependencies

- RLS + tenant context (Phase 0) blocks **everything** — no feature work starts before the probe suite is green.
- RAG pipeline (P1 W7) blocks the AI interview (W8): the interview is only good because it retrieves org context.
- Billing + metering (P1 W9) blocks public launch: free-tier AI without budgets is an unbounded cost hole.
- `plan_sprint` (P2 W13–14) blocks prediction UX (W15–16): predictions need sprint composition data to be meaningful.
- Audit logging schema exists from Phase 0 (`03` §9) even though the UI ships in Phase 3 — enterprise buyers ask for historical logs.

## GTM Milestones (aligned to build phases)

| When | Milestone |
|---|---|
| P1 W6 | Waitlist live; 5 design-partner teams onboarded to staging weekly builds |
| P1 W12 | Public launch: Product Hunt, founder demo video (the 4-minute onboarding, `02` §1) |
| P2 W16 | "AI that predicts your sprint" campaign — prediction accuracy stats as content |
| P2 W22 | Meeting-to-tasks launch + Slack app → team-network growth loop |
| P3 W30 | Enterprise page, SOC 2 report available under NDA, first 3 lighthouse enterprise logos |

## Team Composition

| Phase | Team (headcount) |
|---|---|
| 0–1 | 1 staff full-stack (lead), 2 product engineers (1 FE-lean, 1 BE-lean), 1 AI engineer, 1 product designer, founding PM/CEO — **6** |
| 2 | +1 AI engineer, +1 product engineer, +0.5 DevOps (contract → hire), +1 GTM — **9.5** |
| 3 | +1 security/platform engineer, +1 solutions/sales engineer, +support lead — **12.5** |

Operating rules: no separate QA org (engineers own quality + the eval suites); design system maintained by FE-lean engineer + designer pair; on-call rotation starts at public launch (Phase 1 W12).

## Success Metrics / KPIs

| Category | Metric | Target (6 mo post-launch) |
|---|---|---|
| Activation | Signup → first AI-created project | ≥ 55% within first session |
| Time-to-value | Signup → planned project | < 4 min median (`02` §1) |
| Engagement | WAU/MAU | ≥ 55% |
| AI adoption | Weekly orgs using ≥ 1 AI action | ≥ 70% |
| AI quality | Tool-approval rate / meeting accept-all | ≥ 85% / ≥ 80% |
| Retention | 12-week logo retention (activated teams) | ≥ 80% |
| Revenue | Free→Pro conversion | ≥ 6% of activated orgs |
| Cost | AI cost as % of MRR | ≤ 20% blended |
| Reliability | API availability / p95 latency | 99.9% / < 250ms |
| NPS | Product NPS | ≥ 45 |

## Launch Checklist (Phase 1, Week 12)

- [ ] Load test passed at 2× GA targets; autoscaling verified with chaos drill (kill tasks, fail Redis)
- [ ] Cross-tenant probe suite + injection red-team suite green in CI
- [ ] Pen test findings ≥ high all closed; WAF rules tuned
- [ ] Backup/restore drill executed; RTO < 1h, RPO < 5min verified
- [ ] Billing E2E: upgrade, downgrade, dunning, proration, tax (Stripe Tax)
- [ ] Rate limits + AI budgets enforced and user-visibly messaged
- [ ] Status page + incident runbooks + on-call rotation live
- [ ] a11y audit (axe + manual SR pass) — no AA blockers
- [ ] Legal: ToS, privacy policy, DPA template, subprocessor list (OpenAI, Anthropic, AWS, Stripe)
- [ ] Analytics events instrumented for every KPI above
- [ ] Docs site + onboarding emails + demo workspace seeded

## Post-Launch Operating Cadence

- **Releases:** trunk-based, deploy to prod on every green merge (feature flags via `settings`/plan flags gate exposure); prompt/model changes ride the canary path (5% of orgs, 48h, eval + online metrics gate) separate from code deploys.
- **Weekly:** AI quality review (approval/edit/dismissal metrics from `05` §11), cost-per-org review, top-10 slow queries, churn-risk account review.
- **Monthly:** restore drill or chaos drill (alternating), dependency/CVE sweep, pricing-page conversion review.
- **Quarterly:** cross-tenant probe suite audit beyond CI (manual red team), SLO review and error-budget policy reset, roadmap re-plan against KPI table above.
- **Incident process:** sev1 = core API or data isolation, 15-min response; sev2 = AI features degraded, 1h; blameless postmortems within 5 working days, actions tracked as FLOW work items (dogfooding is mandatory — the team runs FlowPilot on FlowPilot from Phase 1 week 4).

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| AI outputs mediocre plans → trust collapse | Med | Approval cards + undo everywhere; golden-set evals gate releases; precision-tuned extraction; visible "why" explanations |
| LLM cost blows unit economics | Med | Model routing to cheap tiers, prompt caching, per-org budgets, margin alert at 40% of MRR (`05` §11) |
| Provider outage/rate limits | Med | Dual-provider failover matrix; graceful "AI unavailable" degradation — core PM tool keeps working (`01` §8) |
| Incumbent (Jira/Linear) ships copycat AI | High | Speed + depth: prediction/meeting/voice pipelines are data+eval moats, not just prompts; own the "AI PM" positioning early |
| Cross-tenant data leak | Low | RLS + FORCE from day one, probe suite in CI, pen tests, restricted admin role with audit (`06`) |
| Prompt injection drives unwanted mutations | Med | Capability firewall: tools re-check permissions server-side; approval cards; fenced untrusted content (`05` §10) |
| RLS/pgvector performance at scale | Med | HNSW tuning, replica reads, partitioned logs; dedicated-DB tier as pressure valve (`06` §7) |
| Scope creep vs 12-week MVP | High | Cut-line documented above; weekly scope review; anything new displaces something |

Standing rule: risk review is a fixed agenda item in the weekly leadership sync; any risk that trips its trigger metric (e.g. AI cost > 30% of MRR trending, approval rate < 75%) gets an owner and a work item in the FLOW project that week — the mitigation column above is a starting point, not a filed-and-forgotten register.
