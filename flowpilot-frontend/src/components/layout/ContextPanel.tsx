"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { X } from "lucide-react";
import { useUIStore } from "@/stores/ui";

interface ContextPanelProps {
  children?: React.ReactNode;
}

export function ContextPanel({ children }: ContextPanelProps) {
  const { contextPanelOpen, toggleContextPanel, contextPanelWidth } = useUIStore();

  if (!contextPanelOpen) {
    return null;
  }

  return (
    <aside
      className="border-l border-border bg-secondary-bg overflow-y-auto transition-all duration-300"
      style={{ width: `${contextPanelWidth}px` }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-primary-text">Details</h2>
          <button
            onClick={toggleContextPanel}
            className="p-1 hover:bg-card-bg rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {children && (
          <div>{children}</div>
        )}

        {!children && (
          <div className="text-center text-secondary-text">
            <p className="text-sm">Select an item to view details</p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default ContextPanel;
