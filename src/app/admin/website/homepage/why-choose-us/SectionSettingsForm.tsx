"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateHomepageWhyChooseUsSection } from "@/lib/actions/homepage-why-choose-us";

import type {
  HomepageWhyChooseUsSection,
  WhyChooseUsAlignment,
} from "@/lib/types/homepage-why-choose-us";

type SectionSettingsFormProps = {
  section: HomepageWhyChooseUsSection;
};

export default function SectionSettingsForm({
  section,
}: SectionSettingsFormProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [message, setMessage] =
    useState("");

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [form, setForm] = useState({
    eyebrow: section.eyebrow,
    eyebrow_color:
      section.eyebrow_color,
    eyebrow_size:
      section.eyebrow_size,

    heading: section.heading,
    heading_color:
      section.heading_color,
    heading_size:
      section.heading_size,
    heading_weight:
      section.heading_weight,
    heading_alignment:
      section.heading_alignment,

    badge_text:
      section.badge_text,
    badge_text_color:
      section.badge_text_color,
    badge_background_color:
      section.badge_background_color,
    badge_font_size:
      section.badge_font_size,
    badge_font_weight:
      section.badge_font_weight,
    badge_radius:
      section.badge_radius,
    badge_padding_x:
      section.badge_padding_x,
    badge_padding_y:
      section.badge_padding_y,

    section_background_color:
      section.section_background_color,

    padding_top:
      section.padding_top,
    padding_bottom:
      section.padding_bottom,

    cards_gap:
      section.cards_gap,
    cards_per_row:
      section.cards_per_row,

    is_active:
      section.is_active,
  });

  function updateText(
    field:
      | "eyebrow"
      | "heading"
      | "badge_text",
    value: string,
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateColour(
    field:
      | "eyebrow_color"
      | "heading_color"
      | "badge_text_color"
      | "badge_background_color"
      | "section_background_color",
    value: string,
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateNumber(
    field:
      | "eyebrow_size"
      | "heading_size"
      | "heading_weight"
      | "badge_font_size"
      | "badge_font_weight"
      | "badge_radius"
      | "badge_padding_x"
      | "badge_padding_y"
      | "padding_top"
      | "padding_bottom"
      | "cards_gap"
      | "cards_per_row",
    value: string,
  ): void {
    setForm((current) => ({
      ...current,
      [field]: Number(value),
    }));
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (!form.eyebrow.trim()) {
      setMessage(
        "Why Choose Us label is required.",
      );
      return;
    }

    if (!form.heading.trim()) {
      setMessage(
        "Main heading is required.",
      );
      return;
    }

    if (!form.badge_text.trim()) {
      setMessage(
        "PAS badge text is required.",
      );
      return;
    }

    startTransition(async () => {
      const result =
        await updateHomepageWhyChooseUsSection(
          section.id,
          {
            ...form,

            eyebrow:
              form.eyebrow.trim(),

            heading:
              form.heading.trim(),

            badge_text:
              form.badge_text.trim(),
          },
        );

      if (!result.success) {
        setMessage(
          result.errors.join(", "),
        );
        return;
      }

      setIsSuccess(true);

      setMessage(
        "Why Choose Us section settings saved successfully.",
      );

      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Section Settings
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Control the label, heading,
            PAS badge, colours, spacing and
            card layout.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? "Saving..."
            : "Save Settings"}
        </button>
      </div>

      {message ? (
        <div
          className={`rounded-xl border px-5 py-4 text-sm font-medium ${
            isSuccess
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-200 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Why Choose Us Label
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-slate-900">
              Label Text
            </span>

            <input
              value={form.eyebrow}
              onChange={(event) =>
                updateText(
                  "eyebrow",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Label Size
            </span>

            <input
              type="number"
              min={10}
              max={40}
              value={form.eyebrow_size}
              onChange={(event) =>
                updateNumber(
                  "eyebrow_size",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <ColourField
            label="Label Colour"
            value={form.eyebrow_color}
            onChange={(value) =>
              updateColour(
                "eyebrow_color",
                value,
              )
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Main Heading
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <label className="block md:col-span-2 xl:col-span-3">
            <span className="text-sm font-semibold text-slate-900">
              Heading Text
            </span>

            <textarea
              rows={3}
              value={form.heading}
              onChange={(event) =>
                updateText(
                  "heading",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <ColourField
            label="Heading Colour"
            value={form.heading_color}
            onChange={(value) =>
              updateColour(
                "heading_color",
                value,
              )
            }
          />

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Heading Size
            </span>

            <input
              type="number"
              min={24}
              max={120}
              value={form.heading_size}
              onChange={(event) =>
                updateNumber(
                  "heading_size",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Heading Weight
            </span>

            <select
              value={form.heading_weight}
              onChange={(event) =>
                updateNumber(
                  "heading_weight",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value={100}>
                100 — Thin
              </option>
              <option value={200}>
                200 — Extra Light
              </option>
              <option value={300}>
                300 — Light
              </option>
              <option value={400}>
                400 — Regular
              </option>
              <option value={500}>
                500 — Medium
              </option>
              <option value={600}>
                600 — Semi Bold
              </option>
              <option value={700}>
                700 — Bold
              </option>
              <option value={800}>
                800 — Extra Bold
              </option>
              <option value={900}>
                900 — Black
              </option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Heading Alignment
            </span>

            <select
              value={form.heading_alignment}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  heading_alignment:
                    event.target
                      .value as WhyChooseUsAlignment,
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value="left">
                Left
              </option>
              <option value="center">
                Center
              </option>
              <option value="right">
                Right
              </option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          PAS 2035 Badge
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <label className="block md:col-span-2 xl:col-span-3">
            <span className="text-sm font-semibold text-slate-900">
              Badge Text
            </span>

            <input
              value={form.badge_text}
              onChange={(event) =>
                updateText(
                  "badge_text",
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <ColourField
            label="Badge Text Colour"
            value={form.badge_text_color}
            onChange={(value) =>
              updateColour(
                "badge_text_color",
                value,
              )
            }
          />

          <ColourField
            label="Badge Background"
            value={
              form.badge_background_color
            }
            onChange={(value) =>
              updateColour(
                "badge_background_color",
                value,
              )
            }
          />

          <NumberField
            label="Badge Font Size"
            value={form.badge_font_size}
            min={10}
            max={32}
            onChange={(value) =>
              updateNumber(
                "badge_font_size",
                value,
              )
            }
          />

          <NumberField
            label="Badge Font Weight"
            value={
              form.badge_font_weight
            }
            min={100}
            max={900}
            step={100}
            onChange={(value) =>
              updateNumber(
                "badge_font_weight",
                value,
              )
            }
          />

          <NumberField
            label="Badge Radius"
            value={form.badge_radius}
            min={0}
            max={999}
            onChange={(value) =>
              updateNumber(
                "badge_radius",
                value,
              )
            }
          />

          <NumberField
            label="Horizontal Padding"
            value={form.badge_padding_x}
            min={4}
            max={80}
            onChange={(value) =>
              updateNumber(
                "badge_padding_x",
                value,
              )
            }
          />

          <NumberField
            label="Vertical Padding"
            value={form.badge_padding_y}
            min={4}
            max={50}
            onChange={(value) =>
              updateNumber(
                "badge_padding_y",
                value,
              )
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Layout and Spacing
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ColourField
            label="Section Background"
            value={
              form.section_background_color
            }
            onChange={(value) =>
              updateColour(
                "section_background_color",
                value,
              )
            }
          />

          <NumberField
            label="Top Padding"
            value={form.padding_top}
            min={0}
            max={300}
            onChange={(value) =>
              updateNumber(
                "padding_top",
                value,
              )
            }
          />

          <NumberField
            label="Bottom Padding"
            value={form.padding_bottom}
            min={0}
            max={300}
            onChange={(value) =>
              updateNumber(
                "padding_bottom",
                value,
              )
            }
          />

          <NumberField
            label="Cards Gap"
            value={form.cards_gap}
            min={0}
            max={80}
            onChange={(value) =>
              updateNumber(
                "cards_gap",
                value,
              )
            }
          />

          <NumberField
            label="Cards Per Row"
            value={form.cards_per_row}
            min={1}
            max={6}
            onChange={(value) =>
              updateNumber(
                "cards_per_row",
                value,
              )
            }
          />

          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Show Section
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                Hide or display the complete
                Why Choose Us section.
              </span>
            </span>

            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  is_active:
                    event.target.checked,
                }))
              }
              className="h-5 w-5"
            />
          </label>
        </div>
      </section>

      <section
        className="overflow-hidden rounded-[28px] border border-slate-200 p-6"
        style={{
          backgroundColor:
            form.section_background_color,
        }}
      >
        <p
          className="font-bold uppercase tracking-[0.15em]"
          style={{
            color: form.eyebrow_color,
            fontSize: `${form.eyebrow_size}px`,
            textAlign:
              form.heading_alignment,
          }}
        >
          {form.eyebrow}
        </p>

        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <h3
            className="max-w-4xl leading-[1.05]"
            style={{
              color: form.heading_color,
              fontSize: `clamp(32px, 5vw, ${form.heading_size}px)`,
              fontWeight:
                form.heading_weight,
              textAlign:
                form.heading_alignment,
            }}
          >
            {form.heading}
          </h3>

          <span
            className="shrink-0 self-start"
            style={{
              color:
                form.badge_text_color,
              backgroundColor:
                form.badge_background_color,
              fontSize: `${form.badge_font_size}px`,
              fontWeight:
                form.badge_font_weight,
              borderRadius: `${form.badge_radius}px`,
              padding: `${form.badge_padding_y}px ${form.badge_padding_x}px`,
            }}
          >
            {form.badge_text}
          </span>
        </div>
      </section>
    </form>
  );
}

type ColourFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function ColourField({
  label,
  value,
  onChange,
}: ColourFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">
        {label}
      </span>

      <div className="mt-2 flex gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="h-12 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
        />

        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>
    </label>
  );
}

type NumberFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: string) => void;
};

function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: NumberFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">
        {label}
      </span>

      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
      />
    </label>
  );
}