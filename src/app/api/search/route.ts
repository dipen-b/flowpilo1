import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ projects: [], tasks: [], people: [] });

  const [projects, tasks, people] = await Promise.all([
    db.project.findMany({
      where: { name: { contains: q } },
      take: 5,
      select: { id: true, name: true, emoji: true, key: true },
    }),
    db.workItem.findMany({
      where: { OR: [{ title: { contains: q } }, { key: { contains: q } }] },
      take: 8,
      select: { id: true, key: true, title: true, status: true, projectId: true },
    }),
    db.user.findMany({
      where: { name: { contains: q } },
      take: 4,
      select: { id: true, name: true, initials: true, color: true, role: true },
    }),
  ]);

  return NextResponse.json({ projects, tasks, people });
}
