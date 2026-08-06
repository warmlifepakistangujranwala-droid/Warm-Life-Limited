/**
 * Blogs Listing Page Actions
 * Version: v0.1.0
 */

"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  updateBlogsPageSettingsSchema,
} from "@/lib/validations/blogs-page";

import type {
  BlogsPageActionResult,
  BlogsPageSettings,
  UpdateBlogsPageSettingsInput,
} from "@/lib/types/blogs-page";

const ADMIN_PATH =
  "/admin/website/blogs/hero";

export async function getBlogsPageSettings():
  Promise<BlogsPageSettings | null> {
  try {
    const supabase =
      await createClient();

    const {
      data,
      error,
    } =
      await supabase
        .from("blogs_page_settings")
        .select("*")
        .eq("is_active", true)
        .eq("is_published", true)
        .order("updated_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

    if (error) {
      console.error(
        "Failed to load Blogs page settings:",
        {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        },
      );

      return null;
    }

    console.log(
      "BLOGS PAGE SETTINGS:",
      data,
    );

    return (
      data as BlogsPageSettings | null
    ) ?? null;
  } catch (error) {
    console.error(
      "Unexpected error loading Blogs page settings:",
      error,
    );

    return null;
  }
}
export async function updateBlogsPageSettings(
  id: string,
  input: UpdateBlogsPageSettingsInput,
): Promise<BlogsPageActionResult> {
  if (!id.trim()) {
    return {
      success: false,
      message:
        "Blogs page settings ID is required.",
    };
  }

  const parsed =
    updateBlogsPageSettingsSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Please correct the highlighted fields.",
      errors:
        parsed.error.flatten()
          .fieldErrors,
    };
  }

  try {
    const supabase =
      await createClient();

    const {
      error,
    } =
      await supabase
        .from("blogs_page_settings")
        .update(parsed.data)
        .eq("id", id);

    if (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }

   revalidatePath(
  "/blogs",
  "page",
);

revalidatePath(
  "/admin/website/blogs/hero",
  "page",
);
    return {
      success: true,
      message:
        "Blogs page settings updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update Blogs page settings.",
    };
  }
}
