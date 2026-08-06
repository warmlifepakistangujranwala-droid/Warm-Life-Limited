/**
 * Blogs Listing Page Validation
 * Version: v0.1.0
 */

import {
  z,
} from "zod";

const nullableUrl = z
  .union([
    z.string().trim().url(),
    z.literal(""),
    z.null(),
  ])
  .transform(
    (value) =>
      value === ""
        ? null
        : value,
  );

export const blogsPageSettingsSchema =
  z.object({
    internal_name:
      z.string().trim().min(1).max(250),

    hero_eyebrow:
      z.string().trim().min(1).max(200),

    hero_heading:
      z.string().trim().min(1).max(500),

    hero_description:
      z.string().trim().min(1).max(3000),

    hero_background_image_url:
      nullableUrl,

    hero_background_image_storage_path:
      z.string().trim().max(1000).nullable(),

    hero_background_image_alt:
      z.string().trim().min(1).max(300),

    hero_overlay_opacity:
      z.number().min(0).max(1),

    hero_height:
      z.number().int().min(320).max(1000),

    hero_heading_size:
      z.number().int().min(32).max(180),

    hero_heading_size_mobile:
      z.number().int().min(26).max(100),

    listing_eyebrow:
      z.string().trim().min(1).max(200),

    listing_heading:
      z.string().trim().min(1).max(300),

    listing_description:
      z.string().trim().min(1).max(3000),

    is_active:
      z.boolean(),

    is_published:
      z.boolean(),
  });

export const updateBlogsPageSettingsSchema =
  blogsPageSettingsSchema.partial();
