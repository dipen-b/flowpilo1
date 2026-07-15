"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Could not reset the password.");
      setDone(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset the password.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: "var(--good-soft)", color: "var(--good)" }}>
        Password updated — taking you to the login page…
      </p>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand";

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="password" required minLength={8} autoFocus
        value={password} onChange={(e) => setPassword(e.target.value)}
        placeholder="New password (min 8 characters)"
        className={inputClass}
      />
      <input
        type="password" required
        value={confirm} onChange={(e) => setConfirm(e.target.value)}
        placeholder="Confirm new password"
        className={inputClass}
      />
      {error && <p className="text-xs font-medium" style={{ color: "var(--critical)" }}>{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full px-4 py-2.5 text-sm disabled:opacity-60">
        {loading ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
