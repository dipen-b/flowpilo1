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
import { ACCENTS, accentFromHex, applyAccent, type Accent } from "@/lib/accents";

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
  const [current, setCurrent] = useState("green");
  const [customHex, setCustomHex] = useState("#10b981");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fp-accent-name");
      if (saved) setCurrent(saved);
      if (saved === "custom") {
        const stored = localStorage.getItem("fp-accent");
        if (stored) setCustomHex(JSON.parse(stored).brand);
      }
    } catch {}
  }, []);
  const pick = (accent: Accent) => {
    applyAccent(accent);
    setCurrent(accent.name);
    setOpen(false);
  };
  const pickCustom = (hex: string) => {
    setCustomHex(hex);
    applyAccent(accentFromHex(hex));
    setCurrent("custom");
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
          <div className="mt-3 border-t border-line pt-3">
            <label className="flex cursor-pointer items-center gap-2.5">
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full transition hover:scale-110"
                style={{
                  background: customHex,
                  boxShadow: current === "custom" ? `0 0 0 2px var(--surface), 0 0 0 4px ${customHex}` : undefined,
                }}>
                <input type="color" value={customHex} aria-label="Custom theme color"
                  onChange={(e) => pickCustom(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                {current === "custom" && <Check size={14} className="pointer-events-none text-white" />}
              </span>
              <span className="text-xs font-medium text-ink-2">Custom</span>
              <span className="tabular ml-auto text-xs text-ink-3">{customHex}</span>
            </label>
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

  const navList = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href} onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              active ? "text-white shadow-md" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
            }`}
            style={active ? { background: "var(--brand)" } : undefined}>
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const sprintCard = sprint && (
    <div className="p-3">
      <div className="rounded-xl border border-line bg-surface-2 p-3.5" title={`${sprint.name} — ${sprint.progress}% complete`}>
        <p className="text-xs font-semibold text-ink">{sprint.name}</p>
        <p className="mt-1.5 text-xs text-ink-2">
          {sprint.daysLeft !== null ? `${sprint.daysLeft} days left · ` : ""}
          <span className="font-medium">{sprint.progress}%</span> complete
        </p>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${sprint.progress}%`, background: "var(--brand)" }} />
        </div>
      </div>
    </div>
  );

  const sidebarInner = (
    <>
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <Logo size={18} />
        <button onClick={() => setMobileOpen(false)} aria-label="Close menu"
          className="rounded-lg p-1.5 text-ink-3 transition hover:bg-surface-2 hover:text-ink md:hidden">
          <X size={18} />
        </button>
      </div>
      <button onClick={() => setPaletteOpen(true)} aria-label="Search"
        className="mx-3 mb-3 flex h-9 items-center gap-2 rounded-full border border-line bg-surface-2 px-3.5 text-ink-3 transition hover:border-brand hover:text-ink-2">
        <Search size={15} />
        <span className="text-sm">Jump to…</span>
        <kbd className="ml-auto rounded border border-line bg-surface px-1.5 text-xs">⌘K</kbd>
      </button>
      {navList}
      {sprintCard}
    </>
  );

  return (
    <div className="min-h-screen w-full bg-bg">
      {/* Floating sidebar (desktop) */}
      <aside className="fixed bottom-4 left-4 top-4 z-30 hidden w-64 flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-lg md:flex">
        {sidebarInner}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="float-up absolute bottom-4 left-4 top-4 flex w-64 flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-lg">
            {sidebarInner}
          </aside>
        </div>
      )}

      {/* Top bar with menu toggle + actions */}
      <header className="flex items-center gap-3 px-4 pt-5 md:ml-72 md:pr-6">
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu"
          className="rounded-lg p-1.5 text-ink-2 transition hover:bg-surface-2 md:hidden">
          <Menu size={20} />
        </button>
        <div className="md:hidden">
          <Logo size={18} />
        </div>
        <div className="ml-auto flex items-center gap-2">
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
              <div className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-line bg-surface shadow-lg float-up overflow-hidden">
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

      {/* Page content — offset for the sidebar, centered column inside */}
      <main className="px-4 py-6 md:pl-72 md:pr-6 md:py-8">
        <div className="mx-auto w-full max-w-5xl">
          {children}
        </div>
      </main>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
