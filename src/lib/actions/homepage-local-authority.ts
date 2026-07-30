"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type {
  CreateHomepageLocalAuthorityInput,
  HomepageLocalAuthoritiesData,
  HomepageLocalAuthoritiesSection,
  HomepageLocalAuthority,
} from "@/lib/types/homepage-local-authority";

type ActionResult = {
  success: boolean;
  errors: string[];
};

const ADMIN_PATH =
  "/admin/website/homepage/local-authorities";

const HOMEPAGE_PATH = "/";

function cleanNullableText(
  value: string | null | undefined,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const cleanedValue = value.trim();

  return cleanedValue.length > 0
    ? cleanedValue
    : null;
}

function validateUrl(
  value: string | null | undefined,
  fieldName: string,
  required = false,
): string[] {
  const cleanedValue =
    cleanNullableText(value);

  if (!cleanedValue) {
    return required
      ? [`${fieldName} is required.`]
      : [];
  }

  try {
    const parsedUrl = new URL(cleanedValue);

    if (
      parsedUrl.protocol !== "http:" &&
      parsedUrl.protocol !== "https:"
    ) {
      return [
        `${fieldName} must use http or https.`,
      ];
    }

    return [];
  } catch {
    return [
      `${fieldName} must be a valid URL.`,
    ];
  }
}

function validateCreateInput(
  input: CreateHomepageLocalAuthorityInput,
): string[] {
  const errors: string[] = [];

  if (!input.section_id?.trim()) {
    errors.push(
      "Local authority section ID is required.",
    );
  }

  if (!input.name?.trim()) {
    errors.push(
      "Local authority name is required.",
    );
  }

  errors.push(
    ...validateUrl(
      input.logo_url,
      "Logo URL",
      true,
    ),
  );

  errors.push(
    ...validateUrl(
      input.website_url,
      "Website URL",
      false,
    ),
  );

  if (
    input.display_order !== undefined &&
    (!Number.isInteger(
      input.display_order,
    ) ||
      input.display_order < 0)
  ) {
    errors.push(
      "Display order must be a whole number greater than or equal to zero.",
    );
  }

  return errors;
}

function revalidateLocalAuthorities(): void {
  revalidatePath(ADMIN_PATH);
  revalidatePath(HOMEPAGE_PATH);
}

export async function getHomepageLocalAuthoritiesData(): Promise<HomepageLocalAuthoritiesData> {
  const supabase = await createClient();

  const [
    sectionResult,
    localAuthoritiesResult,
  ] = await Promise.all([
    supabase
      .from(
        "homepage_local_authorities_section",
      )
      .select("*")
      .order("created_at", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("homepage_local_authorities")
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
    "Failed to load homepage local authorities section:",
    sectionResult.error.message,
    sectionResult.error.code,
    sectionResult.error.details,
    sectionResult.error.hint,
  );
}

  if (localAuthoritiesResult.error) {
  console.error(
    "Failed to load homepage local authorities:",
    localAuthoritiesResult.error.message,
    localAuthoritiesResult.error.code,
    localAuthoritiesResult.error.details,
    localAuthoritiesResult.error.hint,
  );
}

  return {
    section:
      (sectionResult.data as HomepageLocalAuthoritiesSection | null) ??
      null,

    localAuthorities:
      (localAuthoritiesResult.data as HomepageLocalAuthority[] | null) ??
      [],
  };
}

export async function createHomepageLocalAuthority(
  input: CreateHomepageLocalAuthorityInput,
): Promise<ActionResult> {
  const errors =
    validateCreateInput(input);

  if (errors.length > 0) {
    return {
      success: false,
      errors,
    };
  }

  const supabase = await createClient();

  const sectionId =
    input.section_id.trim();

  const {
    data: section,
    error: sectionError,
  } = await supabase
    .from(
      "homepage_local_authorities_section",
    )
    .select("id")
    .eq("id", sectionId)
    .maybeSingle();

  if (sectionError) {
    return {
      success: false,
      errors: [
        `Unable to verify local authority section: ${sectionError.message}`,
      ],
    };
  }

  if (!section) {
    return {
      success: false,
      errors: [
        "The selected local authority section does not exist.",
      ],
    };
  }

  const { error } = await supabase
    .from("homepage_local_authorities")
    .insert({
      section_id: sectionId,

      name: input.name.trim(),

      logo_url: input.logo_url.trim(),

      logo_storage_path:
        cleanNullableText(
          input.logo_storage_path,
        ),

      website_url:
        cleanNullableText(
          input.website_url,
        ),

      open_in_new_tab:
        input.open_in_new_tab ?? true,

      display_order:
        input.display_order ?? 0,

      is_active:
        input.is_active ?? true,

      is_published:
        input.is_published ?? true,
    });

  if (error) {
    return {
      success: false,
      errors: [
        `Unable to create local authority: ${error.message}`,
      ],
    };
  }

  revalidateLocalAuthorities();

  return {
    success: true,
    errors: [],
  };
}
export async function updateHomepageLocalAuthority(
  id: string,
  input: Partial<CreateHomepageLocalAuthorityInput>,
): Promise<ActionResult> {
  const errors: string[] = [];

  if (!id?.trim()) {
    errors.push(
      "Local authority ID is required.",
    );
  }

  if (
    input.name !== undefined &&
    !input.name.trim()
  ) {
    errors.push(
      "Local authority name is required.",
    );
  }

  if (input.logo_url !== undefined) {
    errors.push(
      ...validateUrl(
        input.logo_url,
        "Logo URL",
        true,
      ),
    );
  }

  if (input.website_url !== undefined) {
    errors.push(
      ...validateUrl(
        input.website_url,
        "Website URL",
        false,
      ),
    );
  }

  if (
    input.display_order !== undefined &&
    (!Number.isInteger(
      input.display_order,
    ) ||
      input.display_order < 0)
  ) {
    errors.push(
      "Display order must be a whole number greater than or equal to zero.",
    );
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors,
    };
  }

  const updates: Record<string, unknown> = {};

  if (input.section_id !== undefined) {
    updates.section_id =
      input.section_id.trim();
  }

  if (input.name !== undefined) {
    updates.name =
      input.name.trim();
  }

  if (input.logo_url !== undefined) {
    updates.logo_url =
      input.logo_url.trim();
  }

  if (
    input.logo_storage_path !== undefined
  ) {
    updates.logo_storage_path =
      cleanNullableText(
        input.logo_storage_path,
      );
  }

  if (input.website_url !== undefined) {
    updates.website_url =
      cleanNullableText(
        input.website_url,
      );
  }

  if (
    input.open_in_new_tab !== undefined
  ) {
    updates.open_in_new_tab =
      input.open_in_new_tab;
  }

  if (
    input.display_order !== undefined
  ) {
    updates.display_order =
      input.display_order;
  }

  if (input.is_active !== undefined) {
    updates.is_active =
      input.is_active;
  }

  if (
    input.is_published !== undefined
  ) {
    updates.is_published =
      input.is_published;
  }

  if (Object.keys(updates).length === 0) {
    return {
      success: false,
      errors: [
        "No local authority changes were provided.",
      ],
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("homepage_local_authorities")
    .update(updates)
    .eq("id", id.trim());

  if (error) {
    return {
      success: false,
      errors: [
        `Unable to update local authority: ${error.message}`,
      ],
    };
  }

  revalidateLocalAuthorities();

  return {
    success: true,
    errors: [],
  };
}

export async function deleteHomepageLocalAuthority(
  id: string,
): Promise<ActionResult> {
  if (!id?.trim()) {
    return {
      success: false,
      errors: [
        "Local authority ID is required.",
      ],
    };
  }

  const supabase = await createClient();

  const {
    data: localAuthority,
    error: fetchError,
  } = await supabase
    .from("homepage_local_authorities")
    .select("logo_storage_path")
    .eq("id", id.trim())
    .maybeSingle();

  if (fetchError) {
    return {
      success: false,
      errors: [
        `Unable to load local authority before deletion: ${fetchError.message}`,
      ],
    };
  }

  const { error: deleteError } =
    await supabase
      .from("homepage_local_authorities")
      .delete()
      .eq("id", id.trim());

  if (deleteError) {
    return {
      success: false,
      errors: [
        `Unable to delete local authority: ${deleteError.message}`,
      ],
    };
  }

  if (
    localAuthority?.logo_storage_path
  ) {
    const { error: storageError } =
      await supabase.storage
        .from("website-media")
        .remove([
          localAuthority.logo_storage_path,
        ]);

    if (storageError) {
      console.error(
        "Local authority deleted, but logo removal failed:",
        storageError,
      );
    }
  }

  revalidateLocalAuthorities();

  return {
    success: true,
    errors: [],
  };
}

export async function updateHomepageLocalAuthoritiesSection(
  id: string,
  input: {
    heading?: string;
    subheading?: string;

    heading_color?: string;
    heading_size?: number;
    heading_weight?: number;

    subheading_color?: string;
    subheading_size?: number;

    background_color?: string;

    padding_top?: number;
    padding_bottom?: number;

    autoplay_speed?: number;

    is_active?: boolean;
  },
): Promise<ActionResult> {
  const errors: string[] = [];

  if (!id?.trim()) {
    errors.push(
      "Local authorities section ID is required.",
    );
  }

  if (
    input.heading !== undefined &&
    !input.heading.trim()
  ) {
    errors.push(
      "Section heading is required.",
    );
  }

  if (
    input.subheading !== undefined &&
    !input.subheading.trim()
  ) {
    errors.push(
      "Section subheading is required.",
    );
  }

  if (
    input.heading_size !== undefined &&
    (!Number.isFinite(
      input.heading_size,
    ) ||
      input.heading_size < 10 ||
      input.heading_size > 160)
  ) {
    errors.push(
      "Heading size must be between 10 and 160.",
    );
  }

  if (
    input.heading_weight !== undefined &&
    (!Number.isInteger(
      input.heading_weight,
    ) ||
      input.heading_weight < 100 ||
      input.heading_weight > 900)
  ) {
    errors.push(
      "Heading weight must be between 100 and 900.",
    );
  }

  if (
    input.subheading_size !== undefined &&
    (!Number.isFinite(
      input.subheading_size,
    ) ||
      input.subheading_size < 10 ||
      input.subheading_size > 80)
  ) {
    errors.push(
      "Subheading size must be between 10 and 80.",
    );
  }

  if (
    input.padding_top !== undefined &&
    (!Number.isFinite(
      input.padding_top,
    ) ||
      input.padding_top < 0 ||
      input.padding_top > 400)
  ) {
    errors.push(
      "Top padding must be between 0 and 400.",
    );
  }

  if (
    input.padding_bottom !== undefined &&
    (!Number.isFinite(
      input.padding_bottom,
    ) ||
      input.padding_bottom < 0 ||
      input.padding_bottom > 400)
  ) {
    errors.push(
      "Bottom padding must be between 0 and 400.",
    );
  }

  if (
    input.autoplay_speed !== undefined &&
    (!Number.isFinite(
      input.autoplay_speed,
    ) ||
      input.autoplay_speed < 1 ||
      input.autoplay_speed > 500)
  ) {
    errors.push(
      "Autoplay speed must be between 1 and 500.",
    );
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors,
    };
  }

  const updates: Record<string, unknown> = {};

  if (input.heading !== undefined) {
    updates.heading =
      input.heading.trim();
  }

  if (input.subheading !== undefined) {
    updates.subheading =
      input.subheading.trim();
  }

  if (
    input.heading_color !== undefined
  ) {
    updates.heading_color =
      input.heading_color.trim();
  }

  if (
    input.heading_size !== undefined
  ) {
    updates.heading_size =
      input.heading_size;
  }

  if (
    input.heading_weight !== undefined
  ) {
    updates.heading_weight =
      input.heading_weight;
  }

  if (
    input.subheading_color !== undefined
  ) {
    updates.subheading_color =
      input.subheading_color.trim();
  }

  if (
    input.subheading_size !== undefined
  ) {
    updates.subheading_size =
      input.subheading_size;
  }

  if (
    input.background_color !== undefined
  ) {
    updates.background_color =
      input.background_color.trim();
  }

  if (
    input.padding_top !== undefined
  ) {
    updates.padding_top =
      input.padding_top;
  }

  if (
    input.padding_bottom !== undefined
  ) {
    updates.padding_bottom =
      input.padding_bottom;
  }

  if (
    input.autoplay_speed !== undefined
  ) {
    updates.autoplay_speed =
      input.autoplay_speed;
  }

  if (input.is_active !== undefined) {
    updates.is_active =
      input.is_active;
  }

  if (Object.keys(updates).length === 0) {
    return {
      success: false,
      errors: [
        "No section changes were provided.",
      ],
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from(
      "homepage_local_authorities_section",
    )
    .update(updates)
    .eq("id", id.trim());

  if (error) {
    return {
      success: false,
      errors: [
        `Unable to update local authorities section: ${error.message}`,
      ],
    };
  }

  revalidateLocalAuthorities();

  return {
    success: true,
    errors: [],
  };
}