import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

export const GET = requireUser(async (req: NextRequest, context: SessionContext) => {
  try {
    // Only owner/admin can view reports
    if (!["owner", "admin"].includes(context.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const url = new URL(req.url);
    const month = url.searchParams.get("month"); // YYYY-MM
    const userId = url.searchParams.get("userId");

    const where: any = {};
    if (userId) where.userId = userId;
    if (month) {
      where.date = {
        gte: `${month}-01`,
        lt: `${month}-32`,
      };
    }

    const records = await db.attendance.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { date: "asc" },
    });

    // Calculate summary stats
    const stats = {
      totalDays: records.length,
      presentDays: records.filter(r => r.status === "present" || r.status === "half-day").length,
      absentDays: records.filter(r => r.status === "absent").length,
      leaveDays: records.filter(r => r.status === "leave").length,
      lateDays: records.filter(r => r.status === "late").length,
      totalWorkHours: records.reduce((sum, r) => sum + r.workHours, 0),
      averageWorkHours: Math.round(
        records.filter(r => r.status === "present").reduce((sum, r) => sum + r.workHours, 0) /
        Math.max(records.filter(r => r.status === "present").length, 1)
      ),
      records,
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
});
