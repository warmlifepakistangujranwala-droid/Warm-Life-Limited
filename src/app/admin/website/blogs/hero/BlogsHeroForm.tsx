/**
 * Blogs Hero Form
 * Version: v0.1.0
 */

"use client";

import {
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
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
  useRouter,
} from "next/navigation";

import {
  updateBlogsPageSettings,
} from "@/lib/actions/blogs-page";

import {
  createClient,
} from "@/lib/supabase/client";

import type {
  BlogsPageSettings,
  UpdateBlogsPageSettingsInput,
} from "@/lib/types/blogs-page";

type Props = {
  initialSettings: BlogsPageSettings;
};

export default function BlogsHeroForm({
  initialSettings,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] =
    useState<UpdateBlogsPageSettingsInput>({
      ...initialSettings,
    });

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState(
      initialSettings.hero_background_image_url ??
      "",
    );

  const [isSaving, setIsSaving] =
    useState(false);

  const [message, setMessage] =
    useState<{
      type: "success" | "error";
      text: string;
    } | null>(null);

  function updateField<
    K extends keyof UpdateBlogsPageSettingsInput,
  >(
    key: K,
    value: UpdateBlogsPageSettingsInput[K],
  ): void {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function chooseImage(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
      setMessage({
        type: "error",
        text:
          "Please choose a valid image file.",
      });
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setMessage({
        type: "error",
        text:
          "Image must be smaller than 10 MB.",
      });
      return;
    }

    if (
      preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(file);
    setPreview(
      URL.createObjectURL(file),
    );
    setMessage(null);
  }

  async function uploadImage(
    file: File,
  ): Promise<{
    publicUrl: string;
    storagePath: string;
  }> {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "jpg";

    const storagePath =
      `blogs/page/hero/${crypto.randomUUID()}.${extension}`;

    const {
      error,
    } =
      await supabase.storage
        .from("website-media")
        .upload(
          storagePath,
          file,
          {
            contentType:
              file.type,
            cacheControl:
              "3600",
            upsert: false,
          },
        );

    if (error) {
      throw new Error(
        error.message,
      );
    }

    const {
      data,
    } =
      supabase.storage
        .from("website-media")
        .getPublicUrl(
          storagePath,
        );

    return {
      publicUrl:
        data.publicUrl,
      storagePath,
    };
  }

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setIsSaving(true);
    setMessage(null);

    let newStoragePath = "";

    try {
      const payload:
        UpdateBlogsPageSettingsInput = {
          ...form,
        };

      if (selectedFile) {
        const uploaded =
          await uploadImage(
            selectedFile,
          );

        newStoragePath =
          uploaded.storagePath;

        payload.hero_background_image_url =
          uploaded.publicUrl;

        payload.hero_background_image_storage_path =
          uploaded.storagePath;
      }

      const result =
        await updateBlogsPageSettings(
          initialSettings.id,
          payload,
        );

      if (!result.success) {
        const errors =
          result.errors
            ? Object.values(
                result.errors,
              )
                .flat()
                .filter(Boolean)
                .join(" ")
            : "";

        throw new Error(
          errors ||
          result.message,
        );
      }

      if (
        selectedFile &&
        initialSettings.hero_background_image_storage_path &&
        initialSettings.hero_background_image_storage_path !==
          newStoragePath
      ) {
        await supabase.storage
          .from("website-media")
          .remove([
            initialSettings.hero_background_image_storage_path,
          ]);
      }

      setSelectedFile(null);

      setMessage({
        type: "success",
        text:
          "Blogs page settings saved successfully.",
      });

      router.refresh();
    } catch (error) {
      if (newStoragePath) {
        await supabase.storage
          .from("website-media")
          .remove([
            newStoragePath,
          ]);
      }

      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to save Blogs page settings.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="blogsHeroForm"
      onSubmit={submit}
    >
      {message ? (
        <div
          className={`blogsHeroForm__message ${
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
          <span>
            Hero content
          </span>

          <h2>
            Main Blogs banner
          </h2>
        </header>

        <div className="blogsHeroForm__grid">
          <label>
            <span>
              Internal name
            </span>

            <input
              value={
                form.internal_name ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "internal_name",
                  event.target.value,
                )
              }
            />
          </label>

          <label>
            <span>
              Hero eyebrow
            </span>

            <input
              value={
                form.hero_eyebrow ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "hero_eyebrow",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="isFull">
            <span>
              Hero heading
            </span>

            <input
              value={
                form.hero_heading ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "hero_heading",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="isFull">
            <span>
              Hero description
            </span>

            <textarea
              rows={5}
              value={
                form.hero_description ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "hero_description",
                  event.target.value,
                )
              }
            />
          </label>
        </div>
      </section>

      <section>
        <header>
          <span>
            Hero media
          </span>

          <h2>
            Background image
          </h2>
        </header>

        <div className="blogsHeroForm__media">
          <div className="blogsHeroForm__uploadRow">
            <label>
              <Upload size={16} />
              Upload Image

              <input
                type="file"
                accept="image/*"
                onChange={
                  chooseImage
                }
              />
            </label>

            <span>
              or
            </span>

            <input
              type="url"
              placeholder="Direct image URL"
              value={
                form.hero_background_image_url ??
                ""
              }
              onChange={(event) => {
                const value =
                  event.target.value;

                updateField(
                  "hero_background_image_url",
                  value || null,
                );

                updateField(
                  "hero_background_image_storage_path",
                  null,
                );

                setSelectedFile(null);
                setPreview(value);
              }}
            />
          </div>

          {preview ? (
            <img
              src={preview}
              alt=""
            />
          ) : (
            <div className="blogsHeroForm__emptyImage">
              <ImageIcon size={30} />
              No background image selected
            </div>
          )}

          <label>
            <span>
              Image alt text
            </span>

            <input
              value={
                form.hero_background_image_alt ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "hero_background_image_alt",
                  event.target.value,
                )
              }
            />
          </label>
        </div>
      </section>

      <section>
        <header>
          <span>
            Hero appearance
          </span>

          <h2>
            Size and overlay controls
          </h2>
        </header>

        <div className="blogsHeroForm__grid">
          <label>
            <span>
              Hero height (px)
            </span>

            <input
              type="number"
              min="320"
              max="1000"
              value={
                form.hero_height ??
                520
              }
              onChange={(event) =>
                updateField(
                  "hero_height",
                  Number(
                    event.target.value,
                  ),
                )
              }
            />
          </label>

          <label>
            <span>
              Overlay opacity
            </span>

            <input
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={
                form.hero_overlay_opacity ??
                0.78
              }
              onChange={(event) =>
                updateField(
                  "hero_overlay_opacity",
                  Number(
                    event.target.value,
                  ),
                )
              }
            />
          </label>

          <label>
            <span>
              Heading desktop (px)
            </span>

            <input
              type="number"
              min="32"
              max="180"
              value={
                form.hero_heading_size ??
                92
              }
              onChange={(event) =>
                updateField(
                  "hero_heading_size",
                  Number(
                    event.target.value,
                  ),
                )
              }
            />
          </label>

          <label>
            <span>
              Heading mobile (px)
            </span>

            <input
              type="number"
              min="26"
              max="100"
              value={
                form.hero_heading_size_mobile ??
                50
              }
              onChange={(event) =>
                updateField(
                  "hero_heading_size_mobile",
                  Number(
                    event.target.value,
                  ),
                )
              }
            />
          </label>
        </div>
      </section>

      <section>
        <header>
          <span>
            Listing header
          </span>

          <h2>
            Text above Blog cards
          </h2>
        </header>

        <div className="blogsHeroForm__grid">
          <label>
            <span>
              Listing eyebrow
            </span>

            <input
              value={
                form.listing_eyebrow ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "listing_eyebrow",
                  event.target.value,
                )
              }
            />
          </label>

          <label>
            <span>
              Listing heading
            </span>

            <input
              value={
                form.listing_heading ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "listing_heading",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="isFull">
            <span>
              Listing description
            </span>

            <textarea
              rows={4}
              value={
                form.listing_description ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "listing_description",
                  event.target.value,
                )
              }
            />
          </label>
        </div>
      </section>

      <section>
        <header>
          <span>
            Publishing
          </span>

          <h2>
            Visibility
          </h2>
        </header>

        <div className="blogsHeroForm__toggles">
          <label>
            <input
              type="checkbox"
              checked={
                Boolean(
                  form.is_active,
                )
              }
              onChange={(event) =>
                updateField(
                  "is_active",
                  event.target.checked,
                )
              }
            />

            Active
          </label>

          <label>
            <input
              type="checkbox"
              checked={
                Boolean(
                  form.is_published,
                )
              }
              onChange={(event) =>
                updateField(
                  "is_published",
                  event.target.checked,
                )
              }
            />

            Published
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
              size={17}
              className="blogsHeroForm__spinner"
            />
          ) : (
            <Save size={17} />
          )}

          Save Blogs Page
        </button>
      </footer>
    </form>
  );
}
