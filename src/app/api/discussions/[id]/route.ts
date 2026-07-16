import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

async function getScopedDiscussion(id: string, orgId: string) {
  const discussion = await db.discussion.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, initials: true, color: true } },
      project: { select: { id: true, name: true, emoji: true, workspace: { select: { orgId: true } } } },
      replies: {
        include: { author: { select: { id: true, name: true, initials: true, color: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!discussion || discussion.project.workspace.orgId !== orgId) return null;
  return discussion;
}

/** Get a discussion with its replies. */
export const GET = requireUser(
  async (req: NextRequest, context: SessionContext, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const discussion = await getScopedDiscussion(id, context.orgId);
    if (!discussion) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      id: discussion.id,
      title: discussion.title,
      body: discussion.body,
      author: discussion.author,
      createdAt: discussion.createdAt,
      project: { id: discussion.project.id, name: discussion.project.name, emoji: discussion.project.emoji },
      replies: discussion.replies,
    });
  }
);

/** Add a reply to a discussion. */
export const POST = requireUser(
  async (req: NextRequest, context: SessionContext, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const discussion = await getScopedDiscussion(id, context.orgId);
    if (!discussion) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { body } = await req.json().catch(() => ({}));
    if (!body?.trim()) {
      return NextResponse.json({ error: "Reply body is required" }, { status: 400 });
    }

    const reply = await db.discussionReply.create({
      data: { body: body.trim().slice(0, 10000), discussionId: id, authorId: context.user.id },
      include: { author: { select: { id: true, name: true, initials: true, color: true } } },
    });

    return NextResponse.json(reply, { status: 201 });
  }
);
