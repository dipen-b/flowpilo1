"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Download,
  Play,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

interface TestResult {
  id: string;
  name: string;
  type: "unit" | "integration" | "e2e" | "api";
  status: "passed" | "failed" | "pending";
  duration: number;
  coverage?: number;
}

interface TestSuite {
  name: string;
  type: "unit" | "integration" | "e2e" | "api";
  total: number;
  passed: number;
  failed: number;
  pending: number;
  coverage?: number;
}

const TEST_SUITES: TestSuite[] = [
  {
    name: "Unit Tests",
    type: "unit",
    total: 156,
    passed: 154,
    failed: 2,
    pending: 0,
    coverage: 92,
  },
  {
    name: "Integration Tests",
    type: "integration",
    total: 48,
    passed: 46,
    failed: 2,
    pending: 0,
    coverage: 88,
  },
  {
    name: "E2E Tests",
    type: "e2e",
    total: 32,
    passed: 31,
    failed: 1,
    pending: 0,
    coverage: 85,
  },
  {
    name: "API Tests",
    type: "api",
    total: 64,
    passed: 62,
    failed: 2,
    pending: 0,
    coverage: 90,
  },
];

const TEST_RESULTS: TestResult[] = [
  {
    id: "test-1",
    name: "Auth Service - Login validation",
    type: "unit",
    status: "passed",
    duration: 245,
  },
  {
    id: "test-2",
    name: "Task Creation - Form validation",
    type: "unit",
    status: "passed",
    duration: 312,
  },
  {
    id: "test-3",
    name: "Project Kanban Board - Drag & drop",
    type: "integration",
    status: "failed",
    duration: 1250,
  },
  {
    id: "test-4",
    name: "Dashboard - Data loading",
    type: "integration",
    status: "passed",
    duration: 856,
  },
  {
    id: "test-5",
    name: "E2E - Complete user workflow",
    type: "e2e",
    status: "pending",
    duration: 0,
  },
  {
    id: "test-6",
    name: "API - GET /tasks endpoint",
    type: "api",
    status: "passed",
    duration: 125,
  },
  {
    id: "test-7",
    name: "API - POST /tasks validation",
    type: "api",
    status: "failed",
    duration: 89,
  },
  {
    id: "test-8",
    name: "Performance - Page load time",
    type: "e2e",
    status: "passed",
    duration: 2150,
  },
];

function TestingContent() {
  const [isRunning, setIsRunning] = useState(false);
  const [testFilter, setTestFilter] = useState<"all" | TestResult["type"]>("all");

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 3000);
  };

  const totalTests = TEST_SUITES.reduce((sum, suite) => sum + suite.total, 0);
  const totalPassed = TEST_SUITES.reduce((sum, suite) => sum + suite.passed, 0);
  const totalFailed = TEST_SUITES.reduce((sum, suite) => sum + suite.failed, 0);
  const avgCoverage =
    TEST_SUITES.reduce((sum, suite) => sum + (suite.coverage || 0), 0) / TEST_SUITES.length;

  const filteredTests =
    testFilter === "all"
      ? TEST_RESULTS
      : TEST_RESULTS.filter((test) => test.type === testFilter);

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "passed":
        return "bg-green-600/10 text-green-600 border-green-600/20";
      case "failed":
        return "bg-red-600/10 text-red-600 border-red-600/20";
      case "pending":
        return "bg-yellow-600/10 text-yellow-600 border-yellow-600/20";
    }
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Testing & QA</h1>
            <p className="text-secondary-text">
              Unit, integration, E2E, and API tests with coverage tracking
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRunTests}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play size={16} />
              {isRunning ? "Running..." : "Run Tests"}
            </Button>
            <Button size="sm" variant="secondary" className="flex items-center gap-2">
              <Download size={16} />
              Report
            </Button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Total Tests</p>
                <p className="text-2xl font-bold text-primary-text">{totalTests}</p>
                <p className="text-xs text-green-600 mt-1">
                  {totalPassed} passed, {totalFailed} failed
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {((totalPassed / totalTests) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-secondary-text mt-1">Up from 94.2% last run</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Code Coverage</p>
                <p className="text-2xl font-bold text-blue-600">{avgCoverage.toFixed(1)}%</p>
                <p className="text-xs text-secondary-text mt-1">Target: 90%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Total Duration</p>
                <p className="text-2xl font-bold text-primary-text">2m 34s</p>
                <p className="text-xs text-secondary-text mt-1">Last run: 2m 41s</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Suites Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Test Suite Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {TEST_SUITES.map((suite) => (
                <div key={suite.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-primary-text">{suite.name}</p>
                      <p className="text-xs text-secondary-text">
                        {suite.passed}/{suite.total} passed
                        {suite.coverage && ` • ${suite.coverage}% coverage`}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`capitalize text-xs ${
                        suite.failed === 0
                          ? "bg-green-600/10 text-green-600"
                          : "bg-red-600/10 text-red-600"
                      }`}
                    >
                      {suite.failed === 0
                        ? "Passing"
                        : `${suite.failed} failing`}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-secondary-bg rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-green-600 transition-all"
                          style={{
                            width: `${(suite.passed / suite.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-secondary-text">
                        {((suite.passed / suite.total) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Test Results</CardTitle>
              <div className="flex items-center gap-2">
                {(["all", "unit", "integration", "e2e", "api"] as const).map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setTestFilter(type)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize ${
                        testFilter === type
                          ? "bg-black text-white"
                          : "bg-secondary-bg text-secondary-text"
                      }`}
                    >
                      {type}
                    </button>
                  )
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className={`p-4 rounded-lg border flex items-center justify-between ${getStatusColor(test.status)}`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {test.status === "passed" && <CheckCircle2 size={20} />}
                    {test.status === "failed" && <AlertCircle size={20} />}
                    {test.status === "pending" && <Clock size={20} />}
                    <div>
                      <p className="font-semibold text-primary-text">{test.name}</p>
                      <p className="text-xs text-secondary-text mt-1">
                        {test.type.toUpperCase()} •{" "}
                        {test.duration > 0 ? `${test.duration}ms` : "Running..."}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`capitalize text-xs ${getStatusColor(test.status)}`}>
                    {test.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Coverage Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Coverage Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "2 weeks ago", coverage: 84 },
                { date: "1 week ago", coverage: 87 },
                { date: "3 days ago", coverage: 89 },
                { date: "Today", coverage: 89 },
              ].map((data) => (
                <div key={data.date} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">{data.date}</span>
                    <span className="font-semibold text-primary-text">{data.coverage}%</span>
                  </div>
                  <div className="w-full bg-secondary-bg rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gray-600 transition-all"
                      style={{ width: `${data.coverage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testing Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  type: "Unit Tests",
                  count: "156 tests",
                  description: "Individual component and utility testing",
                  framework: "Jest",
                },
                {
                  type: "Integration Tests",
                  count: "48 tests",
                  description: "Feature modules and API interactions",
                  framework: "Jest + Testing Library",
                },
                {
                  type: "E2E Tests",
                  count: "32 tests",
                  description: "Complete user workflows and journeys",
                  framework: "Playwright",
                },
                {
                  type: "API Tests",
                  count: "64 tests",
                  description: "Backend endpoint validation and contracts",
                  framework: "Jest + Supertest",
                },
              ].map((test) => (
                <div key={test.type} className="p-4 bg-secondary-bg rounded-lg border border-border">
                  <p className="font-semibold text-primary-text mb-1">{test.type}</p>
                  <p className="text-sm text-primary-text font-medium mb-2">{test.count}</p>
                  <p className="text-xs text-secondary-text mb-2">{test.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {test.framework}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function Testing() {
  return (
    <ProtectedRoute>
      <TestingContent />
    </ProtectedRoute>
  );
}
