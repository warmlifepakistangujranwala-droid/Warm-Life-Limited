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
  createHomepageLocalAuthority,
  deleteHomepageLocalAuthority,
  updateHomepageLocalAuthority,
} from "@/lib/actions/homepage-local-authority";

import { createClient } from "@/lib/supabase/client";

import type {
  HomepageLocalAuthoritiesSection,
  HomepageLocalAuthority,
} from "@/lib/types/homepage-local-authority";

type LocalAuthorityFormProps = {
  mode: "create" | "edit";
  section: HomepageLocalAuthoritiesSection;
  authority?: HomepageLocalAuthority | null;
};

type LogoSource = "upload" | "url";

const MAX_LOGO_SIZE = 10 * 1024 * 1024;

export default function LocalAuthorityForm({
  mode,
  section,
  authority,
}: LocalAuthorityFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isPending, startTransition] =
    useTransition();

  const [logoSource, setLogoSource] =
    useState<LogoSource>(
      authority?.logo_storage_path
        ? "upload"
        : "url",
    );

  const [logoFile, setLogoFile] =
    useState<File | null>(null);

  const [logoPreview, setLogoPreview] =
    useState(authority?.logo_url ?? "");

  const [message, setMessage] =
    useState("");

  const [form, setForm] = useState({
    name: authority?.name ?? "",

    logo_url:
      authority?.logo_url ?? "",

    logo_storage_path:
      authority?.logo_storage_path ??
      null,

    website_url:
      authority?.website_url ?? "",

    open_in_new_tab:
      authority?.open_in_new_tab ??
      true,

    display_order:
      authority?.display_order ?? 0,

    is_active:
      authority?.is_active ?? true,

    is_published:
      authority?.is_published ?? true,
  });

  function chooseLogo(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage(
        "Please select a valid image file.",
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      setMessage(
        "Logo must be smaller than 10 MB.",
      );

      event.target.value = "";
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
  ): string {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "png";

    return `homepage/local-authorities/${crypto.randomUUID()}.${extension}`;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");

    if (!form.name.trim()) {
      setMessage(
        "Local authority name is required.",
      );

      return;
    }

    if (
      logoSource === "upload" &&
      !logoFile &&
      !form.logo_url.trim()
    ) {
      setMessage(
        "Please upload a logo.",
      );

      return;
    }

    if (
      logoSource === "url" &&
      !form.logo_url.trim()
    ) {
      setMessage(
        "Please provide a logo URL.",
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

        if (
          logoSource === "upload" &&
          logoFile
        ) {
          uploadedPath =
            generateStoragePath(
              logoFile,
            );

          const { error: uploadError } =
            await supabase.storage
              .from("website-media")
              .upload(
                uploadedPath,
                logoFile,
                {
                  cacheControl: "3600",
                  upsert: false,
                  contentType:
                    logoFile.type,
                },
              );

          if (uploadError) {
            throw new Error(
              uploadError.message,
            );
          }

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

        if (logoSource === "url") {
          logoStoragePath = null;
        }

        const payload = {
          section_id: section.id,

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
          authority
            ? await updateHomepageLocalAuthority(
                authority.id,
                payload,
              )
            : await createHomepageLocalAuthority(
                payload,
              );

        if (!result.success) {
          throw new Error(
            result.errors.join(", "),
          );
        }

        if (
          mode === "edit" &&
          authority?.logo_storage_path &&
          (
            uploadedPath ||
            logoSource === "url"
          ) &&
          authority.logo_storage_path !==
            uploadedPath
        ) {
          const {
            error: removeError,
          } = await supabase.storage
            .from("website-media")
            .remove([
              authority.logo_storage_path,
            ]);

          if (removeError) {
            console.error(
              "Old local authority logo could not be removed:",
              removeError.message,
            );
          }
        }

        router.push(
          "/admin/website/homepage/local-authorities",
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
            : "Unable to save local authority.",
        );
      }
    });
  }

  function handleDelete() {
    if (!authority) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${authority.name}"? This action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result =
        await deleteHomepageLocalAuthority(
          authority.id,
        );

      if (!result.success) {
        setMessage(
          result.errors.join(", "),
        );

        return;
      }

      router.push(
        "/admin/website/homepage/local-authorities",
      );

      router.refresh();
    });
  }

  function selectUploadSource() {
    setLogoSource("upload");
    setMessage("");
  }

  function selectUrlSource() {
    setLogoSource("url");
    setLogoFile(null);
    setMessage("");

    setLogoPreview(
      form.logo_url,
    );
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
              ? "Edit Local Authority"
              : "Add Local Authority"}
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Upload a local authority logo
            or enter a direct image URL.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {mode === "edit" &&
          authority ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-xl border border-red-300 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending
                ? "Please wait..."
                : "Delete"}
            </button>
          ) : null}

          <Link
            href="/admin/website/homepage/local-authorities"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
              : mode === "edit"
                ? "Save Changes"
                : "Add Local Authority"}
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
              Local authority name
            </span>

            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name:
                    event.target.value,
                })
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              placeholder="Enter local authority name"
            />
          </label>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-900">
              Logo source
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={
                  selectUploadSource
                }
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  logoSource ===
                  "upload"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Upload from Computer
              </button>

              <button
                type="button"
                onClick={
                  selectUrlSource
                }
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  logoSource === "url"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Use Direct URL
              </button>
            </div>
          </div>

          {logoSource === "upload" ? (
            <label className="block rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <span className="block text-sm font-semibold text-slate-900">
                Select local authority
                logo
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                PNG, JPG, SVG or WebP.
                Maximum file size 10 MB.
              </span>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={chooseLogo}
                className="mt-4 block w-full cursor-pointer text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-800"
              />

              {logoFile ? (
                <p className="mt-3 text-xs font-medium text-emerald-700">
                  Selected:{" "}
                  {logoFile.name}
                </p>
              ) : authority?.logo_storage_path ? (
                <p className="mt-3 text-xs text-slate-500">
                  Current uploaded logo
                  will remain unless you
                  select another file.
                </p>
              ) : null}
            </label>
          ) : (
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                Logo URL
              </span>

              <input
                type="url"
                value={form.logo_url}
                onChange={(event) => {
                  const value =
                    event.target.value;

                  setForm({
                    ...form,
                    logo_url: value,
                    logo_storage_path:
                      null,
                  });

                  setLogoPreview(value);
                  setLogoFile(null);
                }}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                placeholder="https://example.com/logo.png"
              />

              <span className="mt-1 block text-xs text-slate-500">
                Enter the complete public
                image URL, including
                https://
              </span>
            </label>
          )}

          {logoPreview ? (
            <div className="relative grid min-h-52 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-6">
              <Image
                src={logoPreview}
                alt={
                  form.name
                    ? `${form.name} logo preview`
                    : "Local authority logo preview"
                }
                width={280}
                height={150}
                className="max-h-36 max-w-full object-contain"
                unoptimized={
                  logoPreview.startsWith(
                    "blob:",
                  ) ||
                  logoPreview.endsWith(
                    ".svg",
                  )
                }
              />
            </div>
          ) : (
            <div className="grid min-h-52 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Upload a logo or enter a
              direct URL to see the
              preview.
            </div>
          )}

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Local authority website
              link
            </span>

            <input
              type="url"
              value={form.website_url}
              onChange={(event) =>
                setForm({
                  ...form,
                  website_url:
                    event.target.value,
                })
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              placeholder="https://example.gov.uk"
            />

            <span className="mt-1 block text-xs text-slate-500">
              Optional. Leave empty if
              the logo should not be
              clickable.
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
              step={1}
              value={
                form.display_order
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  display_order:
                    Number(
                      event.target.value,
                    ),
                })
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
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
                Applies when a website
                link is provided.
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
              className="h-5 w-5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
            />
          </label>

          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
            <span>
              <span className="block text-sm font-semibold text-slate-800">
                Active
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                Disable this authority
                without deleting it.
              </span>
            </span>

            <input
              type="checkbox"
              checked={
                form.is_active
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  is_active:
                    event.target.checked,
                })
              }
              className="h-5 w-5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
            />
          </label>

          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
            <span>
              <span className="block text-sm font-semibold text-slate-800">
                Published
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                Show this authority on
                the live homepage.
              </span>
            </span>

            <input
              type="checkbox"
              checked={
                form.is_published
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  is_published:
                    event.target.checked,
                })
              }
              className="h-5 w-5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
            />
          </label>
        </aside>
      </div>
    </form>
  );
}