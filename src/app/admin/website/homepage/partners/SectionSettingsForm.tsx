"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateHomepagePartnersSection } from "@/lib/actions/homepage-partner";
import type { HomepagePartnersSection } from "@/lib/types/homepage-partner";

type Props = {
  section: HomepagePartnersSection;
};

export default function SectionSettingsForm({
  section,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    heading: section.heading,
    subheading: section.subheading,
    heading_color: section.heading_color,
    heading_size: section.heading_size,
    heading_weight: section.heading_weight,

    subheading_color: section.subheading_color,
    subheading_size: section.subheading_size,

    background_color: section.background_color,

    padding_top: section.padding_top,
    padding_bottom: section.padding_bottom,

    autoplay_speed: section.autoplay_speed,

    is_active: section.is_active,
  });

  function save(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const result =
        await updateHomepagePartnersSection(
          section.id,
          form,
        );

      if (!result.success) {
        setMessage(result.errors.join(", "));
        return;
      }

      setMessage("Saved successfully.");

      router.refresh();
    });
  }

  return (
    <form
      onSubmit={save}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            Section Settings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Control heading, subheading,
            colours and spacing.
          </p>
        </div>

        <button
          className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white"
        >
          {isPending
            ? "Saving..."
            : "Save Settings"}
        </button>
      </div>

      {message && (
        <div className="mt-5 rounded-lg bg-green-50 p-3 text-green-700">
          {message}
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">

        <label>
          <div className="mb-2 text-sm font-semibold">
            Heading
          </div>

          <input
            className="w-full rounded-xl border p-3"
            value={form.heading}
            onChange={(e)=>
              setForm({
                ...form,
                heading:e.target.value
              })
            }
          />
        </label>

        <label>
          <div className="mb-2 text-sm font-semibold">
            Sub Heading
          </div>

          <textarea
            rows={3}
            className="w-full rounded-xl border p-3"
            value={form.subheading}
            onChange={(e)=>
              setForm({
                ...form,
                subheading:e.target.value
              })
            }
          />
        </label>

        <label>
          <div className="mb-2 text-sm font-semibold">
            Heading Colour
          </div>

          <input
            type="color"
            value={form.heading_color}
            onChange={(e)=>
              setForm({
                ...form,
                heading_color:e.target.value
              })
            }
          />
        </label>

        <label>
          <div className="mb-2 text-sm font-semibold">
            Sub Heading Colour
          </div>

          <input
            type="color"
            value={form.subheading_color}
            onChange={(e)=>
              setForm({
                ...form,
                subheading_color:e.target.value
              })
            }
          />
        </label>

        <label>
          <div className="mb-2 text-sm font-semibold">
            Background Colour
          </div>

          <input
            type="color"
            value={form.background_color}
            onChange={(e)=>
              setForm({
                ...form,
                background_color:e.target.value
              })
            }
          />
        </label>

        <label>
          <div className="mb-2 text-sm font-semibold">
            Heading Size
          </div>

          <input
            type="number"
            className="w-full rounded-xl border p-3"
            value={form.heading_size}
            onChange={(e)=>
              setForm({
                ...form,
                heading_size:Number(e.target.value)
              })
            }
          />
        </label>

        <label>
          <div className="mb-2 text-sm font-semibold">
            Heading Weight
          </div>

          <select
            className="w-full rounded-xl border p-3"
            value={form.heading_weight}
            onChange={(e)=>
              setForm({
                ...form,
                heading_weight:Number(e.target.value)
              })
            }
          >
            <option value={400}>400</option>
            <option value={500}>500</option>
            <option value={600}>600</option>
            <option value={700}>700</option>
            <option value={800}>800</option>
            <option value={900}>900</option>
          </select>
        </label>

        <label>
          <div className="mb-2 text-sm font-semibold">
            Sub Heading Size
          </div>

          <input
            type="number"
            className="w-full rounded-xl border p-3"
            value={form.subheading_size}
            onChange={(e)=>
              setForm({
                ...form,
                subheading_size:Number(e.target.value)
              })
            }
          />
        </label>

        <label>
          <div className="mb-2 text-sm font-semibold">
            Top Padding
          </div>

          <input
            type="number"
            className="w-full rounded-xl border p-3"
            value={form.padding_top}
            onChange={(e)=>
              setForm({
                ...form,
                padding_top:Number(e.target.value)
              })
            }
          />
        </label>

        <label>
          <div className="mb-2 text-sm font-semibold">
            Bottom Padding
          </div>

          <input
            type="number"
            className="w-full rounded-xl border p-3"
            value={form.padding_bottom}
            onChange={(e)=>
              setForm({
                ...form,
                padding_bottom:Number(e.target.value)
              })
            }
          />
        </label>

        <label>
          <div className="mb-2 text-sm font-semibold">
            Slider Speed
          </div>

          <input
            type="number"
            className="w-full rounded-xl border p-3"
            value={form.autoplay_speed}
            onChange={(e)=>
              setForm({
                ...form,
                autoplay_speed:Number(e.target.value)
              })
            }
          />
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e)=>
              setForm({
                ...form,
                is_active:e.target.checked
              })
            }
          />

          <span>Show Section</span>
        </label>

      </div>

      <div
        className="mt-8 rounded-2xl p-8"
        style={{
          background:form.background_color
        }}
      >
        <h2
          style={{
            color:form.heading_color,
            fontSize:form.heading_size,
            fontWeight:form.heading_weight
          }}
        >
          {form.heading}
        </h2>

        <p
          className="mt-4 max-w-3xl"
          style={{
            color:form.subheading_color,
            fontSize:form.subheading_size
          }}
        >
          {form.subheading}
        </p>
      </div>

    </form>
  );
}