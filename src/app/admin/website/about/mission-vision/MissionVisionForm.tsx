/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/about/mission-vision/MissionVisionForm.tsx
 *
 * Purpose :
 * Provides complete CMS controls and live preview for the
 * About Mission and Vision section.
 *
 * Version : v1.0.0
 * ============================================================
 */

"use client";

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  Loader2,
  Save,
  Target,
} from "lucide-react";

import {
  type FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  updateAboutPageSettings,
} from "@/lib/actions/about-page";

import type {
  AboutPageSettings,
  AboutTextAlignment,
  UpdateAboutPageSettingsInput,
} from "@/lib/types/about-page";

type MissionVisionFormProps = {
  settings: AboutPageSettings;
};

type Message = {
  type: "success" | "error";
  text: string;
} | null;

const ICON_OPTIONS = [
  "Target",
  "Eye",
  "Users",
  "BriefcaseBusiness",
  "ClipboardCheck",
  "Gauge",
  "Settings",
  "Headphones",
];

export default function MissionVisionForm({
  settings,
}: MissionVisionFormProps) {
  const router = useRouter();

  const [form, setForm] =
    useState<AboutPageSettings>(
      settings,
    );

  const [message, setMessage] =
    useState<Message>(null);

  const [isSaving, setIsSaving] =
    useState(false);

  function updateField<
    K extends keyof AboutPageSettings,
  >(
    field: K,
    value: AboutPageSettings[K],
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage(null);
  }

  function validateForm():
    | string
    | null {
    if (
      !form.mission_vision_heading.trim()
    ) {
      return "Section heading is required.";
    }

    if (
      !form.mission_title.trim()
    ) {
      return "Mission title is required.";
    }

    if (
      !form.mission_description.trim()
    ) {
      return "Mission description is required.";
    }

    if (
      !form.vision_title.trim()
    ) {
      return "Vision title is required.";
    }

    if (
      !form.vision_description.trim()
    ) {
      return "Vision description is required.";
    }

    return null;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {
      setMessage({
        type: "error",
        text: validationError,
      });

      return;
    }

    setIsSaving(true);
    setMessage(null);

    const payload: UpdateAboutPageSettingsInput = {
      mission_vision_enabled:
        form.mission_vision_enabled,

      mission_vision_eyebrow:
        form.mission_vision_eyebrow.trim(),

      mission_vision_heading:
        form.mission_vision_heading.trim(),

      mission_vision_description:
        form.mission_vision_description.trim(),

      mission_title:
        form.mission_title.trim(),

      mission_description:
        form.mission_description.trim(),

      mission_icon_name:
        form.mission_icon_name,

      vision_title:
        form.vision_title.trim(),

      vision_description:
        form.vision_description.trim(),

      vision_icon_name:
        form.vision_icon_name,

      mission_vision_background_color:
        form.mission_vision_background_color,

      mission_vision_card_background_color:
        form.mission_vision_card_background_color,

      mission_vision_heading_color:
        form.mission_vision_heading_color,

      mission_vision_text_color:
        form.mission_vision_text_color,

      mission_vision_icon_color:
        form.mission_vision_icon_color,

      mission_vision_card_radius:
        form.mission_vision_card_radius,

      mission_vision_card_gap:
        form.mission_vision_card_gap,

      mission_vision_eyebrow_color:
        form.mission_vision_eyebrow_color,

      mission_vision_eyebrow_size:
        form.mission_vision_eyebrow_size,

      mission_vision_eyebrow_weight:
        form.mission_vision_eyebrow_weight,

      mission_vision_section_heading_size:
        form.mission_vision_section_heading_size,

      mission_vision_section_heading_weight:
        form.mission_vision_section_heading_weight,

      mission_vision_section_heading_line_height:
        form.mission_vision_section_heading_line_height,

      mission_vision_section_description_size:
        form.mission_vision_section_description_size,

      mission_vision_section_description_weight:
        form.mission_vision_section_description_weight,

      mission_vision_section_description_line_height:
        form.mission_vision_section_description_line_height,

      mission_vision_card_title_size:
        form.mission_vision_card_title_size,

      mission_vision_card_title_weight:
        form.mission_vision_card_title_weight,

      mission_vision_card_description_size:
        form.mission_vision_card_description_size,

      mission_vision_card_description_weight:
        form.mission_vision_card_description_weight,

      mission_vision_card_description_line_height:
        form.mission_vision_card_description_line_height,

      mission_vision_card_padding:
        form.mission_vision_card_padding,

      mission_vision_icon_size:
        form.mission_vision_icon_size,

      mission_vision_icon_background_color:
        form.mission_vision_icon_background_color,

      mission_vision_icon_radius:
        form.mission_vision_icon_radius,

      mission_vision_content_max_width:
        form.mission_vision_content_max_width,

      mission_vision_padding_top:
        form.mission_vision_padding_top,

      mission_vision_padding_bottom:
        form.mission_vision_padding_bottom,

      mission_vision_text_alignment:
        form.mission_vision_text_alignment,
    };

    try {
      const result =
        await updateAboutPageSettings(
          settings.id,
          payload,
        );

      if (!result.success) {
        throw new Error(
          result.errors.join(" "),
        );
      }

      setMessage({
        type: "success",
        text:
          "Mission and Vision section updated successfully.",
      });

      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to update Mission and Vision.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="missionVisionEditor"
      onSubmit={handleSubmit}
    >
      {message ? (
        <div
          className={`missionVisionEditor__message ${
            message.type === "success"
              ? "isSuccess"
              : "isError"
          }`}
        >
          {message.type ===
          "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          {message.text}
        </div>
      ) : null}

      <div className="missionVisionEditor__layout">
        <main className="missionVisionEditor__main">
          <section className="missionVisionCard">
            <div className="missionVisionCard__heading">
              <div>
                <span>Section status</span>
                <h2>Visibility</h2>
              </div>
            </div>

            <div className="missionVisionCard__body">
              <label className="missionVisionToggle">
                <span>
                  Enable Mission &amp; Vision
                </span>

                <input
                  type="checkbox"
                  checked={
                    form.mission_vision_enabled
                  }
                  onChange={(event) =>
                    updateField(
                      "mission_vision_enabled",
                      event.target.checked,
                    )
                  }
                />
              </label>
            </div>
          </section>

          <section className="missionVisionCard">
            <div className="missionVisionCard__heading">
              <div>
                <span>Section content</span>
                <h2>Introduction</h2>
              </div>
            </div>

            <div className="missionVisionCard__body">
              <div className="missionVisionFormGrid">
                <label className="missionVisionField">
                  <span>
                    Eyebrow / Our Purpose
                  </span>

                  <input
                    type="text"
                    value={
                      form.mission_vision_eyebrow
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_eyebrow",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="missionVisionField missionVisionField--full">
                  <span>Heading</span>

                  <input
                    type="text"
                    value={
                      form.mission_vision_heading
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_heading",
                        event.target.value,
                      )
                    }
                    required
                  />
                </label>

                <label className="missionVisionField missionVisionField--full">
                  <span>Description</span>

                  <textarea
                    rows={5}
                    value={
                      form.mission_vision_description
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_description",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Text alignment</span>

                  <select
                    value={
                      form.mission_vision_text_alignment
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_text_alignment",
                        event.target
                          .value as AboutTextAlignment,
                      )
                    }
                  >
                    <option value="left">
                      Left
                    </option>
                    <option value="center">
                      Centre
                    </option>
                    <option value="right">
                      Right
                    </option>
                  </select>
                </label>
              </div>
            </div>
          </section>

          <section className="missionVisionCard">
            <div className="missionVisionCard__heading">
              <div>
                <span>Mission card</span>
                <h2>Mission content</h2>
              </div>
            </div>

            <div className="missionVisionCard__body">
              <div className="missionVisionFormGrid">
                <label className="missionVisionField">
                  <span>Mission title</span>

                  <input
                    type="text"
                    value={
                      form.mission_title
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_title",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Mission icon</span>

                  <select
                    value={
                      form.mission_icon_name
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_icon_name",
                        event.target.value,
                      )
                    }
                  >
                    {ICON_OPTIONS.map(
                      (icon) => (
                        <option
                          key={icon}
                          value={icon}
                        >
                          {icon}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="missionVisionField missionVisionField--full">
                  <span>
                    Mission description
                  </span>

                  <textarea
                    rows={6}
                    value={
                      form.mission_description
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_description",
                        event.target.value,
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="missionVisionCard">
            <div className="missionVisionCard__heading">
              <div>
                <span>Vision card</span>
                <h2>Vision content</h2>
              </div>
            </div>

            <div className="missionVisionCard__body">
              <div className="missionVisionFormGrid">
                <label className="missionVisionField">
                  <span>Vision title</span>

                  <input
                    type="text"
                    value={
                      form.vision_title
                    }
                    onChange={(event) =>
                      updateField(
                        "vision_title",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Vision icon</span>

                  <select
                    value={
                      form.vision_icon_name
                    }
                    onChange={(event) =>
                      updateField(
                        "vision_icon_name",
                        event.target.value,
                      )
                    }
                  >
                    {ICON_OPTIONS.map(
                      (icon) => (
                        <option
                          key={icon}
                          value={icon}
                        >
                          {icon}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="missionVisionField missionVisionField--full">
                  <span>
                    Vision description
                  </span>

                  <textarea
                    rows={6}
                    value={
                      form.vision_description
                    }
                    onChange={(event) =>
                      updateField(
                        "vision_description",
                        event.target.value,
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="missionVisionCard">
            <div className="missionVisionCard__heading">
              <div>
                <span>Typography</span>
                <h2>Section typography</h2>
              </div>
            </div>

            <div className="missionVisionCard__body">
              <div className="missionVisionSubheading">
                Eyebrow / Our Purpose
              </div>

              <div className="missionVisionFormGrid missionVisionFormGrid--three">
                <label className="missionVisionField">
                  <span>Colour</span>

                  <input
                    type="color"
                    value={
                      form.mission_vision_eyebrow_color
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_eyebrow_color",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Size (px)</span>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.mission_vision_eyebrow_size
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_eyebrow_size",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Weight</span>

                  <input
                    type="number"
                    min="100"
                    max="1000"
                    step="100"
                    value={
                      form.mission_vision_eyebrow_weight
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_eyebrow_weight",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>
              </div>

              <div className="missionVisionSubheading">
                Section heading
              </div>

              <div className="missionVisionFormGrid missionVisionFormGrid--three">
                <label className="missionVisionField">
                  <span>Size (px)</span>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.mission_vision_section_heading_size
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_section_heading_size",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Weight</span>

                  <input
                    type="number"
                    min="100"
                    max="1000"
                    step="100"
                    value={
                      form.mission_vision_section_heading_weight
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_section_heading_weight",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Line height</span>

                  <input
                    type="number"
                    min="0.5"
                    max="3"
                    step="0.05"
                    value={
                      form.mission_vision_section_heading_line_height
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_section_heading_line_height",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>
              </div>

              <div className="missionVisionSubheading">
                Section description
              </div>

              <div className="missionVisionFormGrid missionVisionFormGrid--three">
                <label className="missionVisionField">
                  <span>Size (px)</span>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.mission_vision_section_description_size
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_section_description_size",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Weight</span>

                  <input
                    type="number"
                    min="100"
                    max="1000"
                    step="100"
                    value={
                      form.mission_vision_section_description_weight
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_section_description_weight",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Line height</span>

                  <input
                    type="number"
                    min="0.5"
                    max="3"
                    step="0.05"
                    value={
                      form.mission_vision_section_description_line_height
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_section_description_line_height",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>
              </div>

              <div className="missionVisionSubheading">
                Card titles
              </div>

              <div className="missionVisionFormGrid">
                <label className="missionVisionField">
                  <span>Size (px)</span>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.mission_vision_card_title_size
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_card_title_size",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Weight</span>

                  <input
                    type="number"
                    min="100"
                    max="1000"
                    step="100"
                    value={
                      form.mission_vision_card_title_weight
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_card_title_weight",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>
              </div>

              <div className="missionVisionSubheading">
                Card descriptions
              </div>

              <div className="missionVisionFormGrid missionVisionFormGrid--three">
                <label className="missionVisionField">
                  <span>Size (px)</span>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.mission_vision_card_description_size
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_card_description_size",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Weight</span>

                  <input
                    type="number"
                    min="100"
                    max="1000"
                    step="100"
                    value={
                      form.mission_vision_card_description_weight
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_card_description_weight",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Line height</span>

                  <input
                    type="number"
                    min="0.5"
                    max="3"
                    step="0.05"
                    value={
                      form.mission_vision_card_description_line_height
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_card_description_line_height",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="missionVisionCard">
            <div className="missionVisionCard__heading">
              <div>
                <span>Colours</span>
                <h2>Section colours</h2>
              </div>
            </div>

            <div className="missionVisionCard__body">
              <div className="missionVisionFormGrid missionVisionFormGrid--three">
                {[
                  ["Section background", "mission_vision_background_color"],
                  ["Card background", "mission_vision_card_background_color"],
                  ["Heading colour", "mission_vision_heading_color"],
                  ["Text colour", "mission_vision_text_color"],
                  ["Icon colour", "mission_vision_icon_color"],
                  ["Icon background", "mission_vision_icon_background_color"],
                ].map(([label, field]) => (
                  <label
                    className="missionVisionField"
                    key={field}
                  >
                    <span>{label}</span>

                    <input
                      type="color"
                      value={
                        String(
                          form[
                            field as keyof AboutPageSettings
                          ],
                        )
                      }
                      onChange={(event) =>
                        updateField(
                          field as keyof AboutPageSettings,
                          event.target.value as never,
                        )
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section className="missionVisionCard">
            <div className="missionVisionCard__heading">
              <div>
                <span>Cards and layout</span>
                <h2>Dimensions</h2>
              </div>
            </div>

            <div className="missionVisionCard__body">
              <div className="missionVisionFormGrid missionVisionFormGrid--three">
                <label className="missionVisionField">
                  <span>Card padding</span>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.mission_vision_card_padding
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_card_padding",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Card radius</span>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.mission_vision_card_radius
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_card_radius",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Card gap</span>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.mission_vision_card_gap
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_card_gap",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Icon size</span>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.mission_vision_icon_size
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_icon_size",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Icon radius</span>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.mission_vision_icon_radius
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_icon_radius",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Content max width</span>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.mission_vision_content_max_width
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_content_max_width",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Top padding</span>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.mission_vision_padding_top
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_padding_top",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>

                <label className="missionVisionField">
                  <span>Bottom padding</span>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.mission_vision_padding_bottom
                    }
                    onChange={(event) =>
                      updateField(
                        "mission_vision_padding_bottom",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </section>
        </main>

        <aside className="missionVisionEditor__sidebar">
          <section className="missionVisionCard missionVisionCard--sticky">
            <div className="missionVisionCard__heading">
              <div>
                <span>Live preview</span>
                <h2>3D card preview</h2>
              </div>
            </div>

            <div className="missionVisionCard__body">
              <div
                className="missionVisionPreview"
                style={{
                  background:
                    form.mission_vision_background_color,
                  textAlign:
                    form.mission_vision_text_alignment,
                }}
              >
                <span
                  className="missionVisionPreview__eyebrow"
                  style={{
                    color:
                      form.mission_vision_eyebrow_color,
                    fontSize:
                      `${Math.min(
                        form.mission_vision_eyebrow_size,
                        28,
                      )}px`,
                    fontWeight:
                      form.mission_vision_eyebrow_weight,
                  }}
                >
                  {form.mission_vision_eyebrow ||
                    "Our Purpose"}
                </span>

                <h3
                  style={{
                    color:
                      form.mission_vision_heading_color,
                    fontSize:
                      `${Math.min(
                        form.mission_vision_section_heading_size,
                        42,
                      )}px`,
                    fontWeight:
                      form.mission_vision_section_heading_weight,
                    lineHeight:
                      form.mission_vision_section_heading_line_height,
                  }}
                >
                  {form.mission_vision_heading}
                </h3>

                <p
                  style={{
                    color:
                      form.mission_vision_text_color,
                    fontSize:
                      `${Math.min(
                        form.mission_vision_section_description_size,
                        18,
                      )}px`,
                    fontWeight:
                      form.mission_vision_section_description_weight,
                    lineHeight:
                      form.mission_vision_section_description_line_height,
                  }}
                >
                  {form.mission_vision_description}
                </p>

                <div
                  className="missionVisionPreview__grid"
                  style={{
                    gap:
                      `${Math.min(
                        form.mission_vision_card_gap,
                        24,
                      )}px`,
                  }}
                >
                  {[
                    {
                      title:
                        form.mission_title,
                      description:
                        form.mission_description,
                    },
                    {
                      title:
                        form.vision_title,
                      description:
                        form.vision_description,
                    },
                  ].map((item) => (
                    <article
                      key={item.title}
                      tabIndex={0}
                      style={{
                        padding:
                          `${Math.min(
                            form.mission_vision_card_padding,
                            26,
                          )}px`,
                        borderRadius:
                          `${form.mission_vision_card_radius}px`,
                        background:
                          form.mission_vision_card_background_color,
                      }}
                    >
                      <div
                        className="missionVisionPreview__icon"
                        style={{
                          color:
                            form.mission_vision_icon_color,
                          background:
                            form.mission_vision_icon_background_color,
                          borderRadius:
                            `${form.mission_vision_icon_radius}px`,
                        }}
                      >
                        <Target size={20} />
                      </div>

                      <h4
                        style={{
                          color:
                            form.mission_vision_heading_color,
                          fontSize:
                            `${Math.min(
                              form.mission_vision_card_title_size,
                              28,
                            )}px`,
                          fontWeight:
                            form.mission_vision_card_title_weight,
                        }}
                      >
                        {item.title}
                      </h4>

                      <p
                        style={{
                          color:
                            form.mission_vision_text_color,
                          fontSize:
                            `${Math.min(
                              form.mission_vision_card_description_size,
                              15,
                            )}px`,
                          fontWeight:
                            form.mission_vision_card_description_weight,
                          lineHeight:
                            form.mission_vision_card_description_line_height,
                        }}
                      >
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <footer className="missionVisionEditor__saveBar">
        <div>
          <Eye size={17} />

          <div>
            <span>Mission &amp; Vision</span>
            <strong>
              Save section changes
            </strong>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2
              className="missionVisionEditor__spinner"
              size={17}
            />
          ) : (
            <Save size={17} />
          )}

          Save Changes
        </button>
      </footer>
    </form>
  );
}
