"use client";

import type {
  ServiceFormBullet,
  ServiceBulletsCardProps,
} from "./service-form.types";

function createEmptyBullet(
  displayOrder: number,
): ServiceFormBullet {
  return {
    bullet_text: "",
    display_order: displayOrder,
  };
}

function normalizeBulletOrder(
  bullets: ServiceFormBullet[],
): ServiceFormBullet[] {
  return bullets.map((bullet, index) => ({
    ...bullet,
    display_order: index + 1,
  }));
}

export default function BulletsCard({
  bullets,
  setBullets,
  disabled = false,
}: ServiceBulletsCardProps) {
  function addBullet(): void {
    setBullets((currentBullets) => [
      ...currentBullets,
      createEmptyBullet(currentBullets.length + 1),
    ]);
  }

  function updateBullet(
    index: number,
    field: keyof ServiceFormBullet,
    value: string | number,
  ): void {
    setBullets((currentBullets) =>
      currentBullets.map((bullet, bulletIndex) => {
        if (bulletIndex !== index) {
          return bullet;
        }

        return {
          ...bullet,
          [field]: value,
        };
      }),
    );
  }

  function removeBullet(index: number): void {
    setBullets((currentBullets) =>
      normalizeBulletOrder(
        currentBullets.filter(
          (_, bulletIndex) => bulletIndex !== index,
        ),
      ),
    );
  }

  function moveBulletUp(index: number): void {
    if (index === 0) {
      return;
    }

    setBullets((currentBullets) => {
      const updatedBullets = [...currentBullets];

      [updatedBullets[index - 1], updatedBullets[index]] = [
        updatedBullets[index],
        updatedBullets[index - 1],
      ];

      return normalizeBulletOrder(updatedBullets);
    });
  }

  function moveBulletDown(index: number): void {
    setBullets((currentBullets) => {
      if (index >= currentBullets.length - 1) {
        return currentBullets;
      }

      const updatedBullets = [...currentBullets];

      [updatedBullets[index], updatedBullets[index + 1]] = [
        updatedBullets[index + 1],
        updatedBullets[index],
      ];

      return normalizeBulletOrder(updatedBullets);
    });
  }

  function clearAllBullets(): void {
    setBullets([]);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Service content
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">
            Service bullets
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Add unlimited benefits, features or supporting points for
            this service. Their order here will be used on the
            homepage.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {bullets.length > 0 ? (
            <button
              type="button"
              disabled={disabled}
              onClick={clearAllBullets}
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear all
            </button>
          ) : null}

          <button
            type="button"
            disabled={disabled}
            onClick={addBullet}
            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add bullet
          </button>
        </div>
      </div>

      <div className="mt-6">
        {bullets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">
              •
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
              No bullets added
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add the first bullet to show benefits or key service
              details on the homepage.
            </p>

            <button
              type="button"
              disabled={disabled}
              onClick={addBullet}
              className="mt-5 inline-flex min-h-10 items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add first bullet
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bullets.map((bullet, index) => (
              <article
                key={bullet.id ?? `new-bullet-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-800">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <label
                      htmlFor={`bullet_text_${index}`}
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Bullet text
                    </label>

                    <textarea
                      id={`bullet_text_${index}`}
                      name={`bullet_text_${index}`}
                      rows={3}
                      disabled={disabled}
                      value={bullet.bullet_text}
                      onChange={(event) =>
                        updateBullet(
                          index,
                          "bullet_text",
                          event.target.value,
                        )
                      }
                      placeholder="Enter a service benefit or feature..."
                      className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                      <span>
                        {bullet.bullet_text.length} characters
                      </span>

                      <span>
                        Display order: {index + 1}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 lg:w-28 lg:flex-col">
                    <button
                      type="button"
                      disabled={disabled || index === 0}
                      onClick={() => moveBulletUp(index)}
                      className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Move bullet ${index + 1} up`}
                    >
                      Up
                    </button>

                    <button
                      type="button"
                      disabled={
                        disabled || index === bullets.length - 1
                      }
                      onClick={() => moveBulletDown(index)}
                      className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Move bullet ${index + 1} down`}
                    >
                      Down
                    </button>

                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => removeBullet(index)}
                      className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Remove bullet ${index + 1}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {bullets.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Bullet summary
              </h3>

              <p className="mt-1 text-sm text-emerald-800">
                {bullets.length}{" "}
                {bullets.length === 1 ? "bullet" : "bullets"} will be
                saved with this service.
              </p>
            </div>

            <button
              type="button"
              disabled={disabled}
              onClick={addBullet}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add another bullet
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}