"use client";

import { useCallback, useEffect, useState } from "react";
import { Zap, ArrowRight, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui";

const TRIGGERS: Record<string, string> = {
  task_created: "A task is created",
  task_urgent: "A task is marked Urgent",
  task_done: "A task is moved to Done",
};

const ACTIONS: Record<string, string> = {
  notify_admins: "Notify admins & owner",
  notify_assignee: "Notify the assignee",
  log_activity: "Record in the activity log",
};

interface Rule {
  id: string;
  trigger: string;
  action: string;
  enabled: boolean;
  runs: number;
}

export default function Automations() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [trigger, setTrigger] = useState("task_urgent");
  const [action, setAction] = useState("notify_admins");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);

  const load = useCallback(() => {
    fetch("/api/automations")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setRules(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  useEffect(() => load(), [load]);

  async function createRule() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trigger, action }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 403) setIsAdmin(false);
      if (!res.ok) throw new Error(body.error ?? "Failed to create automation.");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create automation.");
    } finally {
      setLoading(false);
    }
  }

  async function toggle(rule: Rule) {
    setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r)));
    const res = await fetch(`/api/automations/${rule.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !rule.enabled }),
    });
    if (!res.ok) load(); // roll back to server truth
  }

  async function remove(rule: Rule) {
    setRules((prev) => prev.filter((r) => r.id !== rule.id));
    const res = await fetch(`/api/automations/${rule.id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) load();
  }

  const selectClass =
    "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none transition focus:border-brand";

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="float-up">
        <h1 className="text-2xl font-bold tracking-tight">Automations</h1>
        <p className="mt-1 text-sm text-ink-2">When something happens in your workspace, FlowPilot reacts for you</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <Card title="Create a rule" className="float-up self-start lg:col-span-2">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-2">When…</label>
              <select value={trigger} onChange={(e) => setTrigger(e.target.value)} className={selectClass}>
                {Object.entries(TRIGGERS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="flex justify-center text-ink-3"><ArrowRight size={16} className="rotate-90" /></div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-2">Then…</label>
              <select value={action} onChange={(e) => setAction(e.target.value)} className={selectClass}>
                {Object.entries(ACTIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            {error && <p className="text-xs font-medium" style={{ color: "var(--critical)" }}>{error}</p>}
            <button onClick={createRule} disabled={loading || !isAdmin} className="btn-primary w-full px-4 py-2 text-sm disabled:opacity-60">
              <Plus size={14} /> {loading ? "Creating…" : "Create automation"}
            </button>
            {!isAdmin && <p className="text-xs text-ink-3">Only admins and owners can manage automations.</p>}
          </div>
        </Card>

        <Card title={`Rules (${rules.filter((r) => r.enabled).length} active)`} className="float-up lg:col-span-3">
          {rules.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-3">
              No automations yet — create your first rule on the left.
            </p>
          ) : (
            <ul className="space-y-3">
              {rules.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line p-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: r.enabled ? "var(--brand-soft)" : "var(--surface-2)", color: r.enabled ? "var(--brand)" : "var(--ink-3)" }}>
                    <Zap size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[13px] font-semibold ${r.enabled ? "" : "opacity-50"}`}>
                      {TRIGGERS[r.trigger] ?? r.trigger}
                      <ArrowRight size={12} className="mx-1.5 inline text-ink-3" />
                      {ACTIONS[r.action] ?? r.action}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-3">{r.runs} run{r.runs === 1 ? "" : "s"}</p>
                  </div>
                  <button onClick={() => toggle(r)}
                    className="relative h-5 w-9 rounded-full transition"
                    style={{ background: r.enabled ? "var(--brand)" : "var(--surface-2)", border: "1px solid var(--line)" }}
                    aria-label={r.enabled ? "Disable rule" : "Enable rule"}>
                    <span className="absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-all"
                      style={{ left: r.enabled ? "calc(100% - 16px)" : "2px" }} />
                  </button>
                  <button onClick={() => remove(r)} aria-label="Delete rule"
                    className="text-ink-3 transition hover:text-ink">
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="How it works" className="float-up">
        <ul className="grid gap-3 text-[13px] leading-relaxed text-ink-2 sm:grid-cols-3">
          <li className="rounded-xl border border-line p-3.5">
            <p className="font-semibold text-ink">1 · Pick a trigger</p>
            Creating a task, marking one Urgent, or moving one to Done.
          </li>
          <li className="rounded-xl border border-line p-3.5">
            <p className="font-semibold text-ink">2 · Pick an action</p>
            Send a notification to the right people or record it in the audit trail.
          </li>
          <li className="rounded-xl border border-line p-3.5">
            <p className="font-semibold text-ink">3 · It runs instantly</p>
            Rules fire the moment the trigger happens — the run counter shows each execution.
          </li>
        </ul>
      </Card>
    </div>
  );
}
