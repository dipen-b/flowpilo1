import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

export const POST = requireUser(async (req: NextRequest, context: SessionContext) => {
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
      return NextResponse.json({ error: "No active time entry" }, { status: 404 });
    }

    if (timeEntry.clockOutTime) {
      return NextResponse.json({ error: "Already clocked out" }, { status: 409 });
    }

    const clockOutTime = new Date();

    // Auto-close any break still open so it counts as break time, not work time
    const openBreak = timeEntry.breaks.find((b) => !b.breakOutTime);
    if (openBreak) {
      const durationMinutes = Math.floor((clockOutTime.getTime() - openBreak.breakInTime.getTime()) / 60000);
      await db.break.update({
        where: { id: openBreak.id },
        data: { breakOutTime: clockOutTime, durationMinutes },
      });
      openBreak.breakOutTime = clockOutTime;
    }

    const totalTime = clockOutTime.getTime() - timeEntry.clockInTime.getTime();
    const breakTime = timeEntry.breaks.reduce((sum, b) => {
      if (b.breakOutTime) {
        return sum + (b.breakOutTime.getTime() - b.breakInTime.getTime());
      }
      return sum;
    }, 0);
    
    const totalMinutes = Math.floor((totalTime - breakTime) / 60000);

    const updated = await db.timeEntry.update({
      where: { id: timeEntry.id },
      data: {
        clockOutTime: clockOutTime,
        totalMinutes: totalMinutes,
      },
    });

    return NextResponse.json({
      id: updated.id,
      clockInTime: updated.clockInTime,
      clockOutTime: updated.clockOutTime,
      totalMinutes: updated.totalMinutes,
      status: "clocked_out",
    });
  } catch (error) {
    console.error("Clock out error:", error);
    return NextResponse.json({ error: "Failed to clock out" }, { status: 500 });
  }
});
