"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, FolderKanban, Timer, Users, BarChart3, FileText,
  Zap, Settings, Compass, Sun, Moon, Search, Menu, X, LogOut, Calendar,
  ChevronRight,
} from "lucide-react";
import { CommandPalette, useCommandPalette } from "@/components/command-palette";
import { NotificationsBell } from "@/components/notifications-bell";

export interface ShellUser {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface ShellSprint {
  name: string;
  progress: number;
  daysLeft: number | null;
}

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/search", label: "Search", icon: Search },
  { href: "/sprints", label: "Sprints", icon: Timer },
  { href: "/attendance", label: "Attendance", icon: Calendar },
  { href: "/team", label: "Team", icon: Users },
  { href: "/integrations", label: "Integrations", icon: Compass },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/docs", label: "Docs", icon: FileText },
  { href: "/automations", label: "Automations", icon: Zap },
  { href: "/admin", label: "Admin", icon: Settings },
];

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("fp-theme", next ? "dark" : "light");
  };
  return (
    <button onClick={toggle} aria-label="Toggle theme"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-3 hover:text-ink-2 transition hover:bg-surface-2 hover:border-brand">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export function Logo({ size = 16 }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight hover:opacity-80 transition">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: "var(--brand)" }}>
        <Compass size={size} />
      </span>
      <span className="hidden sm:inline text-ink">FlowPilot</span>
    </Link>
  );
}

export function AppShell({ children, user, sprint }: { children: React.ReactNode; user: ShellUser; sprint?: ShellSprint | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { open: paletteOpen, setOpen: setPaletteOpen } = useCommandPalette();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const nav = (
    <nav className="flex flex-col gap-1 px-3">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group ${
              active ? "bg-brand text-white shadow-md" : "text-ink-2 hover:text-ink hover:bg-surface-2"
            }`}>
            <Icon size={18} />
            <span className={`flex-1 ${!sidebarOpen ? "hidden" : ""}`}>{label}</span>
            {active && sidebarOpen && <ChevronRight size={16} className="opacity-50" />}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full bg-bg">
      {/* Desktop Floating Sidebar */}
      <aside className={`hidden md:flex fixed left-0 top-0 h-screen flex-col transition-all duration-300 ${
        sidebarOpen ? "w-64 md:w-56" : "w-20"
      } bg-surface border-r border-line z-30 flex-col overflow-hidden`}>
        <div className={`flex items-center justify-between px-4 py-6 ${!sidebarOpen ? "flex-col gap-3" : ""}`}>
          {sidebarOpen && <Logo />}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-surface-2 rounded-lg transition"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Menu size={18} />
          </button>
        </div>

        {nav}

        {sprint && sidebarOpen && (
          <div className="mt-auto p-4 border-t border-line">
            <div className="rounded-lg border border-line bg-surface-2 p-3 hover:border-brand transition">
              <p className="text-xs font-semibold text-ink">{sprint.name}</p>
              <p className="mt-2 text-xs text-ink-2">
                {sprint.daysLeft !== null ? `${sprint.daysLeft}d • ` : ""}<span className="font-medium">{sprint.progress}%</span>
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
                <div className="h-full transition-all duration-700" style={{ width: `${sprint.progress}%`, background: "var(--brand)" }} />
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Floating Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-surface border-r border-line float-up flex flex-col">
            <div className="flex items-center justify-between px-5 py-6">
              <Logo />
              <button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
                <X size={18} />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ${sidebarOpen ? "md:ml-56" : "md:ml-20"}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface px-4 md:px-6">
          <button className="md:hidden p-1 hover:bg-surface-2 rounded-lg transition" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>

          <button onClick={() => setPaletteOpen(true)}
            className="hidden max-w-md flex-1 items-center gap-2.5 rounded-lg border border-line bg-surface px-3.5 py-2 text-ink-3 transition hover:border-brand hover:bg-surface-2 sm:flex">
            <Search size={16} />
            <span className="text-sm">Search projects, tasks, people…</span>
            <kbd className="ml-auto rounded border border-line bg-surface-2 px-2 py-0.5 text-xs font-medium">⌘K</kbd>
          </button>

          <div className="ml-auto flex items-center gap-3">
            <NotificationsBell />
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                title={user.name}
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white hover:opacity-80 transition"
                style={{ background: user.color }}
              >
                {user.initials}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border border-line bg-surface shadow-lg float-up overflow-hidden">
                  <p className="px-4 py-3 text-sm font-semibold text-ink border-b border-line">{user.name}</p>
                  <button onClick={logout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink-2 hover:text-critical hover:bg-critical/5 transition">
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
