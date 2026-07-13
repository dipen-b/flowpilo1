# FlowPilot — Roadmap

## Phase 1 — Core PM ✅ (done)

- [x] Landing page, pricing, FAQ
- [x] Auth: signup/login/logout, scrypt password hashing, cookie sessions,
      protected app routes
- [x] Projects: portfolio cards + detail with Board / List / Timeline / Calendar
- [x] Kanban drag-and-drop with persistence and optimistic UI
- [x] Task CRUD: create modal, detail drawer (edit/delete)
- [x] Sprints: active sprint, computed points/progress, burndown & velocity charts
- [x] Team: computed workload, capacity, utilization
- [x] Analytics: portfolio health, per-project status
- [x] Global ⌘K search (projects / tasks / people)
- [x] Dark/light theme, responsive, accessible chart palette
- [x] Prisma + SQLite with seed; REST API

## Phase 2 — Collaboration (next)

- [ ] Comments on tasks (schema exists) + @mentions
- [ ] Notifications: in-app inbox + SSE, email digests
- [ ] Sprint lifecycle: create/start/close flows, retro persistence,
      real burndown snapshots (daily points table)
- [ ] Task descriptions (rich text), attachments (S3)
- [ ] Docs: real editor + storage (currently templates UI)
- [ ] Time tracking to replace placeholder productivity trends

## Phase 3 — Integrations & automations

- [ ] Automations engine per docs/05-automations.md (events, sweeps, RuleRun log)
- [ ] GitHub webhook: PR merged → move task, comment links
- [ ] Slack notifications; GitLab, Figma link unfurls
- [ ] Public REST API tokens + rate limiting

## Phase 4 — Multi-tenancy & enterprise

- [ ] Org-per-signup, invites, plan limits (docs/06-multi-tenancy.md)
- [ ] Postgres migration + RLS; org switcher
- [ ] SSO (SAML/OIDC), full audit log, CSV export
- [ ] Billing (Stripe): seats, plan upgrades

## Deployment track (parallel)

- [ ] Dockerfile + compose (app + Postgres) — Phase 1 single-box AWS (~$30/mo)
- [ ] CI: build + typecheck on push (GitHub Actions)
- [ ] Backups (nightly pg_dump → S3), uptime monitoring
- [ ] Phase 2 infra: ECS + RDS + ElastiCache when HA is needed (~$190–300/mo)

## Success metrics

- Time-to-first-project < 2 minutes from signup
- Board interactions < 100ms perceived (optimistic UI)
- Weekly active teams; sprint completion rate; automation runs/week
