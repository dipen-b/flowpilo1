import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getProjects } from "@/lib/queries";

export async function GET() {
  return NextResponse.json(await getProjects());
}

export async function POST(request: Request) {
  const body = await request.json();
  const workspace = await db.workspace.findFirst();
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
}
