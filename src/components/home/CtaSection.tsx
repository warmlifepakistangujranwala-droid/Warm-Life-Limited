import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Phone,
} from "lucide-react";

import type {
  HomepageCtaData,
  HomepageCtaSection,
} from "@/lib/types/homepage-cta";

type CtaSectionProps = {
  data: HomepageCtaData;
};

function getBackground(
  section: HomepageCtaSection,
): string {
  if (section.background_type === "gradient") {
    return `linear-gradient(${section.gradient_direction}, ${section.gradient_start_color}, ${section.gradient_end_color})`;
  }

  return section.background_color;
}

function getShadow(
  style: HomepageCtaSection["shadow_style"],
): string {
  switch (style) {
    case "soft":
      return "0 14px 34px rgba(23,37,29,0.10)";
    case "medium":
      return "0 22px 50px rgba(23,37,29,0.16)";
    case "strong":
      return "0 30px 70px rgba(23,37,29,0.24)";
    default:
      return "none";
  }
}

function isExternalLink(link: string): boolean {
  return (
    link.startsWith("http://") ||
    link.startsWith("https://") ||
    link.startsWith("mailto:") ||
    link.startsWith("tel:")
  );
}

function CtaButton({
  enabled,
  text,
  link,
  openInNewTab,
  textColor,
  backgroundColor,
  borderColor,
  radius,
  paddingX,
  paddingY,
  variant,
}: {
  enabled: boolean;
  text: string;
  link: string;
  openInNewTab: boolean;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  radius: number;
  paddingX: number;
  paddingY: number;
  variant: "primary" | "secondary";
}) {
  if (!enabled || !text || !link) {
    return null;
  }

  const className =
    "inline-flex items-center justify-center gap-2 border font-semibold transition duration-300 hover:-translate-y-0.5 hover:shadow-lg";

  const style = {
    color: textColor,
    backgroundColor,
    borderColor,
    borderRadius: `${radius}px`,
    paddingLeft: `${paddingX}px`,
    paddingRight: `${paddingX}px`,
    paddingTop: `${paddingY}px`,
    paddingBottom: `${paddingY}px`,
  };

  const content = (
    <>
      {variant === "secondary" &&
      link.startsWith("tel:") ? (
        <Phone size={18} />
      ) : null}

      <span>{text}</span>

      {variant === "primary" ? (
        <ArrowRight size={18} />
      ) : null}
    </>
  );

  if (isExternalLink(link)) {
    return (
      <a
        href={link}
        target={
          openInNewTab
            ? "_blank"
            : undefined
        }
        rel={
          openInNewTab
            ? "noopener noreferrer"
            : undefined
        }
        className={className}
        style={style}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={link}
      target={
        openInNewTab
          ? "_blank"
          : undefined
      }
      rel={
        openInNewTab
          ? "noopener noreferrer"
          : undefined
      }
      className={className}
      style={style}
    >
      {content}
    </Link>
  );
}

export default function CtaSection({
  data,
}: CtaSectionProps) {
  const section = data.section;

  if (
    !section ||
    !section.is_active ||
    !section.is_published
  ) {
    return null;
  }

  return (
    <section
      className="relative"
      style={{
        marginTop: `${section.section_margin_top}px`,
        marginBottom: `${section.section_margin_bottom}px`,
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: `${section.content_max_width}px`,
          paddingLeft: `${section.padding_left}px`,
          paddingRight: `${section.padding_right}px`,
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            background: getBackground(section),
            borderRadius: `${section.border_radius}px`,
            borderWidth: `${section.border_width}px`,
            borderStyle: "solid",
            borderColor: section.border_color,
            boxShadow: getShadow(section.shadow_style),
            paddingTop: `${section.padding_top}px`,
            paddingBottom: `${section.padding_bottom}px`,
          }}
        >
          {section.background_type === "image" &&
          section.background_image_url ? (
            <>
              <Image
                src={section.background_image_url}
                alt={section.background_image_alt}
                fill
                className="object-cover"
              />

              <div
                className="absolute inset-0"
                style={{
                  backgroundColor:
                    section.background_overlay_color,
                }}
              />
            </>
          ) : null}

          {section.show_decorations ? (
            <>
              <div
                className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl"
                style={{
                  backgroundColor:
                    section.decoration_primary_color,
                  opacity:
                    section.decoration_opacity,
                }}
                aria-hidden="true"
              />

              <div
                className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full blur-3xl"
                style={{
                  backgroundColor:
                    section.decoration_secondary_color,
                  opacity:
                    section.decoration_opacity,
                }}
                aria-hidden="true"
              />

              <div
                className="pointer-events-none absolute right-10 top-10 h-24 w-24 rounded-full border border-white/15"
                aria-hidden="true"
              />
            </>
          ) : null}

          <div
            className="relative z-10 mx-auto"
            style={{
              maxWidth: `${section.content_inner_width}px`,
              textAlign:
                section.text_alignment,
            }}
          >
            <div
              className="flex flex-col"
              style={{
                gap: `${section.content_gap}px`,
                alignItems:
                  section.text_alignment ===
                  "center"
                    ? "center"
                    : section.text_alignment ===
                        "right"
                      ? "flex-end"
                      : "flex-start",
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

              <h2
                className="leading-[1.04] tracking-[-0.045em]"
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

              <p
                className="leading-8"
                style={{
                  color:
                    section.description_color,
                  fontSize: `${section.description_size}px`,
                  maxWidth: "760px",
                }}
              >
                {section.description}
              </p>
                            {section.highlight_enabled &&
              section.highlight_text ? (
                <div
                  className="inline-flex items-center gap-2 border font-medium"
                  style={{
                    color:
                      section.highlight_text_color,
                    backgroundColor:
                      section.highlight_background_color,
                    borderColor:
                      section.highlight_border_color,
                    borderRadius: `${section.highlight_radius}px`,
                    paddingLeft: `${section.highlight_padding_x}px`,
                    paddingRight: `${section.highlight_padding_x}px`,
                    paddingTop: `${section.highlight_padding_y}px`,
                    paddingBottom: `${section.highlight_padding_y}px`,
                  }}
                >
                  <CheckCircle2
                    size={17}
                    className="shrink-0"
                  />

                  <span>
                    {section.highlight_text}
                  </span>
                </div>
              ) : null}

              <div
                className="flex flex-wrap"
                style={{
                  gap: `${section.button_gap}px`,
                  justifyContent:
                    section.text_alignment ===
                    "center"
                      ? "center"
                      : section.text_alignment ===
                          "right"
                        ? "flex-end"
                        : "flex-start",
                }}
              >
                <CtaButton
                  enabled={
                    section.primary_button_enabled
                  }
                  text={
                    section.primary_button_text
                  }
                  link={
                    section.primary_button_link
                  }
                  openInNewTab={
                    section.primary_button_open_in_new_tab
                  }
                  textColor={
                    section.primary_button_text_color
                  }
                  backgroundColor={
                    section.primary_button_background_color
                  }
                  borderColor={
                    section.primary_button_border_color
                  }
                  radius={
                    section.primary_button_radius
                  }
                  paddingX={
                    section.primary_button_padding_x
                  }
                  paddingY={
                    section.primary_button_padding_y
                  }
                  variant="primary"
                />

                <CtaButton
                  enabled={
                    section.secondary_button_enabled
                  }
                  text={
                    section.secondary_button_text
                  }
                  link={
                    section.secondary_button_link
                  }
                  openInNewTab={
                    section.secondary_button_open_in_new_tab
                  }
                  textColor={
                    section.secondary_button_text_color
                  }
                  backgroundColor={
                    section.secondary_button_background_color
                  }
                  borderColor={
                    section.secondary_button_border_color
                  }
                  radius={
                    section.secondary_button_radius
                  }
                  paddingX={
                    section.secondary_button_padding_x
                  }
                  paddingY={
                    section.secondary_button_padding_y
                  }
                  variant="secondary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}