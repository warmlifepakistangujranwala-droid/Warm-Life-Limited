/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/lib/validations/contact-page.ts
 *
 * Purpose :
 * Contact Page CMS and public enquiry validation.
 *
 * Version : v0.2.0
 * ============================================================
 */

import {
  z,
} from "zod";


/* ============================================================
   HELPERS
   ============================================================ */

const nullableText =
  z
    .union([
      z.string(),
      z.null(),
      z.undefined(),
    ])
    .transform((value) => {
      if (
        typeof value !== "string"
      ) {
        return null;
      }

      const cleaned =
        value.trim();

      return cleaned || null;
    });


const optionalUrl =
  z
    .union([
      z.string().trim().url(),
      z.literal(""),
      z.null(),
      z.undefined(),
    ])
    .transform((value) => {
      if (
        !value ||
        value === ""
      ) {
        return null;
      }

      return value;
    });


const relativeOrAbsoluteUrl =
  z
    .string()
    .trim()
    .min(
      1,
      "Link is required.",
    )
    .refine(
      (value) =>
        value.startsWith("/") ||
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("tel:") ||
        value.startsWith("mailto:") ||
        value.startsWith("https://wa.me/"),
      {
        message:
          "Enter a valid page path or URL.",
      },
    );


/* ============================================================
   ENUMS
   ============================================================ */

export const contactDetailTypeSchema =
  z.enum([
    "phone",
    "email",
    "address",
    "working_hours",
    "whatsapp",
    "custom",
  ]);


export const contactSubmissionStatusSchema =
  z.enum([
    "new",
    "read",
    "replied",
    "archived",
    "spam",
  ]);


/* ============================================================
   CONTACT PAGE SETTINGS
   ============================================================ */

export const contactPageSettingsSchema =
  z.object({
    internal_name:
      z
        .string()
        .trim()
        .min(
          1,
          "Internal name is required.",
        )
        .max(250),

    /* ========================================================
       HERO
       ======================================================== */

    hero_eyebrow:
      z
        .string()
        .trim()
        .min(
          1,
          "Hero eyebrow is required.",
        )
        .max(200),

    hero_heading:
      z
        .string()
        .trim()
        .min(
          1,
          "Hero heading is required.",
        )
        .max(500),

    hero_description:
      nullableText,

    hero_background_image_url:
      optionalUrl,

    hero_background_image_storage_path:
      nullableText,

    hero_background_image_alt:
      nullableText,

    hero_overlay_opacity:
      z
        .number()
        .min(0)
        .max(1),

    hero_height:
      z
        .number()
        .int()
        .min(320)
        .max(1000),

    hero_heading_size:
      z
        .number()
        .int()
        .min(32)
        .max(180),

    hero_heading_size_mobile:
      z
        .number()
        .int()
        .min(26)
        .max(100),

    /* ========================================================
       INTRODUCTION
       ======================================================== */

    intro_eyebrow:
      nullableText,

    intro_heading:
      z
        .string()
        .trim()
        .min(
          1,
          "Introduction heading is required.",
        )
        .max(500),

    intro_description:
      nullableText,

    intro_heading_size:
      z
        .number()
        .int()
        .min(24)
        .max(120),

    intro_heading_size_mobile:
      z
        .number()
        .int()
        .min(22)
        .max(80),

    /* ========================================================
       CONTACT DETAILS
       ======================================================== */

    contact_details_enabled:
      z.boolean(),

    contact_details_heading:
      z
        .string()
        .trim()
        .min(
          1,
          "Contact details heading is required.",
        )
        .max(500),

    contact_details_description:
      nullableText,

    contact_details_heading_size:
      z
        .number()
        .int()
        .min(20)
        .max(80),

    contact_details_heading_size_mobile:
      z
        .number()
        .int()
        .min(18)
        .max(60),

    contact_card_value_size:
      z
        .number()
        .int()
        .min(10)
        .max(40),

    contact_card_value_size_mobile:
      z
        .number()
        .int()
        .min(10)
        .max(32),

    /* ========================================================
       FORM
       ======================================================== */

    form_enabled:
      z.boolean(),

    form_eyebrow:
      nullableText,

    form_heading:
      z
        .string()
        .trim()
        .min(
          1,
          "Form heading is required.",
        )
        .max(500),

    form_description:
      nullableText,

    form_submit_button_text:
      z
        .string()
        .trim()
        .min(
          1,
          "Submit button text is required.",
        )
        .max(150),

    form_success_message:
      z
        .string()
        .trim()
        .min(
          1,
          "Success message is required.",
        )
        .max(2000),

    form_heading_size:
      z
        .number()
        .int()
        .min(22)
        .max(90),

    form_heading_size_mobile:
      z
        .number()
        .int()
        .min(20)
        .max(70),

    /* ========================================================
       MAP
       ======================================================== */

    map_enabled:
      z.boolean(),

    map_eyebrow:
      nullableText,

    map_heading:
      z
        .string()
        .trim()
        .min(
          1,
          "Map heading is required.",
        )
        .max(500),

    map_description:
      nullableText,

    map_embed_url:
      optionalUrl,

    map_heading_size:
      z
        .number()
        .int()
        .min(24)
        .max(120),

    map_heading_size_mobile:
      z
        .number()
        .int()
        .min(22)
        .max(80),

    /* ========================================================
       CTA
       ======================================================== */

    cta_enabled:
      z.boolean(),

    cta_eyebrow:
      nullableText,

    cta_heading:
      z
        .string()
        .trim()
        .min(
          1,
          "CTA heading is required.",
        )
        .max(500),

    cta_description:
      nullableText,

    cta_heading_size:
      z
        .number()
        .int()
        .min(24)
        .max(120),

    cta_heading_size_mobile:
      z
        .number()
        .int()
        .min(22)
        .max(80),

    cta_primary_button_text:
      z
        .string()
        .trim()
        .min(
          1,
          "Primary button text is required.",
        )
        .max(150),

    cta_primary_button_link:
      relativeOrAbsoluteUrl,

    cta_secondary_button_text:
      nullableText,

    cta_secondary_button_link:
      z
        .union([
          relativeOrAbsoluteUrl,
          z.literal(""),
          z.null(),
          z.undefined(),
        ])
        .transform((value) => {
          if (
            !value ||
            value === ""
          ) {
            return null;
          }

          return value;
        }),

    cta_background_image_url:
      optionalUrl,

    cta_background_image_storage_path:
      nullableText,

    cta_background_image_alt:
      nullableText,

    /* ========================================================
       SEO
       ======================================================== */

    seo_title:
      nullableText,

    meta_description:
      nullableText,

    focus_keyword:
      nullableText,

    canonical_url:
      z
        .union([
          z.string().trim(),
          z.null(),
          z.undefined(),
        ])
        .transform((value) => {
          if (
            !value ||
            value === ""
          ) {
            return null;
          }

          return value;
        }),

    /* ========================================================
       OPEN GRAPH
       ======================================================== */

    og_title:
      nullableText,

    og_description:
      nullableText,

    og_image_url:
      optionalUrl,

    og_image_storage_path:
      nullableText,

    og_image_alt:
      nullableText,

    /* ========================================================
       TWITTER / X
       ======================================================== */

    twitter_title:
      nullableText,

    twitter_description:
      nullableText,

    twitter_image_url:
      optionalUrl,

    twitter_image_storage_path:
      nullableText,

    /* ========================================================
       VISIBILITY
       ======================================================== */

    no_index:
      z.boolean(),

    no_follow:
      z.boolean(),

    is_active:
      z.boolean(),

    is_published:
      z.boolean(),
  });


export const updateContactPageSettingsSchema =
  contactPageSettingsSchema.partial();


/* ============================================================
   CONTACT DETAILS
   ============================================================ */

export const createContactPageDetailSchema =
  z.object({
    contact_page_id:
      z
        .string()
        .uuid(
          "Invalid Contact Page ID.",
        ),

    internal_name:
      nullableText,

    detail_type:
      contactDetailTypeSchema,

    icon_name:
      nullableText,

    label:
      z
        .string()
        .trim()
        .min(
          1,
          "Label is required.",
        )
        .max(200),

    value:
      z
        .string()
        .trim()
        .min(
          1,
          "Value is required.",
        )
        .max(1000),

    link:
      nullableText,

    open_in_new_tab:
      z.boolean(),

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


export const updateContactPageDetailSchema =
  createContactPageDetailSchema
    .omit({
      contact_page_id: true,
    })
    .partial();


/* ============================================================
   ENQUIRY TYPES
   ============================================================ */

export const createContactEnquiryTypeSchema =
  z.object({
    contact_page_id:
      z
        .string()
        .uuid(
          "Invalid Contact Page ID.",
        ),

    internal_name:
      nullableText,

    label:
      z
        .string()
        .trim()
        .min(
          1,
          "Enquiry label is required.",
        )
        .max(200),

    value:
      z
        .string()
        .trim()
        .min(
          1,
          "Enquiry value is required.",
        )
        .max(200)
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Use lowercase letters, numbers and hyphens only.",
        ),

    description:
      nullableText,

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


export const updateContactEnquiryTypeSchema =
  createContactEnquiryTypeSchema
    .omit({
      contact_page_id: true,
    })
    .partial();


/* ============================================================
   SOCIAL LINKS
   ============================================================ */

export const createContactPageSocialLinkSchema =
  z.object({
    contact_page_id:
      z
        .string()
        .uuid(
          "Invalid Contact Page ID.",
        ),

    platform:
      z
        .string()
        .trim()
        .min(
          1,
          "Platform is required.",
        )
        .max(100),

    label:
      nullableText,

    icon_name:
      nullableText,

    url:
      z
        .string()
        .trim()
        .url(
          "Enter a valid social URL.",
        ),

    open_in_new_tab:
      z.boolean(),

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


export const updateContactPageSocialLinkSchema =
  createContactPageSocialLinkSchema
    .omit({
      contact_page_id: true,
    })
    .partial();


/* ============================================================
   PUBLIC CONTACT FORM
   ============================================================ */

export const createContactSubmissionSchema =
  z.object({
    contact_page_id:
      z
        .string()
        .uuid()
        .nullable()
        .optional(),

    enquiry_type_id:
      z
        .string()
        .uuid()
        .nullable()
        .optional(),

    enquiry_type_label:
      nullableText,

    full_name:
      z
        .string()
        .trim()
        .min(
          2,
          "Please enter your name.",
        )
        .max(
          150,
          "Name is too long.",
        ),

    email:
      z
        .string()
        .trim()
        .email(
          "Please enter a valid email address.",
        )
        .max(250),

    phone:
      z
        .union([
          z.string(),
          z.null(),
          z.undefined(),
        ])
        .transform((value) => {
          if (
            typeof value !==
            "string"
          ) {
            return null;
          }

          const cleaned =
            value.trim();

          return cleaned || null;
        })
        .refine(
          (value) =>
            !value ||
            /^[0-9+\-() ]{7,30}$/.test(
              value,
            ),
          {
            message:
              "Please enter a valid phone number.",
          },
        ),

    subject:
      z
        .union([
          z.string(),
          z.null(),
          z.undefined(),
        ])
        .transform((value) => {
          if (
            typeof value !==
            "string"
          ) {
            return null;
          }

          const cleaned =
            value.trim();

          return cleaned || null;
        }),

    message:
      z
        .string()
        .trim()
        .min(
          10,
          "Please provide a little more information.",
        )
        .max(
          5000,
          "Message is too long.",
        ),

    source_page:
      z
        .string()
        .trim()
        .max(500)
        .optional()
        .default(
          "/contact",
        ),
  });


/* ============================================================
   SUBMISSION ADMIN UPDATE
   ============================================================ */

export const updateContactSubmissionSchema =
  z.object({
    status:
      contactSubmissionStatusSchema
        .optional(),

    admin_notes:
      nullableText.optional(),

    replied_at:
      z
        .string()
        .datetime()
        .nullable()
        .optional(),
  });


/* ============================================================
   ID VALIDATION
   ============================================================ */

export const contactUuidSchema =
  z
    .string()
    .uuid(
      "Invalid ID.",
    );