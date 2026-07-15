import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

/** Disconnect GitHub integration for the user. */
export const DELETE = requireUser(async (req: NextRequest, context: SessionContext) => {
  await db.gitHubIntegration.deleteMany({
    where: { userId: context.user.id, orgId: context.orgId },
  });
  return NextResponse.json({ ok: true });
});
