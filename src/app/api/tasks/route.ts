import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getTasks } from "@/lib/queries";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";
import { runAutomations } from "@/lib/automations";

export const GET = requireUser(async (req: NextRequest, context: SessionContext) => {
  return NextResponse.json(await getTasks(context.orgId));
});

export const POST = requireUser(async (req: NextRequest, context: SessionContext) => {
  const body = await req.json();
  if (!body.projectId || !body.title) {
    return NextResponse.json({ error: "projectId and title are required" }, { status: 400 });
  }
  const project = await db.project.findUnique({
    where: { id: body.projectId },
    include: { workspace: true },
  });
  if (!project || project.workspace.orgId !== context.orgId) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const count = await db.workItem.count({ where: { projectId: project.id } });
  const item = await db.workItem.create({
    data: {
      key: `${project.key}-${100 + count + 1}`,
      title: body.title,
      type: body.type ?? "task",
      status: body.status ?? "backlog",
      priority: body.priority ?? "medium",
      labels: Array.isArray(body.labels) ? body.labels.join(",") : (body.labels ?? ""),
      estimate: body.estimate ?? 0,
      dueDate: body.dueDate ?? null,
      projectId: project.id,
      assigneeId: body.assigneeId ?? null,
    },
  });

  const ctx = {
    taskId: item.id, taskKey: item.key, taskTitle: item.title,
    assigneeId: item.assigneeId, projectId: project.id, actorName: context.user.name,
  };
  await runAutomations(context.orgId, "task_created", ctx);
  if (item.priority === "urgent") await runAutomations(context.orgId, "task_urgent", ctx);

  return NextResponse.json(item, { status: 201 });
});
