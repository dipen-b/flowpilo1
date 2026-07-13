import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

const ALLOWED = ["title", "status", "priority", "estimate", "spent", "dueDate", "assigneeId", "sprintId"] as const;

export const PATCH = requireUser(async (req: NextRequest, context: SessionContext, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  for (const key of ALLOWED) {
    if (key in body) data[key] = body[key];
  }
  if (Array.isArray(body.labels)) data.labels = body.labels.join(",");

  try {
    const item = await db.workItem.findUnique({
      where: { id },
      include: { project: { include: { workspace: true } } },
    });
    if (!item || item.project.workspace.orgId !== context.orgId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    const updated = await db.workItem.update({ where: { id }, data });
    
    // Notify if assignee changed
    if (body.assigneeId && body.assigneeId !== item.assigneeId) {
      await createNotification(
        body.assigneeId,
        "task_assigned",
        "Task Assigned",
        `You were assigned: ${item.title}`,
        `/projects/${item.projectId}`
      );
    }
    
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
});

export const DELETE = requireUser(async (req: NextRequest, context: SessionContext, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  try {
    const item = await db.workItem.findUnique({
      where: { id },
      include: { project: { include: { workspace: true } } },
    });
    if (!item || item.project.workspace.orgId !== context.orgId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await db.workItem.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
});
