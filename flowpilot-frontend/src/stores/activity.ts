import { create } from "zustand";

export type ActivityType =
  | "project"
  | "task"
  | "file"
  | "team"
  | "comment"
  | "sprint"
  | "document";

export type ActivityAction =
  | "created"
  | "updated"
  | "deleted"
  | "assigned"
  | "shared"
  | "completed"
  | "commented"
  | "mentioned";

export interface Activity {
  id: string;
  type: ActivityType;
  action: ActivityAction;
  actor: string; // User name who performed action
  target: string; // What the action was on (e.g., "Design System" project)
  description: string; // Human-readable description
  timestamp: number;
  read: boolean;
  metadata?: {
    targetId?: string;
    targetUrl?: string;
    icon?: string;
    color?: string;
  };
}

interface ActivityStore {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteActivity: (id: string) => void;
  clearActivities: () => void;
  getRecentActivities: (limit: number) => Activity[];
  getActivitiesByType: (type: ActivityType) => Activity[];
  getUnreadCount: () => number;
  filterActivities: (
    types: ActivityType[],
    limit: number
  ) => Activity[];
}

export const useActivityStore = create<ActivityStore>((set, get) => ({
  activities: [],

  addActivity: (activityData) => {
    const activity: Activity = {
      ...activityData,
      id: `activity-${Date.now()}`,
      timestamp: Date.now(),
      read: false,
    };

    set((state) => ({
      activities: [activity, ...state.activities].slice(0, 500), // Keep last 500
    }));
  },

  markAsRead: (id: string) => {
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id ? { ...a, read: true } : a
      ),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      activities: state.activities.map((a) => ({ ...a, read: true })),
    }));
  },

  deleteActivity: (id: string) => {
    set((state) => ({
      activities: state.activities.filter((a) => a.id !== id),
    }));
  },

  clearActivities: () => {
    set({ activities: [] });
  },

  getRecentActivities: (limit: number) => {
    return get().activities.slice(0, limit);
  },

  getActivitiesByType: (type: ActivityType) => {
    return get().activities.filter((a) => a.type === type);
  },

  getUnreadCount: () => {
    return get().activities.filter((a) => !a.read).length;
  },

  filterActivities: (types: ActivityType[], limit: number) => {
    if (types.length === 0) return get().getRecentActivities(limit);
    return get()
      .activities.filter((a) => types.includes(a.type))
      .slice(0, limit);
  },
}));
