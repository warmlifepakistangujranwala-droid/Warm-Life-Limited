/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/lib/validations/services-page.ts
 *
 * Purpose :
 * Defines Zod validation schemas for the independent Services
 * page CMS, hero slides, service cards and optional service
 * detail pages.
 *
 * Version : v1.2.0
 * ============================================================
 */

import { z } from "zod";

/* ============================================================
 * SHARED VALIDATION HELPERS
 * ============================================================
 */

const trimmedString = z
  .string()
  .transform((value) => value.trim());

const requiredText = (
  fieldName: string,
  maxLength = 500,
) =>
  trimmedString
    .pipe(
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
  maxLength = 2000,
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
  maxLength = 2000,
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

const positiveNumber = z
  .number()
  .finite()
  .positive();

const nonNegativeNumber = z
  .number()
  .finite()
  .min(0);

const fontWeight = z
  .number()
  .int()
  .min(100)
  .max(1000);

const colorValue = z
  .string()
  .trim()
  .min(1, "Colour value is required.")
  .max(100, "Colour value is too long.");

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

/* ============================================================
 * ENUMS
 * ============================================================
 */

export const servicesHeroTypeSchema =
  z.enum([
    "image",
    "video",
    "slider",
  ]);

export const servicesHeroMediaTypeSchema =
  z.enum([
    "image",
    "video",
  ]);

export const servicesContentAlignmentSchema =
  z.enum([
    "left",
    "center",
    "right",
  ]);

export const servicesVerticalAlignmentSchema =
  z.enum([
    "top",
    "center",
    "bottom",
  ]);

export const servicesHeroNavigationStyleSchema =
  z.enum([
    "none",
    "arrows",
    "both",
  ]);

export const servicesHeroPaginationStyleSchema =
  z.enum([
    "none",
    "dots",
    "numbers",
  ]);

export const serviceDetailHeroTypeSchema =
  z.enum([
    "image",
    "video",
  ]);

/* ============================================================
 * SERVICES PAGE SETTINGS
 * ============================================================
 */

const servicesPageSettingsBaseSchema =
  z
    .object({
      internal_name:
        requiredText(
          "Internal name",
          160,
        ),

      hero_type:
        servicesHeroTypeSchema,

      hero_eyebrow:
        optionalText(200)
          .default(""),

      hero_heading:
        requiredText(
          "Hero heading",
          300,
        ),

      hero_description:
        optionalText(2000)
          .default(""),

      hero_show_button:
        z.boolean(),

      hero_button_text:
        optionalText(120)
          .default(""),

      hero_button_link:
        z
          .string()
          .trim()
          .max(
            500,
            "Hero button link is too long.",
          ),

      hero_button_open_in_new_tab:
        z.boolean(),

      hero_show_breadcrumb:
        z.boolean(),

      hero_breadcrumb_home_text:
        optionalText(100)
          .default("Home"),

      hero_breadcrumb_current_text:
        optionalText(100)
          .default("Services"),

      hero_show_scroll_indicator:
        z.boolean(),

      hero_scroll_indicator_text:
        optionalText(120)
          .default(""),

      hero_content_alignment:
        servicesContentAlignmentSchema,

      hero_vertical_alignment:
        servicesVerticalAlignmentSchema,

      hero_content_max_width:
        positiveNumber
          .max(
            2400,
            "Hero content width cannot exceed 2400 pixels.",
          ),

      hero_min_height:
        positiveNumber
          .max(
            1600,
            "Hero height cannot exceed 1600 pixels.",
          ),

      hero_padding_top:
        nonNegativeNumber
          .max(
            600,
            "Hero top padding cannot exceed 600 pixels.",
          ),

      hero_padding_bottom:
        nonNegativeNumber
          .max(
            600,
            "Hero bottom padding cannot exceed 600 pixels.",
          ),

      hero_padding_left:
        nonNegativeNumber
          .max(
            400,
            "Hero left padding cannot exceed 400 pixels.",
          ),

      hero_padding_right:
        nonNegativeNumber
          .max(
            400,
            "Hero right padding cannot exceed 400 pixels.",
          ),

      hero_background_color:
        colorValue,

      hero_eyebrow_color:
        colorValue,

      hero_eyebrow_size:
        positiveNumber
          .max(
            120,
            "Hero eyebrow size cannot exceed 120 pixels.",
          ),

      hero_eyebrow_weight:
        fontWeight,

      hero_eyebrow_letter_spacing:
        z
          .number()
          .finite()
          .min(-20)
          .max(60),

      hero_heading_color:
        colorValue,

      hero_heading_size:
        positiveNumber
          .max(
            240,
            "Hero heading size cannot exceed 240 pixels.",
          ),

      hero_heading_weight:
        fontWeight,

      hero_heading_line_height:
        z
          .number()
          .finite()
          .min(0.5)
          .max(3),

      hero_heading_letter_spacing:
        z
          .number()
          .finite()
          .min(-30)
          .max(60),

      hero_description_color:
        colorValue,

      hero_description_size:
        positiveNumber
          .max(
            100,
            "Hero description size cannot exceed 100 pixels.",
          ),

      hero_description_weight:
        fontWeight,

      hero_description_line_height:
        z
          .number()
          .finite()
          .min(0.5)
          .max(3),

      hero_button_text_color:
        colorValue,

      hero_button_background_color:
        colorValue,

      hero_button_border_color:
        colorValue,

      hero_button_hover_text_color:
        colorValue,

      hero_button_hover_background_color:
        colorValue,

      hero_button_hover_border_color:
        colorValue,

      hero_button_font_size:
        positiveNumber
          .max(
            80,
            "Hero button font size cannot exceed 80 pixels.",
          ),

      hero_button_font_weight:
        fontWeight,

      hero_button_padding_x:
        nonNegativeNumber
          .max(
            200,
            "Hero button horizontal padding cannot exceed 200 pixels.",
          ),

      hero_button_padding_y:
        nonNegativeNumber
          .max(
            120,
            "Hero button vertical padding cannot exceed 120 pixels.",
          ),

      hero_button_radius:
        nonNegativeNumber
          .max(
            999,
            "Hero button radius cannot exceed 999 pixels.",
          ),

      hero_button_gap:
        nonNegativeNumber
          .max(
            100,
            "Hero button gap cannot exceed 100 pixels.",
          ),

      hero_overlay_color:
        colorValue,

      hero_overlay_opacity:
        z
          .number()
          .int()
          .min(0)
          .max(100),

      hero_autoplay:
        z.boolean(),

      hero_loop:
        z.boolean(),

      hero_muted:
        z.boolean(),

      hero_autoplay_delay:
        z
          .number()
          .int()
          .min(
            1000,
            "Hero autoplay delay must be at least 1000 milliseconds.",
          )
          .max(
            120000,
            "Hero autoplay delay cannot exceed 120 seconds.",
          ),

      hero_transition_speed:
        z
          .number()
          .int()
          .min(
            100,
            "Hero transition speed must be at least 100 milliseconds.",
          )
          .max(
            10000,
            "Hero transition speed cannot exceed 10 seconds.",
          ),

      hero_navigation_style:
        servicesHeroNavigationStyleSchema,

      hero_pagination_style:
        servicesHeroPaginationStyleSchema,

      hero_pause_on_hover:
        z.boolean(),

      services_section_enabled:
        z.boolean(),

      services_eyebrow:
        optionalText(200)
          .default(""),

      services_heading:
        requiredText(
          "Services heading",
          300,
        ),

      services_description:
        optionalText(2000)
          .default(""),

      services_text_alignment:
        servicesContentAlignmentSchema,

      services_background_color:
        colorValue,

      services_eyebrow_color:
        colorValue,

      services_eyebrow_size:
        positiveNumber
          .max(
            120,
            "Services eyebrow size cannot exceed 120 pixels.",
          ),

      services_eyebrow_weight:
        fontWeight,

      services_heading_color:
        colorValue,

      services_heading_size:
        positiveNumber
          .max(
            200,
            "Services heading size cannot exceed 200 pixels.",
          ),

      services_heading_weight:
        fontWeight,

      services_heading_line_height:
        z
          .number()
          .finite()
          .min(0.5)
          .max(3),

      services_text_color:
        colorValue,

      services_description_size:
        positiveNumber
          .max(
            100,
            "Services description size cannot exceed 100 pixels.",
          ),

      services_description_weight:
        fontWeight,

      services_description_line_height:
        z
          .number()
          .finite()
          .min(0.5)
          .max(3),

      services_card_background_color:
        colorValue,

      services_card_heading_color:
        colorValue,

      services_card_text_color:
        colorValue,

      services_card_radius:
        nonNegativeNumber
          .max(
            200,
            "Service card radius cannot exceed 200 pixels.",
          ),

      services_card_gap:
        nonNegativeNumber
          .max(
            200,
            "Service card gap cannot exceed 200 pixels.",
          ),

      services_card_padding:
        nonNegativeNumber
          .max(
            200,
            "Service card padding cannot exceed 200 pixels.",
          ),

      services_image_height:
        positiveNumber
          .max(
            1200,
            "Service image height cannot exceed 1200 pixels.",
          ),

      services_image_radius:
        nonNegativeNumber
          .max(
            200,
            "Service image radius cannot exceed 200 pixels.",
          ),

      services_columns:
        z
          .number()
          .int()
          .min(1)
          .max(4),

      services_content_max_width:
        positiveNumber
          .max(
            2400,
            "Services content width cannot exceed 2400 pixels.",
          ),

      services_padding_top:
        nonNegativeNumber
          .max(
            600,
            "Services top padding cannot exceed 600 pixels.",
          ),

      services_padding_bottom:
        nonNegativeNumber
          .max(
            600,
            "Services bottom padding cannot exceed 600 pixels.",
          ),

      display_order:
        z
          .number()
          .int()
          .min(0),

      is_active:
        z.boolean(),

      is_published:
        z.boolean(),
    });

export const servicesPageSettingsSchema =
  servicesPageSettingsBaseSchema
    .superRefine((data, context) => {
      if (
        data.hero_show_button &&
        !data.hero_button_text.trim()
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "hero_button_text",
          ],
          message:
            "Hero button text is required when the button is enabled.",
        });
      }

      if (
        data.hero_show_button &&
        !data.hero_button_link.trim()
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "hero_button_link",
          ],
          message:
            "Hero button link is required when the button is enabled.",
        });
      }

      if (
        data.hero_show_scroll_indicator &&
        !data.hero_scroll_indicator_text.trim()
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "hero_scroll_indicator_text",
          ],
          message:
            "Scroll indicator text is required when the indicator is enabled.",
        });
      }
    });

export const updateServicesPageSettingsSchema =
  servicesPageSettingsBaseSchema.partial();

/* ============================================================
 * HERO SLIDES
 * ============================================================
 */

const serviceHeroSlideBaseSchema =
  z
    .object({
      internal_name:
        requiredText(
          "Internal name",
          160,
        ),

      media_type:
        servicesHeroMediaTypeSchema,

      image_url:
        nullableOptionalText(1000),

      image_storage_path:
        nullableOptionalText(1000),

      image_alt:
        optionalText(300)
          .default(""),

      mobile_image_url:
        nullableOptionalText(1000),

      mobile_image_storage_path:
        nullableOptionalText(1000),

      mobile_image_alt:
        optionalText(300)
          .default(""),

      video_url:
        nullableOptionalText(1000),

      video_storage_path:
        nullableOptionalText(1000),

      poster_image_url:
        nullableOptionalText(1000),

      poster_image_storage_path:
        nullableOptionalText(1000),

      poster_image_alt:
        optionalText(300)
          .default(""),

      eyebrow:
        optionalText(200)
          .default(""),

      heading:
        requiredText(
          "Hero slide heading",
          300,
        ),

      description:
        optionalText(2000)
          .default(""),

      show_button:
        z.boolean()
          .default(false),

      button_text:
        optionalText(120)
          .default(""),

      button_link:
        z
          .string()
          .trim()
          .max(
            500,
            "Button link is too long.",
          )
          .default(""),

      button_open_in_new_tab:
        z.boolean()
          .default(false),

      content_alignment:
        servicesContentAlignmentSchema
          .default("left"),

      vertical_alignment:
        servicesVerticalAlignmentSchema
          .default("center"),

      overlay_color:
        colorValue
          .default("#05231a"),

      overlay_opacity:
        z
          .number()
          .int()
          .min(0)
          .max(100)
          .default(58),

      media_object_position:
        optionalText(100)
          .default("center"),

      video_autoplay:
        z.boolean()
          .default(true),

      video_loop:
        z.boolean()
          .default(true),

      video_muted:
        z.boolean()
          .default(true),

      video_controls:
        z.boolean()
          .default(false),

      display_order:
        z
          .number()
          .int()
          .min(0)
          .default(0),

      is_active:
        z.boolean()
          .default(true),

      is_published:
        z.boolean()
          .default(false),
    });

export const serviceHeroSlideSchema =
  serviceHeroSlideBaseSchema
    .superRefine((data, context) => {
      const hasImage =
        Boolean(
          data.image_url ||
          data.image_storage_path,
        );

      const hasVideo =
        Boolean(
          data.video_url ||
          data.video_storage_path,
        );

      if (
        data.media_type === "image" &&
        !hasImage
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "image_url",
          ],
          message:
            "An image upload or image URL is required for an image slide.",
        });
      }

      if (
        data.media_type === "video" &&
        !hasVideo
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "video_url",
          ],
          message:
            "A video upload or video URL is required for a video slide.",
        });
      }

      if (
        data.show_button &&
        !data.button_text.trim()
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "button_text",
          ],
          message:
            "Button text is required when the button is enabled.",
        });
      }

      if (
        data.show_button &&
        !data.button_link.trim()
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "button_link",
          ],
          message:
            "Button link is required when the button is enabled.",
        });
      }
    });

export const createServiceHeroSlideSchema =
  serviceHeroSlideSchema;

export const updateServiceHeroSlideSchema =
  serviceHeroSlideBaseSchema.partial();

/* ============================================================
 * SERVICES
 * ============================================================
 */

const serviceBaseSchema =
  z
    .object({
      internal_name:
        requiredText(
          "Internal name",
          160,
        ),

      service_name:
        requiredText(
          "Service name",
          200,
        ),

      slug:
        slugSchema,

      eyebrow:
        optionalText(200)
          .default(""),

      short_description:
        optionalText(1200)
          .default(""),

      full_description:
        optionalText(20000)
          .default(""),

      featured_image_url:
        nullableOptionalText(1000),

      featured_image_storage_path:
        nullableOptionalText(1000),

      featured_image_alt:
        optionalText(300)
          .default(""),

      icon_name:
        optionalText(120)
          .default("Settings"),

      has_detail_page:
        z.boolean()
          .default(true),

      show_explore_button:
        z.boolean()
          .default(true),

      explore_button_text:
        optionalText(120)
          .default(
            "Explore Service",
          ),

      custom_button_link:
        optionalUrl,

      open_in_new_tab:
        z.boolean()
          .default(false),

      card_background_color:
        nullableOptionalText(100),

      card_heading_color:
        nullableOptionalText(100),

      card_text_color:
        nullableOptionalText(100),

      card_button_background_color:
        nullableOptionalText(100),

      card_button_text_color:
        nullableOptionalText(100),

      card_button_radius:
        z
          .number()
          .finite()
          .min(0)
          .max(999)
          .nullable()
          .optional(),

      detail_hero_type:
        serviceDetailHeroTypeSchema
          .default("image"),

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

      detail_hero_eyebrow:
        optionalText(200)
          .default(""),

      detail_hero_heading:
        optionalText(300)
          .default(""),

      detail_hero_description:
        optionalText(2000)
          .default(""),

      detail_hero_heading_size:
        positiveNumber.max(180).default(88),

      detail_hero_heading_size_mobile:
        positiveNumber.max(120).default(48),

      detail_section_heading_size:
        positiveNumber.max(120).default(54),

      detail_section_heading_size_mobile:
        positiveNumber.max(90).default(36),

      detail_card_heading_size:
        positiveNumber.max(72).default(24),

      detail_cta_heading_size:
        positiveNumber.max(120).default(58),

      who_is_it_for_enabled:
        z.boolean()
          .default(false),

      who_is_it_for_heading:
        optionalText(300)
          .default(
            "Who This Service Is For",
          ),

      who_is_it_for_content:
        optionalText(12000)
          .default(""),

      benefits_enabled:
        z.boolean()
          .default(false),

      benefits_heading:
        optionalText(300)
          .default(
            "Key Benefits",
          ),

      process_enabled:
        z.boolean()
          .default(false),

      process_heading:
        optionalText(300)
          .default(
            "How the Process Works",
          ),

      gallery_enabled:
        z.boolean()
          .default(false),

      cta_enabled:
        z.boolean()
          .default(false),

      cta_heading:
        optionalText(300)
          .default(""),

      cta_description:
        optionalText(2000)
          .default(""),

      cta_button_text:
        optionalText(120)
          .default(
            "Contact Warm Life",
          ),

      cta_button_link:
        z
          .string()
          .trim()
          .max(
            500,
            "CTA button link is too long.",
          )
          .default("/contact"),

      cta_button_open_in_new_tab:
        z.boolean()
          .default(false),

      is_featured:
        z.boolean()
          .default(false),

      display_order:
        z
          .number()
          .int()
          .min(0)
          .default(0),

      is_active:
        z.boolean()
          .default(true),

      is_published:
        z.boolean()
          .default(false),
    });

export const serviceSchema =
  serviceBaseSchema
    .superRefine((data, context) => {
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
        data.show_explore_button &&
        !data.explore_button_text.trim()
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "explore_button_text",
          ],
          message:
            "Explore button text is required when the button is enabled.",
        });
      }

      if (
        !data.has_detail_page &&
        data.show_explore_button &&
        !data.custom_button_link
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "custom_button_link",
          ],
          message:
            "A custom button link is required when no detailed service page is created.",
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
            "Detail hero heading is required when a detailed service page is enabled.",
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
            "A detail hero image upload or URL is required when the detailed page hero type is image.",
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
            "A detail hero video upload or URL is required when the detailed page hero type is video.",
        });
      }

      if (
        data.who_is_it_for_enabled &&
        !data.who_is_it_for_content.trim()
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "who_is_it_for_content",
          ],
          message:
            "Who this service is for content is required when the section is enabled.",
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
    });

export const createServiceSchema =
  serviceSchema;

export const updateServiceSchema =
  serviceBaseSchema.partial();

/* ============================================================
 * SERVICE BENEFITS
 * ============================================================
 */

export const serviceBenefitSchema =
  z.object({
    service_id:
      z
        .string()
        .uuid(
          "A valid service ID is required.",
        ),

    internal_name:
      optionalText(160)
        .default(""),

    title:
      requiredText(
        "Benefit title",
        240,
      ),

    description:
      optionalText(4000)
        .default(""),

    icon_name:
      optionalText(120)
        .default(
          "CheckCircle2",
        ),

    display_order:
      z
        .number()
        .int()
        .min(0)
        .default(0),

    is_active:
      z
        .boolean()
        .default(true),

    is_published:
      z
        .boolean()
        .default(true),
  });

export const createServiceBenefitSchema =
  serviceBenefitSchema;

export const updateServiceBenefitSchema =
  serviceBenefitSchema
    .omit({
      service_id: true,
    })
    .partial();

/* ============================================================
 * SERVICE PROCESS STEPS
 * ============================================================
 */

export const serviceProcessStepSchema =
  z.object({
    service_id:
      z
        .string()
        .uuid(
          "A valid service ID is required.",
        ),

    internal_name:
      optionalText(160)
        .default(""),

    step_number:
      optionalText(40)
        .default(""),

    title:
      requiredText(
        "Process step title",
        240,
      ),

    description:
      optionalText(4000)
        .default(""),

    icon_name:
      optionalText(120)
        .default("CircleDot"),

    display_order:
      z
        .number()
        .int()
        .min(0)
        .default(0),

    is_active:
      z
        .boolean()
        .default(true),

    is_published:
      z
        .boolean()
        .default(true),
  });

export const createServiceProcessStepSchema =
  serviceProcessStepSchema;

export const updateServiceProcessStepSchema =
  serviceProcessStepSchema
    .omit({
      service_id: true,
    })
    .partial();

/* ============================================================
 * SERVICE GALLERY
 * ============================================================
 */

const serviceGalleryItemBaseSchema =
  z
    .object({
      service_id:
        z
          .string()
          .uuid(
            "A valid service ID is required.",
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
        optionalText(1000)
          .default(""),

      display_order:
        z
          .number()
          .int()
          .min(0)
          .default(0),

      is_active:
        z
          .boolean()
          .default(true),

      is_published:
        z
          .boolean()
          .default(true),
    });

export const serviceGalleryItemSchema =
  serviceGalleryItemBaseSchema
    .superRefine((data, context) => {
      if (
        !data.image_url &&
        !data.image_storage_path
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: ["image_url"],
          message:
            "A gallery image upload or image URL is required.",
        });
      }
    });

export const createServiceGalleryItemSchema =
  serviceGalleryItemSchema;

export const updateServiceGalleryItemSchema =
  serviceGalleryItemBaseSchema
    .omit({
      service_id: true,
    })
    .partial();

/* ============================================================
 * INFERRED DETAIL CONTENT TYPES
 * ============================================================
 */

export type ServiceBenefitInput =
  z.infer<
    typeof serviceBenefitSchema
  >;

export type ServiceProcessStepInput =
  z.infer<
    typeof serviceProcessStepSchema
  >;

export type ServiceGalleryItemInput =
  z.infer<
    typeof serviceGalleryItemSchema
  >;

/* ============================================================
 * INFERRED TYPES
 * ============================================================
 */

export type ServicesPageSettingsInput =
  z.infer<
    typeof servicesPageSettingsSchema
  >;

export type ServiceHeroSlideInput =
  z.infer<
    typeof serviceHeroSlideSchema
  >;

export type ServiceInput =
  z.infer<
    typeof serviceSchema
  >;