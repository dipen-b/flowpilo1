"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  GitBranch,
  Server,
  Download,
  Play,
  ArrowRight,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface Deployment {
  id: string;
  version: string;
  environment: "staging" | "production";
  status: "success" | "failed" | "in_progress" | "queued";
  branch: string;
  commit: string;
  author: string;
  timestamp: Date;
  duration: number;
  tests: number;
  coverage: number;
}

interface PipelineStage {
  name: string;
  status: "success" | "failed" | "in_progress" | "skipped";
  duration: number;
  timestamp: Date;
}

const DEPLOYMENTS: Deployment[] = [
  {
    id: "deploy-1",
    version: "v1.8.2",
    environment: "production",
    status: "success",
    branch: "main",
    commit: "a3f5d92",
    author: "John Doe",
    timestamp: new Date(2026, 1, 28, 14, 30),
    duration: 245,
    tests: 300,
    coverage: 89,
  },
  {
    id: "deploy-2",
    version: "v1.8.1",
    environment: "production",
    status: "success",
    branch: "main",
    commit: "7e2b4c1",
    author: "Sarah Wilson",
    timestamp: new Date(2026, 1, 27, 10, 15),
    duration: 210,
    tests: 298,
    coverage: 88,
  },
  {
    id: "deploy-3",
    version: "v1.8.0-rc1",
    environment: "staging",
    status: "success",
    branch: "develop",
    commit: "f9c3e44",
    author: "Mike Johnson",
    timestamp: new Date(2026, 1, 26, 16, 45),
    duration: 280,
    tests: 295,
    coverage: 87,
  },
  {
    id: "deploy-4",
    version: "v1.7.9",
    environment: "production",
    status: "failed",
    branch: "main",
    commit: "2d1a8f5",
    author: "Jane Smith",
    timestamp: new Date(2026, 1, 25, 11, 0),
    duration: 156,
    tests: 290,
    coverage: 85,
  },
];

const PIPELINE_STAGES: PipelineStage[] = [
  {
    name: "Checkout Code",
    status: "success",
    duration: 8,
    timestamp: new Date(),
  },
  {
    name: "Install Dependencies",
    status: "success",
    duration: 45,
    timestamp: new Date(),
  },
  {
    name: "Lint & Format",
    status: "success",
    duration: 12,
    timestamp: new Date(),
  },
  {
    name: "Run Tests",
    status: "success",
    duration: 85,
    timestamp: new Date(),
  },
  {
    name: "Build",
    status: "success",
    duration: 62,
    timestamp: new Date(),
  },
  {
    name: "Deploy to Vercel",
    status: "in_progress",
    duration: 0,
    timestamp: new Date(),
  },
];

function DeploymentsContent() {
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);

  const getStatusColor = (status: Deployment["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-600/10 text-green-600 border-green-600/20";
      case "failed":
        return "bg-red-600/10 text-red-600 border-red-600/20";
      case "in_progress":
        return "bg-blue-600/10 text-blue-600 border-blue-600/20";
      case "queued":
        return "bg-yellow-600/10 text-yellow-600 border-yellow-600/20";
    }
  };

  const getPipelineStatusColor = (status: PipelineStage["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-600/10 text-green-600";
      case "failed":
        return "bg-red-600/10 text-red-600";
      case "in_progress":
        return "bg-blue-600/10 text-blue-600";
      case "skipped":
        return "bg-gray-600/10 text-gray-600";
    }
  };

  const latestDeployment = DEPLOYMENTS[0];

  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Deployments & CI/CD</h1>
            <p className="text-secondary-text">GitHub Actions pipeline and deployment history</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex items-center gap-2">
              <GitBranch size={16} />
              View Pipeline
            </Button>
            <Button className="flex items-center gap-2">
              <Play size={16} />
              New Deployment
            </Button>
          </div>
        </div>

        {/* Current Pipeline Status */}
        {latestDeployment && (
          <Card className="border-blue-600/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Pipeline: {latestDeployment.version}</span>
                <Badge variant="default" className="bg-blue-600/20 text-blue-600">
                  In Progress
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {PIPELINE_STAGES.map((stage, idx) => (
                  <div key={stage.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {stage.status === "success" && (
                          <CheckCircle2 size={18} className="text-green-600" />
                        )}
                        {stage.status === "failed" && (
                          <AlertCircle size={18} className="text-red-600" />
                        )}
                        {stage.status === "in_progress" && (
                          <Clock size={18} className="text-blue-600 animate-spin" />
                        )}
                        <span className="font-medium text-primary-text">{stage.name}</span>
                      </div>
                      <span className="text-xs text-secondary-text">{stage.duration}s</span>
                    </div>
                    {idx < PIPELINE_STAGES.length - 1 && (
                      <div className="pl-6 pb-2">
                        <ArrowRight size={16} className="text-secondary-text" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Deployment Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Successful Deployments</p>
                <p className="text-2xl font-bold text-green-600">3</p>
                <p className="text-xs text-secondary-text mt-1">This week</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Failed Deployments</p>
                <p className="text-2xl font-bold text-red-600">1</p>
                <p className="text-xs text-secondary-text mt-1">Success rate: 75%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Avg Deployment Time</p>
                <p className="text-2xl font-bold text-primary-text">239s</p>
                <p className="text-xs text-secondary-text mt-1">~4 minutes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Last Deployment</p>
                <p className="text-2xl font-bold text-primary-text">2m ago</p>
                <p className="text-xs text-green-600 mt-1">Successful</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deployment History */}
        <Card>
          <CardHeader>
            <CardTitle>Deployment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DEPLOYMENTS.map((deployment) => (
                <button
                  key={deployment.id}
                  onClick={() => setSelectedDeployment(deployment)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    selectedDeployment?.id === deployment.id
                      ? "border-primary-text bg-black/5"
                      : "border-border hover:border-primary-text/50"
                  } ${getStatusColor(deployment.status)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {deployment.status === "success" && (
                        <CheckCircle2 size={20} className="text-green-600" />
                      )}
                      {deployment.status === "failed" && (
                        <AlertCircle size={20} className="text-red-600" />
                      )}
                      <div>
                        <p className="font-semibold text-primary-text">{deployment.version}</p>
                        <p className="text-xs text-secondary-text mt-1">
                          {deployment.timestamp.toLocaleDateString("en-GB", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`capitalize text-xs ${
                        deployment.environment === "production"
                          ? "bg-red-600/10 text-red-600"
                          : "bg-blue-600/10 text-blue-600"
                      }`}
                    >
                      {deployment.environment}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-secondary-text text-xs">Branch</p>
                      <p className="font-semibold text-primary-text">{deployment.branch}</p>
                    </div>
                    <div>
                      <p className="text-secondary-text text-xs">Author</p>
                      <p className="font-semibold text-primary-text">{deployment.author}</p>
                    </div>
                    <div>
                      <p className="text-secondary-text text-xs">Tests</p>
                      <p className="font-semibold text-primary-text">{deployment.tests}</p>
                    </div>
                    <div>
                      <p className="text-secondary-text text-xs">Coverage</p>
                      <p className="font-semibold text-primary-text">{deployment.coverage}%</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Environments */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server size={20} />
                Production
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-secondary-text mb-1">Current Version</p>
                <p className="font-semibold text-primary-text text-lg">v1.8.2</p>
              </div>
              <div>
                <p className="text-sm text-secondary-text mb-1">Deployment Status</p>
                <Badge variant="default" className="bg-green-600/20 text-green-600">
                  Live & Healthy
                </Badge>
              </div>
              <div>
                <p className="text-sm text-secondary-text mb-1">Last Deployment</p>
                <p className="text-sm">28 Feb, 14:30 by John Doe</p>
              </div>
              <Button variant="secondary" className="w-full flex items-center gap-2">
                <Download size={16} />
                View Logs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap size={20} />
                Staging
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-secondary-text mb-1">Current Version</p>
                <p className="font-semibold text-primary-text text-lg">v1.8.0-rc1</p>
              </div>
              <div>
                <p className="text-sm text-secondary-text mb-1">Deployment Status</p>
                <Badge variant="default" className="bg-blue-600/20 text-blue-600">
                  Testing
                </Badge>
              </div>
              <div>
                <p className="text-sm text-secondary-text mb-1">Last Deployment</p>
                <p className="text-sm">26 Feb, 16:45 by Mike Johnson</p>
              </div>
              <Button variant="secondary" className="w-full flex items-center gap-2">
                <Download size={16} />
                View Logs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CI/CD Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>CI/CD Pipeline Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: "GitHub Actions",
                  description: "Automated workflow on every push to main",
                  status: "Active",
                },
                {
                  title: "Testing",
                  description: "Jest unit tests, E2E with Playwright",
                  status: "Enabled",
                },
                {
                  title: "Vercel Deployment",
                  description: "Frontend auto-deployed on main branch",
                  status: "Active",
                },
                {
                  title: "Environment Variables",
                  description: "Secrets encrypted and auto-injected",
                  status: "Secure",
                },
                {
                  title: "Docker Images",
                  description: "Built and published to Docker Hub",
                  status: "Running",
                },
                {
                  title: "Database Migrations",
                  description: "Auto-run before production deployment",
                  status: "Enabled",
                },
              ].map((config) => (
                <div key={config.title} className="p-4 bg-secondary-bg rounded-lg border border-border">
                  <p className="font-semibold text-primary-text mb-1">{config.title}</p>
                  <p className="text-xs text-secondary-text mb-2">{config.description}</p>
                  <Badge variant="secondary" className="text-xs bg-green-600/10 text-green-600">
                    {config.status}
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

export default function Deployments() {
  return (
    <ProtectedRoute>
      <DeploymentsContent />
    </ProtectedRoute>
  );
}
