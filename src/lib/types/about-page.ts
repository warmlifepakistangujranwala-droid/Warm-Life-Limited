/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/lib/types/about-page.ts
 *
 * Purpose :
 * Defines TypeScript types for the About Us page CMS,
 * including page settings, hero slides, departments,
 * team members, typography, media and layout controls.
 *
 * Version : v1.3.0
 * ============================================================
 */

export type AboutHeroType =
  | "image"
  | "video"
  | "slider";

export type AboutHeroMediaType =
  | "image"
  | "video";

export type AboutHeroContentAlignment =
  | "left"
  | "center"
  | "right";

export type AboutHeroVerticalAlignment =
  | "top"
  | "center"
  | "bottom";

export type AboutHeroPaginationStyle =
  | "none"
  | "dots"
  | "numbers";

export type AboutHeroNavigationStyle =
  | "none"
  | "arrows"
  | "both";

export type AboutTeamCardStyle =
  | "standard"
  | "compact"
  | "profile";

export type AboutTextAlignment =
  | "left"
  | "center"
  | "right";

export interface AboutPageSettings {
  id: string;
  internal_name: string;

  seo_title: string;
  seo_description: string;
  canonical_url: string | null;

  og_title: string;
  og_description: string;
  og_image_url: string | null;
  og_image_storage_path: string | null;
  og_image_alt: string;

  hero_type: AboutHeroType;

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
    AboutHeroContentAlignment;

  hero_vertical_alignment:
    AboutHeroVerticalAlignment;

  hero_content_max_width: number;
  hero_min_height: number;

  hero_padding_top: number;
  hero_padding_bottom: number;
  hero_padding_left: number;
  hero_padding_right: number;

  hero_background_color: string;

  hero_heading_color: string;
  hero_description_color: string;
  hero_eyebrow_color: string;

  hero_button_text_color: string;
  hero_button_background_color: string;
  hero_button_border_color: string;

  hero_button_hover_text_color: string;
  hero_button_hover_background_color: string;
  hero_button_hover_border_color: string;

  hero_button_radius: number;

  hero_overlay_color: string;
  hero_overlay_opacity: number;

  hero_autoplay: boolean;
  hero_loop: boolean;
  hero_muted: boolean;

  hero_autoplay_delay: number;
  hero_transition_speed: number;

  hero_navigation_style:
    AboutHeroNavigationStyle;

  hero_pagination_style:
    AboutHeroPaginationStyle;

  hero_pause_on_hover: boolean;

  hero_eyebrow_size: number;
  hero_eyebrow_weight: number;
  hero_eyebrow_letter_spacing: number;

  hero_heading_size: number;
  hero_heading_weight: number;
  hero_heading_line_height: number;
  hero_heading_letter_spacing: number;

  hero_description_size: number;
  hero_description_weight: number;
  hero_description_line_height: number;

  hero_button_font_size: number;
  hero_button_font_weight: number;
  hero_button_padding_x: number;
  hero_button_padding_y: number;
  hero_button_gap: number;

  hero_breadcrumb_size: number;
  hero_breadcrumb_weight: number;
  hero_breadcrumb_color: string;

  hero_scroll_indicator_size: number;
  hero_scroll_indicator_color: string;

  company_section_enabled: boolean;

  company_eyebrow: string;
  company_heading: string;
  company_description: string;

  company_image_url: string | null;
  company_image_storage_path: string | null;
  company_image_alt: string;

  company_image_position:
    | "left"
    | "right";

  company_background_color: string;
  company_heading_color: string;
  company_text_color: string;

  company_content_max_width: number;
  company_padding_top: number;
  company_padding_bottom: number;

  company_eyebrow_color: string;
  company_eyebrow_size: number;
  company_eyebrow_weight: number;
  company_eyebrow_letter_spacing: number;

  company_heading_size: number;
  company_heading_weight: number;
  company_heading_line_height: number;

  company_description_size: number;
  company_description_weight: number;
  company_description_line_height: number;

  company_content_gap: number;
  company_image_radius: number;
  company_image_height: number;
  company_image_object_position: string;
  company_text_alignment: AboutTextAlignment;

  mission_vision_enabled: boolean;

  mission_vision_eyebrow: string;
  mission_vision_heading: string;
  mission_vision_description: string;

  mission_title: string;
  mission_description: string;
  mission_icon_name: string;

  vision_title: string;
  vision_description: string;
  vision_icon_name: string;

  mission_vision_background_color: string;
  mission_vision_card_background_color: string;
  mission_vision_heading_color: string;
  mission_vision_text_color: string;
  mission_vision_icon_color: string;

  mission_vision_card_radius: number;
  mission_vision_card_gap: number;

  mission_vision_eyebrow_color: string;
  mission_vision_eyebrow_size: number;
  mission_vision_eyebrow_weight: number;

  mission_vision_section_heading_size: number;
  mission_vision_section_heading_weight: number;
  mission_vision_section_heading_line_height: number;

  mission_vision_section_description_size: number;
  mission_vision_section_description_weight: number;
  mission_vision_section_description_line_height: number;

  mission_vision_card_title_size: number;
  mission_vision_card_title_weight: number;

  mission_vision_card_description_size: number;
  mission_vision_card_description_weight: number;
  mission_vision_card_description_line_height: number;

  mission_vision_card_padding: number;
  mission_vision_icon_size: number;
  mission_vision_icon_background_color: string;
  mission_vision_icon_radius: number;

  mission_vision_content_max_width: number;
  mission_vision_padding_top: number;
  mission_vision_padding_bottom: number;
  mission_vision_text_alignment:
    AboutTextAlignment;

  team_section_enabled: boolean;

  team_eyebrow: string;
  team_heading: string;
  team_description: string;

  team_background_color: string;
  team_heading_color: string;
  team_text_color: string;

  team_card_style: AboutTeamCardStyle;
  team_card_background_color: string;
  team_card_heading_color: string;
  team_card_text_color: string;

  team_card_radius: number;
  team_card_gap: number;

  team_image_radius: number;
  team_image_aspect_ratio: string;

  team_show_department_tabs: boolean;
  team_show_member_bio: boolean;
  team_show_member_email: boolean;
  team_show_member_linkedin: boolean;
  team_show_member_qualifications: boolean;

  team_content_max_width: number;
  team_padding_top: number;
  team_padding_bottom: number;

  team_eyebrow_color: string;
  team_eyebrow_size: number;
  team_eyebrow_weight: number;

  team_heading_size: number;
  team_heading_weight: number;
  team_heading_line_height: number;

  team_description_size: number;
  team_description_weight: number;
  team_description_line_height: number;

  team_member_name_size: number;
  team_member_name_weight: number;

  team_member_job_title_size: number;
  team_member_job_title_weight: number;

  team_member_bio_size: number;
  team_member_bio_weight: number;
  team_member_bio_line_height: number;

  team_card_padding: number;
  team_columns: number;
  team_text_alignment: AboutTextAlignment;

  team_tab_text_color: string;
  team_tab_background_color: string;
  team_tab_active_text_color: string;
  team_tab_active_background_color: string;
  team_tab_font_size: number;
  team_tab_font_weight: number;
  team_tab_radius: number;
  team_tab_padding_x: number;
  team_tab_padding_y: number;

  closing_section_enabled: boolean;

  closing_text: string;
  closing_background_color: string;
  closing_text_color: string;

  closing_content_max_width: number;
  closing_padding_top: number;
  closing_padding_bottom: number;

  closing_text_size: number;
  closing_text_weight: number;
  closing_text_line_height: number;
  closing_text_alignment: AboutTextAlignment;

  content_max_width: number;
  section_padding_top: number;
  section_padding_bottom: number;
  mobile_breakpoint: number;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface AboutHeroSlide {
  id: string;
  about_page_id: string;

  internal_name: string;
  media_type: AboutHeroMediaType;

  image_url: string | null;
  image_storage_path: string | null;
  image_alt: string;

  video_url: string | null;
  video_storage_path: string | null;

  poster_image_url: string | null;
  poster_image_storage_path: string | null;
  poster_image_alt: string;

  mobile_image_url: string | null;
  mobile_image_storage_path: string | null;
  mobile_image_alt: string;

  eyebrow: string;
  heading: string;
  description: string;

  show_button: boolean;
  button_text: string;
  button_link: string;
  button_open_in_new_tab: boolean;

  content_alignment:
    AboutHeroContentAlignment;

  vertical_alignment:
    AboutHeroVerticalAlignment;

  overlay_color: string;
  overlay_opacity: number;

  eyebrow_color: string | null;
  eyebrow_size: number | null;
  eyebrow_weight: number | null;

  heading_color: string | null;
  heading_size: number | null;
  heading_weight: number | null;
  heading_line_height: number | null;

  description_color: string | null;
  description_size: number | null;
  description_weight: number | null;
  description_line_height: number | null;

  button_text_color: string | null;
  button_background_color: string | null;
  button_border_color: string | null;

  button_hover_text_color: string | null;
  button_hover_background_color: string | null;
  button_hover_border_color: string | null;

  button_font_size: number | null;
  button_font_weight: number | null;
  button_padding_x: number | null;
  button_padding_y: number | null;
  button_radius: number | null;

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

export interface AboutDepartment {
  id: string;
  about_page_id: string;

  name: string;
  slug: string;
  description: string;
  icon_name: string;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface AboutTeamMember {
  id: string;

  about_page_id: string;
  department_id: string | null;

  full_name: string;
  job_title: string;

  short_bio: string;
  full_bio: string;

  image_url: string | null;
  image_storage_path: string | null;
  image_alt: string;
  image_object_position: string;

  email: string | null;
  phone: string | null;
  linkedin_url: string | null;

  qualifications: string;
  experience: string;

  card_background_color: string | null;
  name_color: string | null;
  job_title_color: string | null;
  bio_color: string | null;

  featured: boolean;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface AboutTeamMemberWithDepartment
  extends AboutTeamMember {
  department: AboutDepartment | null;
}

export interface AboutPageData {
  settings: AboutPageSettings | null;
  heroSlides: AboutHeroSlide[];
  departments: AboutDepartment[];
  teamMembers: AboutTeamMemberWithDepartment[];
}

export type UpdateAboutPageSettingsInput =
  Partial<
    Omit<
      AboutPageSettings,
      "id" | "created_at" | "updated_at"
    >
  >;

export interface CreateAboutHeroSlideInput {
  internal_name: string;
  media_type: AboutHeroMediaType;

  image_url?: string | null;
  image_storage_path?: string | null;
  image_alt?: string;

  video_url?: string | null;
  video_storage_path?: string | null;

  poster_image_url?: string | null;
  poster_image_storage_path?: string | null;
  poster_image_alt?: string;

  mobile_image_url?: string | null;
  mobile_image_storage_path?: string | null;
  mobile_image_alt?: string;

  eyebrow?: string;
  heading: string;
  description?: string;

  show_button?: boolean;
  button_text?: string;
  button_link?: string;
  button_open_in_new_tab?: boolean;

  content_alignment?:
    AboutHeroContentAlignment;

  vertical_alignment?:
    AboutHeroVerticalAlignment;

  overlay_color?: string;
  overlay_opacity?: number;

  eyebrow_color?: string | null;
  eyebrow_size?: number | null;
  eyebrow_weight?: number | null;

  heading_color?: string | null;
  heading_size?: number | null;
  heading_weight?: number | null;
  heading_line_height?: number | null;

  description_color?: string | null;
  description_size?: number | null;
  description_weight?: number | null;
  description_line_height?: number | null;

  button_text_color?: string | null;
  button_background_color?: string | null;
  button_border_color?: string | null;

  button_hover_text_color?: string | null;
  button_hover_background_color?: string | null;
  button_hover_border_color?: string | null;

  button_font_size?: number | null;
  button_font_weight?: number | null;
  button_padding_x?: number | null;
  button_padding_y?: number | null;
  button_radius?: number | null;

  media_object_position?: string;

  video_autoplay?: boolean;
  video_loop?: boolean;
  video_muted?: boolean;
  video_controls?: boolean;

  display_order?: number;

  is_active?: boolean;
  is_published?: boolean;
}

export type UpdateAboutHeroSlideInput =
  Partial<CreateAboutHeroSlideInput>;

export interface CreateAboutDepartmentInput {
  name: string;
  slug: string;

  description?: string;
  icon_name?: string;

  display_order?: number;

  is_active?: boolean;
  is_published?: boolean;
}

export type UpdateAboutDepartmentInput =
  Partial<CreateAboutDepartmentInput>;

export interface CreateAboutTeamMemberInput {
  department_id?: string | null;

  full_name: string;
  job_title: string;

  short_bio?: string;
  full_bio?: string;

  image_url?: string | null;
  image_storage_path?: string | null;
  image_alt?: string;
  image_object_position?: string;

  email?: string | null;
  phone?: string | null;
  linkedin_url?: string | null;

  qualifications?: string;
  experience?: string;

  card_background_color?: string | null;
  name_color?: string | null;
  job_title_color?: string | null;
  bio_color?: string | null;

  featured?: boolean;

  display_order?: number;

  is_active?: boolean;
  is_published?: boolean;
}

export type UpdateAboutTeamMemberInput =
  Partial<CreateAboutTeamMemberInput>;

export interface ActionResult {
  success: boolean;
  errors: string[];
}