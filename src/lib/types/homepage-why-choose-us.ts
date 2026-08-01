export type WhyChooseUsAlignment =
  | "left"
  | "center"
  | "right";

export type WhyChooseUsMediaType =
  | "icon"
  | "image";

export interface HomepageWhyChooseUsSection {
  id: string;

  eyebrow: string;
  eyebrow_color: string;
  eyebrow_size: number;

  heading: string;
  heading_color: string;
  heading_size: number;
  heading_weight: number;
  heading_alignment: WhyChooseUsAlignment;

  badge_text: string;
  badge_text_color: string;
  badge_background_color: string;
  badge_font_size: number;
  badge_font_weight: number;
  badge_radius: number;
  badge_padding_x: number;
  badge_padding_y: number;

  section_background_color: string;

  padding_top: number;
  padding_bottom: number;

  cards_gap: number;
  cards_per_row: number;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface HomepageWhyChooseUsCard {
  id: string;

  section_id: string;

  title: string;
  description: string;

  media_type: WhyChooseUsMediaType;

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

  description_color: string;
  description_size: number;

  card_background_color: string;
  card_border_color: string;
  card_radius: number;
  card_min_height: number;
  card_padding: number;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface HomepageWhyChooseUsData {
  section: HomepageWhyChooseUsSection | null;
  cards: HomepageWhyChooseUsCard[];
}

export type UpdateHomepageWhyChooseUsSectionInput =
  Partial<
    Omit<
      HomepageWhyChooseUsSection,
      "id" | "created_at" | "updated_at"
    >
  >;

export type CreateHomepageWhyChooseUsCardInput =
  Omit<
    HomepageWhyChooseUsCard,
    "id" | "created_at" | "updated_at"
  >;

export type UpdateHomepageWhyChooseUsCardInput =
  Partial<CreateHomepageWhyChooseUsCardInput>;