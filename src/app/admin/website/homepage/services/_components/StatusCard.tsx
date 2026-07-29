"use client";

import type { ServiceFormCardProps } from "./service-form.types";

export default function StatusCard({
  form,
  updateField,
  disabled = false,
}: ServiceFormCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
          Publishing
        </p>

        <h2 className="mt-2 text-xl font-bold text-slate-950">
          Status & Visibility
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Control whether this service is active and visible on the
          homepage.
        </p>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <label
            htmlFor="is_active"
            className={`flex items-start justify-between gap-5 ${
              disabled
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer"
            }`}
          >
            <div>
              <h3 className="font-semibold text-slate-900">
                Active
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Inactive services are ignored by the website even if
                they are published.
              </p>
            </div>

            <input
              id="is_active"
              type="checkbox"
              checked={form.is_active}
              disabled={disabled}
              onChange={(e) =>
                updateField("is_active", e.target.checked)
              }
              className="mt-1 h-5 w-5 accent-emerald-700"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <label
            htmlFor="is_published"
            className={`flex items-start justify-between gap-5 ${
              disabled
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer"
            }`}
          >
            <div>
              <h3 className="font-semibold text-slate-900">
                Published
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Published services are available to appear on the live
                homepage.
              </p>
            </div>

            <input
              id="is_published"
              type="checkbox"
              checked={form.is_published}
              disabled={disabled}
              onChange={(e) =>
                updateField("is_published", e.target.checked)
              }
              className="mt-1 h-5 w-5 accent-emerald-700"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <h3 className="text-sm font-semibold text-emerald-900">
            Current Status
          </h3>

          <div className="mt-4 flex flex-wrap gap-3">
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                form.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {form.is_active ? "Active" : "Inactive"}
            </span>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                form.is_published
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {form.is_published
                ? "Published"
                : "Draft"}
            </span>
          </div>

          <div className="mt-5 rounded-xl border border-white/70 bg-white p-4">
            {form.is_active && form.is_published && (
              <p className="text-sm text-green-700">
                ✅ This service is live and can appear on the homepage.
              </p>
            )}

            {!form.is_active && form.is_published && (
              <p className="text-sm text-amber-700">
                ⚠ Published but inactive. It will not be shown on the
                website.
              </p>
            )}

            {form.is_active && !form.is_published && (
              <p className="text-sm text-slate-700">
                📝 Active but still saved as a draft.
              </p>
            )}

            {!form.is_active && !form.is_published && (
              <p className="text-sm text-slate-700">
                📄 Draft and inactive. This service is hidden from the
                public website.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}