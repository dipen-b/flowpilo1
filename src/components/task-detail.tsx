"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import type { AvatarPerson } from "@/components/ui";

const PRIORITIES = ["urgent", "high", "medium", "low"];
const STATUSES = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "in_review", label: "In Review" },
  { value: "done", label: "Done" },
];

export type DetailTask = {
  id: string; key: string; title: string; status: string; priority: string;
  labels: string[]; estimate: number; spent: number; due: string;
  assignee: AvatarPerson | null;
};

export function TaskDetail({ task, onClose }: { task: DetailTask | null; onClose: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("backlog");
  const [priority, setPriority] = useState("medium");
  const [assigneeId, setAssigneeId] = useState("");
  const [estimate, setEstimate] = useState(0);
  const [spent, setSpent] = useState(0);
  const [members, setMembers] = useState<AvatarPerson[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setStatus(task.status);
      setPriority(task.priority);
      setAssigneeId(task.assignee?.id ?? "");
      setEstimate(task.estimate);
      setSpent(task.spent);
      setConfirmDelete(false);
      fetch("/api/members").then((r) => r.json()).then(setMembers).catch(() => setMembers([]));
    }
  }, [task]);

  if (!task) return null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status, priority, estimate, spent, assigneeId: assigneeId || null }),
    });
    setSaving(false);
    onClose();
    router.refresh();
  };

  const remove = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    onClose();
    router.refresh();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40" onClick={onClose}
        />
        <motion.form
          onSubmit={save}
          initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-line bg-surface p-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-3 tabular">{task.key}</span>
            <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2">
              <X size={16} />
            </button>
          </div>

          <label className="mt-4 block text-xs font-semibold text-ink-2">Title</label>
          <textarea
            required value={title} onChange={(e) => setTitle(e.target.value)} rows={2}
            className="mt-1.5 w-full resize-none rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm font-medium outline-none focus:border-brand"
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-2">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand">
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-2">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm capitalize outline-none focus:border-brand">
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-ink-2">Assignee</label>
              <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand">
                <option value="">Unassigned</option>
                {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-2">Estimate (h)</label>
              <input type="number" min={0} value={estimate} onChange={(e) => setEstimate(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-2">Spent (h)</label>
              <input type="number" min={0} value={spent} onChange={(e) => setSpent(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand" />
            </div>
          </div>

          {task.labels.length > 0 && (
            <div className="mt-4">
              <label className="block text-xs font-semibold text-ink-2">Labels</label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {task.labels.map((l) => (
                  <span key={l} className="rounded-md bg-surface-2 px-2 py-1 text-xs font-medium text-ink-2">{l}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between gap-2 pt-6">
            <button type="button" onClick={remove}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition"
              style={{ background: "var(--critical-soft)", color: "var(--critical)" }}>
              <Trash2 size={13} /> {confirmDelete ? "Really delete?" : "Delete"}
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="btn-ghost px-4 py-2 text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary px-5 py-2 text-sm disabled:opacity-60">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </AnimatePresence>
  );
}
