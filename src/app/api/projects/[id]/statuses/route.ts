import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

/** GET project statuses (Kanban columns) */
export const GET = requireUser(async (req: NextRequest, context: SessionContext, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const project = await db.project.findUnique({
    where: { id },
    include: { workspace: true },
  });

  if (!project || project.workspace.orgId !== context.orgId) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const statuses = await db.projectStatus.findMany({
    where: { projectId: id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(statuses);
});

/** POST create a new status (column) */
export const POST = requireUser(async (req: NextRequest, context: SessionContext, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();
  const { name, color } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Status name is required" }, { status: 400 });
  }

  const project = await db.project.findUnique({
    where: { id },
    include: { workspace: true },
  });

  if (!project || project.workspace.orgId !== context.orgId) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Find max order for this project
  const maxOrder = await db.projectStatus.findFirst({
    where: { projectId: id },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const status = await db.projectStatus.create({
    data: {
      name: name.trim(),
      color: color ?? "var(--ink-3)",
      order: (maxOrder?.order ?? -1) + 1,
      projectId: id,
    },
  });

  return NextResponse.json(status, { status: 201 });
});
