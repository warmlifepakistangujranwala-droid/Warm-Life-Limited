/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/case-studies/new/CaseStudyForm.tsx
 *
 * Purpose :
 * Provides the Add/Edit Case Study form, media upload,
 * automatic slug generation and detail-page controls.
 *
 * Version : v0.1.0
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
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  createCaseStudy,
  updateCaseStudy,
} from "@/lib/actions/case-studies";

import { createClient } from "@/lib/supabase/client";

import type {
  CaseStudy,
  CaseStudyHeroType,
  CreateCaseStudyInput,
} from "@/lib/types/case-studies";

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

type CaseStudyFormProps = {
  initialCaseStudy?: CaseStudy;
};

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

const MAX_VIDEO_SIZE =
  100 * 1024 * 1024;

const INITIAL_FORM: CreateCaseStudyInput = {
  internal_name: "",
  title: "",
  slug: "",

  eyebrow: "",
  short_description: "",
  full_description: "",

  client_name: "",
  organisation_name: "",
  location: "",
  property_type: "",
  service_category: "",
  completion_date: null,
  project_duration: "",

  featured_image_url: null,
  featured_image_storage_path: null,
  featured_image_alt: "",

  show_view_button: true,
  view_button_text: "View Case Study",
  open_in_new_tab: false,

  has_detail_page: true,

  detail_hero_type: "image",
  detail_hero_eyebrow: "",
  detail_hero_heading: "",
  detail_hero_description: "",

  detail_hero_image_url: null,
  detail_hero_image_storage_path: null,
  detail_hero_image_alt: "",

  detail_hero_video_url: null,
  detail_hero_video_storage_path: null,

  detail_hero_poster_url: null,
  detail_hero_poster_storage_path: null,
  detail_hero_poster_alt: "",

  overview_enabled: true,
  overview_heading: "Project Overview",
  overview_content: "",

  challenge_enabled: true,
  challenge_heading: "The Challenge",
  challenge_content: "",

  solution_enabled: true,
  solution_heading: "Our Solution",
  solution_content: "",

  work_completed_enabled: true,
  work_completed_heading: "Work Completed",
  work_completed_content: "",

  results_enabled: true,
  results_heading: "Results and Outcomes",
  results_content: "",

  facts_enabled: true,
  facts_heading: "Project Facts",

  timeline_enabled: false,
  timeline_heading: "Project Timeline",

  gallery_enabled: true,
  gallery_heading: "Project Gallery",

  testimonial_enabled: false,
  testimonial_heading: "Client Feedback",

  related_services_enabled: false,
  related_services_heading: "Related Services",

  cta_enabled: true,
  cta_heading: "",
  cta_description: "",
  cta_button_text: "Contact Warm Life",
  cta_button_link: "/contact",
  cta_button_open_in_new_tab: false,

  hero_heading_size: 80,
  hero_heading_size_mobile: 44,
  section_heading_size: 50,
  section_heading_size_mobile: 34,
  card_heading_size: 24,
  cta_heading_size: 52,

  display_order: 0,
  is_featured: false,
  is_active: true,
  is_published: false,
};

function getInitialForm(
  caseStudy?: CaseStudy,
): CreateCaseStudyInput {
  if (!caseStudy) {
    return {
      ...INITIAL_FORM,
    };
  }

  return {
    ...INITIAL_FORM,
    ...caseStudy,
    completion_date:
      caseStudy.completion_date ?? null,
  };
}

function slugify(
  value: string,
): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CaseStudyForm({
  initialCaseStudy,
}: CaseStudyFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const isEditing =
    Boolean(initialCaseStudy?.id);

  const [form, setForm] =
    useState<CreateCaseStudyInput>(
      () =>
        getInitialForm(
          initialCaseStudy,
        ),
    );

  const [slugEdited, setSlugEdited] =
    useState(
      Boolean(initialCaseStudy),
    );

  const [files, setFiles] =
    useState<
      Partial<
        Record<MediaKey, File>
      >
    >({});

  const [sources, setSources] =
    useState<
      Record<
        MediaKey,
        MediaSource
      >
    >(() => ({
      featured:
        initialCaseStudy
          ?.featured_image_url
          ? "url"
          : "upload",

      detailImage:
        initialCaseStudy
          ?.detail_hero_image_url
          ? "url"
          : "upload",

      detailVideo:
        initialCaseStudy
          ?.detail_hero_video_url
          ? "url"
          : "upload",

      detailPoster:
        initialCaseStudy
          ?.detail_hero_poster_url
          ? "url"
          : "upload",
    }));

  const [previews, setPreviews] =
    useState<
      Record<MediaKey, string>
    >(() => ({
      featured:
        initialCaseStudy
          ?.featured_image_url ??
        "",

      detailImage:
        initialCaseStudy
          ?.detail_hero_image_url ??
        "",

      detailVideo:
        initialCaseStudy
          ?.detail_hero_video_url ??
        "",

      detailPoster:
        initialCaseStudy
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
    K extends keyof CreateCaseStudyInput,
  >(
    field: K,
    value: CreateCaseStudyInput[K],
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage(null);
  }

  function handleTitle(
    value: string,
  ): void {
    setForm((current) => ({
      ...current,
      title: value,

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

      cta_heading:
        current.cta_heading ||
        `Ready to Start Your Own ${value} Project?`,
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
        ? file.type.startsWith(
            "video/",
          )
        : file.type.startsWith(
            "image/",
          );

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
      oldPreview.startsWith(
        "blob:",
      )
    ) {
      URL.revokeObjectURL(
        oldPreview,
      );
    }

    const preview =
      URL.createObjectURL(
        file,
      );

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
      preview.startsWith(
        "blob:",
      )
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
      `case-studies/${folder}/${crypto.randomUUID()}.${extension}`;

    const { error } =
      await supabase.storage
        .from("website-media")
        .upload(
          path,
          file,
          {
            cacheControl:
              "3600",
            upsert: false,
            contentType:
              file.type,
          },
        );

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
    if (
      paths.length === 0
    ) {
      return;
    }

    await supabase.storage
      .from("website-media")
      .remove(paths);
  }

  function validateForm():
    | string
    | null {
    if (!form.title.trim()) {
      return "Case study title is required.";
    }

    if (!form.slug.trim()) {
      return "Case study slug is required.";
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
      return "Detail hero heading is required.";
    }

    if (
      form.has_detail_page &&
      form.detail_hero_type === "image" &&
      sources.detailImage === "upload" &&
      !files.detailImage &&
      !form.detail_hero_image_url
    ) {
      return "Detail hero image is required.";
    }

    if (
      form.has_detail_page &&
      form.detail_hero_type === "video" &&
      sources.detailVideo === "upload" &&
      !files.detailVideo &&
      !form.detail_hero_video_url
    ) {
      return "Detail hero video is required.";
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
      const payload:
        CreateCaseStudyInput = {
          ...form,

          internal_name:
            form.internal_name.trim() ||
            form.title.trim(),

          title:
            form.title.trim(),

          slug:
            slugify(
              form.slug,
            ),

          completion_date:
            form.completion_date ||
            null,

          is_published:
            submitMode ===
            "publish",
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
      } else if (
        sources.featured === "url"
      ) {
        payload.featured_image_storage_path =
          null;
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
        } else if (
          sources.detailImage === "url"
        ) {
          payload.detail_hero_image_storage_path =
            null;
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
        } else if (
          sources.detailVideo === "url"
        ) {
          payload.detail_hero_video_storage_path =
            null;
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
        initialCaseStudy
          ? await updateCaseStudy(
              initialCaseStudy.id,
              payload,
            )
          : await createCaseStudy(
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
            ? "Case study updated successfully."
            : submitMode === "publish"
              ? "Case study published successfully."
              : "Case study saved as draft.",
      });

      if (isEditing) {
        router.refresh();
        return;
      }

      const createdId =
        result.data?.id;

      if (
        form.has_detail_page &&
        createdId
      ) {
        router.push(
          `/admin/website/case-studies/${createdId}/edit#dynamic-content`,
        );
      } else {
        router.push(
          "/admin/website/case-studies",
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
            : "Unable to save case study.",
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
      <div className="caseStudyMedia">
        <div className="caseStudyMedia__heading">
          <div>
            <strong>{label}</strong>

            <span>
              Upload from computer or use a direct URL.
            </span>
          </div>

          <div className="caseStudyMedia__tabs">
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
          <label className="caseStudyMedia__upload">
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
          <label className="caseStudyField">
            <span>
              Direct URL
            </span>

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
                    [key]:
                      value,
                  }),
                );
              }}
            />
          </label>
        )}

        {previews[key] ? (
          <div className="caseStudyMedia__preview">
            {isVideo ? (
              <video
                src={
                  previews[key]
                }
                muted
                controls
              />
            ) : (
              <img
                src={
                  previews[key]
                }
                alt=""
              />
            )}

            <button
              type="button"
              onClick={() =>
                removeMedia(
                  key,
                )
              }
              aria-label={`Remove ${label}`}
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <div className="caseStudyMedia__empty">
            <ImageIcon size={27} />
            <span>
              No media selected
            </span>
          </div>
        )}
      </div>
    );
  }

  function renderContentSection(
    enabledField:
      | "overview_enabled"
      | "challenge_enabled"
      | "solution_enabled"
      | "work_completed_enabled"
      | "results_enabled",

    headingField:
      | "overview_heading"
      | "challenge_heading"
      | "solution_heading"
      | "work_completed_heading"
      | "results_heading",

    contentField:
      | "overview_content"
      | "challenge_content"
      | "solution_content"
      | "work_completed_content"
      | "results_content",

    toggleLabel: string,
  ) {
    const enabled =
      Boolean(
        form[enabledField],
      );

    return (
      <div className="caseStudySectionEditor">
        <label className="caseStudyToggle">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) =>
              updateField(
                enabledField,
                event.target.checked,
              )
            }
          />

          <span>
            {toggleLabel}
          </span>
        </label>

        {enabled ? (
          <div className="caseStudyFormGrid">
            <label className="caseStudyField">
              <span>
                Section heading
              </span>

              <input
                type="text"
                value={
                  String(
                    form[headingField] ??
                    "",
                  )
                }
                onChange={(event) =>
                  updateField(
                    headingField,
                    event.target.value,
                  )
                }
              />
            </label>

            <label className="caseStudyField caseStudyField--full">
              <span>
                Section content
              </span>

              <textarea
                rows={7}
                value={
                  String(
                    form[contentField] ??
                    "",
                  )
                }
                onChange={(event) =>
                  updateField(
                    contentField,
                    event.target.value,
                  )
                }
              />
            </label>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <form
      className="caseStudyEditor"
      onSubmit={handleSubmit}
    >
      {message ? (
        <div
          className={`caseStudyEditor__message ${
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

      <section className="caseStudyFormCard">
        <div className="caseStudyFormCard__heading">
          <span>
            Basic information
          </span>

          <h2>
            Case study card
          </h2>
        </div>

        <div className="caseStudyFormCard__body caseStudyFormGrid">
          <label className="caseStudyField">
            <span>
              Case study title *
            </span>

            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                handleTitle(
                  event.target.value,
                )
              }
              required
            />
          </label>

          <label className="caseStudyField">
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

          <label className="caseStudyField">
            <span>
              Internal name
            </span>

            <input
              type="text"
              value={
                form.internal_name
              }
              onChange={(event) =>
                updateField(
                  "internal_name",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="caseStudyField">
            <span>
              Eyebrow / category
            </span>

            <input
              type="text"
              value={
                form.eyebrow
              }
              onChange={(event) =>
                updateField(
                  "eyebrow",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="caseStudyField caseStudyField--full">
            <span>
              Short description
            </span>

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

          <label className="caseStudyField caseStudyField--full">
            <span>
              Full description
            </span>

            <textarea
              rows={8}
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
        </div>
      </section>

      <section className="caseStudyFormCard">
        <div className="caseStudyFormCard__heading">
          <span>
            Project details
          </span>

          <h2>
            Client and project information
          </h2>
        </div>

        <div className="caseStudyFormCard__body caseStudyFormGrid">
          {[
            ["client_name", "Client name"],
            ["organisation_name", "Organisation"],
            ["location", "Location"],
            ["property_type", "Property type"],
            ["service_category", "Service category"],
            ["project_duration", "Project duration"],
          ].map(
            ([field, label]) => (
              <label
                className="caseStudyField"
                key={field}
              >
                <span>
                  {label}
                </span>

                <input
                  type="text"
                  value={
                    String(
                      form[
                        field as keyof CreateCaseStudyInput
                      ] ?? "",
                    )
                  }
                  onChange={(event) =>
                    updateField(
                      field as keyof CreateCaseStudyInput,
                      event.target.value as never,
                    )
                  }
                />
              </label>
            ),
          )}

          <label className="caseStudyField">
            <span>
              Completion date
            </span>

            <input
              type="date"
              value={
                form.completion_date ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "completion_date",
                  event.target.value ||
                  null,
                )
              }
            />
          </label>

          <label className="caseStudyField">
            <span>
              Display order
            </span>

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

      <section className="caseStudyFormCard">
        <div className="caseStudyFormCard__heading">
          <span>
            Featured media
          </span>

          <h2>
            Case study card image
          </h2>
        </div>

        <div className="caseStudyFormCard__body">
          {renderMediaField(
            "featured",
            "Featured image *",
            "featured_image_url",
            "image/*",
          )}

          <label className="caseStudyField">
            <span>
              Featured image alt text
            </span>

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

      <section className="caseStudyFormCard">
        <div className="caseStudyFormCard__heading">
          <span>
            Card behaviour
          </span>

          <h2>
            Public card and detail page
          </h2>
        </div>

        <div className="caseStudyFormCard__body caseStudyFormGrid">
          <label className="caseStudyToggle">
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
              Create detailed case study page
            </span>
          </label>

          <label className="caseStudyToggle">
            <input
              type="checkbox"
              checked={
                form.show_view_button
              }
              onChange={(event) =>
                updateField(
                  "show_view_button",
                  event.target.checked,
                )
              }
            />

            <span>
              Show View Case Study button
            </span>
          </label>

          <label className="caseStudyField">
            <span>
              Button text
            </span>

            <input
              type="text"
              value={
                form.view_button_text
              }
              onChange={(event) =>
                updateField(
                  "view_button_text",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="caseStudyToggle">
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

            <span>
              Open in new tab
            </span>
          </label>
        </div>
      </section>

      {form.has_detail_page ? (
        <>
          <section className="caseStudyFormCard">
            <div className="caseStudyFormCard__heading">
              <span>
                Detail page
              </span>

              <h2>
                Case study hero
              </h2>
            </div>

            <div className="caseStudyFormCard__body caseStudyFormGrid">
              <label className="caseStudyField">
                <span>
                  Hero type
                </span>

                <select
                  value={
                    form.detail_hero_type
                  }
                  onChange={(event) =>
                    updateField(
                      "detail_hero_type",
                      event.target
                        .value as CaseStudyHeroType,
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

              <label className="caseStudyField">
                <span>
                  Hero eyebrow
                </span>

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

              <label className="caseStudyField caseStudyField--full">
                <span>
                  Hero heading *
                </span>

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

              <label className="caseStudyField caseStudyField--full">
                <span>
                  Hero description
                </span>

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

              <div className="caseStudyAppearanceGrid caseStudyField--full">
                {[
                  ["hero_heading_size", "Hero heading desktop"],
                  ["hero_heading_size_mobile", "Hero heading mobile"],
                  ["section_heading_size", "Section heading desktop"],
                  ["section_heading_size_mobile", "Section heading mobile"],
                  ["card_heading_size", "Card heading"],
                  ["cta_heading_size", "CTA heading"],
                ].map(
                  ([field, label]) => (
                    <label
                      className="caseStudyField"
                      key={field}
                    >
                      <span>
                        {label} (px)
                      </span>

                      <input
                        type="number"
                        min="16"
                        max="180"
                        value={
                          Number(
                            form[
                              field as keyof CreateCaseStudyInput
                            ] ?? 0,
                          )
                        }
                        onChange={(event) =>
                          updateField(
                            field as keyof CreateCaseStudyInput,
                            Number(
                              event.target.value,
                            ) as never,
                          )
                        }
                      />
                    </label>
                  ),
                )}
              </div>
            </div>

            <div className="caseStudyFormCard__body caseStudyFormCard__body--border">
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

              <label className="caseStudyField">
                <span>
                  Hero image/poster alt text
                </span>

                <input
                  type="text"
                  value={
                    form.detail_hero_type === "image"
                      ? form.detail_hero_image_alt
                      : form.detail_hero_poster_alt
                  }
                  onChange={(event) => {
                    if (
                      form.detail_hero_type === "image"
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

          <section className="caseStudyFormCard">
            <div className="caseStudyFormCard__heading">
              <span>
                Main content
              </span>

              <h2>
                Case study sections
              </h2>
            </div>

            <div className="caseStudyFormCard__body caseStudyContentSections">
              {renderContentSection(
                "overview_enabled",
                "overview_heading",
                "overview_content",
                "Enable Project Overview",
              )}

              {renderContentSection(
                "challenge_enabled",
                "challenge_heading",
                "challenge_content",
                "Enable The Challenge",
              )}

              {renderContentSection(
                "solution_enabled",
                "solution_heading",
                "solution_content",
                "Enable Our Solution",
              )}

              {renderContentSection(
                "work_completed_enabled",
                "work_completed_heading",
                "work_completed_content",
                "Enable Work Completed",
              )}

              {renderContentSection(
                "results_enabled",
                "results_heading",
                "results_content",
                "Enable Results and Outcomes",
              )}
            </div>
          </section>

          <section className="caseStudyFormCard">
            <div className="caseStudyFormCard__heading">
              <span>
                Dynamic content
              </span>

              <h2>
                Optional managers
              </h2>
            </div>

            <div className="caseStudyFormCard__body caseStudyFormGrid">
              {[
                ["facts_enabled", "facts_heading", "Enable Project Facts"],
                ["timeline_enabled", "timeline_heading", "Enable Timeline"],
                ["gallery_enabled", "gallery_heading", "Enable Gallery"],
                ["testimonial_enabled", "testimonial_heading", "Enable Testimonial"],
                ["related_services_enabled", "related_services_heading", "Enable Related Services"],
              ].map(
                (
                  [
                    enabledField,
                    headingField,
                    label,
                  ],
                ) => {
                  const enabled =
                    Boolean(
                      form[
                        enabledField as keyof CreateCaseStudyInput
                      ],
                    );

                  return (
                    <div
                      className="caseStudyDynamicToggle"
                      key={enabledField}
                    >
                      <label className="caseStudyToggle">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(event) =>
                            updateField(
                              enabledField as keyof CreateCaseStudyInput,
                              event.target.checked as never,
                            )
                          }
                        />

                        <span>
                          {label}
                        </span>
                      </label>

                      {enabled ? (
                        <label className="caseStudyField">
                          <span>
                            Section heading
                          </span>

                          <input
                            type="text"
                            value={
                              String(
                                form[
                                  headingField as keyof CreateCaseStudyInput
                                ] ?? "",
                              )
                            }
                            onChange={(event) =>
                              updateField(
                                headingField as keyof CreateCaseStudyInput,
                                event.target.value as never,
                              )
                            }
                          />
                        </label>
                      ) : null}
                    </div>
                  );
                },
              )}
            </div>
          </section>

          <section className="caseStudyFormCard">
            <div className="caseStudyFormCard__heading">
              <span>
                Call to action
              </span>

              <h2>
                Detail page CTA
              </h2>
            </div>

            <div className="caseStudyFormCard__body caseStudyFormGrid">
              <label className="caseStudyToggle">
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

                <span>
                  Enable CTA section
                </span>
              </label>

              {form.cta_enabled ? (
                <>
                  <label className="caseStudyField caseStudyField--full">
                    <span>
                      CTA heading *
                    </span>

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

                  <label className="caseStudyField caseStudyField--full">
                    <span>
                      CTA description
                    </span>

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

                  <label className="caseStudyField">
                    <span>
                      Button text *
                    </span>

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

                  <label className="caseStudyField">
                    <span>
                      Button link *
                    </span>

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

                  <label className="caseStudyToggle">
                    <input
                      type="checkbox"
                      checked={
                        form.cta_button_open_in_new_tab
                      }
                      onChange={(event) =>
                        updateField(
                          "cta_button_open_in_new_tab",
                          event.target.checked,
                        )
                      }
                    />

                    <span>
                      Open CTA in new tab
                    </span>
                  </label>
                </>
              ) : null}
            </div>
          </section>
        </>
      ) : null}

      <section className="caseStudyFormCard">
        <div className="caseStudyFormCard__heading">
          <span>
            Publishing
          </span>

          <h2>
            Status and visibility
          </h2>
        </div>

        <div className="caseStudyFormCard__body caseStudyFormGrid">
          <label className="caseStudyToggle">
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

            <span>
              Featured case study
            </span>
          </label>

          <label className="caseStudyToggle">
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

            <span>
              Active
            </span>
          </label>
        </div>
      </section>

      <footer className="caseStudyEditor__saveBar">
        <button
          type="submit"
          className="isSecondary"
          disabled={isSaving}
          onClick={() =>
            setSubmitMode(
              "draft",
            )
          }
        >
          {isSaving &&
          submitMode === "draft" ? (
            <Loader2
              className="caseStudyEditor__spinner"
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
            setSubmitMode(
              "publish",
            )
          }
        >
          {isSaving &&
          submitMode === "publish" ? (
            <Loader2
              className="caseStudyEditor__spinner"
              size={17}
            />
          ) : (
            <Save size={17} />
          )}

          Publish Case Study
        </button>
      </footer>
    </form>
  );
}
