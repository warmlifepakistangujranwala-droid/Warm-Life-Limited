/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : LogoutButton.tsx
 * Module  : Admin Authentication
 *
 * Purpose :
 * Signs the administrator out and returns them to login.
 *
 * Version : v0.3.0
 * ============================================================
 */

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

import "./logout-button.css";

/**
 * Handles the administrator logout process.
 */
export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      className="admin-logout-button"
      disabled={isLoggingOut}
      onClick={handleLogout}
      type="button"
    >
      <span>↪</span>

      {isLoggingOut ? "Signing out..." : "Sign out"}
    </button>
  );
}