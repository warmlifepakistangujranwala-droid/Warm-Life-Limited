/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/lib/actions/contact-page.ts
 *
 * Purpose :
 * Contact Page CMS server actions.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  contactUuidSchema,
  createContactEnquiryTypeSchema,
  createContactPageDetailSchema,
  createContactPageSocialLinkSchema,
  createContactSubmissionSchema,
  updateContactEnquiryTypeSchema,
  updateContactPageDetailSchema,
  updateContactPageSettingsSchema,
  updateContactPageSocialLinkSchema,
  updateContactSubmissionSchema,
} from "@/lib/validations/contact-page";

import type {
  ContactActionResult,
  ContactEnquiryType,
  ContactFormSubmission,
  ContactPageData,
  ContactPageDetail,
  ContactPageSettings,
  ContactPageSocialLink,
  CreateContactEnquiryTypeInput,
  CreateContactPageDetailInput,
  CreateContactPageSocialLinkInput,
  CreateContactSubmissionInput,
  UpdateContactEnquiryTypeInput,
  UpdateContactPageDetailInput,
  UpdateContactPageSettingsInput,
  UpdateContactPageSocialLinkInput,
  UpdateContactSubmissionInput,
} from "@/lib/types/contact-page";

const CONTACT_ADMIN_PATH =
  "/admin/website/contact";

const CONTACT_SUBMISSIONS_PATH =
  "/admin/website/contact/submissions";

function revalidateContactPages(): void {
  revalidatePath("/contact");
  revalidatePath(CONTACT_ADMIN_PATH);
  revalidatePath(CONTACT_SUBMISSIONS_PATH);
}

function flattenErrors(
  error: {
    flatten: () => {
      fieldErrors: Record<
        string,
        string[] | undefined
      >;
    };
  },
): Record<
  string,
  string[] | undefined
> {
  return error.flatten().fieldErrors;
}

/* ============================================================
   COMPLETE CONTACT PAGE DATA
   ============================================================ */

export async function getContactPageData():
  Promise<ContactPageData> {
  try {
    const supabase =
      await createClient();

    const [
      settingsResult,
      detailsResult,
      enquiryTypesResult,
      socialLinksResult,
    ] = await Promise.all([
      supabase
        .from("contact_page_settings")
        .select("*")
        .eq("is_active", true)
        .eq("is_published", true)
        .order("updated_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle(),

      supabase
        .from("contact_page_details")
        .select("*")
        .eq("is_active", true)
        .eq("is_published", true)
        .order("display_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        }),

      supabase
        .from("contact_enquiry_types")
        .select("*")
        .eq("is_active", true)
        .eq("is_published", true)
        .order("display_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        }),

      supabase
        .from("contact_page_social_links")
        .select("*")
        .eq("is_active", true)
        .eq("is_published", true)
        .order("display_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        }),
    ]);

    if (settingsResult.error) {
      console.error(
        "Failed to load Contact settings:",
        settingsResult.error,
      );
    }

    if (detailsResult.error) {
      console.error(
        "Failed to load Contact details:",
        detailsResult.error,
      );
    }

    if (enquiryTypesResult.error) {
      console.error(
        "Failed to load enquiry types:",
        enquiryTypesResult.error,
      );
    }

    if (socialLinksResult.error) {
      console.error(
        "Failed to load Contact social links:",
        socialLinksResult.error,
      );
    }

    return {
      settings:
        (settingsResult.data as
          | ContactPageSettings
          | null) ?? null,

      details:
        (detailsResult.data as
          | ContactPageDetail[]
          | null) ?? [],

      enquiryTypes:
        (enquiryTypesResult.data as
          | ContactEnquiryType[]
          | null) ?? [],

      socialLinks:
        (socialLinksResult.data as
          | ContactPageSocialLink[]
          | null) ?? [],
    };
  } catch (error) {
    console.error(
      "Unexpected error loading Contact page:",
      error,
    );

    return {
      settings: null,
      details: [],
      enquiryTypes: [],
      socialLinks: [],
    };
  }
}

/* ============================================================
   ADMIN LOADERS
   ============================================================ */

export async function getContactPageSettings():
  Promise<ContactPageSettings | null> {
  try {
    const supabase =
      await createClient();

    const {
      data,
      error,
    } =
      await supabase
        .from("contact_page_settings")
        .select("*")
        .order("updated_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

    if (error) {
      console.error(
        "Failed to load Contact settings:",
        error,
      );

      return null;
    }

    return (
      data as ContactPageSettings | null
    ) ?? null;
  } catch (error) {
    console.error(
      "Unexpected Contact settings error:",
      error,
    );

    return null;
  }
}

export async function getContactPageDetails():
  Promise<ContactPageDetail[]> {
  try {
    const supabase =
      await createClient();

    const {
      data,
      error,
    } =
      await supabase
        .from("contact_page_details")
        .select("*")
        .order("display_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        });

    if (error) {
      console.error(
        "Failed to load Contact details:",
        error,
      );

      return [];
    }

    return (
      data as ContactPageDetail[]
    ) ?? [];
  } catch (error) {
    console.error(
      "Unexpected Contact details error:",
      error,
    );

    return [];
  }
}

export async function getContactEnquiryTypes():
  Promise<ContactEnquiryType[]> {
  try {
    const supabase =
      await createClient();

    const {
      data,
      error,
    } =
      await supabase
        .from("contact_enquiry_types")
        .select("*")
        .order("display_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        });

    if (error) {
      console.error(
        "Failed to load enquiry types:",
        error,
      );

      return [];
    }

    return (
      data as ContactEnquiryType[]
    ) ?? [];
  } catch (error) {
    console.error(
      "Unexpected enquiry types error:",
      error,
    );

    return [];
  }
}

export async function getContactSocialLinks():
  Promise<ContactPageSocialLink[]> {
  try {
    const supabase =
      await createClient();

    const {
      data,
      error,
    } =
      await supabase
        .from("contact_page_social_links")
        .select("*")
        .order("display_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        });

    if (error) {
      console.error(
        "Failed to load Contact social links:",
        error,
      );

      return [];
    }

    return (
      data as ContactPageSocialLink[]
    ) ?? [];
  } catch (error) {
    console.error(
      "Unexpected social links error:",
      error,
    );

    return [];
  }
}

/* ============================================================
   SETTINGS UPDATE
   ============================================================ */

export async function updateContactPageSettings(
  settingsId: string,
  input: UpdateContactPageSettingsInput,
): Promise<ContactActionResult> {
  const idResult =
    contactUuidSchema.safeParse(
      settingsId,
    );

  if (!idResult.success) {
    return {
      success: false,
      message:
        "Invalid Contact Page settings ID.",
    };
  }

  const parsed =
    updateContactPageSettingsSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Please correct the highlighted fields.",
      errors:
        flattenErrors(
          parsed.error,
        ),
    };
  }

  try {
    const supabase =
      await createClient();

    const {
      error,
    } =
      await supabase
        .from("contact_page_settings")
        .update(parsed.data)
        .eq(
          "id",
          idResult.data,
        );

    if (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }

    revalidateContactPages();

    return {
      success: true,
      message:
        "Contact Page settings updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update Contact Page settings.",
    };
  }
}

/* ============================================================
   CONTACT DETAILS CRUD
   ============================================================ */

export async function createContactPageDetail(
  input: CreateContactPageDetailInput,
): Promise<
  ContactActionResult<ContactPageDetail>
> {
  const parsed =
    createContactPageDetailSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Please correct the Contact detail fields.",
      errors:
        flattenErrors(
          parsed.error,
        ),
    };
  }

  try {
    const supabase =
      await createClient();

    const {
      data,
      error,
    } =
      await supabase
        .from("contact_page_details")
        .insert(parsed.data)
        .select("*")
        .single();

    if (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }

    revalidateContactPages();

    return {
      success: true,
      message:
        "Contact detail created.",
      data:
        data as ContactPageDetail,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create Contact detail.",
    };
  }
}

export async function updateContactPageDetail(
  detailId: string,
  input: UpdateContactPageDetailInput,
): Promise<ContactActionResult> {
  const idResult =
    contactUuidSchema.safeParse(
      detailId,
    );

  if (!idResult.success) {
    return {
      success: false,
      message:
        "Invalid Contact detail ID.",
    };
  }

  const parsed =
    updateContactPageDetailSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Please correct the Contact detail fields.",
      errors:
        flattenErrors(
          parsed.error,
        ),
    };
  }

  try {
    const supabase =
      await createClient();

    const {
      error,
    } =
      await supabase
        .from("contact_page_details")
        .update(parsed.data)
        .eq(
          "id",
          idResult.data,
        );

    if (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }

    revalidateContactPages();

    return {
      success: true,
      message:
        "Contact detail updated.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update Contact detail.",
    };
  }
}

export async function deleteContactPageDetail(
  detailId: string,
): Promise<ContactActionResult> {
  const idResult =
    contactUuidSchema.safeParse(
      detailId,
    );

  if (!idResult.success) {
    return {
      success: false,
      message:
        "Invalid Contact detail ID.",
    };
  }

  try {
    const supabase =
      await createClient();

    const {
      error,
    } =
      await supabase
        .from("contact_page_details")
        .delete()
        .eq(
          "id",
          idResult.data,
        );

    if (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }

    revalidateContactPages();

    return {
      success: true,
      message:
        "Contact detail deleted.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete Contact detail.",
    };
  }
}

/* ============================================================
   ENQUIRY TYPES CRUD
   ============================================================ */

export async function createContactEnquiryType(
  input: CreateContactEnquiryTypeInput,
): Promise<
  ContactActionResult<ContactEnquiryType>
> {
  const parsed =
    createContactEnquiryTypeSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Please correct the enquiry type fields.",
      errors:
        flattenErrors(
          parsed.error,
        ),
    };
  }

  try {
    const supabase =
      await createClient();

    const {
      data,
      error,
    } =
      await supabase
        .from("contact_enquiry_types")
        .insert(parsed.data)
        .select("*")
        .single();

    if (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }

    revalidateContactPages();

    return {
      success: true,
      message:
        "Enquiry type created.",
      data:
        data as ContactEnquiryType,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create enquiry type.",
    };
  }
}

export async function updateContactEnquiryType(
  enquiryTypeId: string,
  input: UpdateContactEnquiryTypeInput,
): Promise<ContactActionResult> {
  const idResult =
    contactUuidSchema.safeParse(
      enquiryTypeId,
    );

  if (!idResult.success) {
    return {
      success: false,
      message:
        "Invalid enquiry type ID.",
    };
  }

  const parsed =
    updateContactEnquiryTypeSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Please correct the enquiry type fields.",
      errors:
        flattenErrors(
          parsed.error,
        ),
    };
  }

  try {
    const supabase =
      await createClient();

    const {
      error,
    } =
      await supabase
        .from("contact_enquiry_types")
        .update(parsed.data)
        .eq(
          "id",
          idResult.data,
        );

    if (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }

    revalidateContactPages();

    return {
      success: true,
      message:
        "Enquiry type updated.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update enquiry type.",
    };
  }
}

export async function deleteContactEnquiryType(
  enquiryTypeId: string,
): Promise<ContactActionResult> {
  const idResult =
    contactUuidSchema.safeParse(
      enquiryTypeId,
    );

  if (!idResult.success) {
    return {
      success: false,
      message:
        "Invalid enquiry type ID.",
    };
  }

  try {
    const supabase =
      await createClient();

    const {
      error,
    } =
      await supabase
        .from("contact_enquiry_types")
        .delete()
        .eq(
          "id",
          idResult.data,
        );

    if (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }

    revalidateContactPages();

    return {
      success: true,
      message:
        "Enquiry type deleted.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete enquiry type.",
    };
  }
}

/* ============================================================
   SOCIAL LINKS CRUD
   ============================================================ */

export async function createContactSocialLink(
  input: CreateContactPageSocialLinkInput,
): Promise<
  ContactActionResult<ContactPageSocialLink>
> {
  const parsed =
    createContactPageSocialLinkSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Please correct the social link fields.",
      errors:
        flattenErrors(
          parsed.error,
        ),
    };
  }

  try {
    const supabase =
      await createClient();

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "contact_page_social_links",
        )
        .insert(parsed.data)
        .select("*")
        .single();

    if (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }

    revalidateContactPages();

    return {
      success: true,
      message:
        "Social link created.",
      data:
        data as ContactPageSocialLink,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create social link.",
    };
  }
}

export async function updateContactSocialLink(
  linkId: string,
  input: UpdateContactPageSocialLinkInput,
): Promise<ContactActionResult> {
  const idResult =
    contactUuidSchema.safeParse(
      linkId,
    );

  if (!idResult.success) {
    return {
      success: false,
      message:
        "Invalid social link ID.",
    };
  }

  const parsed =
    updateContactPageSocialLinkSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Please correct the social link fields.",
      errors:
        flattenErrors(
          parsed.error,
        ),
    };
  }

  try {
    const supabase =
      await createClient();

    const {
      error,
    } =
      await supabase
        .from(
          "contact_page_social_links",
        )
        .update(parsed.data)
        .eq(
          "id",
          idResult.data,
        );

    if (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }

    revalidateContactPages();

    return {
      success: true,
      message:
        "Social link updated.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update social link.",
    };
  }
}

export async function deleteContactSocialLink(
  linkId: string,
): Promise<ContactActionResult> {
  const idResult =
    contactUuidSchema.safeParse(
      linkId,
    );

  if (!idResult.success) {
    return {
      success: false,
      message:
        "Invalid social link ID.",
    };
  }

  try {
    const supabase =
      await createClient();

    const {
      error,
    } =
      await supabase
        .from(
          "contact_page_social_links",
        )
        .delete()
        .eq(
          "id",
          idResult.data,
        );

    if (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }

    revalidateContactPages();

    return {
      success: true,
      message:
        "Social link deleted.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete social link.",
    };
  }
}

/* ============================================================
   PUBLIC CONTACT FORM SUBMISSION
   ============================================================ */

export async function createContactSubmission(
  input: CreateContactSubmissionInput,
): Promise<
  ContactActionResult<{
    id: string;
  }>
> {
  const parsed =
    createContactSubmissionSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Please check your enquiry details.",
      errors:
        flattenErrors(
          parsed.error,
        ),
    };
  }

  try {
    const supabase =
      await createClient();

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "contact_form_submissions",
        )
        .insert({
          ...parsed.data,

          status:
            "new",

          source_page:
            parsed.data.source_page ||
            "/contact",
        })
        .select("id")
        .single();

    if (error) {
      return {
        success: false,
        message:
          "We could not send your enquiry. Please try again.",
      };
    }

    revalidatePath(
      CONTACT_SUBMISSIONS_PATH,
    );

    return {
      success: true,
      message:
        "Your enquiry has been sent successfully.",
      data: {
        id:
          data.id as string,
      },
    };
  } catch (error) {
    console.error(
      "Contact submission error:",
      error,
    );

    return {
      success: false,
      message:
        "We could not send your enquiry. Please try again.",
    };
  }
}

/* ============================================================
   SUBMISSIONS ADMIN
   ============================================================ */

export async function getContactSubmissions():
  Promise<ContactFormSubmission[]> {
  try {
    const supabase =
      await createClient();

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "contact_form_submissions",
        )
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          },
        );

    if (error) {
      console.error(
        "Failed to load Contact submissions:",
        error,
      );

      return [];
    }

    return (
      data as ContactFormSubmission[]
    ) ?? [];
  } catch (error) {
    console.error(
      "Unexpected Contact submissions error:",
      error,
    );

    return [];
  }
}

export async function getContactSubmissionById(
  submissionId: string,
): Promise<ContactFormSubmission | null> {
  const idResult =
    contactUuidSchema.safeParse(
      submissionId,
    );

  if (!idResult.success) {
    return null;
  }

  try {
    const supabase =
      await createClient();

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "contact_form_submissions",
        )
        .select("*")
        .eq(
          "id",
          idResult.data,
        )
        .maybeSingle();

    if (error) {
      console.error(
        "Failed to load Contact submission:",
        error,
      );

      return null;
    }

    return (
      data as
        | ContactFormSubmission
        | null
    ) ?? null;
  } catch (error) {
    console.error(
      "Unexpected submission error:",
      error,
    );

    return null;
  }
}

export async function updateContactSubmission(
  submissionId: string,
  input: UpdateContactSubmissionInput,
): Promise<ContactActionResult> {
  const idResult =
    contactUuidSchema.safeParse(
      submissionId,
    );

  if (!idResult.success) {
    return {
      success: false,
      message:
        "Invalid submission ID.",
    };
  }

  const parsed =
    updateContactSubmissionSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Please correct the submission fields.",
      errors:
        flattenErrors(
          parsed.error,
        ),
    };
  }

  try {
    const supabase =
      await createClient();

    const {
      error,
    } =
      await supabase
        .from(
          "contact_form_submissions",
        )
        .update(parsed.data)
        .eq(
          "id",
          idResult.data,
        );

    if (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }

    revalidateContactPages();

    return {
      success: true,
      message:
        "Submission updated.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update submission.",
    };
  }
}

export async function deleteContactSubmission(
  submissionId: string,
): Promise<ContactActionResult> {
  const idResult =
    contactUuidSchema.safeParse(
      submissionId,
    );

  if (!idResult.success) {
    return {
      success: false,
      message:
        "Invalid submission ID.",
    };
  }

  try {
    const supabase =
      await createClient();

    const {
      error,
    } =
      await supabase
        .from(
          "contact_form_submissions",
        )
        .delete()
        .eq(
          "id",
          idResult.data,
        );

    if (error) {
      return {
        success: false,
        message:
          error.message,
      };
    }

    revalidateContactPages();

    return {
      success: true,
      message:
        "Submission deleted.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete submission.",
    };
  }
}