/**
 * Blogs Listing Page Types
 * Version: v0.1.0
 */

export interface BlogsPageSettings {
  id: string;

  internal_name: string;

  hero_eyebrow: string;
  hero_heading: string;
  hero_description: string;

  hero_background_image_url: string | null;
  hero_background_image_storage_path: string | null;
  hero_background_image_alt: string;

  hero_overlay_opacity: number;
  hero_height: number;
  hero_heading_size: number;
  hero_heading_size_mobile: number;

  listing_eyebrow: string;
  listing_heading: string;
  listing_description: string;

  is_active: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export type UpdateBlogsPageSettingsInput =
  Partial<
    Omit<
      BlogsPageSettings,
      "id" | "created_at" | "updated_at"
    >
  >;

export interface BlogsPageActionResult {
  success: boolean;
  message: string;
  errors?: Record<
    string,
    string[] | undefined
  >;
}
