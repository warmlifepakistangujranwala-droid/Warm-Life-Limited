/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : AdminShell.tsx
 * Module  : Admin CMS Layout
 *
 * Purpose :
 * Combines the reusable CMS sidebar, topbar and content area.
 *
 * Version : v0.3.0
 * ============================================================
 */

"use client";

import { useState } from "react";

import AdminSidebar from "@/components/admin/sidebar/AdminSidebar";
// import AdminTopbar from "@/components/admin/topbar/AdminTopbar";
import AdminTopbar from "../topbar/AdminTopbar";

import "./admin-shell.css";

interface AdminShellProps {
  children: React.ReactNode;
}

/**
 * Renders the shared administration interface.
 */
export default function AdminShell({ children }: AdminShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function openSidebar() {
    setIsSidebarOpen(true);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="admin-shell">
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {isSidebarOpen && (
        <button
          aria-label="Close navigation"
          className="admin-shell__overlay"
          onClick={closeSidebar}
          type="button"
        />
      )}

      <div className="admin-shell__workspace">
        <AdminTopbar onMenuClick={openSidebar} />

        <main className="admin-shell__content">{children}</main>
      </div>
    </div>
  );
}