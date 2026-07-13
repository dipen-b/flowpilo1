"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Users } from "lucide-react";

interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  lateDays: number;
  totalWorkHours: number;
  averageWorkHours: number;
  records: any[];
}

export function AttendanceDashboard({ isAdmin }: { isAdmin: boolean }) {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [activeTab, setActiveTab] = useState<"overview" | "details">("overview");

  useEffect(() => {
    fetchStats();
  }, [selectedMonth]);

  async function fetchStats() {
    try {
      setLoading(true);
      const res = await fetch(`/api/attendance/reports?month=${selectedMonth}`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm font-medium text-yellow-900">
            📋 Attendance module is available for admins and owners only.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-gray-600">No attendance data available</p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Present",
      value: stats.presentDays,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Absent",
      value: stats.absentDays,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Leave",
      value: stats.leaveDays,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Avg Work Hours",
      value: `${Math.round(stats.averageWorkHours / 60)}h`,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="mt-1 text-sm text-gray-600">Track and manage team attendance</p>
        </div>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={`${stat.bgColor} border-0`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "overview"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "details"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Details
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <Card className="border-0 bg-white shadow-sm">
          <div className="p-6">
            <h3 className="font-semibold text-gray-900">Monthly Summary</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Working Days</span>
                <span className="font-medium text-gray-900">{stats.totalDays}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Work Hours</span>
                <span className="font-medium text-gray-900">{Math.round(stats.totalWorkHours / 60)}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Attendance Rate</span>
                <span className="font-medium text-green-600">
                  {stats.totalDays > 0 ? Math.round((stats.presentDays / stats.totalDays) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Details Tab */}
      {activeTab === "details" && (
        <Card className="border-0 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Employee</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Check In</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Check Out</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.records.slice(0, 10).map((record) => {
                  const statusColor =
                    record.status === "present"
                      ? "bg-green-100 text-green-800"
                      : record.status === "absent"
                      ? "bg-red-100 text-red-800"
                      : record.status === "leave"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800";

                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{record.date}</td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{record.user?.name}</div>
                        <div className="text-xs text-gray-600">{record.user?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${statusColor}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        {record.checkInTime
                          ? new Date(record.checkInTime).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        {record.checkOutTime
                          ? new Date(record.checkOutTime).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{Math.round(record.workHours / 60)}h</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
