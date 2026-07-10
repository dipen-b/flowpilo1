import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "fp_session";
const SESSION_DAYS = 30;

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.session.create({ data: { token, userId, expiresAt } });
  return { token, expiresAt };
}

export async function destroySession(token: string) {
  await db.session.deleteMany({ where: { token } });
}

/** Read the session cookie and return the logged-in user, or null. */
export async function getSessionUser() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({ where: { token }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};
