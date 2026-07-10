"use client";

import { useState } from "react";

/* Pure-SVG charts, styled with the validated series tokens.
   Single-series charts are titled by their card; multi-series get a legend + direct labels. */

export function HealthRing({ value, size = 120, label }: { value: number; size?: number; label?: string }) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const color = value >= 70 ? "var(--good)" : value >= 45 ? "var(--warn)" : "var(--critical)";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label ?? "Score"}: ${value} of 100`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--grid)" strokeWidth={8} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * c} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-bold tabular" style={{ color }}>{value}</p>
        {label && <p className="text-[10px] font-medium text-ink-3">{label}</p>}
      </div>
    </div>
  );
}

export function Sparkline({ data, color = "var(--series-1)", width = 120, height = 36 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - 4 - ((v - min) / (max - min || 1)) * (height - 8)}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Burndown({ days, ideal, actual }: { days: string[]; ideal: number[]; actual: (number | null)[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 560, H = 220, PL = 34, PB = 26, PT = 14, PR = 12;
  const max = Math.max(...ideal);
  const x = (i: number) => PL + (i / (days.length - 1)) * (W - PL - PR);
  const y = (v: number) => PT + (1 - v / max) * (H - PT - PB);
  const line = (vals: (number | null)[]) =>
    vals.map((v, i) => (v == null ? null : `${x(i)},${y(v)}`)).filter(Boolean).join(" ");
  const lastActual = actual.reduce<number>((acc, v, i) => (v != null ? i : acc), 0);
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Sprint burndown: ideal versus actual remaining points">
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1={PL} x2={W - PR} y1={y(max * f)} y2={y(max * f)} stroke="var(--grid)" strokeWidth={1} />
            <text x={PL - 6} y={y(max * f) + 3} textAnchor="end" fontSize={9} fill="var(--ink-3)" className="tabular">{Math.round(max * f)}</text>
          </g>
        ))}
        {days.map((d, i) => (
          <text key={d + i} x={x(i)} y={H - 8} textAnchor="middle" fontSize={9} fill="var(--ink-3)">{d}</text>
        ))}
        <polyline points={line(ideal)} fill="none" stroke="var(--ink-3)" strokeWidth={2} strokeDasharray="4 4" />
        <polyline points={line(actual)} fill="none" stroke="var(--series-1)" strokeWidth={2} strokeLinecap="round" />
        <circle cx={x(lastActual)} cy={y(actual[lastActual]!)} r={4} fill="var(--series-1)" stroke="var(--surface)" strokeWidth={2} />
        <text x={x(lastActual) + 8} y={y(actual[lastActual]!) - 6} fontSize={10} fontWeight={600} fill="var(--ink-2)" className="tabular">
          {actual[lastActual]} pts left
        </text>
        {days.map((_, i) => (
          <rect key={i} x={x(i) - 28} y={0} width={56} height={H - PB} fill="transparent"
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
        ))}
        {hover != null && (
          <line x1={x(hover)} x2={x(hover)} y1={PT} y2={H - PB} stroke="var(--border-strong)" strokeWidth={1} />
        )}
      </svg>
      {hover != null && (
        <div className="pointer-events-none absolute rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-lg"
          style={{ left: `${(x(hover) / W) * 100}%`, top: 0, transform: "translateX(-50%)" }}>
          <p className="font-semibold">{days[hover]}</p>
          <p className="text-ink-2">Ideal: <span className="tabular font-medium">{ideal[hover]}</span></p>
          <p style={{ color: "var(--series-1)" }}>Actual: <span className="tabular font-medium">{actual[hover] ?? "—"}</span></p>
        </div>
      )}
      <div className="mt-2 flex gap-4 text-xs text-ink-2">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-0.5 w-4 rounded" style={{ background: "var(--series-1)" }} /> Actual</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-0.5 w-4 rounded border-b border-dashed" style={{ borderColor: "var(--ink-3)" }} /> Ideal</span>
      </div>
    </div>
  );
}

export function VelocityBars({ data }: { data: { sprint: string; committed: number; completed: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 560, H = 200, PL = 30, PB = 24, PT = 12, PR = 8;
  const max = Math.max(...data.map((d) => d.committed)) * 1.1;
  const band = (W - PL - PR) / data.length;
  const y = (v: number) => PT + (1 - v / max) * (H - PT - PB);
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Velocity: committed versus completed points per sprint">
        {[0, 0.5, 1].map((f) => (
          <line key={f} x1={PL} x2={W - PR} y1={y(max * f)} y2={y(max * f)} stroke="var(--grid)" strokeWidth={1} />
        ))}
        {data.map((d, i) => {
          const cx = PL + band * i + band / 2;
          const bw = Math.min(22, band / 3.2);
          return (
            <g key={d.sprint} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={cx - bw - 1} y={y(d.committed)} width={bw} height={H - PB - y(d.committed)} rx={4} fill="var(--series-4)" opacity={hover === null || hover === i ? 1 : 0.45} />
              <rect x={cx + 1} y={y(d.completed)} width={bw} height={H - PB - y(d.completed)} rx={4} fill="var(--series-2)" opacity={hover === null || hover === i ? 1 : 0.45} />
              <text x={cx + 1 + bw / 2} y={y(d.completed) - 4} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--ink-2)" className="tabular">{d.completed}</text>
              <text x={cx} y={H - 7} textAnchor="middle" fontSize={10} fill="var(--ink-3)">{d.sprint}</text>
              <rect x={PL + band * i} y={0} width={band} height={H - PB} fill="transparent" />
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex gap-4 text-xs text-ink-2">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "var(--series-4)" }} /> Committed</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "var(--series-2)" }} /> Completed</span>
      </div>
    </div>
  );
}

/* Sequential single-hue (blue) ramp for the workload heatmap */
const heatRamp = ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95"];
const heatRampDark = ["#0d366b", "#104281", "#184f95", "#256abf", "#3987e5", "#6da7ec"];

export function WorkloadHeatmap({ rows }: { rows: { name: string; days: number[]; over: boolean }[] }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const max = 11;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs" aria-label="Hours logged per member per weekday">
        <thead>
          <tr>
            <th className="pb-2 text-left font-medium text-ink-3">Member</th>
            {days.map((d) => (
              <th key={d} className="pb-2 text-center font-medium text-ink-3">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td className="py-1 pr-3 font-medium whitespace-nowrap">
                {r.name.split(" ")[0]}
                {r.over && <span className="ml-1.5 rounded px-1 text-[10px] font-semibold" style={{ background: "var(--critical-soft)", color: "var(--critical)" }}>over</span>}
              </td>
              {r.days.map((h, i) => {
                const idx = Math.min(heatRamp.length - 1, Math.floor((h / max) * heatRamp.length));
                return (
                  <td key={i} className="p-0.5">
                    <div
                      title={`${h}h`}
                      className="mx-auto flex h-7 w-full min-w-9 items-center justify-center rounded-md font-semibold tabular text-white dark:hidden"
                      style={{ background: heatRamp[idx], color: idx < 2 ? "var(--ink)" : "#fff" }}
                    >
                      {h}
                    </div>
                    <div
                      title={`${h}h`}
                      className="mx-auto hidden h-7 w-full min-w-9 items-center justify-center rounded-md font-semibold tabular dark:flex"
                      style={{ background: heatRampDark[idx], color: idx < 2 ? "#fff" : "#fff" }}
                    >
                      {h}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
