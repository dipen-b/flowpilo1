import { Sparkles, Download } from "lucide-react";
import { Card, Stat, RiskBadge, Progress } from "@/components/ui";
import { VelocityBars, Sparkline, HealthRing } from "@/components/charts";
import { projects, velocity, riskMeta } from "@/lib/data";

export default function Analytics() {
  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="float-up flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-ink-2">Executive visibility across the portfolio · updated live</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost px-4 py-2 text-sm"><Download size={14} /> Export</button>
          <button className="btn-primary px-4 py-2 text-sm"><Sparkles size={14} /> CEO summary</button>
        </div>
      </div>

      {/* AI executive summary */}
      <Card className="float-up">
        <p className="text-sm font-semibold" style={{ color: "var(--brand)" }}>✨ AI Executive Summary — week of Jul 7</p>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-ink-2">
          Portfolio health is <span className="font-semibold text-ink">72/100</span>, down 4 points week-over-week, driven entirely by the Data Platform
          Migration. The Banking release remains on track for <span className="font-semibold text-ink">Aug 25 (87% confidence)</span> and the AI Chatbot
          will ship <span className="font-semibold text-ink">1 day early</span>. Biggest lever this week: rebalancing the Data team — applying the
          AI plan recovers an estimated <span className="font-semibold text-ink">9 of the 17 predicted slip days</span>. Budget burn is 4% under plan.
        </p>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Card title="Portfolio Health" className="float-up">
          <div className="flex justify-center"><HealthRing value={72} size={110} label="of 100" /></div>
        </Card>
        <Card title="Delivery Forecast" className="float-up">
          <Stat label="Releases next 60 days" value="3 of 4" sub="on or ahead of schedule" subColor="var(--good)" />
          <div className="mt-3"><Sparkline data={[2, 2, 3, 3, 3, 3]} color="var(--series-2)" width={180} height={36} /></div>
        </Card>
        <Card title="Budget Tracking" className="float-up">
          <Stat label="Q3 burn vs plan" value="96%" sub="$412k of $430k planned" subColor="var(--good)" />
          <div className="mt-3"><Progress value={96} color="var(--series-1)" /></div>
        </Card>
        <Card title="Risk Assessment" className="float-up">
          <Stat label="Open risks" value="3" sub="1 critical · 2 warning" subColor="var(--critical)" />
          <p className="mt-3 text-xs leading-relaxed text-ink-2">Highest exposure: Data Platform dependency on single engineer.</p>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="Team velocity — trailing 5 sprints"><VelocityBars data={velocity} /></Card>
        <Card title="Success probability by project">
          <ul className="space-y-4">
            {projects.map((p) => (
              <li key={p.id}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{p.emoji} {p.name}</span>
                  <div className="flex items-center gap-2.5">
                    <RiskBadge level={p.risk} />
                    <span className="w-10 text-right text-sm font-bold tabular">{p.prediction.confidence}%</span>
                  </div>
                </div>
                <div className="mt-2"><Progress value={p.prediction.confidence} color={riskMeta[p.risk].color} /></div>
                <p className="mt-1.5 text-xs text-ink-3">Forecast {p.prediction.date} · {p.prediction.delta} vs plan</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
