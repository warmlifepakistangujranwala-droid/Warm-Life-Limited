"use client";

import Image from "next/image";
import {
  type ChangeEvent,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

import { createHomepageHowWeWorkGroup } from "@/lib/actions/homepage-how-we-work";
import { createClient } from "@/lib/supabase/client";

import type {
  HowWeWorkBackgroundType,
  HowWeWorkLayoutStyle,
  HowWeWorkMediaType,
  HowWeWorkShadowStyle,
} from "@/lib/types/homepage-how-we-work";

type GroupFormProps = {
  sectionId: string;
};

type ImageSource = "upload" | "url";

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

export default function GroupForm({
  sectionId,
}: GroupFormProps) {
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

  const [groupImageSource, setGroupImageSource] =
    useState<ImageSource>("upload");

  const [
    groupImageFile,
    setGroupImageFile,
  ] = useState<File | null>(null);

  const [
    groupImagePreview,
    setGroupImagePreview,
  ] = useState("");

  const [
    backgroundImageSource,
    setBackgroundImageSource,
  ] = useState<ImageSource>("upload");

  const [
    backgroundImageFile,
    setBackgroundImageFile,
  ] = useState<File | null>(null);

  const [
    backgroundImagePreview,
    setBackgroundImagePreview,
  ] = useState("");

  const [form, setForm] = useState({
    internal_name:
      "",

    title:
      "",

    subtitle:
      "",

    media_type:
      "icon" as HowWeWorkMediaType,

    icon_key:
      "building",

    icon_color:
      "#d6a824",

    icon_background_color:
      "#ffffff",

    icon_size:
      30,

    image_url:
      "",

    image_storage_path:
      null as string | null,

    image_alt:
      "Process group image",

    image_height:
      180,

    title_color:
      "#ffffff",

    title_size:
      28,

    title_weight:
      600,

    subtitle_color:
      "#d9eee5",

    subtitle_size:
      15,

    background_type:
      "solid" as HowWeWorkBackgroundType,

    background_color:
      "#0f6f4f",

    gradient_start_color:
      "#0f6f4f",

    gradient_end_color:
      "#0a4d38",

    gradient_direction:
      "145deg",

    background_image_url:
      "",

    background_image_storage_path:
      null as string | null,

    background_image_alt:
      "Process group background",

    background_overlay_color:
      "rgba(5,55,40,0.72)",

    border_color:
      "rgba(255,255,255,0.16)",

    border_width:
      1,

    card_radius:
      32,

    card_padding:
      34,

    min_height:
      520,

    shadow_style:
      "medium" as HowWeWorkShadowStyle,

    layout_style:
      "timeline" as HowWeWorkLayoutStyle,

    highlight_enabled:
      false,

    highlight_text:
      "",

    highlight_icon_key:
      "sparkles",

    highlight_text_color:
      "#17251d",

    highlight_background_color:
      "#f4cf18",

    highlight_radius:
      18,

    highlight_padding:
      18,

    display_order:
      0,

    is_active:
      true,

    is_published:
      true,
  });

  function resetForm(): void {
    setForm({
      internal_name:
        "",

      title:
        "",

      subtitle:
        "",

      media_type:
        "icon",

      icon_key:
        "building",

      icon_color:
        "#d6a824",

      icon_background_color:
        "#ffffff",

      icon_size:
        30,

      image_url:
        "",

      image_storage_path:
        null,

      image_alt:
        "Process group image",

      image_height:
        180,

      title_color:
        "#ffffff",

      title_size:
        28,

      title_weight:
        600,

      subtitle_color:
        "#d9eee5",

      subtitle_size:
        15,

      background_type:
        "solid",

      background_color:
        "#0f6f4f",

      gradient_start_color:
        "#0f6f4f",

      gradient_end_color:
        "#0a4d38",

      gradient_direction:
        "145deg",

      background_image_url:
        "",

      background_image_storage_path:
        null,

      background_image_alt:
        "Process group background",

      background_overlay_color:
        "rgba(5,55,40,0.72)",

      border_color:
        "rgba(255,255,255,0.16)",

      border_width:
        1,

      card_radius:
        32,

      card_padding:
        34,

      min_height:
        520,

      shadow_style:
        "medium",

      layout_style:
        "timeline",

      highlight_enabled:
        false,

      highlight_text:
        "",

      highlight_icon_key:
        "sparkles",

      highlight_text_color:
        "#17251d",

      highlight_background_color:
        "#f4cf18",

      highlight_radius:
        18,

      highlight_padding:
        18,

      display_order:
        0,

      is_active:
        true,

      is_published:
        true,
    });

    setGroupImageSource(
      "upload",
    );

    setGroupImageFile(
      null,
    );

    setGroupImagePreview(
      "",
    );

    setBackgroundImageSource(
      "upload",
    );

    setBackgroundImageFile(
      null,
    );

    setBackgroundImagePreview(
      "",
    );
  }

  function validateImageFile(
    file: File,
  ): string | null {
    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      return "Please select a valid image file.";
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      return "Image must be smaller than 10 MB.";
    }

    return null;
  }

  function chooseGroupImage(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError =
      validateImageFile(file);

    if (validationError) {
      setMessage(
        validationError,
      );

      setIsSuccess(false);
      event.target.value = "";

      return;
    }

    setGroupImageFile(
      file,
    );

    setGroupImagePreview(
      URL.createObjectURL(file),
    );

    setMessage("");
    setIsSuccess(false);
  }

  function chooseBackgroundImage(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError =
      validateImageFile(file);

    if (validationError) {
      setMessage(
        validationError,
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
    folder:
      | "group-media"
      | "group-backgrounds",
  ): string {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "png";

    return `homepage/how-we-work/${folder}/${crypto.randomUUID()}.${extension}`;
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (
      !form.internal_name.trim()
    ) {
      setMessage(
        "Internal group name is required.",
      );

      return;
    }

    if (!form.title.trim()) {
      setMessage(
        "Group title is required.",
      );

      return;
    }

    if (
      form.media_type === "image" &&
      groupImageSource === "url" &&
      !form.image_url.trim()
    ) {
      setMessage(
        "Please enter a group image URL.",
      );

      return;
    }

    if (
      form.media_type === "image" &&
      groupImageSource === "upload" &&
      !groupImageFile
    ) {
      setMessage(
        "Please select a group image.",
      );

      return;
    }

    if (
      form.background_type === "image" &&
      backgroundImageSource === "url" &&
      !form.background_image_url.trim()
    ) {
      setMessage(
        "Please enter a background image URL.",
      );

      return;
    }

    if (
      form.background_type === "image" &&
      backgroundImageSource === "upload" &&
      !backgroundImageFile
    ) {
      setMessage(
        "Please select a background image.",
      );

      return;
    }

    if (
      form.highlight_enabled &&
      !form.highlight_text.trim()
    ) {
      setMessage(
        "Highlight text is required when the highlight is enabled.",
      );

      return;
    }

    startTransition(async () => {
      let uploadedGroupImagePath:
        | string
        | null = null;

      let uploadedBackgroundPath:
        | string
        | null = null;

      try {
        let finalGroupImageUrl =
          form.image_url.trim() ||
          null;

        let finalGroupImageStoragePath =
          form.image_storage_path;

        let finalBackgroundImageUrl =
          form.background_image_url.trim() ||
          null;

        let finalBackgroundStoragePath =
          form.background_image_storage_path;

        if (
          form.media_type === "image" &&
          groupImageSource === "upload" &&
          groupImageFile
        ) {
          uploadedGroupImagePath =
            generateStoragePath(
              groupImageFile,
              "group-media",
            );

          const {
            error:
              groupUploadError,
          } =
            await supabase.storage
              .from(
                "website-media",
              )
              .upload(
                uploadedGroupImagePath,
                groupImageFile,
                {
                  cacheControl:
                    "3600",
                  upsert:
                    false,
                  contentType:
                    groupImageFile.type,
                },
              );

          if (
            groupUploadError
          ) {
            throw new Error(
              groupUploadError.message,
            );
          }

          const { data } =
            supabase.storage
              .from(
                "website-media",
              )
              .getPublicUrl(
                uploadedGroupImagePath,
              );

          finalGroupImageUrl =
            data.publicUrl;

          finalGroupImageStoragePath =
            uploadedGroupImagePath;
        }

        if (
          form.media_type !== "image"
        ) {
          finalGroupImageUrl =
            null;

          finalGroupImageStoragePath =
            null;
        }

        if (
          form.media_type === "image" &&
          groupImageSource === "url"
        ) {
          finalGroupImageStoragePath =
            null;
        }

        if (
          form.background_type === "image" &&
          backgroundImageSource === "upload" &&
          backgroundImageFile
        ) {
          uploadedBackgroundPath =
            generateStoragePath(
              backgroundImageFile,
              "group-backgrounds",
            );

          const {
            error:
              backgroundUploadError,
          } =
            await supabase.storage
              .from(
                "website-media",
              )
              .upload(
                uploadedBackgroundPath,
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

          if (
            backgroundUploadError
          ) {
            throw new Error(
              backgroundUploadError.message,
            );
          }

          const { data } =
            supabase.storage
              .from(
                "website-media",
              )
              .getPublicUrl(
                uploadedBackgroundPath,
              );

          finalBackgroundImageUrl =
            data.publicUrl;

          finalBackgroundStoragePath =
            uploadedBackgroundPath;
        }

        if (
          form.background_type !== "image"
        ) {
          finalBackgroundImageUrl =
            null;

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
          await createHomepageHowWeWorkGroup(
            {
              section_id:
                sectionId,

              internal_name:
                form.internal_name.trim(),

              title:
                form.title.trim(),

              subtitle:
                form.subtitle.trim() ||
                null,

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
                finalGroupImageUrl,

              image_storage_path:
                finalGroupImageStoragePath,

              image_alt:
                form.image_alt.trim() ||
                "Process group image",

              image_height:
                Number(
                  form.image_height,
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

              subtitle_color:
                form.subtitle_color,

              subtitle_size:
                Number(
                  form.subtitle_size,
                ),

              background_type:
                form.background_type,

              background_color:
                form.background_color,

              gradient_start_color:
                form.gradient_start_color,

              gradient_end_color:
                form.gradient_end_color,

              gradient_direction:
                form.gradient_direction.trim() ||
                "145deg",

              background_image_url:
                finalBackgroundImageUrl,

              background_image_storage_path:
                finalBackgroundStoragePath,

              background_image_alt:
                form.background_image_alt.trim() ||
                "Process group background",

              background_overlay_color:
                form.background_overlay_color.trim() ||
                "rgba(5,55,40,0.72)",

              border_color:
                form.border_color,

              border_width:
                Number(
                  form.border_width,
                ),

              card_radius:
                Number(
                  form.card_radius,
                ),

              card_padding:
                Number(
                  form.card_padding,
                ),

              min_height:
                Number(
                  form.min_height,
                ),

              shadow_style:
                form.shadow_style,

              layout_style:
                form.layout_style,

              highlight_enabled:
                form.highlight_enabled,

              highlight_text:
                form.highlight_enabled
                  ? form.highlight_text.trim()
                  : null,

              highlight_icon_key:
                form.highlight_icon_key,

              highlight_text_color:
                form.highlight_text_color,

              highlight_background_color:
                form.highlight_background_color,

              highlight_radius:
                Number(
                  form.highlight_radius,
                ),

              highlight_padding:
                Number(
                  form.highlight_padding,
                ),

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
          "Process group added successfully.",
        );

        resetForm();
        router.refresh();
      } catch (error) {
        const pathsToRemove = [
          uploadedGroupImagePath,
          uploadedBackgroundPath,
        ].filter(
          (path): path is string =>
            Boolean(path),
        );

        if (
          pathsToRemove.length > 0
        ) {
          await supabase.storage
            .from(
              "website-media",
            )
            .remove(
              pathsToRemove,
            );
        }

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to create process group.",
        );

        setIsSuccess(false);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">
            Add Process Group
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            Create a reusable process
            journey for any audience.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? "Adding..."
            : "Add Group"}
        </button>
      </div>

      {message ? (
        <div
          className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${
            isSuccess
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Group Content
        </h4>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Internal Name
            </span>

            <input
              value={
                form.internal_name
              }
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,

                    internal_name:
                      event.target.value,
                  }),
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Partner Journey"
            />

            <span className="mt-1 block text-xs text-slate-500">
              Used inside the admin panel only.
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Public Title
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
              placeholder="For delivery partners"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-slate-900">
              Subtitle
            </span>

            <textarea
              rows={3}
              value={
                form.subtitle
              }
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,

                    subtitle:
                      event.target.value,
                  }),
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="A short explanation of this process journey."
            />
          </label>
        </div>
      </section>
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Group Media
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
              <option value="icon">
                Icon
              </option>

              <option value="image">
                Image
              </option>

              <option value="none">
                No Media
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
                <option value="building">
                  Building
                </option>

                <option value="home">
                  Home
                </option>

                <option value="users">
                  Users
                </option>

                <option value="wrench">
                  Wrench
                </option>

                <option value="route">
                  Route
                </option>

                <option value="sparkles">
                  Sparkles
                </option>

                <option value="shield">
                  Shield
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
              min={12}
              max={100}
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
                  setGroupImageSource(
                    "upload",
                  );

                  setMessage("");
                  setIsSuccess(false);
                }}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  groupImageSource ===
                  "upload"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                Upload from Computer
              </button>

              <button
                type="button"
                onClick={() => {
                  setGroupImageSource(
                    "url",
                  );

                  setGroupImageFile(
                    null,
                  );

                  setGroupImagePreview(
                    form.image_url,
                  );

                  setMessage("");
                  setIsSuccess(false);
                }}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  groupImageSource === "url"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                Use Direct URL
              </button>
            </div>

            {groupImageSource ===
            "upload" ? (
              <label className="mt-5 block rounded-xl border border-dashed border-slate-300 bg-white p-5">
                <span className="block text-sm font-semibold text-slate-900">
                  Select group image
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  PNG, JPG, SVG or WebP.
                  Maximum 10 MB.
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={
                    chooseGroupImage
                  }
                  className="mt-4 block w-full cursor-pointer text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-800"
                />

                {groupImageFile ? (
                  <p className="mt-3 text-xs font-medium text-emerald-700">
                    Selected:{" "}
                    {
                      groupImageFile.name
                    }
                  </p>
                ) : null}
              </label>
            ) : (
              <label className="mt-5 block">
                <span className="text-sm font-semibold text-slate-900">
                  Group Image URL
                </span>

                <input
                  type="url"
                  value={form.image_url}
                  onChange={(event) => {
                    const value =
                      event.target.value;

                    setForm(
                      (current) => ({
                        ...current,
                        image_url:
                          value,
                        image_storage_path:
                          null,
                      }),
                    );

                    setGroupImagePreview(
                      value,
                    );

                    setGroupImageFile(
                      null,
                    );
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                  placeholder="https://example.com/group-image.png"
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
                    setForm(
                      (current) => ({
                        ...current,
                        image_alt:
                          event.target.value,
                      }),
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                />
              </label>

              <NumberField
                label="Image Height"
                value={
                  form.image_height
                }
                min={60}
                max={500}
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      image_height:
                        Number(value),
                    }),
                  )
                }
              />
            </div>

            {groupImagePreview ? (
              <div className="relative mt-5 grid min-h-56 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
                <Image
                  src={
                    groupImagePreview
                  }
                  alt={
                    form.image_alt ||
                    "Group image preview"
                  }
                  width={500}
                  height={320}
                  className="max-w-full object-contain"
                  style={{
                    maxHeight: `${form.image_height}px`,
                  }}
                  unoptimized={
                    groupImagePreview.startsWith(
                      "blob:",
                    ) ||
                    groupImagePreview
                      .toLowerCase()
                      .includes(".svg")
                  }
                />

                <button
                  type="button"
                  onClick={() => {
                    setGroupImageFile(
                      null,
                    );

                    setGroupImagePreview(
                      "",
                    );

                    setForm(
                      (current) => ({
                        ...current,
                        image_url:
                          "",
                        image_storage_path:
                          null,
                      }),
                    );
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

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Typography
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
            min={14}
            max={70}
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
            label="Subtitle Colour"
            value={
              form.subtitle_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                subtitle_color:
                  value,
              }))
            }
          />

          <NumberField
            label="Subtitle Size"
            value={
              form.subtitle_size
            }
            min={10}
            max={36}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                subtitle_size:
                  Number(value),
              }))
            }
          />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Group Background
        </h4>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Background Type
            </span>

            <select
              value={
                form.background_type
              }
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

          {form.background_type ===
          "solid" ? (
            <ColourField
              label="Background Colour"
              value={
                form.background_color
              }
              onChange={(value) =>
                setForm(
                  (current) => ({
                    ...current,
                    background_color:
                      value,
                  }),
                )
              }
            />
          ) : null}

          {form.background_type ===
          "gradient" ? (
            <>
              <ColourField
                label="Gradient Start"
                value={
                  form.gradient_start_color
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      gradient_start_color:
                        value,
                    }),
                  )
                }
              />

              <ColourField
                label="Gradient End"
                value={
                  form.gradient_end_color
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      gradient_end_color:
                        value,
                    }),
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
                    setForm(
                      (current) => ({
                        ...current,
                        gradient_direction:
                          event.target.value,
                      }),
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                  placeholder="145deg"
                />
              </label>
            </>
          ) : null}
        </div>

        {form.background_type ===
        "image" ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setBackgroundImageSource(
                    "upload",
                  );

                  setMessage("");
                  setIsSuccess(false);
                }}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  backgroundImageSource ===
                  "upload"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                Upload Background
              </button>

              <button
                type="button"
                onClick={() => {
                  setBackgroundImageSource(
                    "url",
                  );

                  setBackgroundImageFile(
                    null,
                  );

                  setBackgroundImagePreview(
                    form.background_image_url,
                  );

                  setMessage("");
                  setIsSuccess(false);
                }}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  backgroundImageSource ===
                  "url"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                Use Background URL
              </button>
            </div>

            {backgroundImageSource ===
            "upload" ? (
              <label className="mt-5 block rounded-xl border border-dashed border-slate-300 bg-white p-5">
                <span className="block text-sm font-semibold text-slate-900">
                  Select background image
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={
                    chooseBackgroundImage
                  }
                  className="mt-4 block w-full cursor-pointer text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-800"
                />
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

                    setForm(
                      (current) => ({
                        ...current,
                        background_image_url:
                          value,
                        background_image_storage_path:
                          null,
                      }),
                    );

                    setBackgroundImagePreview(
                      value,
                    );

                    setBackgroundImageFile(
                      null,
                    );
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                />
              </label>
            )}

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">
                  Background Alt Text
                </span>

                <input
                  value={
                    form.background_image_alt
                  }
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        background_image_alt:
                          event.target.value,
                      }),
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-900">
                  Overlay Colour
                </span>

                <input
                  value={
                    form.background_overlay_color
                  }
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        background_overlay_color:
                          event.target.value,
                      }),
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                  placeholder="rgba(5,55,40,0.72)"
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
                    "Group background preview"
                  }
                  width={1000}
                  height={500}
                  className="h-64 w-full object-cover"
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
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Card Layout
        </h4>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ColourField
            label="Border Colour"
            value={
              form.border_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                border_color: value,
              }))
            }
          />

          <NumberField
            label="Border Width"
            value={
              form.border_width
            }
            min={0}
            max={10}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                border_width:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Card Radius"
            value={
              form.card_radius
            }
            min={0}
            max={100}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                card_radius:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Card Padding"
            value={
              form.card_padding
            }
            min={12}
            max={100}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                card_padding:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Minimum Height"
            value={
              form.min_height
            }
            min={220}
            max={1000}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                min_height:
                  Number(value),
              }))
            }
          />

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Shadow Style
            </span>

            <select
              value={form.shadow_style}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  shadow_style:
                    event.target
                      .value as HowWeWorkShadowStyle,
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value="none">
                None
              </option>

              <option value="soft">
                Soft
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="strong">
                Strong
              </option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Steps Layout
            </span>

            <select
              value={form.layout_style}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  layout_style:
                    event.target
                      .value as HowWeWorkLayoutStyle,
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value="timeline">
                Timeline
              </option>

              <option value="cards">
                Cards
              </option>

              <option value="numbered-list">
                Numbered List
              </option>
            </select>
          </label>

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

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Highlight Box
        </h4>

        <label className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
          <span>
            <span className="block text-sm font-semibold text-slate-900">
              Enable Highlight
            </span>

            <span className="mt-1 block text-xs text-slate-500">
              Show an optional message at the
              bottom of this group.
            </span>
          </span>

          <input
            type="checkbox"
            checked={
              form.highlight_enabled
            }
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                highlight_enabled:
                  event.target.checked,
              }))
            }
            className="h-5 w-5"
          />
        </label>

        {form.highlight_enabled ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <label className="block md:col-span-2 xl:col-span-3">
              <span className="text-sm font-semibold text-slate-900">
                Highlight Text
              </span>

              <input
                value={
                  form.highlight_text
                }
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    highlight_text:
                      event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                Highlight Icon
              </span>

              <select
                value={
                  form.highlight_icon_key
                }
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    highlight_icon_key:
                      event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >
                <option value="sparkles">
                  Sparkles
                </option>

                <option value="home">
                  Home
                </option>

                <option value="check">
                  Check
                </option>

                <option value="leaf">
                  Leaf
                </option>
              </select>
            </label>

            <ColourField
              label="Highlight Text Colour"
              value={
                form.highlight_text_color
              }
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  highlight_text_color:
                    value,
                }))
              }
            />

            <ColourField
              label="Highlight Background"
              value={
                form.highlight_background_color
              }
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  highlight_background_color:
                    value,
                }))
              }
            />

            <NumberField
              label="Highlight Radius"
              value={
                form.highlight_radius
              }
              min={0}
              max={100}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  highlight_radius:
                    Number(value),
                }))
              }
            />

            <NumberField
              label="Highlight Padding"
              value={
                form.highlight_padding
              }
              min={6}
              max={60}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  highlight_padding:
                    Number(value),
                }))
              }
            />
          </div>
        ) : null}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
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
                Disable this group without deleting it.
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
                Show this group on the live homepage.
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

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Live Preview
        </h4>

        <article
          className="relative mt-5 overflow-hidden"
          style={{
            background:
              form.background_type ===
              "gradient"
                ? `linear-gradient(${form.gradient_direction}, ${form.gradient_start_color}, ${form.gradient_end_color})`
                : form.background_color,
            borderColor:
              form.border_color,
            borderWidth: `${form.border_width}px`,
            borderStyle: "solid",
            borderRadius: `${form.card_radius}px`,
            padding: `${form.card_padding}px`,
            minHeight: `${form.min_height}px`,
            boxShadow:
              form.shadow_style ===
              "strong"
                ? "0 30px 70px rgba(23,37,29,0.24)"
                : form.shadow_style ===
                    "medium"
                  ? "0 22px 50px rgba(23,37,29,0.16)"
                  : form.shadow_style ===
                      "soft"
                    ? "0 14px 34px rgba(23,37,29,0.10)"
                    : "none",
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
                  "Group background"
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
                    form.background_overlay_color,
                }}
              />
            </>
          ) : null}

          <div className="relative z-10">
            {form.media_type ===
              "image" &&
            groupImagePreview ? (
              <Image
                src={
                  groupImagePreview
                }
                alt={
                  form.image_alt ||
                  "Group image"
                }
                width={420}
                height={280}
                className="mb-6 w-auto object-contain"
                style={{
                  height: `${form.image_height}px`,
                }}
                unoptimized={
                  groupImagePreview.startsWith(
                    "blob:",
                  ) ||
                  groupImagePreview
                    .toLowerCase()
                    .includes(".svg")
                }
              />
            ) : form.media_type ===
              "icon" ? (
              <div
                className="mb-5 grid place-items-center rounded-2xl"
                style={{
                  width: `${Math.max(
                    form.icon_size +
                      28,
                    58,
                  )}px`,
                  height: `${Math.max(
                    form.icon_size +
                      28,
                    58,
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
                "Group title"}
            </h5>

            {form.subtitle ? (
              <p
                className="mt-3 max-w-2xl leading-7"
                style={{
                  color:
                    form.subtitle_color,
                  fontSize: `${form.subtitle_size}px`,
                }}
              >
                {form.subtitle}
              </p>
            ) : null}

            {form.highlight_enabled ? (
              <div
                className="mt-8"
                style={{
                  color:
                    form.highlight_text_color,
                  backgroundColor:
                    form.highlight_background_color,
                  borderRadius: `${form.highlight_radius}px`,
                  padding: `${form.highlight_padding}px`,
                }}
              >
                {form.highlight_text ||
                  "Highlight message"}
              </div>
            ) : null}
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