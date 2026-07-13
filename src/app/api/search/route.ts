import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

export const GET = requireUser(async (req: NextRequest, context: SessionContext) => {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ projects: [], tasks: [], people: [] });

  const [projects, tasks, people] = await Promise.all([
    db.project.findMany({
      where: { name: { contains: q }, workspace: { orgId: context.orgId } },
      take: 5,
      select: { id: true, name: true, emoji: true, key: true },
    }),
    db.workItem.findMany({
      where: {
        project: { workspace: { orgId: context.orgId } },
        OR: [{ title: { contains: q } }, { key: { contains: q } }],
      },
      take: 8,
      select: { id: true, key: true, title: true, status: true, projectId: true },
    }),
    db.user.findMany({
      where: { name: { contains: q }, orgId: context.orgId },
      take: 4,
      select: { id: true, name: true, initials: true, color: true, role: true },
    }),
  ]);

  return NextResponse.json({ projects, tasks, people });
});
