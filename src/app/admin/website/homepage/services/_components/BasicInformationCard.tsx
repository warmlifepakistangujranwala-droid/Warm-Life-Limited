"use client";

import type { ServiceFormCardProps } from "./service-form.types";

export default function BasicInformationCard({
  form,
  updateField,
  disabled = false,
}: ServiceFormCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
          Service Details
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Basic Information
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Configure the primary details for this homepage service.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Display Order
          </label>

          <input
            type="number"
            min={0}
            disabled={disabled}
            value={form.display_order}
            onChange={(e) =>
              updateField(
                "display_order",
                Number(e.target.value),
              )
            }
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Display Number
          </label>

          <input
            type="text"
            disabled={disabled}
            value={form.display_number}
            onChange={(e) =>
              updateField(
                "display_number",
                e.target.value,
              )
            }
            placeholder="01"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold">
            Service Name *
          </label>

          <input
            type="text"
            disabled={disabled}
            value={form.service_name}
            onChange={(e) =>
              updateField(
                "service_name",
                e.target.value,
              )
            }
            placeholder="Renewable Energy"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold">
            Slug
          </label>

          <input
            type="text"
            disabled={disabled}
            value={form.slug}
            onChange={(e) =>
              updateField(
                "slug",
                e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-"),
              )
            }
            placeholder="renewable-energy"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold">
            Eyebrow
          </label>

          <input
            type="text"
            disabled={disabled}
            value={form.eyebrow}
            onChange={(e) =>
              updateField(
                "eyebrow",
                e.target.value,
              )
            }
            placeholder="Smarter solutions"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold">
            Title *
          </label>

          <input
            type="text"
            disabled={disabled}
            value={form.title}
            onChange={(e) =>
              updateField(
                "title",
                e.target.value,
              )
            }
            placeholder="Powering the future with renewable energy."
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold">
            Description
          </label>

          <textarea
            rows={6}
            disabled={disabled}
            value={form.description}
            onChange={(e) =>
              updateField(
                "description",
                e.target.value,
              )
            }
            placeholder="Write a detailed description..."
            className="w-full rounded-xl border px-4 py-3"
          />

          <div className="mt-2 text-right text-xs text-slate-500">
            {form.description.length} characters
          </div>
        </div>
      </div>
    </section>
  );
}