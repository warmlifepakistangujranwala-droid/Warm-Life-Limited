/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/services/hero/new/ServiceHeroSlideForm.tsx
 *
 * Purpose :
 * Reusable Add/Edit Services Hero Slide form with computer
 * uploads, optional URLs and existing media preservation.
 *
 * Version : v1.0.0
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
  createServiceHeroSlide,
  updateServiceHeroSlide,
} from "@/lib/actions/services-page";

import { createClient } from "@/lib/supabase/client";

import type {
  CreateServiceHeroSlideInput,
  ServiceHeroSlide,
  ServicesContentAlignment,
  ServicesHeroMediaType,
  ServicesVerticalAlignment,
} from "@/lib/types/services-page";

type MediaKey =
  | "image"
  | "mobile"
  | "video"
  | "poster";

type MediaSource =
  | "upload"
  | "url";

type ServiceHeroSlideFormProps = {
  servicesPageId: string;
  initialSlide?: ServiceHeroSlide | null;
};

type Message = {
  type: "success" | "error";
  text: string;
} | null;

const INITIAL_FORM: CreateServiceHeroSlideInput = {
  internal_name: "",
  media_type: "image",

  image_url: null,
  image_storage_path: null,
  image_alt: "",

  mobile_image_url: null,
  mobile_image_storage_path: null,
  mobile_image_alt: "",

  video_url: null,
  video_storage_path: null,

  poster_image_url: null,
  poster_image_storage_path: null,
  poster_image_alt: "",

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

  media_object_position: "center",

  video_autoplay: true,
  video_loop: true,
  video_muted: true,
  video_controls: false,

  display_order: 0,

  is_active: true,
  is_published: false,
};

export default function ServiceHeroSlideForm({
  servicesPageId,
  initialSlide = null,
}: ServiceHeroSlideFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const isEditing =
    Boolean(initialSlide?.id);

  const [form, setForm] =
    useState<CreateServiceHeroSlideInput>(
      initialSlide
        ? {
            ...INITIAL_FORM,
            ...initialSlide,
          }
        : INITIAL_FORM,
    );

  const [files, setFiles] =
    useState<
      Partial<Record<MediaKey, File>>
    >({});

  const [sources, setSources] =
    useState<
      Record<MediaKey, MediaSource>
    >({
      image:
        initialSlide
          ?.image_storage_path
          ? "upload"
          : initialSlide?.image_url
            ? "url"
            : "upload",

      mobile:
        initialSlide
          ?.mobile_image_storage_path
          ? "upload"
          : initialSlide?.mobile_image_url
            ? "url"
            : "upload",

      video:
        initialSlide
          ?.video_storage_path
          ? "upload"
          : initialSlide?.video_url
            ? "url"
            : "upload",

      poster:
        initialSlide
          ?.poster_image_storage_path
          ? "upload"
          : initialSlide?.poster_image_url
            ? "url"
            : "upload",
    });

  const [previews, setPreviews] =
    useState<Record<MediaKey, string>>({
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

  const [isSaving, setIsSaving] =
    useState(false);

  function updateField<
    K extends keyof CreateServiceHeroSlideInput,
  >(
    field: K,
    value: CreateServiceHeroSlideInput[K],
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage(null);
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

    const expectsVideo =
      key === "video";

    if (
      expectsVideo &&
      !file.type.startsWith("video/")
    ) {
      setMessage({
        type: "error",
        text:
          "Please select a valid video file.",
      });

      event.target.value = "";
      return;
    }

    if (
      !expectsVideo &&
      !file.type.startsWith("image/")
    ) {
      setMessage({
        type: "error",
        text:
          "Please select a valid image file.",
      });

      event.target.value = "";
      return;
    }

    const maximumSize =
      expectsVideo
        ? 100 * 1024 * 1024
        : 10 * 1024 * 1024;

    if (file.size > maximumSize) {
      setMessage({
        type: "error",
        text:
          expectsVideo
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

    if (key === "image") {
      updateField("image_url", null);
      updateField(
        "image_storage_path",
        null,
      );
    }

    if (key === "mobile") {
      updateField(
        "mobile_image_url",
        null,
      );
      updateField(
        "mobile_image_storage_path",
        null,
      );
    }

    if (key === "video") {
      updateField("video_url", null);
      updateField(
        "video_storage_path",
        null,
      );
    }

    if (key === "poster") {
      updateField(
        "poster_image_url",
        null,
      );
      updateField(
        "poster_image_storage_path",
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
      `services/hero/${folder}/${crypto.randomUUID()}.${extension}`;

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

  async function removeStoredFiles(
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
    if (!form.internal_name?.trim()) {
      return "Internal name is required.";
    }

    if (!form.heading.trim()) {
      return "Slide heading is required.";
    }

    if (
      form.media_type === "image" &&
      !files.image &&
      !form.image_url &&
      !form.image_storage_path
    ) {
      return "Desktop image is required.";
    }

    if (
      form.media_type === "video" &&
      !files.video &&
      !form.video_url &&
      !form.video_storage_path
    ) {
      return "Video is required.";
    }

    if (
      form.show_button &&
      !form.button_text?.trim()
    ) {
      return "Button text is required.";
    }

    if (
      form.show_button &&
      !form.button_link?.trim()
    ) {
      return "Button link is required.";
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

    const newPaths: string[] = [];
    const oldPaths: string[] = [];

    try {
      const payload: CreateServiceHeroSlideInput = {
        ...form,
        internal_name:
          form.internal_name.trim(),

        heading:
          form.heading.trim(),

        eyebrow:
          form.eyebrow?.trim() ?? "",

        description:
          form.description?.trim() ?? "",

        button_text:
          form.button_text?.trim() ?? "",

        button_link:
          form.button_link?.trim() ?? "",
      };

      const mediaConfig: Array<{
        key: MediaKey;
        folder: string;
        urlField:
          | "image_url"
          | "mobile_image_url"
          | "video_url"
          | "poster_image_url";
        pathField:
          | "image_storage_path"
          | "mobile_image_storage_path"
          | "video_storage_path"
          | "poster_image_storage_path";
      }> = [
        {
          key: "image",
          folder: "images",
          urlField: "image_url",
          pathField:
            "image_storage_path",
        },
        {
          key: "mobile",
          folder: "mobile-images",
          urlField:
            "mobile_image_url",
          pathField:
            "mobile_image_storage_path",
        },
        {
          key: "video",
          folder: "videos",
          urlField: "video_url",
          pathField:
            "video_storage_path",
        },
        {
          key: "poster",
          folder: "posters",
          urlField:
            "poster_image_url",
          pathField:
            "poster_image_storage_path",
        },
      ];

      for (
        const config of mediaConfig
      ) {
        if (
          sources[config.key] ===
          "upload"
        ) {
          const selectedFile =
            files[config.key];

          if (selectedFile) {
            const uploaded =
              await uploadFile(
                selectedFile,
                config.folder,
              );

            newPaths.push(
              uploaded.storagePath,
            );

            const oldPath =
              form[
                config.pathField
              ];

            if (
              typeof oldPath ===
                "string" &&
              oldPath
            ) {
              oldPaths.push(oldPath);
            }

            payload[
              config.urlField
            ] = uploaded.publicUrl;

            payload[
              config.pathField
            ] = uploaded.storagePath;
          }
        } else {
          const oldPath =
            form[
              config.pathField
            ];

          if (
            typeof oldPath ===
              "string" &&
            oldPath
          ) {
            oldPaths.push(oldPath);
          }

          payload[
            config.pathField
          ] = null;
        }
      }

      const result =
        isEditing &&
        initialSlide
          ? await updateServiceHeroSlide(
              initialSlide.id,
              payload,
            )
          : await createServiceHeroSlide(
              servicesPageId,
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

      if (oldPaths.length > 0) {
        await removeStoredFiles(
          oldPaths,
        );
      }

      setMessage({
        type: "success",
        text:
          isEditing
            ? "Hero slide updated successfully."
            : "Hero slide created successfully.",
      });

      router.push(
        "/admin/website/services/hero",
      );

      router.refresh();
    } catch (error) {
      await removeStoredFiles(
        newPaths,
      );

      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to save hero slide.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  function renderMediaField(
    key: MediaKey,
    label: string,
    urlField:
      | "image_url"
      | "mobile_image_url"
      | "video_url"
      | "poster_image_url",
    accept: string,
  ) {
    const isVideo =
      key === "video";

    return (
      <div className="serviceHeroMedia">
        <div className="serviceHeroMedia__heading">
          <div>
            <strong>{label}</strong>
            <span>
              Upload from computer or use a direct URL.
            </span>
          </div>

          <div className="serviceHeroMedia__tabs">
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
          <label className="serviceHeroMedia__upload">
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
          <label className="serviceHeroField">
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
          <div className="serviceHeroMedia__preview">
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
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <div className="serviceHeroMedia__empty">
            <ImageIcon size={26} />
            No media selected
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      className="serviceHeroEditor"
      onSubmit={handleSubmit}
    >
      {message ? (
        <div
          className={`serviceHeroEditor__message ${
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

      <section className="serviceHeroFormCard">
        <div className="serviceHeroFormCard__heading">
          <span>Slide content</span>
          <h2>Basic information</h2>
        </div>

        <div className="serviceHeroFormCard__body serviceHeroGrid">
          <label className="serviceHeroField">
            <span>Internal name *</span>

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

          <label className="serviceHeroField">
            <span>Media type</span>

            <select
              value={form.media_type}
              onChange={(event) =>
                updateField(
                  "media_type",
                  event.target
                    .value as ServicesHeroMediaType,
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

          <label className="serviceHeroField">
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

          <label className="serviceHeroField">
            <span>Display order</span>

            <input
              type="number"
              min="0"
              value={form.display_order}
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

          <label className="serviceHeroField serviceHeroField--full">
            <span>Heading *</span>

            <input
              type="text"
              value={form.heading}
              onChange={(event) =>
                updateField(
                  "heading",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="serviceHeroField serviceHeroField--full">
            <span>Description</span>

            <textarea
              rows={6}
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value,
                )
              }
            />
          </label>
        </div>
      </section>

      <section className="serviceHeroFormCard">
        <div className="serviceHeroFormCard__heading">
          <span>Slide media</span>
          <h2>
            {form.media_type === "image"
              ? "Images"
              : "Video and poster"}
          </h2>
        </div>

        <div className="serviceHeroFormCard__body">
          {form.media_type === "image" ? (
            <>
              {renderMediaField(
                "image",
                "Desktop image *",
                "image_url",
                "image/*",
              )}

              <label className="serviceHeroField">
                <span>Desktop image alt text</span>

                <input
                  type="text"
                  value={form.image_alt}
                  onChange={(event) =>
                    updateField(
                      "image_alt",
                      event.target.value,
                    )
                  }
                />
              </label>

              {renderMediaField(
                "mobile",
                "Mobile image",
                "mobile_image_url",
                "image/*",
              )}

              <label className="serviceHeroField">
                <span>Mobile image alt text</span>

                <input
                  type="text"
                  value={form.mobile_image_alt}
                  onChange={(event) =>
                    updateField(
                      "mobile_image_alt",
                      event.target.value,
                    )
                  }
                />
              </label>
            </>
          ) : (
            <>
              {renderMediaField(
                "video",
                "Hero video *",
                "video_url",
                "video/*",
              )}

              {renderMediaField(
                "poster",
                "Video poster",
                "poster_image_url",
                "image/*",
              )}

              <label className="serviceHeroField">
                <span>Poster alt text</span>

                <input
                  type="text"
                  value={form.poster_image_alt}
                  onChange={(event) =>
                    updateField(
                      "poster_image_alt",
                      event.target.value,
                    )
                  }
                />
              </label>
            </>
          )}
        </div>
      </section>

      <section className="serviceHeroFormCard">
        <div className="serviceHeroFormCard__heading">
          <span>Content layout</span>
          <h2>Alignment and overlay</h2>
        </div>

        <div className="serviceHeroFormCard__body serviceHeroGrid">
          <label className="serviceHeroField">
            <span>Horizontal alignment</span>

            <select
              value={form.content_alignment}
              onChange={(event) =>
                updateField(
                  "content_alignment",
                  event.target
                    .value as ServicesContentAlignment,
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

          <label className="serviceHeroField">
            <span>Vertical alignment</span>

            <select
              value={form.vertical_alignment}
              onChange={(event) =>
                updateField(
                  "vertical_alignment",
                  event.target
                    .value as ServicesVerticalAlignment,
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

          <label className="serviceHeroField">
            <span>Overlay colour</span>

            <input
              type="color"
              value={form.overlay_color}
              onChange={(event) =>
                updateField(
                  "overlay_color",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="serviceHeroField">
            <span>Overlay opacity</span>

            <input
              type="number"
              min="0"
              max="100"
              value={form.overlay_opacity}
              onChange={(event) =>
                updateField(
                  "overlay_opacity",
                  Number(
                    event.target.value,
                  ),
                )
              }
            />
          </label>

          <label className="serviceHeroField">
            <span>Media object position</span>

            <select
              value={form.media_object_position}
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

      <section className="serviceHeroFormCard">
        <div className="serviceHeroFormCard__heading">
          <span>Slide button</span>
          <h2>Call to action</h2>
        </div>

        <div className="serviceHeroFormCard__body serviceHeroGrid">
          <label className="serviceHeroToggle">
            <input
              type="checkbox"
              checked={form.show_button}
              onChange={(event) =>
                updateField(
                  "show_button",
                  event.target.checked,
                )
              }
            />

            <span>Show button</span>
          </label>

          {form.show_button ? (
            <>
              <label className="serviceHeroField">
                <span>Button text *</span>

                <input
                  type="text"
                  value={form.button_text}
                  onChange={(event) =>
                    updateField(
                      "button_text",
                      event.target.value,
                    )
                  }
                />
              </label>

              <label className="serviceHeroField">
                <span>Button link *</span>

                <input
                  type="text"
                  value={form.button_link}
                  onChange={(event) =>
                    updateField(
                      "button_link",
                      event.target.value,
                    )
                  }
                />
              </label>

              <label className="serviceHeroToggle">
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

                <span>Open in new tab</span>
              </label>
            </>
          ) : null}
        </div>
      </section>

      {form.media_type === "video" ? (
        <section className="serviceHeroFormCard">
          <div className="serviceHeroFormCard__heading">
            <span>Video playback</span>
            <h2>Video options</h2>
          </div>

          <div className="serviceHeroFormCard__body serviceHeroGrid">
            <label className="serviceHeroToggle">
              <input
                type="checkbox"
                checked={form.video_autoplay}
                onChange={(event) =>
                  updateField(
                    "video_autoplay",
                    event.target.checked,
                  )
                }
              />

              <span>Autoplay</span>
            </label>

            <label className="serviceHeroToggle">
              <input
                type="checkbox"
                checked={form.video_loop}
                onChange={(event) =>
                  updateField(
                    "video_loop",
                    event.target.checked,
                  )
                }
              />

              <span>Loop</span>
            </label>

            <label className="serviceHeroToggle">
              <input
                type="checkbox"
                checked={form.video_muted}
                onChange={(event) =>
                  updateField(
                    "video_muted",
                    event.target.checked,
                  )
                }
              />

              <span>Muted</span>
            </label>

            <label className="serviceHeroToggle">
              <input
                type="checkbox"
                checked={form.video_controls}
                onChange={(event) =>
                  updateField(
                    "video_controls",
                    event.target.checked,
                  )
                }
              />

              <span>Show controls</span>
            </label>
          </div>
        </section>
      ) : null}

      <section className="serviceHeroFormCard">
        <div className="serviceHeroFormCard__heading">
          <span>Publishing</span>
          <h2>Status</h2>
        </div>

        <div className="serviceHeroFormCard__body serviceHeroGrid">
          <label className="serviceHeroToggle">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                updateField(
                  "is_active",
                  event.target.checked,
                )
              }
            />

            <span>Active</span>
          </label>

          <label className="serviceHeroToggle">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(event) =>
                updateField(
                  "is_published",
                  event.target.checked,
                )
              }
            />

            <span>Published</span>
          </label>
        </div>
      </section>

      <footer className="serviceHeroEditor__saveBar">
        <button
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2
              className="serviceHeroEditor__spinner"
              size={17}
            />
          ) : (
            <Save size={17} />
          )}

          {isEditing
            ? "Update Slide"
            : "Create Slide"}
        </button>
      </footer>
    </form>
  );
}
