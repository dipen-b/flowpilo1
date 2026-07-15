import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

/** Admin/owner generates a one-time password-reset link for a member of their org. */
export const POST = requireUser(async (req: NextRequest, context: SessionContext) => {
  if (!["owner", "admin"].includes(context.user.role)) {
    return NextResponse.json({ error: "Only admins can generate reset links" }, { status: 403 });
  }

  const body = await req.json();
  const target = await db.user.findUnique({ where: { id: body.userId ?? "" } });
  if (!target || target.orgId !== context.orgId) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  // One active link per user — replace any previous one
  await db.passwordReset.deleteMany({ where: { userId: target.id } });

  const reset = await db.passwordReset.create({
    data: {
      token: randomBytes(32).toString("hex"),
      userId: target.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    },
  });

  return NextResponse.json({ token: reset.token, expiresAt: reset.expiresAt }, { status: 201 });
});
