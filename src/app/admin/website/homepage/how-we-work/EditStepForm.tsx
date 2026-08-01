"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  useState,
  useTransition,
} from "react";

import { updateHomepageHowWeWorkStep } from "@/lib/actions/homepage-how-we-work";
import { createClient } from "@/lib/supabase/client";

import type {
  HomepageHowWeWorkStep,
  HowWeWorkMediaType,
} from "@/lib/types/homepage-how-we-work";

type EditStepFormProps = {
  step: HomepageHowWeWorkStep;
};

type ImageSource = "upload" | "url";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export default function EditStepForm({
  step,
}: EditStepFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [imageSource, setImageSource] = useState<ImageSource>(
    step.image_storage_path ? "upload" : "url",
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(step.image_url ?? "");

  const [form, setForm] = useState({
    step_label: step.step_label,
    title: step.title,
    description: step.description,

    media_type: step.media_type as HowWeWorkMediaType,

    icon_key: step.icon_key,
    icon_color: step.icon_color,
    icon_background_color: step.icon_background_color,
    icon_size: step.icon_size,

    image_url: step.image_url ?? "",
    image_storage_path: step.image_storage_path,
    image_alt: step.image_alt,
    image_height: step.image_height,

    step_label_text_color: step.step_label_text_color,
    step_label_background_color: step.step_label_background_color,
    step_label_size: step.step_label_size,
    step_label_diameter: step.step_label_diameter,

    title_color: step.title_color,
    title_size: step.title_size,
    title_weight: step.title_weight,

    description_color: step.description_color,
    description_size: step.description_size,

    step_background_color: step.step_background_color,
    step_border_color: step.step_border_color,
    step_radius: step.step_radius,
    step_padding: step.step_padding,

    connector_color: step.connector_color,
    connector_width: step.connector_width,

    button_text: step.button_text ?? "",
    button_link: step.button_link ?? "",
    button_background_color: step.button_background_color,
    button_text_color: step.button_text_color,
    button_open_in_new_tab: step.button_open_in_new_tab,

    display_order: step.display_order,

    is_active: step.is_active,
    is_published: step.is_published,
  });

  function chooseImage(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

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

  function generateStoragePath(
    file: File,
  ): string {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "png";

    return `homepage/how-we-work/steps/${crypto.randomUUID()}.${extension}`;
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

  function removeImage(): void {
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
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (!form.step_label.trim()) {
      setMessage("Step label is required.");
      return;
    }

    if (!form.title.trim()) {
      setMessage("Step title is required.");
      return;
    }

    if (!form.description.trim()) {
      setMessage("Step description is required.");
      return;
    }

    if (
      form.media_type === "image" &&
      imageSource === "url" &&
      !form.image_url.trim()
    ) {
      setMessage("Please enter an image URL.");
      return;
    }

    if (
      form.media_type === "image" &&
      imageSource === "upload" &&
      !imageFile &&
      !form.image_url.trim()
    ) {
      setMessage("Please select an image.");
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

    startTransition(async () => {
      let uploadedPath: string | null = null;

      try {
        let finalImageUrl =
          form.image_url.trim() || null;

        let finalImageStoragePath =
          form.image_storage_path;

        if (
          form.media_type === "image" &&
          imageSource === "upload" &&
          imageFile
        ) {
          uploadedPath = generateStoragePath(imageFile);

          const { error: uploadError } =
            await supabase.storage
              .from("website-media")
              .upload(uploadedPath, imageFile, {
                cacheControl: "3600",
                upsert: false,
                contentType: imageFile.type,
              });

          if (uploadError) {
            throw new Error(uploadError.message);
          }

          const { data } = supabase.storage
            .from("website-media")
            .getPublicUrl(uploadedPath);

          finalImageUrl = data.publicUrl;
          finalImageStoragePath = uploadedPath;
        }

        if (form.media_type !== "image") {
          finalImageUrl = null;
          finalImageStoragePath = null;
        }

        if (
          form.media_type === "image" &&
          imageSource === "url"
        ) {
          finalImageStoragePath = null;
        }

        const result =
          await updateHomepageHowWeWorkStep(
            step.id,
            {
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
                Number(form.icon_size),

              image_url:
                finalImageUrl,

              image_storage_path:
                finalImageStoragePath,

              image_alt:
                form.image_alt.trim() ||
                "Process step image",

              image_height:
                Number(form.image_height),

              step_label_text_color:
                form.step_label_text_color,

              step_label_background_color:
                form.step_label_background_color,

              step_label_size:
                Number(form.step_label_size),

              step_label_diameter:
                Number(form.step_label_diameter),

              title_color:
                form.title_color,

              title_size:
                Number(form.title_size),

              title_weight:
                Number(form.title_weight),

              description_color:
                form.description_color,

              description_size:
                Number(form.description_size),

              step_background_color:
                form.step_background_color,

              step_border_color:
                form.step_border_color,

              step_radius:
                Number(form.step_radius),

              step_padding:
                Number(form.step_padding),

              connector_color:
                form.connector_color,

              connector_width:
                Number(form.connector_width),

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
                Number(form.display_order),

              is_active:
                form.is_active,

              is_published:
                form.is_published,
            },
          );

        if (!result.success) {
          throw new Error(
            result.errors.join(", "),
          );
        }

        if (
          step.image_storage_path &&
          step.image_storage_path !==
            finalImageStoragePath
        ) {
          const { error: removeError } =
            await supabase.storage
              .from("website-media")
              .remove([
                step.image_storage_path,
              ]);

          if (removeError) {
            console.error(
              "Old How We Work step image could not be removed:",
              removeError.message,
            );
          }
        }

        setForm((current) => ({
          ...current,
          image_url:
            finalImageUrl ?? "",
          image_storage_path:
            finalImageStoragePath,
        }));

        setImagePreview(
          finalImageUrl ?? "",
        );

        setImageFile(null);
        setIsSuccess(true);
        setMessage(
          "Process step updated successfully.",
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
            : "Unable to update process step.",
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
            Process Step Details
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Update the content, media, colours,
            layout, button and visibility.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/website/homepage/how-we-work",
              )
            }
            disabled={isPending}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
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

      <Panel title="Step Content">
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            label="Step Label"
            value={form.step_label}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                step_label: value,
              }))
            }
          />

          <TextField
            label="Step Title"
            value={form.title}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                title: value,
              }))
            }
          />

          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-slate-900">
              Step Description
            </span>

            <textarea
              rows={5}
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
      </Panel>

      <Panel title="Step Media">
        <div className="grid gap-5 md:grid-cols-2">
          <SelectField
            label="Media Type"
            value={form.media_type}
            options={[
              ["none", "No Media"],
              ["icon", "Icon"],
              ["image", "Image"],
            ]}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                media_type:
                  value as HowWeWorkMediaType,
              }))
            }
          />

          {form.media_type === "icon" ? (
            <SelectField
              label="Icon"
              value={form.icon_key}
              options={[
                ["check", "Check"],
                ["clipboard", "Clipboard"],
                ["search", "Search"],
                ["calendar", "Calendar"],
                ["wrench", "Wrench"],
                ["home", "Home"],
                ["shield", "Shield"],
                ["sparkles", "Sparkles"],
              ]}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  icon_key: value,
                }))
              }
            />
          ) : null}
        </div>

        {form.media_type === "icon" ? (
          <div className="mt-5 grid gap-5 md:grid-cols-3">
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
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
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
                <span className="block text-sm font-semibold text-slate-900">
                  Select step image
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  PNG, JPG, SVG or WebP. Maximum 10 MB.
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={chooseImage}
                  className="mt-4 block w-full cursor-pointer text-sm text-slate-700"
                />

                {imageFile ? (
                  <p className="mt-3 text-xs font-medium text-emerald-700">
                    Selected: {imageFile.name}
                  </p>
                ) : step.image_storage_path ? (
                  <p className="mt-3 text-xs text-slate-500">
                    Current uploaded image will remain unless another file is selected.
                  </p>
                ) : null}
              </label>
            ) : (
              <TextField
                label="Image URL"
                value={form.image_url}
                onChange={(value) => {
                  setForm((current) => ({
                    ...current,
                    image_url: value,
                    image_storage_path:
                      null,
                  }));

                  setImagePreview(value);
                  setImageFile(null);
                }}
              />
            )}

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <TextField
                label="Image Alt Text"
                value={form.image_alt}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    image_alt: value,
                  }))
                }
              />

              <NumberField
                label="Image Height"
                value={form.image_height}
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
              <div className="relative mt-5 grid min-h-52 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <Image
                  src={imagePreview}
                  alt={
                    form.image_alt ||
                    "Step image preview"
                  }
                  width={420}
                  height={260}
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
                  onClick={removeImage}
                  className="absolute right-4 top-4 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700"
                >
                  Remove Image
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Panel>

      <Panel title="Step Label Styling">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
            value={form.step_label_size}
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
      </Panel>

      <Panel title="Text Styling">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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

          <NumberField
            label="Title Weight"
            value={form.title_weight}
            min={100}
            max={900}
            step={100}
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
      </Panel>

      <Panel title="Step Card Styling">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <TextField
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

          <TextField
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

          <TextField
            label="Connector Colour"
            value={form.connector_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                connector_color: value,
              }))
            }
          />

          <NumberField
            label="Connector Width"
            value={form.connector_width}
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
            value={form.display_order}
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
      </Panel>

      <Panel title="Optional Button">
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            label="Button Text"
            value={form.button_text}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                button_text: value,
              }))
            }
          />

          <TextField
            label="Button Link"
            value={form.button_link}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                button_link: value,
              }))
            }
          />

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

          <ToggleField
            label="Open in New Tab"
            checked={
              form.button_open_in_new_tab
            }
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                button_open_in_new_tab:
                  checked,
              }))
            }
          />
        </div>
      </Panel>

      <Panel title="Visibility">
        <div className="grid gap-5 md:grid-cols-2">
          <ToggleField
            label="Active"
            checked={form.is_active}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                is_active: checked,
              }))
            }
          />

          <ToggleField
            label="Published"
            checked={form.is_published}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                is_published: checked,
              }))
            }
          />
        </div>
      </Panel>

      <Panel title="Live Preview">
        <article
          className="relative border"
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
                {form.step_label || "01"}
              </div>

              <div
                className="absolute left-1/2 top-full h-16 -translate-x-1/2"
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
                  width={340}
                  height={220}
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

              <h4
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
              </h4>

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
      </Panel>
    </form>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-lg font-bold text-slate-950">
        {title}
      </h3>

      <div className="mt-5">
        {children}
      </div>
    </section>
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

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <span className="text-sm font-semibold text-slate-900">
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-5 w-5"
      />
    </label>
  );
}
