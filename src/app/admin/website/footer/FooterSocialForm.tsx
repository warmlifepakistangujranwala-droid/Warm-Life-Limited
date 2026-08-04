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

import { createFooterSocialLink } from "@/lib/actions/site-footer";

type FooterSocialFormProps = {
  footerId: string;
};

const socialIconOptions = [
  ["Facebook", "Facebook"],
  ["Instagram", "Instagram"],
  ["Linkedin", "LinkedIn"],
  ["Youtube", "YouTube"],
  ["Twitter", "X / Twitter"],
  ["Tiktok", "TikTok"],
  ["Globe", "Website"],
  ["Mail", "Email"],
] as const;

export default function FooterSocialForm({
  footerId,
}: FooterSocialFormProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [message, setMessage] =
    useState("");

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [form, setForm] = useState({
    platform: "",
    label: "",
    url: "",
    icon_name: "Facebook",
    display_order: 0,
    open_in_new_tab: true,
    is_active: true,
    is_published: true,
  });

  function resetForm(): void {
    setForm({
      platform: "",
      label: "",
      url: "",
      icon_name: "Facebook",
      display_order: 0,
      open_in_new_tab: true,
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

    if (!form.platform.trim()) {
      setMessage(
        "Social platform is required.",
      );

      return;
    }

    if (!form.label.trim()) {
      setMessage(
        "Social link label is required.",
      );

      return;
    }

    if (!form.url.trim()) {
      setMessage(
        "Social link URL is required.",
      );

      return;
    }

    if (!form.icon_name.trim()) {
      setMessage(
        "Social icon is required.",
      );

      return;
    }

    startTransition(async () => {
      const result =
        await createFooterSocialLink(
          footerId,
          {
            platform:
              form.platform.trim(),

            label:
              form.label.trim(),

            url:
              form.url.trim(),

            icon_name:
              form.icon_name.trim(),

            display_order:
              Number(
                form.display_order,
              ),

            open_in_new_tab:
              form.open_in_new_tab,

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
        "Social link added successfully.",
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

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Platform
          </span>

          <input
            value={form.platform}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                platform:
                  event.target.value,
              }))
            }
            placeholder="instagram"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">
            Label
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
            placeholder="Instagram"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          />
        </label>

        <label className="block xl:col-span-2">
          <span className="text-sm font-semibold text-slate-900">
            Social URL
          </span>

          <input
            value={form.url}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                url:
                  event.target.value,
              }))
            }
            placeholder="https://instagram.com/yourpage"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
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
            value={form.display_order}
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

        <label className="block md:col-span-2 xl:col-span-2">
          <span className="text-sm font-semibold text-slate-900">
            Icon
          </span>

          <select
            value={form.icon_name}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                icon_name:
                  event.target.value,
              }))
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          >
            {socialIconOptions.map(
              ([value, label]) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              ),
            )}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ToggleCard
          title="Open in New Tab"
          description="Open this social link in a new browser tab."
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
          title="Active"
          description="Disable this social link without deleting it."
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
          description="Show this social link on the live website."
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
            : "Add Social Link"}
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