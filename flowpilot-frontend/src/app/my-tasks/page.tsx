"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { CheckCircle2, Clock, AlertCircle, Plus, Trash2, Edit, X } from "lucide-react";
import { useState } from "react";
import { useTasksStore } from "@/stores/tasks";

const statusConfig = {
  todo: { label: "To Do", color: "bg-blue-500" },
  in_progress: { label: "In Progress", color: "bg-purple-500" },
  review: { label: "Review", color: "bg-orange-500" },
  done: { label: "Done", color: "bg-green-500" },
};

const priorityConfig = {
  critical: { label: "Critical", color: "bg-red-500 text-white" },
  high: { label: "High", color: "bg-orange-500 text-white" },
  medium: { label: "Medium", color: "bg-yellow-500 text-white" },
  low: { label: "Low", color: "bg-gray-500 text-white" },
};

function MyTasksContent() {
  const { tasks, addTask, updateTask, deleteTask } = useTasksStore();
  const [filter, setFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    project: "FlowPilot Frontend",
    status: "todo" as const,
    priority: "medium" as const,
    dueDate: "",
  });

  const filteredTasks =
    filter === "all"
      ? tasks
      : filter === "active"
      ? tasks.filter(t => t.status !== "done")
      : filter === "done"
      ? tasks.filter(t => t.status === "done")
      : tasks;

  const activeCount = tasks.filter(t => t.status !== "done").length;
  const doneCount = tasks.filter(t => t.status === "done").length;

  const handleCreateOrUpdate = () => {
    if (!newTask.title.trim()) return;

    if (editingId) {
      updateTask(editingId, newTask);
      setEditingId(null);
    } else {
      addTask({
        title: newTask.title,
        project: newTask.project,
        status: newTask.status,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        assignee: "John Doe",
      });
    }

    setNewTask({
      title: "",
      project: "FlowPilot Frontend",
      status: "todo",
      priority: "medium",
      dueDate: "",
    });
    setShowModal(false);
  };

  const handleEdit = (task: any) => {
    setNewTask({
      title: task.title,
      project: task.project,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setEditingId(task.id);
    setShowModal(true);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-primary-text">My Tasks</h1>
            <div className="flex items-center gap-6 text-lg text-secondary-text">
              <span className="font-semibold">{activeCount} <span className="text-secondary-text font-normal">active</span></span>
              <span className="font-semibold">{doneCount} <span className="text-secondary-text font-normal">completed</span></span>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setNewTask({
                title: "",
                project: "FlowPilot Frontend",
                status: "todo",
                priority: "medium",
                dueDate: "",
              });
              setShowModal(true);
            }}
            className="px-6 py-3 rounded-lg bg-primary-text text-card-bg font-semibold hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap items-center">
          {["all", "active", "done"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                filter === f
                  ? "bg-primary-text text-card-bg"
                  : "bg-secondary-bg text-secondary-text hover:text-primary-text border border-border"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="bg-secondary-bg rounded-xl border border-border p-12 text-center">
              <p className="text-lg text-secondary-text mb-6">No tasks to show</p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 rounded-lg bg-primary-text text-card-bg font-semibold hover:opacity-90 transition-all"
              >
                Create your first task
              </button>
            </div>
          ) : (
            filteredTasks.map((task: any) => (
              <div
                key={task.id}
                className="bg-secondary-bg rounded-lg border border-border p-5 hover:border-primary-text/20 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {task.status === "done" ? (
                        <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                      ) : (
                        <Clock size={20} className="text-secondary-text flex-shrink-0" />
                      )}
                      <h3 className={`text-lg font-semibold ${task.status === "done" ? "text-secondary-text line-through" : "text-primary-text"}`}>
                        {task.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {task.project}
                      </Badge>
                      <Badge className={`text-xs font-semibold ${statusConfig[task.status as keyof typeof statusConfig].color}`}>
                        {statusConfig[task.status as keyof typeof statusConfig].label}
                      </Badge>
                      <Badge className={`text-xs font-semibold ${priorityConfig[task.priority as keyof typeof priorityConfig].color}`}>
                        {priorityConfig[task.priority as keyof typeof priorityConfig].label}
                      </Badge>
                      {task.dueDate && (
                        <span className="text-sm text-secondary-text font-medium">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 rounded-lg hover:bg-card-bg text-secondary-text hover:text-primary-text transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this task?")) {
                          deleteTask(task.id);
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-secondary-text hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card-bg rounded-xl border border-border p-8 max-w-2xl w-full space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary-text">
                  {editingId ? "Edit Task" : "Create New Task"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-secondary-bg rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-primary-text mb-2">Task Title</label>
                  <Input
                    type="text"
                    placeholder="Enter task title..."
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary-text mb-2">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-card-bg text-primary-text"
                    >
                      {Object.entries(priorityConfig).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-text mb-2">Status</label>
                    <select
                      value={newTask.status}
                      onChange={(e) => setNewTask({...newTask, status: e.target.value as any})}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-card-bg text-primary-text"
                    >
                      {Object.entries(statusConfig).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-text mb-2">Due Date</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-border text-primary-text font-semibold hover:bg-secondary-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrUpdate}
                  className="flex-1 px-4 py-3 rounded-lg bg-primary-text text-card-bg font-semibold hover:opacity-90 transition-all"
                >
                  {editingId ? "Update Task" : "Create Task"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function MyTasks() {
  return (
    <ProtectedRoute>
      <MyTasksContent />
    </ProtectedRoute>
  );
}
