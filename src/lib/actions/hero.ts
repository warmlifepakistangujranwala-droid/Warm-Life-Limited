"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { heroSlideSchema } from "@/lib/validations/hero";
import type {
  CreateHeroSlideInput,
  HeroSlide,
  HeroSlideActionResult,
  UpdateHeroSlideInput,
} from "@/lib/types/hero";


/* -----------------------------
   GET ALL HERO SLIDES
-------------------------------- */

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data as HeroSlide[];
}

/* -----------------------------
   GET SINGLE HERO
-------------------------------- */

export async function getHeroSlide(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as HeroSlide;
}

/* -----------------------------
   CREATE HERO
-------------------------------- */

export async function createHeroSlide(
  values: CreateHeroSlideInput,
): Promise<HeroSlideActionResult> {
  const parsed = heroSlideSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("hero_slides")
    .insert(parsed.data);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/admin/website/homepage/hero");

  return {
    success: true,
    message: "Hero slide created successfully.",
  };
}

/* -----------------------------
   UPDATE HERO
-------------------------------- */

export async function updateHeroSlide(
  values: UpdateHeroSlideInput,
): Promise<HeroSlideActionResult> {
  const { id, ...payload } = values;

  const parsed = heroSlideSchema.partial().safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("hero_slides")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/admin/website/homepage/hero");

  return {
    success: true,
    message: "Hero updated successfully.",
  };
}

/* -----------------------------
   DELETE HERO
-------------------------------- */

export async function deleteHeroSlide(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("hero_slides")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/admin/website/homepage/hero");

  return {
    success: true,
    message: "Hero deleted successfully.",
  };
}

/* -----------------------------
   PUBLISH / UNPUBLISH
-------------------------------- */

export async function setHeroPublished(
  id: string,
  published: boolean,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("hero_slides")
    .update({
      is_published: published,
    })
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/admin/website/homepage/hero");

  return {
    success: true,
    message: published
      ? "Hero published."
      : "Hero unpublished.",
  };
}