import Link from "next/link";
import {
  CheckCircle2,
  ImageIcon,
  Plus,
  ShieldCheck,
} from "lucide-react";

import { getHomepageWhyChooseUsData } from "@/lib/actions/homepage-why-choose-us";

import CardForm from "./CardForm";
import DeleteCardButton from "./DeleteCardButton";
import SectionSettingsForm from "./SectionSettingsForm";

export const dynamic = "force-dynamic";

export default async function WhyChooseUsPage() {
  const data =
    await getHomepageWhyChooseUsData();

  const section = data.section;
  const cards = data.cards;

  return (
    <main className="space-y-8 p-8">
      <header className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-800 text-white">
            <ShieldCheck size={23} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-950">
              Why Choose Us
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Manage the section heading, PAS badge,
              layout and unlimited feature cards.
            </p>
          </div>
        </div>
      </header>

      {!section ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
          Why Choose Us section was not found.
          Run the Why Choose Us SQL setup first.
        </div>
      ) : (
        <>
          <SectionSettingsForm
            section={section}
          />

          <section
            id="why-choose-us-cards"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Why Choose Us Cards
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Add as many cards as required.
                  Each card can use an icon or image.
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                {cards.length} cards
              </span>
            </div>

            <CardForm
              sectionId={section.id}
            />

            {cards.length > 0 ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                  <article
                    key={card.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    {card.media_type ===
                      "image" &&
                    card.image_url ? (
                      <div className="grid h-44 place-items-center border-b border-slate-200 bg-white p-5">
                        <img
                          src={card.image_url}
                          alt={card.image_alt}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="grid h-24 place-items-center border-b border-slate-200 bg-white">
                        <div
                          className="grid h-12 w-12 place-items-center rounded-2xl"
                          style={{
                            color:
                              card.icon_color,
                            backgroundColor:
                              card.icon_background_color,
                          }}
                        >
                          {card.icon_key ===
                          "shield" ? (
                            <ShieldCheck
                              size={
                                card.icon_size
                              }
                            />
                          ) : card.icon_key ===
                            "check" ? (
                            <CheckCircle2
                              size={
                                card.icon_size
                              }
                            />
                          ) : (
                            <ImageIcon
                              size={
                                card.icon_size
                              }
                            />
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3
                            className="font-bold"
                            style={{
                              color:
                                card.title_color,
                              fontSize: `${card.title_size}px`,
                              fontWeight:
                                card.title_weight,
                            }}
                          >
                            {card.title}
                          </h3>

                          <p
                            className="mt-3 leading-6"
                            style={{
                              color:
                                card.description_color,
                              fontSize: `${card.description_size}px`,
                            }}
                          >
                            {card.description}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            card.is_active &&
                            card.is_published
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {card.is_active &&
                          card.is_published
                            ? "Live"
                            : "Hidden"}
                        </span>
                      </div>

                      <p className="mt-4 text-xs font-semibold text-slate-500">
                        Order {card.display_order}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <Link
                          href={`/admin/website/homepage/why-choose-us/cards/${card.id}/edit`}
                          className="inline-flex items-center justify-center rounded-xl border border-emerald-700 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                        >
                          Edit
                        </Link>

                        <DeleteCardButton
                          cardId={card.id}
                          cardTitle={card.title}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                No Why Choose Us cards have been added.
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}