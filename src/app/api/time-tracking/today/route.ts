import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

export const GET = requireUser(async (req: NextRequest, context: SessionContext) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const timeEntry = await db.timeEntry.findFirst({
      where: {
        userId: context.user.id,
        date: today,
      },
      include: { breaks: true },
    });

    if (!timeEntry) {
      return NextResponse.json({ entry: null, message: "Not clocked in", isClockedIn: false });
    }

    const isActive = !timeEntry.clockOutTime;
    const breakMinutes = timeEntry.breaks.reduce((sum, b) => {
      if (b.breakOutTime) {
        return sum + b.durationMinutes;
      }
      return sum;
    }, 0);

    return NextResponse.json({
      id: timeEntry.id,
      date: timeEntry.date,
      clockInTime: timeEntry.clockInTime,
      clockOutTime: timeEntry.clockOutTime,
      totalMinutes: timeEntry.totalMinutes,
      breakMinutes: breakMinutes,
      isActive: isActive,
      isClockedIn: isActive,
      breaks: timeEntry.breaks.map(b => ({
        id: b.id,
        breakInTime: b.breakInTime,
        breakOutTime: b.breakOutTime,
        durationMinutes: b.durationMinutes,
      })),
    });
  } catch (error) {
    console.error("Get today error:", error);
    return NextResponse.json({ error: "Failed to fetch today's entry", isClockedIn: false }, { status: 500 });
  }
});
