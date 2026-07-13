import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { createSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

const COLORS = ["#2a78d6", "#1baf7a", "#4a3aa7", "#eda100", "#e34948"];

export async function POST(request: Request) {
  const { name, email, password } = await request.json();
  if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
    return NextResponse.json({ error: "Name, email, and a password of 8+ characters are required." }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  // Create a new organization for this user
  const org = await db.organization.create({
    data: {
      name: `${name.trim()}'s Team`,
    },
  });

  // Create default workspace
  await db.workspace.create({
    data: {
      name: "General",
      orgId: org.id,
    },
  });

  const initials = name
    .trim()
    .split(/\s+/)
    .map((w: string) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  const user = await db.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      initials: initials || "??",
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      role: "owner",
      orgId: org.id,
    },
  });
  await db.membership.create({ data: { userId: user.id, orgId: org.id, role: "owner" } });

  const { token } = await createSession(user.id);
  const res = NextResponse.json({
    ok: true,
    user: { id: user.id, name: user.name, email: user.email, orgId: org.id, role: user.role },
  }, { status: 201 });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
