import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

export const GET = requireUser(async (req: NextRequest, context: SessionContext) => {
  const url = new URL(req.url);
  const unreadOnly = url.searchParams.get("unreadOnly") === "true";

  const notifications = await db.notification.findMany({
    where: {
      userId: context.user.id,
      ...(unreadOnly && { read: false }),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = await db.notification.count({
    where: {
      userId: context.user.id,
      read: false,
    },
  });

  return NextResponse.json({
    notifications,
    unreadCount,
  });
});
