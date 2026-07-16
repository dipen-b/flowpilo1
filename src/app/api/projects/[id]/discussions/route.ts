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

/** List discussions (message board) for a project. */
export const GET = requireUser(
  async (req: NextRequest, context: SessionContext, { params }: { params: { id: string } }) => {
    const denied = await verifyProjectAccess(params.id, context.orgId);
    if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

    const discussions = await db.discussion.findMany({
      where: { projectId: params.id },
      include: {
        author: { select: { id: true, name: true, initials: true, color: true } },
        _count: { select: { replies: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      discussions.map((d) => ({
        id: d.id,
        title: d.title,
        excerpt: d.body.slice(0, 160),
        author: d.author,
        replyCount: d._count.replies,
        createdAt: d.createdAt,
      }))
    );
  }
);

/** Post a new discussion. */
export const POST = requireUser(
  async (req: NextRequest, context: SessionContext, { params }: { params: { id: string } }) => {
    const denied = await verifyProjectAccess(params.id, context.orgId);
    if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

    const { title, body } = await req.json().catch(() => ({}));
    if (!title?.trim() || !body?.trim()) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
    }

    const discussion = await db.discussion.create({
      data: {
        title: title.trim().slice(0, 200),
        body: body.trim().slice(0, 10000),
        projectId: params.id,
        authorId: context.user.id,
      },
      include: { author: { select: { id: true, name: true, initials: true, color: true } } },
    });

    return NextResponse.json(discussion, { status: 201 });
  }
);
