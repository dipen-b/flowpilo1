# FlowPilot — Product Architecture

FlowPilot is a full-stack **Next.js 16** application: React Server Components render pages
directly from the database, and REST route handlers under `/api` serve the interactive
client features (task editing, drag-and-drop, search, auth).

## Current architecture (implemented)

```
┌────────────────────────────────────────────────────────┐
│                     Next.js 16 (App Router)            │
│                                                        │
│  Server Components          Route Handlers (/api)      │
│  ─ landing page             ─ /api/auth/* (sessions)   │
│  ─ dashboard (aggregates)   ─ /api/projects[/:id]      │
│  ─ projects & detail        ─ /api/tasks[/:id]         │
│  ─ sprints / team /         ─ /api/members             │
│    analytics                ─ /api/dashboard           │
│                             ─ /api/search              │
│           └──────────┬──────────┘                      │
│                      ▼                                 │
│               Prisma 7 (ORM)                           │
│                      ▼                                 │
│      SQLite (dev) → PostgreSQL (production)            │
└────────────────────────────────────────────────────────┘
```

- **Rendering:** app pages are `force-dynamic` server components — every request reads
  fresh data through `src/lib/queries.ts`. Client components handle interactivity
  (Kanban drag-and-drop, task drawer, ⌘K palette) and call the REST API, then
  `router.refresh()` to re-render server data.
- **Auth:** cookie sessions (HttpOnly, SameSite=Lax, 30-day expiry) stored in a
  `Session` table; passwords hashed with Node's built-in scrypt. The `(app)` layout is
  the guard — no valid session redirects to `/login`.
- **Data access:** all queries live in `src/lib/queries.ts` and shape rows into view
  models; route handlers stay thin.

## Production topology

**Phase 1 — single box (~$30/month).** One AWS EC2 Graviton instance (t4g.medium) running
the Next.js server via Docker Compose alongside PostgreSQL. Caddy or nginx terminates
TLS; Cloudflare free tier provides CDN/DNS; S3 holds uploads and nightly `pg_dump`
backups. This comfortably serves dozens of organizations.

**Phase 2 — managed services (~$300/month, or ~$190 reserved).** When HA matters:
ECS Fargate (2 tasks) behind an ALB, RDS PostgreSQL, ElastiCache Redis (queues for the
automations engine and notifications), S3 + CloudFront. The app is stateless, so the
migration is configuration, not rearchitecture.

## Swapping SQLite → PostgreSQL

The Prisma schema is database-agnostic. Switch `datasource.provider` to `postgresql`,
point `DATABASE_URL` at RDS, and run `prisma migrate deploy`. The better-sqlite3 driver
adapter in `src/lib/db.ts` is replaced by the standard Postgres driver.

## Observability

- Structured request logs from route handlers (stdout → CloudWatch in production)
- Health check: `GET /api/dashboard` doubles as a DB liveness probe
- Error tracking: Sentry (planned, Phase 2)

## Failure modes

| Failure | Behavior |
|---|---|
| DB unavailable | Route handlers 500; server components render the Next.js error boundary |
| Session expired | Layout guard redirects to `/login`; API returns 401 |
| Optimistic UI conflict | Drag-and-drop rolls back local state when the PATCH fails |
