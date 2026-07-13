'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Coffee } from 'lucide-react';

interface TimeEntry {
  id: string;
  isClockedIn: boolean;
  clockInTime: string;
  totalMinutes: number;
  breaks: Break[];
}

interface Break {
  id: string;
  breakOutTime: string | null;
}

export function MinimalClock() {
  const [entry, setEntry] = useState<TimeEntry | null>(null);
  const [onBreak, setOnBreak] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setOnBreak(data.breaks?.some((b: Break) => !b.breakOutTime) || false);
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  }

  async function handleClockIn() {
    setLoading(true);
    try {
      await fetch('/api/time-tracking/clock-in', { method: 'POST' });
      await fetchToday();
    } finally {
      setLoading(false);
    }
  }

  async function handleClockOut() {
    setLoading(true);
    try {
      await fetch('/api/time-tracking/clock-out', { method: 'POST' });
      await fetchToday();
    } finally {
      setLoading(false);
    }
  }

  async function handleBreakIn() {
    setLoading(true);
    try {
      await fetch('/api/time-tracking/break-in', { method: 'POST' });
      await fetchToday();
    } finally {
      setLoading(false);
    }
  }

  async function handleBreakOut() {
    setLoading(true);
    try {
      await fetch('/api/time-tracking/break-out', { method: 'POST' });
      await fetchToday();
    } finally {
      setLoading(false);
    }
  }

  const hours = Math.floor((entry?.totalMinutes ?? 0) / 60);
  const mins = (entry?.totalMinutes ?? 0) % 60;

  return (
    <div className="flex items-center gap-3">
      <span className="font-semibold text-sm" style={{color: 'var(--brand)'}}>
        {hours}h {mins}m
      </span>
      
      {!entry?.isClockedIn ? (
        <button onClick={handleClockIn} disabled={loading} className="btn-primary px-3 py-1.5 text-xs flex items-center gap-1">
          <Play size={14} /> Clock In
        </button>
      ) : (
        <>
          {!onBreak ? (
            <button onClick={handleBreakIn} disabled={loading} className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1">
              <Coffee size={14} /> Break
            </button>
          ) : (
            <button onClick={handleBreakOut} disabled={loading} className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1">
              <Coffee size={14} /> Back
            </button>
          )}
          <button onClick={handleClockOut} disabled={loading} className="btn-secondary px-3 py-1.5 text-xs flex items-center gap-1">
            <Pause size={14} /> Out
          </button>
        </>
      )}
    </div>
  );
}
