"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import {
  updateCaseStudiesPageSettingsSchema,
} from "@/lib/validations/case-studies-page";

import type {
  CaseStudiesPageSettings,
  CaseStudiesPageSettingsActionResult,
  UpdateCaseStudiesPageSettingsInput,
} from "@/lib/types/case-studies-page";

const TABLE =
  "case_studies_page_settings";

export async function getCaseStudiesPageSettings():
  Promise<CaseStudiesPageSettings | null> {
  const supabase = await createClient();

  const { data, error } =
    await supabase
      .from(TABLE)
      .select("*")
      .eq("is_active", true)
      .order("created_at", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle();

  if (error) {
    console.error(
      "Failed to load Case Studies page settings:",
      error,
    );

    return null;
  }

  return data as CaseStudiesPageSettings | null;
}

export async function getCaseStudiesPageSettingsForAdmin():
  Promise<CaseStudiesPageSettings | null> {
  const supabase = await createClient();

  const { data, error } =
    await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle();

  if (error) {
    console.error(
      "Failed to load Case Studies admin page settings:",
      error,
    );

    return null;
  }

  return data as CaseStudiesPageSettings | null;
}

export async function updateCaseStudiesPageSettings(
  id: string,
  values: UpdateCaseStudiesPageSettingsInput,
): Promise<CaseStudiesPageSettingsActionResult> {
  if (!id) {
    return {
      success: false,
      message: "Settings ID is required.",
    };
  }

  const parsed =
    updateCaseStudiesPageSettingsSchema.safeParse(
      values,
    );

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors:
        parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } =
    await supabase
      .from(TABLE)
      .update(parsed.data)
      .eq("id", id);

  if (error) {
    console.error(
      "Failed to update Case Studies page settings:",
      error,
    );

    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/case-studies");
  revalidatePath(
    "/admin/website/case-studies/hero",
  );

  return {
    success: true,
    message:
      "Case Studies hero updated successfully.",
  };
}
