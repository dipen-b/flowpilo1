"use client";

import React, { useState } from "react";
import { Bell, Moon, Sun, Search } from "lucide-react";
import { useUIStore } from "@/stores/ui";
import { useWorkspaceStore } from "@/stores/workspace";
import { useNotificationsStore } from "@/stores/notifications";
import Select from "@/components/ui/Select";
import { CommandPalette } from "@/components/CommandPalette";
import { cn } from "@/utils/cn";

function HeaderComponent() {
  const { theme, setTheme } = useUIStore();
  const { workspace, workspaces } = useWorkspaceStore();
  const { notifications } = useNotificationsStore();
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle CMD+K or CTRL+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="bg-card-bg border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-30">
        {/* Left: Workspace Selector */}
        <div className="flex items-center gap-4">
          <div className="w-40">
            <Select
              options={workspaces.map((w) => ({
                value: w.id,
                label: w.name,
              }))}
              value={workspace?.id || ""}
              onChange={() => {}}
              className="text-sm"
            />
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md mx-8">
          <button
            onClick={() => setShowCommandPalette(true)}
            className="w-full flex items-center justify-between px-3 py-2 bg-secondary-bg border border-border rounded-lg text-secondary-text hover:text-primary-text hover:border-border transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search size={16} />
              <span className="text-sm">Search...</span>
            </div>
            <span className="text-xs text-secondary-text bg-border px-2 py-1 rounded">
              ⌘K
            </span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-secondary-bg rounded-lg transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-card-bg border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-border sticky top-0 bg-card-bg">
                  <h3 className="font-semibold text-primary-text">Notifications</h3>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-secondary-text">No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          "p-4 hover:bg-secondary-bg cursor-pointer transition-colors",
                          !notif.read && "bg-accent-purple/5"
                        )}
                      >
                        <p className="text-sm font-medium text-primary-text">
                          {notif.title}
                        </p>
                        <p className="text-xs text-secondary-text mt-1">
                          {notif.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 hover:bg-secondary-bg rounded-lg transition-colors"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Command Palette */}
      {showCommandPalette && (
        <CommandPalette onClose={() => setShowCommandPalette(false)} />
      )}
    </>
  );
}

const Header = React.memo(HeaderComponent);
export default Header;
