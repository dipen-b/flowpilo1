import { Download } from "lucide-react";
import { Card, Stat, RiskBadge, Progress } from "@/components/ui";
import { VelocityBars, Sparkline, HealthRing } from "@/components/charts";
import { velocity, riskMeta, type RiskLevel } from "@/lib/data";
import { getProjects, getInsights } from "@/lib/queries";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Analytics() {
  const session = await getSessionUser();
  if (!session) return <div>Unauthorized</div>;
  const [projects, insights] = await Promise.all([getProjects(session.orgId), getInsights(session.orgId)]);
  const healthAvg = Math.round(projects.reduce((s, p) => s + p.health, 0) / (projects.length || 1));
  const onTrack = projects.filter((p) => p.risk === "good").length;
  const criticalCount = insights.filter((i) => i.level === "critical").length;
  const warningCount = insights.filter((i) => i.level === "warning").length;
  const worst = [...projects].sort((a, b) => a.health - b.health)[0];
  const best = [...projects].sort((a, b) => b.health - a.health)[0];

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="float-up flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-ink-2">Portfolio visibility across all projects</p>
        </div>
        <a href="/api/export" download className="btn-primary px-4 py-2 text-sm"><Download size={14} /> Export CSV</a>
      </div>

      {/* Portfolio summary */}
      <Card className="float-up">
        <p className="text-sm font-semibold">Portfolio summary — week of Jul 7</p>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-ink-2">
          Portfolio health is <span className="font-semibold text-ink">{healthAvg}/100</span> across {projects.length} active projects.
          {" "}{best && <>Strongest: <span className="font-semibold text-ink">{best.name}</span> ({best.health}).</>}
          {" "}{worst && <>Needs attention: <span className="font-semibold text-ink">{worst.name}</span> ({worst.health}) — {worst.summary}</>}
        </p>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Card title="Portfolio Health" className="float-up">
          <div className="flex justify-center"><HealthRing value={healthAvg} size={110} label="of 100" /></div>
        </Card>
        <Card title="Delivery" className="float-up">
          <Stat label="Projects on schedule" value={`${onTrack} of ${projects.length}`} sub="on or ahead of plan" subColor="var(--good)" />
          <div className="mt-3"><Sparkline data={[2, 2, 3, 3, 3, 3]} color="var(--series-2)" width={180} height={36} /></div>
        </Card>
        <Card title="Budget Tracking" className="float-up">
          <Stat label="Q3 burn vs plan" value="96%" sub="$412k of $430k planned" subColor="var(--good)" />
          <div className="mt-3"><Progress value={96} color="var(--series-1)" /></div>
        </Card>
        <Card title="Open Risks" className="float-up">
          <Stat label="Tracked risks" value={insights.length} sub={`${criticalCount} critical · ${warningCount} warning`} subColor="var(--critical)" />
          <p className="mt-3 text-xs leading-relaxed text-ink-2">
            {insights[0]?.title ?? "No open risks."}
          </p>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="Team velocity — trailing 5 sprints"><VelocityBars data={velocity} /></Card>
        <Card title="On-track status by project">
          <ul className="space-y-4">
            {projects.map((p) => (
              <li key={p.id}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{p.emoji} {p.name}</span>
                  <div className="flex items-center gap-2.5">
                    <RiskBadge level={p.risk as RiskLevel} />
                    <span className="w-10 text-right text-sm font-bold tabular">{p.prediction.confidence}%</span>
                  </div>
                </div>
                <div className="mt-2"><Progress value={p.prediction.confidence} color={riskMeta[p.risk as RiskLevel].color} /></div>
                <p className="mt-1.5 text-xs text-ink-3">Due {p.dueDate} · {p.openTasks} open tasks</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
