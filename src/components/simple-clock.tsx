'use client';

import { useState, useEffect } from 'react';
import { LogOut, LogIn, Coffee, RotateCcw } from 'lucide-react';

interface TimeEntry {
  id: string;
  isClockedIn: boolean;
  clockInTime: string;
  clockOutTime: string | null;
  totalMinutes: number;
  breaks: Break[];
}

interface Break {
  id: string;
  breakInTime: string;
  breakOutTime: string | null;
}

export function SimpleClock() {
  const [entry, setEntry] = useState<TimeEntry | null>(null);
  const [onBreak, setOnBreak] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch today's entry
  useEffect(() => {
    fetchToday();
    const interval = setInterval(fetchToday, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const hours = Math.floor((entry?.totalMinutes ?? 0) / 60);
  const mins = (entry?.totalMinutes ?? 0) % 60;

  return (
    <div className="inline-flex items-center gap-4 px-4 py-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Total Hours */}
      <div className="text-white">
        <p className="text-sm font-medium opacity-90">Total Hours</p>
        <p className="text-2xl font-bold">{hours}h {mins}m</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        {!entry?.isClockedIn ? (
          <button
            onClick={handleClockIn}
            disabled={loading}
            className="btn-ghost px-4 py-2 text-sm text-white flex items-center gap-2 rounded-lg hover:opacity-90"
          >
            <LogIn size={16} /> Clock In
          </button>
        ) : (
          <>
            {!onBreak ? (
              <button
                onClick={handleBreakIn}
                disabled={loading}
                className="btn-ghost px-4 py-2 text-sm text-white flex items-center gap-2 rounded-lg hover:opacity-90"
              >
                <Coffee size={16} /> Break In
              </button>
            ) : (
              <button
                onClick={handleBreakOut}
                disabled={loading}
                className="btn-ghost px-4 py-2 text-sm text-white flex items-center gap-2 rounded-lg hover:opacity-90"
              >
                <RotateCcw size={16} /> Break Out
              </button>
            )}
            <button
              onClick={handleClockOut}
              disabled={loading}
              className="btn-secondary px-4 py-2 text-sm text-white flex items-center gap-2 rounded-lg"
            >
              <LogOut size={16} /> Clock Out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
