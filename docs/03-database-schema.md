# FlowPilot — PostgreSQL Schema

PostgreSQL 16, extensions: `pgcrypto` (UUIDs), `vector` (pgvector), `pg_trgm` (search). Pooled multi-tenant: almost every table carries `org_id` and is protected by RLS (see §10 and `06-multi-tenancy.md`). All timestamps are `timestamptz`. Soft deletes via `deleted_at` on user-facing content tables.

> DDL below is grouped thematically for readability. The real migration emits it in dependency order (`plans`, `roles`, `users` first, then tenancy, then everything else) so all FK targets exist before they are referenced.

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. TENANCY: organizations → workspaces → memberships
CREATE TABLE organizations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  plan_key    text NOT NULL DEFAULT 'free' REFERENCES plans(key),
  settings    jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz
);

CREATE TABLE workspaces (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organizations(id),
  name        text NOT NULL, emoji text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz,
  UNIQUE (org_id, name)
);

CREATE TABLE roles (
  key         text PRIMARY KEY,          -- 'owner' | 'admin' | 'member' | 'guest'
  permissions jsonb NOT NULL             -- {"work_items:write": true, ...}
);

CREATE TABLE memberships (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES organizations(id),
  user_id      uuid NOT NULL REFERENCES users(id),
  role_key     text NOT NULL REFERENCES roles(key) DEFAULT 'member',
  workspace_id uuid REFERENCES workspaces(id),  -- NULL = org-wide
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id, workspace_id)
);
CREATE INDEX idx_memberships_user ON memberships(user_id);

-- 2. USERS & AUTH (passwordless: SSO identities + email OTP)
CREATE TABLE users (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email        citext NOT NULL UNIQUE,
  display_name text NOT NULL,
  avatar_url   text,
  timezone     text NOT NULL DEFAULT 'UTC',
  preferences  jsonb NOT NULL DEFAULT '{}',   -- notification prefs, ai auto-approve
  created_at   timestamptz NOT NULL DEFAULT now(),
  deleted_at   timestamptz
);

CREATE TABLE identities (                      -- SSO links
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES users(id),
  provider       text NOT NULL CHECK (provider IN ('google','github','microsoft','saml','oidc')),
  provider_uid   text NOT NULL,
  provider_email citext,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_uid)
);

CREATE TABLE otp_codes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      citext NOT NULL,
  code_hash  text NOT NULL,                    -- argon2 of 6-digit code
  expires_at timestamptz NOT NULL,             -- now() + 10 min
  attempts   int NOT NULL DEFAULT 0,           -- locked at 5
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_otp_email ON otp_codes(email, expires_at);

CREATE TABLE sessions (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid NOT NULL REFERENCES users(id),
  refresh_token_hash text NOT NULL,
  ip                 inet, user_agent text,
  expires_at         timestamptz NOT NULL,     -- 30 days, sliding
  revoked_at         timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_sessions_user ON sessions(user_id) WHERE revoked_at IS NULL;

-- 3. PROJECTS & WORK ITEMS (single-table hierarchy)
CREATE TABLE projects (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES organizations(id),
  workspace_id uuid NOT NULL REFERENCES workspaces(id),
  key          text NOT NULL,                  -- 'FLOW' → FLOW-123
  name         text NOT NULL,
  description  text,
  status       text NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','archived')),
  lead_id      uuid REFERENCES users(id),
  target_date  date,
  created_by   uuid REFERENCES users(id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  deleted_at   timestamptz,
  UNIQUE (org_id, key)
);
CREATE INDEX idx_projects_org ON projects(org_id, workspace_id);

CREATE TABLE sprints (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organizations(id),
  project_id  uuid NOT NULL REFERENCES projects(id),
  name        text NOT NULL,                   -- 'Sprint 12'
  goal        text,
  starts_on   date NOT NULL, ends_on date NOT NULL,
  status      text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','active','completed','cancelled')),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_sprints_project ON sprints(project_id, status);

-- Epics, stories, tasks, subtasks in ONE table: type + parent_id.
-- Hierarchy rule (enforced in service layer):
--   epic → story → task → subtask; parent may be skipped (task with no epic).
CREATE TABLE work_items (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES organizations(id),
  project_id   uuid NOT NULL REFERENCES projects(id),
  number       int  NOT NULL,                  -- per-project sequence → FLOW-123
  type         text NOT NULL CHECK (type IN ('epic','story','task','subtask','bug')),
  parent_id    uuid REFERENCES work_items(id),
  title        text NOT NULL,
  description  text,
  status       text NOT NULL DEFAULT 'backlog'
               CHECK (status IN ('backlog','todo','in_progress','in_review','done','cancelled')),
  priority     smallint NOT NULL DEFAULT 3 CHECK (priority BETWEEN 0 AND 4),  -- 0=urgent
  estimate     numeric(5,1),                   -- points
  assignee_id  uuid REFERENCES users(id),
  sprint_id    uuid REFERENCES sprints(id),
  due_date     date,
  sort_order   double precision NOT NULL DEFAULT 0,  -- fractional ordering for boards
  source       text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','ai','meeting','voice','automation','import')),
  created_by   uuid REFERENCES users(id),      -- NULL when created by AI; see activity_log actor
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  deleted_at   timestamptz,
  UNIQUE (project_id, number)
);
CREATE INDEX idx_wi_board    ON work_items(project_id, status, sort_order) WHERE deleted_at IS NULL;
CREATE INDEX idx_wi_sprint   ON work_items(sprint_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_wi_assignee ON work_items(org_id, assignee_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_wi_parent   ON work_items(parent_id);
CREATE INDEX idx_wi_title_trgm ON work_items USING gin (title gin_trgm_ops);

CREATE TABLE labels (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id  uuid NOT NULL REFERENCES organizations(id),
  project_id uuid REFERENCES projects(id),     -- NULL = org-wide label
  name    text NOT NULL, color text NOT NULL DEFAULT '#6366F1',
  UNIQUE (org_id, project_id, name)
);

CREATE TABLE work_item_labels (
  work_item_id uuid NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
  label_id     uuid NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (work_item_id, label_id)
);

-- 4. COLLABORATION: comments, mentions, attachments
CREATE TABLE comments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES organizations(id),
  work_item_id uuid NOT NULL REFERENCES work_items(id),
  author_id    uuid REFERENCES users(id),      -- NULL = AI copilot
  body         text NOT NULL,                  -- markdown
  created_at   timestamptz NOT NULL DEFAULT now(),
  edited_at    timestamptz, deleted_at timestamptz
);
CREATE INDEX idx_comments_item ON comments(work_item_id, created_at);

CREATE TABLE mentions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organizations(id),
  comment_id  uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES users(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_mentions_user ON mentions(user_id, created_at);

CREATE TABLE attachments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES organizations(id),
  work_item_id uuid REFERENCES work_items(id),
  document_id  uuid REFERENCES documents(id),
  uploader_id  uuid NOT NULL REFERENCES users(id),
  s3_key       text NOT NULL,                  -- flowpilot-attachments/{org_id}/{uuid}
  filename     text NOT NULL, mime_type text NOT NULL, size_bytes bigint NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- 5. ACTIVITY & NOTIFICATIONS
CREATE TABLE activity_log (                    -- partitioned monthly by created_at
  id           uuid NOT NULL DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL,
  actor_type   text NOT NULL CHECK (actor_type IN ('user','ai','automation','system')),
  actor_id     uuid,                           -- user_id, or approving user for AI actions
  entity_type  text NOT NULL,                  -- 'work_item' | 'project' | 'sprint' | ...
  entity_id    uuid NOT NULL,
  action       text NOT NULL,                  -- 'created' | 'status_changed' | ...
  diff         jsonb,                          -- {"status": ["todo","in_progress"]}
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);
CREATE INDEX idx_activity_entity ON activity_log(org_id, entity_type, entity_id, created_at);

CREATE TABLE notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id     uuid NOT NULL REFERENCES organizations(id),
  user_id    uuid NOT NULL REFERENCES users(id),
  kind       text NOT NULL,                    -- 'mention' | 'assigned' | 'ai_insight' | 'digest'
  payload    jsonb NOT NULL,
  read_at    timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_notif_user ON notifications(user_id, created_at DESC) WHERE read_at IS NULL;

-- 6. DOCUMENTS & MEETINGS
CREATE TABLE documents (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES organizations(id),
  workspace_id uuid NOT NULL REFERENCES workspaces(id),
  project_id   uuid REFERENCES projects(id),
  title        text NOT NULL,
  body         text,                           -- markdown
  created_by   uuid REFERENCES users(id),
  created_at   timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at   timestamptz
);

CREATE TABLE meetings (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES organizations(id),
  project_id   uuid REFERENCES projects(id),
  title        text NOT NULL, held_at timestamptz NOT NULL,
  audio_s3_key text,                           -- flowpilot-media/, deleted after 90d
  status       text NOT NULL DEFAULT 'uploaded'
               CHECK (status IN ('uploaded','transcribing','extracting','review','processed','failed')),
  created_by   uuid REFERENCES users(id),
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE meeting_transcripts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organizations(id),
  meeting_id  uuid NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  segments    jsonb NOT NULL,   -- [{speaker, start_ms, end_ms, text}]
  summary     text, created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. AI: conversations, messages, insights, embeddings, usage
CREATE TABLE ai_conversations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organizations(id),
  user_id     uuid NOT NULL REFERENCES users(id),
  project_id  uuid REFERENCES projects(id),
  title       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ai_messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES organizations(id),
  conversation_id uuid NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role            text NOT NULL CHECK (role IN ('user','assistant','tool')),
  content         text,
  tool_calls      jsonb,        -- [{name:'create_tasks', args:{...}, status:'approved'}]
  model           text,         -- 'claude-sonnet-4-5' | 'gpt-4.1-mini'
  tokens_in       int, tokens_out int, cost_usd numeric(10,6),
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_msgs_conv ON ai_messages(conversation_id, created_at);

CREATE TABLE ai_insights (                     -- risks & predictions surface here
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES organizations(id),
  project_id   uuid NOT NULL REFERENCES projects(id),
  kind         text NOT NULL CHECK (kind IN ('delay_prediction','risk','anomaly','suggestion')),
  entity_type  text, entity_id uuid,           -- e.g. a specific work_item or sprint
  severity     text NOT NULL CHECK (severity IN ('info','warning','critical')),
  title        text NOT NULL,
  detail       jsonb NOT NULL,                 -- {confidence: 0.82, features: {...}, explanation}
  status       text NOT NULL DEFAULT 'open' CHECK (status IN ('open','acknowledged','resolved','dismissed')),
  created_at   timestamptz NOT NULL DEFAULT now(), resolved_at timestamptz
);
CREATE INDEX idx_insights_project ON ai_insights(project_id, status, severity);

CREATE TABLE embeddings (                      -- RAG store, pgvector
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       uuid NOT NULL REFERENCES organizations(id),
  source_type  text NOT NULL CHECK (source_type IN ('work_item','comment','document','meeting_transcript')),
  source_id    uuid NOT NULL,
  chunk_index  int  NOT NULL DEFAULT 0,
  content      text NOT NULL,                  -- the chunk text
  embedding    vector(1536) NOT NULL,          -- text-embedding-3-small
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_type, source_id, chunk_index)
);
CREATE INDEX idx_embeddings_hnsw ON embeddings
  USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_embeddings_org ON embeddings(org_id, source_type);

CREATE TABLE ai_usage_events (                 -- metering for quotas & billing
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organizations(id),
  user_id     uuid REFERENCES users(id),
  feature     text NOT NULL,   -- 'copilot' | 'sprint_planning' | 'meeting' | 'voice' | 'insights'
  model       text NOT NULL,
  tokens_in   int NOT NULL, tokens_out int NOT NULL,
  cost_usd    numeric(10,6) NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_usage_org_day ON ai_usage_events(org_id, created_at);

-- 8. AUTOMATIONS
CREATE TABLE automations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organizations(id),
  project_id  uuid REFERENCES projects(id),
  name        text NOT NULL,
  trigger     jsonb NOT NULL,   -- {type:'status_changed', to:'done'} | {type:'schedule', cron:'0 9 * * MON'}
  conditions  jsonb NOT NULL DEFAULT '[]',
  actions     jsonb NOT NULL,   -- [{type:'assign'}, {type:'notify_slack'}, {type:'run_ai_tool', tool:'generate_report'}]
  enabled     boolean NOT NULL DEFAULT true,
  created_by  uuid REFERENCES users(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE automation_runs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organizations(id),
  automation_id uuid NOT NULL REFERENCES automations(id),
  status        text NOT NULL CHECK (status IN ('success','failed','skipped')),
  detail        jsonb, created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. AUDIT & BILLING
CREATE TABLE audit_logs (                      -- append-only; partitioned monthly
  id          uuid NOT NULL DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL,
  actor_id    uuid,
  actor_ip    inet,
  action      text NOT NULL,   -- 'member.invited' | 'sso.configured' | 'export.created' | ...
  target      jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);
-- No UPDATE/DELETE grants on audit_logs for the app role.

CREATE TABLE plans (
  key         text PRIMARY KEY,                -- 'free' | 'pro' | 'enterprise'
  name        text NOT NULL,
  limits      jsonb NOT NULL
  -- free:       {"users":5,"projects":3,"ai_tokens_month":200000,"automations":3}
  -- pro:        {"users":null,"projects":null,"ai_tokens_month":5000000,"automations":100}
  -- enterprise: {"users":null,"projects":null,"ai_tokens_month":null,"sso":true,"audit":true}
);

CREATE TABLE subscriptions (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                 uuid NOT NULL UNIQUE REFERENCES organizations(id),
  plan_key               text NOT NULL REFERENCES plans(key),
  stripe_customer_id     text, stripe_subscription_id text,
  status                 text NOT NULL CHECK (status IN ('trialing','active','past_due','canceled')),
  current_period_end     timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now()
);
```

## 10. Tenant Isolation via RLS

Every tenant-scoped table gets the same policy pattern; core-api sets `app.org_id` per transaction from the authenticated JWT (see `06-multi-tenancy.md` §3):

```sql
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_items FORCE ROW LEVEL SECURITY;   -- applies to table owner too
CREATE POLICY tenant_isolation ON work_items
  USING (org_id = current_setting('app.org_id')::uuid);
-- Repeat for: workspaces, memberships, projects, sprints, labels, comments, mentions,
-- attachments, activity_log, notifications, documents, meetings, meeting_transcripts,
-- ai_conversations, ai_messages, ai_insights, embeddings, ai_usage_events,
-- automations, automation_runs, audit_logs.
```

Notes:

- The app connects as role `flowpilot_app` (not superuser, not table owner) so RLS is always enforced; a separate `flowpilot_admin` role bypasses RLS for support tooling, every use audit-logged.
- `users`, `identities`, `otp_codes`, `sessions`, `plans`, `roles` are global (a user can belong to many orgs) — access mediated purely in the service layer.
- **RAG safety:** `embeddings.org_id` + RLS means vector similarity search can never return another tenant's chunks, even with a buggy query.
- `work_items.number` is allocated from a per-project sequence table with `SELECT ... FOR UPDATE` to keep `FLOW-123` gapless enough and unique.
- Migrations run via TypeORM migration runner in a CI step against a shadow DB first; RLS policies are part of migrations, not manual ops.
