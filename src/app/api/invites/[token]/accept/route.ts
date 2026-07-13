import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { notifyInviteAccepted } from "@/lib/notifications";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const session = await getSessionUser();

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in to accept an invite" },
      { status: 401 }
    );
  }

  const invite = await db.invite.findUnique({ where: { token } });

  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  if (new Date() > new Date(invite.expiresAt)) {
    return NextResponse.json({ error: "Invite has expired" }, { status: 410 });
  }

  if (invite.email.toLowerCase() !== session.user.email.toLowerCase()) {
    return NextResponse.json(
      { error: "This invite was sent to a different email address" },
      { status: 403 }
    );
  }

  if (session.orgId === invite.orgId) {
    return NextResponse.json(
      { error: "You are already a member of this organization" },
      { status: 409 }
    );
  }

  // Move the user into the inviting organization
  await db.user.update({
    where: { id: session.user.id },
    data: { orgId: invite.orgId, role: invite.role },
  });
  await db.membership.upsert({
    where: { userId_orgId: { userId: session.user.id, orgId: invite.orgId } },
    update: { role: invite.role },
    create: { userId: session.user.id, orgId: invite.orgId, role: invite.role },
  });
  await db.invite.delete({ where: { token } });

  await notifyInviteAccepted(invite.orgId, session.user.name);

  return NextResponse.json({ ok: true, orgId: invite.orgId });
}
