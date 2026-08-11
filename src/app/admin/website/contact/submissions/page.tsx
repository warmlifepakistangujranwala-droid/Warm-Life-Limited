/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/contact/submissions/page.tsx
 *
 * Purpose :
 * Contact form submissions admin listing.
 *
 * Version : v0.1.0
 * ============================================================
 */

import Link from "next/link";

import {
  ArrowLeft,
  Inbox,
} from "lucide-react";

import {
  getContactSubmissions,
} from "@/lib/actions/contact-page";

import SubmissionsManager from "./SubmissionsManager";

import "./submissions.css";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

export default async function ContactSubmissionsPage() {
  const submissions =
    await getContactSubmissions();

  return (
    <main className="contactSubmissionsPage">
      <header className="contactSubmissionsHeader">
        <div>
          <span>
            Contact enquiries
          </span>

          <h1>
            Form Submissions
          </h1>

          <p>
            Review enquiries, update their status,
            open full messages and manage follow-up.
          </p>
        </div>

        <Link href="/admin/website/contact">
          <ArrowLeft size={16} />
          Contact Page
        </Link>
      </header>

      <SubmissionsManager
        initialSubmissions={submissions}
      />
    </main>
  );
}