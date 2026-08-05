/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/lib/types/services-page.ts
 *
 * Purpose :
 * Defines TypeScript types for the independent Services page
 * CMS, including page settings, hero slides, service cards and
 * optional dynamic service detail pages.
 *
 * Version : v1.3.0
 * ============================================================
 */

export type ServicesHeroType =
  | "image"
  | "video"
  | "slider";

export type ServicesHeroMediaType =
  | "image"
  | "video";

export type ServicesContentAlignment =
  | "left"
  | "center"
  | "right";

export type ServicesVerticalAlignment =
  | "top"
  | "center"
  | "bottom";

export type ServicesHeroNavigationStyle =
  | "none"
  | "arrows"
  | "both";

export type ServicesHeroPaginationStyle =
  | "none"
  | "dots"
  | "numbers";

export type ServiceDetailHeroType =
  | "image"
  | "video";

export interface ServicesPageSettings {
  id: string;

  internal_name: string;

  hero_type: ServicesHeroType;

  hero_eyebrow: string;
  hero_heading: string;
  hero_description: string;

  hero_show_button: boolean;
  hero_button_text: string;
  hero_button_link: string;
  hero_button_open_in_new_tab: boolean;

  hero_show_breadcrumb: boolean;
  hero_breadcrumb_home_text: string;
  hero_breadcrumb_current_text: string;

  hero_show_scroll_indicator: boolean;
  hero_scroll_indicator_text: string;

  hero_content_alignment:
    ServicesContentAlignment;

  hero_vertical_alignment:
    ServicesVerticalAlignment;

  hero_content_max_width: number;
  hero_min_height: number;

  hero_padding_top: number;
  hero_padding_bottom: number;
  hero_padding_left: number;
  hero_padding_right: number;

  hero_background_color: string;

  hero_eyebrow_color: string;
  hero_eyebrow_size: number;
  hero_eyebrow_weight: number;
  hero_eyebrow_letter_spacing: number;

  hero_heading_color: string;
  hero_heading_size: number;
  hero_heading_weight: number;
  hero_heading_line_height: number;
  hero_heading_letter_spacing: number;

  hero_description_color: string;
  hero_description_size: number;
  hero_description_weight: number;
  hero_description_line_height: number;

  hero_button_text_color: string;
  hero_button_background_color: string;
  hero_button_border_color: string;

  hero_button_hover_text_color: string;
  hero_button_hover_background_color: string;
  hero_button_hover_border_color: string;

  hero_button_font_size: number;
  hero_button_font_weight: number;
  hero_button_padding_x: number;
  hero_button_padding_y: number;
  hero_button_radius: number;
  hero_button_gap: number;

  hero_overlay_color: string;
  hero_overlay_opacity: number;

  hero_autoplay: boolean;
  hero_loop: boolean;
  hero_muted: boolean;

  hero_autoplay_delay: number;
  hero_transition_speed: number;

  hero_navigation_style:
    ServicesHeroNavigationStyle;

  hero_pagination_style:
    ServicesHeroPaginationStyle;

  hero_pause_on_hover: boolean;

  services_section_enabled: boolean;

  services_eyebrow: string;
  services_heading: string;
  services_description: string;

  services_text_alignment:
    ServicesContentAlignment;

  services_background_color: string;

  services_eyebrow_color: string;
  services_eyebrow_size: number;
  services_eyebrow_weight: number;

  services_heading_color: string;
  services_heading_size: number;
  services_heading_weight: number;
  services_heading_line_height: number;

  services_text_color: string;
  services_description_size: number;
  services_description_weight: number;
  services_description_line_height: number;

  services_card_background_color: string;
  services_card_heading_color: string;
  services_card_text_color: string;

  services_card_radius: number;
  services_card_gap: number;
  services_card_padding: number;

  services_image_height: number;
  services_image_radius: number;

  services_columns: number;

  services_content_max_width: number;

  services_padding_top: number;
  services_padding_bottom: number;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface ServiceHeroSlide {
  id: string;

  services_page_id: string;

  internal_name: string;

  media_type: ServicesHeroMediaType;

  image_url: string | null;
  image_storage_path: string | null;
  image_alt: string;

  mobile_image_url: string | null;
  mobile_image_storage_path: string | null;
  mobile_image_alt: string;

  video_url: string | null;
  video_storage_path: string | null;

  poster_image_url: string | null;
  poster_image_storage_path: string | null;
  poster_image_alt: string;

  eyebrow: string;
  heading: string;
  description: string;

  show_button: boolean;
  button_text: string;
  button_link: string;
  button_open_in_new_tab: boolean;

  content_alignment:
    ServicesContentAlignment;

  vertical_alignment:
    ServicesVerticalAlignment;

  overlay_color: string;
  overlay_opacity: number;

  media_object_position: string;

  video_autoplay: boolean;
  video_loop: boolean;
  video_muted: boolean;
  video_controls: boolean;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;

  internal_name: string;

  service_name: string;
  slug: string;

  eyebrow: string;
  short_description: string;
  full_description: string;

  featured_image_url: string | null;
  featured_image_storage_path: string | null;
  featured_image_alt: string;

  icon_name: string;

  has_detail_page: boolean;
  show_explore_button: boolean;

  explore_button_text: string;
  custom_button_link: string | null;
  open_in_new_tab: boolean;

  card_background_color: string | null;
  card_heading_color: string | null;
  card_text_color: string | null;

  card_button_background_color:
    string | null;

  card_button_text_color:
    string | null;

  card_button_radius: number | null;

  detail_hero_type:
    ServiceDetailHeroType;

  detail_hero_image_url:
    string | null;

  detail_hero_image_storage_path:
    string | null;

  detail_hero_image_alt: string;

  detail_hero_video_url:
    string | null;

  detail_hero_video_storage_path:
    string | null;

  detail_hero_poster_url:
    string | null;

  detail_hero_poster_storage_path:
    string | null;

  detail_hero_poster_alt: string;

  detail_hero_eyebrow: string;
  detail_hero_heading: string;
  detail_hero_description: string;

  detail_hero_heading_size: number;
  detail_hero_heading_size_mobile: number;
  detail_section_heading_size: number;
  detail_section_heading_size_mobile: number;
  detail_card_heading_size: number;
  detail_cta_heading_size: number;

  who_is_it_for_enabled: boolean;
  who_is_it_for_heading: string;
  who_is_it_for_content: string;

  benefits_enabled: boolean;
  benefits_heading: string;

  process_enabled: boolean;
  process_heading: string;

  gallery_enabled: boolean;

  cta_enabled: boolean;
  cta_heading: string;
  cta_description: string;
  cta_button_text: string;
  cta_button_link: string;
  cta_button_open_in_new_tab: boolean;

  is_featured: boolean;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface ServiceBenefit {
  id: string;

  service_id: string;

  internal_name: string;

  title: string;
  description: string;

  icon_name: string;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface ServiceProcessStep {
  id: string;

  service_id: string;

  internal_name: string;

  step_number: string;
  title: string;
  description: string;

  icon_name: string;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface ServiceGalleryItem {
  id: string;

  service_id: string;

  internal_name: string;

  image_url: string | null;
  image_storage_path: string | null;
  image_alt: string;

  caption: string;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface ServiceDetailData {
  service: Service | null;
  benefits: ServiceBenefit[];
  processSteps: ServiceProcessStep[];
  galleryItems: ServiceGalleryItem[];
}


export interface ServicesPageData {
  settings: ServicesPageSettings | null;
  heroSlides: ServiceHeroSlide[];
  services: Service[];
}

export type UpdateServicesPageSettingsInput =
  Partial<
    Omit<
      ServicesPageSettings,
      "id" | "created_at" | "updated_at"
    >
  >;

export interface CreateServiceHeroSlideInput {
  internal_name: string;

  media_type: ServicesHeroMediaType;

  image_url?: string | null;
  image_storage_path?: string | null;
  image_alt?: string;

  mobile_image_url?: string | null;
  mobile_image_storage_path?: string | null;
  mobile_image_alt?: string;

  video_url?: string | null;
  video_storage_path?: string | null;

  poster_image_url?: string | null;
  poster_image_storage_path?: string | null;
  poster_image_alt?: string;

  eyebrow?: string;
  heading: string;
  description?: string;

  show_button?: boolean;
  button_text?: string;
  button_link?: string;
  button_open_in_new_tab?: boolean;

  content_alignment?:
    ServicesContentAlignment;

  vertical_alignment?:
    ServicesVerticalAlignment;

  overlay_color?: string;
  overlay_opacity?: number;

  media_object_position?: string;

  video_autoplay?: boolean;
  video_loop?: boolean;
  video_muted?: boolean;
  video_controls?: boolean;

  display_order?: number;

  is_active?: boolean;
  is_published?: boolean;
}

export type UpdateServiceHeroSlideInput =
  Partial<CreateServiceHeroSlideInput>;

export interface CreateServiceInput {
  internal_name: string;

  service_name: string;
  slug: string;

  eyebrow?: string;
  short_description?: string;
  full_description?: string;

  featured_image_url?: string | null;
  featured_image_storage_path?: string | null;
  featured_image_alt?: string;

  icon_name?: string;

  has_detail_page?: boolean;
  show_explore_button?: boolean;

  explore_button_text?: string;
  custom_button_link?: string | null;
  open_in_new_tab?: boolean;

  card_background_color?: string | null;
  card_heading_color?: string | null;
  card_text_color?: string | null;

  card_button_background_color?:
    string | null;

  card_button_text_color?:
    string | null;

  card_button_radius?: number | null;

  detail_hero_type?:
    ServiceDetailHeroType;

  detail_hero_image_url?:
    string | null;

  detail_hero_image_storage_path?:
    string | null;

  detail_hero_image_alt?: string;

  detail_hero_video_url?:
    string | null;

  detail_hero_video_storage_path?:
    string | null;

  detail_hero_poster_url?:
    string | null;

  detail_hero_poster_storage_path?:
    string | null;

  detail_hero_poster_alt?: string;

  detail_hero_eyebrow?: string;
  detail_hero_heading?: string;
  detail_hero_description?: string;

  detail_hero_heading_size?: number;
  detail_hero_heading_size_mobile?: number;
  detail_section_heading_size?: number;
  detail_section_heading_size_mobile?: number;
  detail_card_heading_size?: number;
  detail_cta_heading_size?: number;

  who_is_it_for_enabled?: boolean;
  who_is_it_for_heading?: string;
  who_is_it_for_content?: string;

  benefits_enabled?: boolean;
  benefits_heading?: string;

  process_enabled?: boolean;
  process_heading?: string;

  gallery_enabled?: boolean;

  cta_enabled?: boolean;
  cta_heading?: string;
  cta_description?: string;
  cta_button_text?: string;
  cta_button_link?: string;
  cta_button_open_in_new_tab?: boolean;

  is_featured?: boolean;

  display_order?: number;

  is_active?: boolean;
  is_published?: boolean;
}

export type UpdateServiceInput =
  Partial<CreateServiceInput>;


export interface CreateServiceBenefitInput {
  service_id: string;

  internal_name?: string;

  title: string;
  description?: string;

  icon_name?: string;

  display_order?: number;

  is_active?: boolean;
  is_published?: boolean;
}

export type UpdateServiceBenefitInput =
  Partial<
    Omit<
      CreateServiceBenefitInput,
      "service_id"
    >
  >;

export interface CreateServiceProcessStepInput {
  service_id: string;

  internal_name?: string;

  step_number?: string;
  title: string;
  description?: string;

  icon_name?: string;

  display_order?: number;

  is_active?: boolean;
  is_published?: boolean;
}

export type UpdateServiceProcessStepInput =
  Partial<
    Omit<
      CreateServiceProcessStepInput,
      "service_id"
    >
  >;

export interface CreateServiceGalleryItemInput {
  service_id: string;

  internal_name?: string;

  image_url?: string | null;
  image_storage_path?: string | null;
  image_alt?: string;

  caption?: string;

  display_order?: number;

  is_active?: boolean;
  is_published?: boolean;
}

export type UpdateServiceGalleryItemInput =
  Partial<
    Omit<
      CreateServiceGalleryItemInput,
      "service_id"
    >
  >;

export interface ServiceActionResult {
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
