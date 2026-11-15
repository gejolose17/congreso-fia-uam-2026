import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getGoogleAuthUrl, isOAuthConfigured } from "@/lib/google";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
  }

  if (!isOAuthConfigured()) {
    return NextResponse.redirect(
      new URL("/admin/google-setup?error=missing_oauth_env", req.nextUrl.origin)
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || req.nextUrl.origin;
  const state = crypto.randomBytes(16).toString("hex");
  const authUrl = getGoogleAuthUrl(origin, state);

  const res = NextResponse.redirect(authUrl);
  res.cookies.set("fia_google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}

