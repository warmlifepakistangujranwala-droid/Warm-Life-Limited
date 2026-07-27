/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : server.ts
 * Module  : Supabase
 *
 * Purpose :
 * Creates a Supabase client for Server Components,
 * Server Actions and Route Handlers.
 *
 * This client stores and reads authentication sessions
 * through Next.js cookies.
 *
 * Version : v0.2.0
 * ============================================================
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a server-side Supabase client.
 *
 * A new client should be created for each server request.
 * This prevents authentication state being shared between users.
 *
 * @returns A configured server-side Supabase client.
 */
export async function createClient() {
  // Next.js 16 exposes cookies through an asynchronous API.
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        /**
         * Returns every cookie available for the current request.
         */
        getAll() {
          return cookieStore.getAll();
        },

        /**
         * Writes refreshed Supabase authentication cookies.
         *
         * Server Components cannot always update cookies directly,
         * so the error is safely ignored here. The Proxy will handle
         * session refreshes during requests.
         */
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Cookie updates may fail inside a Server Component.
            // The request Proxy will refresh the session instead.
          }
        },
      },
    }
  );
}