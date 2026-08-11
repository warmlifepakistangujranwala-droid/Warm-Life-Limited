/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/forgot-password/page.tsx
 *
 * Purpose :
 * Displays the Warm Life CMS password recovery request page.
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

// import ForgotPasswordForm from "./ForgotPasswordForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

import "./forgot-password.css";


export const metadata: Metadata = {
  title:
    "Forgot Password | Warm Life CMS",

  description:
    "Request a secure Warm Life CMS password reset.",

  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};


export default function ForgotPasswordPage() {
  return (
    <main className="adminForgotPage">
      <section className="adminForgotCard">
        <div className="adminForgotCard__icon">
          <KeyRound
            size={28}
          />
        </div>

        <span className="adminForgotCard__eyebrow">
          Secure recovery
        </span>

        <h1>
          Forgot your password?
        </h1>

        <p className="adminForgotCard__description">
          Enter the email address
          connected to your Warm Life
          CMS administrator account.
          We&apos;ll send you a secure
          password reset link.
        </p>

        <div className="adminForgotCard__notice">
          <ShieldCheck
            size={18}
          />

          <p>
            The reset email will only
            be sent to an email address
            registered with the CMS
            authentication system.
          </p>
        </div>

        <ForgotPasswordForm />

        <Link
          href="/admin/login"
          className="adminForgotCard__back"
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