"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";

export function AttendanceReports() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchReport();
  }, [selectedMonth]);

  async function fetchReport() {
    try {
      setLoading(true);
      const res = await fetch(`/api/attendance/reports?month=${selectedMonth}`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!stats) return <div className="text-center py-8">No data available</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Attendance Reports</h2>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
      </div>

      <div className="grid grid-cols-5 gap-4">
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.presentDays}</p>
          <p className="text-sm text-gray-600 mt-2">Present Days</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-red-600">{stats.absentDays}</p>
          <p className="text-sm text-gray-600 mt-2">Absent Days</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-yellow-600">{stats.leaveDays}</p>
          <p className="text-sm text-gray-600 mt-2">Leave Days</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-orange-600">{stats.lateDays}</p>
          <p className="text-sm text-gray-600 mt-2">Late Days</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-blue-600">{Math.round(stats.averageWorkHours / 60)}</p>
          <p className="text-sm text-gray-600 mt-2">Avg Hours/Day</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Employee</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Check In</th>
                <th className="text-left py-3 px-4 font-medium">Check Out</th>
                <th className="text-left py-3 px-4 font-medium">Work Hours</th>
              </tr>
            </thead>
            <tbody>
              {stats.records?.map((record: any) => (
                <tr key={record.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{record.date}</td>
                  <td className="py-3 px-4">{record.user?.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        record.status === "present"
                          ? "bg-green-100 text-green-800"
                          : record.status === "absent"
                          ? "bg-red-100 text-red-800"
                          : record.status === "leave"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {record.checkInTime
                      ? new Date(record.checkInTime).toLocaleTimeString()
                      : "-"}
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {record.checkOutTime
                      ? new Date(record.checkOutTime).toLocaleTimeString()
                      : "-"}
                  </td>
                  <td className="py-3 px-4">
                    {Math.round(record.workHours / 60)} hrs
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
