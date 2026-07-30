import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

export const POST = requireUser(async (req: NextRequest, context: SessionContext) => {
  try {
    const { id } = await req.json();
    const member = await db.user.findUnique({ where: { id } });
    
    if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });
    if (member.orgId !== context.orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    if (["owner", "admin"].indexOf(context.user.role) === -1) {
      return NextResponse.json({ error: "Only admins can deactivate members" }, { status: 403 });
    }
    if (!id || id === context.userId) {
      return NextResponse.json({ error: "Cannot deactivate yourself" }, { status: 400 });
    }

    const updated = await db.user.update({
      where: { id },
      data: {
        active: false,
        deactivatedAt: new Date(),
        deactivatedBy: context.userId,
      },
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      active: updated.active,
      deactivatedAt: updated.deactivatedAt,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to deactivate member" },
      { status: 500 }
    );
  }
});
