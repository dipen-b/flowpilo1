# FlowPilot — API Structure

REST route handlers under `src/app/api/`. JSON in/out. Auth is a session cookie
(`fp_session`); browser calls send it automatically.

## Implemented endpoints

### Auth
| Method & path | Body | Returns |
|---|---|---|
| `POST /api/auth/signup` | `{name, email, password}` | `201 {ok, user}` + session cookie · `409` duplicate email · `400` invalid |
| `POST /api/auth/login` | `{email, password}` | `200 {ok, user}` + session cookie · `401` bad credentials |
| `POST /api/auth/logout` | — | `200 {ok}`, session deleted, cookie cleared |

### Projects
| Method & path | Notes |
|---|---|
| `GET /api/projects` | List with computed `openTasks`, deduped `members`, lead |
| `POST /api/projects` | `{name, key?, emoji?, summary?}` → `201` |
| `GET /api/projects/:id` | Full detail incl. shaped `tasks[]` · `404` |

### Tasks
| Method & path | Notes |
|---|---|
| `GET /api/tasks` | All work items, shaped (labels split, assignee joined) |
| `POST /api/tasks` | `{projectId, title, status?, priority?, estimate?, assigneeId?, labels?}` → `201`; key auto-generated `KEY-1nn` |
| `PATCH /api/tasks/:id` | Whitelisted fields: `title, status, priority, estimate, spent, dueDate, assigneeId, sprintId, labels` · `404` |
| `DELETE /api/tasks/:id` | `204` · `404` |

### Read models
| Method & path | Notes |
|---|---|
| `GET /api/dashboard` | `{projects, members, risks, recommendations, activity, healthAvg}` |
| `GET /api/members` | Users with computed `load` and load status |
| `GET /api/search?q=` | `{projects[≤5], tasks[≤8], people[≤4]}`; `q` < 2 chars → empty sets |

## Conventions

- **Errors:** `{"error": "<human message>"}` with a meaningful status
  (`400` validation, `401` auth, `404` missing, `409` conflict, `500` unexpected).
- **Writes are whitelisted:** PATCH copies only known fields from the body — no
  mass-assignment.
- **Shaping at the boundary:** handlers return view models from `src/lib/queries.ts`,
  never raw Prisma rows with internal fields.

## Planned (Phase 2+)

- `GET/POST /api/sprints`, `POST /api/sprints/:id/start|close`
- `GET/POST /api/tasks/:id/comments`
- `GET /api/notifications` + SSE stream
- Automations CRUD: `GET/POST/PATCH /api/rules`, run log `GET /api/rules/:id/runs`
- Integration webhooks: `POST /api/webhooks/github` (PR merged → rule triggers)
- Pagination (`?cursor=`, `?limit=`) once datasets outgrow single-screen lists;
  current lists are workspace-scoped and small by design.
