import Link from "next/link";
import { NewProjectButton } from "@/components/new-project-button";
import { Card, RiskBadge, Progress, AvatarStack } from "@/components/ui";
import { riskMeta, type Member } from "@/lib/data";
import { getProjects } from "@/lib/queries";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Projects() {
  const session = await getSessionUser();
  if (!session) return <div>Unauthorized</div>;
  const projects = await getProjects(session.orgId);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="float-up flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-ink-2">{projects.length} active projects</p>
        </div>
        <NewProjectButton />
      </div>

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
              <p className="mt-3 text-[13px] leading-relaxed text-ink-2">{p.summary}</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1"><Progress value={p.progress} color={riskMeta[p.risk as keyof typeof riskMeta].color} /></div>
                <span className="text-xs font-semibold tabular">{p.progress}%</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <AvatarStack people={p.members as unknown as Member[]} />
                <div className="text-right text-xs text-ink-3">
                  <p className="tabular">{p.openTasks} open tasks</p>
                  <p className="mt-0.5">Due <span className="font-semibold text-ink">{p.dueDate}</span></p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
