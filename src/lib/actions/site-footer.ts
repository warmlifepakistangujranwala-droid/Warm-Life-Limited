"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type {
  ActionResult,
  CreateFooterNavigationItemInput,
  CreateFooterSocialLinkInput,
  FooterServiceLink,
  SiteFooterContact,
  SiteFooterData,
  SiteFooterNavigationItem,
  SiteFooterSettings,
  SiteFooterSocialLink,
  UpdateFooterNavigationItemInput,
  UpdateFooterSocialLinkInput,
  UpdateSiteFooterContactInput,
  UpdateSiteFooterSettingsInput,
} from "@/lib/types/site-footer";

const FOOTER_ADMIN_PATH =
  "/admin/website/footer";

function revalidateFooterPages(): void {
  revalidatePath("/");
  revalidatePath("/admin/website");
  revalidatePath(FOOTER_ADMIN_PATH);
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

type RawHomepageService = {
  id: string;
  service_name?: string | null;
  short_title?: string | null;
  title?: string | null;
  slug?: string | null;
  button_link?: string | null;
  display_order?: number | null;
  is_active?: boolean | null;
  is_published?: boolean | null;
};

function mapServiceLink(
  service: RawHomepageService,
): FooterServiceLink {
  const title =
    service.service_name?.trim() ||
    service.short_title?.trim() ||
    service.title?.trim() ||
    "Service";

  const href =
    service.button_link?.trim() ||
    (service.slug?.trim()
      ? `/services/${service.slug.trim()}`
      : `/services/${service.id}`);

  return {
    id: service.id,
    title,
    href,
    display_order:
      Number(service.display_order ?? 0),
  };
}

export async function getSiteFooterData(): Promise<SiteFooterData> {
  try {
    const supabase = await createClient();

    const [
      settingsResult,
      navigationResult,
      contactResult,
      socialResult,
      servicesResult,
    ] = await Promise.all([
      supabase
        .from("site_footer_settings")
        .select("*")
        .limit(1)
        .maybeSingle(),

      supabase
        .from("site_footer_navigation")
        .select("*")
        .order("section_name", {
          ascending: true,
        })
        .order("display_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        }),

      supabase
        .from("site_footer_contact")
        .select("*")
        .limit(1)
        .maybeSingle(),

      supabase
        .from("site_footer_social_links")
        .select("*")
        .order("display_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        }),

      supabase
        .from("homepage_services")
        .select("*")
        .eq("is_active", true)
        .eq("is_published", true)
        .order("display_order", {
          ascending: true,
        }),
    ]);

    if (settingsResult.error) {
      console.error(
        "Failed to load footer settings:",
        settingsResult.error.message,
      );
    }

    if (navigationResult.error) {
      console.error(
        "Failed to load footer navigation:",
        navigationResult.error.message,
      );
    }

    if (contactResult.error) {
      console.error(
        "Failed to load footer contact:",
        contactResult.error.message,
      );
    }

    if (socialResult.error) {
      console.error(
        "Failed to load footer social links:",
        socialResult.error.message,
      );
    }

    if (servicesResult.error) {
      console.error(
        "Failed to load footer services:",
        servicesResult.error.message,
      );
    }

    const services = (
      (servicesResult.data as
        | RawHomepageService[]
        | null) ?? []
    )
      .map(mapServiceLink)
      .sort(
        (first, second) =>
          first.display_order -
          second.display_order,
      );

    return {
      settings:
        (settingsResult.data as
          | SiteFooterSettings
          | null) ?? null,

      navigation:
        (navigationResult.data as
          | SiteFooterNavigationItem[]
          | null) ?? [],

      contact:
        (contactResult.data as
          | SiteFooterContact
          | null) ?? null,

      socialLinks:
        (socialResult.data as
          | SiteFooterSocialLink[]
          | null) ?? [],

      services,
    };
  } catch (error) {
    console.error(
      "Unexpected error loading site footer data:",
      error,
    );

    return {
      settings: null,
      navigation: [],
      contact: null,
      socialLinks: [],
      services: [],
    };
  }
}

export async function getSiteFooterSettings(): Promise<SiteFooterSettings | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("site_footer_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Failed to load footer settings:",
        error.message,
      );

      return null;
    }

    return (
      (data as SiteFooterSettings | null) ??
      null
    );
  } catch (error) {
    console.error(
      "Unexpected error loading footer settings:",
      error,
    );

    return null;
  }
}

export async function updateSiteFooterSettings(
  settingsId: string,
  input: UpdateSiteFooterSettingsInput,
): Promise<ActionResult> {
  if (!settingsId.trim()) {
    return {
      success: false,
      errors: [
        "Footer settings ID is required.",
      ],
    };
  }

  try {
    const supabase = await createClient();

    const payload: UpdateSiteFooterSettingsInput = {
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
            logo_url: cleanOptionalText(
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
              "Warm Life Limited logo",
          }
        : {}),

      ...(typeof input.company_name ===
      "string"
        ? {
            company_name:
              input.company_name.trim(),
          }
        : {}),

      ...(typeof input.company_description ===
      "string"
        ? {
            company_description:
              input.company_description.trim(),
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
              "Warm Life footer background",
          }
        : {}),

      ...(typeof input.quick_links_heading ===
      "string"
        ? {
            quick_links_heading:
              input.quick_links_heading.trim(),
          }
        : {}),

      ...(typeof input.services_heading ===
      "string"
        ? {
            services_heading:
              input.services_heading.trim(),
          }
        : {}),

      ...(typeof input.services_view_all_text ===
      "string"
        ? {
            services_view_all_text:
              input.services_view_all_text.trim(),
          }
        : {}),

      ...(typeof input.services_view_all_link ===
      "string"
        ? {
            services_view_all_link:
              input.services_view_all_link.trim() ||
              "/services",
          }
        : {}),

      ...(typeof input.legal_links_heading ===
      "string"
        ? {
            legal_links_heading:
              input.legal_links_heading.trim(),
          }
        : {}),

      ...(typeof input.contact_heading ===
      "string"
        ? {
            contact_heading:
              input.contact_heading.trim(),
          }
        : {}),

      ...(typeof input.social_heading ===
      "string"
        ? {
            social_heading:
              input.social_heading.trim(),
          }
        : {}),

      ...(typeof input.copyright_text ===
      "string"
        ? {
            copyright_text:
              input.copyright_text.trim(),
          }
        : {}),
    };

    const { error } = await supabase
      .from("site_footer_settings")
      .update(payload)
      .eq("id", settingsId);

    if (error) {
      return {
        success: false,
        errors: [error.message],
      };
    }

    revalidateFooterPages();

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error(
      "Unexpected error updating footer settings:",
      error,
    );

    return {
      success: false,
      errors: [
        getErrorMessage(
          error,
          "Unable to update footer settings.",
        ),
      ],
    };
  }
}

export async function updateSiteFooterContact(
  contactId: string,
  input: UpdateSiteFooterContactInput,
): Promise<ActionResult> {
  if (!contactId.trim()) {
    return {
      success: false,
      errors: [
        "Footer contact ID is required.",
      ],
    };
  }

  try {
    const supabase = await createClient();

    const payload: UpdateSiteFooterContactInput = {
      ...input,

      ...(typeof input.phone_label ===
      "string"
        ? {
            phone_label:
              input.phone_label.trim(),
          }
        : {}),

      ...(typeof input.phone === "string"
        ? {
            phone: input.phone.trim(),
          }
        : {}),

      ...(typeof input.phone_link ===
      "string"
        ? {
            phone_link:
              input.phone_link.trim(),
          }
        : {}),

      ...(typeof input.email_label ===
      "string"
        ? {
            email_label:
              input.email_label.trim(),
          }
        : {}),

      ...(typeof input.email === "string"
        ? {
            email: input.email.trim(),
          }
        : {}),

      ...(typeof input.email_link ===
      "string"
        ? {
            email_link:
              input.email_link.trim(),
          }
        : {}),

      ...(typeof input.address_label ===
      "string"
        ? {
            address_label:
              input.address_label.trim(),
          }
        : {}),

      ...(typeof input.address === "string"
        ? {
            address: input.address.trim(),
          }
        : {}),

      ...(typeof input.address_link ===
      "string"
        ? {
            address_link:
              cleanOptionalText(
                input.address_link,
              ),
          }
        : {}),

      ...(typeof input.working_hours_label ===
      "string"
        ? {
            working_hours_label:
              input.working_hours_label.trim(),
          }
        : {}),

      ...(typeof input.working_hours ===
      "string"
        ? {
            working_hours:
              input.working_hours.trim(),
          }
        : {}),

      ...(typeof input.map_url === "string"
        ? {
            map_url: cleanOptionalText(
              input.map_url,
            ),
          }
        : {}),
    };

    const { error } = await supabase
      .from("site_footer_contact")
      .update(payload)
      .eq("id", contactId);

    if (error) {
      return {
        success: false,
        errors: [error.message],
      };
    }

    revalidateFooterPages();

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error(
      "Unexpected error updating footer contact:",
      error,
    );

    return {
      success: false,
      errors: [
        getErrorMessage(
          error,
          "Unable to update footer contact details.",
        ),
      ],
    };
  }
}

export async function createFooterNavigationItem(
  footerId: string,
  input: CreateFooterNavigationItemInput,
): Promise<ActionResult> {
  if (!footerId.trim()) {
    return {
      success: false,
      errors: ["Footer ID is required."],
    };
  }

  if (!input.label?.trim()) {
    return {
      success: false,
      errors: ["Footer link label is required."],
    };
  }

  if (!input.href?.trim()) {
    return {
      success: false,
      errors: ["Footer link URL is required."],
    };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("site_footer_navigation")
      .insert({
        footer_id: footerId.trim(),

        section_name:
          input.section_name,

        label: cleanRequiredText(
          input.label,
        ),

        href: cleanRequiredText(
          input.href,
        ),

        open_in_new_tab:
          input.open_in_new_tab ?? false,

        display_order: Number(
          input.display_order ?? 0,
        ),

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

    revalidateFooterPages();

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error(
      "Unexpected error creating footer navigation item:",
      error,
    );

    return {
      success: false,
      errors: [
        getErrorMessage(
          error,
          "Unable to create footer navigation item.",
        ),
      ],
    };
  }
}

export async function updateFooterNavigationItem(
  itemId: string,
  input: UpdateFooterNavigationItemInput,
): Promise<ActionResult> {
  if (!itemId.trim()) {
    return {
      success: false,
      errors: [
        "Footer navigation item ID is required.",
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
        "Footer link label cannot be empty.",
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
        "Footer link URL cannot be empty.",
      ],
    };
  }

  try {
    const supabase = await createClient();

    const payload: UpdateFooterNavigationItemInput = {
      ...input,

      ...(typeof input.label === "string"
        ? {
            label: input.label.trim(),
          }
        : {}),

      ...(typeof input.href === "string"
        ? {
            href: input.href.trim(),
          }
        : {}),
    };

    const { error } = await supabase
      .from("site_footer_navigation")
      .update(payload)
      .eq("id", itemId);

    if (error) {
      return {
        success: false,
        errors: [error.message],
      };
    }

    revalidateFooterPages();

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error(
      "Unexpected error updating footer navigation item:",
      error,
    );

    return {
      success: false,
      errors: [
        getErrorMessage(
          error,
          "Unable to update footer navigation item.",
        ),
      ],
    };
  }
}

export async function deleteFooterNavigationItem(
  itemId: string,
): Promise<ActionResult> {
  if (!itemId.trim()) {
    return {
      success: false,
      errors: [
        "Footer navigation item ID is required.",
      ],
    };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("site_footer_navigation")
      .delete()
      .eq("id", itemId);

    if (error) {
      return {
        success: false,
        errors: [error.message],
      };
    }

    revalidateFooterPages();

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error(
      "Unexpected error deleting footer navigation item:",
      error,
    );

    return {
      success: false,
      errors: [
        getErrorMessage(
          error,
          "Unable to delete footer navigation item.",
        ),
      ],
    };
  }
}

export async function createFooterSocialLink(
  footerId: string,
  input: CreateFooterSocialLinkInput,
): Promise<ActionResult> {
  if (!footerId.trim()) {
    return {
      success: false,
      errors: ["Footer ID is required."],
    };
  }

  if (!input.platform?.trim()) {
    return {
      success: false,
      errors: [
        "Social platform is required.",
      ],
    };
  }

  if (!input.label?.trim()) {
    return {
      success: false,
      errors: [
        "Social link label is required.",
      ],
    };
  }

  if (!input.url?.trim()) {
    return {
      success: false,
      errors: [
        "Social link URL is required.",
      ],
    };
  }

  if (!input.icon_name?.trim()) {
    return {
      success: false,
      errors: [
        "Social icon name is required.",
      ],
    };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("site_footer_social_links")
      .insert({
        footer_id: footerId.trim(),

        platform:
          input.platform.trim(),

        label: input.label.trim(),

        url: input.url.trim(),

        icon_name:
          input.icon_name.trim(),

        open_in_new_tab:
          input.open_in_new_tab ?? true,

        display_order: Number(
          input.display_order ?? 0,
        ),

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

    revalidateFooterPages();

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error(
      "Unexpected error creating footer social link:",
      error,
    );

    return {
      success: false,
      errors: [
        getErrorMessage(
          error,
          "Unable to create footer social link.",
        ),
      ],
    };
  }
}

export async function updateFooterSocialLink(
  linkId: string,
  input: UpdateFooterSocialLinkInput,
): Promise<ActionResult> {
  if (!linkId.trim()) {
    return {
      success: false,
      errors: [
        "Social link ID is required.",
      ],
    };
  }

  try {
    const supabase = await createClient();

    const payload: UpdateFooterSocialLinkInput = {
      ...input,

      ...(typeof input.platform === "string"
        ? {
            platform:
              input.platform.trim(),
          }
        : {}),

      ...(typeof input.label === "string"
        ? {
            label: input.label.trim(),
          }
        : {}),

      ...(typeof input.url === "string"
        ? {
            url: input.url.trim(),
          }
        : {}),

      ...(typeof input.icon_name ===
      "string"
        ? {
            icon_name:
              input.icon_name.trim(),
          }
        : {}),
    };

    const { error } = await supabase
      .from("site_footer_social_links")
      .update(payload)
      .eq("id", linkId);

    if (error) {
      return {
        success: false,
        errors: [error.message],
      };
    }

    revalidateFooterPages();

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error(
      "Unexpected error updating footer social link:",
      error,
    );

    return {
      success: false,
      errors: [
        getErrorMessage(
          error,
          "Unable to update footer social link.",
        ),
      ],
    };
  }
}

export async function deleteFooterSocialLink(
  linkId: string,
): Promise<ActionResult> {
  if (!linkId.trim()) {
    return {
      success: false,
      errors: [
        "Social link ID is required.",
      ],
    };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("site_footer_social_links")
      .delete()
      .eq("id", linkId);

    if (error) {
      return {
        success: false,
        errors: [error.message],
      };
    }

    revalidateFooterPages();

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error(
      "Unexpected error deleting footer social link:",
      error,
    );

    return {
      success: false,
      errors: [
        getErrorMessage(
          error,
          "Unable to delete footer social link.",
        ),
      ],
    };
  }
}

export async function toggleFooterNavigationItemActive(
  itemId: string,
  isActive: boolean,
): Promise<ActionResult> {
  return updateFooterNavigationItem(
    itemId,
    {
      is_active: isActive,
    },
  );
}

export async function toggleFooterNavigationItemPublished(
  itemId: string,
  isPublished: boolean,
): Promise<ActionResult> {
  return updateFooterNavigationItem(
    itemId,
    {
      is_published: isPublished,
    },
  );
}

export async function toggleFooterSocialLinkActive(
  linkId: string,
  isActive: boolean,
): Promise<ActionResult> {
  return updateFooterSocialLink(linkId, {
    is_active: isActive,
  });
}

export async function toggleFooterSocialLinkPublished(
  linkId: string,
  isPublished: boolean,
): Promise<ActionResult> {
  return updateFooterSocialLink(linkId, {
    is_published: isPublished,
  });
}