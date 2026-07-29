"use client";

import React from "react";
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { useNotificationsStore } from "@/stores/notifications";

export function ToastContainer() {
  const notifications = useNotificationsStore((state) => state.notifications);
  const removeNotification = useNotificationsStore((state) => state.removeNotification);

  // Only show non-read notifications as toasts (most recent 3)
  const toastNotifications = notifications
    .filter((n) => !n.read)
    .slice(0, 3);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={20} className="text-primary-text" />;
      case "error":
        return <AlertCircle size={20} className="text-primary-text" />;
      case "warning":
        return <AlertTriangle size={20} className="text-primary-text" />;
      default:
        return <Info size={20} className="text-primary-text" />;
    }
  };

  const getBackground = (type: string) => {
    switch (type) {
      case "success":
        return "bg-gray-800 border-gray-700";
      case "error":
        return "bg-gray-900 border-gray-800";
      case "warning":
        return "bg-gray-800 border-gray-700";
      default:
        return "bg-gray-800 border-gray-700";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm">
      {toastNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 p-4 rounded-lg border ${getBackground(
            notification.type
          )} animate-in fade-in slide-in-from-bottom-4 duration-300`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-primary-text">
              {notification.title}
            </h3>
            <p className="text-xs text-secondary-text mt-0.5">
              {notification.message}
            </p>
            {notification.action && (
              <button
                onClick={notification.action.onClick}
                className="text-xs text-primary-text hover:underline mt-2 font-medium"
              >
                {notification.action.label}
              </button>
            )}
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X size={16} className="text-secondary-text" />
          </button>
        </div>
      ))}
    </div>
  );
}
