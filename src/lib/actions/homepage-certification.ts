"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type {
  CreateHomepageCertificationInput,
  HomepageCertification,
  HomepageCertificationsData,
  HomepageCertificationsSection,
  UpdateHomepageCertificationInput,
  UpdateHomepageCertificationsSectionInput,
} from "@/lib/types/homepage-certification";

type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

function refreshCertificatesPages(): void {
  revalidatePath("/");
  revalidatePath("/admin/website/homepage");
  revalidatePath(
    "/admin/website/homepage/certifications",
  );
}

export async function getHomepageCertificationsData(): Promise<HomepageCertificationsData> {
  const supabase = await createClient();

  const [
    { data: section, error: sectionError },
    { data: certifications, error: certificationsError },
  ] = await Promise.all([
    supabase
      .from("homepage_certifications_section")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle(),
    supabase
      .from("certifications")
      .select("*")
      .eq("is_active", true)
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  if (sectionError) {
    console.error(
      "Failed to load homepage certifications section:",
      sectionError.message,
    );
  }

  if (certificationsError) {
    console.error(
      "Failed to load homepage certifications:",
      certificationsError.message,
    );
  }

  return {
    section:
      (section as HomepageCertificationsSection | null) ??
      null,
    certifications:
      (certifications as HomepageCertification[] | null) ??
      [],
  };
}

export async function createHomepageCertification(
  input: CreateHomepageCertificationInput,
): Promise<ActionResult<HomepageCertification>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("certifications")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  refreshCertificatesPages();

  return {
    success: true,
    data: data as HomepageCertification,
  };
}

export async function updateHomepageCertification(
  id: string,
  input: UpdateHomepageCertificationInput,
): Promise<ActionResult<HomepageCertification>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("certifications")
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

  refreshCertificatesPages();

  return {
    success: true,
    data: data as HomepageCertification,
  };
}

export async function deleteHomepageCertification(
  id: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: item, error: loadError } =
    await supabase
      .from("certifications")
      .select("logo_storage_path")
      .eq("id", id)
      .maybeSingle();

  if (loadError) {
    return {
      success: false,
      errors: [loadError.message],
    };
  }

  const { error } = await supabase
    .from("certifications")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  if (item?.logo_storage_path) {
    const { error: storageError } =
      await supabase.storage
        .from("website-media")
        .remove([item.logo_storage_path]);

    if (storageError) {
      console.error(
        "Certificate deleted, but logo cleanup failed:",
        storageError.message,
      );
    }
  }

  refreshCertificatesPages();

  return {
    success: true,
    data: null,
  };
}

export async function updateHomepageCertificationsSection(
  id: string,
  input: UpdateHomepageCertificationsSectionInput,
): Promise<
  ActionResult<HomepageCertificationsSection>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homepage_certifications_section")
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

  refreshCertificatesPages();

  return {
    success: true,
    data: data as HomepageCertificationsSection,
  };
}
