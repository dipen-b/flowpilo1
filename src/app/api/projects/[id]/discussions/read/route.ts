import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

/** Mark every discussion in a project as read for the current user. */
export const POST = requireUser(
  async (req: NextRequest, context: SessionContext, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const project = await db.project.findUnique({
      where: { id },
      select: { workspace: { select: { orgId: true } } },
    });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (project.workspace.orgId !== context.orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const discussions = await db.discussion.findMany({
      where: { projectId: id },
      select: { id: true },
    });

    const now = new Date();
    await Promise.all(
      discussions.map((d) =>
        db.discussionRead.upsert({
          where: { discussionId_userId: { discussionId: d.id, userId: context.user.id } },
          create: { discussionId: d.id, userId: context.user.id },
          update: { lastReadAt: now },
        })
      )
    );

    return NextResponse.json({ marked: discussions.length });
  }
);
