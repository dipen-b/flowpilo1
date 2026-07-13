"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

interface ProjectOption {
  id: string;
  name: string;
  emoji: string;
}

export function PlanSprintButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [projectId, setProjectId] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [open]);

  const reset = () => {
    setOpen(false);
    setName("");
    setGoal("");
    setProjectId("");
    setError("");
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/sprints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), goal, projectId, startDate, endDate }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Failed to create sprint.");
      reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create sprint.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none transition focus:border-brand";

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary px-4 py-2 text-sm">
        <Plus size={14} /> Plan next sprint
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={reset} />
          <div className="float-up relative w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-tight">Plan next sprint</h3>
              <button onClick={reset} aria-label="Close" className="text-ink-3 transition hover:text-ink"><X size={18} /></button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-ink-2">Sprint name</label>
                  <input required autoFocus value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sprint 15" className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-ink-2">Project</label>
                  <select required value={projectId} onChange={(e) => setProjectId(e.target.value)} className={inputClass}>
                    <option value="">Select…</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-2">Goal (optional)</label>
                <input value={goal} onChange={(e) => setGoal(e.target.value)}
                  placeholder="What should this sprint achieve?" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-ink-2">Start</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-ink-2">End</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
                </div>
              </div>
              <p className="rounded-lg px-3 py-2 text-xs" style={{ background: "var(--warn-soft)", color: "var(--warn)" }}>
                Starting a new sprint completes the current active sprint.
              </p>
              {error && <p className="text-xs font-medium" style={{ color: "var(--critical)" }}>{error}</p>}
              <button type="submit" disabled={loading || !name.trim() || !projectId} className="btn-primary w-full px-4 py-2 text-sm disabled:opacity-60">
                {loading ? "Creating…" : "Start sprint"}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
