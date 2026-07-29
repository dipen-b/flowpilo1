"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { MOCK_TASKS, MOCK_PROJECTS, ROUTES } from "@/constants";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit2, Trash2, MessageSquare, Clock, CheckCircle2 } from "lucide-react";

function TaskDetailContent() {
  const params = useParams();
  const taskId = params.id as string;

  const task = MOCK_TASKS.find((t: any) => t.id === taskId);
  const project = task ? MOCK_PROJECTS.find((p: any) => p.id === task.projectId) : null;

  if (!task) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-secondary-text mb-4">Task not found</p>
          <Link href={ROUTES.TASKS}>
            <Button>Back to Tasks</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const isCompleted = task.status === "done";

  return (
    <AppLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={ROUTES.TASKS} className="flex items-center gap-2 text-primary-text hover:text-purple-400 mb-4">
            <ArrowLeft size={16} />
            Back to Tasks
          </Link>

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isCompleted ? (
                  <CheckCircle2 size={32} className="text-primary-text" />
                ) : (
                  <div className="w-8 h-8 border-2 border-primary-text rounded-full" />
                )}
                <div>
                  <h1 className={`text-3xl font-bold ${isCompleted ? "line-through text-secondary-text" : ""}`}>
                    {task.title}
                  </h1>
                  <Badge className="mt-2">{task.status.replace("_", " ")}</Badge>
                </div>
              </div>
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

          {project && (
            <Link href={ROUTES.PROJECT_DETAIL(project.id)} className="text-primary-text hover:text-purple-400">
              → {project.name}
            </Link>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Left Column - Description & Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold text-primary-text mb-2">Description</h3>
                <p className="text-secondary-text">
                  {task.description || "No description provided"}
                </p>
              </div>

              {/* Activity */}
              <div>
                <h3 className="font-semibold text-primary-text mb-4">Activity</h3>
                <div className="space-y-3">
                  {[
                    { user: "You", action: "created this task", time: "2 days ago" },
                    { user: "John Doe", action: "assigned to themselves", time: "1 day ago" },
                    { user: "Jane Smith", action: "commented", time: "5 hours ago" },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm">
                          <span className="font-semibold text-primary-text">{activity.user}</span>{" "}
                          <span className="text-secondary-text">{activity.action}</span>
                        </p>
                        <p className="text-xs text-secondary-text mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <h3 className="font-semibold text-primary-text mb-4 flex items-center gap-2">
                  <MessageSquare size={18} />
                  Comments (2)
                </h3>
                <div className="space-y-4">
                  {[
                    { author: "Jane Smith", text: "Looks good to me! Ready to review.", time: "5 hours ago" },
                    { author: "John Doe", text: "Nice work on the implementation.", time: "2 hours ago" },
                  ].map((comment, idx) => (
                    <div key={idx} className="p-4 bg-secondary-bg rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-primary-text">{comment.author}</span>
                        <span className="text-xs text-secondary-text">{comment.time}</span>
                      </div>
                      <p className="text-sm text-secondary-text">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Metadata */}
          <div className="space-y-4">
            {/* Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["backlog", "todo", "in_progress", "review", "done"].map((status) => (
                    <button
                      key={status}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left capitalize ${
                        task.status === status
                          ? "bg-black text-white"
                          : "bg-secondary-bg text-secondary-text hover:text-primary-text"
                      }`}
                    >
                      {status.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Assignee */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Assignee</CardTitle>
              </CardHeader>
              <CardContent>
                {task.assignee ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-primary-text">{task.assignee.name}</p>
                      <p className="text-xs text-secondary-text">{task.assignee.role || "Team Member"}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-secondary-text">Unassigned</p>
                )}
              </CardContent>
            </Card>

            {/* Priority */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={task.priority === "high" || task.priority === "critical" ? "danger" : "default"}>
                  {task.priority}
                </Badge>
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {task.startDate && (
                  <div>
                    <p className="text-secondary-text mb-1">Start Date</p>
                    <p className="text-primary-text">{new Date(task.startDate).toLocaleDateString()}</p>
                  </div>
                )}
                {task.dueDate && (
                  <div>
                    <p className="text-secondary-text mb-1">Due Date</p>
                    <p className="text-primary-text">{new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                )}
                {task.estimatedHours && (
                  <div>
                    <p className="text-secondary-text mb-1">Estimated Hours</p>
                    <p className="text-primary-text">{task.estimatedHours} hours</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Labels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {task.labels.map((label: string) => (
                      <Badge key={label} variant="secondary" size="sm">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function TaskDetail() {
  return (
    <ProtectedRoute>
      <TaskDetailContent />
    </ProtectedRoute>
  );
}
