/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : client.ts
 * Module  : Supabase
 *
 * Purpose :
 * Creates a Supabase client for browser-side components.
 *
 * This client will later be used for:
 * - Admin login
 * - Admin logout
 * - Browser-side authentication
 * - Browser-side database requests
 *
 * Version : v0.2.0
 * ============================================================
 */

import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client that runs inside the browser.
 *
 * The project URL and publishable key are read from environment
 * variables so credentials are not hardcoded in the source code.
 *
 * @returns A configured browser-side Supabase client.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}