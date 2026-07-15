"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Card } from "@/components/ui";

interface SearchResult {
  id: string;
  key: string;
  title: string;
  status: string;
  priority: string;
  projectId: string;
  projectName: string;
  assignee?: { id: string; name: string; initials: string; color: string } | null;
}

interface Member {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export function TaskSearch({ members }: { members: Member[] }) {
  const [q, setQ] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [dueBefore, setDueBefore] = useState("");
  const [dueAfter, setDueAfter] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if ((q.length < 2 && !projectId && !assigneeId && !status && !priority) || loading) return;
      setLoading(true);
      const params = new URLSearchParams({ q, projectId, assigneeId, status, priority, dueBefore, dueAfter });
      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();
      setResults(data.tasks || []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [q, projectId, assigneeId, status, priority, dueBefore, dueAfter]);

  const clear = () => {
    setQ("");
    setProjectId("");
    setAssigneeId("");
    setStatus("");
    setPriority("");
    setDueBefore("");
    setDueAfter("");
  };

  const priorityColor: Record<string, string> = {
    urgent: "var(--critical)",
    high: "var(--warn)",
    medium: "var(--series-1)",
    low: "var(--ink-3)",
  };

  const statusColor: Record<string, string> = {
    backlog: "var(--ink-3)",
    todo: "var(--series-1)",
    in_progress: "var(--brand)",
    in_review: "var(--warn-soft)",
    done: "var(--good)",
  };

  return (
    <div className="grid gap-5 lg:grid-cols-4">
      <Card title="Search & Filter" className="lg:col-span-1 space-y-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-2">Text</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Task title or key"
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-2">Assignee</label>
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
          >
            <option value="">Anyone</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
          >
            <option value="">Any status</option>
            <option value="backlog">Backlog</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-2">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
          >
            <option value="">Any priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-ink-2">Due after</label>
            <input
              type="date"
              value={dueAfter}
              onChange={(e) => setDueAfter(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-xs outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-ink-2">Due before</label>
            <input
              type="date"
              value={dueBefore}
              onChange={(e) => setDueBefore(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-xs outline-none focus:border-brand"
            />
          </div>
        </div>
        <button
          onClick={clear}
          className="btn-ghost w-full px-3 py-1.5 text-xs"
        >
          <X size={13} /> Clear all
        </button>
      </Card>

      <Card title={`Results (${results.length})`} className="lg:col-span-3">
        {loading && <p className="text-sm text-ink-2">Searching…</p>}
        {!loading && results.length === 0 && (
          <p className="text-sm text-ink-3">No tasks match your filters.</p>
        )}
        {!loading && results.length > 0 && (
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((t) => (
              <li
                key={t.id}
                className="rounded-lg border border-line p-3 text-sm transition hover:border-line-strong"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">
                      {t.key} — {t.title}
                    </p>
                    <p className="mt-1 text-xs text-ink-2">{t.projectName}</p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                      style={{ background: statusColor[t.status] }}
                    >
                      {t.status.replace(/_/g, " ")}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                      style={{ background: priorityColor[t.priority] }}
                    >
                      {t.priority}
                    </span>
                  </div>
                </div>
                {t.assignee && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                      style={{ background: t.assignee.color }}
                    >
                      {t.assignee.initials}
                    </span>
                    <span className="text-xs text-ink-2">{t.assignee.name}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
