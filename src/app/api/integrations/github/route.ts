import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

/** Get GitHub integration status for the current user. */
export const GET = requireUser(async (req: NextRequest, context: SessionContext) => {
  const integration = await db.gitHubIntegration.findUnique({
    where: { userId_orgId: { userId: context.user.id, orgId: context.orgId } },
    select: { id: true, githubUsername: true, createdAt: true },
  });

  return NextResponse.json({
    connected: !!integration,
    integration: integration
      ? {
          id: integration.id,
          username: integration.githubUsername,
          connectedAt: integration.createdAt,
        }
      : null,
  });
});
