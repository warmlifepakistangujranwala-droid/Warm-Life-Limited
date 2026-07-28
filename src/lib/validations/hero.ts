import { z } from "zod";

const hexColorSchema = z
  .string()
  .trim()
  .regex(
    /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
    "Please enter a valid hex colour.",
  );

export const heroSlideSchema = z.object({
  eyebrow: z
    .string()
    .trim()
    .max(80, "Eyebrow cannot exceed 80 characters."),

  title_line_one: z
    .string()
    .trim()
    .min(1, "Title line one is required.")
    .max(120, "Title line one cannot exceed 120 characters."),

  title_line_one_color: hexColorSchema,

  title_line_two: z
    .string()
    .trim()
    .max(120, "Title line two cannot exceed 120 characters."),

  title_line_two_color: hexColorSchema,

  description: z
    .string()
    .trim()
    .max(600, "Description cannot exceed 600 characters."),

  description_color: hexColorSchema,

  primary_button_text: z
    .string()
    .trim()
    .max(40, "Primary button text cannot exceed 40 characters."),

  primary_button_link: z
    .string()
    .trim()
    .max(255, "Primary button link is too long."),

  secondary_button_text: z
    .string()
    .trim()
    .max(40, "Secondary button text cannot exceed 40 characters."),

  secondary_button_link: z
    .string()
    .trim()
    .max(255, "Secondary button link is too long."),

  video_url: z
    .string()
    .trim()
    .min(1, "Hero video is required."),

  video_poster_url: z.string().trim(),

  display_order: z
    .number()
    .int("Display order must be a whole number.")
    .min(0, "Display order cannot be less than zero."),

  is_active: z.boolean(),

  is_published: z.boolean(),
});

export type HeroSlideSchema = z.infer<typeof heroSlideSchema>;