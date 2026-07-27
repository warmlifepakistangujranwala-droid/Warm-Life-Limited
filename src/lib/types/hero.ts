export type HeroSlide = {
  id: string;
  eyebrow: string | null;
  title_line_one: string;
  title_line_two: string | null;
  description: string | null;
  primary_button_text: string | null;
  primary_button_link: string | null;
  secondary_button_text: string | null;
  secondary_button_link: string | null;
  video_url: string;
  video_poster_url: string | null;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type HeroSlideFormValues = {
  eyebrow: string;
  title_line_one: string;
  title_line_two: string;
  description: string;
  primary_button_text: string;
  primary_button_link: string;
  secondary_button_text: string;
  secondary_button_link: string;
  video_url: string;
  video_poster_url: string;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
};

export type CreateHeroSlideInput = HeroSlideFormValues;

export type UpdateHeroSlideInput = Partial<HeroSlideFormValues> & {
  id: string;
};

export type HeroSlideActionResult<T = null> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export type HeroSlideStatus = "published" | "draft" | "inactive";

export function getHeroSlideStatus(slide: HeroSlide): HeroSlideStatus {
  if (!slide.is_active) {
    return "inactive";
  }

  if (slide.is_published) {
    return "published";
  }

  return "draft";
}

export function getHeroSlideStatusLabel(slide: HeroSlide): string {
  const status = getHeroSlideStatus(slide);

  if (status === "published") {
    return "Published";
  }

  if (status === "inactive") {
    return "Inactive";
  }

  return "Draft";
}

export const defaultHeroSlideValues: HeroSlideFormValues = {
  eyebrow: "",
  title_line_one: "",
  title_line_two: "",
  description: "",
  primary_button_text: "",
  primary_button_link: "",
  secondary_button_text: "",
  secondary_button_link: "",
  video_url: "",
  video_poster_url: "",
  display_order: 0,
  is_active: true,
  is_published: false,
};