/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : AdminTopbar.tsx
 * Module  : Admin CMS Navigation
 *
 * Purpose :
 * Displays the CMS top navigation and administrator profile.
 *
 * Version : v0.3.0
 * ============================================================
 */

"use client";

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

        <div className="admin-topbar__profile">
          <span className="admin-topbar__avatar">A</span>

          <div>
            <strong>Administrator</strong>
            <span>Secure access</span>
          </div>
        </div>
      </div>
    </header>
  );
}