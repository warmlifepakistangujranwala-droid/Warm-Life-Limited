"use client";

import Image from "next/image";
import {
  type ChangeEvent,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

import { createHomepageHowWeWorkStep } from "@/lib/actions/homepage-how-we-work";
import { createClient } from "@/lib/supabase/client";

import type {
  HowWeWorkMediaType,
} from "@/lib/types/homepage-how-we-work";

type StepFormProps = {
  groupId: string;
};

type ImageSource =
  | "upload"
  | "url";

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

export default function StepForm({
  groupId,
}: StepFormProps) {
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
      "upload",
    );

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [form, setForm] = useState({
    step_label:
      "01",

    title:
      "",

    description:
      "",

    media_type:
      "none" as HowWeWorkMediaType,

    icon_key:
      "check",

    icon_color:
      "#0f6f4f",

    icon_background_color:
      "#ffffff",

    icon_size:
      20,

    image_url:
      "",

    image_storage_path:
      null as string | null,

    image_alt:
      "Process step image",

    image_height:
      100,

    step_label_text_color:
      "#17251d",

    step_label_background_color:
      "#f4cf18",

    step_label_size:
      12,

    step_label_diameter:
      42,

    title_color:
      "#ffffff",

    title_size:
      17,

    title_weight:
      700,

    description_color:
      "#d9eee5",

    description_size:
      14,

    step_background_color:
      "transparent",

    step_border_color:
      "transparent",

    step_radius:
      18,

    step_padding:
      10,

    connector_color:
      "rgba(244,207,24,0.45)",

    connector_width:
      2,

    button_text:
      "",

    button_link:
      "",

    button_background_color:
      "#ffffff",

    button_text_color:
      "#17251d",

    button_open_in_new_tab:
      false,

    display_order:
      0,

    is_active:
      true,

    is_published:
      true,
  });

  function resetForm(): void {
    setForm({
      step_label:
        "01",

      title:
        "",

      description:
        "",

      media_type:
        "none",

      icon_key:
        "check",

      icon_color:
        "#0f6f4f",

      icon_background_color:
        "#ffffff",

      icon_size:
        20,

      image_url:
        "",

      image_storage_path:
        null,

      image_alt:
        "Process step image",

      image_height:
        100,

      step_label_text_color:
        "#17251d",

      step_label_background_color:
        "#f4cf18",

      step_label_size:
        12,

      step_label_diameter:
        42,

      title_color:
        "#ffffff",

      title_size:
        17,

      title_weight:
        700,

      description_color:
        "#d9eee5",

      description_size:
        14,

      step_background_color:
        "transparent",

      step_border_color:
        "transparent",

      step_radius:
        18,

      step_padding:
        10,

      connector_color:
        "rgba(244,207,24,0.45)",

      connector_width:
        2,

      button_text:
        "",

      button_link:
        "",

      button_background_color:
        "#ffffff",

      button_text_color:
        "#17251d",

      button_open_in_new_tab:
        false,

      display_order:
        0,

      is_active:
        true,

      is_published:
        true,
    });

    setImageSource(
      "upload",
    );

    setImageFile(
      null,
    );

    setImagePreview(
      "",
    );
  }

  function chooseImage(
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
        "Image must be smaller than 10 MB.",
      );

      setIsSuccess(false);
      event.target.value = "";

      return;
    }

    setImageFile(
      file,
    );

    setImagePreview(
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

    return `homepage/how-we-work/steps/${crypto.randomUUID()}.${extension}`;
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (
      !form.step_label.trim()
    ) {
      setMessage(
        "Step label is required.",
      );

      return;
    }

    if (!form.title.trim()) {
      setMessage(
        "Step title is required.",
      );

      return;
    }

    if (
      !form.description.trim()
    ) {
      setMessage(
        "Step description is required.",
      );

      return;
    }

    if (
      form.media_type === "image" &&
      imageSource === "url" &&
      !form.image_url.trim()
    ) {
      setMessage(
        "Please enter an image URL.",
      );

      return;
    }

    if (
      form.media_type === "image" &&
      imageSource === "upload" &&
      !imageFile
    ) {
      setMessage(
        "Please select an image.",
      );

      return;
    }

    if (
      form.button_text.trim() &&
      !form.button_link.trim()
    ) {
      setMessage(
        "Button link is required when button text is entered.",
      );

      return;
    }

    startTransition(
      async () => {
        let uploadedPath:
          | string
          | null = null;

        try {
          let finalImageUrl =
            form.image_url.trim() ||
            null;

          let finalImageStoragePath =
            form.image_storage_path;

          if (
            form.media_type ===
              "image" &&
            imageSource ===
              "upload" &&
            imageFile
          ) {
            uploadedPath =
              generateStoragePath(
                imageFile,
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
                  imageFile,
                  {
                    cacheControl:
                      "3600",
                    upsert:
                      false,
                    contentType:
                      imageFile.type,
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

            finalImageUrl =
              data.publicUrl;

            finalImageStoragePath =
              uploadedPath;
          }

          if (
            form.media_type !==
            "image"
          ) {
            finalImageUrl =
              null;

            finalImageStoragePath =
              null;
          }

          if (
            form.media_type ===
              "image" &&
            imageSource === "url"
          ) {
            finalImageStoragePath =
              null;
          }

          const result =
            await createHomepageHowWeWorkStep(
              {
                group_id:
                  groupId,

                step_label:
                  form.step_label.trim(),

                title:
                  form.title.trim(),

                description:
                  form.description.trim(),

                media_type:
                  form.media_type,

                icon_key:
                  form.icon_key,

                icon_color:
                  form.icon_color,

                icon_background_color:
                  form.icon_background_color,

                icon_size:
                  Number(
                    form.icon_size,
                  ),

                image_url:
                  finalImageUrl,

                image_storage_path:
                  finalImageStoragePath,

                image_alt:
                  form.image_alt.trim() ||
                  "Process step image",

                image_height:
                  Number(
                    form.image_height,
                  ),

                step_label_text_color:
                  form.step_label_text_color,

                step_label_background_color:
                  form.step_label_background_color,

                step_label_size:
                  Number(
                    form.step_label_size,
                  ),

                step_label_diameter:
                  Number(
                    form.step_label_diameter,
                  ),

                title_color:
                  form.title_color,

                title_size:
                  Number(
                    form.title_size,
                  ),

                title_weight:
                  Number(
                    form.title_weight,
                  ),

                description_color:
                  form.description_color,

                description_size:
                  Number(
                    form.description_size,
                  ),

                step_background_color:
                  form.step_background_color,

                step_border_color:
                  form.step_border_color,

                step_radius:
                  Number(
                    form.step_radius,
                  ),

                step_padding:
                  Number(
                    form.step_padding,
                  ),

                connector_color:
                  form.connector_color,

                connector_width:
                  Number(
                    form.connector_width,
                  ),

                button_text:
                  form.button_text.trim() ||
                  null,

                button_link:
                  form.button_link.trim() ||
                  null,

                button_background_color:
                  form.button_background_color,

                button_text_color:
                  form.button_text_color,

                button_open_in_new_tab:
                  form.button_open_in_new_tab,

                display_order:
                  Number(
                    form.display_order,
                  ),

                is_active:
                  form.is_active,

                is_published:
                  form.is_published,
              },
            );

          if (!result.success) {
            throw new Error(
              result.errors.join(
                ", ",
              ),
            );
          }

          setIsSuccess(true);

          setMessage(
            "Process step added successfully.",
          );

          resetForm();
          router.refresh();
        } catch (error) {
          if (uploadedPath) {
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
              : "Unable to create process step.",
          );

          setIsSuccess(false);
        }
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">
            Add Process Step
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            Add a new step to this
            process journey.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? "Adding..."
            : "Add Step"}
        </button>
      </div>

      {message ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            isSuccess
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Step Content
        </h4>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Step Label
            </span>

            <input
              value={
                form.step_label
              }
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,

                    step_label:
                      event.target.value,
                  }),
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="01"
            />

            <span className="mt-1 block text-xs text-slate-500">
              This can be a number, letter or custom short label.
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Step Title
            </span>

            <input
              value={form.title}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,

                    title:
                      event.target.value,
                  }),
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Discovery and briefing"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-slate-900">
              Step Description
            </span>

            <textarea
              rows={4}
              value={
                form.description
              }
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,

                    description:
                      event.target.value,
                  }),
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Explain what happens during this step."
            />
          </label>
        </div>
      </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Step Media
        </h4>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Media Type
            </span>

            <select
              value={form.media_type}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  media_type:
                    event.target
                      .value as HowWeWorkMediaType,
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value="none">
                No Media
              </option>

              <option value="icon">
                Icon
              </option>

              <option value="image">
                Image
              </option>
            </select>
          </label>

          {form.media_type === "icon" ? (
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                Icon
              </span>

              <select
                value={form.icon_key}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    icon_key:
                      event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >
                <option value="check">
                  Check
                </option>

                <option value="clipboard">
                  Clipboard
                </option>

                <option value="search">
                  Search
                </option>

                <option value="calendar">
                  Calendar
                </option>

                <option value="wrench">
                  Wrench
                </option>

                <option value="home">
                  Home
                </option>

                <option value="shield">
                  Shield
                </option>

                <option value="sparkles">
                  Sparkles
                </option>
              </select>
            </label>
          ) : null}
        </div>

        {form.media_type === "icon" ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <ColourField
              label="Icon Colour"
              value={form.icon_color}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  icon_color: value,
                }))
              }
            />

            <ColourField
              label="Icon Background"
              value={
                form.icon_background_color
              }
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  icon_background_color:
                    value,
                }))
              }
            />

            <NumberField
              label="Icon Size"
              value={form.icon_size}
              min={10}
              max={80}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  icon_size:
                    Number(value),
                }))
              }
            />
          </div>
        ) : null}

        {form.media_type === "image" ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setImageSource(
                    "upload",
                  );

                  setMessage("");
                  setIsSuccess(false);
                }}
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
                onClick={() => {
                  setImageSource("url");
                  setImageFile(null);

                  setImagePreview(
                    form.image_url,
                  );

                  setMessage("");
                  setIsSuccess(false);
                }}
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
                  Select step image
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  PNG, JPG, SVG or WebP.
                  Maximum file size 10 MB.
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={chooseImage}
                  className="mt-4 block w-full cursor-pointer text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-800"
                />

                {imageFile ? (
                  <p className="mt-3 text-xs font-medium text-emerald-700">
                    Selected:{" "}
                    {imageFile.name}
                  </p>
                ) : null}
              </label>
            ) : (
              <label className="mt-5 block">
                <span className="text-sm font-semibold text-slate-900">
                  Step Image URL
                </span>

                <input
                  type="url"
                  value={form.image_url}
                  onChange={(event) => {
                    const value =
                      event.target.value;

                    setForm((current) => ({
                      ...current,
                      image_url: value,
                      image_storage_path:
                        null,
                    }));

                    setImagePreview(value);
                    setImageFile(null);
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                  placeholder="https://example.com/step-image.png"
                />
              </label>
            )}

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">
                  Image Alt Text
                </span>

                <input
                  value={form.image_alt}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      image_alt:
                        event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                />
              </label>

              <NumberField
                label="Image Height"
                value={
                  form.image_height
                }
                min={40}
                max={300}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    image_height:
                      Number(value),
                  }))
                }
              />
            </div>

            {imagePreview ? (
              <div className="relative mt-5 grid min-h-52 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
                <Image
                  src={imagePreview}
                  alt={
                    form.image_alt ||
                    "Step image preview"
                  }
                  width={400}
                  height={240}
                  className="max-w-full object-contain"
                  style={{
                    maxHeight: `${form.image_height}px`,
                  }}
                  unoptimized={
                    imagePreview.startsWith(
                      "blob:",
                    ) ||
                    imagePreview
                      .toLowerCase()
                      .includes(".svg")
                  }
                />

                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");

                    setForm((current) => ({
                      ...current,
                      image_url: "",
                      image_storage_path:
                        null,
                    }));
                  }}
                  className="absolute right-4 top-4 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 shadow-sm hover:bg-red-50"
                >
                  Remove Image
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Step Label Styling
        </h4>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <ColourField
            label="Label Text Colour"
            value={
              form.step_label_text_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                step_label_text_color:
                  value,
              }))
            }
          />

          <ColourField
            label="Label Background"
            value={
              form.step_label_background_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                step_label_background_color:
                  value,
              }))
            }
          />

          <NumberField
            label="Label Size"
            value={
              form.step_label_size
            }
            min={8}
            max={32}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                step_label_size:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Label Diameter"
            value={
              form.step_label_diameter
            }
            min={24}
            max={100}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                step_label_diameter:
                  Number(value),
              }))
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Text Styling
        </h4>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ColourField
            label="Title Colour"
            value={form.title_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                title_color: value,
              }))
            }
          />

          <NumberField
            label="Title Size"
            value={form.title_size}
            min={11}
            max={42}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                title_size:
                  Number(value),
              }))
            }
          />

          <WeightField
            label="Title Weight"
            value={
              form.title_weight
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                title_weight:
                  Number(value),
              }))
            }
          />

          <ColourField
            label="Description Colour"
            value={
              form.description_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                description_color:
                  value,
              }))
            }
          />

          <NumberField
            label="Description Size"
            value={
              form.description_size
            }
            min={10}
            max={32}
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Step Card Styling
        </h4>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ColourField
            label="Step Background"
            value={
              form.step_background_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                step_background_color:
                  value,
              }))
            }
          />

          <ColourField
            label="Step Border"
            value={
              form.step_border_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                step_border_color:
                  value,
              }))
            }
          />

          <NumberField
            label="Step Radius"
            value={form.step_radius}
            min={0}
            max={80}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                step_radius:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Step Padding"
            value={form.step_padding}
            min={0}
            max={60}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                step_padding:
                  Number(value),
              }))
            }
          />

          <ColourField
            label="Connector Colour"
            value={
              form.connector_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                connector_color:
                  value,
              }))
            }
          />

          <NumberField
            label="Connector Width"
            value={
              form.connector_width
            }
            min={0}
            max={10}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                connector_width:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Display Order"
            value={
              form.display_order
            }
            min={0}
            max={999}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                display_order:
                  Number(value),
              }))
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Optional Button
        </h4>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Button Text
            </span>

            <input
              value={
                form.button_text
              }
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  button_text:
                    event.target.value,
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Learn more"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Button Link
            </span>

            <input
              value={
                form.button_link
              }
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  button_link:
                    event.target.value,
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="/contact"
            />
          </label>

          <ColourField
            label="Button Background"
            value={
              form.button_background_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                button_background_color:
                  value,
              }))
            }
          />

          <ColourField
            label="Button Text Colour"
            value={
              form.button_text_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                button_text_color:
                  value,
              }))
            }
          />

          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 md:col-span-2">
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Open in New Tab
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                Enable this for external links.
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Visibility
        </h4>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Active
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                Disable this step without deleting it.
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

          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Published
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                Show this step on the live homepage.
              </span>
            </span>

            <input
              type="checkbox"
              checked={
                form.is_published
              }
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  is_published:
                    event.target.checked,
                }))
              }
              className="h-5 w-5"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Live Preview
        </h4>

        <article
          className="relative mt-5 border"
          style={{
            backgroundColor:
              form.step_background_color,
            borderColor:
              form.step_border_color,
            borderRadius: `${form.step_radius}px`,
            padding: `${form.step_padding}px`,
          }}
        >
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div
                className="grid place-items-center rounded-full font-bold"
                style={{
                  width: `${form.step_label_diameter}px`,
                  height: `${form.step_label_diameter}px`,
                  color:
                    form.step_label_text_color,
                  backgroundColor:
                    form.step_label_background_color,
                  fontSize: `${form.step_label_size}px`,
                }}
              >
                {form.step_label ||
                  "01"}
              </div>

              <div
                className="absolute left-1/2 top-full h-14 -translate-x-1/2"
                style={{
                  borderLeft: `${form.connector_width}px solid ${form.connector_color}`,
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              {form.media_type ===
              "image" &&
              imagePreview ? (
                <Image
                  src={imagePreview}
                  alt={
                    form.image_alt ||
                    "Step preview"
                  }
                  width={320}
                  height={200}
                  className="mb-4 w-auto object-contain"
                  style={{
                    height: `${form.image_height}px`,
                  }}
                  unoptimized={
                    imagePreview.startsWith(
                      "blob:",
                    ) ||
                    imagePreview
                      .toLowerCase()
                      .includes(".svg")
                  }
                />
              ) : form.media_type ===
                "icon" ? (
                <div
                  className="mb-4 grid place-items-center rounded-xl"
                  style={{
                    width: `${Math.max(
                      form.icon_size + 24,
                      48,
                    )}px`,
                    height: `${Math.max(
                      form.icon_size + 24,
                      48,
                    )}px`,
                    color:
                      form.icon_color,
                    backgroundColor:
                      form.icon_background_color,
                  }}
                >
                  <span
                    style={{
                      fontSize: `${form.icon_size}px`,
                    }}
                  >
                    ◆
                  </span>
                </div>
              ) : null}

              <h5
                style={{
                  color:
                    form.title_color,
                  fontSize: `${form.title_size}px`,
                  fontWeight:
                    form.title_weight,
                }}
              >
                {form.title ||
                  "Step title"}
              </h5>

              <p
                className="mt-2 leading-6"
                style={{
                  color:
                    form.description_color,
                  fontSize: `${form.description_size}px`,
                }}
              >
                {form.description ||
                  "Step description will appear here."}
              </p>

              {form.button_text &&
              form.button_link ? (
                <span
                  className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold"
                  style={{
                    backgroundColor:
                      form.button_background_color,
                    color:
                      form.button_text_color,
                  }}
                >
                  {form.button_text}
                </span>
              ) : null}
            </div>
          </div>
        </article>
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
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3"
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
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
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