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
  deleteFooterSocialLink,
  toggleFooterSocialLinkActive,
  toggleFooterSocialLinkPublished,
  updateFooterSocialLink,
} from "@/lib/actions/site-footer";

import type {
  SiteFooterSocialLink,
} from "@/lib/types/site-footer";

type FooterSocialListProps = {
  links: SiteFooterSocialLink[];
};

type EditingState = {
  platform: string;
  label: string;
  url: string;
  icon_name: string;
  display_order: number;
  open_in_new_tab: boolean;
  is_active: boolean;
  is_published: boolean;
};

const iconOptions = [
  ["Facebook", "Facebook"],
  ["Instagram", "Instagram"],
  ["Linkedin", "LinkedIn"],
  ["Youtube", "YouTube"],
  ["Twitter", "X / Twitter"],
  ["Tiktok", "TikTok"],
  ["Globe", "Website"],
  ["Mail", "Email"],
] as const;

export default function FooterSocialList({
  links,
}: FooterSocialListProps) {
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

  const sortedLinks = [...links].sort(
    (first, second) =>
      first.display_order -
      second.display_order,
  );

  function startEditing(
    link: SiteFooterSocialLink,
  ): void {
    setEditingId(link.id);

    setEditingForm({
      platform: link.platform,
      label: link.label,
      url: link.url,
      icon_name: link.icon_name,
      display_order:
        link.display_order,
      open_in_new_tab:
        link.open_in_new_tab,
      is_active:
        link.is_active,
      is_published:
        link.is_published,
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

  function saveLink(
    linkId: string,
  ): void {
    if (!editingForm) {
      return;
    }

    if (!editingForm.platform.trim()) {
      setMessage(
        "Social platform is required.",
      );

      setIsSuccess(false);

      return;
    }

    if (!editingForm.label.trim()) {
      setMessage(
        "Social link label is required.",
      );

      setIsSuccess(false);

      return;
    }

    if (!editingForm.url.trim()) {
      setMessage(
        "Social link URL is required.",
      );

      setIsSuccess(false);

      return;
    }

    if (!editingForm.icon_name.trim()) {
      setMessage(
        "Social icon is required.",
      );

      setIsSuccess(false);

      return;
    }

    setMessage("");
    setIsSuccess(false);

    startTransition(async () => {
      const result =
        await updateFooterSocialLink(
          linkId,
          {
            platform:
              editingForm.platform.trim(),

            label:
              editingForm.label.trim(),

            url:
              editingForm.url.trim(),

            icon_name:
              editingForm.icon_name.trim(),

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
        "Social link updated successfully.",
      );

      setIsSuccess(true);

      setEditingId(null);
      setEditingForm(null);

      router.refresh();
    });
  }

  function handleDelete(
    link: SiteFooterSocialLink,
  ): void {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${link.label}"?`,
      );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setIsSuccess(false);

    startTransition(async () => {
      const result =
        await deleteFooterSocialLink(
          link.id,
        );

      if (!result.success) {
        setMessage(
          result.errors.join(", "),
        );

        setIsSuccess(false);

        return;
      }

      setMessage(
        "Social link deleted successfully.",
      );

      setIsSuccess(true);

      router.refresh();
    });
  }

  function handleToggleActive(
    link: SiteFooterSocialLink,
  ): void {
    setMessage("");
    setIsSuccess(false);

    startTransition(async () => {
      const result =
        await toggleFooterSocialLinkActive(
          link.id,
          !link.is_active,
        );

      if (!result.success) {
        setMessage(
          result.errors.join(", "),
        );

        setIsSuccess(false);

        return;
      }

      setMessage(
        `Social link ${
          link.is_active
            ? "disabled"
            : "enabled"
        } successfully.`,
      );

      setIsSuccess(true);

      router.refresh();
    });
  }

  function handleTogglePublished(
    link: SiteFooterSocialLink,
  ): void {
    setMessage("");
    setIsSuccess(false);

    startTransition(async () => {
      const result =
        await toggleFooterSocialLinkPublished(
          link.id,
          !link.is_published,
        );

      if (!result.success) {
        setMessage(
          result.errors.join(", "),
        );

        setIsSuccess(false);

        return;
      }

      setMessage(
        `Social link ${
          link.is_published
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
            Social Links
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Manage footer social platforms,
            URLs, icons, display order
            and visibility.
          </p>
        </div>

        <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
          {links.length}{" "}
          {links.length === 1
            ? "social link"
            : "social links"}
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

      {links.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="font-bold text-slate-900">
            No social links found
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Add your first social link
            using the form above.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {sortedLinks.map((link) => {
            const isEditing =
              editingId === link.id &&
              editingForm !== null;

            return (
              <article
                key={link.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              >
                {isEditing ? (
                  <div className="space-y-5 p-5">
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                      <label className="block">
                        <span className="text-sm font-semibold text-slate-900">
                          Platform
                        </span>

                        <input
                          value={
                            editingForm.platform
                          }
                          onChange={(event) =>
                            setEditingForm(
                              (current) =>
                                current
                                  ? {
                                      ...current,
                                      platform:
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
                          Label
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

                      <label className="block md:col-span-2 xl:col-span-2">
                        <span className="text-sm font-semibold text-slate-900">
                          Social URL
                        </span>

                        <input
                          value={
                            editingForm.url
                          }
                          onChange={(event) =>
                            setEditingForm(
                              (current) =>
                                current
                                  ? {
                                      ...current,
                                      url:
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

                      <label className="block md:col-span-2 xl:col-span-2">
                        <span className="text-sm font-semibold text-slate-900">
                          Icon
                        </span>

                        <select
                          value={
                            editingForm.icon_name
                          }
                          onChange={(event) =>
                            setEditingForm(
                              (current) =>
                                current
                                  ? {
                                      ...current,
                                      icon_name:
                                        event.target
                                          .value,
                                    }
                                  : current,
                            )
                          }
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                        >
                          {iconOptions.map(
                            ([value, label]) => (
                              <option
                                key={value}
                                value={value}
                              >
                                {label}
                              </option>
                            ),
                          )}
                        </select>
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
                          saveLink(link.id)
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
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-sm font-bold uppercase text-emerald-800">
                        {link.platform
                          .slice(0, 2)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-950">
                            {link.label}
                          </h3>

                          <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-bold text-violet-700">
                            {link.icon_name}
                          </span>

                          {link.is_active ? (
                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold text-green-700">
                              Active
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                              Inactive
                            </span>
                          )}

                          {link.is_published ? (
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
                          {link.url}
                        </p>

                        <p className="mt-2 text-xs font-medium text-emerald-700">
                          Order:{" "}
                          {link.display_order}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          startEditing(link)
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
                            link,
                          )
                        }
                        disabled={isPending}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                      >
                        {link.is_active ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}

                        {link.is_active
                          ? "Disable"
                          : "Enable"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleTogglePublished(
                            link,
                          )
                        }
                        disabled={isPending}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                      >
                        {link.is_published ? (
                          <EyeOff size={15} />
                        ) : (
                          <Check size={15} />
                        )}

                        {link.is_published
                          ? "Unpublish"
                          : "Publish"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(link)
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