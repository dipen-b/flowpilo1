"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { ROUTES, MAIN_NAVIGATION, MOCK_PROJECTS, MOCK_TASKS } from "@/constants";
import { cn } from "@/utils/cn";

interface Command {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: () => void;
  href?: string;
  category: "navigation" | "projects" | "tasks" | "actions";
}

interface CommandPaletteProps {
  onClose: () => void;
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = [
    // Navigation
    ...MAIN_NAVIGATION.map((nav) => ({
      id: nav.path,
      title: nav.label,
      description: `Go to ${nav.label}`,
      href: nav.path,
      category: "navigation" as const,
    })),

    // Projects
    ...MOCK_PROJECTS.map((proj: any) => ({
      id: proj.id,
      title: proj.name,
      description: proj.description,
      href: ROUTES.PROJECT_DETAIL(proj.id),
      category: "projects" as const,
    })),

    // Tasks
    ...MOCK_TASKS.slice(0, 3).map((task: any) => ({
      id: task.id,
      title: task.title,
      description: `Task in ${MOCK_PROJECTS.find((p: any) => p.id === task.projectId)?.name}`,
      href: ROUTES.TASK_DETAIL(task.id),
      category: "tasks" as const,
    })),

    // Actions
    {
      id: "create-task",
      title: "Create Task",
      description: "Create a new task",
      category: "actions" as const,
    },
    {
      id: "create-project",
      title: "Create Project",
      description: "Create a new project",
      category: "actions" as const,
    },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filtered.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
          break;
        case "Enter":
          e.preventDefault();
          const selected = filtered[selectedIndex];
          if (selected?.href) {
            router.push(selected.href);
          }
          onClose();
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filtered, selectedIndex, router, onClose]);

  // Group commands by category
  const grouped = {
    navigation: filtered.filter((c) => c.category === "navigation"),
    projects: filtered.filter((c) => c.category === "projects"),
    tasks: filtered.filter((c) => c.category === "tasks"),
    actions: filtered.filter((c) => c.category === "actions"),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50">
      <div className="w-full max-w-2xl bg-card-bg border border-border rounded-lg shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          <Search size={20} className="text-secondary-text flex-shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search projects, tasks, or commands..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-primary-text placeholder:text-secondary-text outline-none text-base"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary-bg rounded transition-colors"
          >
            <X size={20} className="text-secondary-text" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-secondary-text">No results found</p>
            </div>
          ) : (
            <>
              {grouped.navigation.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                    Navigation
                  </div>
                  {grouped.navigation.map((cmd, idx) => (
                    <CommandItem
                      key={cmd.id}
                      cmd={cmd}
                      isSelected={filtered.indexOf(cmd) === selectedIndex}
                      onSelect={() => {
                        if (cmd.href) router.push(cmd.href);
                        onClose();
                      }}
                    />
                  ))}
                </div>
              )}

              {grouped.projects.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                    Projects
                  </div>
                  {grouped.projects.map((cmd) => (
                    <CommandItem
                      key={cmd.id}
                      cmd={cmd}
                      isSelected={filtered.indexOf(cmd) === selectedIndex}
                      onSelect={() => {
                        if (cmd.href) router.push(cmd.href);
                        onClose();
                      }}
                    />
                  ))}
                </div>
              )}

              {grouped.tasks.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                    Tasks
                  </div>
                  {grouped.tasks.map((cmd) => (
                    <CommandItem
                      key={cmd.id}
                      cmd={cmd}
                      isSelected={filtered.indexOf(cmd) === selectedIndex}
                      onSelect={() => {
                        if (cmd.href) router.push(cmd.href);
                        onClose();
                      }}
                    />
                  ))}
                </div>
              )}

              {grouped.actions.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                    Actions
                  </div>
                  {grouped.actions.map((cmd) => (
                    <CommandItem
                      key={cmd.id}
                      cmd={cmd}
                      isSelected={filtered.indexOf(cmd) === selectedIndex}
                      onSelect={() => {
                        if (cmd.action) cmd.action();
                        onClose();
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-secondary-bg px-4 py-3 flex items-center justify-between text-xs text-secondary-text">
          <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
        </div>
      </div>
    </div>
  );
}

interface CommandItemProps {
  cmd: Command;
  isSelected: boolean;
  onSelect: () => void;
}

function CommandItem({ cmd, isSelected, onSelect }: CommandItemProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full px-4 py-3 flex items-center justify-between text-left hover:bg-secondary-bg transition-colors",
        isSelected && "bg-accent-purple/10"
      )}
    >
      <div className="flex-1">
        <p className={cn("text-sm font-medium", isSelected && "text-accent-purple")}>
          {cmd.title}
        </p>
        {cmd.description && (
          <p className="text-xs text-secondary-text mt-0.5">{cmd.description}</p>
        )}
      </div>
      <ArrowRight size={16} className="text-secondary-text flex-shrink-0 ml-4" />
    </button>
  );
}

export default CommandPalette;
