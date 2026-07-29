"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { ROUTES } from "@/constants";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { Search, Plus, Filter, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import Input from "@/components/ui/Input";
import { useProjectsStore } from "@/stores/projects";

function ProjectsContent() {
  const { projects, deleteProject } = useProjectsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    planning: "bg-gray-600",
    active: "bg-gray-700",
    on_hold: "bg-gray-500",
    at_risk: "bg-black text-white",
    completed: "bg-gray-400",
    cancelled: "bg-gray-400",
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-primary-text">Projects</h1>
            <p className="text-lg text-secondary-text">Manage and track all your projects</p>
          </div>
          <Link href={`${ROUTES.PROJECTS}/new`}>
            <Button className="flex items-center gap-2 px-6 py-3 font-semibold text-base">
              <Plus size={18} />
              New Project
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-secondary-bg rounded-xl border border-border p-6 space-y-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-text" size={18} />
              <Input
                placeholder="Search projects by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 text-base"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-3 flex-wrap items-center">
              <button
                onClick={() => setStatusFilter(null)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  !statusFilter
                    ? "bg-primary-text text-card-bg"
                    : "bg-card-bg text-secondary-text hover:text-primary-text border border-border"
                }`}
              >
                All
              </button>
              {["planning", "active", "on_hold", "at_risk", "completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    statusFilter === status
                      ? "bg-primary-text text-card-bg"
                      : "bg-card-bg text-secondary-text hover:text-primary-text border border-border"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-secondary-bg rounded-xl border border-border overflow-hidden">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 px-6">
              <p className="text-secondary-text text-lg mb-6">No projects found</p>
              <Link href={`${ROUTES.PROJECTS}/new`}>
                <Button className="px-6 py-3 font-semibold">Create your first project</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredProjects.map((project: any) => (
                <Link
                  key={project.id}
                  href={ROUTES.PROJECT_DETAIL(project.id)}
                  className="block hover:bg-card-bg/50 transition-colors"
                >
                  <div className="p-6 space-y-4">
                    {/* Project Header */}
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-primary-text">{project.name}</h3>
                          <Badge variant={project.status === "active" ? "primary" : "default"} className="text-xs font-semibold">
                            {project.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-base text-secondary-text mb-3">{project.description}</p>
                        <div className="flex items-center gap-6 text-sm text-secondary-text">
                          <span className="font-medium">Owner: {project.owner.name}</span>
                          {project.dueDate && (
                            <span className="font-medium">Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex-shrink-0 min-w-48">
                        <div className="w-full h-2.5 bg-border rounded-full overflow-hidden mb-2">
                          <div
                            className="h-full bg-primary-text transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <p className="text-sm font-semibold text-primary-text text-right">{project.progress}% complete</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-2 border-t border-border">
                      <Link href={`${ROUTES.PROJECTS}/${project.id}/edit`}>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-sm font-semibold">
                          <Edit size={16} />
                          Edit
                        </Button>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (window.confirm("Delete this project?")) {
                            deleteProject(project.id);
                          }
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default function Projects() {
  return (
    <ProtectedRoute>
      <ProjectsContent />
    </ProtectedRoute>
  );
}
