import { NextRequest, NextResponse } from "next/server";
import { getMembers } from "@/lib/queries";
import { requireUser } from "@/lib/route-guard";
import { SessionContext } from "@/lib/auth";

export const GET = requireUser(async (req: NextRequest, context: SessionContext) => {
  return NextResponse.json(await getMembers(context.orgId));
});
