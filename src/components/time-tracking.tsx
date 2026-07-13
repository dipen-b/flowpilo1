'use client';

import { useState, useEffect } from 'react';
import { Clock, Play, Pause, Coffee } from 'lucide-react';

interface TimeEntry {
  id: string;
  isActive: boolean;
  clockInTime: string;
  clockOutTime: string | null;
  totalMinutes: number;
  breakMinutes: number;
  breaks: Break[];
}

interface Break {
  id: string;
  breakInTime: string;
  breakOutTime: string | null;
  durationMinutes: number;
}

export function TimeTracking() {
  const [entry, setEntry] = useState<TimeEntry | null>(null);
  const [onBreak, setOnBreak] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [loading, setLoading] = useState(false);

  // Fetch today's entry
  useEffect(() => {
    fetchToday();
    const interval = setInterval(fetchToday, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update elapsed time
  useEffect(() => {
    if (!entry?.isActive) return;

    const timer = setInterval(() => {
      const now = new Date();
      const clockIn = new Date(entry.clockInTime);
      const diff = now.getTime() - clockIn.getTime();
      
      const breakMs = entry.breaks.reduce((sum, b) => {
        if (b.breakOutTime) {
          return sum + (new Date(b.breakOutTime).getTime() - new Date(b.breakInTime).getTime());
        }
        return sum;
      }, 0);

      const workTime = diff - breakMs;
      const hours = Math.floor(workTime / 3600000);
      const mins = Math.floor((workTime % 3600000) / 60000);
      const secs = Math.floor((workTime % 60000) / 1000);

      setElapsedTime(
        `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [entry]);

  async function fetchToday() {
    try {
      const res = await fetch('/api/time-tracking/today');
      const data = await res.json();
      setEntry(data);
      const hasActiveBreak = data.breaks?.some((b: Break) => !b.breakOutTime);
      setOnBreak(hasActiveBreak);
    } catch (error) {
      console.error('Failed to fetch time entry:', error);
    }
  }

  async function handleClockIn() {
    setLoading(true);
    try {
      await fetch('/api/time-tracking/clock-in', { method: 'POST' });
      await fetchToday();
    } catch (error) {
      console.error('Clock in failed:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleClockOut() {
    setLoading(true);
    try {
      await fetch('/api/time-tracking/clock-out', { method: 'POST' });
      await fetchToday();
    } catch (error) {
      console.error('Clock out failed:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBreakIn() {
    setLoading(true);
    try {
      await fetch('/api/time-tracking/break-in', { method: 'POST' });
      await fetchToday();
    } catch (error) {
      console.error('Break in failed:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBreakOut() {
    setLoading(true);
    try {
      await fetch('/api/time-tracking/break-out', { method: 'POST' });
      await fetchToday();
    } catch (error) {
      console.error('Break out failed:', error);
    } finally {
      setLoading(false);
    }
  }

  const hours = Math.floor(entry?.totalMinutes ?? 0 / 60);
  const mins = (entry?.totalMinutes ?? 0) % 60;

  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={18} />
        <h3 className="font-semibold">Time Tracking</h3>
      </div>

      {!entry?.isActive ? (
        <div className="space-y-4">
          <p className="text-sm text-ink-2">Not clocked in</p>
          <button
            onClick={handleClockIn}
            disabled={loading}
            className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-2"
          >
            <Play size={14} /> Clock In
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-ink-3 mb-1">Elapsed Time</p>
            <p className="text-2xl font-bold font-mono text-blue-600">{elapsedTime}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 rounded p-2">
              <p className="text-xs text-ink-3">Breaks</p>
              <p className="font-semibold">{entry.breaks.length}</p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-xs text-ink-3">Break Time</p>
              <p className="font-semibold">{entry.breakMinutes}m</p>
            </div>
          </div>

          <div className="flex gap-2">
            {!onBreak ? (
              <button
                onClick={handleBreakIn}
                disabled={loading}
                className="flex-1 btn-ghost py-2 text-sm flex items-center justify-center gap-2"
              >
                <Coffee size={14} /> Break
              </button>
            ) : (
              <button
                onClick={handleBreakOut}
                disabled={loading}
                className="flex-1 btn-ghost py-2 text-sm flex items-center justify-center gap-2"
              >
                <Coffee size={14} /> Back
              </button>
            )}
            <button
              onClick={handleClockOut}
              disabled={loading}
              className="flex-1 btn-secondary py-2 text-sm flex items-center justify-center gap-2"
            >
              <Pause size={14} /> Clock Out
            </button>
          </div>
        </div>
      )}

      {entry?.clockOutTime && (
        <div className="mt-4 pt-4 border-t border-line">
          <p className="text-xs text-ink-3 mb-2">Today's Total</p>
          <p className="text-xl font-bold">
            {hours}h {mins}m
          </p>
        </div>
      )}
    </div>
  );
}
