import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";

/** Public: consume a reset token and set a new password. Invalidates all sessions. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { token, password } = body;

  if (typeof token !== "string" || typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const reset = await db.passwordReset.findUnique({ where: { token } });
  if (!reset || new Date() > reset.expiresAt) {
    if (reset) await db.passwordReset.delete({ where: { token } });
    return NextResponse.json({ error: "This reset link is invalid or has expired" }, { status: 410 });
  }

  await db.user.update({
    where: { id: reset.userId },
    data: { passwordHash: hashPassword(password) },
  });
  // Single-use token; log out every existing session for safety
  await db.passwordReset.delete({ where: { token } });
  await db.session.deleteMany({ where: { userId: reset.userId } });

  return NextResponse.json({ ok: true });
}
