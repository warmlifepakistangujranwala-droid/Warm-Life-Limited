"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type {
  ActionResult,
  HomepageCtaData,
  HomepageCtaSection,
  UpdateHomepageCtaSectionInput,
} from "@/lib/types/homepage-cta";

const ADMIN_PATH =
  "/admin/website/homepage/cta";

function revalidateCtaPages(): void {
  revalidatePath("/");
  revalidatePath("/admin/website/homepage");
  revalidatePath(ADMIN_PATH);
}

function cleanOptionalText(
  value: string | null | undefined,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();

  return cleaned || null;
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  return error instanceof Error
    ? error.message
    : fallback;
}

export async function getHomepageCtaSection(): Promise<HomepageCtaSection | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("homepage_cta_section")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Failed to load homepage CTA section:",
        error.message,
      );

      return null;
    }

    return (
      (data as HomepageCtaSection | null) ??
      null
    );
  } catch (error) {
    console.error(
      "Unexpected error loading homepage CTA section:",
      error,
    );

    return null;
  }
}

export async function getHomepageCtaData(): Promise<HomepageCtaData> {
  const section =
    await getHomepageCtaSection();

  return {
    section,
  };
}

export async function updateHomepageCtaSection(
  sectionId: string,
  input: UpdateHomepageCtaSectionInput,
): Promise<ActionResult> {
  if (!sectionId.trim()) {
    return {
      success: false,
      errors: [
        "CTA section ID is required.",
      ],
    };
  }

  try {
    const supabase = await createClient();

    const payload: UpdateHomepageCtaSectionInput = {
      ...input,

      ...(typeof input.internal_name ===
      "string"
        ? {
            internal_name:
              input.internal_name.trim(),
          }
        : {}),

      ...(typeof input.eyebrow ===
      "string"
        ? {
            eyebrow:
              input.eyebrow.trim(),
          }
        : {}),

      ...(typeof input.heading ===
      "string"
        ? {
            heading:
              input.heading.trim(),
          }
        : {}),

      ...(typeof input.description ===
      "string"
        ? {
            description:
              input.description.trim(),
          }
        : {}),

      ...(typeof input.highlight_text ===
      "string"
        ? {
            highlight_text:
              input.highlight_text.trim(),
          }
        : {}),

      ...(typeof input.primary_button_text ===
      "string"
        ? {
            primary_button_text:
              input.primary_button_text.trim(),
          }
        : {}),

      ...(typeof input.primary_button_link ===
      "string"
        ? {
            primary_button_link:
              input.primary_button_link.trim() ||
              "/quote",
          }
        : {}),

      ...(typeof input.secondary_button_text ===
      "string"
        ? {
            secondary_button_text:
              input.secondary_button_text.trim(),
          }
        : {}),

      ...(typeof input.secondary_button_link ===
      "string"
        ? {
            secondary_button_link:
              input.secondary_button_link.trim() ||
              "/contact",
          }
        : {}),

      ...(typeof input.gradient_direction ===
      "string"
        ? {
            gradient_direction:
              input.gradient_direction.trim() ||
              "135deg",
          }
        : {}),

      ...(typeof input.background_image_url ===
      "string"
        ? {
            background_image_url:
              cleanOptionalText(
                input.background_image_url,
              ),
          }
        : {}),

      ...(typeof input.background_image_storage_path ===
      "string"
        ? {
            background_image_storage_path:
              cleanOptionalText(
                input.background_image_storage_path,
              ),
          }
        : {}),

      ...(typeof input.background_image_alt ===
      "string"
        ? {
            background_image_alt:
              input.background_image_alt.trim() ||
              "Warm Life call to action background",
          }
        : {}),

      ...(typeof input.background_overlay_color ===
      "string"
        ? {
            background_overlay_color:
              input.background_overlay_color.trim() ||
              "rgba(7,48,36,0.68)",
          }
        : {}),
    };

    const { error } = await supabase
      .from("homepage_cta_section")
      .update(payload)
      .eq("id", sectionId);

    if (error) {
      return {
        success: false,
        errors: [error.message],
      };
    }

    revalidateCtaPages();

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error(
      "Unexpected error updating homepage CTA section:",
      error,
    );

    return {
      success: false,
      errors: [
        getErrorMessage(
          error,
          "Unable to update CTA section.",
        ),
      ],
    };
  }
}