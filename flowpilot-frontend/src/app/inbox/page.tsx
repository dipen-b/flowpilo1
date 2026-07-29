"use client";

import { AppLayout } from "@/components/layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Mail, Trash2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface InboxItem {
  id: string;
  title: string;
  description: string;
  sender: string;
  timestamp: string;
  read: boolean;
  type: "mention" | "assignment" | "update" | "comment";
}

const INBOX_ITEMS: InboxItem[] = [
  {
    id: "1",
    title: "You were assigned to FlowPilot Frontend",
    description: "John Doe assigned you to build dashboard widgets",
    sender: "John Doe",
    timestamp: "2 hours ago",
    read: false,
    type: "assignment",
  },
  {
    id: "2",
    title: "Comment on Setup authentication",
    description: "Sarah mentioned you in a comment",
    sender: "Sarah Smith",
    timestamp: "5 hours ago",
    read: false,
    type: "comment",
  },
  {
    id: "3",
    title: "Project update: Mobile App",
    description: "Mobile App status changed to planning",
    sender: "System",
    timestamp: "1 day ago",
    read: true,
    type: "update",
  },
  {
    id: "4",
    title: "You were mentioned in Sprint 1",
    description: "Team mentioned you in Sprint 1 discussion",
    sender: "Team",
    timestamp: "2 days ago",
    read: true,
    type: "mention",
  },
  {
    id: "5",
    title: "Task deadline approaching",
    description: "Database optimization is due in 2 days",
    sender: "System",
    timestamp: "3 days ago",
    read: true,
    type: "update",
  },
];

function InboxContent() {
  const [items, setItems] = useState<InboxItem[]>(INBOX_ITEMS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredItems = filter === "unread" ? items.filter(item => !item.read) : items;
  const unreadCount = items.filter(i => !i.read).length;

  const markAsRead = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, read: true } : item));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const typeIcons = {
    mention: "👤",
    assignment: "✓",
    update: "📢",
    comment: "💬",
  };

  const typeColors = {
    mention: "bg-blue-500/10 text-blue-500",
    assignment: "bg-green-500/10 text-green-500",
    update: "bg-orange-500/10 text-orange-500",
    comment: "bg-purple-500/10 text-purple-500",
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail size={32} className="text-primary-text" />
            <div>
              <h1 className="text-4xl font-bold text-primary-text">Inbox</h1>
              <p className="text-lg text-secondary-text">{filteredItems.length} notification{filteredItems.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 flex-wrap items-center">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              filter === "all"
                ? "bg-primary-text text-card-bg"
                : "bg-secondary-bg text-secondary-text hover:text-primary-text border border-border"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              filter === "unread"
                ? "bg-primary-text text-card-bg"
                : "bg-secondary-bg text-secondary-text hover:text-primary-text border border-border"
            }`}
          >
            Unread {unreadCount > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 text-xs font-bold">{unreadCount}</span>}
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="bg-secondary-bg rounded-xl border border-border p-12 text-center">
              <Mail size={48} className="text-secondary-text mx-auto mb-4 opacity-50" />
              <p className="text-lg text-secondary-text">No notifications to show</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div
                key={item.id}
                className={`bg-secondary-bg rounded-lg border transition-all p-6 hover:border-primary-text/20 space-y-3 ${
                  item.read ? "border-border" : "border-primary-text/30 bg-primary-text/2"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Type Icon */}
                  <div className={`text-2xl px-3 py-2 rounded-lg ${typeColors[item.type]}`}>
                    {typeIcons[item.type]}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title and Unread Indicator */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className={`text-base font-semibold ${item.read ? "text-primary-text" : "text-primary-text font-bold"}`}>
                        {item.title}
                      </h3>
                      {!item.read && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-text flex-shrink-0 mt-1" />
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-base text-secondary-text mb-3">{item.description}</p>

                    {/* Metadata */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-secondary-text">
                        <span className="font-medium">{item.sender}</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {!item.read && (
                          <button
                            onClick={() => markAsRead(item.id)}
                            className="p-2 rounded-lg hover:bg-card-bg text-secondary-text hover:text-primary-text transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-secondary-text hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default function Inbox() {
  return (
    <ProtectedRoute>
      <InboxContent />
    </ProtectedRoute>
  );
}
