"use client";

import Image from "next/image";
import {
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Home,
  Leaf,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

import type {
  HomepageHowWeWorkData,
  HomepageHowWeWorkGroupWithSteps,
  HomepageHowWeWorkStep,
} from "@/lib/types/homepage-how-we-work";

type HowWeWorkSectionProps = {
  data: HomepageHowWeWorkData;
};

function getSectionBackground(
  section: NonNullable<HomepageHowWeWorkData["section"]>,
): string {
  if (section.background_type === "gradient") {
    return `linear-gradient(${section.gradient_direction}, ${section.gradient_start_color}, ${section.gradient_end_color})`;
  }

  return section.background_color;
}

function getGroupBackground(
  group: HomepageHowWeWorkGroupWithSteps,
): string {
  if (group.background_type === "gradient") {
    return `linear-gradient(${group.gradient_direction}, ${group.gradient_start_color}, ${group.gradient_end_color})`;
  }

  return group.background_color;
}

function getShadow(style: HomepageHowWeWorkGroupWithSteps["shadow_style"]): string {
  switch (style) {
    case "soft":
      return "0 16px 38px rgba(23, 37, 29, 0.10)";
    case "medium":
      return "0 24px 58px rgba(23, 37, 29, 0.15)";
    case "strong":
      return "0 34px 78px rgba(23, 37, 29, 0.22)";
    default:
      return "none";
  }
}

function getGroupsGridColumns(groupsPerRow: number): string {
  switch (groupsPerRow) {
    case 1:
      return "lg:grid-cols-1";
    case 3:
      return "lg:grid-cols-3";
    case 4:
      return "lg:grid-cols-4";
    case 2:
    default:
      return "lg:grid-cols-2";
  }
}

function GroupIcon({
  iconKey,
  size,
}: {
  iconKey: string;
  size: number;
}) {
  const props = {
    size,
    strokeWidth: 1.8,
  };

  switch (iconKey) {
    case "home":
      return <Home {...props} />;
    case "users":
      return <Users {...props} />;
    case "wrench":
      return <Wrench {...props} />;
    case "route":
      return <Route {...props} />;
    case "sparkles":
      return <Sparkles {...props} />;
    case "shield":
      return <ShieldCheck {...props} />;
    case "building":
    default:
      return <Building2 {...props} />;
  }
}

function StepIcon({
  iconKey,
  size,
}: {
  iconKey: string;
  size: number;
}) {
  const props = {
    size,
    strokeWidth: 1.8,
  };

  switch (iconKey) {
    case "clipboard":
      return <ClipboardCheck {...props} />;
    case "search":
      return <Search {...props} />;
    case "calendar":
      return <CalendarDays {...props} />;
    case "wrench":
      return <Wrench {...props} />;
    case "home":
      return <Home {...props} />;
    case "shield":
      return <ShieldCheck {...props} />;
    case "sparkles":
      return <Sparkles {...props} />;
    case "check":
    default:
      return <Check {...props} />;
  }
}

function HighlightIcon({
  iconKey,
}: {
  iconKey: string;
}) {
  switch (iconKey) {
    case "home":
      return <Home size={18} />;
    case "check":
      return <CheckCircle2 size={18} />;
    case "leaf":
      return <Leaf size={18} />;
    case "sparkles":
    default:
      return <Sparkles size={18} />;
  }
}

function StepMedia({
  step,
}: {
  step: HomepageHowWeWorkStep;
}) {
  if (
    step.media_type === "image" &&
    step.image_url
  ) {
    return (
      <div
        className="mb-4 overflow-hidden rounded-2xl"
        style={{
          height: `${step.image_height}px`,
        }}
      >
        <Image
          src={step.image_url}
          alt={step.image_alt}
          width={420}
          height={280}
          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  if (step.media_type === "icon") {
    return (
      <div
        className="mb-4 grid place-items-center rounded-2xl transition duration-300 group-hover:rotate-3 group-hover:scale-105"
        style={{
          width: `${Math.max(step.icon_size + 24, 48)}px`,
          height: `${Math.max(step.icon_size + 24, 48)}px`,
          color: step.icon_color,
          backgroundColor:
            step.icon_background_color,
        }}
      >
        <StepIcon
          iconKey={step.icon_key}
          size={step.icon_size}
        />
      </div>
    );
  }

  return null;
}

function TimelineStep({
  step,
  isLast,
}: {
  step: HomepageHowWeWorkStep;
  isLast: boolean;
}) {
  return (
    <article
      className="group relative flex gap-4"
      style={{
        backgroundColor:
          step.step_background_color,
        borderColor:
          step.step_border_color,
        borderRadius: `${step.step_radius}px`,
        borderStyle: "solid",
        borderWidth:
          step.step_border_color === "transparent"
            ? 0
            : 1,
        padding: `${step.step_padding}px`,
      }}
    >
      <div className="relative shrink-0">
        <div
          className="relative z-10 grid place-items-center rounded-full font-bold shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition duration-300 group-hover:scale-110"
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

        {!isLast ? (
          <div
            className="absolute left-1/2 top-full h-[calc(100%+18px)] -translate-x-1/2"
            style={{
              borderLeft: `${step.connector_width}px solid ${step.connector_color}`,
            }}
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1 pb-5">
        <StepMedia step={step} />

        <h4
          className="leading-tight"
          style={{
            color: step.title_color,
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
              step.description_color,
            fontSize: `${step.description_size}px`,
          }}
        >
          {step.description}
        </p>

        {step.button_text &&
        step.button_link ? (
          <a
            href={step.button_link}
            target={
              step.button_open_in_new_tab
                ? "_blank"
                : undefined
            }
            rel={
              step.button_open_in_new_tab
                ? "noopener noreferrer"
                : undefined
            }
            className="mt-4 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5"
            style={{
              color:
                step.button_text_color,
              backgroundColor:
                step.button_background_color,
            }}
          >
            {step.button_text}
          </a>
        ) : null}
      </div>
    </article>
  );
}

function CardStep({
  step,
}: {
  step: HomepageHowWeWorkStep;
}) {
  return (
    <article
      className="group border transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(0,0,0,0.12)]"
      style={{
        backgroundColor:
          step.step_background_color ===
          "transparent"
            ? "rgba(255,255,255,0.08)"
            : step.step_background_color,
        borderColor:
          step.step_border_color ===
          "transparent"
            ? "rgba(255,255,255,0.12)"
            : step.step_border_color,
        borderRadius: `${step.step_radius}px`,
        padding: `${Math.max(
          step.step_padding,
          18,
        )}px`,
      }}
    >
      <div
        className="grid place-items-center rounded-full font-bold"
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

      <div className="mt-4">
        <StepMedia step={step} />

        <h4
          className="leading-tight"
          style={{
            color: step.title_color,
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
              step.description_color,
            fontSize: `${step.description_size}px`,
          }}
        >
          {step.description}
        </p>
      </div>
    </article>
  );
}

function NumberedListStep({
  step,
}: {
  step: HomepageHowWeWorkStep;
}) {
  return (
    <article
      className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:bg-white/10"
    >
      <div
        className="grid shrink-0 place-items-center rounded-xl font-bold"
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

      <div className="min-w-0 flex-1">
        <StepMedia step={step} />

        <h4
          className="leading-tight"
          style={{
            color: step.title_color,
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
              step.description_color,
            fontSize: `${step.description_size}px`,
          }}
        >
          {step.description}
        </p>
      </div>
    </article>
  );
}

export default function HowWeWorkSection({
  data,
}: HowWeWorkSectionProps) {
  const section = data.section;

  if (!section || !section.is_active) {
    return null;
  }

  const groups = data.groups
    .filter(
      (group) =>
        group.is_active &&
        group.is_published,
    )
    .map((group) => ({
      ...group,
      steps: group.steps
        .filter(
          (step) =>
            step.is_active &&
            step.is_published,
        )
        .sort(
          (first, second) =>
            first.display_order -
            second.display_order,
        ),
    }))
    .filter(
      (group) =>
        group.steps.length > 0,
    )
    .sort(
      (first, second) =>
        first.display_order -
        second.display_order,
    );

  if (groups.length === 0) {
    return null;
  }

  const groupsGridColumns =
    getGroupsGridColumns(
      section.groups_per_row,
    );

  return (
    <section
      aria-labelledby="how-we-work-heading"
      className="relative overflow-hidden"
      style={{
        background:
          getSectionBackground(section),
        paddingTop: `${section.padding_top}px`,
        paddingBottom: `${section.padding_bottom}px`,
      }}
    >
      {section.background_type ===
        "image" &&
      section.background_image_url ? (
        <>
          <Image
            src={
              section.background_image_url
            }
            alt={
              section.background_image_alt
            }
            fill
            className="object-cover"
          />

          <div
            className="absolute inset-0"
            style={{
              backgroundColor:
                section.background_image_overlay_color,
            }}
          />
        </>
      ) : null}

      {section.show_decorations ? (
        <>
          <div
            className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full blur-3xl"
            style={{
              backgroundColor:
                `${section.accent_color}22`,
            }}
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full blur-3xl"
            style={{
              backgroundColor:
                `${section.accent_color}18`,
            }}
            aria-hidden="true"
          />
        </>
      ) : null}

      <div
        className="relative z-10 mx-auto px-6"
        style={{
          maxWidth: `${section.content_max_width}px`,
        }}
      >
        <header
          style={{
            textAlign:
              section.text_alignment,
            marginBottom: `${section.header_bottom_spacing}px`,
          }}
        >
          {section.eyebrow ? (
            <p
              className="uppercase tracking-[0.16em]"
              style={{
                color:
                  section.eyebrow_color,
                fontSize: `${section.eyebrow_size}px`,
                fontWeight:
                  section.eyebrow_weight,
              }}
            >
              {section.eyebrow}
            </p>
          ) : null}

          {section.heading ? (
            <h2
              id="how-we-work-heading"
              className="mt-4 leading-[1.04] tracking-[-0.045em]"
              style={{
                color:
                  section.heading_color,
                fontSize: `clamp(34px, 6vw, ${section.heading_size}px)`,
                fontWeight:
                  section.heading_weight,
              }}
            >
              {section.heading}
            </h2>
          ) : null}

          {section.subheading ? (
            <p
              className="mt-5 leading-8"
              style={{
                color:
                  section.subheading_color,
                fontSize: `${section.subheading_size}px`,
                maxWidth: "780px",
                marginLeft:
                  section.text_alignment ===
                  "center"
                    ? "auto"
                    : undefined,
                marginRight:
                  section.text_alignment ===
                  "center"
                    ? "auto"
                    : undefined,
              }}
            >
              {section.subheading}
            </p>
          ) : null}

          <div
            className="mt-7 h-1 w-24 rounded-full"
            style={{
              backgroundColor:
                section.accent_color,
              marginLeft:
                section.text_alignment ===
                "center"
                  ? "auto"
                  : section.text_alignment ===
                      "right"
                    ? "auto"
                    : undefined,
              marginRight:
                section.text_alignment ===
                "left"
                  ? undefined
                  : section.text_alignment ===
                      "center"
                    ? "auto"
                    : 0,
            }}
          />
        </header>

        <div
          className={`grid grid-cols-1 ${groupsGridColumns}`}
          style={{
            gap: `${section.groups_gap}px`,
          }}
        >
          {groups.map((group) => (
            <article
              key={group.id}
              className="group relative overflow-hidden transition duration-500 hover:-translate-y-2"
              style={{
                background:
                  getGroupBackground(group),
                borderColor:
                  group.border_color,
                borderWidth: `${group.border_width}px`,
                borderStyle: "solid",
                borderRadius: `${group.card_radius}px`,
                padding: `${group.card_padding}px`,
                minHeight: `${group.min_height}px`,
                boxShadow:
                  getShadow(
                    group.shadow_style,
                  ),
              }}
            >
              {group.background_type ===
                "image" &&
              group.background_image_url ? (
                <>
                  <Image
                    src={
                      group.background_image_url
                    }
                    alt={
                      group.background_image_alt
                    }
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
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

              <div
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl transition duration-500 group-hover:scale-125"
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  {group.media_type ===
                    "image" &&
                  group.image_url ? (
                    <div
                      className="shrink-0 overflow-hidden rounded-2xl"
                      style={{
                        height: `${group.image_height}px`,
                        width: `${group.image_height}px`,
                      }}
                    >
                      <Image
                        src={group.image_url}
                        alt={group.image_alt}
                        width={320}
                        height={320}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : group.media_type ===
                    "icon" ? (
                    <div
                      className="grid shrink-0 place-items-center rounded-2xl shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition duration-300 group-hover:rotate-3 group-hover:scale-105"
                      style={{
                        width: `${Math.max(
                          group.icon_size + 30,
                          60,
                        )}px`,
                        height: `${Math.max(
                          group.icon_size + 30,
                          60,
                        )}px`,
                        color:
                          group.icon_color,
                        backgroundColor:
                          group.icon_background_color,
                      }}
                    >
                      <GroupIcon
                        iconKey={
                          group.icon_key
                        }
                        size={
                          group.icon_size
                        }
                      />
                    </div>
                  ) : null}

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/55">
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
                        className="mt-3 leading-6"
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

                <div className="mt-8">
                  {group.layout_style ===
                  "cards" ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {group.steps.map(
                        (step) => (
                          <CardStep
                            key={step.id}
                            step={step}
                          />
                        ),
                      )}
                    </div>
                  ) : group.layout_style ===
                    "numbered-list" ? (
                    <div className="space-y-3">
                      {group.steps.map(
                        (step) => (
                          <NumberedListStep
                            key={step.id}
                            step={step}
                          />
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {group.steps.map(
                        (step, index) => (
                          <TimelineStep
                            key={step.id}
                            step={step}
                            isLast={
                              index ===
                              group.steps.length -
                                1
                            }
                          />
                        ),
                      )}
                    </div>
                  )}
                </div>

                {group.highlight_enabled &&
                group.highlight_text ? (
                  <div
                    className="mt-7 flex items-center gap-3 font-semibold"
                    style={{
                      color:
                        group.highlight_text_color,
                      backgroundColor:
                        group.highlight_background_color,
                      borderRadius: `${group.highlight_radius}px`,
                      padding: `${group.highlight_padding}px`,
                    }}
                  >
                    <HighlightIcon
                      iconKey={
                        group.highlight_icon_key
                      }
                    />
                    <span>
                      {group.highlight_text}
                    </span>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
