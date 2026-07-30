export interface HomepageCertificationsSection {
  id: string;
  heading: string;
  heading_color: string;
  heading_size: number;
  heading_weight: number;
  background_color: string;
  padding_top: number;
  padding_bottom: number;
  autoplay_speed: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageCertification {
  id: string;
  section_id: string | null;
  name: string;
  logo_url: string;
  logo_storage_path: string | null;
  website_url: string | null;
  open_in_new_tab: boolean;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageCertificationsData {
  section: HomepageCertificationsSection | null;
  certifications: HomepageCertification[];
}

export type CreateHomepageCertificationInput = Omit<
  HomepageCertification,
  "id" | "created_at" | "updated_at"
>;

export type UpdateHomepageCertificationInput =
  Partial<CreateHomepageCertificationInput>;

export type UpdateHomepageCertificationsSectionInput = Partial<
  Omit<HomepageCertificationsSection, "id" | "created_at" | "updated_at">
>;
