"use client";

import { useState } from "react";
import { FileText, Rocket, ClipboardList, BookOpen, PieChart, Briefcase, Plus } from "lucide-react";
import { Card } from "@/components/ui";

const TEMPLATES = [
  { icon: Rocket, title: "Release Notes", desc: "Changelog for a version" },
  { icon: BookOpen, title: "Technical Spec", desc: "Design doc / ADR" },
  { icon: ClipboardList, title: "User Stories", desc: "Requirements & acceptance criteria" },
  { icon: PieChart, title: "Sprint Report", desc: "Velocity, scope, carry-over" },
  { icon: FileText, title: "Project Report", desc: "Status, risks, next steps" },
  { icon: Briefcase, title: "Meeting Notes", desc: "Decisions & action items" },
];

const RECENT = [
  { title: "Release Notes — Banking v2.4.0", when: "Today, 09:12", by: "Aarav Shah" },
  { title: "Sprint 13 Retrospective", when: "Yesterday", by: "Nisha Rao" },
  { title: "Q3 Portfolio Report", when: "Jul 07", by: "Priya Mehta" },
  { title: "Data Migration Runbook", when: "Jul 04", by: "Rohan Patel" },
];

export default function Docs() {
  const [created, setCreated] = useState<string[]>([]);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="float-up flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Docs</h1>
          <p className="mt-1 text-sm text-ink-2">Keep specs, release notes, and reports next to the work they describe</p>
        </div>
        </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-ink-2">Start from a template</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="float-up">
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
                  <Icon size={17} />
                </span>
              </div>
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-[13px] text-ink-2">{desc}</p>
              <button
                onClick={() => setCreated((d) => (d.includes(title) ? d : [...d, title]))}
                className="btn-ghost mt-4 w-full px-3 py-2 text-xs">
                {created.includes(title) ? "✓ Created — open" : "Use template"}
              </button>
            </Card>
          ))}
        </div>
      </div>

      <Card title="Recent documents">
        <ul className="divide-y divide-line">
          {[...created.map((t) => ({ title: t, when: "Just now", by: "You" })), ...RECENT].map((d, i) => (
            <li key={d.title + i} className="flex flex-wrap items-center gap-3 py-3">
              <FileText size={15} className="text-ink-3" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{d.title}</span>
              <span className="text-xs text-ink-3">{d.by}</span>
              <span className="w-24 text-right text-xs text-ink-3">{d.when}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
