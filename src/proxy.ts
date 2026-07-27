/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/proxy.ts
 * Module  : Next.js Proxy
 *
 * Purpose :
 * Runs the Supabase session helper for admin routes.
 * ============================================================
 */

import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};