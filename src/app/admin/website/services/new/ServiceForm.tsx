/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/services/new/ServiceForm.tsx
 *
 * Purpose :
 * Provides the Add Service form with Supabase media uploads,
 * automatic slug generation and optional detail-page controls.
 *
 * Version : v1.3.2
 * ============================================================
 */

"use client";

import {
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Save,
  Upload,
  X,
} from "lucide-react";

import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  createService,
  updateService,
} from "@/lib/actions/services-page";

import { createClient } from "@/lib/supabase/client";

import type {
  CreateServiceInput,
  Service,
  ServiceDetailHeroType,
} from "@/lib/types/services-page";

type MediaKey =
  | "featured"
  | "detailImage"
  | "detailVideo"
  | "detailPoster";

type MediaSource =
  | "upload"
  | "url";

type Message = {
  type: "success" | "error";
  text: string;
} | null;

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

const MAX_VIDEO_SIZE =
  100 * 1024 * 1024;

const INITIAL_FORM: CreateServiceInput = {
  internal_name: "",
  service_name: "",
  slug: "",

  eyebrow: "",
  short_description: "",
  full_description: "",

  featured_image_url: null,
  featured_image_storage_path: null,
  featured_image_alt: "",

  icon_name: "Settings",

  has_detail_page: false,
  show_explore_button: true,

  explore_button_text:
    "Explore Service",

  custom_button_link: null,
  open_in_new_tab: false,

  card_background_color: null,
  card_heading_color: null,
  card_text_color: null,
  card_button_background_color: null,
  card_button_text_color: null,
  card_button_radius: null,

  detail_hero_type: "image",
  detail_hero_image_url: null,
  detail_hero_image_storage_path: null,
  detail_hero_image_alt: "",

  detail_hero_video_url: null,
  detail_hero_video_storage_path: null,

  detail_hero_poster_url: null,
  detail_hero_poster_storage_path: null,
  detail_hero_poster_alt: "",

  detail_hero_eyebrow: "",
  detail_hero_heading: "",
  detail_hero_description: "",

  detail_hero_heading_size: 88,
  detail_hero_heading_size_mobile: 48,
  detail_section_heading_size: 54,
  detail_section_heading_size_mobile: 36,
  detail_card_heading_size: 24,
  detail_cta_heading_size: 58,

  who_is_it_for_enabled: false,
  who_is_it_for_heading:
    "Who This Service Is For",
  who_is_it_for_content: "",

  benefits_enabled: false,
  benefits_heading: "Key Benefits",

  process_enabled: false,
  process_heading:
    "How the Process Works",

  gallery_enabled: false,

  cta_enabled: false,
  cta_heading: "",
  cta_description: "",
  cta_button_text:
    "Contact Warm Life",
  cta_button_link: "/contact",
  cta_button_open_in_new_tab: false,

  is_featured: false,
  display_order: 0,
  is_active: true,
  is_published: false,
};

type ServiceFormProps = {
  initialService?: Service;
  detailManagers?: {
    benefits?: ReactNode;
    process?: ReactNode;
    gallery?: ReactNode;
  };
};

function getInitialForm(
  service?: Service,
): CreateServiceInput {
  if (!service) {
    return { ...INITIAL_FORM };
  }

  return {
    ...INITIAL_FORM,
    ...service,
    internal_name:
      service.internal_name ??
      service.service_name ??
      "",
    service_name:
      service.service_name ?? "",
    slug:
      service.slug ?? "",
    eyebrow:
      service.eyebrow ?? "",
    short_description:
      service.short_description ?? "",
    full_description:
      service.full_description ?? "",
    featured_image_url:
      service.featured_image_url ?? null,
    featured_image_storage_path:
      service.featured_image_storage_path ?? null,
    detail_hero_image_url:
      service.detail_hero_image_url ?? null,
    detail_hero_image_storage_path:
      service.detail_hero_image_storage_path ?? null,
    detail_hero_video_url:
      service.detail_hero_video_url ?? null,
    detail_hero_video_storage_path:
      service.detail_hero_video_storage_path ?? null,
    detail_hero_poster_url:
      service.detail_hero_poster_url ?? null,
    detail_hero_poster_storage_path:
      service.detail_hero_poster_storage_path ?? null,
  };
}
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ServiceForm({
  initialService,
  detailManagers,
}: ServiceFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const isEditing =
    Boolean(initialService?.id);

  const [form, setForm] =
    useState<CreateServiceInput>(
      () =>
        getInitialForm(
          initialService,
        ),
    );

  const [slugEdited, setSlugEdited] =
    useState(false);


  const [files, setFiles] =
    useState<
      Partial<Record<MediaKey, File>>
    >({});

  const [sources, setSources] =
    useState<
      Record<MediaKey, MediaSource>
    >(() => ({
      featured:
        initialService
          ?.featured_image_url
          ? "url"
          : "upload",

      detailImage:
        initialService
          ?.detail_hero_image_url
          ? "url"
          : "upload",

      detailVideo:
        initialService
          ?.detail_hero_video_url
          ? "url"
          : "upload",

      detailPoster:
        initialService
          ?.detail_hero_poster_url
          ? "url"
          : "upload",
    }));

  const [previews, setPreviews] =
    useState<
      Record<MediaKey, string>
    >(() => ({
      featured:
        initialService
          ?.featured_image_url ??
        "",

      detailImage:
        initialService
          ?.detail_hero_image_url ??
        "",

      detailVideo:
        initialService
          ?.detail_hero_video_url ??
        "",

      detailPoster:
        initialService
          ?.detail_hero_poster_url ??
        "",
    }));

  const [message, setMessage] =
    useState<Message>(null);

  const [isSaving, setIsSaving] =
    useState(false);

  const [submitMode, setSubmitMode] =
    useState<"draft" | "publish">(
      "draft",
    );

  function updateField<
    K extends keyof CreateServiceInput,
  >(
    field: K,
    value: CreateServiceInput[K],
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage(null);
  }

  function handleServiceName(
    value: string,
  ): void {
    setForm((current) => ({
      ...current,
      service_name: value,
      internal_name:
        current.internal_name ||
        value,
      slug:
        slugEdited
          ? current.slug
          : slugify(value),
      detail_hero_heading:
        current.detail_hero_heading ||
        value,
    }));
  }

  function chooseFile(
    key: MediaKey,
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const isVideo =
      key === "detailVideo";

    const validType =
      isVideo
        ? file.type.startsWith("video/")
        : file.type.startsWith("image/");

    if (!validType) {
      setMessage({
        type: "error",
        text:
          isVideo
            ? "Please select a valid video file."
            : "Please select a valid image file.",
      });

      event.target.value = "";
      return;
    }

    const maxSize =
      isVideo
        ? MAX_VIDEO_SIZE
        : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
      setMessage({
        type: "error",
        text:
          isVideo
            ? "Video must be smaller than 100 MB."
            : "Image must be smaller than 10 MB.",
      });

      event.target.value = "";
      return;
    }

    const oldPreview =
      previews[key];

    if (
      oldPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        oldPreview,
      );
    }

    const preview =
      URL.createObjectURL(file);

    setFiles((current) => ({
      ...current,
      [key]: file,
    }));

    setPreviews((current) => ({
      ...current,
      [key]: preview,
    }));

    setSources((current) => ({
      ...current,
      [key]: "upload",
    }));

    setMessage(null);
  }

  function removeMedia(
    key: MediaKey,
  ): void {
    const preview =
      previews[key];

    if (
      preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        preview,
      );
    }

    setFiles((current) => {
      const next = {
        ...current,
      };

      delete next[key];

      return next;
    });

    setPreviews((current) => ({
      ...current,
      [key]: "",
    }));

    if (key === "featured") {
      updateField(
        "featured_image_url",
        null,
      );

      updateField(
        "featured_image_storage_path",
        null,
      );
    }

    if (key === "detailImage") {
      updateField(
        "detail_hero_image_url",
        null,
      );

      updateField(
        "detail_hero_image_storage_path",
        null,
      );
    }

    if (key === "detailVideo") {
      updateField(
        "detail_hero_video_url",
        null,
      );

      updateField(
        "detail_hero_video_storage_path",
        null,
      );
    }

    if (key === "detailPoster") {
      updateField(
        "detail_hero_poster_url",
        null,
      );

      updateField(
        "detail_hero_poster_storage_path",
        null,
      );
    }
  }

  async function uploadFile(
    file: File,
    folder: string,
  ): Promise<{
    publicUrl: string;
    storagePath: string;
  }> {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "file";

    const path =
      `services/${folder}/${crypto.randomUUID()}.${extension}`;

    const { error } =
      await supabase.storage
        .from("website-media")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

    if (error) {
      throw new Error(
        error.message,
      );
    }

    const { data } =
      supabase.storage
        .from("website-media")
        .getPublicUrl(path);

    return {
      publicUrl:
        data.publicUrl,
      storagePath:
        path,
    };
  }

  async function removeUploadedFiles(
    paths: string[],
  ): Promise<void> {
    if (paths.length === 0) {
      return;
    }

    await supabase.storage
      .from("website-media")
      .remove(paths);
  }

  function validateForm():
    | string
    | null {
    if (
      !form.service_name.trim()
    ) {
      return "Service name is required.";
    }

    if (!form.slug.trim()) {
      return "Service slug is required.";
    }

    if (
      sources.featured === "upload" &&
      !files.featured &&
      !form.featured_image_url
    ) {
      return "Featured image is required.";
    }

    if (
      sources.featured === "url" &&
      !form.featured_image_url
    ) {
      return "Featured image URL is required.";
    }

    if (
      form.has_detail_page &&
      !form.detail_hero_heading?.trim()
    ) {
      return "Detail page hero heading is required.";
    }

    if (
      form.has_detail_page &&
      form.detail_hero_type === "image" &&
      sources.detailImage === "upload" &&
      !files.detailImage &&
      !form.detail_hero_image_url
    ) {
      return "Detail page hero image is required.";
    }

    if (
      form.has_detail_page &&
      form.detail_hero_type === "video" &&
      sources.detailVideo === "upload" &&
      !files.detailVideo &&
      !form.detail_hero_video_url
    ) {
      return "Detail page hero video is required.";
    }

    if (
      !form.has_detail_page &&
      form.show_explore_button &&
      !form.custom_button_link
    ) {
      return "Add a custom button link or enable the detailed service page.";
    }

    return null;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {
      setMessage({
        type: "error",
        text: validationError,
      });

      return;
    }

    setIsSaving(true);
    setMessage(null);

    const uploadedPaths: string[] = [];

    try {
      const payload: CreateServiceInput = {
        ...form,
        internal_name:
          form.internal_name.trim() ||
          form.service_name.trim(),

        service_name:
          form.service_name.trim(),

        slug:
          slugify(form.slug),

        is_published:
          submitMode === "publish"
            ? true
            : isEditing
              ? Boolean(form.is_published)
              : false,
      };

      if (
        sources.featured === "upload" &&
        files.featured
      ) {
        const uploaded =
          await uploadFile(
            files.featured,
            "featured",
          );

        uploadedPaths.push(
          uploaded.storagePath,
        );

        payload.featured_image_url =
          uploaded.publicUrl;

        payload.featured_image_storage_path =
          uploaded.storagePath;
      } else if (sources.featured === "url") {
        payload.featured_image_storage_path = null;
      }

      if (
        form.has_detail_page &&
        form.detail_hero_type === "image"
      ) {
        if (
          sources.detailImage === "upload" &&
          files.detailImage
        ) {
          const uploaded =
            await uploadFile(
              files.detailImage,
              "detail-images",
            );

          uploadedPaths.push(
            uploaded.storagePath,
          );

          payload.detail_hero_image_url =
            uploaded.publicUrl;

          payload.detail_hero_image_storage_path =
            uploaded.storagePath;
        } else if (sources.detailImage === "url") {
          payload.detail_hero_image_storage_path = null;
        }
      }

      if (
        form.has_detail_page &&
        form.detail_hero_type === "video"
      ) {
        if (
          sources.detailVideo === "upload" &&
          files.detailVideo
        ) {
          const uploaded =
            await uploadFile(
              files.detailVideo,
              "detail-videos",
            );

          uploadedPaths.push(
            uploaded.storagePath,
          );

          payload.detail_hero_video_url =
            uploaded.publicUrl;

          payload.detail_hero_video_storage_path =
            uploaded.storagePath;
        } else if (sources.detailVideo === "url") {
          payload.detail_hero_video_storage_path = null;
        }

        if (
          sources.detailPoster === "upload" &&
          files.detailPoster
        ) {
          const uploaded =
            await uploadFile(
              files.detailPoster,
              "detail-posters",
            );

          uploadedPaths.push(
            uploaded.storagePath,
          );

          payload.detail_hero_poster_url =
            uploaded.publicUrl;

          payload.detail_hero_poster_storage_path =
            uploaded.storagePath;
        } else if (
          sources.detailPoster === "url"
        ) {
          payload.detail_hero_poster_storage_path =
            null;
        }
      }

      const result =
        isEditing &&
        initialService
          ? await updateService(
              initialService.id,
              payload,
            )
          : await createService(
              payload,
            );

      if (!result.success) {
        const fieldErrors =
          result.errors
            ? Object.values(
                result.errors,
              )
                .flat()
                .filter(Boolean)
                .join(" ")
            : "";

        throw new Error(
          fieldErrors ||
          result.message,
        );
      }

      setMessage({
        type: "success",
        text:
          isEditing
            ? "Service updated successfully."
            : submitMode === "publish"
              ? "Service published successfully."
              : "Service saved as draft.",
      });

      if (isEditing) {
        router.refresh();
        return;
      }

      const createdServiceId =
        result.data?.id;

      if (
        form.has_detail_page &&
        createdServiceId
      ) {
        router.push(
          `/admin/website/services/${createdServiceId}/edit#detail-content`,
        );
      } else {
        router.push(
          "/admin/website/services",
        );
      }

      router.refresh();
    } catch (error) {
      await removeUploadedFiles(
        uploadedPaths,
      );

      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : isEditing
              ? "Unable to update service."
              : "Unable to create service.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  function renderMediaField(
    key: MediaKey,
    label: string,
    urlField:
      | "featured_image_url"
      | "detail_hero_image_url"
      | "detail_hero_video_url"
      | "detail_hero_poster_url",
    accept: string,
  ) {
    const isVideo =
      key === "detailVideo";

    return (
      <div className="serviceMedia">
        <div className="serviceMedia__heading">
          <div>
            <strong>{label}</strong>

            <span>
              Upload from computer or use a direct URL.
            </span>
          </div>

          <div className="serviceMedia__tabs">
            <button
              type="button"
              className={
                sources[key] === "upload"
                  ? "isActive"
                  : undefined
              }
              onClick={() =>
                setSources(
                  (current) => ({
                    ...current,
                    [key]: "upload",
                  }),
                )
              }
            >
              Upload
            </button>

            <button
              type="button"
              className={
                sources[key] === "url"
                  ? "isActive"
                  : undefined
              }
              onClick={() =>
                setSources(
                  (current) => ({
                    ...current,
                    [key]: "url",
                  }),
                )
              }
            >
              URL
            </button>
          </div>
        </div>

        {sources[key] === "upload" ? (
          <label className="serviceMedia__upload">
            <Upload size={17} />
            Choose File

            <input
              type="file"
              accept={accept}
              onChange={(event) =>
                chooseFile(
                  key,
                  event,
                )
              }
            />
          </label>
        ) : (
          <label className="serviceField">
            <span>Direct URL</span>

            <input
              type="url"
              value={
                String(
                  form[urlField] ??
                  "",
                )
              }
              placeholder="https://..."
              onChange={(event) => {
                const value =
                  event.target.value;

                updateField(
                  urlField,
                  value || null,
                );

                setPreviews(
                  (current) => ({
                    ...current,
                    [key]: value,
                  }),
                );
              }}
            />
          </label>
        )}

        {previews[key] ? (
          <div className="serviceMedia__preview">
            {isVideo ? (
              <video
                src={previews[key]}
                muted
                controls
              />
            ) : (
              <img
                src={previews[key]}
                alt=""
              />
            )}

            <button
              type="button"
              onClick={() =>
                removeMedia(key)
              }
              aria-label={`Remove ${label}`}
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <div className="serviceMedia__empty">
            <ImageIcon size={27} />
            <span>No media selected</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      className="serviceEditor"
      onSubmit={handleSubmit}
    >
      {message ? (
        <div
          className={`serviceEditor__message ${
            message.type === "success"
              ? "isSuccess"
              : "isError"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          {message.text}
        </div>
      ) : null}

      <section className="serviceFormCard">
        <div className="serviceFormCard__heading">
          <span>Basic information</span>
          <h2>Service card content</h2>
        </div>

        <div className="serviceFormCard__body serviceFormGrid">
          <label className="serviceField">
            <span>Service name *</span>

            <input
              type="text"
              value={form.service_name}
              onChange={(event) =>
                handleServiceName(
                  event.target.value,
                )
              }
              required
            />
          </label>

          <label className="serviceField">
            <span>Slug *</span>

            <input
              type="text"
              value={form.slug}
              onChange={(event) => {
                setSlugEdited(true);

                updateField(
                  "slug",
                  slugify(
                    event.target.value,
                  ),
                );
              }}
              required
            />
          </label>

          <label className="serviceField">
            <span>Internal name</span>

            <input
              type="text"
              value={form.internal_name}
              onChange={(event) =>
                updateField(
                  "internal_name",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="serviceField">
            <span>Eyebrow</span>

            <input
              type="text"
              value={form.eyebrow}
              onChange={(event) =>
                updateField(
                  "eyebrow",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="serviceField serviceField--full">
            <span>Short description</span>

            <textarea
              rows={5}
              value={
                form.short_description
              }
              onChange={(event) =>
                updateField(
                  "short_description",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="serviceField serviceField--full">
            <span>Full description</span>

            <textarea
              rows={9}
              value={
                form.full_description
              }
              onChange={(event) =>
                updateField(
                  "full_description",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="serviceField">
            <span>Icon name</span>

            <select
              value={form.icon_name}
              onChange={(event) =>
                updateField(
                  "icon_name",
                  event.target.value,
                )
              }
            >
              <option value="Settings">
                Settings
              </option>
              <option value="Sun">
                Solar / Sun
              </option>
              <option value="House">
                Home
              </option>
              <option value="Flame">
                Heating
              </option>
              <option value="Leaf">
                Energy / Leaf
              </option>
              <option value="ShieldCheck">
                Compliance
              </option>
            </select>
          </label>

          <label className="serviceField">
            <span>Display order</span>

            <input
              type="number"
              min="0"
              value={
                form.display_order
              }
              onChange={(event) =>
                updateField(
                  "display_order",
                  Number(
                    event.target.value,
                  ),
                )
              }
            />
          </label>
        </div>
      </section>

      <section className="serviceFormCard">
        <div className="serviceFormCard__heading">
          <span>Featured media</span>
          <h2>Service card image</h2>
        </div>

        <div className="serviceFormCard__body">
          {renderMediaField(
            "featured",
            "Featured image *",
            "featured_image_url",
            "image/*",
          )}

          <label className="serviceField">
            <span>Featured image alt text</span>

            <input
              type="text"
              value={
                form.featured_image_alt
              }
              onChange={(event) =>
                updateField(
                  "featured_image_alt",
                  event.target.value,
                )
              }
            />
          </label>
        </div>
      </section>

      <section className="serviceFormCard">
        <div className="serviceFormCard__heading">
          <span>Card behaviour</span>
          <h2>Explore service link</h2>
        </div>

        <div className="serviceFormCard__body serviceFormGrid">
          <label className="serviceToggle">
            <input
              type="checkbox"
              checked={
                form.has_detail_page
              }
              onChange={(event) =>
                updateField(
                  "has_detail_page",
                  event.target.checked,
                )
              }
            />

            <span>
              Create detailed service page
            </span>
          </label>

          <label className="serviceToggle">
            <input
              type="checkbox"
              checked={
                form.show_explore_button
              }
              onChange={(event) =>
                updateField(
                  "show_explore_button",
                  event.target.checked,
                )
              }
            />

            <span>
              Show Explore Service button
            </span>
          </label>

          <label className="serviceField">
            <span>Button text</span>

            <input
              type="text"
              value={
                form.explore_button_text
              }
              onChange={(event) =>
                updateField(
                  "explore_button_text",
                  event.target.value,
                )
              }
            />
          </label>

          {!form.has_detail_page ? (
            <label className="serviceField">
              <span>Custom button link</span>

              <input
                type="text"
                value={
                  form.custom_button_link ??
                  ""
                }
                placeholder="/contact"
                onChange={(event) =>
                  updateField(
                    "custom_button_link",
                    event.target.value ||
                      null,
                  )
                }
              />
            </label>
          ) : null}

          <label className="serviceToggle">
            <input
              type="checkbox"
              checked={
                form.open_in_new_tab
              }
              onChange={(event) =>
                updateField(
                  "open_in_new_tab",
                  event.target.checked,
                )
              }
            />

            <span>Open in new tab</span>
          </label>
        </div>
      </section>

      {form.has_detail_page ? (
        <section className="serviceRepeatableNotice">
          <div className="serviceRepeatableNotice__icon">
            <Save size={20} />
          </div>

          <div>
            <strong>
              Benefits, Process Steps and Gallery
            </strong>

            <p>
              Save or publish this service first. You will then be
              taken automatically to the Edit Service page, where
              you can add unlimited benefits, process steps and
              gallery images.
            </p>
          </div>
        </section>
      ) : null}

      {form.has_detail_page ? (
        <>
          <section className="serviceFormCard">
            <div className="serviceFormCard__heading">
              <span>Detail page</span>
              <h2>Service detail hero</h2>
            </div>

            <div className="serviceFormCard__body serviceFormGrid">
              <label className="serviceField">
                <span>Hero type</span>

                <select
                  value={
                    form.detail_hero_type
                  }
                  onChange={(event) =>
                    updateField(
                      "detail_hero_type",
                      event.target
                        .value as ServiceDetailHeroType,
                    )
                  }
                >
                  <option value="image">
                    Image
                  </option>
                  <option value="video">
                    Video
                  </option>
                </select>
              </label>

              <label className="serviceField">
                <span>Hero eyebrow</span>

                <input
                  type="text"
                  value={
                    form.detail_hero_eyebrow
                  }
                  onChange={(event) =>
                    updateField(
                      "detail_hero_eyebrow",
                      event.target.value,
                    )
                  }
                />
              </label>

              <label className="serviceField serviceField--full">
                <span>Hero heading *</span>

                <input
                  type="text"
                  value={
                    form.detail_hero_heading
                  }
                  onChange={(event) =>
                    updateField(
                      "detail_hero_heading",
                      event.target.value,
                    )
                  }
                />
              </label>

              <label className="serviceField serviceField--full">
                <span>Hero description</span>

                <textarea
                  rows={5}
                  value={
                    form.detail_hero_description
                  }
                  onChange={(event) =>
                    updateField(
                      "detail_hero_description",
                      event.target.value,
                    )
                  }
                />
              </label>

              <div className="serviceAppearanceGrid serviceField--full">
                {[
                  ["detail_hero_heading_size", "Hero heading desktop"],
                  ["detail_hero_heading_size_mobile", "Hero heading mobile"],
                  ["detail_section_heading_size", "Section heading desktop"],
                  ["detail_section_heading_size_mobile", "Section heading mobile"],
                  ["detail_card_heading_size", "Card heading"],
                  ["detail_cta_heading_size", "CTA heading"],
                ].map(([field, label]) => (
                  <label className="serviceField" key={field}>
                    <span>{label} (px)</span>
                    <input
                      type="number"
                      min="16"
                      max="180"
                      value={Number(form[field as keyof CreateServiceInput] ?? 0)}
                      onChange={(event) =>
                        updateField(
                          field as keyof CreateServiceInput,
                          Number(event.target.value) as never,
                        )
                      }
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="serviceFormCard__body serviceFormCard__body--border">
              {form.detail_hero_type === "image"
                ? renderMediaField(
                    "detailImage",
                    "Detail hero image *",
                    "detail_hero_image_url",
                    "image/*",
                  )
                : (
                    <>
                      {renderMediaField(
                        "detailVideo",
                        "Detail hero video *",
                        "detail_hero_video_url",
                        "video/*",
                      )}

                      {renderMediaField(
                        "detailPoster",
                        "Video poster image",
                        "detail_hero_poster_url",
                        "image/*",
                      )}
                    </>
                  )}

              <label className="serviceField">
                <span>Hero image/poster alt text</span>

                <input
                  type="text"
                  value={
                    form.detail_hero_type ===
                    "image"
                      ? form.detail_hero_image_alt
                      : form.detail_hero_poster_alt
                  }
                  onChange={(event) => {
                    if (
                      form.detail_hero_type ===
                      "image"
                    ) {
                      updateField(
                        "detail_hero_image_alt",
                        event.target.value,
                      );
                    } else {
                      updateField(
                        "detail_hero_poster_alt",
                        event.target.value,
                      );
                    }
                  }}
                />
              </label>
            </div>
          </section>

          <section className="serviceFormCard">
            <div className="serviceFormCard__heading">
              <span>Detail sections</span>
              <h2>Optional content sections</h2>
            </div>

            <div className="serviceFormCard__body serviceFormGrid">
              <label className="serviceToggle">
                <input
                  type="checkbox"
                  checked={
                    form.who_is_it_for_enabled
                  }
                  onChange={(event) =>
                    updateField(
                      "who_is_it_for_enabled",
                      event.target.checked,
                    )
                  }
                />

                <span>Enable Who This Service Is For</span>
              </label>

              <label className="serviceToggle">
                <input
                  type="checkbox"
                  checked={
                    form.benefits_enabled
                  }
                  onChange={(event) =>
                    updateField(
                      "benefits_enabled",
                      event.target.checked,
                    )
                  }
                />

                <span>Enable Benefits</span>
              </label>

              <label className="serviceToggle">
                <input
                  type="checkbox"
                  checked={
                    form.process_enabled
                  }
                  onChange={(event) =>
                    updateField(
                      "process_enabled",
                      event.target.checked,
                    )
                  }
                />

                <span>Enable Process</span>
              </label>

              <label className="serviceToggle">
                <input
                  type="checkbox"
                  checked={
                    form.gallery_enabled
                  }
                  onChange={(event) =>
                    updateField(
                      "gallery_enabled",
                      event.target.checked,
                    )
                  }
                />

                <span>Enable Gallery</span>
              </label>

              {form.who_is_it_for_enabled ? (
                <>
                  <label className="serviceField">
                    <span>Section heading</span>

                    <input
                      type="text"
                      value={
                        form.who_is_it_for_heading
                      }
                      onChange={(event) =>
                        updateField(
                          "who_is_it_for_heading",
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label className="serviceField serviceField--full">
                    <span>Section content *</span>

                    <textarea
                      rows={7}
                      value={
                        form.who_is_it_for_content
                      }
                      onChange={(event) =>
                        updateField(
                          "who_is_it_for_content",
                          event.target.value,
                        )
                      }
                    />
                  </label>
                </>
              ) : null}

              {form.benefits_enabled ? (
                <label className="serviceField">
                  <span>Benefits heading</span>

                  <input
                    type="text"
                    value={
                      form.benefits_heading
                    }
                    onChange={(event) =>
                      updateField(
                        "benefits_heading",
                        event.target.value,
                      )
                    }
                  />
                </label>
              ) : null}

              {form.benefits_enabled &&
              isEditing &&
              detailManagers?.benefits ? (
                <div className="serviceField--full serviceInlineManager">
                  {detailManagers.benefits}
                </div>
              ) : null}

              {form.process_enabled ? (
                <label className="serviceField">
                  <span>Process heading</span>

                  <input
                    type="text"
                    value={
                      form.process_heading
                    }
                    onChange={(event) =>
                      updateField(
                        "process_heading",
                        event.target.value,
                      )
                    }
                  />
                </label>
              ) : null}

              {form.process_enabled &&
              isEditing &&
              detailManagers?.process ? (
                <div className="serviceField--full serviceInlineManager">
                  {detailManagers.process}
                </div>
              ) : null}

              {form.gallery_enabled &&
              isEditing &&
              detailManagers?.gallery ? (
                <div className="serviceField--full serviceInlineManager">
                  {detailManagers.gallery}
                </div>
              ) : null}
            </div>
          </section>

          <section className="serviceFormCard">
            <div className="serviceFormCard__heading">
              <span>Call to action</span>
              <h2>Detail page CTA</h2>
            </div>

            <div className="serviceFormCard__body serviceFormGrid">
              <label className="serviceToggle">
                <input
                  type="checkbox"
                  checked={
                    form.cta_enabled
                  }
                  onChange={(event) =>
                    updateField(
                      "cta_enabled",
                      event.target.checked,
                    )
                  }
                />

                <span>Enable CTA section</span>
              </label>

              {form.cta_enabled ? (
                <>
                  <label className="serviceField serviceField--full">
                    <span>CTA heading *</span>

                    <input
                      type="text"
                      value={
                        form.cta_heading
                      }
                      onChange={(event) =>
                        updateField(
                          "cta_heading",
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label className="serviceField serviceField--full">
                    <span>CTA description</span>

                    <textarea
                      rows={5}
                      value={
                        form.cta_description
                      }
                      onChange={(event) =>
                        updateField(
                          "cta_description",
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label className="serviceField">
                    <span>CTA button text *</span>

                    <input
                      type="text"
                      value={
                        form.cta_button_text
                      }
                      onChange={(event) =>
                        updateField(
                          "cta_button_text",
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label className="serviceField">
                    <span>CTA button link *</span>

                    <input
                      type="text"
                      value={
                        form.cta_button_link
                      }
                      onChange={(event) =>
                        updateField(
                          "cta_button_link",
                          event.target.value,
                        )
                      }
                    />
                  </label>
                </>
              ) : null}
            </div>
          </section>
        </>
      ) : null}

      <section className="serviceFormCard">
        <div className="serviceFormCard__heading">
          <span>Publishing</span>
          <h2>Status and visibility</h2>
        </div>

        <div className="serviceFormCard__body serviceFormGrid">
          <label className="serviceToggle">
            <input
              type="checkbox"
              checked={
                form.is_featured
              }
              onChange={(event) =>
                updateField(
                  "is_featured",
                  event.target.checked,
                )
              }
            />

            <span>Featured service</span>
          </label>

          <label className="serviceToggle">
            <input
              type="checkbox"
              checked={
                form.is_active
              }
              onChange={(event) =>
                updateField(
                  "is_active",
                  event.target.checked,
                )
              }
            />

            <span>Active</span>
          </label>
        </div>
      </section>

      <footer className="serviceEditor__saveBar">
        <button
          type="submit"
          className="isSecondary"
          disabled={isSaving}
          onClick={() =>
            setSubmitMode("draft")
          }
        >
          {isSaving &&
          submitMode === "draft" ? (
            <Loader2
              className="serviceEditor__spinner"
              size={17}
            />
          ) : (
            <Save size={17} />
          )}

          Save Draft
        </button>

        <button
          type="submit"
          className="isPrimary"
          disabled={isSaving}
          onClick={() =>
            setSubmitMode("publish")
          }
        >
          {isSaving &&
          submitMode === "publish" ? (
            <Loader2
              className="serviceEditor__spinner"
              size={17}
            />
          ) : (
            <Save size={17} />
          )}

          Publish Service
        </button>
      </footer>
    </form>
  );
}