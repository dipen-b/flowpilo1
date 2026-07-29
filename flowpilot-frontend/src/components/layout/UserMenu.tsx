"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-card-bg rounded-lg transition-colors"
      >
        <div
          className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center"
        >
          <span className="text-xs font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium">{user.name}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card-bg border border-border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-semibold text-primary-text">{user.name}</p>
            <p className="text-xs text-secondary-text">{user.email}</p>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to profile
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-text hover:text-primary-text hover:bg-secondary-bg transition-colors"
            >
              <User size={16} />
              Profile
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to settings
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-text hover:text-primary-text hover:bg-secondary-bg transition-colors"
            >
              <Settings size={16} />
              Settings
            </button>
          </div>

          <div className="border-t border-border p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors rounded"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
