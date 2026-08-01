"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Home,
  Leaf,
  ShieldCheck,
  Users,
  BarChart3,
} from "lucide-react";

import type {
  HomepageDeliveryData,
  HomepageDeliveryFeature,
  HomepageDeliveryStatistic,
} from "@/lib/types/homepage-delivery";

type DeliveryPartnerSectionProps = {
  data: HomepageDeliveryData;
};

function FeatureIcon({
  icon,
}: {
  icon: string;
}) {
  switch (icon) {
    case "shield":
      return <ShieldCheck size={24} />;

    case "users":
      return <Users size={24} />;

    case "leaf":
      return <Leaf size={24} />;

    case "home":
      return <Home size={24} />;

    case "badge":
      return <BadgeCheck size={24} />;

    default:
      return <ShieldCheck size={24} />;
  }
}

function StatisticIcon({
  icon,
}: {
  icon: string;
}) {
  switch (icon) {
    case "users":
      return <Users size={28} />;

    case "home":
      return <Home size={28} />;

    case "shield":
      return <ShieldCheck size={28} />;

    default:
      return <BarChart3 size={28} />;
  }
}

export default function DeliveryPartnerSection({
  data,
}: DeliveryPartnerSectionProps) {
  const section = data.section;

  if (!section || !section.is_active) {
    return null;
  }

  const statistics =
    data.statistics.filter(
      (item) =>
        item.is_active &&
        item.is_published,
    );

  const features =
    data.features.filter(
      (item) =>
        item.is_active &&
        item.is_published,
    );

  return (
    <section
      style={{
        background:
          section.section_background_color,
        paddingTop:
          section.padding_top,
        paddingBottom:
          section.padding_bottom,
      }}
      className="relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-yellow-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* HEADER STARTS HERE */}
                <div className="mx-auto max-w-4xl text-center">
          {section.top_badge ? (
            <div
              className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-sm backdrop-blur"
              style={{
                color: section.top_badge_color,
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: section.accent_color,
                }}
              />

              {section.top_badge}
            </div>
          ) : null}

          {section.section_heading ? (
            <h2
              className="mx-auto mt-6 max-w-5xl leading-[1.02] tracking-[-0.045em]"
              style={{
                color: section.section_heading_color,
                fontSize: `clamp(36px, 6vw, ${section.heading_size}px)`,
                fontWeight: 800,
              }}
            >
              {section.section_heading}
            </h2>
          ) : null}

          {section.section_subheading ? (
            <p
              className="mx-auto mt-6 max-w-3xl leading-8"
              style={{
                color: section.section_subheading_color,
                fontSize: `clamp(16px, 2vw, ${section.subheading_size}px)`,
              }}
            >
              {section.section_subheading}
            </p>
          ) : null}
        </div>

        <div className="relative mt-16">
          <div
            className="absolute -left-5 top-24 hidden h-24 w-24 rotate-12 rounded-[28px] border border-white/60 bg-white/70 shadow-xl backdrop-blur lg:block"
            aria-hidden="true"
          />

          <div
            className="absolute -right-5 bottom-24 hidden h-28 w-28 -rotate-12 rounded-full border border-white/60 bg-amber-100/70 shadow-xl backdrop-blur lg:block"
            aria-hidden="true"
          />

          <div className="grid items-stretch gap-7 lg:grid-cols-[1.35fr_0.85fr]">
                        <article
              className="relative overflow-hidden rounded-[36px] border border-white/20 p-8 shadow-[0_30px_80px_rgba(8,64,49,0.28)] sm:p-10 lg:p-12"
              style={{
                backgroundColor:
                  section.card_background_color,
              }}
            >
              <div
                className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-2xl"
                style={{
                  backgroundColor:
                    section.accent_color,
                }}
                aria-hidden="true"
              />

              <div
                className="absolute bottom-0 right-0 h-40 w-40 rounded-tl-[80px] border-l border-t border-white/10 bg-white/5"
                aria-hidden="true"
              />

              <div className="relative z-10 max-w-3xl lg:pr-[38%]">
                {section.card_eyebrow ? (
                  <p
                    className="text-xs font-black uppercase tracking-[0.18em]"
                    style={{
                      color:
                        section.card_eyebrow_color,
                    }}
                  >
                    {section.card_eyebrow}
                  </p>
                ) : null}

                {section.card_heading ? (
                  <h3
                    className="mt-5 max-w-3xl leading-[1.04] tracking-[-0.04em]"
                    style={{
                      color:
                        section.card_heading_color,
                      fontSize: `clamp(34px, 5vw, ${section.card_heading_size}px)`,
                      fontWeight: 800,
                    }}
                  >
                    {section.card_heading}
                  </h3>
                ) : null}

                {section.description_one ? (
                  <p
                    className="mt-6 max-w-3xl leading-8"
                    style={{
                      color:
                        section.card_description_color,
                    }}
                  >
                    {section.description_one}
                  </p>
                ) : null}

                {section.description_two ? (
                  <p
                    className="mt-4 max-w-3xl leading-8"
                    style={{
                      color:
                        section.card_description_color,
                    }}
                  >
                    {section.description_two}
                  </p>
                ) : null}

                {section.button_text &&
                section.button_link ? (
                  <Link
                    href={section.button_link}
                    target={
                      section.button_open_in_new_tab
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      section.button_open_in_new_tab
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="mt-8 inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-bold shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_38px_rgba(0,0,0,0.22)]"
                    style={{
                      backgroundColor:
                        section.button_background_color,
                      color:
                        section.button_text_color,
                    }}
                  >
                    {section.button_text}
                    <ArrowRight size={17} />
                  </Link>
                ) : null}
              </div>

              {section.image_url ? (
                <>
                  <div className="pointer-events-none absolute bottom-0 right-0 hidden h-[88%] w-[40%] items-end justify-end lg:flex">
                    <Image
                      src={section.image_url}
                      alt={
                        section.image_alt ||
                        "Warm Life delivery partner"
                      }
                      width={460}
                      height={520}
                      className="max-h-full w-auto object-contain drop-shadow-[0_28px_32px_rgba(0,0,0,0.22)]"
                    />
                  </div>

                  <div className="relative z-10 mt-8 flex justify-center lg:hidden">
                    <Image
                      src={section.image_url}
                      alt={
                        section.image_alt ||
                        "Warm Life delivery partner"
                      }
                      width={300}
                      height={340}
                      className="max-h-72 w-auto object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.2)]"
                    />
                  </div>
                </>
              ) : null}
            </article>
                        <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
              {statistics.map((statistic) => (
                <article
                  key={statistic.id}
                  className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 p-6 shadow-[0_18px_45px_rgba(23,37,29,0.10)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_60px_rgba(23,37,29,0.16)]"
                  style={{
                    backgroundColor:
                      statistic.card_background_color,
                  }}
                >
                  <div
                    className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 transition duration-300 group-hover:scale-125"
                    style={{
                      backgroundColor:
                        section.accent_color,
                    }}
                    aria-hidden="true"
                  />

                  <div className="relative z-10 flex items-start gap-5">
                    <div
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl shadow-lg"
                      style={{
                        backgroundColor:
                          section.card_background_color,
                        color:
                          section.accent_color,
                      }}
                    >
                      <StatisticIcon
                        icon={statistic.icon_key}
                      />
                    </div>

                    <div>
                      <strong
                        className="block text-4xl font-black leading-none tracking-[-0.04em]"
                        style={{
                          color:
                            statistic.value_color,
                        }}
                      >
                        {statistic.value}
                      </strong>

                      <h4
                        className="mt-2 text-lg font-bold"
                        style={{
                          color:
                            statistic.title_color,
                        }}
                      >
                        {statistic.title}
                      </h4>

                      <p
                        className="mt-2 text-sm leading-6"
                        style={{
                          color:
                            statistic.description_color,
                        }}
                      >
                        {statistic.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {features.length > 0 ? (
            <div className="mt-10 grid gap-5 rounded-[30px] border border-slate-200/70 bg-white/70 p-5 shadow-[0_22px_60px_rgba(23,37,29,0.10)] backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <article
                  key={feature.id}
                  className="group rounded-[24px] border border-transparent p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-900/10 hover:bg-white hover:shadow-lg"
                >
                  <div
                    className="grid h-12 w-12 place-items-center rounded-2xl transition duration-300 group-hover:rotate-6 group-hover:scale-110"
                    style={{
                      backgroundColor:
                        section.card_background_color,
                      color:
                        section.accent_color,
                    }}
                  >
                    <FeatureIcon
                      icon={feature.icon_key}
                    />
                  </div>

                  <h4 className="mt-4 text-lg font-bold text-slate-950">
                    {feature.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          ) : null}
                    <div
            className="pointer-events-none absolute -bottom-10 left-1/2 hidden h-24 w-[86%] -translate-x-1/2 rounded-[50%] bg-emerald-950/10 blur-3xl lg:block"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}