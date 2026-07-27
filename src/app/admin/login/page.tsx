/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : page.tsx
 * Route   : /admin/login
 *
 * Purpose :
 * Displays the secure Warm Life CMS administrator login page.
 *
 * This page remains separate from the public customer website.
 *
 * Version : v0.2.0
 * ============================================================
 */

import type { Metadata } from "next";
import Image from "next/image";

import LoginForm from "@/components/admin/forms/LoginForm";

import "./login.css";

/**
 * Prevent the private administration page from being indexed.
 */
export const metadata: Metadata = {
  title: "Admin Login | Warm Life Ltd",
  description: "Secure administrator login for the Warm Life CMS.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

/**
 * Content management feature icon.
 */
function ContentIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="30"
      viewBox="0 0 24 24"
      width="30"
    >
      <path
        d="M7 3.5h7l4 4v13H7v-17Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />

      <path
        d="M14 3.5v4h4M10 12h5M10 15.5h5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/**
 * Media library feature icon.
 */
function MediaIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="30"
      viewBox="0 0 24 24"
      width="30"
    >
      <rect
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
        width="18"
        x="3"
        y="4"
      />

      <circle
        cx="9"
        cy="9"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="m5.5 17 4.5-4 3 2.5 2.5-2 3 3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/**
 * Lead management feature icon.
 */
function LeadsIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="30"
      viewBox="0 0 24 24"
      width="30"
    >
      <path
        d="M5 19V12M10 19V8M15 19v-5M20 19V5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />

      <path
        d="m5 9 5-4 5 3 5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

/**
 * Shield icon for secure administration messaging.
 */
function ShieldIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="30"
      viewBox="0 0 24 24"
      width="30"
    >
      <path
        d="M12 3 5 6v5c0 4.7 2.9 8.3 7 10 4.1-1.7 7-5.3 7-10V6l-7-3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/**
 * Renders the Warm Life CMS administrator login page.
 */
export default function AdminLoginPage() {
  return (
    <main className="admin-login-page">
      <section className="admin-login-page__panel">
        <div className="admin-login-page__content">
          <div className="admin-login-page__brand">
            <Image
              alt="Warm Life "
              className="admin-login-page__logo"
              height={250}
              priority
              src="/images/warm-life-logo.png"
              width={250}
              
            />

            </div>

          <LoginForm />
        </div>
      </section>

      <aside className="admin-login-page__visual">
        <div className="admin-login-page__gold-line admin-login-page__gold-line--top" />

        <div className="admin-login-page__gold-line admin-login-page__gold-line--bottom" />

        <div className="admin-login-page__dot-pattern admin-login-page__dot-pattern--top" />

        <div className="admin-login-page__dot-pattern admin-login-page__dot-pattern--bottom" />

        <div className="admin-login-page__visual-content">
          <div className="admin-login-page__security-label">
            <ShieldIcon />

            <span>Secure administration</span>
          </div>

          <div className="admin-login-page__short-line" />

          <h2>
            Manage your
            <br />
            complete website
            <br />
            <strong>without</strong> editing code.
          </h2>

          <div className="admin-login-page__short-line" />

          <p className="admin-login-page__visual-description">
            Update content, media, services, case studies, blogs and leads from
            one protected dashboard.
          </p>

          <div className="admin-login-page__features">
            <article className="admin-login-page__feature">
              <div className="admin-login-page__feature-icon">
                <ContentIcon />
              </div>

              <p>
                Content
                <br />
                Management
              </p>
            </article>

            <article className="admin-login-page__feature">
              <div className="admin-login-page__feature-icon">
                <MediaIcon />
              </div>

              <p>
                Media
                <br />
                Library
              </p>
            </article>

            <article className="admin-login-page__feature">
              <div className="admin-login-page__feature-icon">
                <LeadsIcon />
              </div>

              <p>
                Leads &amp;
                <br />
                Enquiries
              </p>
            </article>
          </div>
        </div>
      </aside>
    </main>
  );
}