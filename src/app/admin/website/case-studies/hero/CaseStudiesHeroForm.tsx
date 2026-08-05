"use client";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  Upload,
} from "lucide-react";

import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";

import {
  updateCaseStudiesPageSettings,
} from "@/lib/actions/case-studies-page";

import { createClient } from "@/lib/supabase/client";

import type {
  CaseStudiesPageSettings,
  UpdateCaseStudiesPageSettingsInput,
} from "@/lib/types/case-studies-page";

type Props = {
  initialSettings: CaseStudiesPageSettings;
};

export default function CaseStudiesHeroForm({
  initialSettings,
}: Props) {
  const supabase = createClient();

  const [form, setForm] =
    useState<UpdateCaseStudiesPageSettingsInput>({
      hero_eyebrow:
        initialSettings.hero_eyebrow,
      hero_heading:
        initialSettings.hero_heading,
      hero_description:
        initialSettings.hero_description,

      hero_image_url:
        initialSettings.hero_image_url,
      hero_image_storage_path:
        initialSettings.hero_image_storage_path,
      hero_image_alt:
        initialSettings.hero_image_alt,

      hero_overlay_opacity:
        Number(
          initialSettings.hero_overlay_opacity,
        ),

      hero_height:
        initialSettings.hero_height,

      hero_heading_size:
        initialSettings.hero_heading_size,

      hero_heading_size_mobile:
        initialSettings.hero_heading_size_mobile,

      is_active:
        initialSettings.is_active,
    });

  const [file, setFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState(
      initialSettings.hero_image_url ?? "",
    );

  const [isSaving, setIsSaving] =
    useState(false);

  const [message, setMessage] =
    useState<{
      type: "success" | "error";
      text: string;
    } | null>(null);

  function chooseImage(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selected =
      event.target.files?.[0];

    if (!selected) {
      return;
    }

    if (
      !selected.type.startsWith("image/")
    ) {
      setMessage({
        type: "error",
        text: "Please select a valid image.",
      });
      return;
    }

    if (
      selected.size >
      10 * 1024 * 1024
    ) {
      setMessage({
        type: "error",
        text: "Image must be smaller than 10 MB.",
      });
      return;
    }

    setFile(selected);
    setPreview(
      URL.createObjectURL(selected),
    );
    setMessage(null);
  }

  async function uploadImage() {
    if (!file) {
      return null;
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "jpg";

    const path =
      `case-studies/page-hero/${crypto.randomUUID()}.${extension}`;

    const { error } =
      await supabase.storage
        .from("website-media")
        .upload(
          path,
          file,
          {
            contentType: file.type,
            cacheControl: "3600",
            upsert: false,
          },
        );

    if (error) {
      throw new Error(error.message);
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

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    let uploadedPath = "";

    try {
      const payload = {
        ...form,
      };

      if (file) {
        const uploaded =
          await uploadImage();

        if (uploaded) {
          uploadedPath =
            uploaded.storagePath;

          payload.hero_image_url =
            uploaded.publicUrl;

          payload.hero_image_storage_path =
            uploaded.storagePath;
        }
      }

      const result =
        await updateCaseStudiesPageSettings(
          initialSettings.id,
          payload,
        );

      if (!result.success) {
        const fieldErrors =
          result.errors
            ? Object.values(result.errors)
                .flat()
                .filter(Boolean)
                .join(" ")
            : "";

        throw new Error(
          fieldErrors ||
          result.message,
        );
      }

      if (
        file &&
        initialSettings
          .hero_image_storage_path
      ) {
        await supabase.storage
          .from("website-media")
          .remove([
            initialSettings
              .hero_image_storage_path,
          ]);
      }

      setMessage({
        type: "success",
        text: result.message,
      });

      setFile(null);
    } catch (error) {
      if (uploadedPath) {
        await supabase.storage
          .from("website-media")
          .remove([uploadedPath]);
      }

      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to save hero settings.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="caseStudiesHeroForm"
      onSubmit={submit}
    >
      {message ? (
        <div
          className={`caseStudiesHeroForm__message ${
            message.type === "success"
              ? "isSuccess"
              : "isError"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={17} />
          ) : (
            <AlertCircle size={17} />
          )}

          {message.text}
        </div>
      ) : null}

      <section>
        <header>
          <span>Hero content</span>
          <h2>Text and messaging</h2>
        </header>

        <div className="caseStudiesHeroForm__grid">
          <label>
            <span>Eyebrow</span>
            <input
              value={
                form.hero_eyebrow ?? ""
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  hero_eyebrow:
                    event.target.value,
                })
              }
            />
          </label>

          <label className="isFull">
            <span>Hero heading *</span>
            <input
              value={
                form.hero_heading ?? ""
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  hero_heading:
                    event.target.value,
                })
              }
            />
          </label>

          <label className="isFull">
            <span>Hero description</span>
            <textarea
              rows={5}
              value={
                form.hero_description ?? ""
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  hero_description:
                    event.target.value,
                })
              }
            />
          </label>
        </div>
      </section>

      <section>
        <header>
          <span>Hero media</span>
          <h2>Background image</h2>
        </header>

        <div className="caseStudiesHeroForm__media">
          <label className="caseStudiesHeroForm__upload">
            <Upload size={16} />
            Choose Image

            <input
              type="file"
              accept="image/*"
              onChange={chooseImage}
            />
          </label>

          <label>
            <span>Direct image URL</span>
            <input
              type="url"
              value={
                form.hero_image_url ?? ""
              }
              onChange={(event) => {
                const value =
                  event.target.value;

                setForm({
                  ...form,
                  hero_image_url:
                    value || null,
                  hero_image_storage_path:
                    null,
                });

                setPreview(value);
              }}
            />
          </label>

          {preview ? (
            <img
              src={preview}
              alt=""
            />
          ) : (
            <div className="caseStudiesHeroForm__empty">
              No hero image selected
            </div>
          )}

          <label>
            <span>Image alt text</span>
            <input
              value={
                form.hero_image_alt ?? ""
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  hero_image_alt:
                    event.target.value,
                })
              }
            />
          </label>
        </div>
      </section>

      <section>
        <header>
          <span>Appearance</span>
          <h2>Hero sizing and overlay</h2>
        </header>

        <div className="caseStudiesHeroForm__grid">
          <label>
            <span>Hero height (px)</span>
            <input
              type="number"
              min="320"
              max="1000"
              value={
                form.hero_height ?? 520
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  hero_height:
                    Number(
                      event.target.value,
                    ),
                })
              }
            />
          </label>

          <label>
            <span>
              Overlay opacity (0–1)
            </span>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={
                form.hero_overlay_opacity ??
                0.72
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  hero_overlay_opacity:
                    Number(
                      event.target.value,
                    ),
                })
              }
            />
          </label>

          <label>
            <span>
              Heading desktop (px)
            </span>
            <input
              type="number"
              min="28"
              max="180"
              value={
                form.hero_heading_size ??
                92
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  hero_heading_size:
                    Number(
                      event.target.value,
                    ),
                })
              }
            />
          </label>

          <label>
            <span>
              Heading mobile (px)
            </span>
            <input
              type="number"
              min="24"
              max="100"
              value={
                form
                  .hero_heading_size_mobile ??
                50
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  hero_heading_size_mobile:
                    Number(
                      event.target.value,
                    ),
                })
              }
            />
          </label>
        </div>
      </section>

      <footer>
        <button
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2
              className="caseStudiesHeroForm__spinner"
              size={17}
            />
          ) : (
            <Save size={17} />
          )}

          Save Hero Settings
        </button>
      </footer>
    </form>
  );
}
