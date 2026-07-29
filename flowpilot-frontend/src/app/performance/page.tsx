"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
  Clock,
  Database,
  Download,
} from "lucide-react";
import { useState } from "react";

interface PerformanceMetric {
  label: string;
  value: number | string;
  unit: string;
  threshold: number;
  status: "good" | "warning" | "critical";
  trend?: "up" | "down";
}

interface ApiEndpoint {
  name: string;
  avgResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  requestsPerSecond: number;
}

const PERFORMANCE_METRICS: PerformanceMetric[] = [
  {
    label: "Page Load Time",
    value: 1.24,
    unit: "s",
    threshold: 3,
    status: "good",
    trend: "down",
  },
  {
    label: "First Contentful Paint",
    value: 0.89,
    unit: "s",
    threshold: 1.8,
    status: "good",
    trend: "down",
  },
  {
    label: "Largest Contentful Paint",
    value: 2.15,
    unit: "s",
    threshold: 2.5,
    status: "good",
    trend: "up",
  },
  {
    label: "Cumulative Layout Shift",
    value: 0.05,
    unit: "",
    threshold: 0.1,
    status: "good",
    trend: "down",
  },
  {
    label: "Memory Usage",
    value: 42.5,
    unit: "MB",
    threshold: 100,
    status: "good",
    trend: "down",
  },
  {
    label: "CPU Usage",
    value: 18,
    unit: "%",
    threshold: 50,
    status: "good",
    trend: "down",
  },
  {
    label: "Database Query Time",
    value: 45,
    unit: "ms",
    threshold: 100,
    status: "good",
    trend: "up",
  },
  {
    label: "API Response Time (avg)",
    value: 28,
    unit: "ms",
    threshold: 100,
    status: "good",
    trend: "down",
  },
];

const API_ENDPOINTS: ApiEndpoint[] = [
  {
    name: "GET /api/tasks",
    avgResponseTime: 45,
    p95ResponseTime: 120,
    p99ResponseTime: 200,
    errorRate: 0.01,
    requestsPerSecond: 150,
  },
  {
    name: "GET /api/projects",
    avgResponseTime: 38,
    p95ResponseTime: 95,
    p99ResponseTime: 150,
    errorRate: 0,
    requestsPerSecond: 80,
  },
  {
    name: "POST /api/tasks",
    avgResponseTime: 120,
    p95ResponseTime: 280,
    p99ResponseTime: 450,
    errorRate: 0.02,
    requestsPerSecond: 20,
  },
  {
    name: "GET /api/notifications",
    avgResponseTime: 15,
    p95ResponseTime: 35,
    p99ResponseTime: 60,
    errorRate: 0,
    requestsPerSecond: 200,
  },
  {
    name: "PATCH /api/tasks/:id",
    avgResponseTime: 95,
    p95ResponseTime: 210,
    p99ResponseTime: 350,
    errorRate: 0.01,
    requestsPerSecond: 30,
  },
];

function PerformanceContent() {
  const [timeRange, setTimeRange] = useState("24h");

  const getStatusColor = (status: PerformanceMetric["status"]) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-600/10";
      case "warning":
        return "text-yellow-600 bg-yellow-600/10";
      case "critical":
        return "text-red-600 bg-red-600/10";
    }
  };

  const getMetricColor = (value: number, threshold: number) => {
    if (value > threshold * 0.75) return "text-red-600";
    if (value > threshold * 0.5) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Performance Monitoring</h1>
            <p className="text-secondary-text">Real-time performance metrics and analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-text">Time range:</span>
              {(["1h", "24h", "7d", "30d"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? "bg-black text-white"
                      : "bg-secondary-bg text-secondary-text hover:text-primary-text"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <Button size="sm" variant="secondary" className="flex items-center gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>

        {/* Core Web Vitals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap size={20} />
              Core Web Vitals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {PERFORMANCE_METRICS.slice(0, 4).map((metric) => (
                <div
                  key={metric.label}
                  className="p-4 rounded-lg border border-border"
                >
                  <p className="text-xs text-secondary-text mb-2">{metric.label}</p>
                  <div className="flex items-end gap-2 mb-2">
                    <p className={`text-2xl font-bold ${getMetricColor(typeof metric.value === "number" ? metric.value : 0, metric.threshold)}`}>
                      {metric.value}
                    </p>
                    <p className="text-sm text-secondary-text mb-1">{metric.unit}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className={`capitalize text-xs ${getStatusColor(metric.status)}`}
                    >
                      {metric.status}
                    </Badge>
                    {metric.trend && (
                      metric.trend === "up" ? (
                        <TrendingUp size={14} className="text-green-600" />
                      ) : (
                        <TrendingDown size={14} className="text-red-600" />
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {PERFORMANCE_METRICS.slice(4, 7).map((metric) => (
            <Card key={metric.label}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-secondary-text">{metric.label}</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-3xl font-bold ${getMetricColor(typeof metric.value === "number" ? metric.value : 0, metric.threshold)}`}>
                      {metric.value}
                    </p>
                    <p className="text-sm text-secondary-text">{metric.unit}</p>
                  </div>
                  <div className="w-full bg-secondary-bg rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        typeof metric.value === "number"
                          ? metric.value > metric.threshold * 0.75
                            ? "bg-red-600"
                            : metric.value > metric.threshold * 0.5
                            ? "bg-yellow-600"
                            : "bg-green-600"
                          : "bg-gray-600"
                      }`}
                      style={{
                        width: `${Math.min((typeof metric.value === "number" ? metric.value / metric.threshold : 0) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Endpoints Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={20} />
              API Endpoints Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {API_ENDPOINTS.map((endpoint) => (
                <div
                  key={endpoint.name}
                  className="p-4 rounded-lg border border-border space-y-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-primary-text">{endpoint.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          endpoint.errorRate === 0
                            ? "bg-green-600/10 text-green-600"
                            : "bg-red-600/10 text-red-600"
                        }`}
                      >
                        {(endpoint.errorRate * 100).toFixed(2)}% errors
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {endpoint.requestsPerSecond.toFixed(0)} req/s
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-secondary-text text-xs mb-1">Avg Response</p>
                      <p className={`font-semibold ${getMetricColor(endpoint.avgResponseTime, 100)}`}>
                        {endpoint.avgResponseTime}ms
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-text text-xs mb-1">P95</p>
                      <p className={`font-semibold ${getMetricColor(endpoint.p95ResponseTime, 200)}`}>
                        {endpoint.p95ResponseTime}ms
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-text text-xs mb-1">P99</p>
                      <p className={`font-semibold ${getMetricColor(endpoint.p99ResponseTime, 300)}`}>
                        {endpoint.p99ResponseTime}ms
                      </p>
                    </div>
                  </div>

                  <div className="w-full bg-secondary-bg rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        endpoint.avgResponseTime > 75
                          ? "bg-red-600"
                          : endpoint.avgResponseTime > 50
                          ? "bg-yellow-600"
                          : "bg-green-600"
                      }`}
                      style={{
                        width: `${Math.min((endpoint.avgResponseTime / 200) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimization Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle size={20} />
              Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  title: "Enable HTTP/2 Server Push",
                  description: "Push critical assets before requested to reduce load time",
                  impact: "Reduce LCP by ~200ms",
                  priority: "high",
                },
                {
                  title: "Implement Code Splitting",
                  description: "Split bundle by route to reduce initial JS payload",
                  impact: "Reduce First Paint by ~150ms",
                  priority: "high",
                },
                {
                  title: "Enable Image Lazy Loading",
                  description: "Lazy load images below the fold",
                  impact: "Reduce LCP by ~100ms",
                  priority: "medium",
                },
                {
                  title: "Implement Database Query Caching",
                  description: "Cache frequently accessed queries with Redis",
                  impact: "Reduce P95 response by ~80ms",
                  priority: "medium",
                },
                {
                  title: "Add CDN Caching Headers",
                  description: "Set appropriate cache-control headers for static assets",
                  impact: "Reduce repeat visit load by ~500ms",
                  priority: "low",
                },
              ].map((rec, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-l-4 ${
                    rec.priority === "high"
                      ? "border-red-600 bg-red-600/5"
                      : rec.priority === "medium"
                      ? "border-yellow-600 bg-yellow-600/5"
                      : "border-blue-600 bg-blue-600/5"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-primary-text">{rec.title}</h3>
                    <Badge
                      variant="secondary"
                      className={`capitalize text-xs ${
                        rec.priority === "high"
                          ? "bg-red-600/10 text-red-600"
                          : rec.priority === "medium"
                          ? "bg-yellow-600/10 text-yellow-600"
                          : "bg-blue-600/10 text-blue-600"
                      }`}
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-secondary-text mb-2">{rec.description}</p>
                  <p className="text-xs text-primary-text font-medium">Expected impact: {rec.impact}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function Performance() {
  return (
    <ProtectedRoute>
      <PerformanceContent />
    </ProtectedRoute>
  );
}
