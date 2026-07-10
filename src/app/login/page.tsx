"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthFrame } from "@/components/auth-frame";

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <AuthFrame
      title={step === "email" ? "Welcome back" : "Check your email"}
      subtitle={step === "email" ? "Log in to your FlowPilot workspace" : `We sent a 6-digit code to ${email || "your inbox"}`}
      footer={<>New to FlowPilot? <Link href="/signup" className="font-semibold" style={{ color: "var(--brand)" }}>Start free</Link></>}
    >
      {step === "email" ? (
        <>
          <div className="grid gap-2.5">
            {["Google", "GitHub", "Microsoft"].map((p) => (
              <button key={p} onClick={() => router.push("/dashboard")} className="btn-ghost w-full px-4 py-2.5 text-sm">
                Continue with {p}
              </button>
            ))}
          </div>
          <div className="my-5 flex items-center gap-3 text-xs text-ink-3">
            <span className="h-px flex-1 bg-line-strong" /> or with email <span className="h-px flex-1 bg-line-strong" />
          </div>
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setStep("otp"); }}>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-brand" />
            <button type="submit" className="btn-primary w-full px-4 py-2.5 text-sm">Continue with email</button>
          </form>
          <p className="mt-4 text-center text-xs text-ink-3">
            Forgot password? <a href="#" className="font-medium underline">Reset it</a> · SSO user?{" "}
            <a href="#" className="font-medium underline">SAML SSO</a>
          </p>
        </>
      ) : (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); router.push("/dashboard"); }}>
          <input inputMode="numeric" maxLength={6} autoFocus value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="••••••"
            className="w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-brand" />
          <button type="submit" className="btn-primary w-full px-4 py-2.5 text-sm">Verify & log in</button>
          <p className="text-center text-xs text-ink-3">
            Didn&apos;t get it? <button type="button" className="font-medium underline">Resend code</button> ·{" "}
            <button type="button" onClick={() => setStep("email")} className="font-medium underline">Change email</button>
          </p>
        </form>
      )}
    </AuthFrame>
  );
}
