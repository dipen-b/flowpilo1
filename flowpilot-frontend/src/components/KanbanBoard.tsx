"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Plus, Trash2, Edit } from "lucide-react";

interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  project?: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "todo" | "in_progress" | "review" | "done";
  assignee?: string;
  dueDate?: string;
}

interface KanbanBoardProps {
  tasks: KanbanTask[];
  onTaskMove: (taskId: string, newStatus: KanbanTask["status"]) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskEdit: (task: KanbanTask) => void;
  onTaskCreate?: (status: KanbanTask["status"]) => void;
}

const COLUMNS = [
  { id: "todo", label: "To Do", color: "bg-gray-500" },
  { id: "in_progress", label: "In Progress", color: "bg-gray-700" },
  { id: "review", label: "Review", color: "bg-gray-600" },
  { id: "done", label: "Done", color: "bg-black" },
];

const PRIORITY_COLORS = {
  critical: "border-l-4 border-gray-900",
  high: "border-l-4 border-gray-700",
  medium: "border-l-4 border-gray-600",
  low: "border-l-4 border-gray-500",
};

const PRIORITY_BG = {
  critical: "bg-gray-900/20",
  high: "bg-gray-700/20",
  medium: "bg-gray-600/20",
  low: "bg-gray-500/20",
};

export function KanbanBoard({
  tasks,
  onTaskMove,
  onTaskDelete,
  onTaskEdit,
  onTaskCreate,
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<string | null>(null);

  const getTasksByStatus = (status: string) => {
    return tasks.filter((t) => t.status === status);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    task: KanbanTask
  ) => {
    setDraggedTask(task.id);
    setDraggedFrom(task.status);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    columnId: string
  ) => {
    e.preventDefault();
    if (draggedTask && draggedFrom !== columnId) {
      onTaskMove(draggedTask, columnId as KanbanTask["status"]);
    }
    setDraggedTask(null);
    setDraggedFrom(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDraggedFrom(null);
  };

  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      {COLUMNS.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        const columnLabel = column.label as KanbanTask["status"];

        return (
          <div
            key={column.id}
            className="flex flex-col bg-secondary-bg rounded-lg border border-border overflow-hidden"
          >
            {/* Column Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-primary-text">{column.label}</h3>
                <span className="text-xs bg-card-bg text-secondary-text px-2 py-1 rounded">
                  {columnTasks.length}
                </span>
              </div>
              <div
                className={`h-1 rounded-full ${column.color}`}
                style={{ width: "100%" }}
              />
            </div>

            {/* Tasks Area */}
            <div
              className="flex-1 overflow-y-auto p-3 space-y-3"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {columnTasks.length === 0 ? (
                <div className="text-center py-8 text-secondary-text">
                  <p className="text-sm">No tasks yet</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    className={`p-3 rounded-lg cursor-move transition-all hover:shadow-lg ${PRIORITY_COLORS[task.priority]} ${PRIORITY_BG[task.priority]} bg-card-bg border border-border ${
                      draggedTask === task.id ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-primary-text flex-1 break-words">
                        {task.title}
                      </h4>
                      <div className="flex gap-1 ml-2 flex-shrink-0">
                        <button
                          onClick={() => onTaskEdit(task)}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={14} className="text-secondary-text" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${task.title}"?`)) {
                              onTaskDelete(task.id);
                            }
                          }}
                          className="p-1 hover:bg-red-600/20 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} className="text-secondary-text" />
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-xs text-secondary-text mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1 mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded font-semibold text-white ${
                          task.priority === "critical"
                            ? "bg-gray-900"
                            : task.priority === "high"
                            ? "bg-gray-700"
                            : task.priority === "medium"
                            ? "bg-gray-600"
                            : "bg-gray-500"
                        }`}
                      >
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}
                      </span>
                      {task.project && (
                        <span className="text-xs px-2 py-1 rounded bg-gray-700/20 text-secondary-text">
                          {task.project}
                        </span>
                      )}
                    </div>

                    {task.dueDate && (
                      <div className="text-xs text-secondary-text">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}

                    {task.assignee && (
                      <div className="text-xs text-secondary-text mt-1">
                        {task.assignee}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add Task Button */}
            <div className="p-3 border-t border-border">
              <button
                onClick={() => onTaskCreate?.(columnLabel)}
                className="w-full py-2 px-3 flex items-center justify-center gap-2 rounded-lg hover:bg-card-bg transition-colors text-secondary-text hover:text-primary-text text-sm"
              >
                <Plus size={16} />
                Add task
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
