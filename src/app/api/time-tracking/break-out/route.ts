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

    const activeBreak = timeEntry.breaks.find(b => !b.breakOutTime);
    if (!activeBreak) {
      return NextResponse.json({ error: "Not on break" }, { status: 409 });
    }

    const breakOutTime = new Date();
    const durationMinutes = Math.floor(
      (breakOutTime.getTime() - activeBreak.breakInTime.getTime()) / 60000
    );

    const updated = await db.break.update({
      where: { id: activeBreak.id },
      data: {
        breakOutTime: breakOutTime,
        durationMinutes: durationMinutes,
      },
    });

    return NextResponse.json({
      id: updated.id,
      breakInTime: updated.breakInTime,
      breakOutTime: updated.breakOutTime,
      durationMinutes: updated.durationMinutes,
      status: "break_ended",
    });
  } catch (error) {
    console.error("Break out error:", error);
    return NextResponse.json({ error: "Failed to end break" }, { status: 500 });
  }
});
