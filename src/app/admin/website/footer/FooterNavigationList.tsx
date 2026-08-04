"use client";

import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useState,
  useTransition,
} from "react";

import {
  deleteFooterNavigationItem,
  toggleFooterNavigationItemActive,
  toggleFooterNavigationItemPublished,
  updateFooterNavigationItem,
} from "@/lib/actions/site-footer";

import type {
  FooterNavigationSection,
  SiteFooterNavigationItem,
} from "@/lib/types/site-footer";

type FooterNavigationListProps = {
  items: SiteFooterNavigationItem[];
};

type EditingState = {
  section_name: FooterNavigationSection;
  label: string;
  href: string;
  display_order: number;
  open_in_new_tab: boolean;
  is_active: boolean;
  is_published: boolean;
};

const sectionLabels: Record<
  FooterNavigationSection,
  string
> = {
  quick_links: "Quick Links",
  legal: "Legal",
  resources: "Resources",
  support: "Support",
};

export default function FooterNavigationList({
  items,
}: FooterNavigationListProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editingForm, setEditingForm] =
    useState<EditingState | null>(null);

  const [message, setMessage] =
    useState("");

  const [isSuccess, setIsSuccess] =
    useState(false);

  const sortedItems = [...items].sort(
    (first, second) => {
      if (
        first.section_name !==
        second.section_name
      ) {
        return first.section_name.localeCompare(
          second.section_name,
        );
      }

      return (
        first.display_order -
        second.display_order
      );
    },
  );

  function startEditing(
    item: SiteFooterNavigationItem,
  ): void {
    setEditingId(item.id);

    setEditingForm({
      section_name:
        item.section_name,

      label:
        item.label,

      href:
        item.href,

      display_order:
        item.display_order,

      open_in_new_tab:
        item.open_in_new_tab,

      is_active:
        item.is_active,

      is_published:
        item.is_published,
    });

    setMessage("");
    setIsSuccess(false);
  }

  function cancelEditing(): void {
    setEditingId(null);
    setEditingForm(null);
    setMessage("");
    setIsSuccess(false);
  }

  function saveItem(
    itemId: string,
  ): void {
    if (!editingForm) {
      return;
    }

    if (!editingForm.label.trim()) {
      setMessage(
        "Footer link label is required.",
      );

      setIsSuccess(false);

      return;
    }

    if (!editingForm.href.trim()) {
      setMessage(
        "Footer link URL is required.",
      );

      setIsSuccess(false);

      return;
    }

    setMessage("");
    setIsSuccess(false);

    startTransition(async () => {
      const result =
        await updateFooterNavigationItem(
          itemId,
          {
            section_name:
              editingForm.section_name,

            label:
              editingForm.label.trim(),

            href:
              editingForm.href.trim(),

            display_order:
              Number(
                editingForm.display_order,
              ),

            open_in_new_tab:
              editingForm.open_in_new_tab,

            is_active:
              editingForm.is_active,

            is_published:
              editingForm.is_published,
          },
        );

      if (!result.success) {
        setMessage(
          result.errors.join(", "),
        );

        setIsSuccess(false);

        return;
      }

      setMessage(
        "Footer link updated successfully.",
      );

      setIsSuccess(true);

      setEditingId(null);
      setEditingForm(null);

      router.refresh();
    });
  }

  function handleDelete(
    item: SiteFooterNavigationItem,
  ): void {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${item.label}"?`,
      );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setIsSuccess(false);

    startTransition(async () => {
      const result =
        await deleteFooterNavigationItem(
          item.id,
        );

      if (!result.success) {
        setMessage(
          result.errors.join(", "),
        );

        setIsSuccess(false);

        return;
      }

      setMessage(
        "Footer link deleted successfully.",
      );

      setIsSuccess(true);

      router.refresh();
    });
  }

  function handleToggleActive(
    item: SiteFooterNavigationItem,
  ): void {
    setMessage("");
    setIsSuccess(false);

    startTransition(async () => {
      const result =
        await toggleFooterNavigationItemActive(
          item.id,
          !item.is_active,
        );

      if (!result.success) {
        setMessage(
          result.errors.join(", "),
        );

        setIsSuccess(false);

        return;
      }

      setMessage(
        `Footer link ${
          item.is_active
            ? "disabled"
            : "enabled"
        } successfully.`,
      );

      setIsSuccess(true);

      router.refresh();
    });
  }

  function handleTogglePublished(
    item: SiteFooterNavigationItem,
  ): void {
    setMessage("");
    setIsSuccess(false);

    startTransition(async () => {
      const result =
        await toggleFooterNavigationItemPublished(
          item.id,
          !item.is_published,
        );

      if (!result.success) {
        setMessage(
          result.errors.join(", "),
        );

        setIsSuccess(false);

        return;
      }

      setMessage(
        `Footer link ${
          item.is_published
            ? "unpublished"
            : "published"
        } successfully.`,
      );

      setIsSuccess(true);

      router.refresh();
    });
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Footer Navigation Links
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Manage quick links, legal links,
            resources and support links.
          </p>
        </div>

        <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
          {items.length}{" "}
          {items.length === 1
            ? "link"
            : "links"}
        </span>
      </div>

      {message ? (
        <div
          className={`mt-5 rounded-xl border px-5 py-4 text-sm font-medium ${
            isSuccess
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="font-bold text-slate-900">
            No footer links found
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Add the first footer link using
            the form above.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {sortedItems.map((item) => {
            const isEditing =
              editingId === item.id &&
              editingForm !== null;

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              >
                {isEditing ? (
                  <div className="space-y-5 p-5">
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                      <label className="block">
                        <span className="text-sm font-semibold text-slate-900">
                          Footer Section
                        </span>

                        <select
                          value={
                            editingForm.section_name
                          }
                          onChange={(event) =>
                            setEditingForm(
                              (current) =>
                                current
                                  ? {
                                      ...current,
                                      section_name:
                                        event.target
                                          .value as FooterNavigationSection,
                                    }
                                  : current,
                            )
                          }
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                        >
                          <option value="quick_links">
                            Quick Links
                          </option>

                          <option value="legal">
                            Legal
                          </option>

                          <option value="resources">
                            Resources
                          </option>

                          <option value="support">
                            Support
                          </option>
                        </select>
                      </label>

                      <label className="block">
                        <span className="text-sm font-semibold text-slate-900">
                          Link Label
                        </span>

                        <input
                          value={
                            editingForm.label
                          }
                          onChange={(event) =>
                            setEditingForm(
                              (current) =>
                                current
                                  ? {
                                      ...current,
                                      label:
                                        event.target
                                          .value,
                                    }
                                  : current,
                            )
                          }
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                        />
                      </label>

                      <label className="block">
                        <span className="text-sm font-semibold text-slate-900">
                          Link URL
                        </span>

                        <input
                          value={
                            editingForm.href
                          }
                          onChange={(event) =>
                            setEditingForm(
                              (current) =>
                                current
                                  ? {
                                      ...current,
                                      href:
                                        event.target
                                          .value,
                                    }
                                  : current,
                            )
                          }
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                        />
                      </label>

                      <label className="block">
                        <span className="text-sm font-semibold text-slate-900">
                          Display Order
                        </span>

                        <input
                          type="number"
                          min={0}
                          max={999}
                          value={
                            editingForm.display_order
                          }
                          onChange={(event) =>
                            setEditingForm(
                              (current) =>
                                current
                                  ? {
                                      ...current,
                                      display_order:
                                        Number(
                                          event.target
                                            .value,
                                        ),
                                    }
                                  : current,
                            )
                          }
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <EditToggle
                        title="Open in New Tab"
                        checked={
                          editingForm.open_in_new_tab
                        }
                        onChange={(checked) =>
                          setEditingForm(
                            (current) =>
                              current
                                ? {
                                    ...current,
                                    open_in_new_tab:
                                      checked,
                                  }
                                : current,
                          )
                        }
                      />

                      <EditToggle
                        title="Active"
                        checked={
                          editingForm.is_active
                        }
                        onChange={(checked) =>
                          setEditingForm(
                            (current) =>
                              current
                                ? {
                                    ...current,
                                    is_active:
                                      checked,
                                  }
                                : current,
                          )
                        }
                      />

                      <EditToggle
                        title="Published"
                        checked={
                          editingForm.is_published
                        }
                        onChange={(checked) =>
                          setEditingForm(
                            (current) =>
                              current
                                ? {
                                    ...current,
                                    is_published:
                                      checked,
                                  }
                                : current,
                          )
                        }
                      />
                    </div>

                    <div className="flex flex-wrap justify-end gap-3">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        disabled={isPending}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                      >
                        <X size={16} />
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          saveItem(item.id)
                        }
                        disabled={isPending}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
                      >
                        {isPending ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Save size={16} />
                        )}

                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5 p-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-800">
                        {item.display_order}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-950">
                            {item.label}
                          </h3>

                          <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-bold text-violet-700">
                            {
                              sectionLabels[
                                item.section_name
                              ]
                            }
                          </span>

                          {item.is_active ? (
                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold text-green-700">
                              Active
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                              Inactive
                            </span>
                          )}

                          {item.is_published ? (
                            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                              Published
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                              Draft
                            </span>
                          )}
                        </div>

                        <p className="mt-2 break-all text-sm text-slate-500">
                          {item.href}
                        </p>

                        {item.open_in_new_tab ? (
                          <p className="mt-2 text-xs font-medium text-slate-500">
                            Opens in a new tab
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          startEditing(item)
                        }
                        disabled={isPending}
                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:opacity-50"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleActive(
                            item,
                          )
                        }
                        disabled={isPending}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                      >
                        {item.is_active ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}

                        {item.is_active
                          ? "Disable"
                          : "Enable"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleTogglePublished(
                            item,
                          )
                        }
                        disabled={isPending}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                      >
                        {item.is_published ? (
                          <EyeOff size={15} />
                        ) : (
                          <Check size={15} />
                        )}

                        {item.is_published
                          ? "Unpublish"
                          : "Publish"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(item)
                        }
                        disabled={isPending}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-3.5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function EditToggle({
  title,
  checked,
  onChange,
}: {
  title: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <span className="text-sm font-semibold text-slate-900">
        {title}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-5 w-5 shrink-0"
      />
    </label>
  );
}