import Link from "next/link";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { AuthFrame } from "@/components/auth-frame";
import { AcceptInviteButton } from "@/components/accept-invite-button";

export const dynamic = "force-dynamic";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await db.invite.findUnique({ where: { token }, include: { org: true } });
  const session = await getSessionUser();

  if (!invite || new Date() > new Date(invite.expiresAt)) {
    return (
      <AuthFrame title="Invite not found" subtitle="This invite link is invalid or has expired.">
        <p className="text-sm text-ink-2">
          Ask your workspace admin to send you a new invite link.
        </p>
        <Link href="/" className="btn-primary mt-5 flex w-full justify-center px-4 py-2.5 text-sm">
          Back to FlowPilot
        </Link>
      </AuthFrame>
    );
  }

  // Logged in with the invited email → can accept directly
  if (session && session.user.email.toLowerCase() === invite.email.toLowerCase()) {
    if (session.orgId === invite.orgId) {
      return (
        <AuthFrame title="You're already in" subtitle={`You are already a member of ${invite.org.name}.`}>
          <Link href="/dashboard" className="btn-primary flex w-full justify-center px-4 py-2.5 text-sm">
            Go to dashboard
          </Link>
        </AuthFrame>
      );
    }
    return (
      <AuthFrame
        title={`Join ${invite.org.name}`}
        subtitle={`You've been invited to join ${invite.org.name} as ${invite.role === "admin" ? "an admin" : "a member"}.`}
      >
        <AcceptInviteButton token={token} orgName={invite.org.name} />
      </AuthFrame>
    );
  }

  // Logged in with a different email
  if (session) {
    return (
      <AuthFrame
        title={`Join ${invite.org.name}`}
        subtitle={`This invite was sent to ${invite.email}, but you're logged in as ${session.user.email}.`}
      >
        <p className="text-sm text-ink-2">
          Log out, then sign up or log in with <span className="font-semibold text-ink">{invite.email}</span> and
          open this link again.
        </p>
      </AuthFrame>
    );
  }

  // Not logged in yet
  return (
    <AuthFrame
      title={`Join ${invite.org.name}`}
      subtitle={`You've been invited to join ${invite.org.name} as ${invite.role === "admin" ? "an admin" : "a member"}.`}
    >
      <p className="text-sm text-ink-2">
        Create an account (or log in) with <span className="font-semibold text-ink">{invite.email}</span>, then open
        this invite link again to join.
      </p>
      <div className="mt-5 space-y-2">
        <Link href="/signup" className="btn-primary flex w-full justify-center px-4 py-2.5 text-sm">
          Create account
        </Link>
        <Link
          href="/login"
          className="flex w-full justify-center rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink-2 transition hover:bg-surface-2"
        >
          I already have an account
        </Link>
      </div>
    </AuthFrame>
  );
}
