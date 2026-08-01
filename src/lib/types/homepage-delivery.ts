export interface HomepageDeliverySection {
  id: string;

  top_badge: string;

  section_heading: string;
  section_subheading: string;

  card_eyebrow: string;
  card_heading: string;

  description_one: string;
  description_two: string;

  button_text: string;
  button_link: string;
  button_open_in_new_tab: boolean;
  image_url: string | null;
  image_storage_path: string | null;
  image_alt: string;

  section_background_color: string;

  top_badge_color: string;

  section_heading_color: string;
  section_subheading_color: string;

  card_background_color: string;
  card_eyebrow_color: string;
  card_heading_color: string;
  card_description_color: string;

  accent_color: string;

  button_background_color: string;
  button_text_color: string;

  heading_size: number;
  subheading_size: number;
  card_heading_size: number;

  padding_top: number;
  padding_bottom: number;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface HomepageDeliveryStatistic {
  id: string;

  section_id: string;

  value: string;
  title: string;
  description: string;

  icon_key: string;

  value_color: string;
  title_color: string;
  description_color: string;

  card_background_color: string;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface HomepageDeliveryFeature {
  id: string;

  section_id: string;

  title: string;
  description: string;

  icon_key: string;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
  
}

export interface HomepageDeliveryData {
  section: HomepageDeliverySection | null;

  statistics: HomepageDeliveryStatistic[];

  features: HomepageDeliveryFeature[];
}

export type CreateHomepageDeliveryStatisticInput = Omit<
  HomepageDeliveryStatistic,
  "id" | "created_at" | "updated_at"
>;

export type UpdateHomepageDeliveryStatisticInput =
  Partial<CreateHomepageDeliveryStatisticInput>;

export type CreateHomepageDeliveryFeatureInput = Omit<
  HomepageDeliveryFeature,
  "id" | "created_at" | "updated_at"
>;

export type UpdateHomepageDeliveryFeatureInput =
  Partial<CreateHomepageDeliveryFeatureInput>;

export type UpdateHomepageDeliverySectionInput = Partial<
  Omit<
    HomepageDeliverySection,
    "id" | "created_at" | "updated_at"
  >
>;