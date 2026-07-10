"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthFrame } from "@/components/auth-frame";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Signup failed. Please try again.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <AuthFrame
      title="Create your account"
      subtitle="Free for teams up to 5 — no credit card"
      footer={<>Already have an account? <Link href="/login" className="font-semibold" style={{ color: "var(--brand)" }}>Log in</Link></>}
    >
      <form className="space-y-3" onSubmit={submit}>
        <input
          required value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Full name" autoComplete="name"
          className="w-full rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Work email" autoComplete="email"
          className="w-full rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
        <input
          type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (8+ characters)" autoComplete="new-password"
          className="w-full rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
        {error && <p className="text-xs font-medium" style={{ color: "var(--critical)" }}>{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full px-4 py-2.5 text-sm disabled:opacity-60">
          {loading ? "Creating account…" : "Create free account"}
        </button>
      </form>
      <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-3">
        By signing up you agree to our Terms & Privacy Policy.
      </p>
    </AuthFrame>
  );
}
