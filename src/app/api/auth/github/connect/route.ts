import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

/** Initiate GitHub OAuth flow. Redirects user to GitHub login. */
export async function GET(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "GitHub OAuth not configured" },
      { status: 500 }
    );
  }

  const redirectUri = `${process.env.APP_URL || "http://localhost:3000"}/api/auth/github/callback`;
  const scope = "repo,user";
  const state = Buffer.from(JSON.stringify({ userId: session.user.id, orgId: session.orgId })).toString("base64");

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scope);
  url.searchParams.set("state", state);

  return NextResponse.redirect(url.toString());
}
