export type ReviewTextAlignment =
  | "left"
  | "center"
  | "right";

export type ReviewBackgroundType =
  | "solid"
  | "gradient"
  | "image";

export type ReviewSourceType =
  | "manual"
  | "google";

export interface HomepageReviewsSection {
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

  text_alignment: ReviewTextAlignment;

  background_type: ReviewBackgroundType;
  background_color: string;
  gradient_start_color: string;
  gradient_end_color: string;
  gradient_direction: string;

  background_image_url: string | null;
  background_image_storage_path: string | null;
  background_image_alt: string;
  background_overlay_color: string;

  card_background_color: string;
  card_border_color: string;
  card_text_color: string;
  card_title_color: string;
  card_accent_color: string;

  card_radius: number;
  card_padding: number;
  card_min_height: number;
  card_gap: number;

  autoplay: boolean;
  autoplay_delay: number;
  transition_speed: number;
  pause_on_hover: boolean;
  infinite_loop: boolean;

  show_arrows: boolean;
  show_dots: boolean;

  slides_desktop: number;
  slides_tablet: number;
  slides_mobile: number;

  content_max_width: number;
  padding_top: number;
  padding_bottom: number;
  heading_bottom_spacing: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface HomepageReview {
  id: string;

  section_id: string;

  customer_name: string;
  company_name: string | null;
  designation: string | null;
  location: string | null;

  rating: number;

  review_title: string | null;
  review_text: string;

  customer_image_url: string | null;
  customer_image_storage_path: string | null;
  customer_image_alt: string;

  source_type: ReviewSourceType;

  google_review_id: string | null;
  google_author_url: string | null;
  google_profile_photo_url: string | null;
  google_relative_time: string | null;
  google_review_time: number | null;

  is_verified: boolean;
  is_featured: boolean;

  display_order: number;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface GoogleReviewsSettings {
  id: string;

  place_id: string | null;
  api_key_encrypted: string | null;

  auto_publish_imported: boolean;
  default_verified: boolean;
  last_imported_at: string | null;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface HomepageReviewsData {
  section: HomepageReviewsSection | null;
  reviews: HomepageReview[];
  googleSettings: GoogleReviewsSettings | null;
}

export type UpdateHomepageReviewsSectionInput =
  Partial<
    Omit<
      HomepageReviewsSection,
      "id" | "created_at" | "updated_at"
    >
  >;

export type CreateHomepageReviewInput =
  Omit<
    HomepageReview,
    "id" | "created_at" | "updated_at"
  >;

export type UpdateHomepageReviewInput =
  Partial<CreateHomepageReviewInput>;

export type UpdateGoogleReviewsSettingsInput =
  Partial<
    Omit<
      GoogleReviewsSettings,
      "id" | "created_at" | "updated_at"
    >
  >;

export interface GooglePlacesAuthorAttribution {
  displayName?: string;
  uri?: string;
  photoUri?: string;
}

export interface GooglePlacesReview {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: {
    text?: string;
    languageCode?: string;
  };
  originalText?: {
    text?: string;
    languageCode?: string;
  };
  publishTime?: string;
  authorAttribution?: GooglePlacesAuthorAttribution;
}

export interface GooglePlacesDetailsResponse {
  id?: string;
  displayName?: {
    text?: string;
    languageCode?: string;
  };
  reviews?: GooglePlacesReview[];
}
