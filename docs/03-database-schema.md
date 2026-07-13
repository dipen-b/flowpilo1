# FlowPilot — Database Schema

Source of truth: [`prisma/schema.prisma`](../prisma/schema.prisma). SQLite in development,
PostgreSQL in production (same schema; Prisma migrations are portable).

## Entity model

```
Organization ─┬─ Workspace ─── Project ─┬─ WorkItem (epic/story/task/subtask, self-nesting)
              ├─ User ──── Session      ├─ Sprint ── WorkItem[]
              └─ Membership             └─ AiInsight (rule-based alerts*)
WorkItem ── Comment ── User
ActivityLog (append-only feed)
```

\* `AiInsight` is a legacy name kept to avoid a churn migration; it now stores
**rule-based alerts** computed from deadlines and capacity. It will be renamed `Alert`
in the next destructive migration window.

## Tables

### Tenancy
- **Organization** — `id, name, plan (free|pro|enterprise), createdAt`
- **Workspace** — `id, name, orgId → Organization`
- **Membership** — `userId + orgId` unique, `role (owner|admin|member|guest)`

### Identity & auth
- **User** — `id, name, email (unique), passwordHash (scrypt salt:hash), initials,
  role, color, capacity (h/week), orgId`
- **Session** — `id, token (unique, 32-byte hex), userId, expiresAt (30d), createdAt`.
  Cookie `fp_session` carries the token; lookups join to User.

### Work
- **Project** — `id, name, key (e.g. BANK), emoji, health (0-100), risk
  (good|warning|serious|critical), progress, dueDate, summary, forecastDate,
  forecastConfidence, forecastDelta, workspaceId, leadId`
- **WorkItem** — `id, key (BANK-142), type (epic|story|task|subtask), title,
  description, status (backlog|todo|in_progress|in_review|done), priority
  (urgent|high|medium|low), labels (csv), estimate, spent, dueDate, flag text,
  parentId (self-relation for subtasks), projectId, assigneeId, sprintId`
- **Sprint** — `id, name, goal, status (planned|active|completed), startDate, endDate,
  projectId`
- **Comment** — `id, body, workItemId, authorId, createdAt`

### Telemetry
- **AiInsight** (→ Alert) — `id, level, kind (risk|recommendation), title, detail,
  action, projectId?`
- **ActivityLog** — `id, who, what, createdAt`

## Computed values (not stored)

Derived in `src/lib/queries.ts` at read time:

| Value | Derivation |
|---|---|
| Member load | Σ estimate of assigned non-done WorkItems |
| Load status | load > capacity → critical; > 95% → warning; else good |
| Sprint progress | Σ done points / Σ total points |
| Portfolio health | mean of project health scores |
| Open tasks per project | count of non-done WorkItems |

## Key generation

Task keys are `<PROJECT.key>-<100 + count + 1>` assigned at creation
(`POST /api/tasks`). Unique per project by construction in v1; production gets a
`(projectId, key)` unique index plus a sequence table.

## PostgreSQL notes (production)

- Add indexes: `WorkItem(projectId, status)`, `WorkItem(assigneeId)`,
  `Session(token)` (already unique), `ActivityLog(createdAt)`
- Enable row-level security keyed on `orgId` once multi-tenant queries land
  (see 06-multi-tenancy.md)
- `labels` moves from CSV to `text[]`; `dueDate` from display-string to `date`
