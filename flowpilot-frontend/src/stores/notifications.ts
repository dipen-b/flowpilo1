import { create } from "zustand";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationsStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearOldNotifications: () => void;
}

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notificationData) => {
    const notification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}`,
      timestamp: Date.now(),
      read: false,
    };

    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));

    // Auto-remove notification after 10 seconds for toast-like behavior
    if (notificationData.type !== "error") {
      setTimeout(() => {
        get().removeNotification(notification.id);
      }, 10000);
    }
  },

  removeNotification: (id: string) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: notification && !notification.read ? state.unreadCount - 1 : state.unreadCount,
      };
    });
  },

  markAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearOldNotifications: () => {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    set((state) => {
      const filteredNotifications = state.notifications.filter(
        (n) => n.timestamp > oneHourAgo || !n.read
      );
      const removedCount = state.notifications.length - filteredNotifications.length;
      return {
        notifications: filteredNotifications,
        unreadCount: Math.max(0, state.unreadCount - removedCount),
      };
    });
  },
}));
