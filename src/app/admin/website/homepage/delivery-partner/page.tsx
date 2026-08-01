import Link from "next/link";
import {
  BarChart3,
  CheckCircle2,
  Plus,
  ShieldCheck,
} from "lucide-react";

import {
  getHomepageDeliveryData,
} from "@/lib/actions/homepage-delivery";

import DeleteFeatureButton from "./DeleteFeatureButton";
import DeleteStatisticButton from "./DeleteStatisticButton";
import FeatureForm from "./FeatureForm";
import SectionSettingsForm from "./SectionSettingsForm";
import StatisticForm from "./StatisticForm";

export const dynamic = "force-dynamic";

export default async function DeliveryPartnerPage() {
  const data =
    await getHomepageDeliveryData();

  const section = data.section;
  const statistics = data.statistics;
  const features = data.features;

  return (
    <main className="space-y-8 p-8">
      <header className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-800 text-white">
            <BarChart3 size={23} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-950">
              Delivery Partner Section
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Manage the delivery partner content,
              statistics, benefits and homepage design.
            </p>
          </div>
        </div>
      </header>

      {!section ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
          Delivery Partner section was not found.
          Run the Delivery Partner SQL setup first.
        </div>
      ) : (
        <>
          <SectionSettingsForm
            section={section}
          />

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Delivery Statistics
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Manage the large statistic cards shown
                  beside the delivery content.
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                {statistics.length} statistics
              </span>
            </div>

            <StatisticForm
              sectionId={section.id}
            />

            {statistics.length > 0 ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {statistics.map(
                  (statistic) => (
                    <article
                      key={statistic.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <strong
                            className="block text-4xl font-black"
                            style={{
                              color:
                                statistic.value_color,
                            }}
                          >
                            {statistic.value}
                          </strong>

                          <h3
                            className="mt-2 text-lg font-bold"
                            style={{
                              color:
                                statistic.title_color,
                            }}
                          >
                            {statistic.title}
                          </h3>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statistic.is_active &&
                            statistic.is_published
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {statistic.is_active &&
                          statistic.is_published
                            ? "Live"
                            : "Hidden"}
                        </span>
                      </div>

                      <p
                        className="mt-3 text-sm leading-6"
                        style={{
                          color:
                            statistic.description_color,
                        }}
                      >
                        {statistic.description}
                      </p>

                      <p className="mt-4 text-xs font-semibold text-slate-500">
                        Order {statistic.display_order}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-3">
  <Link
    href={`/admin/website/homepage/delivery-partner/statistics/${statistic.id}/edit`}
    className="inline-flex items-center justify-center rounded-xl border border-emerald-700 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
  >
    Edit
  </Link>

  <DeleteStatisticButton
    statisticId={statistic.id}
    statisticTitle={statistic.title}
  />
</div>
                    </article>
                  ),
                )}
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                No delivery statistics added.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Bottom Benefit Items
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Manage the compliance, quality,
                  resident and sustainability benefits.
                </p>
              </div>

              <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
                {features.length} benefits
              </span>
            </div>

            <FeatureForm
              sectionId={section.id}
            />

            {features.length > 0 ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {features.map(
                  (feature) => (
                    <article
                      key={feature.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald-800 text-white">
                        {feature.icon_key ===
                        "shield" ? (
                          <ShieldCheck
                            size={21}
                          />
                        ) : (
                          <CheckCircle2
                            size={21}
                          />
                        )}
                      </div>

                      <h3 className="mt-4 font-bold text-slate-950">
                        {feature.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {feature.description}
                      </p>

                      <p className="mt-4 text-xs font-semibold text-slate-500">
                        Order {feature.display_order}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-3">
  <Link
    href={`/admin/website/homepage/delivery-partner/features/${feature.id}/edit`}
    className="inline-flex items-center justify-center rounded-xl border border-emerald-700 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
  >
    Edit
  </Link>

  <DeleteFeatureButton
    featureId={feature.id}
    featureTitle={feature.title}
  />
</div>
                    </article>
                  ),
                )}
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                No benefit items added.
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}