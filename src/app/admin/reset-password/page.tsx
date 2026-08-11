/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/reset-password/page.tsx
 *
 * Purpose :
 * Allows an administrator arriving from a Supabase recovery
 * email to set a new CMS password.
 *
 * Version : v0.1.0
 * ============================================================
 */

import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  ArrowLeft,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import ResetPasswordForm from "./ResetPasswordForm";

import "./reset-password.css";


/* ============================================================
   METADATA
   ============================================================ */

export const metadata: Metadata = {
  title:
    "Reset Password | Warm Life CMS",

  description:
    "Set a new password for your Warm Life CMS administrator account.",

  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};


/* ============================================================
   PAGE
   ============================================================ */

export default function ResetPasswordPage() {
  return (
    <main className="adminResetPage">

      <section className="adminResetCard">

        {/* ====================================================
            ICON
            ==================================================== */}

        <div className="adminResetCard__icon">
          <KeyRound
            size={28}
          />
        </div>


        {/* ====================================================
            HEADING
            ==================================================== */}

        <span className="adminResetCard__eyebrow">
          Account recovery
        </span>

        <h1>
          Set a new password
        </h1>

        <p className="adminResetCard__description">
          Create a new secure
          password for your Warm Life
          CMS administrator account.
        </p>


        {/* ====================================================
            SECURITY NOTICE
            ==================================================== */}

        <div className="adminResetCard__notice">
          <ShieldCheck
            size={18}
          />

          <p>
            This page should only be
            used after opening the
            secure password recovery
            link sent to your
            administrator email
            address.
          </p>
        </div>


        {/* ====================================================
            PASSWORD FORM
            ==================================================== */}

        <ResetPasswordForm />


        {/* ====================================================
            LOGIN LINK
            ==================================================== */}

        <Link
          href="/admin/login"
          className="adminResetCard__back"
        >
          <ArrowLeft
            size={15}
          />

          Back to Admin Login
        </Link>

      </section>

    </main>
  );
}