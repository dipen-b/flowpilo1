"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { MOCK_TASKS, MOCK_PROJECTS, ROUTES } from "@/constants";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { Search, Plus, Filter, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import Input from "@/components/ui/Input";

function TasksContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  const filteredTasks = MOCK_TASKS.filter((task: any) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const taskStats = {
    total: MOCK_TASKS.length,
    completed: MOCK_TASKS.filter((t: any) => t.status === "done").length,
    inProgress: MOCK_TASKS.filter((t: any) => t.status === "in_progress").length,
    pending: MOCK_TASKS.filter((t: any) => t.status !== "done" && t.status !== "in_progress").length,
  };

  const priorityColors: Record<string, string> = {
    critical: "bg-black text-white",
    high: "bg-gray-700 text-white",
    medium: "bg-gray-500 text-white",
    low: "bg-gray-300 text-primary-text",
  };

  const statusColors: Record<string, string> = {
    backlog: "bg-gray-600",
    todo: "bg-gray-500",
    in_progress: "bg-gray-700",
    review: "bg-gray-600",
    testing: "bg-gray-500",
    done: "bg-black text-white",
    blocked: "bg-black text-white",
    cancelled: "bg-gray-400",
  };

  return (
    <AppLayout>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tasks</h1>
            <p className="text-secondary-text">Manage and track all your tasks</p>
          </div>
          <Link href={`${ROUTES.TASKS}/new`}>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              New Task
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-text">{taskStats.total}</p>
                <p className="text-sm text-secondary-text">Total Tasks</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-text">{taskStats.completed}</p>
                <p className="text-sm text-secondary-text">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-text">{taskStats.inProgress}</p>
                <p className="text-sm text-secondary-text">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-text">{taskStats.pending}</p>
                <p className="text-sm text-secondary-text">Pending</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" size={16} />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm font-medium text-secondary-text leading-8">Status:</span>
                <button
                  onClick={() => setStatusFilter(null)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    !statusFilter
                      ? "bg-black text-white"
                      : "bg-secondary-bg text-secondary-text hover:text-primary-text"
                  }`}
                >
                  All
                </button>
                {["todo", "in_progress", "review", "done"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize ${
                      statusFilter === status
                        ? "bg-black text-white"
                        : "bg-secondary-bg text-secondary-text hover:text-primary-text"
                    }`}
                  >
                    {status.replace("_", " ")}
                  </button>
                ))}
              </div>

              {/* Priority Filter */}
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm font-medium text-secondary-text leading-8">Priority:</span>
                <button
                  onClick={() => setPriorityFilter(null)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    !priorityFilter
                      ? "bg-black text-white"
                      : "bg-secondary-bg text-secondary-text hover:text-primary-text"
                  }`}
                >
                  All
                </button>
                {["critical", "high", "medium", "low"].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setPriorityFilter(priority)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize ${
                      priorityFilter === priority
                        ? "bg-black text-white"
                        : "bg-secondary-bg text-secondary-text hover:text-primary-text"
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card>
          <CardContent className="pt-6">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-secondary-text mb-4">No tasks found</p>
                <Link href={`${ROUTES.TASKS}/new`}>
                  <Button size="sm">Create your first task</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-0 divide-y divide-border">
                {filteredTasks.map((task: any) => {
                  const project = MOCK_PROJECTS.find((p: any) => p.id === task.projectId);
                  return (
                    <Link
                      key={task.id}
                      href={ROUTES.TASK_DETAIL(task.id)}
                      className="block hover:bg-secondary-bg transition-colors"
                    >
                      <div className="p-4 flex items-center gap-4">
                        {/* Checkbox */}
                        <div className="flex-shrink-0">
                          {task.status === "done" ? (
                            <CheckCircle2 size={20} className="text-primary-text" />
                          ) : (
                            <Circle size={20} className="text-secondary-text" />
                          )}
                        </div>

                        {/* Task Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-medium ${task.status === "done" ? "line-through text-secondary-text" : "text-primary-text"}`}>
                              {task.title}
                            </h3>
                            <Badge size="sm">{task.status.replace("_", " ")}</Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-secondary-text">
                            {project && <span>{project.name}</span>}
                            {task.assignee && <span>•</span>}
                            {task.assignee && <span>{task.assignee.name}</span>}
                            {task.dueDate && <span>•</span>}
                            {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                          </div>
                        </div>

                        {/* Priority Badge */}
                        <Badge size="sm" variant={task.priority === "high" || task.priority === "critical" ? "danger" : "default"}>
                          {task.priority}
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function Tasks() {
  return (
    <ProtectedRoute>
      <TasksContent />
    </ProtectedRoute>
  );
}
