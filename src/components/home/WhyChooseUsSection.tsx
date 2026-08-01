"use client";

import Image from "next/image";
import {
  BadgeCheck,
  CheckCircle2,
  Home,
  Leaf,
  MapPin,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

import type {
  HomepageWhyChooseUsCard,
  HomepageWhyChooseUsData,
} from "@/lib/types/homepage-why-choose-us";

type WhyChooseUsSectionProps = {
  data: HomepageWhyChooseUsData;
};

function CardIcon({
  card,
}: {
  card: HomepageWhyChooseUsCard;
}) {
  const iconProps = {
    size: card.icon_size,
    strokeWidth: 1.8,
  };

  switch (card.icon_key) {
    case "users":
      return <Users {...iconProps} />;

    case "leaf":
      return <Leaf {...iconProps} />;

    case "wrench":
      return <Wrench {...iconProps} />;

    case "map-pin":
      return <MapPin {...iconProps} />;

    case "home":
      return <Home {...iconProps} />;

    case "check":
      return <CheckCircle2 {...iconProps} />;

    case "badge":
      return <BadgeCheck {...iconProps} />;

    case "shield":
    default:
      return <ShieldCheck {...iconProps} />;
  }
}

function getGridColumns(
  cardsPerRow: number,
): string {
  switch (cardsPerRow) {
    case 1:
      return "lg:grid-cols-1";

    case 2:
      return "lg:grid-cols-2";

    case 3:
      return "lg:grid-cols-3";

    case 4:
      return "lg:grid-cols-4";

    case 6:
      return "lg:grid-cols-6";

    case 5:
    default:
      return "lg:grid-cols-5";
  }
}

export default function WhyChooseUsSection({
  data,
}: WhyChooseUsSectionProps) {
  const section = data.section;

  if (!section || !section.is_active) {
    return null;
  }

  const cards = data.cards
    .filter(
      (card) =>
        card.is_active &&
        card.is_published,
    )
    .sort(
      (firstCard, secondCard) =>
        firstCard.display_order -
        secondCard.display_order,
    );

  if (cards.length === 0) {
    return null;
  }

  const gridColumns =
    getGridColumns(
      section.cards_per_row,
    );

  return (
    <section
      aria-labelledby="why-choose-us-heading"
      className="relative overflow-hidden"
      style={{
        backgroundColor:
          section.section_background_color,
        paddingTop: `${section.padding_top}px`,
        paddingBottom: `${section.padding_bottom}px`,
      }}
    >
      <div
        className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-emerald-100/35 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-amber-100/35 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
          style={{
            textAlign:
              section.heading_alignment,
          }}
        >
          <div>
            {section.eyebrow ? (
              <p
                className="font-bold uppercase tracking-[0.16em]"
                style={{
                  color:
                    section.eyebrow_color,
                  fontSize: `${section.eyebrow_size}px`,
                }}
              >
                {section.eyebrow}
              </p>
            ) : null}

            {section.heading ? (
              <h2
                id="why-choose-us-heading"
                className="mt-4 max-w-5xl leading-[1.04] tracking-[-0.045em]"
                style={{
                  color:
                    section.heading_color,
                  fontSize: `clamp(36px, 6vw, ${section.heading_size}px)`,
                  fontWeight:
                    section.heading_weight,
                  marginLeft:
                    section.heading_alignment ===
                    "center"
                      ? "auto"
                      : undefined,
                  marginRight:
                    section.heading_alignment ===
                    "center"
                      ? "auto"
                      : undefined,
                }}
              >
                {section.heading}
              </h2>
            ) : null}
          </div>

          {section.badge_text ? (
            <div
              className="inline-flex w-fit items-center justify-center uppercase tracking-[0.12em] shadow-[0_12px_30px_rgba(19,146,103,0.18)]"
              style={{
                color:
                  section.badge_text_color,
                backgroundColor:
                  section.badge_background_color,
                fontSize: `${section.badge_font_size}px`,
                fontWeight:
                  section.badge_font_weight,
                borderRadius: `${section.badge_radius}px`,
                padding: `${section.badge_padding_y}px ${section.badge_padding_x}px`,
                justifySelf:
                  section.heading_alignment ===
                  "right"
                    ? "end"
                    : section.heading_alignment ===
                        "center"
                      ? "center"
                      : "start",
              }}
            >
              {section.badge_text}
            </div>
          ) : null}
        </div>

        <div
          className={`mt-14 grid grid-cols-1 sm:grid-cols-2 ${gridColumns}`}
          style={{
            gap: `${section.cards_gap}px`,
          }}
        >
          {cards.map((card) => (
            <article
              key={card.id}
              className="group relative overflow-hidden border shadow-[0_16px_42px_rgba(23,37,29,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_26px_58px_rgba(23,37,29,0.15)]"
              style={{
                backgroundColor:
                  card.card_background_color,
                borderColor:
                  card.card_border_color,
                borderRadius: `${card.card_radius}px`,
                minHeight: `${card.card_min_height}px`,
                padding: `${card.card_padding}px`,
              }}
            >
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-white/40 transition duration-300 group-hover:scale-125"
                aria-hidden="true"
              />

              <div className="relative z-10">
                {card.media_type ===
                  "image" &&
                card.image_url ? (
                  <div
                    className="mb-6 grid place-items-center overflow-hidden rounded-2xl"
                    style={{
                      height: `${card.image_height}px`,
                    }}
                  >
                    <Image
                      src={card.image_url}
                      alt={card.image_alt}
                      width={420}
                      height={300}
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div
                    className="mb-6 grid place-items-center rounded-2xl transition duration-300 group-hover:rotate-6 group-hover:scale-110"
                    style={{
                      width: `${Math.max(
                        card.icon_size + 30,
                        58,
                      )}px`,
                      height: `${Math.max(
                        card.icon_size + 30,
                        58,
                      )}px`,
                      color:
                        card.icon_color,
                      backgroundColor:
                        card.icon_background_color,
                    }}
                  >
                    <CardIcon card={card} />
                  </div>
                )}

                <h3
                  className="leading-tight"
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
                  className="mt-4 leading-7"
                  style={{
                    color:
                      card.description_color,
                    fontSize: `${card.description_size}px`,
                  }}
                >
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}