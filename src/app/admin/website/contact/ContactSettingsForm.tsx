/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : ContactSettingsForm.tsx
 *
 * Purpose :
 * Contact Page CMS settings form.
 *
 * Version : v0.2.0
 * ============================================================
 */

"use client";

import {
  AlertCircle,
  CheckCircle2,
  FileImage,
  Loader2,
  Save,
  Upload,
} from "lucide-react";

import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  updateContactPageSettings,
} from "@/lib/actions/contact-page";

import {
  createClient,
} from "@/lib/supabase/client";

import type {
  ContactPageSettings,
  UpdateContactPageSettingsInput,
} from "@/lib/types/contact-page";


type Props = {
  initialSettings: ContactPageSettings;
};


type UploadTarget =
  | "hero"
  | "cta"
  | "og"
  | "twitter";


type UploadState = {
  file: File | null;
  preview: string;
};


export default function ContactSettingsForm({
  initialSettings,
}: Props) {
  const router =
    useRouter();

  const supabase =
    createClient();

  const [form, setForm] =
    useState<UpdateContactPageSettingsInput>({
      ...initialSettings,
    });

  const [uploads, setUploads] =
    useState<
      Record<
        UploadTarget,
        UploadState
      >
    >({
      hero: {
        file: null,
        preview:
          initialSettings
            .hero_background_image_url ??
          "",
      },

      cta: {
        file: null,
        preview:
          initialSettings
            .cta_background_image_url ??
          "",
      },

      og: {
        file: null,
        preview:
          initialSettings
            .og_image_url ??
          "",
      },

      twitter: {
        file: null,
        preview:
          initialSettings
            .twitter_image_url ??
          "",
      },
    });

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState<{
      type:
        | "success"
        | "error";

      text: string;
    } | null>(null);


  /* ==========================================================
     FIELD UPDATE
     ========================================================== */

  function updateField<
    K extends keyof UpdateContactPageSettingsInput,
  >(
    key: K,
    value:
      UpdateContactPageSettingsInput[K],
  ) {
    setForm(
      (current) => ({
        ...current,
        [key]: value,
      }),
    );
  }


  /* ==========================================================
     IMAGE SELECTION
     ========================================================== */

  function chooseImage(
    target: UploadTarget,
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      setMessage({
        type: "error",
        text:
          "Please select a valid image.",
      });

      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setMessage({
        type: "error",
        text:
          "Image must be smaller than 10 MB.",
      });

      return;
    }

    const oldPreview =
      uploads[target].preview;

    if (
      oldPreview.startsWith(
        "blob:",
      )
    ) {
      URL.revokeObjectURL(
        oldPreview,
      );
    }

    setUploads(
      (current) => ({
        ...current,

        [target]: {
          file,
          preview:
            URL.createObjectURL(
              file,
            ),
        },
      }),
    );
  }


  /* ==========================================================
     IMAGE UPLOAD
     ========================================================== */

  async function uploadImage(
    target: UploadTarget,
    file: File,
  ) {
    const ext =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "jpg";

    const storagePath =
      `contact/${target}/${crypto.randomUUID()}.${ext}`;

    const {
      error,
    } =
      await supabase.storage
        .from(
          "website-media",
        )
        .upload(
          storagePath,
          file,
          {
            contentType:
              file.type,

            cacheControl:
              "3600",

            upsert:
              false,
          },
        );

    if (error) {
      throw new Error(
        error.message,
      );
    }

    const {
      data,
    } =
      supabase.storage
        .from(
          "website-media",
        )
        .getPublicUrl(
          storagePath,
        );

    return {
      publicUrl:
        data.publicUrl,

      storagePath,
    };
  }


  /* ==========================================================
     SAVE SETTINGS
     ========================================================== */

  async function submit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage(null);

    const payload:
      UpdateContactPageSettingsInput =
      {
        ...form,
      };

    const newPaths:
      string[] = [];

    try {
      for (
        const target of [
          "hero",
          "cta",
          "og",
          "twitter",
        ] as UploadTarget[]
      ) {
        const file =
          uploads[target].file;

        if (!file) {
          continue;
        }

        const uploaded =
          await uploadImage(
            target,
            file,
          );

        newPaths.push(
          uploaded.storagePath,
        );

        if (
          target === "hero"
        ) {
          payload.hero_background_image_url =
            uploaded.publicUrl;

          payload.hero_background_image_storage_path =
            uploaded.storagePath;
        }

        if (
          target === "cta"
        ) {
          payload.cta_background_image_url =
            uploaded.publicUrl;

          payload.cta_background_image_storage_path =
            uploaded.storagePath;
        }

        if (
          target === "og"
        ) {
          payload.og_image_url =
            uploaded.publicUrl;

          payload.og_image_storage_path =
            uploaded.storagePath;
        }

        if (
          target === "twitter"
        ) {
          payload.twitter_image_url =
            uploaded.publicUrl;

          payload.twitter_image_storage_path =
            uploaded.storagePath;
        }
      }

      const result =
        await updateContactPageSettings(
          initialSettings.id,
          payload,
        );

      if (
        !result.success
      ) {
        const errors =
          result.errors
            ? Object.values(
                result.errors,
              )
                .flat()
                .filter(
                  Boolean,
                )
                .join(" ")
            : "";

        throw new Error(
          errors ||
            result.message,
        );
      }

      setMessage({
        type: "success",
        text:
          "Contact Page settings saved successfully.",
      });

      router.refresh();
    } catch (error) {
      if (
        newPaths.length
      ) {
        await supabase.storage
          .from(
            "website-media",
          )
          .remove(
            newPaths,
          );
      }

      setMessage({
        type: "error",

        text:
          error instanceof Error
            ? error.message
            : "Unable to save Contact Page.",
      });
    } finally {
      setSaving(false);
    }
  }


  /* ==========================================================
     MEDIA FIELD
     ========================================================== */

  function MediaField({
    target,
    title,
    urlField,
    storageField,
    altField,
  }: {
    target:
      UploadTarget;

    title:
      string;

    urlField:
      keyof UpdateContactPageSettingsInput;

    storageField:
      keyof UpdateContactPageSettingsInput;

    altField?:
      keyof UpdateContactPageSettingsInput;
  }) {
    const preview =
      uploads[target]
        .preview ||
      String(
        form[urlField] ??
          "",
      );

    return (
      <div className="contactMediaField">
        <div className="contactMediaField__top">
          <strong>
            {title}
          </strong>

          <label className="contactMediaField__upload">
            <Upload
              size={15}
            />

            Upload Image

            <input
              type="file"
              accept="image/*"
              onChange={(
                event,
              ) =>
                chooseImage(
                  target,
                  event,
                )
              }
            />
          </label>
        </div>

        <label>
          <span>
            Direct image URL
          </span>

          <input
            type="url"
            value={String(
              form[
                urlField
              ] ?? "",
            )}
            onChange={(
              event,
            ) => {
              const value =
                event.target
                  .value;

              updateField(
                urlField as never,
                (value ||
                  null) as never,
              );

              updateField(
                storageField as never,
                null as never,
              );

              setUploads(
                (
                  current,
                ) => ({
                  ...current,

                  [target]:
                    {
                      file: null,
                      preview:
                        value,
                    },
                }),
              );
            }}
          />
        </label>

        {preview ? (
          <img
            className="contactMediaField__preview"
            src={preview}
            alt=""
          />
        ) : (
          <div className="contactMediaField__empty">
            <FileImage
              size={28}
            />

            No image selected
          </div>
        )}

        {altField ? (
          <label>
            <span>
              Image alt text
            </span>

            <input
              value={String(
                form[
                  altField
                ] ?? "",
              )}
              onChange={(
                event,
              ) =>
                updateField(
                  altField as never,
                  event
                    .target
                    .value as never,
                )
              }
            />
          </label>
        ) : null}
      </div>
    );
  }


  /* ==========================================================
     TEXT FIELD
     ========================================================== */

  const Field = ({
    label,
    field,
    full = false,
  }: {
    label: string;

    field:
      keyof UpdateContactPageSettingsInput;

    full?: boolean;
  }) => (
    <label
      className={
        full
          ? "isFull"
          : undefined
      }
    >
      <span>
        {label}
      </span>

      <input
        value={String(
          form[field] ??
            "",
        )}
        onChange={(
          event,
        ) =>
          updateField(
            field as never,
            event.target
              .value as never,
          )
        }
      />
    </label>
  );


  /* ==========================================================
     NUMBER FIELD
     ========================================================== */

  const NumberField = ({
    label,
    field,
    min,
    max,
    fallback,
  }: {
    label: string;

    field:
      keyof UpdateContactPageSettingsInput;

    min: number;
    max: number;
    fallback: number;
  }) => (
    <label>
      <span>
        {label}
      </span>

      <input
        type="number"
        min={min}
        max={max}
        value={Number(
          form[field] ??
            fallback,
        )}
        onChange={(
          event,
        ) =>
          updateField(
            field as never,
            Number(
              event.target
                .value,
            ) as never,
          )
        }
      />
    </label>
  );


  /* ==========================================================
     TEXT AREA
     ========================================================== */

  const TextArea = ({
    label,
    field,
  }: {
    label: string;

    field:
      keyof UpdateContactPageSettingsInput;
  }) => (
    <label className="isFull">
      <span>
        {label}
      </span>

      <textarea
        rows={4}
        value={String(
          form[field] ??
            "",
        )}
        onChange={(
          event,
        ) =>
          updateField(
            field as never,
            (
              event.target
                .value ||
              null
            ) as never,
          )
        }
      />
    </label>
  );


  /* ==========================================================
     TOGGLE
     ========================================================== */

  const Toggle = ({
    field,
    label,
  }: {
    field:
      keyof UpdateContactPageSettingsInput;

    label:
      string;
  }) => (
    <label>
      <input
        type="checkbox"
        checked={Boolean(
          form[field],
        )}
        onChange={(
          event,
        ) =>
          updateField(
            field as never,
            event.target
              .checked as never,
          )
        }
      />

      {label}
    </label>
  );


  /* ==========================================================
     FORM
     ========================================================== */

  return (
    <form
      className="contactSettingsForm"
      onSubmit={submit}
    >
      {message ? (
        <div
          className={`contactSettingsForm__message ${
            message.type ===
            "success"
              ? "isSuccess"
              : "isError"
          }`}
        >
          {message.type ===
          "success" ? (
            <CheckCircle2
              size={17}
            />
          ) : (
            <AlertCircle
              size={17}
            />
          )}

          {message.text}
        </div>
      ) : null}


      {/* ================================================
          PAGE IDENTITY
          ================================================ */}

      <section>
        <header>
          <span>
            Core settings
          </span>

          <h2>
            Page identity
          </h2>
        </header>

        <div className="contactSettingsForm__grid">
          <Field
            label="Internal name"
            field="internal_name"
          />
        </div>
      </section>


      {/* ================================================
          HERO
          ================================================ */}

      <section>
        <header>
          <span>
            Contact hero
          </span>

          <h2>
            Hero content
          </h2>
        </header>

        <div className="contactSettingsForm__grid">
          <Field
            label="Hero eyebrow"
            field="hero_eyebrow"
          />

          <Field
            label="Hero heading"
            field="hero_heading"
            full
          />

          <TextArea
            label="Hero description"
            field="hero_description"
          />

          <label>
            <span>
              Overlay opacity
            </span>

            <input
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={Number(
                form.hero_overlay_opacity ??
                  0.55,
              )}
              onChange={(
                event,
              ) =>
                updateField(
                  "hero_overlay_opacity",
                  Number(
                    event
                      .target
                      .value,
                  ),
                )
              }
            />
          </label>

          <NumberField
            label="Hero height"
            field="hero_height"
            min={320}
            max={1000}
            fallback={520}
          />

          <NumberField
            label="Desktop heading size"
            field="hero_heading_size"
            min={32}
            max={180}
            fallback={82}
          />

          <NumberField
            label="Mobile heading size"
            field="hero_heading_size_mobile"
            min={26}
            max={100}
            fallback={46}
          />
        </div>

        <div className="contactSettingsForm__mediaWrap">
          <MediaField
            target="hero"
            title="Hero Background Image"
            urlField="hero_background_image_url"
            storageField="hero_background_image_storage_path"
            altField="hero_background_image_alt"
          />
        </div>
      </section>


      {/* ================================================
          INTRO
          ================================================ */}

      <section>
        <header>
          <span>
            Introduction
          </span>

          <h2>
            Intro section
          </h2>
        </header>

        <div className="contactSettingsForm__grid">
          <Field
            label="Intro eyebrow"
            field="intro_eyebrow"
          />

          <Field
            label="Intro heading"
            field="intro_heading"
            full
          />

          <TextArea
            label="Intro description"
            field="intro_description"
          />

          <NumberField
            label="Intro heading size — Desktop"
            field="intro_heading_size"
            min={24}
            max={120}
            fallback={58}
          />

          <NumberField
            label="Intro heading size — Mobile"
            field="intro_heading_size_mobile"
            min={22}
            max={80}
            fallback={40}
          />
        </div>
      </section>


      {/* ================================================
          CONTACT DETAILS
          ================================================ */}

      <section>
        <header>
          <span>
            Contact details
          </span>

          <h2>
            Details section
          </h2>
        </header>

        <div className="contactSettingsForm__toggles">
          <Toggle
            field="contact_details_enabled"
            label="Enable Contact Details"
          />
        </div>

        <div className="contactSettingsForm__grid">
          <Field
            label="Contact details heading"
            field="contact_details_heading"
            full
          />

          <TextArea
            label="Contact details description"
            field="contact_details_description"
          />

          <NumberField
            label="Details heading size — Desktop"
            field="contact_details_heading_size"
            min={20}
            max={80}
            fallback={30}
          />

          <NumberField
            label="Details heading size — Mobile"
            field="contact_details_heading_size_mobile"
            min={18}
            max={60}
            fallback={26}
          />

          <NumberField
            label="Card value size — Desktop"
            field="contact_card_value_size"
            min={10}
            max={40}
            fallback={14}
          />

          <NumberField
            label="Card value size — Mobile"
            field="contact_card_value_size_mobile"
            min={10}
            max={32}
            fallback={13}
          />
        </div>
      </section>


      {/* ================================================
          FORM
          ================================================ */}

      <section>
        <header>
          <span>
            Enquiry form
          </span>

          <h2>
            Form settings
          </h2>
        </header>

        <div className="contactSettingsForm__toggles">
          <Toggle
            field="form_enabled"
            label="Enable Contact Form"
          />
        </div>

        <div className="contactSettingsForm__grid">
          <Field
            label="Form eyebrow"
            field="form_eyebrow"
          />

          <Field
            label="Form heading"
            field="form_heading"
            full
          />

          <TextArea
            label="Form description"
            field="form_description"
          />

          <NumberField
            label="Form heading size — Desktop"
            field="form_heading_size"
            min={22}
            max={90}
            fallback={34}
          />

          <NumberField
            label="Form heading size — Mobile"
            field="form_heading_size_mobile"
            min={20}
            max={70}
            fallback={28}
          />

          <Field
            label="Submit button text"
            field="form_submit_button_text"
          />

          <TextArea
            label="Success message"
            field="form_success_message"
          />
        </div>
      </section>


      {/* ================================================
          MAP
          ================================================ */}

      <section>
        <header>
          <span>
            Map
          </span>

          <h2>
            Location section
          </h2>
        </header>

        <div className="contactSettingsForm__toggles">
          <Toggle
            field="map_enabled"
            label="Enable Map"
          />
        </div>

        <div className="contactSettingsForm__grid">
          <Field
            label="Map eyebrow"
            field="map_eyebrow"
          />

          <Field
            label="Map heading"
            field="map_heading"
            full
          />

          <TextArea
            label="Map description"
            field="map_description"
          />

          <NumberField
            label="Map heading size — Desktop"
            field="map_heading_size"
            min={24}
            max={120}
            fallback={56}
          />

          <NumberField
            label="Map heading size — Mobile"
            field="map_heading_size_mobile"
            min={22}
            max={80}
            fallback={38}
          />

          <Field
            label="Google Maps embed URL"
            field="map_embed_url"
            full
          />
        </div>
      </section>


      {/* ================================================
          CTA
          ================================================ */}

      <section>
        <header>
          <span>
            Call to action
          </span>

          <h2>
            CTA section
          </h2>
        </header>

        <div className="contactSettingsForm__toggles">
          <Toggle
            field="cta_enabled"
            label="Enable CTA"
          />
        </div>

        <div className="contactSettingsForm__grid">
          <Field
            label="CTA eyebrow"
            field="cta_eyebrow"
          />

          <Field
            label="CTA heading"
            field="cta_heading"
            full
          />

          <TextArea
            label="CTA description"
            field="cta_description"
          />

          <NumberField
            label="CTA heading size — Desktop"
            field="cta_heading_size"
            min={24}
            max={120}
            fallback={66}
          />

          <NumberField
            label="CTA heading size — Mobile"
            field="cta_heading_size_mobile"
            min={22}
            max={80}
            fallback={42}
          />

          <Field
            label="Primary button text"
            field="cta_primary_button_text"
          />

          <Field
            label="Primary button link"
            field="cta_primary_button_link"
          />

          <Field
            label="Secondary button text"
            field="cta_secondary_button_text"
          />

          <Field
            label="Secondary button link"
            field="cta_secondary_button_link"
          />
        </div>

        <div className="contactSettingsForm__mediaWrap">
          <MediaField
            target="cta"
            title="CTA Background Image"
            urlField="cta_background_image_url"
            storageField="cta_background_image_storage_path"
            altField="cta_background_image_alt"
          />
        </div>
      </section>


      {/* ================================================
          SEO
          ================================================ */}

      <section>
        <header>
          <span>
            SEO
          </span>

          <h2>
            Search optimisation
          </h2>
        </header>

        <div className="contactSettingsForm__grid">
          <Field
            label="SEO title"
            field="seo_title"
            full
          />

          <TextArea
            label="Meta description"
            field="meta_description"
          />

          <Field
            label="Focus keyword"
            field="focus_keyword"
          />

          <Field
            label="Canonical URL"
            field="canonical_url"
          />
        </div>
      </section>


      {/* ================================================
          OPEN GRAPH
          ================================================ */}

      <section>
        <header>
          <span>
            Social preview
          </span>

          <h2>
            Open Graph
          </h2>
        </header>

        <div className="contactSettingsForm__grid">
          <Field
            label="OG title"
            field="og_title"
            full
          />

          <TextArea
            label="OG description"
            field="og_description"
          />
        </div>

        <div className="contactSettingsForm__mediaWrap">
          <MediaField
            target="og"
            title="Open Graph Image"
            urlField="og_image_url"
            storageField="og_image_storage_path"
            altField="og_image_alt"
          />
        </div>
      </section>


      {/* ================================================
          TWITTER / X
          ================================================ */}

      <section>
        <header>
          <span>
            Social preview
          </span>

          <h2>
            Twitter / X
          </h2>
        </header>

        <div className="contactSettingsForm__grid">
          <Field
            label="Twitter title"
            field="twitter_title"
            full
          />

          <TextArea
            label="Twitter description"
            field="twitter_description"
          />
        </div>

        <div className="contactSettingsForm__mediaWrap">
          <MediaField
            target="twitter"
            title="Twitter / X Image"
            urlField="twitter_image_url"
            storageField="twitter_image_storage_path"
          />
        </div>
      </section>


      {/* ================================================
          PUBLISHING
          ================================================ */}

      <section>
        <header>
          <span>
            Publishing
          </span>

          <h2>
            Visibility and robots
          </h2>
        </header>

        <div className="contactSettingsForm__toggles">
          <Toggle
            field="is_active"
            label="Active"
          />

          <Toggle
            field="is_published"
            label="Published"
          />

          <Toggle
            field="no_index"
            label="No Index"
          />

          <Toggle
            field="no_follow"
            label="No Follow"
          />
        </div>
      </section>


      {/* ================================================
          SAVE
          ================================================ */}

      <footer className="contactSettingsForm__footer">
        <button
          type="submit"
          disabled={saving}
        >
          {saving ? (
            <Loader2
              size={17}
              className="contactSettingsForm__spinner"
            />
          ) : (
            <Save
              size={17}
            />
          )}

          Save Contact Page
        </button>
      </footer>
    </form>
  );
}