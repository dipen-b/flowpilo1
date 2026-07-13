"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AcceptInviteButton({ token, orgName }: { token: string; orgName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function accept() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/invites/${token}/accept`, { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Failed to accept invite.");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept invite.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button onClick={accept} disabled={loading} className="btn-primary w-full px-4 py-2.5 text-sm disabled:opacity-60">
        {loading ? "Joining…" : `Join ${orgName}`}
      </button>
      {error && <p className="text-xs font-medium" style={{ color: "var(--critical)" }}>{error}</p>}
    </div>
  );
}
