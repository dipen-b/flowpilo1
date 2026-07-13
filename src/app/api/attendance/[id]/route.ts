import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

export const GET = requireUser(async (req: NextRequest, context: SessionContext, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  try {
    const record = await db.attendance.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
    });

    if (!record) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Check access: can only view own or if admin/owner
    if (record.userId !== context.user.id && !["owner", "admin"].includes(context.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch record" }, { status: 500 });
  }
});

export const PATCH = requireUser(async (req: NextRequest, context: SessionContext, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();

  try {
    const record = await db.attendance.findUnique({ where: { id } });

    if (!record) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Check access: can only edit own or if admin/owner
    if (record.userId !== context.user.id && !["owner", "admin"].includes(context.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { status, checkInTime, checkOutTime, notes } = body;

    let workHours = record.workHours;
    if (checkInTime && checkOutTime) {
      const checkIn = new Date(checkInTime);
      const checkOut = new Date(checkOutTime);
      workHours = Math.floor((checkOut.getTime() - checkIn.getTime()) / 60000);
    }

    const updated = await db.attendance.update({
      where: { id },
      data: {
        status: status || record.status,
        checkInTime: checkInTime ? new Date(checkInTime) : record.checkInTime,
        checkOutTime: checkOutTime ? new Date(checkOutTime) : record.checkOutTime,
        workHours,
        notes: notes !== undefined ? notes : record.notes,
      },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
});
