/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/lib/actions/about-page.ts
 *
 * Purpose :
 * Provides validated server actions for managing the About Us
 * page settings, hero slides, departments and team members.
 *
 * Version : v1.1.0
 * ============================================================
 */

"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type {
  AboutDepartment,
  AboutHeroSlide,
  AboutPageData,
  AboutPageSettings,
  AboutTeamMemberWithDepartment,
  ActionResult,
  CreateAboutDepartmentInput,
  CreateAboutHeroSlideInput,
  CreateAboutTeamMemberInput,
  UpdateAboutDepartmentInput,
  UpdateAboutHeroSlideInput,
  UpdateAboutPageSettingsInput,
  UpdateAboutTeamMemberInput,
} from "@/lib/types/about-page";

import {
  aboutEntityIdSchema,
  createAboutDepartmentSchema,
  createAboutHeroSlideSchema,
  createAboutTeamMemberSchema,
  updateAboutDepartmentSchema,
  updateAboutHeroSlideSchema,
  updateAboutPageSettingsSchema,
  updateAboutTeamMemberSchema,
} from "@/lib/validations/about-page";

const ABOUT_ADMIN_PATH = "/admin/website/about";
const ABOUT_PUBLIC_PATH = "/about";

const SETTINGS_NULLABLE_FIELDS = new Set([
  "canonical_url",
  "og_image_url",
  "og_image_storage_path",
  "company_image_url",
  "company_image_storage_path",
]);

const HERO_SLIDE_NULLABLE_FIELDS = new Set([
  "image_url",
  "image_storage_path",
  "video_url",
  "video_storage_path",
  "poster_image_url",
  "poster_image_storage_path",
  "mobile_image_url",
  "mobile_image_storage_path",
]);

const TEAM_MEMBER_NULLABLE_FIELDS = new Set([
  "department_id",
  "image_url",
  "image_storage_path",
  "email",
  "phone",
  "linkedin_url",
]);

function revalidateAboutPages(): void {
  revalidatePath(ABOUT_PUBLIC_PATH);
  revalidatePath(ABOUT_ADMIN_PATH);
  revalidatePath(`${ABOUT_ADMIN_PATH}/hero`);
  revalidatePath(`${ABOUT_ADMIN_PATH}/departments`);
  revalidatePath(`${ABOUT_ADMIN_PATH}/team`);
}

function createSuccessResult(): ActionResult {
  return {
    success: true,
    errors: [],
  };
}

function createErrorResult(errors: string[]): ActionResult {
  return {
    success: false,
    errors,
  };
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function getValidationErrors(
  error: {
    issues: Array<{
      message: string;
    }>;
  },
): string[] {
  return Array.from(
    new Set(
      error.issues.map(
        (issue) => issue.message,
      ),
    ),
  );
}

function cleanOptionalText(
  value: string | null | undefined,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const cleanedValue = value.trim();

  return cleanedValue || null;
}

function cleanSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripImmutableFields(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const {
    id: _id,
    created_at: _createdAt,
    updated_at: _updatedAt,
    ...payload
  } = input;

  return payload;
}

function preparePayload(
  input: Record<string, unknown>,
  nullableFields: Set<string> = new Set(),
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(
      stripImmutableFields(input),
    ).map(([key, value]) => {
      if (typeof value !== "string") {
        return [key, value];
      }

      if (nullableFields.has(key)) {
        return [
          key,
          cleanOptionalText(value),
        ];
      }

      return [key, value.trim()];
    }),
  );
}

async function getAuthenticatedClient() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      supabase: null,
      error:
        "You must be signed in to manage the About Us page.",
    };
  }

  return {
    supabase,
    error: null,
  };
}

/* ============================================================
 * ABOUT PAGE DATA
 * ============================================================ */

export async function getAboutPageData(): Promise<AboutPageData> {
  try {
    const supabase = await createClient();

    const [
      settingsResult,
      slidesResult,
      departmentsResult,
      teamResult,
    ] = await Promise.all([
      supabase
        .from("about_page_settings")
        .select("*")
        .order("display_order", {
          ascending: true,
        })
        .limit(1)
        .maybeSingle(),

      supabase
        .from("about_hero_slides")
        .select("*")
        .order("display_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        }),

      supabase
        .from("about_departments")
        .select("*")
        .order("display_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        }),

      supabase
        .from("about_team_members")
        .select(
          `
            *,
            department:about_departments(*)
          `,
        )
        .order("featured", {
          ascending: false,
        })
        .order("display_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        }),
    ]);

    if (settingsResult.error) {
      console.error(
        "Failed to load About page settings:",
        settingsResult.error.message,
      );
    }

    if (slidesResult.error) {
      console.error(
        "Failed to load About hero slides:",
        slidesResult.error.message,
      );
    }

    if (departmentsResult.error) {
      console.error(
        "Failed to load About departments:",
        departmentsResult.error.message,
      );
    }

    if (teamResult.error) {
      console.error(
        "Failed to load About team members:",
        teamResult.error.message,
      );
    }

    return {
      settings:
        (settingsResult.data as AboutPageSettings | null) ??
        null,

      heroSlides:
        (slidesResult.data as AboutHeroSlide[] | null) ??
        [],

      departments:
        (departmentsResult.data as AboutDepartment[] | null) ??
        [],

      teamMembers:
        (teamResult.data as
          | AboutTeamMemberWithDepartment[]
          | null) ?? [],
    };
  } catch (error) {
    console.error(
      "Unexpected error loading About page data:",
      error,
    );

    return {
      settings: null,
      heroSlides: [],
      departments: [],
      teamMembers: [],
    };
  }
}

export async function getPublishedAboutPageData(): Promise<AboutPageData> {
  try {
    const supabase = await createClient();

    const settingsResult = await supabase
      .from("about_page_settings")
      .select("*")
      .eq("is_active", true)
      .eq("is_published", true)
      .order("display_order", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle();

    if (
      settingsResult.error ||
      !settingsResult.data
    ) {
      if (settingsResult.error) {
        console.error(
          "Failed to load published About page settings:",
          settingsResult.error.message,
        );
      }

      return {
        settings: null,
        heroSlides: [],
        departments: [],
        teamMembers: [],
      };
    }

    const settings =
      settingsResult.data as AboutPageSettings;

    const [
      slidesResult,
      departmentsResult,
      teamResult,
    ] = await Promise.all([
      supabase
        .from("about_hero_slides")
        .select("*")
        .eq("about_page_id", settings.id)
        .eq("is_active", true)
        .eq("is_published", true)
        .order("display_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        }),

      supabase
        .from("about_departments")
        .select("*")
        .eq("about_page_id", settings.id)
        .eq("is_active", true)
        .eq("is_published", true)
        .order("display_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        }),

      supabase
        .from("about_team_members")
        .select(
          `
            *,
            department:about_departments(*)
          `,
        )
        .eq("about_page_id", settings.id)
        .eq("is_active", true)
        .eq("is_published", true)
        .order("featured", {
          ascending: false,
        })
        .order("display_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        }),
    ]);

    if (slidesResult.error) {
      console.error(
        "Failed to load published About hero slides:",
        slidesResult.error.message,
      );
    }

    if (departmentsResult.error) {
      console.error(
        "Failed to load published About departments:",
        departmentsResult.error.message,
      );
    }

    if (teamResult.error) {
      console.error(
        "Failed to load published About team members:",
        teamResult.error.message,
      );
    }

    return {
      settings,

      heroSlides:
        (slidesResult.data as AboutHeroSlide[] | null) ??
        [],

      departments:
        (departmentsResult.data as AboutDepartment[] | null) ??
        [],

      teamMembers:
        (teamResult.data as
          | AboutTeamMemberWithDepartment[]
          | null) ?? [],
    };
  } catch (error) {
    console.error(
      "Unexpected error loading published About page data:",
      error,
    );

    return {
      settings: null,
      heroSlides: [],
      departments: [],
      teamMembers: [],
    };
  }
}

export async function getAboutPageSettings(): Promise<AboutPageSettings | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("about_page_settings")
      .select("*")
      .order("display_order", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Failed to load About page settings:",
        error.message,
      );

      return null;
    }

    return (
      (data as AboutPageSettings | null) ??
      null
    );
  } catch (error) {
    console.error(
      "Unexpected error loading About page settings:",
      error,
    );

    return null;
  }
}

export async function updateAboutPageSettings(
  settingsId: string,
  input: UpdateAboutPageSettingsInput,
): Promise<ActionResult> {
  const idResult =
    aboutEntityIdSchema.safeParse(
      settingsId,
    );

  if (!idResult.success) {
    return createErrorResult(
      getValidationErrors(idResult.error),
    );
  }

  const validationResult =
    updateAboutPageSettingsSchema.safeParse(
      input,
    );

  if (!validationResult.success) {
    return createErrorResult(
      getValidationErrors(
        validationResult.error,
      ),
    );
  }

  if (
    Object.keys(
      validationResult.data,
    ).length === 0
  ) {
    return createErrorResult([
      "No About page settings were provided.",
    ]);
  }

  try {
    const {
      supabase,
      error: authenticationError,
    } = await getAuthenticatedClient();

    if (!supabase) {
      return createErrorResult([
        authenticationError ??
          "Authentication is required.",
      ]);
    }

    const payload = preparePayload(
      validationResult.data as Record<
        string,
        unknown
      >,
      SETTINGS_NULLABLE_FIELDS,
    );

    const { data, error } = await supabase
      .from("about_page_settings")
      .update(payload)
      .eq("id", idResult.data)
      .select("id")
      .maybeSingle();

    if (error) {
      return createErrorResult([
        error.message,
      ]);
    }

    if (!data) {
      return createErrorResult([
        "About page settings could not be found.",
      ]);
    }

    revalidateAboutPages();

    return createSuccessResult();
  } catch (error) {
    return createErrorResult([
      getErrorMessage(
        error,
        "Unable to update About page settings.",
      ),
    ]);
  }
}

/* ============================================================
 * HERO SLIDES
 * ============================================================ */

export async function getAboutHeroSlides(): Promise<AboutHeroSlide[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("about_hero_slides")
      .select("*")
      .order("display_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Failed to load About hero slides:",
        error.message,
      );

      return [];
    }

    return (
      (data as AboutHeroSlide[] | null) ??
      []
    );
  } catch (error) {
    console.error(
      "Unexpected error loading About hero slides:",
      error,
    );

    return [];
  }
}

export async function getAboutHeroSlideById(
  slideId: string,
): Promise<AboutHeroSlide | null> {
  const idResult =
    aboutEntityIdSchema.safeParse(
      slideId,
    );

  if (!idResult.success) {
    return null;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("about_hero_slides")
      .select("*")
      .eq("id", idResult.data)
      .maybeSingle();

    if (error) {
      console.error(
        "Failed to load About hero slide:",
        error.message,
      );

      return null;
    }

    return (
      (data as AboutHeroSlide | null) ??
      null
    );
  } catch (error) {
    console.error(
      "Unexpected error loading About hero slide:",
      error,
    );

    return null;
  }
}

export async function createAboutHeroSlide(
  aboutPageId: string,
  input: CreateAboutHeroSlideInput,
): Promise<ActionResult> {
  const pageIdResult =
    aboutEntityIdSchema.safeParse(
      aboutPageId,
    );

  if (!pageIdResult.success) {
    return createErrorResult(
      getValidationErrors(
        pageIdResult.error,
      ),
    );
  }

  const validationResult =
    createAboutHeroSlideSchema.safeParse(
      input,
    );

  if (!validationResult.success) {
    return createErrorResult(
      getValidationErrors(
        validationResult.error,
      ),
    );
  }

  try {
    const {
      supabase,
      error: authenticationError,
    } = await getAuthenticatedClient();

    if (!supabase) {
      return createErrorResult([
        authenticationError ??
          "Authentication is required.",
      ]);
    }

    const values =
      validationResult.data;

    const payload = {
      about_page_id:
        pageIdResult.data,

      ...preparePayload(
        values as Record<
          string,
          unknown
        >,
        HERO_SLIDE_NULLABLE_FIELDS,
      ),

      image_alt:
        values.image_alt ||
        "Warm Life About Us hero image",

      poster_image_alt:
        values.poster_image_alt ||
        "Warm Life About Us video poster",

      mobile_image_alt:
        values.mobile_image_alt ||
        "Warm Life About Us mobile hero image",
    };

    const { error } = await supabase
      .from("about_hero_slides")
      .insert(payload);

    if (error) {
      return createErrorResult([
        error.message,
      ]);
    }

    revalidateAboutPages();

    return createSuccessResult();
  } catch (error) {
    return createErrorResult([
      getErrorMessage(
        error,
        "Unable to create About hero slide.",
      ),
    ]);
  }
}

export async function updateAboutHeroSlide(
  slideId: string,
  input: UpdateAboutHeroSlideInput,
): Promise<ActionResult> {
  const idResult =
    aboutEntityIdSchema.safeParse(
      slideId,
    );

  if (!idResult.success) {
    return createErrorResult(
      getValidationErrors(idResult.error),
    );
  }

  const validationResult =
    updateAboutHeroSlideSchema.safeParse(
      input,
    );

  if (!validationResult.success) {
    return createErrorResult(
      getValidationErrors(
        validationResult.error,
      ),
    );
  }

  if (
    Object.keys(
      validationResult.data,
    ).length === 0
  ) {
    return createErrorResult([
      "No hero slide changes were provided.",
    ]);
  }

  try {
    const {
      supabase,
      error: authenticationError,
    } = await getAuthenticatedClient();

    if (!supabase) {
      return createErrorResult([
        authenticationError ??
          "Authentication is required.",
      ]);
    }

    const payload = preparePayload(
      validationResult.data as Record<
        string,
        unknown
      >,
      HERO_SLIDE_NULLABLE_FIELDS,
    );

    const { data, error } = await supabase
      .from("about_hero_slides")
      .update(payload)
      .eq("id", idResult.data)
      .select("id")
      .maybeSingle();

    if (error) {
      return createErrorResult([
        error.message,
      ]);
    }

    if (!data) {
      return createErrorResult([
        "Hero slide could not be found.",
      ]);
    }

    revalidateAboutPages();

    return createSuccessResult();
  } catch (error) {
    return createErrorResult([
      getErrorMessage(
        error,
        "Unable to update About hero slide.",
      ),
    ]);
  }
}

export async function deleteAboutHeroSlide(
  slideId: string,
): Promise<ActionResult> {
  const idResult =
    aboutEntityIdSchema.safeParse(
      slideId,
    );

  if (!idResult.success) {
    return createErrorResult(
      getValidationErrors(idResult.error),
    );
  }

  try {
    const {
      supabase,
      error: authenticationError,
    } = await getAuthenticatedClient();

    if (!supabase) {
      return createErrorResult([
        authenticationError ??
          "Authentication is required.",
      ]);
    }

    const { data, error } = await supabase
      .from("about_hero_slides")
      .delete()
      .eq("id", idResult.data)
      .select("id")
      .maybeSingle();

    if (error) {
      return createErrorResult([
        error.message,
      ]);
    }

    if (!data) {
      return createErrorResult([
        "Hero slide could not be found.",
      ]);
    }

    revalidateAboutPages();

    return createSuccessResult();
  } catch (error) {
    return createErrorResult([
      getErrorMessage(
        error,
        "Unable to delete About hero slide.",
      ),
    ]);
  }
}

/* ============================================================
 * DEPARTMENTS
 * ============================================================ */

export async function getAboutDepartments(): Promise<AboutDepartment[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("about_departments")
      .select("*")
      .order("display_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Failed to load About departments:",
        error.message,
      );

      return [];
    }

    return (
      (data as AboutDepartment[] | null) ??
      []
    );
  } catch (error) {
    console.error(
      "Unexpected error loading About departments:",
      error,
    );

    return [];
  }
}

export async function getAboutDepartmentById(
  departmentId: string,
): Promise<AboutDepartment | null> {
  const idResult =
    aboutEntityIdSchema.safeParse(
      departmentId,
    );

  if (!idResult.success) {
    return null;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("about_departments")
      .select("*")
      .eq("id", idResult.data)
      .maybeSingle();

    if (error) {
      console.error(
        "Failed to load About department:",
        error.message,
      );

      return null;
    }

    return (
      (data as AboutDepartment | null) ??
      null
    );
  } catch (error) {
    console.error(
      "Unexpected error loading About department:",
      error,
    );

    return null;
  }
}

export async function createAboutDepartment(
  aboutPageId: string,
  input: CreateAboutDepartmentInput,
): Promise<ActionResult> {
  const pageIdResult =
    aboutEntityIdSchema.safeParse(
      aboutPageId,
    );

  if (!pageIdResult.success) {
    return createErrorResult(
      getValidationErrors(
        pageIdResult.error,
      ),
    );
  }

  const normalizedInput = {
    ...input,
    slug: cleanSlug(
      input.slug || input.name || "",
    ),
  };

  const validationResult =
    createAboutDepartmentSchema.safeParse(
      normalizedInput,
    );

  if (!validationResult.success) {
    return createErrorResult(
      getValidationErrors(
        validationResult.error,
      ),
    );
  }

  try {
    const {
      supabase,
      error: authenticationError,
    } = await getAuthenticatedClient();

    if (!supabase) {
      return createErrorResult([
        authenticationError ??
          "Authentication is required.",
      ]);
    }

    const payload = {
      about_page_id:
        pageIdResult.data,

      ...preparePayload(
        validationResult.data as Record<
          string,
          unknown
        >,
      ),
    };

    const { error } = await supabase
      .from("about_departments")
      .insert(payload);

    if (error) {
      return createErrorResult([
        error.message,
      ]);
    }

    revalidateAboutPages();

    return createSuccessResult();
  } catch (error) {
    return createErrorResult([
      getErrorMessage(
        error,
        "Unable to create department.",
      ),
    ]);
  }
}

export async function updateAboutDepartment(
  departmentId: string,
  input: UpdateAboutDepartmentInput,
): Promise<ActionResult> {
  const idResult =
    aboutEntityIdSchema.safeParse(
      departmentId,
    );

  if (!idResult.success) {
    return createErrorResult(
      getValidationErrors(idResult.error),
    );
  }

  const normalizedInput = {
    ...input,
    ...(typeof input.slug === "string"
      ? {
          slug: cleanSlug(input.slug),
        }
      : {}),
  };

  const validationResult =
    updateAboutDepartmentSchema.safeParse(
      normalizedInput,
    );

  if (!validationResult.success) {
    return createErrorResult(
      getValidationErrors(
        validationResult.error,
      ),
    );
  }

  if (
    Object.keys(
      validationResult.data,
    ).length === 0
  ) {
    return createErrorResult([
      "No department changes were provided.",
    ]);
  }

  try {
    const {
      supabase,
      error: authenticationError,
    } = await getAuthenticatedClient();

    if (!supabase) {
      return createErrorResult([
        authenticationError ??
          "Authentication is required.",
      ]);
    }

    const payload = preparePayload(
      validationResult.data as Record<
        string,
        unknown
      >,
    );

    const { data, error } = await supabase
      .from("about_departments")
      .update(payload)
      .eq("id", idResult.data)
      .select("id")
      .maybeSingle();

    if (error) {
      return createErrorResult([
        error.message,
      ]);
    }

    if (!data) {
      return createErrorResult([
        "Department could not be found.",
      ]);
    }

    revalidateAboutPages();

    return createSuccessResult();
  } catch (error) {
    return createErrorResult([
      getErrorMessage(
        error,
        "Unable to update department.",
      ),
    ]);
  }
}

export async function deleteAboutDepartment(
  departmentId: string,
): Promise<ActionResult> {
  const idResult =
    aboutEntityIdSchema.safeParse(
      departmentId,
    );

  if (!idResult.success) {
    return createErrorResult(
      getValidationErrors(idResult.error),
    );
  }

  try {
    const {
      supabase,
      error: authenticationError,
    } = await getAuthenticatedClient();

    if (!supabase) {
      return createErrorResult([
        authenticationError ??
          "Authentication is required.",
      ]);
    }

    const { count, error: memberCountError } =
      await supabase
        .from("about_team_members")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq(
          "department_id",
          idResult.data,
        );

    if (memberCountError) {
      return createErrorResult([
        memberCountError.message,
      ]);
    }

    if ((count ?? 0) > 0) {
      return createErrorResult([
        "This department cannot be deleted while team members are assigned to it.",
      ]);
    }

    const { data, error } = await supabase
      .from("about_departments")
      .delete()
      .eq("id", idResult.data)
      .select("id")
      .maybeSingle();

    if (error) {
      return createErrorResult([
        error.message,
      ]);
    }

    if (!data) {
      return createErrorResult([
        "Department could not be found.",
      ]);
    }

    revalidateAboutPages();

    return createSuccessResult();
  } catch (error) {
    return createErrorResult([
      getErrorMessage(
        error,
        "Unable to delete department.",
      ),
    ]);
  }
}

/* ============================================================
 * TEAM MEMBERS
 * ============================================================ */

export async function getAboutTeamMembers(): Promise<
  AboutTeamMemberWithDepartment[]
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("about_team_members")
      .select(
        `
          *,
          department:about_departments(*)
        `,
      )
      .order("featured", {
        ascending: false,
      })
      .order("display_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Failed to load About team members:",
        error.message,
      );

      return [];
    }

    return (
      (data as
        | AboutTeamMemberWithDepartment[]
        | null) ?? []
    );
  } catch (error) {
    console.error(
      "Unexpected error loading About team members:",
      error,
    );

    return [];
  }
}

export async function getAboutTeamMemberById(
  memberId: string,
): Promise<AboutTeamMemberWithDepartment | null> {
  const idResult =
    aboutEntityIdSchema.safeParse(
      memberId,
    );

  if (!idResult.success) {
    return null;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("about_team_members")
      .select(
        `
          *,
          department:about_departments(*)
        `,
      )
      .eq("id", idResult.data)
      .maybeSingle();

    if (error) {
      console.error(
        "Failed to load About team member:",
        error.message,
      );

      return null;
    }

    return (
      (data as AboutTeamMemberWithDepartment | null) ??
      null
    );
  } catch (error) {
    console.error(
      "Unexpected error loading About team member:",
      error,
    );

    return null;
  }
}

export async function createAboutTeamMember(
  aboutPageId: string,
  input: CreateAboutTeamMemberInput,
): Promise<ActionResult> {
  const pageIdResult =
    aboutEntityIdSchema.safeParse(
      aboutPageId,
    );

  if (!pageIdResult.success) {
    return createErrorResult(
      getValidationErrors(
        pageIdResult.error,
      ),
    );
  }

  const validationResult =
    createAboutTeamMemberSchema.safeParse(
      input,
    );

  if (!validationResult.success) {
    return createErrorResult(
      getValidationErrors(
        validationResult.error,
      ),
    );
  }

  try {
    const {
      supabase,
      error: authenticationError,
    } = await getAuthenticatedClient();

    if (!supabase) {
      return createErrorResult([
        authenticationError ??
          "Authentication is required.",
      ]);
    }

    const values =
      validationResult.data;

    const payload = {
      about_page_id:
        pageIdResult.data,

      ...preparePayload(
        values as Record<
          string,
          unknown
        >,
        TEAM_MEMBER_NULLABLE_FIELDS,
      ),

      image_alt:
        values.image_alt ||
        `${values.full_name} - Warm Life team member`,
    };

    const { error } = await supabase
      .from("about_team_members")
      .insert(payload);

    if (error) {
      return createErrorResult([
        error.message,
      ]);
    }

    revalidateAboutPages();

    return createSuccessResult();
  } catch (error) {
    return createErrorResult([
      getErrorMessage(
        error,
        "Unable to create team member.",
      ),
    ]);
  }
}

export async function updateAboutTeamMember(
  memberId: string,
  input: UpdateAboutTeamMemberInput,
): Promise<ActionResult> {
  const idResult =
    aboutEntityIdSchema.safeParse(
      memberId,
    );

  if (!idResult.success) {
    return createErrorResult(
      getValidationErrors(idResult.error),
    );
  }

  const validationResult =
    updateAboutTeamMemberSchema.safeParse(
      input,
    );

  if (!validationResult.success) {
    return createErrorResult(
      getValidationErrors(
        validationResult.error,
      ),
    );
  }

  if (
    Object.keys(
      validationResult.data,
    ).length === 0
  ) {
    return createErrorResult([
      "No team member changes were provided.",
    ]);
  }

  try {
    const {
      supabase,
      error: authenticationError,
    } = await getAuthenticatedClient();

    if (!supabase) {
      return createErrorResult([
        authenticationError ??
          "Authentication is required.",
      ]);
    }

    const payload = preparePayload(
      validationResult.data as Record<
        string,
        unknown
      >,
      TEAM_MEMBER_NULLABLE_FIELDS,
    );

    const { data, error } = await supabase
      .from("about_team_members")
      .update(payload)
      .eq("id", idResult.data)
      .select("id")
      .maybeSingle();

    if (error) {
      return createErrorResult([
        error.message,
      ]);
    }

    if (!data) {
      return createErrorResult([
        "Team member could not be found.",
      ]);
    }

    revalidateAboutPages();

    return createSuccessResult();
  } catch (error) {
    return createErrorResult([
      getErrorMessage(
        error,
        "Unable to update team member.",
      ),
    ]);
  }
}

export async function deleteAboutTeamMember(
  memberId: string,
): Promise<ActionResult> {
  const idResult =
    aboutEntityIdSchema.safeParse(
      memberId,
    );

  if (!idResult.success) {
    return createErrorResult(
      getValidationErrors(idResult.error),
    );
  }

  try {
    const {
      supabase,
      error: authenticationError,
    } = await getAuthenticatedClient();

    if (!supabase) {
      return createErrorResult([
        authenticationError ??
          "Authentication is required.",
      ]);
    }

    const { data, error } = await supabase
      .from("about_team_members")
      .delete()
      .eq("id", idResult.data)
      .select("id")
      .maybeSingle();

    if (error) {
      return createErrorResult([
        error.message,
      ]);
    }

    if (!data) {
      return createErrorResult([
        "Team member could not be found.",
      ]);
    }

    revalidateAboutPages();

    return createSuccessResult();
  } catch (error) {
    return createErrorResult([
      getErrorMessage(
        error,
        "Unable to delete team member.",
      ),
    ]);
  }
}

/* ============================================================
 * STATUS TOGGLES
 * ============================================================ */

export async function toggleAboutHeroSlideActive(
  slideId: string,
  isActive: boolean,
): Promise<ActionResult> {
  return updateAboutHeroSlide(
    slideId,
    {
      is_active: isActive,
    },
  );
}

export async function toggleAboutHeroSlidePublished(
  slideId: string,
  isPublished: boolean,
): Promise<ActionResult> {
  return updateAboutHeroSlide(
    slideId,
    {
      is_published: isPublished,
    },
  );
}

export async function toggleAboutDepartmentActive(
  departmentId: string,
  isActive: boolean,
): Promise<ActionResult> {
  return updateAboutDepartment(
    departmentId,
    {
      is_active: isActive,
    },
  );
}

export async function toggleAboutDepartmentPublished(
  departmentId: string,
  isPublished: boolean,
): Promise<ActionResult> {
  return updateAboutDepartment(
    departmentId,
    {
      is_published: isPublished,
    },
  );
}

export async function toggleAboutTeamMemberActive(
  memberId: string,
  isActive: boolean,
): Promise<ActionResult> {
  return updateAboutTeamMember(
    memberId,
    {
      is_active: isActive,
    },
  );
}

export async function toggleAboutTeamMemberPublished(
  memberId: string,
  isPublished: boolean,
): Promise<ActionResult> {
  return updateAboutTeamMember(
    memberId,
    {
      is_published: isPublished,
    },
  );
}