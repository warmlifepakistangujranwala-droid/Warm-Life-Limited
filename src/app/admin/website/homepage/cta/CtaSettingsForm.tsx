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

import { updateHomepageCtaSection } from "@/lib/actions/homepage-cta";
import { createClient } from "@/lib/supabase/client";

import type {
  HomepageCtaBackgroundType,
  HomepageCtaSection,
  HomepageCtaShadowStyle,
  HomepageCtaTextAlignment,
} from "@/lib/types/homepage-cta";

type CtaSettingsFormProps = {
  section: HomepageCtaSection;
};

type ImageSource = "upload" | "url";

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

export default function CtaSettingsForm({
  section,
}: CtaSettingsFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isPending, startTransition] =
    useTransition();

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
    section.background_image_url ?? "",
  );

  const [form, setForm] = useState({
    internal_name:
      section.internal_name,

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

    description:
      section.description,

    description_color:
      section.description_color,

    description_size:
      section.description_size,

    highlight_enabled:
      section.highlight_enabled,

    highlight_text:
      section.highlight_text,

    highlight_text_color:
      section.highlight_text_color,

    highlight_background_color:
      section.highlight_background_color,

    highlight_border_color:
      section.highlight_border_color,

    highlight_radius:
      section.highlight_radius,

    highlight_padding_x:
      section.highlight_padding_x,

    highlight_padding_y:
      section.highlight_padding_y,

    text_alignment:
      section.text_alignment,

    primary_button_enabled:
      section.primary_button_enabled,

    primary_button_text:
      section.primary_button_text,

    primary_button_link:
      section.primary_button_link,

    primary_button_open_in_new_tab:
      section.primary_button_open_in_new_tab,

    primary_button_text_color:
      section.primary_button_text_color,

    primary_button_background_color:
      section.primary_button_background_color,

    primary_button_border_color:
      section.primary_button_border_color,

    primary_button_radius:
      section.primary_button_radius,

    primary_button_padding_x:
      section.primary_button_padding_x,

    primary_button_padding_y:
      section.primary_button_padding_y,

    secondary_button_enabled:
      section.secondary_button_enabled,

    secondary_button_text:
      section.secondary_button_text,

    secondary_button_link:
      section.secondary_button_link,

    secondary_button_open_in_new_tab:
      section.secondary_button_open_in_new_tab,

    secondary_button_text_color:
      section.secondary_button_text_color,

    secondary_button_background_color:
      section.secondary_button_background_color,

    secondary_button_border_color:
      section.secondary_button_border_color,

    secondary_button_radius:
      section.secondary_button_radius,

    secondary_button_padding_x:
      section.secondary_button_padding_x,

    secondary_button_padding_y:
      section.secondary_button_padding_y,

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
      section.background_image_url ?? "",

    background_image_storage_path:
      section.background_image_storage_path,

    background_image_alt:
      section.background_image_alt,

    background_overlay_color:
      section.background_overlay_color,

    show_decorations:
      section.show_decorations,

    decoration_primary_color:
      section.decoration_primary_color,

    decoration_secondary_color:
      section.decoration_secondary_color,

    decoration_opacity:
      section.decoration_opacity,

    content_max_width:
      section.content_max_width,

    content_inner_width:
      section.content_inner_width,

    padding_top:
      section.padding_top,

    padding_bottom:
      section.padding_bottom,

    padding_left:
      section.padding_left,

    padding_right:
      section.padding_right,

    section_margin_top:
      section.section_margin_top,

    section_margin_bottom:
      section.section_margin_bottom,

    border_radius:
      section.border_radius,

    border_width:
      section.border_width,

    border_color:
      section.border_color,

    shadow_style:
      section.shadow_style,

    button_gap:
      section.button_gap,

    content_gap:
      section.content_gap,

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
        "Background image must be smaller than 10 MB.",
      );

      setIsSuccess(false);
      event.target.value = "";

      return;
    }

    setBackgroundImageFile(file);

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
        ?.toLowerCase() || "png";

    return `homepage/cta/backgrounds/${crypto.randomUUID()}.${extension}`;
  }

  function selectUploadSource(): void {
    setImageSource("upload");
    setMessage("");
    setIsSuccess(false);
  }

  function selectUrlSource(): void {
    setImageSource("url");

    setBackgroundImageFile(null);

    setBackgroundImagePreview(
      form.background_image_url,
    );

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

    if (!form.eyebrow.trim()) {
      setMessage(
        "Eyebrow text is required.",
      );

      return;
    }

    if (!form.heading.trim()) {
      setMessage(
        "CTA heading is required.",
      );

      return;
    }

    if (!form.description.trim()) {
      setMessage(
        "CTA description is required.",
      );

      return;
    }

    if (
      form.highlight_enabled &&
      !form.highlight_text.trim()
    ) {
      setMessage(
        "Highlight text is required when highlight is enabled.",
      );

      return;
    }

    if (
      form.primary_button_enabled &&
      !form.primary_button_text.trim()
    ) {
      setMessage(
        "Primary button text is required.",
      );

      return;
    }

    if (
      form.primary_button_enabled &&
      !form.primary_button_link.trim()
    ) {
      setMessage(
        "Primary button link is required.",
      );

      return;
    }

    if (
      form.secondary_button_enabled &&
      !form.secondary_button_text.trim()
    ) {
      setMessage(
        "Secondary button text is required.",
      );

      return;
    }

    if (
      form.secondary_button_enabled &&
      !form.secondary_button_link.trim()
    ) {
      setMessage(
        "Secondary button link is required.",
      );

      return;
    }

    if (
      form.background_type === "image" &&
      imageSource === "url" &&
      !form.background_image_url.trim()
    ) {
      setMessage(
        "Background image URL is required.",
      );

      return;
    }

    if (
      form.background_type === "image" &&
      imageSource === "upload" &&
      !backgroundImageFile &&
      !form.background_image_url.trim()
    ) {
      setMessage(
        "Please select a background image.",
      );

      return;
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
          form.background_type === "image" &&
          imageSource === "upload" &&
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
                uploadedPath,
              );

          finalImageUrl =
            data.publicUrl;

          finalStoragePath =
            uploadedPath;
        }

        if (
          form.background_type !== "image"
        ) {
          finalImageUrl = null;
          finalStoragePath = null;
        }

        if (
          form.background_type === "image" &&
          imageSource === "url"
        ) {
          finalStoragePath = null;
        }

        const result =
          await updateHomepageCtaSection(
            section.id,
            {
              ...form,

              internal_name:
                form.internal_name.trim(),

              eyebrow:
                form.eyebrow.trim(),

              heading:
                form.heading.trim(),

              description:
                form.description.trim(),

              highlight_text:
                form.highlight_text.trim(),

              primary_button_text:
                form.primary_button_text.trim(),

              primary_button_link:
                form.primary_button_link.trim() ||
                "/quote",

              secondary_button_text:
                form.secondary_button_text.trim(),

              secondary_button_link:
                form.secondary_button_link.trim() ||
                "/contact",

              gradient_direction:
                form.gradient_direction.trim() ||
                "135deg",

              background_image_url:
                finalImageUrl,

              background_image_storage_path:
                finalStoragePath,

              background_image_alt:
                form.background_image_alt.trim() ||
                "Warm Life call to action background",

              background_overlay_color:
                form.background_overlay_color.trim() ||
                "rgba(7,48,36,0.68)",
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
              "Old CTA background could not be removed:",
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

        setBackgroundImageFile(null);

        setIsSuccess(true);

        setMessage(
          "CTA section settings saved successfully.",
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
            : "Unable to save CTA section settings.",
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
            CTA Section Settings
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Manage CTA content, buttons,
            background, typography,
            spacing and visibility.
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
            label="Text Alignment"
            value={form.text_alignment}
            options={[
              ["left", "Left"],
              ["center", "Center"],
              ["right", "Right"],
            ]}
            onChange={(value) =>
              setForm((current) => ({
                ...current,

                text_alignment:
                  value as HomepageCtaTextAlignment,
              }))
            }
          />

          <TextField
            label="Eyebrow Text"
            value={form.eyebrow}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                eyebrow: value,
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
              Description
            </span>

            <textarea
              rows={4}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,

                  description:
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
            label="Eyebrow Colour"
            value={form.eyebrow_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                eyebrow_color: value,
              }))
            }
          />

          <NumberField
            label="Eyebrow Size"
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
            label="Eyebrow Weight"
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
            label="Heading Size"
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
            label="Heading Weight"
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
            label="Description Colour"
            value={form.description_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                description_color: value,
              }))
            }
          />

          <NumberField
            label="Description Size"
            value={form.description_size}
            min={11}
            max={40}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                description_size:
                  Number(value),
              }))
            }
          />
        </div>
      </section>
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Highlight Strip
        </h3>

        <div className="mt-5 space-y-5">
          <ToggleCard
            title="Enable Highlight"
            description="Show the small trust message above the CTA buttons."
            checked={form.highlight_enabled}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                highlight_enabled: checked,
              }))
            }
          />

          {form.highlight_enabled ? (
            <>
              <TextField
                label="Highlight Text"
                value={form.highlight_text}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    highlight_text: value,
                  }))
                }
              />

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <ColourField
                  label="Highlight Text Colour"
                  value={form.highlight_text_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      highlight_text_color: value,
                    }))
                  }
                />

                <TextField
                  label="Highlight Background"
                  value={form.highlight_background_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      highlight_background_color: value,
                    }))
                  }
                />

                <TextField
                  label="Highlight Border"
                  value={form.highlight_border_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      highlight_border_color: value,
                    }))
                  }
                />

                <NumberField
                  label="Highlight Radius"
                  value={form.highlight_radius}
                  min={0}
                  max={999}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      highlight_radius: Number(value),
                    }))
                  }
                />

                <NumberField
                  label="Horizontal Padding"
                  value={form.highlight_padding_x}
                  min={4}
                  max={80}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      highlight_padding_x: Number(value),
                    }))
                  }
                />

                <NumberField
                  label="Vertical Padding"
                  value={form.highlight_padding_y}
                  min={4}
                  max={40}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      highlight_padding_y: Number(value),
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
          Primary Button
        </h3>

        <div className="mt-5 space-y-5">
          <ToggleCard
            title="Enable Primary Button"
            description="Show the main conversion button."
            checked={form.primary_button_enabled}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                primary_button_enabled: checked,
              }))
            }
          />

          {form.primary_button_enabled ? (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  label="Button Text"
                  value={form.primary_button_text}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      primary_button_text: value,
                    }))
                  }
                />

                <TextField
                  label="Button Link"
                  value={form.primary_button_link}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      primary_button_link: value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <ColourField
                  label="Text Colour"
                  value={form.primary_button_text_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      primary_button_text_color: value,
                    }))
                  }
                />

                <ColourField
                  label="Background Colour"
                  value={form.primary_button_background_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      primary_button_background_color: value,
                    }))
                  }
                />

                <ColourField
                  label="Border Colour"
                  value={form.primary_button_border_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      primary_button_border_color: value,
                    }))
                  }
                />

                <NumberField
                  label="Button Radius"
                  value={form.primary_button_radius}
                  min={0}
                  max={999}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      primary_button_radius: Number(value),
                    }))
                  }
                />

                <NumberField
                  label="Horizontal Padding"
                  value={form.primary_button_padding_x}
                  min={8}
                  max={80}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      primary_button_padding_x: Number(value),
                    }))
                  }
                />

                <NumberField
                  label="Vertical Padding"
                  value={form.primary_button_padding_y}
                  min={6}
                  max={40}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      primary_button_padding_y: Number(value),
                    }))
                  }
                />
              </div>

              <ToggleCard
                title="Open in New Tab"
                description="Open the primary button link in a new browser tab."
                checked={form.primary_button_open_in_new_tab}
                onChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    primary_button_open_in_new_tab: checked,
                  }))
                }
              />
            </>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Secondary Button
        </h3>

        <div className="mt-5 space-y-5">
          <ToggleCard
            title="Enable Secondary Button"
            description="Show the secondary contact button."
            checked={form.secondary_button_enabled}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                secondary_button_enabled: checked,
              }))
            }
          />

          {form.secondary_button_enabled ? (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  label="Button Text"
                  value={form.secondary_button_text}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      secondary_button_text: value,
                    }))
                  }
                />

                <TextField
                  label="Button Link"
                  value={form.secondary_button_link}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      secondary_button_link: value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <ColourField
                  label="Text Colour"
                  value={form.secondary_button_text_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      secondary_button_text_color: value,
                    }))
                  }
                />

                <TextField
                  label="Background Colour"
                  value={form.secondary_button_background_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      secondary_button_background_color: value,
                    }))
                  }
                />

                <TextField
                  label="Border Colour"
                  value={form.secondary_button_border_color}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      secondary_button_border_color: value,
                    }))
                  }
                />

                <NumberField
                  label="Button Radius"
                  value={form.secondary_button_radius}
                  min={0}
                  max={999}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      secondary_button_radius: Number(value),
                    }))
                  }
                />

                <NumberField
                  label="Horizontal Padding"
                  value={form.secondary_button_padding_x}
                  min={8}
                  max={80}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      secondary_button_padding_x: Number(value),
                    }))
                  }
                />

                <NumberField
                  label="Vertical Padding"
                  value={form.secondary_button_padding_y}
                  min={6}
                  max={40}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      secondary_button_padding_y: Number(value),
                    }))
                  }
                />
              </div>

              <ToggleCard
                title="Open in New Tab"
                description="Open the secondary button link in a new browser tab."
                checked={form.secondary_button_open_in_new_tab}
                onChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    secondary_button_open_in_new_tab: checked,
                  }))
                }
              />
            </>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          CTA Background
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
                  value as HomepageCtaBackgroundType,
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
                  Select CTA background image
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
                    Current uploaded image will remain unless another file is selected.
                  </p>
                ) : null}
              </label>
            ) : (
              <div className="mt-5">
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
              </div>
            )}

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <TextField
                label="Image Alt Text"
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
                    "CTA background preview"
                  }
                  width={1200}
                  height={500}
                  className="h-72 w-full object-cover"
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
          Decorations
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ToggleCard
            title="Show Decorations"
            description="Display decorative blurred circles and accents."
            checked={form.show_decorations}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                show_decorations: checked,
              }))
            }
          />

          <ColourField
            label="Primary Decoration Colour"
            value={form.decoration_primary_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                decoration_primary_color: value,
              }))
            }
          />

          <ColourField
            label="Secondary Decoration Colour"
            value={form.decoration_secondary_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                decoration_secondary_color: value,
              }))
            }
          />

          <NumberField
            label="Decoration Opacity"
            value={form.decoration_opacity}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                decoration_opacity: Number(value),
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
            max={1800}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                content_max_width: Number(value),
              }))
            }
          />

          <NumberField
            label="Inner Content Width"
            value={form.content_inner_width}
            min={320}
            max={1400}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                content_inner_width: Number(value),
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
            label="Top Margin"
            value={form.section_margin_top}
            min={0}
            max={200}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                section_margin_top: Number(value),
              }))
            }
          />

          <NumberField
            label="Bottom Margin"
            value={form.section_margin_bottom}
            min={0}
            max={200}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                section_margin_bottom: Number(value),
              }))
            }
          />

          <NumberField
            label="Button Gap"
            value={form.button_gap}
            min={0}
            max={80}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                button_gap: Number(value),
              }))
            }
          />

          <NumberField
            label="Content Gap"
            value={form.content_gap}
            min={0}
            max={100}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                content_gap: Number(value),
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
          <NumberField
            label="Border Radius"
            value={form.border_radius}
            min={0}
            max={120}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                border_radius: Number(value),
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

          <TextField
            label="Border Colour"
            value={form.border_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                border_color: value,
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
                  value as HomepageCtaShadowStyle,
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
            description="Show this CTA on the live homepage."
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
          className="relative mt-5 overflow-hidden"
          style={{
            background:
              form.background_type === "gradient"
                ? `linear-gradient(${form.gradient_direction}, ${form.gradient_start_color}, ${form.gradient_end_color})`
                : form.background_color,
            borderRadius: `${form.border_radius}px`,
            borderWidth: `${form.border_width}px`,
            borderStyle: "solid",
            borderColor: form.border_color,
            paddingTop: `${form.padding_top}px`,
            paddingBottom: `${form.padding_bottom}px`,
            paddingLeft: `${form.padding_left}px`,
            paddingRight: `${form.padding_right}px`,
            boxShadow:
              form.shadow_style === "strong"
                ? "0 30px 70px rgba(23,37,29,0.24)"
                : form.shadow_style === "medium"
                  ? "0 22px 50px rgba(23,37,29,0.16)"
                  : form.shadow_style === "soft"
                    ? "0 14px 34px rgba(23,37,29,0.10)"
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
                  "CTA background preview"
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

          {form.show_decorations ? (
            <>
              <div
                className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full blur-3xl"
                style={{
                  backgroundColor:
                    form.decoration_primary_color,
                  opacity:
                    form.decoration_opacity,
                }}
              />

              <div
                className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full blur-3xl"
                style={{
                  backgroundColor:
                    form.decoration_secondary_color,
                  opacity:
                    form.decoration_opacity,
                }}
              />
            </>
          ) : null}

          <div
            className="relative z-10 mx-auto"
            style={{
              maxWidth: `${form.content_inner_width}px`,
              textAlign:
                form.text_alignment,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: `${form.content_gap}px`,
                alignItems:
                  form.text_alignment === "center"
                    ? "center"
                    : form.text_alignment === "right"
                      ? "flex-end"
                      : "flex-start",
              }}
            >
              <p
                className="uppercase tracking-[0.16em]"
                style={{
                  color: form.eyebrow_color,
                  fontSize: `${form.eyebrow_size}px`,
                  fontWeight:
                    form.eyebrow_weight,
                }}
              >
                {form.eyebrow}
              </p>

              <h3
                className="leading-[1.05] tracking-[-0.04em]"
                style={{
                  color: form.heading_color,
                  fontSize: `clamp(34px, 6vw, ${form.heading_size}px)`,
                  fontWeight:
                    form.heading_weight,
                }}
              >
                {form.heading}
              </h3>

              <p
                className="leading-8"
                style={{
                  color:
                    form.description_color,
                  fontSize: `${form.description_size}px`,
                }}
              >
                {form.description}
              </p>

              {form.highlight_enabled ? (
                <div
                  className="border"
                  style={{
                    color:
                      form.highlight_text_color,
                    backgroundColor:
                      form.highlight_background_color,
                    borderColor:
                      form.highlight_border_color,
                    borderRadius: `${form.highlight_radius}px`,
                    paddingLeft: `${form.highlight_padding_x}px`,
                    paddingRight: `${form.highlight_padding_x}px`,
                    paddingTop: `${form.highlight_padding_y}px`,
                    paddingBottom: `${form.highlight_padding_y}px`,
                  }}
                >
                  {form.highlight_text}
                </div>
              ) : null}

              <div
                className="flex flex-wrap"
                style={{
                  gap: `${form.button_gap}px`,
                  justifyContent:
                    form.text_alignment === "center"
                      ? "center"
                      : form.text_alignment === "right"
                        ? "flex-end"
                        : "flex-start",
                }}
              >
                {form.primary_button_enabled ? (
                  <span
                    className="inline-flex items-center justify-center border font-semibold"
                    style={{
                      color:
                        form.primary_button_text_color,
                      backgroundColor:
                        form.primary_button_background_color,
                      borderColor:
                        form.primary_button_border_color,
                      borderRadius: `${form.primary_button_radius}px`,
                      paddingLeft: `${form.primary_button_padding_x}px`,
                      paddingRight: `${form.primary_button_padding_x}px`,
                      paddingTop: `${form.primary_button_padding_y}px`,
                      paddingBottom: `${form.primary_button_padding_y}px`,
                    }}
                  >
                    {form.primary_button_text}
                  </span>
                ) : null}

                {form.secondary_button_enabled ? (
                  <span
                    className="inline-flex items-center justify-center border font-semibold"
                    style={{
                      color:
                        form.secondary_button_text_color,
                      backgroundColor:
                        form.secondary_button_background_color,
                      borderColor:
                        form.secondary_button_border_color,
                      borderRadius: `${form.secondary_button_radius}px`,
                      paddingLeft: `${form.secondary_button_padding_x}px`,
                      paddingRight: `${form.secondary_button_padding_x}px`,
                      paddingTop: `${form.secondary_button_padding_y}px`,
                      paddingBottom: `${form.secondary_button_padding_y}px`,
                    }}
                  >
                    {form.secondary_button_text}
                  </span>
                ) : null}
              </div>
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