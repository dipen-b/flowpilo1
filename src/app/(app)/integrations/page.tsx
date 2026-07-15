"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Code2, CheckCircle, AlertCircle, X } from "lucide-react";
import { Card } from "@/components/ui";

interface Integration {
  username: string;
  connectedAt: string;
}

export default function IntegrationsPage() {
  const searchParams = useSearchParams();
  const [github, setGithub] = useState<Integration | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const message = searchParams.get("message");
  const error = searchParams.get("error");
  const success = searchParams.get("success");

  useEffect(() => {
    fetch("/api/integrations/github")
      .then((r) => r.json())
      .then((d) => setGithub(d.connected ? d.integration : null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function disconnect() {
    if (!confirm("Disconnect GitHub?")) return;
    setDisconnecting(true);
    try {
      const res = await fetch("/api/integrations/github/disconnect", { method: "DELETE" });
      if (res.ok) setGithub(null);
    } catch (err) {
      alert("Failed to disconnect GitHub");
    } finally {
      setDisconnecting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="float-up">
        <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
        <p className="mt-1 text-sm text-ink-2">Connect external services to automate your workflow</p>
      </div>

      {(success === "github_connected" || message === "github_connected") && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: "var(--good-soft)", color: "var(--good)" }}>
          <CheckCircle size={16} className="mr-2 inline" />
          GitHub connected successfully! Webhooks are now ready to use.
        </div>
      )}
      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: "var(--critical-soft)", color: "var(--critical)" }}>
          <AlertCircle size={16} className="mr-2 inline" />
          Connection failed: {error}
        </div>
      )}

      <Card title="GitHub">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink-2">
              Connect your GitHub account to auto-update tasks from commits.
            </p>
            <p className="mt-2 text-xs text-ink-3">
              Commit messages like "Fixes BANK-152" or "Closes BANK-152" will automatically move tasks to Done.
            </p>
            {github && (
              <p className="mt-3 text-xs">
                <span className="font-semibold text-good">✓ Connected</span> as{" "}
                <code className="rounded bg-surface-2 px-1.5 py-0.5">@{github.username}</code>
              </p>
            )}
          </div>
          <div className="shrink-0">
            {loading ? (
              <p className="text-xs text-ink-3">Loading...</p>
            ) : github ? (
              <button
                onClick={disconnect}
                disabled={disconnecting}
                className="btn-ghost px-4 py-2 text-xs text-critical disabled:opacity-60"
              >
                <X size={14} className="mr-1 inline" />
                Disconnect
              </button>
            ) : (
              <a
                href="/api/auth/github/connect"
                className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs"
              >
                <Code2 size={14} />
                Connect GitHub
              </a>
            )}
          </div>
        </div>
      </Card>

      <Card title="Slack (Coming Soon)">
        <p className="text-sm text-ink-2">
          Post task updates to Slack channels. Get notifications for mentions and assignments.
        </p>
        <button disabled className="btn-ghost mt-4 cursor-default px-4 py-2 text-xs opacity-50">
          Coming soon
        </button>
      </Card>

      <Card title="Figma (Coming Soon)">
        <p className="text-sm text-ink-2">
          Embed Figma designs directly on tasks. Collaborate on design within your project.
        </p>
        <button disabled className="btn-ghost mt-4 cursor-default px-4 py-2 text-xs opacity-50">
          Coming soon
        </button>
      </Card>

      <Card title="How GitHub webhooks work">
        <div className="space-y-3 text-sm text-ink-2">
          <p>
            <strong>1. Connect your account</strong><br />
            Click "Connect GitHub" to authorize FlowPilot to access your repositories.
          </p>
          <p>
            <strong>2. Set up webhooks</strong><br />
            Go to your GitHub repo → Settings → Webhooks → Add webhook:
            <code className="mt-1 block rounded bg-surface-2 p-2 text-xs font-mono text-ink">
              https://flowpilot.com/api/webhooks/github
            </code>
          </p>
          <p>
            <strong>3. Push commits with task keys</strong><br />
            Use keywords in your commit messages:
            <code className="mt-1 block rounded bg-surface-2 p-2 text-xs font-mono text-ink">
              git commit -m "Fixes BANK-152: implement auth flow"
            </code>
          </p>
          <p>
            <strong>Keywords:</strong>
            <ul className="mt-1 ml-4 list-disc">
              <li>"Fixes", "Closes", "Resolves" → Task moves to Done</li>
              <li>"WIP:" or "WIP " → Task moves to In Progress</li>
            </ul>
          </p>
        </div>
      </Card>
    </div>
  );
}
