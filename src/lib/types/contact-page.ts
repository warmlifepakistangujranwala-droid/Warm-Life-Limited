/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/lib/types/contact-page.ts
 *
 * Purpose :
 * Shared Contact Page CMS types.
 *
 * Version : v0.2.0
 * ============================================================
 */

export type ContactDetailType =
  | "phone"
  | "email"
  | "address"
  | "working_hours"
  | "whatsapp"
  | "custom";

export type ContactSubmissionStatus =
  | "new"
  | "read"
  | "replied"
  | "archived"
  | "spam";

/* ============================================================
CONTACT PAGE SETTINGS
============================================================ */

export interface ContactPageSettings {
  id: string;

  internal_name: string;

  /* ==========================================================
  HERO
  ========================================================== */

  hero_eyebrow: string;
  hero_heading: string;
  hero_description: string | null;

  hero_background_image_url: string | null;
  hero_background_image_storage_path: string | null;
  hero_background_image_alt: string | null;

  hero_overlay_opacity: number;
  hero_height: number;

  hero_heading_size: number;
  hero_heading_size_mobile: number;

  /* ==========================================================
  INTRODUCTION
  ========================================================== */

  intro_eyebrow: string | null;
  intro_heading: string;
  intro_description: string | null;

  intro_heading_size: number;
  intro_heading_size_mobile: number;

  /* ==========================================================
  CONTACT DETAILS
  ========================================================== */

  contact_details_enabled: boolean;

  contact_details_heading: string;
  contact_details_description: string | null;

  contact_details_heading_size: number;
  contact_details_heading_size_mobile: number;

  contact_card_value_size: number;
  contact_card_value_size_mobile: number;

  /* ==========================================================
  CONTACT FORM
  ========================================================== */

  form_enabled: boolean;

  form_eyebrow: string | null;
  form_heading: string;
  form_description: string | null;

  form_submit_button_text: string;
  form_success_message: string;

  form_heading_size: number;
  form_heading_size_mobile: number;

  /* ==========================================================
  MAP
  ========================================================== */

  map_enabled: boolean;

  map_eyebrow: string | null;
  map_heading: string;
  map_description: string | null;

  map_embed_url: string | null;

  map_heading_size: number;
  map_heading_size_mobile: number;

  /* ==========================================================
  CTA
  ========================================================== */

  cta_enabled: boolean;

  cta_eyebrow: string | null;
  cta_heading: string;
  cta_description: string | null;

  cta_heading_size: number;
  cta_heading_size_mobile: number;

  cta_primary_button_text: string;
  cta_primary_button_link: string;

  cta_secondary_button_text: string | null;
  cta_secondary_button_link: string | null;

  cta_background_image_url: string | null;
  cta_background_image_storage_path: string | null;
  cta_background_image_alt: string | null;

  /* ==========================================================
  SEO
  ========================================================== */

  seo_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;

  /* ==========================================================
  OPEN GRAPH
  ========================================================== */

  og_title: string | null;
  og_description: string | null;

  og_image_url: string | null;
  og_image_storage_path: string | null;
  og_image_alt: string | null;

  /* ==========================================================
  TWITTER / X
  ========================================================== */

  twitter_title: string | null;
  twitter_description: string | null;

  twitter_image_url: string | null;
  twitter_image_storage_path: string | null;

  /* ==========================================================
  SEARCH ENGINE VISIBILITY
  ========================================================== */

  no_index: boolean;
  no_follow: boolean;

  /* ==========================================================
  STATUS
  ========================================================== */

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

/* ============================================================
CONTACT DETAILS
============================================================ */

export interface ContactPageDetail {
  id: string;

  contact_page_id: string;

  internal_name: string | null;

  detail_type: ContactDetailType;

  icon_name: string | null;

  label: string;
  value: string;

  link: string | null;

  open_in_new_tab: boolean;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

/* ============================================================
ENQUIRY TYPES
============================================================ */

export interface ContactEnquiryType {
  id: string;

  contact_page_id: string;

  internal_name: string | null;

  label: string;
  value: string;

  description: string | null;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

/* ============================================================
CONTACT FORM SUBMISSIONS
============================================================ */

export interface ContactFormSubmission {
  id: string;

  contact_page_id: string | null;

  enquiry_type_id: string | null;

  enquiry_type_label: string | null;

  full_name: string;
  email: string;
  phone: string | null;

  subject: string | null;
  message: string;

  status: ContactSubmissionStatus;

  source_page: string | null;

  admin_notes: string | null;

  replied_at: string | null;

  created_at: string;
  updated_at: string;
}

/* ============================================================
SOCIAL LINKS
============================================================ */

export interface ContactPageSocialLink {
  id: string;

  contact_page_id: string;

  platform: string;

  label: string | null;
  icon_name: string | null;

  url: string;

  open_in_new_tab: boolean;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

/* ============================================================
INPUT TYPES
============================================================ */

export type UpdateContactPageSettingsInput =
  Partial<
    Omit<
      ContactPageSettings,
      | "id"
      | "created_at"
      | "updated_at"
    >
  >;

export type CreateContactPageDetailInput =
  Omit<
    ContactPageDetail,
    | "id"
    | "created_at"
    | "updated_at"
  >;

export type UpdateContactPageDetailInput =
  Partial<
    Omit<
      CreateContactPageDetailInput,
      "contact_page_id"
    >
  >;

export type CreateContactEnquiryTypeInput =
  Omit<
    ContactEnquiryType,
    | "id"
    | "created_at"
    | "updated_at"
  >;

export type UpdateContactEnquiryTypeInput =
  Partial<
    Omit<
      CreateContactEnquiryTypeInput,
      "contact_page_id"
    >
  >;

export type CreateContactPageSocialLinkInput =
  Omit<
    ContactPageSocialLink,
    | "id"
    | "created_at"
    | "updated_at"
  >;

export type UpdateContactPageSocialLinkInput =
  Partial<
    Omit<
      CreateContactPageSocialLinkInput,
      "contact_page_id"
    >
  >;

export type CreateContactSubmissionInput = {
  contact_page_id?: string | null;

  enquiry_type_id?: string | null;

  enquiry_type_label?: string | null;

  full_name: string;
  email: string;
  phone?: string | null;

  subject?: string | null;
  message: string;

  source_page?: string | null;
};

export type UpdateContactSubmissionInput =
  Partial<{
    status: ContactSubmissionStatus;

    admin_notes: string | null;

    replied_at: string | null;
  }>;

/* ============================================================
ACTION RESULTS
============================================================ */

export interface ContactActionResult<
  T = undefined,
> {
  success: boolean;

  message: string;

  data?: T;

  errors?: Record<
    string,
    string[] | undefined
  >;
}

/* ============================================================
COMPLETE PAGE DATA
============================================================ */

export interface ContactPageData {
  settings: ContactPageSettings | null;

  details: ContactPageDetail[];

  enquiryTypes: ContactEnquiryType[];

  socialLinks: ContactPageSocialLink[];
}