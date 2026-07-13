# FlowPilot — UX Flows

Design principle: **minimal clicks**. Every core action is reachable in ≤ 2 interactions
from anywhere in the app.

## Onboarding

```
Landing → Start Free → Signup (name / email / password)
  → session created → Dashboard
```

- No email verification gate in v1; the account is usable immediately.
- New members currently join the workspace's organization; self-serve org creation
  ships with multi-tenancy (see 06-multi-tenancy.md).

## Login

```
/login → email + password → POST /api/auth/login
  → HttpOnly session cookie → /dashboard
```

Visiting any app page without a session redirects to `/login` (server-side guard).
Logout: avatar menu → Log out → session row deleted, cookie cleared.

## Daily use — the dashboard answers first

The dashboard loads with everything computed server-side, no clicking required:
project health, open work, sprint progress with points, alerts (rule-based, from
deadlines and capacity), what-needs-you-today, workload heatmap, and team activity.

## Working a board

```
Projects → project card → Board view
  ─ drag a card between columns   → status persists (PATCH /api/tasks/:id)
  ─ click a card                  → detail drawer: edit title/status/priority/
                                    assignee/estimate/spent, or delete
  ─ "+ Add task" in any column    → modal pre-set to that column's status
```

Views switch instantly (Board / List / Timeline / Calendar) — same data, client-side
tab, no reload.

## Search (⌘K)

```
⌘K anywhere (or click the top bar) → type ≥ 2 chars
  → grouped results: Projects / Tasks / People (live DB query, 180ms debounce)
  → Enter/click → navigate
```

## Sprint planning (manual, deliberate)

```
Sprints → Plan next sprint
  → set goal → pull backlog items by priority until points ≈ velocity
  → check per-member capacity → Start sprint
```

During the sprint: burndown and velocity update from item estimates; the backlog list
shows done/in-review state per item. Closing a sprint records the retrospective
(went well / improve / action items).

## Creating an automation

```
Automations → Rule builder
  → When [trigger dropdown] → Then [action dropdown] → Add rule
```

Triggers: PR merged, task marked urgent, task idle in review, sprint end, task overdue.
Actions: move task, notify channel, assign on-call, add label, create follow-up.
(Engine design: 05-automations.md.)

## Screen inventory

| Route | Purpose |
|---|---|
| `/` | Marketing landing |
| `/login`, `/signup` | Auth |
| `/dashboard` | Daily overview (aggregates) |
| `/projects`, `/projects/:id` | Portfolio + board/list/timeline/calendar |
| `/sprints` | Active sprint, burndown, velocity, retro |
| `/team` | Workload, capacity, utilization |
| `/analytics` | Portfolio health, budget, per-project status |
| `/docs` | Document templates + recents |
| `/automations` | Rule builder + active rules |
| `/admin` | Members/roles, billing, security, audit log, integrations |
