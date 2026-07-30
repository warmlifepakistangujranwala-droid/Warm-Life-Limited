"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type {
  CreateHomepagePartnerInput,
  HomepagePartner,
  HomepagePartnersData,
  HomepagePartnersSection,
  UpdateHomepagePartnerInput,
  UpdateHomepagePartnersSectionInput,
} from "@/lib/types/homepage-partner";

type ActionResult<T = null> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errors: string[];
    };

function refreshPartnersPages(): void {
  revalidatePath("/");
  revalidatePath("/admin/website/homepage");
  revalidatePath("/admin/website/homepage/partners");
}

export async function getHomepagePartnersData(): Promise<HomepagePartnersData> {
  const supabase = await createClient();

  const [
    { data: section, error: sectionError },
    { data: partners, error: partnersError },
  ] = await Promise.all([
    supabase
      .from("homepage_partners_section")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle(),

    supabase
      .from("homepage_partners")
      .select("*")
      .eq("is_active", true)
      .eq("is_published", true)
      .order("display_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      }),
  ]);

  if (sectionError) {
    console.error(
      "Failed to load homepage partners section:",
      sectionError.message,
    );
  }

  if (partnersError) {
    console.error(
      "Failed to load homepage partners:",
      partnersError.message,
    );
  }

  return {
    section:
      (section as HomepagePartnersSection | null) ??
      null,

    partners:
      (partners as HomepagePartner[] | null) ??
      [],
  };
}

export async function createHomepagePartner(
  input: CreateHomepagePartnerInput,
): Promise<ActionResult<HomepagePartner>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homepage_partners")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  refreshPartnersPages();

  return {
    success: true,
    data: data as HomepagePartner,
  };
}

export async function updateHomepagePartner(
  id: string,
  input: UpdateHomepagePartnerInput,
): Promise<ActionResult<HomepagePartner>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homepage_partners")
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

  refreshPartnersPages();

  return {
    success: true,
    data: data as HomepagePartner,
  };
}

export async function deleteHomepagePartner(
  id: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("homepage_partners")
    .select("logo_storage_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("homepage_partners")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  if (item?.logo_storage_path) {
    await supabase.storage
      .from("website-media")
      .remove([item.logo_storage_path]);
  }

  refreshPartnersPages();

  return {
    success: true,
    data: null,
  };
}

export async function updateHomepagePartnersSection(
  id: string,
  input: UpdateHomepagePartnersSectionInput,
): Promise<ActionResult<HomepagePartnersSection>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homepage_partners_section")
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

  refreshPartnersPages();

  return {
    success: true,
    data: data as HomepagePartnersSection,
  };
}