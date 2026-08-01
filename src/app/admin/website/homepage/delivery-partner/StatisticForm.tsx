"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createHomepageDeliveryStatistic } from "@/lib/actions/homepage-delivery";

type StatisticFormProps = {
  sectionId: string;
};

export default function StatisticForm({
  sectionId,
}: StatisticFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [form, setForm] = useState({
    value: "",
    title: "",
    description: "",
    icon_key: "chart",

    value_color: "#d2a400",
    title_color: "#17251d",
    description_color: "#536158",
    card_background_color: "#fffdf8",

    display_order: 0,
    is_active: true,
    is_published: true,
  });

  function resetForm(): void {
    setForm({
      value: "",
      title: "",
      description: "",
      icon_key: "chart",

      value_color: "#d2a400",
      title_color: "#17251d",
      description_color: "#536158",
      card_background_color: "#fffdf8",

      display_order: 0,
      is_active: true,
      is_published: true,
    });
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (!form.value.trim()) {
      setMessage("Statistic value is required.");
      return;
    }

    if (!form.title.trim()) {
      setMessage("Statistic title is required.");
      return;
    }

    if (!form.description.trim()) {
      setMessage("Statistic description is required.");
      return;
    }

    startTransition(async () => {
      const result =
        await createHomepageDeliveryStatistic({
          section_id: sectionId,

          value: form.value.trim(),
          title: form.title.trim(),
          description: form.description.trim(),

          icon_key: form.icon_key,

          value_color: form.value_color,
          title_color: form.title_color,
          description_color: form.description_color,

          card_background_color:
            form.card_background_color,

          display_order: Number(
            form.display_order,
          ),

          is_active: form.is_active,
          is_published: form.is_published,
        });

      if (!result.success) {
        setMessage(result.errors.join(", "));
        return;
      }

      setIsSuccess(true);
      setMessage(
        "Statistic added successfully.",
      );

      resetForm();
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">
            Add Statistic
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            Create a new statistic card for the
            delivery partner section.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? "Adding..."
            : "Add Statistic"}
        </button>
      </div>

      {message ? (
        <div
          className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${
            isSuccess
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Value
          </span>

          <input
            value={form.value}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                value: event.target.value,
              }))
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            placeholder="1500+"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Title
          </span>

          <input
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            placeholder="Installations"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Icon
          </span>

          <select
            value={form.icon_key}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                icon_key: event.target.value,
              }))
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          >
            <option value="chart">
              Growth / Chart
            </option>

            <option value="users">
              People / Experts
            </option>

            <option value="home">
              Home / Property
            </option>

            <option value="shield">
              Shield / Compliance
            </option>

            <option value="leaf">
              Leaf / Sustainability
            </option>
          </select>
        </label>

        <label className="block md:col-span-2 xl:col-span-3">
          <span className="text-sm font-semibold text-slate-900">
            Description
          </span>

          <textarea
            rows={3}
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description:
                  event.target.value,
              }))
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            placeholder="Successful installations delivered under live energy schemes."
          />
        </label>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          [
            "value_color",
            "Value Colour",
          ],
          [
            "title_color",
            "Title Colour",
          ],
          [
            "description_color",
            "Description Colour",
          ],
          [
            "card_background_color",
            "Card Background",
          ],
        ].map(([field, label]) => (
          <label
            key={field}
            className="block"
          >
            <span className="text-sm font-semibold text-slate-900">
              {label}
            </span>

            <div className="mt-2 flex gap-3">
              <input
                type="color"
                value={
                  form[
                    field as keyof typeof form
                  ] as string
                }
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [field]:
                      event.target.value,
                  }))
                }
                className="h-12 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
              />

              <input
                value={
                  form[
                    field as keyof typeof form
                  ] as string
                }
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [field]:
                      event.target.value,
                  }))
                }
                className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3"
              />
            </div>
          </label>
        ))}
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Display Order
          </span>

          <input
            type="number"
            min={0}
            value={form.display_order}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                display_order: Number(
                  event.target.value,
                ),
              }))
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          />
        </label>

        <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
          <span>
            <span className="block text-sm font-semibold text-slate-900">
              Active
            </span>

            <span className="mt-1 block text-xs text-slate-500">
              Keep this statistic enabled.
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

        <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
          <span>
            <span className="block text-sm font-semibold text-slate-900">
              Published
            </span>

            <span className="mt-1 block text-xs text-slate-500">
              Show it on the live homepage.
            </span>
          </span>

          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                is_published:
                  event.target.checked,
              }))
            }
            className="h-5 w-5"
          />
        </label>
      </div>

      <div
        className="mt-6 rounded-2xl border border-slate-200 p-5"
        style={{
          backgroundColor:
            form.card_background_color,
        }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
          Preview
        </p>

        <strong
          className="mt-3 block text-4xl font-black"
          style={{
            color: form.value_color,
          }}
        >
          {form.value || "1500+"}
        </strong>

        <h4
          className="mt-2 text-lg font-bold"
          style={{
            color: form.title_color,
          }}
        >
          {form.title || "Installations"}
        </h4>

        <p
          className="mt-2 text-sm leading-6"
          style={{
            color: form.description_color,
          }}
        >
          {form.description ||
            "Statistic description will appear here."}
        </p>
      </div>
    </form>
  );
}