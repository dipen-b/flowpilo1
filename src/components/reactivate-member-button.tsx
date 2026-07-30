"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { UserCheck, AlertCircle, X, CheckCircle } from "lucide-react";

export function ReactivateMemberButton({ userId, userName }: { userId: string; userName: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function reactivate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/members/${userId}/reactivate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Failed to reactivate member.");
      
      setSuccess(true);
      // Reload page after 1.5 seconds to show success message
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reactivate member.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <>
        <button
          disabled
          className="rounded-lg p-1.5 text-ink-3 opacity-50"
        >
          <UserCheck size={14} />
        </button>
        {open &&
          createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40" />
              <div className="float-up relative w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl">
                <div className="flex items-center justify-center gap-3">
                  <div className="rounded-full bg-good/10 p-3 text-good">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">Reactivated!</h3>
                    <p className="mt-1 text-sm text-ink-2">
                      {userName} is now active. Reloading...
                    </p>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={`Reactivate ${userName}`}
        aria-label={`Reactivate ${userName}`}
        className="rounded-lg p-1.5 text-ink-3 transition hover:bg-good/10 hover:text-good"
      >
        <UserCheck size={14} />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div className="float-up relative w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl">
              <div className="mb-4 flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-good/10 p-2 text-good">
                  <AlertCircle size={18} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold tracking-tight">Reactivate member?</h3>
                  <p className="mt-1 text-sm text-ink-2">
                    <span className="font-semibold text-ink">{userName}</span> will be able to log in and access projects again.
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
                  disabled={loading}
                  className="flex-1 rounded-lg border border-line py-2 text-sm font-medium text-ink-2 transition hover:bg-surface-2 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={reactivate}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-good px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Reactivating…" : "Reactivate"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
