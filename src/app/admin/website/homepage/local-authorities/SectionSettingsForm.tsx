"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  updateHomepageLocalAuthoritiesSection,
} from "@/lib/actions/homepage-local-authority";

import type {
  HomepageLocalAuthoritiesSection,
} from "@/lib/types/homepage-local-authority";

type SectionSettingsFormProps = {
  section: HomepageLocalAuthoritiesSection;
};

type FormState = {
  heading: string;
  subheading: string;

  heading_color: string;
  heading_size: string;
  heading_weight: string;

  subheading_color: string;
  subheading_size: string;

  background_color: string;

  padding_top: string;
  padding_bottom: string;

  autoplay_speed: string;

  is_active: boolean;
};

export default function SectionSettingsForm({
  section,
}: SectionSettingsFormProps) {
  const [form, setForm] =
    useState<FormState>({
      heading: section.heading,
      subheading: section.subheading,

      heading_color:
        section.heading_color,
      heading_size: String(
        section.heading_size,
      ),
      heading_weight: String(
        section.heading_weight,
      ),

      subheading_color:
        section.subheading_color,
      subheading_size: String(
        section.subheading_size,
      ),

      background_color:
        section.background_color,

      padding_top: String(
        section.padding_top,
      ),
      padding_bottom: String(
        section.padding_bottom,
      ),

      autoplay_speed: String(
        section.autoplay_speed,
      ),

      is_active: section.is_active,
    });

  const [message, setMessage] =
    useState<string | null>(null);

  const [errors, setErrors] =
    useState<string[]>([]);

  const [isPending, startTransition] =
    useTransition();

  function updateField<
    Key extends keyof FormState,
  >(
    key: Key,
    value: FormState[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function parseNumber(
    value: string,
  ): number {
    const parsedValue = Number(value);

    return Number.isFinite(parsedValue)
      ? parsedValue
      : 0;
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage(null);
    setErrors([]);

    startTransition(async () => {
      const result =
        await updateHomepageLocalAuthoritiesSection(
          section.id,
          {
            heading: form.heading,
            subheading:
              form.subheading,

            heading_color:
              form.heading_color,
            heading_size:
              parseNumber(
                form.heading_size,
              ),
            heading_weight:
              parseNumber(
                form.heading_weight,
              ),

            subheading_color:
              form.subheading_color,
            subheading_size:
              parseNumber(
                form.subheading_size,
              ),

            background_color:
              form.background_color,

            padding_top:
              parseNumber(
                form.padding_top,
              ),
            padding_bottom:
              parseNumber(
                form.padding_bottom,
              ),

            autoplay_speed:
              parseNumber(
                form.autoplay_speed,
              ),

            is_active:
              form.is_active,
          },
        );

      if (!result.success) {
        setErrors(result.errors);
        return;
      }

      setMessage(
        "Local Authorities section settings updated successfully.",
      );
    });
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-950">
          Section Settings
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Control the heading,
          colours, spacing and carousel
          speed for the homepage Local
          Authority Partners section.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {errors.length > 0 ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-800">
              Please fix the following:
            </p>

            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
              {errors.map((error) => (
                <li key={error}>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {message ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
            {message}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">
              Section Heading
            </span>

            <input
              type="text"
              value={form.heading}
              onChange={(event) =>
                updateField(
                  "heading",
                  event.target.value,
                )
              }
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">
              Section Subheading
            </span>

            <input
              type="text"
              value={form.subheading}
              onChange={(event) =>
                updateField(
                  "subheading",
                  event.target.value,
                )
              }
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">
              Heading Colour
            </span>

            <div className="flex gap-3">
              <input
                type="color"
                value={
                  form.heading_color
                }
                onChange={(event) =>
                  updateField(
                    "heading_color",
                    event.target.value,
                  )
                }
                className="h-12 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
              />

              <input
                type="text"
                value={
                  form.heading_color
                }
                onChange={(event) =>
                  updateField(
                    "heading_color",
                    event.target.value,
                  )
                }
                className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">
              Heading Size
            </span>

            <input
              type="number"
              min="10"
              max="160"
              step="1"
              value={
                form.heading_size
              }
              onChange={(event) =>
                updateField(
                  "heading_size",
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">
              Heading Weight
            </span>

            <select
              value={
                form.heading_weight
              }
              onChange={(event) =>
                updateField(
                  "heading_weight",
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="100">
                100 — Thin
              </option>
              <option value="200">
                200 — Extra Light
              </option>
              <option value="300">
                300 — Light
              </option>
              <option value="400">
                400 — Regular
              </option>
              <option value="500">
                500 — Medium
              </option>
              <option value="600">
                600 — Semi Bold
              </option>
              <option value="700">
                700 — Bold
              </option>
              <option value="800">
                800 — Extra Bold
              </option>
              <option value="900">
                900 — Black
              </option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">
              Subheading Colour
            </span>

            <div className="flex gap-3">
              <input
                type="color"
                value={
                  form.subheading_color
                }
                onChange={(event) =>
                  updateField(
                    "subheading_color",
                    event.target.value,
                  )
                }
                className="h-12 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
              />

              <input
                type="text"
                value={
                  form.subheading_color
                }
                onChange={(event) =>
                  updateField(
                    "subheading_color",
                    event.target.value,
                  )
                }
                className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">
              Subheading Size
            </span>

            <input
              type="number"
              min="10"
              max="80"
              step="1"
              value={
                form.subheading_size
              }
              onChange={(event) =>
                updateField(
                  "subheading_size",
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">
              Background Colour
            </span>

            <div className="flex gap-3">
              <input
                type="color"
                value={
                  form.background_color
                }
                onChange={(event) =>
                  updateField(
                    "background_color",
                    event.target.value,
                  )
                }
                className="h-12 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
              />

              <input
                type="text"
                value={
                  form.background_color
                }
                onChange={(event) =>
                  updateField(
                    "background_color",
                    event.target.value,
                  )
                }
                className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">
              Top Padding
            </span>

            <input
              type="number"
              min="0"
              max="400"
              step="1"
              value={
                form.padding_top
              }
              onChange={(event) =>
                updateField(
                  "padding_top",
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            <p className="text-xs text-slate-500">
              Value in pixels.
            </p>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">
              Bottom Padding
            </span>

            <input
              type="number"
              min="0"
              max="400"
              step="1"
              value={
                form.padding_bottom
              }
              onChange={(event) =>
                updateField(
                  "padding_bottom",
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            <p className="text-xs text-slate-500">
              Value in pixels.
            </p>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">
              Autoplay Speed
            </span>

            <input
              type="number"
              min="1"
              max="500"
              step="1"
              value={
                form.autoplay_speed
              }
              onChange={(event) =>
                updateField(
                  "autoplay_speed",
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            <p className="text-xs text-slate-500">
              Higher values make the
              marquee move faster.
            </p>
          </label>
        </div>

        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div>
            <p className="font-semibold text-slate-900">
              Section Active
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Show or hide the complete
              Local Authority Partners
              section on the homepage.
            </p>
          </div>

          <input
            type="checkbox"
            checked={
              form.is_active
            }
            onChange={(event) =>
              updateField(
                "is_active",
                event.target.checked,
              )
            }
            className="h-5 w-5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
          />
        </label>

        <div className="flex justify-end border-t border-slate-200 pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-w-44 items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending
              ? "Saving..."
              : "Save Settings"}
          </button>
        </div>
      </form>
    </section>
  );
}