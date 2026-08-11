/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : AdminTopbar.tsx
 * Module  : Admin CMS Navigation
 *
 * Purpose :
 * Displays the CMS top navigation and administrator profile.
 *
 * Version : v0.4.0
 * ============================================================
 */

"use client";

import Link from "next/link";

import "./admin-topbar.css";

interface AdminTopbarProps {
  onMenuClick: () => void;
}

/**
 * Renders the shared administration topbar.
 */
export default function AdminTopbar({
  onMenuClick,
}: AdminTopbarProps) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar__left">
        <button
          aria-label="Open navigation"
          className="admin-topbar__menu"
          onClick={onMenuClick}
          type="button"
        >
          ☰
        </button>

        <div>
          <strong>Warm Life CMS</strong>
          <span>Content management dashboard</span>
        </div>
      </div>

      <div className="admin-topbar__actions">
        <a
          className="admin-topbar__website-link"
          href="/"
          rel="noreferrer"
          target="_blank"
        >
          View website ↗
        </a>

        <Link
          href="/admin/account"
          className="admin-topbar__profile"
          aria-label="Open administrator account settings"
        >
          <span className="admin-topbar__avatar">
            A
          </span>

          <div>
            <strong>
              Administrator
            </strong>

            <span>
              Account settings
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}