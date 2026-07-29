"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  FileText,
  BookOpen,
  Code,
  Users,
  Settings,
  Download,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  sections: string[];
}

const DOC_SECTIONS: DocSection[] = [
  {
    id: "setup",
    title: "Setup & Installation",
    icon: <Settings size={24} />,
    description: "Get started with FlowPilot development environment",
    sections: [
      "Prerequisites",
      "Repository Setup",
      "Environment Configuration",
      "Running Locally",
      "Database Setup",
      "Development Tools",
    ],
  },
  {
    id: "architecture",
    title: "Architecture Guide",
    icon: <Code size={24} />,
    description: "Understand the system design and component structure",
    sections: [
      "System Overview",
      "Frontend Architecture",
      "Backend Architecture",
      "Database Design",
      "API Design",
      "State Management",
      "Component Structure",
    ],
  },
  {
    id: "api",
    title: "API Documentation",
    icon: <FileText size={24} />,
    description: "Complete REST API reference and examples",
    sections: [
      "Authentication",
      "Projects API",
      "Tasks API",
      "Teams API",
      "Sprints API",
      "Reports API",
      "Rate Limiting",
      "Error Handling",
    ],
  },
  {
    id: "user-guide",
    title: "User Guide",
    icon: <BookOpen size={24} />,
    description: "How to use FlowPilot features and workflows",
    sections: [
      "Getting Started",
      "Projects Management",
      "Task Management",
      "Kanban Board",
      "Timeline View",
      "Team Collaboration",
      "Reports & Analytics",
      "Settings & Preferences",
    ],
  },
  {
    id: "admin",
    title: "Admin Guide",
    icon: <Users size={24} />,
    description: "Administration, configuration, and maintenance",
    sections: [
      "Workspace Setup",
      "User Management",
      "Team Management",
      "Security Settings",
      "Integrations",
      "Backup & Recovery",
      "Monitoring",
      "Troubleshooting",
    ],
  },
  {
    id: "contributing",
    title: "Contributing Guide",
    icon: <Code size={24} />,
    description: "Developer guidelines and contribution process",
    sections: [
      "Development Setup",
      "Code Standards",
      "Git Workflow",
      "Testing Guidelines",
      "Pull Request Process",
      "Commit Messages",
      "Code Review",
      "Release Process",
    ],
  },
];

function DocsContent() {
  const [selectedSection, setSelectedSection] = useState<DocSection | null>(null);

  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Documentation</h1>
            <p className="text-secondary-text">
              Complete guides, API docs, and reference materials
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex items-center gap-2">
              <Download size={16} />
              PDF Guide
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <ExternalLink size={16} />
              External Docs
            </Button>
          </div>
        </div>

        {/* Documentation Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Documentation Hub</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {DOC_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    selectedSection?.id === section.id
                      ? "border-primary-text bg-black/5"
                      : "border-border hover:border-primary-text/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-primary-text">{section.icon}</div>
                  </div>
                  <h3 className="font-semibold text-primary-text mb-1">{section.title}</h3>
                  <p className="text-xs text-secondary-text mb-3">{section.description}</p>
                  <p className="text-xs text-primary-text font-medium">
                    {section.sections.length} sections
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Section Details */}
        {selectedSection && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-primary-text">{selectedSection.icon}</span>
                {selectedSection.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-secondary-text">{selectedSection.description}</p>

              <div className="space-y-2 border-t border-border pt-4">
                <p className="font-semibold text-primary-text text-sm">Contents</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedSection.sections.map((section) => (
                    <button
                      key={section}
                      className="p-3 text-left rounded-lg bg-secondary-bg hover:bg-card-bg transition-colors border border-border text-sm text-primary-text"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-primary-text">→</span>
                        {section}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Start Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                {
                  step: "1",
                  title: "Clone Repository",
                  command: "git clone https://github.com/flowpilot/app.git",
                },
                {
                  step: "2",
                  title: "Install Dependencies",
                  command: "npm install",
                },
                {
                  step: "3",
                  title: "Setup Environment",
                  command: "cp .env.example .env.local",
                },
                {
                  step: "4",
                  title: "Start Development Server",
                  command: "npm run dev",
                },
              ].map((item) => (
                <div key={item.step} className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-semibold text-sm">
                      {item.step}
                    </div>
                    <p className="font-semibold text-primary-text">{item.title}</p>
                  </div>
                  <div className="ml-11 p-3 bg-secondary-bg rounded-lg border border-border font-mono text-sm text-primary-text overflow-x-auto">
                    {item.command}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle>API Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { method: "GET", endpoint: "/api/tasks", description: "List all tasks" },
                {
                  method: "POST",
                  endpoint: "/api/tasks",
                  description: "Create new task",
                },
                { method: "GET", endpoint: "/api/projects", description: "List projects" },
                {
                  method: "PATCH",
                  endpoint: "/api/tasks/:id",
                  description: "Update task",
                },
              ].map((endpoint) => (
                <div
                  key={endpoint.endpoint}
                  className="p-3 rounded-lg bg-secondary-bg border border-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold text-white ${
                        endpoint.method === "GET"
                          ? "bg-blue-600"
                          : endpoint.method === "POST"
                          ? "bg-green-600"
                          : "bg-yellow-600"
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <div>
                      <p className="font-mono text-sm text-primary-text">
                        {endpoint.endpoint}
                      </p>
                      <p className="text-xs text-secondary-text">{endpoint.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "GitHub Repository", icon: "🐙" },
                { title: "Issue Tracker", icon: "🐛" },
                { title: "Discussions Forum", icon: "💬" },
                { title: "Change Log", icon: "📝" },
                { title: "Community Slack", icon: "💬" },
                { title: "Feature Requests", icon: "✨" },
              ].map((resource) => (
                <button
                  key={resource.title}
                  className="p-4 rounded-lg bg-secondary-bg border border-border hover:border-primary-text transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{resource.icon}</span>
                    <div>
                      <p className="font-semibold text-primary-text text-sm">
                        {resource.title}
                      </p>
                      <p className="text-xs text-primary-text">Open →</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function Docs() {
  return (
    <ProtectedRoute>
      <DocsContent />
    </ProtectedRoute>
  );
}
