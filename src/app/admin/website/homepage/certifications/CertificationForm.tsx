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
  createHomepageCertification,
  deleteHomepageCertification,
  updateHomepageCertification,
} from "@/lib/actions/homepage-certification";
import { createClient } from "@/lib/supabase/client";
import type { HomepageCertification } from "@/lib/types/homepage-certification";

type CertificationFormProps = {
  mode: "create" | "edit";
  sectionId: string;
  certification?: HomepageCertification | null;
};

type LogoSource = "upload" | "url";

const MAX_LOGO_SIZE = 10 * 1024 * 1024;

export default function CertificationForm({
  mode,
  sectionId,
  certification,
}: CertificationFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const [logoSource, setLogoSource] =
    useState<LogoSource>(
      certification?.logo_storage_path ? "upload" : "url",
    );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(
    certification?.logo_url ?? "",
  );
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: certification?.name ?? "",
    logo_url: certification?.logo_url ?? "",
    logo_storage_path:
      certification?.logo_storage_path ?? null,
    website_url: certification?.website_url ?? "",
    open_in_new_tab:
      certification?.open_in_new_tab ?? true,
    display_order: certification?.display_order ?? 0,
    is_active: certification?.is_active ?? true,
    is_published: certification?.is_published ?? true,
  });

  function chooseLogo(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      setMessage("Logo must be smaller than 10 MB.");
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setMessage("");
  }

  function storagePath(file: File): string {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "png";

    return `homepage/certifications/${crypto.randomUUID()}.${extension}`;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setMessage("");

    if (!form.name.trim()) {
      setMessage("Certificate name is required.");
      return;
    }

    if (!logoFile && !form.logo_url.trim()) {
      setMessage(
        "Upload a logo or enter a direct logo URL.",
      );
      return;
    }

    startTransition(async () => {
      let uploadedPath: string | null = null;

      try {
        let logoUrl = form.logo_url.trim();
        let logoStoragePath = form.logo_storage_path;

        if (logoFile) {
          uploadedPath = storagePath(logoFile);

          const { error } = await supabase.storage
            .from("website-media")
            .upload(uploadedPath, logoFile, {
              cacheControl: "3600",
              upsert: false,
              contentType: logoFile.type,
            });

          if (error) {
            throw new Error(error.message);
          }

          const { data } = supabase.storage
            .from("website-media")
            .getPublicUrl(uploadedPath);

          logoUrl = data.publicUrl;
          logoStoragePath = uploadedPath;
        }

        const payload = {
          section_id: sectionId,
          name: form.name.trim(),
          logo_url: logoUrl,
          logo_storage_path: logoStoragePath,
          website_url:
            form.website_url.trim() || null,
          open_in_new_tab: form.open_in_new_tab,
          display_order: Number(form.display_order),
          is_active: form.is_active,
          is_published: form.is_published,
        };

        const result =
          mode === "edit" && certification
            ? await updateHomepageCertification(
                certification.id,
                payload,
              )
            : await createHomepageCertification(payload);

        if (!result.success) {
          throw new Error(result.errors.join(", "));
        }

        if (
          mode === "edit" &&
          certification?.logo_storage_path &&
          uploadedPath &&
          certification.logo_storage_path !== uploadedPath
        ) {
          await supabase.storage
            .from("website-media")
            .remove([certification.logo_storage_path]);
        }

        router.push(
          "/admin/website/homepage/certifications",
        );
        router.refresh();
      } catch (error) {
        if (uploadedPath) {
          await supabase.storage
            .from("website-media")
            .remove([uploadedPath]);
        }

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to save certificate.",
        );
      }
    });
  }

  function handleDelete(): void {
    if (!certification) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${certification.name}"? This will also remove its uploaded logo.`,
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    startTransition(async () => {
      const result =
        await deleteHomepageCertification(
          certification.id,
        );

      if (!result.success) {
        setMessage(result.errors.join(", "));
        return;
      }

      router.push(
        "/admin/website/homepage/certifications",
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
              ? "Edit Certificate"
              : "Add Certificate"}
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Upload a certification logo and control its
            order and visibility.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {mode === "edit" && certification ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-xl border border-red-300 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>
          ) : null}

          <Link
            href="/admin/website/homepage/certifications"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Cancel
          </Link>

          <button
            disabled={isPending}
            className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isPending
              ? "Saving..."
              : "Save Certificate"}
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
              Certificate name
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
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setLogoSource("upload")}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                logoSource === "upload"
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-slate-300"
              }`}
            >
              Upload logo
            </button>

            <button
              type="button"
              onClick={() => setLogoSource("url")}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                logoSource === "url"
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-slate-300"
              }`}
            >
              Direct URL
            </button>
          </div>

          {logoSource === "upload" ? (
            <label className="block rounded-xl border border-dashed border-slate-300 p-5">
              <span className="block text-sm font-semibold text-slate-900">
                Select logo image
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                PNG, JPG, SVG or WebP. Maximum 10 MB.
              </span>

              <input
                className="mt-4 block w-full text-sm"
                type="file"
                accept="image/*"
                onChange={chooseLogo}
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
                    logo_url: event.target.value,
                    logo_storage_path: null,
                  });
                  setLogoPreview(event.target.value);
                  setLogoFile(null);
                }}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="https://.../logo.png"
              />
            </label>
          )}

          {logoPreview ? (
            <div className="relative grid min-h-44 place-items-center rounded-xl border border-slate-200 bg-slate-50 p-6">
              <Image
                src={logoPreview}
                alt="Certificate logo preview"
                width={240}
                height={130}
                className="max-h-32 w-auto object-contain"
                unoptimized={logoPreview.startsWith("blob:")}
              />
            </div>
          ) : null}

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Website link (optional)
            </span>

            <input
              value={form.website_url}
              onChange={(event) =>
                setForm({
                  ...form,
                  website_url: event.target.value,
                })
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="https://..."
            />
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
          </label>

          {[
            "open_in_new_tab",
            "is_active",
            "is_published",
          ].map((field) => (
            <label
              key={field}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
            >
              <span className="text-sm font-semibold text-slate-800">
                {field === "open_in_new_tab"
                  ? "Open link in new tab"
                  : field === "is_active"
                    ? "Active"
                    : "Published"}
              </span>

              <input
                type="checkbox"
                checked={
                  form[
                    field as keyof typeof form
                  ] as boolean
                }
                onChange={(event) =>
                  setForm({
                    ...form,
                    [field]: event.target.checked,
                  })
                }
              />
            </label>
          ))}
        </aside>
      </div>
    </form>
  );
}
