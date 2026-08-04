/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/about/closing/page.tsx
 *
 * Purpose :
 * Provides CMS controls for the About closing company statement.
 *
 * Version : v1.0.0
 * ============================================================
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Save,
  Sparkles,
} from "lucide-react";

import {
  getAboutPageSettings,
  updateAboutPageSettings,
} from "@/lib/actions/about-page";

import type {
  AboutTextAlignment,
  UpdateAboutPageSettingsInput,
} from "@/lib/types/about-page";

import "./closing.css";

type ClosingPageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

function textValue(
  formData: FormData,
  name: string,
): string {
  return String(
    formData.get(name) ?? "",
  ).trim();
}

function numberValue(
  formData: FormData,
  name: string,
  fallback: number,
): number {
  const value = Number(
    formData.get(name),
  );

  return Number.isFinite(value)
    ? value
    : fallback;
}

export default async function AboutClosingPage({
  searchParams,
}: ClosingPageProps) {
  const [settings, params] =
    await Promise.all([
      getAboutPageSettings(),
      searchParams,
    ]);

  if (!settings) {
    return (
      <div className="closingAdmin">
        <div className="closingAdmin__missing">
          About page settings were not found.
        </div>
      </div>
    );
  }

  const currentSettings = settings;

  async function saveClosing(
    formData: FormData,
  ) {
    "use server";

    const payload: UpdateAboutPageSettingsInput = {
      closing_section_enabled:
        formData.get(
          "closing_section_enabled",
        ) === "on",

      closing_text:
        textValue(
          formData,
          "closing_text",
        ),

      closing_background_color:
        textValue(
          formData,
          "closing_background_color",
        ),

      closing_text_color:
        textValue(
          formData,
          "closing_text_color",
        ),

      closing_content_max_width:
        numberValue(
          formData,
          "closing_content_max_width",
          currentSettings
            .closing_content_max_width,
        ),

      closing_padding_top:
        numberValue(
          formData,
          "closing_padding_top",
          currentSettings
            .closing_padding_top,
        ),

      closing_padding_bottom:
        numberValue(
          formData,
          "closing_padding_bottom",
          currentSettings
            .closing_padding_bottom,
        ),

      closing_text_size:
        numberValue(
          formData,
          "closing_text_size",
          currentSettings
            .closing_text_size,
        ),

      closing_text_weight:
        numberValue(
          formData,
          "closing_text_weight",
          currentSettings
            .closing_text_weight,
        ),

      closing_text_line_height:
        numberValue(
          formData,
          "closing_text_line_height",
          currentSettings
            .closing_text_line_height,
        ),

      closing_text_alignment:
        textValue(
          formData,
          "closing_text_alignment",
        ) as AboutTextAlignment,
    };

    const result =
      await updateAboutPageSettings(
        currentSettings.id,
        payload,
      );

    if (!result.success) {
      redirect(
        `/admin/website/about/closing?error=${encodeURIComponent(
          result.errors.join(" "),
        )}`,
      );
    }

    redirect(
      "/admin/website/about/closing?saved=true",
    );
  }

  return (
    <div className="closingAdmin">
      <header className="closingAdmin__header">
        <div>
          <div className="closingAdmin__breadcrumb">
            <Link href="/admin/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <Link href="/admin/website/about">
              About Page
            </Link>

            <span>/</span>

            <strong>
              Closing Statement
            </strong>
          </div>

          <div className="closingAdmin__titleRow">
            <div className="closingAdmin__icon">
              <Sparkles size={25} />
            </div>

            <div>
              <span>
                About page ending
              </span>

              <h1>
                Closing Statement
              </h1>

              <p>
                Manage the final company statement
                displayed in a premium three-dimensional
                presentation panel.
              </p>
            </div>
          </div>
        </div>

        <div className="closingAdmin__actions">
          <Link
            href="/admin/website/about"
          >
            <ArrowLeft size={16} />
            About Manager
          </Link>

          <a
            href="/about#closing-statement"
            target="_blank"
            rel="noreferrer"
          >
            <Eye size={16} />
            Preview
          </a>
        </div>
      </header>

      {params.saved === "true" ? (
        <div className="closingAdmin__notice isSuccess">
          Closing statement saved successfully.
        </div>
      ) : null}

      {params.error ? (
        <div className="closingAdmin__notice isError">
          {params.error}
        </div>
      ) : null}

      <form
        action={saveClosing}
        className="closingEditor"
      >
        <section className="closingCard">
          <div className="closingCard__heading">
            <span>Section status</span>
            <h2>Visibility</h2>
          </div>

          <div className="closingCard__body">
            <label className="closingToggle">
              <input
                type="checkbox"
                name="closing_section_enabled"
                defaultChecked={
                  currentSettings
                    .closing_section_enabled
                }
              />

              <span>
                Enable closing statement
              </span>
            </label>
          </div>
        </section>

        <section className="closingCard">
          <div className="closingCard__heading">
            <span>Content</span>
            <h2>Company statement</h2>
          </div>

          <div className="closingCard__body">
            <label className="closingField">
              <span>Closing text</span>

              <textarea
                name="closing_text"
                rows={7}
                required
                defaultValue={
                  currentSettings.closing_text
                }
              />
            </label>
          </div>
        </section>

        <section className="closingCard">
          <div className="closingCard__heading">
            <span>Appearance</span>
            <h2>Colours and typography</h2>
          </div>

          <div className="closingCard__body closingGrid">
            <label className="closingField">
              <span>Background colour</span>

              <input
                type="color"
                name="closing_background_color"
                defaultValue={
                  currentSettings
                    .closing_background_color
                }
              />
            </label>

            <label className="closingField">
              <span>Text colour</span>

              <input
                type="color"
                name="closing_text_color"
                defaultValue={
                  currentSettings
                    .closing_text_color
                }
              />
            </label>

            <label className="closingField">
              <span>Font size (px)</span>

              <input
                type="number"
                name="closing_text_size"
                min="1"
                defaultValue={
                  currentSettings
                    .closing_text_size
                }
              />
            </label>

            <label className="closingField">
              <span>Font weight</span>

              <input
                type="number"
                name="closing_text_weight"
                min="100"
                max="1000"
                step="100"
                defaultValue={
                  currentSettings
                    .closing_text_weight
                }
              />
            </label>

            <label className="closingField">
              <span>Line height</span>

              <input
                type="number"
                name="closing_text_line_height"
                min="0.5"
                max="3"
                step="0.05"
                defaultValue={
                  currentSettings
                    .closing_text_line_height
                }
              />
            </label>

            <label className="closingField">
              <span>Text alignment</span>

              <select
                name="closing_text_alignment"
                defaultValue={
                  currentSettings
                    .closing_text_alignment
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
        </section>

        <section className="closingCard">
          <div className="closingCard__heading">
            <span>Layout</span>
            <h2>Dimensions and spacing</h2>
          </div>

          <div className="closingCard__body closingGrid">
            <label className="closingField">
              <span>Content max width</span>

              <input
                type="number"
                name="closing_content_max_width"
                min="1"
                defaultValue={
                  currentSettings
                    .closing_content_max_width
                }
              />
            </label>

            <label className="closingField">
              <span>Top padding</span>

              <input
                type="number"
                name="closing_padding_top"
                min="0"
                defaultValue={
                  currentSettings
                    .closing_padding_top
                }
              />
            </label>

            <label className="closingField">
              <span>Bottom padding</span>

              <input
                type="number"
                name="closing_padding_bottom"
                min="0"
                defaultValue={
                  currentSettings
                    .closing_padding_bottom
                }
              />
            </label>
          </div>
        </section>

        <div className="closingEditor__save">
          <div>
            <span>Closing statement</span>
            <strong>
              Save section changes
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
