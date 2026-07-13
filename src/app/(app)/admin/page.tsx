"use client";

import { useEffect, useState } from "react";
import { Shield, CreditCard, Users, ScrollText, Plug } from "lucide-react";
import { Card, Avatar } from "@/components/ui";

const TABS = [
  { key: "members", label: "Members & Roles", icon: Users },
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "security", label: "Security", icon: Shield },
  { key: "audit", label: "Audit Log", icon: ScrollText },
  { key: "integrations", label: "Integrations", icon: Plug },
];

const INTEGRATIONS = [
  { name: "GitHub", status: "Connect", desc: "Auto status updates from commits & PRs" },
  { name: "Slack", status: "Connect", desc: "Notifications + activity in channels" },
  { name: "Google Meet", status: "Connect", desc: "Meeting recordings → tasks" },
  { name: "Figma", status: "Connect", desc: "Design links on tasks" },
  { name: "GitLab", status: "Connect", desc: "Alternative to GitHub" },
  { name: "Zoom", status: "Connect", desc: "Meeting recordings → tasks" },
];

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  color: string;
}

interface ActivityEntry {
  id: string;
  who: string;
  what: string;
  createdAt: string;
}

export default function Admin() {
  const [tab, setTab] = useState("members");
  const [members, setMembers] = useState<Member[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    fetch("/api/members")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setMembers(Array.isArray(d) ? d : []))
      .catch(() => {});
    fetch("/api/activity")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setActivity(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="float-up">
        <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
        <p className="mt-1 text-sm text-ink-2">Pro plan · {members.length || "—"} seats</p>
      </div>

      <div className="hide-scrollbar float-up flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface p-1 w-fit max-w-full">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition ${tab === key ? "text-white" : "text-ink-2 hover:text-ink"}`}
            style={tab === key ? { background: "linear-gradient(135deg, var(--brand), var(--brand-2))" } : undefined}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {tab === "members" && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink-3">
                <th className="px-5 py-3 font-medium">Member</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {members.map((m) => (
                <tr key={m.id} className="transition hover:bg-surface-2">
                  <td className="px-5 py-3.5"><span className="flex items-center gap-2.5"><Avatar member={m} size={30} /><span className="font-semibold">{m.name}</span></span></td>
                  <td className="px-5 py-3.5 text-ink-2">{m.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
                      style={m.role === "owner"
                        ? { background: "var(--brand-soft)", color: "var(--brand)" }
                        : m.role === "admin"
                        ? { background: "var(--warn-soft)", color: "var(--warn)" }
                        : { background: "var(--surface-2)", color: "var(--ink-2)" }}>
                      {m.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "billing" && (
        <div className="grid gap-5 md:grid-cols-3">
          <Card title="Current plan">
            <p className="text-2xl font-bold">Pro <span className="text-sm font-medium text-ink-3">· annual</span></p>
            <p className="mt-1 text-sm text-ink-2">$12 / user / month · {members.length || "—"} seats</p>
            <button disabled title="Available soon" className="btn-ghost mt-4 cursor-default px-4 py-2 text-xs opacity-50">Manage plan</button>
          </Card>
          <Card title="Seats">
            <p className="text-2xl font-bold tabular">{members.length || "—"} <span className="text-sm font-medium text-ink-3">/ 10 seats used</span></p>
            <p className="mt-1 text-sm text-ink-2">{Math.max(0, 10 - members.length)} seats available on your current plan</p>
          </Card>
          <Card title="Invoices">
            <p className="text-sm text-ink-2">No invoices yet — you're on a trial of the Pro plan.</p>
          </Card>
        </div>
      )}

      {tab === "security" && (
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { title: "Single Sign-On (SAML / OIDC)", desc: "Enforce login through your identity provider. Available on Enterprise.", cta: "Upgrade to enable", on: false },
            { title: "Session management", desc: "Sessions expire automatically after 30 days of inactivity.", cta: "Active", on: true },
            { title: "Data retention", desc: "Activity logs are retained for 90 days, then deleted.", cta: "Configure", on: true },
            { title: "Data export", desc: "Export your workspace data anytime as JSON or CSV.", cta: "Export", on: true },
          ].map((s) => (
            <Card key={s.title}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">{s.title}</h3>
                  <p className="mt-1 text-[13px] text-ink-2">{s.desc}</p>
                </div>
                <span className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={s.on ? { background: "var(--good-soft)", color: "var(--good)" } : { background: "var(--surface-2)", color: "var(--ink-3)" }}>
                  {s.on ? "On" : "Off"}
                </span>
              </div>
              <button disabled title="Available soon" className="btn-ghost mt-4 cursor-default px-3.5 py-1.5 text-xs opacity-50">{s.cta}</button>
            </Card>
          ))}
        </div>
      )}

      {tab === "audit" && (
        <Card className="overflow-x-auto p-0">
          {activity.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-3">No activity recorded yet.</p>
          ) : (
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-ink-3">
                  <th className="px-5 py-3 font-medium">When</th>
                  <th className="px-5 py-3 font-medium">Actor</th>
                  <th className="px-5 py-3 font-medium">Event</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {activity.map((a) => (
                  <tr key={a.id} className="transition hover:bg-surface-2">
                    <td className="whitespace-nowrap px-5 py-3.5 text-xs text-ink-3 tabular">
                      {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-5 py-3.5 font-semibold">{a.who}</td>
                    <td className="px-5 py-3.5 text-ink-2">{a.what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {tab === "integrations" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INTEGRATIONS.map((it) => (
            <Card key={it.name}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{it.name}</h3>
                <span className="rounded-lg px-3 py-1 text-xs font-semibold" style={{ background: "var(--surface-2)", color: "var(--ink-3)" }}>
                  Coming soon
                </span>
              </div>
              <p className="mt-1.5 text-[13px] text-ink-2">{it.desc}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
