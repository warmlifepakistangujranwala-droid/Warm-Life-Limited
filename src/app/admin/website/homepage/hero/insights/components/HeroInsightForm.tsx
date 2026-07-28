"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  createHeroInsight,
  updateHeroInsight,
} from "@/lib/actions/hero-insight";

import type { HeroSlide } from "@/lib/types/hero";
import type {
  HeroInsight,
  HeroInsightFieldErrors,
  HeroInsightFormValues,
} from "@/lib/types/hero-insight";

type HeroInsightFormProps = {
  heroSlides: HeroSlide[];
  insight?: HeroInsight;
};

export function HeroInsightForm({
  heroSlides,
  insight,
}: HeroInsightFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formValues, setFormValues] =
    useState<HeroInsightFormValues>({
      hero_slide_id: insight?.hero_slide_id ?? "",
      label: insight?.label ?? "",
      title: insight?.title ?? "",
      description: insight?.description ?? "",
      display_order: insight?.display_order ?? 0,
      is_visible: insight?.is_visible ?? true,
    });

  const [fieldErrors, setFieldErrors] =
    useState<HeroInsightFieldErrors>({});

  const [formError, setFormError] = useState("");

  const isEditMode = Boolean(insight);

  function updateField<K extends keyof HeroInsightFormValues>(
    field: K,
    value: HeroInsightFormValues[K],
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));

    setFormError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFieldErrors({});
    setFormError("");

    startTransition(async () => {
      const result =
        isEditMode && insight
          ? await updateHeroInsight({
              id: insight.id,
              ...formValues,
            })
          : await createHeroInsight(formValues);

      if (!result.success) {
        if (result.errors) {
          setFieldErrors(result.errors);
        }

        if (result.message) {
          setFormError(result.message);
        }

        return;
      }

      router.push("/admin/website/homepage/hero/insights");
      router.refresh();
    });
  }

  return (
    <form
      className="hero-insight-form"
      onSubmit={handleSubmit}
      noValidate
    >
      {formError ? (
        <div className="form-alert form-alert-error">
          {formError}
        </div>
      ) : null}

      <div className="form-section">
        <div className="form-section-header">
          <h2>Insight Details</h2>

          <p>
            Assign this information card to a hero slide and
            configure its content.
          </p>
        </div>

        <div className="form-grid">
          <div className="form-field form-field-full">
            <label htmlFor="hero_slide_id">
              Hero Slide
              <span aria-hidden="true">*</span>
            </label>

            <select
              id="hero_slide_id"
              value={formValues.hero_slide_id}
              onChange={(event) =>
                updateField(
                  "hero_slide_id",
                  event.target.value,
                )
              }
              disabled={isPending}
            >
              <option value="">
                Select a hero slide
              </option>

              {heroSlides.map((slide) => (
                <option key={slide.id} value={slide.id}>
                  {slide.title_line_one}
                  {slide.title_line_two
                    ? ` ${slide.title_line_two}`
                    : ""}
                </option>
              ))}
            </select>

            {fieldErrors.hero_slide_id?.[0] ? (
              <p className="field-error">
                {fieldErrors.hero_slide_id[0]}
              </p>
            ) : null}
          </div>

          <div className="form-field">
            <label htmlFor="label">
              Label
              <span aria-hidden="true">*</span>
            </label>

            <input
              id="label"
              type="text"
              value={formValues.label}
              onChange={(event) =>
                updateField("label", event.target.value)
              }
              placeholder="For example: Our Mission"
              maxLength={80}
              disabled={isPending}
            />

            <div className="field-meta">
              <span>
                {fieldErrors.label?.[0] ?? ""}
              </span>

              <span>{formValues.label.length}/80</span>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="title">
              Title
              <span aria-hidden="true">*</span>
            </label>

            <input
              id="title"
              type="text"
              value={formValues.title}
              onChange={(event) =>
                updateField("title", event.target.value)
              }
              placeholder="Insight title"
              maxLength={120}
              disabled={isPending}
            />

            <div className="field-meta">
              <span>
                {fieldErrors.title?.[0] ?? ""}
              </span>

              <span>{formValues.title.length}/120</span>
            </div>
          </div>

          <div className="form-field form-field-full">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              value={formValues.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value,
                )
              }
              placeholder="Add supporting information for this insight."
              rows={5}
              maxLength={400}
              disabled={isPending}
            />

            <div className="field-meta">
              <span>
                {fieldErrors.description?.[0] ?? ""}
              </span>

              <span>
                {formValues.description.length}/400
              </span>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="display_order">
              Display Order
            </label>

            <input
              id="display_order"
              type="number"
              min={0}
              step={1}
              value={formValues.display_order}
              onChange={(event) =>
                updateField(
                  "display_order",
                  Number(event.target.value),
                )
              }
              disabled={isPending}
            />

            {fieldErrors.display_order?.[0] ? (
              <p className="field-error">
                {fieldErrors.display_order[0]}
              </p>
            ) : (
              <p className="field-help">
                Lower numbers appear first.
              </p>
            )}
          </div>

          <div className="form-field">
            <span className="field-label">
              Visibility
            </span>

            <label className="toggle-field">
              <input
                type="checkbox"
                checked={formValues.is_visible}
                onChange={(event) =>
                  updateField(
                    "is_visible",
                    event.target.checked,
                  )
                }
                disabled={isPending}
              />

              <span className="toggle-control" />

              <span className="toggle-content">
                <strong>
                  {formValues.is_visible
                    ? "Visible"
                    : "Hidden"}
                </strong>

                <small>
                  {formValues.is_visible
                    ? "This insight can appear on the website."
                    : "This insight will not appear publicly."}
                </small>
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="button button-primary"
          disabled={isPending}
        >
          {isPending
            ? "Saving..."
            : isEditMode
              ? "Update Insight"
              : "Create Insight"}
        </button>
      </div>
    </form>
  );
}