"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  AlertCircle,
  Download,
  Filter,
  Trash2,
  ChevronRight,
  Clock,
  User,
  Code,
} from "lucide-react";
import { useState } from "react";

interface ErrorLog {
  id: string;
  message: string;
  type: "error" | "warning" | "info";
  severity: "critical" | "high" | "medium" | "low";
  stack?: string;
  user?: string;
  timestamp: Date;
  count: number;
  resolved: boolean;
  source: string;
}

const ERROR_LOGS: ErrorLog[] = [];

function ErrorsContent() {
  const [filterSeverity, setFilterSeverity] = useState<ErrorLog["severity"] | "all">("all");
  const [filterResolved, setFilterResolved] = useState<boolean | "all">("all");
  const [expandedError, setExpandedError] = useState<string | null>(null);

  const filteredErrors = ERROR_LOGS.filter((error) => {
    const matchesSeverity = filterSeverity === "all" || error.severity === filterSeverity;
    const matchesResolved =
      filterResolved === "all" || error.resolved === filterResolved;
    return matchesSeverity && matchesResolved;
  });

  const criticalCount = ERROR_LOGS.filter((e) => e.severity === "critical" && !e.resolved).length;
  const totalErrors = ERROR_LOGS.filter((e) => !e.resolved).length;
  const resolvedCount = ERROR_LOGS.filter((e) => e.resolved).length;

  const getSeverityColor = (severity: ErrorLog["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-600/10 text-red-600 border-red-600/20";
      case "high":
        return "bg-orange-600/10 text-orange-600 border-orange-600/20";
      case "medium":
        return "bg-yellow-600/10 text-yellow-600 border-yellow-600/20";
      case "low":
        return "bg-blue-600/10 text-blue-600 border-blue-600/20";
    }
  };

  const getTypeIcon = (type: ErrorLog["type"]) => {
    switch (type) {
      case "error":
        return "🔴";
      case "warning":
        return "🟡";
      case "info":
        return "🔵";
    }
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Error Tracking</h1>
            <p className="text-secondary-text">Monitor and manage application errors</p>
          </div>
          <Button size="sm" variant="secondary" className="flex items-center gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>

        {/* Error Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Critical Errors</p>
                <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Active Issues</p>
                <p className="text-2xl font-bold text-orange-600">{totalErrors}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Occurrences (24h)</p>
                <p className="text-2xl font-bold text-primary-text">
                  {ERROR_LOGS.reduce((sum, e) => sum + e.count, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-secondary-text" />
            <span className="text-sm text-secondary-text">Severity:</span>
          </div>
          {(["all", "critical", "high", "medium", "low"] as const).map((severity) => (
            <button
              key={severity}
              onClick={() => setFilterSeverity(severity)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize ${
                filterSeverity === severity
                  ? "bg-black text-white"
                  : "bg-secondary-bg text-secondary-text hover:text-primary-text"
              }`}
            >
              {severity}
            </button>
          ))}

          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-secondary-text">Status:</span>
          </div>
          {(["all", true, false] as const).map((resolved) => (
            <button
              key={resolved === "all" ? "all" : resolved ? "resolved" : "active"}
              onClick={() => setFilterResolved(resolved)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filterResolved === resolved
                  ? "bg-black text-white"
                  : "bg-secondary-bg text-secondary-text hover:text-primary-text"
              }`}
            >
              {resolved === "all" ? "All" : resolved ? "Resolved" : "Active"}
            </button>
          ))}
        </div>

        {/* Error List */}
        <Card>
          <CardHeader>
            <CardTitle>Error Log ({filteredErrors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredErrors.map((error) => (
                <div key={error.id} className="space-y-0">
                  <button
                    onClick={() =>
                      setExpandedError(expandedError === error.id ? null : error.id)
                    }
                    className="w-full p-4 rounded-lg border border-border hover:bg-secondary-bg transition-colors text-left flex items-center justify-between"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-2xl mt-0.5">{getTypeIcon(error.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-primary-text">{error.message}</p>
                          <Badge
                            variant="secondary"
                            className={`capitalize text-xs ${getSeverityColor(error.severity)}`}
                          >
                            {error.severity}
                          </Badge>
                          {error.resolved && (
                            <Badge variant="secondary" className="text-xs bg-green-600/10 text-green-600">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-secondary-text">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {error.timestamp.toLocaleDateString("en-GB")}
                          </span>
                          {error.user && (
                            <span className="flex items-center gap-1">
                              <User size={12} />
                              {error.user}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Code size={12} />
                            {error.source}
                          </span>
                          <span className="ml-auto font-semibold">
                            {error.count} occurrence{error.count > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      size={20}
                      className={`transition-transform flex-shrink-0 ${
                        expandedError === error.id ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {/* Expanded details */}
                  {expandedError === error.id && (
                    <div className="p-4 bg-secondary-bg rounded-b-lg border border-t-0 border-border space-y-3">
                      {error.stack && (
                        <div>
                          <p className="text-sm font-semibold text-primary-text mb-2">Stack Trace</p>
                          <code className="block p-3 bg-card-bg rounded text-xs text-primary-text overflow-x-auto whitespace-pre-wrap break-words font-mono">
                            {error.stack}
                          </code>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 border-t border-border">
                        <Button size="sm" variant="secondary">
                          View Source
                        </Button>
                        <Button size="sm" variant="secondary">
                          Create Issue
                        </Button>
                        {!error.resolved && (
                          <Button size="sm" variant="secondary" className="ml-auto">
                            Mark as Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Top Error Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ERROR_LOGS.filter((e) => !e.resolved)
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .map((error) => (
                  <div key={error.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-primary-text">{error.source}</span>
                      <span className="text-secondary-text">{error.count} errors</span>
                    </div>
                    <div className="w-full bg-secondary-bg rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-black transition-all"
                        style={{
                          width: `${(error.count / Math.max(...ERROR_LOGS.map((e) => e.count))) * 100}%`,
                        }}
                      />
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

export default function Errors() {
  return (
    <ProtectedRoute>
      <ErrorsContent />
    </ProtectedRoute>
  );
}
