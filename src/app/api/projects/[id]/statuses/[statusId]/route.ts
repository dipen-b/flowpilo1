import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

/** DELETE a status (column) — cannot delete if items use it */
export const DELETE = requireUser(async (req: NextRequest, context: SessionContext, { params }: { params: Promise<{ id: string; statusId: string }> }) => {
  const { id, statusId } = await params;

  const project = await db.project.findUnique({
    where: { id },
    include: { workspace: true },
  });

  if (!project || project.workspace.orgId !== context.orgId) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const status = await db.projectStatus.findUnique({
    where: { id: statusId },
  });

  if (!status || status.projectId !== id) {
    return NextResponse.json({ error: "Status not found" }, { status: 404 });
  }

  // Check if any items use this status
  const count = await db.workItem.count({
    where: { projectId: id, status: status.name },
  });

  if (count > 0) {
    return NextResponse.json(
      { error: `Cannot delete — ${count} item(s) use this status` },
      { status: 409 }
    );
  }

  await db.projectStatus.delete({ where: { id: statusId } });

  return NextResponse.json({ ok: true });
});
