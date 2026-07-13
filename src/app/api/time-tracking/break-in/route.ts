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

    const activeBreak = timeEntry.breaks.find(b => !b.breakOutTime);
    if (activeBreak) {
      return NextResponse.json(
        { error: "Already on break" },
        { status: 409 }
      );
    }

    const breakRecord = await db.break.create({
      data: {
        timeEntryId: timeEntry.id,
        breakInTime: new Date(),
      },
    });

    return NextResponse.json({
      id: breakRecord.id,
      breakInTime: breakRecord.breakInTime,
      status: "on_break",
    }, { status: 201 });
  } catch (error) {
    console.error("Break in error:", error);
    return NextResponse.json({ error: "Failed to start break" }, { status: 500 });
  }
});
