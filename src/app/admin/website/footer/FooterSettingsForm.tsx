"use client";

import Image from "next/image";
import {
  type ChangeEvent,
  type FormEvent,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  ImageIcon,
  Loader2,
  Save,
  Upload,
  X,
} from "lucide-react";

import { updateSiteFooterSettings } from "@/lib/actions/site-footer";
import { createClient } from "@/lib/supabase/client";

import type {
  FooterBackgroundType,
  FooterCopyrightAlignment,
  SiteFooterSettings,
} from "@/lib/types/site-footer";

type FooterSettingsFormProps = {
  settings: SiteFooterSettings;
};

type ImageSource = "upload" | "url";

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

export default function FooterSettingsForm({
  settings,
}: FooterSettingsFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isPending, startTransition] =
    useTransition();

  const [message, setMessage] =
    useState("");

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [logoSource, setLogoSource] =
    useState<ImageSource>(
      settings.logo_storage_path
        ? "upload"
        : "url",
    );

  const [
    backgroundImageSource,
    setBackgroundImageSource,
  ] = useState<ImageSource>(
    settings.background_image_storage_path
      ? "upload"
      : "url",
  );

  const [logoFile, setLogoFile] =
    useState<File | null>(null);

  const [
    backgroundImageFile,
    setBackgroundImageFile,
  ] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] =
    useState(settings.logo_url ?? "");

  const [
    backgroundImagePreview,
    setBackgroundImagePreview,
  ] = useState(
    settings.background_image_url ?? "",
  );

  const [form, setForm] = useState({
    internal_name:
      settings.internal_name,

    show_logo:
      settings.show_logo,

    logo_url:
      settings.logo_url ?? "",

    logo_storage_path:
      settings.logo_storage_path,

    logo_alt:
      settings.logo_alt,

    logo_width:
      settings.logo_width,

    logo_height:
      settings.logo_height,

    company_name:
      settings.company_name,

    show_description:
      settings.show_description,

    company_description:
      settings.company_description,

    background_type:
      settings.background_type,

    background_color:
      settings.background_color,

    gradient_start_color:
      settings.gradient_start_color,

    gradient_end_color:
      settings.gradient_end_color,

    gradient_direction:
      settings.gradient_direction,

    background_image_url:
      settings.background_image_url ?? "",

    background_image_storage_path:
      settings.background_image_storage_path,

    background_image_alt:
      settings.background_image_alt,

    background_overlay_color:
      settings.background_overlay_color,

    heading_color:
      settings.heading_color,

    heading_font_size:
      settings.heading_font_size,

    heading_font_weight:
      settings.heading_font_weight,

    heading_letter_spacing:
      settings.heading_letter_spacing,
      heading_bottom_spacing:
  settings.heading_bottom_spacing,

    text_color:
      settings.text_color,

    text_font_size:
      settings.text_font_size,

    text_font_weight:
      settings.text_font_weight,

    text_line_height:
      settings.text_line_height,

    link_color:
      settings.link_color,

    link_hover_color:
      settings.link_hover_color,

    link_font_size:
      settings.link_font_size,

    link_font_weight:
      settings.link_font_weight,
      links_spacing:
  settings.links_spacing,

    show_quick_links:
      settings.show_quick_links,

    quick_links_heading:
      settings.quick_links_heading,

    show_services:
      settings.show_services,

    services_heading:
      settings.services_heading,

    services_limit:
      settings.services_limit,

    services_show_view_all:
      settings.services_show_view_all,

    services_view_all_text:
      settings.services_view_all_text,

    services_view_all_link:
      settings.services_view_all_link,

    show_legal_links:
      settings.show_legal_links,

    legal_links_heading:
      settings.legal_links_heading,

    show_contact:
      settings.show_contact,

    contact_heading:
      settings.contact_heading,

    show_social_icons:
      settings.show_social_icons,

    social_heading:
      settings.social_heading,

    social_icon_size:
      settings.social_icon_size,

    social_icon_color:
      settings.social_icon_color,

    social_icon_hover_color:
      settings.social_icon_hover_color,

    social_icon_background_color:
      settings.social_icon_background_color,

    social_icon_hover_background_color:
      settings.social_icon_hover_background_color,

    social_icon_radius:
      settings.social_icon_radius,

    content_max_width:
      settings.content_max_width,

    column_count:
      settings.column_count,

    column_gap:
      settings.column_gap,

    row_gap:
      settings.row_gap,

    padding_top:
      settings.padding_top,

    padding_bottom:
      settings.padding_bottom,

    padding_left:
      settings.padding_left,

    padding_right:
      settings.padding_right,

    show_top_border:
      settings.show_top_border,

    top_border_color:
      settings.top_border_color,

    top_border_width:
      settings.top_border_width,

    divider_color:
      settings.divider_color,

    show_copyright:
      settings.show_copyright,

    copyright_text:
      settings.copyright_text,

    copyright_color:
      settings.copyright_color,

    copyright_font_size:
      settings.copyright_font_size,

    copyright_alignment:
      settings.copyright_alignment,

    bottom_bar_padding_top:
      settings.bottom_bar_padding_top,

    bottom_bar_padding_bottom:
      settings.bottom_bar_padding_bottom,

    mobile_breakpoint:
      settings.mobile_breakpoint,

    mobile_column_count:
      settings.mobile_column_count,

    is_active:
      settings.is_active,

    is_published:
      settings.is_published,
  });

  function chooseImage(
    type: "logo" | "background",
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage(
        "Please select a valid image file.",
      );

      setIsSuccess(false);
      event.target.value = "";

      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setMessage(
        "Image must be smaller than 10 MB.",
      );

      setIsSuccess(false);
      event.target.value = "";

      return;
    }

    const preview =
      URL.createObjectURL(file);

    if (type === "logo") {
      setLogoFile(file);
      setLogoPreview(preview);
    } else {
      setBackgroundImageFile(file);
      setBackgroundImagePreview(
        preview,
      );
    }

    setMessage("");
    setIsSuccess(false);
  }

  function generateStoragePath(
    file: File,
    type: "logo" | "background",
  ): string {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "png";

    return `global/footer/${type}/${crypto.randomUUID()}.${extension}`;
  }

  function removeLogo(): void {
    setLogoFile(null);
    setLogoPreview("");

    setForm((current) => ({
      ...current,
      logo_url: "",
      logo_storage_path: null,
    }));

    setMessage("");
    setIsSuccess(false);
  }

  function removeBackgroundImage(): void {
    setBackgroundImageFile(null);
    setBackgroundImagePreview("");

    setForm((current) => ({
      ...current,
      background_image_url: "",
      background_image_storage_path:
        null,
    }));

    setMessage("");
    setIsSuccess(false);
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (!form.internal_name.trim()) {
      setMessage(
        "Internal name is required.",
      );
      return;
    }

    if (!form.company_name.trim()) {
      setMessage(
        "Company name is required.",
      );
      return;
    }

    if (
      form.show_description &&
      !form.company_description.trim()
    ) {
      setMessage(
        "Company description is required when enabled.",
      );
      return;
    }

    if (
      form.show_quick_links &&
      !form.quick_links_heading.trim()
    ) {
      setMessage(
        "Quick links heading is required.",
      );
      return;
    }

    if (
      form.show_services &&
      !form.services_heading.trim()
    ) {
      setMessage(
        "Services heading is required.",
      );
      return;
    }

    if (
      form.show_services &&
      form.services_show_view_all &&
      !form.services_view_all_text.trim()
    ) {
      setMessage(
        "View all services text is required.",
      );
      return;
    }

    if (
      form.show_services &&
      form.services_show_view_all &&
      !form.services_view_all_link.trim()
    ) {
      setMessage(
        "View all services link is required.",
      );
      return;
    }

    if (
      form.show_legal_links &&
      !form.legal_links_heading.trim()
    ) {
      setMessage(
        "Legal links heading is required.",
      );
      return;
    }

    if (
      form.show_contact &&
      !form.contact_heading.trim()
    ) {
      setMessage(
        "Contact heading is required.",
      );
      return;
    }

    if (
      form.show_social_icons &&
      !form.social_heading.trim()
    ) {
      setMessage(
        "Social heading is required.",
      );
      return;
    }

    if (
      form.background_type === "image" &&
      backgroundImageSource === "url" &&
      !form.background_image_url.trim()
    ) {
      setMessage(
        "Footer background image URL is required.",
      );
      return;
    }

    if (
      form.background_type === "image" &&
      backgroundImageSource === "upload" &&
      !backgroundImageFile &&
      !form.background_image_url.trim()
    ) {
      setMessage(
        "Please select a footer background image.",
      );
      return;
    }

    startTransition(async () => {
      let uploadedLogoPath:
        | string
        | null = null;

      let uploadedBackgroundPath:
        | string
        | null = null;

      try {
        let finalLogoUrl =
          form.logo_url.trim() || null;

        let finalLogoStoragePath =
          form.logo_storage_path;

        let finalBackgroundUrl =
          form.background_image_url.trim() ||
          null;

        let finalBackgroundStoragePath =
          form.background_image_storage_path;

        if (
          logoSource === "upload" &&
          logoFile
        ) {
          uploadedLogoPath =
            generateStoragePath(
              logoFile,
              "logo",
            );

          const {
            error: uploadError,
          } = await supabase.storage
            .from("website-media")
            .upload(
              uploadedLogoPath,
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
                uploadedLogoPath,
              );

          finalLogoUrl =
            data.publicUrl;

          finalLogoStoragePath =
            uploadedLogoPath;
        }

        if (logoSource === "url") {
          finalLogoStoragePath = null;
        }

        if (
          form.background_type === "image" &&
          backgroundImageSource ===
            "upload" &&
          backgroundImageFile
        ) {
          uploadedBackgroundPath =
            generateStoragePath(
              backgroundImageFile,
              "background",
            );

          const {
            error: uploadError,
          } = await supabase.storage
            .from("website-media")
            .upload(
              uploadedBackgroundPath,
              backgroundImageFile,
              {
                cacheControl: "3600",
                upsert: false,
                contentType:
                  backgroundImageFile.type,
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
                uploadedBackgroundPath,
              );

          finalBackgroundUrl =
            data.publicUrl;

          finalBackgroundStoragePath =
            uploadedBackgroundPath;
        }

        if (
          form.background_type !== "image"
        ) {
          finalBackgroundUrl = null;
          finalBackgroundStoragePath =
            null;
        }

        if (
          form.background_type === "image" &&
          backgroundImageSource === "url"
        ) {
          finalBackgroundStoragePath =
            null;
        }

        const result =
          await updateSiteFooterSettings(
            settings.id,
            {
              ...form,

              internal_name:
                form.internal_name.trim(),

              logo_url:
                finalLogoUrl,

              logo_storage_path:
                finalLogoStoragePath,

              logo_alt:
                form.logo_alt.trim() ||
                "Warm Life Limited logo",

              company_name:
                form.company_name.trim(),

              company_description:
                form.company_description.trim(),

              gradient_direction:
                form.gradient_direction.trim() ||
                "135deg",

              background_image_url:
                finalBackgroundUrl,

              background_image_storage_path:
                finalBackgroundStoragePath,

              background_image_alt:
                form.background_image_alt.trim() ||
                "Warm Life footer background",

              quick_links_heading:
                form.quick_links_heading.trim(),

              services_heading:
                form.services_heading.trim(),

              services_view_all_text:
                form.services_view_all_text.trim(),

              services_view_all_link:
                form.services_view_all_link.trim() ||
                "/services",

              legal_links_heading:
                form.legal_links_heading.trim(),

              contact_heading:
                form.contact_heading.trim(),

              social_heading:
                form.social_heading.trim(),

              copyright_text:
                form.copyright_text.trim(),
            },
          );

        if (!result.success) {
          throw new Error(
            result.errors.join(", "),
          );
        }

        if (
          settings.logo_storage_path &&
          settings.logo_storage_path !==
            finalLogoStoragePath
        ) {
          await supabase.storage
            .from("website-media")
            .remove([
              settings.logo_storage_path,
            ]);
        }

        if (
          settings.background_image_storage_path &&
          settings.background_image_storage_path !==
            finalBackgroundStoragePath
        ) {
          await supabase.storage
            .from("website-media")
            .remove([
              settings.background_image_storage_path,
            ]);
        }

        setForm((current) => ({
          ...current,

          logo_url:
            finalLogoUrl ?? "",

          logo_storage_path:
            finalLogoStoragePath,

          background_image_url:
            finalBackgroundUrl ?? "",

          background_image_storage_path:
            finalBackgroundStoragePath,
        }));

        setLogoPreview(
          finalLogoUrl ?? "",
        );

        setBackgroundImagePreview(
          finalBackgroundUrl ?? "",
        );

        setLogoFile(null);
        setBackgroundImageFile(null);

        setIsSuccess(true);

        setMessage(
          "Footer settings saved successfully.",
        );

        router.refresh();
      } catch (error) {
        const pathsToRemove = [
          uploadedLogoPath,
          uploadedBackgroundPath,
        ].filter(
          (path): path is string =>
            Boolean(path),
        );

        if (pathsToRemove.length > 0) {
          await supabase.storage
            .from("website-media")
            .remove(pathsToRemove);
        }

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to save footer settings.",
        );

        setIsSuccess(false);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Footer Settings
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Manage footer branding,
            background, typography,
            columns, spacing and
            visibility.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Save size={18} />
          )}

          {isPending
            ? "Saving..."
            : "Save Settings"}
        </button>
      </div>

      {message ? (
        <div
          className={`rounded-xl border px-5 py-4 text-sm font-medium ${
            isSuccess
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          General Information
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <TextField
            label="Internal Name"
            value={form.internal_name}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                internal_name: value,
              }))
            }
          />

          <TextField
            label="Company Name"
            value={form.company_name}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                company_name: value,
              }))
            }
          />

          <ToggleCard
            title="Show Company Description"
            description="Display the company introduction in the footer."
            checked={
              form.show_description
            }
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                show_description:
                  checked,
              }))
            }
          />

          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-slate-900">
              Company Description
            </span>

            <textarea
              rows={4}
              value={
                form.company_description
              }
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  company_description:
                    event.target.value,
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            />
          </label>
        </div>
      </section>
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Footer Logo
        </h3>

        <div className="mt-5 space-y-5">
          <ToggleCard
            title="Show Footer Logo"
            description="Display the company logo inside the footer."
            checked={form.show_logo}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                show_logo: checked,
              }))
            }
          />

          {form.show_logo ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setLogoSource("upload")
                  }
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    logoSource === "upload"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Upload from Computer
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setLogoSource("url")
                  }
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    logoSource === "url"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Use Direct URL
                </button>
              </div>

              {logoSource === "upload" ? (
                <label className="block rounded-xl border border-dashed border-slate-300 bg-white p-5">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Upload size={17} />
                    Select footer logo
                  </span>

                  <span className="mt-2 block text-xs leading-5 text-slate-500">
                    PNG, JPG, SVG or WebP. Maximum 10 MB.
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    onChange={(event) =>
                      chooseImage(
                        "logo",
                        event,
                      )
                    }
                    className="mt-4 block w-full cursor-pointer text-sm text-slate-700"
                  />

                  {logoFile ? (
                    <p className="mt-3 text-xs font-medium text-emerald-700">
                      Selected: {logoFile.name}
                    </p>
                  ) : settings.logo_storage_path ? (
                    <p className="mt-3 text-xs text-slate-500">
                      Current uploaded logo will remain unless another file is selected.
                    </p>
                  ) : null}
                </label>
              ) : (
                <TextField
                  label="Footer Logo URL"
                  value={form.logo_url}
                  onChange={(value) => {
                    setForm((current) => ({
                      ...current,
                      logo_url: value,
                      logo_storage_path: null,
                    }));

                    setLogoPreview(value);
                    setLogoFile(null);
                  }}
                />
              )}

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <TextField
                  label="Logo Alt Text"
                  value={form.logo_alt}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      logo_alt: value,
                    }))
                  }
                />

                <NumberField
                  label="Logo Width"
                  value={form.logo_width}
                  min={40}
                  max={500}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      logo_width:
                        Number(value),
                    }))
                  }
                />

                <NumberField
                  label="Logo Height"
                  value={form.logo_height}
                  min={20}
                  max={220}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      logo_height:
                        Number(value),
                    }))
                  }
                />
              </div>

              {logoPreview ? (
                <div className="relative grid min-h-40 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
                  <Image
                    src={logoPreview}
                    alt={
                      form.logo_alt ||
                      "Footer logo preview"
                    }
                    width={form.logo_width}
                    height={form.logo_height}
                    className="max-h-28 w-auto object-contain"
                    unoptimized={
                      logoPreview.startsWith("blob:") ||
                      logoPreview
                        .toLowerCase()
                        .includes(".svg")
                    }
                  />

                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700"
                  >
                    <X size={14} />
                    Remove Logo
                  </button>
                </div>
              ) : (
                <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
                  <div>
                    <ImageIcon
                      className="mx-auto text-slate-400"
                      size={30}
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      Upload a footer logo or enter a direct URL.
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Footer Background
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <SelectField
            label="Background Type"
            value={form.background_type}
            options={[
              ["solid", "Solid Colour"],
              ["gradient", "Gradient"],
              ["image", "Background Image"],
            ]}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                background_type:
                  value as FooterBackgroundType,
              }))
            }
          />

          {form.background_type === "solid" ? (
            <ColourField
              label="Background Colour"
              value={form.background_color}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  background_color: value,
                }))
              }
            />
          ) : null}

          {form.background_type === "gradient" ? (
            <>
              <ColourField
                label="Gradient Start"
                value={form.gradient_start_color}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    gradient_start_color: value,
                  }))
                }
              />

              <ColourField
                label="Gradient End"
                value={form.gradient_end_color}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    gradient_end_color: value,
                  }))
                }
              />

              <TextField
                label="Gradient Direction"
                value={form.gradient_direction}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    gradient_direction: value,
                  }))
                }
              />
            </>
          ) : null}
        </div>

        {form.background_type === "image" ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  setBackgroundImageSource(
                    "upload",
                  )
                }
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  backgroundImageSource ===
                  "upload"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Upload from Computer
              </button>

              <button
                type="button"
                onClick={() =>
                  setBackgroundImageSource(
                    "url",
                  )
                }
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  backgroundImageSource ===
                  "url"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Use Direct URL
              </button>
            </div>

            {backgroundImageSource ===
            "upload" ? (
              <label className="mt-5 block rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Upload size={17} />
                  Select footer background image
                </span>

                <span className="mt-2 block text-xs leading-5 text-slate-500">
                  PNG, JPG, SVG or WebP. Maximum 10 MB.
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={(event) =>
                    chooseImage(
                      "background",
                      event,
                    )
                  }
                  className="mt-4 block w-full cursor-pointer text-sm text-slate-700"
                />

                {backgroundImageFile ? (
                  <p className="mt-3 text-xs font-medium text-emerald-700">
                    Selected:{" "}
                    {backgroundImageFile.name}
                  </p>
                ) : settings.background_image_storage_path ? (
                  <p className="mt-3 text-xs text-slate-500">
                    Current uploaded background will remain unless another file is selected.
                  </p>
                ) : null}
              </label>
            ) : (
              <div className="mt-5">
                <TextField
                  label="Background Image URL"
                  value={
                    form.background_image_url
                  }
                  onChange={(value) => {
                    setForm((current) => ({
                      ...current,
                      background_image_url:
                        value,
                      background_image_storage_path:
                        null,
                    }));

                    setBackgroundImagePreview(
                      value,
                    );

                    setBackgroundImageFile(
                      null,
                    );
                  }}
                />
              </div>
            )}

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <TextField
                label="Background Image Alt Text"
                value={
                  form.background_image_alt
                }
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    background_image_alt:
                      value,
                  }))
                }
              />

              <TextField
                label="Overlay Colour"
                value={
                  form.background_overlay_color
                }
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    background_overlay_color:
                      value,
                  }))
                }
              />
            </div>

            {backgroundImagePreview ? (
              <div className="relative mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <Image
                  src={
                    backgroundImagePreview
                  }
                  alt={
                    form.background_image_alt ||
                    "Footer background preview"
                  }
                  width={1400}
                  height={500}
                  className="h-72 w-full object-cover"
                  unoptimized={
                    backgroundImagePreview.startsWith(
                      "blob:",
                    ) ||
                    backgroundImagePreview
                      .toLowerCase()
                      .includes(".svg")
                  }
                />

                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor:
                      form.background_overlay_color,
                  }}
                />

                <button
                  type="button"
                  onClick={
                    removeBackgroundImage
                  }
                  className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700"
                >
                  <X size={14} />
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="mt-5 grid min-h-48 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <div>
                  <ImageIcon
                    className="mx-auto text-slate-400"
                    size={30}
                  />

                  <p className="mt-3 text-sm text-slate-500">
                    Upload an image or enter a direct URL.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </section>
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Typography
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ColourField
            label="Heading Colour"
            value={form.heading_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                heading_color: value,
              }))
            }
          />

          <NumberField
            label="Heading Font Size"
            value={form.heading_font_size}
            min={10}
            max={48}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                heading_font_size: Number(value),
              }))
            }
          />

          <NumberField
            label="Heading Font Weight"
            value={form.heading_font_weight}
            min={100}
            max={900}
            step={100}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                heading_font_weight: Number(value),
              }))
            }
          />
         <label>
  <span>Links Gap</span>

  <input
    type="number"
    min={0}
    max={100}
    value={form.links_spacing}
    onChange={(event) =>
      setForm((current) => ({
        ...current,
        links_spacing: Number(event.target.value),
      }))
    }
  />
</label>
          <NumberField
            label="Heading Letter Spacing"
            value={form.heading_letter_spacing}
            min={-5}
            max={20}
            step={0.1}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                heading_letter_spacing: Number(value),
              }))
            }
          />
          <NumberField
  label="Heading Bottom Spacing"
  value={form.heading_bottom_spacing}
  min={0}
  max={100}
  onChange={(value) =>
    setForm((current) => ({
      ...current,
      heading_bottom_spacing: Number(value),
    }))
  }
/>

          <ColourField
            label="Body Text Colour"
            value={form.text_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                text_color: value,
              }))
            }
          />

          <NumberField
            label="Body Font Size"
            value={form.text_font_size}
            min={10}
            max={32}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                text_font_size: Number(value),
              }))
            }
          />

          <NumberField
            label="Body Font Weight"
            value={form.text_font_weight}
            min={100}
            max={900}
            step={100}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                text_font_weight: Number(value),
              }))
            }
          />
          <NumberField
  label="Links Gap"
  value={form.links_spacing}
  min={0}
  max={50}
  onChange={(value) =>
    setForm((current) => ({
      ...current,
      links_spacing: Number(value),
    }))
  }
/>

          <NumberField
            label="Body Line Height"
            value={form.text_line_height}
            min={1}
            max={3}
            step={0.05}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                text_line_height: Number(value),
              }))
            }
          />

          <ColourField
            label="Link Colour"
            value={form.link_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                link_color: value,
              }))
            }
          />

          <ColourField
            label="Link Hover Colour"
            value={form.link_hover_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                link_hover_color: value,
              }))
            }
          />

          <NumberField
            label="Link Font Size"
            value={form.link_font_size}
            min={10}
            max={32}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                link_font_size: Number(value),
              }))
            }
          />

          <NumberField
            label="Link Font Weight"
            value={form.link_font_weight}
            min={100}
            max={900}
            step={100}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                link_font_weight: Number(value),
              }))
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Footer Columns
        </h3>

        <div className="mt-5 space-y-5">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <NumberField
              label="Desktop Column Count"
              value={form.column_count}
              min={1}
              max={6}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  column_count: Number(value),
                }))
              }
            />

            <NumberField
              label="Column Gap"
              value={form.column_gap}
              min={0}
              max={160}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  column_gap: Number(value),
                }))
              }
            />

            <NumberField
              label="Row Gap"
              value={form.row_gap}
              min={0}
              max={160}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  row_gap: Number(value),
                }))
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ToggleCard
              title="Show Quick Links"
              description="Display the manually managed quick links column."
              checked={form.show_quick_links}
              onChange={(checked) =>
                setForm((current) => ({
                  ...current,
                  show_quick_links: checked,
                }))
              }
            />

            <ToggleCard
              title="Show Services"
              description="Display active and published CMS services automatically."
              checked={form.show_services}
              onChange={(checked) =>
                setForm((current) => ({
                  ...current,
                  show_services: checked,
                }))
              }
            />

            <ToggleCard
              title="Show Legal Links"
              description="Display FAQ, privacy policy, terms and other legal links."
              checked={form.show_legal_links}
              onChange={(checked) =>
                setForm((current) => ({
                  ...current,
                  show_legal_links: checked,
                }))
              }
            />

            <ToggleCard
              title="Show Contact Details"
              description="Display phone, email, address and opening hours."
              checked={form.show_contact}
              onChange={(checked) =>
                setForm((current) => ({
                  ...current,
                  show_contact: checked,
                }))
              }
            />

            <ToggleCard
              title="Show Social Icons"
              description="Display active and published social media links."
              checked={form.show_social_icons}
              onChange={(checked) =>
                setForm((current) => ({
                  ...current,
                  show_social_icons: checked,
                }))
              }
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Column Headings
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <TextField
            label="Quick Links Heading"
            value={form.quick_links_heading}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                quick_links_heading: value,
              }))
            }
          />

          <TextField
            label="Services Heading"
            value={form.services_heading}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                services_heading: value,
              }))
            }
          />

          <TextField
            label="Legal Links Heading"
            value={form.legal_links_heading}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                legal_links_heading: value,
              }))
            }
          />

          <TextField
            label="Contact Heading"
            value={form.contact_heading}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                contact_heading: value,
              }))
            }
          />

          <TextField
            label="Social Heading"
            value={form.social_heading}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                social_heading: value,
              }))
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Dynamic Services
        </h3>

        <div className="mt-5 space-y-5">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <NumberField
              label="Maximum Services"
              value={form.services_limit}
              min={1}
              max={50}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  services_limit: Number(value),
                }))
              }
            />

            <ToggleCard
              title="Show View All Link"
              description="Display a link to the complete services page."
              checked={form.services_show_view_all}
              onChange={(checked) =>
                setForm((current) => ({
                  ...current,
                  services_show_view_all: checked,
                }))
              }
            />
          </div>

          {form.services_show_view_all ? (
            <div className="grid gap-5 md:grid-cols-2">
              <TextField
                label="View All Link Text"
                value={form.services_view_all_text}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    services_view_all_text: value,
                  }))
                }
              />

              <TextField
                label="View All Link URL"
                value={form.services_view_all_link}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    services_view_all_link: value,
                  }))
                }
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Social Icon Design
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Icon Size"
            value={form.social_icon_size}
            min={12}
            max={64}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                social_icon_size: Number(value),
              }))
            }
          />

          <ColourField
            label="Icon Colour"
            value={form.social_icon_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                social_icon_color: value,
              }))
            }
          />

          <ColourField
            label="Icon Hover Colour"
            value={form.social_icon_hover_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                social_icon_hover_color: value,
              }))
            }
          />

          <TextField
            label="Icon Background"
            value={form.social_icon_background_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                social_icon_background_color: value,
              }))
            }
          />

          <TextField
            label="Icon Hover Background"
            value={
              form.social_icon_hover_background_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                social_icon_hover_background_color:
                  value,
              }))
            }
          />

          <NumberField
            label="Icon Radius"
            value={form.social_icon_radius}
            min={0}
            max={999}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                social_icon_radius: Number(value),
              }))
            }
          />
        </div>
      </section>
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Layout and Spacing
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Content Maximum Width"
            value={form.content_max_width}
            min={720}
            max={2200}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                content_max_width: Number(value),
              }))
            }
          />

          <NumberField
            label="Top Padding"
            value={form.padding_top}
            min={0}
            max={300}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                padding_top: Number(value),
              }))
            }
          />

          <NumberField
            label="Bottom Padding"
            value={form.padding_bottom}
            min={0}
            max={300}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                padding_bottom: Number(value),
              }))
            }
          />

          <NumberField
            label="Left Padding"
            value={form.padding_left}
            min={0}
            max={200}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                padding_left: Number(value),
              }))
            }
          />

          <NumberField
            label="Right Padding"
            value={form.padding_right}
            min={0}
            max={200}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                padding_right: Number(value),
              }))
            }
          />

          <NumberField
            label="Desktop Column Count"
            value={form.column_count}
            min={1}
            max={6}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                column_count: Number(value),
              }))
            }
          />

          <NumberField
            label="Column Gap"
            value={form.column_gap}
            min={0}
            max={160}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                column_gap: Number(value),
              }))
            }
          />

          <NumberField
            label="Row Gap"
            value={form.row_gap}
            min={0}
            max={160}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                row_gap: Number(value),
              }))
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Border and Divider
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ToggleCard
            title="Show Top Border"
            description="Display a border above the footer."
            checked={form.show_top_border}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                show_top_border: checked,
              }))
            }
          />

          <TextField
            label="Top Border Colour"
            value={form.top_border_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                top_border_color: value,
              }))
            }
          />

          <NumberField
            label="Top Border Width"
            value={form.top_border_width}
            min={0}
            max={10}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                top_border_width: Number(value),
              }))
            }
          />

          <TextField
            label="Bottom Divider Colour"
            value={form.divider_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                divider_color: value,
              }))
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Copyright Bar
        </h3>

        <div className="mt-5 space-y-5">
          <ToggleCard
            title="Show Copyright"
            description="Display the copyright bar at the bottom of the footer."
            checked={form.show_copyright}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                show_copyright: checked,
              }))
            }
          />

          {form.show_copyright ? (
            <>
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">
                  Copyright Text
                </span>

                <textarea
                  rows={3}
                  value={form.copyright_text}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      copyright_text:
                        event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <ColourField
                  label="Copyright Colour"
                  value={form.copyright_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      copyright_color: value,
                    }))
                  }
                />

                <NumberField
                  label="Copyright Font Size"
                  value={form.copyright_font_size}
                  min={9}
                  max={28}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      copyright_font_size:
                        Number(value),
                    }))
                  }
                />

                <SelectField
                  label="Copyright Alignment"
                  value={form.copyright_alignment}
                  options={[
                    ["left", "Left"],
                    ["center", "Center"],
                    ["right", "Right"],
                  ]}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      copyright_alignment:
                        value as FooterCopyrightAlignment,
                    }))
                  }
                />

                <NumberField
                  label="Bottom Bar Top Padding"
                  value={form.bottom_bar_padding_top}
                  min={0}
                  max={100}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      bottom_bar_padding_top:
                        Number(value),
                    }))
                  }
                />

                <NumberField
                  label="Bottom Bar Bottom Padding"
                  value={form.bottom_bar_padding_bottom}
                  min={0}
                  max={100}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      bottom_bar_padding_bottom:
                        Number(value),
                    }))
                  }
                />
              </div>
            </>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Mobile Settings
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Mobile Breakpoint"
            value={form.mobile_breakpoint}
            min={480}
            max={1400}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                mobile_breakpoint: Number(value),
              }))
            }
          />

          <NumberField
            label="Mobile Column Count"
            value={form.mobile_column_count}
            min={1}
            max={2}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                mobile_column_count: Number(value),
              }))
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Visibility
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <ToggleCard
            title="Active"
            description="Disable the footer without deleting its data."
            checked={form.is_active}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                is_active: checked,
              }))
            }
          />

          <ToggleCard
            title="Published"
            description="Show the footer on the live website."
            checked={form.is_published}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                is_published: checked,
              }))
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Live Preview
        </h3>

        <div
          className="relative mt-5 overflow-hidden rounded-2xl"
          style={{
            background:
              form.background_type === "gradient"
                ? `linear-gradient(${form.gradient_direction}, ${form.gradient_start_color}, ${form.gradient_end_color})`
                : form.background_color,
            borderTop:
              form.show_top_border
                ? `${form.top_border_width}px solid ${form.top_border_color}`
                : "none",
          }}
        >
          {form.background_type === "image" &&
          backgroundImagePreview ? (
            <>
              <Image
                src={backgroundImagePreview}
                alt={
                  form.background_image_alt ||
                  "Footer background preview"
                }
                fill
                className="object-cover"
                unoptimized={
                  backgroundImagePreview.startsWith("blob:") ||
                  backgroundImagePreview
                    .toLowerCase()
                    .includes(".svg")
                }
              />

              <div
                className="absolute inset-0"
                style={{
                  backgroundColor:
                    form.background_overlay_color,
                }}
              />
            </>
          ) : null}

          <div
            className="relative z-10 mx-auto"
            style={{
              maxWidth: `${form.content_max_width}px`,
              paddingTop: `${form.padding_top}px`,
              paddingBottom: `${form.padding_bottom}px`,
              paddingLeft: `${form.padding_left}px`,
              paddingRight: `${form.padding_right}px`,
            }}
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${Math.min(
                  form.column_count,
                  4,
                )}, minmax(0, 1fr))`,
                columnGap: `${form.column_gap}px`,
                rowGap: `${form.row_gap}px`,
              }}
            >
              <div>
                {form.show_logo && logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt={
                      form.logo_alt ||
                      "Footer logo preview"
                    }
                    width={form.logo_width}
                    height={form.logo_height}
                    className="h-auto object-contain"
                    style={{
                      width: `${form.logo_width}px`,
                      maxHeight: `${form.logo_height}px`,
                    }}
                    unoptimized={
                      logoPreview.startsWith("blob:") ||
                      logoPreview
                        .toLowerCase()
                        .includes(".svg")
                    }
                  />
                ) : (
                  <p
                    style={{
                      color: form.heading_color,
                      fontSize: `${form.heading_font_size + 8}px`,
                      fontWeight: 800,
                    }}
                  >
                    {form.company_name}
                  </p>
                )}

                {form.show_description ? (
                  <p
                    className="mt-5"
                    style={{
                      color: form.text_color,
                      fontSize: `${form.text_font_size}px`,
                      fontWeight:
                        form.text_font_weight,
                      lineHeight:
                        form.text_line_height,
                    }}
                  >
                    {form.company_description}
                  </p>
                ) : null}
              </div>

              {form.show_quick_links ? (
                <PreviewColumn
                  heading={form.quick_links_heading}
                  links={[
                    "Home",
                    "About",
                    "Blogs",
                    "Case Studies",
                    "Contact Us",
                  ]}
                  form={form}
                />
              ) : null}

              {form.show_services ? (
                <PreviewColumn
                  heading={form.services_heading}
                  links={[
                    "Loft Insulation",
                    "Cavity Wall Insulation",
                    "Solar Energy",
                    form.services_view_all_text,
                  ]}
                  form={form}
                />
              ) : null}

              {form.show_legal_links ? (
                <PreviewColumn
                  heading={form.legal_links_heading}
                  links={[
                    "FAQ",
                    "Privacy Policy",
                    "Terms & Conditions",
                  ]}
                  form={form}
                />
              ) : null}

              {form.show_contact ? (
                <div>
                  <PreviewHeading
                    text={form.contact_heading}
                    form={form}
                  />

                  <div
                    className="mt-4 space-y-3"
                    style={{
                      color: form.text_color,
                      fontSize: `${form.text_font_size}px`,
                      lineHeight:
                        form.text_line_height,
                    }}
                  >
                    <p>+44 (0)20 3889 9999</p>
                    <p>hello@warmlife.co.uk</p>
                    <p>United Kingdom</p>
                  </div>
                </div>
              ) : null}
            </div>

            {form.show_social_icons ? (
              <div className="mt-8">
                <PreviewHeading
                  text={form.social_heading}
                  form={form}
                />

                <div className="mt-4 flex flex-wrap gap-3">
                  {["f", "in", "ig", "yt"].map(
                    (icon) => (
                      <span
                        key={icon}
                        className="inline-flex items-center justify-center"
                        style={{
                          width: `${form.social_icon_size + 20}px`,
                          height: `${form.social_icon_size + 20}px`,
                          borderRadius: `${form.social_icon_radius}px`,
                          color:
                            form.social_icon_color,
                          backgroundColor:
                            form.social_icon_background_color,
                          fontSize: `${Math.max(
                            11,
                            form.social_icon_size - 4,
                          )}px`,
                          fontWeight: 700,
                        }}
                      >
                        {icon}
                      </span>
                    ),
                  )}
                </div>
              </div>
            ) : null}

            {form.show_copyright ? (
              <div
                style={{
                  marginTop: "40px",
                  borderTop: `1px solid ${form.divider_color}`,
                  paddingTop: `${form.bottom_bar_padding_top}px`,
                  paddingBottom: `${form.bottom_bar_padding_bottom}px`,
                  color: form.copyright_color,
                  fontSize: `${form.copyright_font_size}px`,
                  textAlign:
                    form.copyright_alignment,
                }}
              >
                {form.copyright_text}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </form>
  );
}

type PreviewForm = {
  heading_color: string;
  heading_font_size: number;
  heading_font_weight: number;
  heading_letter_spacing: number;
  link_color: string;
  link_font_size: number;
  link_font_weight: number;
  heading_bottom_spacing: number;
links_spacing: number;
};

function PreviewHeading({
  text,
  form,
}: {
  text: string;
  form: PreviewForm;
}) {
  return (
    <h4
      style={{
        color: form.heading_color,
        fontSize: `${form.heading_font_size}px`,
        fontWeight:
          form.heading_font_weight,
        letterSpacing: `${form.heading_letter_spacing}px`,
        textTransform: "uppercase",
      }}
    >
      {text}
    </h4>
  );
}

function PreviewColumn({
  heading,
  links,
  form,
}: {
  heading: string;
  links: string[];
  form: PreviewForm;
}) {
  return (
    <div>
      <PreviewHeading
        text={heading}
        form={form}
      />

      <div
  style={{
    marginTop: `${form.heading_bottom_spacing}px`,
    display: "flex",
    flexDirection: "column",
    gap: `${form.links_spacing}px`,
  }}
>
        {links.map((link) => (
          <span
            key={link}
            style={{
              color: form.link_color,
              fontSize: `${form.link_font_size}px`,
              fontWeight:
                form.link_font_weight,
            }}
          >
            {link}
          </span>
        ))}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
      >
        {options.map(
          ([optionValue, optionLabel]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>
          ),
        )}
      </select>
    </label>
  );
}

function ColourField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const safeColour =
    /^#[0-9A-Fa-f]{6}$/.test(value)
      ? value
      : "#000000";

  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">
        {label}
      </span>

      <div className="mt-2 flex gap-3">
        <input
          type="color"
          value={safeColour}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="h-12 w-16 rounded-lg border border-slate-300 bg-white p-1"
        />

        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3"
        />
      </div>
    </label>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">
        {label}
      </span>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
      />
    </label>
  );
}

function ToggleCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <span>
        <span className="block text-sm font-semibold text-slate-900">
          {title}
        </span>

        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>
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