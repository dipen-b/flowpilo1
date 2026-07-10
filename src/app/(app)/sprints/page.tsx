import { Plus, Timer, CheckCircle2 } from "lucide-react";
import { Card, PriorityBadge, Progress, Stat, Avatar } from "@/components/ui";
import { Burndown, VelocityBars } from "@/components/charts";
import { burndown, velocity, tasks, memberById } from "@/lib/data";

const RETRO = [
  { k: "went-well", title: "What went well", color: "var(--good)", items: ["Velocity hit 41/42 pts — best sprint this quarter", "PR-linked status updates saved ~4h of ticket admin", "Zero carry-over bugs from Sprint 12"] },
  { k: "improve", title: "What to improve", color: "var(--warn)", items: ["Design reviews queued 2+ days (main bottleneck)", "Estimates on data tasks ran 25% low", "Two tasks lacked acceptance criteria at start"] },
  { k: "actions", title: "Action items", color: "var(--brand)", items: ["Add a daily 30-min design review slot (owner: Priya)", "Apply 1.25x multiplier to data-pipeline estimates", "Require acceptance criteria before sprint entry"] },
];

export default function Sprints() {
  const sprintTasks = tasks.filter((t) => ["p1"].includes(t.project));
  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="float-up flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sprints</h1>
          <p className="mt-1 text-sm text-ink-2">Sprint 14 · Jul 7 – Jul 18 · Mobile Banking App</p>
        </div>
        <button className="btn-primary px-4 py-2 text-sm"><Plus size={14} /> Plan Sprint 15</button>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Card className="float-up"><Stat label="Sprint progress" value="62%" sub="22 of 40 pts · 4 days left" /><div className="mt-3"><Progress value={62} /></div></Card>
        <Card className="float-up"><Stat label="Scope completed" value="14 / 22" sub="items done · 3 in review" subColor="var(--good)" /></Card>
        <Card className="float-up"><Stat label="Capacity used" value="86%" sub="Healthy buffer this sprint" subColor="var(--good)" /></Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="Burndown — Sprint 14"><Burndown {...burndown} /></Card>
        <Card title="Velocity — last 5 sprints"><VelocityBars data={velocity} /></Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card title="Sprint Backlog" className="xl:col-span-2">
          <ul className="divide-y divide-line">
            {sprintTasks.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-2.5">
                {t.status === "done"
                  ? <CheckCircle2 size={16} style={{ color: "var(--good)" }} />
                  : <Timer size={16} className="text-ink-3" />}
                <span className="text-xs font-semibold text-ink-3 tabular">{t.key}</span>
                <span className={`min-w-0 flex-1 truncate text-sm font-medium ${t.status === "done" ? "line-through opacity-60" : ""}`}>{t.title}</span>
                <PriorityBadge p={t.priority} />
                <span className="text-xs text-ink-3 tabular">{t.estimate}pt</span>
                <Avatar member={memberById(t.assignee)} size={24} />
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Sprint 15 — Planning">
          <div className="rounded-xl border border-line p-3.5 text-[13px] leading-relaxed">
            <p className="font-semibold">Goal: Ship KYC + clear design debt</p>
            <ul className="mt-2 space-y-1.5 text-ink-2">
              <li>· 12 items, 34 pts (velocity avg: 35)</li>
              <li>· Rohan capped at 82% capacity</li>
              <li>· BANK-151 sequenced after its blocker</li>
              <li>· 2 buffer slots for review findings</li>
            </ul>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="btn-primary flex-1 px-3 py-2 text-xs">Start sprint</button>
            <button className="btn-ghost flex-1 px-3 py-2 text-xs">Edit plan</button>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {RETRO.map((col) => (
          <Card key={col.k} title={col.title}>
            <ul className="space-y-2.5">
              {col.items.map((it) => (
                <li key={it} className="flex gap-2 text-[13px] leading-relaxed text-ink-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: col.color }} />
                  {it}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
