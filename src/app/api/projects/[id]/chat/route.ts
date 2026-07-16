import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

async function verifyProjectAccess(projectId: string, orgId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { workspace: { select: { orgId: true } } },
  });
  if (!project) return { error: "Project not found", status: 404 };
  if (project.workspace.orgId !== orgId) return { error: "Unauthorized", status: 403 };
  return null;
}

/** List chat messages for a project (Campfire). */
export const GET = requireUser(
  async (req: NextRequest, context: SessionContext, { params }: { params: { id: string } }) => {
    const denied = await verifyProjectAccess(params.id, context.orgId);
    if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

    const messages = await db.chatMessage.findMany({
      where: { projectId: params.id },
      include: { author: { select: { id: true, name: true, initials: true, color: true } } },
      orderBy: { createdAt: "asc" },
      take: 200,
    });

    return NextResponse.json({ messages, timestamp: Date.now() });
  }
);

/** Post a chat message. */
export const POST = requireUser(
  async (req: NextRequest, context: SessionContext, { params }: { params: { id: string } }) => {
    const denied = await verifyProjectAccess(params.id, context.orgId);
    if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

    const { body } = await req.json().catch(() => ({}));
    if (!body || typeof body !== "string" || !body.trim()) {
      return NextResponse.json({ error: "Message body is required" }, { status: 400 });
    }

    const message = await db.chatMessage.create({
      data: { body: body.trim().slice(0, 4000), projectId: params.id, authorId: context.user.id },
      include: { author: { select: { id: true, name: true, initials: true, color: true } } },
    });

    return NextResponse.json(message, { status: 201 });
  }
);
