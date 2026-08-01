"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateHomepageDeliveryFeature } from "@/lib/actions/homepage-delivery";

import type { HomepageDeliveryFeature } from "@/lib/types/homepage-delivery";

type EditFeatureFormProps = {
  feature: HomepageDeliveryFeature;
};

export default function EditFeatureForm({
  feature,
}: EditFeatureFormProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [message, setMessage] =
    useState("");

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [form, setForm] = useState({
    title: feature.title,
    description: feature.description,
    icon_key: feature.icon_key,
    display_order: feature.display_order,
    is_active: feature.is_active,
    is_published: feature.is_published,
  });

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (!form.title.trim()) {
      setMessage("Benefit title is required.");
      return;
    }

    if (!form.description.trim()) {
      setMessage(
        "Benefit description is required.",
      );
      return;
    }

    startTransition(async () => {
      const result =
        await updateHomepageDeliveryFeature(
          feature.id,
          {
            title: form.title.trim(),
            description:
              form.description.trim(),
            icon_key: form.icon_key,
            display_order: Number(
              form.display_order,
            ),
            is_active: form.is_active,
            is_published:
              form.is_published,
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
        "Benefit updated successfully.",
      );

      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Benefit Details
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Update the benefit title,
            description, icon, order and
            visibility.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/website/homepage/delivery-partner",
              )
            }
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
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

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Benefit Title
          </span>

          <input
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                title:
                  event.target.value,
              }))
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Fully Compliant"
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
                icon_key:
                  event.target.value,
              }))
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          >
            <option value="shield">
              Shield
            </option>

            <option value="badge">
              Badge
            </option>

            <option value="users">
              Users
            </option>

            <option value="leaf">
              Leaf
            </option>

            <option value="check">
              Check
            </option>

            <option value="home">
              Home
            </option>
          </select>
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-semibold text-slate-900">
            Description
          </span>

          <textarea
            rows={5}
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description:
                  event.target.value,
              }))
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
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
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
          <span>
            <span className="block text-sm font-semibold text-slate-900">
              Active
            </span>

            <span className="mt-1 block text-xs text-slate-500">
              Disable without deleting.
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

        <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
          <span>
            <span className="block text-sm font-semibold text-slate-900">
              Published
            </span>

            <span className="mt-1 block text-xs text-slate-500">
              Show on the live homepage.
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

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
          Live Preview
        </p>

        <div className="mt-5 flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-800 text-sm font-bold uppercase text-white">
            {form.icon_key.slice(0, 2)}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-950">
              {form.title ||
                "Benefit Title"}
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              {form.description ||
                "Benefit description will appear here."}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}