import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

/** Get all tasks for a project (used for real-time updates). */
export const GET = requireUser(
  async (req: NextRequest, context: SessionContext, { params }: { params: { id: string } }) => {
    const projectId = params.id;

    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { workspaceId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Verify user has access to this project's workspace
    const workspace = await db.workspace.findUnique({
      where: { id: project.workspaceId },
      select: { orgId: true },
    });

    if (!workspace || workspace.orgId !== context.orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const tasks = await db.workItem.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: { id: true, name: true, initials: true, color: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      tasks: tasks.map((t) => ({
        id: t.id,
        key: t.key,
        title: t.title,
        status: t.status,
        priority: t.priority,
        labels: t.labels ? t.labels.split(",").filter((l: string) => l) : [],
        estimate: t.estimate,
        spent: t.spent,
        due: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—",
        aiFlag: t.aiFlag || undefined,
        assignee: t.assignee || null,
      })),
      timestamp: Date.now(),
    });
  }
);
