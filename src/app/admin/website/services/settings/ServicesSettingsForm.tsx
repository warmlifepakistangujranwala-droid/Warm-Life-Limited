/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/services/settings/ServicesSettingsForm.tsx
 *
 * Purpose :
 * Provides complete admin controls for Services page hero and
 * services listing settings.
 *
 * Version : v1.0.0
 * ============================================================
 */

"use client";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
} from "lucide-react";

import {
  type FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  updateServicesPageSettings,
} from "@/lib/actions/services-page";

import type {
  ServicesContentAlignment,
  ServicesHeroNavigationStyle,
  ServicesHeroPaginationStyle,
  ServicesHeroType,
  ServicesPageSettings,
  ServicesVerticalAlignment,
  UpdateServicesPageSettingsInput,
} from "@/lib/types/services-page";

type ServicesSettingsFormProps = {
  settings: ServicesPageSettings;
};

type Message = {
  type: "success" | "error";
  text: string;
} | null;

export default function ServicesSettingsForm({
  settings,
}: ServicesSettingsFormProps) {
  const router = useRouter();

  const [form, setForm] =
    useState<ServicesPageSettings>(
      settings,
    );

  const [message, setMessage] =
    useState<Message>(null);

  const [isSaving, setIsSaving] =
    useState(false);

  function updateField<
    K extends keyof ServicesPageSettings,
  >(
    field: K,
    value: ServicesPageSettings[K],
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage(null);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setIsSaving(true);
    setMessage(null);

    const payload: UpdateServicesPageSettingsInput = {
      internal_name:
        form.internal_name.trim(),

      hero_type:
        form.hero_type,

      hero_eyebrow:
        form.hero_eyebrow.trim(),

      hero_heading:
        form.hero_heading.trim(),

      hero_description:
        form.hero_description.trim(),

      hero_show_button:
        form.hero_show_button,

      hero_button_text:
        form.hero_button_text.trim(),

      hero_button_link:
        form.hero_button_link.trim(),

      hero_button_open_in_new_tab:
        form.hero_button_open_in_new_tab,

      hero_show_breadcrumb:
        form.hero_show_breadcrumb,

      hero_breadcrumb_home_text:
        form.hero_breadcrumb_home_text.trim(),

      hero_breadcrumb_current_text:
        form.hero_breadcrumb_current_text.trim(),

      hero_show_scroll_indicator:
        form.hero_show_scroll_indicator,

      hero_scroll_indicator_text:
        form.hero_scroll_indicator_text.trim(),

      hero_content_alignment:
        form.hero_content_alignment,

      hero_vertical_alignment:
        form.hero_vertical_alignment,

      hero_content_max_width:
        form.hero_content_max_width,

      hero_min_height:
        form.hero_min_height,

      hero_padding_top:
        form.hero_padding_top,

      hero_padding_bottom:
        form.hero_padding_bottom,

      hero_padding_left:
        form.hero_padding_left,

      hero_padding_right:
        form.hero_padding_right,

      hero_background_color:
        form.hero_background_color,

      hero_eyebrow_color:
        form.hero_eyebrow_color,

      hero_eyebrow_size:
        form.hero_eyebrow_size,

      hero_eyebrow_weight:
        form.hero_eyebrow_weight,

      hero_eyebrow_letter_spacing:
        form.hero_eyebrow_letter_spacing,

      hero_heading_color:
        form.hero_heading_color,

      hero_heading_size:
        form.hero_heading_size,

      hero_heading_weight:
        form.hero_heading_weight,

      hero_heading_line_height:
        form.hero_heading_line_height,

      hero_heading_letter_spacing:
        form.hero_heading_letter_spacing,

      hero_description_color:
        form.hero_description_color,

      hero_description_size:
        form.hero_description_size,

      hero_description_weight:
        form.hero_description_weight,

      hero_description_line_height:
        form.hero_description_line_height,

      hero_button_text_color:
        form.hero_button_text_color,

      hero_button_background_color:
        form.hero_button_background_color,

      hero_button_border_color:
        form.hero_button_border_color,

      hero_button_hover_text_color:
        form.hero_button_hover_text_color,

      hero_button_hover_background_color:
        form.hero_button_hover_background_color,

      hero_button_hover_border_color:
        form.hero_button_hover_border_color,

      hero_button_font_size:
        form.hero_button_font_size,

      hero_button_font_weight:
        form.hero_button_font_weight,

      hero_button_padding_x:
        form.hero_button_padding_x,

      hero_button_padding_y:
        form.hero_button_padding_y,

      hero_button_radius:
        form.hero_button_radius,

      hero_button_gap:
        form.hero_button_gap,

      hero_overlay_color:
        form.hero_overlay_color,

      hero_overlay_opacity:
        form.hero_overlay_opacity,

      hero_autoplay:
        form.hero_autoplay,

      hero_loop:
        form.hero_loop,

      hero_muted:
        form.hero_muted,

      hero_autoplay_delay:
        form.hero_autoplay_delay,

      hero_transition_speed:
        form.hero_transition_speed,

      hero_navigation_style:
        form.hero_navigation_style,

      hero_pagination_style:
        form.hero_pagination_style,

      hero_pause_on_hover:
        form.hero_pause_on_hover,

      services_section_enabled:
        form.services_section_enabled,

      services_eyebrow:
        form.services_eyebrow.trim(),

      services_heading:
        form.services_heading.trim(),

      services_description:
        form.services_description.trim(),

      services_text_alignment:
        form.services_text_alignment,

      services_background_color:
        form.services_background_color,

      services_eyebrow_color:
        form.services_eyebrow_color,

      services_eyebrow_size:
        form.services_eyebrow_size,

      services_eyebrow_weight:
        form.services_eyebrow_weight,

      services_heading_color:
        form.services_heading_color,

      services_heading_size:
        form.services_heading_size,

      services_heading_weight:
        form.services_heading_weight,

      services_heading_line_height:
        form.services_heading_line_height,

      services_text_color:
        form.services_text_color,

      services_description_size:
        form.services_description_size,

      services_description_weight:
        form.services_description_weight,

      services_description_line_height:
        form.services_description_line_height,

      services_card_background_color:
        form.services_card_background_color,

      services_card_heading_color:
        form.services_card_heading_color,

      services_card_text_color:
        form.services_card_text_color,

      services_card_radius:
        form.services_card_radius,

      services_card_gap:
        form.services_card_gap,

      services_card_padding:
        form.services_card_padding,

      services_image_height:
        form.services_image_height,

      services_image_radius:
        form.services_image_radius,

      services_columns:
        form.services_columns,

      services_content_max_width:
        form.services_content_max_width,

      services_padding_top:
        form.services_padding_top,

      services_padding_bottom:
        form.services_padding_bottom,

      display_order:
        form.display_order,

      is_active:
        form.is_active,

      is_published:
        form.is_published,
    };

    try {
      const result =
        await updateServicesPageSettings(
          settings.id,
          payload,
        );

      if (!result.success) {
        const fieldErrors =
          result.errors
            ? Object.values(
                result.errors,
              )
                .flat()
                .filter(Boolean)
                .join(" ")
            : "";

        throw new Error(
          fieldErrors ||
          result.message,
        );
      }

      setMessage({
        type: "success",
        text:
          "Services page settings updated successfully.",
      });

      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to update Services page settings.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="servicesSettingsEditor"
      onSubmit={handleSubmit}
    >
      {message ? (
        <div
          className={`servicesSettingsEditor__message ${
            message.type === "success"
              ? "isSuccess"
              : "isError"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          {message.text}
        </div>
      ) : null}

      <section className="servicesSettingsCard">
        <div className="servicesSettingsCard__heading">
          <span>Page status</span>
          <h2>General settings</h2>
        </div>

        <div className="servicesSettingsCard__body servicesSettingsGrid">
          <label className="servicesSettingsField">
            <span>Internal name</span>

            <input
              type="text"
              value={form.internal_name}
              onChange={(event) =>
                updateField(
                  "internal_name",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="servicesSettingsToggle">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                updateField(
                  "is_active",
                  event.target.checked,
                )
              }
            />

            <span>Active</span>
          </label>

          <label className="servicesSettingsToggle">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(event) =>
                updateField(
                  "is_published",
                  event.target.checked,
                )
              }
            />

            <span>Published</span>
          </label>
        </div>
      </section>

      <section className="servicesSettingsCard">
        <div className="servicesSettingsCard__heading">
          <span>Hero content</span>
          <h2>Services hero</h2>
        </div>

        <div className="servicesSettingsCard__body servicesSettingsGrid">
          <label className="servicesSettingsField">
            <span>Hero type</span>

            <select
              value={form.hero_type}
              onChange={(event) =>
                updateField(
                  "hero_type",
                  event.target
                    .value as ServicesHeroType,
                )
              }
            >
              <option value="image">
                Image
              </option>

              <option value="video">
                Video
              </option>

              <option value="slider">
                Slider
              </option>
            </select>
          </label>

          <label className="servicesSettingsField">
            <span>Eyebrow</span>

            <input
              type="text"
              value={form.hero_eyebrow}
              onChange={(event) =>
                updateField(
                  "hero_eyebrow",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="servicesSettingsField servicesSettingsField--full">
            <span>Heading</span>

            <input
              type="text"
              value={form.hero_heading}
              onChange={(event) =>
                updateField(
                  "hero_heading",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="servicesSettingsField servicesSettingsField--full">
            <span>Description</span>

            <textarea
              rows={5}
              value={form.hero_description}
              onChange={(event) =>
                updateField(
                  "hero_description",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="servicesSettingsToggle">
            <input
              type="checkbox"
              checked={form.hero_show_button}
              onChange={(event) =>
                updateField(
                  "hero_show_button",
                  event.target.checked,
                )
              }
            />

            <span>Show button</span>
          </label>

          <label className="servicesSettingsToggle">
            <input
              type="checkbox"
              checked={form.hero_show_breadcrumb}
              onChange={(event) =>
                updateField(
                  "hero_show_breadcrumb",
                  event.target.checked,
                )
              }
            />

            <span>Show breadcrumb</span>
          </label>

          <label className="servicesSettingsToggle">
            <input
              type="checkbox"
              checked={form.hero_show_scroll_indicator}
              onChange={(event) =>
                updateField(
                  "hero_show_scroll_indicator",
                  event.target.checked,
                )
              }
            />

            <span>Show scroll indicator</span>
          </label>

          {form.hero_show_button ? (
            <>
              <label className="servicesSettingsField">
                <span>Button text</span>

                <input
                  type="text"
                  value={form.hero_button_text}
                  onChange={(event) =>
                    updateField(
                      "hero_button_text",
                      event.target.value,
                    )
                  }
                />
              </label>

              <label className="servicesSettingsField">
                <span>Button link</span>

                <input
                  type="text"
                  value={form.hero_button_link}
                  onChange={(event) =>
                    updateField(
                      "hero_button_link",
                      event.target.value,
                    )
                  }
                />
              </label>
            </>
          ) : null}

          <label className="servicesSettingsField">
            <span>Horizontal alignment</span>

            <select
              value={form.hero_content_alignment}
              onChange={(event) =>
                updateField(
                  "hero_content_alignment",
                  event.target
                    .value as ServicesContentAlignment,
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

          <label className="servicesSettingsField">
            <span>Vertical alignment</span>

            <select
              value={form.hero_vertical_alignment}
              onChange={(event) =>
                updateField(
                  "hero_vertical_alignment",
                  event.target
                    .value as ServicesVerticalAlignment,
                )
              }
            >
              <option value="top">
                Top
              </option>
              <option value="center">
                Centre
              </option>
              <option value="bottom">
                Bottom
              </option>
            </select>
          </label>
        </div>
      </section>

      <section className="servicesSettingsCard">
        <div className="servicesSettingsCard__heading">
          <span>Hero design</span>
          <h2>Typography, colours and spacing</h2>
        </div>

        <div className="servicesSettingsCard__body servicesSettingsGrid servicesSettingsGrid--three">
          {[
            ["Hero background", "hero_background_color"],
            ["Eyebrow colour", "hero_eyebrow_color"],
            ["Heading colour", "hero_heading_color"],
            ["Description colour", "hero_description_color"],
            ["Overlay colour", "hero_overlay_color"],
            ["Button background", "hero_button_background_color"],
            ["Button text", "hero_button_text_color"],
            ["Button border", "hero_button_border_color"],
          ].map(([label, field]) => (
            <label
              className="servicesSettingsField"
              key={field}
            >
              <span>{label}</span>

              <input
                type="color"
                value={
                  String(
                    form[
                      field as keyof ServicesPageSettings
                    ],
                  )
                }
                onChange={(event) =>
                  updateField(
                    field as keyof ServicesPageSettings,
                    event.target.value as never,
                  )
                }
              />
            </label>
          ))}

          <label className="servicesSettingsField">
            <span>Eyebrow size</span>

            <input
              type="number"
              min="1"
              value={form.hero_eyebrow_size}
              onChange={(event) =>
                updateField(
                  "hero_eyebrow_size",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Heading size</span>

            <input
              type="number"
              min="1"
              value={form.hero_heading_size}
              onChange={(event) =>
                updateField(
                  "hero_heading_size",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Description size</span>

            <input
              type="number"
              min="1"
              value={form.hero_description_size}
              onChange={(event) =>
                updateField(
                  "hero_description_size",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Hero minimum height</span>

            <input
              type="number"
              min="1"
              value={form.hero_min_height}
              onChange={(event) =>
                updateField(
                  "hero_min_height",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Content max width</span>

            <input
              type="number"
              min="1"
              value={form.hero_content_max_width}
              onChange={(event) =>
                updateField(
                  "hero_content_max_width",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Overlay opacity</span>

            <input
              type="number"
              min="0"
              max="100"
              value={form.hero_overlay_opacity}
              onChange={(event) =>
                updateField(
                  "hero_overlay_opacity",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Top padding</span>

            <input
              type="number"
              min="0"
              value={form.hero_padding_top}
              onChange={(event) =>
                updateField(
                  "hero_padding_top",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Bottom padding</span>

            <input
              type="number"
              min="0"
              value={form.hero_padding_bottom}
              onChange={(event) =>
                updateField(
                  "hero_padding_bottom",
                  Number(event.target.value),
                )
              }
            />
          </label>
        </div>
      </section>

      <section className="servicesSettingsCard">
        <div className="servicesSettingsCard__heading">
          <span>Slider settings</span>
          <h2>Hero animation</h2>
        </div>

        <div className="servicesSettingsCard__body servicesSettingsGrid">
          <label className="servicesSettingsToggle">
            <input
              type="checkbox"
              checked={form.hero_autoplay}
              onChange={(event) =>
                updateField(
                  "hero_autoplay",
                  event.target.checked,
                )
              }
            />

            <span>Autoplay</span>
          </label>

          <label className="servicesSettingsToggle">
            <input
              type="checkbox"
              checked={form.hero_loop}
              onChange={(event) =>
                updateField(
                  "hero_loop",
                  event.target.checked,
                )
              }
            />

            <span>Loop</span>
          </label>

          <label className="servicesSettingsToggle">
            <input
              type="checkbox"
              checked={form.hero_pause_on_hover}
              onChange={(event) =>
                updateField(
                  "hero_pause_on_hover",
                  event.target.checked,
                )
              }
            />

            <span>Pause on hover</span>
          </label>

          <label className="servicesSettingsField">
            <span>Autoplay delay (ms)</span>

            <input
              type="number"
              min="1000"
              value={form.hero_autoplay_delay}
              onChange={(event) =>
                updateField(
                  "hero_autoplay_delay",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Transition speed (ms)</span>

            <input
              type="number"
              min="100"
              value={form.hero_transition_speed}
              onChange={(event) =>
                updateField(
                  "hero_transition_speed",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Navigation</span>

            <select
              value={form.hero_navigation_style}
              onChange={(event) =>
                updateField(
                  "hero_navigation_style",
                  event.target
                    .value as ServicesHeroNavigationStyle,
                )
              }
            >
              <option value="none">
                None
              </option>
              <option value="arrows">
                Arrows
              </option>
              <option value="both">
                Arrows and pagination
              </option>
            </select>
          </label>

          <label className="servicesSettingsField">
            <span>Pagination</span>

            <select
              value={form.hero_pagination_style}
              onChange={(event) =>
                updateField(
                  "hero_pagination_style",
                  event.target
                    .value as ServicesHeroPaginationStyle,
                )
              }
            >
              <option value="none">
                None
              </option>
              <option value="dots">
                Dots
              </option>
              <option value="numbers">
                Numbers
              </option>
            </select>
          </label>
        </div>
      </section>

      <section className="servicesSettingsCard">
        <div className="servicesSettingsCard__heading">
          <span>Services listing</span>
          <h2>Section content and design</h2>
        </div>

        <div className="servicesSettingsCard__body servicesSettingsGrid">
          <label className="servicesSettingsToggle">
            <input
              type="checkbox"
              checked={form.services_section_enabled}
              onChange={(event) =>
                updateField(
                  "services_section_enabled",
                  event.target.checked,
                )
              }
            />

            <span>Enable Services section</span>
          </label>

          <label className="servicesSettingsField">
            <span>Eyebrow</span>

            <input
              type="text"
              value={form.services_eyebrow}
              onChange={(event) =>
                updateField(
                  "services_eyebrow",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="servicesSettingsField servicesSettingsField--full">
            <span>Heading</span>

            <input
              type="text"
              value={form.services_heading}
              onChange={(event) =>
                updateField(
                  "services_heading",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="servicesSettingsField servicesSettingsField--full">
            <span>Description</span>

            <textarea
              rows={5}
              value={form.services_description}
              onChange={(event) =>
                updateField(
                  "services_description",
                  event.target.value,
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Text alignment</span>

            <select
              value={form.services_text_alignment}
              onChange={(event) =>
                updateField(
                  "services_text_alignment",
                  event.target
                    .value as ServicesContentAlignment,
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

          <label className="servicesSettingsField">
            <span>Columns</span>

            <select
              value={form.services_columns}
              onChange={(event) =>
                updateField(
                  "services_columns",
                  Number(event.target.value),
                )
              }
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </label>
        </div>
      </section>

      <section className="servicesSettingsCard">
        <div className="servicesSettingsCard__heading">
          <span>Listing appearance</span>
          <h2>Cards, colours and spacing</h2>
        </div>

        <div className="servicesSettingsCard__body servicesSettingsGrid servicesSettingsGrid--three">
          {[
            ["Section background", "services_background_color"],
            ["Eyebrow colour", "services_eyebrow_color"],
            ["Heading colour", "services_heading_color"],
            ["Description colour", "services_text_color"],
            ["Card background", "services_card_background_color"],
            ["Card heading", "services_card_heading_color"],
            ["Card text", "services_card_text_color"],
          ].map(([label, field]) => (
            <label
              className="servicesSettingsField"
              key={field}
            >
              <span>{label}</span>

              <input
                type="color"
                value={
                  String(
                    form[
                      field as keyof ServicesPageSettings
                    ],
                  )
                }
                onChange={(event) =>
                  updateField(
                    field as keyof ServicesPageSettings,
                    event.target.value as never,
                  )
                }
              />
            </label>
          ))}

          <label className="servicesSettingsField">
            <span>Heading size</span>

            <input
              type="number"
              min="1"
              value={form.services_heading_size}
              onChange={(event) =>
                updateField(
                  "services_heading_size",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Description size</span>

            <input
              type="number"
              min="1"
              value={form.services_description_size}
              onChange={(event) =>
                updateField(
                  "services_description_size",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Card radius</span>

            <input
              type="number"
              min="0"
              value={form.services_card_radius}
              onChange={(event) =>
                updateField(
                  "services_card_radius",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Card gap</span>

            <input
              type="number"
              min="0"
              value={form.services_card_gap}
              onChange={(event) =>
                updateField(
                  "services_card_gap",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Card padding</span>

            <input
              type="number"
              min="0"
              value={form.services_card_padding}
              onChange={(event) =>
                updateField(
                  "services_card_padding",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Image height</span>

            <input
              type="number"
              min="1"
              value={form.services_image_height}
              onChange={(event) =>
                updateField(
                  "services_image_height",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Image radius</span>

            <input
              type="number"
              min="0"
              value={form.services_image_radius}
              onChange={(event) =>
                updateField(
                  "services_image_radius",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Content max width</span>

            <input
              type="number"
              min="1"
              value={form.services_content_max_width}
              onChange={(event) =>
                updateField(
                  "services_content_max_width",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Top padding</span>

            <input
              type="number"
              min="0"
              value={form.services_padding_top}
              onChange={(event) =>
                updateField(
                  "services_padding_top",
                  Number(event.target.value),
                )
              }
            />
          </label>

          <label className="servicesSettingsField">
            <span>Bottom padding</span>

            <input
              type="number"
              min="0"
              value={form.services_padding_bottom}
              onChange={(event) =>
                updateField(
                  "services_padding_bottom",
                  Number(event.target.value),
                )
              }
            />
          </label>
        </div>
      </section>

      <footer className="servicesSettingsEditor__saveBar">
        <div>
          <span>
            Services Page Settings
          </span>

          <strong>
            Save hero and listing changes
          </strong>
        </div>

        <button
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2
              className="servicesSettingsEditor__spinner"
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
