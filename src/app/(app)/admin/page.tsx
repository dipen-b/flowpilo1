"use client";

import { useState } from "react";
import { Shield, CreditCard, Users, ScrollText, Plug } from "lucide-react";
import { Card, Avatar } from "@/components/ui";
import { members } from "@/lib/data";

const TABS = [
  { key: "members", label: "Members & Roles", icon: Users },
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "security", label: "Security", icon: Shield },
  { key: "audit", label: "Audit Log", icon: ScrollText },
  { key: "integrations", label: "Integrations", icon: Plug },
];

const ROLES = ["Owner", "Admin", "Member", "Member", "Member", "Guest"];

const AUDIT = [
  { when: "Jul 10, 09:41", who: "Dipen B", what: "Changed Rohan Patel's role from Guest to Member" },
  { when: "Jul 10, 09:12", who: "Aarav Shah", what: "Published Release Notes v2.4.0" },
  { when: "Jul 09, 18:03", who: "Aarav Shah", what: "Enabled automation: PR merged → move task to Done" },
  { when: "Jul 09, 14:22", who: "Dipen B", what: "Upgraded workspace to Pro (annual)" },
  { when: "Jul 08, 11:47", who: "Priya Mehta", what: "Connected Figma integration" },
];

const INTEGRATIONS = [
  { name: "GitHub", status: "Connected", desc: "Auto status updates from commits & PRs" },
  { name: "Slack", status: "Connected", desc: "Notifications + activity in channels" },
  { name: "Google Meet", status: "Connected", desc: "Meeting recordings → tasks" },
  { name: "Figma", status: "Connected", desc: "Design links on tasks" },
  { name: "GitLab", status: "Connect", desc: "Alternative to GitHub" },
  { name: "Zoom", status: "Connect", desc: "Meeting recordings → tasks" },
];

export default function Admin() {
  const [tab, setTab] = useState("members");

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="float-up">
        <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
        <p className="mt-1 text-sm text-ink-2">Workspace: Vasundhara Infotech · Pro plan · 6 seats</p>
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
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium text-right">2FA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {members.map((m, i) => (
                <tr key={m.id} className="transition hover:bg-surface-2">
                  <td className="px-5 py-3.5"><span className="flex items-center gap-2.5"><Avatar member={m} size={30} /><span className="font-semibold">{m.name}</span></span></td>
                  <td className="px-5 py-3.5 text-ink-2">{i < 4 ? "Engineering" : "Product"}</td>
                  <td className="px-5 py-3.5">
                    <select defaultValue={ROLES[i]} className="rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-medium outline-none">
                      {["Owner", "Admin", "Member", "Guest"].map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={i === 4 ? { background: "var(--warn-soft)", color: "var(--warn)" } : { background: "var(--good-soft)", color: "var(--good)" }}>
                      {i === 4 ? "Pending" : "Enabled"}
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
            <p className="mt-1 text-sm text-ink-2">$12 / user / month · 6 seats · renews Jan 09, 2027</p>
            <button className="btn-ghost mt-4 px-4 py-2 text-xs">Manage plan</button>
          </Card>
          <Card title="Seats">
            <p className="text-2xl font-bold tabular">6 <span className="text-sm font-medium text-ink-3">/ 10 seats used</span></p>
            <p className="mt-1 text-sm text-ink-2">4 seats available on your current plan</p>
          </Card>
          <Card title="Invoices">
            <ul className="space-y-2 text-sm">
              {["Jun 2026 — $864", "May 2026 — $864", "Apr 2026 — $720"].map((inv) => (
                <li key={inv} className="flex justify-between text-ink-2"><span>{inv.split(" — ")[0]}</span><span className="font-semibold text-ink tabular">{inv.split(" — ")[1]}</span></li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === "security" && (
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { title: "Single Sign-On (SAML / OIDC)", desc: "Enforce login through your identity provider. Available on Enterprise.", cta: "Upgrade to enable", on: false },
            { title: "Two-factor authentication", desc: "Require 2FA for all workspace members.", cta: "Enforced", on: true },
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
              <button className="btn-ghost mt-4 px-3.5 py-1.5 text-xs">{s.cta}</button>
            </Card>
          ))}
        </div>
      )}

      {tab === "audit" && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink-3">
                <th className="px-5 py-3 font-medium">When</th>
                <th className="px-5 py-3 font-medium">Actor</th>
                <th className="px-5 py-3 font-medium">Event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {AUDIT.map((a) => (
                <tr key={a.when + a.what} className="transition hover:bg-surface-2">
                  <td className="whitespace-nowrap px-5 py-3.5 text-xs text-ink-3 tabular">{a.when}</td>
                  <td className="px-5 py-3.5 font-semibold">{a.who}</td>
                  <td className="px-5 py-3.5 text-ink-2">{a.what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "integrations" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INTEGRATIONS.map((it) => (
            <Card key={it.name}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{it.name}</h3>
                <button className={`rounded-lg px-3 py-1 text-xs font-semibold ${it.status === "Connected" ? "" : "btn-ghost"}`}
                  style={it.status === "Connected" ? { background: "var(--good-soft)", color: "var(--good)" } : undefined}>
                  {it.status}
                </button>
              </div>
              <p className="mt-1.5 text-[13px] text-ink-2">{it.desc}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
