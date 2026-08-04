/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/about/hero/new/HeroSlideForm.tsx
 *
 * Purpose :
 * Creates About hero image or video slides with Supabase
 * Storage uploads, URL sources, previews and CMS controls.
 *
 * Version : v1.2.0
 * ============================================================
 */

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

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  createAboutHeroSlide,
  updateAboutHeroSlide,
} from "@/lib/actions/about-page";

import { createClient } from "@/lib/supabase/client";

import type {
  AboutHeroContentAlignment,
  AboutHeroMediaType,
  AboutHeroVerticalAlignment,
  AboutHeroSlide,
  CreateAboutHeroSlideInput,
} from "@/lib/types/about-page";

type HeroSlideFormProps = {
  aboutPageId: string;
  initialSlide?: AboutHeroSlide | null;
  mode?: "create" | "edit";
};

type MediaSource =
  | "upload"
  | "url";

type MediaTarget =
  | "image"
  | "mobile"
  | "video"
  | "poster";

type Message = {
  type: "success" | "error";
  text: string;
} | null;

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

const MAX_VIDEO_SIZE =
  100 * 1024 * 1024;

const INITIAL_FORM: CreateAboutHeroSlideInput = {
  internal_name: "",
  media_type: "image",

  image_url: null,
  image_storage_path: null,
  image_alt: "",

  video_url: null,
  video_storage_path: null,

  poster_image_url: null,
  poster_image_storage_path: null,
  poster_image_alt: "",

  mobile_image_url: null,
  mobile_image_storage_path: null,
  mobile_image_alt: "",

  eyebrow: "",
  heading: "",
  description: "",

  show_button: false,
  button_text: "",
  button_link: "",
  button_open_in_new_tab: false,

  content_alignment: "left",
  vertical_alignment: "center",

  overlay_color: "#05231a",
  overlay_opacity: 58,

  eyebrow_color: null,
  eyebrow_size: null,
  eyebrow_weight: null,

  heading_color: null,
  heading_size: null,
  heading_weight: null,
  heading_line_height: null,

  description_color: null,
  description_size: null,
  description_weight: null,
  description_line_height: null,

  button_text_color: null,
  button_background_color: null,
  button_border_color: null,

  button_hover_text_color: null,
  button_hover_background_color: null,
  button_hover_border_color: null,

  button_font_size: null,
  button_font_weight: null,
  button_padding_x: null,
  button_padding_y: null,
  button_radius: null,

  media_object_position: "center",

  video_autoplay: true,
  video_loop: true,
  video_muted: true,
  video_controls: false,

  display_order: 0,
  is_active: true,
  is_published: false,
};


function mapSlideToForm(
  slide: AboutHeroSlide,
): CreateAboutHeroSlideInput {
  return {
    internal_name: slide.internal_name,
    media_type: slide.media_type,

    image_url: slide.image_url,
    image_storage_path:
      slide.image_storage_path,
    image_alt: slide.image_alt,

    video_url: slide.video_url,
    video_storage_path:
      slide.video_storage_path,

    poster_image_url:
      slide.poster_image_url,
    poster_image_storage_path:
      slide.poster_image_storage_path,
    poster_image_alt:
      slide.poster_image_alt,

    mobile_image_url:
      slide.mobile_image_url,
    mobile_image_storage_path:
      slide.mobile_image_storage_path,
    mobile_image_alt:
      slide.mobile_image_alt,

    eyebrow: slide.eyebrow,
    heading: slide.heading,
    description: slide.description,

    show_button: slide.show_button,
    button_text: slide.button_text,
    button_link: slide.button_link,
    button_open_in_new_tab:
      slide.button_open_in_new_tab,

    content_alignment:
      slide.content_alignment,
    vertical_alignment:
      slide.vertical_alignment,

    overlay_color:
      slide.overlay_color,
    overlay_opacity:
      slide.overlay_opacity,

    eyebrow_color:
      slide.eyebrow_color,
    eyebrow_size:
      slide.eyebrow_size,
    eyebrow_weight:
      slide.eyebrow_weight,

    heading_color:
      slide.heading_color,
    heading_size:
      slide.heading_size,
    heading_weight:
      slide.heading_weight,
    heading_line_height:
      slide.heading_line_height,

    description_color:
      slide.description_color,
    description_size:
      slide.description_size,
    description_weight:
      slide.description_weight,
    description_line_height:
      slide.description_line_height,

    button_text_color:
      slide.button_text_color,
    button_background_color:
      slide.button_background_color,
    button_border_color:
      slide.button_border_color,

    button_hover_text_color:
      slide.button_hover_text_color,
    button_hover_background_color:
      slide.button_hover_background_color,
    button_hover_border_color:
      slide.button_hover_border_color,

    button_font_size:
      slide.button_font_size,
    button_font_weight:
      slide.button_font_weight,
    button_padding_x:
      slide.button_padding_x,
    button_padding_y:
      slide.button_padding_y,
    button_radius:
      slide.button_radius,

    media_object_position:
      slide.media_object_position,

    video_autoplay:
      slide.video_autoplay,
    video_loop:
      slide.video_loop,
    video_muted:
      slide.video_muted,
    video_controls:
      slide.video_controls,

    display_order:
      slide.display_order,
    is_active:
      slide.is_active,
    is_published:
      slide.is_published,
  };
}

export default function HeroSlideForm({
  aboutPageId,
  initialSlide = null,
  mode = "create",
}: HeroSlideFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] =
    useState<CreateAboutHeroSlideInput>(
      initialSlide
        ? mapSlideToForm(initialSlide)
        : INITIAL_FORM,
    );

  const [sources, setSources] =
    useState<Record<MediaTarget, MediaSource>>({
      image:
        initialSlide?.image_storage_path
          ? "upload"
          : initialSlide?.image_url
            ? "url"
            : "upload",
      mobile:
        initialSlide?.mobile_image_storage_path
          ? "upload"
          : initialSlide?.mobile_image_url
            ? "url"
            : "upload",
      video:
        initialSlide?.video_storage_path
          ? "upload"
          : initialSlide?.video_url
            ? "url"
            : "upload",
      poster:
        initialSlide?.poster_image_storage_path
          ? "upload"
          : initialSlide?.poster_image_url
            ? "url"
            : "upload",
    });

  const [files, setFiles] =
    useState<Record<MediaTarget, File | null>>({
      image: null,
      mobile: null,
      video: null,
      poster: null,
    });

  const [previews, setPreviews] =
    useState<Record<MediaTarget, string>>({
      image:
        initialSlide?.image_url ?? "",
      mobile:
        initialSlide?.mobile_image_url ?? "",
      video:
        initialSlide?.video_url ?? "",
      poster:
        initialSlide?.poster_image_url ?? "",
    });

  const [message, setMessage] =
    useState<Message>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitMode, setSubmitMode] =
    useState<"draft" | "publish">(
      initialSlide?.is_published
        ? "publish"
        : "draft",
    );

  const originalStoragePaths = {
    image:
      initialSlide?.image_storage_path ??
      null,
    mobile:
      initialSlide?.mobile_image_storage_path ??
      null,
    video:
      initialSlide?.video_storage_path ??
      null,
    poster:
      initialSlide?.poster_image_storage_path ??
      null,
  };

  useEffect(() => {
    return () => {
      Object.values(previews).forEach(
        (preview) => {
          if (
            preview.startsWith("blob:")
          ) {
            URL.revokeObjectURL(
              preview,
            );
          }
        },
      );
    };
  }, [previews]);

  function updateField<
    K extends keyof CreateAboutHeroSlideInput,
  >(
    field: K,
    value: CreateAboutHeroSlideInput[K],
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage(null);
  }

  function setSource(
    target: MediaTarget,
    source: MediaSource,
  ): void {
    setSources((current) => ({
      ...current,
      [target]: source,
    }));

    if (source === "url") {
      setFiles((current) => ({
        ...current,
        [target]: null,
      }));
    }

    setMessage(null);
  }

  function selectFile(
    event: ChangeEvent<HTMLInputElement>,
    target: MediaTarget,
  ): void {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const isVideo =
      target === "video";

    const isValidType =
      isVideo
        ? file.type.startsWith(
            "video/",
          )
        : file.type.startsWith(
            "image/",
          );

    if (!isValidType) {
      setMessage({
        type: "error",
        text: isVideo
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
        text: isVideo
          ? "Video must be smaller than 100 MB."
          : "Image must be smaller than 10 MB.",
      });

      event.target.value = "";
      return;
    }

    const previousPreview =
      previews[target];

    if (
      previousPreview.startsWith(
        "blob:",
      )
    ) {
      URL.revokeObjectURL(
        previousPreview,
      );
    }

    const preview =
      URL.createObjectURL(file);

    setFiles((current) => ({
      ...current,
      [target]: file,
    }));

    setPreviews((current) => ({
      ...current,
      [target]: preview,
    }));

    setMessage(null);
  }

  function removeMedia(
    target: MediaTarget,
  ): void {
    const preview =
      previews[target];

    if (
      preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(preview);
    }

    setFiles((current) => ({
      ...current,
      [target]: null,
    }));

    setPreviews((current) => ({
      ...current,
      [target]: "",
    }));

    const fieldMap: Record<
      MediaTarget,
      keyof CreateAboutHeroSlideInput
    > = {
      image: "image_url",
      mobile: "mobile_image_url",
      video: "video_url",
      poster: "poster_image_url",
    };

    updateField(
      fieldMap[target],
      null,
    );
  }

  function storagePath(
    file: File,
    folder: string,
  ): string {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "file";

    return `about/hero/${folder}/${crypto.randomUUID()}.${extension}`;
  }

  async function uploadFile(
    file: File,
    folder: string,
  ) {
    const path =
      storagePath(
        file,
        folder,
      );

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
      publicUrl: data.publicUrl,
      storagePath: path,
    };
  }

  async function removeUploadedFile(
    path: string | null,
  ): Promise<void> {
    if (!path) {
      return;
    }

    await supabase.storage
      .from("website-media")
      .remove([path]);
  }

  function validateForm(): string | null {
    if (!form.internal_name.trim()) {
      return "Internal name is required.";
    }

    if (!form.heading.trim()) {
      return "Slide heading is required.";
    }

    if (
      form.media_type === "image" &&
      sources.image === "upload" &&
      !files.image &&
      !form.image_url
    ) {
      return "Please select a desktop hero image.";
    }

    if (
      form.media_type === "image" &&
      sources.image === "url" &&
      !form.image_url?.trim()
    ) {
      return "Please enter a desktop image URL.";
    }

    if (
      form.media_type === "video" &&
      sources.video === "upload" &&
      !files.video &&
      !form.video_url
    ) {
      return "Please select a hero video.";
    }

    if (
      form.media_type === "video" &&
      sources.video === "url" &&
      !form.video_url?.trim()
    ) {
      return "Please enter a video URL.";
    }

    if (
      form.show_button &&
      !form.button_text?.trim()
    ) {
      return "Button text is required when the button is enabled.";
    }

    if (
      form.show_button &&
      !form.button_link?.trim()
    ) {
      return "Button link is required when the button is enabled.";
    }

    if (
      !Number.isInteger(
        form.display_order,
      ) ||
      Number(
        form.display_order,
      ) < 0
    ) {
      return "Display order must be zero or a positive whole number.";
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

    setIsSubmitting(true);
    setMessage(null);

    const uploadedPaths: string[] =
      [];

    try {
      const payload = {
        ...form,
        internal_name:
          form.internal_name.trim(),
        eyebrow:
          form.eyebrow?.trim() ?? "",
        heading:
          form.heading.trim(),
        description:
          form.description?.trim() ?? "",
        button_text:
          form.button_text?.trim() ?? "",
        button_link:
          form.button_link?.trim() ?? "",
        is_published:
          submitMode === "publish",
      };

      if (
        form.media_type === "image"
      ) {
        payload.video_url = null;
        payload.video_storage_path =
          null;

        if (
          sources.image === "upload"
        ) {
          if (files.image) {
            const uploaded =
              await uploadFile(
                files.image,
                "images",
              );

            uploadedPaths.push(
              uploaded.storagePath,
            );

            payload.image_url =
              uploaded.publicUrl;

            payload.image_storage_path =
              uploaded.storagePath;
          } else {
            payload.image_url =
              form.image_url?.trim() ||
              null;

            payload.image_storage_path =
              form.image_storage_path ??
              null;
          }
        } else {
          payload.image_url =
            form.image_url?.trim() ||
            null;

          payload.image_storage_path =
            null;
        }

        if (
          sources.mobile === "upload"
        ) {
          if (files.mobile) {
            const uploaded =
              await uploadFile(
                files.mobile,
                "mobile-images",
              );

            uploadedPaths.push(
              uploaded.storagePath,
            );

            payload.mobile_image_url =
              uploaded.publicUrl;

            payload.mobile_image_storage_path =
              uploaded.storagePath;
          } else {
            payload.mobile_image_url =
              form.mobile_image_url?.trim() ||
              null;

            payload.mobile_image_storage_path =
              form.mobile_image_storage_path ??
              null;
          }
        } else {
          payload.mobile_image_url =
            form.mobile_image_url?.trim() ||
            null;

          payload.mobile_image_storage_path =
            null;
        }
      }

      if (
        form.media_type === "video"
      ) {
        payload.image_url = null;
        payload.image_storage_path =
          null;

        if (
          sources.video === "upload"
        ) {
          if (files.video) {
            const uploaded =
              await uploadFile(
                files.video,
                "videos",
              );

            uploadedPaths.push(
              uploaded.storagePath,
            );

            payload.video_url =
              uploaded.publicUrl;

            payload.video_storage_path =
              uploaded.storagePath;
          } else {
            payload.video_url =
              form.video_url?.trim() ||
              null;

            payload.video_storage_path =
              form.video_storage_path ??
              null;
          }
        } else {
          payload.video_url =
            form.video_url?.trim() ||
            null;

          payload.video_storage_path =
            null;
        }

        if (
          sources.poster === "upload"
        ) {
          if (files.poster) {
            const uploaded =
              await uploadFile(
                files.poster,
                "posters",
              );

            uploadedPaths.push(
              uploaded.storagePath,
            );

            payload.poster_image_url =
              uploaded.publicUrl;

            payload.poster_image_storage_path =
              uploaded.storagePath;
          } else {
            payload.poster_image_url =
              form.poster_image_url?.trim() ||
              null;

            payload.poster_image_storage_path =
              form.poster_image_storage_path ??
              null;
          }
        } else {
          payload.poster_image_url =
            form.poster_image_url?.trim() ||
            null;

          payload.poster_image_storage_path =
            null;
        }
      }

      const result =
        mode === "edit" &&
        initialSlide
          ? await updateAboutHeroSlide(
              initialSlide.id,
              payload,
            )
          : await createAboutHeroSlide(
              aboutPageId,
              payload,
            );

      if (!result.success) {
        throw new Error(
          result.errors.join(" "),
        );
      }

      if (
        mode === "edit" &&
        initialSlide
      ) {
        const replacementPairs = [
          {
            oldPath:
              originalStoragePaths.image,
            newPath:
              payload.image_storage_path,
          },
          {
            oldPath:
              originalStoragePaths.mobile,
            newPath:
              payload.mobile_image_storage_path,
          },
          {
            oldPath:
              originalStoragePaths.video,
            newPath:
              payload.video_storage_path,
          },
          {
            oldPath:
              originalStoragePaths.poster,
            newPath:
              payload.poster_image_storage_path,
          },
        ];

        await Promise.all(
          replacementPairs.map(
            async ({
              oldPath,
              newPath,
            }) => {
              if (
                oldPath &&
                oldPath !== newPath
              ) {
                await removeUploadedFile(
                  oldPath,
                );
              }
            },
          ),
        );
      }

      setMessage({
        type: "success",
        text:
          mode === "edit"
            ? submitMode === "publish"
              ? "Hero slide updated and published successfully."
              : "Hero slide updated and saved as draft."
            : submitMode === "publish"
              ? "Hero slide published successfully."
              : "Hero slide saved as draft.",
      });

      router.push(
        "/admin/website/about/hero",
      );

      router.refresh();
    } catch (error) {
      await Promise.all(
        uploadedPaths.map(
          (path) =>
            removeUploadedFile(path),
        ),
      );

      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to create the hero slide.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function MediaSourceTabs({
    target,
  }: {
    target: MediaTarget;
  }) {
    return (
      <div className="heroUploadBox__sources">
        <button
          type="button"
          className={
            sources[target] === "upload"
              ? "isActive"
              : undefined
          }
          onClick={() =>
            setSource(
              target,
              "upload",
            )
          }
        >
          Upload file
        </button>

        <button
          type="button"
          className={
            sources[target] === "url"
              ? "isActive"
              : undefined
          }
          onClick={() =>
            setSource(
              target,
              "url",
            )
          }
        >
          Use URL
        </button>
      </div>
    );
  }

  function MediaControl({
    target,
    label,
    accept,
    urlField,
  }: {
    target: MediaTarget;
    label: string;
    accept: string;
    urlField:
      | "image_url"
      | "mobile_image_url"
      | "video_url"
      | "poster_image_url";
  }) {
    const preview =
      previews[target] ||
      String(
        form[urlField] ?? "",
      );

    const isVideo =
      target === "video";

    return (
      <div className="heroUploadBox">
        <div className="heroUploadBox__heading">
          <div>
            <strong>{label}</strong>

            <span>
              {isVideo
                ? "Maximum file size: 100 MB"
                : "Maximum file size: 10 MB"}
            </span>
          </div>

          <MediaSourceTabs
            target={target}
          />
        </div>

        {sources[target] ===
        "upload" ? (
          <label className="heroUploadBox__button">
            <Upload size={18} />

            Choose file

            <input
              type="file"
              accept={accept}
              onChange={(event) =>
                selectFile(
                  event,
                  target,
                )
              }
            />
          </label>
        ) : (
          <label className="heroFormField heroFormField--full">
            <span>Direct URL</span>

            <input
              type="url"
              value={
                String(
                  form[urlField] ?? "",
                )
              }
              onChange={(event) =>
                updateField(
                  urlField,
                  event.target.value ||
                    null,
                )
              }
              placeholder="https://..."
            />
          </label>
        )}

        {preview ? (
          <div
            className={
              isVideo
                ? "heroMediaPreview"
                : "heroPosterPreview"
            }
          >
            {isVideo ? (
              <video
                src={preview}
                controls
                muted
                playsInline
              />
            ) : (
              <img
                src={preview}
                alt=""
              />
            )}

            <button
              type="button"
              className="heroMediaPreview__remove"
              onClick={() =>
                removeMedia(target)
              }
              aria-label={`Remove ${label}`}
            >
              <X size={16} />
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="heroEditor"
    >
      {message ? (
        <div
          className={`heroEditor__message ${
            message.type === "success"
              ? "isSuccess"
              : "isError"
          }`}
        >
          {message.type ===
          "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          {message.text}
        </div>
      ) : null}

      <div className="heroEditor__layout">
        <main className="heroEditor__main">
          <section className="heroEditorCard">
            <div className="heroEditorCard__heading">
              <div>
                <span>Slide details</span>

                <h2>
                  Basic information
                </h2>
              </div>
            </div>

            <div className="heroEditorCard__body">
              <div className="heroFormGrid">
                <label className="heroFormField">
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
                    required
                  />
                </label>

                <label className="heroFormField">
                  <span>Media type</span>

                  <select
                    value={
                      form.media_type
                    }
                    onChange={(event) =>
                      updateField(
                        "media_type",
                        event.target
                          .value as AboutHeroMediaType,
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

                <label className="heroFormField">
                  <span>
                    Content alignment
                  </span>

                  <select
                    value={
                      form.content_alignment
                    }
                    onChange={(event) =>
                      updateField(
                        "content_alignment",
                        event.target
                          .value as AboutHeroContentAlignment,
                      )
                    }
                  >
                    <option value="left">
                      Left
                    </option>

                    <option value="center">
                      Centre
                    </option>

                    <option value="right">
                      Right
                    </option>
                  </select>
                </label>

                <label className="heroFormField">
                  <span>
                    Vertical alignment
                  </span>

                  <select
                    value={
                      form.vertical_alignment
                    }
                    onChange={(event) =>
                      updateField(
                        "vertical_alignment",
                        event.target
                          .value as AboutHeroVerticalAlignment,
                      )
                    }
                  >
                    <option value="top">
                      Top
                    </option>

                    <option value="center">
                      Centre
                    </option>

                    <option value="bottom">
                      Bottom
                    </option>
                  </select>
                </label>

                <label className="heroFormField">
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
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="heroEditorCard">
            <div className="heroEditorCard__heading">
              <div>
                <span>Media</span>

                <h2>
                  Hero media
                </h2>
              </div>
            </div>

            <div className="heroEditorCard__body">
              {form.media_type ===
              "image" ? (
                <>
                  <MediaControl
                    target="image"
                    label="Desktop hero image"
                    accept="image/*"
                    urlField="image_url"
                  />

                  <MediaControl
                    target="mobile"
                    label="Mobile hero image"
                    accept="image/*"
                    urlField="mobile_image_url"
                  />

                  <div className="heroFormGrid">
                    <label className="heroFormField">
                      <span>
                        Desktop image alt text
                      </span>

                      <input
                        type="text"
                        value={
                          form.image_alt ??
                          ""
                        }
                        onChange={(event) =>
                          updateField(
                            "image_alt",
                            event.target
                              .value,
                          )
                        }
                      />
                    </label>

                    <label className="heroFormField">
                      <span>
                        Mobile image alt text
                      </span>

                      <input
                        type="text"
                        value={
                          form.mobile_image_alt ??
                          ""
                        }
                        onChange={(event) =>
                          updateField(
                            "mobile_image_alt",
                            event.target
                              .value,
                          )
                        }
                      />
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <MediaControl
                    target="video"
                    label="Hero video"
                    accept="video/*"
                    urlField="video_url"
                  />

                  <MediaControl
                    target="poster"
                    label="Video poster image"
                    accept="image/*"
                    urlField="poster_image_url"
                  />

                  <label className="heroFormField heroFormField--full">
                    <span>
                      Poster image alt text
                    </span>

                    <input
                      type="text"
                      value={
                        form.poster_image_alt ??
                        ""
                      }
                      onChange={(event) =>
                        updateField(
                          "poster_image_alt",
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <div className="heroFormGrid">
                    <label className="heroToggle">
                      <span>
                        Autoplay video
                      </span>

                      <input
                        type="checkbox"
                        checked={
                          form.video_autoplay
                        }
                        onChange={(event) =>
                          updateField(
                            "video_autoplay",
                            event.target
                              .checked,
                          )
                        }
                      />
                    </label>

                    <label className="heroToggle">
                      <span>
                        Loop video
                      </span>

                      <input
                        type="checkbox"
                        checked={
                          form.video_loop
                        }
                        onChange={(event) =>
                          updateField(
                            "video_loop",
                            event.target
                              .checked,
                          )
                        }
                      />
                    </label>

                    <label className="heroToggle">
                      <span>
                        Mute video
                      </span>

                      <input
                        type="checkbox"
                        checked={
                          form.video_muted
                        }
                        onChange={(event) =>
                          updateField(
                            "video_muted",
                            event.target
                              .checked,
                          )
                        }
                      />
                    </label>

                    <label className="heroToggle">
                      <span>
                        Show controls
                      </span>

                      <input
                        type="checkbox"
                        checked={
                          form.video_controls
                        }
                        onChange={(event) =>
                          updateField(
                            "video_controls",
                            event.target
                              .checked,
                          )
                        }
                      />
                    </label>
                  </div>
                </>
              )}

              <label className="heroFormField heroFormField--full">
                <span>
                  Media object position
                </span>

                <select
                  value={
                    form.media_object_position
                  }
                  onChange={(event) =>
                    updateField(
                      "media_object_position",
                      event.target.value,
                    )
                  }
                >
                  <option value="center">
                    Centre
                  </option>

                  <option value="top">
                    Top
                  </option>

                  <option value="bottom">
                    Bottom
                  </option>

                  <option value="left">
                    Left
                  </option>

                  <option value="right">
                    Right
                  </option>
                </select>
              </label>
            </div>
          </section>

          <section className="heroEditorCard">
            <div className="heroEditorCard__heading">
              <div>
                <span>Content</span>

                <h2>
                  Slide content
                </h2>
              </div>
            </div>

            <div className="heroEditorCard__body">
              <div className="heroFormGrid">
                <label className="heroFormField">
                  <span>Eyebrow</span>

                  <input
                    type="text"
                    value={
                      form.eyebrow ?? ""
                    }
                    onChange={(event) =>
                      updateField(
                        "eyebrow",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="heroFormField heroFormField--full">
                  <span>Heading</span>

                  <input
                    type="text"
                    value={form.heading}
                    onChange={(event) =>
                      updateField(
                        "heading",
                        event.target.value,
                      )
                    }
                    required
                  />
                </label>

                <label className="heroFormField heroFormField--full">
                  <span>Description</span>

                  <textarea
                    rows={5}
                    value={
                      form.description ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "description",
                        event.target.value,
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="heroEditorCard">
            <div className="heroEditorCard__heading">
              <div>
                <span>
                  Typography
                </span>

                <h2>
                  Per-slide typography
                </h2>
              </div>
            </div>

            <div className="heroEditorCard__body">
              <p className="heroEditorCard__hint">
                Leave optional fields empty to
                inherit the global Hero Settings.
              </p>

              <div className="heroFormGrid heroFormGrid--three">
                <label className="heroFormField">
                  <span>
                    Eyebrow colour
                  </span>

                  <input
                    type="color"
                    value={
                      form.eyebrow_color ??
                      "#ffffff"
                    }
                    onChange={(event) =>
                      updateField(
                        "eyebrow_color",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="heroFormField">
                  <span>
                    Eyebrow size
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.eyebrow_size ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "eyebrow_size",
                        event.target.value
                          ? Number(
                              event.target
                                .value,
                            )
                          : null,
                      )
                    }
                  />
                </label>

                <label className="heroFormField">
                  <span>
                    Eyebrow weight
                  </span>

                  <input
                    type="number"
                    min="100"
                    max="1000"
                    step="100"
                    value={
                      form.eyebrow_weight ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "eyebrow_weight",
                        event.target.value
                          ? Number(
                              event.target
                                .value,
                            )
                          : null,
                      )
                    }
                  />
                </label>

                <label className="heroFormField">
                  <span>
                    Heading colour
                  </span>

                  <input
                    type="color"
                    value={
                      form.heading_color ??
                      "#ffffff"
                    }
                    onChange={(event) =>
                      updateField(
                        "heading_color",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="heroFormField">
                  <span>
                    Heading size
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.heading_size ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "heading_size",
                        event.target.value
                          ? Number(
                              event.target
                                .value,
                            )
                          : null,
                      )
                    }
                  />
                </label>

                <label className="heroFormField">
                  <span>
                    Heading weight
                  </span>

                  <input
                    type="number"
                    min="100"
                    max="1000"
                    step="100"
                    value={
                      form.heading_weight ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "heading_weight",
                        event.target.value
                          ? Number(
                              event.target
                                .value,
                            )
                          : null,
                      )
                    }
                  />
                </label>

                <label className="heroFormField">
                  <span>
                    Heading line height
                  </span>

                  <input
                    type="number"
                    min="0.5"
                    max="3"
                    step="0.05"
                    value={
                      form.heading_line_height ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "heading_line_height",
                        event.target.value
                          ? Number(
                              event.target
                                .value,
                            )
                          : null,
                      )
                    }
                  />
                </label>

                <label className="heroFormField">
                  <span>
                    Description colour
                  </span>

                  <input
                    type="color"
                    value={
                      form.description_color ??
                      "#ffffff"
                    }
                    onChange={(event) =>
                      updateField(
                        "description_color",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="heroFormField">
                  <span>
                    Description size
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.description_size ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "description_size",
                        event.target.value
                          ? Number(
                              event.target
                                .value,
                            )
                          : null,
                      )
                    }
                  />
                </label>

                <label className="heroFormField">
                  <span>
                    Description weight
                  </span>

                  <input
                    type="number"
                    min="100"
                    max="1000"
                    step="100"
                    value={
                      form.description_weight ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "description_weight",
                        event.target.value
                          ? Number(
                              event.target
                                .value,
                            )
                          : null,
                      )
                    }
                  />
                </label>

                <label className="heroFormField">
                  <span>
                    Description line height
                  </span>

                  <input
                    type="number"
                    min="0.5"
                    max="3"
                    step="0.05"
                    value={
                      form.description_line_height ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "description_line_height",
                        event.target.value
                          ? Number(
                              event.target
                                .value,
                            )
                          : null,
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="heroEditorCard">
            <div className="heroEditorCard__heading">
              <div>
                <span>Button</span>

                <h2>
                  Slide button
                </h2>
              </div>
            </div>

            <div className="heroEditorCard__body">
              <label className="heroToggle">
                <span>Show button</span>

                <input
                  type="checkbox"
                  checked={
                    form.show_button
                  }
                  onChange={(event) =>
                    updateField(
                      "show_button",
                      event.target.checked,
                    )
                  }
                />
              </label>

              <label className="heroToggle">
                <span>
                  Open in new tab
                </span>

                <input
                  type="checkbox"
                  checked={
                    form.button_open_in_new_tab
                  }
                  onChange={(event) =>
                    updateField(
                      "button_open_in_new_tab",
                      event.target.checked,
                    )
                  }
                />
              </label>

              <div className="heroFormGrid">
                <label className="heroFormField">
                  <span>Button text</span>

                  <input
                    type="text"
                    value={
                      form.button_text ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "button_text",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="heroFormField">
                  <span>Button link</span>

                  <input
                    type="text"
                    value={
                      form.button_link ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "button_link",
                        event.target.value,
                      )
                    }
                  />
                </label>
              </div>

              <div className="heroFormGrid heroFormGrid--three">
                {[
                  ["Text colour", "button_text_color", "#ffffff"],
                  ["Background", "button_background_color", "#315f45"],
                  ["Border", "button_border_color", "#315f45"],
                  ["Hover text", "button_hover_text_color", "#ffffff"],
                  ["Hover background", "button_hover_background_color", "#163d2a"],
                  ["Hover border", "button_hover_border_color", "#163d2a"],
                ].map(
                  ([
                    label,
                    field,
                    fallback,
                  ]) => (
                    <label
                      className="heroFormField"
                      key={field}
                    >
                      <span>{label}</span>

                      <input
                        type="color"
                        value={
                          String(
                            form[
                              field as keyof CreateAboutHeroSlideInput
                            ] ??
                              fallback,
                          )
                        }
                        onChange={(event) =>
                          updateField(
                            field as keyof CreateAboutHeroSlideInput,
                            event.target
                              .value as never,
                          )
                        }
                      />
                    </label>
                  ),
                )}

                <label className="heroFormField">
                  <span>Font size</span>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.button_font_size ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "button_font_size",
                        event.target.value
                          ? Number(
                              event.target
                                .value,
                            )
                          : null,
                      )
                    }
                  />
                </label>

                <label className="heroFormField">
                  <span>Font weight</span>

                  <input
                    type="number"
                    min="100"
                    max="1000"
                    step="100"
                    value={
                      form.button_font_weight ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "button_font_weight",
                        event.target.value
                          ? Number(
                              event.target
                                .value,
                            )
                          : null,
                      )
                    }
                  />
                </label>

                <label className="heroFormField">
                  <span>Padding X</span>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.button_padding_x ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "button_padding_x",
                        event.target.value
                          ? Number(
                              event.target
                                .value,
                            )
                          : null,
                      )
                    }
                  />
                </label>

                <label className="heroFormField">
                  <span>Padding Y</span>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.button_padding_y ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "button_padding_y",
                        event.target.value
                          ? Number(
                              event.target
                                .value,
                            )
                          : null,
                      )
                    }
                  />
                </label>

                <label className="heroFormField">
                  <span>Radius</span>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.button_radius ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "button_radius",
                        event.target.value
                          ? Number(
                              event.target
                                .value,
                            )
                          : null,
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="heroEditorCard">
            <div className="heroEditorCard__heading">
              <div>
                <span>Overlay</span>

                <h2>
                  Media overlay
                </h2>
              </div>
            </div>

            <div className="heroEditorCard__body">
              <div className="heroFormGrid">
                <label className="heroFormField">
                  <span>Overlay colour</span>

                  <input
                    type="color"
                    value={
                      form.overlay_color ??
                      "#05231a"
                    }
                    onChange={(event) =>
                      updateField(
                        "overlay_color",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="heroFormField">
                  <span>
                    Overlay opacity
                  </span>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={
                      form.overlay_opacity
                    }
                    onChange={(event) =>
                      updateField(
                        "overlay_opacity",
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </section>
        </main>

        <aside className="heroEditor__sidebar">
          <section className="heroEditorCard heroEditorCard--preview">
            <div className="heroEditorCard__heading">
              <div>
                <span>Preview</span>

                <h2>
                  Content preview
                </h2>
              </div>
            </div>

            <div className="heroEditorCard__body">
              <div
                className="heroContentPreview"
                style={{
                  background:
                    form.overlay_color ??
                    "#05231a",
                  textAlign:
                    form.content_alignment,
                }}
              >
                {form.eyebrow ? (
                  <span
                    style={{
                      color:
                        form.eyebrow_color ??
                        "#ffffff",
                      fontSize:
                        form.eyebrow_size
                          ? `${form.eyebrow_size}px`
                          : undefined,
                      fontWeight:
                        form.eyebrow_weight ??
                        undefined,
                    }}
                  >
                    {form.eyebrow}
                  </span>
                ) : null}

                <h3
                  style={{
                    color:
                      form.heading_color ??
                      "#ffffff",
                    fontSize:
                      form.heading_size
                        ? `${form.heading_size}px`
                        : undefined,
                    fontWeight:
                      form.heading_weight ??
                      undefined,
                    lineHeight:
                      form.heading_line_height ??
                      undefined,
                  }}
                >
                  {form.heading ||
                    "Hero slide heading"}
                </h3>

                <p
                  style={{
                    color:
                      form.description_color ??
                      "#ffffff",
                    fontSize:
                      form.description_size
                        ? `${form.description_size}px`
                        : undefined,
                    fontWeight:
                      form.description_weight ??
                      undefined,
                    lineHeight:
                      form.description_line_height ??
                      undefined,
                  }}
                >
                  {form.description ||
                    "Hero slide description will appear here."}
                </p>

                {form.show_button ? (
                  <span
                    className="heroContentPreview__button"
                    style={{
                      color:
                        form.button_text_color ??
                        "#ffffff",
                      background:
                        form.button_background_color ??
                        "#315f45",
                      borderColor:
                        form.button_border_color ??
                        "#315f45",
                      borderRadius:
                        form.button_radius
                          ? `${form.button_radius}px`
                          : undefined,
                    }}
                  >
                    {form.button_text ||
                      "Button text"}
                  </span>
                ) : null}
              </div>
            </div>
          </section>

          <section className="heroEditorCard">
            <div className="heroEditorCard__heading">
              <div>
                <span>Status</span>

                <h2>
                  Visibility
                </h2>
              </div>
            </div>

            <div className="heroEditorCard__body">
              <label className="heroToggle">
                <span>Active</span>

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
              </label>
            </div>
          </section>
        </aside>
      </div>

      <footer className="heroEditor__footer">
        <div className="heroEditor__footerStatus">
          <Eye size={17} />

          <div>
            <span>
              Publication status
            </span>

            <strong>
              {submitMode === "publish"
                ? "Publish on save"
                : "Save as draft"}
            </strong>
          </div>
        </div>

        <div className="heroEditor__footerActions">
          <button
            type="submit"
            className="heroEditor__draftButton"
            disabled={isSubmitting}
            onClick={() =>
              setSubmitMode("draft")
            }
          >
            {isSubmitting &&
            submitMode === "draft" ? (
              <Loader2
                className="heroEditor__spinner"
                size={17}
              />
            ) : (
              <Save size={17} />
            )}

            {mode === "edit"
              ? "Save as Draft"
              : "Save Draft"}
          </button>

          <button
            type="submit"
            className="heroEditor__publishButton"
            disabled={isSubmitting}
            onClick={() =>
              setSubmitMode("publish")
            }
          >
            {isSubmitting &&
            submitMode === "publish" ? (
              <Loader2
                className="heroEditor__spinner"
                size={17}
              />
            ) : (
              <CheckCircle2
                size={17}
              />
            )}

            {mode === "edit"
              ? "Update & Publish"
              : "Publish Slide"}
          </button>
        </div>
      </footer>
    </form>
  );
}
