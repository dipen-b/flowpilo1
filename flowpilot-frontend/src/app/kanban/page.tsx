"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { KanbanBoard } from "@/components/KanbanBoard";
import { useTasksStore } from "@/stores/tasks";
import { useState } from "react";
import { Layout, Filter, Plus } from "lucide-react";

function KanbanContent() {
  const { tasks, updateTask, deleteTask } = useTasksStore();
  const [filterProject, setFilterProject] = useState<string>("all");
  const [editingTask, setEditingTask] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const projects = Array.from(
    new Set(tasks.map((t) => t.project).filter(Boolean))
  );

  const filteredTasks =
    filterProject === "all"
      ? tasks
      : tasks.filter((t) => t.project === filterProject);

  const handleTaskMove = (taskId: string, newStatus: any) => {
    updateTask(taskId, { status: newStatus });
  };

  const handleTaskEdit = (task: any) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleTaskDelete = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleTaskCreate = (status: any) => {
    setEditingTask({
      id: `task-${Date.now()}`,
      title: "",
      project: filterProject === "all" ? "FlowPilot Frontend" : filterProject,
      status,
      priority: "medium",
      dueDate: "",
      assignee: "John Doe",
    });
    setShowModal(true);
  };

  const handleSaveTask = () => {
    if (editingTask.id.startsWith("task-") && !editingTask.id.includes("-temp")) {
      useTasksStore.getState().addTask({
        title: editingTask.title,
        project: editingTask.project,
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate,
        assignee: editingTask.assignee,
      });
    } else {
      updateTask(editingTask.id, editingTask);
    }
    setShowModal(false);
    setEditingTask(null);
  };

  const taskStats = {
    todo: filteredTasks.filter((t) => t.status === "todo").length,
    in_progress: filteredTasks.filter((t) => t.status === "in_progress").length,
    review: filteredTasks.filter((t) => t.status === "review").length,
    done: filteredTasks.filter((t) => t.status === "done").length,
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Layout size={32} className="text-primary-text" />
              <div>
                <h1 className="text-4xl font-bold text-primary-text">Kanban Board</h1>
                <p className="text-lg text-secondary-text">Drag tasks between columns to update their status</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">To Do</p>
            <p className="text-4xl font-bold text-primary-text">{taskStats.todo}</p>
          </div>
          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">In Progress</p>
            <p className="text-4xl font-bold text-primary-text">{taskStats.in_progress}</p>
          </div>
          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Review</p>
            <p className="text-4xl font-bold text-primary-text">{taskStats.review}</p>
          </div>
          <div className="bg-secondary-bg rounded-lg border border-border p-6 space-y-2">
            <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Done</p>
            <p className="text-4xl font-bold text-primary-text">{taskStats.done}</p>
          </div>
        </div>

        {/* Project Filter */}
        <div className="flex items-center gap-4">
          <Filter size={18} className="text-secondary-text" />
          <div className="flex gap-3 flex-wrap items-center">
            <button
              onClick={() => setFilterProject("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filterProject === "all"
                  ? "bg-primary-text text-card-bg"
                  : "bg-secondary-bg text-secondary-text hover:text-primary-text border border-border"
              }`}
            >
              All Projects
            </button>
            {projects.map((project) => (
              <button
                key={project}
                onClick={() => setFilterProject(project)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filterProject === project
                    ? "bg-primary-text text-card-bg"
                    : "bg-secondary-bg text-secondary-text hover:text-primary-text border border-border"
                }`}
              >
                {project}
              </button>
            ))}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden">
          <KanbanBoard
            tasks={filteredTasks}
            onTaskMove={handleTaskMove}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
            onTaskCreate={handleTaskCreate}
          />
        </div>
      </div>
    </AppLayout>
  );
}

export default function Kanban() {
  return (
    <ProtectedRoute>
      <KanbanContent />
    </ProtectedRoute>
  );
}
