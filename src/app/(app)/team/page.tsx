import { Card, Avatar, Progress, RiskBadge, Stat } from "@/components/ui";
import { InviteMember } from "@/components/invite-member";
import { ResetLinkButton } from "@/components/reset-link-button";
import { Sparkline } from "@/components/charts";
import { type RiskLevel } from "@/lib/data";
import { getMembers } from "@/lib/queries";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Deterministic per-member trend line (placeholder until time tracking lands). */
function trendFor(index: number): number[] {
  const bases = [
    [88, 90, 91, 89, 93, 92],
    [90, 89, 87, 88, 86, 88],
    [86, 84, 82, 79, 76, 74],
    [91, 92, 94, 93, 95, 95],
    [80, 82, 79, 83, 82, 81],
    [84, 85, 85, 87, 86, 86],
  ];
  return bases[index % bases.length];
}

export default async function Team() {
  const session = await getSessionUser();
  if (!session) return <div>Unauthorized</div>;
  const members = await getMembers(session.orgId);
  const over = members.filter((m) => m.load > m.capacity);
  const utilization = Math.round(
    (members.reduce((s, m) => s + m.load, 0) / (members.reduce((s, m) => s + m.capacity, 0) || 1)) * 100,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="float-up flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="mt-1 text-sm text-ink-2">Product Engineering · {members.length} members</p>
        </div>
        {["owner", "admin"].includes(session.user.role) && <InviteMember />}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Card className="float-up"><Stat label="Members" value={members.length} sub="across 2 departments" /></Card>
        <Card className="float-up">
          <Stat label="Utilization" value={`${utilization}%`} sub="Target band: 75–90%"
            subColor={utilization > 90 ? "var(--warn)" : "var(--good)"} />
        </Card>
        <Card className="float-up">
          <Stat label="Over capacity" value={over.length}
            sub={over.length ? over.map((m) => m.name.split(" ")[0]).join(", ") : "Everyone within capacity"}
            subColor={over.length ? "var(--critical)" : "var(--good)"} />
        </Card>
      </div>

      <Card title="Members" className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-3">
              <th className="px-5 py-3 font-medium">Member</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Workload</th>
              <th className="px-5 py-3 font-medium">Productivity trend</th>
              <th className="px-5 py-3 font-medium">Load status</th>
              {["owner", "admin"].includes(session.user.role) && <th className="px-5 py-3" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {members.map((m, i) => {
              const pct = Math.round((m.load / m.capacity) * 100);
              return (
                <tr key={m.id} className="transition hover:bg-surface-2">
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-2.5">
                      <Avatar member={m} size={30} />
                      <span className="font-semibold">{m.name}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 capitalize text-ink-2">{m.role}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-28"><Progress value={Math.min(100, pct)} color={pct > 100 ? "var(--critical)" : pct > 90 ? "var(--warn)" : "var(--good)"} /></div>
                      <span className="text-xs tabular" style={pct > 100 ? { color: "var(--critical)", fontWeight: 600 } : undefined}>
                        {m.load}h / {m.capacity}h
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><Sparkline data={trendFor(i)} color={pct <= 100 ? "var(--series-2)" : "var(--series-3)"} width={110} height={30} /></td>
                  <td className="px-5 py-3.5"><RiskBadge level={m.burnoutRisk as RiskLevel} /></td>
                  {["owner", "admin"].includes(session.user.role) && (
                    <td className="px-5 py-3.5 text-right"><ResetLinkButton userId={m.id} userName={m.name} /></td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
