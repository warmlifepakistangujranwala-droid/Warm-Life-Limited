/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/contact/submissions/[id]/SubmissionDetailManager.tsx
 *
 * Purpose :
 * Contact submission status, notes and delete controls.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use client";

import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  Save,
  Tag,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  deleteContactSubmission,
  updateContactSubmission,
} from "@/lib/actions/contact-page";

import type {
  ContactFormSubmission,
  ContactSubmissionStatus,
} from "@/lib/types/contact-page";

type Props = {
  submission:
    ContactFormSubmission;
};

function formatDate(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(
    new Date(value),
  );
}

export default function SubmissionDetailManager({
  submission,
}: Props) {
  const router = useRouter();

  const [status, setStatus] =
    useState<ContactSubmissionStatus>(
      submission.status,
    );

  const [notes, setNotes] =
    useState(
      submission.admin_notes ??
      "",
    );

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState<{
      type:
        | "success"
        | "error";
      text: string;
    } | null>(null);

  async function save(): Promise<void> {
    setSaving(true);
    setMessage(null);

    const result =
      await updateContactSubmission(
        submission.id,
        {
          status,

          admin_notes:
            notes.trim() ||
            null,

          replied_at:
            status ===
            "replied"
              ? submission.replied_at ||
                new Date().toISOString()
              : submission.replied_at,
        },
      );

    if (!result.success) {
      setMessage({
        type: "error",
        text:
          result.message,
      });
    } else {
      setMessage({
        type: "success",
        text:
          "Submission updated successfully.",
      });

      router.refresh();
    }

    setSaving(false);
  }

  async function remove(): Promise<void> {
    if (
      !window.confirm(
        "Permanently delete this Contact submission?",
      )
    ) {
      return;
    }

    setSaving(true);

    const result =
      await deleteContactSubmission(
        submission.id,
      );

    if (!result.success) {
      setMessage({
        type: "error",
        text:
          result.message,
      });

      setSaving(false);
      return;
    }

    router.push(
      "/admin/website/contact/submissions",
    );

    router.refresh();
  }

  return (
    <section className="contactSubmissionDetail">
      {message ? (
        <div
          className={`contactSubmissionDetail__message ${
            message.type ===
            "success"
              ? "isSuccess"
              : "isError"
          }`}
        >
          {message.type ===
          "success" ? (
            <CheckCircle2
              size={17}
            />
          ) : null}

          {message.text}
        </div>
      ) : null}

      <div className="contactSubmissionDetail__layout">
        <div className="contactSubmissionDetail__main">
          <article className="contactSubmissionPanel">
            <header>
              <span>
                Full enquiry
              </span>

              <h2>
                Message
              </h2>
            </header>

            <div className="contactSubmissionMessage">
              <MessageSquareText
                size={22}
              />

              <p>
                {submission.message}
              </p>
            </div>
          </article>

          <article className="contactSubmissionPanel">
            <header>
              <span>
                Internal only
              </span>

              <h2>
                Admin Notes
              </h2>
            </header>

            <div className="contactSubmissionNotes">
              <textarea
                rows={9}
                value={notes}
                onChange={(event) =>
                  setNotes(
                    event.target.value,
                  )
                }
                placeholder="Add internal notes about follow-up, calls, quotation status, etc."
              />
            </div>
          </article>
        </div>

        <aside className="contactSubmissionDetail__sidebar">
          <article className="contactSubmissionPanel">
            <header>
              <span>
                Contact
              </span>

              <h2>
                Customer Details
              </h2>
            </header>

            <div className="contactSubmissionInfoList">
              <div>
                <UserRound
                  size={17}
                />

                <p>
                  <small>
                    Name
                  </small>

                  <strong>
                    {
                      submission.full_name
                    }
                  </strong>
                </p>
              </div>

              <div>
                <Mail
                  size={17}
                />

                <p>
                  <small>
                    Email
                  </small>

                  <a
                    href={`mailto:${submission.email}`}
                  >
                    {
                      submission.email
                    }
                  </a>
                </p>
              </div>

              {submission.phone ? (
                <div>
                  <Phone
                    size={17}
                  />

                  <p>
                    <small>
                      Phone
                    </small>

                    <a
                      href={`tel:${submission.phone}`}
                    >
                      {
                        submission.phone
                      }
                    </a>
                  </p>
                </div>
              ) : null}

              <div>
                <CalendarDays
                  size={17}
                />

                <p>
                  <small>
                    Received
                  </small>

                  <strong>
                    {formatDate(
                      submission.created_at,
                    )}
                  </strong>
                </p>
              </div>

              {submission.enquiry_type_label ? (
                <div>
                  <Tag
                    size={17}
                  />

                  <p>
                    <small>
                      Enquiry Type
                    </small>

                    <strong>
                      {
                        submission.enquiry_type_label
                      }
                    </strong>
                  </p>
                </div>
              ) : null}
            </div>
          </article>

          <article className="contactSubmissionPanel">
            <header>
              <span>
                Workflow
              </span>

              <h2>
                Status
              </h2>
            </header>

            <div className="contactSubmissionStatusEditor">
              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target
                      .value as ContactSubmissionStatus,
                  )
                }
              >
                <option value="new">
                  New
                </option>

                <option value="read">
                  Read
                </option>

                <option value="replied">
                  Replied
                </option>

                <option value="archived">
                  Archived
                </option>

                <option value="spam">
                  Spam
                </option>
              </select>

              {submission.subject ? (
                <div>
                  <small>
                    Subject
                  </small>

                  <strong>
                    {
                      submission.subject
                    }
                  </strong>
                </div>
              ) : null}

              {submission.source_page ? (
                <div>
                  <small>
                    Source
                  </small>

                  <strong>
                    {
                      submission.source_page
                    }
                  </strong>
                </div>
              ) : null}

              {submission.replied_at ? (
                <div>
                  <small>
                    Replied At
                  </small>

                  <strong>
                    {formatDate(
                      submission.replied_at,
                    )}
                  </strong>
                </div>
              ) : null}
            </div>
          </article>
        </aside>
      </div>

      <footer className="contactSubmissionDetail__actions">
        <button
          type="button"
          className="isDelete"
          disabled={saving}
          onClick={remove}
        >
          <Trash2
            size={16}
          />

          Delete Submission
        </button>

        <button
          type="button"
          className="isSave"
          disabled={saving}
          onClick={save}
        >
          {saving ? (
            <Loader2
              size={16}
              className="contactSubmissionSpin"
            />
          ) : (
            <Save
              size={16}
            />
          )}

          Save Changes
        </button>
      </footer>
    </section>
  );
}