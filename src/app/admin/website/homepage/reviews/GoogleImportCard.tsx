"use client";

import {
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Import,
  Loader2,
  Settings2,
} from "lucide-react";

import {
  importGoogleReviews,
  updateGoogleReviewsSettings,
} from "@/lib/actions/homepage-reviews";

import type {
  GoogleReviewsSettings,
} from "@/lib/types/homepage-reviews";

type GoogleImportCardProps = {
  settings: GoogleReviewsSettings | null;
};

export default function GoogleImportCard({
  settings,
}: GoogleImportCardProps) {
  const router = useRouter();

  const [
    isSaving,
    startSaving,
  ] = useTransition();

  const [
    isImporting,
    startImporting,
  ] = useTransition();

  const [message, setMessage] =
    useState("");

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [form, setForm] = useState({
    place_id:
      settings?.place_id ?? "",

    api_key_encrypted:
      "",

    auto_publish_imported:
      settings?.auto_publish_imported ??
      false,

    default_verified:
      settings?.default_verified ??
      true,

    is_active:
      settings?.is_active ??
      false,
  });

  function handleSave(): void {
    if (!settings) {
      setMessage(
        "Google review settings record was not found. Run the simplified Reviews SQL first.",
      );

      setIsSuccess(false);
      return;
    }

    if (
      form.is_active &&
      !form.place_id.trim()
    ) {
      setMessage(
        "Google Place ID is required when Google import is enabled.",
      );

      setIsSuccess(false);
      return;
    }

    setMessage("");
    setIsSuccess(false);

    startSaving(async () => {
      const result =
        await updateGoogleReviewsSettings(
          settings.id,
          {
            place_id:
              form.place_id.trim() ||
              null,

            ...(form.api_key_encrypted.trim()
              ? {
                  api_key_encrypted:
                    form.api_key_encrypted.trim(),
                }
              : {}),

            auto_publish_imported:
              form.auto_publish_imported,

            default_verified:
              form.default_verified,

            is_active:
              form.is_active,
          },
        );

      if (!result.success) {
        setMessage(
          result.errors.join(", "),
        );

        setIsSuccess(false);
        return;
      }

      setForm((current) => ({
        ...current,
        api_key_encrypted: "",
      }));

      setMessage(
        "Google review settings saved successfully.",
      );

      setIsSuccess(true);
      router.refresh();
    });
  }

  function handleImport(): void {
    if (!settings) {
      setMessage(
        "Google review settings record was not found.",
      );

      setIsSuccess(false);
      return;
    }

    if (!form.is_active) {
      setMessage(
        "Enable Google review import and save the settings first.",
      );

      setIsSuccess(false);
      return;
    }

    if (!form.place_id.trim()) {
      setMessage(
        "Google Place ID is required.",
      );

      setIsSuccess(false);
      return;
    }

    setMessage("");
    setIsSuccess(false);

    startImporting(async () => {
      const result =
        await importGoogleReviews();

      if (!result.success) {
        setMessage(
          result.errors.join(", "),
        );

        setIsSuccess(false);
        return;
      }

      setMessage(
        `Google import complete. ${result.data.imported} imported, ${result.data.skipped} skipped, ${result.data.totalReceived} received from Google.`,
      );

      setIsSuccess(true);
      router.refresh();
    });
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
            <Import size={22} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Google Reviews Import
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Connect a Google Place and import available customer reviews. Duplicate reviews are skipped automatically.
            </p>
          </div>
        </div>

        <div
          className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
            form.is_active
              ? "bg-green-50 text-green-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {form.is_active
            ? "Import Enabled"
            : "Import Disabled"}
        </div>
      </div>

      {message ? (
        <div
          className={`mt-5 rounded-xl border px-5 py-4 text-sm font-medium ${
            isSuccess
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      {!settings ? (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          Google review settings were not found. Run the simplified Reviews SQL setup before using this panel.
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                Google Place ID
              </span>

              <input
                value={form.place_id}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    place_id:
                      event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="ChIJ..."
              />

              <span className="mt-2 block text-xs leading-5 text-slate-500">
                Enter the Place ID for the Google Business Profile whose reviews should be imported.
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                API Key Override
              </span>

              <input
                type="password"
                value={
                  form.api_key_encrypted
                }
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    api_key_encrypted:
                      event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="Leave blank to keep current key"
                autoComplete="new-password"
              />

              <span className="mt-2 block text-xs leading-5 text-slate-500">
                Recommended: use the server environment variable{" "}
                <code className="rounded bg-slate-100 px-1.5 py-0.5">
                  GOOGLE_PLACES_API_KEY
                </code>
                . This field is only a fallback.
              </span>
            </label>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ToggleCard
              title="Enable Google Import"
              description="Allow the admin to import reviews from Google."
              checked={form.is_active}
              onChange={(checked) =>
                setForm((current) => ({
                  ...current,
                  is_active: checked,
                }))
              }
            />

            <ToggleCard
              title="Auto Publish Imported"
              description="Publish newly imported reviews immediately."
              checked={
                form.auto_publish_imported
              }
              onChange={(checked) =>
                setForm((current) => ({
                  ...current,
                  auto_publish_imported:
                    checked,
                }))
              }
            />

            <ToggleCard
              title="Mark as Verified"
              description="Apply the verified badge to imported Google reviews."
              checked={
                form.default_verified
              }
              onChange={(checked) =>
                setForm((current) => ({
                  ...current,
                  default_verified:
                    checked,
                }))
              }
            />
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Last Import
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {settings.last_imported_at
                    ? new Date(
                        settings.last_imported_at,
                      ).toLocaleString()
                    : "No Google reviews have been imported yet."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={
                    isSaving ||
                    isImporting
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-700 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Settings2
                      size={17}
                    />
                  )}

                  {isSaving
                    ? "Saving..."
                    : "Save Settings"}
                </button>

                <button
                  type="button"
                  onClick={handleImport}
                  disabled={
                    isSaving ||
                    isImporting ||
                    !form.is_active
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isImporting ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <CheckCircle2
                      size={17}
                    />
                  )}

                  {isImporting
                    ? "Importing..."
                    : "Import Reviews"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

type ToggleCardProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (
    checked: boolean,
  ) => void;
};

function ToggleCard({
  title,
  description,
  checked,
  onChange,
}: ToggleCardProps) {
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