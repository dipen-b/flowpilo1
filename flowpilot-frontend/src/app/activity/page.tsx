"use client";

import { useEffect } from "react";
import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useActivityStore, type ActivityType } from "@/stores/activity";
import { useRealtimeStore } from "@/stores/realtimeActivity";
import { RealtimeWidget } from "@/components/RealtimeStatus";
import {
  Search,
  Filter,
  Download,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Edit,
  Trash2,
  UserPlus,
  Clock,
  FileText,
  FolderOpen,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";


function ActivityIcon({ type }: { type: ActivityType }) {
  const size = 20;
  switch (type) {
    case "project":
      return <FolderOpen size={size} className="text-blue-600" />;
    case "task":
      return <CheckCircle2 size={size} className="text-green-600" />;
    case "comment":
      return <MessageSquare size={size} className="text-purple-600" />;
    case "team":
      return <Users size={size} className="text-orange-600" />;
    case "file":
      return <FileText size={size} className="text-pink-600" />;
    case "sprint":
      return <Zap size={size} className="text-yellow-600" />;
    case "document":
      return <FileText size={size} className="text-indigo-600" />;
    default:
      return <Clock size={size} className="text-gray-600" />;
  }
}

function ActivityContent() {
  const { activities } = useActivityStore();
  const { initializeRealtime, cleanup } = useRealtimeStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTypes, setFilterTypes] = useState<ActivityType[]>([]);

  // Initialize real-time updates on mount
  useEffect(() => {
    const unsubscribe = initializeRealtime();
    return () => {
      unsubscribe?.();
      cleanup();
    };
  }, [initializeRealtime, cleanup]);

  // Group activities by date
  const groupedActivities = activities.reduce(
    (acc, activity) => {
      const date = new Date(activity.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let label: string;

      const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

      if (isSameDay(date, today)) {
        label = "Today";
      } else if (isSameDay(date, yesterday)) {
        label = "Yesterday";
      } else {
        const month = date.toLocaleString("en-US", { month: "short" });
        const day = date.getDate();
        const year = date.getFullYear();
        label = `${month} ${day}, ${year}`;
      }

      if (!acc[label]) {
        acc[label] = [];
      }
      acc[label].push(activity);
      return acc;
    },
    {} as Record<string, typeof activities>
  );

  const filteredActivity = activities.filter((entry) => {
    const matchesSearch =
      entry.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterTypes.length === 0 || filterTypes.includes(entry.type);

    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: ActivityType) => {
    switch (type) {
      case "project":
        return "bg-blue-600/10 text-blue-600 border-blue-600/20";
      case "task":
        return "bg-green-600/10 text-green-600 border-green-600/20";
      case "comment":
        return "bg-purple-600/10 text-purple-600 border-purple-600/20";
      case "team":
        return "bg-orange-600/10 text-orange-600 border-orange-600/20";
      case "file":
        return "bg-pink-600/10 text-pink-600 border-pink-600/20";
      case "sprint":
        return "bg-yellow-600/10 text-yellow-600 border-yellow-600/20";
      case "document":
        return "bg-indigo-600/10 text-indigo-600 border-indigo-600/20";
      default:
        return "bg-gray-600/10 text-gray-600 border-gray-600/20";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "created":
        return "text-green-600";
      case "updated":
        return "text-blue-600";
      case "deleted":
        return "text-red-600";
      case "assigned":
        return "text-purple-600";
      case "shared":
        return "text-orange-600";
      case "completed":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Activity Feed</h1>
            <p className="text-secondary-text">Track all changes and activities in your workspace</p>
          </div>
          <div className="flex items-center gap-3">
            <RealtimeWidget />
            <Button size="sm" variant="secondary" className="flex items-center gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" size={16} />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary-bg border border-border rounded-lg text-primary-text focus:outline-none focus:border-primary-text"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-secondary-text" />
              <span className="text-sm text-secondary-text">Activity Type:</span>
            </div>
            {(["project", "task", "file", "team", "comment", "sprint", "document"] as const).map(
              (type: ActivityType) => (
                <button
                  key={type}
                  onClick={() =>
                    setFilterTypes((prev) =>
                      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
                    )
                  }
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize ${
                    filterTypes.includes(type)
                      ? "bg-primary-text text-secondary-bg"
                      : "bg-secondary-bg text-secondary-text hover:text-primary-text"
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Activity Timeline</span>
              <span className="text-sm font-normal text-secondary-text">{filteredActivity.length} activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivity.length === 0 ? (
                <div className="text-center text-secondary-text py-8">
                  <Clock size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No activities found</p>
                  <p className="text-xs mt-2">Activity will appear as things happen</p>
                </div>
              ) : (
                filteredActivity.map((entry, idx) => (
                  <div key={entry.id} className="relative pb-4">
                    {/* Timeline line */}
                    {idx < filteredActivity.length - 1 && (
                      <div className="absolute left-9 top-12 bottom-0 w-0.5 bg-border" />
                    )}

                    {/* Activity item */}
                    <div className="flex gap-4">
                      {/* Timeline dot */}
                      <div className="flex-shrink-0 relative z-10">
                        <div className="w-5 h-5 rounded-full bg-card-bg border-2 border-border flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary-text" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <ActivityIcon type={entry.type} />
                            <span className="font-semibold text-primary-text">{entry.actor}</span>
                            <span className={`text-sm font-medium capitalize ${getActionColor(entry.action)}`}>
                              {entry.action}
                            </span>
                            <code className="px-2 py-0.5 bg-secondary-bg rounded text-sm text-primary-text font-mono">
                              {entry.target}
                            </code>
                          </div>
                          <Badge variant="secondary" className={`capitalize flex-shrink-0 ${getTypeColor(entry.type)}`}>
                            {entry.type}
                          </Badge>
                        </div>

                        <p className="text-sm text-secondary-text ml-0">{entry.description}</p>

                        <p className="text-xs text-secondary-text mt-1">
                          {new Date(entry.timestamp).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Total Activities</p>
                <p className="text-2xl font-bold text-primary-text">{activities.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Projects Created</p>
                <p className="text-2xl font-bold text-blue-600">
                  {activities.filter((a) => a.type === "project" && a.action === "created").length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Tasks Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {activities.filter((a) => a.type === "task" && a.action === "completed").length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-secondary-text mb-1">Comments Posted</p>
                <p className="text-2xl font-bold text-purple-600">
                  {activities.filter((a) => a.type === "comment").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

export default function Activity() {
  return (
    <ProtectedRoute>
      <ActivityContent />
    </ProtectedRoute>
  );
}
