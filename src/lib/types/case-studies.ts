/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/lib/types/case-studies.ts
 *
 * Purpose :
 * Defines TypeScript types for the Case Studies CMS,
 * including cards, dynamic detail pages, facts, timeline,
 * gallery, testimonials and related services.
 *
 * Version : v0.1.0
 * ============================================================
 */

export type CaseStudyHeroType =
  | "image"
  | "video";

export type CaseStudyGalleryImageType =
  | "standard"
  | "before"
  | "after";

export interface CaseStudy {
  id: string;

  internal_name: string;
  title: string;
  slug: string;

  eyebrow: string;
  short_description: string;
  full_description: string;

  client_name: string;
  organisation_name: string;
  location: string;
  property_type: string;
  service_category: string;
  completion_date: string | null;
  project_duration: string;

  featured_image_url: string | null;
  featured_image_storage_path: string | null;
  featured_image_alt: string;

  show_view_button: boolean;
  view_button_text: string;
  open_in_new_tab: boolean;

  has_detail_page: boolean;

  detail_hero_type: CaseStudyHeroType;

  detail_hero_eyebrow: string;
  detail_hero_heading: string;
  detail_hero_description: string;

  detail_hero_image_url: string | null;
  detail_hero_image_storage_path: string | null;
  detail_hero_image_alt: string;

  detail_hero_video_url: string | null;
  detail_hero_video_storage_path: string | null;

  detail_hero_poster_url: string | null;
  detail_hero_poster_storage_path: string | null;
  detail_hero_poster_alt: string;

  overview_enabled: boolean;
  overview_heading: string;
  overview_content: string;

  challenge_enabled: boolean;
  challenge_heading: string;
  challenge_content: string;

  solution_enabled: boolean;
  solution_heading: string;
  solution_content: string;

  work_completed_enabled: boolean;
  work_completed_heading: string;
  work_completed_content: string;

  results_enabled: boolean;
  results_heading: string;
  results_content: string;

  facts_enabled: boolean;
  facts_heading: string;

  timeline_enabled: boolean;
  timeline_heading: string;

  gallery_enabled: boolean;
  gallery_heading: string;

  testimonial_enabled: boolean;
  testimonial_heading: string;

  related_services_enabled: boolean;
  related_services_heading: string;

  cta_enabled: boolean;
  cta_heading: string;
  cta_description: string;
  cta_button_text: string;
  cta_button_link: string;
  cta_button_open_in_new_tab: boolean;

  hero_heading_size: number;
  hero_heading_size_mobile: number;
  section_heading_size: number;
  section_heading_size_mobile: number;
  card_heading_size: number;
  cta_heading_size: number;

  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface CaseStudyFact {
  id: string;
  case_study_id: string;

  internal_name: string;
  label: string;
  value: string;
  icon_name: string;

  display_order: number;
  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface CaseStudyTimelineItem {
  id: string;
  case_study_id: string;

  internal_name: string;
  step_number: string;
  title: string;
  description: string;
  date_label: string;
  icon_name: string;

  display_order: number;
  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface CaseStudyGalleryItem {
  id: string;
  case_study_id: string;

  internal_name: string;

  image_url: string | null;
  image_storage_path: string | null;
  image_alt: string;
  caption: string;

  image_type: CaseStudyGalleryImageType;
  pair_key: string;

  display_order: number;
  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface CaseStudyTestimonial {
  id: string;
  case_study_id: string;

  client_name: string;
  client_role: string;
  client_company: string;
  quote: string;

  image_url: string | null;
  image_storage_path: string | null;
  image_alt: string;

  rating: number;

  display_order: number;
  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface CaseStudyRelatedService {
  id: string;
  case_study_id: string;
  service_id: string;

  display_order: number;
  created_at: string;
}

export interface CaseStudyRelatedServiceWithService
  extends CaseStudyRelatedService {
  service: {
    id: string;
    service_name: string;
    slug: string;
    short_description: string;
    featured_image_url: string | null;
    featured_image_alt: string;
    show_explore_button: boolean;
    explore_button_text: string;
  } | null;
}

export interface CaseStudyDetailData {
  caseStudy: CaseStudy | null;
  facts: CaseStudyFact[];
  timeline: CaseStudyTimelineItem[];
  galleryItems: CaseStudyGalleryItem[];
  testimonials: CaseStudyTestimonial[];
  relatedServices: CaseStudyRelatedServiceWithService[];
}

export interface CaseStudiesPageData {
  caseStudies: CaseStudy[];
}

export interface CreateCaseStudyInput {
  internal_name: string;
  title: string;
  slug: string;

  eyebrow?: string;
  short_description?: string;
  full_description?: string;

  client_name?: string;
  organisation_name?: string;
  location?: string;
  property_type?: string;
  service_category?: string;
  completion_date?: string | null;
  project_duration?: string;

  featured_image_url?: string | null;
  featured_image_storage_path?: string | null;
  featured_image_alt?: string;

  show_view_button?: boolean;
  view_button_text?: string;
  open_in_new_tab?: boolean;

  has_detail_page?: boolean;

  detail_hero_type?: CaseStudyHeroType;

  detail_hero_eyebrow?: string;
  detail_hero_heading?: string;
  detail_hero_description?: string;

  detail_hero_image_url?: string | null;
  detail_hero_image_storage_path?: string | null;
  detail_hero_image_alt?: string;

  detail_hero_video_url?: string | null;
  detail_hero_video_storage_path?: string | null;

  detail_hero_poster_url?: string | null;
  detail_hero_poster_storage_path?: string | null;
  detail_hero_poster_alt?: string;

  overview_enabled?: boolean;
  overview_heading?: string;
  overview_content?: string;

  challenge_enabled?: boolean;
  challenge_heading?: string;
  challenge_content?: string;

  solution_enabled?: boolean;
  solution_heading?: string;
  solution_content?: string;

  work_completed_enabled?: boolean;
  work_completed_heading?: string;
  work_completed_content?: string;

  results_enabled?: boolean;
  results_heading?: string;
  results_content?: string;

  facts_enabled?: boolean;
  facts_heading?: string;

  timeline_enabled?: boolean;
  timeline_heading?: string;

  gallery_enabled?: boolean;
  gallery_heading?: string;

  testimonial_enabled?: boolean;
  testimonial_heading?: string;

  related_services_enabled?: boolean;
  related_services_heading?: string;

  cta_enabled?: boolean;
  cta_heading?: string;
  cta_description?: string;
  cta_button_text?: string;
  cta_button_link?: string;
  cta_button_open_in_new_tab?: boolean;

  hero_heading_size?: number;
  hero_heading_size_mobile?: number;
  section_heading_size?: number;
  section_heading_size_mobile?: number;
  card_heading_size?: number;
  cta_heading_size?: number;

  display_order?: number;
  is_featured?: boolean;
  is_active?: boolean;
  is_published?: boolean;
}

export type UpdateCaseStudyInput =
  Partial<CreateCaseStudyInput>;

export interface CreateCaseStudyFactInput {
  case_study_id: string;

  internal_name?: string;
  label: string;
  value: string;
  icon_name?: string;

  display_order?: number;
  is_active?: boolean;
  is_published?: boolean;
}

export type UpdateCaseStudyFactInput =
  Partial<
    Omit<
      CreateCaseStudyFactInput,
      "case_study_id"
    >
  >;

export interface CreateCaseStudyTimelineItemInput {
  case_study_id: string;

  internal_name?: string;
  step_number?: string;
  title: string;
  description?: string;
  date_label?: string;
  icon_name?: string;

  display_order?: number;
  is_active?: boolean;
  is_published?: boolean;
}

export type UpdateCaseStudyTimelineItemInput =
  Partial<
    Omit<
      CreateCaseStudyTimelineItemInput,
      "case_study_id"
    >
  >;

export interface CreateCaseStudyGalleryItemInput {
  case_study_id: string;

  internal_name?: string;

  image_url?: string | null;
  image_storage_path?: string | null;
  image_alt?: string;
  caption?: string;

  image_type?: CaseStudyGalleryImageType;
  pair_key?: string;

  display_order?: number;
  is_active?: boolean;
  is_published?: boolean;
}

export type UpdateCaseStudyGalleryItemInput =
  Partial<
    Omit<
      CreateCaseStudyGalleryItemInput,
      "case_study_id"
    >
  >;

export interface CreateCaseStudyTestimonialInput {
  case_study_id: string;

  client_name?: string;
  client_role?: string;
  client_company?: string;
  quote: string;

  image_url?: string | null;
  image_storage_path?: string | null;
  image_alt?: string;

  rating?: number;

  display_order?: number;
  is_active?: boolean;
  is_published?: boolean;
}

export type UpdateCaseStudyTestimonialInput =
  Partial<
    Omit<
      CreateCaseStudyTestimonialInput,
      "case_study_id"
    >
  >;

export interface CreateCaseStudyRelatedServiceInput {
  case_study_id: string;
  service_id: string;
  display_order?: number;
}

export interface CaseStudyActionResult {
  success: boolean;
  message: string;

  data?: {
    id?: string;
    slug?: string;
  };

  errors?: Record<
    string,
    string[] | undefined
  >;
}