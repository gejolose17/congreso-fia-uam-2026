import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/google";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");
  const savedState = req.cookies.get("fia_google_oauth_state")?.value;

  const baseOrigin =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || req.nextUrl.origin;

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/google-setup?error=${encodeURIComponent(error)}`, baseOrigin)
    );
  }

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(
      new URL("/admin/google-setup?error=invalid_state", baseOrigin)
    );
  }

  try {
    await exchangeCodeForTokens(code, baseOrigin);
    const res = NextResponse.redirect(
      new URL("/admin/google-setup?connected=1", baseOrigin)
    );
    res.cookies.delete("fia_google_oauth_state");
    return res;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "oauth_failed";
    return NextResponse.redirect(
      new URL(`/admin/google-setup?error=${encodeURIComponent(msg)}`, baseOrigin)
    );
  }
}

