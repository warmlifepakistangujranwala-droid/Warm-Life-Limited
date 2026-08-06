/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/blogs/new/BlogForm.tsx
 *
 * Purpose :
 * Complete Add Blog form for all fields in public.blogs.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use client";

import {
  AlertCircle,
  CheckCircle2,
  FileImage,
  Info,
  Loader2,
  Save,
  Upload,
} from "lucide-react";

import {
  type ChangeEvent,
  type FormEvent,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createBlog,
} from "@/lib/actions/blogs";

import {
  createClient,
} from "@/lib/supabase/client";

import type {
  BlogAuthor,
  BlogCategory,
  BlogHeroType,
  CreateBlogInput,
} from "@/lib/types/blogs";

type BlogFormProps = {
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

const EMPTY_UPLOAD: UploadState = {
  file: null,
  preview: "",
};

const DEFAULT_BLOG: CreateBlogInput = {
  internal_name: "",
  title: "",
  slug: "",
  eyebrow: "",
  excerpt: "",
  introduction: "",

  category_id: null,
  author_id: null,

  reading_time_minutes: 5,
  publish_date: null,

  featured_image_url: null,
  featured_image_storage_path: null,
  featured_image_alt: "",

  show_in_listing: true,
  show_read_button: true,
  read_button_text: "Read Article",
  open_in_new_tab: false,

  has_detail_page: true,

  hero_type: "image",
  hero_eyebrow: "",
  hero_heading: "",
  hero_description: "",
  hero_image_url: null,
  hero_image_storage_path: null,
  hero_image_alt: "",
  hero_video_url: null,
  hero_video_storage_path: null,
  hero_poster_url: null,
  hero_poster_storage_path: null,

  hero_heading_size: 80,
  hero_heading_size_mobile: 44,
  section_heading_size: 48,
  section_heading_size_mobile: 34,
  card_heading_size: 24,
  cta_heading_size: 52,
  cta_heading_size_mobile: 38,

  key_takeaways_enabled: false,
  key_takeaways_heading: "Key Takeaways",

  tips_enabled: false,
  tips_heading: "Helpful Tips",

  faq_enabled: false,
  faq_heading: "Frequently Asked Questions",

  gallery_enabled: false,
  gallery_heading: "Article Gallery",

  related_services_enabled: false,
  related_services_heading: "Related Services",

  related_blogs_enabled: true,
  related_blogs_heading: "Related Articles",

  cta_enabled: false,
  cta_heading: "Need Expert Advice?",
  cta_description: "",
  cta_button_text: "Contact Warm Life",
  cta_button_link: "/contact",
  cta_button_open_in_new_tab: false,

  seo_title: "",
  meta_description: "",
  focus_keyword: "",
  canonical_url: null,

  og_title: "",
  og_description: "",
  og_image_url: null,
  og_image_storage_path: null,
  og_image_alt: "",

  twitter_title: "",
  twitter_description: "",
  twitter_image_url: null,
  twitter_image_storage_path: null,

  no_index: false,
  no_follow: false,

  display_order: 0,
  is_featured: false,
  is_sticky: false,
  is_active: true,
  is_published: false,
};

function createSlug(
  value: string,
): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function asNullableText(
  value: string | null,
): string | null {
  if (value === null) {
    return null;
  }

  const cleaned = value.trim();

  return cleaned || null;
}

function FieldHelp({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <small className="blogForm__help">
      {children}
    </small>
  );
}

function CharacterCount({
  value,
  recommended,
}: {
  value: string | null;
  recommended: number;
}) {
  const count =
    value?.length ?? 0;

  return (
    <small
      className={
        count > recommended
          ? "blogForm__count isOver"
          : "blogForm__count"
      }
    >
      {count}/{recommended}
    </small>
  );
}

export default function BlogForm({
  categories,
  authors,
}: BlogFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] =
    useState<CreateBlogInput>(
      DEFAULT_BLOG,
    );

  const [slugTouched, setSlugTouched] =
    useState(false);

  const [uploads, setUploads] =
    useState<
      Record<UploadTarget, UploadState>
    >({
      featured: EMPTY_UPLOAD,
      hero: EMPTY_UPLOAD,
      heroPoster: EMPTY_UPLOAD,
      og: EMPTY_UPLOAD,
      twitter: EMPTY_UPLOAD,
    });

  const [isSaving, setIsSaving] =
    useState(false);

  const [message, setMessage] =
    useState<{
      type: "success" | "error";
      text: string;
    } | null>(null);

  const activeCategories =
    useMemo(
      () =>
        categories.filter(
          (category) =>
            category.is_active,
        ),
      [categories],
    );

  const activeAuthors =
    useMemo(
      () =>
        authors.filter(
          (author) =>
            author.is_active,
        ),
      [authors],
    );

  function updateField<
    K extends keyof CreateBlogInput,
  >(
    key: K,
    value: CreateBlogInput[K],
  ): void {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleTitleChange(
    value: string,
  ): void {
    setForm((current) => ({
      ...current,
      title: value,
      internal_name:
        current.internal_name ||
        value,
      hero_heading:
        current.hero_heading ||
        value,
      seo_title:
        current.seo_title ||
        value,
      og_title:
        current.og_title ||
        value,
      twitter_title:
        current.twitter_title ||
        value,
      slug:
        slugTouched
          ? current.slug
          : createSlug(value),
    }));
  }

  function chooseFile(
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
        text: "Please select a valid image file.",
      });
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setMessage({
        type: "error",
        text: "Each image must be smaller than 10 MB.",
      });
      return;
    }

    const previous =
      uploads[target].preview;

    if (
      previous.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        previous,
      );
    }

    setUploads((current) => ({
      ...current,
      [target]: {
        file,
        preview:
          URL.createObjectURL(file),
      },
    }));

    setMessage(null);
  }

  function setDirectImageUrl(
    target: UploadTarget,
    value: string,
  ): void {
    const clean =
      value.trim() || null;

    const mapping: Record<
      UploadTarget,
      keyof CreateBlogInput
    > = {
      featured:
        "featured_image_url",
      hero:
        "hero_image_url",
      heroPoster:
        "hero_poster_url",
      og:
        "og_image_url",
      twitter:
        "twitter_image_url",
    };

    updateField(
      mapping[target] as never,
      clean as never,
    );

    setUploads((current) => ({
      ...current,
      [target]: {
        file: null,
        preview: value,
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

    const path =
      `blogs/${target}/${crypto.randomUUID()}.${extension}`;

    const { error } =
      await supabase.storage
        .from("website-media")
        .upload(
          path,
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
        .getPublicUrl(path);

    return {
      publicUrl:
        data.publicUrl,
      storagePath:
        path,
    };
  }

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setIsSaving(true);
    setMessage(null);

    const uploadedPaths: string[] = [];

    try {
      const payload: CreateBlogInput = {
        ...form,

        internal_name:
          form.internal_name.trim(),

        title:
          form.title.trim(),

        slug:
          createSlug(form.slug),

        eyebrow:
          asNullableText(form.eyebrow),

        excerpt:
          asNullableText(form.excerpt),

        introduction:
          asNullableText(
            form.introduction,
          ),

        featured_image_alt:
          asNullableText(
            form.featured_image_alt,
          ),

        hero_eyebrow:
          asNullableText(
            form.hero_eyebrow,
          ),

        hero_heading:
          asNullableText(
            form.hero_heading,
          ),

        hero_description:
          asNullableText(
            form.hero_description,
          ),

        hero_image_alt:
          asNullableText(
            form.hero_image_alt,
          ),

        cta_description:
          asNullableText(
            form.cta_description,
          ),

        seo_title:
          asNullableText(
            form.seo_title,
          ),

        meta_description:
          asNullableText(
            form.meta_description,
          ),

        focus_keyword:
          asNullableText(
            form.focus_keyword,
          ),

        canonical_url:
          asNullableText(
            form.canonical_url,
          ),

        og_title:
          asNullableText(
            form.og_title,
          ),

        og_description:
          asNullableText(
            form.og_description,
          ),

        og_image_alt:
          asNullableText(
            form.og_image_alt,
          ),

        twitter_title:
          asNullableText(
            form.twitter_title,
          ),

        twitter_description:
          asNullableText(
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

        uploadedPaths.push(
          uploaded.storagePath,
        );

        if (target === "featured") {
          payload.featured_image_url =
            uploaded.publicUrl;
          payload.featured_image_storage_path =
            uploaded.storagePath;
        }

        if (target === "hero") {
          payload.hero_image_url =
            uploaded.publicUrl;
          payload.hero_image_storage_path =
            uploaded.storagePath;
        }

        if (target === "heroPoster") {
          payload.hero_poster_url =
            uploaded.publicUrl;
          payload.hero_poster_storage_path =
            uploaded.storagePath;
        }

        if (target === "og") {
          payload.og_image_url =
            uploaded.publicUrl;
          payload.og_image_storage_path =
            uploaded.storagePath;
        }

        if (target === "twitter") {
          payload.twitter_image_url =
            uploaded.publicUrl;
          payload.twitter_image_storage_path =
            uploaded.storagePath;
        }
      }

      const result =
        await createBlog(payload);

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

      if (!result.data?.id) {
        throw new Error(
          "Blog was created but no record ID was returned.",
        );
      }

      setMessage({
        type: "success",
        text:
          "Blog created successfully. Opening the edit page so you can add content blocks, highlights, FAQs, gallery and related content.",
      });

      router.push(
        `/admin/website/blogs/${result.data.id}/edit`,
      );

      router.refresh();
    } catch (error) {
      if (
        uploadedPaths.length > 0
      ) {
        await supabase.storage
          .from("website-media")
          .remove(uploadedPaths);
      }

      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to create blog.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  function MediaField({
    target,
    title,
    url,
    altField,
    help,
  }: {
    target: UploadTarget;
    title: string;
    url: string | null;
    altField?: keyof CreateBlogInput;
    help: string;
  }) {
    const preview =
      uploads[target].preview ||
      url ||
      "";

    return (
      <div className="blogMediaField">
        <div className="blogMediaField__top">
          <div>
            <strong>
              {title}
            </strong>

            <FieldHelp>
              {help}
            </FieldHelp>
          </div>

          <label className="blogMediaField__upload">
            <Upload size={15} />
            Upload

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                chooseFile(
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
            value={url ?? ""}
            placeholder="https://..."
            onChange={(event) =>
              setDirectImageUrl(
                target,
                event.target.value,
              )
            }
          />
        </label>

        {preview ? (
          <img
            src={preview}
            alt=""
            className="blogMediaField__preview"
          />
        ) : (
          <div className="blogMediaField__empty">
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
                  form[altField] ??
                  "",
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
      className="blogForm"
      onSubmit={submit}
    >
      {message ? (
        <div
          className={`blogForm__message ${
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

      <section className="blogFormSection">
        <header>
          <span>
            Basic information
          </span>

          <h2>
            Blog card and article details
          </h2>
        </header>

        <div className="blogFormGrid">
          <label>
            <span>
              Blog title *
            </span>

            <input
              required
              value={form.title}
              onChange={(event) =>
                handleTitleChange(
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
              value={form.slug}
              onChange={(event) => {
                setSlugTouched(true);

                updateField(
                  "slug",
                  createSlug(
                    event.target.value,
                  ),
                );
              }}
            />

            <FieldHelp>
              Public URL:
              {" "}
              /blogs/{form.slug ||
                "your-blog-slug"}
            </FieldHelp>
          </label>

          <label>
            <span>
              Internal name *
            </span>

            <input
              required
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

          <label>
            <span>
              Eyebrow
            </span>

            <input
              value={
                form.eyebrow ?? ""
              }
              placeholder="Energy Advice"
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
              Excerpt / card description
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

            <CharacterCount
              value={form.excerpt}
              recommended={300}
            />
          </label>

          <label className="isFull">
            <span>
              Article introduction
            </span>

            <textarea
              rows={7}
              value={
                form.introduction ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "introduction",
                  event.target.value,
                )
              }
            />

            <FieldHelp>
              This appears before the
              dynamic content blocks.
            </FieldHelp>
          </label>
        </div>
      </section>

      <section className="blogFormSection">
        <header>
          <span>
            Taxonomy and ownership
          </span>

          <h2>
            Category, author and publishing date
          </h2>
        </header>

        <div className="blogFormGrid">
          <label>
            <span>
              Category
            </span>

            <select
              value={
                form.category_id ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "category_id",
                  event.target
                    .value || null,
                )
              }
            >
              <option value="">
                Select category
              </option>

              {activeCategories.map(
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
                form.author_id ??
                ""
              }
              onChange={(event) =>
                updateField(
                  "author_id",
                  event.target
                    .value || null,
                )
              }
            >
              <option value="">
                Select author
              </option>

              {activeAuthors.map(
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
              Reading time (minutes)
            </span>

            <input
              type="number"
              min="1"
              max="999"
              value={
                form.reading_time_minutes
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
              Publish date and time
            </span>

            <input
              type="datetime-local"
              value={
                form.publish_date
                  ? form.publish_date.slice(
                      0,
                      16,
                    )
                  : ""
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

            <FieldHelp>
              Leave blank to publish
              immediately when Published
              is enabled.
            </FieldHelp>
          </label>

          <label>
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

      <section className="blogFormSection">
        <header>
          <span>
            Featured media
          </span>

          <h2>
            Blog card image
          </h2>
        </header>

        <div className="blogFormSection__content">
          <MediaField
            target="featured"
            title="Featured image"
            url={
              form.featured_image_url
            }
            altField="featured_image_alt"
            help="Used on the Blogs listing, related articles and sharing previews when no dedicated social image is supplied."
          />
        </div>
      </section>

      <section className="blogFormSection">
        <header>
          <span>
            Listing behaviour
          </span>

          <h2>
            Public blog card settings
          </h2>
        </header>

        <div className="blogToggleGrid">
          <label>
            <input
              type="checkbox"
              checked={
                form.show_in_listing
              }
              onChange={(event) =>
                updateField(
                  "show_in_listing",
                  event.target.checked,
                )
              }
            />

            <span>
              Show in Blogs listing
            </span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={
                form.show_read_button
              }
              onChange={(event) =>
                updateField(
                  "show_read_button",
                  event.target.checked,
                )
              }
            />

            <span>
              Show Read Article button
            </span>
          </label>

          <label>
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
              Open article in new tab
            </span>
          </label>

          <label>
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
              Create detailed blog page
            </span>
          </label>
        </div>

        <div className="blogFormGrid blogFormGrid--padded">
          <label>
            <span>
              Read button text
            </span>

            <input
              value={
                form.read_button_text
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
          <section className="blogFormSection">
            <header>
              <span>
                Detail page
              </span>

              <h2>
                Blog hero
              </h2>
            </header>

            <div className="blogFormGrid">
              <label>
                <span>
                  Hero type
                </span>

                <select
                  value={
                    form.hero_type
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
            "image" ? (
              <div className="blogFormSection__content">
                <MediaField
                  target="hero"
                  title="Hero image"
                  url={
                    form.hero_image_url
                  }
                  altField="hero_image_alt"
                  help="Large image displayed behind or alongside the article hero content."
                />
              </div>
            ) : (
              <div className="blogFormGrid blogFormGrid--padded">
                <label className="isFull">
                  <span>
                    Hero video URL
                  </span>

                  <input
                    type="url"
                    value={
                      form.hero_video_url ??
                      ""
                    }
                    placeholder="https://..."
                    onChange={(event) =>
                      updateField(
                        "hero_video_url",
                        event.target
                          .value || null,
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
                    placeholder="Optional Supabase storage path"
                    onChange={(event) =>
                      updateField(
                        "hero_video_storage_path",
                        event.target
                          .value || null,
                      )
                    }
                  />
                </label>

                <div className="isFull">
                  <MediaField
                    target="heroPoster"
                    title="Video poster image"
                    url={
                      form.hero_poster_url
                    }
                    help="Fallback image shown while the hero video loads."
                  />
                </div>
              </div>
            )}

            <div className="blogFormGrid blogFormGrid--padded">
              <label>
                <span>
                  Hero heading desktop (px)
                </span>

                <input
                  type="number"
                  min="28"
                  max="180"
                  value={
                    form.hero_heading_size
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
                  Hero heading mobile (px)
                </span>

                <input
                  type="number"
                  min="24"
                  max="100"
                  value={
                    form.hero_heading_size_mobile
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
                  Section heading desktop (px)
                </span>

                <input
                  type="number"
                  min="24"
                  max="120"
                  value={
                    form.section_heading_size
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
                  Section heading mobile (px)
                </span>

                <input
                  type="number"
                  min="22"
                  max="80"
                  value={
                    form.section_heading_size_mobile
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
                  Card heading size (px)
                </span>

                <input
                  type="number"
                  min="16"
                  max="60"
                  value={
                    form.card_heading_size
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
                  CTA heading desktop (px)
                </span>

                <input
                  type="number"
                  min="24"
                  max="120"
                  value={
                    form.cta_heading_size
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
                  CTA heading mobile (px)
                </span>

                <input
                  type="number"
                  min="22"
                  max="80"
                  value={
                    form.cta_heading_size_mobile
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

          <section className="blogFormSection">
            <header>
              <span>
                Dynamic content
              </span>

              <h2>
                Optional article managers
              </h2>
            </header>

            <div className="blogFormNotice">
              <Info size={18} />

              <p>
                Enable the managers you need now.
                After the blog is created, the edit
                page will show repeatable editors for
                content blocks, takeaways, tips,
                FAQs, gallery, related services and
                related blogs.
              </p>
            </div>

            <div className="blogManagerToggleList">
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={
                      form.key_takeaways_enabled
                    }
                    onChange={(event) =>
                      updateField(
                        "key_takeaways_enabled",
                        event.target.checked,
                      )
                    }
                  />

                  <span>
                    Enable Key Takeaways
                  </span>
                </label>

                <input
                  value={
                    form.key_takeaways_heading
                  }
                  onChange={(event) =>
                    updateField(
                      "key_takeaways_heading",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={
                      form.tips_enabled
                    }
                    onChange={(event) =>
                      updateField(
                        "tips_enabled",
                        event.target.checked,
                      )
                    }
                  />

                  <span>
                    Enable Helpful Tips
                  </span>
                </label>

                <input
                  value={
                    form.tips_heading
                  }
                  onChange={(event) =>
                    updateField(
                      "tips_heading",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={
                      form.faq_enabled
                    }
                    onChange={(event) =>
                      updateField(
                        "faq_enabled",
                        event.target.checked,
                      )
                    }
                  />

                  <span>
                    Enable FAQs
                  </span>
                </label>

                <input
                  value={
                    form.faq_heading
                  }
                  onChange={(event) =>
                    updateField(
                      "faq_heading",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label>
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

                  <span>
                    Enable Gallery
                  </span>
                </label>

                <input
                  value={
                    form.gallery_heading
                  }
                  onChange={(event) =>
                    updateField(
                      "gallery_heading",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={
                      form.related_services_enabled
                    }
                    onChange={(event) =>
                      updateField(
                        "related_services_enabled",
                        event.target.checked,
                      )
                    }
                  />

                  <span>
                    Enable Related Services
                  </span>
                </label>

                <input
                  value={
                    form.related_services_heading
                  }
                  onChange={(event) =>
                    updateField(
                      "related_services_heading",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={
                      form.related_blogs_enabled
                    }
                    onChange={(event) =>
                      updateField(
                        "related_blogs_enabled",
                        event.target.checked,
                      )
                    }
                  />

                  <span>
                    Enable Related Blogs
                  </span>
                </label>

                <input
                  value={
                    form.related_blogs_heading
                  }
                  onChange={(event) =>
                    updateField(
                      "related_blogs_heading",
                      event.target.value,
                    )
                  }
                />
              </div>
            </div>
          </section>

          <section className="blogFormSection">
            <header>
              <span>
                Call to action
              </span>

              <h2>
                Detail page CTA
              </h2>
            </header>

            <div className="blogToggleGrid">
              <label>
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
            </div>

            {form.cta_enabled ? (
              <div className="blogFormGrid blogFormGrid--padded">
                <label className="isFull">
                  <span>
                    CTA heading
                  </span>

                  <input
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
                    Button text
                  </span>

                  <input
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

                <label>
                  <span>
                    Button link
                  </span>

                  <input
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

                <label className="blogInlineCheckbox isFull">
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
                    Open CTA link in new tab
                  </span>
                </label>
              </div>
            ) : null}
          </section>
        </>
      ) : null}

      <section className="blogFormSection">
        <header>
          <span>
            Search optimisation
          </span>

          <h2>
            SEO foundation
          </h2>
        </header>

        <div className="blogFormNotice">
          <Info size={18} />

          <p>
            These fields make the blog SEO-ready.
            Advanced scoring, schema controls,
            sitemap management and AI suggestions
            will later be handled by the dedicated
            SEO Manager.
          </p>
        </div>

        <div className="blogFormGrid">
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

            <CharacterCount
              value={form.seo_title}
              recommended={60}
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

            <CharacterCount
              value={
                form.meta_description
              }
              recommended={160}
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
              placeholder="Optional full canonical URL"
              onChange={(event) =>
                updateField(
                  "canonical_url",
                  event.target
                    .value || null,
                )
              }
            />
          </label>
        </div>
      </section>

      <section className="blogFormSection">
        <header>
          <span>
            Social sharing
          </span>

          <h2>
            Open Graph
          </h2>
        </header>

        <div className="blogFormGrid">
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

        <div className="blogFormSection__content">
          <MediaField
            target="og"
            title="Open Graph image"
            url={
              form.og_image_url
            }
            altField="og_image_alt"
            help="Recommended social sharing image for Facebook, LinkedIn and other platforms."
          />
        </div>
      </section>

      <section className="blogFormSection">
        <header>
          <span>
            Social sharing
          </span>

          <h2>
            Twitter / X card
          </h2>
        </header>

        <div className="blogFormGrid">
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

        <div className="blogFormSection__content">
          <MediaField
            target="twitter"
            title="Twitter / X image"
            url={
              form.twitter_image_url
            }
            help="Optional platform-specific image. Open Graph image can be used as fallback later."
          />
        </div>
      </section>

      <section className="blogFormSection">
        <header>
          <span>
            Search engine directives
          </span>

          <h2>
            Robots controls
          </h2>
        </header>

        <div className="blogToggleGrid">
          <label>
            <input
              type="checkbox"
              checked={
                form.no_index
              }
              onChange={(event) =>
                updateField(
                  "no_index",
                  event.target.checked,
                )
              }
            />

            <span>
              No Index
            </span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={
                form.no_follow
              }
              onChange={(event) =>
                updateField(
                  "no_follow",
                  event.target.checked,
                )
              }
            />

            <span>
              No Follow
            </span>
          </label>
        </div>
      </section>

      <section className="blogFormSection">
        <header>
          <span>
            Publishing
          </span>

          <h2>
            Status and visibility
          </h2>
        </header>

        <div className="blogToggleGrid">
          <label>
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
              Featured blog
            </span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={
                form.is_sticky
              }
              onChange={(event) =>
                updateField(
                  "is_sticky",
                  event.target.checked,
                )
              }
            />

            <span>
              Sticky / pinned blog
            </span>
          </label>

          <label>
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

          <label>
            <input
              type="checkbox"
              checked={
                form.is_published
              }
              onChange={(event) =>
                updateField(
                  "is_published",
                  event.target.checked,
                )
              }
            />

            <span>
              Published
            </span>
          </label>
        </div>
      </section>

      <footer className="blogForm__footer">
        <button
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2
              size={17}
              className="blogForm__spinner"
            />
          ) : (
            <Save size={17} />
          )}

          {form.is_published
            ? "Create & Publish Blog"
            : "Save Blog Draft"}
        </button>
      </footer>
    </form>
  );
}
