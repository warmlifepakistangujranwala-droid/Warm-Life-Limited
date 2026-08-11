/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/contact/submissions/SubmissionsManager.tsx
 *
 * Purpose :
 * Search/filter/status management for Contact submissions.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use client";

import Link from "next/link";

import {
  Archive,
  CheckCheck,
  Eye,
  Inbox,
  MailOpen,
  Search,
  ShieldAlert,
  Trash2,
} from "lucide-react";

import {
  useMemo,
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
  initialSubmissions:
    ContactFormSubmission[];
};

type Filter =
  | "all"
  | ContactSubmissionStatus;

function formatDate(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(
    new Date(value),
  );
}

function statusLabel(
  status: ContactSubmissionStatus,
): string {
  if (status === "new") {
    return "New";
  }

  if (status === "read") {
    return "Read";
  }

  if (status === "replied") {
    return "Replied";
  }

  if (status === "archived") {
    return "Archived";
  }

  return "Spam";
}

export default function SubmissionsManager({
  initialSubmissions,
}: Props) {
  const router = useRouter();

  const [query, setQuery] =
    useState("");

  const [filter, setFilter] =
    useState<Filter>("all");

  const [busyId, setBusyId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const counts =
    useMemo(() => {
      return {
        all:
          initialSubmissions.length,

        new:
          initialSubmissions.filter(
            (item) =>
              item.status === "new",
          ).length,

        read:
          initialSubmissions.filter(
            (item) =>
              item.status === "read",
          ).length,

        replied:
          initialSubmissions.filter(
            (item) =>
              item.status === "replied",
          ).length,

        archived:
          initialSubmissions.filter(
            (item) =>
              item.status === "archived",
          ).length,

        spam:
          initialSubmissions.filter(
            (item) =>
              item.status === "spam",
          ).length,
      };
    }, [initialSubmissions]);

  const filtered =
    useMemo(() => {
      const normalized =
        query
          .trim()
          .toLowerCase();

      return initialSubmissions.filter(
        (item) => {
          const matchesFilter =
            filter === "all" ||
            item.status === filter;

          if (!matchesFilter) {
            return false;
          }

          if (!normalized) {
            return true;
          }

          const haystack = [
            item.full_name,
            item.email,
            item.phone ?? "",
            item.subject ?? "",
            item.message,
            item.enquiry_type_label ?? "",
            item.status,
          ]
            .join(" ")
            .toLowerCase();

          return haystack.includes(
            normalized,
          );
        },
      );
    }, [
      initialSubmissions,
      filter,
      query,
    ]);

  async function setStatus(
    id: string,
    status: ContactSubmissionStatus,
  ): Promise<void> {
    setBusyId(id);
    setMessage("");

    const result =
      await updateContactSubmission(
        id,
        {
          status,

          ...(status ===
          "replied"
            ? {
                replied_at:
                  new Date().toISOString(),
              }
            : {}),
        },
      );

    if (!result.success) {
      setMessage(
        result.message,
      );
    } else {
      router.refresh();
    }

    setBusyId(null);
  }

  async function remove(
    id: string,
  ): Promise<void> {
    if (
      !window.confirm(
        "Permanently delete this Contact submission?",
      )
    ) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const result =
      await deleteContactSubmission(
        id,
      );

    if (!result.success) {
      setMessage(
        result.message,
      );
    } else {
      router.refresh();
    }

    setBusyId(null);
  }

  return (
    <section className="contactSubmissionsManager">
      <div className="contactSubmissionStats">
        {[
          [
            "all",
            "All",
            counts.all,
            Inbox,
          ],
          [
            "new",
            "New",
            counts.new,
            Inbox,
          ],
          [
            "read",
            "Read",
            counts.read,
            MailOpen,
          ],
          [
            "replied",
            "Replied",
            counts.replied,
            CheckCheck,
          ],
          [
            "archived",
            "Archived",
            counts.archived,
            Archive,
          ],
          [
            "spam",
            "Spam",
            counts.spam,
            ShieldAlert,
          ],
        ].map(
          ([
            value,
            label,
            count,
            Icon,
          ]) => {
            const key =
              value as Filter;

            const Component =
              Icon as typeof Inbox;

            return (
              <button
                key={key}
                type="button"
                className={
                  filter === key
                    ? "isActive"
                    : ""
                }
                onClick={() =>
                  setFilter(key)
                }
              >
                <Component
                  size={17}
                />

                <span>
                  {label as string}
                </span>

                <strong>
                  {count as number}
                </strong>
              </button>
            );
          },
        )}
      </div>

      <div className="contactSubmissionsToolbar">
        <label>
          <Search size={16} />

          <input
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value,
              )
            }
            placeholder="Search name, email, phone, subject or message..."
          />
        </label>

        <span>
          {filtered.length}
          {" "}
          result
          {filtered.length === 1
            ? ""
            : "s"}
        </span>
      </div>

      {message ? (
        <div className="contactSubmissionsMessage">
          {message}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="contactSubmissionsEmpty">
          <Inbox size={34} />

          <h3>
            No submissions found
          </h3>

          <p>
            Try a different status
            filter or search term.
          </p>
        </div>
      ) : (
        <div className="contactSubmissionsTableWrap">
          <table className="contactSubmissionsTable">
            <thead>
              <tr>
                <th>
                  Contact
                </th>

                <th>
                  Enquiry
                </th>

                <th>
                  Received
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map(
                (item) => (
                  <tr
                    key={item.id}
                    className={
                      item.status === "new"
                        ? "isNew"
                        : ""
                    }
                  >
                    <td>
                      <strong>
                        {item.full_name}
                      </strong>

                      <a
                        href={`mailto:${item.email}`}
                      >
                        {item.email}
                      </a>

                      {item.phone ? (
                        <a
                          href={`tel:${item.phone}`}
                        >
                          {item.phone}
                        </a>
                      ) : null}
                    </td>

                    <td>
                      {item.enquiry_type_label ? (
                        <span className="contactSubmissionType">
                          {
                            item.enquiry_type_label
                          }
                        </span>
                      ) : null}

                      <strong>
                        {item.subject ||
                          "General enquiry"}
                      </strong>

                      <p>
                        {item.message}
                      </p>
                    </td>

                    <td>
                      <time
                        dateTime={
                          item.created_at
                        }
                      >
                        {formatDate(
                          item.created_at,
                        )}
                      </time>
                    </td>

                    <td>
                      <select
                        value={
                          item.status
                        }
                        disabled={
                          busyId ===
                          item.id
                        }
                        onChange={(event) =>
                          setStatus(
                            item.id,
                            event.target
                              .value as ContactSubmissionStatus,
                          )
                        }
                        className={`is-${item.status}`}
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
                    </td>

                    <td>
                      <div className="contactSubmissionActions">
                        <Link
                          href={`/admin/website/contact/submissions/${item.id}`}
                        >
                          <Eye
                            size={15}
                          />
                          View
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            remove(
                              item.id,
                            )
                          }
                          disabled={
                            busyId ===
                            item.id
                          }
                        >
                          <Trash2
                            size={15}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}