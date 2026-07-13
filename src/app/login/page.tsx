"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthFrame } from "@/components/auth-frame";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Login failed. Please try again.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <AuthFrame
      title="Welcome back"
      subtitle="Log in to your FlowPilot workspace"
      footer={<>New to FlowPilot? <Link href="/signup" className="font-semibold" style={{ color: "var(--brand)" }}>Start free</Link></>}
    >
      <form className="space-y-3" onSubmit={submit}>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com" autoComplete="email"
          className="w-full rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-brand"
        />
        <input
          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Password" autoComplete="current-password"
          className="w-full rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-brand"
        />
        {error && <p className="text-xs font-medium" style={{ color: "var(--critical)" }}>{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full px-4 py-2.5 text-sm disabled:opacity-60">
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <div className="mt-5 rounded-xl border border-line bg-surface-2 p-3 text-xs leading-relaxed text-ink-2">
        <span className="font-semibold text-ink">Demo account:</span> aarav@vasundhara.dev · password <code className="rounded bg-surface px-1">flowpilot123</code>
      </div>
    </AuthFrame>
  );
}
