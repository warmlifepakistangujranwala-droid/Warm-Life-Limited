export type HomepageLocalAuthoritiesSection = {
  id: string;

  heading: string;
  subheading: string;

  heading_color: string;
  heading_size: number;
  heading_weight: number;

  subheading_color: string;
  subheading_size: number;

  background_color: string;

  padding_top: number;
  padding_bottom: number;

  autoplay_speed: number;

  is_active: boolean;

  created_at: string;
  updated_at: string;
};

export type HomepageLocalAuthority = {
  id: string;
  section_id: string;

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
};

export type HomepageLocalAuthoritiesData = {
  section: HomepageLocalAuthoritiesSection | null;
  localAuthorities: HomepageLocalAuthority[];
};

export type CreateHomepageLocalAuthorityInput = {
  section_id: string;

  name: string;

  logo_url: string;
  logo_storage_path?: string | null;

  website_url?: string | null;
  open_in_new_tab?: boolean;

  display_order?: number;

  is_active?: boolean;
  is_published?: boolean;
};

export type UpdateHomepageLocalAuthorityInput = {
  section_id?: string;

  name?: string;

  logo_url?: string;
  logo_storage_path?: string | null;

  website_url?: string | null;
  open_in_new_tab?: boolean;

  display_order?: number;

  is_active?: boolean;
  is_published?: boolean;
};

export type UpdateHomepageLocalAuthoritiesSectionInput = {
  heading?: string;
  subheading?: string;

  heading_color?: string;
  heading_size?: number;
  heading_weight?: number;

  subheading_color?: string;
  subheading_size?: number;

  background_color?: string;

  padding_top?: number;
  padding_bottom?: number;

  autoplay_speed?: number;

  is_active?: boolean;
};