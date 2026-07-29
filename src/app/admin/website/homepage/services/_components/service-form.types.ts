import type {
  HomepageService,
  HomepageServiceMediaType,
} from "@/lib/types/homepage-service";

export interface ServiceFormValues {
  section_id: string | null;

  display_order: number;
  display_number: string;

  service_name: string;
  slug: string;
  eyebrow: string;
  title: string;
  description: string;

  media_type: HomepageServiceMediaType;
  video_url: string;
  video_poster_url: string;
  image_url: string;
  object_position: string;

  service_name_color: string;
  service_name_size: number;
  service_name_weight: number;

  eyebrow_color: string;
  eyebrow_size: number;

  title_color: string;
  title_size: number;
  title_weight: number;

  description_color: string;
  description_size: number;

  bullet_color: string;
  bullet_size: number;

  button_text: string;
  button_link: string;
  open_in_new_tab: boolean;

  button_background_color: string;
  button_text_color: string;
  button_radius: number;
  button_size: number;

  is_active: boolean;
  is_published: boolean;
}

export interface ServiceFormBullet {
  id?: string;
  bullet_text: string;
  display_order: number;
}

export interface ServiceFormProps {
  mode: "create" | "edit";
  service?: HomepageService;
}

export interface ServiceFormCardProps {
  form: ServiceFormValues;
  updateField: <K extends keyof ServiceFormValues>(
    field: K,
    value: ServiceFormValues[K],
  ) => void;
  disabled?: boolean;
}

export interface ServiceBulletsCardProps {
  bullets: ServiceFormBullet[];
  setBullets: React.Dispatch<
    React.SetStateAction<ServiceFormBullet[]>
  >;
  disabled?: boolean;
}

export function getDefaultServiceFormValues(
  service?: HomepageService,
): ServiceFormValues {
  return {
    section_id: service?.section_id ?? null,

    display_order: service?.display_order ?? 1,
    display_number: service?.display_number ?? "",

    service_name: service?.service_name ?? "",
    slug: service?.slug ?? "",
    eyebrow: service?.eyebrow ?? "",
    title: service?.title ?? "",
    description: service?.description ?? "",

    media_type: service?.media_type ?? "video",
    video_url: service?.video_url ?? "",
    video_poster_url: service?.video_poster_url ?? "",
    image_url: service?.image_url ?? "",
    object_position: service?.object_position ?? "center",

    service_name_color:
      service?.service_name_color ?? "#0b2f24",
    service_name_size: service?.service_name_size ?? 18,
    service_name_weight:
      service?.service_name_weight ?? 700,

    eyebrow_color: service?.eyebrow_color ?? "#2f7a55",
    eyebrow_size: service?.eyebrow_size ?? 14,

    title_color: service?.title_color ?? "#0b2f24",
    title_size: service?.title_size ?? 54,
    title_weight: service?.title_weight ?? 700,

    description_color:
      service?.description_color ?? "#5f6f68",
    description_size: service?.description_size ?? 18,

    bullet_color: service?.bullet_color ?? "#0b2f24",
    bullet_size: service?.bullet_size ?? 16,

    button_text: service?.button_text ?? "Explore",
    button_link: service?.button_link ?? "",
    open_in_new_tab: service?.open_in_new_tab ?? false,

    button_background_color:
      service?.button_background_color ?? "#0b2f24",
    button_text_color:
      service?.button_text_color ?? "#ffffff",
    button_radius: service?.button_radius ?? 999,
    button_size: service?.button_size ?? 15,

    is_active: service?.is_active ?? true,
    is_published: service?.is_published ?? false,
  };
}

export function getDefaultServiceBullets(
  service?: HomepageService,
): ServiceFormBullet[] {
  if (!service?.bullets?.length) {
    return [];
  }

  return service.bullets.map((bullet) => ({
    id: bullet.id,
    bullet_text: bullet.bullet_text,
    display_order: bullet.display_order,
  }));
}