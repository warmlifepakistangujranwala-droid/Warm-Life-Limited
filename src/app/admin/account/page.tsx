/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/account/page.tsx
 *
 * Purpose :
 * Displays the authenticated administrator Account Settings
 * page and provides secure email and password management.
 *
 * Version : v0.2.0
 * ============================================================
 */

import type {
  Metadata,
} from "next";

import {
  redirect,
} from "next/navigation";

import {
  AtSign,
  KeyRound,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  createClient,
} from "@/lib/supabase/server";

import AccountSettingsForm from "./AccountSettingsForm";

import "./account.css";


/* ============================================================
   METADATA
   ============================================================ */

export const metadata: Metadata = {
  title:
    "Account Settings | Warm Life CMS",

  description:
    "Manage the authenticated Warm Life CMS administrator account.",

  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};


export const dynamic =
  "force-dynamic";

export const revalidate =
  0;


/* ============================================================
   PAGE
   ============================================================ */

export default async function AdminAccountPage() {
  const supabase =
    await createClient();

  const {
    data: {
      user,
    },

    error,
  } =
    await supabase.auth
      .getUser();


  /* ==========================================================
     AUTH GUARD
     ========================================================== */

  if (
    error ||
    !user
  ) {
    redirect(
      "/admin/login?redirectTo=/admin/account",
    );
  }


  const email =
    user.email ??
    "";

  const lastSignInAt =
    user.last_sign_in_at
      ? new Date(
          user.last_sign_in_at,
        ).toLocaleString(
          "en-GB",
          {
            day:
              "2-digit",

            month:
              "short",

            year:
              "numeric",

            hour:
              "2-digit",

            minute:
              "2-digit",
          },
        )
      : null;


  return (
    <div className="adminAccountPage">

      {/* ======================================================
          PAGE HEADER
          ====================================================== */}

      <header className="adminAccountHeader">
        <div className="adminAccountHeader__icon">
          <UserRound
            size={25}
          />
        </div>

        <div>
          <span>
            Administrator
          </span>

          <h1>
            Account Settings
          </h1>

          <p>
            Manage your Warm Life
            CMS login email,
            recovery email and
            administrator password.
          </p>
        </div>
      </header>


      {/* ======================================================
          ACCOUNT OVERVIEW
          ====================================================== */}

      <section className="adminAccountCard">
        <div className="adminAccountCard__heading">
          <div className="adminAccountCard__headingIcon">
            <ShieldCheck
              size={20}
            />
          </div>

          <div>
            <span>
              Secure account
            </span>

            <h2>
              Administrator Details
            </h2>
          </div>
        </div>

        <div className="adminAccountDetails">
          <div className="adminAccountDetails__item">
            <span>
              Account
            </span>

            <strong>
              Administrator
            </strong>
          </div>

          <div className="adminAccountDetails__item">
            <span>
              Email / Login ID
            </span>

            <strong>
              {
                email ||
                "Not available"
              }
            </strong>
          </div>

          <div className="adminAccountDetails__item">
            <span>
              Authentication
            </span>

            <strong>
              Supabase Auth
            </strong>
          </div>

          <div className="adminAccountDetails__item">
            <span>
              Last Sign In
            </span>

            <strong>
              {
                lastSignInAt ||
                "Not available"
              }
            </strong>
          </div>
        </div>
      </section>


      {/* ======================================================
          EMAIL SETTINGS
          ====================================================== */}

      <section className="adminAccountCard">
        <div className="adminAccountCard__heading">
          <div className="adminAccountCard__headingIcon">
            <AtSign
              size={20}
            />
          </div>

          <div>
            <span>
              Login & recovery
            </span>

            <h2>
              Change Email Address
            </h2>

            <p>
              Change the email
              address used for CMS
              login, account
              verification and
              future password
              recovery emails.
            </p>
          </div>
        </div>

        <AccountSettingsForm
          email={email}
          section="email"
        />
      </section>


      {/* ======================================================
          PASSWORD SETTINGS
          ====================================================== */}

      <section className="adminAccountCard">
        <div className="adminAccountCard__heading">
          <div className="adminAccountCard__headingIcon">
            <KeyRound
              size={20}
            />
          </div>

          <div>
            <span>
              Security
            </span>

            <h2>
              Change Password
            </h2>

            <p>
              Set a new password
              for the currently
              authenticated CMS
              administrator account.
            </p>
          </div>
        </div>

        <AccountSettingsForm
          email={email}
          section="password"
        />
      </section>
    </div>
  );
}