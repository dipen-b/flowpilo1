"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Calendar } from "@/components/Calendar";
import { useTasksStore } from "@/stores/tasks";
import { useProjectsStore } from "@/stores/projects";
import { useRoadmapsStore } from "@/stores/roadmaps";
import { useSprintsStore } from "@/stores/sprints";
import { useState } from "react";
import { Calendar as CalendarIcon, Filter } from "lucide-react";

function CalendarContent() {
  const tasks = useTasksStore((state) => state.tasks);
  const projects = useProjectsStore((state) => state.projects);
  const roadmaps = useRoadmapsStore((state) => state.roadmaps);
  const sprints = useSprintsStore((state) => state.sprints);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "tasks" | "projects" | "roadmaps" | "sprints">("all");

  // Aggregate all items with dates into calendar format
  const calendarItems = [
    ...(filterType === "all" || filterType === "tasks"
      ? tasks.map((task) => ({
          id: task.id,
          title: task.title,
          date: task.dueDate,
          priority: task.priority,
          status: task.status,
          type: "task" as const,
        }))
      : []),

    ...(filterType === "all" || filterType === "projects"
      ? projects.map((project) => ({
          id: project.id,
          title: project.name,
          date: project.dueDate,
          priority: project.priority as any,
          status: project.status as any,
          type: "project" as const,
        }))
      : []),

    ...(filterType === "all" || filterType === "roadmaps"
      ? roadmaps.map((roadmap) => ({
          id: roadmap.id,
          title: roadmap.name,
          date: roadmap.endDate,
          priority: "medium" as const,
          status: roadmap.status as any,
          type: "roadmap" as const,
        }))
      : []),

    ...(filterType === "all" || filterType === "sprints"
      ? sprints.map((sprint) => ({
          id: sprint.id,
          title: sprint.name,
          date: sprint.endDate,
          priority: "high" as const,
          status: sprint.status as any,
          type: "sprint" as const,
        }))
      : []),
  ];

  // Filter out items without valid dates
  const validItems = calendarItems.filter((item) => item.date && item.date !== "");

  // Get tasks/events for the selected date
  const selectedDateItems = selectedDate
    ? validItems.filter((item) => item.date === selectedDate)
    : [];

  const upcomingItems = validItems
    .filter((item) => {
      const itemDate = new Date(item.date);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return itemDate >= today && itemDate <= nextWeek;
    })
    .slice(0, 5);

  const overdueItems = validItems
    .filter((item) => {
      const itemDate = new Date(item.date);
      const today = new Date();
      return itemDate < today && item.status !== "done";
    })
    .slice(0, 5);

  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon size={28} className="text-primary-text" />
            <div>
              <h1 className="text-3xl font-bold">Calendar</h1>
              <p className="text-secondary-text">View and manage tasks and deadlines</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-secondary-text text-sm mb-2">Total Events</p>
              <p className="text-3xl font-bold">{validItems.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-secondary-text text-sm mb-2">Due This Week</p>
              <p className="text-3xl font-bold">{upcomingItems.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-secondary-text text-sm mb-2">Overdue</p>
              <p className="text-3xl font-bold text-primary-text">{overdueItems.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-secondary-text" />
          <div className="flex gap-2">
            {(["all", "tasks", "projects", "roadmaps", "sprints"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type
                    ? "bg-black text-white"
                    : "bg-secondary-bg text-secondary-text hover:text-primary-text"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Calendar */}
          <div className="col-span-2 overflow-auto">
            <Calendar tasks={validItems} onDateSelect={setSelectedDate} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 overflow-y-auto">
            {/* Selected Date Details */}
            {selectedDate && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-primary-text mb-3 text-sm">
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  {selectedDateItems.length === 0 ? (
                    <p className="text-sm text-secondary-text">No events scheduled</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDateItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-2 bg-secondary-bg rounded border border-border text-xs"
                        >
                          <p className="font-medium text-primary-text truncate">{item.title}</p>
                          <p className="text-secondary-text capitalize">{item.type}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Upcoming */}
            {upcomingItems.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-primary-text mb-3 text-sm">
                    Due This Week
                  </h3>
                  <div className="space-y-2">
                    {upcomingItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 bg-secondary-bg rounded border border-border text-xs"
                      >
                        <p className="font-medium text-primary-text truncate">{item.title}</p>
                        <p className="text-secondary-text">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Overdue */}
            {overdueItems.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-primary-text mb-3 text-sm">Overdue</h3>
                  <div className="space-y-2">
                    {overdueItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 bg-gray-900/30 rounded border border-gray-700 text-xs"
                      >
                        <p className="font-medium text-primary-text truncate">{item.title}</p>
                        <p className="text-secondary-text">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
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

export default function CalendarPage() {
  return (
    <ProtectedRoute>
      <CalendarContent />
    </ProtectedRoute>
  );
}
