export type HomepageCtaBackgroundType =
  | "solid"
  | "gradient"
  | "image";

export type HomepageCtaTextAlignment =
  | "left"
  | "center"
  | "right";

export type HomepageCtaShadowStyle =
  | "none"
  | "soft"
  | "medium"
  | "strong";

export interface HomepageCtaSection {
  id: string;

  internal_name: string;

  eyebrow: string;
  eyebrow_color: string;
  eyebrow_size: number;
  eyebrow_weight: number;

  heading: string;
  heading_color: string;
  heading_size: number;
  heading_weight: number;

  description: string;
  description_color: string;
  description_size: number;

  highlight_enabled: boolean;
  highlight_text: string;
  highlight_text_color: string;
  highlight_background_color: string;
  highlight_border_color: string;
  highlight_radius: number;
  highlight_padding_x: number;
  highlight_padding_y: number;

  text_alignment: HomepageCtaTextAlignment;

  primary_button_enabled: boolean;
  primary_button_text: string;
  primary_button_link: string;
  primary_button_open_in_new_tab: boolean;
  primary_button_text_color: string;
  primary_button_background_color: string;
  primary_button_border_color: string;
  primary_button_radius: number;
  primary_button_padding_x: number;
  primary_button_padding_y: number;

  secondary_button_enabled: boolean;
  secondary_button_text: string;
  secondary_button_link: string;
  secondary_button_open_in_new_tab: boolean;
  secondary_button_text_color: string;
  secondary_button_background_color: string;
  secondary_button_border_color: string;
  secondary_button_radius: number;
  secondary_button_padding_x: number;
  secondary_button_padding_y: number;

  background_type: HomepageCtaBackgroundType;
  background_color: string;
  gradient_start_color: string;
  gradient_end_color: string;
  gradient_direction: string;

  background_image_url: string | null;
  background_image_storage_path: string | null;
  background_image_alt: string;

  background_overlay_color: string;

  show_decorations: boolean;
  decoration_primary_color: string;
  decoration_secondary_color: string;
  decoration_opacity: number;

  content_max_width: number;
  content_inner_width: number;

  padding_top: number;
  padding_bottom: number;
  padding_left: number;
  padding_right: number;

  section_margin_top: number;
  section_margin_bottom: number;

  border_radius: number;
  border_width: number;
  border_color: string;

  shadow_style: HomepageCtaShadowStyle;

  button_gap: number;
  content_gap: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface UpdateHomepageCtaSectionInput {
  internal_name?: string;

  eyebrow?: string;
  eyebrow_color?: string;
  eyebrow_size?: number;
  eyebrow_weight?: number;

  heading?: string;
  heading_color?: string;
  heading_size?: number;
  heading_weight?: number;

  description?: string;
  description_color?: string;
  description_size?: number;

  highlight_enabled?: boolean;
  highlight_text?: string;
  highlight_text_color?: string;
  highlight_background_color?: string;
  highlight_border_color?: string;
  highlight_radius?: number;
  highlight_padding_x?: number;
  highlight_padding_y?: number;

  text_alignment?: HomepageCtaTextAlignment;

  primary_button_enabled?: boolean;
  primary_button_text?: string;
  primary_button_link?: string;
  primary_button_open_in_new_tab?: boolean;
  primary_button_text_color?: string;
  primary_button_background_color?: string;
  primary_button_border_color?: string;
  primary_button_radius?: number;
  primary_button_padding_x?: number;
  primary_button_padding_y?: number;

  secondary_button_enabled?: boolean;
  secondary_button_text?: string;
  secondary_button_link?: string;
  secondary_button_open_in_new_tab?: boolean;
  secondary_button_text_color?: string;
  secondary_button_background_color?: string;
  secondary_button_border_color?: string;
  secondary_button_radius?: number;
  secondary_button_padding_x?: number;
  secondary_button_padding_y?: number;

  background_type?: HomepageCtaBackgroundType;
  background_color?: string;
  gradient_start_color?: string;
  gradient_end_color?: string;
  gradient_direction?: string;

  background_image_url?: string | null;
  background_image_storage_path?: string | null;
  background_image_alt?: string;

  background_overlay_color?: string;

  show_decorations?: boolean;
  decoration_primary_color?: string;
  decoration_secondary_color?: string;
  decoration_opacity?: number;

  content_max_width?: number;
  content_inner_width?: number;

  padding_top?: number;
  padding_bottom?: number;
  padding_left?: number;
  padding_right?: number;

  section_margin_top?: number;
  section_margin_bottom?: number;

  border_radius?: number;
  border_width?: number;
  border_color?: string;

  shadow_style?: HomepageCtaShadowStyle;

  button_gap?: number;
  content_gap?: number;

  is_active?: boolean;
  is_published?: boolean;
}

export interface HomepageCtaData {
  section: HomepageCtaSection | null;
}

export interface ActionResult {
  success: boolean;
  errors: string[];
}