export type HomepageServiceMediaType = "video" | "image";

export type HomepageServicesSectionAlignment =
  | "left"
  | "center"
  | "right";

export interface HomepageServicesSection {
  id: string;

  section_label: string | null;
  section_heading: string;

  section_label_color: string;
  section_label_size: number;

  section_heading_color: string;
  section_heading_size: number;
  section_heading_weight: number;

  section_alignment: HomepageServicesSectionAlignment;

  background_color: string;

  padding_top: number;
  padding_bottom: number;

  scroll_height: number;
  animation_duration: number;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface HomepageServiceBullet {
  id: string;
  service_id: string;

  bullet_text: string;
  display_order: number;

  created_at: string;
}

export interface HomepageService {
  id: string;
  section_id: string | null;

  display_order: number;
  display_number: string | null;

  service_name: string;
  slug: string | null;

  eyebrow: string | null;
  title: string;
  description: string | null;

  media_type: HomepageServiceMediaType;

  video_url: string | null;
  video_poster_url: string | null;
  image_url: string | null;

  object_position: string | null;

  service_name_color: string | null;
  service_name_size: number | null;
  service_name_weight: number | null;

  eyebrow_color: string | null;
  eyebrow_size: number | null;

  title_color: string | null;
  title_size: number | null;
  title_weight: number | null;

  description_color: string | null;
  description_size: number | null;

  bullet_color: string | null;
  bullet_size: number | null;

  button_text: string | null;
  button_link: string | null;
  open_in_new_tab: boolean;

  button_background_color: string | null;
  button_text_color: string | null;
  button_radius: number | null;
  button_size: number | null;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;

  bullets?: HomepageServiceBullet[];
}

export interface HomepageServicesData {
  section: HomepageServicesSection | null;
  services: HomepageService[];
}

export type CreateHomepageServiceInput = Omit<
  HomepageService,
  "id" | "created_at" | "updated_at" | "bullets"
>;

export type UpdateHomepageServiceInput =
  Partial<CreateHomepageServiceInput>;

export type CreateHomepageServiceBulletInput = Omit<
  HomepageServiceBullet,
  "id" | "created_at"
>;

export type UpdateHomepageServiceBulletInput =
  Partial<CreateHomepageServiceBulletInput>;

export type UpdateHomepageServicesSectionInput = Partial<
  Omit<
    HomepageServicesSection,
    "id" | "created_at" | "updated_at"
  >
>;