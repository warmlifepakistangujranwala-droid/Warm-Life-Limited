"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  createHeroInsightSchema,
  updateHeroInsightSchema,
} from "@/lib/validations/hero-insight";

import type {
  CreateHeroInsightInput,
  HeroInsight,
  HeroInsightActionResult,
  UpdateHeroInsightInput,
} from "@/lib/types/hero-insight";

/* ==========================================================
   GET ALL INSIGHTS
========================================================== */

export async function getHeroInsights(): Promise<HeroInsight[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hero_insights")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as HeroInsight[];
}

/* ==========================================================
   GET INSIGHTS BY HERO SLIDE
========================================================== */

export async function getHeroInsightsBySlide(
  heroSlideId: string,
): Promise<HeroInsight[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hero_insights")
    .select("*")
    .eq("hero_slide_id", heroSlideId)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as HeroInsight[];
}

/* ==========================================================
   GET SINGLE INSIGHT
========================================================== */

export async function getHeroInsight(
  id: string,
): Promise<HeroInsight | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hero_insights")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch hero insight:", error.message);
    return null;
  }

  return data as HeroInsight | null;
}

/* ==========================================================
   CREATE INSIGHT
========================================================== */

export async function createHeroInsight(
  input: CreateHeroInsightInput,
): Promise<HeroInsightActionResult> {
  const validation = createHeroInsightSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hero_insights")
    .insert(validation.data)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/admin/website/homepage/hero");
  revalidatePath("/admin/website/homepage/hero/insights");
  revalidatePath("/");

  return {
    success: true,
    data: data as HeroInsight,
  };
}

/* ==========================================================
   UPDATE INSIGHT
========================================================== */

export async function updateHeroInsight(
  input: UpdateHeroInsightInput,
): Promise<HeroInsightActionResult> {
  const validation = updateHeroInsightSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { id, ...values } = validation.data;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hero_insights")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/admin/website/homepage/hero");
  revalidatePath("/admin/website/homepage/hero/insights");
  revalidatePath("/");

  return {
    success: true,
    data: data as HeroInsight,
  };
}

/* ==========================================================
   DELETE INSIGHT
========================================================== */

export async function deleteHeroInsight(
  id: string,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("hero_insights")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/website/homepage/hero");
  revalidatePath("/admin/website/homepage/hero/insights");
  revalidatePath("/");
}

/* ==========================================================
   TOGGLE VISIBILITY
========================================================== */

export async function setHeroInsightVisibility(
  id: string,
  visible: boolean,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("hero_insights")
    .update({
      is_visible: visible,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/website/homepage/hero");
  revalidatePath("/admin/website/homepage/hero/insights");
  revalidatePath("/");
}