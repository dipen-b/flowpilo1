"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { UserPlus, Copy, Check, X } from "lucide-react";

/** "Invite member" button + dialog. Creates an invite and shows a copyable link. */
export function InviteMember() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [inviteUrl, setInviteUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setOpen(false);
    setEmail("");
    setRole("member");
    setInviteUrl("");
    setError("");
    setCopied(false);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), role }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Failed to create invite.");
      // Build the link from the current origin so it works on any deployment
      setInviteUrl(`${window.location.origin}/invites/${body.token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invite.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — user can select the text manually
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary px-4 py-2 text-sm">
        <UserPlus size={14} /> Invite member
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={reset} />
          <div className="float-up relative w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-tight">Invite a team member</h3>
              <button onClick={reset} aria-label="Close" className="text-ink-3 transition hover:text-ink">
                <X size={18} />
              </button>
            </div>

            {inviteUrl ? (
              <div className="space-y-4">
                <p className="text-sm text-ink-2">
                  Invite created for <span className="font-semibold text-ink">{email}</span>. Share this link — it
                  expires in 7 days:
                </p>
                <div className="flex items-center gap-2 rounded-lg border border-line bg-surface-2 p-2">
                  <code className="min-w-0 flex-1 truncate text-xs text-ink-2">{inviteUrl}</code>
                  <button onClick={copy} className="btn-primary shrink-0 px-3 py-1.5 text-xs">
                    {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
                <p className="text-xs text-ink-3">
                  They'll create an account (or log in) with this email, then join your workspace automatically.
                </p>
                <button onClick={reset} className="w-full rounded-lg border border-line py-2 text-sm font-medium text-ink-2 transition hover:bg-surface-2">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-ink-2">Email address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teammate@company.com"
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none transition focus:border-brand"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-ink-2">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none transition focus:border-brand"
                  >
                    <option value="member">Member — can work on projects</option>
                    <option value="admin">Admin — can also manage attendance & team</option>
                  </select>
                </div>
                {error && <p className="text-xs font-medium" style={{ color: "var(--critical)" }}>{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full px-4 py-2 text-sm disabled:opacity-60">
                  {loading ? "Creating invite…" : "Create invite link"}
                </button>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
