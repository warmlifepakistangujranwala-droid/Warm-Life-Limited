/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : layout.tsx
 * Route   : /admin/*
 *
 * Purpose :
 * Provides the shared authenticated administration layout.
 * The login page is excluded through pathname detection.
 *
 * Version : v0.3.0
 * ============================================================
 */

"use client";

import { usePathname } from "next/navigation";

//import AdminShell from "@/components/admin/layout/AdminShell";
import AdminShell from "@/components/admin/layout/AdminShell";

import "./admin.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Applies the CMS shell to protected admin pages.
 * The login page renders without the dashboard navigation.
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return children;
  }

  return <AdminShell>{children}</AdminShell>;
}