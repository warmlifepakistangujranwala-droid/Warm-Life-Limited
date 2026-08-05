export interface CaseStudiesPageSettings {
  id: string;

  hero_eyebrow: string;
  hero_heading: string;
  hero_description: string;

  hero_image_url: string | null;
  hero_image_storage_path: string | null;
  hero_image_alt: string;

  hero_overlay_opacity: number;
  hero_height: number;

  hero_heading_size: number;
  hero_heading_size_mobile: number;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export type UpdateCaseStudiesPageSettingsInput =
  Partial<
    Omit<
      CaseStudiesPageSettings,
      "id" | "created_at" | "updated_at"
    >
  >;

export interface CaseStudiesPageSettingsActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
}
