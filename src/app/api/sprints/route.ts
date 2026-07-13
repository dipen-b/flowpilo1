import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

/** Create a new active sprint; the previous active sprint (if any) is completed. */
export const POST = requireUser(async (req: NextRequest, context: SessionContext) => {
  const body = await req.json();
  const { name, goal, projectId, startDate, endDate } = body;

  if (!name?.trim() || !projectId) {
    return NextResponse.json({ error: "Sprint name and project are required" }, { status: 400 });
  }

  // Project must belong to this org
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { workspace: true },
  });
  if (!project || project.workspace.orgId !== context.orgId) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Close out any currently active sprints in this org
  await db.sprint.updateMany({
    where: { status: "active", project: { workspace: { orgId: context.orgId } } },
    data: { status: "completed" },
  });

  const sprint = await db.sprint.create({
    data: {
      name: name.trim(),
      goal: goal?.trim() ?? "",
      status: "active",
      startDate: startDate || null,
      endDate: endDate || null,
      projectId,
    },
  });

  return NextResponse.json(sprint, { status: 201 });
});
