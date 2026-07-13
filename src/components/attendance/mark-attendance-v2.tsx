"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Avatar } from "@/components/ui";
import { STATUS_META } from "@/components/attendance/attendance-dashboard-v2";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  color: string;
}

const TIMED_STATUSES = ["present", "half-day", "late"];

function minutesBetween(checkIn: string, checkOut: string): number {
  const [inH, inM] = checkIn.split(":").map(Number);
  const [outH, outM] = checkOut.split(":").map(Number);
  return outH * 60 + outM - (inH * 60 + inM);
}

export function MarkAttendanceV2() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("present");
  const [checkInTime, setCheckInTime] = useState("09:00");
  const [checkOutTime, setCheckOutTime] = useState("18:00");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/members")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const selected = members.find((m) => m.id === selectedUser);
  const showTimes = TIMED_STATUSES.includes(status);

  const workedMinutes = useMemo(() => {
    if (!showTimes || !checkInTime || !checkOutTime) return 0;
    return minutesBetween(checkInTime, checkOutTime);
  }, [showTimes, checkInTime, checkOutTime]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser) {
      setMessage({ ok: false, text: "Please select a team member." });
      return;
    }
    if (showTimes && workedMinutes <= 0) {
      setMessage({ ok: false, text: "Check-out time must be after check-in time." });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser,
          date,
          status,
          checkInTime: showTimes && checkInTime ? new Date(`${date}T${checkInTime}`).toISOString() : null,
          checkOutTime: showTimes && checkOutTime ? new Date(`${date}T${checkOutTime}`).toISOString() : null,
          notes,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to save attendance.");
      }
      setMessage({ ok: true, text: `Attendance saved for ${selected?.name ?? "member"} on ${date}.` });
      setNotes("");
      window.dispatchEvent(new Event("attendance:updated"));
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Failed to save attendance." });
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-brand";

  return (
    <Card title="Mark attendance" className="float-up">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Member */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-2">Team member</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className={inputClass}
              required
            >
              <option value="">Select a member…</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} · {m.role}
                </option>
              ))}
            </select>
            {selected && (
              <span className="mt-2 flex items-center gap-2 text-xs text-ink-2">
                <Avatar member={selected} size={20} /> {selected.email}
              </span>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-2">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-2">Status</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(STATUS_META).map(([key, meta]) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatus(key)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                  status === key ? "" : "border-line text-ink-2 hover:bg-surface-2"
                }`}
                style={status === key ? { background: meta.soft, color: meta.color, borderColor: meta.color } : undefined}
              >
                {meta.label}
              </button>
            ))}
          </div>
        </div>

        {/* Times */}
        {showTimes && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-2">Check in</label>
              <input type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-2">Check out</label>
              <input type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} className={inputClass} />
            </div>
            <div className="flex items-end pb-2 text-sm font-semibold" style={{ color: workedMinutes > 0 ? "var(--good)" : "var(--critical)" }}>
              {workedMinutes > 0
                ? `${Math.floor(workedMinutes / 60)}h ${workedMinutes % 60 ? `${workedMinutes % 60}m` : ""} total`
                : "Invalid time range"}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything worth noting — e.g. doctor visit, WFH, client site…"
            rows={2}
            className={inputClass}
          />
        </div>

        {message && (
          <p
            className="rounded-lg px-3 py-2 text-xs font-medium"
            style={{
              background: message.ok ? "var(--good-soft)" : "var(--critical-soft)",
              color: message.ok ? "var(--good)" : "var(--critical)",
            }}
          >
            {message.text}
          </p>
        )}

        <button type="submit" disabled={loading || !selectedUser} className="btn-primary px-4 py-2 text-sm disabled:opacity-60">
          {loading ? "Saving…" : "Save attendance"}
        </button>
      </form>
    </Card>
  );
}
