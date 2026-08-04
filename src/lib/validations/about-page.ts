/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : about-page.ts
 *
 * Purpose :
 * Provides Zod validation schemas for the About Us CMS,
 * including page settings, hero slides, departments and
 * team members.
 *
 * Version : v1.4.0
 * ============================================================
 */

import { z } from "zod";

const requiredText = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required.`);

const optionalText = z
  .string()
  .trim()
  .optional()
  .nullable();

const nullableUrl = z
  .union([
    z
      .string()
      .trim()
      .url("Please enter a valid URL."),
    z.literal(""),
    z.null(),
  ])
  .optional()
  .transform((value) => {
    if (!value) {
      return null;
    }

    return value;
  });

const optionalInternalLink = z
  .string()
  .trim()
  .max(500, "Link cannot exceed 500 characters.")
  .optional()
  .default("");

const colorValue = z
  .string()
  .trim()
  .min(1, "Colour value is required.")
  .max(100, "Colour value is too long.");

const nonNegativeNumber = z
  .number()
  .int("Value must be a whole number.")
  .min(0, "Value cannot be negative.");

const positiveNumber = z
  .number()
  .int("Value must be a whole number.")
  .min(1, "Value must be at least 1.");

const displayOrderSchema = z
  .number()
  .int("Display order must be a whole number.")
  .min(0, "Display order cannot be negative.");

export const aboutHeroTypeSchema = z.enum([
  "image",
  "video",
  "slider",
]);

export const aboutHeroMediaTypeSchema = z.enum([
  "image",
  "video",
]);

export const aboutHeroContentAlignmentSchema =
  z.enum([
    "left",
    "center",
    "right",
  ]);

export const aboutHeroVerticalAlignmentSchema =
  z.enum([
    "top",
    "center",
    "bottom",
  ]);

export const aboutHeroPaginationStyleSchema =
  z.enum([
    "none",
    "dots",
    "numbers",
  ]);

export const aboutHeroNavigationStyleSchema =
  z.enum([
    "none",
    "arrows",
    "both",
  ]);

export const aboutTeamCardStyleSchema =
  z.enum([
    "standard",
    "compact",
    "profile",
  ]);

export const updateAboutPageSettingsSchema =
  z.object({
    internal_name: requiredText(
      "Internal name",
    )
      .max(
        150,
        "Internal name cannot exceed 150 characters.",
      )
      .optional(),

    seo_title: requiredText("SEO title")
      .max(
        70,
        "SEO title should not exceed 70 characters.",
      )
      .optional(),

    seo_description: requiredText(
      "SEO description",
    )
      .max(
        180,
        "SEO description should not exceed 180 characters.",
      )
      .optional(),

    canonical_url: z
      .string()
      .trim()
      .max(
        500,
        "Canonical URL cannot exceed 500 characters.",
      )
      .nullable()
      .optional(),

    og_title: requiredText("OG title")
      .max(
        100,
        "OG title cannot exceed 100 characters.",
      )
      .optional(),

    og_description: requiredText(
      "OG description",
    )
      .max(
        250,
        "OG description cannot exceed 250 characters.",
      )
      .optional(),

    og_image_url: nullableUrl,

    og_image_storage_path: optionalText,

    og_image_alt: z
      .string()
      .trim()
      .max(
        250,
        "OG image alt text cannot exceed 250 characters.",
      )
      .optional(),

    hero_type: aboutHeroTypeSchema.optional(),

    hero_eyebrow: z
      .string()
      .trim()
      .max(
        100,
        "Hero eyebrow cannot exceed 100 characters.",
      )
      .optional(),

    hero_heading: requiredText(
      "Hero heading",
    )
      .max(
        180,
        "Hero heading cannot exceed 180 characters.",
      )
      .optional(),

    hero_description: z
      .string()
      .trim()
      .max(
        600,
        "Hero description cannot exceed 600 characters.",
      )
      .optional(),

    hero_show_button: z
      .boolean()
      .optional(),

    hero_button_text: z
      .string()
      .trim()
      .max(
        100,
        "Button text cannot exceed 100 characters.",
      )
      .optional(),

    hero_button_link:
      optionalInternalLink,

    hero_button_open_in_new_tab: z
      .boolean()
      .optional(),

    hero_show_breadcrumb: z
      .boolean()
      .optional(),

    hero_breadcrumb_home_text: z
      .string()
      .trim()
      .max(
        100,
        "Breadcrumb text cannot exceed 100 characters.",
      )
      .optional(),

    hero_breadcrumb_current_text: z
      .string()
      .trim()
      .max(
        100,
        "Breadcrumb text cannot exceed 100 characters.",
      )
      .optional(),

    hero_show_scroll_indicator: z
      .boolean()
      .optional(),

    hero_scroll_indicator_text: z
      .string()
      .trim()
      .max(
        100,
        "Scroll indicator text cannot exceed 100 characters.",
      )
      .optional(),

    hero_content_alignment:
      aboutHeroContentAlignmentSchema
        .optional(),

    hero_vertical_alignment:
      aboutHeroVerticalAlignmentSchema
        .optional(),

    hero_content_max_width:
      positiveNumber
        .max(
          2400,
          "Hero content width cannot exceed 2400 pixels.",
        )
        .optional(),

    hero_min_height:
      positiveNumber
        .max(
          1600,
          "Hero height cannot exceed 1600 pixels.",
        )
        .optional(),

    hero_padding_top:
      nonNegativeNumber
        .max(
          500,
          "Hero top padding cannot exceed 500 pixels.",
        )
        .optional(),

    hero_padding_bottom:
      nonNegativeNumber
        .max(
          500,
          "Hero bottom padding cannot exceed 500 pixels.",
        )
        .optional(),

    hero_padding_left:
      nonNegativeNumber
        .max(
          300,
          "Hero left padding cannot exceed 300 pixels.",
        )
        .optional(),

    hero_padding_right:
      nonNegativeNumber
        .max(
          300,
          "Hero right padding cannot exceed 300 pixels.",
        )
        .optional(),

    hero_background_color:
      colorValue.optional(),

    hero_heading_color:
      colorValue.optional(),

    hero_description_color:
      colorValue.optional(),

    hero_eyebrow_color:
      colorValue.optional(),

    hero_button_text_color:
      colorValue.optional(),

    hero_button_background_color:
      colorValue.optional(),

    hero_button_border_color:
      colorValue.optional(),

    hero_button_hover_text_color:
      colorValue.optional(),

    hero_button_hover_background_color:
      colorValue.optional(),

    hero_button_hover_border_color:
      colorValue.optional(),

    hero_button_radius:
      nonNegativeNumber
        .max(
          999,
          "Button radius cannot exceed 999 pixels.",
        )
        .optional(),

    hero_overlay_color:
      colorValue.optional(),

    hero_overlay_opacity:
      z
        .number()
        .int(
          "Overlay opacity must be a whole number.",
        )
        .min(
          0,
          "Overlay opacity cannot be below 0.",
        )
        .max(
          100,
          "Overlay opacity cannot exceed 100.",
        )
        .optional(),

    hero_autoplay: z
      .boolean()
      .optional(),

    hero_loop: z
      .boolean()
      .optional(),

    hero_muted: z
      .boolean()
      .optional(),

    hero_autoplay_delay:
      positiveNumber
        .min(
          1000,
          "Autoplay delay must be at least 1000 milliseconds.",
        )
        .max(
          30000,
          "Autoplay delay cannot exceed 30000 milliseconds.",
        )
        .optional(),

    hero_transition_speed:
      positiveNumber
        .min(
          100,
          "Transition speed must be at least 100 milliseconds.",
        )
        .max(
          5000,
          "Transition speed cannot exceed 5000 milliseconds.",
        )
        .optional(),

    hero_navigation_style:
      aboutHeroNavigationStyleSchema
        .optional(),

    hero_pagination_style:
      aboutHeroPaginationStyleSchema
        .optional(),

    hero_pause_on_hover: z
      .boolean()
      .optional(),

    hero_eyebrow_size:
      positiveNumber
        .max(
          200,
          "Hero eyebrow size cannot exceed 200 pixels.",
        )
        .optional(),

    hero_eyebrow_weight:
      positiveNumber
        .max(
          1000,
          "Hero eyebrow weight cannot exceed 1000.",
        )
        .optional(),

    hero_eyebrow_letter_spacing:
      z
        .number()
        .min(
          -20,
          "Hero eyebrow letter spacing cannot be below -20.",
        )
        .max(
          50,
          "Hero eyebrow letter spacing cannot exceed 50.",
        )
        .optional(),

    hero_heading_size:
      positiveNumber
        .max(
          240,
          "Hero heading size cannot exceed 240 pixels.",
        )
        .optional(),

    hero_heading_weight:
      positiveNumber
        .max(
          1000,
          "Hero heading weight cannot exceed 1000.",
        )
        .optional(),

    hero_heading_line_height:
      z
        .number()
        .min(
          0.5,
          "Hero heading line height cannot be below 0.5.",
        )
        .max(
          3,
          "Hero heading line height cannot exceed 3.",
        )
        .optional(),

    hero_heading_letter_spacing:
      z
        .number()
        .min(
          -20,
          "Hero heading letter spacing cannot be below -20.",
        )
        .max(
          50,
          "Hero heading letter spacing cannot exceed 50.",
        )
        .optional(),

    hero_description_size:
      positiveNumber
        .max(
          120,
          "Hero description size cannot exceed 120 pixels.",
        )
        .optional(),

    hero_description_weight:
      positiveNumber
        .max(
          1000,
          "Hero description weight cannot exceed 1000.",
        )
        .optional(),

    hero_description_line_height:
      z
        .number()
        .min(
          0.5,
          "Hero description line height cannot be below 0.5.",
        )
        .max(
          3,
          "Hero description line height cannot exceed 3.",
        )
        .optional(),

    hero_button_font_size:
      positiveNumber
        .max(
          80,
          "Hero button font size cannot exceed 80 pixels.",
        )
        .optional(),

    hero_button_font_weight:
      positiveNumber
        .max(
          1000,
          "Hero button font weight cannot exceed 1000.",
        )
        .optional(),

    hero_button_padding_x:
      nonNegativeNumber
        .max(
          200,
          "Hero button horizontal padding cannot exceed 200 pixels.",
        )
        .optional(),

    hero_button_padding_y:
      nonNegativeNumber
        .max(
          120,
          "Hero button vertical padding cannot exceed 120 pixels.",
        )
        .optional(),

    hero_button_gap:
      nonNegativeNumber
        .max(
          100,
          "Hero button gap cannot exceed 100 pixels.",
        )
        .optional(),

    hero_breadcrumb_size:
      positiveNumber
        .max(
          80,
          "Hero breadcrumb size cannot exceed 80 pixels.",
        )
        .optional(),

    hero_breadcrumb_weight:
      positiveNumber
        .max(
          1000,
          "Hero breadcrumb weight cannot exceed 1000.",
        )
        .optional(),

    hero_breadcrumb_color:
      colorValue.optional(),

    hero_scroll_indicator_size:
      positiveNumber
        .max(
          80,
          "Hero scroll indicator size cannot exceed 80 pixels.",
        )
        .optional(),

    hero_scroll_indicator_color:
      colorValue.optional(),

    company_section_enabled: z
      .boolean()
      .optional(),

    company_eyebrow: z
      .string()
      .trim()
      .max(
        100,
        "Company eyebrow cannot exceed 100 characters.",
      )
      .optional(),

    company_heading: requiredText(
      "Company heading",
    )
      .max(
        180,
        "Company heading cannot exceed 180 characters.",
      )
      .optional(),

    company_description: z
      .string()
      .trim()
      .max(
        3000,
        "Company description cannot exceed 3000 characters.",
      )
      .optional(),

    company_image_url: nullableUrl,

    company_image_storage_path:
      optionalText,

    company_image_alt: z
      .string()
      .trim()
      .max(
        250,
        "Company image alt text cannot exceed 250 characters.",
      )
      .optional(),

    company_image_position: z
      .enum([
        "left",
        "right",
      ])
      .optional(),

    company_background_color:
      colorValue.optional(),

    company_heading_color:
      colorValue.optional(),

    company_text_color:
      colorValue.optional(),

    company_content_max_width:
      positiveNumber
        .max(
          2400,
          "Company content width cannot exceed 2400 pixels.",
        )
        .optional(),

    company_padding_top:
      nonNegativeNumber
        .max(
          500,
          "Company top padding cannot exceed 500 pixels.",
        )
        .optional(),

    company_padding_bottom:
      nonNegativeNumber
        .max(
          500,
          "Company bottom padding cannot exceed 500 pixels.",
        )
        .optional(),

    company_eyebrow_color:
      colorValue.optional(),

    company_eyebrow_size:
      positiveNumber
        .max(
          200,
          "Company eyebrow size cannot exceed 200 pixels.",
        )
        .optional(),

    company_eyebrow_weight:
      positiveNumber
        .max(
          1000,
          "Company eyebrow weight cannot exceed 1000.",
        )
        .optional(),

    company_eyebrow_letter_spacing:
      z
        .number()
        .min(
          -20,
          "Company eyebrow letter spacing cannot be below -20.",
        )
        .max(
          50,
          "Company eyebrow letter spacing cannot exceed 50.",
        )
        .optional(),

    company_heading_size:
      positiveNumber
        .max(
          240,
          "Company heading size cannot exceed 240 pixels.",
        )
        .optional(),

    company_heading_weight:
      positiveNumber
        .max(
          1000,
          "Company heading weight cannot exceed 1000.",
        )
        .optional(),

    company_heading_line_height:
      z
        .number()
        .min(
          0.5,
          "Company heading line height cannot be below 0.5.",
        )
        .max(
          3,
          "Company heading line height cannot exceed 3.",
        )
        .optional(),

    company_description_size:
      positiveNumber
        .max(
          120,
          "Company description size cannot exceed 120 pixels.",
        )
        .optional(),

    company_description_weight:
      positiveNumber
        .max(
          1000,
          "Company description weight cannot exceed 1000.",
        )
        .optional(),

    company_description_line_height:
      z
        .number()
        .min(
          0.5,
          "Company description line height cannot be below 0.5.",
        )
        .max(
          3,
          "Company description line height cannot exceed 3.",
        )
        .optional(),

    company_content_gap:
      nonNegativeNumber
        .max(
          300,
          "Company content gap cannot exceed 300 pixels.",
        )
        .optional(),

    company_image_radius:
      nonNegativeNumber
        .max(
          999,
          "Company image radius cannot exceed 999 pixels.",
        )
        .optional(),

    company_image_height:
      positiveNumber
        .max(
          1600,
          "Company image height cannot exceed 1600 pixels.",
        )
        .optional(),

    company_image_object_position:
      z
        .string()
        .trim()
        .min(
          1,
          "Company image object position is required.",
        )
        .max(
          100,
          "Company image object position is too long.",
        )
        .optional(),

    company_text_alignment:
      z
        .enum([
          "left",
          "center",
          "right",
        ])
        .optional(),

    mission_vision_enabled: z
      .boolean()
      .optional(),

    mission_vision_eyebrow: z
      .string()
      .trim()
      .max(
        100,
        "Mission and vision eyebrow cannot exceed 100 characters.",
      )
      .optional(),

    mission_vision_heading:
      requiredText(
        "Mission and vision heading",
      )
        .max(
          180,
          "Mission and vision heading cannot exceed 180 characters.",
        )
        .optional(),

    mission_vision_description: z
      .string()
      .trim()
      .max(
        1000,
        "Mission and vision description cannot exceed 1000 characters.",
      )
      .optional(),

    mission_title: requiredText(
      "Mission title",
    )
      .max(
        120,
        "Mission title cannot exceed 120 characters.",
      )
      .optional(),

    mission_description: z
      .string()
      .trim()
      .max(
        1500,
        "Mission description cannot exceed 1500 characters.",
      )
      .optional(),

    mission_icon_name: z
      .string()
      .trim()
      .max(
        100,
        "Mission icon name cannot exceed 100 characters.",
      )
      .optional(),

    vision_title: requiredText(
      "Vision title",
    )
      .max(
        120,
        "Vision title cannot exceed 120 characters.",
      )
      .optional(),

    vision_description: z
      .string()
      .trim()
      .max(
        1500,
        "Vision description cannot exceed 1500 characters.",
      )
      .optional(),

    vision_icon_name: z
      .string()
      .trim()
      .max(
        100,
        "Vision icon name cannot exceed 100 characters.",
      )
      .optional(),

    mission_vision_background_color:
      colorValue.optional(),

    mission_vision_card_background_color:
      colorValue.optional(),

    mission_vision_heading_color:
      colorValue.optional(),

    mission_vision_text_color:
      colorValue.optional(),

    mission_vision_icon_color:
      colorValue.optional(),

    mission_vision_card_radius:
      nonNegativeNumber
        .max(
          100,
          "Card radius cannot exceed 100 pixels.",
        )
        .optional(),

    mission_vision_card_gap:
      nonNegativeNumber
        .max(
          200,
          "Card gap cannot exceed 200 pixels.",
        )
        .optional(),

    mission_vision_eyebrow_color:
      colorValue.optional(),

    mission_vision_eyebrow_size:
      positiveNumber
        .max(
          200,
          "Mission and vision eyebrow size cannot exceed 200 pixels.",
        )
        .optional(),

    mission_vision_eyebrow_weight:
      positiveNumber
        .max(
          1000,
          "Mission and vision eyebrow weight cannot exceed 1000.",
        )
        .optional(),

    mission_vision_section_heading_size:
      positiveNumber
        .max(
          240,
          "Mission and vision heading size cannot exceed 240 pixels.",
        )
        .optional(),

    mission_vision_section_heading_weight:
      positiveNumber
        .max(
          1000,
          "Mission and vision heading weight cannot exceed 1000.",
        )
        .optional(),

    mission_vision_section_heading_line_height:
      z
        .number()
        .min(
          0.5,
          "Mission and vision heading line height cannot be below 0.5.",
        )
        .max(
          3,
          "Mission and vision heading line height cannot exceed 3.",
        )
        .optional(),

    mission_vision_section_description_size:
      positiveNumber
        .max(
          120,
          "Mission and vision section description size cannot exceed 120 pixels.",
        )
        .optional(),

    mission_vision_section_description_weight:
      positiveNumber
        .max(
          1000,
          "Mission and vision section description weight cannot exceed 1000.",
        )
        .optional(),

    mission_vision_section_description_line_height:
      z
        .number()
        .min(
          0.5,
          "Mission and vision section description line height cannot be below 0.5.",
        )
        .max(
          3,
          "Mission and vision section description line height cannot exceed 3.",
        )
        .optional(),

    mission_vision_card_title_size:
      positiveNumber
        .max(
          160,
          "Mission and vision card title size cannot exceed 160 pixels.",
        )
        .optional(),

    mission_vision_card_title_weight:
      positiveNumber
        .max(
          1000,
          "Mission and vision card title weight cannot exceed 1000.",
        )
        .optional(),

    mission_vision_card_description_size:
      positiveNumber
        .max(
          100,
          "Mission and vision card description size cannot exceed 100 pixels.",
        )
        .optional(),

    mission_vision_card_description_weight:
      positiveNumber
        .max(
          1000,
          "Mission and vision card description weight cannot exceed 1000.",
        )
        .optional(),

    mission_vision_card_description_line_height:
      z
        .number()
        .min(
          0.5,
          "Mission and vision card description line height cannot be below 0.5.",
        )
        .max(
          3,
          "Mission and vision card description line height cannot exceed 3.",
        )
        .optional(),

    mission_vision_card_padding:
      nonNegativeNumber
        .max(
          200,
          "Mission and vision card padding cannot exceed 200 pixels.",
        )
        .optional(),

    mission_vision_icon_size:
      positiveNumber
        .max(
          120,
          "Mission and vision icon size cannot exceed 120 pixels.",
        )
        .optional(),

    mission_vision_icon_background_color:
      colorValue.optional(),

    mission_vision_icon_radius:
      nonNegativeNumber
        .max(
          999,
          "Mission and vision icon radius cannot exceed 999 pixels.",
        )
        .optional(),

    mission_vision_content_max_width:
      positiveNumber
        .max(
          2400,
          "Mission and vision content width cannot exceed 2400 pixels.",
        )
        .optional(),

    mission_vision_padding_top:
      nonNegativeNumber
        .max(
          500,
          "Mission and vision top padding cannot exceed 500 pixels.",
        )
        .optional(),

    mission_vision_padding_bottom:
      nonNegativeNumber
        .max(
          500,
          "Mission and vision bottom padding cannot exceed 500 pixels.",
        )
        .optional(),

    mission_vision_text_alignment:
      z
        .enum([
          "left",
          "center",
          "right",
        ])
        .optional(),

    team_section_enabled: z
      .boolean()
      .optional(),

    team_eyebrow: z
      .string()
      .trim()
      .max(
        100,
        "Team eyebrow cannot exceed 100 characters.",
      )
      .optional(),

    team_heading: requiredText(
      "Team heading",
    )
      .max(
        180,
        "Team heading cannot exceed 180 characters.",
      )
      .optional(),

    team_description: z
      .string()
      .trim()
      .max(
        1000,
        "Team description cannot exceed 1000 characters.",
      )
      .optional(),

    team_background_color:
      colorValue.optional(),

    team_heading_color:
      colorValue.optional(),

    team_text_color:
      colorValue.optional(),

    team_card_style:
      aboutTeamCardStyleSchema
        .optional(),

    team_card_background_color:
      colorValue.optional(),

    team_card_heading_color:
      colorValue.optional(),

    team_card_text_color:
      colorValue.optional(),

    team_card_radius:
      nonNegativeNumber
        .max(
          100,
          "Team card radius cannot exceed 100 pixels.",
        )
        .optional(),

    team_card_gap:
      nonNegativeNumber
        .max(
          200,
          "Team card gap cannot exceed 200 pixels.",
        )
        .optional(),

    team_image_radius:
      nonNegativeNumber
        .max(
          100,
          "Team image radius cannot exceed 100 pixels.",
        )
        .optional(),

    team_image_aspect_ratio: z
      .string()
      .trim()
      .min(
        1,
        "Team image aspect ratio is required.",
      )
      .max(
        30,
        "Team image aspect ratio is too long.",
      )
      .optional(),

    team_show_department_tabs: z
      .boolean()
      .optional(),

    team_show_member_bio: z
      .boolean()
      .optional(),

    team_show_member_email: z
      .boolean()
      .optional(),

    team_show_member_linkedin: z
      .boolean()
      .optional(),

    team_show_member_qualifications: z
      .boolean()
      .optional(),

    team_content_max_width:
      positiveNumber
        .max(
          2400,
          "Team content width cannot exceed 2400 pixels.",
        )
        .optional(),

    team_padding_top:
      nonNegativeNumber
        .max(
          500,
          "Team top padding cannot exceed 500 pixels.",
        )
        .optional(),

    team_padding_bottom:
      nonNegativeNumber
        .max(
          500,
          "Team bottom padding cannot exceed 500 pixels.",
        )
        .optional(),

    closing_section_enabled: z
      .boolean()
      .optional(),

    closing_text: z
      .string()
      .trim()
      .max(
        1500,
        "Closing statement cannot exceed 1500 characters.",
      )
      .optional(),

    closing_background_color:
      colorValue.optional(),

    closing_text_color:
      colorValue.optional(),

    closing_content_max_width:
      positiveNumber
        .max(
          2400,
          "Closing content width cannot exceed 2400 pixels.",
        )
        .optional(),

    closing_padding_top:
      nonNegativeNumber
        .max(
          500,
          "Closing top padding cannot exceed 500 pixels.",
        )
        .optional(),

    closing_padding_bottom:
      nonNegativeNumber
        .max(
          500,
          "Closing bottom padding cannot exceed 500 pixels.",
        )
        .optional(),

    display_order:
      displayOrderSchema.optional(),

    is_active: z
      .boolean()
      .optional(),

    is_published: z
      .boolean()
      .optional(),
  })
  .superRefine((data, context) => {
    if (
      data.hero_show_button &&
      !data.hero_button_text?.trim()
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["hero_button_text"],
        message:
          "Hero button text is required when the button is enabled.",
      });
    }

    if (
      data.hero_show_button &&
      !data.hero_button_link?.trim()
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["hero_button_link"],
        message:
          "Hero button link is required when the button is enabled.",
      });
    }
  });

export const createAboutHeroSlideSchema =
  z
    .object({
      internal_name: requiredText(
        "Internal name",
      ).max(
        150,
        "Internal name cannot exceed 150 characters.",
      ),

      media_type:
        aboutHeroMediaTypeSchema,

      image_url: nullableUrl,

      image_storage_path:
        optionalText,

      image_alt: z
        .string()
        .trim()
        .max(
          250,
          "Image alt text cannot exceed 250 characters.",
        )
        .optional()
        .default(""),

      video_url: nullableUrl,

      video_storage_path:
        optionalText,

      poster_image_url: nullableUrl,

      poster_image_storage_path:
        optionalText,

      poster_image_alt: z
        .string()
        .trim()
        .max(
          250,
          "Poster image alt text cannot exceed 250 characters.",
        )
        .optional()
        .default(""),

      mobile_image_url: nullableUrl,

      mobile_image_storage_path:
        optionalText,

      mobile_image_alt: z
        .string()
        .trim()
        .max(
          250,
          "Mobile image alt text cannot exceed 250 characters.",
        )
        .optional()
        .default(""),

      eyebrow: z
        .string()
        .trim()
        .max(
          100,
          "Eyebrow cannot exceed 100 characters.",
        )
        .optional()
        .default(""),

      heading: requiredText(
        "Heading",
      ).max(
        180,
        "Heading cannot exceed 180 characters.",
      ),

      description: z
        .string()
        .trim()
        .max(
          600,
          "Description cannot exceed 600 characters.",
        )
        .optional()
        .default(""),

      show_button: z
        .boolean()
        .optional()
        .default(false),

      button_text: z
        .string()
        .trim()
        .max(
          100,
          "Button text cannot exceed 100 characters.",
        )
        .optional()
        .default(""),

      button_link:
        optionalInternalLink,

      button_open_in_new_tab: z
        .boolean()
        .optional()
        .default(false),

      content_alignment:
        aboutHeroContentAlignmentSchema
          .optional()
          .default("left"),

      vertical_alignment:
        aboutHeroVerticalAlignmentSchema
          .optional()
          .default("center"),

      overlay_color:
        colorValue
          .optional()
          .default(
            "rgba(5,35,26,0.58)",
          ),

      overlay_opacity: z
        .number()
        .int(
          "Overlay opacity must be a whole number.",
        )
        .min(
          0,
          "Overlay opacity cannot be below 0.",
        )
        .max(
          100,
          "Overlay opacity cannot exceed 100.",
        )
        .optional()
        .default(58),

      eyebrow_color:
        colorValue
          .nullable()
          .optional(),

      eyebrow_size:
        positiveNumber
          .max(
            200,
            "Eyebrow size cannot exceed 200 pixels.",
          )
          .nullable()
          .optional(),

      eyebrow_weight:
        positiveNumber
          .max(
            1000,
            "Eyebrow weight cannot exceed 1000.",
          )
          .nullable()
          .optional(),

      heading_color:
        colorValue
          .nullable()
          .optional(),

      heading_size:
        positiveNumber
          .max(
            240,
            "Heading size cannot exceed 240 pixels.",
          )
          .nullable()
          .optional(),

      heading_weight:
        positiveNumber
          .max(
            1000,
            "Heading weight cannot exceed 1000.",
          )
          .nullable()
          .optional(),

      heading_line_height: z
        .number()
        .min(
          0.5,
          "Heading line height cannot be below 0.5.",
        )
        .max(
          3,
          "Heading line height cannot exceed 3.",
        )
        .nullable()
        .optional(),

      description_color:
        colorValue
          .nullable()
          .optional(),

      description_size:
        positiveNumber
          .max(
            120,
            "Description size cannot exceed 120 pixels.",
          )
          .nullable()
          .optional(),

      description_weight:
        positiveNumber
          .max(
            1000,
            "Description weight cannot exceed 1000.",
          )
          .nullable()
          .optional(),

      description_line_height: z
        .number()
        .min(
          0.5,
          "Description line height cannot be below 0.5.",
        )
        .max(
          3,
          "Description line height cannot exceed 3.",
        )
        .nullable()
        .optional(),

      button_text_color:
        colorValue
          .nullable()
          .optional(),

      button_background_color:
        colorValue
          .nullable()
          .optional(),

      button_border_color:
        colorValue
          .nullable()
          .optional(),

      button_hover_text_color:
        colorValue
          .nullable()
          .optional(),

      button_hover_background_color:
        colorValue
          .nullable()
          .optional(),

      button_hover_border_color:
        colorValue
          .nullable()
          .optional(),

      button_font_size:
        positiveNumber
          .max(
            80,
            "Button font size cannot exceed 80 pixels.",
          )
          .nullable()
          .optional(),

      button_font_weight:
        positiveNumber
          .max(
            1000,
            "Button font weight cannot exceed 1000.",
          )
          .nullable()
          .optional(),

      button_padding_x:
        nonNegativeNumber
          .max(
            200,
            "Button horizontal padding cannot exceed 200 pixels.",
          )
          .nullable()
          .optional(),

      button_padding_y:
        nonNegativeNumber
          .max(
            120,
            "Button vertical padding cannot exceed 120 pixels.",
          )
          .nullable()
          .optional(),

      button_radius:
        nonNegativeNumber
          .max(
            999,
            "Button radius cannot exceed 999 pixels.",
          )
          .nullable()
          .optional(),

      media_object_position: z
        .string()
        .trim()
        .min(
          1,
          "Media object position is required.",
        )
        .max(
          100,
          "Media object position is too long.",
        )
        .optional()
        .default("center"),

      video_autoplay: z
        .boolean()
        .optional()
        .default(true),

      video_loop: z
        .boolean()
        .optional()
        .default(true),

      video_muted: z
        .boolean()
        .optional()
        .default(true),

      video_controls: z
        .boolean()
        .optional()
        .default(false),

      display_order:
        displayOrderSchema
          .optional()
          .default(0),

      is_active: z
        .boolean()
        .optional()
        .default(true),

      is_published: z
        .boolean()
        .optional()
        .default(true),
    })
    .superRefine(
      (data, context) => {
        if (
          data.media_type === "image" &&
          !data.image_url &&
          !data.image_storage_path
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: ["image_url"],
            message:
              "An image is required for an image slide.",
          });
        }

        if (
          data.media_type === "video" &&
          !data.video_url &&
          !data.video_storage_path
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: ["video_url"],
            message:
              "A video is required for a video slide.",
          });
        }

        if (
          data.show_button &&
          !data.button_text.trim()
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: ["button_text"],
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
            path: ["button_link"],
            message:
              "Button link is required when the button is enabled.",
          });
        }
      },
    );

export const updateAboutHeroSlideSchema =
  z
    .object({
      internal_name: z
        .string()
        .trim()
        .min(
          1,
          "Internal name cannot be empty.",
        )
        .max(
          150,
          "Internal name cannot exceed 150 characters.",
        )
        .optional(),

      media_type:
        aboutHeroMediaTypeSchema
          .optional(),

      image_url: nullableUrl,

      image_storage_path:
        optionalText,

      image_alt: z
        .string()
        .trim()
        .max(
          250,
          "Image alt text cannot exceed 250 characters.",
        )
        .optional(),

      video_url: nullableUrl,

      video_storage_path:
        optionalText,

      poster_image_url:
        nullableUrl,

      poster_image_storage_path:
        optionalText,

      poster_image_alt: z
        .string()
        .trim()
        .max(
          250,
          "Poster image alt text cannot exceed 250 characters.",
        )
        .optional(),

      mobile_image_url:
        nullableUrl,

      mobile_image_storage_path:
        optionalText,

      mobile_image_alt: z
        .string()
        .trim()
        .max(
          250,
          "Mobile image alt text cannot exceed 250 characters.",
        )
        .optional(),

      eyebrow: z
        .string()
        .trim()
        .max(
          100,
          "Eyebrow cannot exceed 100 characters.",
        )
        .optional(),

      heading: z
        .string()
        .trim()
        .min(
          1,
          "Heading cannot be empty.",
        )
        .max(
          180,
          "Heading cannot exceed 180 characters.",
        )
        .optional(),

      description: z
        .string()
        .trim()
        .max(
          600,
          "Description cannot exceed 600 characters.",
        )
        .optional(),

      show_button: z
        .boolean()
        .optional(),

      button_text: z
        .string()
        .trim()
        .max(
          100,
          "Button text cannot exceed 100 characters.",
        )
        .optional(),

      button_link: z
        .string()
        .trim()
        .max(
          500,
          "Link cannot exceed 500 characters.",
        )
        .optional(),

      button_open_in_new_tab: z
        .boolean()
        .optional(),

      content_alignment:
        aboutHeroContentAlignmentSchema
          .optional(),

      vertical_alignment:
        aboutHeroVerticalAlignmentSchema
          .optional(),

      overlay_color:
        colorValue.optional(),

      overlay_opacity: z
        .number()
        .int(
          "Overlay opacity must be a whole number.",
        )
        .min(
          0,
          "Overlay opacity cannot be below 0.",
        )
        .max(
          100,
          "Overlay opacity cannot exceed 100.",
        )
        .optional(),

      eyebrow_color:
        colorValue
          .nullable()
          .optional(),

      eyebrow_size:
        positiveNumber
          .max(
            200,
            "Eyebrow size cannot exceed 200 pixels.",
          )
          .nullable()
          .optional(),

      eyebrow_weight:
        positiveNumber
          .max(
            1000,
            "Eyebrow weight cannot exceed 1000.",
          )
          .nullable()
          .optional(),

      heading_color:
        colorValue
          .nullable()
          .optional(),

      heading_size:
        positiveNumber
          .max(
            240,
            "Heading size cannot exceed 240 pixels.",
          )
          .nullable()
          .optional(),

      heading_weight:
        positiveNumber
          .max(
            1000,
            "Heading weight cannot exceed 1000.",
          )
          .nullable()
          .optional(),

      heading_line_height: z
        .number()
        .min(
          0.5,
          "Heading line height cannot be below 0.5.",
        )
        .max(
          3,
          "Heading line height cannot exceed 3.",
        )
        .nullable()
        .optional(),

      description_color:
        colorValue
          .nullable()
          .optional(),

      description_size:
        positiveNumber
          .max(
            120,
            "Description size cannot exceed 120 pixels.",
          )
          .nullable()
          .optional(),

      description_weight:
        positiveNumber
          .max(
            1000,
            "Description weight cannot exceed 1000.",
          )
          .nullable()
          .optional(),

      description_line_height: z
        .number()
        .min(
          0.5,
          "Description line height cannot be below 0.5.",
        )
        .max(
          3,
          "Description line height cannot exceed 3.",
        )
        .nullable()
        .optional(),

      button_text_color:
        colorValue
          .nullable()
          .optional(),

      button_background_color:
        colorValue
          .nullable()
          .optional(),

      button_border_color:
        colorValue
          .nullable()
          .optional(),

      button_hover_text_color:
        colorValue
          .nullable()
          .optional(),

      button_hover_background_color:
        colorValue
          .nullable()
          .optional(),

      button_hover_border_color:
        colorValue
          .nullable()
          .optional(),

      button_font_size:
        positiveNumber
          .max(
            80,
            "Button font size cannot exceed 80 pixels.",
          )
          .nullable()
          .optional(),

      button_font_weight:
        positiveNumber
          .max(
            1000,
            "Button font weight cannot exceed 1000.",
          )
          .nullable()
          .optional(),

      button_padding_x:
        nonNegativeNumber
          .max(
            200,
            "Button horizontal padding cannot exceed 200 pixels.",
          )
          .nullable()
          .optional(),

      button_padding_y:
        nonNegativeNumber
          .max(
            120,
            "Button vertical padding cannot exceed 120 pixels.",
          )
          .nullable()
          .optional(),

      button_radius:
        nonNegativeNumber
          .max(
            999,
            "Button radius cannot exceed 999 pixels.",
          )
          .nullable()
          .optional(),

      media_object_position: z
        .string()
        .trim()
        .min(
          1,
          "Media object position is required.",
        )
        .max(
          100,
          "Media object position is too long.",
        )
        .optional(),

      video_autoplay: z
        .boolean()
        .optional(),

      video_loop: z
        .boolean()
        .optional(),

      video_muted: z
        .boolean()
        .optional(),

      video_controls: z
        .boolean()
        .optional(),

      display_order:
        displayOrderSchema
          .optional(),

      is_active: z
        .boolean()
        .optional(),

      is_published: z
        .boolean()
        .optional(),
    })
    .superRefine(
      (data, context) => {
        if (
          data.show_button === true &&
          data.button_text !== undefined &&
          !data.button_text.trim()
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: ["button_text"],
            message:
              "Button text cannot be empty when the button is enabled.",
          });
        }

        if (
          data.show_button === true &&
          data.button_link !== undefined &&
          !data.button_link.trim()
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: ["button_link"],
            message:
              "Button link cannot be empty when the button is enabled.",
          });
        }
      },
    );

export const createAboutDepartmentSchema =
  z.object({
    name: requiredText(
      "Department name",
    ).max(
      120,
      "Department name cannot exceed 120 characters.",
    ),

    slug: requiredText(
      "Department slug",
    )
      .max(
        150,
        "Department slug cannot exceed 150 characters.",
      )
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain lowercase letters, numbers and hyphens only.",
      ),

    description: z
      .string()
      .trim()
      .max(
        600,
        "Department description cannot exceed 600 characters.",
      )
      .optional()
      .default(""),

    icon_name: z
      .string()
      .trim()
      .max(
        100,
        "Icon name cannot exceed 100 characters.",
      )
      .optional()
      .default("Users"),

    display_order:
      displayOrderSchema
        .optional()
        .default(0),

    is_active: z
      .boolean()
      .optional()
      .default(true),

    is_published: z
      .boolean()
      .optional()
      .default(true),
  });

export const updateAboutDepartmentSchema =
  createAboutDepartmentSchema
    .partial();

export const createAboutTeamMemberSchema =
  z.object({
    department_id: z
      .union([
        z
          .string()
          .uuid(
            "Please select a valid department.",
          ),
        z.literal(""),
        z.null(),
      ])
      .optional()
      .transform((value) => {
        if (!value) {
          return null;
        }

        return value;
      }),

    full_name: requiredText(
      "Full name",
    ).max(
      150,
      "Full name cannot exceed 150 characters.",
    ),

    job_title: requiredText(
      "Job title",
    ).max(
      150,
      "Job title cannot exceed 150 characters.",
    ),

    short_bio: z
      .string()
      .trim()
      .max(
        600,
        "Short biography cannot exceed 600 characters.",
      )
      .optional()
      .default(""),

    full_bio: z
      .string()
      .trim()
      .max(
        5000,
        "Full biography cannot exceed 5000 characters.",
      )
      .optional()
      .default(""),

    image_url: nullableUrl,

    image_storage_path:
      optionalText,

    image_alt: z
      .string()
      .trim()
      .max(
        250,
        "Image alt text cannot exceed 250 characters.",
      )
      .optional()
      .default(""),

    email: z
      .union([
        z
          .string()
          .trim()
          .email(
            "Please enter a valid email address.",
          ),
        z.literal(""),
        z.null(),
      ])
      .optional()
      .transform((value) => {
        if (!value) {
          return null;
        }

        return value;
      }),

    phone: z
      .string()
      .trim()
      .max(
        50,
        "Phone number cannot exceed 50 characters.",
      )
      .optional()
      .nullable()
      .transform((value) => {
        if (!value) {
          return null;
        }

        return value;
      }),

    linkedin_url: nullableUrl,

    qualifications: z
      .string()
      .trim()
      .max(
        1500,
        "Qualifications cannot exceed 1500 characters.",
      )
      .optional()
      .default(""),

    experience: z
      .string()
      .trim()
      .max(
        1500,
        "Experience cannot exceed 1500 characters.",
      )
      .optional()
      .default(""),

    featured: z
      .boolean()
      .optional()
      .default(false),

    display_order:
      displayOrderSchema
        .optional()
        .default(0),

    is_active: z
      .boolean()
      .optional()
      .default(true),

    is_published: z
      .boolean()
      .optional()
      .default(true),
  });

export const updateAboutTeamMemberSchema =
  createAboutTeamMemberSchema
    .partial();

export const aboutEntityIdSchema = z
  .string()
  .uuid(
    "A valid record ID is required.",
  );

export type UpdateAboutPageSettingsValues =
  z.infer<
    typeof updateAboutPageSettingsSchema
  >;

export type CreateAboutHeroSlideValues =
  z.infer<
    typeof createAboutHeroSlideSchema
  >;

export type UpdateAboutHeroSlideValues =
  z.infer<
    typeof updateAboutHeroSlideSchema
  >;

export type CreateAboutDepartmentValues =
  z.infer<
    typeof createAboutDepartmentSchema
  >;

export type UpdateAboutDepartmentValues =
  z.infer<
    typeof updateAboutDepartmentSchema
  >;

export type CreateAboutTeamMemberValues =
  z.infer<
    typeof createAboutTeamMemberSchema
  >;

export type UpdateAboutTeamMemberValues =
  z.infer<
    typeof updateAboutTeamMemberSchema
  >;