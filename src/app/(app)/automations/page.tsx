"use client";

import { useState } from "react";
import { Sparkles, Zap, ArrowRight, GitPullRequest, Mic, Video } from "lucide-react";
import { Card } from "@/components/ui";

const ACTIVE = [
  { trigger: "PR merged referencing a task", action: "Move task to Done + notify QA channel", runs: 148 },
  { trigger: "Task idle in Review > 48h", action: "Ping reviewer + escalate to lead after 72h", runs: 36 },
  { trigger: "Meeting recording uploaded", action: "Summarize + create action-item tasks", runs: 22 },
  { trigger: "Sprint ends", action: "Generate retro summary + velocity report", runs: 13 },
];

export default function Automations() {
  const [desc, setDesc] = useState("");
  const [preview, setPreview] = useState(false);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="float-up">
        <h1 className="text-2xl font-bold tracking-tight">Automations</h1>
        <p className="mt-1 text-sm text-ink-2">Describe a workflow in plain English — AI builds it. No flowchart editors.</p>
      </div>

      <Card className="float-up">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles size={15} style={{ color: "var(--brand)" }} /> Smart Workflow Builder
        </p>
        <form className="mt-3 flex flex-col gap-2.5 sm:flex-row"
          onSubmit={(e) => { e.preventDefault(); if (desc.trim()) setPreview(true); }}>
          <input
            value={desc}
            onChange={(e) => { setDesc(e.target.value); setPreview(false); }}
            placeholder='e.g. "When a bug is marked urgent, assign it to the on-call engineer and post in #incidents"'
            className="flex-1 rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-brand" />
          <button type="submit" className="btn-primary px-5 py-2.5 text-sm"><Zap size={14} /> Build it</button>
        </form>
        {preview && (
          <div className="float-up mt-4 rounded-xl border border-line p-4" style={{ background: "var(--brand-soft)" }}>
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand)" }}>AI-built workflow — review before enabling</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] font-medium">
              <span className="rounded-lg border border-line bg-surface px-3 py-1.5">⚡ Trigger: priority changes to Urgent + type is Bug</span>
              <ArrowRight size={14} className="text-ink-3" />
              <span className="rounded-lg border border-line bg-surface px-3 py-1.5">👤 Assign: current on-call (from PagerDuty schedule)</span>
              <ArrowRight size={14} className="text-ink-3" />
              <span className="rounded-lg border border-line bg-surface px-3 py-1.5">💬 Notify: #incidents with AI summary</span>
            </div>
            <button className="btn-primary mt-4 px-4 py-2 text-xs">Enable workflow</button>
          </div>
        )}
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Meeting → Tasks" action={<Video size={14} className="text-ink-3" />}>
          <div className="rounded-xl border border-dashed border-line-strong p-6 text-center">
            <p className="text-sm font-medium">Drop a recording or transcript</p>
            <p className="mt-1 text-xs text-ink-2">AI extracts decisions, action items, and owners — and creates the tasks.</p>
            <button className="btn-ghost mt-4 px-4 py-2 text-xs">Upload recording</button>
          </div>
          <p className="mt-3 text-xs text-ink-3">Last run: “Sprint 14 planning.mp4” → 7 tasks created, 2 decisions logged</p>
        </Card>
        <Card title="Voice → Tickets" action={<Mic size={14} className="text-ink-3" />}>
          <div className="flex items-center gap-4 rounded-xl border border-line p-4">
            <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
              style={{ background: "linear-gradient(135deg, var(--brand), var(--brand-2))" }} aria-label="Record voice note">
              <Mic size={18} />
            </button>
            <p className="text-[13px] leading-relaxed text-ink-2">
              “The login screen crashes on older Androids, probably the biometric lib — high priority, give it to Nisha.”
              <span className="mt-1 block text-xs font-semibold" style={{ color: "var(--brand)" }}>→ BANK-152 created · High · assigned to Nisha ✓</span>
            </p>
          </div>
        </Card>
      </div>

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
