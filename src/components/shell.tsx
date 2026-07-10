"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, FolderKanban, Timer, Users, BarChart3, FileText,
  Zap, Settings, Compass, Sun, Moon, Search, Bell, Menu, X,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/sprints", label: "Sprints", icon: Timer },
  { href: "/team", label: "Team", icon: Users },
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
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 transition hover:bg-surface-2">
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

export function Logo({ size = 15 }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
        style={{ background: "linear-gradient(135deg, var(--brand), var(--brand-2))" }}>
        <Compass size={size} />
      </span>
      FlowPilot
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-0.5 px-3">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href} onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition ${
              active ? "text-ink" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
            }`}
            style={active ? { background: "var(--brand-soft)", color: "var(--brand)" } : undefined}>
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-line bg-surface md:flex">
        <div className="px-5 py-5"><Logo /></div>
        {nav}
        <div className="mt-auto p-4">
          <div className="rounded-xl border border-line p-3">
            <p className="text-xs font-semibold">Sprint 14</p>
            <p className="mt-1 text-[11px] text-ink-2">4 days left · 62% complete</p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full w-[62%] rounded-full" style={{ background: "var(--brand)" }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-line bg-surface pt-4 float-up">
            <div className="mb-4 flex items-center justify-between px-5">
              <Logo />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18} /></button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line px-4 md:px-6">
          <button className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
          <div className="hidden max-w-md flex-1 items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-ink-3 sm:flex">
            <Search size={14} />
            <span className="text-xs">Search projects, tasks, people…</span>
            <kbd className="ml-auto rounded border border-line bg-surface-2 px-1.5 text-[10px] font-medium">⌘K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <button className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-2 hover:bg-surface-2" aria-label="Notifications">
              <Bell size={15} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full" style={{ background: "var(--critical)" }} />
            </button>
            <ThemeToggle />
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ background: "var(--series-4)" }}>DB</span>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
