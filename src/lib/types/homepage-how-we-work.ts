export type HowWeWorkTextAlignment =
  | "left"
  | "center"
  | "right";

export type HowWeWorkBackgroundType =
  | "solid"
  | "gradient"
  | "image";

export type HowWeWorkMediaType =
  | "icon"
  | "image"
  | "none";

export type HowWeWorkShadowStyle =
  | "none"
  | "soft"
  | "medium"
  | "strong";

export type HowWeWorkLayoutStyle =
  | "timeline"
  | "cards"
  | "numbered-list";

export interface HomepageHowWeWorkSection {
  id: string;

  eyebrow: string;
  eyebrow_color: string;
  eyebrow_size: number;
  eyebrow_weight: number;

  heading: string;
  heading_color: string;
  heading_size: number;
  heading_weight: number;

  subheading: string;
  subheading_color: string;
  subheading_size: number;

  text_alignment: HowWeWorkTextAlignment;

  background_type: HowWeWorkBackgroundType;

  background_color: string;
  gradient_start_color: string;
  gradient_end_color: string;
  gradient_direction: string;

  background_image_url: string | null;
  background_image_storage_path: string | null;
  background_image_alt: string;
  background_image_overlay_color: string;

  accent_color: string;

  content_max_width: number;

  groups_gap: number;
  groups_per_row: number;

  padding_top: number;
  padding_bottom: number;
  header_bottom_spacing: number;

  show_decorations: boolean;
  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface HomepageHowWeWorkGroup {
  id: string;

  section_id: string;

  internal_name: string;
  title: string;
  subtitle: string | null;

  media_type: HowWeWorkMediaType;

  icon_key: string;
  icon_color: string;
  icon_background_color: string;
  icon_size: number;

  image_url: string | null;
  image_storage_path: string | null;
  image_alt: string;
  image_height: number;

  title_color: string;
  title_size: number;
  title_weight: number;

  subtitle_color: string;
  subtitle_size: number;

  background_type: HowWeWorkBackgroundType;

  background_color: string;
  gradient_start_color: string;
  gradient_end_color: string;
  gradient_direction: string;

  background_image_url: string | null;
  background_image_storage_path: string | null;
  background_image_alt: string;
  background_overlay_color: string;

  border_color: string;
  border_width: number;

  card_radius: number;
  card_padding: number;
  min_height: number;

  shadow_style: HowWeWorkShadowStyle;
  layout_style: HowWeWorkLayoutStyle;

  highlight_enabled: boolean;
  highlight_text: string | null;
  highlight_icon_key: string;
  highlight_text_color: string;
  highlight_background_color: string;
  highlight_radius: number;
  highlight_padding: number;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface HomepageHowWeWorkStep {
  id: string;

  group_id: string;

  step_label: string;
  title: string;
  description: string;

  media_type: HowWeWorkMediaType;

  icon_key: string;
  icon_color: string;
  icon_background_color: string;
  icon_size: number;

  image_url: string | null;
  image_storage_path: string | null;
  image_alt: string;
  image_height: number;

  step_label_text_color: string;
  step_label_background_color: string;
  step_label_size: number;
  step_label_diameter: number;

  title_color: string;
  title_size: number;
  title_weight: number;

  description_color: string;
  description_size: number;

  step_background_color: string;
  step_border_color: string;
  step_radius: number;
  step_padding: number;

  connector_color: string;
  connector_width: number;

  button_text: string | null;
  button_link: string | null;
  button_background_color: string;
  button_text_color: string;
  button_open_in_new_tab: boolean;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface HomepageHowWeWorkGroupWithSteps
  extends HomepageHowWeWorkGroup {
  steps: HomepageHowWeWorkStep[];
}

export interface HomepageHowWeWorkData {
  section: HomepageHowWeWorkSection | null;
  groups: HomepageHowWeWorkGroupWithSteps[];
}

export type UpdateHomepageHowWeWorkSectionInput =
  Partial<
    Omit<
      HomepageHowWeWorkSection,
      "id" | "created_at" | "updated_at"
    >
  >;

export type CreateHomepageHowWeWorkGroupInput =
  Omit<
    HomepageHowWeWorkGroup,
    "id" | "created_at" | "updated_at"
  >;

export type UpdateHomepageHowWeWorkGroupInput =
  Partial<CreateHomepageHowWeWorkGroupInput>;

export type CreateHomepageHowWeWorkStepInput =
  Omit<
    HomepageHowWeWorkStep,
    "id" | "created_at" | "updated_at"
  >;

export type UpdateHomepageHowWeWorkStepInput =
  Partial<CreateHomepageHowWeWorkStepInput>;