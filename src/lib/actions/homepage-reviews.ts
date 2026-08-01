"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  CreateHomepageReviewInput,
  GooglePlacesDetailsResponse,
  GoogleReviewsSettings,
  HomepageReview,
  HomepageReviewsData,
  HomepageReviewsSection,
  UpdateGoogleReviewsSettingsInput,
  UpdateHomepageReviewInput,
  UpdateHomepageReviewsSectionInput,
} from "@/lib/types/homepage-reviews";

type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

type GoogleImportResult = {
  imported: number;
  skipped: number;
  totalReceived: number;
};

const ADMIN_PATH = "/admin/website/homepage/reviews";

function refreshReviewsPages(): void {
  revalidatePath("/");
  revalidatePath("/admin/website/homepage");
  revalidatePath(ADMIN_PATH);
  revalidatePath(`${ADMIN_PATH}/google-import`);
}

function cleanOptionalText(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned || null;
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function clampRating(value: number): number {
  if (!Number.isFinite(value)) return 5;
  return Math.min(5, Math.max(1, value));
}

function reviewTimestamp(publishTime: string | undefined): number | null {
  if (!publishTime) return null;
  const timestamp = Date.parse(publishTime);
  return Number.isNaN(timestamp) ? null : Math.floor(timestamp / 1000);
}

function googleReviewIdentifier(
  placeId: string,
  review: {
    name?: string;
    publishTime?: string;
    authorName?: string;
    text?: string;
  },
): string {
  if (review.name?.trim()) return review.name.trim();

  const raw = [
    placeId,
    review.publishTime ?? "",
    review.authorName ?? "",
    review.text ?? "",
  ].join("|");

  let hash = 0;
  for (let index = 0; index < raw.length; index += 1) {
    hash = (hash * 31 + raw.charCodeAt(index)) >>> 0;
  }

  return `google-${placeId}-${hash.toString(16)}`;
}

async function getSectionRecord(): Promise<HomepageReviewsSection | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_reviews_section")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to load homepage reviews section:", error.message);
    return null;
  }

  return (data as HomepageReviewsSection | null) ?? null;
}

async function getGoogleSettingsRecord(): Promise<GoogleReviewsSettings | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("google_reviews_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to load Google reviews settings:", error.message);
    return null;
  }

  return (data as GoogleReviewsSettings | null) ?? null;
}

export async function getHomepageReviewsData(): Promise<HomepageReviewsData> {
  const supabase = await createClient();
  const [sectionResult, reviewsResult, googleSettingsResult] = await Promise.all([
    supabase.from("homepage_reviews_section").select("*").limit(1).maybeSingle(),
    supabase
      .from("homepage_reviews")
      .select("*")
      .order("is_featured", { ascending: false })
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase.from("google_reviews_settings").select("*").limit(1).maybeSingle(),
  ]);

  if (sectionResult.error) {
    console.error("Failed to load reviews section:", sectionResult.error.message);
  }
  if (reviewsResult.error) {
    console.error("Failed to load homepage reviews:", reviewsResult.error.message);
  }
  if (googleSettingsResult.error) {
    console.error(
      "Failed to load Google review settings:",
      googleSettingsResult.error.message,
    );
  }

  return {
    section: (sectionResult.data as HomepageReviewsSection | null) ?? null,
    reviews: (reviewsResult.data as HomepageReview[] | null) ?? [],
    googleSettings:
      (googleSettingsResult.data as GoogleReviewsSettings | null) ?? null,
  };
}

export async function getHomepageReviewsSection(): Promise<HomepageReviewsSection | null> {
  return getSectionRecord();
}

export async function getHomepageReviews(): Promise<HomepageReview[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_reviews")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load homepage reviews:", error.message);
    return [];
  }

  return (data as HomepageReview[] | null) ?? [];
}

export async function getGoogleReviewsSettings(): Promise<GoogleReviewsSettings | null> {
  return getGoogleSettingsRecord();
}

export async function updateHomepageReviewsSection(
  sectionId: string,
  input: UpdateHomepageReviewsSectionInput,
): Promise<ActionResult<HomepageReviewsSection>> {
  if (!sectionId.trim()) {
    return { success: false, errors: ["Review section ID is required."] };
  }

  try {
    const supabase = await createClient();
    const payload = {
      ...input,
      ...(typeof input.eyebrow === "string"
        ? { eyebrow: input.eyebrow.trim() }
        : {}),
      ...(typeof input.heading === "string"
        ? { heading: input.heading.trim() }
        : {}),
      ...(typeof input.subheading === "string"
        ? { subheading: input.subheading.trim() }
        : {}),
      ...(typeof input.gradient_direction === "string"
        ? { gradient_direction: input.gradient_direction.trim() || "135deg" }
        : {}),
      ...(typeof input.background_image_url === "string"
        ? { background_image_url: cleanOptionalText(input.background_image_url) }
        : {}),
      ...(typeof input.background_image_storage_path === "string"
        ? {
            background_image_storage_path: cleanOptionalText(
              input.background_image_storage_path,
            ),
          }
        : {}),
      ...(typeof input.background_image_alt === "string"
        ? {
            background_image_alt:
              input.background_image_alt.trim() || "Customer reviews background",
          }
        : {}),
      ...(typeof input.background_overlay_color === "string"
        ? {
            background_overlay_color:
              input.background_overlay_color.trim() || "rgba(255,255,255,0.84)",
          }
        : {}),
    };

    const { data, error } = await supabase
      .from("homepage_reviews_section")
      .update(payload)
      .eq("id", sectionId)
      .select("*")
      .single();

    if (error) return { success: false, errors: [error.message] };

    refreshReviewsPages();
    return { success: true, data: data as HomepageReviewsSection };
  } catch (error) {
    return {
      success: false,
      errors: [errorMessage(error, "Unable to update review section.")],
    };
  }
}

export async function createHomepageReview(
  input: CreateHomepageReviewInput,
): Promise<ActionResult<HomepageReview>> {
  if (!input.section_id?.trim()) {
    return { success: false, errors: ["Review section ID is required."] };
  }
  if (!input.customer_name?.trim()) {
    return { success: false, errors: ["Customer name is required."] };
  }
  if (!input.review_text?.trim()) {
    return { success: false, errors: ["Review text is required."] };
  }

  try {
    const supabase = await createClient();
    const payload = {
      ...input,
      section_id: input.section_id.trim(),
      customer_name: input.customer_name.trim(),
      company_name: cleanOptionalText(input.company_name),
      designation: cleanOptionalText(input.designation),
      location: cleanOptionalText(input.location),
      rating: clampRating(Number(input.rating)),
      review_title: cleanOptionalText(input.review_title),
      review_text: input.review_text.trim(),
      customer_image_url: cleanOptionalText(input.customer_image_url),
      customer_image_storage_path: cleanOptionalText(
        input.customer_image_storage_path,
      ),
      customer_image_alt:
        input.customer_image_alt.trim() ||
        `${input.customer_name.trim()} profile image`,
      google_review_id: cleanOptionalText(input.google_review_id),
      google_author_url: cleanOptionalText(input.google_author_url),
      google_profile_photo_url: cleanOptionalText(
        input.google_profile_photo_url,
      ),
      google_relative_time: cleanOptionalText(input.google_relative_time),
    };

    const { data, error } = await supabase
      .from("homepage_reviews")
      .insert(payload)
      .select("*")
      .single();

    if (error) return { success: false, errors: [error.message] };

    refreshReviewsPages();
    return { success: true, data: data as HomepageReview };
  } catch (error) {
    return {
      success: false,
      errors: [errorMessage(error, "Unable to create review.")],
    };
  }
}

export async function updateHomepageReview(
  reviewId: string,
  input: UpdateHomepageReviewInput,
): Promise<ActionResult<HomepageReview>> {
  if (!reviewId.trim()) {
    return { success: false, errors: ["Review ID is required."] };
  }

  try {
    const supabase = await createClient();
    const payload = {
      ...input,
      ...(typeof input.customer_name === "string"
        ? { customer_name: input.customer_name.trim() }
        : {}),
      ...(typeof input.company_name === "string"
        ? { company_name: cleanOptionalText(input.company_name) }
        : {}),
      ...(typeof input.designation === "string"
        ? { designation: cleanOptionalText(input.designation) }
        : {}),
      ...(typeof input.location === "string"
        ? { location: cleanOptionalText(input.location) }
        : {}),
      ...(typeof input.rating === "number"
        ? { rating: clampRating(input.rating) }
        : {}),
      ...(typeof input.review_title === "string"
        ? { review_title: cleanOptionalText(input.review_title) }
        : {}),
      ...(typeof input.review_text === "string"
        ? { review_text: input.review_text.trim() }
        : {}),
      ...(typeof input.customer_image_url === "string"
        ? { customer_image_url: cleanOptionalText(input.customer_image_url) }
        : {}),
      ...(typeof input.customer_image_storage_path === "string"
        ? {
            customer_image_storage_path: cleanOptionalText(
              input.customer_image_storage_path,
            ),
          }
        : {}),
      ...(typeof input.customer_image_alt === "string"
        ? {
            customer_image_alt:
              input.customer_image_alt.trim() || "Customer profile image",
          }
        : {}),
    };

    const { data, error } = await supabase
      .from("homepage_reviews")
      .update(payload)
      .eq("id", reviewId)
      .select("*")
      .single();

    if (error) return { success: false, errors: [error.message] };

    refreshReviewsPages();
    return { success: true, data: data as HomepageReview };
  } catch (error) {
    return {
      success: false,
      errors: [errorMessage(error, "Unable to update review.")],
    };
  }
}

export async function deleteHomepageReview(
  reviewId: string,
): Promise<ActionResult> {
  if (!reviewId.trim()) {
    return { success: false, errors: ["Review ID is required."] };
  }

  try {
    const supabase = await createClient();
    const { data: review } = await supabase
      .from("homepage_reviews")
      .select("customer_image_storage_path")
      .eq("id", reviewId)
      .maybeSingle();

    const { error } = await supabase
      .from("homepage_reviews")
      .delete()
      .eq("id", reviewId);

    if (error) return { success: false, errors: [error.message] };

    if (review?.customer_image_storage_path) {
      const { error: storageError } = await supabase.storage
        .from("website-media")
        .remove([review.customer_image_storage_path]);

      if (storageError) {
        console.error("Review image could not be removed:", storageError.message);
      }
    }

    refreshReviewsPages();
    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      errors: [errorMessage(error, "Unable to delete review.")],
    };
  }
}

export async function duplicateHomepageReview(
  reviewId: string,
): Promise<ActionResult<HomepageReview>> {
  if (!reviewId.trim()) {
    return { success: false, errors: ["Review ID is required."] };
  }

  try {
    const supabase = await createClient();
    const { data: existing, error: loadError } = await supabase
      .from("homepage_reviews")
      .select("*")
      .eq("id", reviewId)
      .single();

    if (loadError) return { success: false, errors: [loadError.message] };

    const {
      id: _id,
      created_at: _createdAt,
      updated_at: _updatedAt,
      google_review_id: _googleReviewId,
      ...copy
    } = existing as HomepageReview;

    const { data, error } = await supabase
      .from("homepage_reviews")
      .insert({
        ...copy,
        customer_name: `${copy.customer_name} Copy`,
        source_type: "manual",
        google_review_id: null,
        is_featured: false,
        is_published: false,
      })
      .select("*")
      .single();

    if (error) return { success: false, errors: [error.message] };

    refreshReviewsPages();
    return { success: true, data: data as HomepageReview };
  } catch (error) {
    return {
      success: false,
      errors: [errorMessage(error, "Unable to duplicate review.")],
    };
  }
}

export async function updateGoogleReviewsSettings(
  settingsId: string,
  input: UpdateGoogleReviewsSettingsInput,
): Promise<ActionResult<GoogleReviewsSettings>> {
  if (!settingsId.trim()) {
    return {
      success: false,
      errors: ["Google review settings ID is required."],
    };
  }

  try {
    const supabase = await createClient();
    const payload = {
      ...input,
      ...(typeof input.place_id === "string"
        ? { place_id: cleanOptionalText(input.place_id) }
        : {}),
      ...(typeof input.api_key_encrypted === "string"
        ? {
            api_key_encrypted: cleanOptionalText(input.api_key_encrypted),
          }
        : {}),
    };

    const { data, error } = await supabase
      .from("google_reviews_settings")
      .update(payload)
      .eq("id", settingsId)
      .select("*")
      .single();

    if (error) return { success: false, errors: [error.message] };

    refreshReviewsPages();
    return { success: true, data: data as GoogleReviewsSettings };
  } catch (error) {
    return {
      success: false,
      errors: [errorMessage(error, "Unable to update Google review settings.")],
    };
  }
}

export async function importGoogleReviews(): Promise<
  ActionResult<GoogleImportResult>
> {
  try {
    const supabase = await createClient();
    const [section, settings] = await Promise.all([
      getSectionRecord(),
      getGoogleSettingsRecord(),
    ]);

    if (!section) {
      return {
        success: false,
        errors: ["Homepage review section was not found."],
      };
    }
    if (!settings) {
      return {
        success: false,
        errors: ["Google review settings were not found."],
      };
    }
    if (!settings.is_active) {
      return { success: false, errors: ["Google review import is disabled."] };
    }

    const placeId = settings.place_id?.trim();
    if (!placeId) {
      return { success: false, errors: ["Google Place ID is required."] };
    }

    const apiKey =
      process.env.GOOGLE_PLACES_API_KEY?.trim() ||
      settings.api_key_encrypted?.trim();

    if (!apiKey) {
      return {
        success: false,
        errors: [
          "Google Places API key is missing. Add GOOGLE_PLACES_API_KEY to the server environment.",
        ],
      };
    }

    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        method: "GET",
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "id,displayName,reviews",
        },
        cache: "no-store",
      },
    );

    const responseBody = (await response.json()) as
      | GooglePlacesDetailsResponse
      | { error?: { message?: string; status?: string } };

    if (!response.ok) {
      const apiError = "error" in responseBody ? responseBody.error : undefined;
      return {
        success: false,
        errors: [
          apiError?.message ||
            `Google Places request failed with status ${response.status}.`,
        ],
      };
    }

    const place = responseBody as GooglePlacesDetailsResponse;
    const googleReviews = place.reviews ?? [];

    if (googleReviews.length === 0) {
      await supabase
        .from("google_reviews_settings")
        .update({ last_imported_at: new Date().toISOString() })
        .eq("id", settings.id);

      return {
        success: true,
        data: { imported: 0, skipped: 0, totalReceived: 0 },
      };
    }

    const preparedReviews = googleReviews
      .map((review, index) => {
        const authorName =
          review.authorAttribution?.displayName?.trim() || "Google Customer";
        const text =
          review.text?.text?.trim() || review.originalText?.text?.trim() || "";
        const identifier = googleReviewIdentifier(placeId, {
          name: review.name,
          publishTime: review.publishTime,
          authorName,
          text,
        });

        return {
          identifier,
          payload: {
            section_id: section.id,
            customer_name: authorName,
            company_name: null,
            designation: null,
            location: null,
            rating: clampRating(Number(review.rating ?? 5)),
            review_title: null,
            review_text: text,
            customer_image_url: review.authorAttribution?.photoUri ?? null,
            customer_image_storage_path: null,
            customer_image_alt: `${authorName} Google profile image`,
            source_type: "google",
            google_review_id: identifier,
            google_author_url: review.authorAttribution?.uri ?? null,
            google_profile_photo_url:
              review.authorAttribution?.photoUri ?? null,
            google_relative_time:
              review.relativePublishTimeDescription ?? null,
            google_review_time: reviewTimestamp(review.publishTime),
            is_verified: settings.default_verified,
            is_featured: false,
            display_order: index + 1,
            is_active: true,
            is_published: settings.auto_publish_imported,
          },
        };
      })
      .filter((item) => item.payload.review_text.length > 0);

    const identifiers = preparedReviews.map((item) => item.identifier);
    const { data: existingRows, error: existingError } = await supabase
      .from("homepage_reviews")
      .select("google_review_id")
      .in("google_review_id", identifiers);

    if (existingError) {
      return { success: false, errors: [existingError.message] };
    }

    const existingIds = new Set(
      (existingRows ?? [])
        .map((row) => row.google_review_id as string | null)
        .filter((value): value is string => Boolean(value)),
    );

    const newReviews = preparedReviews
      .filter((item) => !existingIds.has(item.identifier))
      .map((item) => item.payload);

    if (newReviews.length > 0) {
      const { error: insertError } = await supabase
        .from("homepage_reviews")
        .insert(newReviews);

      if (insertError) {
        return { success: false, errors: [insertError.message] };
      }
    }

    const { error: settingsError } = await supabase
      .from("google_reviews_settings")
      .update({ last_imported_at: new Date().toISOString() })
      .eq("id", settings.id);

    if (settingsError) {
      console.error(
        "Google import time could not be updated:",
        settingsError.message,
      );
    }

    refreshReviewsPages();

    return {
      success: true,
      data: {
        imported: newReviews.length,
        skipped: preparedReviews.length - newReviews.length,
        totalReceived: googleReviews.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      errors: [errorMessage(error, "Unable to import Google reviews.")],
    };
  }
}
