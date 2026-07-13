import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";
import { notifyInviteSent } from "@/lib/notifications";

export const GET = requireUser(async (req: NextRequest, context: SessionContext) => {
  const invites = await db.invite.findMany({
    where: { orgId: context.orgId },
    include: { creator: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    invites.map((i) => ({
      id: i.id,
      email: i.email,
      role: i.role,
      createdBy: i.creator.name,
      createdAt: i.createdAt,
      expiresAt: i.expiresAt,
      isExpired: new Date() > new Date(i.expiresAt),
    }))
  );
});

export const POST = requireUser(async (req: NextRequest, context: SessionContext) => {
  if (!["owner", "admin"].includes(context.user.role)) {
    return NextResponse.json({ error: "Only admins can invite members" }, { status: 403 });
  }

  const body = await req.json();
  const { email, role } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (role && !["member", "admin"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser && existingUser.orgId === context.orgId) {
    return NextResponse.json(
      { error: "User is already a member of this organization" },
      { status: 409 }
    );
  }

  const existingInvite = await db.invite.findFirst({
    where: { orgId: context.orgId, email, expiresAt: { gt: new Date() } },
  });

  if (existingInvite) {
    return NextResponse.json(
      { error: "Invite already sent to this email" },
      { status: 409 }
    );
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const invite = await db.invite.create({
    data: {
      orgId: context.orgId,
      email,
      token,
      role: role || "member",
      createdBy: context.user.id,
      expiresAt,
    },
    include: { creator: true },
  });

  const org = await db.organization.findUnique({
    where: { id: context.orgId },
  });

  if (org) {
    await notifyInviteSent(email, context.user.name, org.name);
  }

  return NextResponse.json(
    {
      id: invite.id,
      email: invite.email,
      token: invite.token,
      inviteUrl: `${process.env.APP_URL || "http://localhost:3000"}/invites/${invite.token}`,
    },
    { status: 201 }
  );
});
