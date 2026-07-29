"use client";

import type { ServiceFormCardProps } from "./service-form.types";

function isExternalLink(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

export default function ButtonCard({
  form,
  updateField,
  disabled = false,
}: ServiceFormCardProps) {
  const hasButton =
    form.button_text.trim().length > 0 &&
    form.button_link.trim().length > 0;

  const linkType = isExternalLink(form.button_link)
    ? "External link"
    : "Internal link";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
          Call to action
        </p>

        <h2 className="mt-2 text-xl font-bold text-slate-950">
          Service button
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          Configure the button shown with this service on the homepage.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="button_text"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Button text
            </label>

            <input
              id="button_text"
              name="button_text"
              type="text"
              disabled={disabled}
              value={form.button_text}
              onChange={(event) =>
                updateField("button_text", event.target.value)
              }
              placeholder="Explore service"
              className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Leave empty to hide the button.
            </p>
          </div>

          <div>
            <label
              htmlFor="button_link"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Button link
            </label>

            <input
              id="button_link"
              name="button_link"
              type="text"
              disabled={disabled}
              value={form.button_link}
              onChange={(event) =>
                updateField("button_link", event.target.value)
              }
              placeholder="/services/renewable-energy"
              className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>
                Use paths such as{" "}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700">
                  /services/solar
                </code>{" "}
                or complete external URLs.
              </span>

              {form.button_link.trim() ? (
                <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700">
                  {linkType}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label
            htmlFor="open_in_new_tab"
            className={`flex items-start justify-between gap-4 ${
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Open in new tab
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Recommended for external websites. Internal links normally
                remain in the same tab.
              </p>
            </div>

            <span className="relative mt-0.5 inline-flex shrink-0">
              <input
                id="open_in_new_tab"
                name="open_in_new_tab"
                type="checkbox"
                disabled={disabled}
                checked={form.open_in_new_tab}
                onChange={(event) =>
                  updateField("open_in_new_tab", event.target.checked)
                }
                className="peer sr-only"
              />

              <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-emerald-700 peer-focus-visible:ring-4 peer-focus-visible:ring-emerald-100 peer-disabled:cursor-not-allowed" />

              <span className="pointer-events-none absolute left-1 top-1 size-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
            </span>
          </label>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-950">
            Button appearance
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            Set the button colours, font size and corner radius.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="button_background_color"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Background colour
              </label>

              <div className="flex gap-3">
                <input
                  id="button_background_color_picker"
                  type="color"
                  disabled={disabled}
                  value={form.button_background_color}
                  onChange={(event) =>
                    updateField(
                      "button_background_color",
                      event.target.value,
                    )
                  }
                  className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border border-slate-300 bg-white p-1 disabled:cursor-not-allowed disabled:bg-slate-100"
                  aria-label="Select button background colour"
                />

                <input
                  id="button_background_color"
                  name="button_background_color"
                  type="text"
                  disabled={disabled}
                  value={form.button_background_color}
                  onChange={(event) =>
                    updateField(
                      "button_background_color",
                      event.target.value,
                    )
                  }
                  placeholder="#0b2f24"
                  className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="button_text_color"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Text colour
              </label>

              <div className="flex gap-3">
                <input
                  id="button_text_color_picker"
                  type="color"
                  disabled={disabled}
                  value={form.button_text_color}
                  onChange={(event) =>
                    updateField("button_text_color", event.target.value)
                  }
                  className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border border-slate-300 bg-white p-1 disabled:cursor-not-allowed disabled:bg-slate-100"
                  aria-label="Select button text colour"
                />

                <input
                  id="button_text_color"
                  name="button_text_color"
                  type="text"
                  disabled={disabled}
                  value={form.button_text_color}
                  onChange={(event) =>
                    updateField("button_text_color", event.target.value)
                  }
                  placeholder="#ffffff"
                  className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label
                  htmlFor="button_size"
                  className="text-sm font-semibold text-slate-800"
                >
                  Font size
                </label>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {form.button_size}px
                </span>
              </div>

              <input
                id="button_size"
                name="button_size"
                type="range"
                min={10}
                max={32}
                step={1}
                disabled={disabled}
                value={form.button_size}
                onChange={(event) =>
                  updateField("button_size", Number(event.target.value))
                }
                className="w-full accent-emerald-700 disabled:cursor-not-allowed"
              />

              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>10px</span>
                <span>32px</span>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label
                  htmlFor="button_radius"
                  className="text-sm font-semibold text-slate-800"
                >
                  Corner radius
                </label>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {form.button_radius}px
                </span>
              </div>

              <input
                id="button_radius"
                name="button_radius"
                type="range"
                min={0}
                max={999}
                step={1}
                disabled={disabled}
                value={form.button_radius}
                onChange={(event) =>
                  updateField("button_radius", Number(event.target.value))
                }
                className="w-full accent-emerald-700 disabled:cursor-not-allowed"
              />

              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>Square</span>
                <span>Pill</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-800">
            Button preview
          </p>

          <div className="flex min-h-36 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
            {hasButton ? (
              <a
                href={form.button_link}
                target={form.open_in_new_tab ? "_blank" : undefined}
                rel={
                  form.open_in_new_tab
                    ? "noopener noreferrer"
                    : undefined
                }
                onClick={(event) => event.preventDefault()}
                className="inline-flex min-h-11 items-center justify-center px-6 py-3 font-semibold transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: form.button_background_color,
                  color: form.button_text_color,
                  borderRadius: `${form.button_radius}px`,
                  fontSize: `${form.button_size}px`,
                }}
              >
                {form.button_text}
              </a>
            ) : (
              <p className="text-center text-sm leading-6 text-slate-500">
                Add both button text and a button link to see the preview.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}