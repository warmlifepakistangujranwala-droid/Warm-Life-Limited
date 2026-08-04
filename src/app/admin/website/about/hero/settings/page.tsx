/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/about/hero/settings/page.tsx
 *
 * Purpose :
 * Provides complete CMS controls for the About page hero
 * content, typography, colours, layout, buttons and slider.
 *
 * Version : v1.0.1
 * ============================================================
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Save,
  Settings2,
} from "lucide-react";

import {
  getAboutPageSettings,
  updateAboutPageSettings,
} from "@/lib/actions/about-page";

import type {
  AboutHeroContentAlignment,
  AboutHeroNavigationStyle,
  AboutHeroPaginationStyle,
  AboutHeroType,
  AboutHeroVerticalAlignment,
  UpdateAboutPageSettingsInput,
} from "@/lib/types/about-page";

import "./settings.css";

type HeroSettingsPageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

function textValue(
  formData: FormData,
  name: string,
): string {
  const value = formData.get(name);

  return typeof value === "string"
    ? value.trim()
    : "";
}

function numberValue(
  formData: FormData,
  name: string,
  fallback = 0,
): number {
  const rawValue = formData.get(name);

  if (typeof rawValue !== "string") {
    return fallback;
  }

  const parsedValue = Number(rawValue);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : fallback;
}

function booleanValue(
  formData: FormData,
  name: string,
): boolean {
  return formData.get(name) === "on";
}

function nullableTextValue(
  formData: FormData,
  name: string,
): string | null {
  const value = textValue(
    formData,
    name,
  );

  return value || null;
}

export default async function AboutHeroSettingsPage({
  searchParams,
}: HeroSettingsPageProps) {
  const [settings, resolvedSearchParams] =
    await Promise.all([
      getAboutPageSettings(),
      searchParams,
    ]);

  if (!settings) {
    return (
      <div className="aboutHeroSettings">
        <div className="aboutHeroSettings__missing">
          <Settings2 size={34} />

          <h1>
            Hero settings not found
          </h1>

          <p>
            Confirm that the About page database
            migration and default settings record
            exist in Supabase.
          </p>

          <Link href="/admin/website/about/hero">
            Return to Hero Manager
          </Link>
        </div>
      </div>
    );
  }

  const currentSettings = settings;

  async function saveHeroSettings(
    formData: FormData,
  ) {
    "use server";

    const payload: UpdateAboutPageSettingsInput = {
      hero_type:
        textValue(
          formData,
          "hero_type",
        ) as AboutHeroType,

      hero_eyebrow:
        textValue(
          formData,
          "hero_eyebrow",
        ),

      hero_heading:
        textValue(
          formData,
          "hero_heading",
        ),

      hero_description:
        textValue(
          formData,
          "hero_description",
        ),

      hero_show_button:
        booleanValue(
          formData,
          "hero_show_button",
        ),

      hero_button_text:
        textValue(
          formData,
          "hero_button_text",
        ),

      hero_button_link:
        textValue(
          formData,
          "hero_button_link",
        ),

      hero_button_open_in_new_tab:
        booleanValue(
          formData,
          "hero_button_open_in_new_tab",
        ),

      hero_show_breadcrumb:
        booleanValue(
          formData,
          "hero_show_breadcrumb",
        ),

      hero_breadcrumb_home_text:
        textValue(
          formData,
          "hero_breadcrumb_home_text",
        ),

      hero_breadcrumb_current_text:
        textValue(
          formData,
          "hero_breadcrumb_current_text",
        ),

      hero_show_scroll_indicator:
        booleanValue(
          formData,
          "hero_show_scroll_indicator",
        ),

      hero_scroll_indicator_text:
        textValue(
          formData,
          "hero_scroll_indicator_text",
        ),

      hero_content_alignment:
        textValue(
          formData,
          "hero_content_alignment",
        ) as AboutHeroContentAlignment,

      hero_vertical_alignment:
        textValue(
          formData,
          "hero_vertical_alignment",
        ) as AboutHeroVerticalAlignment,

      hero_content_max_width:
        numberValue(
          formData,
          "hero_content_max_width",
          currentSettings.hero_content_max_width,
        ),

      hero_min_height:
        numberValue(
          formData,
          "hero_min_height",
          currentSettings.hero_min_height,
        ),

      hero_padding_top:
        numberValue(
          formData,
          "hero_padding_top",
          currentSettings.hero_padding_top,
        ),

      hero_padding_bottom:
        numberValue(
          formData,
          "hero_padding_bottom",
          currentSettings.hero_padding_bottom,
        ),

      hero_padding_left:
        numberValue(
          formData,
          "hero_padding_left",
          currentSettings.hero_padding_left,
        ),

      hero_padding_right:
        numberValue(
          formData,
          "hero_padding_right",
          currentSettings.hero_padding_right,
        ),

      hero_background_color:
        textValue(
          formData,
          "hero_background_color",
        ),

      hero_heading_color:
        textValue(
          formData,
          "hero_heading_color",
        ),

      hero_description_color:
        textValue(
          formData,
          "hero_description_color",
        ),

      hero_eyebrow_color:
        textValue(
          formData,
          "hero_eyebrow_color",
        ),

      hero_button_text_color:
        textValue(
          formData,
          "hero_button_text_color",
        ),

      hero_button_background_color:
        textValue(
          formData,
          "hero_button_background_color",
        ),

      hero_button_border_color:
        textValue(
          formData,
          "hero_button_border_color",
        ),

      hero_button_hover_text_color:
        textValue(
          formData,
          "hero_button_hover_text_color",
        ),

      hero_button_hover_background_color:
        textValue(
          formData,
          "hero_button_hover_background_color",
        ),

      hero_button_hover_border_color:
        textValue(
          formData,
          "hero_button_hover_border_color",
        ),

      hero_button_radius:
        numberValue(
          formData,
          "hero_button_radius",
          currentSettings.hero_button_radius,
        ),

      hero_overlay_color:
        textValue(
          formData,
          "hero_overlay_color",
        ),

      hero_overlay_opacity:
        numberValue(
          formData,
          "hero_overlay_opacity",
          currentSettings.hero_overlay_opacity,
        ),

      hero_autoplay:
        booleanValue(
          formData,
          "hero_autoplay",
        ),

      hero_loop:
        booleanValue(
          formData,
          "hero_loop",
        ),

      hero_muted:
        booleanValue(
          formData,
          "hero_muted",
        ),

      hero_autoplay_delay:
        numberValue(
          formData,
          "hero_autoplay_delay",
          currentSettings.hero_autoplay_delay,
        ),

      hero_transition_speed:
        numberValue(
          formData,
          "hero_transition_speed",
          currentSettings.hero_transition_speed,
        ),

      hero_navigation_style:
        textValue(
          formData,
          "hero_navigation_style",
        ) as AboutHeroNavigationStyle,

      hero_pagination_style:
        textValue(
          formData,
          "hero_pagination_style",
        ) as AboutHeroPaginationStyle,

      hero_pause_on_hover:
        booleanValue(
          formData,
          "hero_pause_on_hover",
        ),

      hero_eyebrow_size:
        numberValue(
          formData,
          "hero_eyebrow_size",
          currentSettings.hero_eyebrow_size,
        ),

      hero_eyebrow_weight:
        numberValue(
          formData,
          "hero_eyebrow_weight",
          currentSettings.hero_eyebrow_weight,
        ),

      hero_eyebrow_letter_spacing:
        numberValue(
          formData,
          "hero_eyebrow_letter_spacing",
          currentSettings.hero_eyebrow_letter_spacing,
        ),

      hero_heading_size:
        numberValue(
          formData,
          "hero_heading_size",
          currentSettings.hero_heading_size,
        ),

      hero_heading_weight:
        numberValue(
          formData,
          "hero_heading_weight",
          currentSettings.hero_heading_weight,
        ),

      hero_heading_line_height:
        numberValue(
          formData,
          "hero_heading_line_height",
          currentSettings.hero_heading_line_height,
        ),

      hero_heading_letter_spacing:
        numberValue(
          formData,
          "hero_heading_letter_spacing",
          currentSettings.hero_heading_letter_spacing,
        ),

      hero_description_size:
        numberValue(
          formData,
          "hero_description_size",
          currentSettings.hero_description_size,
        ),

      hero_description_weight:
        numberValue(
          formData,
          "hero_description_weight",
          currentSettings.hero_description_weight,
        ),

      hero_description_line_height:
        numberValue(
          formData,
          "hero_description_line_height",
          currentSettings.hero_description_line_height,
        ),

      hero_button_font_size:
        numberValue(
          formData,
          "hero_button_font_size",
          currentSettings.hero_button_font_size,
        ),

      hero_button_font_weight:
        numberValue(
          formData,
          "hero_button_font_weight",
          currentSettings.hero_button_font_weight,
        ),

      hero_button_padding_x:
        numberValue(
          formData,
          "hero_button_padding_x",
          currentSettings.hero_button_padding_x,
        ),

      hero_button_padding_y:
        numberValue(
          formData,
          "hero_button_padding_y",
          currentSettings.hero_button_padding_y,
        ),

      hero_button_gap:
        numberValue(
          formData,
          "hero_button_gap",
          currentSettings.hero_button_gap,
        ),

      hero_breadcrumb_size:
        numberValue(
          formData,
          "hero_breadcrumb_size",
          currentSettings.hero_breadcrumb_size,
        ),

      hero_breadcrumb_weight:
        numberValue(
          formData,
          "hero_breadcrumb_weight",
          currentSettings.hero_breadcrumb_weight,
        ),

      hero_breadcrumb_color:
        textValue(
          formData,
          "hero_breadcrumb_color",
        ),

      hero_scroll_indicator_size:
        numberValue(
          formData,
          "hero_scroll_indicator_size",
          currentSettings.hero_scroll_indicator_size,
        ),

      hero_scroll_indicator_color:
        textValue(
          formData,
          "hero_scroll_indicator_color",
        ),
    };

    const result =
      await updateAboutPageSettings(
        currentSettings.id,
        payload,
      );

    if (!result.success) {
      redirect(
        `/admin/website/about/hero/settings?error=${encodeURIComponent(
          result.errors.join(" "),
        )}`,
      );
    }

    redirect(
      "/admin/website/about/hero/settings?saved=true",
    );
  }

  return (
    <div className="aboutHeroSettings">
      <header className="aboutHeroSettings__header">
        <div>
          <div className="aboutHeroSettings__breadcrumb">
            <Link href="/admin/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <Link href="/admin/website/about">
              About Page
            </Link>

            <span>/</span>

            <Link href="/admin/website/about/hero">
              Hero
            </Link>

            <span>/</span>

            <strong>Settings</strong>
          </div>

          <div className="aboutHeroSettings__titleRow">
            <div className="aboutHeroSettings__titleIcon">
              <Settings2
                size={25}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <span className="aboutHeroSettings__eyebrow">
                About page hero
              </span>

              <h1>Hero Settings</h1>

              <p>
                Control the About page hero content,
                typography, colours, spacing, buttons,
                breadcrumb and slider behaviour.
              </p>
            </div>
          </div>
        </div>

        <div className="aboutHeroSettings__headerActions">
          <Link
            href="/admin/website/about/hero"
            className="aboutHeroSettings__backButton"
          >
            <ArrowLeft size={16} />
            Hero Manager
          </Link>

          <a
            href="/about"
            target="_blank"
            rel="noreferrer"
            className="aboutHeroSettings__previewButton"
          >
            <Eye size={16} />
            Preview Page
          </a>
        </div>
      </header>

      {resolvedSearchParams.saved === "true" ? (
        <div className="aboutHeroSettings__notice isSuccess">
          <CheckCircle2 size={17} />
          Hero settings saved successfully.
        </div>
      ) : null}

      {resolvedSearchParams.error ? (
        <div className="aboutHeroSettings__notice isError">
          {resolvedSearchParams.error}
        </div>
      ) : null}

      <form
        action={saveHeroSettings}
        className="aboutHeroSettings__form"
      >
        <section className="aboutHeroSettings__card">
          <div className="aboutHeroSettings__cardHeading">
            <span>General</span>
            <h2>Hero configuration</h2>
            <p>
              Choose the hero mode and control
              its overall size and alignment.
            </p>
          </div>

          <div className="aboutHeroSettings__grid">
            <label className="aboutHeroSettings__field">
              <span>Hero type</span>

              <select
                name="hero_type"
                defaultValue={currentSettings.hero_type}
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

            <label className="aboutHeroSettings__field">
              <span>
                Content alignment
              </span>

              <select
                name="hero_content_alignment"
                defaultValue={
                  currentSettings.hero_content_alignment
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

            <label className="aboutHeroSettings__field">
              <span>
                Vertical alignment
              </span>

              <select
                name="hero_vertical_alignment"
                defaultValue={
                  currentSettings.hero_vertical_alignment
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

            <label className="aboutHeroSettings__field">
              <span>
                Minimum height (px)
              </span>

              <input
                type="number"
                name="hero_min_height"
                min="1"
                defaultValue={
                  currentSettings.hero_min_height
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>
                Content max width (px)
              </span>

              <input
                type="number"
                name="hero_content_max_width"
                min="1"
                defaultValue={
                  currentSettings.hero_content_max_width
                }
              />
            </label>
          </div>
        </section>

        <section className="aboutHeroSettings__card">
          <div className="aboutHeroSettings__cardHeading">
            <span>Content</span>
            <h2>Default hero content</h2>
            <p>
              Used when a slide does not provide
              its own content.
            </p>
          </div>

          <div className="aboutHeroSettings__grid">
            <label className="aboutHeroSettings__field">
              <span>Eyebrow</span>

              <input
                type="text"
                name="hero_eyebrow"
                defaultValue={
                  currentSettings.hero_eyebrow
                }
              />
            </label>

            <label className="aboutHeroSettings__field aboutHeroSettings__field--wide">
              <span>SEO H1</span>

              <input
                type="text"
                name="hero_heading"
                required
                defaultValue={
                  currentSettings.hero_heading
                }
              />
            </label>

            <label className="aboutHeroSettings__field aboutHeroSettings__field--wide">
              <span>Description</span>

              <textarea
                name="hero_description"
                rows={5}
                defaultValue={
                  currentSettings.hero_description
                }
              />
            </label>
          </div>
        </section>

        <section className="aboutHeroSettings__card">
          <div className="aboutHeroSettings__cardHeading">
            <span>Typography</span>
            <h2>Hero typography</h2>
            <p>
              Control sizes, weights, line heights
              and letter spacing.
            </p>
          </div>

          <div className="aboutHeroSettings__subheading">
            Eyebrow typography
          </div>

          <div className="aboutHeroSettings__grid aboutHeroSettings__grid--three">
            <label className="aboutHeroSettings__field">
              <span>Size (px)</span>

              <input
                type="number"
                name="hero_eyebrow_size"
                min="1"
                defaultValue={
                  currentSettings.hero_eyebrow_size
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>Weight</span>

              <input
                type="number"
                name="hero_eyebrow_weight"
                min="100"
                max="1000"
                step="100"
                defaultValue={
                  currentSettings.hero_eyebrow_weight
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>
                Letter spacing (px)
              </span>

              <input
                type="number"
                name="hero_eyebrow_letter_spacing"
                step="0.1"
                defaultValue={
                  currentSettings.hero_eyebrow_letter_spacing
                }
              />
            </label>
          </div>

          <div className="aboutHeroSettings__subheading">
            Heading typography
          </div>

          <div className="aboutHeroSettings__grid aboutHeroSettings__grid--four">
            <label className="aboutHeroSettings__field">
              <span>Size (px)</span>

              <input
                type="number"
                name="hero_heading_size"
                min="1"
                defaultValue={
                  currentSettings.hero_heading_size
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>Weight</span>

              <input
                type="number"
                name="hero_heading_weight"
                min="100"
                max="1000"
                step="100"
                defaultValue={
                  currentSettings.hero_heading_weight
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>Line height</span>

              <input
                type="number"
                name="hero_heading_line_height"
                min="0.5"
                max="3"
                step="0.05"
                defaultValue={
                  currentSettings.hero_heading_line_height
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>
                Letter spacing (px)
              </span>

              <input
                type="number"
                name="hero_heading_letter_spacing"
                step="0.1"
                defaultValue={
                  currentSettings.hero_heading_letter_spacing
                }
              />
            </label>
          </div>

          <div className="aboutHeroSettings__subheading">
            Description typography
          </div>

          <div className="aboutHeroSettings__grid aboutHeroSettings__grid--three">
            <label className="aboutHeroSettings__field">
              <span>Size (px)</span>

              <input
                type="number"
                name="hero_description_size"
                min="1"
                defaultValue={
                  currentSettings.hero_description_size
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>Weight</span>

              <input
                type="number"
                name="hero_description_weight"
                min="100"
                max="1000"
                step="100"
                defaultValue={
                  currentSettings.hero_description_weight
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>Line height</span>

              <input
                type="number"
                name="hero_description_line_height"
                min="0.5"
                max="3"
                step="0.05"
                defaultValue={
                  currentSettings.hero_description_line_height
                }
              />
            </label>
          </div>
        </section>

        <section className="aboutHeroSettings__card">
          <div className="aboutHeroSettings__cardHeading">
            <span>Colours</span>
            <h2>Hero colour controls</h2>
            <p>
              Set the hero background, content,
              overlay and button colours.
            </p>
          </div>

          <div className="aboutHeroSettings__colourGrid">
            {[
              ["Background", "hero_background_color", currentSettings.hero_background_color],
              ["Eyebrow", "hero_eyebrow_color", currentSettings.hero_eyebrow_color],
              ["Heading", "hero_heading_color", currentSettings.hero_heading_color],
              ["Description", "hero_description_color", currentSettings.hero_description_color],
              ["Overlay", "hero_overlay_color", currentSettings.hero_overlay_color],
              ["Button text", "hero_button_text_color", currentSettings.hero_button_text_color],
              ["Button background", "hero_button_background_color", currentSettings.hero_button_background_color],
              ["Button border", "hero_button_border_color", currentSettings.hero_button_border_color],
              ["Button hover text", "hero_button_hover_text_color", currentSettings.hero_button_hover_text_color],
              ["Button hover background", "hero_button_hover_background_color", currentSettings.hero_button_hover_background_color],
              ["Button hover border", "hero_button_hover_border_color", currentSettings.hero_button_hover_border_color],
              ["Breadcrumb", "hero_breadcrumb_color", currentSettings.hero_breadcrumb_color],
              ["Scroll indicator", "hero_scroll_indicator_color", currentSettings.hero_scroll_indicator_color],
            ].map(([label, name, value]) => (
              <label
                className="aboutHeroSettings__colourField"
                key={name}
              >
                <span>{label}</span>

                <div>
                  <input
                    type="color"
                    name={name}
                    defaultValue={
                      String(value).startsWith("#")
                        ? String(value)
                        : "#173d2f"
                    }
                  />

                  <input
                    type="text"
                    aria-label={`${label} colour value`}
                    defaultValue={String(value)}
                    readOnly
                  />
                </div>
              </label>
            ))}
          </div>

          <label className="aboutHeroSettings__field aboutHeroSettings__field--small">
            <span>
              Overlay opacity (0–100)
            </span>

            <input
              type="number"
              name="hero_overlay_opacity"
              min="0"
              max="100"
              defaultValue={
                currentSettings.hero_overlay_opacity
              }
            />
          </label>
        </section>

        <section className="aboutHeroSettings__card">
          <div className="aboutHeroSettings__cardHeading">
            <span>Spacing</span>
            <h2>Hero padding</h2>
            <p>
              Control the spacing around the hero
              content independently.
            </p>
          </div>

          <div className="aboutHeroSettings__grid aboutHeroSettings__grid--four">
            <label className="aboutHeroSettings__field">
              <span>Top (px)</span>

              <input
                type="number"
                name="hero_padding_top"
                min="0"
                defaultValue={
                  currentSettings.hero_padding_top
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>Bottom (px)</span>

              <input
                type="number"
                name="hero_padding_bottom"
                min="0"
                defaultValue={
                  currentSettings.hero_padding_bottom
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>Left (px)</span>

              <input
                type="number"
                name="hero_padding_left"
                min="0"
                defaultValue={
                  currentSettings.hero_padding_left
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>Right (px)</span>

              <input
                type="number"
                name="hero_padding_right"
                min="0"
                defaultValue={
                  currentSettings.hero_padding_right
                }
              />
            </label>
          </div>
        </section>

        <section className="aboutHeroSettings__card">
          <div className="aboutHeroSettings__cardHeading">
            <span>Button</span>
            <h2>Hero button settings</h2>
            <p>
              Configure button content, behaviour,
              typography and dimensions.
            </p>
          </div>

          <div className="aboutHeroSettings__toggles">
            <label className="aboutHeroSettings__toggle">
              <input
                type="checkbox"
                name="hero_show_button"
                defaultChecked={
                  currentSettings.hero_show_button
                }
              />

              <span>Show button</span>
            </label>

            <label className="aboutHeroSettings__toggle">
              <input
                type="checkbox"
                name="hero_button_open_in_new_tab"
                defaultChecked={
                  currentSettings.hero_button_open_in_new_tab
                }
              />

              <span>
                Open in new tab
              </span>
            </label>
          </div>

          <div className="aboutHeroSettings__grid">
            <label className="aboutHeroSettings__field">
              <span>Button text</span>

              <input
                type="text"
                name="hero_button_text"
                defaultValue={
                  currentSettings.hero_button_text
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>Button link</span>

              <input
                type="text"
                name="hero_button_link"
                defaultValue={
                  currentSettings.hero_button_link
                }
              />
            </label>
          </div>

          <div className="aboutHeroSettings__grid aboutHeroSettings__grid--five">
            <label className="aboutHeroSettings__field">
              <span>Font size</span>

              <input
                type="number"
                name="hero_button_font_size"
                min="1"
                defaultValue={
                  currentSettings.hero_button_font_size
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>Font weight</span>

              <input
                type="number"
                name="hero_button_font_weight"
                min="100"
                max="1000"
                step="100"
                defaultValue={
                  currentSettings.hero_button_font_weight
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>Padding X</span>

              <input
                type="number"
                name="hero_button_padding_x"
                min="0"
                defaultValue={
                  currentSettings.hero_button_padding_x
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>Padding Y</span>

              <input
                type="number"
                name="hero_button_padding_y"
                min="0"
                defaultValue={
                  currentSettings.hero_button_padding_y
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>Radius</span>

              <input
                type="number"
                name="hero_button_radius"
                min="0"
                defaultValue={
                  currentSettings.hero_button_radius
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>Icon gap</span>

              <input
                type="number"
                name="hero_button_gap"
                min="0"
                defaultValue={
                  currentSettings.hero_button_gap
                }
              />
            </label>
          </div>
        </section>

        <section className="aboutHeroSettings__card">
          <div className="aboutHeroSettings__cardHeading">
            <span>Navigation aids</span>
            <h2>Breadcrumb and scroll indicator</h2>
          </div>

          <div className="aboutHeroSettings__toggles">
            <label className="aboutHeroSettings__toggle">
              <input
                type="checkbox"
                name="hero_show_breadcrumb"
                defaultChecked={
                  currentSettings.hero_show_breadcrumb
                }
              />

              <span>Show breadcrumb</span>
            </label>

            <label className="aboutHeroSettings__toggle">
              <input
                type="checkbox"
                name="hero_show_scroll_indicator"
                defaultChecked={
                  currentSettings.hero_show_scroll_indicator
                }
              />

              <span>
                Show scroll indicator
              </span>
            </label>
          </div>

          <div className="aboutHeroSettings__grid">
            <label className="aboutHeroSettings__field">
              <span>
                Breadcrumb home text
              </span>

              <input
                type="text"
                name="hero_breadcrumb_home_text"
                defaultValue={
                  currentSettings.hero_breadcrumb_home_text
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>
                Breadcrumb current text
              </span>

              <input
                type="text"
                name="hero_breadcrumb_current_text"
                defaultValue={
                  currentSettings.hero_breadcrumb_current_text
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>
                Scroll indicator text
              </span>

              <input
                type="text"
                name="hero_scroll_indicator_text"
                defaultValue={
                  currentSettings.hero_scroll_indicator_text
                }
              />
            </label>
          </div>

          <div className="aboutHeroSettings__grid aboutHeroSettings__grid--four">
            <label className="aboutHeroSettings__field">
              <span>
                Breadcrumb size
              </span>

              <input
                type="number"
                name="hero_breadcrumb_size"
                min="1"
                defaultValue={
                  currentSettings.hero_breadcrumb_size
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>
                Breadcrumb weight
              </span>

              <input
                type="number"
                name="hero_breadcrumb_weight"
                min="100"
                max="1000"
                step="100"
                defaultValue={
                  currentSettings.hero_breadcrumb_weight
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>
                Scroll text size
              </span>

              <input
                type="number"
                name="hero_scroll_indicator_size"
                min="1"
                defaultValue={
                  currentSettings.hero_scroll_indicator_size
                }
              />
            </label>
          </div>
        </section>

        <section className="aboutHeroSettings__card">
          <div className="aboutHeroSettings__cardHeading">
            <span>Slider</span>
            <h2>Slider behaviour</h2>
            <p>
              Used when the selected hero type is
              Slider.
            </p>
          </div>

          <div className="aboutHeroSettings__toggles">
            <label className="aboutHeroSettings__toggle">
              <input
                type="checkbox"
                name="hero_autoplay"
                defaultChecked={
                  currentSettings.hero_autoplay
                }
              />

              <span>Autoplay</span>
            </label>

            <label className="aboutHeroSettings__toggle">
              <input
                type="checkbox"
                name="hero_loop"
                defaultChecked={
                  currentSettings.hero_loop
                }
              />

              <span>Loop</span>
            </label>

            <label className="aboutHeroSettings__toggle">
              <input
                type="checkbox"
                name="hero_muted"
                defaultChecked={
                  currentSettings.hero_muted
                }
              />

              <span>Mute videos</span>
            </label>

            <label className="aboutHeroSettings__toggle">
              <input
                type="checkbox"
                name="hero_pause_on_hover"
                defaultChecked={
                  currentSettings.hero_pause_on_hover
                }
              />

              <span>Pause on hover</span>
            </label>
          </div>

          <div className="aboutHeroSettings__grid">
            <label className="aboutHeroSettings__field">
              <span>
                Autoplay delay (ms)
              </span>

              <input
                type="number"
                name="hero_autoplay_delay"
                min="1000"
                defaultValue={
                  currentSettings.hero_autoplay_delay
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>
                Transition speed (ms)
              </span>

              <input
                type="number"
                name="hero_transition_speed"
                min="100"
                defaultValue={
                  currentSettings.hero_transition_speed
                }
              />
            </label>

            <label className="aboutHeroSettings__field">
              <span>Navigation</span>

              <select
                name="hero_navigation_style"
                defaultValue={
                  currentSettings.hero_navigation_style
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

            <label className="aboutHeroSettings__field">
              <span>Pagination</span>

              <select
                name="hero_pagination_style"
                defaultValue={
                  currentSettings.hero_pagination_style
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

        <div className="aboutHeroSettings__saveBar">
          <div>
            <span>About Hero</span>

            <strong>
              Save all hero settings
            </strong>
          </div>

          <button type="submit">
            <Save size={17} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}