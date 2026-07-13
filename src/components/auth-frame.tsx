"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/shell";

export function AuthFrame({ title, subtitle, children, footer }: {
  title: string; subtitle: string; children: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10"
      style={{ background: "radial-gradient(70% 60% at 50% 0%, var(--brand-soft), var(--bg) 70%)" }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="card p-8">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-ink-2">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        {footer && <p className="mt-5 text-center text-sm text-ink-2">{footer}</p>}
      </motion.div>
    </div>
  );
}
