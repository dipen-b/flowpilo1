'use client';

import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

interface TimeEntry {
  id: string;
  isClockedIn: boolean;
  clockInTime: string;
  totalMinutes: number;
  breaks: Break[];
}

interface Break {
  id: string;
  breakInTime: string;
  breakOutTime: string | null;
  durationMinutes: number;
}

export function MyTiming() {
  const [entry, setEntry] = useState<TimeEntry | null>(null);
  const [onBreak, setOnBreak] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [breakTime, setBreakTime] = useState('00:00:00');
  const [loading, setLoading] = useState(false);

  // Update current time and break time every second
  useEffect(() => {
    const timer = setInterval(() => {
      if (entry?.isClockedIn) {
        const now = new Date();
        const clockIn = new Date(entry.clockInTime);
        const totalMs = now.getTime() - clockIn.getTime();

        const breakMs = entry.breaks.reduce((sum, b) => {
          if (b.breakOutTime) {
            return sum + (new Date(b.breakOutTime).getTime() - new Date(b.breakInTime).getTime());
          } else {
            // Current active break
            return sum + (now.getTime() - new Date(b.breakInTime).getTime());
          }
        }, 0);

        const workMs = totalMs - breakMs;
        const hours = Math.floor(workMs / 3600000);
        const mins = Math.floor((workMs % 3600000) / 60000);
        const secs = Math.floor((workMs % 60000) / 1000);

        setCurrentTime(`${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);

        // Break time
        const breakHours = Math.floor(breakMs / 3600000);
        const breakMins = Math.floor((breakMs % 3600000) / 60000);
        const breakSecs = Math.floor((breakMs % 60000) / 1000);

        setBreakTime(`${String(breakHours).padStart(2, '0')}:${String(breakMins).padStart(2, '0')}:${String(breakSecs).padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [entry]);

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

  if (!entry?.isClockedIn) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-md">
        <h2 className="text-lg font-bold mb-4">My Timing</h2>
        <button
          onClick={handleClockIn}
          disabled={loading}
          className="w-full btn-primary py-3 font-bold rounded-lg"
        >
          CLOCK IN
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-md">
      <h2 className="text-lg font-bold mb-4">My Timing</h2>

      {/* Time Display Box */}
      <div className="border-2 border-gray-300 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-4">
          {/* Current Time */}
          <div className="flex-1">
            <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Current Time</p>
            <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>
              {currentTime}
            </p>
          </div>

          {/* Separator */}
          <div className="h-16 w-1" style={{ background: '#fbbf24' }}></div>

          {/* Break Time */}
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-xs text-gray-600 uppercase tracking-wide">Break Time</p>
              <Info size={14} className="text-gray-400" />
            </div>
            <p className="text-3xl font-bold" style={{ color: '#ef4444' }}>
              {breakTime}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        {!onBreak ? (
          <button
            onClick={handleBreakIn}
            disabled={loading}
            className="flex-1 py-3 font-bold rounded-lg border-2"
            style={{ borderColor: '#ef4444', color: '#ef4444', background: 'white' }}
          >
            BREAK
          </button>
        ) : (
          <button
            onClick={handleBreakOut}
            disabled={loading}
            className="flex-1 py-3 font-bold rounded-lg border-2"
            style={{ borderColor: '#ef4444', color: '#ef4444', background: 'white' }}
          >
            BACK
          </button>
        )}
        <button
          onClick={handleClockOut}
          disabled={loading}
          className="flex-1 py-3 font-bold rounded-lg"
          style={{ background: '#ef4444', color: 'white' }}
        >
          CLOCK OUT
        </button>
      </div>
    </div>
  );
}
