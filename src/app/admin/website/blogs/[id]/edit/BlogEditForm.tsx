/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/blogs/[id]/edit/BlogEditForm.tsx
 *
 * Purpose :
 * Complete Blog Edit form covering every public.blogs field.
 *
 * Version : v1.0.0
 * ============================================================
 */

"use client";

import {
  AlertCircle,
  CheckCircle2,
  FileImage,
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
  updateBlog,
} from "@/lib/actions/blogs";

import {
  createClient,
} from "@/lib/supabase/client";

import type {
  BlogAuthor,
  BlogCategory,
  BlogHeroType,
  BlogWithRelations,
  UpdateBlogInput,
} from "@/lib/types/blogs";

type BlogEditFormProps = {
  initialBlog: BlogWithRelations;
  categories: BlogCategory[];
  authors: BlogAuthor[];
};

type UploadTarget =
  | "featured"
  | "hero"
  | "heroPoster"
  | "og"
  | "twitter";

type UploadState = {
  file: File | null;
  preview: string;
};

function toLocalDateTime(
  value: string | null,
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  const local = new Date(
    date.getTime() -
      date.getTimezoneOffset() * 60000,
  );

  return local
    .toISOString()
    .slice(0, 16);
}

function nullableText(
  value: string | null | undefined,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();

  return cleaned || null;
}

function slugify(
  value: string,
): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogEditForm({
  initialBlog,
  categories,
  authors,
}: BlogEditFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] =
    useState<UpdateBlogInput>({
      ...initialBlog,
    });

  const [uploads, setUploads] =
    useState<Record<UploadTarget, UploadState>>({
      featured: {
        file: null,
        preview:
          initialBlog.featured_image_url ?? "",
      },
      hero: {
        file: null,
        preview:
          initialBlog.hero_image_url ?? "",
      },
      heroPoster: {
        file: null,
        preview:
          initialBlog.hero_poster_url ?? "",
      },
      og: {
        file: null,
        preview:
          initialBlog.og_image_url ?? "",
      },
      twitter: {
        file: null,
        preview:
          initialBlog.twitter_image_url ?? "",
      },
    });

  const [isSaving, setIsSaving] =
    useState(false);

  const [message, setMessage] =
    useState<{
      type: "success" | "error";
      text: string;
    } | null>(null);

  function updateField<
    K extends keyof UpdateBlogInput,
  >(
    key: K,
    value: UpdateBlogInput[K],
  ): void {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function chooseImage(
    target: UploadTarget,
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
          "Please select a valid image file.",
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
          "Each image must be smaller than 10 MB.",
      });
      return;
    }

    const previous =
      uploads[target].preview;

    if (
      previous.startsWith("blob:")
    ) {
      URL.revokeObjectURL(previous);
    }

    setUploads((current) => ({
      ...current,
      [target]: {
        file,
        preview:
          URL.createObjectURL(file),
      },
    }));
  }

  async function uploadImage(
    target: UploadTarget,
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
      `blogs/${target}/${initialBlog.id}/${crypto.randomUUID()}.${extension}`;

    const { error } =
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

    const { data } =
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

    const newPaths: string[] = [];
    const oldPathsToRemove: string[] = [];

    try {
      const payload: UpdateBlogInput = {
        ...form,

        internal_name:
          String(
            form.internal_name ?? "",
          ).trim(),

        title:
          String(
            form.title ?? "",
          ).trim(),

        slug:
          slugify(
            String(
              form.slug ?? "",
            ),
          ),

        eyebrow:
          nullableText(
            form.eyebrow,
          ),

        excerpt:
          nullableText(
            form.excerpt,
          ),

        introduction:
          nullableText(
            form.introduction,
          ),

        featured_image_alt:
          nullableText(
            form.featured_image_alt,
          ),

        hero_eyebrow:
          nullableText(
            form.hero_eyebrow,
          ),

        hero_heading:
          nullableText(
            form.hero_heading,
          ),

        hero_description:
          nullableText(
            form.hero_description,
          ),

        hero_image_alt:
          nullableText(
            form.hero_image_alt,
          ),

        cta_description:
          nullableText(
            form.cta_description,
          ),

        seo_title:
          nullableText(
            form.seo_title,
          ),

        meta_description:
          nullableText(
            form.meta_description,
          ),

        focus_keyword:
          nullableText(
            form.focus_keyword,
          ),

        canonical_url:
          nullableText(
            form.canonical_url,
          ),

        og_title:
          nullableText(
            form.og_title,
          ),

        og_description:
          nullableText(
            form.og_description,
          ),

        og_image_alt:
          nullableText(
            form.og_image_alt,
          ),

        twitter_title:
          nullableText(
            form.twitter_title,
          ),

        twitter_description:
          nullableText(
            form.twitter_description,
          ),
      };

      const targets: UploadTarget[] = [
        "featured",
        "hero",
        "heroPoster",
        "og",
        "twitter",
      ];

      for (const target of targets) {
        const file =
          uploads[target].file;

        if (!file) {
          continue;
        }

        const uploaded =
          await uploadImage(
            target,
            file,
          );

        newPaths.push(
          uploaded.storagePath,
        );

        if (target === "featured") {
          if (
            initialBlog.featured_image_storage_path
          ) {
            oldPathsToRemove.push(
              initialBlog.featured_image_storage_path,
            );
          }

          payload.featured_image_url =
            uploaded.publicUrl;

          payload.featured_image_storage_path =
            uploaded.storagePath;
        }

        if (target === "hero") {
          if (
            initialBlog.hero_image_storage_path
          ) {
            oldPathsToRemove.push(
              initialBlog.hero_image_storage_path,
            );
          }

          payload.hero_image_url =
            uploaded.publicUrl;

          payload.hero_image_storage_path =
            uploaded.storagePath;
        }

        if (target === "heroPoster") {
          if (
            initialBlog.hero_poster_storage_path
          ) {
            oldPathsToRemove.push(
              initialBlog.hero_poster_storage_path,
            );
          }

          payload.hero_poster_url =
            uploaded.publicUrl;

          payload.hero_poster_storage_path =
            uploaded.storagePath;
        }

        if (target === "og") {
          if (
            initialBlog.og_image_storage_path
          ) {
            oldPathsToRemove.push(
              initialBlog.og_image_storage_path,
            );
          }

          payload.og_image_url =
            uploaded.publicUrl;

          payload.og_image_storage_path =
            uploaded.storagePath;
        }

        if (target === "twitter") {
          if (
            initialBlog.twitter_image_storage_path
          ) {
            oldPathsToRemove.push(
              initialBlog.twitter_image_storage_path,
            );
          }

          payload.twitter_image_url =
            uploaded.publicUrl;

          payload.twitter_image_storage_path =
            uploaded.storagePath;
        }
      }

      const result =
        await updateBlog(
          initialBlog.id,
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

      if (
        oldPathsToRemove.length > 0
      ) {
        await supabase.storage
          .from("website-media")
          .remove(
            oldPathsToRemove,
          );
      }

      setUploads((current) => {
        const next =
          { ...current };

        for (const target of targets) {
          next[target] = {
            file: null,
            preview:
              next[target].preview,
          };
        }

        return next;
      });

      setMessage({
        type: "success",
        text:
          "Blog updated successfully.",
      });

      router.refresh();
    } catch (error) {
      if (
        newPaths.length > 0
      ) {
        await supabase.storage
          .from("website-media")
          .remove(newPaths);
      }

      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to update Blog.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  function MediaField({
    target,
    title,
    urlField,
    storageField,
    altField,
  }: {
    target: UploadTarget;
    title: string;
    urlField: keyof UpdateBlogInput;
    storageField:
      keyof UpdateBlogInput;
    altField?: keyof UpdateBlogInput;
  }) {
    const preview =
      uploads[target].preview ||
      String(
        form[urlField] ?? "",
      );

    return (
      <div className="blogEditMediaField">
        <div className="blogEditMediaField__top">
          <strong>
            {title}
          </strong>

          <label className="blogEditMediaField__upload">
            <Upload size={15} />
            Upload

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                chooseImage(
                  target,
                  event,
                )
              }
            />
          </label>
        </div>

        <label>
          <span>
            Direct image URL
          </span>

          <input
            type="url"
            value={
              String(
                form[urlField] ?? "",
              )
            }
            onChange={(event) => {
              const value =
                event.target.value;

              updateField(
                urlField as never,
                (value || null) as never,
              );

              updateField(
                storageField as never,
                null as never,
              );

              setUploads((current) => ({
                ...current,
                [target]: {
                  file: null,
                  preview: value,
                },
              }));
            }}
          />
        </label>

        {preview ? (
          <img
            src={preview}
            alt=""
            className="blogEditMediaField__preview"
          />
        ) : (
          <div className="blogEditMediaField__empty">
            <FileImage size={28} />
            No image selected
          </div>
        )}

        {altField ? (
          <label>
            <span>
              Image alt text
            </span>

            <input
              value={
                String(
                  form[altField] ?? "",
                )
              }
              onChange={(event) =>
                updateField(
                  altField as never,
                  event.target
                    .value as never,
                )
              }
            />
          </label>
        ) : null}
      </div>
    );
  }

  return (
    <form
      className="blogEditForm"
      onSubmit={submit}
    >
      {message ? (
        <div
          className={`blogEditForm__message ${
            message.type ===
            "success"
              ? "isSuccess"
              : "isError"
          }`}
        >
          {message.type ===
          "success" ? (
            <CheckCircle2
              size={17}
            />
          ) : (
            <AlertCircle
              size={17}
            />
          )}

          {message.text}
        </div>
      ) : null}

      <section>
        <header>
          <span>
            Core Blog record
          </span>

          <h2>
            Basic information
          </h2>
        </header>

        <div className="blogEditForm__grid">
          <label>
            <span>
              Blog title *
            </span>

            <input
              required
              value={
                form.title ?? ""
              }
              onChange={(event) =>
                updateField(
                  "title",
                  event.target.value,
                )
              }
            />
          </label>

          <label>
            <span>
              Slug *
            </span>

            <input
              required
              value={
                form.slug ?? ""
              }
              onChange={(event) =>
                updateField(
                  "slug",
                  slugify(
                    event.target.value,
                  ),
                )
              }
            />
          </label>

          <label>
            <span>
              Internal name *
            </span>

            <input
              required
              value={
                form.internal_name ?? ""
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
              Eyebrow
            </span>

            <input
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

          <label className="isFull">
            <span>
              Excerpt
            </span>

            <textarea
              rows={4}
              value={
                form.excerpt ?? ""
              }
              onChange={(event) =>
                updateField(
                  "excerpt",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="isFull">
            <span>
              Introduction
            </span>

            <textarea
              rows={7}
              value={
                form.introduction ?? ""
              }
              onChange={(event) =>
                updateField(
                  "introduction",
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
            Taxonomy and publishing
          </span>

          <h2>
            Category, author and date
          </h2>
        </header>

        <div className="blogEditForm__grid">
          <label>
            <span>
              Category
            </span>

            <select
              value={
                form.category_id ?? ""
              }
              onChange={(event) =>
                updateField(
                  "category_id",
                  event.target.value ||
                    null,
                )
              }
            >
              <option value="">
                Select category
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ),
              )}
            </select>
          </label>

          <label>
            <span>
              Author
            </span>

            <select
              value={
                form.author_id ?? ""
              }
              onChange={(event) =>
                updateField(
                  "author_id",
                  event.target.value ||
                    null,
                )
              }
            >
              <option value="">
                Select author
              </option>

              {authors.map(
                (author) => (
                  <option
                    key={author.id}
                    value={author.id}
                  >
                    {author.display_name}
                  </option>
                ),
              )}
            </select>
          </label>

          <label>
            <span>
              Reading time
            </span>

            <input
              type="number"
              min="1"
              max="999"
              value={
                form.reading_time_minutes ??
                5
              }
              onChange={(event) =>
                updateField(
                  "reading_time_minutes",
                  Number(
                    event.target.value,
                  ),
                )
              }
            />
          </label>

          <label>
            <span>
              Publish date
            </span>

            <input
              type="datetime-local"
              value={
                toLocalDateTime(
                  form.publish_date ??
                    null,
                )
              }
              onChange={(event) =>
                updateField(
                  "publish_date",
                  event.target.value
                    ? new Date(
                        event.target.value,
                      ).toISOString()
                    : null,
                )
              }
            />
          </label>

          <label>
            <span>
              Display order
            </span>

            <input
              type="number"
              min="0"
              value={
                form.display_order ??
                0
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

      <section>
        <header>
          <span>
            Featured media
          </span>

          <h2>
            Blog card image
          </h2>
        </header>

        <div className="blogEditForm__mediaWrap">
          <MediaField
            target="featured"
            title="Featured image"
            urlField="featured_image_url"
            storageField="featured_image_storage_path"
            altField="featured_image_alt"
          />
        </div>
      </section>

      <section>
        <header>
          <span>
            Listing behaviour
          </span>

          <h2>
            Public card settings
          </h2>
        </header>

        <div className="blogEditForm__toggles">
          {[
            ["show_in_listing", "Show in listing"],
            ["show_read_button", "Show read button"],
            ["open_in_new_tab", "Open in new tab"],
            ["has_detail_page", "Detailed page"],
          ].map(
            ([key, label]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={
                    Boolean(
                      form[
                        key as keyof UpdateBlogInput
                      ],
                    )
                  }
                  onChange={(event) =>
                    updateField(
                      key as keyof UpdateBlogInput,
                      event.target.checked as never,
                    )
                  }
                />

                <span>
                  {label}
                </span>
              </label>
            ),
          )}
        </div>

        <div className="blogEditForm__grid blogEditForm__grid--topless">
          <label>
            <span>
              Read button text
            </span>

            <input
              value={
                form.read_button_text ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "read_button_text",
                  event.target.value,
                )
              }
            />
          </label>
        </div>
      </section>

      {form.has_detail_page ? (
        <>
          <section>
            <header>
              <span>
                Detail page
              </span>

              <h2>
                Hero settings
              </h2>
            </header>

            <div className="blogEditForm__grid">
              <label>
                <span>
                  Hero type
                </span>

                <select
                  value={
                    form.hero_type ??
                    "image"
                  }
                  onChange={(event) =>
                    updateField(
                      "hero_type",
                      event.target
                        .value as BlogHeroType,
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

            {form.hero_type ===
            "video" ? (
              <>
                <div className="blogEditForm__grid blogEditForm__grid--topless">
                  <label className="isFull">
                    <span>
                      Hero video URL
                    </span>

                    <input
                      value={
                        form.hero_video_url ??
                        ""
                      }
                      onChange={(event) =>
                        updateField(
                          "hero_video_url",
                          event.target
                            .value ||
                            null,
                        )
                      }
                    />
                  </label>

                  <label className="isFull">
                    <span>
                      Hero video storage path
                    </span>

                    <input
                      value={
                        form.hero_video_storage_path ??
                        ""
                      }
                      onChange={(event) =>
                        updateField(
                          "hero_video_storage_path",
                          event.target
                            .value ||
                            null,
                        )
                      }
                    />
                  </label>
                </div>

                <div className="blogEditForm__mediaWrap">
                  <MediaField
                    target="heroPoster"
                    title="Hero video poster"
                    urlField="hero_poster_url"
                    storageField="hero_poster_storage_path"
                  />
                </div>
              </>
            ) : (
              <div className="blogEditForm__mediaWrap">
                <MediaField
                  target="hero"
                  title="Hero image"
                  urlField="hero_image_url"
                  storageField="hero_image_storage_path"
                  altField="hero_image_alt"
                />
              </div>
            )}

            <div className="blogEditForm__grid">
              <label>
                <span>
                  Hero heading desktop
                </span>

                <input
                  type="number"
                  min="28"
                  max="180"
                  value={
                    form.hero_heading_size ??
                    80
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
                  Hero heading mobile
                </span>

                <input
                  type="number"
                  min="24"
                  max="100"
                  value={
                    form.hero_heading_size_mobile ??
                    44
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

              <label>
                <span>
                  Section heading desktop
                </span>

                <input
                  type="number"
                  min="24"
                  max="120"
                  value={
                    form.section_heading_size ??
                    48
                  }
                  onChange={(event) =>
                    updateField(
                      "section_heading_size",
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                />
              </label>

              <label>
                <span>
                  Section heading mobile
                </span>

                <input
                  type="number"
                  min="22"
                  max="80"
                  value={
                    form.section_heading_size_mobile ??
                    34
                  }
                  onChange={(event) =>
                    updateField(
                      "section_heading_size_mobile",
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                />
              </label>

              <label>
                <span>
                  Card heading size
                </span>

                <input
                  type="number"
                  min="16"
                  max="60"
                  value={
                    form.card_heading_size ??
                    24
                  }
                  onChange={(event) =>
                    updateField(
                      "card_heading_size",
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                />
              </label>

              <label>
                <span>
                  CTA heading desktop
                </span>

                <input
                  type="number"
                  min="24"
                  max="120"
                  value={
                    form.cta_heading_size ??
                    52
                  }
                  onChange={(event) =>
                    updateField(
                      "cta_heading_size",
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                />
              </label>

              <label>
                <span>
                  CTA heading mobile
                </span>

                <input
                  type="number"
                  min="22"
                  max="80"
                  value={
                    form.cta_heading_size_mobile ??
                    38
                  }
                  onChange={(event) =>
                    updateField(
                      "cta_heading_size_mobile",
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
                Dynamic sections
              </span>

              <h2>
                Manager visibility and headings
              </h2>
            </header>

            <div className="blogEditManagerFields">
              {[
                [
                  "key_takeaways_enabled",
                  "key_takeaways_heading",
                  "Key Takeaways",
                ],
                [
                  "tips_enabled",
                  "tips_heading",
                  "Helpful Tips",
                ],
                [
                  "faq_enabled",
                  "faq_heading",
                  "FAQs",
                ],
                [
                  "gallery_enabled",
                  "gallery_heading",
                  "Gallery",
                ],
                [
                  "related_services_enabled",
                  "related_services_heading",
                  "Related Services",
                ],
                [
                  "related_blogs_enabled",
                  "related_blogs_heading",
                  "Related Articles",
                ],
              ].map(
                ([
                  toggleKey,
                  headingKey,
                  label,
                ]) => (
                  <div key={toggleKey}>
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          Boolean(
                            form[
                              toggleKey as keyof UpdateBlogInput
                            ],
                          )
                        }
                        onChange={(event) =>
                          updateField(
                            toggleKey as keyof UpdateBlogInput,
                            event.target.checked as never,
                          )
                        }
                      />

                      <span>
                        Enable {label}
                      </span>
                    </label>

                    <input
                      value={
                        String(
                          form[
                            headingKey as keyof UpdateBlogInput
                          ] ?? "",
                        )
                      }
                      onChange={(event) =>
                        updateField(
                          headingKey as keyof UpdateBlogInput,
                          event.target.value as never,
                        )
                      }
                    />
                  </div>
                ),
              )}
            </div>
          </section>

          <section>
            <header>
              <span>
                Call to action
              </span>

              <h2>
                Detail page CTA
              </h2>
            </header>

            <div className="blogEditForm__toggles">
              <label>
                <input
                  type="checkbox"
                  checked={
                    Boolean(
                      form.cta_enabled,
                    )
                  }
                  onChange={(event) =>
                    updateField(
                      "cta_enabled",
                      event.target.checked,
                    )
                  }
                />

                <span>
                  Enable CTA
                </span>
              </label>
            </div>

            {form.cta_enabled ? (
              <div className="blogEditForm__grid blogEditForm__grid--topless">
                <label className="isFull">
                  <span>
                    CTA heading
                  </span>

                  <input
                    value={
                      form.cta_heading ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "cta_heading",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="isFull">
                  <span>
                    CTA description
                  </span>

                  <textarea
                    rows={5}
                    value={
                      form.cta_description ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "cta_description",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label>
                  <span>
                    CTA button text
                  </span>

                  <input
                    value={
                      form.cta_button_text ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "cta_button_text",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label>
                  <span>
                    CTA button link
                  </span>

                  <input
                    value={
                      form.cta_button_link ??
                      ""
                    }
                    onChange={(event) =>
                      updateField(
                        "cta_button_link",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="blogEditInlineToggle isFull">
                  <input
                    type="checkbox"
                    checked={
                      Boolean(
                        form.cta_button_open_in_new_tab,
                      )
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
              </div>
            ) : null}
          </section>
        </>
      ) : null}

      <section>
        <header>
          <span>
            Search optimisation
          </span>

          <h2>
            SEO foundation
          </h2>
        </header>

        <div className="blogEditForm__grid">
          <label className="isFull">
            <span>
              SEO title
            </span>

            <input
              value={
                form.seo_title ?? ""
              }
              onChange={(event) =>
                updateField(
                  "seo_title",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="isFull">
            <span>
              Meta description
            </span>

            <textarea
              rows={4}
              value={
                form.meta_description ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "meta_description",
                  event.target.value,
                )
              }
            />
          </label>

          <label>
            <span>
              Focus keyword
            </span>

            <input
              value={
                form.focus_keyword ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "focus_keyword",
                  event.target.value,
                )
              }
            />
          </label>

          <label>
            <span>
              Canonical URL
            </span>

            <input
              type="url"
              value={
                form.canonical_url ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "canonical_url",
                  event.target.value ||
                    null,
                )
              }
            />
          </label>
        </div>
      </section>

      <section>
        <header>
          <span>
            Social sharing
          </span>

          <h2>
            Open Graph
          </h2>
        </header>

        <div className="blogEditForm__grid">
          <label className="isFull">
            <span>
              OG title
            </span>

            <input
              value={
                form.og_title ?? ""
              }
              onChange={(event) =>
                updateField(
                  "og_title",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="isFull">
            <span>
              OG description
            </span>

            <textarea
              rows={4}
              value={
                form.og_description ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "og_description",
                  event.target.value,
                )
              }
            />
          </label>
        </div>

        <div className="blogEditForm__mediaWrap">
          <MediaField
            target="og"
            title="Open Graph image"
            urlField="og_image_url"
            storageField="og_image_storage_path"
            altField="og_image_alt"
          />
        </div>
      </section>

      <section>
        <header>
          <span>
            Social sharing
          </span>

          <h2>
            Twitter / X
          </h2>
        </header>

        <div className="blogEditForm__grid">
          <label className="isFull">
            <span>
              Twitter title
            </span>

            <input
              value={
                form.twitter_title ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "twitter_title",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="isFull">
            <span>
              Twitter description
            </span>

            <textarea
              rows={4}
              value={
                form.twitter_description ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "twitter_description",
                  event.target.value,
                )
              }
            />
          </label>
        </div>

        <div className="blogEditForm__mediaWrap">
          <MediaField
            target="twitter"
            title="Twitter / X image"
            urlField="twitter_image_url"
            storageField="twitter_image_storage_path"
          />
        </div>
      </section>

      <section>
        <header>
          <span>
            Publishing
          </span>

          <h2>
            Status and robots
          </h2>
        </header>

        <div className="blogEditForm__toggles">
          {[
            ["is_featured", "Featured"],
            ["is_sticky", "Sticky"],
            ["is_active", "Active"],
            ["is_published", "Published"],
            ["no_index", "No Index"],
            ["no_follow", "No Follow"],
          ].map(
            ([key, label]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={
                    Boolean(
                      form[
                        key as keyof UpdateBlogInput
                      ],
                    )
                  }
                  onChange={(event) =>
                    updateField(
                      key as keyof UpdateBlogInput,
                      event.target.checked as never,
                    )
                  }
                />

                <span>
                  {label}
                </span>
              </label>
            ),
          )}
        </div>
      </section>

      <footer className="blogEditForm__footer">
        <button
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2
              size={17}
              className="blogEditForm__spinner"
            />
          ) : (
            <Save size={17} />
          )}

          Save Blog Changes
        </button>
      </footer>
    </form>
  );
}
