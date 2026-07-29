"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Download,
  RefreshCw,
  Lock,
} from "lucide-react";
import { useState } from "react";

interface SecurityIssue {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  type: "vulnerability" | "dependency" | "config" | "code";
  status: "open" | "fixed" | "acknowledged";
  affectedComponent: string;
  cve?: string;
}

interface SecurityScan {
  name: string;
  status: "pass" | "warn" | "fail";
  score: number;
  maxScore: number;
}

const SECURITY_ISSUES: SecurityIssue[] = [
  {
    id: "sec-1",
    title: "Outdated lodash dependency",
    severity: "medium",
    type: "dependency",
    status: "acknowledged",
    affectedComponent: "utils/helpers.ts",
    cve: "CVE-2021-23337",
  },
  {
    id: "sec-2",
    title: "Missing CSRF token validation",
    severity: "high",
    type: "code",
    status: "open",
    affectedComponent: "src/api/client.ts",
  },
  {
    id: "sec-3",
    title: "Hardcoded API endpoint in client",
    severity: "medium",
    type: "code",
    status: "fixed",
    affectedComponent: "src/constants/api.ts",
  },
  {
    id: "sec-4",
    title: "Missing Content Security Policy header",
    severity: "low",
    type: "config",
    status: "open",
    affectedComponent: "next.config.js",
  },
  {
    id: "sec-5",
    title: "Unencrypted sensitive data in localStorage",
    severity: "high",
    type: "code",
    status: "open",
    affectedComponent: "src/stores/auth.ts",
  },
];

const SECURITY_SCANS: SecurityScan[] = [
  {
    name: "OWASP Top 10",
    status: "pass",
    score: 9,
    maxScore: 10,
  },
  {
    name: "Dependency Audit",
    status: "warn",
    score: 7,
    maxScore: 10,
  },
  {
    name: "Code Analysis",
    status: "pass",
    score: 8,
    maxScore: 10,
  },
  {
    name: "Infrastructure",
    status: "pass",
    score: 9,
    maxScore: 10,
  },
];

function SecurityContent() {
  const [selectedSeverity, setSelectedSeverity] = useState<SecurityIssue["severity"] | "all">("all");
  const [isScanning, setIsScanning] = useState(false);

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  const filteredIssues =
    selectedSeverity === "all"
      ? SECURITY_ISSUES
      : SECURITY_ISSUES.filter((issue) => issue.severity === selectedSeverity);

  const criticalCount = SECURITY_ISSUES.filter((i) => i.severity === "critical").length;
  const highCount = SECURITY_ISSUES.filter((i) => i.severity === "high").length;
  const mediumCount = SECURITY_ISSUES.filter((i) => i.severity === "medium").length;
  const fixedCount = SECURITY_ISSUES.filter((i) => i.status === "fixed").length;

  const overallScore =
    SECURITY_SCANS.reduce((sum, scan) => sum + (scan.score / scan.maxScore) * 100, 0) /
    SECURITY_SCANS.length;

  const getSeverityColor = (severity: SecurityIssue["severity"]) => {
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

  const getScanStatusColor = (status: SecurityScan["status"]) => {
    switch (status) {
      case "pass":
        return "bg-green-600/10 text-green-600";
      case "warn":
        return "bg-yellow-600/10 text-yellow-600";
      case "fail":
        return "bg-red-600/10 text-red-600";
    }
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Security Audit</h1>
            <p className="text-secondary-text">
              Vulnerability scanning, dependency audit, and security compliance
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRunScan}
              disabled={isScanning}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className={isScanning ? "animate-spin" : ""} />
              {isScanning ? "Scanning..." : "Run Scan"}
            </Button>
            <Button size="sm" variant="secondary" className="flex items-center gap-2">
              <Download size={16} />
              Report
            </Button>
          </div>
        </div>

        {/* Security Score */}
        <Card className="border-primary-text border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={24} className="text-primary-text" />
              Overall Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-8 border-secondary-bg" />
                <div
                  className="absolute inset-0 rounded-full border-8 border-primary-text transition-all"
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, calc(50% + ${
                      Math.cos((overallScore / 100) * Math.PI * 2 - Math.PI / 2) * 50
                    }%), calc(50% + ${
                      Math.sin((overallScore / 100) * Math.PI * 2 - Math.PI / 2) * 50
                    }%))`,
                  }}
                />
                <div className="absolute inset-4 rounded-full bg-card-bg flex items-center justify-center flex-col">
                  <p className="text-3xl font-bold text-primary-text">
                    {overallScore.toFixed(0)}
                  </p>
                  <p className="text-xs text-secondary-text">/ 100</p>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm text-secondary-text mb-2">Issues by Severity</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Critical</span>
                      <Badge variant="default" className="bg-red-600/10 text-red-600">
                        {criticalCount}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High</span>
                      <Badge variant="default" className="bg-orange-600/10 text-orange-600">
                        {highCount}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Medium</span>
                      <Badge variant="default" className="bg-yellow-600/10 text-yellow-600">
                        {mediumCount}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-secondary-text">Fixed Issues: {fixedCount}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Scans */}
        <Card>
          <CardHeader>
            <CardTitle>Security Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {SECURITY_SCANS.map((scan) => (
                <div key={scan.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-primary-text">{scan.name}</p>
                      <Badge
                        variant="secondary"
                        className={`capitalize text-xs ${getScanStatusColor(scan.status)}`}
                      >
                        {scan.status}
                      </Badge>
                    </div>
                    <span className="text-sm font-semibold text-primary-text">
                      {scan.score}/{scan.maxScore}
                    </span>
                  </div>
                  <div className="w-full bg-secondary-bg rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        scan.score >= 9
                          ? "bg-green-600"
                          : scan.score >= 7
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${(scan.score / scan.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Issues */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Security Issues</CardTitle>
              <div className="flex items-center gap-2">
                {(["all", "critical", "high", "medium", "low"] as const).map((severity) => (
                  <button
                    key={severity}
                    onClick={() => setSelectedSeverity(severity)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize ${
                      selectedSeverity === severity
                        ? "bg-black text-white"
                        : "bg-secondary-bg text-secondary-text"
                    }`}
                  >
                    {severity}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-4 rounded-lg border space-y-2 ${getSeverityColor(
                    issue.severity
                  )}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      {issue.severity === "critical" || issue.severity === "high" ? (
                        <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold text-primary-text">{issue.title}</p>
                        <p className="text-xs text-secondary-text mt-1">
                          {issue.affectedComponent}
                        </p>
                        {issue.cve && (
                          <p className="text-xs text-secondary-text">
                            {issue.cve}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Badge
                        variant="secondary"
                        className={`capitalize text-xs ${getSeverityColor(issue.severity)}`}
                      >
                        {issue.severity}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`capitalize text-xs ${
                          issue.status === "fixed"
                            ? "bg-green-600/10 text-green-600"
                            : issue.status === "acknowledged"
                            ? "bg-yellow-600/10 text-yellow-600"
                            : "bg-red-600/10 text-red-600"
                        }`}
                      >
                        {issue.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle>Security Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: "Authentication",
                  checks: [
                    "JWT token encryption",
                    "Secure password hashing",
                    "2FA support enabled",
                  ],
                },
                {
                  title: "Data Protection",
                  checks: [
                    "HTTPS/TLS enabled",
                    "Data encryption at rest",
                    "Sensitive data masking",
                  ],
                },
                {
                  title: "Input Validation",
                  checks: [
                    "XSS prevention",
                    "SQL injection protection",
                    "CSRF token validation",
                  ],
                },
                {
                  title: "Infrastructure",
                  checks: [
                    "Rate limiting enabled",
                    "CORS properly configured",
                    "Security headers set",
                  ],
                },
              ].map((category) => (
                <div
                  key={category.title}
                  className="p-4 bg-secondary-bg rounded-lg border border-border"
                >
                  <p className="font-semibold text-primary-text mb-3 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-green-600" />
                    {category.title}
                  </p>
                  <ul className="space-y-2">
                    {category.checks.map((check) => (
                      <li key={check} className="text-sm text-secondary-text flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-600" />
                        {check}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Secrets Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} />
              Secrets Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-text mb-2">Stored Secrets</p>
                <p className="font-semibold text-primary-text text-lg">12</p>
                <p className="text-xs text-green-600">All encrypted</p>
              </div>
              <div>
                <p className="text-sm text-secondary-text mb-2">Last Rotation</p>
                <p className="font-semibold text-primary-text">7 days ago</p>
                <p className="text-xs text-secondary-text">On schedule</p>
              </div>
            </div>
            <div className="p-3 bg-green-600/10 rounded-lg border border-green-600/20">
              <p className="text-sm text-green-600">
                ✓ All secrets properly encrypted and access-controlled
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function Security() {
  return (
    <ProtectedRoute>
      <SecurityContent />
    </ProtectedRoute>
  );
}
