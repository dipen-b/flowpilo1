import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/** GitHub OAuth callback. Exchanges code for access token and stores it. */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`/integrations?error=${error}`);
  }

  if (!code || !state) {
    return NextResponse.redirect("/integrations?error=missing_code");
  }

  try {
    const stateData = JSON.parse(Buffer.from(state, "base64").toString());
    const { userId, orgId } = stateData;

    const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
    const redirectUri = `${process.env.APP_URL || "http://localhost:3000"}/api/auth/github/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect("/integrations?error=not_configured");
    }

    // Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect("/integrations?error=token_failed");
    }

    // Get GitHub user info
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const ghUser = await userRes.json();
    if (!ghUser.login) {
      return NextResponse.redirect("/integrations?error=user_failed");
    }

    // Upsert GitHub integration
    await db.gitHubIntegration.upsert({
      where: { userId_orgId: { userId, orgId } },
      create: {
        userId,
        orgId,
        githubUsername: ghUser.login,
        accessToken: tokenData.access_token, // In production, encrypt this
      },
      update: {
        githubUsername: ghUser.login,
        accessToken: tokenData.access_token,
      },
    });

    return NextResponse.redirect("/integrations?success=github_connected");
  } catch (error) {
    console.error("GitHub OAuth callback error:", error);
    return NextResponse.redirect("/integrations?error=callback_failed");
  }
}
