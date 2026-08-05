/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/lib/actions/case-studies.ts
 *
 * Purpose :
 * Provides server-side queries and mutations for the
 * Case Studies CMS and public case study pages.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import {
  caseStudyRelatedServiceSchema,
  createCaseStudyFactSchema,
  createCaseStudyGalleryItemSchema,
  createCaseStudySchema,
  createCaseStudyTestimonialSchema,
  createCaseStudyTimelineItemSchema,
  updateCaseStudyFactSchema,
  updateCaseStudyGalleryItemSchema,
  updateCaseStudySchema,
  updateCaseStudyTestimonialSchema,
  updateCaseStudyTimelineItemSchema,
} from "@/lib/validations/case-studies";

import type {
  CaseStudy,
  CaseStudyActionResult,
  CaseStudyDetailData,
  CaseStudyFact,
  CaseStudyGalleryItem,
  CaseStudyRelatedServiceWithService,
  CaseStudyTestimonial,
  CaseStudyTimelineItem,
  CreateCaseStudyFactInput,
  CreateCaseStudyGalleryItemInput,
  CreateCaseStudyInput,
  CreateCaseStudyRelatedServiceInput,
  CreateCaseStudyTestimonialInput,
  CreateCaseStudyTimelineItemInput,
  UpdateCaseStudyFactInput,
  UpdateCaseStudyGalleryItemInput,
  UpdateCaseStudyInput,
  UpdateCaseStudyTestimonialInput,
  UpdateCaseStudyTimelineItemInput,
} from "@/lib/types/case-studies";

const CASE_STUDIES_TABLE =
  "case_studies";

const FACTS_TABLE =
  "case_study_facts";

const TIMELINE_TABLE =
  "case_study_timeline";

const GALLERY_TABLE =
  "case_study_gallery";

const TESTIMONIALS_TABLE =
  "case_study_testimonials";

const RELATED_SERVICES_TABLE =
  "case_study_related_services";

function validationFailure(
  errors: Record<
    string,
    string[] | undefined
  >,
): CaseStudyActionResult {
  return {
    success: false,
    message: "Validation failed.",
    errors,
  };
}

function logSupabaseError(
  context: string,
  error: {
    message?: string;
    details?: string;
    hint?: string;
    code?: string;
  },
): void {
  console.error(
    `${context} | code=${error.code ?? "NO_CODE"} | message=${error.message ?? "Unknown error"} | details=${error.details ?? "No details"} | hint=${error.hint ?? "No hint"}`,
  );
}

function revalidateCaseStudyPaths(
  caseStudyId?: string,
  slug?: string,
): void {
  revalidatePath("/case-studies");
  revalidatePath(
    "/admin/website/case-studies",
  );
  revalidatePath(
    "/admin/website/case-studies/new",
  );

  if (caseStudyId) {
    revalidatePath(
      `/admin/website/case-studies/${caseStudyId}/edit`,
    );
  }

  if (slug) {
    revalidatePath(
      `/case-studies/${slug}`,
    );
  }
}

async function getCaseStudySlugById(
  caseStudyId: string,
): Promise<string | null> {
  if (!caseStudyId) {
    return null;
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(CASE_STUDIES_TABLE)
      .select("slug")
      .eq("id", caseStudyId)
      .maybeSingle();

  if (error) {
    logSupabaseError(
      "Failed to resolve case study slug:",
      error,
    );

    return null;
  }

  return data?.slug ?? null;
}

/* ============================================================
 * CASE STUDIES
 * ============================================================
 */

export async function getCaseStudies(): Promise<
  CaseStudy[]
> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(CASE_STUDIES_TABLE)
      .select("*")
      .order(
        "display_order",
        { ascending: true },
      )
      .order(
        "created_at",
        { ascending: false },
      );

  if (error) {
    logSupabaseError(
      "Failed to load case studies:",
      error,
    );

    return [];
  }

  return data as CaseStudy[];
}

export async function getPublishedCaseStudies(): Promise<
  CaseStudy[]
> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(CASE_STUDIES_TABLE)
      .select("*")
      .eq("is_active", true)
      .eq("is_published", true)
      .order(
        "display_order",
        { ascending: true },
      )
      .order(
        "created_at",
        { ascending: false },
      );

  if (error) {
    logSupabaseError(
      "Failed to load published case studies:",
      error,
    );

    return [];
  }

  return data as CaseStudy[];
}

export async function getFeaturedCaseStudies(): Promise<
  CaseStudy[]
> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(CASE_STUDIES_TABLE)
      .select("*")
      .eq("is_active", true)
      .eq("is_published", true)
      .eq("is_featured", true)
      .order(
        "display_order",
        { ascending: true },
      )
      .order(
        "created_at",
        { ascending: false },
      );

  if (error) {
    logSupabaseError(
      "Failed to load featured case studies:",
      error,
    );

    return [];
  }

  return data as CaseStudy[];
}

export async function getCaseStudyById(
  id: string,
): Promise<CaseStudy | null> {
  if (!id) {
    return null;
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(CASE_STUDIES_TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();

  if (error) {
    logSupabaseError(
      "Failed to load case study:",
      error,
    );

    return null;
  }

  return data as CaseStudy | null;
}

export async function getPublishedCaseStudyBySlug(
  slug: string,
): Promise<CaseStudy | null> {
  if (!slug) {
    return null;
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(CASE_STUDIES_TABLE)
      .select("*")
      .eq("slug", slug)
      .eq("has_detail_page", true)
      .eq("is_active", true)
      .eq("is_published", true)
      .maybeSingle();

  if (error) {
    logSupabaseError(
      "Failed to load published case study:",
      error,
    );

    return null;
  }

  return data as CaseStudy | null;
}

export async function createCaseStudy(
  values: CreateCaseStudyInput,
): Promise<CaseStudyActionResult> {
  const parsed =
    createCaseStudySchema.safeParse(
      values,
    );

  if (!parsed.success) {
    return validationFailure(
      parsed.error.flatten().fieldErrors,
    );
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(CASE_STUDIES_TABLE)
      .insert(parsed.data)
      .select("id, slug")
      .single();

  if (error) {
    logSupabaseError(
      "Failed to create case study:",
      error,
    );

    return {
      success: false,
      message: error.message,
    };
  }

  revalidateCaseStudyPaths(
    data.id,
    data.slug,
  );

  return {
    success: true,
    message:
      "Case study created successfully.",
    data: {
      id: data.id,
      slug: data.slug,
    },
  };
}

export async function updateCaseStudy(
  id: string,
  values: UpdateCaseStudyInput,
): Promise<CaseStudyActionResult> {
  if (!id) {
    return {
      success: false,
      message:
        "Case study ID is required.",
    };
  }

  const parsed =
    updateCaseStudySchema.safeParse(
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
        "No case study changes were provided.",
    };
  }

  const supabase =
    await createClient();

  const { data: existing } =
    await supabase
      .from(CASE_STUDIES_TABLE)
      .select("slug")
      .eq("id", id)
      .maybeSingle();

  const { data, error } =
    await supabase
      .from(CASE_STUDIES_TABLE)
      .update(parsed.data)
      .eq("id", id)
      .select("slug")
      .single();

  if (error) {
    logSupabaseError(
      "Failed to update case study:",
      error,
    );

    return {
      success: false,
      message: error.message,
    };
  }

  revalidateCaseStudyPaths(
    id,
    existing?.slug,
  );

  if (
    data.slug !== existing?.slug
  ) {
    revalidateCaseStudyPaths(
      id,
      data.slug,
    );
  }

  return {
    success: true,
    message:
      "Case study updated successfully.",
  };
}

export async function deleteCaseStudy(
  id: string,
): Promise<CaseStudyActionResult> {
  if (!id) {
    return {
      success: false,
      message:
        "Case study ID is required.",
    };
  }

  const supabase =
    await createClient();

  const { data: existing } =
    await supabase
      .from(CASE_STUDIES_TABLE)
      .select("slug")
      .eq("id", id)
      .maybeSingle();

  const { error } =
    await supabase
      .from(CASE_STUDIES_TABLE)
      .delete()
      .eq("id", id);

  if (error) {
    logSupabaseError(
      "Failed to delete case study:",
      error,
    );

    return {
      success: false,
      message: error.message,
    };
  }

  revalidateCaseStudyPaths(
    id,
    existing?.slug,
  );

  return {
    success: true,
    message:
      "Case study deleted successfully.",
  };
}

export async function setCaseStudyPublished(
  id: string,
  isPublished: boolean,
): Promise<CaseStudyActionResult> {
  if (!id) {
    return {
      success: false,
      message:
        "Case study ID is required.",
    };
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(CASE_STUDIES_TABLE)
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

  revalidateCaseStudyPaths(
    id,
    data.slug,
  );

  return {
    success: true,
    message:
      isPublished
        ? "Case study published successfully."
        : "Case study unpublished successfully.",
  };
}

/* ============================================================
 * FACTS
 * ============================================================
 */

export async function getCaseStudyFacts(
  caseStudyId: string,
): Promise<CaseStudyFact[]> {
  if (!caseStudyId) {
    return [];
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(FACTS_TABLE)
      .select("*")
      .eq(
        "case_study_id",
        caseStudyId,
      )
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
      "Failed to load case study facts:",
      error,
    );

    return [];
  }

  return data as CaseStudyFact[];
}

export async function createCaseStudyFact(
  values: CreateCaseStudyFactInput,
): Promise<CaseStudyActionResult> {
  const parsed =
    createCaseStudyFactSchema.safeParse(
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
      .from(FACTS_TABLE)
      .insert(parsed.data);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getCaseStudySlugById(
      parsed.data.case_study_id,
    );

  revalidateCaseStudyPaths(
    parsed.data.case_study_id,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Project fact created successfully.",
  };
}

export async function updateCaseStudyFact(
  id: string,
  caseStudyId: string,
  values: UpdateCaseStudyFactInput,
): Promise<CaseStudyActionResult> {
  const parsed =
    updateCaseStudyFactSchema.safeParse(
      values,
    );

  if (
    !id ||
    !caseStudyId
  ) {
    return {
      success: false,
      message:
        "Fact ID and Case Study ID are required.",
    };
  }

  if (!parsed.success) {
    return validationFailure(
      parsed.error.flatten().fieldErrors,
    );
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(FACTS_TABLE)
      .update(parsed.data)
      .eq("id", id)
      .eq(
        "case_study_id",
        caseStudyId,
      );

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getCaseStudySlugById(
      caseStudyId,
    );

  revalidateCaseStudyPaths(
    caseStudyId,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Project fact updated successfully.",
  };
}

export async function deleteCaseStudyFact(
  id: string,
  caseStudyId: string,
): Promise<CaseStudyActionResult> {
  if (
    !id ||
    !caseStudyId
  ) {
    return {
      success: false,
      message:
        "Fact ID and Case Study ID are required.",
    };
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(FACTS_TABLE)
      .delete()
      .eq("id", id)
      .eq(
        "case_study_id",
        caseStudyId,
      );

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getCaseStudySlugById(
      caseStudyId,
    );

  revalidateCaseStudyPaths(
    caseStudyId,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Project fact deleted successfully.",
  };
}

/* ============================================================
 * TIMELINE
 * ============================================================
 */

export async function getCaseStudyTimeline(
  caseStudyId: string,
): Promise<CaseStudyTimelineItem[]> {
  if (!caseStudyId) {
    return [];
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(TIMELINE_TABLE)
      .select("*")
      .eq(
        "case_study_id",
        caseStudyId,
      )
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
      "Failed to load case study timeline:",
      error,
    );

    return [];
  }

  return data as CaseStudyTimelineItem[];
}

export async function createCaseStudyTimelineItem(
  values: CreateCaseStudyTimelineItemInput,
): Promise<CaseStudyActionResult> {
  const parsed =
    createCaseStudyTimelineItemSchema.safeParse(
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
      .from(TIMELINE_TABLE)
      .insert(parsed.data);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getCaseStudySlugById(
      parsed.data.case_study_id,
    );

  revalidateCaseStudyPaths(
    parsed.data.case_study_id,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Timeline item created successfully.",
  };
}

export async function updateCaseStudyTimelineItem(
  id: string,
  caseStudyId: string,
  values: UpdateCaseStudyTimelineItemInput,
): Promise<CaseStudyActionResult> {
  if (
    !id ||
    !caseStudyId
  ) {
    return {
      success: false,
      message:
        "Timeline item ID and Case Study ID are required.",
    };
  }

  const parsed =
    updateCaseStudyTimelineItemSchema.safeParse(
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
      .from(TIMELINE_TABLE)
      .update(parsed.data)
      .eq("id", id)
      .eq(
        "case_study_id",
        caseStudyId,
      );

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getCaseStudySlugById(
      caseStudyId,
    );

  revalidateCaseStudyPaths(
    caseStudyId,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Timeline item updated successfully.",
  };
}

export async function deleteCaseStudyTimelineItem(
  id: string,
  caseStudyId: string,
): Promise<CaseStudyActionResult> {
  if (
    !id ||
    !caseStudyId
  ) {
    return {
      success: false,
      message:
        "Timeline item ID and Case Study ID are required.",
    };
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(TIMELINE_TABLE)
      .delete()
      .eq("id", id)
      .eq(
        "case_study_id",
        caseStudyId,
      );

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getCaseStudySlugById(
      caseStudyId,
    );

  revalidateCaseStudyPaths(
    caseStudyId,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Timeline item deleted successfully.",
  };
}

/* ============================================================
 * GALLERY
 * ============================================================
 */

export async function getCaseStudyGallery(
  caseStudyId: string,
): Promise<CaseStudyGalleryItem[]> {
  if (!caseStudyId) {
    return [];
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(GALLERY_TABLE)
      .select("*")
      .eq(
        "case_study_id",
        caseStudyId,
      )
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
      "Failed to load case study gallery:",
      error,
    );

    return [];
  }

  return data as CaseStudyGalleryItem[];
}

export async function createCaseStudyGalleryItem(
  values: CreateCaseStudyGalleryItemInput,
): Promise<CaseStudyActionResult> {
  const parsed =
    createCaseStudyGalleryItemSchema.safeParse(
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
    await getCaseStudySlugById(
      parsed.data.case_study_id,
    );

  revalidateCaseStudyPaths(
    parsed.data.case_study_id,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Gallery item created successfully.",
  };
}

export async function updateCaseStudyGalleryItem(
  id: string,
  caseStudyId: string,
  values: UpdateCaseStudyGalleryItemInput,
): Promise<CaseStudyActionResult> {
  if (
    !id ||
    !caseStudyId
  ) {
    return {
      success: false,
      message:
        "Gallery item ID and Case Study ID are required.",
    };
  }

  const parsed =
    updateCaseStudyGalleryItemSchema.safeParse(
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
      .eq(
        "case_study_id",
        caseStudyId,
      );

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getCaseStudySlugById(
      caseStudyId,
    );

  revalidateCaseStudyPaths(
    caseStudyId,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Gallery item updated successfully.",
  };
}

export async function deleteCaseStudyGalleryItem(
  id: string,
  caseStudyId: string,
): Promise<CaseStudyActionResult> {
  if (
    !id ||
    !caseStudyId
  ) {
    return {
      success: false,
      message:
        "Gallery item ID and Case Study ID are required.",
    };
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(GALLERY_TABLE)
      .delete()
      .eq("id", id)
      .eq(
        "case_study_id",
        caseStudyId,
      );

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getCaseStudySlugById(
      caseStudyId,
    );

  revalidateCaseStudyPaths(
    caseStudyId,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Gallery item deleted successfully.",
  };
}

/* ============================================================
 * TESTIMONIALS
 * ============================================================
 */

export async function getCaseStudyTestimonials(
  caseStudyId: string,
): Promise<CaseStudyTestimonial[]> {
  if (!caseStudyId) {
    return [];
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(TESTIMONIALS_TABLE)
      .select("*")
      .eq(
        "case_study_id",
        caseStudyId,
      )
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
      "Failed to load case study testimonials:",
      error,
    );

    return [];
  }

  return data as CaseStudyTestimonial[];
}

export async function createCaseStudyTestimonial(
  values: CreateCaseStudyTestimonialInput,
): Promise<CaseStudyActionResult> {
  const parsed =
    createCaseStudyTestimonialSchema.safeParse(
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
      .from(TESTIMONIALS_TABLE)
      .insert(parsed.data);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getCaseStudySlugById(
      parsed.data.case_study_id,
    );

  revalidateCaseStudyPaths(
    parsed.data.case_study_id,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Testimonial created successfully.",
  };
}

export async function updateCaseStudyTestimonial(
  id: string,
  caseStudyId: string,
  values: UpdateCaseStudyTestimonialInput,
): Promise<CaseStudyActionResult> {
  if (
    !id ||
    !caseStudyId
  ) {
    return {
      success: false,
      message:
        "Testimonial ID and Case Study ID are required.",
    };
  }

  const parsed =
    updateCaseStudyTestimonialSchema.safeParse(
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
      .from(TESTIMONIALS_TABLE)
      .update(parsed.data)
      .eq("id", id)
      .eq(
        "case_study_id",
        caseStudyId,
      );

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getCaseStudySlugById(
      caseStudyId,
    );

  revalidateCaseStudyPaths(
    caseStudyId,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Testimonial updated successfully.",
  };
}

export async function deleteCaseStudyTestimonial(
  id: string,
  caseStudyId: string,
): Promise<CaseStudyActionResult> {
  if (
    !id ||
    !caseStudyId
  ) {
    return {
      success: false,
      message:
        "Testimonial ID and Case Study ID are required.",
    };
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(TESTIMONIALS_TABLE)
      .delete()
      .eq("id", id)
      .eq(
        "case_study_id",
        caseStudyId,
      );

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getCaseStudySlugById(
      caseStudyId,
    );

  revalidateCaseStudyPaths(
    caseStudyId,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Testimonial deleted successfully.",
  };
}

/* ============================================================
 * RELATED SERVICES
 * ============================================================
 */

export async function getCaseStudyRelatedServices(
  caseStudyId: string,
): Promise<
  CaseStudyRelatedServiceWithService[]
> {
  if (!caseStudyId) {
    return [];
  }

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(RELATED_SERVICES_TABLE)
      .select(`
        id,
        case_study_id,
        service_id,
        display_order,
        created_at,
        service:services (
          id,
          service_name,
          slug,
          short_description,
          featured_image_url,
          featured_image_alt,
          show_explore_button,
          explore_button_text
        )
      `)
      .eq(
        "case_study_id",
        caseStudyId,
      )
      .order(
        "display_order",
        { ascending: true },
      );

  if (error) {
    logSupabaseError(
      "Failed to load related services:",
      error,
    );

    return [];
  }

  return data as unknown as
    CaseStudyRelatedServiceWithService[];
}

export async function attachRelatedService(
  values: CreateCaseStudyRelatedServiceInput,
): Promise<CaseStudyActionResult> {
  const parsed =
    caseStudyRelatedServiceSchema.safeParse(
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
      .from(RELATED_SERVICES_TABLE)
      .insert(parsed.data);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getCaseStudySlugById(
      parsed.data.case_study_id,
    );

  revalidateCaseStudyPaths(
    parsed.data.case_study_id,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Related service attached successfully.",
  };
}

export async function detachRelatedService(
  id: string,
  caseStudyId: string,
): Promise<CaseStudyActionResult> {
  if (
    !id ||
    !caseStudyId
  ) {
    return {
      success: false,
      message:
        "Related service ID and Case Study ID are required.",
    };
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(RELATED_SERVICES_TABLE)
      .delete()
      .eq("id", id)
      .eq(
        "case_study_id",
        caseStudyId,
      );

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const slug =
    await getCaseStudySlugById(
      caseStudyId,
    );

  revalidateCaseStudyPaths(
    caseStudyId,
    slug ?? undefined,
  );

  return {
    success: true,
    message:
      "Related service removed successfully.",
  };
}

/* ============================================================
 * COMPLETE PUBLIC DETAIL DATA
 * ============================================================
 */

export async function getPublishedCaseStudyDetailData(
  slug: string,
): Promise<CaseStudyDetailData> {
  const caseStudy =
    await getPublishedCaseStudyBySlug(
      slug,
    );

  if (!caseStudy) {
    return {
      caseStudy: null,
      facts: [],
      timeline: [],
      galleryItems: [],
      testimonials: [],
      relatedServices: [],
    };
  }

  const [
    facts,
    timeline,
    galleryItems,
    testimonials,
    relatedServices,
  ] = await Promise.all([
    getCaseStudyFacts(
      caseStudy.id,
    ),
    getCaseStudyTimeline(
      caseStudy.id,
    ),
    getCaseStudyGallery(
      caseStudy.id,
    ),
    getCaseStudyTestimonials(
      caseStudy.id,
    ),
    getCaseStudyRelatedServices(
      caseStudy.id,
    ),
  ]);

  return {
    caseStudy,
    facts:
      facts.filter(
        (item) =>
          item.is_active &&
          item.is_published,
      ),
    timeline:
      timeline.filter(
        (item) =>
          item.is_active &&
          item.is_published,
      ),
    galleryItems:
      galleryItems.filter(
        (item) =>
          item.is_active &&
          item.is_published,
      ),
    testimonials:
      testimonials.filter(
        (item) =>
          item.is_active &&
          item.is_published,
      ),
    relatedServices,
  };
}