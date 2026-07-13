"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";

interface AttendanceRecord {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string };
  date: string;
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
  workHours: number;
  notes: string;
}

export function AttendanceOverview() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth]);

  async function fetchAttendance() {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/attendance?startDate=${selectedMonth}-01&endDate=${selectedMonth}-31`
      );
      const data = await res.json();
      setRecords(data);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  }

  const statusColors: Record<string, string> = {
    present: "bg-green-100 text-green-800",
    absent: "bg-red-100 text-red-800",
    leave: "bg-yellow-100 text-yellow-800",
    "half-day": "bg-blue-100 text-blue-800",
    late: "bg-orange-100 text-orange-800",
  };

  const groupByUser = records.reduce((acc, record) => {
    const userId = record.userId;
    if (!acc[userId]) {
      acc[userId] = { user: record.user, records: [] };
    }
    acc[userId].records.push(record);
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Team Attendance</h2>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : Object.keys(groupByUser).length === 0 ? (
        <Card className="p-8 text-center text-gray-500">No attendance records found</Card>
      ) : (
        <div className="grid gap-4">
          {Object.entries(groupByUser).map(([userId, { user, records }]) => {
            const presentDays = records.filter((r: any) => r.status === "present" || r.status === "half-day").length;
            const absentDays = records.filter((r: any) => r.status === "absent").length;
            const totalHours = records.reduce((sum: number, r: any) => sum + r.workHours, 0);

            return (
              <Card key={userId} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{presentDays}</p>
                      <p className="text-xs text-gray-600">Present</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{absentDays}</p>
                      <p className="text-xs text-gray-600">Absent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{Math.round(totalHours / 60)}</p>
                      <p className="text-xs text-gray-600">Hours</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mt-4">
                  {records.map((record: any) => {
                    const day = new Date(record.date).getDate();
                    return (
                      <div
                        key={record.id}
                        className={`w-full aspect-square flex items-center justify-center rounded text-sm font-medium cursor-pointer ${
                          statusColors[record.status]
                        }`}
                        title={`${record.date}: ${record.status}`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
