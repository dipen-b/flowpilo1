"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Plus, X } from "lucide-react";

const COLORS = [
  "var(--ink-3)", "var(--brand)", "var(--good)", "var(--warn)", "var(--critical)",
  "var(--brand-soft)", "var(--good-soft)", "var(--warn-soft)", "var(--critical-soft)",
];

export function AddKanbanColumn({ projectId, onAdded }: { projectId: string; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setOpen(false);
    setName("");
    setColor(COLORS[0]);
    setError("");
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${projectId}/statuses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), color }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Failed to add column.");
      reset();
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add column.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex h-full min-w-72 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line transition hover:border-brand hover:bg-surface-2"
        title="Add a new column">
        <Plus size={20} className="text-ink-3" />
        <span className="text-xs font-semibold text-ink-2">Add column</span>
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={reset} />
          <div className="float-up relative w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-tight">Add column</h3>
              <button onClick={reset} aria-label="Close" className="text-ink-3 transition hover:text-ink"><X size={18} /></button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-2">Column name</label>
                <input required autoFocus value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Testing"
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none transition focus:border-brand"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-ink-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button key={c} type="button" onClick={() => setColor(c)}
                      className={`h-8 w-8 rounded-lg border-2 transition ${color === c ? "border-ink" : "border-line"}`}
                      style={{ background: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
              {error && <p className="text-xs font-medium" style={{ color: "var(--critical)" }}>{error}</p>}
              <button type="submit" disabled={loading || !name.trim()} className="btn-primary w-full px-4 py-2 text-sm disabled:opacity-60">
                {loading ? "Adding…" : "Add column"}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
