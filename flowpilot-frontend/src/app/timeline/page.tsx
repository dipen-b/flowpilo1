"use client";

import { AppLayout } from "@/components/layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GanttChart } from "@/components/GanttChart";
import { useTasksStore } from "@/stores/tasks";
import { useProjectsStore } from "@/stores/projects";
import { useRoadmapsStore } from "@/stores/roadmaps";
import { useSprintsStore } from "@/stores/sprints";
import { useState } from "react";
import { Calendar, Filter, AlertCircle } from "lucide-react";

function TimelineContent() {
  const tasks = useTasksStore((state) => state.tasks);
  const projects = useProjectsStore((state) => state.projects);
  const roadmaps = useRoadmapsStore((state) => state.roadmaps);
  const sprints = useSprintsStore((state) => state.sprints);

  const tasksStore = useTasksStore();
  const projectsStore = useProjectsStore();
  const roadmapsStore = useRoadmapsStore();
  const sprintsStore = useSprintsStore();

  const [filterType, setFilterType] = useState<"all" | "tasks" | "projects" | "roadmaps" | "sprints">("all");
  const [zoomLevel, setZoomLevel] = useState<"week" | "month" | "quarter">("month");

  const ganttItems = [
    ...(filterType === "all" || filterType === "tasks"
      ? tasks.map((task) => ({
          id: task.id,
          title: task.title,
          startDate: task.dueDate,
          dueDate: task.dueDate,
          project: task.project,
          status: task.status,
          priority: task.priority,
          progress: task.status === "done" ? 100 : task.status === "in_progress" ? 50 : 0,
        }))
      : []),

    ...(filterType === "all" || filterType === "projects"
      ? projects.map((project) => ({
          id: project.id,
          title: project.name,
          startDate: project.startDate,
          dueDate: project.dueDate,
          project: "Project",
          status: (project.status as any) || "todo",
          priority: (project.priority as any) || "medium",
          progress: project.progress,
        }))
      : []),

    ...(filterType === "all" || filterType === "roadmaps"
      ? roadmaps.map((roadmap) => ({
          id: roadmap.id,
          title: roadmap.name,
          startDate: roadmap.startDate,
          dueDate: roadmap.endDate,
          project: "Roadmap",
          status: (roadmap.status as any) || "todo",
          priority: "medium" as const,
          progress: roadmap.progress,
        }))
      : []),

    ...(filterType === "all" || filterType === "sprints"
      ? sprints.map((sprint) => ({
          id: sprint.id,
          title: sprint.name,
          startDate: sprint.startDate,
          dueDate: sprint.endDate,
          project: "Sprint",
          status: (sprint.status as any) || "todo",
          priority: "high" as const,
          progress: Math.round(
            (sprint.completed / (sprint.completed + sprint.tasks.length)) * 100 || 0
          ),
        }))
      : []),
  ];

  const validItems = ganttItems.filter(
    (item) => item.startDate && item.dueDate && item.startDate !== "" && item.dueDate !== ""
  );

  const handleTaskUpdate = (taskId: string, newStartDate: string, newDueDate: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      tasksStore.updateTask(taskId, { dueDate: newDueDate });
      return;
    }

    const project = projects.find((p) => p.id === taskId);
    if (project) {
      projectsStore.updateProject(taskId, {
        startDate: newStartDate,
        dueDate: newDueDate,
      });
      return;
    }

    const roadmap = roadmaps.find((r) => r.id === taskId);
    if (roadmap) {
      roadmapsStore.updateRoadmap(taskId, {
        startDate: newStartDate,
        endDate: newDueDate,
      });
      return;
    }

    const sprint = sprints.find((s) => s.id === taskId);
    if (sprint) {
      sprintsStore.updateSprint(taskId, {
        startDate: newStartDate,
        endDate: newDueDate,
      });
    }
  };

  const completionRate = validItems.length > 0
    ? Math.round(
        (validItems.reduce((sum, item) => sum + (item.progress || 0), 0) /
          validItems.length) * 100
      )
    : 0;

  const overdueCount = validItems.filter((item) => {
    const dueDate = new Date(item.dueDate);
    const today = new Date();
    return dueDate < today;
  }).length;

  const dueSoonCount = validItems.filter((item) => {
    const dueDate = new Date(item.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilDue >= 0 && daysUntilDue <= 7;
  }).length;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 h-full flex flex-col">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar size={32} className="text-primary-text" />
            <div>
              <h1 className="text-4xl font-bold text-primary-text">Timeline</h1>
              <p className="text-lg text-secondary-text">Visualize and manage project schedules</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Total Items</p>
            <p className="text-4xl font-bold text-primary-text">{validItems.length}</p>
          </div>

          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Completion</p>
            <p className="text-4xl font-bold text-primary-text">{completionRate}%</p>
          </div>

          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Due Soon (7d)</p>
            <p className="text-4xl font-bold text-primary-text">{dueSoonCount}</p>
          </div>

          <div className={`rounded-lg border p-6 space-y-2 ${overdueCount > 0 ? "bg-red-500/5 border-red-500/20" : "bg-secondary-bg border-border"}`}>
            <p className={`text-sm font-medium uppercase tracking-wide ${overdueCount > 0 ? "text-red-500" : "text-secondary-text"}`}>
              Overdue
            </p>
            <p className={`text-4xl font-bold ${overdueCount > 0 ? "text-red-500" : "text-primary-text"}`}>{overdueCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Filter size={18} className="text-secondary-text" />
          <div className="flex gap-3 flex-wrap items-center">
            {(["all", "tasks", "projects", "roadmaps", "sprints"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                  filterType === type
                    ? "bg-primary-text text-card-bg"
                    : "bg-secondary-bg text-secondary-text hover:text-primary-text border border-border"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="flex-1 bg-secondary-bg rounded-xl border border-border overflow-hidden">
          {validItems.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Calendar size={48} className="text-secondary-text mx-auto mb-4 opacity-50" />
                <p className="text-lg text-secondary-text mb-2">No items to display</p>
                <p className="text-base text-secondary-text">Add dates to projects, roadmaps, or sprints to see them here</p>
              </div>
            </div>
          ) : (
            <div className="p-6 overflow-auto h-full">
              <GanttChart
                tasks={validItems}
                onTaskDragEnd={handleTaskUpdate}
                zoomLevel={zoomLevel}
              />
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-secondary-bg rounded-xl border border-border p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-primary-text mb-4">How to use Timeline</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-base font-semibold text-primary-text">Features</p>
                <ul className="text-base text-secondary-text space-y-2">
                  <li className="flex gap-2"><span>•</span><span>Drag task bars left/right to reschedule</span></li>
                  <li className="flex gap-2"><span>•</span><span>Use zoom controls to change view granularity</span></li>
                  <li className="flex gap-2"><span>•</span><span>Click filter buttons to show specific item types</span></li>
                  <li className="flex gap-2"><span>•</span><span>Bar colors indicate task status</span></li>
                </ul>
              </div>
              <div className="space-y-3">
                <p className="text-base font-semibold text-primary-text">Status Colors</p>
                <ul className="text-base text-secondary-text space-y-2">
                  <li className="flex gap-2"><span>•</span><span>Gray: To Do</span></li>
                  <li className="flex gap-2"><span>•</span><span>Yellow: In Progress</span></li>
                  <li className="flex gap-2"><span>•</span><span>Orange: Review</span></li>
                  <li className="flex gap-2"><span>•</span><span>Black: Done</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function Timeline() {
  return (
    <ProtectedRoute>
      <TimelineContent />
    </ProtectedRoute>
  );
}
