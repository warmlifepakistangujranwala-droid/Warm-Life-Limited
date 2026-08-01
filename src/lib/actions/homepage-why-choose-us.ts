"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type {
  CreateHomepageWhyChooseUsCardInput,
  HomepageWhyChooseUsCard,
  HomepageWhyChooseUsData,
  HomepageWhyChooseUsSection,
  UpdateHomepageWhyChooseUsCardInput,
  UpdateHomepageWhyChooseUsSectionInput,
} from "@/lib/types/homepage-why-choose-us";

type ActionResult<T = null> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errors: string[];
    };

const ADMIN_PATH =
  "/admin/website/homepage/why-choose-us";

function refreshWhyChooseUsPages(): void {
  revalidatePath("/");
  revalidatePath("/admin/website/homepage");
  revalidatePath(ADMIN_PATH);
}

export async function getHomepageWhyChooseUsData(): Promise<HomepageWhyChooseUsData> {
  const supabase = await createClient();

  const [
    sectionResult,
    cardsResult,
  ] = await Promise.all([
    supabase
      .from("homepage_why_choose_us_section")
      .select("*")
      .limit(1)
      .maybeSingle(),

    supabase
      .from("homepage_why_choose_us_cards")
      .select("*")
      .order("display_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      }),
  ]);

  if (sectionResult.error) {
    console.error(
      "Failed to load homepage why choose us section:",
      sectionResult.error.message,
      sectionResult.error.code,
      sectionResult.error.details,
      sectionResult.error.hint,
    );
  }

  if (cardsResult.error) {
    console.error(
      "Failed to load homepage why choose us cards:",
      cardsResult.error.message,
      cardsResult.error.code,
      cardsResult.error.details,
      cardsResult.error.hint,
    );
  }

  return {
    section:
      (sectionResult.data as HomepageWhyChooseUsSection | null) ??
      null,

    cards:
      (cardsResult.data as HomepageWhyChooseUsCard[] | null) ??
      [],
  };
}

export async function updateHomepageWhyChooseUsSection(
  id: string,
  input: UpdateHomepageWhyChooseUsSectionInput,
): Promise<ActionResult<HomepageWhyChooseUsSection>> {
  const supabase = await createClient();

  if (!id.trim()) {
    return {
      success: false,
      errors: [
        "Why Choose Us section ID is required.",
      ],
    };
  }

  const { data, error } = await supabase
    .from("homepage_why_choose_us_section")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  refreshWhyChooseUsPages();

  return {
    success: true,
    data:
      data as HomepageWhyChooseUsSection,
  };
}

export async function createHomepageWhyChooseUsCard(
  input: CreateHomepageWhyChooseUsCardInput,
): Promise<ActionResult<HomepageWhyChooseUsCard>> {
  const supabase = await createClient();

  if (!input.section_id?.trim()) {
    return {
      success: false,
      errors: [
        "Why Choose Us section ID is required.",
      ],
    };
  }

  if (!input.title?.trim()) {
    return {
      success: false,
      errors: [
        "Card title is required.",
      ],
    };
  }

  if (!input.description?.trim()) {
    return {
      success: false,
      errors: [
        "Card description is required.",
      ],
    };
  }

  const payload = {
    ...input,

    section_id:
      input.section_id.trim(),

    title:
      input.title.trim(),

    description:
      input.description.trim(),

    icon_key:
      input.icon_key.trim(),

    image_url:
      input.image_url?.trim() || null,

    image_storage_path:
      input.image_storage_path?.trim() ||
      null,

    image_alt:
      input.image_alt.trim() ||
      "Why choose us card image",
  };

  const { data, error } = await supabase
    .from("homepage_why_choose_us_cards")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  refreshWhyChooseUsPages();

  return {
    success: true,
    data:
      data as HomepageWhyChooseUsCard,
  };
}

export async function updateHomepageWhyChooseUsCard(
  id: string,
  input: UpdateHomepageWhyChooseUsCardInput,
): Promise<ActionResult<HomepageWhyChooseUsCard>> {
  const supabase = await createClient();

  if (!id.trim()) {
    return {
      success: false,
      errors: [
        "Why Choose Us card ID is required.",
      ],
    };
  }

  const payload = {
    ...input,

    ...(typeof input.title === "string"
      ? {
          title:
            input.title.trim(),
        }
      : {}),

    ...(typeof input.description ===
    "string"
      ? {
          description:
            input.description.trim(),
        }
      : {}),

    ...(typeof input.icon_key === "string"
      ? {
          icon_key:
            input.icon_key.trim(),
        }
      : {}),

    ...(typeof input.image_url === "string"
      ? {
          image_url:
            input.image_url.trim() ||
            null,
        }
      : {}),

    ...(typeof input.image_storage_path ===
    "string"
      ? {
          image_storage_path:
            input.image_storage_path.trim() ||
            null,
        }
      : {}),

    ...(typeof input.image_alt === "string"
      ? {
          image_alt:
            input.image_alt.trim() ||
            "Why choose us card image",
        }
      : {}),
  };

  const { data, error } = await supabase
    .from("homepage_why_choose_us_cards")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  refreshWhyChooseUsPages();

  return {
    success: true,
    data:
      data as HomepageWhyChooseUsCard,
  };
}

export async function deleteHomepageWhyChooseUsCard(
  id: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  if (!id.trim()) {
    return {
      success: false,
      errors: [
        "Why Choose Us card ID is required.",
      ],
    };
  }

  const { data: card } =
    await supabase
      .from(
        "homepage_why_choose_us_cards",
      )
      .select(
        "image_storage_path",
      )
      .eq("id", id)
      .maybeSingle();

  const { error } = await supabase
    .from(
      "homepage_why_choose_us_cards",
    )
    .delete()
    .eq("id", id);

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  if (
    card?.image_storage_path
  ) {
    const {
      error: storageError,
    } = await supabase.storage
      .from("website-media")
      .remove([
        card.image_storage_path,
      ]);

    if (storageError) {
      console.error(
        "Why Choose Us card image could not be removed:",
        storageError.message,
      );
    }
  }

  refreshWhyChooseUsPages();

  return {
    success: true,
    data: null,
  };
}