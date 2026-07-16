"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, FolderKanban, Timer, Users, BarChart3, FileText,
  Zap, Settings, Compass, Sun, Moon, Search, Menu, X, LogOut, Calendar,
  Palette, Check,
} from "lucide-react";
import { CommandPalette, useCommandPalette } from "@/components/command-palette";
import { NotificationsBell } from "@/components/notifications-bell";
import { ACCENTS, applyAccent, type Accent } from "@/lib/accents";

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

export function AccentPicker() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("teal");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fp-accent-name");
      if (saved) setCurrent(saved);
    } catch {}
  }, []);
  const pick = (accent: Accent) => {
    applyAccent(accent);
    setCurrent(accent.name);
    setOpen(false);
  };
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-label="Theme color"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-3 hover:text-ink-2 transition hover:bg-surface-2 hover:border-brand">
        <Palette size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-line bg-surface p-3.5 shadow-lg float-up">
          <p className="mb-2.5 text-xs font-semibold text-ink-2">Theme color</p>
          <div className="grid grid-cols-4 gap-2.5">
            {ACCENTS.map((accent) => (
              <button key={accent.name} title={accent.label} aria-label={accent.label}
                onClick={() => pick(accent)}
                className="flex h-8 w-8 items-center justify-center rounded-full transition hover:scale-110"
                style={{
                  background: accent.brand,
                  boxShadow: current === accent.name ? `0 0 0 2px var(--surface), 0 0 0 4px ${accent.brand}` : undefined,
                }}>
                {current === accent.name && <Check size={14} className="text-white" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
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
  const [mobileOpen, setMobileOpen] = useState(false);
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
          <Link key={href} href={href} onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
              active ? "bg-brand text-white shadow-md" : "text-ink-2 hover:text-ink hover:bg-surface-2"
            }`}>
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const sprintCard = sprint && (
    <div className="mt-auto p-3">
      <div className="rounded-xl border border-line bg-surface-2 p-3.5">
        <p className="text-xs font-semibold text-ink">{sprint.name}</p>
        <p className="mt-1.5 text-xs text-ink-2">
          {sprint.daysLeft !== null ? `${sprint.daysLeft} days left • ` : ""}
          <span className="font-medium">{sprint.progress}%</span> complete
        </p>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${sprint.progress}%`, background: "var(--brand)" }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-bg">
      {/* Top bar */}
      <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line px-4 md:px-6">
        <button className="md:hidden p-1.5 hover:bg-surface-2 rounded-lg transition" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <Logo />
        <button onClick={() => setPaletteOpen(true)}
          className="ml-2 hidden max-w-md flex-1 items-center gap-2.5 rounded-lg border border-line bg-surface px-3.5 py-2 text-ink-3 transition hover:border-brand hover:bg-surface-2 sm:flex">
          <Search size={16} />
          <span className="text-sm">Search projects, tasks, people…</span>
          <kbd className="ml-auto rounded border border-line bg-surface-2 px-2 py-0.5 text-xs font-medium">⌘K</kbd>
        </button>
        <div className="ml-auto flex items-center gap-3">
          <NotificationsBell />
          <AccentPicker />
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

      {/* Floating left menu (desktop) */}
      <aside className="fixed bottom-4 left-4 top-20 z-20 hidden w-60 flex-col overflow-y-auto rounded-2xl border border-line bg-surface py-4 shadow-lg md:flex">
        {nav}
        {sprintCard}
      </aside>

      {/* Floating menu drawer (mobile) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute bottom-4 left-4 top-4 flex w-64 flex-col overflow-y-auto rounded-2xl border border-line bg-surface py-4 shadow-lg float-up">
            <div className="mb-3 flex items-center justify-between px-5">
              <Logo />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu"
                className="p-1.5 hover:bg-surface-2 rounded-lg transition">
                <X size={18} />
              </button>
            </div>
            {nav}
            {sprintCard}
          </aside>
        </div>
      )}

      {/* Page content */}
      <main className="p-4 md:ml-[17rem] md:p-6">
        {children}
      </main>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
