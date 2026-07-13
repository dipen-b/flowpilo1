import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, SessionContext } from "@/lib/auth";

/**
 * Wraps a route handler to enforce authentication and provide tenant context.
 * Returns 401 if unauthenticated; passes {user, orgId} to handler.
 * Supports both regular and dynamic routes ([id]).
 */
export function requireUser(
  handler: (req: NextRequest, context: SessionContext, routeContext?: any) => Promise<NextResponse>
): (req: NextRequest, routeContext?: any) => Promise<NextResponse> {
  return async (req: NextRequest, routeContext?: any) => {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(req, session, routeContext);
  };
}
