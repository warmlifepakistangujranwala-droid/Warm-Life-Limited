/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/lib/validations/blogs.ts
 *
 * Purpose :
 * Blog CMS validation schemas.
 *
 * Version : v0.1.0
 * ============================================================
 */

import { z } from "zod";

const nullableText = (
  maxLength: number,
) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .nullable();

const nullableUrl = z
  .union([
    z.string().trim().url(),
    z.literal(""),
    z.null(),
  ])
  .transform((value) =>
    value === "" ? null : value,
  );

export const blogSchema = z.object({
  internal_name:
    z.string().trim().min(
      1,
      "Internal name is required.",
    ).max(250),

  title:
    z.string().trim().min(
      1,
      "Blog title is required.",
    ).max(300),

  slug:
    z.string()
      .trim()
      .min(1, "Slug is required.")
      .max(300)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain lowercase letters, numbers and hyphens only.",
      ),

  eyebrow:
    nullableText(200),

  excerpt:
    nullableText(1000),

  introduction:
    nullableText(10000),

  category_id:
    z.string().uuid().nullable(),

  author_id:
    z.string().uuid().nullable(),

  reading_time_minutes:
    z.number().int().min(1).max(999),

  publish_date:
    z.string().nullable(),

  featured_image_url:
    nullableUrl,

  featured_image_storage_path:
    nullableText(1000),

  featured_image_alt:
    nullableText(300),

  show_in_listing:
    z.boolean(),

  show_read_button:
    z.boolean(),

  read_button_text:
    z.string().trim().min(1).max(100),

  open_in_new_tab:
    z.boolean(),

  has_detail_page:
    z.boolean(),

  hero_type:
    z.enum(["image", "video"]),

  hero_eyebrow:
    nullableText(200),

  hero_heading:
    nullableText(400),

  hero_description:
    nullableText(3000),

  hero_image_url:
    nullableUrl,

  hero_image_storage_path:
    nullableText(1000),

  hero_image_alt:
    nullableText(300),

  hero_video_url:
    nullableUrl,

  hero_video_storage_path:
    nullableText(1000),

  hero_poster_url:
    nullableUrl,

  hero_poster_storage_path:
    nullableText(1000),

  hero_heading_size:
    z.number().int().min(28).max(180),

  hero_heading_size_mobile:
    z.number().int().min(24).max(100),

  section_heading_size:
    z.number().int().min(24).max(120),

  section_heading_size_mobile:
    z.number().int().min(22).max(80),

  card_heading_size:
    z.number().int().min(16).max(60),

  cta_heading_size:
    z.number().int().min(24).max(120),

  cta_heading_size_mobile:
    z.number().int().min(22).max(80),

  key_takeaways_enabled:
    z.boolean(),

  key_takeaways_heading:
    z.string().trim().min(1).max(200),

  tips_enabled:
    z.boolean(),

  tips_heading:
    z.string().trim().min(1).max(200),

  faq_enabled:
    z.boolean(),

  faq_heading:
    z.string().trim().min(1).max(200),

  gallery_enabled:
    z.boolean(),

  gallery_heading:
    z.string().trim().min(1).max(200),

  related_services_enabled:
    z.boolean(),

  related_services_heading:
    z.string().trim().min(1).max(200),

  related_blogs_enabled:
    z.boolean(),

  related_blogs_heading:
    z.string().trim().min(1).max(200),

  cta_enabled:
    z.boolean(),

  cta_heading:
    z.string().trim().min(1).max(300),

  cta_description:
    nullableText(2500),

  cta_button_text:
    z.string().trim().min(1).max(100),

  cta_button_link:
    z.string().trim().min(1).max(1000),

  cta_button_open_in_new_tab:
    z.boolean(),

  seo_title:
    nullableText(300),

  meta_description:
    nullableText(1000),

  focus_keyword:
    nullableText(300),

  canonical_url:
    nullableUrl,

  og_title:
    nullableText(300),

  og_description:
    nullableText(1000),

  og_image_url:
    nullableUrl,

  og_image_storage_path:
    nullableText(1000),

  og_image_alt:
    nullableText(300),

  twitter_title:
    nullableText(300),

  twitter_description:
    nullableText(1000),

  twitter_image_url:
    nullableUrl,

  twitter_image_storage_path:
    nullableText(1000),

  no_index:
    z.boolean(),

  no_follow:
    z.boolean(),

  display_order:
    z.number().int().min(0),

  is_featured:
    z.boolean(),

  is_sticky:
    z.boolean(),

  is_active:
    z.boolean(),

  is_published:
    z.boolean(),
});

export const createBlogSchema =
  blogSchema;

export const updateBlogSchema =
  blogSchema.partial();

export const blogCategorySchema =
  z.object({
    internal_name:
      z.string().trim().min(1).max(200),

    name:
      z.string().trim().min(1).max(200),

    slug:
      z.string()
        .trim()
        .min(1)
        .max(200)
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        ),

    description:
      nullableText(3000),

    display_order:
      z.number().int().min(0),

    is_active:
      z.boolean(),

    is_published:
      z.boolean(),
  });

export const blogAuthorSchema =
  z.object({
    internal_name:
      z.string().trim().min(1).max(200),

    display_name:
      z.string().trim().min(1).max(200),

    job_title:
      nullableText(300),

    biography:
      nullableText(5000),

    profile_image_url:
      nullableUrl,

    profile_image_storage_path:
      nullableText(1000),

    profile_image_alt:
      nullableText(300),

    linkedin_url:
      nullableUrl,

    website_url:
      nullableUrl,

    display_order:
      z.number().int().min(0),

    is_active:
      z.boolean(),

    is_published:
      z.boolean(),
  });

export const blogContentBlockSchema =
  z.object({
    blog_id:
      z.string().uuid(),

    internal_name:
      nullableText(250),

    block_type:
      z.enum([
        "paragraph",
        "heading",
        "image",
        "quote",
        "video",
        "checklist",
        "numbered_list",
        "table",
        "code",
        "callout",
      ]),

    heading:
      nullableText(500),

    content:
      nullableText(50000),

    heading_level:
      z.number().int().min(2).max(6).nullable(),

    image_url:
      nullableUrl,

    image_storage_path:
      nullableText(1000),

    image_alt:
      nullableText(300),

    image_caption:
      nullableText(1000),

    video_url:
      nullableUrl,

    video_storage_path:
      nullableText(1000),

    video_poster_url:
      nullableUrl,

    quote_author:
      nullableText(300),

    quote_role:
      nullableText(300),

    callout_style:
      z.enum([
        "information",
        "success",
        "warning",
        "important",
      ]).nullable(),

    display_order:
      z.number().int().min(0),

    is_active:
      z.boolean(),

    is_published:
      z.boolean(),
  });

export const blogHighlightSchema =
  z.object({
    blog_id:
      z.string().uuid(),

    highlight_type:
      z.enum(["takeaway", "tip"]),

    internal_name:
      nullableText(250),

    title:
      nullableText(500),

    description:
      z.string().trim().min(
        1,
        "Description is required.",
      ).max(5000),

    icon_name:
      z.string().trim().min(1).max(100),

    display_order:
      z.number().int().min(0),

    is_active:
      z.boolean(),

    is_published:
      z.boolean(),
  });

export const blogGalleryItemSchema =
  z.object({
    blog_id:
      z.string().uuid(),

    internal_name:
      nullableText(250),

    image_url:
      nullableUrl,

    image_storage_path:
      nullableText(1000),

    image_alt:
      nullableText(300),

    caption:
      nullableText(1000),

    display_order:
      z.number().int().min(0),

    is_active:
      z.boolean(),

    is_published:
      z.boolean(),
  });

export const blogFaqSchema =
  z.object({
    blog_id:
      z.string().uuid(),

    internal_name:
      nullableText(250),

    question:
      z.string().trim().min(1).max(1000),

    answer:
      z.string().trim().min(1).max(10000),

    display_order:
      z.number().int().min(0),

    is_active:
      z.boolean(),

    is_published:
      z.boolean(),
  });

export const attachBlogRelatedServiceSchema =
  z.object({
    blog_id:
      z.string().uuid(),

    service_id:
      z.string().uuid(),

    display_order:
      z.number().int().min(0),
  });

export const attachBlogRelatedBlogSchema =
  z.object({
    blog_id:
      z.string().uuid(),

    related_blog_id:
      z.string().uuid(),

    display_order:
      z.number().int().min(0),
  }).refine(
    (value) =>
      value.blog_id !==
      value.related_blog_id,
    {
      message:
        "A blog cannot be related to itself.",
      path: ["related_blog_id"],
    },
  );
