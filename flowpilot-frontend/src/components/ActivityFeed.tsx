"use client";

import { useActivityStore, type Activity } from "@/stores/activity";
import {
  FolderOpen,
  CheckCircle2,
  MessageSquare,
  Users,
  FileText,
  Clock,
  User,
  ArrowRight,
} from "lucide-react";
import { useMemo } from "react";

export function ActivityFeed() {
  const { activities } = useActivityStore();

  const groupedActivities = useMemo(() => {
    const groups: Record<string, Activity[]> = {};

    activities.forEach((activity) => {
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

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(activity);
    });

    return groups;
  }, [activities]);

  const getActivityIcon = (type: Activity["type"]) => {
    const size = 16;
    switch (type) {
      case "project":
        return <FolderOpen size={size} />;
      case "task":
        return <CheckCircle2 size={size} />;
      case "comment":
        return <MessageSquare size={size} />;
      case "team":
        return <Users size={size} />;
      case "file":
        return <FileText size={size} />;
      default:
        return <Clock size={size} />;
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
    <div className="space-y-6">
      {Object.entries(groupedActivities).length === 0 ? (
        <div className="text-center py-12">
          <Clock size={48} className="mx-auto mb-4 text-secondary-text opacity-50" />
          <p className="text-secondary-text">No activities yet</p>
          <p className="text-xs text-secondary-text">Activity will appear as things happen</p>
        </div>
      ) : (
        Object.entries(groupedActivities).map(([dateLabel, dateActivities]) => (
          <div key={dateLabel}>
            {/* Date Header */}
            <h3 className="text-sm font-semibold text-secondary-text mb-4 uppercase tracking-wider">
              {dateLabel}
            </h3>

            {/* Activity Timeline */}
            <div className="space-y-3">
              {dateActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="relative flex gap-4"
                >
                  {/* Timeline Line */}
                  {index < dateActivities.length - 1 && (
                    <div className="absolute left-[15px] top-12 bottom-0 w-0.5 bg-border" />
                  )}

                  {/* Icon Node */}
                  <div className="relative flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-card-bg border-2 border-border flex items-center justify-center text-primary-text">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="bg-card-bg rounded-lg p-3 border border-border hover:border-primary-text transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-primary-text text-sm">
                            {activity.description}
                          </p>
                          <p className="text-xs text-secondary-text mt-0.5">
                            {activity.actor}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          <span
                            className={`text-xs font-medium capitalize ${getActionColor(
                              activity.action
                            )}`}
                          >
                            {activity.action}
                          </span>
                        </div>
                      </div>

                      {/* Target Info */}
                      {activity.target && (
                        <div className="flex items-center gap-2 text-xs text-secondary-text mt-2 py-2 px-2 bg-secondary-bg rounded">
                          <span>{activity.target}</span>
                          {activity.metadata?.targetUrl && (
                            <a
                              href={activity.metadata.targetUrl}
                              className="ml-auto text-primary-text hover:underline flex items-center gap-1"
                            >
                              View <ArrowRight size={12} />
                            </a>
                          )}
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className="flex items-center gap-1 text-xs text-secondary-text mt-2">
                        <Clock size={12} />
                        <span>
                          {(() => {
                            const now = Date.now();
                            const diff = now - activity.timestamp;
                            const seconds = Math.floor(diff / 1000);
                            const minutes = Math.floor(seconds / 60);
                            const hours = Math.floor(minutes / 60);
                            const days = Math.floor(hours / 24);

                            if (seconds < 60) return "just now";
                            if (minutes < 60) return `${minutes}m ago`;
                            if (hours < 24) return `${hours}h ago`;
                            if (days < 7) return `${days}d ago`;
                            return new Date(activity.timestamp).toLocaleDateString();
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
