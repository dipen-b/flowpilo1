"use client";

import { useEffect, useState, useMemo } from "react";
import { AppLayout } from "@/components/layout";
import { Badge } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useActivityStore, type ActivityType } from "@/stores/activity";
import { useRealtimeStore } from "@/stores/realtimeActivity";
import { RealtimeWidget } from "@/components/RealtimeStatus";
import {
  Bell,
  CheckCircle2,
  Trash2,
  Filter,
  Clock,
  MessageSquare,
  FolderOpen,
  Users,
  FileText,
  CheckCheck,
} from "lucide-react";

function NotificationCenter() {
  const { activities, markAsRead, markAllAsRead, deleteActivity, filterActivities } =
    useActivityStore();
  const { initializeRealtime, cleanup } = useRealtimeStore();
  const [selectedFilters, setSelectedFilters] = useState<ActivityType[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const unsubscribe = initializeRealtime();
    return () => {
      unsubscribe?.();
      cleanup();
    };
  }, [initializeRealtime, cleanup]);

  const filterOptions: { label: string; value: ActivityType; icon: React.ReactNode }[] = [
    { label: "Projects", value: "project", icon: <FolderOpen size={16} /> },
    { label: "Tasks", value: "task", icon: <CheckCircle2 size={16} /> },
    { label: "Comments", value: "comment", icon: <MessageSquare size={16} /> },
    { label: "Team", value: "team", icon: <Users size={16} /> },
    { label: "Files", value: "file", icon: <FileText size={16} /> },
  ];

  const filteredActivities = useMemo(() => {
    return selectedFilters.length > 0
      ? filterActivities(selectedFilters, 100)
      : activities.slice(0, 100);
  }, [activities, selectedFilters, filterActivities]);

  const unreadCount = activities.filter((a) => !a.read).length;

  const toggleFilter = (type: ActivityType) => {
    setSelectedFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "project":
        return <FolderOpen size={18} className="text-blue-500" />;
      case "task":
        return <CheckCircle2 size={18} className="text-green-500" />;
      case "comment":
        return <MessageSquare size={18} className="text-purple-500" />;
      case "team":
        return <Users size={18} className="text-orange-500" />;
      case "file":
        return <FileText size={18} className="text-pink-500" />;
      default:
        return <Bell size={18} className="text-secondary-text" />;
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "created":
        return "bg-green-500/10 text-green-500";
      case "updated":
        return "bg-blue-500/10 text-blue-500";
      case "deleted":
        return "bg-red-500/10 text-red-500";
      case "assigned":
        return "bg-purple-500/10 text-purple-500";
      case "shared":
        return "bg-orange-500/10 text-orange-500";
      case "completed":
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-secondary-bg text-secondary-text";
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Bell size={32} className="text-primary-text" />
            <div>
              <h1 className="text-4xl font-bold text-primary-text">Notifications</h1>
              <p className="text-lg text-secondary-text">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
              </p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        {unreadCount > 0 && (
          <div className="flex gap-3 items-center">
            <RealtimeWidget />
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-lg bg-primary-text text-card-bg font-semibold hover:opacity-90 transition-all flex items-center gap-2 text-sm"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                showFilters || selectedFilters.length > 0
                  ? "bg-primary-text text-card-bg"
                  : "bg-secondary-bg text-secondary-text hover:text-primary-text border border-border"
              }`}
            >
              <Filter size={16} />
              Filters {selectedFilters.length > 0 && `(${selectedFilters.length})`}
            </button>

            {selectedFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-primary-text/10 border border-primary-text/30 text-primary-text hover:bg-primary-text/20 transition-colors capitalize font-semibold"
              >
                {filter}
                <span>✕</span>
              </button>
            ))}
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 p-6 bg-secondary-bg rounded-xl border border-border">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleFilter(option.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedFilters.includes(option.value)
                      ? "bg-primary-text text-card-bg"
                      : "bg-card-bg border border-border text-primary-text hover:border-primary-text/30"
                  }`}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications List */}
        {filteredActivities.length === 0 ? (
          <div className="bg-secondary-bg rounded-xl border border-border p-12 text-center">
            <Bell size={48} className="text-secondary-text mx-auto mb-4 opacity-50" />
            <p className="text-lg text-secondary-text mb-2">
              {selectedFilters.length > 0 ? "No notifications match your filters" : "No notifications yet"}
            </p>
            <p className="text-base text-secondary-text">
              {selectedFilters.length > 0
                ? "Try adjusting your filters"
                : "Activity will appear here as things happen"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className={`bg-secondary-bg rounded-lg border transition-all p-6 hover:border-primary-text/20 space-y-3 ${
                  activity.read ? "border-border" : "border-primary-text/30 bg-primary-text/2"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="mt-1 flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <p className={`font-semibold text-base ${activity.read ? "text-primary-text" : "text-primary-text font-bold"}`}>
                          {activity.description}
                        </p>
                        <Badge
                          className={`text-xs capitalize font-semibold ${getActionBadgeColor(activity.action)}`}
                        >
                          {activity.action}
                        </Badge>
                        {!activity.read && (
                          <div className="w-2 h-2 rounded-full bg-primary-text flex-shrink-0" />
                        )}
                      </div>

                      <p className="text-base text-secondary-text mb-3">{activity.actor}</p>

                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-secondary-text" />
                        <p className="text-sm text-secondary-text">
                          {formatTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!activity.read && (
                      <button
                        onClick={() => markAsRead(activity.id)}
                        className="p-2 rounded-lg hover:bg-card-bg text-secondary-text hover:text-primary-text transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteActivity(activity.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-secondary-text hover:text-red-500 transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function Notifications() {
  return (
    <ProtectedRoute>
      <NotificationCenter />
    </ProtectedRoute>
  );
}
