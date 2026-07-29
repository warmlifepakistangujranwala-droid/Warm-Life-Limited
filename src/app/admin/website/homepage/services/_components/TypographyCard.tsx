"use client";

import type { ServiceFormCardProps } from "./service-form.types";

function ColorField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>

      <div className="flex gap-3">
        <input
          type="color"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-14 rounded-xl border border-slate-300 bg-white p-1"
        />

        <input
          type="text"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5"
        />
      </div>
    </div>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800">
          {label}
        </label>

        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">
          {value}px
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-700"
      />
    </div>
  );
}

export default function TypographyCard({
  form,
  updateField,
  disabled = false,
}: ServiceFormCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
          Typography
        </p>

        <h2 className="mt-2 text-xl font-bold text-slate-950">
          Text styling
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Configure colours, sizes and font weights used by this service.
        </p>
      </div>

      <div className="space-y-10">

        <div>
          <h3 className="mb-4 text-lg font-bold">
            Service Name
          </h3>

          <div className="grid gap-6 md:grid-cols-2">

            <ColorField
              label="Colour"
              value={form.service_name_color}
              disabled={disabled}
              onChange={(value)=>
                updateField("service_name_color",value)
              }
            />

            <RangeField
              label="Font Size"
              value={form.service_name_size}
              min={12}
              max={40}
              disabled={disabled}
              onChange={(value)=>
                updateField("service_name_size",value)
              }
            />

            <RangeField
              label="Font Weight"
              value={form.service_name_weight}
              min={100}
              max={900}
              disabled={disabled}
              onChange={(value)=>
                updateField("service_name_weight",value)
              }
            />

          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold">
            Eyebrow
          </h3>

          <div className="grid gap-6 md:grid-cols-2">

            <ColorField
              label="Colour"
              value={form.eyebrow_color}
              disabled={disabled}
              onChange={(value)=>
                updateField("eyebrow_color",value)
              }
            />

            <RangeField
              label="Font Size"
              value={form.eyebrow_size}
              min={10}
              max={30}
              disabled={disabled}
              onChange={(value)=>
                updateField("eyebrow_size",value)
              }
            />

          </div>
        </div>
              <div>
          <h3 className="mb-4 text-lg font-bold text-slate-950">
            Title
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            <ColorField
              label="Colour"
              value={form.title_color}
              disabled={disabled}
              onChange={(value) =>
                updateField("title_color", value)
              }
            />

            <RangeField
              label="Font Size"
              value={form.title_size}
              min={20}
              max={96}
              disabled={disabled}
              onChange={(value) =>
                updateField("title_size", value)
              }
            />

            <RangeField
              label="Font Weight"
              value={form.title_weight}
              min={100}
              max={900}
              disabled={disabled}
              onChange={(value) =>
                updateField("title_weight", value)
              }
            />
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-slate-950">
            Description
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            <ColorField
              label="Colour"
              value={form.description_color}
              disabled={disabled}
              onChange={(value) =>
                updateField("description_color", value)
              }
            />

            <RangeField
              label="Font Size"
              value={form.description_size}
              min={12}
              max={40}
              disabled={disabled}
              onChange={(value) =>
                updateField("description_size", value)
              }
            />
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-slate-950">
            Bullets
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            <ColorField
              label="Colour"
              value={form.bullet_color}
              disabled={disabled}
              onChange={(value) =>
                updateField("bullet_color", value)
              }
            />

            <RangeField
              label="Font Size"
              value={form.bullet_size}
              min={10}
              max={36}
              disabled={disabled}
              onChange={(value) =>
                updateField("bullet_size", value)
              }
            />
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-950">
              Typography Preview
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Preview how the service text will appear with the selected
              typography settings.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="max-w-3xl">
              {form.service_name.trim() ? (
                <p
                  style={{
                    color: form.service_name_color,
                    fontSize: `${form.service_name_size}px`,
                    fontWeight: form.service_name_weight,
                  }}
                >
                  {form.service_name}
                </p>
              ) : (
                <p
                  style={{
                    color: form.service_name_color,
                    fontSize: `${form.service_name_size}px`,
                    fontWeight: form.service_name_weight,
                  }}
                >
                  Service Name
                </p>
              )}

              {form.eyebrow.trim() ? (
                <p
                  className="mt-5 uppercase tracking-[0.14em]"
                  style={{
                    color: form.eyebrow_color,
                    fontSize: `${form.eyebrow_size}px`,
                  }}
                >
                  {form.eyebrow}
                </p>
              ) : (
                <p
                  className="mt-5 uppercase tracking-[0.14em]"
                  style={{
                    color: form.eyebrow_color,
                    fontSize: `${form.eyebrow_size}px`,
                  }}
                >
                  Service Eyebrow
                </p>
              )}

              <h4
                className="mt-3 leading-tight"
                style={{
                  color: form.title_color,
                  fontSize: `${form.title_size}px`,
                  fontWeight: form.title_weight,
                }}
              >
                {form.title.trim()
                  ? form.title
                  : "Your service title will appear here."}
              </h4>

              <p
                className="mt-5 leading-relaxed"
                style={{
                  color: form.description_color,
                  fontSize: `${form.description_size}px`,
                }}
              >
                {form.description.trim()
                  ? form.description
                  : "Add a service description to preview its typography and colour settings."}
              </p>

              <ul
                className="mt-6 space-y-3"
                style={{
                  color: form.bullet_color,
                  fontSize: `${form.bullet_size}px`,
                }}
              >
                <li className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-current"
                  />

                  <span>Example service benefit or feature</span>
                </li>

                <li className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-current"
                  />

                  <span>Another bullet point will appear like this</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}