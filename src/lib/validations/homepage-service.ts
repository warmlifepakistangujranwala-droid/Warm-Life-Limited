import { z } from "zod";

export const homepageServiceMediaTypeSchema = z.enum([
  "video",
  "image",
]);

export const homepageServicesSectionSchema = z.object({
  section_label: z.string().nullable().optional(),

  section_heading: z
    .string()
    .min(1, "Section heading is required"),

  section_label_color: z.string(),

  section_label_size: z.number().min(8).max(60),

  section_heading_color: z.string(),

  section_heading_size: z.number().min(12).max(120),

  section_heading_weight: z.number(),

  section_alignment: z.enum([
    "left",
    "center",
    "right",
  ]),

  background_color: z.string(),

  padding_top: z.number(),

  padding_bottom: z.number(),

  scroll_height: z.number(),

  animation_duration: z.number(),

  is_active: z.boolean(),
});

export const homepageServiceBulletSchema = z.object({
  bullet_text: z
    .string()
    .min(1, "Bullet text is required"),

  display_order: z.number(),
});

export const homepageServiceSchema = z.object({
  section_id: z.string().uuid().nullable().optional(),

  display_order: z.number(),

  display_number: z.string().nullable().optional(),

  service_name: z
    .string()
    .min(1, "Service name is required"),

  slug: z.string().nullable().optional(),

  eyebrow: z.string().nullable().optional(),

  title: z
    .string()
    .min(1, "Title is required"),

  description: z.string().nullable().optional(),

  media_type: homepageServiceMediaTypeSchema,

  video_url: z.string().nullable().optional(),

  video_poster_url: z.string().nullable().optional(),

  image_url: z.string().nullable().optional(),

  object_position: z.string().nullable().optional(),

  service_name_color: z.string().nullable().optional(),

  service_name_size: z.number().nullable().optional(),

  service_name_weight: z.number().nullable().optional(),

  eyebrow_color: z.string().nullable().optional(),

  eyebrow_size: z.number().nullable().optional(),

  title_color: z.string().nullable().optional(),

  title_size: z.number().nullable().optional(),

  title_weight: z.number().nullable().optional(),

  description_color: z.string().nullable().optional(),

  description_size: z.number().nullable().optional(),

  bullet_color: z.string().nullable().optional(),

  bullet_size: z.number().nullable().optional(),

  button_text: z.string().nullable().optional(),

  button_link: z.string().nullable().optional(),

  open_in_new_tab: z.boolean(),

  button_background_color: z.string().nullable().optional(),

  button_text_color: z.string().nullable().optional(),

  button_radius: z.number().nullable().optional(),

  button_size: z.number().nullable().optional(),

  is_active: z.boolean(),

  is_published: z.boolean(),
});

export const createHomepageServiceSchema =
  homepageServiceSchema;

export const updateHomepageServiceSchema =
  homepageServiceSchema.partial();

export const createHomepageServiceBulletSchema =
  homepageServiceBulletSchema;

export const updateHomepageServiceBulletSchema =
  homepageServiceBulletSchema.partial();

export const updateHomepageServicesSectionSchema =
  homepageServicesSectionSchema.partial();

export type HomepageServiceInput = z.infer<
  typeof homepageServiceSchema
>;

export type HomepageServiceBulletInput = z.infer<
  typeof homepageServiceBulletSchema
>;

export type HomepageServicesSectionInput = z.infer<
  typeof homepageServicesSectionSchema
>;