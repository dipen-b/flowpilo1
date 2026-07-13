import Link from "next/link";
import { AlertTriangle, FolderKanban } from "lucide-react";
import { Card, RiskBadge, PriorityBadge, Progress, Stat, Avatar } from "@/components/ui";
import { HealthRing, Sparkline, Burndown, WorkloadHeatmap } from "@/components/charts";
import { MyTiming } from "@/components/my-timing";
import { burndown, riskMeta, type RiskLevel, type Priority } from "@/lib/data";
import { getDashboard, getTasks, getActiveSprint } from "@/lib/queries";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

function spreadLoad(load: number): number[] {
  const base = Math.floor(load / 5);
  const rem = load % 5;
  return Array.from({ length: 5 }, (_, i) => base + (i < rem ? 1 : 0));
}

export default async function Dashboard() {
  const session = await getSessionUser();
  if (!session) {
    return <div>Unauthorized</div>;
  }
  const [{ projects, members, risks, activity, healthAvg }, tasks, sprint] = await Promise.all([
    getDashboard(session.orgId),
    getTasks(session.orgId),
    getActiveSprint(session.orgId),
  ]);
  const firstName = session.user.name.split(" ")[0] ?? "there";

  const focus = tasks.filter((t) => ["urgent", "high"].includes(t.priority) && t.status !== "done").slice(0, 4);
  const deadlines = tasks.filter((t) => t.status !== "done").slice(0, 5);
  const onTrack = projects.filter((p) => p.risk === "good").length;
  const atRisk = projects.filter((p) => p.risk === "warning").length;
  const critical = projects.filter((p) => ["critical", "serious"].includes(p.risk)).length;
  const donePts = sprint?.donePoints ?? 0;
  const totalPts = sprint?.totalPoints ?? 0;

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* Greeting */}
      <div className="float-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Good morning, {firstName} 👋</h1>
          <p className="mt-1 text-sm text-ink-2">
            Thursday, Jul 10 · {projects.length} active projects · {critical + atRisk} need attention
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/projects" className="btn-primary px-4 py-2 text-sm"><FolderKanban size={14} /> Go to projects</Link>
        </div>
      </div>

      {/* My Timing Widget */}
      <div className="float-up">
        <MyTiming />
      </div>

      {/* Score row */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Card title="Project Health" className="float-up">
          <div className="flex items-center gap-4">
            <HealthRing value={healthAvg} size={104} label="of 100" />
            <div className="space-y-1.5 text-xs text-ink-2">
              <p><span className="font-semibold" style={{ color: "var(--good)" }}>{onTrack} projects</span> on track</p>
              <p><span className="font-semibold" style={{ color: "var(--warn)" }}>{atRisk} project{atRisk === 1 ? "" : "s"}</span> at risk</p>
              <p><span className="font-semibold" style={{ color: "var(--critical)" }}>{critical} project{critical === 1 ? "" : "s"}</span> critical</p>
            </div>
          </div>
        </Card>
        <Card title="Open Work" className="float-up">
          <Stat label="Tasks in flight" value={tasks.filter((t) => t.status !== "done").length}
            sub={`${tasks.filter((t) => t.status === "in_review").length} in review`} subColor="var(--good)" />
          <div className="mt-3"><Sparkline data={[24, 28, 26, 31, 29, 36, 41]} color="var(--series-2)" width={200} height={40} /></div>
        </Card>
        <Card title="Sprint Progress" className="float-up">
          <Stat
            label={sprint ? `${sprint.name} · ends ${sprint.endDate}` : "No active sprint"}
            value={sprint ? `${sprint.progress}%` : "—"}
            sub={sprint ? `${donePts} of ${totalPts} points done` : "Plan one from the Sprints page"}
          />
          <div className="mt-3"><Progress value={sprint?.progress ?? 0} /></div>
        </Card>
        <Card title="Next Deadline" className="float-up">
          <Stat label={projects[0]?.name ?? ""} value={projects[0]?.dueDate ?? "—"}
            sub={`${projects[0]?.progress ?? 0}% complete`} subColor="var(--good)" />
          <div className="mt-3"><Sparkline data={[40, 45, 52, 58, 61, 65, 68]} color="var(--series-1)" width={200} height={40} /></div>
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          {/* Alerts */}
          <Card title="Alerts" action={<span className="text-xs font-medium text-ink-3">from deadlines & capacity</span>}>
            <ul className="space-y-3">
              {risks.map((r) => (
                <li key={r.id} className="flex flex-wrap items-start gap-3 rounded-xl border border-line p-3.5">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" style={{ color: riskMeta[r.level as RiskLevel].color }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{r.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-2">{r.detail}</p>
                  </div>
                  {r.projectId && (
                    <Link href={`/projects/${r.projectId}`} className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:opacity-80"
                      style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
                      {r.action}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </Card>

          {/* Focus tasks */}
          <Card title="What needs you today" action={<Link href="/projects" className="text-xs font-semibold" style={{ color: "var(--brand)" }}>All tasks →</Link>}>
            <ul className="divide-y divide-line">
              {focus.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  <PriorityBadge p={t.priority as Priority} />
                  <span className="text-xs font-medium text-ink-3 tabular">{t.key}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{t.title}</span>
                  {t.aiFlag && <span className="hidden text-[11px] text-ink-3 md:inline">{t.aiFlag}</span>}
                  {t.assignee && <Avatar member={t.assignee} size={24} />}
                  <span className="w-12 text-right text-xs text-ink-3 tabular">{t.due}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Sprint burndown */}
          <Card title={`${sprint?.name ?? "Sprint"} Burndown`} action={<Link href="/sprints" className="text-xs font-semibold" style={{ color: "var(--brand)" }}>Sprint room →</Link>}>
            <Burndown {...burndown} />
          </Card>

          {/* Workload heatmap */}
          <Card title="Workload Heatmap" action={<span className="text-xs text-ink-3">hours/day this week</span>}>
            <WorkloadHeatmap rows={members.map((m) => ({ name: m.name, days: spreadLoad(m.load), over: m.load > m.capacity }))} />
          </Card>
        </div>

        <div className="space-y-5">
          {/* Active projects */}
          <Card title="Active Projects" action={<Link href="/projects" className="text-xs font-semibold" style={{ color: "var(--brand)" }}>View all →</Link>}>
            <ul className="space-y-4">
              {projects.map((p) => (
                <li key={p.id}>
                  <Link href={`/projects/${p.id}`} className="block rounded-xl border border-line p-3.5 transition hover:border-line-strong hover:shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold">{p.emoji} {p.name}</span>
                      <RiskBadge level={p.risk as RiskLevel} />
                    </div>
                    <div className="mt-2.5 flex items-center gap-3">
                      <div className="flex-1"><Progress value={p.progress} color={riskMeta[p.risk as RiskLevel].color} /></div>
                      <span className="text-xs font-medium text-ink-3 tabular">{p.progress}%</span>
                    </div>
                    <p className="mt-2 text-[11px] text-ink-3">Due {p.dueDate} · {p.openTasks} open tasks</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          {/* Upcoming deadlines */}
          <Card title="Upcoming Deadlines">
            <ul className="space-y-2.5">
              {deadlines.map((t) => (
                <li key={t.id} className="flex items-center gap-2.5 text-sm">
                  <span className="w-12 shrink-0 text-xs font-semibold text-ink-3 tabular">{t.due}</span>
                  <span className="min-w-0 flex-1 truncate">{t.title}</span>
                  {t.assignee && <Avatar member={t.assignee} size={20} />}
                </li>
              ))}
            </ul>
          </Card>

          {/* Activity feed */}
          <Card title="Team Activity">
            <ul className="space-y-3">
              {activity.map((f) => (
                <li key={f.id} className="flex gap-2.5 text-[13px] leading-snug">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--ink-3)" }} />
                  <p className="text-ink-2">
                    <span className="font-semibold text-ink">{f.who}</span> {f.what}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
