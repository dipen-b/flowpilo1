"use client";

import { useState } from "react";
import { Zap, ArrowRight, GitPullRequest, Plus } from "lucide-react";
import { Card } from "@/components/ui";

const TRIGGERS = [
  "A pull request is merged",
  "A task is marked Urgent",
  "A task sits in Review > 48h",
  "A sprint ends",
  "A task becomes overdue",
];
const ACTIONS = [
  "Move the task to Done",
  "Notify a Slack channel",
  "Assign to the on-call engineer",
  "Add a label",
  "Create a follow-up task",
];

const ACTIVE = [
  { trigger: "PR merged referencing a task", action: "Move task to Done + notify QA channel", runs: 148 },
  { trigger: "Task idle in Review > 48h", action: "Ping reviewer + escalate to lead after 72h", runs: 36 },
  { trigger: "Sprint ends", action: "Generate a sprint report + notify stakeholders", runs: 13 },
  { trigger: "Bug marked Urgent", action: "Assign on-call engineer + post in #incidents", runs: 22 },
];

export default function Automations() {
  const [trigger, setTrigger] = useState(TRIGGERS[0]);
  const [action, setAction] = useState(ACTIONS[0]);
  const [added, setAdded] = useState(false);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="float-up flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Automations</h1>
          <p className="mt-1 text-sm text-ink-2">Rules that handle the busywork. Set once, they run forever.</p>
        </div>
      </div>

      <Card className="float-up">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Zap size={15} style={{ color: "var(--brand)" }} /> Rule builder
        </p>
        <div className="mt-3 flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
          <span className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-3">When</span>
          <select value={trigger} onChange={(e) => { setTrigger(e.target.value); setAdded(false); }}
            className="flex-1 rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand">
            {TRIGGERS.map((t) => <option key={t}>{t}</option>)}
          </select>
          <ArrowRight size={16} className="mx-auto shrink-0 text-ink-3 sm:mx-0" />
          <span className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-3">Then</span>
          <select value={action} onChange={(e) => { setAction(e.target.value); setAdded(false); }}
            className="flex-1 rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand">
            {ACTIONS.map((a) => <option key={a}>{a}</option>)}
          </select>
          <button onClick={() => setAdded(true)} className="btn-primary px-5 py-2.5 text-sm"><Plus size={14} /> Add rule</button>
        </div>
        {added && (
          <div className="float-up mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-line p-4 text-[13px] font-medium">
            <span className="rounded-lg border border-line bg-surface-2 px-3 py-1.5">⚡ When: {trigger}</span>
            <ArrowRight size={14} className="text-ink-3" />
            <span className="rounded-lg border border-line bg-surface-2 px-3 py-1.5">✓ Then: {action}</span>
            <span className="ml-auto text-xs font-semibold" style={{ color: "var(--good)" }}>Rule enabled ✓</span>
          </div>
        )}
      </Card>

      <Card title="Active automations" action={<GitPullRequest size={14} className="text-ink-3" />} className="overflow-x-auto p-0">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-3">
              <th className="px-5 py-3 font-medium">When</th>
              <th className="px-5 py-3 font-medium">Then</th>
              <th className="px-5 py-3 font-medium text-right">Runs (30d)</th>
              <th className="px-5 py-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ACTIVE.map((a) => (
              <tr key={a.trigger} className="transition hover:bg-surface-2">
                <td className="px-5 py-3.5 font-medium">{a.trigger}</td>
                <td className="px-5 py-3.5 text-ink-2">{a.action}</td>
                <td className="px-5 py-3.5 text-right tabular">{a.runs}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: "var(--good-soft)", color: "var(--good)" }}>On</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
