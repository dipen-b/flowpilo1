"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, MessageSquare, Plus, X } from "lucide-react";

interface Author {
  id: string;
  name: string;
  initials: string;
  color: string;
}

interface DiscussionSummary {
  id: string;
  title: string;
  excerpt: string;
  author: Author;
  replyCount: number;
  createdAt: string;
}

interface Reply {
  id: string;
  body: string;
  createdAt: string;
  author: Author;
}

interface DiscussionDetail {
  id: string;
  title: string;
  body: string;
  author: Author;
  createdAt: string;
  replies: Reply[];
}

function dateOf(iso: string) {
  return new Date(iso).toLocaleDateString([], { month: "long", day: "numeric" });
}

function Avatar({ author, size = 8 }: { author: Author; size?: number }) {
  return (
    <span className={`flex h-${size} w-${size} shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white`}
      style={{ background: author.color, height: size * 4, width: size * 4 }}>
      {author.initials}
    </span>
  );
}

export function ProjectMessages({
  projectId,
  projectName,
  projectEmoji,
}: {
  projectId: string;
  projectName: string;
  projectEmoji: string;
}) {
  const [discussions, setDiscussions] = useState<DiscussionSummary[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<DiscussionDetail | null>(null);
  const [reply, setReply] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/projects/${projectId}/discussions`).catch(() => null);
    if (!res?.ok) return;
    setDiscussions(await res.json());
    setLoaded(true);
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!openId) { setDetail(null); return; }
    fetch(`/api/discussions/${openId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setDetail)
      .catch(() => {});
  }, [openId]);

  async function post() {
    if (!title.trim() || !body.trim() || busy) return;
    setBusy(true);
    const res = await fetch(`/api/projects/${projectId}/discussions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    }).catch(() => null);
    if (res?.ok) {
      setTitle("");
      setBody("");
      setComposing(false);
      load();
    }
    setBusy(false);
  }

  async function postReply() {
    if (!reply.trim() || !openId || busy) return;
    setBusy(true);
    const res = await fetch(`/api/discussions/${openId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: reply }),
    }).catch(() => null);
    if (res?.ok) {
      const newReply = await res.json();
      setDetail((d) => (d ? { ...d, replies: [...d.replies, newReply] } : d));
      setReply("");
      load();
    }
    setBusy(false);
  }

  // ---- Detail view ----
  if (openId && detail) {
    return (
      <div className="mx-auto max-w-3xl">
        <button onClick={() => setOpenId(null)}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink transition">
          <ArrowLeft size={15} /> Message Board
        </button>
        <article className="card !rounded-3xl p-8">
          <header className="border-b border-line pb-6 text-center">
            <h1 className="font-serif text-3xl font-bold tracking-tight">{detail.title}</h1>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-ink-3">
              <Avatar author={detail.author} />
              <span className="font-medium text-ink-2">{detail.author.name}</span>
              <span>· {dateOf(detail.createdAt)}</span>
            </div>
          </header>
          <p className="whitespace-pre-wrap py-6 text-[15px] leading-relaxed text-ink">{detail.body}</p>

          <div className="border-t border-line pt-6">
            <h2 className="mb-4 text-sm font-semibold text-ink-2">
              {detail.replies.length === 0 ? "No replies yet" : `${detail.replies.length} repl${detail.replies.length === 1 ? "y" : "ies"}`}
            </h2>
            <div className="space-y-5">
              {detail.replies.map((r) => (
                <div key={r.id} className="flex items-start gap-3">
                  <Avatar author={r.author} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-ink-3">
                      <span className="font-semibold text-ink-2">{r.author.name}</span> · {dateOf(r.createdAt)}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink">{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); postReply(); }} className="mt-6">
              <textarea value={reply} onChange={(e) => setReply(e.target.value)}
                placeholder="Add a reply…" rows={3}
                className="w-full resize-none rounded-2xl border border-line bg-surface px-4 py-3 text-sm outline-none transition focus:border-brand" />
              <div className="mt-2 flex justify-end">
                <button type="submit" disabled={!reply.trim() || busy} className="btn-primary !rounded-full disabled:opacity-50">
                  Post reply
                </button>
              </div>
            </form>
          </div>
        </article>
      </div>
    );
  }

  // ---- List view ----
  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6 text-center">
        <Link href={`/projects/${projectId}`}
          className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink transition">
          <ArrowLeft size={15} /> {projectEmoji} {projectName}
        </Link>
        <h1 className="flex items-center justify-center gap-2 font-serif text-3xl font-bold tracking-tight">
          <MessageSquare size={26} style={{ color: "var(--brand)" }} /> Message Board
        </h1>
        <p className="mt-1 text-sm text-ink-3">Post announcements, pitch ideas, and keep discussions on-topic</p>
        <button onClick={() => setComposing((c) => !c)} className="btn-primary mt-4 !rounded-full">
          {composing ? <><X size={15} /> Cancel</> : <><Plus size={15} /> New message</>}
        </button>
      </header>

      {composing && (
        <form onSubmit={(e) => { e.preventDefault(); post(); }} className="card float-up mb-6 !rounded-3xl p-6">
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Type a title…"
            className="w-full border-0 bg-transparent text-center font-serif text-2xl font-bold outline-none placeholder:text-ink-3" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message…" rows={6}
            className="mt-4 w-full resize-none rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm outline-none transition focus:border-brand" />
          <div className="mt-3 flex justify-center">
            <button type="submit" disabled={!title.trim() || !body.trim() || busy} className="btn-primary !rounded-full disabled:opacity-50">
              {busy ? "Posting…" : "Post this message"}
            </button>
          </div>
        </form>
      )}

      <div className="card !rounded-3xl">
        {!loaded ? (
          <p className="py-16 text-center text-sm text-ink-3">Loading messages…</p>
        ) : discussions.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-3">
            Nothing posted yet — start the first discussion! ✍️
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {discussions.map((d) => (
              <li key={d.id}>
                <button onClick={() => setOpenId(d.id)}
                  className="flex w-full items-start gap-4 px-6 py-5 text-left transition hover:bg-surface-2">
                  <Avatar author={d.author} />
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-lg font-bold leading-snug text-ink">{d.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-sm text-ink-2">
                      <span className="font-medium">{d.author.name}:</span> {d.excerpt}
                    </p>
                  </div>
                  <div className="shrink-0 text-right text-xs text-ink-3">
                    <p>{dateOf(d.createdAt)}</p>
                    {d.replyCount > 0 && (
                      <p className="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium"
                        style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
                        <MessageSquare size={11} /> {d.replyCount}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
