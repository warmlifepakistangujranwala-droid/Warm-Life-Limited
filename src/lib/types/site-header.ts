export type HeaderBackgroundType =
  | "solid"
  | "transparent"
  | "blur";

export type HeaderShadowStyle =
  | "none"
  | "soft"
  | "medium"
  | "strong";

export type NavigationItemType =
  | "link"
  | "button";

export interface SiteHeaderSettings {
  id: string;

  internal_name: string;

  logo_url: string | null;
  logo_storage_path: string | null;
  logo_alt: string;
  logo_width: number;
  logo_height: number;

  mobile_logo_url: string | null;
  mobile_logo_storage_path: string | null;
  mobile_logo_alt: string;
  mobile_logo_width: number;
  mobile_logo_height: number;

  header_background_type: HeaderBackgroundType;

  header_background_color: string;
  header_scrolled_background_color: string;

  header_text_color: string;
  header_hover_color: string;
  header_active_color: string;

  header_height: number;
  header_padding_x: number;
  content_max_width: number;

  nav_font_size: number;
  nav_font_weight: number;
  nav_letter_spacing: number;
  nav_item_gap: number;

  sticky_enabled: boolean;
  sticky_offset: number;

  show_border: boolean;
  border_color: string;
  border_width: number;

  shadow_style: HeaderShadowStyle;

  show_cta: boolean;

  cta_text: string;
  cta_link: string;
  cta_open_in_new_tab: boolean;

  cta_text_color: string;
  cta_background_color: string;
  cta_border_color: string;

  cta_hover_text_color: string;
  cta_hover_background_color: string;
  cta_hover_border_color: string;

  cta_radius: number;
  cta_padding_x: number;
  cta_padding_y: number;
  cta_font_size: number;
  cta_font_weight: number;

  mobile_breakpoint: number;

  mobile_menu_background_color: string;
  mobile_menu_text_color: string;
  mobile_menu_hover_color: string;
  mobile_menu_overlay_color: string;

  mobile_menu_width: number;
  mobile_menu_padding: number;
  mobile_menu_item_gap: number;

  hamburger_color: string;
  hamburger_size: number;

  announcement_enabled: boolean;
  announcement_text: string;
  announcement_link: string | null;
  announcement_open_in_new_tab: boolean;
  announcement_text_color: string;
  announcement_background_color: string;
  announcement_font_size: number;
  announcement_font_weight: number;
  announcement_height: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;

  header_id: string;

  label: string;
  href: string;

  item_type: NavigationItemType;

  parent_id: string | null;

  open_in_new_tab: boolean;

  show_on_desktop: boolean;
  show_on_mobile: boolean;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface SiteHeaderData {
  settings: SiteHeaderSettings | null;
  navigation: NavigationItem[];
}

export interface UpdateSiteHeaderInput
  extends Partial<SiteHeaderSettings> {}

export interface CreateNavigationItemInput {
  label: string;
  href: string;

  item_type?: NavigationItemType;

  parent_id?: string | null;

  open_in_new_tab?: boolean;

  show_on_desktop?: boolean;
  show_on_mobile?: boolean;

  display_order?: number;

  is_active?: boolean;
  is_published?: boolean;
}

export interface UpdateNavigationItemInput
  extends Partial<CreateNavigationItemInput> {}

export interface ActionResult {
  success: boolean;
  errors: string[];
}