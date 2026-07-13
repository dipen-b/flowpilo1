"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FolderKanban, SquareCheck, User } from "lucide-react";

type Results = {
  projects: { id: string; name: string; emoji: string; key: string }[];
  tasks: { id: string; key: string; title: string; status: string; projectId: string }[];
  people: { id: string; name: string; initials: string; color: string; role: string }[];
};

const EMPTY: Results = { projects: [], tasks: [], people: [] };

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Results>(EMPTY);
  const [loading, setLoading] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setResults(EMPTY);
    }
  }, [open]);

  const search = useCallback((value: string) => {
    setQ(value);
    if (debounce.current) clearTimeout(debounce.current);
    if (value.trim().length < 2) {
      setResults(EMPTY);
      return;
    }
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        setResults(await r.json());
      } finally {
        setLoading(false);
      }
    }, 180);
  }, []);

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const hasResults = results.projects.length + results.tasks.length + results.people.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40" onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
            style={{ boxShadow: "var(--shadow-lg)" }}
          >
            <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
              <Search size={16} className="text-ink-3" />
              <input
                autoFocus value={q} onChange={(e) => search(e.target.value)}
                placeholder="Search projects, tasks, people…"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-3"
              />
              <kbd className="rounded border border-line bg-surface-2 px-1.5 text-[10px] font-medium text-ink-3">esc</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {q.trim().length < 2 ? (
                <p className="px-3 py-6 text-center text-xs text-ink-3">Type at least 2 characters to search</p>
              ) : loading && !hasResults ? (
                <p className="px-3 py-6 text-center text-xs text-ink-3">Searching…</p>
              ) : !hasResults ? (
                <p className="px-3 py-6 text-center text-xs text-ink-3">No results for “{q}”</p>
              ) : (
                <>
                  {results.projects.length > 0 && (
                    <>
                      <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-ink-3">Projects</p>
                      {results.projects.map((p) => (
                        <button key={p.id} onClick={() => go(`/projects/${p.id}`)}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-surface-2">
                          <FolderKanban size={14} className="text-ink-3" />
                          <span>{p.emoji} <span className="font-medium">{p.name}</span></span>
                          <span className="ml-auto text-xs text-ink-3">{p.key}</span>
                        </button>
                      ))}
                    </>
                  )}
                  {results.tasks.length > 0 && (
                    <>
                      <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-ink-3">Tasks</p>
                      {results.tasks.map((t) => (
                        <button key={t.id} onClick={() => go(`/projects/${t.projectId}`)}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-surface-2">
                          <SquareCheck size={14} className="text-ink-3" />
                          <span className="min-w-0 flex-1 truncate"><span className="mr-1.5 text-xs font-semibold text-ink-3 tabular">{t.key}</span>{t.title}</span>
                        </button>
                      ))}
                    </>
                  )}
                  {results.people.length > 0 && (
                    <>
                      <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-ink-3">People</p>
                      {results.people.map((m) => (
                        <button key={m.id} onClick={() => go("/team")}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-surface-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: m.color }}>
                            {m.initials}
                          </span>
                          <span className="font-medium">{m.name}</span>
                          <span className="ml-auto text-xs capitalize text-ink-3">{m.role}</span>
                        </button>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Hook: global ⌘K / Ctrl+K to toggle, Esc to close. */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}
