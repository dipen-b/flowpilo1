import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

export const GET = requireUser(async (req: NextRequest, context: SessionContext) => {
  try {
    // Only owner/admin can view all attendance
    if (!["owner", "admin"].includes(context.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const userId = url.searchParams.get("userId");

    const where: any = { user: { orgId: context.orgId } };
    
    if (userId) where.userId = userId;
    if (startDate && endDate) {
      where.date = { gte: startDate, lte: endDate };
    }

    const records = await db.attendance.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
});

export const POST = requireUser(async (req: NextRequest, context: SessionContext) => {
  try {
    const body = await req.json();
    const { date, status, checkInTime, checkOutTime, notes, userId } = body;

    // Only admin/owner can create for others
    const targetUserId = userId || context.user.id;
    if (userId && !["owner", "admin"].includes(context.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Calculate work hours if both times provided
    let workHours = 0;
    if (checkInTime && checkOutTime) {
      const checkIn = new Date(checkInTime);
      const checkOut = new Date(checkOutTime);
      workHours = Math.floor((checkOut.getTime() - checkIn.getTime()) / 60000);
    }

    const attendance = await db.attendance.upsert({
      where: { userId_date: { userId: targetUserId, date } },
      update: {
        status,
        checkInTime: checkInTime ? new Date(checkInTime) : undefined,
        checkOutTime: checkOutTime ? new Date(checkOutTime) : undefined,
        workHours,
        notes,
      },
      create: {
        userId: targetUserId,
        date,
        status,
        checkInTime: checkInTime ? new Date(checkInTime) : undefined,
        checkOutTime: checkOutTime ? new Date(checkOutTime) : undefined,
        workHours,
        notes,
      },
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error("Attendance error:", error);
    return NextResponse.json({ error: "Failed to create attendance" }, { status: 500 });
  }
});
