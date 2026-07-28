import { z } from "zod";

export const heroInsightSchema = z.object({
  hero_slide_id: z
    .string()
    .uuid("Please select a valid hero slide."),

  label: z
    .string()
    .trim()
    .min(1, "Label is required.")
    .max(80, "Label cannot exceed 80 characters."),

  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(120, "Title cannot exceed 120 characters."),

  description: z
    .string()
    .trim()
    .max(400, "Description cannot exceed 400 characters.")
    .optional()
    .default(""),

  display_order: z
    .number()
    .int("Display order must be a whole number.")
    .min(0, "Display order cannot be negative."),

  is_visible: z.boolean(),
});

export const createHeroInsightSchema = heroInsightSchema;

export const updateHeroInsightSchema = heroInsightSchema.extend({
  id: z.string().uuid("Invalid hero insight ID."),
});

export type HeroInsightSchemaInput = z.infer<
  typeof heroInsightSchema
>;

export type CreateHeroInsightSchemaInput = z.infer<
  typeof createHeroInsightSchema
>;

export type UpdateHeroInsightSchemaInput = z.infer<
  typeof updateHeroInsightSchema
>;