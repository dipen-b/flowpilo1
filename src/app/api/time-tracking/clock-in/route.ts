import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

export const POST = requireUser(async (req: NextRequest, context: SessionContext) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Try to find existing entry
    let timeEntry = await db.timeEntry.findFirst({
      where: {
        userId: context.user.id,
        date: today,
      },
    });

    // If already clocked in today, return error
    if (timeEntry && !timeEntry.clockOutTime) {
      return NextResponse.json(
        { error: "Already clocked in today" },
        { status: 409 }
      );
    }

    // If clocked out already, return error
    if (timeEntry && timeEntry.clockOutTime) {
      return NextResponse.json(
        { error: "Already clocked out today" },
        { status: 409 }
      );
    }

    // Create new entry
    timeEntry = await db.timeEntry.create({
      data: {
        userId: context.user.id,
        date: today,
        clockInTime: new Date(),
        totalMinutes: 0,
      },
    });

    return NextResponse.json({
      id: timeEntry.id,
      clockInTime: timeEntry.clockInTime,
      status: "clocked_in",
    }, { status: 201 });
  } catch (error) {
    console.error("Clock in error:", error);
    return NextResponse.json({ error: "Failed to clock in" }, { status: 500 });
  }
});
