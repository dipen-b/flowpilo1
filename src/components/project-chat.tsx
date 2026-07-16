"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, Flame } from "lucide-react";

interface ChatAuthor {
  id: string;
  name: string;
  initials: string;
  color: string;
}

interface ChatMsg {
  id: string;
  body: string;
  createdAt: string;
  author: ChatAuthor;
}

function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function dayOf(iso: string) {
  return new Date(iso).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}

export function ProjectChat({
  projectId,
  projectName,
  projectEmoji,
  currentUserId,
}: {
  projectId: string;
  projectName: string;
  projectEmoji: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastCountRef = useRef(0);

  const load = useCallback(async () => {
    const res = await fetch(`/api/projects/${projectId}/chat`).catch(() => null);
    if (!res?.ok) return;
    const data = await res.json();
    setMessages(data.messages);
    setLoaded(true);
  }, [projectId]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    if (messages.length !== lastCountRef.current) {
      lastCountRef.current = messages.length;
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function send() {
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setDraft("");
    const res = await fetch(`/api/projects/${projectId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    }).catch(() => null);
    if (res?.ok) {
      const message = await res.json();
      setMessages((prev) => [...prev, message]);
    } else {
      setDraft(body); // restore on failure
    }
    setSending(false);
  }

  // group consecutive messages by day
  let lastDay = "";

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      <header className="mb-4 text-center">
        <Link href={`/projects/${projectId}`}
          className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink transition">
          <ArrowLeft size={15} /> {projectEmoji} {projectName}
        </Link>
        <h1 className="flex items-center justify-center gap-2 font-serif text-3xl font-bold tracking-tight">
          <Flame size={26} style={{ color: "var(--brand)" }} /> Campfire
        </h1>
        <p className="mt-1 text-sm text-ink-3">Chat casually with the team about {projectName}</p>
      </header>

      <div className="card flex min-h-0 flex-1 flex-col overflow-hidden !rounded-3xl">
        <div className="flex-1 space-y-1 overflow-y-auto px-5 py-4">
          {!loaded ? (
            <p className="py-16 text-center text-sm text-ink-3">Lighting the campfire…</p>
          ) : messages.length === 0 ? (
            <p className="py-16 text-center text-sm text-ink-3">
              No messages yet — say hi to get things going! 👋
            </p>
          ) : (
            messages.map((m) => {
              const day = dayOf(m.createdAt);
              const showDay = day !== lastDay;
              lastDay = day;
              const mine = m.author.id === currentUserId;
              return (
                <div key={m.id}>
                  {showDay && (
                    <p className="my-4 text-center text-xs font-semibold uppercase tracking-wide text-ink-3">
                      {day}
                    </p>
                  )}
                  <div className={`flex items-start gap-3 rounded-2xl px-3 py-2 transition hover:bg-surface-2 ${mine ? "flex-row-reverse text-right" : ""}`}>
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                      style={{ background: m.author.color }}>
                      {m.author.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-ink-3">
                        <span className="font-semibold text-ink-2">{mine ? "You" : m.author.name}</span>
                        {" · "}{timeOf(m.createdAt)}
                      </p>
                      <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-ink">{m.body}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-line bg-surface-2 p-3">
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              placeholder={`Message ${projectName}…`}
              rows={1}
              className="max-h-32 min-h-[42px] flex-1 resize-none rounded-2xl border border-line bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-brand"
            />
            <button type="submit" disabled={!draft.trim() || sending} aria-label="Send message"
              className="btn-primary !rounded-2xl !px-4 !py-2.5 disabled:opacity-50">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
