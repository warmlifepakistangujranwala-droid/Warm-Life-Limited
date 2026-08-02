"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type {
  ActionResult,
  CreateNavigationItemInput,
  NavigationItem,
  SiteHeaderData,
  SiteHeaderSettings,
  UpdateNavigationItemInput,
  UpdateSiteHeaderInput,
} from "@/lib/types/site-header";

const HEADER_ADMIN_PATH =
  "/admin/website/header";

function revalidateHeaderPages(): void {
  revalidatePath("/");
  revalidatePath("/admin/website");
  revalidatePath(HEADER_ADMIN_PATH);
}

function cleanRequiredText(
  value: string,
): string {
  return value.trim();
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

export async function getSiteHeaderData(): Promise<SiteHeaderData> {
  try {
    const supabase = await createClient();

    const [
      settingsResult,
      navigationResult,
    ] = await Promise.all([
      supabase
        .from("site_header_settings")
        .select("*")
        .limit(1)
        .maybeSingle(),

      supabase
        .from("site_navigation_items")
        .select("*")
        .order("display_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        }),
    ]);

    if (settingsResult.error) {
      console.error(
        "Failed to load site header settings:",
        settingsResult.error.message,
      );
    }

    if (navigationResult.error) {
      console.error(
        "Failed to load site navigation items:",
        navigationResult.error.message,
      );
    }

    return {
      settings:
        (settingsResult.data as
          | SiteHeaderSettings
          | null) ?? null,

      navigation:
        (navigationResult.data as
          | NavigationItem[]
          | null) ?? [],
    };
  } catch (error) {
    console.error(
      "Unexpected error loading site header data:",
      error,
    );

    return {
      settings: null,
      navigation: [],
    };
  }
}

export async function getSiteHeaderSettings(): Promise<SiteHeaderSettings | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("site_header_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Failed to load site header settings:",
        error.message,
      );

      return null;
    }

    return (
      (data as SiteHeaderSettings | null) ??
      null
    );
  } catch (error) {
    console.error(
      "Unexpected error loading site header settings:",
      error,
    );

    return null;
  }
}

export async function getNavigationItems(): Promise<
  NavigationItem[]
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("site_navigation_items")
      .select("*")
      .order("display_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Failed to load navigation items:",
        error.message,
      );

      return [];
    }

    return (
      (data as NavigationItem[] | null) ??
      []
    );
  } catch (error) {
    console.error(
      "Unexpected error loading navigation items:",
      error,
    );

    return [];
  }
}

export async function updateSiteHeaderSettings(
  settingsId: string,
  input: UpdateSiteHeaderInput,
): Promise<ActionResult> {
  if (!settingsId.trim()) {
    return {
      success: false,
      errors: [
        "Header settings ID is required.",
      ],
    };
  }

  try {
    const supabase = await createClient();

    const payload: UpdateSiteHeaderInput = {
      ...input,

      ...(typeof input.internal_name ===
      "string"
        ? {
            internal_name:
              input.internal_name.trim(),
          }
        : {}),

      ...(typeof input.logo_url === "string"
        ? {
            logo_url:
              cleanOptionalText(
                input.logo_url,
              ),
          }
        : {}),

      ...(typeof input.logo_storage_path ===
      "string"
        ? {
            logo_storage_path:
              cleanOptionalText(
                input.logo_storage_path,
              ),
          }
        : {}),

      ...(typeof input.logo_alt === "string"
        ? {
            logo_alt:
              input.logo_alt.trim() ||
              "Warm Life logo",
          }
        : {}),

      ...(typeof input.mobile_logo_url ===
      "string"
        ? {
            mobile_logo_url:
              cleanOptionalText(
                input.mobile_logo_url,
              ),
          }
        : {}),

      ...(typeof input.mobile_logo_storage_path ===
      "string"
        ? {
            mobile_logo_storage_path:
              cleanOptionalText(
                input.mobile_logo_storage_path,
              ),
          }
        : {}),

      ...(typeof input.mobile_logo_alt ===
      "string"
        ? {
            mobile_logo_alt:
              input.mobile_logo_alt.trim() ||
              "Warm Life mobile logo",
          }
        : {}),

      ...(typeof input.cta_text === "string"
        ? {
            cta_text:
              input.cta_text.trim(),
          }
        : {}),

      ...(typeof input.cta_link === "string"
        ? {
            cta_link:
              input.cta_link.trim() ||
              "/quote",
          }
        : {}),

      ...(typeof input.announcement_text ===
      "string"
        ? {
            announcement_text:
              input.announcement_text.trim(),
          }
        : {}),

      ...(typeof input.announcement_link ===
      "string"
        ? {
            announcement_link:
              cleanOptionalText(
                input.announcement_link,
              ),
          }
        : {}),
    };

    const { error } = await supabase
      .from("site_header_settings")
      .update(payload)
      .eq("id", settingsId);

    if (error) {
      return {
        success: false,
        errors: [error.message],
      };
    }

    revalidateHeaderPages();

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error(
      "Unexpected error updating header settings:",
      error,
    );

    return {
      success: false,
      errors: [
        getErrorMessage(
          error,
          "Unable to update header settings.",
        ),
      ],
    };
  }
}

export async function createNavigationItem(
  headerId: string,
  input: CreateNavigationItemInput,
): Promise<ActionResult> {
  if (!headerId.trim()) {
    return {
      success: false,
      errors: [
        "Header ID is required.",
      ],
    };
  }

  if (!input.label?.trim()) {
    return {
      success: false,
      errors: [
        "Navigation label is required.",
      ],
    };
  }

  if (!input.href?.trim()) {
    return {
      success: false,
      errors: [
        "Navigation link is required.",
      ],
    };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("site_navigation_items")
      .insert({
        header_id: headerId.trim(),

        label:
          cleanRequiredText(input.label),

        href:
          cleanRequiredText(input.href),

        item_type:
          input.item_type ?? "link",

        parent_id:
          input.parent_id ?? null,

        open_in_new_tab:
          input.open_in_new_tab ?? false,

        show_on_desktop:
          input.show_on_desktop ?? true,

        show_on_mobile:
          input.show_on_mobile ?? true,

        display_order:
          Number(input.display_order ?? 0),

        is_active:
          input.is_active ?? true,

        is_published:
          input.is_published ?? true,
      });

    if (error) {
      return {
        success: false,
        errors: [error.message],
      };
    }

    revalidateHeaderPages();

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error(
      "Unexpected error creating navigation item:",
      error,
    );

    return {
      success: false,
      errors: [
        getErrorMessage(
          error,
          "Unable to create navigation item.",
        ),
      ],
    };
  }
}

export async function updateNavigationItem(
  itemId: string,
  input: UpdateNavigationItemInput,
): Promise<ActionResult> {
  if (!itemId.trim()) {
    return {
      success: false,
      errors: [
        "Navigation item ID is required.",
      ],
    };
  }

  if (
    typeof input.label === "string" &&
    !input.label.trim()
  ) {
    return {
      success: false,
      errors: [
        "Navigation label cannot be empty.",
      ],
    };
  }

  if (
    typeof input.href === "string" &&
    !input.href.trim()
  ) {
    return {
      success: false,
      errors: [
        "Navigation link cannot be empty.",
      ],
    };
  }

  try {
    const supabase = await createClient();

    const payload: UpdateNavigationItemInput = {
      ...input,

      ...(typeof input.label === "string"
        ? {
            label:
              input.label.trim(),
          }
        : {}),

      ...(typeof input.href === "string"
        ? {
            href:
              input.href.trim(),
          }
        : {}),

      ...(typeof input.parent_id ===
      "string"
        ? {
            parent_id:
              cleanOptionalText(
                input.parent_id,
              ),
          }
        : {}),
    };

    const { error } = await supabase
      .from("site_navigation_items")
      .update(payload)
      .eq("id", itemId);

    if (error) {
      return {
        success: false,
        errors: [error.message],
      };
    }

    revalidateHeaderPages();

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error(
      "Unexpected error updating navigation item:",
      error,
    );

    return {
      success: false,
      errors: [
        getErrorMessage(
          error,
          "Unable to update navigation item.",
        ),
      ],
    };
  }
}

export async function deleteNavigationItem(
  itemId: string,
): Promise<ActionResult> {
  if (!itemId.trim()) {
    return {
      success: false,
      errors: [
        "Navigation item ID is required.",
      ],
    };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("site_navigation_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      return {
        success: false,
        errors: [error.message],
      };
    }

    revalidateHeaderPages();

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error(
      "Unexpected error deleting navigation item:",
      error,
    );

    return {
      success: false,
      errors: [
        getErrorMessage(
          error,
          "Unable to delete navigation item.",
        ),
      ],
    };
  }
}

export async function duplicateNavigationItem(
  itemId: string,
): Promise<ActionResult> {
  if (!itemId.trim()) {
    return {
      success: false,
      errors: [
        "Navigation item ID is required.",
      ],
    };
  }

  try {
    const supabase = await createClient();

    const {
      data: existingItem,
      error: loadError,
    } = await supabase
      .from("site_navigation_items")
      .select("*")
      .eq("id", itemId)
      .single();

    if (loadError) {
      return {
        success: false,
        errors: [loadError.message],
      };
    }

    const {
      id: _id,
      created_at: _createdAt,
      updated_at: _updatedAt,
      ...copy
    } = existingItem as NavigationItem;

    const { error } = await supabase
      .from("site_navigation_items")
      .insert({
        ...copy,
        label: `${copy.label} Copy`,
        is_published: false,
      });

    if (error) {
      return {
        success: false,
        errors: [error.message],
      };
    }

    revalidateHeaderPages();

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error(
      "Unexpected error duplicating navigation item:",
      error,
    );

    return {
      success: false,
      errors: [
        getErrorMessage(
          error,
          "Unable to duplicate navigation item.",
        ),
      ],
    };
  }
}

export async function reorderNavigationItems(
  items: Array<{
    id: string;
    display_order: number;
  }>,
): Promise<ActionResult> {
  if (items.length === 0) {
    return {
      success: true,
      errors: [],
    };
  }

  try {
    const supabase = await createClient();

    const results = await Promise.all(
      items.map((item) =>
        supabase
          .from("site_navigation_items")
          .update({
            display_order:
              Number(item.display_order),
          })
          .eq("id", item.id),
      ),
    );

    const failedResult = results.find(
      (result) => result.error,
    );

    if (failedResult?.error) {
      return {
        success: false,
        errors: [
          failedResult.error.message,
        ],
      };
    }

    revalidateHeaderPages();

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error(
      "Unexpected error reordering navigation items:",
      error,
    );

    return {
      success: false,
      errors: [
        getErrorMessage(
          error,
          "Unable to reorder navigation items.",
        ),
      ],
    };
  }
}

export async function toggleNavigationItemActive(
  itemId: string,
  isActive: boolean,
): Promise<ActionResult> {
  return updateNavigationItem(itemId, {
    is_active: isActive,
  });
}

export async function toggleNavigationItemPublished(
  itemId: string,
  isPublished: boolean,
): Promise<ActionResult> {
  return updateNavigationItem(itemId, {
    is_published: isPublished,
  });
}