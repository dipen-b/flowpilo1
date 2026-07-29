"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { MOCK_PROJECTS, ROUTES } from "@/constants";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { Download, Share2, Plus, Target, Flag, TrendingUp } from "lucide-react";
import { useState } from "react";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "planned" | "in_progress" | "completed";
  quarter: string;
  projectId?: string;
  priority: "low" | "medium" | "high" | "critical";
}

const QUARTERS = ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"];

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: "rm-1",
    title: "Authentication System",
    description: "Implement JWT-based authentication with OAuth integration",
    status: "completed",
    quarter: "Q1 2026",
    projectId: "proj-1",
    priority: "critical",
  },
  {
    id: "rm-2",
    title: "Dashboard & Analytics",
    description: "Build comprehensive dashboard with key metrics and insights",
    status: "in_progress",
    quarter: "Q1 2026",
    projectId: "proj-1",
    priority: "high",
  },
  {
    id: "rm-3",
    title: "Task Management",
    description: "Full task CRUD with status tracking and assignments",
    status: "in_progress",
    quarter: "Q2 2026",
    projectId: "proj-1",
    priority: "high",
  },
  {
    id: "rm-4",
    title: "Kanban Board",
    description: "Drag-and-drop task board with real-time updates",
    status: "planned",
    quarter: "Q2 2026",
    projectId: "proj-1",
    priority: "high",
  },
  {
    id: "rm-5",
    title: "Sprint Planning",
    description: "Agile sprint management with burndown charts",
    status: "planned",
    quarter: "Q3 2026",
    projectId: "proj-1",
    priority: "medium",
  },
  {
    id: "rm-6",
    title: "Team Collaboration",
    description: "Team workspace with real-time collaboration features",
    status: "planned",
    quarter: "Q3 2026",
    projectId: "proj-2",
    priority: "high",
  },
  {
    id: "rm-7",
    title: "Reporting & Insights",
    description: "Advanced reporting with custom dashboards and exports",
    status: "planned",
    quarter: "Q4 2026",
    projectId: "proj-1",
    priority: "medium",
  },
  {
    id: "rm-8",
    title: "Mobile App",
    description: "Native mobile apps for iOS and Android",
    status: "planned",
    quarter: "Q4 2026",
    projectId: "proj-3",
    priority: "medium",
  },
];

const STRATEGIC_GOALS = [
  {
    id: "goal-1",
    title: "Market Leadership",
    description: "Become the #1 project management tool for teams",
    progress: 35,
  },
  {
    id: "goal-2",
    title: "User Growth",
    description: "Scale from 10K to 100K active users",
    progress: 28,
  },
  {
    id: "goal-3",
    title: "Enterprise Features",
    description: "Complete enterprise feature parity with competitors",
    progress: 62,
  },
  {
    id: "goal-4",
    title: "Global Expansion",
    description: "Launch in 10 new markets with localization",
    progress: 12,
  },
];

function RoadmapContent() {
  const [items, setItems] = useState<RoadmapItem[]>(ROADMAP_ITEMS);
  const [draggedItem, setDraggedItem] = useState<RoadmapItem | null>(null);

  const getItemsByQuarter = (quarter: string) => {
    return items.filter((item) => item.quarter === quarter);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600";
      case "in_progress":
        return "bg-black";
      case "planned":
        return "bg-slate-500";
      default:
        return "bg-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-l-4 border-red-600";
      case "high":
        return "border-l-4 border-orange-600";
      case "medium":
        return "border-l-4 border-yellow-600";
      case "low":
        return "border-l-4 border-blue-600";
      default:
        return "";
    }
  };

  const handleDragStart = (e: React.DragEvent, item: RoadmapItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetQuarter: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.quarter === targetQuarter) {
      setDraggedItem(null);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === draggedItem.id ? { ...item, quarter: targetQuarter } : item
      )
    );

    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Roadmap</h1>
              <p className="text-secondary-text">Strategic planning and quarterly milestones</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" className="flex items-center gap-2">
                <Download size={16} />
                Export
              </Button>
              <Button size="sm" variant="secondary" className="flex items-center gap-2">
                <Share2 size={16} />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Strategic Goals */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          {STRATEGIC_GOALS.map((goal) => (
            <Card key={goal.id}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-2 mb-3">
                  <Target size={16} className="text-primary-text mt-0.5 flex-shrink-0" />
                  <h3 className="font-semibold text-sm text-primary-text">{goal.title}</h3>
                </div>
                <p className="text-xs text-secondary-text mb-3">{goal.description}</p>
                <div className="space-y-2">
                  <div className="h-2 bg-secondary-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-secondary-text text-right">{goal.progress}%</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Roadmap Quarters */}
        <div className="grid grid-cols-4 gap-4 flex-1 overflow-y-auto">
          {QUARTERS.map((quarter) => {
            const quarterItems = getItemsByQuarter(quarter);

            return (
              <Card key={quarter} className="flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Flag size={18} className="text-primary-text" />
                    {quarter}
                  </CardTitle>
                  <p className="text-xs text-secondary-text mt-1">
                    {quarterItems.length} items
                  </p>
                </CardHeader>
                <CardContent
                  className="flex-1 space-y-3 overflow-y-auto"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, quarter)}
                >
                  {quarterItems.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-secondary-text text-sm">
                      No items planned
                    </div>
                  ) : (
                    quarterItems.map((item) => {
                      const project = MOCK_PROJECTS.find((p: any) => p.id === item.projectId);

                      return (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                          onDragEnd={handleDragEnd}
                          className={`p-3 rounded-lg border border-border cursor-grab active:cursor-grabbing hover:shadow-lg transition-all group ${getStatusColor(item.status)} ${getPriorityColor(item.priority)} opacity-90 hover:opacity-100 ${
                            draggedItem?.id === item.id ? "opacity-50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-white truncate">
                                {item.title}
                              </h4>
                            </div>
                          </div>

                          <p className="text-xs text-white/80 mb-3 line-clamp-2">
                            {item.description}
                          </p>

                          <div className="flex items-center justify-between gap-2">
                            {project && (
                              <Link href={ROUTES.PROJECT_DETAIL(project.id)}>
                                <span className="text-xs text-white/70 hover:text-white">
                                  {project.name.split(" ")[0]}
                                </span>
                              </Link>
                            )}
                            <Badge
                              size="sm"
                              variant="secondary"
                              className="text-xs bg-white/20 text-white border-0"
                            >
                              {item.priority}
                            </Badge>
                          </div>

                          <div className="mt-2 pt-2 border-t border-white/20">
                            <span className="text-xs text-white/70 capitalize">
                              {item.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-600" />
            <span className="text-secondary-text">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-black" />
            <span className="text-secondary-text">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-slate-500" />
            <span className="text-secondary-text">Planned</span>
          </div>
          <div className="text-secondary-text ml-auto">
            💡 Drag items between quarters to reschedule
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function Roadmap() {
  return (
    <ProtectedRoute>
      <RoadmapContent />
    </ProtectedRoute>
  );
}
