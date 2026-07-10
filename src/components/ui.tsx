import { riskMeta, priorityMeta, statusMeta, type RiskLevel, type Priority, type Status, type Member } from "@/lib/data";

export function Card({ children, className = "", title, action }: { children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode }) {
  return (
    <section className={`card p-5 ${className}`}>
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between gap-2">
          {title && <h3 className="text-sm font-semibold text-ink-2 tracking-wide">{title}</h3>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const m = riskMeta[level];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: m.soft, color: m.color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
      {m.label}
    </span>
  );
}

export function PriorityBadge({ p }: { p: Priority }) {
  const m = priorityMeta[p];
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold" style={{ background: m.soft, color: m.color }}>
      {m.label}
    </span>
  );
}

export function StatusPill({ s }: { s: Status }) {
  const m = statusMeta[s];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-2">
      <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
      {m.label}
    </span>
  );
}

export function Avatar({ member, size = 28 }: { member: Member; size?: number }) {
  return (
    <span
      title={member.name}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-surface"
      style={{ width: size, height: size, background: member.color, fontSize: size * 0.36 }}
    >
      {member.initials}
    </span>
  );
}

export function AvatarStack({ people, size = 26 }: { people: Member[]; size?: number }) {
  return (
    <span className="flex -space-x-2">
      {people.map((m) => (
        <Avatar key={m.id} member={m} size={size} />
      ))}
    </span>
  );
}

export function Progress({ value, color = "var(--brand)" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

export function Stat({ label, value, sub, subColor }: { label: string; value: React.ReactNode; sub?: string; subColor?: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-ink-3">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight tabular">{value}</p>
      {sub && (
        <p className="mt-0.5 text-xs font-medium" style={{ color: subColor ?? "var(--ink-3)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}
