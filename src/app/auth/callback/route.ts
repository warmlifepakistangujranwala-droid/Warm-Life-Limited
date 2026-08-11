/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/auth/callback/route.ts
 *
 * Purpose :
 * Handles Supabase PKCE authentication callbacks and exchanges
 * the returned auth code for a secure cookie-based session.
 *
 * Version : v0.1.0
 * ============================================================
 */

import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase/server";


export async function GET(
  request: Request,
) {
  const requestUrl =
    new URL(request.url);

  const code =
    requestUrl.searchParams
      .get("code");

  const next =
    requestUrl.searchParams
      .get("next") ||
    "/admin/reset-password";


  /* ==========================================================
     MISSING CODE
     ========================================================== */

  if (!code) {
    const errorUrl =
      new URL(
        "/admin/forgot-password",
        requestUrl.origin,
      );

    errorUrl.searchParams.set(
      "error",
      "invalid_recovery_link",
    );

    return NextResponse.redirect(
      errorUrl,
    );
  }


  /* ==========================================================
     EXCHANGE PKCE CODE FOR SESSION
     ========================================================== */

  const supabase =
    await createClient();

  const {
    error,
  } =
    await supabase.auth
      .exchangeCodeForSession(
        code,
      );


  /* ==========================================================
     INVALID / EXPIRED LINK
     ========================================================== */

  if (error) {
    console.error(
      "Supabase auth callback failed:",
      error,
    );

    const errorUrl =
      new URL(
        "/admin/forgot-password",
        requestUrl.origin,
      );

    errorUrl.searchParams.set(
      "error",
      "recovery_link_expired",
    );

    return NextResponse.redirect(
      errorUrl,
    );
  }


  /* ==========================================================
     SUCCESS
     ========================================================== */

  const safeNext =
    next.startsWith("/")
      ? next
      : "/admin/reset-password";

  return NextResponse.redirect(
    new URL(
      safeNext,
      requestUrl.origin,
    ),
  );
}