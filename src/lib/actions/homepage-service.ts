"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import {
  createHomepageServiceBulletSchema,
  createHomepageServiceSchema,
  updateHomepageServiceBulletSchema,
  updateHomepageServicesSectionSchema,
  updateHomepageServiceSchema,
} from "@/lib/validations/homepage-service";

import type {
  CreateHomepageServiceBulletInput,
  CreateHomepageServiceInput,
  HomepageService,
  HomepageServiceBullet,
  HomepageServicesData,
  HomepageServicesSection,
  UpdateHomepageServiceBulletInput,
  UpdateHomepageServiceInput,
  UpdateHomepageServicesSectionInput,
} from "@/lib/types/homepage-service";

/* =========================================================
   ACTION RESULT
========================================================= */

export interface HomepageServiceActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
  data?: HomepageService | HomepageServiceBullet | HomepageServicesSection;
}

/* =========================================================
   REVALIDATE SERVICES PATHS
========================================================= */

function revalidateHomepageServicesPaths(serviceId?: string) {
  revalidatePath("/");
  revalidatePath("/admin/website/homepage/services");
  revalidatePath("/admin/website/homepage/services/new");

  if (serviceId) {
    revalidatePath(
      `/admin/website/homepage/services/${serviceId}/edit`,
    );
  }
}

/* =========================================================
   GET SERVICES SECTION SETTINGS
========================================================= */

export async function getHomepageServicesSection(): Promise<
  HomepageServicesSection | null
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homepage_services_section")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to fetch homepage services section:",
      error,
    );

    return null;
  }

  return data as HomepageServicesSection | null;
}

/* =========================================================
   UPDATE SERVICES SECTION SETTINGS
========================================================= */

export async function updateHomepageServicesSection(
  id: string,
  values: UpdateHomepageServicesSectionInput,
): Promise<HomepageServiceActionResult> {
  if (!id) {
    return {
      success: false,
      message: "Section ID is required.",
    };
  }

  const parsed =
    updateHomepageServicesSectionSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (Object.keys(parsed.data).length === 0) {
    return {
      success: false,
      message: "No section changes were provided.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homepage_services_section")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateHomepageServicesPaths();

  return {
    success: true,
    message: "Services section updated successfully.",
    data: data as HomepageServicesSection,
  };
}

/* =========================================================
   GET ALL SERVICES
========================================================= */

export async function getHomepageServices(): Promise<
  HomepageService[]
> {
  const supabase = await createClient();

  const { data: services, error: servicesError } =
    await supabase
      .from("homepage_services")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

  if (servicesError) {
    console.error(
      "Failed to fetch homepage services:",
      servicesError,
    );

    return [];
  }

  if (!services || services.length === 0) {
    return [];
  }

  const serviceIds = services.map((service) => service.id);

  const { data: bullets, error: bulletsError } =
    await supabase
      .from("homepage_service_bullets")
      .select("*")
      .in("service_id", serviceIds)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

  if (bulletsError) {
    console.error(
      "Failed to fetch homepage service bullets:",
      bulletsError,
    );
  }

  const typedBullets =
    (bullets as HomepageServiceBullet[] | null) ?? [];

  return services.map((service) => ({
    ...(service as HomepageService),

    bullets: typedBullets.filter(
      (bullet) => bullet.service_id === service.id,
    ),
  }));
}

/* =========================================================
   GET PUBLISHED SERVICES FOR HOMEPAGE
========================================================= */

export async function getPublishedHomepageServices(): Promise<
  HomepageService[]
> {
  const supabase = await createClient();

  const { data: services, error: servicesError } =
    await supabase
      .from("homepage_services")
      .select("*")
      .eq("is_active", true)
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

  if (servicesError) {
    console.error(
      "Failed to fetch published homepage services:",
      servicesError,
    );

    return [];
  }

  if (!services || services.length === 0) {
    return [];
  }

  const serviceIds = services.map((service) => service.id);

  const { data: bullets, error: bulletsError } =
    await supabase
      .from("homepage_service_bullets")
      .select("*")
      .in("service_id", serviceIds)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

  if (bulletsError) {
    console.error(
      "Failed to fetch published service bullets:",
      bulletsError,
    );
  }

  const typedBullets =
    (bullets as HomepageServiceBullet[] | null) ?? [];

  return services.map((service) => ({
    ...(service as HomepageService),

    bullets: typedBullets.filter(
      (bullet) => bullet.service_id === service.id,
    ),
  }));
}

/* =========================================================
   GET COMPLETE HOMEPAGE SERVICES DATA
========================================================= */

export async function getHomepageServicesData(): Promise<HomepageServicesData> {
  const [section, services] = await Promise.all([
    getHomepageServicesSection(),
    getPublishedHomepageServices(),
  ]);

  return {
    section,
    services,
  };
}

/* =========================================================
   GET SINGLE SERVICE
========================================================= */

export async function getHomepageService(
  id: string,
): Promise<HomepageService | null> {
  if (!id) {
    return null;
  }

  const supabase = await createClient();

  const { data: service, error: serviceError } =
    await supabase
      .from("homepage_services")
      .select("*")
      .eq("id", id)
      .maybeSingle();

  if (serviceError || !service) {
    if (serviceError) {
      console.error(
        "Failed to fetch homepage service:",
        serviceError,
      );
    }

    return null;
  }

  const { data: bullets, error: bulletsError } =
    await supabase
      .from("homepage_service_bullets")
      .select("*")
      .eq("service_id", id)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

  if (bulletsError) {
    console.error(
      "Failed to fetch homepage service bullets:",
      bulletsError,
    );
  }

  return {
    ...(service as HomepageService),

    bullets:
      (bullets as HomepageServiceBullet[] | null) ?? [],
  };
}

/* =========================================================
   CREATE SERVICE
========================================================= */

export async function createHomepageService(
  values: CreateHomepageServiceInput,
): Promise<HomepageServiceActionResult> {
  const parsed = createHomepageServiceSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const mediaValidation = validateServiceMedia(
    parsed.data.media_type,
    parsed.data.video_url,
    parsed.data.image_url,
  );

  if (!mediaValidation.success) {
    return mediaValidation;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homepage_services")
    .insert(parsed.data)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateHomepageServicesPaths(data.id);

  return {
    success: true,
    message: "Homepage service created successfully.",
    data: data as HomepageService,
  };
}

/* =========================================================
   UPDATE SERVICE
========================================================= */

export async function updateHomepageService(
  id: string,
  values: UpdateHomepageServiceInput,
): Promise<HomepageServiceActionResult> {
  if (!id) {
    return {
      success: false,
      message: "Service ID is required.",
    };
  }

  const parsed = updateHomepageServiceSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (Object.keys(parsed.data).length === 0) {
    return {
      success: false,
      message: "No service changes were provided.",
    };
  }

  const supabase = await createClient();

  const { data: existingService, error: existingError } =
    await supabase
      .from("homepage_services")
      .select("media_type, video_url, image_url")
      .eq("id", id)
      .maybeSingle();

  if (existingError || !existingService) {
    return {
      success: false,
      message:
        existingError?.message ?? "Homepage service not found.",
    };
  }

  const finalMediaType =
    parsed.data.media_type ?? existingService.media_type;

  const finalVideoUrl =
    parsed.data.video_url !== undefined
      ? parsed.data.video_url
      : existingService.video_url;

  const finalImageUrl =
    parsed.data.image_url !== undefined
      ? parsed.data.image_url
      : existingService.image_url;

  const mediaValidation = validateServiceMedia(
    finalMediaType,
    finalVideoUrl,
    finalImageUrl,
  );

  if (!mediaValidation.success) {
    return mediaValidation;
  }

  const { data, error } = await supabase
    .from("homepage_services")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateHomepageServicesPaths(id);

  return {
    success: true,
    message: "Homepage service updated successfully.",
    data: data as HomepageService,
  };
}

/* =========================================================
   DELETE SERVICE
========================================================= */

export async function deleteHomepageService(
  id: string,
): Promise<HomepageServiceActionResult> {
  if (!id) {
    return {
      success: false,
      message: "Service ID is required.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("homepage_services")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateHomepageServicesPaths(id);

  return {
    success: true,
    message: "Homepage service deleted successfully.",
  };
}

/* =========================================================
   PUBLISH / UNPUBLISH SERVICE
========================================================= */

export async function setHomepageServicePublished(
  id: string,
  published: boolean,
): Promise<HomepageServiceActionResult> {
  if (!id) {
    return {
      success: false,
      message: "Service ID is required.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homepage_services")
    .update({
      is_published: published,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateHomepageServicesPaths(id);

  return {
    success: true,
    message: published
      ? "Homepage service published."
      : "Homepage service unpublished.",
    data: data as HomepageService,
  };
}

/* =========================================================
   ACTIVATE / DEACTIVATE SERVICE
========================================================= */

export async function setHomepageServiceActive(
  id: string,
  active: boolean,
): Promise<HomepageServiceActionResult> {
  if (!id) {
    return {
      success: false,
      message: "Service ID is required.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homepage_services")
    .update({
      is_active: active,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateHomepageServicesPaths(id);

  return {
    success: true,
    message: active
      ? "Homepage service activated."
      : "Homepage service deactivated.",
    data: data as HomepageService,
  };
}

/* =========================================================
   UPDATE SERVICE DISPLAY ORDER
========================================================= */

export async function updateHomepageServiceOrder(
  id: string,
  displayOrder: number,
): Promise<HomepageServiceActionResult> {
  if (!id) {
    return {
      success: false,
      message: "Service ID is required.",
    };
  }

  if (
    !Number.isInteger(displayOrder) ||
    displayOrder < 0
  ) {
    return {
      success: false,
      message:
        "Display order must be a positive whole number.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homepage_services")
    .update({
      display_order: displayOrder,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateHomepageServicesPaths(id);

  return {
    success: true,
    message: "Service display order updated.",
    data: data as HomepageService,
  };
}

/* =========================================================
   GET SERVICE BULLETS
========================================================= */

export async function getHomepageServiceBullets(
  serviceId: string,
): Promise<HomepageServiceBullet[]> {
  if (!serviceId) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homepage_service_bullets")
    .select("*")
    .eq("service_id", serviceId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error(
      "Failed to fetch homepage service bullets:",
      error,
    );

    return [];
  }

  return data as HomepageServiceBullet[];
}

/* =========================================================
   CREATE SERVICE BULLET
========================================================= */

export async function createHomepageServiceBullet(
  values: CreateHomepageServiceBulletInput,
): Promise<HomepageServiceActionResult> {
  if (!values.service_id) {
    return {
      success: false,
      message: "Service ID is required.",
    };
  }

  const parsed = createHomepageServiceBulletSchema.safeParse({
    bullet_text: values.bullet_text,
    display_order: values.display_order,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homepage_service_bullets")
    .insert({
      service_id: values.service_id,
      ...parsed.data,
    })
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateHomepageServicesPaths(values.service_id);

  return {
    success: true,
    message: "Service bullet created successfully.",
    data: data as HomepageServiceBullet,
  };
}

/* =========================================================
   UPDATE SERVICE BULLET
========================================================= */

export async function updateHomepageServiceBullet(
  id: string,
  serviceId: string,
  values: UpdateHomepageServiceBulletInput,
): Promise<HomepageServiceActionResult> {
  if (!id) {
    return {
      success: false,
      message: "Bullet ID is required.",
    };
  }

  if (!serviceId) {
    return {
      success: false,
      message: "Service ID is required.",
    };
  }

  const parsed = updateHomepageServiceBulletSchema.safeParse({
    bullet_text: values.bullet_text,
    display_order: values.display_order,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const cleanPayload = Object.fromEntries(
    Object.entries(parsed.data).filter(
      ([, value]) => value !== undefined,
    ),
  );

  if (Object.keys(cleanPayload).length === 0) {
    return {
      success: false,
      message: "No bullet changes were provided.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("homepage_service_bullets")
    .update(cleanPayload)
    .eq("id", id)
    .eq("service_id", serviceId)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateHomepageServicesPaths(serviceId);

  return {
    success: true,
    message: "Service bullet updated successfully.",
    data: data as HomepageServiceBullet,
  };
}

/* =========================================================
   DELETE SERVICE BULLET
========================================================= */

export async function deleteHomepageServiceBullet(
  id: string,
  serviceId: string,
): Promise<HomepageServiceActionResult> {
  if (!id) {
    return {
      success: false,
      message: "Bullet ID is required.",
    };
  }

  if (!serviceId) {
    return {
      success: false,
      message: "Service ID is required.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("homepage_service_bullets")
    .delete()
    .eq("id", id)
    .eq("service_id", serviceId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidateHomepageServicesPaths(serviceId);

  return {
    success: true,
    message: "Service bullet deleted successfully.",
  };
}

/* =========================================================
   REPLACE ALL SERVICE BULLETS

   Useful when the service edit form submits the complete
   bullets list together.
========================================================= */

export async function replaceHomepageServiceBullets(
  serviceId: string,
  bullets: Array<{
    bullet_text: string;
    display_order: number;
  }>,
): Promise<HomepageServiceActionResult> {
  if (!serviceId) {
    return {
      success: false,
      message: "Service ID is required.",
    };
  }

  const parsedBullets = bullets.map((bullet) =>
    createHomepageServiceBulletSchema.safeParse(bullet),
  );

  const invalidBullet = parsedBullets.find(
    (result) => !result.success,
  );

  if (invalidBullet && !invalidBullet.success) {
    return {
      success: false,
      message: "One or more service bullets are invalid.",
      errors: invalidBullet.error.flatten().fieldErrors,
    };
  }

  const validBullets = parsedBullets.map((result) => {
    if (!result.success) {
      throw new Error("Invalid bullet validation result.");
    }

    return {
      service_id: serviceId,
      ...result.data,
    };
  });

  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("homepage_service_bullets")
    .delete()
    .eq("service_id", serviceId);

  if (deleteError) {
    return {
      success: false,
      message: deleteError.message,
    };
  }

  if (validBullets.length > 0) {
    const { error: insertError } = await supabase
      .from("homepage_service_bullets")
      .insert(validBullets);

    if (insertError) {
      return {
        success: false,
        message: insertError.message,
      };
    }
  }

  revalidateHomepageServicesPaths(serviceId);

  return {
    success: true,
    message: "Service bullets updated successfully.",
  };
}

/* =========================================================
   MEDIA VALIDATION
========================================================= */

function validateServiceMedia(
  mediaType: "video" | "image",
  videoUrl?: string | null,
  imageUrl?: string | null,
): HomepageServiceActionResult {
  if (mediaType === "video" && !videoUrl?.trim()) {
    return {
      success: false,
      message:
        "A video URL is required when media type is video.",
      errors: {
        video_url: [
          "A video URL is required when media type is video.",
        ],
      },
    };
  }

  if (mediaType === "image" && !imageUrl?.trim()) {
    return {
      success: false,
      message:
        "An image URL is required when media type is image.",
      errors: {
        image_url: [
          "An image URL is required when media type is image.",
        ],
      },
    };
  }

  return {
    success: true,
    message: "Media is valid.",
  };
}