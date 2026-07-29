"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { MOCK_TASKS, MOCK_PROJECTS, ROUTES } from "@/constants";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { Download, Share2, Filter, TrendingUp, Users, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

interface Report {
  id: string;
  name: string;
  description: string;
  type: "project" | "sprint" | "team" | "tasks" | "executive";
  lastUpdated: string;
  metrics: Record<string, number | string>;
}

const REPORTS: Report[] = [
  {
    id: "report-1",
    name: "Project Status Overview",
    description: "Current status of all active projects with progress metrics",
    type: "project",
    lastUpdated: "2026-02-28",
    metrics: { "Active Projects": 3, "On Track": 2, "At Risk": 1 },
  },
  {
    id: "report-2",
    name: "Sprint Performance",
    description: "Sprint velocity, burndown, and team performance analysis",
    type: "sprint",
    lastUpdated: "2026-02-28",
    metrics: { "Sprints Completed": 1, "Current Velocity": 45, "Avg Velocity": 42 },
  },
  {
    id: "report-3",
    name: "Team Workload Analysis",
    description: "Individual and team member capacity utilization",
    type: "team",
    lastUpdated: "2026-02-27",
    metrics: { "Team Size": 6, "Avg Utilization": "67%", "Over Capacity": 1 },
  },
  {
    id: "report-4",
    name: "Task Completion Trends",
    description: "Task completion rates and pending task analysis",
    type: "tasks",
    lastUpdated: "2026-02-28",
    metrics: { "Total Tasks": 41, "Completed": 8, "In Progress": 10 },
  },
  {
    id: "report-5",
    name: "Executive Dashboard",
    description: "High-level KPIs for leadership and stakeholders",
    type: "executive",
    lastUpdated: "2026-02-28",
    metrics: { "Revenue Impact": "$2.4M", "Team Efficiency": "82%", "Delivery Rate": "94%" },
  },
];

const SAMPLE_CHARTS = [
  {
    title: "Task Completion Rate",
    data: [
      { label: "Done", value: 8, color: "bg-black" },
      { label: "In Progress", value: 10, color: "bg-gray-600" },
      { label: "To Do", value: 23, color: "bg-gray-400" },
    ],
  },
  {
    title: "Project Status Distribution",
    data: [
      { label: "Active", value: 2, color: "bg-gray-700" },
      { label: "Planning", value: 1, color: "bg-gray-500" },
      { label: "Completed", value: 0, color: "bg-gray-300" },
    ],
  },
];

function ReportsContent() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [dateRange, setDateRange] = useState("30days");

  const getReportIcon = (type: string) => {
    switch (type) {
      case "project":
        return "📊";
      case "sprint":
        return "🏃";
      case "team":
        return "👥";
      case "tasks":
        return "✓";
      case "executive":
        return "📈";
      default:
        return "📄";
    }
  };

  const getReportColor = (type: string) => {
    switch (type) {
      case "project":
        return "bg-gray-700/10 border-gray-700/20 text-gray-700";
      case "sprint":
        return "bg-gray-600/10 border-gray-600/20 text-gray-600";
      case "team":
        return "bg-gray-500/10 border-gray-500/20 text-gray-500";
      case "tasks":
        return "bg-gray-400/10 border-gray-400/20 text-gray-400";
      case "executive":
        return "bg-black/10 border-black/20 text-primary-text";
      default:
        return "bg-gray-600/10 border-gray-600/20 text-gray-600";
    }
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-secondary-text">Analytics and insights for your projects</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" className="flex items-center gap-2">
              <Filter size={16} />
              Filters
            </Button>
            <Button size="sm" variant="secondary" className="flex items-center gap-2">
              <Download size={16} />
              Export
            </Button>
            <Button size="sm" className="flex items-center gap-2">
              <Share2 size={16} />
              Share
            </Button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary-text">Show data for:</span>
          {[
            { label: "Last 7 days", value: "7days" },
            { label: "Last 30 days", value: "30days" },
            { label: "Last 90 days", value: "90days" },
            { label: "Year to date", value: "ytd" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setDateRange(option.value)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                dateRange === option.value
                  ? "bg-black text-white"
                  : "bg-secondary-bg text-secondary-text hover:text-primary-text"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-secondary-text mb-1">Total Tasks</p>
                  <p className="text-2xl font-bold text-primary-text">41</p>
                  <p className="text-xs text-primary-text mt-1">↑ 8% from last period</p>
                </div>
                <CheckCircle2 size={24} className="text-primary-text opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-secondary-text mb-1">Completion Rate</p>
                  <p className="text-2xl font-bold text-primary-text">19%</p>
                  <p className="text-xs text-primary-text mt-1">↑ 3% from last period</p>
                </div>
                <TrendingUp size={24} className="text-primary-text opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-secondary-text mb-1">Avg Team Workload</p>
                  <p className="text-2xl font-bold text-primary-text">67%</p>
                  <p className="text-xs text-primary-text mt-1">1 member over capacity</p>
                </div>
                <Users size={24} className="text-primary-text opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-secondary-text mb-1">Projects On Track</p>
                  <p className="text-2xl font-bold text-primary-text">2/3</p>
                  <p className="text-xs text-primary-text mt-1">1 at risk</p>
                </div>
                <AlertCircle size={24} className="text-primary-text opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6">
          {SAMPLE_CHARTS.map((chart) => (
            <Card key={chart.title}>
              <CardHeader>
                <CardTitle className="text-lg">{chart.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chart.data.map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary-text">{item.label}</span>
                        <span className="font-semibold text-primary-text">{item.value}</span>
                      </div>
                      <div className="h-3 bg-secondary-bg rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} transition-all`}
                          style={{ width: `${(item.value / 23) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Available Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {REPORTS.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${getReportColor(report.type)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{getReportIcon(report.type)}</span>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {report.type}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-primary-text mb-1">{report.name}</h3>
                  <p className="text-xs text-secondary-text mb-3">{report.description}</p>

                  {/* Metrics Preview */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    {Object.entries(report.metrics)
                      .slice(0, 2)
                      .map(([key, value]) => (
                        <div key={key} className="p-2 bg-card-bg rounded">
                          <p className="text-secondary-text">{key}</p>
                          <p className="font-semibold text-primary-text">{value}</p>
                        </div>
                      ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-current/10">
                    <p className="text-xs text-secondary-text">
                      Updated {new Date(report.lastUpdated).toLocaleDateString("en-GB")}
                    </p>
                    <Button size="sm" variant="secondary" className="text-xs">
                      View →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function Reports() {
  return (
    <ProtectedRoute>
      <ReportsContent />
    </ProtectedRoute>
  );
}
