import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Home,
  ImageIcon,
  Layers3,
  Plus,
  Route,
  Sparkles,
} from "lucide-react";

import { getHomepageHowWeWorkData } from "@/lib/actions/homepage-how-we-work";

import DeleteGroupButton from "./DeleteGroupButton";
import DeleteStepButton from "./DeleteStepButton";
import GroupForm from "./GroupForm";
import SectionSettingsForm from "./SectionSettingsForm";
import StepForm from "./StepForm";

export const dynamic = "force-dynamic";

export default async function HowWeWorkPage() {
  const data =
    await getHomepageHowWeWorkData();

  const section = data.section;
  const groups = data.groups;

  const totalSteps = groups.reduce(
    (total, group) =>
      total + group.steps.length,
    0,
  );

  return (
    <main className="space-y-8 p-8">
      <header className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-800 text-white">
            <Route size={23} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-950">
              How We Work
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Manage the section design, process groups,
              steps, images, highlights and visibility.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
            {groups.length} groups
          </span>

          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
            {totalSteps} steps
          </span>
        </div>
      </header>

      {!section ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
          How We Work section was not found.
          Run the How We Work SQL setup first.
        </div>
      ) : (
        <>
          <SectionSettingsForm
            section={section}
          />

          <section
            id="how-we-work-groups"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Process Groups
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Add unlimited process journeys for
                  partners, households, installers or any
                  future audience.
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                {groups.length} groups
              </span>
            </div>

            <GroupForm
              sectionId={section.id}
            />

            {groups.length > 0 ? (
              <div className="mt-8 space-y-7">
                {groups.map((group) => (
                  <article
                    key={group.id}
                    className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50"
                  >
                    <div
                      className="relative overflow-hidden p-6"
                      style={{
                        background:
                          group.background_type ===
                          "gradient"
                            ? `linear-gradient(${group.gradient_direction}, ${group.gradient_start_color}, ${group.gradient_end_color})`
                            : group.background_color,
                      }}
                    >
                      {group.background_type ===
                        "image" &&
                      group.background_image_url ? (
                        <>
                          <img
                            src={
                              group.background_image_url
                            }
                            alt={
                              group.background_image_alt
                            }
                            className="absolute inset-0 h-full w-full object-cover"
                          />

                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundColor:
                                group.background_overlay_color,
                            }}
                          />
                        </>
                      ) : null}

                      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className="grid shrink-0 place-items-center rounded-2xl"
                            style={{
                              width: `${Math.max(
                                group.icon_size + 28,
                                58,
                              )}px`,
                              height: `${Math.max(
                                group.icon_size + 28,
                                58,
                              )}px`,
                              color:
                                group.icon_color,
                              backgroundColor:
                                group.icon_background_color,
                            }}
                          >
                            {group.icon_key ===
                            "home" ? (
                              <Home
                                size={
                                  group.icon_size
                                }
                              />
                            ) : group.icon_key ===
                              "sparkles" ? (
                              <Sparkles
                                size={
                                  group.icon_size
                                }
                              />
                            ) : (
                              <Building2
                                size={
                                  group.icon_size
                                }
                              />
                            )}
                          </div>

                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/65">
                              {group.internal_name}
                            </p>

                            <h3
                              className="mt-2 leading-tight"
                              style={{
                                color:
                                  group.title_color,
                                fontSize: `${group.title_size}px`,
                                fontWeight:
                                  group.title_weight,
                              }}
                            >
                              {group.title}
                            </h3>

                            {group.subtitle ? (
                              <p
                                className="mt-3 max-w-2xl leading-6"
                                style={{
                                  color:
                                    group.subtitle_color,
                                  fontSize: `${group.subtitle_size}px`,
                                }}
                              >
                                {group.subtitle}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              group.is_active &&
                              group.is_published
                                ? "bg-white/90 text-emerald-800"
                                : "bg-black/20 text-white"
                            }`}
                          >
                            {group.is_active &&
                            group.is_published
                              ? "Live"
                              : "Hidden"}
                          </span>

                          <span className="rounded-full bg-black/15 px-3 py-1 text-xs font-semibold text-white">
                            Order {group.display_order}
                          </span>

                          <span className="rounded-full bg-black/15 px-3 py-1 text-xs font-semibold text-white">
                            {group.steps.length} steps
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {group.steps.map((step) => (
                          <article
                            key={step.id}
                            className="rounded-2xl border border-slate-200 bg-white p-5"
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className="grid shrink-0 place-items-center rounded-full font-bold"
                                style={{
                                  width: `${step.step_label_diameter}px`,
                                  height: `${step.step_label_diameter}px`,
                                  color:
                                    step.step_label_text_color,
                                  backgroundColor:
                                    step.step_label_background_color,
                                  fontSize: `${step.step_label_size}px`,
                                }}
                              >
                                {step.step_label}
                              </div>

                              <div>
                                <h4
                                  className="leading-tight"
                                  style={{
                                    color:
                                      step.title_color ===
                                      "#ffffff"
                                        ? "#17251d"
                                        : step.title_color,
                                    fontSize: `${step.title_size}px`,
                                    fontWeight:
                                      step.title_weight,
                                  }}
                                >
                                  {step.title}
                                </h4>

                                <p
                                  className="mt-2 leading-6"
                                  style={{
                                    color:
                                      step.description_color ===
                                      "#d9eee5"
                                        ? "#536158"
                                        : step.description_color,
                                    fontSize: `${step.description_size}px`,
                                  }}
                                >
                                  {step.description}
                                </p>
                              </div>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3">
                              <Link
                                href={`/admin/website/homepage/how-we-work/steps/${step.id}/edit`}
                                className="inline-flex items-center justify-center rounded-xl border border-emerald-700 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                              >
                                Edit Step
                              </Link>

                              <DeleteStepButton
                                stepId={step.id}
                                stepTitle={
                                  step.title
                                }
                              />
                            </div>
                          </article>
                        ))}
                      </div>

                      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-5">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h4 className="font-bold text-slate-950">
                              Add Step to {group.title}
                            </h4>

                            <p className="mt-1 text-sm text-slate-600">
                              Add another step to this
                              process journey.
                            </p>
                          </div>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            Group ID: {group.id}
                          </span>
                        </div>

                        <StepForm
                          groupId={group.id}
                        />
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <Link
                          href={`/admin/website/homepage/how-we-work/groups/${group.id}/edit`}
                          className="inline-flex items-center justify-center rounded-xl border border-emerald-700 px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                        >
                          Edit Group
                        </Link>

                        <DeleteGroupButton
                          groupId={group.id}
                          groupTitle={group.title}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                No process groups have been added.
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}