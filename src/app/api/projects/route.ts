import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getProjects } from "@/lib/queries";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

export const GET = requireUser(async (req: NextRequest, context: SessionContext) => {
  return NextResponse.json(await getProjects(context.orgId));
});

export const POST = requireUser(async (req: NextRequest, context: SessionContext) => {
  const body = await req.json();
  const workspace = await db.workspace.findFirst({ where: { orgId: context.orgId } });
  if (!workspace) return NextResponse.json({ error: "No workspace" }, { status: 400 });

  const project = await db.project.create({
    data: {
      name: body.name ?? "Untitled project",
      key: (body.key ?? body.name ?? "PRJ").slice(0, 4).toUpperCase(),
      emoji: body.emoji ?? "🚀",
      summary: body.summary ?? "Created via API.",
      workspaceId: workspace.id,
      forecastDate: body.forecastDate ?? null,
    },
  });
  return NextResponse.json(project, { status: 201 });
});
