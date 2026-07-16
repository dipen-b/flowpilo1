"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, FolderKanban, Timer, Users, BarChart3, FileText,
  Zap, Settings, Compass, Sun, Moon, Search, LogOut, Calendar,
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
  const [menuOpen, setMenuOpen] = useState(false);
  const { open: paletteOpen, setOpen: setPaletteOpen } = useCommandPalette();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-bg">
      {/* Top navigation */}
      <header className="glass sticky top-0 z-30 border-b border-line">
        {/* Row 1: logo · search · actions */}
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-6">
          <Logo />
          <button onClick={() => setPaletteOpen(true)}
            className="ml-2 hidden max-w-md flex-1 items-center gap-2.5 rounded-lg border border-line bg-surface px-3.5 py-2 text-ink-3 transition hover:border-brand hover:bg-surface-2 sm:flex">
            <Search size={16} />
            <span className="text-sm">Search projects, tasks, people…</span>
            <kbd className="ml-auto rounded border border-line bg-surface-2 px-2 py-0.5 text-xs font-medium">⌘K</kbd>
          </button>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={() => setPaletteOpen(true)} aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-3 transition hover:border-brand hover:bg-surface-2 sm:hidden">
              <Search size={16} />
            </button>
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
        </div>

        {/* Row 2: horizontal nav tabs */}
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 md:px-6">
          <nav className="hide-scrollbar flex flex-1 items-center gap-1 overflow-x-auto pb-2.5">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link key={href} href={href}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    active ? "bg-brand text-white shadow-sm" : "text-ink-2 hover:text-ink hover:bg-surface-2"
                  }`}>
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>
          {sprint && (
            <div className="hidden shrink-0 items-center gap-2.5 pb-2.5 lg:flex" title={`${sprint.name} — ${sprint.progress}% complete`}>
              <span className="text-xs font-semibold text-ink-2">{sprint.name}</span>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${sprint.progress}%`, background: "var(--brand)" }} />
              </div>
              <span className="tabular text-xs font-medium text-ink-3">{sprint.progress}%</span>
            </div>
          )}
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6">
        {children}
      </main>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
