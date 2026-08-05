import { z } from "zod";

export const updateCaseStudiesPageSettingsSchema =
  z.object({
    hero_eyebrow:
      z.string().trim().max(200).optional(),

    hero_heading:
      z.string().trim().min(
        1,
        "Hero heading is required.",
      ).max(300).optional(),

    hero_description:
      z.string().trim().max(2500).optional(),

    hero_image_url:
      z.string().trim().nullable().optional(),

    hero_image_storage_path:
      z.string().trim().nullable().optional(),

    hero_image_alt:
      z.string().trim().max(300).optional(),

    hero_overlay_opacity:
      z.number().min(0).max(1).optional(),

    hero_height:
      z.number().int().min(320).max(1000).optional(),

    hero_heading_size:
      z.number().int().min(28).max(180).optional(),

    hero_heading_size_mobile:
      z.number().int().min(24).max(100).optional(),

    is_active:
      z.boolean().optional(),
  });
