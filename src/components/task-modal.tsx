"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { AvatarPerson } from "@/components/ui";

const PRIORITIES = ["urgent", "high", "medium", "low"] as const;
const STATUSES = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "in_review", label: "In Review" },
  { value: "done", label: "Done" },
] as const;

export function TaskModal({
  projectId,
  open,
  initialStatus = "backlog",
  statuses,
  onClose,
}: {
  projectId: string;
  open: boolean;
  initialStatus?: string;
  statuses?: { value: string; label: string }[];
  onClose: () => void;
}) {
  const statusOptions = statuses?.length ? statuses : STATUSES;
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState(initialStatus);
  const [estimate, setEstimate] = useState(4);
  const [assigneeId, setAssigneeId] = useState("");
  const [members, setMembers] = useState<AvatarPerson[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setStatus(initialStatus);
      setError("");
      fetch("/api/members")
        .then((r) => r.json())
        .then(setMembers)
        .catch(() => setMembers([]));
    }
  }, [open, initialStatus]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError("");
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        title: title.trim(),
        priority,
        status,
        estimate,
        assigneeId: assigneeId || null,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Could not create the task. Please try again.");
      return;
    }
    setTitle("");
    onClose();
    router.refresh();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50" onClick={onClose}
          />
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl"
            style={{ boxShadow: "var(--shadow-lg)" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">New task</h2>
              <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2">
                <X size={16} />
              </button>
            </div>

            <label className="mt-4 block text-xs font-semibold text-ink-2">Title</label>
            <input
              autoFocus required value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="mt-1.5 w-full rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm transition-all duration-150 focus:border-brand focus:shadow-lg"
            />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-2">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm transition-all duration-150 focus:border-brand focus:shadow-lg">
                  {statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm capitalize outline-none focus:border-brand">
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2">Assignee</label>
                <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm transition-all duration-150 focus:border-brand focus:shadow-lg">
                  <option value="">Unassigned</option>
                  {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2">Estimate (h)</label>
                <input
                  type="number" min={0} max={200} value={estimate}
                  onChange={(e) => setEstimate(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm transition-all duration-150 focus:border-brand focus:shadow-lg"
                />
              </div>
            </div>

            {error && <p className="mt-3 text-xs font-medium" style={{ color: "var(--critical)" }}>{error}</p>}

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="btn-ghost px-4 py-2 text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary px-5 py-2 text-sm disabled:opacity-60">
                {saving ? "Creating…" : "Create task"}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  );
}
