export type HeroInsight = {
  id: string;
  hero_slide_id: string | null;
  label: string;
  title: string;
  description: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type HeroInsightFormValues = {
  hero_slide_id: string;
  label: string;
  title: string;
  description: string;
  display_order: number;
  is_visible: boolean;
};

export type CreateHeroInsightInput = HeroInsightFormValues;

export type UpdateHeroInsightInput = HeroInsightFormValues & {
  id: string;
};

export type HeroInsightFieldErrors = Partial<
  Record<keyof HeroInsightFormValues, string[]>
>;

export type HeroInsightActionResult = {
  success: boolean;
  message?: string;
  data?: HeroInsight;
  errors?: HeroInsightFieldErrors;
};

export const defaultHeroInsightFormValues: HeroInsightFormValues = {
  hero_slide_id: "",
  label: "",
  title: "",
  description: "",
  display_order: 0,
  is_visible: true,
};