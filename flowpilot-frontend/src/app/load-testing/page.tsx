"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Play,
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Download,
  Settings,
} from "lucide-react";
import { useState } from "react";

interface LoadTestResult {
  timestamp: Date;
  name: string;
  duration: number;
  users: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  throughput: number;
  errorRate: number;
  successRate: number;
}

const LOAD_TEST_RESULTS: LoadTestResult[] = [
  {
    timestamp: new Date(2026, 1, 28, 10, 0),
    name: "Baseline Test (50 users, 5 min)",
    duration: 300,
    users: 50,
    avgResponseTime: 45,
    minResponseTime: 12,
    maxResponseTime: 250,
    throughput: 150,
    errorRate: 0.5,
    successRate: 99.5,
  },
  {
    timestamp: new Date(2026, 1, 27, 14, 30),
    name: "Load Test (500 users, 10 min)",
    duration: 600,
    users: 500,
    avgResponseTime: 125,
    minResponseTime: 28,
    maxResponseTime: 890,
    throughput: 1250,
    errorRate: 2.1,
    successRate: 97.9,
  },
  {
    timestamp: new Date(2026, 1, 27, 8, 0),
    name: "Stress Test (2000 users, 15 min)",
    duration: 900,
    users: 2000,
    avgResponseTime: 450,
    minResponseTime: 120,
    maxResponseTime: 3200,
    throughput: 4100,
    errorRate: 8.5,
    successRate: 91.5,
  },
  {
    timestamp: new Date(2026, 1, 26, 16, 0),
    name: "Spike Test (1000→5000 users)",
    duration: 480,
    users: 5000,
    avgResponseTime: 1200,
    minResponseTime: 250,
    maxResponseTime: 8900,
    throughput: 8200,
    errorRate: 15.2,
    successRate: 84.8,
  },
];

function LoadTestingContent() {
  const [isRunning, setIsRunning] = useState(false);
  const [testConfig, setTestConfig] = useState({
    users: 100,
    duration: 300,
    rampUp: 30,
  });
  const [selectedTest, setSelectedTest] = useState<LoadTestResult | null>(null);

  const handleStartTest = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, testConfig.duration * 10);
  };

  const latestTest = LOAD_TEST_RESULTS[0];

  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Load Testing</h1>
            <p className="text-secondary-text">Simulate and analyze application under load</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" className="flex items-center gap-2">
              <Download size={16} />
              Export Results
            </Button>
          </div>
        </div>

        {/* Test Configuration */}
        <Card className="border-primary-text border-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Test Configuration</span>
              <Settings size={20} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">
                  Concurrent Users
                </label>
                <input
                  type="number"
                  value={testConfig.users}
                  onChange={(e) =>
                    setTestConfig({ ...testConfig, users: parseInt(e.target.value) })
                  }
                  disabled={isRunning}
                  className="w-full px-3 py-2 bg-secondary-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  value={testConfig.duration}
                  onChange={(e) =>
                    setTestConfig({ ...testConfig, duration: parseInt(e.target.value) })
                  }
                  disabled={isRunning}
                  className="w-full px-3 py-2 bg-secondary-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">
                  Ramp Up (seconds)
                </label>
                <input
                  type="number"
                  value={testConfig.rampUp}
                  onChange={(e) =>
                    setTestConfig({ ...testConfig, rampUp: parseInt(e.target.value) })
                  }
                  disabled={isRunning}
                  className="w-full px-3 py-2 bg-secondary-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleStartTest}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                <Play size={16} />
                {isRunning ? "Running..." : "Start Test"}
              </Button>
              <Button variant="secondary" disabled={isRunning} className="flex items-center gap-2">
                <RotateCcw size={16} />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Latest Results Summary */}
        {latestTest && (
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div>
                  <p className="text-xs text-secondary-text mb-1">Avg Response Time</p>
                  <p className="text-2xl font-bold text-primary-text">
                    {latestTest.avgResponseTime}ms
                  </p>
                  <p className="text-xs text-secondary-text mt-1">
                    Min: {latestTest.minResponseTime}ms | Max: {latestTest.maxResponseTime}ms
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div>
                  <p className="text-xs text-secondary-text mb-1">Throughput</p>
                  <p className="text-2xl font-bold text-green-600">
                    {latestTest.throughput} req/s
                  </p>
                  <p className="text-xs text-secondary-text mt-1">
                    {latestTest.users} concurrent users
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div>
                  <p className="text-xs text-secondary-text mb-1">Success Rate</p>
                  <p className={`text-2xl font-bold ${latestTest.successRate >= 95 ? "text-green-600" : "text-red-600"}`}>
                    {latestTest.successRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-secondary-text mt-1">
                    {latestTest.errorRate.toFixed(1)}% errors
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div>
                  <p className="text-xs text-secondary-text mb-1">Test Duration</p>
                  <p className="text-2xl font-bold text-primary-text">
                    {latestTest.duration}s
                  </p>
                  <p className="text-xs text-secondary-text mt-1">
                    {latestTest.timestamp.toLocaleDateString("en-GB")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test History */}
        <Card>
          <CardHeader>
            <CardTitle>Test History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {LOAD_TEST_RESULTS.map((test) => (
                <button
                  key={test.timestamp.toISOString()}
                  onClick={() => setSelectedTest(test)}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    selectedTest?.timestamp === test.timestamp
                      ? "border-primary-text bg-black/5"
                      : "border-border hover:border-primary-text/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-primary-text">{test.name}</p>
                      <p className="text-xs text-secondary-text mt-1">
                        {test.timestamp.toLocaleDateString("en-GB", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        test.successRate >= 95
                          ? "bg-green-600/10 text-green-600"
                          : test.successRate >= 85
                          ? "bg-yellow-600/10 text-yellow-600"
                          : "bg-red-600/10 text-red-600"
                      }`}
                    >
                      {test.successRate.toFixed(1)}% success
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-secondary-text text-xs">Avg Response</p>
                      <p className="font-semibold text-primary-text">{test.avgResponseTime}ms</p>
                    </div>
                    <div>
                      <p className="text-secondary-text text-xs">Throughput</p>
                      <p className="font-semibold text-primary-text">{test.throughput} req/s</p>
                    </div>
                    <div>
                      <p className="text-secondary-text text-xs">Error Rate</p>
                      <p className="font-semibold text-primary-text">{test.errorRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-secondary-text text-xs">Max Response</p>
                      <p className="font-semibold text-primary-text">{test.maxResponseTime}ms</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle size={20} />
              Load Test Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                type: "success",
                title: "Baseline Performance Healthy",
                description: "50-user test maintains sub-50ms avg response times",
              },
              {
                type: "warning",
                title: "Scaling Issues at 500+ Users",
                description: "Response time degradation to 125ms - consider database optimization",
              },
              {
                type: "critical",
                title: "Stress Test Failure Threshold",
                description: "2000-user load causes 8.5% error rate - system reaches capacity",
              },
              {
                type: "info",
                title: "Recommended Capacity",
                description: "Application can safely handle up to 500 concurrent users",
              },
            ].map((rec, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 flex gap-3 ${
                  rec.type === "success"
                    ? "border-green-600 bg-green-600/5"
                    : rec.type === "warning"
                    ? "border-yellow-600 bg-yellow-600/5"
                    : rec.type === "critical"
                    ? "border-red-600 bg-red-600/5"
                    : "border-blue-600 bg-blue-600/5"
                }`}
              >
                {rec.type === "success" && <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />}
                {rec.type === "warning" && <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0" />}
                {rec.type === "critical" && <AlertTriangle size={20} className="text-red-600 flex-shrink-0" />}
                {rec.type === "info" && <TrendingUp size={20} className="text-blue-600 flex-shrink-0" />}
                <div>
                  <p className="font-semibold text-primary-text">{rec.title}</p>
                  <p className="text-sm text-secondary-text mt-1">{rec.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function LoadTesting() {
  return (
    <ProtectedRoute>
      <LoadTestingContent />
    </ProtectedRoute>
  );
}
