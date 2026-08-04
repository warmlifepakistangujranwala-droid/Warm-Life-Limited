/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/services/[slug]/page.tsx
 *
 * Purpose :
 * Renders a dynamic public detail page for each published
 * service, including real benefits, process steps and gallery.
 *
 * Version : v1.1.0
 * ============================================================
 */

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  BadgePoundSterling,
  CheckCircle2,
  CircleDot,
  Flame,
  House,
  Leaf,
  Settings,
  ShieldCheck,
  Sun,
  Zap,
} from "lucide-react";

import { notFound } from "next/navigation";

import type {
  CSSProperties,
  ComponentType,
} from "react";

import {
  getPublishedServiceDetailData,
} from "@/lib/actions/services-page";

import type {
  Service,
  ServiceBenefit,
  ServiceGalleryItem,
  ServiceProcessStep,
} from "@/lib/types/services-page";

import "./service-detail.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ServiceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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
  CheckCircle2,
  CircleDot,
  Zap,
  BadgePoundSterling,
};

function getPageVariables(): CSSVariableProperties {
  return {
    "--service-detail-accent": "#f1d313",
    "--service-detail-primary": "#163d2a",
    "--service-detail-secondary": "#315f45",
    "--service-detail-surface": "#f5f7f3",
    "--service-detail-text": "#5f6d64",
  };
}

function ServiceDetailHero({
  service,
}: {
  service: Service;
}) {
  const heading =
    service.detail_hero_heading ||
    service.service_name;

  const description =
    service.detail_hero_description ||
    service.short_description;

  return (
    <section
      className="serviceDetailHero"
      aria-labelledby="service-detail-heading"
    >
      {service.detail_hero_type === "video" &&
      service.detail_hero_video_url ? (
        <video
          className="serviceDetailHero__media"
          autoPlay
          muted
          loop
          playsInline
          poster={
            service.detail_hero_poster_url ??
            undefined
          }
        >
          <source
            src={service.detail_hero_video_url}
          />
        </video>
      ) : service.detail_hero_image_url ? (
        <img
          className="serviceDetailHero__media"
          src={service.detail_hero_image_url}
          alt={
            service.detail_hero_image_alt ||
            heading
          }
        />
      ) : service.featured_image_url ? (
        <img
          className="serviceDetailHero__media"
          src={service.featured_image_url}
          alt={
            service.featured_image_alt ||
            heading
          }
        />
      ) : (
        <div
          className="serviceDetailHero__fallback"
          aria-hidden={true}
        />
      )}

      <div
        className="serviceDetailHero__overlay"
        aria-hidden={true}
      />

      <div className="serviceDetailHero__inner">
        <nav
          className="serviceDetailHero__breadcrumb"
          aria-label="Breadcrumb"
        >
          <Link href="/">Home</Link>
          <span aria-hidden={true}>/</span>
          <Link href="/services">Services</Link>
          <span aria-hidden={true}>/</span>
          <strong>{service.service_name}</strong>
        </nav>

        {service.detail_hero_eyebrow ||
        service.eyebrow ? (
          <span className="serviceDetailHero__eyebrow">
            {service.detail_hero_eyebrow ||
              service.eyebrow}
          </span>
        ) : null}

        <h1 id="service-detail-heading">
          {heading}
        </h1>

        {description ? (
          <p>{description}</p>
        ) : null}
      </div>
    </section>
  );
}

function ServiceIntroduction({
  service,
}: {
  service: Service;
}) {
  if (!service.full_description) {
    return null;
  }

  const ServiceIcon =
    SERVICE_ICONS[service.icon_name] ??
    Settings;

  return (
    <section
      className="serviceDetailIntro"
      aria-labelledby="service-introduction-heading"
    >
      <div className="serviceDetailIntro__inner">
        <div className="serviceDetailIntro__icon">
          <ServiceIcon
            size={27}
            aria-hidden={true}
          />
        </div>

        <div className="serviceDetailIntro__content">
          <span>Service overview</span>

          <h2 id="service-introduction-heading">
            {service.service_name}
          </h2>

          <div className="serviceDetailRichText">
            {service.full_description
              .split(/\n{2,}/)
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhoIsItFor({
  service,
}: {
  service: Service;
}) {
  if (
    !service.who_is_it_for_enabled ||
    !service.who_is_it_for_content
  ) {
    return null;
  }

  return (
    <section
      className="serviceDetailAudience"
      aria-labelledby="service-audience-heading"
    >
      <div className="serviceDetailAudience__inner">
        <header>
          <span>Suitable for</span>

          <h2 id="service-audience-heading">
            {service.who_is_it_for_heading}
          </h2>
        </header>

        <div className="serviceDetailAudience__panel">
          {service.who_is_it_for_content
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection({
  service,
  benefits,
}: {
  service: Service;
  benefits: ServiceBenefit[];
}) {
  if (
    !service.benefits_enabled ||
    benefits.length === 0
  ) {
    return null;
  }

  return (
    <section
      className="serviceDetailBenefits"
      aria-labelledby="service-benefits-heading"
    >
      <div className="serviceDetailBenefits__inner">
        <header className="serviceDetailSectionHeader">
          <span>Why choose this service</span>

          <h2 id="service-benefits-heading">
            {service.benefits_heading}
          </h2>
        </header>

        <div className="serviceDetailBenefits__grid">
          {benefits.map((benefit) => {
            const BenefitIcon =
              SERVICE_ICONS[
                benefit.icon_name
              ] ?? CheckCircle2;

            return (
              <article
                className="serviceDetailBenefitCard"
                key={benefit.id}
              >
                <div aria-hidden={true}>
                  <BenefitIcon size={24} />
                </div>

                <h3>{benefit.title}</h3>

                {benefit.description ? (
                  <p>
                    {benefit.description}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProcessSection({
  service,
  processSteps,
}: {
  service: Service;
  processSteps: ServiceProcessStep[];
}) {
  if (
    !service.process_enabled ||
    processSteps.length === 0
  ) {
    return null;
  }

  return (
    <section
      className="serviceDetailProcess"
      aria-labelledby="service-process-heading"
    >
      <div className="serviceDetailProcess__inner">
        <header className="serviceDetailSectionHeader">
          <span>What to expect</span>

          <h2 id="service-process-heading">
            {service.process_heading}
          </h2>
        </header>

        <ol className="serviceDetailProcess__list">
          {processSteps.map(
            (step, index) => {
              const StepIcon =
                SERVICE_ICONS[
                  step.icon_name
                ] ?? CircleDot;

              return (
                <li
                  className="serviceDetailProcessStep"
                  key={step.id}
                >
                  <div className="serviceDetailProcessStep__number">
                    {step.step_number ||
                      String(index + 1).padStart(
                        2,
                        "0",
                      )}
                  </div>

                  <div
                    className="serviceDetailProcessStep__icon"
                    aria-hidden={true}
                  >
                    <StepIcon size={22} />
                  </div>

                  <div className="serviceDetailProcessStep__content">
                    <h3>{step.title}</h3>

                    {step.description ? (
                      <p>
                        {step.description}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            },
          )}
        </ol>
      </div>
    </section>
  );
}

function GallerySection({
  service,
  galleryItems,
}: {
  service: Service;
  galleryItems: ServiceGalleryItem[];
}) {
  if (
    !service.gallery_enabled ||
    galleryItems.length === 0
  ) {
    return null;
  }

  return (
    <section
      className="serviceDetailGallery"
      aria-labelledby="service-gallery-heading"
    >
      <div className="serviceDetailGallery__inner">
        <header className="serviceDetailSectionHeader">
          <span>Project media</span>
          <h2 id="service-gallery-heading">
            Service Gallery
          </h2>
        </header>

        <div className="serviceDetailGallery__grid">
          {galleryItems.map((item) => (
            <figure
              className="serviceDetailGalleryItem"
              key={item.id}
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.image_alt}
                />
              ) : null}

              {item.caption ? (
                <figcaption>
                  {item.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCTA({
  service,
}: {
  service: Service;
}) {
  if (!service.cta_enabled) {
    return null;
  }

  return (
    <section
      className="serviceDetailCta"
      aria-labelledby="service-cta-heading"
    >
      <div className="serviceDetailCta__inner">
        <div>
          <span>Take the next step</span>

          <h2 id="service-cta-heading">
            {service.cta_heading}
          </h2>

          {service.cta_description ? (
            <p>
              {service.cta_description}
            </p>
          ) : null}
        </div>

        {service.cta_button_text &&
        service.cta_button_link ? (
          <Link
            href={service.cta_button_link}
            target={
              service
                .cta_button_open_in_new_tab
                ? "_blank"
                : undefined
            }
            rel={
              service
                .cta_button_open_in_new_tab
                ? "noreferrer"
                : undefined
            }
          >
            {service.cta_button_text}

            <ArrowRight
              size={17}
              aria-hidden={true}
            />
          </Link>
        ) : null}
      </div>
    </section>
  );
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;

  const {
    service,
    benefits,
    processSteps,
    galleryItems,
  } =
    await getPublishedServiceDetailData(
      slug,
    );

  if (!service) {
    notFound();
  }

  return (
    <main
      className="serviceDetailPage"
      style={getPageVariables()}
    >
      <ServiceDetailHero
        service={service}
      />

      <ServiceIntroduction
        service={service}
      />

      <WhoIsItFor
        service={service}
      />

      <BenefitsSection
        service={service}
        benefits={benefits}
      />

      <ProcessSection
        service={service}
        processSteps={processSteps}
      />

      <GallerySection
        service={service}
        galleryItems={galleryItems}
      />

      <ServiceCTA
        service={service}
      />

      <section className="serviceDetailBack">
        <Link href="/services">
          <ArrowLeft
            size={16}
            aria-hidden={true}
          />

          Explore All Services
        </Link>
      </section>
    </main>
  );
}
