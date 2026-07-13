"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

const EMOJIS = ["📁", "🚀", "🏦", "🛠️", "📱", "🌐", "🎨", "📊", "🔒", "💬"];

export function NewProjectButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [emoji, setEmoji] = useState("📁");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setOpen(false);
    setName("");
    setKey("");
    setEmoji("📁");
    setError("");
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          key: key.trim().toUpperCase() || name.trim().slice(0, 4).toUpperCase(),
          emoji,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Failed to create project.");
      reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary px-4 py-2 text-sm">
        <Plus size={14} /> New project
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={reset} />
          <div className="float-up relative w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-tight">New project</h3>
              <button onClick={reset} aria-label="Close" className="text-ink-3 transition hover:text-ink"><X size={18} /></button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-2">Project name</label>
                <input
                  required autoFocus value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mobile App"
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none transition focus:border-brand"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-ink-2">Key</label>
                  <input
                    value={key} onChange={(e) => setKey(e.target.value.toUpperCase())}
                    placeholder="e.g. APP" maxLength={6}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm uppercase outline-none transition focus:border-brand"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-ink-2">Icon</label>
                  <div className="flex flex-wrap gap-1">
                    {EMOJIS.slice(0, 5).map((e) => (
                      <button key={e} type="button" onClick={() => setEmoji(e)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border text-base transition ${emoji === e ? "border-brand" : "border-line hover:bg-surface-2"}`}
                        style={emoji === e ? { background: "var(--brand-soft)" } : undefined}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {error && <p className="text-xs font-medium" style={{ color: "var(--critical)" }}>{error}</p>}
              <button type="submit" disabled={loading || !name.trim()} className="btn-primary w-full px-4 py-2 text-sm disabled:opacity-60">
                {loading ? "Creating…" : "Create project"}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
