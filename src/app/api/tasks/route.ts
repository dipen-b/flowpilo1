import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getTasks } from "@/lib/queries";

export async function GET() {
  return NextResponse.json(await getTasks());
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.projectId || !body.title) {
    return NextResponse.json({ error: "projectId and title are required" }, { status: 400 });
  }
  const project = await db.project.findUnique({ where: { id: body.projectId } });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

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
  return NextResponse.json(item, { status: 201 });
}
