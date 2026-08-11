/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/contact/submissions/[id]/page.tsx
 *
 * Purpose :
 * Full Contact submission detail.
 *
 * Version : v0.1.0
 * ============================================================
 */

import Link from "next/link";

import {
  ArrowLeft,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import {
  getContactSubmissionById,
} from "@/lib/actions/contact-page";

import SubmissionDetailManager from "./SubmissionDetailManager";

import "../submissions.css";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ContactSubmissionDetailPage({
  params,
}: Props) {
  const { id } =
    await params;

  const submission =
    await getContactSubmissionById(
      id,
    );

  if (!submission) {
    notFound();
  }

  return (
    <main className="contactSubmissionsPage">
      <header className="contactSubmissionsHeader">
        <div>
          <span>
            Contact enquiry
          </span>

          <h1>
            {submission.full_name}
          </h1>

          <p>
            View the full message,
            update status and add
            internal notes.
          </p>
        </div>

        <Link href="/admin/website/contact/submissions">
          <ArrowLeft size={16} />
          All Submissions
        </Link>
      </header>

      <SubmissionDetailManager
        submission={submission}
      />
    </main>
  );
}