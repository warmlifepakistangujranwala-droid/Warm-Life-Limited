/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/about/company/CompanyInformationForm.tsx
 *
 * Purpose :
 * Provides complete content, image upload, typography,
 * colour, spacing and layout controls for the About company
 * information section.
 *
 * Version : v1.0.1
 * ============================================================
 */

"use client";

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
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
  updateAboutPageSettings,
} from "@/lib/actions/about-page";

import { createClient } from "@/lib/supabase/client";

import type {
  AboutPageSettings,
  AboutTextAlignment,
  UpdateAboutPageSettingsInput,
} from "@/lib/types/about-page";

type CompanyInformationFormProps = {
  settings: AboutPageSettings;
};

type ImageSource =
  | "upload"
  | "url";

type Message = {
  type: "success" | "error";
  text: string;
} | null;

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

export default function CompanyInformationForm({
  settings,
}: CompanyInformationFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] =
    useState<AboutPageSettings>(
      settings,
    );

  const [imageSource, setImageSource] =
    useState<ImageSource>(
      settings.company_image_storage_path
        ? "upload"
        : settings.company_image_url
          ? "url"
          : "upload",
    );

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState(
      settings.company_image_url ??
        "",
    );

  const [message, setMessage] =
    useState<Message>(null);

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    return () => {
      if (
        preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          preview,
        );
      }
    };
  }, [preview]);

  function updateField<
    K extends keyof AboutPageSettings,
  >(
    field: K,
    value: AboutPageSettings[K],
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage(null);
  }

  function selectImage(
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
      setMessage({
        type: "error",
        text:
          "Please select a valid image file.",
      });

      event.target.value = "";
      return;
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      setMessage({
        type: "error",
        text:
          "Company image must be smaller than 10 MB.",
      });

      event.target.value = "";
      return;
    }

    if (
      preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        preview,
      );
    }

    const localPreview =
      URL.createObjectURL(file);

    setSelectedFile(file);
    setPreview(localPreview);
    setImageSource("upload");
    setMessage(null);
  }

  function removeImage(): void {
    if (
      preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        preview,
      );
    }

    setSelectedFile(null);
    setPreview("");

    updateField(
      "company_image_url",
      null,
    );

    updateField(
      "company_image_storage_path",
      null,
    );
  }

  function storagePath(
    file: File,
  ): string {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "image";

    return `about/company/${crypto.randomUUID()}.${extension}`;
  }

  async function uploadImage(
    file: File,
  ) {
    const path =
      storagePath(file);

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

  async function removeStorageFile(
    path: string | null,
  ): Promise<void> {
    if (!path) {
      return;
    }

    await supabase.storage
      .from("website-media")
      .remove([path]);
  }

  function validateForm():
    | string
    | null {
    if (
      !form.company_heading.trim()
    ) {
      return "Company heading is required.";
    }

    if (
      form.company_section_enabled &&
      !form.company_description.trim()
    ) {
      return "Company description is required when the section is enabled.";
    }

    if (
      imageSource === "url" &&
      form.company_image_url &&
      !/^https?:\/\//i.test(
        form.company_image_url,
      )
    ) {
      return "Please enter a valid company image URL.";
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

    let uploadedPath:
      | string
      | null = null;

    try {
      const originalStoragePath =
        settings.company_image_storage_path;

      let imageUrl =
        form.company_image_url;

      let imageStoragePath =
        form.company_image_storage_path;

      if (
        imageSource === "upload"
      ) {
        if (selectedFile) {
          const uploaded =
            await uploadImage(
              selectedFile,
            );

          uploadedPath =
            uploaded.storagePath;

          imageUrl =
            uploaded.publicUrl;

          imageStoragePath =
            uploaded.storagePath;
        } else {
          imageUrl =
            form.company_image_url;

          imageStoragePath =
            form.company_image_storage_path;
        }
      }

      if (
        imageSource === "url"
      ) {
        imageUrl =
          form.company_image_url
            ?.trim() ||
          null;

        imageStoragePath =
          null;
      }

      const payload: UpdateAboutPageSettingsInput = {
        company_section_enabled:
          form.company_section_enabled,

        company_eyebrow:
          form.company_eyebrow.trim(),

        company_heading:
          form.company_heading.trim(),

        company_description:
          form.company_description.trim(),

        company_image_url:
          imageUrl,

        company_image_storage_path:
          imageStoragePath,

        company_image_alt:
          form.company_image_alt.trim(),

        company_image_position:
          form.company_image_position,

        company_background_color:
          form.company_background_color,

        company_heading_color:
          form.company_heading_color,

        company_text_color:
          form.company_text_color,

        company_content_max_width:
          form.company_content_max_width,

        company_padding_top:
          form.company_padding_top,

        company_padding_bottom:
          form.company_padding_bottom,

        company_eyebrow_color:
          form.company_eyebrow_color,

        company_eyebrow_size:
          form.company_eyebrow_size,

        company_eyebrow_weight:
          form.company_eyebrow_weight,

        company_eyebrow_letter_spacing:
          form.company_eyebrow_letter_spacing,

        company_heading_size:
          form.company_heading_size,

        company_heading_weight:
          form.company_heading_weight,

        company_heading_line_height:
          form.company_heading_line_height,

        company_description_size:
          form.company_description_size,

        company_description_weight:
          form.company_description_weight,

        company_description_line_height:
          form.company_description_line_height,

        company_content_gap:
          form.company_content_gap,

        company_image_radius:
          form.company_image_radius,

        company_image_height:
          form.company_image_height,

        company_image_object_position:
          form.company_image_object_position,

        company_text_alignment:
          form.company_text_alignment,
      };

      const result =
        await updateAboutPageSettings(
          settings.id,
          payload,
        );

      if (!result.success) {
        throw new Error(
          result.errors.join(" "),
        );
      }

      if (
        originalStoragePath &&
        originalStoragePath !==
          imageStoragePath
      ) {
        await removeStorageFile(
          originalStoragePath,
        );
      }

      setForm((current) => ({
        ...current,
        company_image_url:
          imageUrl,
        company_image_storage_path:
          imageStoragePath,
      }));

      setPreview(
        imageUrl ?? "",
      );

      setSelectedFile(null);

      setMessage({
        type: "success",
        text:
          "Company information updated successfully.",
      });

      router.refresh();
    } catch (error) {
      if (uploadedPath) {
        await removeStorageFile(
          uploadedPath,
        );
      }

      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to update company information.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="aboutCompanyEditor"
      onSubmit={handleSubmit}
    >
      {message ? (
        <div
          className={`aboutCompanyEditor__message ${
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

      <div className="aboutCompanyEditor__layout">
        <main className="aboutCompanyEditor__main">
          <section className="aboutCompanyCard">
            <div className="aboutCompanyCard__heading">
              <div>
                <span>
                  Section status
                </span>

                <h2>
                  Visibility
                </h2>
              </div>
            </div>

            <div className="aboutCompanyCard__body">
              <label className="aboutCompanyToggle">
                <span>
                  Enable company section
                </span>

                <input
                  type="checkbox"
                  checked={
                    form.company_section_enabled
                  }
                  onChange={(event) =>
                    updateField(
                      "company_section_enabled",
                      event.target.checked,
                    )
                  }
                />
              </label>
            </div>
          </section>

          <section className="aboutCompanyCard">
            <div className="aboutCompanyCard__heading">
              <div>
                <span>Content</span>

                <h2>
                  Company story
                </h2>
              </div>
            </div>

            <div className="aboutCompanyCard__body">
              <div className="aboutCompanyFormGrid">
                <label className="aboutCompanyField">
                  <span>Eyebrow</span>

                  <input
                    type="text"
                    value={
                      form.company_eyebrow
                    }
                    onChange={(event) =>
                      updateField(
                        "company_eyebrow",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField aboutCompanyField--full">
                  <span>Heading</span>

                  <input
                    type="text"
                    value={
                      form.company_heading
                    }
                    onChange={(event) =>
                      updateField(
                        "company_heading",
                        event.target.value,
                      )
                    }
                    required
                  />
                </label>

                <label className="aboutCompanyField aboutCompanyField--full">
                  <span>
                    Company description
                  </span>

                  <textarea
                    rows={9}
                    value={
                      form.company_description
                    }
                    onChange={(event) =>
                      updateField(
                        "company_description",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>
                    Text alignment
                  </span>

                  <select
                    value={
                      form.company_text_alignment
                    }
                    onChange={(event) =>
                      updateField(
                        "company_text_alignment",
                        event.target
                          .value as AboutTextAlignment,
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

                <label className="aboutCompanyField">
                  <span>
                    Image position
                  </span>

                  <select
                    value={
                      form.company_image_position
                    }
                    onChange={(event) =>
                      updateField(
                        "company_image_position",
                        event.target
                          .value as
                          | "left"
                          | "right",
                      )
                    }
                  >
                    <option value="left">
                      Left
                    </option>

                    <option value="right">
                      Right
                    </option>
                  </select>
                </label>
              </div>
            </div>
          </section>

          <section className="aboutCompanyCard">
            <div className="aboutCompanyCard__heading">
              <div>
                <span>Media</span>

                <h2>
                  Company image
                </h2>
              </div>
            </div>

            <div className="aboutCompanyCard__body">
              <div className="aboutCompanyUpload">
                <div className="aboutCompanyUpload__heading">
                  <div>
                    <strong>
                      Section image
                    </strong>

                    <span>
                      Maximum file size:
                      10 MB
                    </span>
                  </div>

                  <div className="aboutCompanyUpload__tabs">
                    <button
                      type="button"
                      className={
                        imageSource ===
                        "upload"
                          ? "isActive"
                          : undefined
                      }
                      onClick={() =>
                        setImageSource(
                          "upload",
                        )
                      }
                    >
                      Upload file
                    </button>

                    <button
                      type="button"
                      className={
                        imageSource ===
                        "url"
                          ? "isActive"
                          : undefined
                      }
                      onClick={() =>
                        setImageSource(
                          "url",
                        )
                      }
                    >
                      Use URL
                    </button>
                  </div>
                </div>

                {imageSource ===
                "upload" ? (
                  <label className="aboutCompanyUpload__button">
                    <Upload size={18} />

                    Choose image

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        selectImage
                      }
                    />
                  </label>
                ) : (
                  <label className="aboutCompanyField aboutCompanyField--full">
                    <span>
                      Direct image URL
                    </span>

                    <input
                      type="url"
                      value={
                        form.company_image_url ??
                        ""
                      }
                      placeholder="https://..."
                      onChange={(event) => {
                        const value =
                          event.target
                            .value;

                        updateField(
                          "company_image_url",
                          value || null,
                        );

                        setPreview(value);
                      }}
                    />
                  </label>
                )}

                {preview ? (
                  <div className="aboutCompanyUpload__preview">
                    <img
                      src={preview}
                      alt=""
                    />

                    <button
                      type="button"
                      onClick={
                        removeImage
                      }
                      aria-label="Remove company image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="aboutCompanyUpload__empty">
                    <ImageIcon
                      size={30}
                    />

                    <span>
                      No company image
                      selected
                    </span>
                  </div>
                )}
              </div>

              <div className="aboutCompanyFormGrid">
                <label className="aboutCompanyField aboutCompanyField--full">
                  <span>
                    Image alt text
                  </span>

                  <input
                    type="text"
                    value={
                      form.company_image_alt
                    }
                    onChange={(event) =>
                      updateField(
                        "company_image_alt",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>
                    Image height (px)
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.company_image_height
                    }
                    onChange={(event) =>
                      updateField(
                        "company_image_height",
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>
                    Image radius (px)
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.company_image_radius
                    }
                    onChange={(event) =>
                      updateField(
                        "company_image_radius",
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>
                    Image object position
                  </span>

                  <select
                    value={
                      form.company_image_object_position
                    }
                    onChange={(event) =>
                      updateField(
                        "company_image_object_position",
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
            </div>
          </section>

          <section className="aboutCompanyCard">
            <div className="aboutCompanyCard__heading">
              <div>
                <span>
                  Typography
                </span>

                <h2>
                  Text appearance
                </h2>
              </div>
            </div>

            <div className="aboutCompanyCard__body">
              <div className="aboutCompanySubheading">
                Eyebrow
              </div>

              <div className="aboutCompanyFormGrid aboutCompanyFormGrid--four">
                <label className="aboutCompanyField">
                  <span>Colour</span>

                  <input
                    type="color"
                    value={
                      form.company_eyebrow_color
                    }
                    onChange={(event) =>
                      updateField(
                        "company_eyebrow_color",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>Size</span>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.company_eyebrow_size
                    }
                    onChange={(event) =>
                      updateField(
                        "company_eyebrow_size",
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>Weight</span>

                  <input
                    type="number"
                    min="100"
                    max="1000"
                    step="100"
                    value={
                      form.company_eyebrow_weight
                    }
                    onChange={(event) =>
                      updateField(
                        "company_eyebrow_weight",
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>
                    Letter spacing
                  </span>

                  <input
                    type="number"
                    step="0.1"
                    value={
                      form.company_eyebrow_letter_spacing
                    }
                    onChange={(event) =>
                      updateField(
                        "company_eyebrow_letter_spacing",
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>
              </div>

              <div className="aboutCompanySubheading">
                Heading
              </div>

              <div className="aboutCompanyFormGrid aboutCompanyFormGrid--four">
                <label className="aboutCompanyField">
                  <span>Colour</span>

                  <input
                    type="color"
                    value={
                      form.company_heading_color
                    }
                    onChange={(event) =>
                      updateField(
                        "company_heading_color",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>Size</span>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.company_heading_size
                    }
                    onChange={(event) =>
                      updateField(
                        "company_heading_size",
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>Weight</span>

                  <input
                    type="number"
                    min="100"
                    max="1000"
                    step="100"
                    value={
                      form.company_heading_weight
                    }
                    onChange={(event) =>
                      updateField(
                        "company_heading_weight",
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>
                    Line height
                  </span>

                  <input
                    type="number"
                    min="0.5"
                    max="3"
                    step="0.05"
                    value={
                      form.company_heading_line_height
                    }
                    onChange={(event) =>
                      updateField(
                        "company_heading_line_height",
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>
              </div>

              <div className="aboutCompanySubheading">
                Description
              </div>

              <div className="aboutCompanyFormGrid aboutCompanyFormGrid--four">
                <label className="aboutCompanyField">
                  <span>Colour</span>

                  <input
                    type="color"
                    value={
                      form.company_text_color
                    }
                    onChange={(event) =>
                      updateField(
                        "company_text_color",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>Size</span>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.company_description_size
                    }
                    onChange={(event) =>
                      updateField(
                        "company_description_size",
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>Weight</span>

                  <input
                    type="number"
                    min="100"
                    max="1000"
                    step="100"
                    value={
                      form.company_description_weight
                    }
                    onChange={(event) =>
                      updateField(
                        "company_description_weight",
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>
                    Line height
                  </span>

                  <input
                    type="number"
                    min="0.5"
                    max="3"
                    step="0.05"
                    value={
                      form.company_description_line_height
                    }
                    onChange={(event) =>
                      updateField(
                        "company_description_line_height",
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

          <section className="aboutCompanyCard">
            <div className="aboutCompanyCard__heading">
              <div>
                <span>
                  Layout and spacing
                </span>

                <h2>
                  Section dimensions
                </h2>
              </div>
            </div>

            <div className="aboutCompanyCard__body">
              <div className="aboutCompanyFormGrid aboutCompanyFormGrid--four">
                <label className="aboutCompanyField">
                  <span>
                    Background
                  </span>

                  <input
                    type="color"
                    value={
                      form.company_background_color
                    }
                    onChange={(event) =>
                      updateField(
                        "company_background_color",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>
                    Max width
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.company_content_max_width
                    }
                    onChange={(event) =>
                      updateField(
                        "company_content_max_width",
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>
                    Content gap
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.company_content_gap
                    }
                    onChange={(event) =>
                      updateField(
                        "company_content_gap",
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>
                    Top padding
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.company_padding_top
                    }
                    onChange={(event) =>
                      updateField(
                        "company_padding_top",
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="aboutCompanyField">
                  <span>
                    Bottom padding
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.company_padding_bottom
                    }
                    onChange={(event) =>
                      updateField(
                        "company_padding_bottom",
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

        <aside className="aboutCompanyEditor__sidebar">
          <section className="aboutCompanyCard aboutCompanyCard--sticky">
            <div className="aboutCompanyCard__heading">
              <div>
                <span>Preview</span>

                <h2>
                  Section preview
                </h2>
              </div>
            </div>

            <div className="aboutCompanyCard__body">
              <div
                className={`aboutCompanyPreview aboutCompanyPreview--image-${form.company_image_position}`}
                style={{
                  background:
                    form.company_background_color,
                  textAlign:
                    form.company_text_alignment,
                  gap:
                    `${form.company_content_gap}px`,
                }}
              >
                <div>
                  {form.company_eyebrow ? (
                    <span
                      style={{
                        color:
                          form.company_eyebrow_color,
                        fontSize:
                          `${form.company_eyebrow_size}px`,
                        fontWeight:
                          form.company_eyebrow_weight,
                        letterSpacing:
                          `${form.company_eyebrow_letter_spacing}px`,
                      }}
                    >
                      {
                        form.company_eyebrow
                      }
                    </span>
                  ) : null}

                  <h3
                    style={{
                      color:
                        form.company_heading_color,
                      fontSize:
                        `${Math.min(
                          form.company_heading_size,
                          42,
                        )}px`,
                      fontWeight:
                        form.company_heading_weight,
                      lineHeight:
                        form.company_heading_line_height,
                    }}
                  >
                    {form.company_heading ||
                      "Company heading"}
                  </h3>

                  <p
                    style={{
                      color:
                        form.company_text_color,
                      fontSize:
                        `${Math.min(
                          form.company_description_size,
                          18,
                        )}px`,
                      fontWeight:
                        form.company_description_weight,
                      lineHeight:
                        form.company_description_line_height,
                    }}
                  >
                    {form.company_description ||
                      "Company description will appear here."}
                  </p>
                </div>

                {preview ? (
                  <img
                    src={preview}
                    alt=""
                    style={{
                      height:
                        `${Math.min(
                          form.company_image_height,
                          320,
                        )}px`,
                      borderRadius:
                        `${form.company_image_radius}px`,
                      objectPosition:
                        form.company_image_object_position,
                    }}
                  />
                ) : (
                  <div className="aboutCompanyPreview__placeholder">
                    <ImageIcon
                      size={28}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        </aside>
      </div>

      <footer className="aboutCompanyEditor__saveBar">
        <div>
          <Eye size={17} />

          <div>
            <span>
              Company Information
            </span>

            <strong>
              Save section changes
            </strong>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2
              className="aboutCompanyEditor__spinner"
              size={17}
            />
          ) : (
            <Save size={17} />
          )}

          Save Changes
        </button>
      </footer>
    </form>
  );
}
