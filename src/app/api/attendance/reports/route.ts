import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

export const GET = requireUser(async (req: NextRequest, context: SessionContext) => {
  try {
    const url = new URL(req.url);
    const month = url.searchParams.get("month"); // YYYY-MM
    const requestedUserId = url.searchParams.get("userId");
    const isAdmin = ["owner", "admin"].includes(context.user.role);

    // Members can only see their own attendance; admins can see anyone in their org.
    const where: any = { user: { orgId: context.orgId } };
    if (!isAdmin) {
      where.userId = context.user.id;
    } else if (requestedUserId) {
      where.userId = requestedUserId;
    }
    if (month) {
      where.date = { gte: `${month}-01`, lt: `${month}-32` };
    }

    const records = await db.attendance.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true, initials: true, color: true } } },
      orderBy: { date: "asc" },
    });

    const presentRecords = records.filter((r) => r.status === "present");
    const stats = {
      isAdmin,
      totalDays: records.length,
      presentDays: records.filter((r) => r.status === "present" || r.status === "half-day").length,
      absentDays: records.filter((r) => r.status === "absent").length,
      leaveDays: records.filter((r) => r.status === "leave").length,
      lateDays: records.filter((r) => r.status === "late").length,
      totalWorkHours: records.reduce((sum, r) => sum + r.workHours, 0),
      averageWorkHours: Math.round(
        presentRecords.reduce((sum, r) => sum + r.workHours, 0) / Math.max(presentRecords.length, 1)
      ),
      records,
    };

    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
});
