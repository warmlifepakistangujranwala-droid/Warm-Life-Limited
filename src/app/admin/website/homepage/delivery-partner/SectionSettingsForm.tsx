"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  useState,
  useTransition,
} from "react";

import { updateHomepageDeliverySection } from "@/lib/actions/homepage-delivery";
import { createClient } from "@/lib/supabase/client";

import type { HomepageDeliverySection } from "@/lib/types/homepage-delivery";

type SectionSettingsFormProps = {
  section: HomepageDeliverySection;
};

type ImageSource = "upload" | "url";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export default function SectionSettingsForm({
  section,
}: SectionSettingsFormProps) {
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
      section.image_storage_path ? "upload" : "url",
    );

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState(section.image_url ?? "");

  const [form, setForm] = useState({
    top_badge:
      section.top_badge,

    section_heading:
      section.section_heading,

    section_subheading:
      section.section_subheading,

    card_eyebrow:
      section.card_eyebrow,

    card_heading:
      section.card_heading,

    description_one:
      section.description_one,

    description_two:
      section.description_two,

    button_text:
      section.button_text,

    button_link:
      section.button_link,

    button_open_in_new_tab:
      section.button_open_in_new_tab,

    image_url:
      section.image_url ?? "",

    image_storage_path:
      section.image_storage_path ?? null,

    image_alt:
      section.image_alt ??
      "Warm Life energy-efficient home",

    section_background_color:
      section.section_background_color,

    top_badge_color:
      section.top_badge_color,

    section_heading_color:
      section.section_heading_color,

    section_subheading_color:
      section.section_subheading_color,

    card_background_color:
      section.card_background_color,

    card_eyebrow_color:
      section.card_eyebrow_color,

    card_heading_color:
      section.card_heading_color,

    card_description_color:
      section.card_description_color,

    accent_color:
      section.accent_color,

    button_background_color:
      section.button_background_color,

    button_text_color:
      section.button_text_color,

    heading_size:
      section.heading_size,

    subheading_size:
      section.subheading_size,

    card_heading_size:
      section.card_heading_size,

    padding_top:
      section.padding_top,

    padding_bottom:
      section.padding_bottom,

    is_active:
      section.is_active,
  });

  function updateText(
    field:
      | "top_badge"
      | "section_heading"
      | "section_subheading"
      | "card_eyebrow"
      | "card_heading"
      | "description_one"
      | "description_two"
      | "button_text"
      | "button_link"
      | "image_alt",
    value: string,
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateColour(
    field:
      | "section_background_color"
      | "top_badge_color"
      | "section_heading_color"
      | "section_subheading_color"
      | "card_background_color"
      | "card_eyebrow_color"
      | "card_heading_color"
      | "card_description_color"
      | "accent_color"
      | "button_background_color"
      | "button_text_color",
    value: string,
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateNumber(
    field:
      | "heading_size"
      | "subheading_size"
      | "card_heading_size"
      | "padding_top"
      | "padding_bottom",
    value: string,
  ): void {
    setForm((current) => ({
      ...current,
      [field]: Number(value),
    }));
  }



  function chooseImage(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      setIsSuccess(false);
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setMessage("Image must be smaller than 10 MB.");
      setIsSuccess(false);
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage("");
    setIsSuccess(false);
  }

  function generateStoragePath(file: File): string {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "png";

    return `homepage/delivery-partner/${crypto.randomUUID()}.${extension}`;
  }

  function selectUploadSource(): void {
    setImageSource("upload");
    setMessage("");
    setIsSuccess(false);
  }

  function selectUrlSource(): void {
    setImageSource("url");
    setImageFile(null);
    setImagePreview(form.image_url);
    setMessage("");
    setIsSuccess(false);
  }

  function removeSelectedImage(): void {
    setImageFile(null);
    setImagePreview("");
    setForm((current) => ({
      ...current,
      image_url: "",
      image_storage_path: null,
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

    if (!form.top_badge.trim()) {
      setMessage(
        "Top badge text is required.",
      );

      return;
    }

    if (
      !form.section_heading.trim()
    ) {
      setMessage(
        "Section heading is required.",
      );

      return;
    }

    if (
      !form.card_heading.trim()
    ) {
      setMessage(
        "Delivery card heading is required.",
      );

      return;
    }

    if (!form.button_link.trim()) {
      setMessage(
        "Button link is required.",
      );

      return;
    }

    startTransition(async () => {
      let uploadedPath: string | null = null;

      try {
        let finalImageUrl = form.image_url.trim() || null;
        let finalStoragePath = form.image_storage_path;

        if (imageSource === "upload" && imageFile) {
          uploadedPath = generateStoragePath(imageFile);

          const { error: uploadError } =
            await supabase.storage
              .from("website-media")
              .upload(uploadedPath, imageFile, {
                cacheControl: "3600",
                upsert: false,
                contentType: imageFile.type,
              });

          if (uploadError) throw new Error(uploadError.message);

          const { data } = supabase.storage
            .from("website-media")
            .getPublicUrl(uploadedPath);

          finalImageUrl = data.publicUrl;
          finalStoragePath = uploadedPath;
        }

        if (imageSource === "url") {
          finalStoragePath = null;
        }

        const result =
          await updateHomepageDeliverySection(section.id, {
            ...form,
            top_badge: form.top_badge.trim(),
            section_heading: form.section_heading.trim(),
            section_subheading: form.section_subheading.trim(),
            card_eyebrow: form.card_eyebrow.trim(),
            card_heading: form.card_heading.trim(),
            description_one: form.description_one.trim(),
            description_two: form.description_two.trim(),
            button_text: form.button_text.trim(),
            button_link: form.button_link.trim(),
            image_url: finalImageUrl,
            image_storage_path: finalStoragePath,
            image_alt:
              form.image_alt.trim() ||
              "Warm Life energy-efficient home",
          });

        if (!result.success) {
          throw new Error(result.errors.join(", "));
        }

        if (
          section.image_storage_path &&
          section.image_storage_path !== finalStoragePath &&
          (uploadedPath || imageSource === "url" || !finalImageUrl)
        ) {
          const { error: removeError } =
            await supabase.storage
              .from("website-media")
              .remove([section.image_storage_path]);

          if (removeError) {
            console.error(
              "Old delivery image could not be removed:",
              removeError.message,
            );
          }
        }

        setForm((current) => ({
          ...current,
          image_url: finalImageUrl ?? "",
          image_storage_path: finalStoragePath,
        }));
        setImagePreview(finalImageUrl ?? "");
        setImageFile(null);
        setIsSuccess(true);
        setMessage(
          "Delivery section settings saved successfully.",
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
            : "Unable to save delivery section.",
        );
        setIsSuccess(false);
      }
    });
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
            Manage the heading, delivery card,
            button, colours, typography and
            section spacing.
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
          Upper Section Heading
        </h3>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Top Badge
            </span>

            <input
              value={form.top_badge}
              onChange={(event) =>
                updateText(
                  "top_badge",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Main Heading
            </span>

            <input
              value={
                form.section_heading
              }
              onChange={(event) =>
                updateText(
                  "section_heading",
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
                form.section_subheading
              }
              onChange={(event) =>
                updateText(
                  "section_subheading",
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
          Delivery Card Content
        </h3>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Card Eyebrow
            </span>

            <input
              value={form.card_eyebrow}
              onChange={(event) =>
                updateText(
                  "card_eyebrow",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Card Heading
            </span>

            <input
              value={form.card_heading}
              onChange={(event) =>
                updateText(
                  "card_heading",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="text-sm font-semibold text-slate-900">
              Description One
            </span>

            <textarea
              rows={5}
              value={
                form.description_one
              }
              onChange={(event) =>
                updateText(
                  "description_one",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="text-sm font-semibold text-slate-900">
              Description Two
            </span>

            <textarea
              rows={4}
              value={
                form.description_two
              }
              onChange={(event) =>
                updateText(
                  "description_two",
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
          Delivery Card Image
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          Upload an image from your computer or provide a direct public image URL.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={selectUploadSource} className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${imageSource === "upload" ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}>
            Upload from Computer
          </button>
          <button type="button" onClick={selectUrlSource} className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${imageSource === "url" ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}>
            Use Direct URL
          </button>
        </div>

        {imageSource === "upload" ? (
          <label className="mt-5 block rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <span className="block text-sm font-semibold text-slate-900">Select delivery image</span>
            <span className="mt-1 block text-xs text-slate-500">PNG, JPG, SVG or WebP. Transparent PNG is recommended. Maximum 10 MB.</span>
            <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml" onChange={chooseImage} className="mt-4 block w-full cursor-pointer text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-800" />
            {imageFile ? <p className="mt-3 text-xs font-medium text-emerald-700">Selected: {imageFile.name}</p> : section.image_storage_path ? <p className="mt-3 text-xs text-slate-500">Current uploaded image will remain unless you select another file.</p> : null}
          </label>
        ) : (
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-900">Image URL</span>
            <input type="url" value={form.image_url} onChange={(event) => { const value = event.target.value; setForm((current) => ({ ...current, image_url: value, image_storage_path: null })); setImagePreview(value); setImageFile(null); }} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="https://example.com/delivery-image.png" />
          </label>
        )}

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-slate-900">Image Alt Text</span>
          <input value={form.image_alt} onChange={(event) => updateText("image_alt", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Warm Life energy-efficient home" />
        </label>

        {imagePreview ? (
          <div className="relative mt-5 grid min-h-64 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <Image src={imagePreview} alt={form.image_alt || "Delivery image preview"} width={420} height={360} className="max-h-72 max-w-full object-contain" unoptimized={imagePreview.startsWith("blob:") || imagePreview.toLowerCase().includes(".svg")} />
            <button type="button" onClick={removeSelectedImage} className="absolute right-4 top-4 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 shadow-sm hover:bg-red-50">Remove Image</button>
          </div>
        ) : (
          <div className="mt-5 grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">Upload an image or enter a direct URL to see the preview.</div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Work With Us Button
        </h3>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Button Text
            </span>

            <input
              value={form.button_text}
              onChange={(event) =>
                updateText(
                  "button_text",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Button Link
            </span>

            <input
              value={form.button_link}
              onChange={(event) =>
                updateText(
                  "button_link",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="/contact"
            />
          </label>

          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 lg:col-span-2">
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Open in New Tab
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                Leave disabled for the internal
                contact page.
              </span>
            </span>

            <input
              type="checkbox"
              checked={
                form.button_open_in_new_tab
              }
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  button_open_in_new_tab:
                    event.target.checked,
                }))
              }
              className="h-5 w-5"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Colours
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            [
              "section_background_color",
              "Section Background",
            ],
            [
              "top_badge_color",
              "Top Badge Colour",
            ],
            [
              "section_heading_color",
              "Main Heading Colour",
            ],
            [
              "section_subheading_color",
              "Subheading Colour",
            ],
            [
              "card_background_color",
              "Card Background",
            ],
            [
              "card_eyebrow_color",
              "Card Eyebrow Colour",
            ],
            [
              "card_heading_color",
              "Card Heading Colour",
            ],
            [
              "card_description_color",
              "Card Description Colour",
            ],
            [
              "accent_color",
              "Accent Colour",
            ],
            [
              "button_background_color",
              "Button Background",
            ],
            [
              "button_text_color",
              "Button Text Colour",
            ],
          ].map(([field, label]) => (
            <label
              key={field}
              className="block"
            >
              <span className="text-sm font-semibold text-slate-900">
                {label}
              </span>

              <div className="mt-2 flex gap-3">
                <input
                  type="color"
                  value={
                    form[
                      field as keyof typeof form
                    ] as string
                  }
                  onChange={(event) =>
                    updateColour(
                      field as Parameters<
                        typeof updateColour
                      >[0],
                      event.target.value,
                    )
                  }
                  className="h-12 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
                />

                <input
                  value={
                    form[
                      field as keyof typeof form
                    ] as string
                  }
                  onChange={(event) =>
                    updateColour(
                      field as Parameters<
                        typeof updateColour
                      >[0],
                      event.target.value,
                    )
                  }
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Typography and Spacing
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Main Heading Size
            </span>

            <input
              type="number"
              min={24}
              max={110}
              value={form.heading_size}
              onChange={(event) =>
                updateNumber(
                  "heading_size",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Subheading Size
            </span>

            <input
              type="number"
              min={12}
              max={42}
              value={form.subheading_size}
              onChange={(event) =>
                updateNumber(
                  "subheading_size",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Card Heading Size
            </span>

            <input
              type="number"
              min={24}
              max={96}
              value={form.card_heading_size}
              onChange={(event) =>
                updateNumber(
                  "card_heading_size",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Top Padding
            </span>

            <input
              type="number"
              min={0}
              max={300}
              value={form.padding_top}
              onChange={(event) =>
                updateNumber(
                  "padding_top",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Bottom Padding
            </span>

            <input
              type="number"
              min={0}
              max={300}
              value={form.padding_bottom}
              onChange={(event) =>
                updateNumber(
                  "padding_bottom",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Show Section
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                Hide or display this section
                on the homepage.
              </span>
            </span>

            <input
              type="checkbox"
              checked={form.is_active}
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
        className="overflow-hidden rounded-[28px] border border-slate-200 p-6"
        style={{
          backgroundColor:
            form.section_background_color,
        }}
      >
        <p
          className="text-center text-xs font-black uppercase tracking-[0.18em]"
          style={{
            color: form.top_badge_color,
          }}
        >
          {form.top_badge}
        </p>

        <h3
          className="mx-auto mt-5 max-w-4xl text-center leading-tight"
          style={{
            color:
              form.section_heading_color,
            fontSize: `${Math.min(
              form.heading_size,
              64,
            )}px`,
          }}
        >
          {form.section_heading}
        </h3>

        <p
          className="mx-auto mt-4 max-w-3xl text-center leading-7"
          style={{
            color:
              form.section_subheading_color,
            fontSize: `${Math.min(
              form.subheading_size,
              24,
            )}px`,
          }}
        >
          {form.section_subheading}
        </p>

        <div
          className="mt-8 rounded-[26px] p-7 shadow-xl"
          style={{
            backgroundColor:
              form.card_background_color,
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-[0.15em]"
            style={{
              color:
                form.card_eyebrow_color,
            }}
          >
            {form.card_eyebrow}
          </p>

          <h4
            className="mt-4 max-w-2xl leading-tight"
            style={{
              color:
                form.card_heading_color,
              fontSize: `${Math.min(
                form.card_heading_size,
                54,
              )}px`,
            }}
          >
            {form.card_heading}
          </h4>

          <p
            className="mt-5 max-w-3xl leading-7"
            style={{
              color:
                form.card_description_color,
            }}
          >
            {form.description_one}
          </p>

          <button
            type="button"
            className="mt-6 rounded-full px-6 py-3 text-sm font-bold"
            style={{
              backgroundColor:
                form.button_background_color,
              color:
                form.button_text_color,
            }}
          >
            {form.button_text}
          </button>
        </div>
      </section>
    </form>
  );
}