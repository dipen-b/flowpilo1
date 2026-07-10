"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, Bot, CalendarClock, TrendingUp, Mic, GitPullRequest,
  FileText, Workflow, Play, Check, ChevronDown, Shield, Zap, Users,
} from "lucide-react";
import { Logo, ThemeToggle } from "@/components/shell";
import { useState } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const AI_FEATURES = [
  { icon: Bot, title: "AI Project Manager", desc: "A copilot that plans projects, writes tasks, assigns owners by skill and capacity, and follows up — like a PM who never sleeps." },
  { icon: CalendarClock, title: "Auto Sprint Planning", desc: "One click turns your backlog into a sprint sized to real team velocity, with capacity balancing built in." },
  { icon: TrendingUp, title: "Delivery Predictor", desc: "Know your ship date before your standup does — forecasts with confidence levels, updated live." },
  { icon: Mic, title: "Voice & Meeting to Tasks", desc: "Speak naturally or upload a recording. FlowPilot extracts action items and creates work items instantly." },
  { icon: GitPullRequest, title: "Auto Status Updates", desc: "Commits, PRs, and comments update task status automatically. Nobody fills in Jira fields ever again." },
  { icon: FileText, title: "One-Click Documentation", desc: "Release notes, sprint reports, and executive summaries generated from real project data in seconds." },
  { icon: Shield, title: "Risk & Burnout Detection", desc: "Spots slipping deadlines, blocked chains, and overloaded teammates weeks before they become fires." },
  { icon: Workflow, title: "Smart Workflow Builder", desc: "Describe a workflow in plain English — “when a PR merges, move the task and notify QA” — and AI builds it." },
];

const STEPS = [
  { n: "01", title: "Describe your project", desc: "“Build a mobile banking app by October.” That's it — no forms, no configuration wizards." },
  { n: "02", title: "AI builds the plan", desc: "Epics, stories, estimates, owners, and a sprint schedule appear in seconds, tuned to your team." },
  { n: "03", title: "Ship on autopilot", desc: "Statuses update from real activity, risks surface early, and reports write themselves." },
];

const TESTIMONIALS = [
  { quote: "We deleted 14 Jira workflows and replaced them with one sentence to FlowPilot. Sprint planning went from 3 hours to 10 minutes.", name: "Maya Krishnan", role: "VP Engineering, Finlay" },
  { quote: "The delivery predictor called our slip 3 weeks before anyone felt it. We re-scoped early and still hit the launch date.", name: "Tom Erikson", role: "Head of Product, Northbeam" },
  { quote: "Our standup is now 5 minutes. FlowPilot already knows what moved, what's stuck, and who needs help.", name: "Alicia Gomez", role: "Engineering Manager, Parcelo" },
];

const FAQS = [
  { q: "How is FlowPilot different from Jira or ClickUp?", a: "Traditional tools are databases you fill in manually. FlowPilot is an AI project manager that does the filling — it creates tasks, plans sprints, updates statuses from real activity, and predicts delivery. You manage outcomes, not tickets." },
  { q: "Can the AI really create a full project plan?", a: "Yes. Describe the goal in one sentence and FlowPilot generates epics, stories, estimates, dependencies, and a sprint schedule calibrated to your team's historical velocity. You review and adjust — it does the typing." },
  { q: "Does it work with our existing tools?", a: "FlowPilot connects to GitHub, GitLab, Slack, Google Meet, Zoom, and Figma. Commits and PRs update task status automatically; meeting recordings become action items." },
  { q: "Is our data used to train AI models?", a: "No. Your workspace data is never used for model training. Enterprise plans add dedicated model deployments, SSO, and full audit logs." },
  { q: "How long does migration from Jira take?", a: "Minutes. Point FlowPilot at your Jira export and the AI maps projects, issues, sprints, and users — then suggests a simplified structure you can accept or edit." },
];

const PLANS = [
  { name: "Free", price: "$0", note: "forever", features: ["Up to 5 users", "3 projects", "Basic AI copilot", "Board, list & calendar views", "Community support"], cta: "Start Free", featured: false },
  { name: "Pro", price: "$12", note: "per user / month", features: ["Unlimited projects", "Advanced AI planning & predictions", "Analytics & executive dashboard", "Automations & workflow builder", "Meeting-to-tasks & voice-to-tickets", "Priority support"], cta: "Start 14-day trial", featured: true },
  { name: "Enterprise", price: "Custom", note: "annual billing", features: ["Unlimited everything", "SSO (SAML / OIDC)", "Dedicated AI models", "Audit logs & advanced security", "Custom data residency", "Dedicated success manager"], cta: "Talk to Sales", featured: false },
];

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="text-sm font-semibold">{q}</span>
        <ChevronDown size={16} className={`shrink-0 text-ink-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="px-5 pb-4 text-sm leading-relaxed text-ink-2">{a}</p>}
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="glass sticky top-0 z-40 border-b border-line">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-ink-2 md:flex">
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#how" className="hover:text-ink">How it works</a>
            <a href="#pricing" className="hover:text-ink">Pricing</a>
            <a href="#faq" className="hover:text-ink">FAQ</a>
          </nav>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link href="/login" className="btn-ghost px-4 py-1.5 text-sm">Log in</Link>
            <Link href="/signup" className="btn-primary px-4 py-1.5 text-sm">Start Free</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(60% 50% at 50% 0%, var(--brand-soft), transparent 70%)" }} />
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-20 text-center md:pt-28">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink-2">
              <Sparkles size={13} style={{ color: "var(--brand)" }} />
              Your AI Project Manager has arrived
            </span>
          </motion.div>
          <motion.h1 {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }}
            className="mx-auto mt-6 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Project Management on <span className="gradient-text">Autopilot</span>
          </motion.h1>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.16 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
            FlowPilot uses AI to plan projects, create tasks, manage sprints, detect risks,
            and keep your team aligned automatically.
          </motion.p>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.24 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup" className="btn-primary px-7 py-3 text-sm">Start Free — no card needed</Link>
            <Link href="/dashboard" className="btn-ghost px-7 py-3 text-sm"><Play size={14} /> Watch Demo</Link>
          </motion.div>

          {/* Product mock */}
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.34 }}
            className="card mx-auto mt-16 max-w-4xl overflow-hidden p-0 text-left" style={{ boxShadow: "var(--shadow-lg)" }}>
            <div className="flex items-center gap-1.5 border-b border-line bg-surface-2 px-4 py-2.5">
              {["#e34948", "#eda100", "#1baf7a"].map((c) => <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}
              <span className="ml-3 text-xs text-ink-3">flowpilot.app/dashboard</span>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-3">
              <div className="rounded-xl border border-line p-4">
                <p className="text-xs font-medium text-ink-3">AI Health Score</p>
                <p className="mt-1 text-3xl font-bold" style={{ color: "var(--good)" }}>84</p>
                <p className="mt-1 text-xs text-ink-2">3 of 4 projects on track</p>
              </div>
              <div className="rounded-xl border border-line p-4">
                <p className="text-xs font-medium text-ink-3">Delivery Forecast</p>
                <p className="mt-1 text-3xl font-bold tabular">Aug 25</p>
                <p className="mt-1 text-xs" style={{ color: "var(--good)" }}>87% confidence</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "var(--brand-soft)" }}>
                <p className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--brand)" }}>
                  <Sparkles size={12} /> AI Recommendation
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ink-2">
                  Rebalance 2 tasks from Rohan to Aarav to protect the Jul 18 release. <span className="font-semibold" style={{ color: "var(--brand)" }}>Apply →</span>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.p {...fadeUp} className="mt-14 text-xs font-medium uppercase tracking-widest text-ink-3">
            Trusted by product teams at
          </motion.p>
          <motion.div {...fadeUp} className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-bold text-ink-3">
            {["Finlay", "Northbeam", "Parcelo", "Hexawave", "Lumina", "Driftlab"].map((n) => <span key={n}>{n}</span>)}
          </motion.div>
        </div>
      </section>

      {/* Product overview */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">You manage outcomes.<br />The AI manages the tickets.</h2>
          <p className="mt-4 text-ink-2">Jira makes you the database administrator of your own work. FlowPilot flips it: describe what you want, and an AI project manager plans, tracks, updates, and reports — automatically.</p>
        </motion.div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: Zap, title: "10x fewer clicks", desc: "Creating a full project plan takes one sentence instead of forty forms." },
            { icon: Bot, title: "Always-on PM", desc: "The copilot watches activity 24/7 and surfaces exactly what needs you." },
            { icon: Users, title: "Loved by teams", desc: "Beginner-friendly for new hires, powerful enough for enterprise programs." },
          ].map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} {...fadeUp} className="card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
                <Icon size={18} />
              </span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI features */}
      <section id="features" className="border-y border-line" style={{ background: "var(--surface)" }}>
        <div className="mx-auto max-w-6xl px-5 py-20">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand)" }}>AI Features</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Eight things Jira will never do</h2>
          </motion.div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AI_FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} {...fadeUp} transition={{ ...fadeUp.transition, delay: (i % 4) * 0.06 }}
                className="rounded-2xl border border-line bg-bg p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                <Icon size={18} style={{ color: "var(--brand)" }} />
                <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand)" }}>How it works</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">From idea to shipped, in three steps</h2>
        </motion.div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div key={s.n} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }} className="card p-6">
              <span className="text-sm font-bold gradient-text">{s.n}</span>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-line" style={{ background: "var(--surface)" }}>
        <div className="mx-auto max-w-6xl px-5 py-20">
          <motion.h2 {...fadeUp} className="text-center text-3xl font-bold tracking-tight md:text-4xl">
            Teams ship faster on FlowPilot
          </motion.h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.figure key={t.name} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className="rounded-2xl border border-line bg-bg p-6">
                <blockquote className="text-sm leading-relaxed text-ink-2">“{t.quote}”</blockquote>
                <figcaption className="mt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-ink-3">{t.role}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-5 py-20">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand)" }}>Pricing</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Simple pricing, serious AI</h2>
        </motion.div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PLANS.map((p, i) => (
            <motion.div key={p.name} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className={`card relative p-7 ${p.featured ? "md:-translate-y-2" : ""}`}
              style={p.featured ? { borderColor: "var(--brand)", boxShadow: "0 0 0 1px var(--brand), var(--shadow-lg)" } : undefined}>
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, var(--brand), var(--brand-2))" }}>
                  Most popular
                </span>
              )}
              <h3 className="font-semibold">{p.name}</h3>
              <p className="mt-3 text-4xl font-bold tracking-tight">{p.price}</p>
              <p className="text-xs text-ink-3">{p.note}</p>
              <ul className="mt-5 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink-2">
                    <Check size={15} className="mt-0.5 shrink-0" style={{ color: "var(--good)" }} /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className={`${p.featured ? "btn-primary" : "btn-ghost"} mt-6 w-full px-4 py-2.5 text-sm`}>
                {p.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-5 pb-20">
        <motion.h2 {...fadeUp} className="text-center text-3xl font-bold tracking-tight md:text-4xl">
          Frequently asked questions
        </motion.h2>
        <div className="mt-10 space-y-3">
          {FAQS.map((f) => <Faq key={f.q} {...f} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <motion.div {...fadeUp} className="relative overflow-hidden rounded-3xl px-8 py-16 text-center text-white"
          style={{ background: "linear-gradient(135deg, var(--brand), var(--brand-2))" }}>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Put your projects on autopilot today</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/85">Free for teams up to 5. Your AI project manager is ready in 60 seconds.</p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold transition hover:scale-[1.02]" style={{ color: "var(--brand)" }}>
            <Sparkles size={15} /> Start Free
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line" style={{ background: "var(--surface)" }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-ink-2">The AI-first project management platform.</p>
          </div>
          {[
            { h: "Product", links: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"] },
            { h: "Company", links: ["About", "Blog", "Careers", "Customers", "Contact"] },
            { h: "Resources", links: ["Docs", "API Reference", "Security", "Status", "Migrate from Jira"] },
          ].map((c) => (
            <div key={c.h}>
              <p className="text-sm font-semibold">{c.h}</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-2">
                {c.links.map((l) => <li key={l}><a href="#" className="hover:text-ink">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-line py-5 text-center text-xs text-ink-3">
          © 2026 FlowPilot, Inc. · Privacy · Terms · SOC 2 Type II
        </div>
      </footer>
    </div>
  );
}
