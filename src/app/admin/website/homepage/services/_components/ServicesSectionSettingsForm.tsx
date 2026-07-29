"use client";

import { useState, useTransition } from "react";

import { updateHomepageServicesSection } from "@/lib/actions/homepage-service";

import type {
  HomepageServicesSection,
  UpdateHomepageServicesSectionInput,
} from "@/lib/types/homepage-service";

interface ServicesSectionSettingsFormProps {
  section: HomepageServicesSection;
}

interface FormMessage {
  type: "success" | "error";
  text: string;
}

interface SectionFormValues {
  section_label: string;
  section_heading: string;

  section_label_color: string;
  section_label_size: number;

  section_heading_color: string;
  section_heading_size: number;
  section_heading_weight: number;

  section_alignment: "left" | "center" | "right";

  background_color: string;

  padding_top: number;
  padding_bottom: number;

  scroll_height: number;
  animation_duration: number;

  is_active: boolean;
}

function getInitialValues(
  section: HomepageServicesSection,
): SectionFormValues {
  return {
    section_label: section.section_label ?? "",
    section_heading: section.section_heading,

    section_label_color: section.section_label_color,
    section_label_size: section.section_label_size,

    section_heading_color: section.section_heading_color,
    section_heading_size: section.section_heading_size,
    section_heading_weight: section.section_heading_weight,

    section_alignment: section.section_alignment,

    background_color: section.background_color,

    padding_top: section.padding_top,
    padding_bottom: section.padding_bottom,

    scroll_height: section.scroll_height,
    animation_duration: section.animation_duration,

    is_active: section.is_active,
  };
}

function normalizeOptionalText(value: string): string | null {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function getValidationError(
  form: SectionFormValues,
): string | null {
  if (!form.section_heading.trim()) {
    return "Section heading is required.";
  }

  if (
    form.section_label_size < 8 ||
    form.section_label_size > 100
  ) {
    return "Section label size must be between 8px and 100px.";
  }

  if (
    form.section_heading_size < 16 ||
    form.section_heading_size > 160
  ) {
    return "Section heading size must be between 16px and 160px.";
  }

  if (
    form.section_heading_weight < 100 ||
    form.section_heading_weight > 900
  ) {
    return "Section heading weight must be between 100 and 900.";
  }

  if (
    form.padding_top < 0 ||
    form.padding_bottom < 0
  ) {
    return "Section padding cannot be negative.";
  }

  if (form.scroll_height < 100) {
    return "Scroll height must be at least 100px.";
  }

  if (form.animation_duration < 100) {
    return "Animation duration must be at least 100 milliseconds.";
  }

  return null;
}

function getActionError(
  errors: Record<string, string[] | undefined> | undefined,
  fallback: string,
): string {
  if (!errors) {
    return fallback;
  }

  const messages = Object.values(errors)
    .flatMap((value) => value ?? [])
    .filter((value) => value.trim().length > 0);

  return messages.length > 0
    ? messages.join(", ")
    : fallback;
}

export default function ServicesSectionSettingsForm({
  section,
}: ServicesSectionSettingsFormProps) {
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<SectionFormValues>(() =>
    getInitialValues(section),
  );

  const [message, setMessage] =
    useState<FormMessage | null>(null);

  function updateField<K extends keyof SectionFormValues>(
    field: K,
    value: SectionFormValues[K],
  ): void {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setMessage(null);
  }

  function resetForm(): void {
    setForm(getInitialValues(section));
    setMessage(null);
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();
    setMessage(null);

    const validationError = getValidationError(form);

    if (validationError) {
      setMessage({
        type: "error",
        text: validationError,
      });

      return;
    }

    const values: UpdateHomepageServicesSectionInput = {
      section_label: normalizeOptionalText(
        form.section_label,
      ),
      section_heading: form.section_heading.trim(),

      section_label_color: form.section_label_color,
      section_label_size: form.section_label_size,

      section_heading_color:
        form.section_heading_color,
      section_heading_size: form.section_heading_size,
      section_heading_weight:
        form.section_heading_weight,

      section_alignment: form.section_alignment,

      background_color: form.background_color,

      padding_top: form.padding_top,
      padding_bottom: form.padding_bottom,

      scroll_height: form.scroll_height,
      animation_duration: form.animation_duration,

      is_active: form.is_active,
    };

    startTransition(async () => {
      try {
        const result =
          await updateHomepageServicesSection(
            section.id,
            values,
          );

        if (!result.success) {
          setMessage({
            type: "error",
            text: getActionError(
              result.errors,
              result.message ||
                "Failed to update services section.",
            ),
          });

          return;
        }

        setMessage({
          type: "success",
          text: result.message,
        });
      } catch (error) {
        setMessage({
          type: "error",
          text:
            error instanceof Error
              ? error.message
              : "Something went wrong while saving the section.",
        });
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {message ? (
        <div
          role="alert"
          className={`rounded-2xl border px-5 py-4 text-sm font-medium ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Section content
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">
            Heading and label
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Configure the content displayed above the homepage
            services.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="section_label"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Section label
            </label>

            <input
              id="section_label"
              type="text"
              disabled={isPending}
              value={form.section_label}
              onChange={(event) =>
                updateField(
                  "section_label",
                  event.target.value,
                )
              }
              placeholder="What we do"
              className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              Optional text displayed above the main heading.
            </p>
          </div>

          <div>
            <label
              htmlFor="section_heading"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Section heading
              <span className="ml-1 text-red-600">*</span>
            </label>

            <input
              id="section_heading"
              type="text"
              required
              disabled={isPending}
              value={form.section_heading}
              onChange={(event) =>
                updateField(
                  "section_heading",
                  event.target.value,
                )
              }
              placeholder="Our Services"
              className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Typography
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">
            Section text styling
          </h2>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 font-bold text-slate-900">
              Section label
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              <ColorField
                id="section_label_color"
                label="Label colour"
                value={form.section_label_color}
                disabled={isPending}
                onChange={(value) =>
                  updateField(
                    "section_label_color",
                    value,
                  )
                }
              />

              <NumberField
                id="section_label_size"
                label="Label font size"
                value={form.section_label_size}
                min={8}
                max={100}
                suffix="px"
                disabled={isPending}
                onChange={(value) =>
                  updateField(
                    "section_label_size",
                    value,
                  )
                }
              />
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-slate-900">
              Section heading
            </h3>

            <div className="grid gap-6 md:grid-cols-3">
              <ColorField
                id="section_heading_color"
                label="Heading colour"
                value={form.section_heading_color}
                disabled={isPending}
                onChange={(value) =>
                  updateField(
                    "section_heading_color",
                    value,
                  )
                }
              />

              <NumberField
                id="section_heading_size"
                label="Heading font size"
                value={form.section_heading_size}
                min={16}
                max={160}
                suffix="px"
                disabled={isPending}
                onChange={(value) =>
                  updateField(
                    "section_heading_size",
                    value,
                  )
                }
              />

              <div>
                <label
                  htmlFor="section_heading_weight"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Heading weight
                </label>

                <select
                  id="section_heading_weight"
                  disabled={isPending}
                  value={form.section_heading_weight}
                  onChange={(event) =>
                    updateField(
                      "section_heading_weight",
                      Number(event.target.value),
                    )
                  }
                  className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
                >
                  <option value={100}>100 — Thin</option>
                  <option value={200}>200 — Extra Light</option>
                  <option value={300}>300 — Light</option>
                  <option value={400}>400 — Regular</option>
                  <option value={500}>500 — Medium</option>
                  <option value={600}>600 — Semi Bold</option>
                  <option value={700}>700 — Bold</option>
                  <option value={800}>800 — Extra Bold</option>
                  <option value={900}>900 — Black</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-800">
              Text alignment
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
              {(["left", "center", "right"] as const).map(
                (alignment) => (
                  <label
                    key={alignment}
                    className={`cursor-pointer rounded-xl border p-4 text-center text-sm font-semibold capitalize transition ${
                      form.section_alignment === alignment
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-100"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    } ${
                      isPending
                        ? "cursor-not-allowed opacity-60"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="section_alignment"
                      value={alignment}
                      disabled={isPending}
                      checked={
                        form.section_alignment === alignment
                      }
                      onChange={() =>
                        updateField(
                          "section_alignment",
                          alignment,
                        )
                      }
                      className="sr-only"
                    />

                    {alignment}
                  </label>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Layout
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">
            Background and spacing
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <ColorField
            id="background_color"
            label="Background colour"
            value={form.background_color}
            disabled={isPending}
            onChange={(value) =>
              updateField("background_color", value)
            }
          />

          <NumberField
            id="padding_top"
            label="Top padding"
            value={form.padding_top}
            min={0}
            max={500}
            suffix="px"
            disabled={isPending}
            onChange={(value) =>
              updateField("padding_top", value)
            }
          />

          <NumberField
            id="padding_bottom"
            label="Bottom padding"
            value={form.padding_bottom}
            min={0}
            max={500}
            suffix="px"
            disabled={isPending}
            onChange={(value) =>
              updateField("padding_bottom", value)
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Scroll behaviour
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">
            Animation settings
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Control the height and timing used by the services scroll
            experience.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <NumberField
            id="scroll_height"
            label="Scroll height"
            value={form.scroll_height}
            min={100}
            max={2000}
            suffix="px"
            disabled={isPending}
            onChange={(value) =>
              updateField("scroll_height", value)
            }
          />

          <NumberField
            id="animation_duration"
            label="Animation duration"
            value={form.animation_duration}
            min={100}
            max={5000}
            suffix="ms"
            disabled={isPending}
            onChange={(value) =>
              updateField("animation_duration", value)
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Preview
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">
            Section preview
          </h2>
        </div>

        <div
          className="rounded-2xl border border-slate-200 px-6 py-12 sm:px-10"
          style={{
            backgroundColor: form.background_color,
            textAlign: form.section_alignment,
          }}
        >
          {form.section_label.trim() ? (
            <p
              className="uppercase tracking-[0.14em]"
              style={{
                color: form.section_label_color,
                fontSize: `${form.section_label_size}px`,
              }}
            >
              {form.section_label}
            </p>
          ) : null}

          <h3
            className={form.section_label.trim() ? "mt-3" : ""}
            style={{
              color: form.section_heading_color,
              fontSize: `${form.section_heading_size}px`,
              fontWeight: form.section_heading_weight,
              lineHeight: 1.1,
            }}
          >
            {form.section_heading.trim() || "Our Services"}
          </h3>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <label
          htmlFor="is_active"
          className={`flex items-start justify-between gap-5 ${
            isPending
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer"
          }`}
        >
          <div>
            <h2 className="font-bold text-slate-950">
              Section active
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Disable this option to hide the complete services section
              from the public homepage.
            </p>
          </div>

          <span className="relative mt-1 inline-flex shrink-0">
            <input
              id="is_active"
              type="checkbox"
              disabled={isPending}
              checked={form.is_active}
              onChange={(event) =>
                updateField(
                  "is_active",
                  event.target.checked,
                )
              }
              className="peer sr-only"
            />

            <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-emerald-700 peer-focus-visible:ring-4 peer-focus-visible:ring-emerald-100" />

            <span className="pointer-events-none absolute left-1 top-1 size-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
          </span>
        </label>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={isPending}
          onClick={resetForm}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset changes
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save settings"}
        </button>
      </div>
    </form>
  );
}

interface ColorFieldProps {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

function ColorField({
  id,
  label,
  value,
  disabled = false,
  onChange,
}: ColorFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        {label}
      </label>

      <div className="flex gap-3">
        <input
          type="color"
          aria-label={`Select ${label.toLowerCase()}`}
          disabled={disabled}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border border-slate-300 bg-white p-1 disabled:cursor-not-allowed"
        />

        <input
          id={id}
          type="text"
          disabled={disabled}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="#000000"
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
        />
      </div>
    </div>
  );
}

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}

function NumberField({
  id,
  label,
  value,
  min,
  max,
  suffix,
  disabled = false,
  onChange,
}: NumberFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          disabled={disabled}
          value={value}
          onChange={(event) =>
            onChange(Number(event.target.value))
          }
          className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pr-14 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100"
        />

        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-slate-500">
          {suffix}
        </span>
      </div>
    </div>
  );
}