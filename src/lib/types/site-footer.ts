export type FooterBackgroundType =
  | "solid"
  | "gradient"
  | "image";

export type FooterCopyrightAlignment =
  | "left"
  | "center"
  | "right";

export type FooterNavigationSection =
  | "quick_links"
  | "legal"
  | "resources"
  | "support";

export interface SiteFooterSettings {
  id: string;

  internal_name: string;

  show_logo: boolean;

  logo_url: string | null;
  logo_storage_path: string | null;
  logo_alt: string;
  logo_width: number;
  logo_height: number;

  company_name: string;

  show_description: boolean;
  company_description: string;

  background_type: FooterBackgroundType;
  background_color: string;

  gradient_start_color: string;
  gradient_end_color: string;
  gradient_direction: string;

  background_image_url: string | null;
  background_image_storage_path: string | null;
  background_image_alt: string;
  background_overlay_color: string;

  heading_color: string;
  heading_font_size: number;
  heading_font_weight: number;
  heading_letter_spacing: number;

  heading_bottom_spacing: number;

  text_color: string;
  text_font_size: number;
  text_font_weight: number;
  text_line_height: number;

  link_color: string;
  link_hover_color: string;
  link_font_size: number;
  link_font_weight: number;

  links_spacing: number;

  show_quick_links: boolean;
  quick_links_heading: string;

  show_services: boolean;
  services_heading: string;
  services_limit: number;
  services_show_view_all: boolean;
  services_view_all_text: string;
  services_view_all_link: string;

  show_legal_links: boolean;
  legal_links_heading: string;

  show_contact: boolean;
  contact_heading: string;

  show_social_icons: boolean;
  social_heading: string;

  social_icon_size: number;
  social_icon_color: string;
  social_icon_hover_color: string;
  social_icon_background_color: string;
  social_icon_hover_background_color: string;
  social_icon_radius: number;

  content_max_width: number;

  column_count: number;
  column_gap: number;
  row_gap: number;

  padding_top: number;
  padding_bottom: number;
  padding_left: number;
  padding_right: number;

  show_top_border: boolean;
  top_border_color: string;
  top_border_width: number;

  divider_color: string;

  show_copyright: boolean;
  copyright_text: string;
  copyright_color: string;
  copyright_font_size: number;
  copyright_alignment: FooterCopyrightAlignment;

  bottom_bar_padding_top: number;
  bottom_bar_padding_bottom: number;

  mobile_breakpoint: number;
  mobile_column_count: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface SiteFooterNavigationItem {
  id: string;

  footer_id: string;

  section_name: FooterNavigationSection;

  label: string;
  href: string;

  open_in_new_tab: boolean;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface SiteFooterContact {
  id: string;

  footer_id: string;

  phone_label: string;
  phone: string;
  phone_link: string;

  email_label: string;
  email: string;
  email_link: string;

  address_label: string;
  address: string;
  address_link: string | null;

  working_hours_label: string;
  working_hours: string;

  map_url: string | null;

  show_phone: boolean;
  show_email: boolean;
  show_address: boolean;
  show_working_hours: boolean;

  icon_color: string;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface SiteFooterSocialLink {
  id: string;

  footer_id: string;

  platform: string;
  label: string;
  url: string;
  icon_name: string;

  open_in_new_tab: boolean;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface FooterServiceLink {
  id: string;
  title: string;
  href: string;
  display_order: number;
}

export interface SiteFooterData {
  settings: SiteFooterSettings | null;
  navigation: SiteFooterNavigationItem[];
  contact: SiteFooterContact | null;
  socialLinks: SiteFooterSocialLink[];
  services: FooterServiceLink[];
}

export interface UpdateSiteFooterSettingsInput
  extends Partial<SiteFooterSettings> {}

export interface UpdateSiteFooterContactInput
  extends Partial<SiteFooterContact> {}

export interface CreateFooterNavigationItemInput {
  section_name: FooterNavigationSection;

  label: string;
  href: string;

  open_in_new_tab?: boolean;

  display_order?: number;

  is_active?: boolean;
  is_published?: boolean;
}

export interface UpdateFooterNavigationItemInput
  extends Partial<CreateFooterNavigationItemInput> {}

export interface CreateFooterSocialLinkInput {
  platform: string;
  label: string;
  url: string;
  icon_name: string;

  open_in_new_tab?: boolean;

  display_order?: number;

  is_active?: boolean;
  is_published?: boolean;
}

export interface UpdateFooterSocialLinkInput
  extends Partial<CreateFooterSocialLinkInput> {}

export interface ActionResult {
  success: boolean;
  errors: string[];
}