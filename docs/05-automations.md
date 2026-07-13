# FlowPilot — Automations Engine

Rule-based **when → then** automation. No natural-language configuration, no inference —
deterministic rules a team can read, audit, and trust. The UI (rule builder on
`/automations`) exists today; this document specifies the engine that executes rules
in production.

## Model

```
Rule       — id, workspaceId, trigger (enum + params), action (enum + params),
             enabled, createdBy
RuleRun    — id, ruleId, firedAt, subject (workItemId…), result (ok|error), detail
```

### Triggers (v1)

| Trigger | Source | Params |
|---|---|---|
| `pr.merged` | GitHub/GitLab webhook, task key parsed from branch/PR title | repo filter |
| `task.priority_changed` | task PATCH pipeline | to-priority |
| `task.idle_in_status` | scheduler sweep | status, hours |
| `task.overdue` | scheduler sweep (daily) | — |
| `sprint.ended` | sprint close action | — |

### Actions (v1)

| Action | Effect |
|---|---|
| `task.move` | set status (reuses the task PATCH path) |
| `notify.channel` | Slack webhook message |
| `task.assign` | set assignee (fixed user or round-robin) |
| `task.label` | append label |
| `task.create_followup` | new WorkItem linked via parentId |

## Execution

Two entry points, one evaluator:

1. **Event-driven** — mutations to tasks/sprints and inbound integration webhooks
   publish an event `{type, workspaceId, subject}`. The evaluator loads enabled rules
   matching `type` and executes actions inline (single box) or via a Redis/BullMQ queue
   (Phase 2) for retry + isolation.
2. **Scheduled sweeps** — a cron tick (hourly) evaluates time-based triggers
   (`idle_in_status`, `overdue`) with indexed queries; each match publishes the same
   event shape.

Rules are **idempotent per subject+rule+day** (a RuleRun uniqueness guard) so sweeps
never double-fire.

## Safety

- Actions run with workspace scope only; a rule can never touch another org's data.
- Failed actions record `RuleRun.result = error` with detail; three consecutive
  failures auto-disable the rule and notify its creator.
- No rule chaining in v1 (an action does not emit trigger events) — prevents loops.
  Chaining ships later behind a depth limit.

## Integration webhooks

`POST /api/webhooks/github` verifies the HMAC signature, maps
`pull_request.merged` → `pr.merged`, and extracts task keys (`BANK-142`) from branch
name and PR title. The same pattern extends to GitLab and Slack slash-commands.
