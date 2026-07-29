"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { MOCK_PROJECTS, MOCK_TASKS, ROUTES } from "@/constants";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

function ProjectDetailContent() {
  const params = useParams();
  const projectId = params.id as string;

  const project = MOCK_PROJECTS.find((p: any) => p.id === projectId);
  const projectTasks = MOCK_TASKS.filter((t: any) => t.projectId === projectId);

  if (!project) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-secondary-text mb-4">Project not found</p>
          <Link href={ROUTES.PROJECTS}>
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const priorityColors: Record<string, string> = {
    critical: "bg-red-600",
    high: "bg-orange-600",
    medium: "bg-yellow-600",
    low: "bg-blue-600",
  };

  return (
    <AppLayout>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={ROUTES.PROJECTS} className="flex items-center gap-2 text-primary-text hover:text-purple-400 mb-4">
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <Badge variant="primary">{project.status.replace("_", " ")}</Badge>
              </div>
              <p className="text-secondary-text">{project.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex items-center gap-2">
                <Edit2 size={16} />
                Edit
              </Button>
              <Button variant="danger" size="sm" className="flex items-center gap-2">
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-text">{project.progress}%</p>
                <p className="text-sm text-secondary-text">Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-text">{projectTasks.length}</p>
                <p className="text-sm text-secondary-text">Tasks</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-text">{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}</p>
                <p className="text-sm text-secondary-text">Due Date</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg font-bold text-primary-text">{project.owner.name}</p>
                <p className="text-sm text-secondary-text">Owner</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-secondary-text mb-1">Status</p>
                <p className="text-primary-text capitalize">{project.status.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-text mb-1">Priority</p>
                <Badge>{project.priority}</Badge>
              </div>
              <div>
                <p className="text-sm text-secondary-text mb-1">Start Date</p>
                <p className="text-primary-text">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-text mb-1">Description</p>
                <p className="text-primary-text">{project.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="w-full h-4 bg-card-bg rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-black transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-secondary-text text-center">{project.progress}% Complete</p>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-text">Completed Tasks</span>
                    <span className="text-primary-text">{projectTasks.filter((t: any) => t.status === "done").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-text">In Progress</span>
                    <span className="text-primary-text">{projectTasks.filter((t: any) => t.status === "in_progress").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-text">Pending</span>
                    <span className="text-primary-text">{projectTasks.filter((t: any) => t.status !== "done" && t.status !== "in_progress").length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Tasks */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Project Tasks</CardTitle>
              <CardDescription>{projectTasks.length} tasks in this project</CardDescription>
            </div>
            <Link href={`${ROUTES.TASKS}?project=${projectId}`}>
              <Button size="sm">View All Tasks</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {projectTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-secondary-text">No tasks yet. Create one to get started.</p>
              </div>
            ) : (
              <div className="space-y-0 divide-y divide-border">
                {projectTasks.slice(0, 5).map((task: any) => (
                  <Link key={task.id} href={ROUTES.TASK_DETAIL(task.id)}>
                    <div className="p-4 hover:bg-secondary-bg transition-colors flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-primary-text">{task.title}</h4>
                          <Badge size="sm">{task.status.replace("_", " ")}</Badge>
                        </div>
                        <p className="text-xs text-secondary-text">
                          {task.assignee?.name || "Unassigned"} • {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
                        </p>
                      </div>
                      <Badge size="sm" variant={task.priority === "high" ? "danger" : "default"}>
                        {task.priority}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function ProjectDetail() {
  return (
    <ProtectedRoute>
      <ProjectDetailContent />
    </ProtectedRoute>
  );
}
