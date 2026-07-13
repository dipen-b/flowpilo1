import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

function csvCell(value: string | number | null | undefined): string {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Export all org work items as CSV. */
export const GET = requireUser(async (req: NextRequest, context: SessionContext) => {
  const items = await db.workItem.findMany({
    where: { project: { workspace: { orgId: context.orgId } } },
    include: { project: true, assignee: true, sprint: true },
    orderBy: [{ project: { name: "asc" } }, { createdAt: "asc" }],
  });

  const header = ["Project", "Key", "Title", "Status", "Priority", "Estimate (pts)", "Spent (pts)", "Assignee", "Sprint", "Due date", "Created"];
  const rows = items.map((t) => [
    t.project.name, t.key, t.title, t.status, t.priority, t.estimate, t.spent,
    t.assignee?.name ?? "", t.sprint?.name ?? "", t.dueDate ?? "",
    t.createdAt.toISOString().slice(0, 10),
  ]);

  const csv = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="flowpilot-export-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
});
