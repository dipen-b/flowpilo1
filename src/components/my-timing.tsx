"use client";

import { useCallback, useEffect, useState } from "react";
import { Clock, Coffee, LogOut, Play } from "lucide-react";

interface BreakRec {
  id: string;
  breakInTime: string;
  breakOutTime: string | null;
  durationMinutes: number;
}

interface TodayEntry {
  id?: string;
  clockInTime?: string;
  clockOutTime?: string | null;
  totalMinutes?: number;
  isClockedIn: boolean;
  breaks?: BreakRec[];
}

function fmtClock(ms: number): string {
  const safe = Math.max(0, ms);
  const h = Math.floor(safe / 3600000);
  const m = Math.floor((safe % 3600000) / 60000);
  const s = Math.floor((safe % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function MyTiming() {
  const [entry, setEntry] = useState<TodayEntry | null>(null);
  const [workTime, setWorkTime] = useState("00:00:00");
  const [breakTime, setBreakTime] = useState("00:00:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchToday = useCallback(async () => {
    try {
      const res = await fetch("/api/time-tracking/today");
      if (res.ok) setEntry(await res.json());
    } catch {
      // transient — keep last state
    }
  }, []);

  useEffect(() => {
    fetchToday();
    const interval = setInterval(fetchToday, 15000);
    return () => clearInterval(interval);
  }, [fetchToday]);

  const onBreak = entry?.breaks?.some((b) => !b.breakOutTime) ?? false;

  // Tick the timers every second while clocked in
  useEffect(() => {
    if (!entry?.isClockedIn || !entry.clockInTime) return;
    const tick = () => {
      const now = Date.now();
      const totalMs = now - new Date(entry.clockInTime!).getTime();
      const breakMs = (entry.breaks ?? []).reduce((sum, b) => {
        const end = b.breakOutTime ? new Date(b.breakOutTime).getTime() : now;
        return sum + (end - new Date(b.breakInTime).getTime());
      }, 0);
      setWorkTime(fmtClock(totalMs - breakMs));
      setBreakTime(fmtClock(breakMs));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [entry]);

  async function action(path: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/time-tracking/${path}`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Something went wrong.");
      }
      await fetchToday();
    } finally {
      setLoading(false);
    }
  }

  // Loading initial state — render nothing to avoid a flash
  if (entry === null) return null;

  // Done for the day
  if (!entry.isClockedIn && entry.id) {
    const worked = entry.totalMinutes ?? 0;
    return (
      <div className="card flex items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "var(--good-soft)", color: "var(--good)" }}>
            <Clock size={16} />
          </span>
          <div>
            <p className="text-sm font-semibold">Done for today</p>
            <p className="text-xs text-ink-2">
              You worked {Math.floor(worked / 60)}h {worked % 60}m — see you tomorrow!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not clocked in yet
  if (!entry.isClockedIn) {
    return (
      <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-semibold">My Timing</p>
          <p className="text-xs text-ink-2">Clock in to start tracking your day</p>
        </div>
        <div className="flex items-center gap-3">
          {error && <p className="text-xs font-medium" style={{ color: "var(--critical)" }}>{error}</p>}
          <button onClick={() => action("clock-in")} disabled={loading} className="btn-primary px-5 py-2 text-sm disabled:opacity-60">
            <Play size={14} /> Clock in
          </button>
        </div>
      </div>
    );
  }

  // Clocked in — live timers
  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-3">Working time</p>
            <p className="mt-0.5 text-2xl font-bold tabular" style={{ color: "var(--good)" }}>{workTime}</p>
          </div>
          <div className="h-10 w-px bg-line" style={{ background: "var(--line)" }} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-3">Break time</p>
            <p className="mt-0.5 text-2xl font-bold tabular" style={{ color: onBreak ? "var(--critical)" : "var(--ink-3)" }}>{breakTime}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {error && <p className="text-xs font-medium" style={{ color: "var(--critical)" }}>{error}</p>}
          <button
            onClick={() => action(onBreak ? "break-out" : "break-in")}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:opacity-60"
            style={{ borderColor: "var(--warn)", color: "var(--warn)" }}
          >
            <Coffee size={14} /> {onBreak ? "Back to work" : "Take a break"}
          </button>
          <button
            onClick={() => action("clock-out")}
            disabled={loading || onBreak}
            title={onBreak ? "End your break before clocking out" : undefined}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
            style={{ background: "var(--critical)" }}
          >
            <LogOut size={14} /> Clock out
          </button>
        </div>
      </div>
      {onBreak && (
        <p className="mt-3 rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: "var(--warn-soft)", color: "var(--warn)" }}>
          You're on a break — the work timer is paused.
        </p>
      )}
    </div>
  );
}
