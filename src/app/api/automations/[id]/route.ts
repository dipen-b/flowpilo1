import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

async function findOrgRule(id: string, orgId: string) {
  const rule = await db.automationRule.findUnique({ where: { id } });
  return rule && rule.orgId === orgId ? rule : null;
}

export const PATCH = requireUser(async (req: NextRequest, context: SessionContext, { params }: { params: Promise<{ id: string }> }) => {
  if (!["owner", "admin"].includes(context.user.role)) {
    return NextResponse.json({ error: "Only admins can manage automations" }, { status: 403 });
  }
  const { id } = await params;
  const rule = await findOrgRule(id, context.orgId);
  if (!rule) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const updated = await db.automationRule.update({
    where: { id },
    data: { enabled: Boolean(body.enabled) },
  });
  return NextResponse.json(updated);
});

export const DELETE = requireUser(async (req: NextRequest, context: SessionContext, { params }: { params: Promise<{ id: string }> }) => {
  if (!["owner", "admin"].includes(context.user.role)) {
    return NextResponse.json({ error: "Only admins can manage automations" }, { status: 403 });
  }
  const { id } = await params;
  const rule = await findOrgRule(id, context.orgId);
  if (!rule) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.automationRule.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
});
