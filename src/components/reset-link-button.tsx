"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { KeyRound, Copy, Check, X } from "lucide-react";

export function ResetLinkButton({ userId, userName }: { userId: string; userName: string }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setOpen(true);
    setLoading(true);
    setError("");
    setUrl("");
    setCopied(false);
    try {
      const res = await fetch("/api/password-resets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Failed to create reset link.");
      setUrl(`${window.location.origin}/reset/${body.token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create reset link.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — the link is selectable
    }
  }

  return (
    <>
      <button onClick={generate} title={`Generate a password reset link for ${userName}`}
        aria-label={`Reset password for ${userName}`}
        className="rounded-lg p-1.5 text-ink-3 transition hover:bg-surface-2 hover:text-ink">
        <KeyRound size={14} />
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="float-up relative w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-tight">Password reset link</h3>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-ink-3 transition hover:text-ink"><X size={18} /></button>
            </div>
            {loading && <p className="text-sm text-ink-2">Generating…</p>}
            {error && <p className="text-xs font-medium" style={{ color: "var(--critical)" }}>{error}</p>}
            {url && (
              <>
                <p className="text-sm text-ink-2">
                  Share this link with <span className="font-semibold text-ink">{userName}</span> — it lets them set a new
                  password and expires in 24 hours. Only the newest link works.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <input readOnly value={url} onFocus={(e) => e.target.select()}
                    className="min-w-0 flex-1 rounded-lg border border-line bg-surface-2 px-3 py-2 text-xs text-ink-2 outline-none" />
                  <button onClick={copy} className="btn-primary shrink-0 px-3 py-2 text-xs">
                    {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
