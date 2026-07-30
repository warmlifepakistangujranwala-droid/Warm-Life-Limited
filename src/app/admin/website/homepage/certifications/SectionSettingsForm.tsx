"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateHomepageCertificationsSection } from "@/lib/actions/homepage-certification";
import type { HomepageCertificationsSection } from "@/lib/types/homepage-certification";

type SectionSettingsFormProps = {
  section: HomepageCertificationsSection;
};

export default function SectionSettingsForm({
  section,
}: SectionSettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    heading: section.heading,
    heading_color: section.heading_color,
    heading_size: section.heading_size,
    heading_weight: section.heading_weight,
    background_color: section.background_color,
    padding_top: section.padding_top,
    padding_bottom: section.padding_bottom,
    autoplay_speed: section.autoplay_speed,
    is_active: section.is_active,
  });

  function updateNumber(
    field:
      | "heading_size"
      | "heading_weight"
      | "padding_top"
      | "padding_bottom"
      | "autoplay_speed",
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
    setSaved(false);

    if (!form.heading.trim()) {
      setMessage("Section heading is required.");
      return;
    }

    startTransition(async () => {
      const result =
        await updateHomepageCertificationsSection(
          section.id,
          {
            ...form,
            heading: form.heading.trim(),
          },
        );

      if (!result.success) {
        setMessage(result.errors.join(", "));
        return;
      }

      setSaved(true);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Section settings
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Control the homepage heading, colours, spacing
            and slider speed.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {message ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {message}
        </div>
      ) : null}

      {saved ? (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Section settings saved successfully.
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <label className="block lg:col-span-2 xl:col-span-1">
          <span className="text-sm font-semibold text-slate-900">
            Section heading
          </span>

          <input
            value={form.heading}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                heading: event.target.value,
              }))
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Heading colour
          </span>

          <div className="mt-2 flex gap-3">
            <input
              type="color"
              value={form.heading_color}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  heading_color: event.target.value,
                }))
              }
              className="h-12 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
            />

            <input
              value={form.heading_color}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  heading_color: event.target.value,
                }))
              }
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Background colour
          </span>

          <div className="mt-2 flex gap-3">
            <input
              type="color"
              value={form.background_color}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  background_color: event.target.value,
                }))
              }
              className="h-12 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
            />

            <input
              value={form.background_color}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  background_color: event.target.value,
                }))
              }
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Heading size (px)
          </span>

          <input
            type="number"
            min={18}
            max={96}
            value={form.heading_size}
            onChange={(event) =>
              updateNumber("heading_size", event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Heading weight
          </span>

          <select
            value={form.heading_weight}
            onChange={(event) =>
              updateNumber("heading_weight", event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value={400}>Regular — 400</option>
            <option value={500}>Medium — 500</option>
            <option value={600}>Semi bold — 600</option>
            <option value={700}>Bold — 700</option>
            <option value={800}>Extra bold — 800</option>
            <option value={900}>Black — 900</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Slider speed
          </span>

          <input
            type="number"
            min={10}
            max={180}
            value={form.autoplay_speed}
            onChange={(event) =>
              updateNumber("autoplay_speed", event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <span className="mt-1 block text-xs text-slate-500">
            Higher number means faster movement.
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Top padding (px)
          </span>

          <input
            type="number"
            min={0}
            max={240}
            value={form.padding_top}
            onChange={(event) =>
              updateNumber("padding_top", event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Bottom padding (px)
          </span>

          <input
            type="number"
            min={0}
            max={240}
            value={form.padding_bottom}
            onChange={(event) =>
              updateNumber("padding_bottom", event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
          <span>
            <span className="block text-sm font-semibold text-slate-900">
              Show section
            </span>

            <span className="mt-1 block text-xs text-slate-500">
              Turn this off to hide the section from the
              homepage.
            </span>
          </span>

          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                is_active: event.target.checked,
              }))
            }
            className="h-5 w-5"
          />
        </label>
      </div>

      <div
        className="mt-6 rounded-2xl border border-slate-200 p-6"
        style={{
          backgroundColor: form.background_color,
        }}
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Preview
        </p>

        <h3
          className="m-0 text-center leading-tight"
          style={{
            color: form.heading_color,
            fontSize: `${Math.min(form.heading_size, 60)}px`,
            fontWeight: form.heading_weight,
          }}
        >
          {form.heading || "Our Certifications"}
        </h3>
      </div>
    </form>
  );
}
