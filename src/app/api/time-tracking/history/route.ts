import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

export const GET = requireUser(async (req: NextRequest, context: SessionContext) => {
  try {
    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get("days") || "7", 10);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const entries = await db.timeEntry.findMany({
      where: {
        userId: context.user.id,
        date: { gte: startDateStr },
      },
      include: { breaks: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({
      days: days,
      entries: entries.map(e => ({
        id: e.id,
        date: e.date,
        clockInTime: e.clockInTime,
        clockOutTime: e.clockOutTime,
        totalMinutes: e.totalMinutes,
        breaks: e.breaks.length,
      })),
      totalMinutes: entries.reduce((sum, e) => sum + e.totalMinutes, 0),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
});
