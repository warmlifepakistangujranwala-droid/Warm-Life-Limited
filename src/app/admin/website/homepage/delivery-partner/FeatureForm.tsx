"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createHomepageDeliveryFeature } from "@/lib/actions/homepage-delivery";

type FeatureFormProps = {
  sectionId: string;
};

export default function FeatureForm({
  sectionId,
}: FeatureFormProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [message, setMessage] =
    useState("");

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",

    icon_key: "shield",

    display_order: 0,

    is_active: true,
    is_published: true,
  });

  function resetForm() {
    setForm({
      title: "",
      description: "",

      icon_key: "shield",

      display_order: 0,

      is_active: true,
      is_published: true,
    });
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (!form.title.trim()) {
      setMessage(
        "Feature title is required.",
      );

      return;
    }

    if (
      !form.description.trim()
    ) {
      setMessage(
        "Feature description is required.",
      );

      return;
    }

    startTransition(async () => {
      const result =
        await createHomepageDeliveryFeature(
          {
            section_id: sectionId,

            title:
              form.title.trim(),

            description:
              form.description.trim(),

            icon_key:
              form.icon_key,

            display_order:
              Number(
                form.display_order,
              ),

            is_active:
              form.is_active,

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
        "Feature added successfully.",
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
            Add Benefit Item
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            Create a benefit card for the
            bottom row.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? "Adding..."
            : "Add Benefit"}
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

      <div className="mt-5 grid gap-5 md:grid-cols-2">
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
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
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
            rows={4}
            value={
              form.description
            }
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description:
                  event.target.value,
              }))
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            placeholder="Describe this benefit..."
          />
        </label>
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
              Keep this benefit enabled.
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
              Show this benefit on the live homepage.
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

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
          Preview
        </p>

        <div className="mt-4 flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-800 text-white">
            <span className="text-sm font-bold uppercase">
              {form.icon_key.slice(0, 2)}
            </span>
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-950">
              {form.title || "Benefit Title"}
            </h4>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {form.description ||
                "Benefit description will appear here."}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}