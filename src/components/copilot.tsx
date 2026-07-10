"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Send, X, Mic, Paperclip } from "lucide-react";

interface Msg {
  role: "user" | "ai";
  text: string;
  items?: string[];
}

const QUICK_PROMPTS = [
  "Create a mobile banking app project",
  "Generate sprint plan for next 2 weeks",
  "What is blocking our release?",
  "Summarize all open issues",
  "Create release notes",
];

function respond(prompt: string): Msg {
  const p = prompt.toLowerCase();
  if (p.includes("banking") || p.includes("create a") || p.includes("new project")) {
    return {
      role: "ai",
      text: "Done — I've set up the Mobile Banking App project with 4 epics, 23 stories, and a 12-week timeline based on your team's velocity:",
      items: [
        "🏗️ Epic: Onboarding & KYC — 6 stories, est. 3 weeks",
        "🔐 Epic: Auth & Biometric Login — 5 stories, est. 2 weeks",
        "💸 Epic: Payments & Transfers — 8 stories, est. 4 weeks",
        "📊 Epic: Insights & Statements — 4 stories, est. 2 weeks",
        "✅ Assigned owners by skill & capacity · Sprint 1 pre-planned",
      ],
    };
  }
  if (p.includes("sprint plan") || p.includes("plan sprint")) {
    return {
      role: "ai",
      text: "Here's my Sprint 15 draft (Jul 14 – Jul 25), sized to your 5-sprint average velocity of 35 points:",
      items: [
        "🎯 Goal: Ship KYC flow + close Portal design debt",
        "📦 12 items · 34 points · 86% capacity (buffer for review)",
        "⚖️ Rohan's load reduced to 82% — 2 tasks moved to Aarav",
        "⚠️ BANK-151 scheduled after its blocker BANK-149",
        "Tap 'Apply' and I'll create the sprint and notify the team.",
      ],
    };
  }
  if (p.includes("block")) {
    return {
      role: "ai",
      text: "I found 3 blockers on the critical path to your release:",
      items: [
        "🔴 DATA-45 — 29% over estimate, owner over capacity (6 days stale)",
        "🟠 PORT-91 — design review overdue, blocking 5 frontend tasks",
        "🟠 BANK-149 — API contract unconfirmed, blocks KYC epic",
        "💡 Fastest unblock: escalate PORT-91 today — it frees the most work.",
      ],
    };
  }
  if (p.includes("summar")) {
    return {
      role: "ai",
      text: "Summary of 27 open issues across 4 projects:",
      items: [
        "🏦 Banking (11): on track, biometric login is this week's focus",
        "🧭 Portal (8): at risk — review bottleneck, velocity down 18%",
        "🗄️ Data (5): critical — predicted 17 days late at current pace",
        "🤖 Chatbot (3): ahead — RC ready Friday, 94% confidence",
      ],
    };
  }
  if (p.includes("release note")) {
    return {
      role: "ai",
      text: "Release notes drafted for v2.4.0 from 18 merged PRs and closed issues:",
      items: [
        "✨ New: biometric login, transaction filters, payment alerts",
        "🛠️ Improved: transfer API rate limiting, 2.1s faster cold start",
        "🐛 Fixed: 7 bugs including duplicate statement rows",
        "📄 Full document saved to Docs Hub → Release Notes",
      ],
    };
  }
  return {
    role: "ai",
    text: "I can create projects, epics and tasks, plan sprints, find blockers, predict delivery dates, and generate reports or docs. Try one of the quick prompts below, or just describe what you need in plain English.",
  };
}

export function Copilot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi! I'm your AI Project Manager. I've already reviewed today's activity — 1 critical risk and 4 recommendations are waiting on your dashboard. What should we do first?" },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, thinking, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMsgs((m) => [...m, respond(text)]);
      setThinking(false);
    }, 900);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI Copilot"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
        style={{ background: "linear-gradient(135deg, var(--brand), var(--brand-2))", boxShadow: "0 8px 30px rgba(99,102,241,0.5)" }}
      >
        <Sparkles size={24} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-5 z-50 flex w-[min(420px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
            style={{ height: "min(600px, calc(100vh - 8rem))", boxShadow: "var(--shadow-lg)" }}
            role="dialog"
            aria-label="FlowPilot AI Copilot"
          >
            <header className="flex items-center justify-between border-b border-line px-4 py-3" style={{ background: "linear-gradient(135deg, var(--brand-soft), transparent)" }}>
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: "linear-gradient(135deg, var(--brand), var(--brand-2))" }}>
                  <Sparkles size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight">FlowPilot Copilot</p>
                  <p className="text-[11px] text-ink-3">
                    <span className="pulse-dot mr-1 inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--good)" }} />
                    Watching 4 projects
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2" aria-label="Close">
                <X size={16} />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[88%] ${m.role === "user" ? "ml-auto" : ""}`}>
                  <div className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.role === "user" ? "rounded-br-md text-white" : "rounded-bl-md bg-surface-2"
                  }`}
                    style={m.role === "user" ? { background: "linear-gradient(135deg, var(--brand), var(--brand-2))" } : undefined}>
                    {m.text}
                    {m.items && (
                      <ul className="mt-2 space-y-1.5 border-t border-line pt-2">
                        {m.items.map((it, j) => (
                          <li key={j} className="text-[12.5px] text-ink-2">{it}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
              {thinking && (
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-surface-2 px-4 py-3 w-fit">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-ink-3"
                      animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.18 }} />
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="border-t border-line p-3">
              <div className="hide-scrollbar mb-2 flex gap-1.5 overflow-x-auto">
                {QUICK_PROMPTS.map((q) => (
                  <button key={q} onClick={() => send(q)}
                    className="shrink-0 rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-medium text-ink-2 transition hover:border-line-strong hover:text-ink">
                    {q}
                  </button>
                ))}
              </div>
              <form
                className="flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-3 py-2"
                onSubmit={(e) => { e.preventDefault(); send(input); }}
              >
                <button type="button" className="text-ink-3 hover:text-ink" aria-label="Attach file"><Paperclip size={15} /></button>
                <button type="button" className="text-ink-3 hover:text-ink" aria-label="Voice to ticket"><Mic size={15} /></button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything, or describe work to create…"
                  className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-ink-3"
                />
                <button type="submit" aria-label="Send"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
                  style={{ background: "linear-gradient(135deg, var(--brand), var(--brand-2))" }}>
                  <Send size={13} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
