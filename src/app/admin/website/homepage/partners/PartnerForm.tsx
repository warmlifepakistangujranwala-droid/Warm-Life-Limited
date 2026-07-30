"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  useState,
  useTransition,
} from "react";

import {
  createHomepagePartner,
  deleteHomepagePartner,
  updateHomepagePartner,
} from "@/lib/actions/homepage-partner";

import { createClient } from "@/lib/supabase/client";

import type {
  HomepagePartner,
} from "@/lib/types/homepage-partner";

type PartnerFormProps = {
  mode: "create" | "edit";
  sectionId: string;
  partner?: HomepagePartner | null;
};

type LogoSource = "upload" | "url";

const MAX_LOGO_SIZE = 10 * 1024 * 1024;

export default function PartnerForm({
  mode,
  sectionId,
  partner,
}: PartnerFormProps) {
  const router = useRouter();

  const supabase = createClient();

  const [isPending, startTransition] =
    useTransition();

  const [logoSource, setLogoSource] =
    useState<LogoSource>(
      partner?.logo_storage_path
        ? "upload"
        : "url",
    );

  const [logoFile, setLogoFile] =
    useState<File | null>(null);

  const [logoPreview, setLogoPreview] =
    useState(partner?.logo_url ?? "");

  const [message, setMessage] =
    useState("");

  const [form, setForm] = useState({
    name: partner?.name ?? "",

    logo_url: partner?.logo_url ?? "",

    logo_storage_path:
      partner?.logo_storage_path ?? null,

    website_url:
      partner?.website_url ?? "",

    open_in_new_tab:
      partner?.open_in_new_tab ?? true,

    display_order:
      partner?.display_order ?? 0,

    is_active:
      partner?.is_active ?? true,

    is_published:
      partner?.is_published ?? true,
  });

  function chooseLogo(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage(
        "Please select a valid image.",
      );
      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      setMessage(
        "Logo must be smaller than 10 MB.",
      );
      return;
    }

    setLogoFile(file);

    setLogoPreview(
      URL.createObjectURL(file),
    );

    setMessage("");
  }

  function generateStoragePath(
    file: File,
  ) {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "png";

    return `homepage/partners/${crypto.randomUUID()}.${extension}`;
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    setMessage("");

    if (!form.name.trim()) {
      setMessage(
        "Partner name is required.",
      );
      return;
    }

    if (
      !logoFile &&
      !form.logo_url.trim()
    ) {
      setMessage(
        "Please upload a logo or provide a logo URL.",
      );
      return;
    }

    startTransition(async () => {
      let uploadedPath:
        | string
        | null = null;

      try {
        let logoUrl =
          form.logo_url.trim();

        let logoStoragePath =
          form.logo_storage_path;

        if (logoFile) {
          uploadedPath =
            generateStoragePath(
              logoFile,
            );

          const { error } =
            await supabase.storage
              .from("website-media")
              .upload(
                uploadedPath,
                logoFile,
                {
                  cacheControl:
                    "3600",
                  upsert: false,
                  contentType:
                    logoFile.type,
                },
              );

          if (error)
            throw new Error(
              error.message,
            );

          const { data } =
            supabase.storage
              .from("website-media")
              .getPublicUrl(
                uploadedPath,
              );

          logoUrl =
            data.publicUrl;

          logoStoragePath =
            uploadedPath;
        }

        const payload = {
          section_id: sectionId,

          name:
            form.name.trim(),

          logo_url: logoUrl,

          logo_storage_path:
            logoStoragePath,

          website_url:
            form.website_url.trim() ||
            null,

          open_in_new_tab:
            form.open_in_new_tab,

          display_order:
            Number(
              form.display_order,
            ),

          is_active:
            form.is_active,

          is_published:
            form.is_published,
        };

        const result =
          mode === "edit" &&
          partner
            ? await updateHomepagePartner(
                partner.id,
                payload,
              )
            : await createHomepagePartner(
                payload,
              );

        if (!result.success) {
          throw new Error(
            result.errors.join(", "),
          );
        }

        if (
          mode === "edit" &&
          partner?.logo_storage_path &&
          uploadedPath &&
          partner.logo_storage_path !==
            uploadedPath
        ) {
          await supabase.storage
            .from("website-media")
            .remove([
              partner.logo_storage_path,
            ]);
        }

        router.push(
          "/admin/website/homepage/partners",
        );

        router.refresh();
      } catch (error) {
        if (uploadedPath) {
          await supabase.storage
            .from("website-media")
            .remove([
              uploadedPath,
            ]);
        }

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to save partner.",
        );
      }
    });
  }

  function handleDelete() {
    if (!partner) return;

    const confirmed =
      window.confirm(
        `Delete "${partner.name}"?`,
      );

    if (!confirmed) return;

    startTransition(async () => {
      const result =
        await deleteHomepagePartner(
          partner.id,
        );

      if (!result.success) {
        setMessage(
          result.errors.join(", "),
        );
        return;
      }

      router.push(
        "/admin/website/homepage/partners",
      );

      router.refresh();
    });
  }
    return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            {mode === "edit"
              ? "Edit Partner"
              : "Add Partner"}
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Upload a partner logo and control its
            order, link and visibility.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {mode === "edit" && partner ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-xl border border-red-300 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete
            </button>
          ) : null}

          <Link
            href="/admin/website/homepage/partners"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? "Saving..."
              : "Save Partner"}
          </button>
        </div>
      </header>

      {message ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Partner name
            </span>

            <input
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name: event.target.value,
                })
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Enter partner name"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setLogoSource("upload")
              }
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                logoSource === "upload"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Upload logo
            </button>

            <button
              type="button"
              onClick={() =>
                setLogoSource("url")
              }
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                logoSource === "url"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Direct URL
            </button>
          </div>

          {logoSource === "upload" ? (
            <label className="block rounded-xl border border-dashed border-slate-300 p-5">
              <span className="block text-sm font-semibold text-slate-900">
                Select partner logo
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                PNG, JPG, SVG or WebP. Maximum
                size 10 MB.
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={chooseLogo}
                className="mt-4 block w-full text-sm"
              />
            </label>
          ) : (
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                Logo URL
              </span>

              <input
                value={form.logo_url}
                onChange={(event) => {
                  setForm({
                    ...form,
                    logo_url:
                      event.target.value,
                    logo_storage_path:
                      null,
                  });

                  setLogoPreview(
                    event.target.value,
                  );

                  setLogoFile(null);
                }}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="https://example.com/logo.png"
              />
            </label>
          )}

          {logoPreview ? (
            <div className="relative grid min-h-44 place-items-center rounded-xl border border-slate-200 bg-slate-50 p-6">
              <Image
                src={logoPreview}
                alt="Partner logo preview"
                width={240}
                height={130}
                className="max-h-32 w-auto object-contain"
                unoptimized={logoPreview.startsWith(
                  "blob:",
                )}
              />
            </div>
          ) : (
            <div className="grid min-h-44 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Partner logo preview will appear here.
            </div>
          )}

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Partner website link
            </span>

            <input
              value={form.website_url}
              onChange={(event) =>
                setForm({
                  ...form,
                  website_url:
                    event.target.value,
                })
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="https://example.com"
            />

            <span className="mt-1 block text-xs text-slate-500">
              Optional. Leave empty if the logo
              should not be clickable.
            </span>
          </label>
        </section>

        <aside className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:self-start">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Display order
            </span>

            <input
              type="number"
              min={0}
              value={form.display_order}
              onChange={(event) =>
                setForm({
                  ...form,
                  display_order: Number(
                    event.target.value,
                  ),
                })
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />

            <span className="mt-1 block text-xs text-slate-500">
              Lower numbers appear first.
            </span>
          </label>

          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
            <span>
              <span className="block text-sm font-semibold text-slate-800">
                Open link in new tab
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                Applies when a website link is
                provided.
              </span>
            </span>

            <input
              type="checkbox"
              checked={
                form.open_in_new_tab
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  open_in_new_tab:
                    event.target.checked,
                })
              }
              className="h-5 w-5"
            />
          </label>

          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
            <span>
              <span className="block text-sm font-semibold text-slate-800">
                Active
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                Disable this partner without
                deleting it.
              </span>
            </span>

            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                setForm({
                  ...form,
                  is_active:
                    event.target.checked,
                })
              }
              className="h-5 w-5"
            />
          </label>

          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
            <span>
              <span className="block text-sm font-semibold text-slate-800">
                Published
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                Show this partner on the live
                homepage.
              </span>
            </span>

            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(event) =>
                setForm({
                  ...form,
                  is_published:
                    event.target.checked,
                })
              }
              className="h-5 w-5"
            />
          </label>
        </aside>
      </div>
    </form>
  );
}