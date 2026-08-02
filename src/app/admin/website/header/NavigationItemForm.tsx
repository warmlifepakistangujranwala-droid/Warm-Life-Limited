"use client";

import {
  type FormEvent,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Plus,
} from "lucide-react";

import { createNavigationItem } from "@/lib/actions/site-header";

type NavigationItemFormProps = {
  headerId: string;
};

export default function NavigationItemForm({
  headerId,
}: NavigationItemFormProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [message, setMessage] =
    useState("");

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [form, setForm] = useState({
    label: "",
    href: "",
    display_order: 0,
    open_in_new_tab: false,
    show_on_desktop: true,
    show_on_mobile: true,
    is_active: true,
    is_published: true,
  });

  function resetForm(): void {
    setForm({
      label: "",
      href: "",
      display_order: 0,
      open_in_new_tab: false,
      show_on_desktop: true,
      show_on_mobile: true,
      is_active: true,
      is_published: true,
    });
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (!form.label.trim()) {
      setMessage(
        "Navigation label is required.",
      );
      return;
    }

    if (!form.href.trim()) {
      setMessage(
        "Navigation link is required.",
      );
      return;
    }

    startTransition(async () => {
      const result =
        await createNavigationItem(
          headerId,
          {
            label: form.label.trim(),
            href: form.href.trim(),
            item_type: "link",
            parent_id: null,
            open_in_new_tab:
              form.open_in_new_tab,
            show_on_desktop:
              form.show_on_desktop,
            show_on_mobile:
              form.show_on_mobile,
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
        setIsSuccess(false);
        return;
      }

      setMessage(
        "Navigation item added successfully.",
      );

      setIsSuccess(true);
      resetForm();
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
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

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Menu Label
          </span>

          <input
            value={form.label}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                label:
                  event.target.value,
              }))
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            placeholder="Home"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Menu Link
          </span>

          <input
            value={form.href}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                href:
                  event.target.value,
              }))
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            placeholder="/about"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Display Order
          </span>

          <input
            type="number"
            min={0}
            max={999}
            value={
              form.display_order
            }
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                display_order:
                  Number(
                    event.target.value,
                  ),
              }))
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ToggleCard
          title="Open in New Tab"
          description="Open this menu link in a new browser tab."
          checked={
            form.open_in_new_tab
          }
          onChange={(checked) =>
            setForm((current) => ({
              ...current,
              open_in_new_tab:
                checked,
            }))
          }
        />

        <ToggleCard
          title="Show on Desktop"
          description="Display this item in the desktop navbar."
          checked={
            form.show_on_desktop
          }
          onChange={(checked) =>
            setForm((current) => ({
              ...current,
              show_on_desktop:
                checked,
            }))
          }
        />

        <ToggleCard
          title="Show on Mobile"
          description="Display this item in the mobile menu."
          checked={
            form.show_on_mobile
          }
          onChange={(checked) =>
            setForm((current) => ({
              ...current,
              show_on_mobile:
                checked,
            }))
          }
        />

        <ToggleCard
          title="Active"
          description="Disable this item without deleting it."
          checked={form.is_active}
          onChange={(checked) =>
            setForm((current) => ({
              ...current,
              is_active: checked,
            }))
          }
        />

        <ToggleCard
          title="Published"
          description="Show this item on the live website."
          checked={
            form.is_published
          }
          onChange={(checked) =>
            setForm((current) => ({
              ...current,
              is_published:
                checked,
            }))
          }
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Plus size={18} />
          )}

          {isPending
            ? "Adding..."
            : "Add Menu Item"}
        </button>
      </div>
    </form>
  );
}

function ToggleCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (
    checked: boolean,
  ) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <span>
        <span className="block text-sm font-semibold text-slate-900">
          {title}
        </span>

        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked,
          )
        }
        className="h-5 w-5 shrink-0"
      />
    </label>
  );
}