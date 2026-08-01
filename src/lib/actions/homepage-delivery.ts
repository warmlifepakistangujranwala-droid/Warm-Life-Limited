"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type {
  CreateHomepageDeliveryFeatureInput,
  CreateHomepageDeliveryStatisticInput,
  HomepageDeliveryData,
  HomepageDeliveryFeature,
  HomepageDeliverySection,
  HomepageDeliveryStatistic,
  UpdateHomepageDeliveryFeatureInput,
  UpdateHomepageDeliverySectionInput,
  UpdateHomepageDeliveryStatisticInput,
} from "@/lib/types/homepage-delivery";

type ActionResult<T = null> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errors: string[];
    };

const ADMIN_PATH =
  "/admin/website/homepage/delivery-partner";

function refreshDeliveryPages(): void {
  revalidatePath("/");
  revalidatePath("/admin/website/homepage");
  revalidatePath(ADMIN_PATH);
}

export async function getHomepageDeliveryData(): Promise<HomepageDeliveryData> {
  const supabase = await createClient();

  const [
    sectionResult,
    statisticsResult,
    featuresResult,
  ] = await Promise.all([
    supabase
      .from("homepage_delivery_section")
      .select("*")
      .limit(1)
      .maybeSingle(),

    supabase
      .from("homepage_delivery_statistics")
      .select("*")
      .order("display_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      }),

    supabase
      .from("homepage_delivery_features")
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
      "Failed to load homepage delivery section:",
      sectionResult.error.message,
      sectionResult.error.code,
      sectionResult.error.details,
      sectionResult.error.hint,
    );
  }

  if (statisticsResult.error) {
    console.error(
      "Failed to load homepage delivery statistics:",
      statisticsResult.error.message,
      statisticsResult.error.code,
      statisticsResult.error.details,
      statisticsResult.error.hint,
    );
  }

  if (featuresResult.error) {
    console.error(
      "Failed to load homepage delivery features:",
      featuresResult.error.message,
      featuresResult.error.code,
      featuresResult.error.details,
      featuresResult.error.hint,
    );
  }

  return {
    section:
      (sectionResult.data as HomepageDeliverySection | null) ??
      null,

    statistics:
      (statisticsResult.data as HomepageDeliveryStatistic[] | null) ??
      [],

    features:
      (featuresResult.data as HomepageDeliveryFeature[] | null) ??
      [],
  };
}

export async function updateHomepageDeliverySection(
  id: string,
  input: UpdateHomepageDeliverySectionInput,
): Promise<ActionResult<HomepageDeliverySection>> {
  const supabase = await createClient();

  if (!id.trim()) {
    return {
      success: false,
      errors: [
        "Delivery section ID is required.",
      ],
    };
  }

  const { data, error } = await supabase
    .from("homepage_delivery_section")
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

  refreshDeliveryPages();

  return {
    success: true,
    data: data as HomepageDeliverySection,
  };
}

export async function createHomepageDeliveryStatistic(
  input: CreateHomepageDeliveryStatisticInput,
): Promise<ActionResult<HomepageDeliveryStatistic>> {
  const supabase = await createClient();

  if (!input.section_id?.trim()) {
    return {
      success: false,
      errors: [
        "Delivery section ID is required.",
      ],
    };
  }

  if (!input.value?.trim()) {
    return {
      success: false,
      errors: [
        "Statistic value is required.",
      ],
    };
  }

  if (!input.title?.trim()) {
    return {
      success: false,
      errors: [
        "Statistic title is required.",
      ],
    };
  }

  const { data, error } = await supabase
    .from("homepage_delivery_statistics")
    .insert({
      ...input,
      section_id:
        input.section_id.trim(),
      value:
        input.value.trim(),
      title:
        input.title.trim(),
      description:
        input.description.trim(),
      icon_key:
        input.icon_key.trim(),
    })
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  refreshDeliveryPages();

  return {
    success: true,
    data: data as HomepageDeliveryStatistic,
  };
}

export async function updateHomepageDeliveryStatistic(
  id: string,
  input: UpdateHomepageDeliveryStatisticInput,
): Promise<ActionResult<HomepageDeliveryStatistic>> {
  const supabase = await createClient();

  if (!id.trim()) {
    return {
      success: false,
      errors: [
        "Statistic ID is required.",
      ],
    };
  }

  const { data, error } = await supabase
    .from("homepage_delivery_statistics")
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

  refreshDeliveryPages();

  return {
    success: true,
    data: data as HomepageDeliveryStatistic,
  };
}

export async function deleteHomepageDeliveryStatistic(
  id: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  if (!id.trim()) {
    return {
      success: false,
      errors: [
        "Statistic ID is required.",
      ],
    };
  }

  const { error } = await supabase
    .from("homepage_delivery_statistics")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  refreshDeliveryPages();

  return {
    success: true,
    data: null,
  };
}

export async function createHomepageDeliveryFeature(
  input: CreateHomepageDeliveryFeatureInput,
): Promise<ActionResult<HomepageDeliveryFeature>> {
  const supabase = await createClient();

  if (!input.section_id?.trim()) {
    return {
      success: false,
      errors: [
        "Delivery section ID is required.",
      ],
    };
  }

  if (!input.title?.trim()) {
    return {
      success: false,
      errors: [
        "Feature title is required.",
      ],
    };
  }

  const { data, error } = await supabase
    .from("homepage_delivery_features")
    .insert({
      ...input,
      section_id:
        input.section_id.trim(),
      title:
        input.title.trim(),
      description:
        input.description.trim(),
      icon_key:
        input.icon_key.trim(),
    })
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  refreshDeliveryPages();

  return {
    success: true,
    data: data as HomepageDeliveryFeature,
  };
}

export async function updateHomepageDeliveryFeature(
  id: string,
  input: UpdateHomepageDeliveryFeatureInput,
): Promise<ActionResult<HomepageDeliveryFeature>> {
  const supabase = await createClient();

  if (!id.trim()) {
    return {
      success: false,
      errors: [
        "Feature ID is required.",
      ],
    };
  }

  const { data, error } = await supabase
    .from("homepage_delivery_features")
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

  refreshDeliveryPages();

  return {
    success: true,
    data: data as HomepageDeliveryFeature,
  };
}

export async function deleteHomepageDeliveryFeature(
  id: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  if (!id.trim()) {
    return {
      success: false,
      errors: [
        "Feature ID is required.",
      ],
    };
  }

  const { error } = await supabase
    .from("homepage_delivery_features")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  refreshDeliveryPages();

  return {
    success: true,
    data: null,
  };
}