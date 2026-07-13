import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

export const PATCH = requireUser(async (req: NextRequest, context: SessionContext, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();

  try {
    const notification = await db.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== context.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await db.notification.update({
      where: { id },
      data: { read: Boolean(body.read) },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
});

export const DELETE = requireUser(async (req: NextRequest, context: SessionContext, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  try {
    const notification = await db.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== context.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.notification.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
});
