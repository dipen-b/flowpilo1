import { NextRequest, NextResponse } from "next/server";
import { getProject } from "@/lib/queries";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

export const GET = requireUser(async (req: NextRequest, context: SessionContext, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const project = await getProject(id, context.orgId);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
});
