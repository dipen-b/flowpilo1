"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, KanbanSquare, List, GanttChartSquare, CalendarDays } from "lucide-react";
import { useRealtimeTasks } from "@/hooks/use-real-time-tasks";
import { Card, RiskBadge, PriorityBadge, StatusPill, Avatar, Progress } from "@/components/ui";
import { TaskModal } from "@/components/task-modal";
import { TaskDetail } from "@/components/task-detail";
import { AddKanbanColumn } from "@/components/add-kanban-column";
import { statusMeta, riskMeta, type Status, type Priority, type RiskLevel } from "@/lib/data";

type View = "board" | "list" | "timeline" | "calendar";
type ProjectStatus = { id: string; name: string; color: string; order: number };

/** "In Progress" -> "in_progress" — how column names map to stored status values */
const slug = (name: string) => name.trim().toLowerCase().replace(/\s+/g, "_");
const DEFAULT_STATUSES = [
  { id: "1", name: "Backlog", color: "var(--ink-3)", order: 0 },
  { id: "2", name: "Todo", color: "var(--warn)", order: 1 },
  { id: "3", name: "In Progress", color: "var(--brand)", order: 2 },
  { id: "4", name: "In Review", color: "var(--warn-soft)", order: 3 },
  { id: "5", name: "Done", color: "var(--good)", order: 4 },
];

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

function TaskCard({ t, onDragStart, onOpen }: { t: Task; onDragStart: (e: React.DragEvent, id: string) => void; onOpen: (t: Task) => void }) {
  return (
    <motion.div
      layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      draggable
      onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, t.id)}
      onClick={() => onOpen(t)}
      className="cursor-grab rounded-lg border border-line bg-surface p-4 shadow-sm transition-all duration-200 hover:border-brand hover:shadow-md hover:scale-102 active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-ink-3 tabular">{t.key}</span>
        <PriorityBadge p={t.priority as Priority} />
      </div>
      <p className="text-sm font-medium leading-snug text-ink mb-2">{t.title}</p>
      {t.aiFlag && (
        <p className="mb-2 rounded px-2 py-1.5 text-xs leading-snug" style={{ background: "var(--surface-2)", color: "var(--ink-2)" }}>
          {t.aiFlag}
        </p>
      )}
      <div className="flex items-end justify-between gap-2 pt-1">
        <div className="flex gap-1">
          {t.labels.slice(0, 2).map((l) => (
            <span key={l} className="rounded px-2 py-0.5 text-xs font-medium" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>{l}</span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xs text-ink-3 tabular">{t.due}</span>
          {t.assignee && <Avatar member={t.assignee} size={22} />}
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectDetail({ project }: { project: Project }) {
  const router = useRouter();
  const [items, setItems] = useState<Task[]>(project.tasks);
  const [view, setView] = useState<View>("board");
  const [statuses, setStatuses] = useState<ProjectStatus[]>(DEFAULT_STATUSES);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<string>("backlog");
  const [selected, setSelected] = useState<Task | null>(null);
  const lastItemsRef = useRef<Task[]>(project.tasks);

  // Fetch project statuses (also re-run after a column is added)
  const loadStatuses = useCallback(() => {
    fetch(`/api/projects/${project.id}/statuses`)
      .then((r) => (r.ok ? r.json() : DEFAULT_STATUSES))
      .then((d) => setStatuses(Array.isArray(d) && d.length > 0 ? d : DEFAULT_STATUSES))
      .catch(() => setStatuses(DEFAULT_STATUSES));
  }, [project.id]);

  useEffect(() => loadStatuses(), [loadStatuses]);

  // Keep local state in sync when the server refreshes the page data
  useEffect(() => {
    setItems(project.tasks);
    lastItemsRef.current = project.tasks;
  }, [project.tasks]);

  // Real-time updates: poll for task changes every 2 seconds
  useRealtimeTasks(project.id, (updatedTasks) => {
    const prevTasks = lastItemsRef.current;
    const hasChanges = updatedTasks.length !== prevTasks.length ||
      updatedTasks.some((t, i) =>
        !prevTasks[i] ||
        t.status !== prevTasks[i].status ||
        t.spent !== prevTasks[i].spent
      );

    if (hasChanges) {
      setItems(updatedTasks);
      lastItemsRef.current = updatedTasks;
    }
  });

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/task-id", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = async (e: React.DragEvent, col: string) => {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData("text/task-id");
    if (!id) return;
    const task = items.find((t) => t.id === id);
    if (!task || task.status === col) return;

    const previous = items;
    // Optimistic update
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, status: col } : t)));
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: col }),
    });
    if (!res.ok) {
      setItems(previous); // roll back on failure
      return;
    }
    router.refresh();
  };

  const openModal = (status: string) => {
    setModalStatus(status);
    setModalOpen(true);
  };

  const views: { key: View; label: string; icon: typeof List }[] = [
    { key: "board", label: "Board", icon: KanbanSquare },
    { key: "list", label: "List", icon: List },
    { key: "timeline", label: "Timeline", icon: GanttChartSquare },
    { key: "calendar", label: "Calendar", icon: CalendarDays },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <TaskModal projectId={project.id} open={modalOpen} initialStatus={modalStatus}
        statuses={statuses.map((s) => ({ value: slug(s.name), label: s.name }))}
        onClose={() => setModalOpen(false)} />
      {selected && <TaskDetail task={selected}
        statuses={statuses.map((s) => ({ value: slug(s.name), label: s.name }))}
        onClose={() => setSelected(null)} />}

      <div className="float-up flex flex-wrap items-start justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl text-3xl" style={{ background: "var(--surface-2)" }}>{project.emoji}</span>
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
              <RiskBadge level={project.risk as RiskLevel} />
            </div>
            <p className="text-sm text-ink-3">
              {project.sprint || "No active sprint"} • {project.dueDate} • <span className="font-semibold text-ink-2">{project.prediction.confidence}%</span> on track
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openModal("backlog")} className="btn-primary"><Plus size={16} /> New task</button>
        </div>
      </div>

      <Card className="float-up mb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink-3 uppercase">Progress</span>
              <span className="text-lg font-bold tabular text-ink">{project.progress}%</span>
            </div>
            <Progress value={project.progress} color={riskMeta[project.risk as RiskLevel].color} />
          </div>
          <div className="flex-[2]">
            <p className="text-sm leading-relaxed text-ink-2">
              <span className="font-semibold text-ink block mb-1">Status</span> {project.summary}
            </p>
          </div>
        </div>
      </Card>

      {/* View switcher */}
      <div className="float-up flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5 p-1 w-fit rounded-lg border border-line bg-surface-2">
          {views.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setView(key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                view === key ? "text-white shadow-md" : "text-ink-2 hover:text-ink"
              }`}
              style={view === key ? { background: "linear-gradient(135deg, var(--brand), var(--brand-2))" } : undefined}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/${project.id}/chat`}
            className="btn-ghost !rounded-full !py-2 text-sm">
            🔥 Campfire
          </Link>
          <Link href={`/projects/${project.id}/messages`}
            className="btn-ghost !rounded-full !py-2 text-sm">
            💬 Message Board
          </Link>
        </div>
      </div>

      {view === "board" && (
        <div className="hide-scrollbar -mx-1 flex flex-col gap-4 overflow-x-auto px-1 pb-2 md:flex-row md:overflow-x-auto">
          {statuses.map((status) => {
            const col = slug(status.name);
            const colTasks = items.filter((t) => t.status === col);
            return (
              <div key={status.id} className="w-full shrink-0 md:min-w-72">
                <div className="mb-3 flex items-center gap-2.5 px-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: status.color }} />
                  <span className="text-sm font-semibold text-ink">{status.name}</span>
                  <span className="ml-auto text-xs font-medium text-ink-3 tabular bg-surface-2 px-2 py-0.5 rounded">{colTasks.length}</span>
                </div>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(col); }}
                  onDragLeave={() => setDragOver((d) => (d === col ? null : d))}
                  onDrop={(e) => onDrop(e, col)}
                  className="space-y-3 rounded-xl p-3 min-h-32 transition-all duration-200 border-2"
                  style={{
                    background: dragOver === col ? "var(--brand-soft)" : "var(--surface-2)",
                    borderColor: dragOver === col ? "var(--brand)" : "transparent",
                  }}
                >
                  {colTasks.map((t) => <TaskCard key={t.id} t={t} onDragStart={onDragStart} onOpen={setSelected} />)}
                  {colTasks.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-xs text-ink-3">No tasks yet</p>
                    </div>
                  )}
                  <button onClick={() => openModal(col)}
                    className="w-full rounded-lg border border-dashed border-line py-2.5 text-xs font-medium text-ink-3 transition hover:text-ink hover:border-line-strong">
                    + Add task
                  </button>
                </div>
              </div>
            );
          })}
          <AddKanbanColumn projectId={project.id} onAdded={loadStatuses} />
        </div>
      )}

      {view === "list" && (
        <>
          {/* Table view on desktop */}
          <Card className="hidden overflow-x-auto p-0 md:block">
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
                  <tr key={t.id} onClick={() => setSelected(t)} className="cursor-pointer transition-all duration-150 hover:bg-surface-2 hover:shadow-inner">
                    <td className="px-4 py-3 text-xs font-semibold text-ink-3 tabular">{t.key}</td>
                    <td className="px-4 py-3 font-medium">{t.title}</td>
                    <td className="px-4 py-3"><StatusPill s={t.status as Status} /></td>
                    <td className="px-4 py-3"><PriorityBadge p={t.priority as Priority} /></td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        {t.assignee && <Avatar member={t.assignee} size={22} />}
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

          {/* Card view on mobile */}
          <div className="space-y-3 md:hidden">
            {items.map((t) => (
              <div key={t.id} onClick={() => setSelected(t)} className="cursor-pointer">
                <Card className="transition-all duration-150 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-ink-3 tabular">{t.key}</span>
                        <PriorityBadge p={t.priority as Priority} />
                      </div>
                      <p className="font-medium truncate">{t.title}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-ink-2">
                        <StatusPill s={t.status as Status} />
                        <span>{t.estimate}h / {t.spent}h</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {t.assignee && <Avatar member={t.assignee} size={28} />}
                      <span className="text-xs text-ink-3 tabular">{t.due}</span>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </>
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
                <div key={t.id} className="group relative h-9 rounded-lg bg-surface-2 transition-all duration-150 hover:bg-surface-1">
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-1 flex h-7 items-center gap-2 overflow-hidden rounded-md px-2.5 text-[11px] font-semibold text-white transition-all duration-200 group-hover:brightness-110 group-hover:shadow-lg origin-left"
                    style={{ left: `${start}%`, width: `${width}%`, background: statusMeta[t.status as Status].color, minWidth: 90 }}
                    title={t.title}>
                    <span className="truncate">{t.key} · {t.title}</span>
                  </motion.div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-ink-2">
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
