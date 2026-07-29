"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarTask {
  id: string;
  title: string;
  date: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "todo" | "in_progress" | "review" | "done";
}

interface CalendarProps {
  tasks: CalendarTask[];
  onDateSelect?: (date: string) => void;
  view?: "month" | "week" | "day";
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical":
      return "bg-gray-900";
    case "high":
      return "bg-gray-700";
    case "medium":
      return "bg-gray-600";
    case "low":
      return "bg-gray-500";
    default:
      return "bg-gray-600";
  }
};

const getDaysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function Calendar({ tasks, onDateSelect, view = "month" }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long" });
  const year = currentDate.getFullYear();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const formattedDate = formatDate(clickedDate);
    setSelectedDate(formattedDate);
    onDateSelect?.(formattedDate);
  };

  const getTasksForDate = (day: number) => {
    const dateStr = formatDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
    return tasks.filter((task) => task.date === dateStr);
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  return (
    <div className="bg-card-bg rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-secondary-bg rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-primary-text min-w-40">
            {monthName} {year}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-secondary-bg rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-secondary-text p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="p-2"></div>;
          }

          const dayTasks = getTasksForDate(day);
          const dateStr = formatDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
          );
          const isSelected = selectedDate === dateStr;
          const isToday =
            new Date().toDateString() ===
            new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

          return (
            <div
              key={day}
              onClick={() => handleDateClick(day)}
              className={`min-h-24 p-2 rounded-lg border cursor-pointer transition-colors ${
                isSelected
                  ? "border-primary-text bg-gray-700"
                  : isToday
                  ? "border-primary-text bg-gray-800"
                  : "border-border hover:border-primary-text"
              }`}
            >
              <div
                className={`text-sm font-semibold mb-1 ${
                  isToday ? "text-primary-text" : "text-secondary-text"
                }`}
              >
                {day}
              </div>

              <div className="space-y-1 text-xs">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className={`px-2 py-1 rounded text-white truncate ${getPriorityColor(
                      task.priority
                    )}`}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div className="text-secondary-text px-2 py-1">
                    +{dayTasks.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Date Tasks */}
      {selectedDate && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-primary-text mb-3">
            Tasks for {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </h3>
          <div className="space-y-2">
            {getTasksForDate(parseInt(selectedDate.split("-")[2])).length === 0 ? (
              <p className="text-sm text-secondary-text">No tasks scheduled</p>
            ) : (
              getTasksForDate(parseInt(selectedDate.split("-")[2])).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-secondary-bg rounded-lg"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary-text">{task.title}</p>
                    <p className="text-xs text-secondary-text capitalize">{task.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
