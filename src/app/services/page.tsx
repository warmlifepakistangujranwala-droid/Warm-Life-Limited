/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/services/page.tsx
 *
 * Purpose :
 * Renders the public Services listing page from the independent
 * Services CMS.
 *
 * Version : v1.0.0
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowRight,
  Flame,
  House,
  Leaf,
  Settings,
  ShieldCheck,
  Sun,
} from "lucide-react";

import {
  getServicesPageData,
} from "@/lib/actions/services-page";

import type {
  CSSProperties,
  ComponentType,
} from "react";

import type {
  Service,
  ServicesPageSettings,
} from "@/lib/types/services-page";

import ServicesHero from "./ServicesHero";
import "./services-page.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CSSVariableProperties =
  CSSProperties &
  Record<`--${string}`, string | number>;

const SERVICE_ICONS: Record<
  string,
  ComponentType<{
    size?: number;
    "aria-hidden"?: boolean;
  }>
> = {
  Settings,
  Sun,
  House,
  Flame,
  Leaf,
  ShieldCheck,
};

function getPageVariables(
  settings: ServicesPageSettings,
): CSSVariableProperties {
  return {
    "--services-section-background":
      settings.services_background_color,

    "--services-section-eyebrow":
      settings.services_eyebrow_color,

    "--services-section-eyebrow-size":
      `${settings.services_eyebrow_size}px`,

    "--services-section-eyebrow-weight":
      settings.services_eyebrow_weight,

    "--services-section-heading":
      settings.services_heading_color,

    "--services-section-heading-size":
      `${settings.services_heading_size}px`,

    "--services-section-heading-weight":
      settings.services_heading_weight,

    "--services-section-heading-line-height":
      settings.services_heading_line_height,

    "--services-section-text":
      settings.services_text_color,

    "--services-section-description-size":
      `${settings.services_description_size}px`,

    "--services-section-description-weight":
      settings.services_description_weight,

    "--services-section-description-line-height":
      settings.services_description_line_height,

    "--services-card-background":
      settings.services_card_background_color,

    "--services-card-heading":
      settings.services_card_heading_color,

    "--services-card-text":
      settings.services_card_text_color,

    "--services-card-radius":
      `${settings.services_card_radius}px`,

    "--services-card-gap":
      `${settings.services_card_gap}px`,

    "--services-card-padding":
      `${settings.services_card_padding}px`,

    "--services-image-height":
      `${settings.services_image_height}px`,

    "--services-image-radius":
      `${settings.services_image_radius}px`,

    "--services-columns":
      settings.services_columns,

    "--services-content-width":
      `${settings.services_content_max_width}px`,

    "--services-padding-top":
      `${settings.services_padding_top}px`,

    "--services-padding-bottom":
      `${settings.services_padding_bottom}px`,
  };
}

function getServiceLink(
  service: Service,
): string | null {
  if (!service.show_explore_button) {
    return null;
  }

  if (service.has_detail_page) {
    return `/services/${service.slug}`;
  }

  return service.custom_button_link;
}

function ServiceCard({
  service,
}: {
  service: Service;
}) {
  const ServiceIcon =
    SERVICE_ICONS[service.icon_name] ??
    Settings;

  const link =
    getServiceLink(service);

  const cardStyle: CSSVariableProperties = {
    "--service-card-background":
      service.card_background_color ??
      "var(--services-card-background)",

    "--service-card-heading":
      service.card_heading_color ??
      "var(--services-card-heading)",

    "--service-card-text":
      service.card_text_color ??
      "var(--services-card-text)",

    "--service-button-background":
      service.card_button_background_color ??
      "#315f45",

    "--service-button-text":
      service.card_button_text_color ??
      "#ffffff",

    "--service-button-radius":
      `${service.card_button_radius ?? 999}px`,
  };

  return (
    <article
      className="publicServiceCard"
      style={cardStyle}
    >
      <div className="publicServiceCard__media">
        {service.featured_image_url ? (
          <img
            src={service.featured_image_url}
            alt={
              service.featured_image_alt ||
              service.service_name
            }
          />
        ) : (
          <div
            className="publicServiceCard__mediaFallback"
            aria-hidden={true}
          >
            <ServiceIcon size={36} />
          </div>
        )}

        <div
          className="publicServiceCard__icon"
          aria-hidden={true}
        >
          <ServiceIcon size={21} />
        </div>
      </div>

      <div className="publicServiceCard__body">
        {service.eyebrow ? (
          <span className="publicServiceCard__eyebrow">
            {service.eyebrow}
          </span>
        ) : null}

        <h2>{service.service_name}</h2>

        {service.short_description ? (
          <p>
            {service.short_description}
          </p>
        ) : null}

        {link ? (
          <Link
            href={link}
            className="publicServiceCard__button"
            target={
              service.open_in_new_tab
                ? "_blank"
                : undefined
            }
            rel={
              service.open_in_new_tab
                ? "noreferrer"
                : undefined
            }
          >
            {service.explore_button_text}

            <ArrowRight
              size={16}
              aria-hidden={true}
            />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export default async function ServicesPage() {
  const {
    settings,
    heroSlides,
    services,
  } = await getServicesPageData();

  if (
    !settings ||
    !settings.is_active ||
    !settings.is_published
  ) {
    return (
      <main className="servicesUnavailable">
        <div>
          <h1>
            Services are currently unavailable
          </h1>

          <p>
            Please check back again soon.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="servicesPublicPage"
      style={getPageVariables(settings)}
    >
      <ServicesHero
        settings={settings}
        slides={heroSlides}
      />

      {settings.services_section_enabled ? (
        <section
          id="services-list"
          className={[
            "servicesListing",
            `servicesListing--${settings.services_text_alignment}`,
          ].join(" ")}
          aria-labelledby="services-list-heading"
        >
          <div className="servicesListing__inner">
            <header className="servicesListing__header">
              {settings.services_eyebrow ? (
                <span>
                  {settings.services_eyebrow}
                </span>
              ) : null}

              <h1 id="services-list-heading">
                {settings.services_heading}
              </h1>

              {settings.services_description ? (
                <p>
                  {settings.services_description}
                </p>
              ) : null}
            </header>

            {services.length === 0 ? (
              <div className="servicesListing__empty">
                <h2>
                  Services coming soon
                </h2>

                <p>
                  New services will appear here
                  once they are published.
                </p>
              </div>
            ) : (
              <div className="servicesListing__grid">
                {services.map(
                  (service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </section>
      ) : null}
    </main>
  );
}
