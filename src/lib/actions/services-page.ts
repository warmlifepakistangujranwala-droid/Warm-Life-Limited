/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/lib/actions/services-page.ts
 *
 * Purpose :
 * Provides server-side queries and mutations for the
 * independent Website Services page CMS.
 *
 * Version : v1.2.3
 * ============================================================
 */

"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import {
  createServiceBenefitSchema,
  createServiceGalleryItemSchema,
  createServiceHeroSlideSchema,
  createServiceProcessStepSchema,
  createServiceSchema,
  updateServiceBenefitSchema,
  updateServiceGalleryItemSchema,
  updateServiceHeroSlideSchema,
  updateServiceProcessStepSchema,
  updateServiceSchema,
  updateServicesPageSettingsSchema,
} from "@/lib/validations/services-page";

import type {
  CreateServiceBenefitInput,
  CreateServiceGalleryItemInput,
  CreateServiceHeroSlideInput,
  CreateServiceInput,
  CreateServiceProcessStepInput,
  Service,
  ServiceActionResult,
  ServiceBenefit,
  ServiceDetailData,
  ServiceGalleryItem,
  ServiceHeroSlide,
  ServiceProcessStep,
  ServicesPageData,
  ServicesPageSettings,
  UpdateServiceBenefitInput,
  UpdateServiceGalleryItemInput,
  UpdateServiceHeroSlideInput,
  UpdateServiceInput,
  UpdateServiceProcessStepInput,
  UpdateServicesPageSettingsInput,
} from "@/lib/types/services-page";

const SETTINGS_TABLE =
  "service_page_settings";

const HERO_SLIDES_TABLE =
  "service_hero_slides";

const SERVICES_TABLE =
  "services";

const BENEFITS_TABLE =
  "website_service_benefits";

const PROCESS_STEPS_TABLE =
  "website_service_process_steps";

const GALLERY_TABLE =
  "website_service_gallery";

function logSupabaseError(
  context: string,
  error: {
    message?: string;
    details?: string;
    hint?: string;
    code?: string;
  },
): void {
  const message =
    error.message ??
    "Unknown Supabase error";

  const code =
    error.code ?? "NO_CODE";

  const details =
    error.details ?? "No details";

  const hint =
    error.hint ?? "No hint";

  console.error(
    `${context} | code=${code} | message=${message} | details=${details} | hint=${hint}`,
  );
}

function revalidateServicesPaths(
  serviceId?: string,
  slug?: string,
): void {
  revalidatePath("/services");
  revalidatePath(
    "/admin/website/services",
  );
  revalidatePath(
    "/admin/website/services/settings",
  );
  revalidatePath(
    "/admin/website/services/hero",
  );
  revalidatePath(
    "/admin/website/services/new",
  );

  if (serviceId) {
    revalidatePath(
      `/admin/website/services/${serviceId}/edit`,
    );
  }

  if (slug) {
    revalidatePath(
      `/services/${slug}`,
    );
  }
}

async function getServiceSlugById(
  serviceId: string,
): Promise<string | null> {
  if (!serviceId) {
    return null;
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(SERVICES_TABLE)
      .select("slug")
      .eq("id", serviceId)
      .maybeSingle();

  if (error) {
    logSupabaseError(
      "Failed to resolve Service slug:",
      error,
    );

    return null;
  }

  return data?.slug ?? null;
}

function validationFailure(
  errors: Record<
    string,
    string[] | undefined
  >,
): ServiceActionResult {
  return {
    success: false,
    message: "Validation failed.",
    errors,
  };
}

/* ============================================================
 * PAGE SETTINGS
 * ============================================================
 */

export async function getServicesPageSettings(): Promise<
  ServicesPageSettings | null
> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(SETTINGS_TABLE)
      .select("*")
      .order(
        "created_at",
        { ascending: true },
      )
      .limit(1)
      .maybeSingle();

  if (error) {
    logSupabaseError(
      "Failed to load Services page settings:",
      error,
    );

    return null;
  }

  return (
    data as ServicesPageSettings | null
  );
}

export async function updateServicesPageSettings(
  id: string,
  values: UpdateServicesPageSettingsInput,
): Promise<ServiceActionResult> {
  if (!id) {
    return {
      success: false,
      message:
        "Services page settings ID is required.",
    };
  }

  const parsed =
    updateServicesPageSettingsSchema.safeParse(
      values,
    );

  if (!parsed.success) {
    return validationFailure(
      parsed.error.flatten().fieldErrors,
    );
  }

  if (
    Object.keys(parsed.data).length ===
    0
  ) {
    return {
      success: false,
      message:
        "No settings changes were provided.",
    };
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(SETTINGS_TABLE)
      .update(parsed.data)
      .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateServicesPaths();

  return {
    success: true,
    message:
      "Services page settings updated successfully.",
  };
}

/* ============================================================
 * HERO SLIDES
 * ============================================================
 */

export async function getServiceHeroSlides(): Promise<
  ServiceHeroSlide[]
> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(HERO_SLIDES_TABLE)
      .select("*")
      .order(
        "display_order",
        { ascending: true },
      )
      .order(
        "created_at",
        { ascending: true },
      );

  if (error) {
    logSupabaseError(
      "Failed to load Services hero slides:",
      error,
    );

    return [];
  }

  return (
    data as ServiceHeroSlide[]
  );
}

export async function getPublishedServiceHeroSlides(): Promise<
  ServiceHeroSlide[]
> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(HERO_SLIDES_TABLE)
      .select("*")
      .eq("is_active", true)
      .eq("is_published", true)
      .order(
        "display_order",
        { ascending: true },
      )
      .order(
        "created_at",
        { ascending: true },
      );

  if (error) {
    logSupabaseError(
      "Failed to load published Services hero slides:",
      error,
    );

    return [];
  }

  return (
    data as ServiceHeroSlide[]
  );
}

export async function getServiceHeroSlideById(
  id: string,
): Promise<ServiceHeroSlide | null> {
  if (!id) {
    return null;
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(HERO_SLIDES_TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();

  if (error) {
    logSupabaseError(
      "Failed to load Services hero slide:",
      error,
    );

    return null;
  }

  return (
    data as ServiceHeroSlide | null
  );
}

export async function createServiceHeroSlide(
  servicesPageId: string,
  values: CreateServiceHeroSlideInput,
): Promise<ServiceActionResult> {
  if (!servicesPageId) {
    return {
      success: false,
      message:
        "Services page ID is required.",
    };
  }

  const parsed =
    createServiceHeroSlideSchema.safeParse(
      values,
    );

  if (!parsed.success) {
    return validationFailure(
      parsed.error.flatten().fieldErrors,
    );
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(HERO_SLIDES_TABLE)
      .insert({
        services_page_id:
          servicesPageId,
        ...parsed.data,
      });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateServicesPaths();

  return {
    success: true,
    message:
      "Services hero slide created successfully.",
  };
}

export async function updateServiceHeroSlide(
  id: string,
  values: UpdateServiceHeroSlideInput,
): Promise<ServiceActionResult> {
  if (!id) {
    return {
      success: false,
      message:
        "Hero slide ID is required.",
    };
  }

  const parsed =
    updateServiceHeroSlideSchema.safeParse(
      values,
    );

  if (!parsed.success) {
    return validationFailure(
      parsed.error.flatten().fieldErrors,
    );
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(HERO_SLIDES_TABLE)
      .update(parsed.data)
      .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateServicesPaths();

  return {
    success: true,
    message:
      "Services hero slide updated successfully.",
  };
}

export async function deleteServiceHeroSlide(
  id: string,
): Promise<ServiceActionResult> {
  if (!id) {
    return {
      success: false,
      message:
        "Hero slide ID is required.",
    };
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(HERO_SLIDES_TABLE)
      .delete()
      .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateServicesPaths();

  return {
    success: true,
    message:
      "Services hero slide deleted successfully.",
  };
}

/* ============================================================
 * SERVICES
 * ============================================================
 */

export async function getServices(): Promise<
  Service[]
> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(SERVICES_TABLE)
      .select("*")
      .order(
        "display_order",
        { ascending: true },
      )
      .order(
        "created_at",
        { ascending: true },
      );

  if (error) {
    logSupabaseError(
      "Failed to load Services:",
      error,
    );

    return [];
  }

  return data as Service[];
}

export async function getPublishedServices(): Promise<
  Service[]
> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(SERVICES_TABLE)
      .select("*")
      .eq("is_active", true)
      .eq("is_published", true)
      .order(
        "display_order",
        { ascending: true },
      )
      .order(
        "created_at",
        { ascending: true },
      );

  if (error) {
    logSupabaseError(
      "Failed to load published Services:",
      error,
    );

    return [];
  }

  return data as Service[];
}

export async function getServiceById(
  id: string,
): Promise<Service | null> {
  if (!id) {
    return null;
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(SERVICES_TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();

  if (error) {
    logSupabaseError(
      "Failed to load Service:",
      error,
    );

    return null;
  }

  return data as Service | null;
}

export async function getPublishedServiceBySlug(
  slug: string,
): Promise<Service | null> {
  if (!slug) {
    return null;
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(SERVICES_TABLE)
      .select("*")
      .eq("slug", slug)
      .eq("has_detail_page", true)
      .eq("is_active", true)
      .eq("is_published", true)
      .maybeSingle();

  if (error) {
    logSupabaseError(
      "Failed to load published Service:",
      error,
    );

    return null;
  }

  return data as Service | null;
}

export async function createService(
  values: CreateServiceInput,
): Promise<ServiceActionResult> {
  const parsed =
    createServiceSchema.safeParse(
      values,
    );

  if (!parsed.success) {
    console.error(
      "CREATE SERVICE VALIDATION ERROR:",
      JSON.stringify(
        parsed.error.flatten(),
        null,
        2,
      ),
    );

    return validationFailure(
      parsed.error.flatten().fieldErrors,
    );
  }

  const supabase =
    await createClient();

  const {
    data: authData,
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    logSupabaseError(
      "CREATE SERVICE AUTH CHECK FAILED:",
      authError,
    );
  }

  console.log(
    "CREATE SERVICE AUTH USER:",
    authData.user
      ? {
          id: authData.user.id,
          email:
            authData.user.email ??
            null,
          role:
            authData.user.role ??
            null,
        }
      : null,
  );

  console.log(
    "CREATE SERVICE PAYLOAD:",
    {
      service_name:
        parsed.data.service_name,
      slug:
        parsed.data.slug,
      has_detail_page:
        parsed.data.has_detail_page,
      is_active:
        parsed.data.is_active,
      is_published:
        parsed.data.is_published,
    },
  );

  const { data, error } =
    await supabase
      .from(SERVICES_TABLE)
      .insert(parsed.data)
      .select("id, slug")
      .single();

  console.log(
    "CREATE SERVICE DATA:",
    data,
  );

  if (error) {
    logSupabaseError(
      "CREATE SERVICE INSERT FAILED:",
      error,
    );

    console.error(
      "CREATE SERVICE FULL ERROR:",
      JSON.stringify(
        {
          message:
            error.message,
          details:
            error.details,
          hint:
            error.hint,
          code:
            error.code,
        },
        null,
        2,
      ),
    );

    return {
      success: false,
      message:
        `${error.message}` +
        (error.code
          ? ` [${error.code}]`
          : ""),
    };
  }

  revalidateServicesPaths(
    data.id,
    data.slug,
  );

  return {
    success: true,
    message:
      "Service created successfully.",
    data: {
      id: data.id,
      slug: data.slug,
    },
  };
}

export async function updateService(
  id: string,
  values: UpdateServiceInput,
): Promise<ServiceActionResult> {
  if (!id) {
    return {
      success: false,
      message:
        "Service ID is required.",
    };
  }

  const parsed =
    updateServiceSchema.safeParse(
      values,
    );

  if (!parsed.success) {
    return validationFailure(
      parsed.error.flatten().fieldErrors,
    );
  }

  const supabase =
    await createClient();

  const { data: existing } =
    await supabase
      .from(SERVICES_TABLE)
      .select("slug")
      .eq("id", id)
      .maybeSingle();

  const { data, error } =
    await supabase
      .from(SERVICES_TABLE)
      .update(parsed.data)
      .eq("id", id)
      .select("slug")
      .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateServicesPaths(
    id,
    existing?.slug,
  );

  if (
    data.slug !== existing?.slug
  ) {
    revalidateServicesPaths(
      id,
      data.slug,
    );
  }

  return {
    success: true,
    message:
      "Service updated successfully.",
  };
}

export async function deleteService(
  id: string,
): Promise<ServiceActionResult> {
  if (!id) {
    return {
      success: false,
      message:
        "Service ID is required.",
    };
  }

  const supabase =
    await createClient();

  const { data: existing } =
    await supabase
      .from(SERVICES_TABLE)
      .select("slug")
      .eq("id", id)
      .maybeSingle();

  const { error } =
    await supabase
      .from(SERVICES_TABLE)
      .delete()
      .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateServicesPaths(
    id,
    existing?.slug,
  );

  return {
    success: true,
    message:
      "Service deleted successfully.",
  };
}

export async function setServicePublished(
  id: string,
  isPublished: boolean,
): Promise<ServiceActionResult> {
  if (!id) {
    return {
      success: false,
      message:
        "Service ID is required.",
    };
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(SERVICES_TABLE)
      .update({
        is_published:
          isPublished,
      })
      .eq("id", id)
      .select("slug")
      .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateServicesPaths(
    id,
    data.slug,
  );

  return {
    success: true,
    message:
      isPublished
        ? "Service published successfully."
        : "Service unpublished successfully.",
  };
}

/* ============================================================
 * SERVICE BENEFITS
 * ============================================================
 */

export async function getServiceBenefits(
  serviceId: string,
): Promise<ServiceBenefit[]> {
  if (!serviceId) {
    return [];
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(BENEFITS_TABLE)
      .select("*")
      .eq("service_id", serviceId)
      .order(
        "display_order",
        { ascending: true },
      )
      .order(
        "created_at",
        { ascending: true },
      );

  if (error) {
    console.error(
      "Failed to load Service benefits:",
      error,
    );

    return [];
  }

  return data as ServiceBenefit[];
}

export async function getPublishedServiceBenefits(
  serviceId: string,
): Promise<ServiceBenefit[]> {
  if (!serviceId) {
    return [];
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(BENEFITS_TABLE)
      .select("*")
      .eq("service_id", serviceId)
      .eq("is_active", true)
      .eq("is_published", true)
      .order(
        "display_order",
        { ascending: true },
      )
      .order(
        "created_at",
        { ascending: true },
      );

  if (error) {
    console.error(
      "Failed to load published Service benefits:",
      error,
    );

    return [];
  }

  return data as ServiceBenefit[];
}

export async function createServiceBenefit(
  values: CreateServiceBenefitInput,
): Promise<ServiceActionResult> {
  const parsed =
    createServiceBenefitSchema.safeParse(
      values,
    );

  if (!parsed.success) {
    return validationFailure(
      parsed.error.flatten().fieldErrors,
    );
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(BENEFITS_TABLE)
      .insert(parsed.data);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getServiceSlugById(
      parsed.data.service_id,
    );

  revalidateServicesPaths(
    parsed.data.service_id,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Service benefit created successfully.",
  };
}

export async function updateServiceBenefit(
  id: string,
  serviceId: string,
  values: UpdateServiceBenefitInput,
): Promise<ServiceActionResult> {
  if (!id || !serviceId) {
    return {
      success: false,
      message:
        "Benefit ID and Service ID are required.",
    };
  }

  const parsed =
    updateServiceBenefitSchema.safeParse(
      values,
    );

  if (!parsed.success) {
    return validationFailure(
      parsed.error.flatten().fieldErrors,
    );
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(BENEFITS_TABLE)
      .update(parsed.data)
      .eq("id", id)
      .eq("service_id", serviceId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getServiceSlugById(
      serviceId,
    );

  revalidateServicesPaths(
    serviceId,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Service benefit updated successfully.",
  };
}

export async function deleteServiceBenefit(
  id: string,
  serviceId: string,
): Promise<ServiceActionResult> {
  if (!id || !serviceId) {
    return {
      success: false,
      message:
        "Benefit ID and Service ID are required.",
    };
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(BENEFITS_TABLE)
      .delete()
      .eq("id", id)
      .eq("service_id", serviceId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getServiceSlugById(
      serviceId,
    );

  revalidateServicesPaths(
    serviceId,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Service benefit deleted successfully.",
  };
}

/* ============================================================
 * SERVICE PROCESS STEPS
 * ============================================================
 */

export async function getServiceProcessSteps(
  serviceId: string,
): Promise<ServiceProcessStep[]> {
  if (!serviceId) {
    return [];
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(PROCESS_STEPS_TABLE)
      .select("*")
      .eq("service_id", serviceId)
      .order(
        "display_order",
        { ascending: true },
      )
      .order(
        "created_at",
        { ascending: true },
      );

  if (error) {
    console.error(
      "Failed to load Service process steps:",
      error,
    );

    return [];
  }

  return data as ServiceProcessStep[];
}

export async function getPublishedServiceProcessSteps(
  serviceId: string,
): Promise<ServiceProcessStep[]> {
  if (!serviceId) {
    return [];
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(PROCESS_STEPS_TABLE)
      .select("*")
      .eq("service_id", serviceId)
      .eq("is_active", true)
      .eq("is_published", true)
      .order(
        "display_order",
        { ascending: true },
      )
      .order(
        "created_at",
        { ascending: true },
      );

  if (error) {
    console.error(
      "Failed to load published Service process steps:",
      error,
    );

    return [];
  }

  return data as ServiceProcessStep[];
}

export async function createServiceProcessStep(
  values: CreateServiceProcessStepInput,
): Promise<ServiceActionResult> {
  const parsed =
    createServiceProcessStepSchema.safeParse(
      values,
    );

  if (!parsed.success) {
    return validationFailure(
      parsed.error.flatten().fieldErrors,
    );
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(PROCESS_STEPS_TABLE)
      .insert(parsed.data);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getServiceSlugById(
      parsed.data.service_id,
    );

  revalidateServicesPaths(
    parsed.data.service_id,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Service process step created successfully.",
  };
}

export async function updateServiceProcessStep(
  id: string,
  serviceId: string,
  values: UpdateServiceProcessStepInput,
): Promise<ServiceActionResult> {
  if (!id || !serviceId) {
    return {
      success: false,
      message:
        "Process step ID and Service ID are required.",
    };
  }

  const parsed =
    updateServiceProcessStepSchema.safeParse(
      values,
    );

  if (!parsed.success) {
    return validationFailure(
      parsed.error.flatten().fieldErrors,
    );
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(PROCESS_STEPS_TABLE)
      .update(parsed.data)
      .eq("id", id)
      .eq("service_id", serviceId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getServiceSlugById(
      serviceId,
    );

  revalidateServicesPaths(
    serviceId,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Service process step updated successfully.",
  };
}

export async function deleteServiceProcessStep(
  id: string,
  serviceId: string,
): Promise<ServiceActionResult> {
  if (!id || !serviceId) {
    return {
      success: false,
      message:
        "Process step ID and Service ID are required.",
    };
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(PROCESS_STEPS_TABLE)
      .delete()
      .eq("id", id)
      .eq("service_id", serviceId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getServiceSlugById(
      serviceId,
    );

  revalidateServicesPaths(
    serviceId,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Service process step deleted successfully.",
  };
}

/* ============================================================
 * SERVICE GALLERY
 * ============================================================
 */

export async function getServiceGalleryItems(
  serviceId: string,
): Promise<ServiceGalleryItem[]> {
  if (!serviceId) {
    return [];
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(GALLERY_TABLE)
      .select("*")
      .eq("service_id", serviceId)
      .order(
        "display_order",
        { ascending: true },
      )
      .order(
        "created_at",
        { ascending: true },
      );

  if (error) {
    console.error(
      "Failed to load Service gallery items:",
      error,
    );

    return [];
  }

  return data as ServiceGalleryItem[];
}

export async function getPublishedServiceGalleryItems(
  serviceId: string,
): Promise<ServiceGalleryItem[]> {
  if (!serviceId) {
    return [];
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(GALLERY_TABLE)
      .select("*")
      .eq("service_id", serviceId)
      .eq("is_active", true)
      .eq("is_published", true)
      .order(
        "display_order",
        { ascending: true },
      )
      .order(
        "created_at",
        { ascending: true },
      );

  if (error) {
    console.error(
      "Failed to load published Service gallery items:",
      error,
    );

    return [];
  }

  return data as ServiceGalleryItem[];
}

export async function createServiceGalleryItem(
  values: CreateServiceGalleryItemInput,
): Promise<ServiceActionResult> {
  const parsed =
    createServiceGalleryItemSchema.safeParse(
      values,
    );

  if (!parsed.success) {
    return validationFailure(
      parsed.error.flatten().fieldErrors,
    );
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(GALLERY_TABLE)
      .insert(parsed.data);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getServiceSlugById(
      parsed.data.service_id,
    );

  revalidateServicesPaths(
    parsed.data.service_id,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Service gallery item created successfully.",
  };
}

export async function updateServiceGalleryItem(
  id: string,
  serviceId: string,
  values: UpdateServiceGalleryItemInput,
): Promise<ServiceActionResult> {
  if (!id || !serviceId) {
    return {
      success: false,
      message:
        "Gallery item ID and Service ID are required.",
    };
  }

  const parsed =
    updateServiceGalleryItemSchema.safeParse(
      values,
    );

  if (!parsed.success) {
    return validationFailure(
      parsed.error.flatten().fieldErrors,
    );
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(GALLERY_TABLE)
      .update(parsed.data)
      .eq("id", id)
      .eq("service_id", serviceId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getServiceSlugById(
      serviceId,
    );

  revalidateServicesPaths(
    serviceId,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Service gallery item updated successfully.",
  };
}

export async function deleteServiceGalleryItem(
  id: string,
  serviceId: string,
): Promise<ServiceActionResult> {
  if (!id || !serviceId) {
    return {
      success: false,
      message:
        "Gallery item ID and Service ID are required.",
    };
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(GALLERY_TABLE)
      .delete()
      .eq("id", id)
      .eq("service_id", serviceId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getServiceSlugById(
      serviceId,
    );

  revalidateServicesPaths(
    serviceId,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Service gallery item deleted successfully.",
  };
}

/* ============================================================
 * COMPLETE SERVICE DETAIL DATA
 * ============================================================
 */

export async function getPublishedServiceDetailData(
  slug: string,
): Promise<ServiceDetailData> {
  const service =
    await getPublishedServiceBySlug(
      slug,
    );

  if (!service) {
    return {
      service: null,
      benefits: [],
      processSteps: [],
      galleryItems: [],
    };
  }

  const [
    benefits,
    processSteps,
    galleryItems,
  ] = await Promise.all([
    getPublishedServiceBenefits(
      service.id,
    ),

    getPublishedServiceProcessSteps(
      service.id,
    ),

    getPublishedServiceGalleryItems(
      service.id,
    ),
  ]);

  return {
    service,
    benefits,
    processSteps,
    galleryItems,
  };
}

export async function getServicesPageData(): Promise<
  ServicesPageData
> {
  const [
    settings,
    heroSlides,
    services,
  ] = await Promise.all([
    getServicesPageSettings(),
    getPublishedServiceHeroSlides(),
    getPublishedServices(),
  ]);

  return {
    settings,
    heroSlides,
    services,
  };
}