/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/lib/supabase/proxy.ts
 * Module  : Supabase Authentication
 *
 * Purpose :
 * Refreshes the Supabase authentication session and applies
 * route protection rules for the Warm Life admin area.
 * ============================================================
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthenticated = Boolean(user);

  const isLoginRoute = pathname === "/admin/login";
  const isAdminRoute =
    pathname.startsWith("/admin") && !isLoginRoute;

  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("redirectTo", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && isAuthenticated) {
    const dashboardUrl = request.nextUrl.clone();

    dashboardUrl.pathname = "/admin/dashboard";

    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}