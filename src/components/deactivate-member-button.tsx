"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { UserX, AlertCircle, X } from "lucide-react";

export function DeactivateMemberButton({ userId, userName }: { userId: string; userName: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function deactivate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/members/${userId}/deactivate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Failed to deactivate member.");
      setOpen(false);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deactivate member.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={`Deactivate ${userName}`}
        aria-label={`Deactivate ${userName}`}
        className="rounded-lg p-1.5 text-ink-3 transition hover:bg-critical/10 hover:text-critical"
      >
        <UserX size={14} />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div className="float-up relative w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl">
              <div className="mb-4 flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-critical/10 p-2 text-critical">
                  <AlertCircle size={18} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold tracking-tight">Deactivate member?</h3>
                  <p className="mt-1 text-sm text-ink-2">
                    <span className="font-semibold text-ink">{userName}</span> will be unable to log in or access projects.
                    Their historical data and assignments will be preserved.
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="text-ink-3 transition hover:text-ink"
                >
                  <X size={18} />
                </button>
              </div>

              {error && <p className="mb-4 text-xs font-medium" style={{ color: "var(--critical)" }}>{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border border-line py-2 text-sm font-medium text-ink-2 transition hover:bg-surface-2"
                >
                  Cancel
                </button>
                <button
                  onClick={deactivate}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-critical px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Deactivating…" : "Deactivate"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
