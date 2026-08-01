"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type {
  CreateHomepageHowWeWorkGroupInput,
  CreateHomepageHowWeWorkStepInput,
  HomepageHowWeWorkData,
  HomepageHowWeWorkGroup,
  HomepageHowWeWorkGroupWithSteps,
  HomepageHowWeWorkSection,
  HomepageHowWeWorkStep,
  UpdateHomepageHowWeWorkGroupInput,
  UpdateHomepageHowWeWorkSectionInput,
  UpdateHomepageHowWeWorkStepInput,
} from "@/lib/types/homepage-how-we-work";

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
  "/admin/website/homepage/how-we-work";

function refreshHowWeWorkPages(): void {
  revalidatePath("/");
  revalidatePath("/admin/website/homepage");
  revalidatePath(ADMIN_PATH);
}

export async function getHomepageHowWeWorkData(): Promise<HomepageHowWeWorkData> {
  const supabase = await createClient();

  const [
    sectionResult,
    groupsResult,
    stepsResult,
  ] = await Promise.all([
    supabase
      .from("homepage_how_we_work_section")
      .select("*")
      .limit(1)
      .maybeSingle(),

    supabase
      .from("homepage_how_we_work_groups")
      .select("*")
      .order("display_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      }),

    supabase
      .from("homepage_how_we_work_steps")
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
      "Failed to load homepage how we work section:",
      sectionResult.error.message,
      sectionResult.error.code,
      sectionResult.error.details,
      sectionResult.error.hint,
    );
  }

  if (groupsResult.error) {
    console.error(
      "Failed to load homepage how we work groups:",
      groupsResult.error.message,
      groupsResult.error.code,
      groupsResult.error.details,
      groupsResult.error.hint,
    );
  }

  if (stepsResult.error) {
    console.error(
      "Failed to load homepage how we work steps:",
      stepsResult.error.message,
      stepsResult.error.code,
      stepsResult.error.details,
      stepsResult.error.hint,
    );
  }

  const groups =
    (groupsResult.data as HomepageHowWeWorkGroup[] | null) ??
    [];

  const steps =
    (stepsResult.data as HomepageHowWeWorkStep[] | null) ??
    [];

  const groupsWithSteps: HomepageHowWeWorkGroupWithSteps[] =
    groups.map((group) => ({
      ...group,
      steps: steps.filter(
        (step) =>
          step.group_id === group.id,
      ),
    }));

  return {
    section:
      (sectionResult.data as HomepageHowWeWorkSection | null) ??
      null,

    groups:
      groupsWithSteps,
  };
}

export async function updateHomepageHowWeWorkSection(
  id: string,
  input: UpdateHomepageHowWeWorkSectionInput,
): Promise<ActionResult<HomepageHowWeWorkSection>> {
  const supabase = await createClient();

  if (!id.trim()) {
    return {
      success: false,
      errors: [
        "How We Work section ID is required.",
      ],
    };
  }

  const { data, error } = await supabase
    .from("homepage_how_we_work_section")
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

  refreshHowWeWorkPages();

  return {
    success: true,
    data:
      data as HomepageHowWeWorkSection,
  };
}

export async function createHomepageHowWeWorkGroup(
  input: CreateHomepageHowWeWorkGroupInput,
): Promise<ActionResult<HomepageHowWeWorkGroup>> {
  const supabase = await createClient();

  if (!input.section_id?.trim()) {
    return {
      success: false,
      errors: [
        "How We Work section ID is required.",
      ],
    };
  }

  if (!input.internal_name?.trim()) {
    return {
      success: false,
      errors: [
        "Internal group name is required.",
      ],
    };
  }

  if (!input.title?.trim()) {
    return {
      success: false,
      errors: [
        "Group title is required.",
      ],
    };
  }

  const payload = {
    ...input,

    section_id:
      input.section_id.trim(),

    internal_name:
      input.internal_name.trim(),

    title:
      input.title.trim(),

    subtitle:
      input.subtitle?.trim() || null,

    icon_key:
      input.icon_key.trim(),

    image_url:
      input.image_url?.trim() || null,

    image_storage_path:
      input.image_storage_path?.trim() ||
      null,

    image_alt:
      input.image_alt.trim() ||
      "Process group image",

    background_image_url:
      input.background_image_url?.trim() ||
      null,

    background_image_storage_path:
      input.background_image_storage_path?.trim() ||
      null,

    background_image_alt:
      input.background_image_alt.trim() ||
      "Process group background",

    highlight_text:
      input.highlight_text?.trim() ||
      null,

    highlight_icon_key:
      input.highlight_icon_key.trim(),
  };

  const { data, error } = await supabase
    .from("homepage_how_we_work_groups")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  refreshHowWeWorkPages();

  return {
    success: true,
    data:
      data as HomepageHowWeWorkGroup,
  };
}

export async function updateHomepageHowWeWorkGroup(
  id: string,
  input: UpdateHomepageHowWeWorkGroupInput,
): Promise<ActionResult<HomepageHowWeWorkGroup>> {
  const supabase = await createClient();

  if (!id.trim()) {
    return {
      success: false,
      errors: [
        "How We Work group ID is required.",
      ],
    };
  }

  const payload = {
    ...input,

    ...(typeof input.internal_name === "string"
      ? {
          internal_name:
            input.internal_name.trim(),
        }
      : {}),

    ...(typeof input.title === "string"
      ? {
          title:
            input.title.trim(),
        }
      : {}),

    ...(typeof input.subtitle === "string"
      ? {
          subtitle:
            input.subtitle.trim() ||
            null,
        }
      : {}),

    ...(typeof input.icon_key === "string"
      ? {
          icon_key:
            input.icon_key.trim(),
        }
      : {}),

    ...(typeof input.image_url === "string"
      ? {
          image_url:
            input.image_url.trim() ||
            null,
        }
      : {}),

    ...(typeof input.image_storage_path ===
    "string"
      ? {
          image_storage_path:
            input.image_storage_path.trim() ||
            null,
        }
      : {}),

    ...(typeof input.image_alt === "string"
      ? {
          image_alt:
            input.image_alt.trim() ||
            "Process group image",
        }
      : {}),

    ...(typeof input.background_image_url ===
    "string"
      ? {
          background_image_url:
            input.background_image_url.trim() ||
            null,
        }
      : {}),

    ...(typeof input.background_image_storage_path ===
    "string"
      ? {
          background_image_storage_path:
            input.background_image_storage_path.trim() ||
            null,
        }
      : {}),

    ...(typeof input.background_image_alt ===
    "string"
      ? {
          background_image_alt:
            input.background_image_alt.trim() ||
            "Process group background",
        }
      : {}),

    ...(typeof input.highlight_text ===
    "string"
      ? {
          highlight_text:
            input.highlight_text.trim() ||
            null,
        }
      : {}),

    ...(typeof input.highlight_icon_key ===
    "string"
      ? {
          highlight_icon_key:
            input.highlight_icon_key.trim(),
        }
      : {}),
  };

  const { data, error } = await supabase
    .from("homepage_how_we_work_groups")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  refreshHowWeWorkPages();

  return {
    success: true,
    data:
      data as HomepageHowWeWorkGroup,
  };
}

export async function deleteHomepageHowWeWorkGroup(
  id: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  if (!id.trim()) {
    return {
      success: false,
      errors: [
        "How We Work group ID is required.",
      ],
    };
  }

  const { data: group } =
    await supabase
      .from("homepage_how_we_work_groups")
      .select(
        "image_storage_path, background_image_storage_path",
      )
      .eq("id", id)
      .maybeSingle();

  const { data: steps } =
    await supabase
      .from("homepage_how_we_work_steps")
      .select(
        "image_storage_path",
      )
      .eq("group_id", id);

  const { error } = await supabase
    .from("homepage_how_we_work_groups")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  const storagePaths = [
    group?.image_storage_path,
    group?.background_image_storage_path,
    ...(steps ?? []).map(
      (step) =>
        step.image_storage_path,
    ),
  ].filter(
    (path): path is string =>
      Boolean(path),
  );

  if (storagePaths.length > 0) {
    const {
      error: storageError,
    } = await supabase.storage
      .from("website-media")
      .remove(storagePaths);

    if (storageError) {
      console.error(
        "How We Work group images could not be removed:",
        storageError.message,
      );
    }
  }

  refreshHowWeWorkPages();

  return {
    success: true,
    data: null,
  };
}

export async function createHomepageHowWeWorkStep(
  input: CreateHomepageHowWeWorkStepInput,
): Promise<ActionResult<HomepageHowWeWorkStep>> {
  const supabase = await createClient();

  if (!input.group_id?.trim()) {
    return {
      success: false,
      errors: [
        "Process group ID is required.",
      ],
    };
  }

  if (!input.step_label?.trim()) {
    return {
      success: false,
      errors: [
        "Step label is required.",
      ],
    };
  }

  if (!input.title?.trim()) {
    return {
      success: false,
      errors: [
        "Step title is required.",
      ],
    };
  }

  if (!input.description?.trim()) {
    return {
      success: false,
      errors: [
        "Step description is required.",
      ],
    };
  }

  const payload = {
    ...input,

    group_id:
      input.group_id.trim(),

    step_label:
      input.step_label.trim(),

    title:
      input.title.trim(),

    description:
      input.description.trim(),

    icon_key:
      input.icon_key.trim(),

    image_url:
      input.image_url?.trim() || null,

    image_storage_path:
      input.image_storage_path?.trim() ||
      null,

    image_alt:
      input.image_alt.trim() ||
      "Process step image",

    button_text:
      input.button_text?.trim() || null,

    button_link:
      input.button_link?.trim() || null,
  };

  const { data, error } = await supabase
    .from("homepage_how_we_work_steps")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  refreshHowWeWorkPages();

  return {
    success: true,
    data:
      data as HomepageHowWeWorkStep,
  };
}

export async function updateHomepageHowWeWorkStep(
  id: string,
  input: UpdateHomepageHowWeWorkStepInput,
): Promise<ActionResult<HomepageHowWeWorkStep>> {
  const supabase = await createClient();

  if (!id.trim()) {
    return {
      success: false,
      errors: [
        "How We Work step ID is required.",
      ],
    };
  }

  const payload = {
    ...input,

    ...(typeof input.step_label === "string"
      ? {
          step_label:
            input.step_label.trim(),
        }
      : {}),

    ...(typeof input.title === "string"
      ? {
          title:
            input.title.trim(),
        }
      : {}),

    ...(typeof input.description ===
    "string"
      ? {
          description:
            input.description.trim(),
        }
      : {}),

    ...(typeof input.icon_key === "string"
      ? {
          icon_key:
            input.icon_key.trim(),
        }
      : {}),

    ...(typeof input.image_url === "string"
      ? {
          image_url:
            input.image_url.trim() ||
            null,
        }
      : {}),

    ...(typeof input.image_storage_path ===
    "string"
      ? {
          image_storage_path:
            input.image_storage_path.trim() ||
            null,
        }
      : {}),

    ...(typeof input.image_alt === "string"
      ? {
          image_alt:
            input.image_alt.trim() ||
            "Process step image",
        }
      : {}),

    ...(typeof input.button_text === "string"
      ? {
          button_text:
            input.button_text.trim() ||
            null,
        }
      : {}),

    ...(typeof input.button_link === "string"
      ? {
          button_link:
            input.button_link.trim() ||
            null,
        }
      : {}),
  };

  const { data, error } = await supabase
    .from("homepage_how_we_work_steps")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  refreshHowWeWorkPages();

  return {
    success: true,
    data:
      data as HomepageHowWeWorkStep,
  };
}

export async function deleteHomepageHowWeWorkStep(
  id: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  if (!id.trim()) {
    return {
      success: false,
      errors: [
        "How We Work step ID is required.",
      ],
    };
  }

  const { data: step } =
    await supabase
      .from("homepage_how_we_work_steps")
      .select(
        "image_storage_path",
      )
      .eq("id", id)
      .maybeSingle();

  const { error } = await supabase
    .from("homepage_how_we_work_steps")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }

  if (step?.image_storage_path) {
    const {
      error: storageError,
    } = await supabase.storage
      .from("website-media")
      .remove([
        step.image_storage_path,
      ]);

    if (storageError) {
      console.error(
        "How We Work step image could not be removed:",
        storageError.message,
      );
    }
  }

  refreshHowWeWorkPages();

  return {
    success: true,
    data: null,
  };
}