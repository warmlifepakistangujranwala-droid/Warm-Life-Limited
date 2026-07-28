"use client";

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  FileImage,
  Film,
  Loader2,
  Save,
  Upload,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { updateHeroSlide } from "@/lib/actions/hero";
import { createClient } from "@/lib/supabase/client";
import type { HeroSlide, HeroSlideFormValues } from "@/lib/types/hero";

const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

function getInitialFormValues(
  heroSlide: HeroSlide,
): HeroSlideFormValues {
  return {
    eyebrow: heroSlide.eyebrow ?? "",
    title_line_one: heroSlide.title_line_one,
    title_line_one_color:
      heroSlide.title_line_one_color ?? "#0b2f24",
    title_line_two: heroSlide.title_line_two ?? "",
    title_line_two_color:
      heroSlide.title_line_two_color ?? "#2f7a55",
    description: heroSlide.description ?? "",
    description_color:
      heroSlide.description_color ?? "#5f6f68",
    primary_button_text:
      heroSlide.primary_button_text ?? "",
    primary_button_link:
      heroSlide.primary_button_link ?? "",
    secondary_button_text:
      heroSlide.secondary_button_text ?? "",
    secondary_button_link:
      heroSlide.secondary_button_link ?? "",
    video_url: heroSlide.video_url,
    video_poster_url:
      heroSlide.video_poster_url ?? "",
    display_order: heroSlide.display_order,
    is_active: heroSlide.is_active,
    is_published: heroSlide.is_published,
  };
}

type FormErrors = Partial<Record<keyof HeroSlideFormValues, string>>;

const HEX_COLOR_PATTERN = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;

type HeroEditFormProps = {
  heroSlide: HeroSlide;
};

export default function HeroEditForm({
  heroSlide,
}: HeroEditFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [formValues, setFormValues] =
    useState<HeroSlideFormValues>(() => getInitialFormValues(heroSlide));

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);

  const [videoPreview, setVideoPreview] = useState(heroSlide.video_url);
  const [posterPreview, setPosterPreview] = useState(heroSlide.video_poster_url ?? "");

  const [errors, setErrors] = useState<FormErrors>({});
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMode, setSubmitMode] = useState<"draft" | "publish">(
    heroSlide.is_published ? "publish" : "draft",
  );

  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      if (posterPreview) {
        URL.revokeObjectURL(posterPreview);
      }
    };
  }, [videoPreview, posterPreview]);

  function updateField<K extends keyof HeroSlideFormValues>(
    field: K,
    value: HeroSlideFormValues[K],
  ) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setFormMessage("");
  }

  function handleVideoSelection(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("video/")) {
      setErrors((current) => ({
        ...current,
        video_url: "Please select a valid video file.",
      }));

      event.target.value = "";
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setErrors((current) => ({
        ...current,
        video_url: "Video must be smaller than 100 MB.",
      }));

      event.target.value = "";
      return;
    }

    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));

    setErrors((current) => ({
      ...current,
      video_url: undefined,
    }));

    setFormMessage("");
  }

  function handlePosterSelection(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({
        ...current,
        video_poster_url: "Please select a valid image file.",
      }));

      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((current) => ({
        ...current,
        video_poster_url: "Poster image must be smaller than 10 MB.",
      }));

      event.target.value = "";
      return;
    }

    if (posterPreview) {
      URL.revokeObjectURL(posterPreview);
    }

    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));

    setErrors((current) => ({
      ...current,
      video_poster_url: undefined,
    }));

    setFormMessage("");
  }

  function removeVideo() {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    setVideoFile(null);
    setVideoPreview("");

    updateField("video_url", "");
  }

  function removePoster() {
    if (posterPreview) {
      URL.revokeObjectURL(posterPreview);
    }

    setPosterFile(null);
    setPosterPreview("");

    updateField("video_poster_url", "");
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!formValues.title_line_one.trim()) {
      nextErrors.title_line_one = "Title line one is required.";
    }

    if (formValues.title_line_one.length > 120) {
      nextErrors.title_line_one =
        "Title line one cannot exceed 120 characters.";
    }

    if (formValues.title_line_two.length > 120) {
      nextErrors.title_line_two =
        "Title line two cannot exceed 120 characters.";
    }

    if (formValues.eyebrow.length > 80) {
      nextErrors.eyebrow =
        "Eyebrow cannot exceed 80 characters.";
    }

    if (formValues.description.length > 600) {
      nextErrors.description =
        "Description cannot exceed 600 characters.";
    }

    if (!HEX_COLOR_PATTERN.test(formValues.title_line_one_color)) {
      nextErrors.title_line_one_color =
        "Please select a valid title line one colour.";
    }

    if (!HEX_COLOR_PATTERN.test(formValues.title_line_two_color)) {
      nextErrors.title_line_two_color =
        "Please select a valid title line two colour.";
    }

    if (!HEX_COLOR_PATTERN.test(formValues.description_color)) {
      nextErrors.description_color =
        "Please select a valid description colour.";
    }

    if (!videoFile && !formValues.video_url) {
      nextErrors.video_url = "Hero video is required.";
    }

    if (
      !Number.isInteger(formValues.display_order) ||
      formValues.display_order < 0
    ) {
      nextErrors.display_order =
        "Display order must be zero or a positive whole number.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function createStoragePath(file: File, folder: string) {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "file";

    return `homepage/hero/${folder}/${crypto.randomUUID()}.${extension}`;
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

    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabase.storage
      .from("website-media")
      .getPublicUrl(storagePath);

    return {
      publicUrl: data.publicUrl,
      storagePath,
    };
  }

  async function removeUploadedFile(storagePath: string | null) {
    if (!storagePath) {
      return;
    }

    await supabase.storage
      .from("website-media")
      .remove([storagePath]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      setFormMessage(
        "Please correct the highlighted fields before saving.",
      );

      return;
    }

    setIsSubmitting(true);
    setFormMessage("");

    let uploadedVideoPath: string | null = null;
    let uploadedPosterPath: string | null = null;

    try {
      let videoUrl = formValues.video_url;
      let posterUrl = formValues.video_poster_url;

      if (videoFile) {
        const uploadedVideo = await uploadFile(videoFile, "videos");

        videoUrl = uploadedVideo.publicUrl;
        uploadedVideoPath = uploadedVideo.storagePath;
      }

      if (posterFile) {
        const uploadedPoster = await uploadFile(
          posterFile,
          "posters",
        );

        posterUrl = uploadedPoster.publicUrl;
        uploadedPosterPath = uploadedPoster.storagePath;
      }

      const result = await updateHeroSlide({
        id: heroSlide.id,
        ...formValues,
        eyebrow: formValues.eyebrow.trim(),
        title_line_one: formValues.title_line_one.trim(),
        title_line_two: formValues.title_line_two.trim(),
        description: formValues.description.trim(),
        primary_button_text:
          formValues.primary_button_text.trim(),
        primary_button_link:
          formValues.primary_button_link.trim(),
        secondary_button_text:
          formValues.secondary_button_text.trim(),
        secondary_button_link:
          formValues.secondary_button_link.trim(),
        video_url: videoUrl,
        video_poster_url: posterUrl,
        is_published: submitMode === "publish",
      });

      if (!result.success) {
        await Promise.all([
          removeUploadedFile(uploadedVideoPath),
          removeUploadedFile(uploadedPosterPath),
        ]);

        if (result.errors) {
          const serverErrors: FormErrors = {};

          Object.entries(result.errors).forEach(
            ([field, messages]) => {
              const firstMessage = messages?.[0];

              if (firstMessage) {
                serverErrors[
                  field as keyof HeroSlideFormValues
                ] = firstMessage;
              }
            },
          );

          setErrors(serverErrors);
        }

        setFormMessage(
          result.message || "Hero slide could not be updated.",
        );

        return;
      }

      router.push("/admin/website/homepage/hero");
      router.refresh();
    } catch (error) {
      await Promise.all([
        removeUploadedFile(uploadedVideoPath),
        removeUploadedFile(uploadedPosterPath),
      ]);

      setFormMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="heroEditor"
      onSubmit={handleSubmit}
      noValidate
    >
      {formMessage && (
        <div className="heroEditor__message">
          <AlertCircle size={18} />
          <span>{formMessage}</span>
        </div>
      )}

      <div className="heroEditor__layout">
        <main className="heroEditor__main">
          <section className="heroEditorCard">
            <div className="heroEditorCard__heading">
              <div>
                <span>Media</span>
                <h2>Hero video</h2>
              </div>

              <Film size={21} />
            </div>

            <div className="heroEditorCard__body">
              {!videoPreview ? (
                <label className="heroUploadBox">
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleVideoSelection}
                    disabled={isSubmitting}
                  />

                  <div className="heroUploadBox__icon">
                    <Upload size={25} />
                  </div>

                  <strong>Upload hero video</strong>

                  <span>
                    MP4, WebM or MOV. Maximum file size 100 MB.
                  </span>

                  <span className="heroUploadBox__button">
                    Select video
                  </span>
                </label>
              ) : (
                <div className="heroMediaPreview">
                  <video
                    src={videoPreview}
                    controls
                    muted
                    playsInline
                    poster={posterPreview || undefined}
                  />

                  <button
                    type="button"
                    className="heroMediaPreview__remove"
                    onClick={removeVideo}
                    disabled={isSubmitting}
                    aria-label="Remove selected video"
                  >
                    <X size={16} />
                    Remove video
                  </button>

                  <div className="heroMediaPreview__file">
                    <Film size={17} />

                    <div>
                      <strong>{videoFile?.name ?? "Current hero video"}</strong>
                      <span>
                        {videoFile
                          ? `${(
                              videoFile.size /
                              1024 /
                              1024
                            ).toFixed(2)} MB`
                          : "Existing uploaded video"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {errors.video_url && (
                <p className="heroFieldError">
                  <AlertCircle size={14} />
                  {errors.video_url}
                </p>
              )}
            </div>
          </section>

          <section className="heroEditorCard">
            <div className="heroEditorCard__heading">
              <div>
                <span>Content</span>
                <h2>Hero heading and description</h2>
              </div>
            </div>

            <div className="heroEditorCard__body">
              <div className="heroFormGrid">
                <div className="heroFormField heroFormField--full">
                  <label htmlFor="eyebrow">
                    Eyebrow text
                    <span>Optional</span>
                  </label>

                  <input
                    id="eyebrow"
                    type="text"
                    value={formValues.eyebrow}
                    onChange={(event) =>
                      updateField("eyebrow", event.target.value)
                    }
                    placeholder="For example: Funding made simple"
                    maxLength={80}
                    disabled={isSubmitting}
                  />

                  <div className="heroFormField__meta">
                    <span>
                      Small text shown above the main heading.
                    </span>
                    <span>{formValues.eyebrow.length}/80</span>
                  </div>

                  {errors.eyebrow && (
                    <p className="heroFieldError">
                      <AlertCircle size={14} />
                      {errors.eyebrow}
                    </p>
                  )}
                </div>

                <div className="heroFormField">
                  <label htmlFor="title_line_one">
                    Title line one
                    <strong>Required</strong>
                  </label>

                  <input
                    id="title_line_one"
                    type="text"
                    value={formValues.title_line_one}
                    onChange={(event) =>
                      updateField(
                        "title_line_one",
                        event.target.value,
                      )
                    }
                    placeholder="Warmer homes"
                    maxLength={120}
                    disabled={isSubmitting}
                  />

                  <div className="heroFormField__meta">
                    <span>Main heading first line.</span>
                    <span>
                      {formValues.title_line_one.length}/120
                    </span>
                  </div>

                  {errors.title_line_one && (
                    <p className="heroFieldError">
                      <AlertCircle size={14} />
                      {errors.title_line_one}
                    </p>
                  )}

                  <label htmlFor="title_line_one_color">
                    Title line one colour
                  </label>

                  <div style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: "10px", alignItems: "center" }}>
                    <input
                      id="title_line_one_color"
                      type="color"
                      value={formValues.title_line_one_color}
                      onChange={(event) =>
                        updateField("title_line_one_color", event.target.value)
                      }
                      disabled={isSubmitting}
                      style={{ width: "56px", height: "44px", padding: "4px", cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={formValues.title_line_one_color}
                      onChange={(event) =>
                        updateField("title_line_one_color", event.target.value)
                      }
                      maxLength={7}
                      placeholder="#0b2f24"
                      disabled={isSubmitting}
                    />
                  </div>

                  {errors.title_line_one_color && (
                    <p className="heroFieldError">
                      <AlertCircle size={14} />
                      {errors.title_line_one_color}
                    </p>
                  )}
                </div>

                <div className="heroFormField">
                  <label htmlFor="title_line_two">
                    Title line two
                    <span>Optional</span>
                  </label>

                  <input
                    id="title_line_two"
                    type="text"
                    value={formValues.title_line_two}
                    onChange={(event) =>
                      updateField(
                        "title_line_two",
                        event.target.value,
                      )
                    }
                    placeholder="Lower energy bills"
                    maxLength={120}
                    disabled={isSubmitting}
                  />

                  <div className="heroFormField__meta">
                    <span>Main heading second line.</span>
                    <span>
                      {formValues.title_line_two.length}/120
                    </span>
                  </div>

                  {errors.title_line_two && (
                    <p className="heroFieldError">
                      <AlertCircle size={14} />
                      {errors.title_line_two}
                    </p>
                  )}

                  <label htmlFor="title_line_two_color">
                    Title line two colour
                  </label>

                  <div style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: "10px", alignItems: "center" }}>
                    <input
                      id="title_line_two_color"
                      type="color"
                      value={formValues.title_line_two_color}
                      onChange={(event) =>
                        updateField("title_line_two_color", event.target.value)
                      }
                      disabled={isSubmitting}
                      style={{ width: "56px", height: "44px", padding: "4px", cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={formValues.title_line_two_color}
                      onChange={(event) =>
                        updateField("title_line_two_color", event.target.value)
                      }
                      maxLength={7}
                      placeholder="#2f7a55"
                      disabled={isSubmitting}
                    />
                  </div>

                  {errors.title_line_two_color && (
                    <p className="heroFieldError">
                      <AlertCircle size={14} />
                      {errors.title_line_two_color}
                    </p>
                  )}
                </div>

                <div className="heroFormField heroFormField--full">
                  <label htmlFor="description">
                    Description
                    <span>Optional</span>
                  </label>

                  <textarea
                    id="description"
                    rows={6}
                    value={formValues.description}
                    onChange={(event) =>
                      updateField(
                        "description",
                        event.target.value,
                      )
                    }
                    placeholder="Add a short description supporting the hero heading."
                    maxLength={600}
                    disabled={isSubmitting}
                  />

                  <div className="heroFormField__meta">
                    <span>
                      Keep the text clear and easy to scan.
                    </span>
                    <span>
                      {formValues.description.length}/600
                    </span>
                  </div>

                  {errors.description && (
                    <p className="heroFieldError">
                      <AlertCircle size={14} />
                      {errors.description}
                    </p>
                  )}

                  <label htmlFor="description_color">
                    Description colour
                  </label>

                  <div style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: "10px", alignItems: "center" }}>
                    <input
                      id="description_color"
                      type="color"
                      value={formValues.description_color}
                      onChange={(event) =>
                        updateField("description_color", event.target.value)
                      }
                      disabled={isSubmitting}
                      style={{ width: "56px", height: "44px", padding: "4px", cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={formValues.description_color}
                      onChange={(event) =>
                        updateField("description_color", event.target.value)
                      }
                      maxLength={7}
                      placeholder="#5f6f68"
                      disabled={isSubmitting}
                    />
                  </div>

                  {errors.description_color && (
                    <p className="heroFieldError">
                      <AlertCircle size={14} />
                      {errors.description_color}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="heroEditorCard">
            <div className="heroEditorCard__heading">
              <div>
                <span>Actions</span>
                <h2>Hero buttons</h2>
              </div>
            </div>

            <div className="heroEditorCard__body">
              <div className="heroFormGrid">
                <div className="heroFormField">
                  <label htmlFor="primary_button_text">
                    Primary button text
                    <span>Optional</span>
                  </label>

                  <input
                    id="primary_button_text"
                    type="text"
                    value={formValues.primary_button_text}
                    onChange={(event) =>
                      updateField(
                        "primary_button_text",
                        event.target.value,
                      )
                    }
                    placeholder="Check eligibility"
                    maxLength={40}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="heroFormField">
                  <label htmlFor="primary_button_link">
                    Primary button link
                    <span>Optional</span>
                  </label>

                  <input
                    id="primary_button_link"
                    type="text"
                    value={formValues.primary_button_link}
                    onChange={(event) =>
                      updateField(
                        "primary_button_link",
                        event.target.value,
                      )
                    }
                    placeholder="/contact"
                    maxLength={255}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="heroFormField">
                  <label htmlFor="secondary_button_text">
                    Secondary button text
                    <span>Optional</span>
                  </label>

                  <input
                    id="secondary_button_text"
                    type="text"
                    value={formValues.secondary_button_text}
                    onChange={(event) =>
                      updateField(
                        "secondary_button_text",
                        event.target.value,
                      )
                    }
                    placeholder="Explore services"
                    maxLength={40}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="heroFormField">
                  <label htmlFor="secondary_button_link">
                    Secondary button link
                    <span>Optional</span>
                  </label>

                  <input
                    id="secondary_button_link"
                    type="text"
                    value={formValues.secondary_button_link}
                    onChange={(event) =>
                      updateField(
                        "secondary_button_link",
                        event.target.value,
                      )
                    }
                    placeholder="/services"
                    maxLength={255}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </section>
        </main>

        <aside className="heroEditor__sidebar">
          <section className="heroEditorCard">
            <div className="heroEditorCard__heading">
              <div>
                <span>Poster</span>
                <h2>Preview image</h2>
              </div>

              <FileImage size={20} />
            </div>

            <div className="heroEditorCard__body">
              {!posterPreview ? (
                <label className="heroPosterUpload">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePosterSelection}
                    disabled={isSubmitting}
                  />

                  <FileImage size={25} />

                  <strong>Upload poster image</strong>

                  <span>
                    JPEG, PNG or WebP. Maximum 10 MB.
                  </span>
                </label>
              ) : (
                <div className="heroPosterPreview">
                  <img
                    src={posterPreview}
                    alt="Selected hero poster preview"
                  />

                  <button
                    type="button"
                    onClick={removePoster}
                    disabled={isSubmitting}
                  >
                    <X size={15} />
                    Remove poster
                  </button>
                </div>
              )}

              {errors.video_poster_url && (
                <p className="heroFieldError">
                  <AlertCircle size={14} />
                  {errors.video_poster_url}
                </p>
              )}
            </div>
          </section>

          <section className="heroEditorCard">
            <div className="heroEditorCard__heading">
              <div>
                <span>Organisation</span>
                <h2>Display settings</h2>
              </div>
            </div>

            <div className="heroEditorCard__body">
              <div className="heroFormField">
                <label htmlFor="display_order">
                  Display order
                </label>

                <input
                  id="display_order"
                  type="number"
                  min={0}
                  step={1}
                  value={formValues.display_order}
                  onChange={(event) =>
                    updateField(
                      "display_order",
                      Number(event.target.value),
                    )
                  }
                  disabled={isSubmitting}
                />

                <div className="heroFormField__meta">
                  <span>
                    Lower numbers appear before higher numbers.
                  </span>
                </div>

                {errors.display_order && (
                  <p className="heroFieldError">
                    <AlertCircle size={14} />
                    {errors.display_order}
                  </p>
                )}
              </div>

              <label className="heroToggle">
                <div>
                  <strong>Active slide</strong>
                  <span>
                    Allow this slide to be used by the homepage.
                  </span>
                </div>

                <input
                  type="checkbox"
                  checked={formValues.is_active}
                  onChange={(event) =>
                    updateField(
                      "is_active",
                      event.target.checked,
                    )
                  }
                  disabled={isSubmitting}
                />

                <span className="heroToggle__control" />
              </label>
            </div>
          </section>

          <section className="heroEditorCard heroEditorCard--preview">
            <div className="heroEditorCard__heading">
              <div>
                <span>Summary</span>
                <h2>Hero preview</h2>
              </div>

              <Eye size={20} />
            </div>

            <div className="heroEditorCard__body">
              <div className="heroContentPreview">
                <span>
                  {formValues.eyebrow || "Hero eyebrow"}
                </span>

                <h3 style={{ color: formValues.title_line_one_color }}>
                  {formValues.title_line_one ||
                    "Your hero title"}

                  {formValues.title_line_two && (
                    <>
                      <br />
                      <strong style={{ color: formValues.title_line_two_color }}>
                        {formValues.title_line_two}
                      </strong>
                    </>
                  )}
                </h3>

                <p style={{ color: formValues.description_color }}>
                  {formValues.description ||
                    "Your hero description will appear here."}
                </p>

                <div>
                  {formValues.primary_button_text && (
                    <span>
                      {formValues.primary_button_text}
                    </span>
                  )}

                  {formValues.secondary_button_text && (
                    <span>
                      {formValues.secondary_button_text}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <footer className="heroEditor__footer">
        <div className="heroEditor__footerStatus">
          <CheckCircle2 size={17} />

          <span>
            Changes to this hero slide will be saved securely to
            Supabase.
          </span>
        </div>

        <div className="heroEditor__footerActions">
          <button
            type="submit"
            className="heroEditor__draftButton"
            onClick={() => setSubmitMode("draft")}
            disabled={isSubmitting}
          >
            {isSubmitting && submitMode === "draft" ? (
              <Loader2
                size={17}
                className="heroEditor__spinner"
              />
            ) : (
              <Save size={17} />
            )}

            Save as Draft
          </button>

          <button
            type="submit"
            className="heroEditor__publishButton"
            onClick={() => setSubmitMode("publish")}
            disabled={isSubmitting}
          >
            {isSubmitting && submitMode === "publish" ? (
              <Loader2
                size={17}
                className="heroEditor__spinner"
              />
            ) : (
              <Eye size={17} />
            )}

            Update & Publish
          </button>
        </div>
      </footer>
    </form>
  );
}