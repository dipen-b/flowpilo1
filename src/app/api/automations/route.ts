import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";
import { TRIGGERS, ACTIONS } from "@/lib/automations";

export const GET = requireUser(async (req: NextRequest, context: SessionContext) => {
  const rules = await db.automationRule.findMany({
    where: { orgId: context.orgId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(rules);
});

export const POST = requireUser(async (req: NextRequest, context: SessionContext) => {
  if (!["owner", "admin"].includes(context.user.role)) {
    return NextResponse.json({ error: "Only admins can create automations" }, { status: 403 });
  }

  const body = await req.json();
  const { trigger, action } = body;

  if (!TRIGGERS[trigger] || !ACTIONS[action]) {
    return NextResponse.json({ error: "Unknown trigger or action" }, { status: 400 });
  }

  const existing = await db.automationRule.findFirst({
    where: { orgId: context.orgId, trigger, action },
  });
  if (existing) {
    return NextResponse.json({ error: "That automation already exists" }, { status: 409 });
  }

  const rule = await db.automationRule.create({
    data: { orgId: context.orgId, trigger, action },
  });
  return NextResponse.json(rule, { status: 201 });
});
