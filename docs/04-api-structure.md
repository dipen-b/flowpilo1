# FlowPilot — NestJS API Structure

Base URL: `https://api.flowpilot.app/v1`. JSON only, UTF-8. Auth: `Authorization: Bearer <access_jwt>` (15-min access token; refresh via `/auth/refresh` with httpOnly cookie). Every request resolves a tenant context (`org_id`) from the JWT + `X-Org-Id` header; guards + RLS enforce isolation (`06-multi-tenancy.md`).

## 1. NestJS Module Map

```
src/
├── auth/            AuthModule        — OTP, SSO (Google/GitHub/Microsoft), sessions, JWT
├── orgs/            OrgsModule        — organizations, workspaces, memberships, roles, invites
├── projects/        ProjectsModule    — projects, labels
├── work-items/      WorkItemsModule   — epics/stories/tasks/subtasks, comments, attachments
├── sprints/         SprintsModule     — sprints, planning endpoints
├── ai/              AiModule          — conversations, tool approvals, meetings, voice, insights
├── analytics/       AnalyticsModule   — velocity, burndown, reports
├── docs/            DocsModule        — documents
├── notifications/   NotificationsModule
├── automations/     AutomationsModule
├── billing/         BillingModule     — plans, subscriptions, Stripe webhooks
├── admin/           AdminModule       — enterprise admin: audit logs, SSO config, usage
├── webhooks/        WebhooksModule    — inbound (GitHub/GitLab/Stripe), outbound subscriptions
├── realtime/        RealtimeModule    — Socket.IO gateway (deployed as realtime-gateway service)
└── common/          guards (TenantGuard, PlanLimitGuard, RolesGuard), interceptors
                     (TenantContextInterceptor sets app.org_id), pipes, pagination utils
```

## 2. Endpoint Catalog

### auth
| Method | Path | Description |
|---|---|---|
| POST | `/auth/otp/request` | Send 6-digit OTP to email |
| POST | `/auth/otp/verify` | Verify code → session + tokens (creates user on first login) |
| GET  | `/auth/sso/:provider` | Redirect to Google/GitHub/Microsoft OAuth |
| GET  | `/auth/sso/:provider/callback` | OAuth callback → session |
| POST | `/auth/refresh` | Rotate refresh token → new access JWT |
| POST | `/auth/logout` | Revoke session |
| GET  | `/auth/me` | Current user + memberships |

### orgs & workspaces
| Method | Path | Description |
|---|---|---|
| POST | `/orgs` | Create organization (+ default workspace) |
| GET/PATCH | `/orgs/:orgId` | Read / update org settings |
| GET/POST | `/orgs/:orgId/workspaces` | List / create workspaces |
| GET/POST | `/orgs/:orgId/members` | List members / invite (`PlanLimitGuard`: free = 5 users) |
| PATCH/DELETE | `/orgs/:orgId/members/:userId` | Change role / remove |

### projects
| Method | Path | Description |
|---|---|---|
| GET/POST | `/projects` | List / create (`PlanLimitGuard`: free = 3 projects) |
| GET/PATCH/DELETE | `/projects/:id` | Read / update / archive |
| GET/POST | `/projects/:id/labels` | Labels |

### work-items
| Method | Path | Description |
|---|---|---|
| GET | `/work-items` | List with filters (see §5) |
| POST | `/work-items` | Create (any `type`: epic/story/task/subtask/bug) |
| POST | `/work-items/bulk` | Bulk create/update (used by AI tool execution) |
| GET/PATCH/DELETE | `/work-items/:id` | Read / update / soft-delete |
| GET/POST | `/work-items/:id/comments` | Comments (mentions parsed server-side) |
| GET | `/work-items/:id/activity` | Activity log for the item |
| POST | `/work-items/:id/attachments` | Returns presigned S3 upload URL |

### sprints
| Method | Path | Description |
|---|---|---|
| GET/POST | `/projects/:id/sprints` | List / create |
| PATCH | `/sprints/:id` | Update / start / complete (`status`) |
| POST | `/sprints/:id/plan` | Ask AI for a sprint plan proposal (see `05-ai-architecture.md` `plan_sprint`) |

### ai
| Method | Path | Description |
|---|---|---|
| GET/POST | `/ai/conversations` | List / start conversation |
| POST | `/ai/conversations/:id/messages` | Send message; response streams over WS `ai.message.delta` |
| POST | `/ai/tool-calls/:id/approve` | Approve a proposed tool call (executes it) |
| POST | `/ai/tool-calls/:id/reject` | Reject |
| POST | `/ai/meetings` | Register meeting + presigned audio upload → transcription pipeline |
| GET  | `/ai/meetings/:id` | Status, transcript, proposed tasks |
| POST | `/ai/meetings/:id/apply` | Create accepted tasks from extraction |
| POST | `/ai/voice-tickets` | Audio blob → proposed work item (single-utterance) |
| GET  | `/ai/insights` | Open `ai_insights` (filters: `project_id`, `kind`, `severity`) |
| POST | `/ai/insights/:id/ack` | Acknowledge / dismiss |
| GET  | `/ai/usage` | Org AI usage vs plan quota |

### analytics
| Method | Path | Description |
|---|---|---|
| GET | `/analytics/velocity?project_id=` | Velocity per sprint |
| GET | `/analytics/burndown?sprint_id=` | Burndown series |
| GET | `/analytics/forecast?project_id=` | Delivery prediction (confidence, expected date) |
| POST | `/analytics/reports` | Generate report (AI `generate_report`, async → S3 link) |

### docs, admin, webhooks
| Method | Path | Description |
|---|---|---|
| GET/POST | `/docs` · `/docs/:id` | Documents CRUD |
| GET | `/admin/audit-logs` | Enterprise only; filters: actor, action, date range |
| GET/PUT | `/admin/sso` | SAML/OIDC config (enterprise) |
| GET | `/admin/usage` | Seats, AI tokens, storage per workspace |
| POST | `/webhooks/github` · `/webhooks/gitlab` | Inbound VCS events (signature-verified) → auto status updates |
| POST | `/webhooks/stripe` | Billing events |
| GET/POST/DELETE | `/webhooks/subscriptions` | Outbound webhooks (Pro+): subscribe URLs to domain events |

## 3. Key Request/Response Examples

**POST `/work-items`**
```json
// request
{ "project_id": "9f1c…", "type": "task", "title": "Fix login redirect on Safari",
  "parent_id": "77ab…", "priority": 1, "estimate": 3,
  "assignee_id": "c2d4…", "sprint_id": "5e09…", "labels": ["bug"] }
// 201 response
{ "id": "b8e2…", "number": 214, "key": "FLOW-214", "type": "task",
  "title": "Fix login redirect on Safari", "status": "todo", "priority": 1,
  "estimate": 3, "assignee": { "id": "c2d4…", "display_name": "Priya N" },
  "sprint_id": "5e09…", "source": "manual",
  "created_at": "2026-07-10T09:12:33Z", "updated_at": "2026-07-10T09:12:33Z" }
```

**POST `/ai/conversations/:id/messages`**
```json
// request
{ "content": "Plan the next sprint, keep Priya light — she's out Thursday" }
// 202 response (tokens stream over WS)
{ "message_id": "a41f…", "stream_channel": "ai.message.delta",
  "conversation_id": "e7c3…" }
```

**Tool approval card payload** (delivered via WS `ai.tool_call.proposed`, approved via REST):
```json
{ "tool_call_id": "tc_91x…", "tool": "plan_sprint",
  "summary": "Move 8 items into Sprint 13 (34 pts), predicted completion 81%",
  "args": { "sprint_id": "5e09…", "add_item_ids": ["…"], "assignments": {"…": "…"} },
  "expires_at": "2026-07-10T09:20:00Z" }
```

## 4. Error Format (RFC 7807-flavored)

```json
{ "error": { "code": "PLAN_LIMIT_EXCEEDED", "status": 403,
    "message": "Free plan allows 3 projects. Upgrade to Pro for unlimited projects.",
    "details": { "limit": 3, "current": 3, "plan": "free" },
    "request_id": "req_8f3a1c" } }
```

Canonical codes: `VALIDATION_FAILED` (400), `UNAUTHENTICATED` (401), `FORBIDDEN` / `PLAN_LIMIT_EXCEEDED` (403), `NOT_FOUND` (404), `CONFLICT` (409), `RATE_LIMITED` (429), `AI_UNAVAILABLE` (503). Validation errors include a `details.fields` array from class-validator.

## 5. Pagination, Filtering, Sorting

- Cursor pagination on all list endpoints: `?limit=50&cursor=eyJpZCI6…`; response envelope `{ "data": [...], "next_cursor": "…", "has_more": true }`. Max `limit` 200.
- Filters are flat query params: `/work-items?project_id=…&status=in_progress,in_review&assignee_id=me&type=task,bug&sprint_id=…&label=payments&q=login`.
- `q` uses trigram search on title; `assignee_id=me` resolves from JWT.
- Sorting: `?sort=-priority,sort_order` (leading `-` = desc). Default: `sort_order` for board contexts, `-created_at` otherwise.
- Idempotency: mutating POSTs accept `Idempotency-Key` header (stored 24h in Redis).

## 6. API Versioning

- URI versioning (`/v1`). Additive changes (new fields/endpoints) ship without version bumps; clients must tolerate unknown fields.
- Breaking changes → `/v2` with 12-month `/v1` sunset, announced via `Deprecation` + `Sunset` response headers.
- Public API mirrors internal API (same endpoints, PAT auth with scopes: `read:work_items`, `write:work_items`, `read:analytics`).

## 7. Rate Limiting

Sliding-window counters in Redis, keyed `rl:{org_id}:{bucket}`:

| Bucket | Free | Pro | Enterprise |
|---|---|---|---|
| API general (req/min/org) | 300 | 1,500 | 5,000 (custom) |
| AI messages (req/min/org) | 5 | 30 | 100 |
| Auth endpoints (req/min/IP) | 10 | 10 | 10 |

Headers on every response: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`. 429 body uses the standard error format with `retry_after_ms`.

## 8. Guards & Cross-Cutting Behavior

- `TenantGuard` → resolves org from JWT + `X-Org-Id`, rejects non-members.
- `TenantContextInterceptor` → `SET LOCAL app.org_id = :orgId` on the transaction (RLS).
- `RolesGuard` → route metadata `@Roles('admin')` checked against `memberships.role_key`.
- `PlanLimitGuard` → reads cached plan limits (`plans.limits`), returns `PLAN_LIMIT_EXCEEDED`.
- All mutations emit domain events to Redis Streams (`events:{org_id}`) consumed by workers, automations engine, and realtime-gateway.

## 9. WebSocket Events (Socket.IO, namespace `/rt`)

Client joins rooms `org:{org_id}`, `project:{project_id}`, `user:{user_id}` after JWT handshake.

| Event | Payload (abridged) | Emitted when |
|---|---|---|
| `work_item.created` / `updated` / `deleted` | `{ id, project_id, changes, actor }` | Any mutation (incl. AI, automations) |
| `sprint.updated` | `{ id, status, stats }` | Plan/start/complete |
| `comment.created` | `{ work_item_id, comment }` | New comment |
| `ai.message.delta` | `{ conversation_id, message_id, delta }` | Copilot token stream |
| `ai.message.completed` | `{ conversation_id, message_id, usage }` | Stream end |
| `ai.tool_call.proposed` | approval card (see §3) | Copilot proposes an action |
| `ai.insight.created` | `{ insight_id, kind, severity, title }` | Risk/prediction engine fires |
| `notification.created` | `{ notification }` | Any notification |
| `presence.updated` | `{ project_id, user_id, state }` | Focus/blur/typing |

Client→server: `presence.set`, `subscribe` (`{ project_id }`), `typing` (comments). Reconnect strategy: exponential backoff + `GET /work-items?updated_after=` catch-up query.
