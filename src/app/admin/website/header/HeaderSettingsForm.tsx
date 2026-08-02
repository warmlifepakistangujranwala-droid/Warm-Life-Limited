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

import { updateSiteHeaderSettings } from "@/lib/actions/site-header";
import { createClient } from "@/lib/supabase/client";

import type {
  HeaderBackgroundType,
  HeaderShadowStyle,
  SiteHeaderSettings,
} from "@/lib/types/site-header";

type HeaderSettingsFormProps = {
  settings: SiteHeaderSettings;
};

type LogoType = "desktop" | "mobile";
type ImageSource = "upload" | "url";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export default function HeaderSettingsForm({
  settings,
}: HeaderSettingsFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isPending, startTransition] =
    useTransition();

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] =
    useState(false);

  const [desktopLogoSource, setDesktopLogoSource] =
    useState<ImageSource>(
      settings.logo_storage_path
        ? "upload"
        : "url",
    );

  const [mobileLogoSource, setMobileLogoSource] =
    useState<ImageSource>(
      settings.mobile_logo_storage_path
        ? "upload"
        : "url",
    );

  const [desktopLogoFile, setDesktopLogoFile] =
    useState<File | null>(null);

  const [mobileLogoFile, setMobileLogoFile] =
    useState<File | null>(null);

  const [desktopLogoPreview, setDesktopLogoPreview] =
    useState(settings.logo_url ?? "");

  const [mobileLogoPreview, setMobileLogoPreview] =
    useState(settings.mobile_logo_url ?? "");

  const [form, setForm] = useState({
    internal_name: settings.internal_name,

    logo_url: settings.logo_url ?? "",
    logo_storage_path:
      settings.logo_storage_path,
    logo_alt: settings.logo_alt,
    logo_width: settings.logo_width,
    logo_height: settings.logo_height,

    mobile_logo_url:
      settings.mobile_logo_url ?? "",
    mobile_logo_storage_path:
      settings.mobile_logo_storage_path,
    mobile_logo_alt:
      settings.mobile_logo_alt,
    mobile_logo_width:
      settings.mobile_logo_width,
    mobile_logo_height:
      settings.mobile_logo_height,

    header_background_type:
      settings.header_background_type,

    header_background_color:
      settings.header_background_color,

    header_scrolled_background_color:
      settings.header_scrolled_background_color,

    header_text_color:
      settings.header_text_color,

    header_hover_color:
      settings.header_hover_color,

    header_active_color:
      settings.header_active_color,

    header_height:
      settings.header_height,

    header_padding_x:
      settings.header_padding_x,

    content_max_width:
      settings.content_max_width,

    nav_font_size:
      settings.nav_font_size,

    nav_font_weight:
      settings.nav_font_weight,

    nav_letter_spacing:
      settings.nav_letter_spacing,

    nav_item_gap:
      settings.nav_item_gap,

    sticky_enabled:
      settings.sticky_enabled,

    sticky_offset:
      settings.sticky_offset,

    show_border:
      settings.show_border,

    border_color:
      settings.border_color,

    border_width:
      settings.border_width,

    shadow_style:
      settings.shadow_style,

    show_cta:
      settings.show_cta,

    cta_text:
      settings.cta_text,

    cta_link:
      settings.cta_link,

    cta_open_in_new_tab:
      settings.cta_open_in_new_tab,

    cta_text_color:
      settings.cta_text_color,

    cta_background_color:
      settings.cta_background_color,

    cta_border_color:
      settings.cta_border_color,

    cta_hover_text_color:
      settings.cta_hover_text_color,

    cta_hover_background_color:
      settings.cta_hover_background_color,

    cta_hover_border_color:
      settings.cta_hover_border_color,

    cta_radius:
      settings.cta_radius,

    cta_padding_x:
      settings.cta_padding_x,

    cta_padding_y:
      settings.cta_padding_y,

    cta_font_size:
      settings.cta_font_size,

    cta_font_weight:
      settings.cta_font_weight,

    mobile_breakpoint:
      settings.mobile_breakpoint,

    mobile_menu_background_color:
      settings.mobile_menu_background_color,

    mobile_menu_text_color:
      settings.mobile_menu_text_color,

    mobile_menu_hover_color:
      settings.mobile_menu_hover_color,

    mobile_menu_overlay_color:
      settings.mobile_menu_overlay_color,

    mobile_menu_width:
      settings.mobile_menu_width,

    mobile_menu_padding:
      settings.mobile_menu_padding,

    mobile_menu_item_gap:
      settings.mobile_menu_item_gap,

    hamburger_color:
      settings.hamburger_color,

    hamburger_size:
      settings.hamburger_size,

    announcement_enabled:
      settings.announcement_enabled,

    announcement_text:
      settings.announcement_text,

    announcement_link:
      settings.announcement_link ?? "",

    announcement_open_in_new_tab:
      settings.announcement_open_in_new_tab,

    announcement_text_color:
      settings.announcement_text_color,

    announcement_background_color:
      settings.announcement_background_color,

    announcement_font_size:
      settings.announcement_font_size,

    announcement_font_weight:
      settings.announcement_font_weight,

    announcement_height:
      settings.announcement_height,

    is_active:
      settings.is_active,

    is_published:
      settings.is_published,
  });

  function chooseLogo(
    type: LogoType,
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const file = event.target.files?.[0];

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
        "Logo image must be smaller than 10 MB.",
      );
      setIsSuccess(false);
      event.target.value = "";
      return;
    }

    const preview = URL.createObjectURL(file);

    if (type === "desktop") {
      setDesktopLogoFile(file);
      setDesktopLogoPreview(preview);
    } else {
      setMobileLogoFile(file);
      setMobileLogoPreview(preview);
    }

    setMessage("");
    setIsSuccess(false);
  }

  function generateStoragePath(
    file: File,
    type: LogoType,
  ): string {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "png";

    return `global/header/${type}/${crypto.randomUUID()}.${extension}`;
  }

  function removeLogo(type: LogoType): void {
    if (type === "desktop") {
      setDesktopLogoFile(null);
      setDesktopLogoPreview("");

      setForm((current) => ({
        ...current,
        logo_url: "",
        logo_storage_path: null,
      }));
    } else {
      setMobileLogoFile(null);
      setMobileLogoPreview("");

      setForm((current) => ({
        ...current,
        mobile_logo_url: "",
        mobile_logo_storage_path: null,
      }));
    }

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

    if (form.show_cta) {
      if (!form.cta_text.trim()) {
        setMessage(
          "CTA button text is required.",
        );
        return;
      }

      if (!form.cta_link.trim()) {
        setMessage(
          "CTA button link is required.",
        );
        return;
      }
    }

    if (
      form.announcement_enabled &&
      !form.announcement_text.trim()
    ) {
      setMessage(
        "Announcement text is required.",
      );
      return;
    }

    startTransition(async () => {
      let uploadedDesktopPath:
        | string
        | null = null;

      let uploadedMobilePath:
        | string
        | null = null;

      try {
        let finalDesktopLogoUrl =
          form.logo_url.trim() || null;

        let finalDesktopStoragePath =
          form.logo_storage_path;

        let finalMobileLogoUrl =
          form.mobile_logo_url.trim() || null;

        let finalMobileStoragePath =
          form.mobile_logo_storage_path;

        if (
          desktopLogoSource === "upload" &&
          desktopLogoFile
        ) {
          uploadedDesktopPath =
            generateStoragePath(
              desktopLogoFile,
              "desktop",
            );

          const { error: uploadError } =
            await supabase.storage
              .from("website-media")
              .upload(
                uploadedDesktopPath,
                desktopLogoFile,
                {
                  cacheControl: "3600",
                  upsert: false,
                  contentType:
                    desktopLogoFile.type,
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
                uploadedDesktopPath,
              );

          finalDesktopLogoUrl =
            data.publicUrl;

          finalDesktopStoragePath =
            uploadedDesktopPath;
        }

        if (desktopLogoSource === "url") {
          finalDesktopStoragePath = null;
        }

        if (
          mobileLogoSource === "upload" &&
          mobileLogoFile
        ) {
          uploadedMobilePath =
            generateStoragePath(
              mobileLogoFile,
              "mobile",
            );

          const { error: uploadError } =
            await supabase.storage
              .from("website-media")
              .upload(
                uploadedMobilePath,
                mobileLogoFile,
                {
                  cacheControl: "3600",
                  upsert: false,
                  contentType:
                    mobileLogoFile.type,
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
                uploadedMobilePath,
              );

          finalMobileLogoUrl =
            data.publicUrl;

          finalMobileStoragePath =
            uploadedMobilePath;
        }

        if (mobileLogoSource === "url") {
          finalMobileStoragePath = null;
        }

        const result =
          await updateSiteHeaderSettings(
            settings.id,
            {
              ...form,

              internal_name:
                form.internal_name.trim(),

              logo_url:
                finalDesktopLogoUrl,

              logo_storage_path:
                finalDesktopStoragePath,

              logo_alt:
                form.logo_alt.trim() ||
                "Warm Life logo",

              mobile_logo_url:
                finalMobileLogoUrl,

              mobile_logo_storage_path:
                finalMobileStoragePath,

              mobile_logo_alt:
                form.mobile_logo_alt.trim() ||
                "Warm Life mobile logo",

              cta_text:
                form.cta_text.trim(),

              cta_link:
                form.cta_link.trim() ||
                "/quote",

              announcement_text:
                form.announcement_text.trim(),

              announcement_link:
                form.announcement_link.trim() ||
                null,
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
            finalDesktopStoragePath
        ) {
          await supabase.storage
            .from("website-media")
            .remove([
              settings.logo_storage_path,
            ]);
        }

        if (
          settings.mobile_logo_storage_path &&
          settings.mobile_logo_storage_path !==
            finalMobileStoragePath
        ) {
          await supabase.storage
            .from("website-media")
            .remove([
              settings.mobile_logo_storage_path,
            ]);
        }

        setForm((current) => ({
          ...current,

          logo_url:
            finalDesktopLogoUrl ?? "",

          logo_storage_path:
            finalDesktopStoragePath,

          mobile_logo_url:
            finalMobileLogoUrl ?? "",

          mobile_logo_storage_path:
            finalMobileStoragePath,
        }));

        setDesktopLogoPreview(
          finalDesktopLogoUrl ?? "",
        );

        setMobileLogoPreview(
          finalMobileLogoUrl ?? "",
        );

        setDesktopLogoFile(null);
        setMobileLogoFile(null);

        setIsSuccess(true);

        setMessage(
          "Header settings saved successfully.",
        );

        router.refresh();
      } catch (error) {
        const pathsToRemove = [
          uploadedDesktopPath,
          uploadedMobilePath,
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
            : "Unable to save header settings.",
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
            Header Settings
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Manage logo, navbar style, CTA,
            announcement bar, mobile menu
            and visibility.
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
          General Settings
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

          <SelectField
            label="Header Background Type"
            value={
              form.header_background_type
            }
            options={[
              ["solid", "Solid"],
              ["transparent", "Transparent"],
              ["blur", "Blur / Glass"],
            ]}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                header_background_type:
                  value as HeaderBackgroundType,
              }))
            }
          />
        </div>
      </section>
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Desktop Logo
        </h3>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              setDesktopLogoSource("upload")
            }
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              desktopLogoSource === "upload"
                ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Upload from Computer
          </button>

          <button
            type="button"
            onClick={() =>
              setDesktopLogoSource("url")
            }
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              desktopLogoSource === "url"
                ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Use Direct URL
          </button>
        </div>

        {desktopLogoSource === "upload" ? (
          <label className="mt-5 block rounded-xl border border-dashed border-slate-300 bg-white p-5">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Upload size={17} />
              Select desktop logo
            </span>

            <span className="mt-2 block text-xs leading-5 text-slate-500">
              PNG, JPG, SVG or WebP. Maximum 10 MB.
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              onChange={(event) =>
                chooseLogo(
                  "desktop",
                  event,
                )
              }
              className="mt-4 block w-full cursor-pointer text-sm text-slate-700"
            />

            {desktopLogoFile ? (
              <p className="mt-3 text-xs font-medium text-emerald-700">
                Selected: {desktopLogoFile.name}
              </p>
            ) : settings.logo_storage_path ? (
              <p className="mt-3 text-xs text-slate-500">
                Current uploaded logo will remain unless another file is selected.
              </p>
            ) : null}
          </label>
        ) : (
          <div className="mt-5">
            <TextField
              label="Desktop Logo URL"
              value={form.logo_url}
              onChange={(value) => {
                setForm((current) => ({
                  ...current,
                  logo_url: value,
                  logo_storage_path:
                    null,
                }));

                setDesktopLogoPreview(
                  value,
                );

                setDesktopLogoFile(
                  null,
                );
              }}
            />
          </div>
        )}

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
            max={200}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                logo_height:
                  Number(value),
              }))
            }
          />
        </div>

        {desktopLogoPreview ? (
          <div className="relative mt-5 grid min-h-40 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
            <Image
              src={desktopLogoPreview}
              alt={
                form.logo_alt ||
                "Desktop logo preview"
              }
              width={form.logo_width}
              height={form.logo_height}
              className="max-h-28 w-auto object-contain"
              unoptimized={
                desktopLogoPreview.startsWith(
                  "blob:",
                ) ||
                desktopLogoPreview
                  .toLowerCase()
                  .includes(".svg")
              }
            />

            <button
              type="button"
              onClick={() =>
                removeLogo("desktop")
              }
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700"
            >
              <X size={14} />
              Remove Logo
            </button>
          </div>
        ) : (
          <div className="mt-5 grid min-h-40 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
            <div>
              <ImageIcon
                className="mx-auto text-slate-400"
                size={30}
              />

              <p className="mt-3 text-sm text-slate-500">
                Upload a desktop logo or enter a direct URL.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Mobile Logo
        </h3>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              setMobileLogoSource("upload")
            }
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              mobileLogoSource === "upload"
                ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Upload from Computer
          </button>

          <button
            type="button"
            onClick={() =>
              setMobileLogoSource("url")
            }
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              mobileLogoSource === "url"
                ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Use Direct URL
          </button>
        </div>

        {mobileLogoSource === "upload" ? (
          <label className="mt-5 block rounded-xl border border-dashed border-slate-300 bg-white p-5">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Upload size={17} />
              Select mobile logo
            </span>

            <span className="mt-2 block text-xs leading-5 text-slate-500">
              PNG, JPG, SVG or WebP. Maximum 10 MB.
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              onChange={(event) =>
                chooseLogo(
                  "mobile",
                  event,
                )
              }
              className="mt-4 block w-full cursor-pointer text-sm text-slate-700"
            />

            {mobileLogoFile ? (
              <p className="mt-3 text-xs font-medium text-emerald-700">
                Selected: {mobileLogoFile.name}
              </p>
            ) : settings.mobile_logo_storage_path ? (
              <p className="mt-3 text-xs text-slate-500">
                Current mobile logo will remain unless another file is selected.
              </p>
            ) : null}
          </label>
        ) : (
          <div className="mt-5">
            <TextField
              label="Mobile Logo URL"
              value={form.mobile_logo_url}
              onChange={(value) => {
                setForm((current) => ({
                  ...current,
                  mobile_logo_url: value,
                  mobile_logo_storage_path:
                    null,
                }));

                setMobileLogoPreview(
                  value,
                );

                setMobileLogoFile(
                  null,
                );
              }}
            />
          </div>
        )}

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <TextField
            label="Mobile Logo Alt Text"
            value={form.mobile_logo_alt}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                mobile_logo_alt:
                  value,
              }))
            }
          />

          <NumberField
            label="Mobile Logo Width"
            value={form.mobile_logo_width}
            min={40}
            max={400}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                mobile_logo_width:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Mobile Logo Height"
            value={form.mobile_logo_height}
            min={20}
            max={160}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                mobile_logo_height:
                  Number(value),
              }))
            }
          />
        </div>

        {mobileLogoPreview ? (
          <div className="relative mt-5 grid min-h-40 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
            <Image
              src={mobileLogoPreview}
              alt={
                form.mobile_logo_alt ||
                "Mobile logo preview"
              }
              width={form.mobile_logo_width}
              height={form.mobile_logo_height}
              className="max-h-24 w-auto object-contain"
              unoptimized={
                mobileLogoPreview.startsWith(
                  "blob:",
                ) ||
                mobileLogoPreview
                  .toLowerCase()
                  .includes(".svg")
              }
            />

            <button
              type="button"
              onClick={() =>
                removeLogo("mobile")
              }
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700"
            >
              <X size={14} />
              Remove Logo
            </button>
          </div>
        ) : (
          <div className="mt-5 grid min-h-40 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
            <div>
              <ImageIcon
                className="mx-auto text-slate-400"
                size={30}
              />

              <p className="mt-3 text-sm text-slate-500">
                Upload a mobile logo or enter a direct URL.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Navbar Colours
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ColourField
            label="Header Background"
            value={
              form.header_background_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                header_background_color:
                  value,
              }))
            }
          />

          <ColourField
            label="Scrolled Background"
            value={
              form.header_scrolled_background_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                header_scrolled_background_color:
                  value,
              }))
            }
          />

          <ColourField
            label="Navigation Text"
            value={
              form.header_text_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                header_text_color:
                  value,
              }))
            }
          />

          <ColourField
            label="Navigation Hover"
            value={
              form.header_hover_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                header_hover_color:
                  value,
              }))
            }
          />

          <ColourField
            label="Active Link Colour"
            value={
              form.header_active_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                header_active_color:
                  value,
              }))
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Navbar Typography and Spacing
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Header Height"
            value={form.header_height}
            min={50}
            max={180}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                header_height:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Horizontal Padding"
            value={form.header_padding_x}
            min={0}
            max={120}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                header_padding_x:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Content Maximum Width"
            value={form.content_max_width}
            min={720}
            max={2200}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                content_max_width:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Navigation Font Size"
            value={form.nav_font_size}
            min={10}
            max={32}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                nav_font_size:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Navigation Font Weight"
            value={form.nav_font_weight}
            min={100}
            max={900}
            step={100}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                nav_font_weight:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Letter Spacing"
            value={form.nav_letter_spacing}
            min={-5}
            max={20}
            step={0.1}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                nav_letter_spacing:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Navigation Item Gap"
            value={form.nav_item_gap}
            min={0}
            max={100}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                nav_item_gap:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Sticky Offset"
            value={form.sticky_offset}
            min={0}
            max={200}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                sticky_offset:
                  Number(value),
              }))
            }
          />

          <ToggleCard
            title="Sticky Header"
            description="Keep the navbar visible while scrolling."
            checked={form.sticky_enabled}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                sticky_enabled:
                  checked,
              }))
            }
          />
        </div>
      </section>
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Border and Shadow
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ToggleCard
            title="Show Border"
            description="Display a border below or around the header."
            checked={form.show_border}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                show_border: checked,
              }))
            }
          />

          <ColourField
            label="Border Colour"
            value={form.border_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                border_color: value,
              }))
            }
          />

          <NumberField
            label="Border Width"
            value={form.border_width}
            min={0}
            max={10}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                border_width: Number(value),
              }))
            }
          />

          <SelectField
            label="Shadow Style"
            value={form.shadow_style}
            options={[
              ["none", "None"],
              ["soft", "Soft"],
              ["medium", "Medium"],
              ["strong", "Strong"],
            ]}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                shadow_style:
                  value as HeaderShadowStyle,
              }))
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          CTA Button
        </h3>

        <div className="mt-5 space-y-5">
          <ToggleCard
            title="Show CTA Button"
            description="Display the Get Free Quote button in the navbar."
            checked={form.show_cta}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                show_cta: checked,
              }))
            }
          />

          {form.show_cta ? (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  label="CTA Text"
                  value={form.cta_text}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      cta_text: value,
                    }))
                  }
                />

                <TextField
                  label="CTA Link"
                  value={form.cta_link}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      cta_link: value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <ColourField
                  label="Text Colour"
                  value={form.cta_text_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      cta_text_color: value,
                    }))
                  }
                />

                <ColourField
                  label="Background Colour"
                  value={form.cta_background_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      cta_background_color: value,
                    }))
                  }
                />

                <ColourField
                  label="Border Colour"
                  value={form.cta_border_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      cta_border_color: value,
                    }))
                  }
                />

                <ColourField
                  label="Hover Text Colour"
                  value={form.cta_hover_text_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      cta_hover_text_color: value,
                    }))
                  }
                />

                <ColourField
                  label="Hover Background"
                  value={form.cta_hover_background_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      cta_hover_background_color: value,
                    }))
                  }
                />

                <ColourField
                  label="Hover Border"
                  value={form.cta_hover_border_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      cta_hover_border_color: value,
                    }))
                  }
                />

                <NumberField
                  label="Button Radius"
                  value={form.cta_radius}
                  min={0}
                  max={999}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      cta_radius: Number(value),
                    }))
                  }
                />

                <NumberField
                  label="Horizontal Padding"
                  value={form.cta_padding_x}
                  min={4}
                  max={80}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      cta_padding_x: Number(value),
                    }))
                  }
                />

                <NumberField
                  label="Vertical Padding"
                  value={form.cta_padding_y}
                  min={4}
                  max={40}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      cta_padding_y: Number(value),
                    }))
                  }
                />

                <NumberField
                  label="Font Size"
                  value={form.cta_font_size}
                  min={10}
                  max={32}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      cta_font_size: Number(value),
                    }))
                  }
                />

                <NumberField
                  label="Font Weight"
                  value={form.cta_font_weight}
                  min={100}
                  max={900}
                  step={100}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      cta_font_weight: Number(value),
                    }))
                  }
                />
              </div>

              <ToggleCard
                title="Open in New Tab"
                description="Open the CTA link in a new browser tab."
                checked={form.cta_open_in_new_tab}
                onChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    cta_open_in_new_tab: checked,
                  }))
                }
              />
            </>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Announcement Bar
        </h3>

        <div className="mt-5 space-y-5">
          <ToggleCard
            title="Enable Announcement"
            description="Show a small announcement bar above the navbar."
            checked={form.announcement_enabled}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                announcement_enabled: checked,
              }))
            }
          />

          {form.announcement_enabled ? (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  label="Announcement Text"
                  value={form.announcement_text}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      announcement_text: value,
                    }))
                  }
                />

                <TextField
                  label="Announcement Link"
                  value={form.announcement_link}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      announcement_link: value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <ColourField
                  label="Text Colour"
                  value={form.announcement_text_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      announcement_text_color: value,
                    }))
                  }
                />

                <ColourField
                  label="Background Colour"
                  value={form.announcement_background_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      announcement_background_color: value,
                    }))
                  }
                />

                <NumberField
                  label="Font Size"
                  value={form.announcement_font_size}
                  min={9}
                  max={24}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      announcement_font_size: Number(value),
                    }))
                  }
                />

                <NumberField
                  label="Font Weight"
                  value={form.announcement_font_weight}
                  min={100}
                  max={900}
                  step={100}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      announcement_font_weight: Number(value),
                    }))
                  }
                />

                <NumberField
                  label="Bar Height"
                  value={form.announcement_height}
                  min={24}
                  max={100}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      announcement_height: Number(value),
                    }))
                  }
                />
              </div>

              <ToggleCard
                title="Open Announcement in New Tab"
                description="Open the announcement link in a new browser tab."
                checked={form.announcement_open_in_new_tab}
                onChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    announcement_open_in_new_tab: checked,
                  }))
                }
              />
            </>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Mobile Menu
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Mobile Breakpoint"
            value={form.mobile_breakpoint}
            min={640}
            max={1600}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                mobile_breakpoint: Number(value),
              }))
            }
          />

          <ColourField
            label="Menu Background"
            value={form.mobile_menu_background_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                mobile_menu_background_color: value,
              }))
            }
          />

          <ColourField
            label="Menu Text Colour"
            value={form.mobile_menu_text_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                mobile_menu_text_color: value,
              }))
            }
          />

          <ColourField
            label="Menu Hover Colour"
            value={form.mobile_menu_hover_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                mobile_menu_hover_color: value,
              }))
            }
          />

          <TextField
            label="Overlay Colour"
            value={form.mobile_menu_overlay_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                mobile_menu_overlay_color: value,
              }))
            }
          />

          <NumberField
            label="Menu Width"
            value={form.mobile_menu_width}
            min={240}
            max={700}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                mobile_menu_width: Number(value),
              }))
            }
          />

          <NumberField
            label="Menu Padding"
            value={form.mobile_menu_padding}
            min={0}
            max={100}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                mobile_menu_padding: Number(value),
              }))
            }
          />

          <NumberField
            label="Menu Item Gap"
            value={form.mobile_menu_item_gap}
            min={0}
            max={80}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                mobile_menu_item_gap: Number(value),
              }))
            }
          />

          <ColourField
            label="Hamburger Colour"
            value={form.hamburger_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                hamburger_color: value,
              }))
            }
          />

          <NumberField
            label="Hamburger Size"
            value={form.hamburger_size}
            min={16}
            max={60}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                hamburger_size: Number(value),
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
            description="Disable the global header without deleting it."
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
            description="Show the header on the live website."
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

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {form.announcement_enabled ? (
            <div
              className="flex items-center justify-center px-4 text-center"
              style={{
                minHeight: `${form.announcement_height}px`,
                backgroundColor:
                  form.announcement_background_color,
                color:
                  form.announcement_text_color,
                fontSize: `${form.announcement_font_size}px`,
                fontWeight:
                  form.announcement_font_weight,
              }}
            >
              {form.announcement_link ? (
                <a
                  href={form.announcement_link}
                  target={
                    form.announcement_open_in_new_tab
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    form.announcement_open_in_new_tab
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {form.announcement_text}
                </a>
              ) : (
                <span>
                  {form.announcement_text}
                </span>
              )}
            </div>
          ) : null}

          <div
            className="border-b"
            style={{
              minHeight: `${form.header_height}px`,
              background:
                form.header_background_type === "transparent"
                  ? "transparent"
                  : form.header_background_type === "blur"
                    ? "rgba(255,255,255,0.82)"
                    : form.header_background_color,
              backdropFilter:
                form.header_background_type === "blur"
                  ? "blur(16px)"
                  : undefined,
              borderColor: form.show_border
                ? form.border_color
                : "transparent",
              borderBottomWidth: form.show_border
                ? `${form.border_width}px`
                : "0px",
              boxShadow:
                form.shadow_style === "strong"
                  ? "0 18px 44px rgba(15,23,42,0.18)"
                  : form.shadow_style === "medium"
                    ? "0 14px 30px rgba(15,23,42,0.12)"
                    : form.shadow_style === "soft"
                      ? "0 8px 20px rgba(15,23,42,0.08)"
                      : "none",
            }}
          >
            <div
              className="mx-auto flex min-h-[inherit] items-center justify-between gap-6"
              style={{
                maxWidth: `${form.content_max_width}px`,
                paddingLeft: `${form.header_padding_x}px`,
                paddingRight: `${form.header_padding_x}px`,
              }}
            >
              <div className="flex min-w-0 items-center">
                {desktopLogoPreview ? (
                  <Image
                    src={desktopLogoPreview}
                    alt={
                      form.logo_alt ||
                      "Header logo preview"
                    }
                    width={form.logo_width}
                    height={form.logo_height}
                    className="h-auto max-w-full object-contain"
                    style={{
                      width: `${form.logo_width}px`,
                      maxHeight: `${form.logo_height}px`,
                    }}
                    unoptimized={
                      desktopLogoPreview.startsWith(
                        "blob:",
                      ) ||
                      desktopLogoPreview
                        .toLowerCase()
                        .includes(".svg")
                    }
                  />
                ) : (
                  <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-500">
                    LOGO
                  </div>
                )}
              </div>

              <nav
                className="hidden items-center lg:flex"
                style={{
                  gap: `${form.nav_item_gap}px`,
                }}
              >
                {[
                  "Home",
                  "About",
                  "Services",
                  "Blogs",
                  "Case Studies",
                  "Contact Us",
                ].map((item, index) => (
                  <span
                    key={item}
                    style={{
                      color:
                        index === 0
                          ? form.header_active_color
                          : form.header_text_color,
                      fontSize: `${form.nav_font_size}px`,
                      fontWeight:
                        form.nav_font_weight,
                      letterSpacing: `${form.nav_letter_spacing}px`,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                {form.show_cta ? (
                  <span
                    className="hidden border font-semibold lg:inline-flex"
                    style={{
                      color:
                        form.cta_text_color,
                      backgroundColor:
                        form.cta_background_color,
                      borderColor:
                        form.cta_border_color,
                      borderRadius: `${form.cta_radius}px`,
                      paddingLeft: `${form.cta_padding_x}px`,
                      paddingRight: `${form.cta_padding_x}px`,
                      paddingTop: `${form.cta_padding_y}px`,
                      paddingBottom: `${form.cta_padding_y}px`,
                      fontSize: `${form.cta_font_size}px`,
                      fontWeight:
                        form.cta_font_weight,
                    }}
                  >
                    {form.cta_text}
                  </span>
                ) : null}

                <button
                  type="button"
                  className="grid place-items-center rounded-lg p-2 lg:hidden"
                  aria-label="Mobile menu preview"
                >
                  <span
                    className="block"
                    style={{
                      color:
                        form.hamburger_color,
                      fontSize: `${form.hamburger_size}px`,
                    }}
                  >
                    ☰
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div
            className="border-t border-slate-200"
            style={{
              backgroundColor:
                form.mobile_menu_background_color,
              padding: `${form.mobile_menu_padding}px`,
            }}
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Mobile Menu Preview
            </p>

            <div
              className="flex flex-col"
              style={{
                gap: `${form.mobile_menu_item_gap}px`,
              }}
            >
              {[
                "Home",
                "About",
                "Services",
                "Blogs",
                "Case Studies",
                "Contact Us",
              ].map((item) => (
                <span
                  key={item}
                  style={{
                    color:
                      form.mobile_menu_text_color,
                    fontSize: `${form.nav_font_size}px`,
                    fontWeight:
                      form.nav_font_weight,
                  }}
                >
                  {item}
                </span>
              ))}

              {form.show_cta ? (
                <span
                  className="mt-2 inline-flex w-fit border font-semibold"
                  style={{
                    color:
                      form.cta_text_color,
                    backgroundColor:
                      form.cta_background_color,
                    borderColor:
                      form.cta_border_color,
                    borderRadius: `${form.cta_radius}px`,
                    paddingLeft: `${form.cta_padding_x}px`,
                    paddingRight: `${form.cta_padding_x}px`,
                    paddingTop: `${form.cta_padding_y}px`,
                    paddingBottom: `${form.cta_padding_y}px`,
                    fontSize: `${form.cta_font_size}px`,
                    fontWeight:
                      form.cta_font_weight,
                  }}
                >
                  {form.cta_text}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </form>
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