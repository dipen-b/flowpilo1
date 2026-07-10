"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, KanbanSquare, List, GanttChartSquare, CalendarDays } from "lucide-react";
import { Card, RiskBadge, PriorityBadge, StatusPill, Avatar, Progress } from "@/components/ui";
import { statusMeta, riskMeta, type Status, type Priority, type RiskLevel, type Member } from "@/lib/data";

const COLUMNS: Status[] = ["backlog", "todo", "in_progress", "in_review", "done"];
type View = "board" | "list" | "timeline" | "calendar";

type Assignee = { id: string; name: string; initials: string; color: string } | null;
type Task = {
  id: string; key: string; title: string; status: string; priority: string;
  labels: string[]; estimate: number; spent: number; due: string; aiFlag?: string;
  assignee: Assignee;
};
type Project = {
  id: string; name: string; key: string; emoji: string; risk: string; progress: number;
  dueDate: string; summary: string; sprint: string;
  prediction: { date: string; confidence: number; delta: string };
  tasks: Task[];
};

function asMember(a: Assignee): Member {
  return { id: a?.id ?? "?", name: a?.name ?? "Unassigned", initials: a?.initials ?? "—",
    color: a?.color ?? "var(--ink-3)", role: "", capacity: 40, load: 0, productivity: 0, burnoutRisk: "good" };
}

function TaskCard({ t }: { t: Task }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="cursor-pointer rounded-xl border border-line bg-surface p-3 shadow-sm transition hover:border-line-strong hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-ink-3 tabular">{t.key}</span>
        <PriorityBadge p={t.priority as Priority} />
      </div>
      <p className="mt-1.5 text-[13px] font-medium leading-snug">{t.title}</p>
      {t.aiFlag && (
        <p className="mt-2 rounded-lg px-2 py-1 text-[11px] leading-snug" style={{ background: "var(--surface-2)", color: "var(--ink-2)" }}>
          {t.aiFlag}
        </p>
      )}
      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex gap-1">
          {t.labels.slice(0, 2).map((l) => (
            <span key={l} className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-ink-2">{l}</span>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-ink-3 tabular">{t.due}</span>
          {t.assignee && <Avatar member={asMember(t.assignee)} size={20} />}
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectDetail({ project }: { project: Project }) {
  const items = project.tasks;
  const [view, setView] = useState<View>("board");

  const views: { key: View; label: string; icon: typeof List }[] = [
    { key: "board", label: "Board", icon: KanbanSquare },
    { key: "list", label: "List", icon: List },
    { key: "timeline", label: "Timeline", icon: GanttChartSquare },
    { key: "calendar", label: "Calendar", icon: CalendarDays },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="float-up flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ background: "var(--surface-2)" }}>{project.emoji}</span>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight">{project.name}</h1>
              <RiskBadge level={project.risk as RiskLevel} />
            </div>
            <p className="mt-0.5 text-sm text-ink-2">
              {project.sprint || "No active sprint"} · due {project.dueDate} · <span className="font-semibold text-ink">{project.prediction.confidence}%</span> on track
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost px-3.5 py-2 text-sm">Settings</button>
          <button className="btn-primary px-3.5 py-2 text-sm"><Plus size={14} /> New task</button>
        </div>
      </div>

      <Card className="float-up">
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-40 flex-1">
            <div className="flex items-center justify-between text-xs text-ink-2">
              <span>Progress</span><span className="font-semibold tabular">{project.progress}%</span>
            </div>
            <div className="mt-1.5"><Progress value={project.progress} color={riskMeta[project.risk as RiskLevel].color} /></div>
          </div>
          <p className="flex-[2] text-[13px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">Status:</span> {project.summary}
          </p>
        </div>
      </Card>

      {/* View switcher */}
      <div className="float-up flex gap-1 rounded-xl border border-line bg-surface p-1 w-fit">
        {views.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setView(key)}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition ${
              view === key ? "text-white" : "text-ink-2 hover:text-ink"
            }`}
            style={view === key ? { background: "linear-gradient(135deg, var(--brand), var(--brand-2))" } : undefined}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {view === "board" && (
        <div className="hide-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
          {COLUMNS.map((col) => {
            const colTasks = items.filter((t) => t.status === col);
            return (
              <div key={col} className="w-64 shrink-0">
                <div className="mb-2.5 flex items-center gap-2 px-1">
                  <span className="h-2 w-2 rounded-full" style={{ background: statusMeta[col].color }} />
                  <span className="text-xs font-semibold text-ink-2">{statusMeta[col].label}</span>
                  <span className="text-xs text-ink-3 tabular">{colTasks.length}</span>
                </div>
                <div className="space-y-2.5 rounded-2xl bg-surface-2 p-2.5 min-h-24">
                  {colTasks.map((t) => <TaskCard key={t.id} t={t} />)}
                  <button className="w-full rounded-xl border border-dashed border-line-strong py-2 text-xs font-medium text-ink-3 transition hover:text-ink">
                    + Add task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "list" && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink-3">
                <th className="px-4 py-3 font-medium">Key</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Assignee</th>
                <th className="px-4 py-3 font-medium text-right">Est / Spent</th>
                <th className="px-4 py-3 font-medium text-right">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((t) => (
                <tr key={t.id} className="transition hover:bg-surface-2">
                  <td className="px-4 py-3 text-xs font-semibold text-ink-3 tabular">{t.key}</td>
                  <td className="px-4 py-3 font-medium">{t.title}</td>
                  <td className="px-4 py-3"><StatusPill s={t.status as Status} /></td>
                  <td className="px-4 py-3"><PriorityBadge p={t.priority as Priority} /></td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      {t.assignee && <Avatar member={asMember(t.assignee)} size={22} />}
                      <span className="text-xs">{t.assignee?.name.split(" ")[0] ?? "—"}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs tabular" style={t.spent > t.estimate ? { color: "var(--critical)" } : undefined}>{t.estimate}h / {t.spent}h</td>
                  <td className="px-4 py-3 text-right text-xs tabular">{t.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {view === "timeline" && (
        <Card>
          <div className="mb-3 grid grid-cols-4 text-center text-xs font-medium text-ink-3">
            {["Week of Jul 7", "Jul 14", "Jul 21", "Jul 28"].map((w) => <span key={w}>{w}</span>)}
          </div>
          <div className="space-y-2.5">
            {items.slice(0, 8).map((t, i) => {
              const start = (i * 13) % 55;
              const width = 18 + ((t.estimate * 2) % 28);
              return (
                <div key={t.id} className="group relative h-9 rounded-lg bg-surface-2">
                  <div
                    className="absolute top-1 flex h-7 items-center gap-2 overflow-hidden rounded-md px-2.5 text-[11px] font-semibold text-white transition group-hover:brightness-110"
                    style={{ left: `${start}%`, width: `${width}%`, background: statusMeta[t.status as Status].color, minWidth: 90 }}
                    title={t.title}>
                    <span className="truncate">{t.key} · {t.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-ink-2">
            Critical path runs through {items[0]?.key} → KYC epic.
            Milestone “Release Candidate” scheduled for {project.dueDate}.
          </p>
        </Card>
      )}

      {view === "calendar" && (
        <Card>
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-line bg-line text-xs">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="bg-surface-2 px-2 py-2 text-center font-semibold text-ink-2">{d}</div>
            ))}
            {Array.from({ length: 28 }, (_, i) => {
              const day = i + 1;
              const dayTasks = items.filter((t) => parseInt(t.due.split(" ")[1]) === day && t.due.startsWith("Jul"));
              return (
                <div key={i} className="min-h-20 bg-surface p-1.5">
                  <p className={`text-[10px] tabular ${day === 10 ? "font-bold" : "text-ink-3"}`}
                    style={day === 10 ? { color: "var(--brand)" } : undefined}>{day}</p>
                  {dayTasks.map((t) => (
                    <p key={t.id} className="mt-1 truncate rounded px-1.5 py-0.5 text-[10px] font-medium text-white" style={{ background: statusMeta[t.status as Status].color }}>
                      {t.key}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
