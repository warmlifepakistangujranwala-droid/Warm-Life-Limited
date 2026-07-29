"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import {
  createHomepageService,
  replaceHomepageServiceBullets,
  updateHomepageService,
} from "@/lib/actions/homepage-service";

import type {
  CreateHomepageServiceInput,
  HomepageService,
} from "@/lib/types/homepage-service";
import { createClient } from "@/lib/supabase/client";

import BasicInformationCard from "./BasicInformationCard";
import BulletsCard from "./BulletsCard";
import ButtonCard from "./ButtonCard";
import StatusCard from "./StatusCard";
import TypographyCard from "./TypographyCard";

import {
  getDefaultServiceBullets,
  getDefaultServiceFormValues,
  type ServiceFormBullet,
  type ServiceFormProps,
  type ServiceFormValues,
} from "./service-form.types";

interface FormMessage {
  type: "success" | "error";
  text: string;
}

const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
type MediaSource = "upload" | "url";

function normalizeOptionalText(value: string): string | null {
  const normalizedValue = value.trim();

  return normalizedValue.length > 0
    ? normalizedValue
    : null;
}

function normalizeRequiredText(value: string): string {
  return value.trim();
}

function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidInternalOrExternalLink(value: string): boolean {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return true;
  }

  if (
    normalizedValue.startsWith("/") ||
    normalizedValue.startsWith("#")
  ) {
    return true;
  }

  try {
    const url = new URL(normalizedValue);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateForm(
  form: ServiceFormValues,
  bullets: ServiceFormBullet[],
  hasVideoFile = false,
  hasImageFile = false,
): string | null {
  if (!form.service_name.trim()) {
    return "Service name is required.";
  }

  if (!form.title.trim()) {
    return "Service title is required.";
  }

  if (!form.slug.trim()) {
    return "Service slug is required.";
  }

  if (form.display_order < 0) {
    return "Display order cannot be less than zero.";
  }

  if (
    form.media_type === "video" &&
    !form.video_url.trim() &&
    !hasVideoFile
  ) {
    return "Upload a video or add a direct video URL.";
  }

  if (
    form.media_type === "image" &&
    !form.image_url.trim() &&
    !hasImageFile
  ) {
    return "Upload an image or add a direct image URL.";
  }

  if (
    form.button_text.trim() &&
    !form.button_link.trim()
  ) {
    return "Add a button link or remove the button text.";
  }

  if (
    form.button_link.trim() &&
    !form.button_text.trim()
  ) {
    return "Add button text or remove the button link.";
  }

  if (
    form.button_link.trim() &&
    !isValidInternalOrExternalLink(form.button_link)
  ) {
    return "Button link must be an internal path or a valid HTTP/HTTPS URL.";
  }

  const hasEmptyBullet = bullets.some(
    (bullet) => !bullet.bullet_text.trim(),
  );

  if (hasEmptyBullet) {
    return "Remove empty bullets or enter text for every bullet.";
  }

  return null;
}

function createServicePayload(
  form: ServiceFormValues,
): CreateHomepageServiceInput {
  return {
    section_id: form.section_id,

    display_order: form.display_order,
    display_number: normalizeOptionalText(
      form.display_number,
    ),

    service_name: normalizeRequiredText(
      form.service_name,
    ),
    slug: normalizeSlug(form.slug),
    eyebrow: normalizeOptionalText(form.eyebrow),
    title: normalizeRequiredText(form.title),
    description: normalizeOptionalText(
      form.description,
    ),

    media_type: form.media_type,
    video_url:
      form.media_type === "video"
        ? normalizeRequiredText(form.video_url)
        : null,
    video_poster_url:
      form.media_type === "video"
        ? normalizeOptionalText(
            form.video_poster_url,
          )
        : null,
    image_url:
      form.media_type === "image"
        ? normalizeRequiredText(form.image_url)
        : null,
    object_position: form.object_position,

    service_name_color:
      form.service_name_color,
    service_name_size:
      form.service_name_size,
    service_name_weight:
      form.service_name_weight,

    eyebrow_color: form.eyebrow_color,
    eyebrow_size: form.eyebrow_size,

    title_color: form.title_color,
    title_size: form.title_size,
    title_weight: form.title_weight,

    description_color:
      form.description_color,
    description_size:
      form.description_size,

    bullet_color: form.bullet_color,
    bullet_size: form.bullet_size,

    button_text: normalizeOptionalText(
      form.button_text,
    ),
    button_link: normalizeOptionalText(
      form.button_link,
    ),
    open_in_new_tab:
      form.open_in_new_tab,

    button_background_color:
      form.button_background_color,
    button_text_color:
      form.button_text_color,
    button_radius: form.button_radius,
    button_size: form.button_size,

    is_active: form.is_active,
    is_published: form.is_published,
  };
}

function createUpdatePayload(
  form: ServiceFormValues,
): Partial<CreateHomepageServiceInput> {
  return createServicePayload(form);
}
function getActionErrorMessage(
  errors: unknown,
  fallback: string,
): string {
  if (typeof errors === "string" && errors.trim()) {
    return errors;
  }

  if (Array.isArray(errors)) {
    const messages = errors.filter(
      (error): error is string =>
        typeof error === "string" && error.trim().length > 0,
    );

    if (messages.length > 0) {
      return messages.join(", ");
    }
  }

  if (errors && typeof errors === "object") {
    const messages = Object.values(errors)
      .flatMap((value) =>
        Array.isArray(value) ? value : [value],
      )
      .filter(
        (value): value is string =>
          typeof value === "string" &&
          value.trim().length > 0,
      );

    if (messages.length > 0) {
      return messages.join(", ");
    }
  }

  return fallback;
}

export default function ServiceForm({
  mode,
  service,
}: ServiceFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isPending, startTransition] =
    useTransition();

  const [mediaSource, setMediaSource] =
    useState<MediaSource>("upload");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [posterPreview, setPosterPreview] = useState("");

  const [form, setForm] =
    useState<ServiceFormValues>(() =>
      getDefaultServiceFormValues(service),
    );

  const [bullets, setBullets] = useState<
    ServiceFormBullet[]
  >(() => getDefaultServiceBullets(service));

  const [message, setMessage] =
    useState<FormMessage | null>(null);

  const [hasSubmitted, setHasSubmitted] =
    useState(false);

  const isEditMode = mode === "edit";

  const pageTitle = isEditMode
    ? "Edit Service"
    : "Create Service";

  const submitLabel = isEditMode
    ? "Save Changes"
    : "Create Service";

  const cancelHref =
    "/admin/website/homepage/services";

  const updateField = useCallback(
    <K extends keyof ServiceFormValues>(
      field: K,
      value: ServiceFormValues[K],
    ): void => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: value,
      }));

      setMessage(null);
    },
    [],
  );

  useEffect(() => {
    return () => {
      [videoPreview, imagePreview, posterPreview].forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [videoPreview, imagePreview, posterPreview]);

  function selectFile(
    event: ChangeEvent<HTMLInputElement>,
    kind: "video" | "image" | "poster",
  ): void {
    const file = event.target.files?.[0];
    if (!file) return;

    const isVideo = kind === "video";
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    const validType = isVideo
      ? file.type.startsWith("video/")
      : file.type.startsWith("image/");

    if (!validType) {
      setMessage({
        type: "error",
        text: isVideo
          ? "Please select a valid video file."
          : "Please select a valid image file.",
      });
      event.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setMessage({
        type: "error",
        text: isVideo
          ? "Video must be smaller than 100 MB."
          : "Image must be smaller than 10 MB.",
      });
      event.target.value = "";
      return;
    }

    const preview = URL.createObjectURL(file);
    setMessage(null);

    if (kind === "video") {
      setVideoFile(file);
      setVideoPreview(preview);
    } else if (kind === "image") {
      setImageFile(file);
      setImagePreview(preview);
    } else {
      setPosterFile(file);
      setPosterPreview(preview);
    }
  }

  function createStoragePath(file: File, folder: string): string {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "file";

    return `homepage/services/${folder}/${crypto.randomUUID()}.${extension}`;
  }

  async function uploadFile(file: File, folder: string) {
    const storagePath = createStoragePath(file, folder);
    const { error } = await supabase.storage
      .from("website-media")
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage
      .from("website-media")
      .getPublicUrl(storagePath);

    return { publicUrl: data.publicUrl, storagePath };
  }

  async function removeUploadedFile(path: string | null): Promise<void> {
    if (!path) return;
    await supabase.storage.from("website-media").remove([path]);
  }

  const normalizedBullets = useMemo(
    () =>
      bullets.map((bullet, index) => ({
        id: bullet.id,
        bullet_text: bullet.bullet_text.trim(),
        display_order: index + 1,
      })),
    [bullets],
  );

  const formError = useMemo(
    () =>
      validateForm(
        form,
        bullets,
        Boolean(videoFile),
        Boolean(imageFile),
      ),
    [form, bullets, videoFile, imageFile],
  );

  const isSubmitDisabled =
    isPending || Boolean(formError && hasSubmitted);
      async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setHasSubmitted(true);
    setMessage(null);

    const validationError = validateForm(
      form,
      bullets,
      Boolean(videoFile),
      Boolean(imageFile),
    );

    if (validationError) {
      setMessage({
        type: "error",
        text: validationError,
      });

      return;
    }

    startTransition(async () => {
      let uploadedVideoPath: string | null = null;
      let uploadedImagePath: string | null = null;
      let uploadedPosterPath: string | null = null;

      try {
        let formForSave = { ...form };

        if (form.media_type === "video" && videoFile) {
          const uploaded = await uploadFile(videoFile, "videos");
          uploadedVideoPath = uploaded.storagePath;
          formForSave = {
            ...formForSave,
            video_url: uploaded.publicUrl,
            image_url: "",
          };
        }

        if (form.media_type === "image" && imageFile) {
          const uploaded = await uploadFile(imageFile, "images");
          uploadedImagePath = uploaded.storagePath;
          formForSave = {
            ...formForSave,
            image_url: uploaded.publicUrl,
            video_url: "",
            video_poster_url: "",
          };
        }

        if (form.media_type === "video" && posterFile) {
          const uploaded = await uploadFile(posterFile, "posters");
          uploadedPosterPath = uploaded.storagePath;
          formForSave = {
            ...formForSave,
            video_poster_url: uploaded.publicUrl,
          };
        }

        let serviceId: string;

        if (isEditMode) {
          if (!service) {
            throw new Error(
              "Unable to find the service being edited.",
            );
          }

          const updateResult =
  await updateHomepageService(
    service.id,
    createUpdatePayload(formForSave),
  );

if (!updateResult.success) {
  throw new Error(
    getActionErrorMessage(
      updateResult.errors,
      "Failed to update the service.",
    ),
  );
}

          serviceId = service.id;
        } else {
          const createResult =
            await createHomepageService(
              createServicePayload(formForSave),
            );

          if (
            !createResult.success ||
            !createResult.data
          ) {
            throw new Error(
  getActionErrorMessage(
    createResult.errors,
    "Failed to create the service.",
  ),
);
          }

          serviceId = createResult.data.id;
        }

        const bulletResult =
          await replaceHomepageServiceBullets(
            serviceId,
            normalizedBullets,
          );

        if (!bulletResult.success) {
          throw new Error(
  getActionErrorMessage(
    bulletResult.errors,
    "Failed to save service bullets.",
  ),
);
        }

        setMessage({
          type: "success",
          text: isEditMode
            ? "Service updated successfully."
            : "Service created successfully.",
        });

        if (!isEditMode) {
          setForm(
            getDefaultServiceFormValues(),
          );

          setBullets([]);

          setHasSubmitted(false);
        }

        router.refresh();

        if (!isEditMode) {
          setTimeout(() => {
            router.push(
              "/admin/website/homepage/services",
            );
          }, 700);
        }
      } catch (error) {
        await Promise.all([
          removeUploadedFile(uploadedVideoPath),
          removeUploadedFile(uploadedImagePath),
          removeUploadedFile(uploadedPosterPath),
        ]);

        setMessage({
          type: "error",
          text:
            error instanceof Error
              ? error.message
              : "Something went wrong.",
        });
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            {pageTitle}
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Manage homepage service content,
            media, typography and call-to-action.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={cancelHref}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? "Saving..."
              : submitLabel}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-xl border px-5 py-4 text-sm font-medium ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {formError && hasSubmitted && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
          {formError}
        </div>
      )}
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-8">
          <BasicInformationCard
            form={form}
            updateField={updateField}
            disabled={isPending}
          />

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">Media</h2>
            <p className="mt-2 text-sm text-slate-600">
              Upload a file from your computer or use a direct media URL.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMediaSource("upload")}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                  mediaSource === "upload"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 text-slate-700"
                }`}
              >
                Upload from computer
              </button>
              <button
                type="button"
                onClick={() => setMediaSource("url")}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                  mediaSource === "url"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 text-slate-700"
                }`}
              >
                Use direct URL
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => updateField("media_type", "video")}
                className={`rounded-xl border px-4 py-3 text-left ${
                  form.media_type === "video"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-slate-300"
                }`}
              >
                <strong>Video</strong>
                <span className="mt-1 block text-xs text-slate-500">MP4, WebM or MOV</span>
              </button>
              <button
                type="button"
                onClick={() => updateField("media_type", "image")}
                className={`rounded-xl border px-4 py-3 text-left ${
                  form.media_type === "image"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-slate-300"
                }`}
              >
                <strong>Image</strong>
                <span className="mt-1 block text-xs text-slate-500">JPG, PNG or WebP</span>
              </button>
            </div>

            {mediaSource === "upload" ? (
              <div className="mt-5 space-y-5">
                {form.media_type === "video" ? (
                  <>
                    <label className="block rounded-xl border border-dashed border-slate-300 p-5">
                      <span className="block font-semibold text-slate-900">Upload service video</span>
                      <span className="mt-1 block text-xs text-slate-500">Maximum 100 MB</span>
                      <input
                        className="mt-4 block w-full text-sm"
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={(event) => selectFile(event, "video")}
                        disabled={isPending}
                      />
                    </label>
                    {(videoPreview || form.video_url) && (
                      <video
                        className="max-h-80 w-full rounded-xl bg-black object-contain"
                        src={videoPreview || form.video_url}
                        poster={posterPreview || form.video_poster_url || undefined}
                        controls
                        muted
                        playsInline
                      />
                    )}
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-900">Optional poster image</span>
                      <input
                        className="mt-2 block w-full text-sm"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => selectFile(event, "poster")}
                        disabled={isPending}
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <label className="block rounded-xl border border-dashed border-slate-300 p-5">
                      <span className="block font-semibold text-slate-900">Upload service image</span>
                      <span className="mt-1 block text-xs text-slate-500">Maximum 10 MB</span>
                      <input
                        className="mt-4 block w-full text-sm"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => selectFile(event, "image")}
                        disabled={isPending}
                      />
                    </label>
                    {(imagePreview || form.image_url) && (
                      <img
                        className="max-h-80 w-full rounded-xl object-cover"
                        src={imagePreview || form.image_url}
                        alt="Service preview"
                      />
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {form.media_type === "video" ? (
                  <>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-900">Direct video URL</span>
                      <input
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                        value={form.video_url}
                        onChange={(event) => updateField("video_url", event.target.value)}
                        placeholder="https://.../video.mp4"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-900">Poster image URL</span>
                      <input
                        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                        value={form.video_poster_url}
                        onChange={(event) => updateField("video_poster_url", event.target.value)}
                        placeholder="https://.../poster.jpg"
                      />
                    </label>
                  </>
                ) : (
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-900">Direct image URL</span>
                    <input
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                      value={form.image_url}
                      onChange={(event) => updateField("image_url", event.target.value)}
                      placeholder="https://.../image.jpg"
                    />
                  </label>
                )}
              </div>
            )}

            <label className="mt-5 block">
              <span className="text-sm font-semibold text-slate-900">Media position</span>
              <select
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                value={form.object_position}
                onChange={(event) => updateField("object_position", event.target.value as ServiceFormValues["object_position"])}
              >
                <option value="center">Center</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </label>
          </section>

          <ButtonCard
            form={form}
            updateField={updateField}
            disabled={isPending}
          />

          <TypographyCard
            form={form}
            updateField={updateField}
            disabled={isPending}
          />

          <BulletsCard
            bullets={bullets}
            setBullets={setBullets}
            disabled={isPending}
          />
        </div>

        <aside className="space-y-8 xl:sticky xl:top-6 xl:self-start">
          <StatusCard
            form={form}
            updateField={updateField}
            disabled={isPending}
          />

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">
              Save service
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review the service details before saving. Empty optional
              fields will be stored as null.
            </p>

            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Mode</span>

                <span className="font-semibold text-slate-900">
                  {isEditMode ? "Edit" : "Create"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span>Media</span>

                <span className="font-semibold capitalize text-slate-900">
                  {form.media_type}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span>Bullets</span>

                <span className="font-semibold text-slate-900">
                  {bullets.length}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span>Status</span>

                <span className="font-semibold text-slate-900">
                  {form.is_published ? "Published" : "Draft"}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Saving..." : submitLabel}
              </button>

              <Link
                href={cancelHref}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}