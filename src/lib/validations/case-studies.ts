/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/lib/validations/case-studies.ts
 *
 * Purpose :
 * Defines Zod validation schemas for the Case Studies CMS.
 *
 * Version : v0.1.0
 * ============================================================
 */

import { z } from "zod";

const trimmedString = z
  .string()
  .transform((value) => value.trim());

const requiredText = (
  fieldName: string,
  maxLength = 500,
) =>
  trimmedString.pipe(
    z
      .string()
      .min(
        1,
        `${fieldName} is required.`,
      )
      .max(
        maxLength,
        `${fieldName} cannot exceed ${maxLength} characters.`,
      ),
  );

const optionalText = (
  maxLength = 4000,
) =>
  z
    .string()
    .transform((value) => value.trim())
    .pipe(
      z
        .string()
        .max(
          maxLength,
          `Text cannot exceed ${maxLength} characters.`,
        ),
    )
    .optional();

const nullableOptionalText = (
  maxLength = 1000,
) =>
  z
    .union([
      z.string(),
      z.null(),
    ])
    .transform((value) => {
      if (value === null) {
        return null;
      }

      const trimmed = value.trim();

      return trimmed || null;
    })
    .pipe(
      z
        .string()
        .max(
          maxLength,
          `Text cannot exceed ${maxLength} characters.`,
        )
        .nullable(),
    )
    .optional();

const optionalUrl = z
  .union([
    z.string(),
    z.null(),
  ])
  .transform((value) => {
    if (value === null) {
      return null;
    }

    const trimmed = value.trim();

    return trimmed || null;
  })
  .refine(
    (value) => {
      if (!value) {
        return true;
      }

      if (
        value.startsWith("/") ||
        value.startsWith("#")
      ) {
        return true;
      }

      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    {
      message:
        "Enter a valid URL, internal path or anchor.",
    },
  )
  .optional();

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .max(
    160,
    "Slug cannot exceed 160 characters.",
  )
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain lowercase letters, numbers and hyphens only.",
  );

const nonNegativeInteger = z
  .number()
  .int()
  .min(0);

const positiveSize = (
  label: string,
  max: number,
) =>
  z
    .number()
    .finite()
    .positive(
      `${label} must be greater than zero.`,
    )
    .max(
      max,
      `${label} cannot exceed ${max}px.`,
    );

export const caseStudyHeroTypeSchema =
  z.enum([
    "image",
    "video",
  ]);

export const caseStudyGalleryImageTypeSchema =
  z.enum([
    "standard",
    "before",
    "after",
  ]);

const caseStudyBaseSchema =
  z.object({
    internal_name:
      requiredText(
        "Internal name",
        160,
      ),

    title:
      requiredText(
        "Case study title",
        240,
      ),

    slug:
      slugSchema,

    eyebrow:
      optionalText(200)
        .default(""),

    short_description:
      optionalText(1500)
        .default(""),

    full_description:
      optionalText(30000)
        .default(""),

    client_name:
      optionalText(200)
        .default(""),

    organisation_name:
      optionalText(240)
        .default(""),

    location:
      optionalText(240)
        .default(""),

    property_type:
      optionalText(200)
        .default(""),

    service_category:
      optionalText(200)
        .default(""),

    completion_date:
      z
        .union([
          z.string(),
          z.null(),
        ])
        .transform((value) => {
          if (!value) {
            return null;
          }

          return value.trim() || null;
        })
        .refine(
          (value) => {
            if (!value) {
              return true;
            }

            return !Number.isNaN(
              Date.parse(value),
            );
          },
          {
            message:
              "Enter a valid completion date.",
          },
        )
        .optional(),

    project_duration:
      optionalText(160)
        .default(""),

    featured_image_url:
      nullableOptionalText(1000),

    featured_image_storage_path:
      nullableOptionalText(1000),

    featured_image_alt:
      optionalText(300)
        .default(""),

    show_view_button:
      z
        .boolean()
        .default(true),

    view_button_text:
      optionalText(120)
        .default(
          "View Case Study",
        ),

    open_in_new_tab:
      z
        .boolean()
        .default(false),

    has_detail_page:
      z
        .boolean()
        .default(true),

    detail_hero_type:
      caseStudyHeroTypeSchema
        .default("image"),

    detail_hero_eyebrow:
      optionalText(200)
        .default(""),

    detail_hero_heading:
      optionalText(300)
        .default(""),

    detail_hero_description:
      optionalText(2500)
        .default(""),

    detail_hero_image_url:
      nullableOptionalText(1000),

    detail_hero_image_storage_path:
      nullableOptionalText(1000),

    detail_hero_image_alt:
      optionalText(300)
        .default(""),

    detail_hero_video_url:
      nullableOptionalText(1000),

    detail_hero_video_storage_path:
      nullableOptionalText(1000),

    detail_hero_poster_url:
      nullableOptionalText(1000),

    detail_hero_poster_storage_path:
      nullableOptionalText(1000),

    detail_hero_poster_alt:
      optionalText(300)
        .default(""),

    overview_enabled:
      z.boolean()
        .default(true),

    overview_heading:
      optionalText(300)
        .default(
          "Project Overview",
        ),

    overview_content:
      optionalText(16000)
        .default(""),

    challenge_enabled:
      z.boolean()
        .default(true),

    challenge_heading:
      optionalText(300)
        .default(
          "The Challenge",
        ),

    challenge_content:
      optionalText(16000)
        .default(""),

    solution_enabled:
      z.boolean()
        .default(true),

    solution_heading:
      optionalText(300)
        .default(
          "Our Solution",
        ),

    solution_content:
      optionalText(16000)
        .default(""),

    work_completed_enabled:
      z.boolean()
        .default(true),

    work_completed_heading:
      optionalText(300)
        .default(
          "Work Completed",
        ),

    work_completed_content:
      optionalText(16000)
        .default(""),

    results_enabled:
      z.boolean()
        .default(true),

    results_heading:
      optionalText(300)
        .default(
          "Results and Outcomes",
        ),

    results_content:
      optionalText(16000)
        .default(""),

    facts_enabled:
      z.boolean()
        .default(true),

    facts_heading:
      optionalText(300)
        .default(
          "Project Facts",
        ),

    timeline_enabled:
      z.boolean()
        .default(false),

    timeline_heading:
      optionalText(300)
        .default(
          "Project Timeline",
        ),

    gallery_enabled:
      z.boolean()
        .default(true),

    gallery_heading:
      optionalText(300)
        .default(
          "Project Gallery",
        ),

    testimonial_enabled:
      z.boolean()
        .default(false),

    testimonial_heading:
      optionalText(300)
        .default(
          "Client Feedback",
        ),

    related_services_enabled:
      z.boolean()
        .default(false),

    related_services_heading:
      optionalText(300)
        .default(
          "Related Services",
        ),

    cta_enabled:
      z.boolean()
        .default(true),

    cta_heading:
      optionalText(300)
        .default(""),

    cta_description:
      optionalText(2500)
        .default(""),

    cta_button_text:
      optionalText(120)
        .default(
          "Contact Warm Life",
        ),

    cta_button_link:
      optionalText(500)
        .default("/contact"),

    cta_button_open_in_new_tab:
      z.boolean()
        .default(false),

    hero_heading_size:
      positiveSize(
        "Hero heading size",
        180,
      )
        .default(80),

    hero_heading_size_mobile:
      positiveSize(
        "Hero mobile heading size",
        120,
      )
        .default(44),

    section_heading_size:
      positiveSize(
        "Section heading size",
        120,
      )
        .default(50),

    section_heading_size_mobile:
      positiveSize(
        "Section mobile heading size",
        90,
      )
        .default(34),

    card_heading_size:
      positiveSize(
        "Card heading size",
        72,
      )
        .default(24),

    cta_heading_size:
      positiveSize(
        "CTA heading size",
        120,
      )
        .default(52),

    display_order:
      nonNegativeInteger
        .default(0),

    is_featured:
      z.boolean()
        .default(false),

    is_active:
      z.boolean()
        .default(true),

    is_published:
      z.boolean()
        .default(false),
  });

export const caseStudySchema =
  caseStudyBaseSchema
    .superRefine(
      (data, context) => {
        const hasFeaturedImage =
          Boolean(
            data.featured_image_url ||
            data.featured_image_storage_path,
          );

        if (!hasFeaturedImage) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "featured_image_url",
            ],
            message:
              "A featured image upload or image URL is required.",
          });
        }

        if (
          data.show_view_button &&
          !data.view_button_text.trim()
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "view_button_text",
            ],
            message:
              "View button text is required when the button is enabled.",
          });
        }

        if (
          data.has_detail_page &&
          !data.detail_hero_heading.trim()
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "detail_hero_heading",
            ],
            message:
              "Detail hero heading is required when the detail page is enabled.",
          });
        }

        if (
          data.has_detail_page &&
          data.detail_hero_type ===
            "image" &&
          !(
            data.detail_hero_image_url ||
            data.detail_hero_image_storage_path
          )
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "detail_hero_image_url",
            ],
            message:
              "A detail hero image upload or URL is required.",
          });
        }

        if (
          data.has_detail_page &&
          data.detail_hero_type ===
            "video" &&
          !(
            data.detail_hero_video_url ||
            data.detail_hero_video_storage_path
          )
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "detail_hero_video_url",
            ],
            message:
              "A detail hero video upload or URL is required.",
          });
        }

        if (
          data.overview_enabled &&
          !data.overview_content.trim()
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "overview_content",
            ],
            message:
              "Project overview content is required when the section is enabled.",
          });
        }

        if (
          data.challenge_enabled &&
          !data.challenge_content.trim()
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "challenge_content",
            ],
            message:
              "Challenge content is required when the section is enabled.",
          });
        }

        if (
          data.solution_enabled &&
          !data.solution_content.trim()
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "solution_content",
            ],
            message:
              "Solution content is required when the section is enabled.",
          });
        }

        if (
          data.results_enabled &&
          !data.results_content.trim()
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "results_content",
            ],
            message:
              "Results content is required when the section is enabled.",
          });
        }

        if (
          data.cta_enabled &&
          !data.cta_heading.trim()
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "cta_heading",
            ],
            message:
              "CTA heading is required when CTA is enabled.",
          });
        }

        if (
          data.cta_enabled &&
          !data.cta_button_text.trim()
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "cta_button_text",
            ],
            message:
              "CTA button text is required when CTA is enabled.",
          });
        }

        if (
          data.cta_enabled &&
          !data.cta_button_link.trim()
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "cta_button_link",
            ],
            message:
              "CTA button link is required when CTA is enabled.",
          });
        }
      },
    );

export const createCaseStudySchema =
  caseStudySchema;

export const updateCaseStudySchema =
  caseStudyBaseSchema.partial();

export const caseStudyFactSchema =
  z.object({
    case_study_id:
      z
        .string()
        .uuid(
          "A valid case study ID is required.",
        ),

    internal_name:
      optionalText(160)
        .default(""),

    label:
      requiredText(
        "Fact label",
        160,
      ),

    value:
      requiredText(
        "Fact value",
        500,
      ),

    icon_name:
      optionalText(120)
        .default("CircleDot"),

    display_order:
      nonNegativeInteger
        .default(0),

    is_active:
      z.boolean()
        .default(true),

    is_published:
      z.boolean()
        .default(true),
  });

export const createCaseStudyFactSchema =
  caseStudyFactSchema;

export const updateCaseStudyFactSchema =
  caseStudyFactSchema
    .omit({
      case_study_id: true,
    })
    .partial();

export const caseStudyTimelineItemSchema =
  z.object({
    case_study_id:
      z
        .string()
        .uuid(
          "A valid case study ID is required.",
        ),

    internal_name:
      optionalText(160)
        .default(""),

    step_number:
      optionalText(40)
        .default(""),

    title:
      requiredText(
        "Timeline title",
        240,
      ),

    description:
      optionalText(5000)
        .default(""),

    date_label:
      optionalText(120)
        .default(""),

    icon_name:
      optionalText(120)
        .default("CircleDot"),

    display_order:
      nonNegativeInteger
        .default(0),

    is_active:
      z.boolean()
        .default(true),

    is_published:
      z.boolean()
        .default(true),
  });

export const createCaseStudyTimelineItemSchema =
  caseStudyTimelineItemSchema;

export const updateCaseStudyTimelineItemSchema =
  caseStudyTimelineItemSchema
    .omit({
      case_study_id: true,
    })
    .partial();

const caseStudyGalleryItemBaseSchema =
  z.object({
    case_study_id:
      z
        .string()
        .uuid(
          "A valid case study ID is required.",
        ),

    internal_name:
      optionalText(160)
        .default(""),

    image_url:
      nullableOptionalText(1000),

    image_storage_path:
      nullableOptionalText(1000),

    image_alt:
      optionalText(300)
        .default(""),

    caption:
      optionalText(1200)
        .default(""),

    image_type:
      caseStudyGalleryImageTypeSchema
        .default("standard"),

    pair_key:
      optionalText(160)
        .default(""),

    display_order:
      nonNegativeInteger
        .default(0),

    is_active:
      z.boolean()
        .default(true),

    is_published:
      z.boolean()
        .default(true),
  });

export const caseStudyGalleryItemSchema =
  caseStudyGalleryItemBaseSchema
    .superRefine(
      (data, context) => {
        if (
          !data.image_url &&
          !data.image_storage_path
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "image_url",
            ],
            message:
              "A gallery image upload or image URL is required.",
          });
        }

        if (
          (
            data.image_type ===
              "before" ||
            data.image_type ===
              "after"
          ) &&
          !data.pair_key.trim()
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "pair_key",
            ],
            message:
              "A pair key is required for before and after images.",
          });
        }
      },
    );

export const createCaseStudyGalleryItemSchema =
  caseStudyGalleryItemSchema;

export const updateCaseStudyGalleryItemSchema =
  caseStudyGalleryItemBaseSchema
    .omit({
      case_study_id: true,
    })
    .partial();

export const caseStudyTestimonialSchema =
  z.object({
    case_study_id:
      z
        .string()
        .uuid(
          "A valid case study ID is required.",
        ),

    client_name:
      optionalText(200)
        .default(""),

    client_role:
      optionalText(200)
        .default(""),

    client_company:
      optionalText(240)
        .default(""),

    quote:
      requiredText(
        "Testimonial quote",
        5000,
      ),

    image_url:
      nullableOptionalText(1000),

    image_storage_path:
      nullableOptionalText(1000),

    image_alt:
      optionalText(300)
        .default(""),

    rating:
      z
        .number()
        .int()
        .min(1)
        .max(5)
        .default(5),

    display_order:
      nonNegativeInteger
        .default(0),

    is_active:
      z.boolean()
        .default(true),

    is_published:
      z.boolean()
        .default(true),
  });

export const createCaseStudyTestimonialSchema =
  caseStudyTestimonialSchema;

export const updateCaseStudyTestimonialSchema =
  caseStudyTestimonialSchema
    .omit({
      case_study_id: true,
    })
    .partial();

export const caseStudyRelatedServiceSchema =
  z.object({
    case_study_id:
      z
        .string()
        .uuid(
          "A valid case study ID is required.",
        ),

    service_id:
      z
        .string()
        .uuid(
          "A valid service ID is required.",
        ),

    display_order:
      nonNegativeInteger
        .default(0),
  });

export type CaseStudyInput =
  z.infer<
    typeof caseStudySchema
  >;

export type CaseStudyFactInput =
  z.infer<
    typeof caseStudyFactSchema
  >;

export type CaseStudyTimelineItemInput =
  z.infer<
    typeof caseStudyTimelineItemSchema
  >;

export type CaseStudyGalleryItemInput =
  z.infer<
    typeof caseStudyGalleryItemSchema
  >;

export type CaseStudyTestimonialInput =
  z.infer<
    typeof caseStudyTestimonialSchema
  >;

export type CaseStudyRelatedServiceInput =
  z.infer<
    typeof caseStudyRelatedServiceSchema
  >;