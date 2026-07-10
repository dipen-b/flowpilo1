import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { Card, RiskBadge, Progress, AvatarStack } from "@/components/ui";
import { riskMeta, type Member } from "@/lib/data";
import { getProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Projects() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="float-up flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-ink-2">{projects.length} active · AI is watching all of them · <span style={{ color: "var(--good)" }}>live from database</span></p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost px-4 py-2 text-sm"><Plus size={14} /> Blank project</button>
          <button className="btn-primary px-4 py-2 text-sm"><Sparkles size={14} /> Create with AI</button>
        </div>
      </div>

      <Card className="float-up border-dashed">
        <div className="flex flex-wrap items-center gap-3">
          <Sparkles size={16} style={{ color: "var(--brand)" }} />
          <p className="flex-1 text-sm text-ink-2">
            <span className="font-semibold text-ink">Describe a project and AI builds it</span> — epics, stories, estimates, owners and timeline in ~20 seconds.
          </p>
          <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm text-ink-3">
            e.g. “Launch a customer referral program by September”
          </div>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => (
          <Link key={p.id} href={`/projects/${p.id}`} className="float-up" style={{ animationDelay: `${i * 60}ms` }}>
            <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl text-xl" style={{ background: "var(--surface-2)" }}>{p.emoji}</span>
                  <div>
                    <h2 className="font-semibold">{p.name}</h2>
                    <p className="text-xs text-ink-3">{p.key} · due {p.dueDate}</p>
                  </div>
                </div>
                <RiskBadge level={p.risk as keyof typeof riskMeta} />
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
                <span className="font-semibold" style={{ color: "var(--brand)" }}>✨ AI:</span> {p.summary}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1"><Progress value={p.progress} color={riskMeta[p.risk as keyof typeof riskMeta].color} /></div>
                <span className="text-xs font-semibold tabular">{p.progress}%</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <AvatarStack people={p.members as unknown as Member[]} />
                <div className="text-right text-xs text-ink-3">
                  <p className="tabular">{p.openTasks} open tasks</p>
                  <p className="mt-0.5">Forecast <span className="font-semibold text-ink">{p.prediction.date}</span> · {p.prediction.confidence}%</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
