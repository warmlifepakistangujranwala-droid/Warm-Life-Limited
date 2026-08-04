"use client";

import {
  type FormEvent,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  MapPin,
  Save,
} from "lucide-react";

import { updateSiteFooterContact } from "@/lib/actions/site-footer";

import type {
  SiteFooterContact,
} from "@/lib/types/site-footer";

type FooterContactFormProps = {
  contact: SiteFooterContact;
};

export default function FooterContactForm({
  contact,
}: FooterContactFormProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [message, setMessage] =
    useState("");

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [form, setForm] = useState({
    phone_label:
      contact.phone_label,

    phone:
      contact.phone,

    phone_link:
      contact.phone_link,

    email_label:
      contact.email_label,

    email:
      contact.email,

    email_link:
      contact.email_link,

    address_label:
      contact.address_label,

    address:
      contact.address,

    address_link:
      contact.address_link ?? "",

    working_hours_label:
      contact.working_hours_label,

    working_hours:
      contact.working_hours,

    map_url:
      contact.map_url ?? "",

    show_phone:
      contact.show_phone,

    show_email:
      contact.show_email,

    show_address:
      contact.show_address,

    show_working_hours:
      contact.show_working_hours,

    icon_color:
      contact.icon_color,

    is_active:
      contact.is_active,

    is_published:
      contact.is_published,
  });

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (
      form.show_phone &&
      !form.phone.trim()
    ) {
      setMessage(
        "Phone number is required when phone is enabled.",
      );

      return;
    }

    if (
      form.show_email &&
      !form.email.trim()
    ) {
      setMessage(
        "Email address is required when email is enabled.",
      );

      return;
    }

    if (
      form.show_address &&
      !form.address.trim()
    ) {
      setMessage(
        "Address is required when address is enabled.",
      );

      return;
    }

    if (
      form.show_working_hours &&
      !form.working_hours.trim()
    ) {
      setMessage(
        "Working hours are required when enabled.",
      );

      return;
    }

    startTransition(async () => {
      const result =
        await updateSiteFooterContact(
          contact.id,
          {
            phone_label:
              form.phone_label.trim() ||
              "Phone",

            phone:
              form.phone.trim(),

            phone_link:
              form.phone_link.trim(),

            email_label:
              form.email_label.trim() ||
              "Email",

            email:
              form.email.trim(),

            email_link:
              form.email_link.trim(),

            address_label:
              form.address_label.trim() ||
              "Address",

            address:
              form.address.trim(),

            address_link:
              form.address_link.trim() ||
              null,

            working_hours_label:
              form.working_hours_label.trim() ||
              "Opening Hours",

            working_hours:
              form.working_hours.trim(),

            map_url:
              form.map_url.trim() ||
              null,

            show_phone:
              form.show_phone,

            show_email:
              form.show_email,

            show_address:
              form.show_address,

            show_working_hours:
              form.show_working_hours,

            icon_color:
              form.icon_color,

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
        "Footer contact details saved successfully.",
      );

      setIsSuccess(true);

      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800">
            <MapPin size={21} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Footer Contact Details
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Manage the phone number,
              email address, location,
              map link, working hours
              and visibility.
            </p>
          </div>
        </div>

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
            <Save size={18} />
          )}

          {isPending
            ? "Saving..."
            : "Save Contact"}
        </button>
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

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Phone
        </h3>

        <div className="mt-5 space-y-5">
          <ToggleCard
            title="Show Phone"
            description="Display the company phone number in the footer."
            checked={form.show_phone}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                show_phone: checked,
              }))
            }
          />

          {form.show_phone ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <TextField
                label="Phone Label"
                value={form.phone_label}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    phone_label: value,
                  }))
                }
              />

              <TextField
                label="Phone Number"
                value={form.phone}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    phone: value,
                  }))
                }
              />

              <TextField
                label="Phone Link"
                value={form.phone_link}
                placeholder="tel:+442038899999"
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    phone_link: value,
                  }))
                }
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Email
        </h3>

        <div className="mt-5 space-y-5">
          <ToggleCard
            title="Show Email"
            description="Display the company email address in the footer."
            checked={form.show_email}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                show_email: checked,
              }))
            }
          />

          {form.show_email ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <TextField
                label="Email Label"
                value={form.email_label}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    email_label: value,
                  }))
                }
              />

              <TextField
                label="Email Address"
                value={form.email}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    email: value,
                  }))
                }
              />

              <TextField
                label="Email Link"
                value={form.email_link}
                placeholder="mailto:hello@warmlife.co.uk"
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    email_link: value,
                  }))
                }
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Address
        </h3>

        <div className="mt-5 space-y-5">
          <ToggleCard
            title="Show Address"
            description="Display the company address in the footer."
            checked={form.show_address}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                show_address: checked,
              }))
            }
          />

          {form.show_address ? (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  label="Address Label"
                  value={form.address_label}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      address_label: value,
                    }))
                  }
                />

                <TextField
                  label="Address Link"
                  value={form.address_link}
                  placeholder="Google Maps URL"
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      address_link: value,
                    }))
                  }
                />
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-900">
                  Address
                </span>

                <textarea
                  rows={4}
                  value={form.address}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      address:
                        event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                />
              </label>
            </>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Working Hours
        </h3>

        <div className="mt-5 space-y-5">
          <ToggleCard
            title="Show Working Hours"
            description="Display company opening hours in the footer."
            checked={
              form.show_working_hours
            }
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                show_working_hours:
                  checked,
              }))
            }
          />

          {form.show_working_hours ? (
            <>
              <TextField
                label="Working Hours Label"
                value={
                  form.working_hours_label
                }
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    working_hours_label:
                      value,
                  }))
                }
              />

              <label className="block">
                <span className="text-sm font-semibold text-slate-900">
                  Working Hours
                </span>

                <textarea
                  rows={4}
                  value={form.working_hours}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      working_hours:
                        event.target.value,
                    }))
                  }
                  placeholder="Monday–Friday: 9:00am–5:30pm"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                />
              </label>
            </>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Map and Icon
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <TextField
            label="Map URL"
            value={form.map_url}
            placeholder="Google Maps URL"
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                map_url: value,
              }))
            }
          />

          <ColourField
            label="Contact Icon Colour"
            value={form.icon_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                icon_color: value,
              }))
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Contact Visibility
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <ToggleCard
            title="Active"
            description="Disable these contact details without deleting them."
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
            description="Show these contact details on the live website."
            checked={form.is_published}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,
                is_published: checked,
              }))
            }
          />
        </div>
      </section>
    </form>
  );
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">
        {label}
      </span>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
      />
    </label>
  );
}

function ColourField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const safeColour =
    /^#[0-9A-Fa-f]{6}$/.test(value)
      ? value
      : "#000000";

  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">
        {label}
      </span>

      <div className="mt-2 flex gap-3">
        <input
          type="color"
          value={safeColour}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="h-12 w-16 rounded-lg border border-slate-300 bg-white p-1"
        />

        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3"
        />
      </div>
    </label>
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
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
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