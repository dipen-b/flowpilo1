"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthFrame } from "@/components/auth-frame";

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [email, setEmail] = useState("");

  return (
    <AuthFrame
      title={step === "form" ? "Create your workspace" : "Verify your email"}
      subtitle={step === "form" ? "Free for teams up to 5 — no credit card" : `Enter the 6-digit code sent to ${email}`}
      footer={<>Already have an account? <Link href="/login" className="font-semibold" style={{ color: "var(--brand)" }}>Log in</Link></>}
    >
      {step === "form" ? (
        <>
          <div className="grid gap-2.5">
            {["Google", "GitHub", "Microsoft"].map((p) => (
              <button key={p} onClick={() => router.push("/dashboard")} className="btn-ghost w-full px-4 py-2.5 text-sm">
                Continue with {p}
              </button>
            ))}
          </div>
          <div className="my-5 flex items-center gap-3 text-xs text-ink-3">
            <span className="h-px flex-1 bg-line-strong" /> or <span className="h-px flex-1 bg-line-strong" />
          </div>
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setStep("otp"); }}>
            <input required placeholder="Full name"
              className="w-full rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-brand" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email"
              className="w-full rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-brand" />
            <input type="password" required minLength={8} placeholder="Password (8+ characters)"
              className="w-full rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-brand" />
            <button type="submit" className="btn-primary w-full px-4 py-2.5 text-sm">Create free account</button>
          </form>
          <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-3">
            By signing up you agree to our Terms & Privacy Policy.
          </p>
        </>
      ) : (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); router.push("/dashboard"); }}>
          <input inputMode="numeric" maxLength={6} autoFocus placeholder="••••••"
            className="w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-brand" />
          <button type="submit" className="btn-primary w-full px-4 py-2.5 text-sm">Verify & enter FlowPilot</button>
          <p className="text-center text-xs text-ink-3">
            <button type="button" className="font-medium underline">Resend code</button>
          </p>
        </form>
      )}
    </AuthFrame>
  );
}
