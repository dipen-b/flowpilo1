"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface GanttTask {
  id: string;
  title: string;
  startDate: string;
  dueDate: string;
  progress?: number;
  project?: string;
  status?: "todo" | "in_progress" | "review" | "done";
  priority?: "critical" | "high" | "medium" | "low";
  dependsOn?: string[];
}

interface GanttChartProps {
  tasks: GanttTask[];
  onTaskDragEnd?: (taskId: string, newStartDate: string, newDueDate: string) => void;
  zoomLevel?: "week" | "month" | "quarter";
}

const statusColors = {
  todo: "bg-gray-500",
  in_progress: "bg-gray-700",
  review: "bg-gray-600",
  done: "bg-black",
};

const priorityOpacity = {
  critical: "opacity-100",
  high: "opacity-90",
  medium: "opacity-75",
  low: "opacity-60",
};

export function GanttChart({
  tasks,
  onTaskDragEnd,
  zoomLevel: initialZoom = "month",
}: GanttChartProps) {
  const [zoomLevel, setZoomLevel] = useState<"week" | "month" | "quarter">(initialZoom);
  const [startDate, setStartDate] = useState<Date>(() => {
    const earliest = tasks.reduce((min, task) => {
      const date = new Date(task.startDate || task.dueDate);
      return date < min ? date : min;
    }, new Date());
    earliest.setDate(earliest.getDate() - 7);
    return earliest;
  });
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const getDaysInView = () => {
    switch (zoomLevel) {
      case "week":
        return 7;
      case "month":
        return 30;
      case "quarter":
        return 90;
      default:
        return 30;
    }
  };

  const daysInView = getDaysInView();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + daysInView);

  const dateRange = useMemo(() => {
    const dates = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, [startDate, endDate]);

  const getTaskPosition = (task: GanttTask) => {
    const taskStart = new Date(task.startDate || task.dueDate);
    const taskEnd = new Date(task.dueDate);

    const startDays = Math.max(
      0,
      Math.floor((taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    const endDays = Math.min(
      daysInView,
      Math.floor((taskEnd.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );

    return {
      start: (startDays / daysInView) * 100,
      width: Math.max(2, ((endDays - startDays) / daysInView) * 100),
    };
  };

  const handlePrevious = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() - Math.floor(daysInView / 2));
    setStartDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + Math.floor(daysInView / 2));
    setStartDate(newDate);
  };

  const handleTaskDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    task: GanttTask
  ) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedTask(task.id);
  };

  const handleTaskDragEnd = (
    e: React.DragEvent<HTMLDivElement>,
    task: GanttTask
  ) => {
    if (!onTaskDragEnd) return;

    const container = e.currentTarget.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.offsetWidth;
    const daysOffset = Math.round(percentage * daysInView);

    const newStart = new Date(startDate);
    newStart.setDate(newStart.getDate() + daysOffset);

    const currentDuration =
      new Date(task.dueDate).getTime() - new Date(task.startDate || task.dueDate).getTime();
    const newEnd = new Date(newStart.getTime() + currentDuration);

    onTaskDragEnd(
      task.id,
      newStart.toISOString().split("T")[0],
      newEnd.toISOString().split("T")[0]
    );

    setDraggedTask(null);
  };

  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-sm text-secondary-text min-w-32">
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </div>
          <button
            onClick={handleNext}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel("week")}
            className={`px-3 py-1 rounded text-sm ${
              zoomLevel === "week"
                ? "bg-black text-white"
                : "bg-secondary-bg text-secondary-text hover:text-primary-text"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setZoomLevel("month")}
            className={`px-3 py-1 rounded text-sm ${
              zoomLevel === "month"
                ? "bg-black text-white"
                : "bg-secondary-bg text-secondary-text hover:text-primary-text"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setZoomLevel("quarter")}
            className={`px-3 py-1 rounded text-sm ${
              zoomLevel === "quarter"
                ? "bg-black text-white"
                : "bg-secondary-bg text-secondary-text hover:text-primary-text"
            }`}
          >
            Quarter
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card-bg border border-border rounded-lg overflow-x-auto">
        {/* Timeline Header */}
        <div className="flex sticky top-0 bg-secondary-bg z-10">
          <div className="w-64 min-w-64 p-4 border-r border-border">
            <div className="text-xs font-semibold text-secondary-text">Tasks</div>
          </div>
          <div className="flex-1 flex">
            {Array.from({ length: Math.ceil(daysInView / (zoomLevel === "week" ? 1 : zoomLevel === "month" ? 7 : 30)) }).map((_, i) => {
              const date = new Date(startDate);
              if (zoomLevel === "week") {
                date.setDate(date.getDate() + i);
              } else if (zoomLevel === "month") {
                date.setDate(date.getDate() + i * 7);
              } else {
                date.setDate(date.getDate() + i * 30);
              }

              return (
                <div
                  key={i}
                  className="flex-1 min-w-24 p-2 border-r border-border text-xs text-secondary-text text-center"
                >
                  {zoomLevel === "week"
                    ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : zoomLevel === "month"
                    ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Rows */}
        <div>
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-secondary-text">No tasks to display</div>
          ) : (
            tasks.map((task) => {
              const position = getTaskPosition(task);
              const statusColor = statusColors[task.status || "todo"];
              const opacity = priorityOpacity[task.priority || "medium"];

              return (
                <div key={task.id} className="flex border-t border-border hover:bg-secondary-bg transition-colors">
                  {/* Task Label */}
                  <div className="w-64 min-w-64 p-4 border-r border-border flex items-center">
                    <div>
                      <div className="text-sm font-medium text-primary-text truncate">
                        {task.title}
                      </div>
                      {task.project && (
                        <div className="text-xs text-secondary-text">{task.project}</div>
                      )}
                    </div>
                  </div>

                  {/* Task Bar */}
                  <div
                    className="flex-1 relative p-2"
                    onDragOver={(e) => {
                      if (draggedTask) e.preventDefault();
                    }}
                    onDrop={(e) => handleTaskDragEnd(e, task)}
                  >
                    <div
                      draggable
                      onDragStart={(e) => handleTaskDragStart(e, task)}
                      className={`absolute top-1/2 -translate-y-1/2 h-6 rounded cursor-move transition-all hover:h-8 ${statusColor} ${opacity}`}
                      style={{
                        left: `${position.start}%`,
                        width: `${position.width}%`,
                        minWidth: "40px",
                      }}
                      title={`${task.title} (${task.startDate} to ${task.dueDate})`}
                    >
                      <div className="h-full px-2 flex items-center overflow-hidden">
                        <span className="text-xs font-medium text-white truncate">
                          {task.progress !== undefined && `${task.progress}%`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-xs text-secondary-text">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded"></div>
          <span>To Do</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-700 rounded"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-600 rounded"></div>
          <span>Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black rounded"></div>
          <span>Done</span>
        </div>
      </div>
    </div>
  );
}
