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

import { updateHomepageReviewsSection } from "@/lib/actions/homepage-reviews";
import { createClient } from "@/lib/supabase/client";

import type {
  HomepageReviewsSection,
  ReviewBackgroundType,
  ReviewTextAlignment,
} from "@/lib/types/homepage-reviews";

type SectionSettingsFormProps = {
  section: HomepageReviewsSection;
};

type ImageSource = "upload" | "url";

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

    background_overlay_color:
      section.background_overlay_color,

    card_background_color:
      section.card_background_color,

    card_border_color:
      section.card_border_color,

    card_text_color:
      section.card_text_color,

    card_title_color:
      section.card_title_color,

    card_accent_color:
      section.card_accent_color,

    card_radius:
      section.card_radius,

    card_padding:
      section.card_padding,

    card_min_height:
      section.card_min_height,

    card_gap:
      section.card_gap,

    autoplay:
      section.autoplay,

    autoplay_delay:
      section.autoplay_delay,

    transition_speed:
      section.transition_speed,

    pause_on_hover:
      section.pause_on_hover,

    infinite_loop:
      section.infinite_loop,

    show_arrows:
      section.show_arrows,

    show_dots:
      section.show_dots,

    slides_desktop:
      section.slides_desktop,

    slides_tablet:
      section.slides_tablet,

    slides_mobile:
      section.slides_mobile,

    content_max_width:
      section.content_max_width,

    padding_top:
      section.padding_top,

    padding_bottom:
      section.padding_bottom,

    heading_bottom_spacing:
      section.heading_bottom_spacing,

    is_active:
      section.is_active,

    is_published:
      section.is_published,
  });

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

    return `homepage/reviews/backgrounds/${crypto.randomUUID()}.${extension}`;
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
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (!form.eyebrow.trim()) {
      setMessage(
        "Review section label is required.",
      );

      return;
    }

    if (!form.heading.trim()) {
      setMessage(
        "Review section heading is required.",
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

    startTransition(async () => {
      let uploadedPath:
        | string
        | null = null;

      try {
        let finalImageUrl =
          form.background_image_url.trim() ||
          null;

        let finalStoragePath =
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
            error: uploadError,
          } = await supabase.storage
            .from("website-media")
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
              .from("website-media")
              .getPublicUrl(
                uploadedPath,
              );

          finalImageUrl =
            data.publicUrl;

          finalStoragePath =
            uploadedPath;
        }

        if (
          form.background_type !==
          "image"
        ) {
          finalImageUrl = null;
          finalStoragePath = null;
        }

        if (
          form.background_type ===
            "image" &&
          imageSource === "url"
        ) {
          finalStoragePath = null;
        }

        const result =
          await updateHomepageReviewsSection(
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
                finalImageUrl,

              background_image_storage_path:
                finalStoragePath,

              background_image_alt:
                form.background_image_alt.trim() ||
                "Customer reviews background",

              background_overlay_color:
                form.background_overlay_color.trim() ||
                "rgba(255,255,255,0.84)",
            },
          );

        if (!result.success) {
          throw new Error(
            result.errors.join(", "),
          );
        }

        if (
          section.background_image_storage_path &&
          section.background_image_storage_path !==
            finalStoragePath
        ) {
          const {
            error: removeError,
          } = await supabase.storage
            .from("website-media")
            .remove([
              section.background_image_storage_path,
            ]);

          if (removeError) {
            console.error(
              "Old reviews background could not be removed:",
              removeError.message,
            );
          }
        }

        setForm((current) => ({
          ...current,

          background_image_url:
            finalImageUrl ?? "",

          background_image_storage_path:
            finalStoragePath,
        }));

        setBackgroundImagePreview(
          finalImageUrl ?? "",
        );

        setBackgroundImageFile(
          null,
        );

        setIsSuccess(true);

        setMessage(
          "Review section settings saved successfully.",
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
            : "Unable to save review section settings.",
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
            Review Section Settings
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Manage the section content,
            typography, slider, cards,
            background and spacing.
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
          Section Content
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <TextField
            label="Small Heading"
            value={form.eyebrow}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                eyebrow: value,
              }))
            }
          />

          <SelectField
            label="Text Alignment"
            value={
              form.text_alignment
            }
            options={[
              ["left", "Left"],
              ["center", "Center"],
              ["right", "Right"],
            ]}
            onChange={(value) =>
              setForm((current) => ({
                ...current,

                text_alignment:
                  value as ReviewTextAlignment,
              }))
            }
          />

          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-slate-900">
              Main Heading
            </span>

            <textarea
              rows={3}
              value={form.heading}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,

                  heading:
                    event.target.value,
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-slate-900">
              Subheading
            </span>

            <textarea
              rows={4}
              value={form.subheading}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,

                  subheading:
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
          Typography
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ColourField
            label="Small Heading Colour"
            value={
              form.eyebrow_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,

                eyebrow_color:
                  value,
              }))
            }
          />

          <NumberField
            label="Small Heading Size"
            value={form.eyebrow_size}
            min={8}
            max={40}
            onChange={(value) =>
              setForm((current) => ({
                ...current,

                eyebrow_size:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Small Heading Weight"
            value={form.eyebrow_weight}
            min={100}
            max={900}
            step={100}
            onChange={(value) =>
              setForm((current) => ({
                ...current,

                eyebrow_weight:
                  Number(value),
              }))
            }
          />

          <ColourField
            label="Main Heading Colour"
            value={
              form.heading_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,

                heading_color:
                  value,
              }))
            }
          />

          <NumberField
            label="Main Heading Size"
            value={form.heading_size}
            min={24}
            max={120}
            onChange={(value) =>
              setForm((current) => ({
                ...current,

                heading_size:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Main Heading Weight"
            value={form.heading_weight}
            min={100}
            max={900}
            step={100}
            onChange={(value) =>
              setForm((current) => ({
                ...current,

                heading_weight:
                  Number(value),
              }))
            }
          />

          <ColourField
            label="Subheading Colour"
            value={
              form.subheading_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,

                subheading_color:
                  value,
              }))
            }
          />

          <NumberField
            label="Subheading Size"
            value={
              form.subheading_size
            }
            min={11}
            max={40}
            onChange={(value) =>
              setForm((current) => ({
                ...current,

                subheading_size:
                  Number(value),
              }))
            }
          />
        </div>
      </section>
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Section Background
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
                  value as ReviewBackgroundType,
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
                onClick={selectUploadSource}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  imageSource === "upload"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Upload from Computer
              </button>

              <button
                type="button"
                onClick={selectUrlSource}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  imageSource === "url"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Use Direct URL
              </button>
            </div>

            {imageSource === "upload" ? (
              <label className="mt-5 block rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Upload size={17} />
                  Select background image
                </span>

                <span className="mt-2 block text-xs leading-5 text-slate-500">
                  PNG, JPG, SVG or WebP. Maximum 10 MB.
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={chooseBackgroundImage}
                  className="mt-4 block w-full cursor-pointer text-sm text-slate-700"
                />

                {backgroundImageFile ? (
                  <p className="mt-3 text-xs font-medium text-emerald-700">
                    Selected: {backgroundImageFile.name}
                  </p>
                ) : section.background_image_storage_path ? (
                  <p className="mt-3 text-xs text-slate-500">
                    Current uploaded background will remain unless another file is selected.
                  </p>
                ) : null}
              </label>
            ) : (
              <TextField
                label="Background Image URL"
                value={form.background_image_url}
                onChange={(value) => {
                  setForm((current) => ({
                    ...current,
                    background_image_url: value,
                    background_image_storage_path: null,
                  }));

                  setBackgroundImagePreview(value);
                  setBackgroundImageFile(null);
                }}
              />
            )}

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <TextField
                label="Background Image Alt Text"
                value={form.background_image_alt}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    background_image_alt: value,
                  }))
                }
              />

              <TextField
                label="Overlay Colour"
                value={form.background_overlay_color}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    background_overlay_color: value,
                  }))
                }
              />
            </div>

            {backgroundImagePreview ? (
              <div className="relative mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <Image
                  src={backgroundImagePreview}
                  alt={
                    form.background_image_alt ||
                    "Reviews background preview"
                  }
                  width={1200}
                  height={500}
                  className="h-72 w-full object-cover"
                  unoptimized={
                    backgroundImagePreview.startsWith("blob:") ||
                    backgroundImagePreview.toLowerCase().includes(".svg")
                  }
                />

                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: form.background_overlay_color,
                  }}
                />

                <button
                  type="button"
                  onClick={removeBackgroundImage}
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
                    Upload a background image or enter a direct URL.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Review Card Design
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ColourField
            label="Card Background"
            value={form.card_background_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                card_background_color: value,
              }))
            }
          />

          <ColourField
            label="Card Border"
            value={form.card_border_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                card_border_color: value,
              }))
            }
          />

          <ColourField
            label="Card Text Colour"
            value={form.card_text_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                card_text_color: value,
              }))
            }
          />

          <ColourField
            label="Card Title Colour"
            value={form.card_title_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                card_title_color: value,
              }))
            }
          />

          <ColourField
            label="Card Accent Colour"
            value={form.card_accent_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                card_accent_color: value,
              }))
            }
          />

          <NumberField
            label="Card Radius"
            value={form.card_radius}
            min={0}
            max={100}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                card_radius: Number(value),
              }))
            }
          />

          <NumberField
            label="Card Padding"
            value={form.card_padding}
            min={10}
            max={100}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                card_padding: Number(value),
              }))
            }
          />

          <NumberField
            label="Card Minimum Height"
            value={form.card_min_height}
            min={180}
            max={900}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                card_min_height: Number(value),
              }))
            }
          />

          <NumberField
            label="Card Gap"
            value={form.card_gap}
            min={0}
            max={100}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                card_gap: Number(value),
              }))
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Slider Settings
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Autoplay Delay (ms)"
            value={form.autoplay_delay}
            min={1000}
            max={30000}
            step={100}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                autoplay_delay: Number(value),
              }))
            }
          />

          <NumberField
            label="Transition Speed (ms)"
            value={form.transition_speed}
            min={100}
            max={5000}
            step={50}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                transition_speed: Number(value),
              }))
            }
          />

          <NumberField
            label="Desktop Slides"
            value={form.slides_desktop}
            min={1}
            max={6}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                slides_desktop: Number(value),
              }))
            }
          />

          <NumberField
            label="Tablet Slides"
            value={form.slides_tablet}
            min={1}
            max={4}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                slides_tablet: Number(value),
              }))
            }
          />

          <NumberField
            label="Mobile Slides"
            value={form.slides_mobile}
            min={1}
            max={2}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                slides_mobile: Number(value),
              }))
            }
          />

          <ToggleCard
            title="Autoplay"
            description="Automatically move the slider."
            checked={form.autoplay}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                autoplay: checked,
              }))
            }
          />

          <ToggleCard
            title="Pause on Hover"
            description="Pause autoplay while the user hovers."
            checked={form.pause_on_hover}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                pause_on_hover: checked,
              }))
            }
          />

          <ToggleCard
            title="Infinite Loop"
            description="Restart the slider after the last review."
            checked={form.infinite_loop}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                infinite_loop: checked,
              }))
            }
          />

          <ToggleCard
            title="Show Arrows"
            description="Display previous and next buttons."
            checked={form.show_arrows}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                show_arrows: checked,
              }))
            }
          />

          <ToggleCard
            title="Show Dots"
            description="Display slider pagination dots."
            checked={form.show_dots}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                show_dots: checked,
              }))
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Layout and Visibility
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Content Maximum Width"
            value={form.content_max_width}
            min={720}
            max={1800}
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
            label="Heading Bottom Spacing"
            value={form.heading_bottom_spacing}
            min={0}
            max={180}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                heading_bottom_spacing: Number(value),
              }))
            }
          />

          <ToggleCard
            title="Active"
            description="Disable this section without deleting it."
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
            description="Show the section on the live homepage."
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
          className="relative mt-5 overflow-hidden rounded-[30px] border border-slate-200"
          style={{
            background:
              form.background_type === "gradient"
                ? `linear-gradient(${form.gradient_direction}, ${form.gradient_start_color}, ${form.gradient_end_color})`
                : form.background_color,
            padding: "40px",
          }}
        >
          {form.background_type === "image" &&
          backgroundImagePreview ? (
            <>
              <Image
                src={backgroundImagePreview}
                alt={
                  form.background_image_alt ||
                  "Reviews background preview"
                }
                fill
                className="object-cover"
                unoptimized={
                  backgroundImagePreview.startsWith("blob:") ||
                  backgroundImagePreview.toLowerCase().includes(".svg")
                }
              />

              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: form.background_overlay_color,
                }}
              />
            </>
          ) : null}

          <div
            className="relative z-10"
            style={{
              textAlign: form.text_alignment,
            }}
          >
            <p
              className="uppercase tracking-[0.16em]"
              style={{
                color: form.eyebrow_color,
                fontSize: `${form.eyebrow_size}px`,
                fontWeight: form.eyebrow_weight,
              }}
            >
              {form.eyebrow}
            </p>

            <h3
              className="mt-4 leading-[1.04] tracking-[-0.04em]"
              style={{
                color: form.heading_color,
                fontSize: `clamp(34px, 6vw, ${form.heading_size}px)`,
                fontWeight: form.heading_weight,
              }}
            >
              {form.heading}
            </h3>

            <p
              className="mt-4 leading-7"
              style={{
                color: form.subheading_color,
                fontSize: `${form.subheading_size}px`,
              }}
            >
              {form.subheading}
            </p>

            <article
              className="mt-8 border shadow-sm"
              style={{
                backgroundColor: form.card_background_color,
                borderColor: form.card_border_color,
                borderRadius: `${form.card_radius}px`,
                padding: `${form.card_padding}px`,
                minHeight: `${form.card_min_height}px`,
                textAlign: "left",
              }}
            >
              <div className="flex items-center gap-1">
                {Array.from({
                  length: 5,
                }).map((_, index) => (
                  <span
                    key={index}
                    style={{
                      color: form.card_accent_color,
                      fontSize: "20px",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              <h4
                className="mt-5 text-lg font-bold"
                style={{
                  color: form.card_title_color,
                }}
              >
                Professional from beginning to end
              </h4>

              <p
                className="mt-3 leading-7"
                style={{
                  color: form.card_text_color,
                }}
              >
                The review card will use these colours, spacing and dimensions on the live homepage.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 font-bold text-emerald-800">
                  S
                </div>

                <div>
                  <p
                    className="font-bold"
                    style={{
                      color: form.card_title_color,
                    }}
                  >
                    Sarah Thompson
                  </p>

                  <p
                    className="text-sm"
                    style={{
                      color: form.card_text_color,
                    }}
                  >
                    Homeowner • Manchester
                  </p>
                </div>
              </div>
            </article>
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