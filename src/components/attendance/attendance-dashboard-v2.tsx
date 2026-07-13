"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Avatar } from "@/components/ui";
import { CalendarDays, ListTodo } from "lucide-react";

interface AttendanceUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
}

interface AttendanceRecord {
  id: string;
  userId: string;
  user: AttendanceUser;
  date: string; // YYYY-MM-DD
  status: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  workHours: number;
  notes: string;
}

interface AttendanceStats {
  isAdmin: boolean;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  lateDays: number;
  totalWorkHours: number;
  averageWorkHours: number;
  records: AttendanceRecord[];
}

export const STATUS_META: Record<string, { label: string; color: string; soft: string }> = {
  present: { label: "Present", color: "var(--good)", soft: "var(--good-soft)" },
  absent: { label: "Absent", color: "var(--critical)", soft: "var(--critical-soft)" },
  leave: { label: "Leave", color: "var(--warn)", soft: "var(--warn-soft)" },
  "half-day": { label: "Half day", color: "var(--brand)", soft: "var(--brand-soft)" },
  late: { label: "Late", color: "#f97316", soft: "rgba(249, 115, 22, 0.14)" },
};

function fmtHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function fmtTime(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

/** Month calendar for one person: days aligned to real weekdays, colored by status. */
function MonthCalendar({ month, records }: { month: string; records: AttendanceRecord[] }) {
  const [year, mon] = month.split("-").map(Number);
  const firstDay = new Date(year, mon - 1, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, mon, 0).getDate();
  const byDate = new Map(records.map((r) => [r.date, r]));

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
        <div key={i} className="pb-1 text-center text-[10px] font-semibold text-ink-3">{d}</div>
      ))}
      {Array.from({ length: firstDay }).map((_, i) => (
        <div key={`blank-${i}`} />
      ))}
      {Array.from({ length: daysInMonth }).map((_, i) => {
        const day = i + 1;
        const dateStr = `${month}-${String(day).padStart(2, "0")}`;
        const rec = byDate.get(dateStr);
        const meta = rec ? STATUS_META[rec.status] : null;
        return (
          <div
            key={day}
            title={rec ? `${dateStr} · ${meta?.label}${rec.workHours ? ` · ${fmtHours(rec.workHours)}` : ""}${rec.notes ? ` · ${rec.notes}` : ""}` : dateStr}
            className="flex aspect-square flex-col items-center justify-center rounded-lg text-xs font-semibold transition"
            style={meta
              ? { background: meta.soft, color: meta.color }
              : { color: "var(--ink-3)" }}
          >
            <span>{day}</span>
            {rec && rec.workHours > 0 && (
              <span className="text-[9px] font-medium opacity-80">{Math.round(rec.workHours / 60)}h</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AttendanceDashboardV2({ isAdmin }: { isAdmin: boolean }) {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [members, setMembers] = useState<AttendanceUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [view, setView] = useState<"calendar" | "list">("calendar");

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/attendance/reports?month=${month}`);
      if (res.ok) setStats(await res.json());
    } catch {
      // keep last data on transient failure
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    setLoading(true);
    fetchStats();
  }, [fetchStats]);

  // Refresh when the Mark Attendance form saves a record
  useEffect(() => {
    const onUpdate = () => fetchStats();
    window.addEventListener("attendance:updated", onUpdate);
    return () => window.removeEventListener("attendance:updated", onUpdate);
  }, [fetchStats]);

  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/members")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [isAdmin]);

  const byPerson = useMemo(() => {
    const map = new Map<string, { user: AttendanceUser; records: AttendanceRecord[] }>();
    for (const m of members) map.set(m.id, { user: m, records: [] });
    for (const r of stats?.records ?? []) {
      if (!map.has(r.userId)) map.set(r.userId, { user: r.user, records: [] });
      map.get(r.userId)!.records.push(r);
    }
    return [...map.values()];
  }, [members, stats]);

  const attendanceRate = stats && stats.totalDays > 0
    ? Math.round((stats.presentDays / stats.totalDays) * 100)
    : null;

  const summary = [
    { label: "Present", value: stats?.presentDays ?? 0, color: "var(--good)" },
    { label: "Absent", value: stats?.absentDays ?? 0, color: "var(--critical)" },
    { label: "Leave", value: stats?.leaveDays ?? 0, color: "var(--warn)" },
    { label: "Late", value: stats?.lateDays ?? 0, color: STATUS_META.late.color },
    { label: "Attendance rate", value: attendanceRate === null ? "—" : `${attendanceRate}%`, color: "var(--brand)" },
  ];

  const sortedRecords = useMemo(
    () => [...(stats?.records ?? [])].sort((a, b) => b.date.localeCompare(a.date)),
    [stats],
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="float-up flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="mt-1 text-sm text-ink-2">
            {isAdmin ? "Track and manage your team's attendance" : "Your attendance for the month"}
          </p>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          aria-label="Select month"
          className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink outline-none transition focus:border-brand"
        />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {summary.map((s) => (
          <Card key={s.label} className="float-up">
            <p className="text-xs font-medium text-ink-3">{s.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight tabular" style={{ color: s.color }}>
              {s.value}
            </p>
          </Card>
        ))}
      </div>

      {/* View toggle + legend */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-line bg-surface p-1">
          {([["calendar", CalendarDays, "Calendar"], ["list", ListTodo, "List"]] as const).map(([key, Icon, label]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                view === key ? "text-ink" : "text-ink-3 hover:text-ink"
              }`}
              style={view === key ? { background: "var(--brand-soft)", color: "var(--brand)" } : undefined}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {Object.entries(STATUS_META).map(([key, m]) => (
            <span key={key} className="flex items-center gap-1.5 text-xs font-medium text-ink-2">
              <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
              {m.label}
            </span>
          ))}
        </div>
      </div>

      {loading && !stats ? (
        <Card className="py-12 text-center text-sm text-ink-3">Loading attendance…</Card>
      ) : view === "calendar" ? (
        byPerson.length === 0 ? (
          <Card className="py-12 text-center text-sm text-ink-3">
            No attendance records for this month yet.
          </Card>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {byPerson.map(({ user, records }) => {
              const worked = records.reduce((s, r) => s + r.workHours, 0);
              const present = records.filter((r) => r.status === "present" || r.status === "half-day").length;
              return (
                <Card key={user.id} className="float-up">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2.5">
                      <Avatar member={user} size={30} />
                      <span>
                        <span className="block text-sm font-semibold">{user.name}</span>
                        <span className="block text-xs text-ink-3">{user.email}</span>
                      </span>
                    </span>
                    <span className="text-right text-xs text-ink-2">
                      <span className="block font-semibold text-ink">{present} days · {fmtHours(worked)}</span>
                      <span className="block text-ink-3">this month</span>
                    </span>
                  </div>
                  <MonthCalendar month={month} records={records} />
                </Card>
              );
            })}
          </div>
        )
      ) : (
        <Card className="overflow-x-auto p-0">
          {sortedRecords.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink-3">No attendance records for this month yet.</p>
          ) : (
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-ink-3">
                  <th className="px-5 py-3 font-medium">Date</th>
                  {isAdmin && <th className="px-5 py-3 font-medium">Member</th>}
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Check in</th>
                  <th className="px-5 py-3 font-medium">Check out</th>
                  <th className="px-5 py-3 font-medium">Hours</th>
                  <th className="px-5 py-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {sortedRecords.map((r) => {
                  const meta = STATUS_META[r.status] ?? STATUS_META.present;
                  return (
                    <tr key={r.id} className="transition hover:bg-surface-2">
                      <td className="px-5 py-3 font-medium tabular">{r.date}</td>
                      {isAdmin && (
                        <td className="px-5 py-3">
                          <span className="flex items-center gap-2">
                            <Avatar member={r.user} size={24} />
                            <span className="font-medium">{r.user.name}</span>
                          </span>
                        </td>
                      )}
                      <td className="px-5 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          style={{ background: meta.soft, color: meta.color }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-ink-2 tabular">{fmtTime(r.checkInTime)}</td>
                      <td className="px-5 py-3 text-xs text-ink-2 tabular">{fmtTime(r.checkOutTime)}</td>
                      <td className="px-5 py-3 font-semibold tabular">{r.workHours ? fmtHours(r.workHours) : "—"}</td>
                      <td className="max-w-[200px] truncate px-5 py-3 text-xs text-ink-3">{r.notes || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </div>
  );
}
