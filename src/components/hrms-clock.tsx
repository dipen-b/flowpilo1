'use client';

import { useState, useEffect } from 'react';
import { Clock, MapPin, LogOut, LogIn } from 'lucide-react';

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

export function HRMSClock() {
  const [entry, setEntry] = useState<TimeEntry | null>(null);
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [currentDate, setCurrentDate] = useState('');
  const [elapsedTime, setElapsedTime] = useState('0h 0m');
  const [loading, setLoading] = useState(false);
  const [checkinTime, setCheckinTime] = useState('');

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

      setElapsedTime(`${hours}h ${mins}m`);
    }, 1000);

    return () => clearInterval(timer);
  }, [entry]);

  async function fetchToday() {
    try {
      const res = await fetch('/api/time-tracking/today');
      const data = await res.json();
      setEntry(data);
      
      if (data.clockInTime) {
        const checkInDate = new Date(data.clockInTime);
        setCheckinTime(checkInDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      }
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

  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <div className="text-center mb-8 text-white">
        <p className="text-lg opacity-90">{currentDate}</p>
      </div>

      {/* Large Clock Display */}
      <div className="text-center mb-12">
        <div className="text-7xl font-bold font-mono text-white mb-2 tracking-wider" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          {currentTime}
        </div>
      </div>

      {/* Status Box */}
      {entry?.isClockedIn ? (
        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 mb-8 text-white border border-white border-opacity-30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-lg font-semibold">Clocked In</span>
            </div>
            <MapPin size={20} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-80 mb-1">Check In Time</p>
              <p className="text-2xl font-bold">{checkinTime}</p>
            </div>
            <div>
              <p className="text-sm opacity-80 mb-1">Duration</p>
              <p className="text-2xl font-bold">{elapsedTime}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 mb-8 text-white border border-white border-opacity-30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
            <span className="text-lg font-semibold">Clocked Out</span>
          </div>
          <p className="text-sm opacity-80">Click "Clock In" to start your workday</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {!entry?.isClockedIn ? (
          <button
            onClick={handleClockIn}
            disabled={loading}
            className="flex items-center justify-center gap-3 px-12 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95"
            style={{ background: '#10b981', color: 'white' }}
          >
            <LogIn size={24} />
            Clock In
          </button>
        ) : (
          <button
            onClick={handleClockOut}
            disabled={loading}
            className="flex items-center justify-center gap-3 px-12 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95"
            style={{ background: '#ef4444', color: 'white' }}
          >
            <LogOut size={24} />
            Clock Out
          </button>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-white text-sm opacity-75">
        <p>FlowPilot • Time Tracking System</p>
      </div>
    </div>
  );
}
