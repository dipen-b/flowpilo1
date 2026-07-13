'use client';

import { useState, useEffect } from 'react';
import { Clock, Play, Pause, Coffee, RotateCcw } from 'lucide-react';

interface TimeEntry {
  id: string;
  isActive: boolean;
  isClockedIn: boolean;
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

export function TimeTimer() {
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
    if (!entry?.isClockedIn) return;

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
      const res = await fetch('/api/time-tracking/clock-in', { method: 'POST' });
      if (res.ok) {
        await fetchToday();
      }
    } catch (error) {
      console.error('Clock in failed:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleClockOut() {
    setLoading(true);
    try {
      const res = await fetch('/api/time-tracking/clock-out', { method: 'POST' });
      if (res.ok) {
        await fetchToday();
      }
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

  if (!entry?.isClockedIn) {
    return (
      <button
        onClick={handleClockIn}
        disabled={loading}
        className="btn-primary px-6 py-2.5 text-sm flex items-center justify-center gap-2 rounded-lg"
      >
        <Play size={16} /> Clock In
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4 px-6 py-3 rounded-lg" style={{ background: 'var(--brand-soft)', border: '2px solid var(--brand)' }}>
      <Clock size={20} style={{ color: 'var(--brand)' }} />
      <div>
        <p className="text-xs font-medium text-ink-3 uppercase tracking-wide">Time Tracked</p>
        <p className="text-3xl font-bold font-mono" style={{ color: 'var(--brand)' }}>{elapsedTime}</p>
      </div>
      
      <div className="flex gap-2 ml-4">
        {!onBreak ? (
          <button
            onClick={handleBreakIn}
            disabled={loading}
            className="btn-ghost px-3 py-2 text-sm flex items-center gap-2"
            title="Start break"
          >
            <Coffee size={14} />
          </button>
        ) : (
          <button
            onClick={handleBreakOut}
            disabled={loading}
            className="btn-ghost px-3 py-2 text-sm flex items-center gap-2"
            title="End break"
          >
            <RotateCcw size={14} />
          </button>
        )}
        <button
          onClick={handleClockOut}
          disabled={loading}
          className="btn-secondary px-3 py-2 text-sm flex items-center gap-2"
          title="Clock out"
        >
          <Pause size={14} />
        </button>
      </div>
    </div>
  );
}
