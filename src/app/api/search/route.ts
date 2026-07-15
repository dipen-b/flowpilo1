import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

export const GET = requireUser(async (req: NextRequest, context: SessionContext) => {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const projectId = searchParams.get("projectId") ?? "";
  const assigneeId = searchParams.get("assigneeId") ?? "";
  const status = searchParams.get("status") ?? "";
  const priority = searchParams.get("priority") ?? "";
  const dueBefore = searchParams.get("dueBefore") ?? "";
  const dueAfter = searchParams.get("dueAfter") ?? "";

  // Quick keyword search (< 2 chars returns nothing)
  if (q.length < 2 && !projectId && !assigneeId && !status && !priority && !dueBefore && !dueAfter) {
    return NextResponse.json({ projects: [], tasks: [], people: [] });
  }

  // Build task filter
  const taskWhere: any = { project: { workspace: { orgId: context.orgId } } };
  if (projectId) taskWhere.projectId = projectId;
  if (assigneeId) taskWhere.assigneeId = assigneeId;
  if (status) taskWhere.status = status;
  if (priority) taskWhere.priority = priority;
  if (dueBefore || dueAfter) {
    taskWhere.dueDate = {};
    if (dueBefore) taskWhere.dueDate.lte = dueBefore;
    if (dueAfter) taskWhere.dueDate.gte = dueAfter;
  }
  if (q) {
    taskWhere.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { key: { contains: q.toUpperCase() } },
    ];
  }

  const [projects, tasks, people] = await Promise.all([
    q.length >= 2
      ? db.project.findMany({
          where: { name: { contains: q }, workspace: { orgId: context.orgId } },
          take: 5,
          select: { id: true, name: true, emoji: true, key: true },
        })
      : Promise.resolve([]),
    db.workItem.findMany({
      where: taskWhere,
      include: { assignee: true, project: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    q.length >= 2
      ? db.user.findMany({
          where: { name: { contains: q }, orgId: context.orgId },
          take: 4,
          select: { id: true, name: true, initials: true, color: true },
        })
      : Promise.resolve([]),
  ]);

  return NextResponse.json({
    projects,
    tasks: tasks.map((t) => ({ id: t.id, key: t.key, title: t.title, status: t.status, priority: t.priority, projectId: t.projectId, projectName: t.project.name, assignee: t.assignee })),
    people,
  });
});
