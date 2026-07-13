import { Timer, CheckCircle2 } from "lucide-react";
import { PlanSprintButton } from "@/components/plan-sprint-button";
import { Card, PriorityBadge, Progress, Stat, Avatar } from "@/components/ui";
import { Burndown, VelocityBars } from "@/components/charts";
import { burndown, velocity, type Priority } from "@/lib/data";
import { getActiveSprint } from "@/lib/queries";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const RETRO = [
  { k: "went-well", title: "What went well", color: "var(--good)", items: ["Velocity hit 41/42 pts — best sprint this quarter", "PR-linked status updates saved ~4h of ticket admin", "Zero carry-over bugs from Sprint 12"] },
  { k: "improve", title: "What to improve", color: "var(--warn)", items: ["Design reviews queued 2+ days (main bottleneck)", "Estimates on data tasks ran 25% low", "Two tasks lacked acceptance criteria at start"] },
  { k: "actions", title: "Action items", color: "var(--brand)", items: ["Add a daily 30-min design review slot (owner: Priya)", "Apply 1.25x multiplier to data-pipeline estimates", "Require acceptance criteria before sprint entry"] },
];

export default async function Sprints() {
  const session = await getSessionUser();
  if (!session) return <div>Unauthorized</div>;
  const sprint = await getActiveSprint(session.orgId);
  const items = sprint?.items ?? [];
  const doneCount = items.filter((t) => t.status === "done").length;
  const reviewCount = items.filter((t) => t.status === "in_review").length;

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="float-up flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sprints</h1>
          <p className="mt-1 text-sm text-ink-2">
            {sprint
              ? `${sprint.name} · ${sprint.startDate} – ${sprint.endDate} · ${sprint.projectName}`
              : "No active sprint — plan one below"}
          </p>
        </div>
        <PlanSprintButton />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Card className="float-up">
          <Stat label="Sprint progress" value={sprint ? `${sprint.progress}%` : "—"}
            sub={sprint ? `${sprint.donePoints} of ${sprint.totalPoints} pts done` : ""} />
          <div className="mt-3"><Progress value={sprint?.progress ?? 0} /></div>
        </Card>
        <Card className="float-up">
          <Stat label="Scope completed" value={`${doneCount} / ${items.length}`}
            sub={`items done · ${reviewCount} in review`} subColor="var(--good)" />
        </Card>
        <Card className="float-up">
          <Stat label="Capacity used" value="86%" sub="Healthy buffer this sprint" subColor="var(--good)" />
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title={`Burndown — ${sprint?.name ?? "Sprint"}`}><Burndown {...burndown} /></Card>
        <Card title="Velocity — last 5 sprints"><VelocityBars data={velocity} /></Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card title="Sprint Backlog" className="xl:col-span-2">
          {items.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-3">No items in the active sprint.</p>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  {t.status === "done"
                    ? <CheckCircle2 size={16} style={{ color: "var(--good)" }} />
                    : <Timer size={16} className="text-ink-3" />}
                  <span className="text-xs font-semibold text-ink-3 tabular">{t.key}</span>
                  <span className={`min-w-0 flex-1 truncate text-sm font-medium ${t.status === "done" ? "line-through opacity-60" : ""}`}>{t.title}</span>
                  <PriorityBadge p={t.priority as Priority} />
                  <span className="text-xs text-ink-3 tabular">{t.estimate}pt</span>
                  {t.assignee && <Avatar member={t.assignee} size={24} />}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Next Sprint — Planning">
          <div className="rounded-xl border border-line p-3.5 text-[13px] leading-relaxed">
            <p className="font-semibold">Goal: {sprint?.goal || "Set a goal for the next sprint"}</p>
            <ul className="mt-2 space-y-1.5 text-ink-2">
              <li>· Pull items from the backlog by priority</li>
              <li>· Match total points to team velocity (~35)</li>
              <li>· Keep every member at or under capacity</li>
              <li>· Leave 2 buffer slots for review findings</li>
            </ul>
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
