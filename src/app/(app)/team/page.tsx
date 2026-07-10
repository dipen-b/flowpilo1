import { UserPlus } from "lucide-react";
import { Card, Avatar, Progress, RiskBadge, Stat } from "@/components/ui";
import { Sparkline } from "@/components/charts";
import { members } from "@/lib/data";

const trends: Record<string, number[]> = {
  u1: [88, 90, 91, 89, 93, 92], u2: [90, 89, 87, 88, 86, 88], u3: [86, 84, 82, 79, 76, 74],
  u4: [91, 92, 94, 93, 95, 95], u5: [80, 82, 79, 83, 82, 81], u6: [84, 85, 85, 87, 86, 86],
};

export default function Team() {
  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="float-up flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="mt-1 text-sm text-ink-2">Product Engineering · 6 members · 2 departments</p>
        </div>
        <button className="btn-primary px-4 py-2 text-sm"><UserPlus size={14} /> Invite member</button>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Card className="float-up"><Stat label="Avg productivity" value="86" sub="↑ 3 pts this month" subColor="var(--good)" /></Card>
        <Card className="float-up"><Stat label="Utilization" value="93%" sub="Target band: 75–90%" subColor="var(--warn)" /></Card>
        <Card className="float-up"><Stat label="Over capacity" value="1" sub="Rohan Patel · 128%" subColor="var(--critical)" /></Card>
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
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {members.map((m) => {
              const pct = Math.round((m.load / m.capacity) * 100);
              return (
                <tr key={m.id} className="transition hover:bg-surface-2">
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-2.5">
                      <Avatar member={m} size={30} />
                      <span className="font-semibold">{m.name}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-ink-2">{m.role}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-28"><Progress value={Math.min(100, pct)} color={pct > 100 ? "var(--critical)" : pct > 90 ? "var(--warn)" : "var(--good)"} /></div>
                      <span className="text-xs tabular" style={pct > 100 ? { color: "var(--critical)", fontWeight: 600 } : undefined}>
                        {m.load}h / {m.capacity}h
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><Sparkline data={trends[m.id]} color={m.productivity >= 85 ? "var(--series-2)" : "var(--series-3)"} width={110} height={30} /></td>
                  <td className="px-5 py-3.5"><RiskBadge level={m.burnoutRisk} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
