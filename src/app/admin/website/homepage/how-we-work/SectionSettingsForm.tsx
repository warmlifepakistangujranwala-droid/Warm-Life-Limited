"use client";

import Image from "next/image";
import {
  type ChangeEvent,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

import { updateHomepageHowWeWorkSection } from "@/lib/actions/homepage-how-we-work";
import { createClient } from "@/lib/supabase/client";

import type {
  HomepageHowWeWorkSection,
  HowWeWorkBackgroundType,
  HowWeWorkTextAlignment,
} from "@/lib/types/homepage-how-we-work";

type SectionSettingsFormProps = {
  section: HomepageHowWeWorkSection;
};

type ImageSource =
  | "upload"
  | "url";

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

export default function SectionSettingsForm({
  section,
}: SectionSettingsFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const [message, setMessage] =
    useState("");

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [imageSource, setImageSource] =
    useState<ImageSource>(
      section.background_image_storage_path
        ? "upload"
        : "url",
    );

  const [
    backgroundImageFile,
    setBackgroundImageFile,
  ] = useState<File | null>(null);

  const [
    backgroundImagePreview,
    setBackgroundImagePreview,
  ] = useState(
    section.background_image_url ??
      "",
  );

  const [form, setForm] = useState({
    eyebrow:
      section.eyebrow,

    eyebrow_color:
      section.eyebrow_color,

    eyebrow_size:
      section.eyebrow_size,

    eyebrow_weight:
      section.eyebrow_weight,

    heading:
      section.heading,

    heading_color:
      section.heading_color,

    heading_size:
      section.heading_size,

    heading_weight:
      section.heading_weight,

    subheading:
      section.subheading,

    subheading_color:
      section.subheading_color,

    subheading_size:
      section.subheading_size,

    text_alignment:
      section.text_alignment,

    background_type:
      section.background_type,

    background_color:
      section.background_color,

    gradient_start_color:
      section.gradient_start_color,

    gradient_end_color:
      section.gradient_end_color,

    gradient_direction:
      section.gradient_direction,

    background_image_url:
      section.background_image_url ??
      "",

    background_image_storage_path:
      section.background_image_storage_path,

    background_image_alt:
      section.background_image_alt,

    background_image_overlay_color:
      section.background_image_overlay_color,

    accent_color:
      section.accent_color,

    content_max_width:
      section.content_max_width,

    groups_gap:
      section.groups_gap,

    groups_per_row:
      section.groups_per_row,

    padding_top:
      section.padding_top,

    padding_bottom:
      section.padding_bottom,

    header_bottom_spacing:
      section.header_bottom_spacing,

    show_decorations:
      section.show_decorations,

    is_active:
      section.is_active,
  });

  function updateText(
    field:
      | "eyebrow"
      | "heading"
      | "subheading"
      | "gradient_direction"
      | "background_image_alt"
      | "background_image_overlay_color",
    value: string,
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateColour(
    field:
      | "eyebrow_color"
      | "heading_color"
      | "subheading_color"
      | "background_color"
      | "gradient_start_color"
      | "gradient_end_color"
      | "accent_color",
    value: string,
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateNumber(
    field:
      | "eyebrow_size"
      | "eyebrow_weight"
      | "heading_size"
      | "heading_weight"
      | "subheading_size"
      | "content_max_width"
      | "groups_gap"
      | "groups_per_row"
      | "padding_top"
      | "padding_bottom"
      | "header_bottom_spacing",
    value: string,
  ): void {
    setForm((current) => ({
      ...current,
      [field]: Number(value),
    }));
  }

  function chooseBackgroundImage(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      setMessage(
        "Please select a valid image file.",
      );

      setIsSuccess(false);
      event.target.value = "";

      return;
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      setMessage(
        "Background image must be smaller than 10 MB.",
      );

      setIsSuccess(false);
      event.target.value = "";

      return;
    }

    setBackgroundImageFile(
      file,
    );

    setBackgroundImagePreview(
      URL.createObjectURL(file),
    );

    setMessage("");
    setIsSuccess(false);
  }

  function generateStoragePath(
    file: File,
  ): string {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "png";

    return `homepage/how-we-work/section/${crypto.randomUUID()}.${extension}`;
  }

  function selectUploadSource(): void {
    setImageSource("upload");
    setMessage("");
    setIsSuccess(false);
  }

  function selectUrlSource(): void {
    setImageSource("url");

    setBackgroundImageFile(
      null,
    );

    setBackgroundImagePreview(
      form.background_image_url,
    );

    setMessage("");
    setIsSuccess(false);
  }

  function removeBackgroundImage(): void {
    setBackgroundImageFile(
      null,
    );

    setBackgroundImagePreview(
      "",
    );

    setForm((current) => ({
      ...current,

      background_image_url:
        "",

      background_image_storage_path:
        null,
    }));

    setMessage("");
    setIsSuccess(false);
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (!form.eyebrow.trim()) {
      setMessage(
        "Section label is required.",
      );

      return;
    }

    if (!form.heading.trim()) {
      setMessage(
        "Main heading is required.",
      );

      return;
    }

    if (
      form.background_type ===
        "image" &&
      imageSource === "url" &&
      form.background_image_url.trim()
    ) {
      try {
        const parsedUrl =
          new URL(
            form.background_image_url.trim(),
          );

        if (
          parsedUrl.protocol !==
            "http:" &&
          parsedUrl.protocol !==
            "https:"
        ) {
          setMessage(
            "Background image URL must use http or https.",
          );

          return;
        }
      } catch {
        setMessage(
          "Please enter a valid background image URL.",
        );

        return;
      }
    }

    startTransition(
      async () => {
        let uploadedPath:
          | string
          | null = null;

        try {
          let finalBackgroundImageUrl =
            form.background_image_url.trim() ||
            null;

          let finalBackgroundImageStoragePath =
            form.background_image_storage_path;

          if (
            form.background_type ===
              "image" &&
            imageSource ===
              "upload" &&
            backgroundImageFile
          ) {
            uploadedPath =
              generateStoragePath(
                backgroundImageFile,
              );

            const {
              error:
                uploadError,
            } =
              await supabase.storage
                .from(
                  "website-media",
                )
                .upload(
                  uploadedPath,
                  backgroundImageFile,
                  {
                    cacheControl:
                      "3600",

                    upsert:
                      false,

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
                .from(
                  "website-media",
                )
                .getPublicUrl(
                  uploadedPath,
                );

            finalBackgroundImageUrl =
              data.publicUrl;

            finalBackgroundImageStoragePath =
              uploadedPath;
          }

          if (
            form.background_type !==
            "image"
          ) {
            finalBackgroundImageUrl =
              null;

            finalBackgroundImageStoragePath =
              null;
          }

          if (
            form.background_type ===
              "image" &&
            imageSource === "url"
          ) {
            finalBackgroundImageStoragePath =
              null;
          }

          const result =
            await updateHomepageHowWeWorkSection(
              section.id,
              {
                ...form,

                eyebrow:
                  form.eyebrow.trim(),

                heading:
                  form.heading.trim(),

                subheading:
                  form.subheading.trim(),

                gradient_direction:
                  form.gradient_direction.trim() ||
                  "135deg",

                background_image_url:
                  finalBackgroundImageUrl,

                background_image_storage_path:
                  finalBackgroundImageStoragePath,

                background_image_alt:
                  form.background_image_alt.trim() ||
                  "How we work background",

                background_image_overlay_color:
                  form.background_image_overlay_color.trim() ||
                  "rgba(255,255,255,0.82)",
              },
            );

          if (!result.success) {
            throw new Error(
              result.errors.join(
                ", ",
              ),
            );
          }

          if (
            section.background_image_storage_path &&
            section.background_image_storage_path !==
              finalBackgroundImageStoragePath &&
            (
              uploadedPath ||
              imageSource ===
                "url" ||
              form.background_type !==
                "image" ||
              !finalBackgroundImageUrl
            )
          ) {
            const {
              error:
                removeError,
            } =
              await supabase.storage
                .from(
                  "website-media",
                )
                .remove([
                  section.background_image_storage_path,
                ]);

            if (
              removeError
            ) {
              console.error(
                "Old How We Work background could not be removed:",
                removeError.message,
              );
            }
          }

          setForm(
            (current) => ({
              ...current,

              background_image_url:
                finalBackgroundImageUrl ??
                "",

              background_image_storage_path:
                finalBackgroundImageStoragePath,
            }),
          );

          setBackgroundImagePreview(
            finalBackgroundImageUrl ??
              "",
          );

          setBackgroundImageFile(
            null,
          );

          setIsSuccess(true);

          setMessage(
            "How We Work section settings saved successfully.",
          );

          router.refresh();
        } catch (error) {
          if (
            uploadedPath
          ) {
            await supabase.storage
              .from(
                "website-media",
              )
              .remove([
                uploadedPath,
              ]);
          }

          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to save How We Work section.",
          );

          setIsSuccess(false);
        }
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Section Settings
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Manage content,
            typography, spacing,
            background and process
            group layout.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
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

      <section className="rounded-2xl border border-slate-200 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Section Content
        </h3>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Small Label
            </span>

            <input
              value={
                form.eyebrow
              }
              onChange={(event) =>
                updateText(
                  "eyebrow",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Text Alignment
            </span>

            <select
              value={
                form.text_alignment
              }
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,

                    text_alignment:
                      event.target
                        .value as HowWeWorkTextAlignment,
                  }),
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value="left">
                Left
              </option>

              <option value="center">
                Center
              </option>

              <option value="right">
                Right
              </option>
            </select>
          </label>

          <label className="block lg:col-span-2">
            <span className="text-sm font-semibold text-slate-900">
              Main Heading
            </span>

            <textarea
              rows={3}
              value={
                form.heading
              }
              onChange={(event) =>
                updateText(
                  "heading",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="text-sm font-semibold text-slate-900">
              Subheading
            </span>

            <textarea
              rows={4}
              value={
                form.subheading
              }
              onChange={(event) =>
                updateText(
                  "subheading",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>
        </div>
      </section>
            <section className="rounded-2xl border border-slate-200 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Typography
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ColourField
            label="Small Label Colour"
            value={form.eyebrow_color}
            onChange={(value) =>
              updateColour(
                "eyebrow_color",
                value,
              )
            }
          />

          <NumberField
            label="Small Label Size"
            value={form.eyebrow_size}
            min={10}
            max={40}
            onChange={(value) =>
              updateNumber(
                "eyebrow_size",
                value,
              )
            }
          />

          <WeightField
            label="Small Label Weight"
            value={form.eyebrow_weight}
            onChange={(value) =>
              updateNumber(
                "eyebrow_weight",
                value,
              )
            }
          />

          <ColourField
            label="Heading Colour"
            value={form.heading_color}
            onChange={(value) =>
              updateColour(
                "heading_color",
                value,
              )
            }
          />

          <NumberField
            label="Heading Size"
            value={form.heading_size}
            min={24}
            max={120}
            onChange={(value) =>
              updateNumber(
                "heading_size",
                value,
              )
            }
          />

          <WeightField
            label="Heading Weight"
            value={form.heading_weight}
            onChange={(value) =>
              updateNumber(
                "heading_weight",
                value,
              )
            }
          />

          <ColourField
            label="Subheading Colour"
            value={form.subheading_color}
            onChange={(value) =>
              updateColour(
                "subheading_color",
                value,
              )
            }
          />

          <NumberField
            label="Subheading Size"
            value={form.subheading_size}
            min={12}
            max={40}
            onChange={(value) =>
              updateNumber(
                "subheading_size",
                value,
              )
            }
          />

          <ColourField
            label="Accent Colour"
            value={form.accent_color}
            onChange={(value) =>
              updateColour(
                "accent_color",
                value,
              )
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Section Background
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Background Type
            </span>

            <select
              value={form.background_type}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  background_type:
                    event.target
                      .value as HowWeWorkBackgroundType,
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value="solid">
                Solid Colour
              </option>

              <option value="gradient">
                Gradient
              </option>

              <option value="image">
                Background Image
              </option>
            </select>
          </label>

          {form.background_type === "solid" ? (
            <ColourField
              label="Background Colour"
              value={form.background_color}
              onChange={(value) =>
                updateColour(
                  "background_color",
                  value,
                )
              }
            />
          ) : null}

          {form.background_type === "gradient" ? (
            <>
              <ColourField
                label="Gradient Start"
                value={
                  form.gradient_start_color
                }
                onChange={(value) =>
                  updateColour(
                    "gradient_start_color",
                    value,
                  )
                }
              />

              <ColourField
                label="Gradient End"
                value={
                  form.gradient_end_color
                }
                onChange={(value) =>
                  updateColour(
                    "gradient_end_color",
                    value,
                  )
                }
              />

              <label className="block">
                <span className="text-sm font-semibold text-slate-900">
                  Gradient Direction
                </span>

                <input
                  value={
                    form.gradient_direction
                  }
                  onChange={(event) =>
                    updateText(
                      "gradient_direction",
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                  placeholder="135deg"
                />
              </label>
            </>
          ) : null}
        </div>

        {form.background_type === "image" ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={
                  selectUploadSource
                }
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  imageSource === "upload"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
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
                  imageSource === "url"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                Use Direct URL
              </button>
            </div>

            {imageSource === "upload" ? (
              <label className="mt-5 block rounded-xl border border-dashed border-slate-300 bg-white p-5">
                <span className="block text-sm font-semibold text-slate-900">
                  Select background image
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  PNG, JPG, SVG or WebP. Maximum 10 MB.
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={
                    chooseBackgroundImage
                  }
                  className="mt-4 block w-full cursor-pointer text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-800"
                />

                {backgroundImageFile ? (
                  <p className="mt-3 text-xs font-medium text-emerald-700">
                    Selected:{" "}
                    {
                      backgroundImageFile.name
                    }
                  </p>
                ) : section.background_image_storage_path ? (
                  <p className="mt-3 text-xs text-slate-500">
                    Current uploaded image will remain unless you select another file.
                  </p>
                ) : null}
              </label>
            ) : (
              <label className="mt-5 block">
                <span className="text-sm font-semibold text-slate-900">
                  Background Image URL
                </span>

                <input
                  type="url"
                  value={
                    form.background_image_url
                  }
                  onChange={(event) => {
                    const value =
                      event.target.value;

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
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                  placeholder="https://example.com/background.jpg"
                />
              </label>
            )}

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">
                  Background Image Alt Text
                </span>

                <input
                  value={
                    form.background_image_alt
                  }
                  onChange={(event) =>
                    updateText(
                      "background_image_alt",
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-900">
                  Image Overlay Colour
                </span>

                <input
                  value={
                    form.background_image_overlay_color
                  }
                  onChange={(event) =>
                    updateText(
                      "background_image_overlay_color",
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                  placeholder="rgba(255,255,255,0.82)"
                />
              </label>
            </div>

            {backgroundImagePreview ? (
              <div className="relative mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <Image
                  src={
                    backgroundImagePreview
                  }
                  alt={
                    form.background_image_alt ||
                    "Background preview"
                  }
                  width={1200}
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
                      form.background_image_overlay_color,
                  }}
                />

                <button
                  type="button"
                  onClick={
                    removeBackgroundImage
                  }
                  className="absolute right-4 top-4 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 shadow-sm hover:bg-red-50"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="mt-5 grid min-h-56 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                Upload an image or enter a direct URL to see the preview.
              </div>
            )}
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Layout and Spacing
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Content Maximum Width"
            value={
              form.content_max_width
            }
            min={720}
            max={1800}
            onChange={(value) =>
              updateNumber(
                "content_max_width",
                value,
              )
            }
          />

          <NumberField
            label="Groups Per Row"
            value={
              form.groups_per_row
            }
            min={1}
            max={4}
            onChange={(value) =>
              updateNumber(
                "groups_per_row",
                value,
              )
            }
          />

          <NumberField
            label="Groups Gap"
            value={form.groups_gap}
            min={0}
            max={100}
            onChange={(value) =>
              updateNumber(
                "groups_gap",
                value,
              )
            }
          />

          <NumberField
            label="Top Padding"
            value={form.padding_top}
            min={0}
            max={300}
            onChange={(value) =>
              updateNumber(
                "padding_top",
                value,
              )
            }
          />

          <NumberField
            label="Bottom Padding"
            value={
              form.padding_bottom
            }
            min={0}
            max={300}
            onChange={(value) =>
              updateNumber(
                "padding_bottom",
                value,
              )
            }
          />

          <NumberField
            label="Header Bottom Spacing"
            value={
              form.header_bottom_spacing
            }
            min={0}
            max={160}
            onChange={(value) =>
              updateNumber(
                "header_bottom_spacing",
                value,
              )
            }
          />

          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Show Decorations
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                Show decorative glow and background elements.
              </span>
            </span>

            <input
              type="checkbox"
              checked={
                form.show_decorations
              }
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  show_decorations:
                    event.target.checked,
                }))
              }
              className="h-5 w-5"
            />
          </label>

          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Show Section
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                Hide or display the full How We Work section.
              </span>
            </span>

            <input
              type="checkbox"
              checked={
                form.is_active
              }
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  is_active:
                    event.target.checked,
                }))
              }
              className="h-5 w-5"
            />
          </label>
        </div>
      </section>

      <section
        className="relative overflow-hidden rounded-[28px] border border-slate-200 p-7"
        style={{
          background:
            form.background_type ===
            "gradient"
              ? `linear-gradient(${form.gradient_direction}, ${form.gradient_start_color}, ${form.gradient_end_color})`
              : form.background_color,
        }}
      >
        {form.background_type ===
          "image" &&
        backgroundImagePreview ? (
          <>
            <Image
              src={
                backgroundImagePreview
              }
              alt={
                form.background_image_alt ||
                "How We Work preview"
              }
              fill
              className="object-cover"
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
                  form.background_image_overlay_color,
              }}
            />
          </>
        ) : null}

        <div
          className="relative z-10 mx-auto"
          style={{
            maxWidth: `${form.content_max_width}px`,
            textAlign:
              form.text_alignment,
          }}
        >
          <p
            className="uppercase tracking-[0.16em]"
            style={{
              color:
                form.eyebrow_color,
              fontSize: `${form.eyebrow_size}px`,
              fontWeight:
                form.eyebrow_weight,
            }}
          >
            {form.eyebrow}
          </p>

          <h3
            className="mx-auto mt-4 max-w-5xl leading-[1.04] tracking-[-0.045em]"
            style={{
              color:
                form.heading_color,
              fontSize: `clamp(34px, 6vw, ${form.heading_size}px)`,
              fontWeight:
                form.heading_weight,
            }}
          >
            {form.heading}
          </h3>

          <p
            className="mx-auto mt-5 max-w-3xl leading-8"
            style={{
              color:
                form.subheading_color,
              fontSize: `${form.subheading_size}px`,
            }}
          >
            {form.subheading}
          </p>

          <div
            className="mx-auto mt-8 h-1 w-24 rounded-full"
            style={{
              backgroundColor:
                form.accent_color,
            }}
          />
        </div>
      </section>
    </form>
  );
}

type ColourFieldProps = {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
};

function ColourField({
  label,
  value,
  onChange,
}: ColourFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">
        {label}
      </span>

      <div className="mt-2 flex gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className="h-12 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
        />

        <input
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>
    </label>
  );
}

type NumberFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (
    value: string,
  ) => void;
};

function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: NumberFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">
        {label}
      </span>

      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
      />
    </label>
  );
}

type WeightFieldProps = {
  label: string;
  value: number;
  onChange: (
    value: string,
  ) => void;
};

function WeightField({
  label,
  value,
  onChange,
}: WeightFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
      >
        <option value={100}>
          100 — Thin
        </option>

        <option value={200}>
          200 — Extra Light
        </option>

        <option value={300}>
          300 — Light
        </option>

        <option value={400}>
          400 — Regular
        </option>

        <option value={500}>
          500 — Medium
        </option>

        <option value={600}>
          600 — Semi Bold
        </option>

        <option value={700}>
          700 — Bold
        </option>

        <option value={800}>
          800 — Extra Bold
        </option>

        <option value={900}>
          900 — Black
        </option>
      </select>
    </label>
  );
}