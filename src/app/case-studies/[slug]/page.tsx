/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/case-studies/[slug]/page.tsx
 *
 * Purpose :
 * Renders a dynamic public Case Study detail page.
 *
 * Version : v0.1.0
 * ============================================================
 */

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  BadgePoundSterling,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Clock3,
  House,
  MapPin,
  Sun,
  Zap,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import type {
  CSSProperties,
  ComponentType,
} from "react";

import {
  getPublishedCaseStudyDetailData,
} from "@/lib/actions/case-studies";

import type {
  CaseStudy,
  CaseStudyFact,
  CaseStudyGalleryItem,
  CaseStudyRelatedServiceWithService,
  CaseStudyTimelineItem,
} from "@/lib/types/case-studies";

import "./case-study-detail.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CaseStudyDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type CSSVariableProperties =
  CSSProperties &
  Record<`--${string}`, string | number>;

const CASE_STUDY_ICONS: Record<
  string,
  ComponentType<{
    size?: number;
    "aria-hidden"?: boolean;
  }>
> = {
  CircleDot,
  MapPin,
  CalendarDays,
  Clock3,
  House,
  Sun,
  Zap,
  BadgePoundSterling,
  CheckCircle2,
};

function getPageVariables(
  caseStudy: CaseStudy,
): CSSVariableProperties {
  return {
    "--case-study-accent":
      "#f1d313",
    "--case-study-primary":
      "#163d2a",
    "--case-study-secondary":
      "#315f45",
    "--case-study-surface":
      "#f5f7f3",
    "--case-study-text":
      "#627067",

    "--case-study-hero-heading-size":
      `${caseStudy.hero_heading_size || 80}px`,

    "--case-study-hero-heading-size-mobile":
      `${caseStudy.hero_heading_size_mobile || 44}px`,

    "--case-study-section-heading-size":
      `${caseStudy.section_heading_size || 50}px`,

    "--case-study-section-heading-size-mobile":
      `${caseStudy.section_heading_size_mobile || 34}px`,

    "--case-study-card-heading-size":
      `${caseStudy.card_heading_size || 24}px`,

    "--case-study-cta-heading-size":
      `${caseStudy.cta_heading_size || 52}px`,
  };
}

function renderRichText(
  content: string,
) {
  return content
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={index}>
        {paragraph}
      </p>
    ));
}

function CaseStudyHero({
  caseStudy,
}: {
  caseStudy: CaseStudy;
}) {
  const heading =
    caseStudy.detail_hero_heading ||
    caseStudy.title;

  const description =
    caseStudy.detail_hero_description ||
    caseStudy.short_description;

  return (
    <section
      className="caseStudyDetailHero"
      aria-labelledby="case-study-detail-heading"
    >
      {caseStudy.detail_hero_type === "video" &&
      caseStudy.detail_hero_video_url ? (
        <video
          className="caseStudyDetailHero__media"
          autoPlay
          muted
          loop
          playsInline
          poster={
            caseStudy.detail_hero_poster_url ??
            undefined
          }
        >
          <source
            src={
              caseStudy.detail_hero_video_url
            }
          />
        </video>
      ) : caseStudy.detail_hero_image_url ? (
        <img
          className="caseStudyDetailHero__media"
          src={
            caseStudy.detail_hero_image_url
          }
          alt={
            caseStudy.detail_hero_image_alt ||
            heading
          }
        />
      ) : caseStudy.featured_image_url ? (
        <img
          className="caseStudyDetailHero__media"
          src={
            caseStudy.featured_image_url
          }
          alt={
            caseStudy.featured_image_alt ||
            heading
          }
        />
      ) : (
        <div
          className="caseStudyDetailHero__fallback"
          aria-hidden={true}
        />
      )}

      <div
        className="caseStudyDetailHero__overlay"
        aria-hidden={true}
      />

      <div className="caseStudyDetailHero__inner">
        <nav
          className="caseStudyDetailHero__breadcrumb"
          aria-label="Breadcrumb"
        >
          <Link href="/">
            Home
          </Link>

          <span aria-hidden={true}>
            /
          </span>

          <Link href="/case-studies">
            Case Studies
          </Link>

          <span aria-hidden={true}>
            /
          </span>

          <strong>
            {caseStudy.title}
          </strong>
        </nav>

        {caseStudy.detail_hero_eyebrow ||
        caseStudy.eyebrow ? (
          <span className="caseStudyDetailHero__eyebrow">
            {caseStudy.detail_hero_eyebrow ||
              caseStudy.eyebrow}
          </span>
        ) : null}

        <h1 id="case-study-detail-heading">
          {heading}
        </h1>

        {description ? (
          <p>
            {description}
          </p>
        ) : null}

        <div className="caseStudyDetailHero__meta">
          {caseStudy.location ? (
            <span>
              <MapPin
                size={15}
                aria-hidden={true}
              />
              {caseStudy.location}
            </span>
          ) : null}

          {caseStudy.project_duration ? (
            <span>
              <Clock3
                size={15}
                aria-hidden={true}
              />
              {caseStudy.project_duration}
            </span>
          ) : null}

          {caseStudy.completion_date ? (
            <span>
              <CalendarDays
                size={15}
                aria-hidden={true}
              />
              {new Intl.DateTimeFormat(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                },
              ).format(
                new Date(
                  caseStudy.completion_date,
                ),
              )}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function FactsSection({
  caseStudy,
  facts,
}: {
  caseStudy: CaseStudy;
  facts: CaseStudyFact[];
}) {
  if (
    !caseStudy.facts_enabled ||
    facts.length === 0
  ) {
    return null;
  }

  return (
    <section
      className="caseStudyFacts"
      aria-labelledby="case-study-facts-heading"
    >
      <div className="caseStudyFacts__inner">
        <header className="caseStudySectionHeader">
          <span>
            Project information
          </span>

          <h2 id="case-study-facts-heading">
            {caseStudy.facts_heading}
          </h2>
        </header>

        <div className="caseStudyFacts__grid">
          {facts.map((fact) => {
            const FactIcon =
              CASE_STUDY_ICONS[
                fact.icon_name
              ] ?? CircleDot;

            return (
              <article
                className="caseStudyFactCard"
                key={fact.id}
              >
                <div aria-hidden={true}>
                  <FactIcon size={23} />
                </div>

                <span>
                  {fact.label}
                </span>

                <strong>
                  {fact.value}
                </strong>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContentSection({
  eyebrow,
  heading,
  content,
  className,
}: {
  eyebrow: string;
  heading: string;
  content: string;
  className: string;
}) {
  if (!content) {
    return null;
  }

  return (
    <section className={className}>
      <div className="caseStudyContentSection__inner">
        <header className="caseStudySectionHeader">
          <span>
            {eyebrow}
          </span>

          <h2>
            {heading}
          </h2>
        </header>

        <div className="caseStudyRichText">
          {renderRichText(
            content,
          )}
        </div>
      </div>
    </section>
  );
}

function TimelineSection({
  caseStudy,
  timeline,
}: {
  caseStudy: CaseStudy;
  timeline: CaseStudyTimelineItem[];
}) {
  if (
    !caseStudy.timeline_enabled ||
    timeline.length === 0
  ) {
    return null;
  }

  return (
    <section
      className="caseStudyTimeline"
      aria-labelledby="case-study-timeline-heading"
    >
      <div className="caseStudyTimeline__inner">
        <header className="caseStudySectionHeader">
          <span>
            Project journey
          </span>

          <h2 id="case-study-timeline-heading">
            {caseStudy.timeline_heading}
          </h2>
        </header>

        <ol className="caseStudyTimeline__list">
          {timeline.map(
            (item, index) => {
              const ItemIcon =
                CASE_STUDY_ICONS[
                  item.icon_name
                ] ?? CircleDot;

              return (
                <li
                  className="caseStudyTimelineItem"
                  key={item.id}
                >
                  <div className="caseStudyTimelineItem__number">
                    {item.step_number ||
                      String(index + 1).padStart(
                        2,
                        "0",
                      )}
                  </div>

                  <div className="caseStudyTimelineItem__icon">
                    <ItemIcon
                      size={21}
                      aria-hidden={true}
                    />
                  </div>

                  <div className="caseStudyTimelineItem__content">
                    {item.date_label ? (
                      <span>
                        {item.date_label}
                      </span>
                    ) : null}

                    <h3>
                      {item.title}
                    </h3>

                    {item.description ? (
                      <p>
                        {item.description}
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

function BeforeAfterSection({
  galleryItems,
}: {
  galleryItems: CaseStudyGalleryItem[];
}) {
  const beforeItems =
    galleryItems.filter(
      (item) =>
        item.image_type === "before",
    );

  const afterItems =
    galleryItems.filter(
      (item) =>
        item.image_type === "after",
    );

  const pairs =
    beforeItems
      .map((before) => ({
        key:
          before.pair_key,
        before,
        after:
          afterItems.find(
            (item) =>
              item.pair_key ===
              before.pair_key,
          ) ?? null,
      }))
      .filter(
        (pair) =>
          pair.key &&
          pair.after,
      );

  if (pairs.length === 0) {
    return null;
  }

  return (
    <section className="caseStudyBeforeAfter">
      <div className="caseStudyBeforeAfter__inner">
        <header className="caseStudySectionHeader">
          <span>
            Transformation
          </span>

          <h2>
            Before & After
          </h2>
        </header>

        <div className="caseStudyBeforeAfter__grid">
          {pairs.map((pair) => (
            <article
              className="caseStudyBeforeAfterPair"
              key={pair.key}
            >
              <figure>
                <span>
                  Before
                </span>

                {pair.before.image_url ? (
                  <img
                    src={
                      pair.before.image_url
                    }
                    alt={
                      pair.before.image_alt
                    }
                  />
                ) : null}

                {pair.before.caption ? (
                  <figcaption>
                    {pair.before.caption}
                  </figcaption>
                ) : null}
              </figure>

              <figure>
                <span>
                  After
                </span>

                {pair.after?.image_url ? (
                  <img
                    src={
                      pair.after.image_url
                    }
                    alt={
                      pair.after.image_alt
                    }
                  />
                ) : null}

                {pair.after?.caption ? (
                  <figcaption>
                    {pair.after.caption}
                  </figcaption>
                ) : null}
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({
  caseStudy,
  galleryItems,
}: {
  caseStudy: CaseStudy;
  galleryItems: CaseStudyGalleryItem[];
}) {
  const standardItems =
    galleryItems.filter(
      (item) =>
        item.image_type === "standard",
    );

  if (
    !caseStudy.gallery_enabled ||
    standardItems.length === 0
  ) {
    return null;
  }

  return (
    <section
      className="caseStudyGallery"
      aria-labelledby="case-study-gallery-heading"
    >
      <div className="caseStudyGallery__inner">
        <header className="caseStudySectionHeader">
          <span>
            Project media
          </span>

          <h2 id="case-study-gallery-heading">
            {caseStudy.gallery_heading}
          </h2>
        </header>

        <div className="caseStudyGallery__grid">
          {standardItems.map(
            (item) => (
              <figure
                className="caseStudyGalleryItem"
                key={item.id}
              >
                {item.image_url ? (
                  <img
                    src={
                      item.image_url
                    }
                    alt={
                      item.image_alt
                    }
                  />
                ) : null}

                {item.caption ? (
                  <figcaption>
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function RelatedServicesSection({
  caseStudy,
  relatedServices,
}: {
  caseStudy: CaseStudy;
  relatedServices:
    CaseStudyRelatedServiceWithService[];
}) {
  const visibleServices =
    relatedServices.filter(
      (item) =>
        item.service,
    );

  if (
    !caseStudy.related_services_enabled ||
    visibleServices.length === 0
  ) {
    return null;
  }

  return (
    <section
      className="caseStudyRelatedServices"
      aria-labelledby="case-study-related-services-heading"
    >
      <div className="caseStudyRelatedServices__inner">
        <header className="caseStudySectionHeader">
          <span>
            Explore more
          </span>

          <h2 id="case-study-related-services-heading">
            {caseStudy.related_services_heading}
          </h2>
        </header>

        <div className="caseStudyRelatedServices__grid">
          {visibleServices.map(
            (item) => {
              const service =
                item.service;

              if (!service) {
                return null;
              }

              return (
                <article
                  className="caseStudyRelatedServiceCard"
                  key={item.id}
                >
                  {service.featured_image_url ? (
                    <img
                      src={
                        service.featured_image_url
                      }
                      alt={
                        service.featured_image_alt ||
                        service.service_name
                      }
                    />
                  ) : null}

                  <div>
                    <h3>
                      {service.service_name}
                    </h3>

                    {service.short_description ? (
                      <p>
                        {service.short_description}
                      </p>
                    ) : null}

                    <Link
                      href={`/services/${service.slug}`}
                    >
                      {service.explore_button_text ||
                        "Explore Service"}

                      <ArrowRight
                        size={16}
                        aria-hidden={true}
                      />
                    </Link>
                  </div>
                </article>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}

function CaseStudyCTA({
  caseStudy,
}: {
  caseStudy: CaseStudy;
}) {
  if (!caseStudy.cta_enabled) {
    return null;
  }

  return (
    <section
      className="caseStudyDetailCta"
      aria-labelledby="case-study-cta-heading"
    >
      <div className="caseStudyDetailCta__inner">
        <div>
          <span>
            Take the next step
          </span>

          <h2 id="case-study-cta-heading">
            {caseStudy.cta_heading}
          </h2>

          {caseStudy.cta_description ? (
            <p>
              {caseStudy.cta_description}
            </p>
          ) : null}
        </div>

        {caseStudy.cta_button_text &&
        caseStudy.cta_button_link ? (
          <Link
            href={
              caseStudy.cta_button_link
            }
            target={
              caseStudy
                .cta_button_open_in_new_tab
                ? "_blank"
                : undefined
            }
            rel={
              caseStudy
                .cta_button_open_in_new_tab
                ? "noreferrer"
                : undefined
            }
          >
            {caseStudy.cta_button_text}

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

export default async function CaseStudyDetailPage({
  params,
}: CaseStudyDetailPageProps) {
  const { slug } = await params;

  const {
    caseStudy,
    facts,
    timeline,
    galleryItems,
    relatedServices,
  } =
    await getPublishedCaseStudyDetailData(
      slug,
    );

  if (!caseStudy) {
    notFound();
  }

  return (
    <main
      className="caseStudyDetailPage"
      style={
        getPageVariables(
          caseStudy,
        )
      }
    >
      <CaseStudyHero
        caseStudy={
          caseStudy
        }
      />

      <FactsSection
        caseStudy={
          caseStudy
        }
        facts={facts}
      />

      {caseStudy.overview_enabled ? (
        <ContentSection
          eyebrow="Project summary"
          heading={
            caseStudy.overview_heading
          }
          content={
            caseStudy.overview_content
          }
          className="caseStudyContentSection caseStudyOverview"
        />
      ) : null}

      {caseStudy.challenge_enabled ? (
        <ContentSection
          eyebrow="What needed solving"
          heading={
            caseStudy.challenge_heading
          }
          content={
            caseStudy.challenge_content
          }
          className="caseStudyContentSection caseStudyChallenge"
        />
      ) : null}

      {caseStudy.solution_enabled ? (
        <ContentSection
          eyebrow="Our approach"
          heading={
            caseStudy.solution_heading
          }
          content={
            caseStudy.solution_content
          }
          className="caseStudyContentSection caseStudySolution"
        />
      ) : null}

      {caseStudy.work_completed_enabled ? (
        <ContentSection
          eyebrow="Delivery"
          heading={
            caseStudy.work_completed_heading
          }
          content={
            caseStudy.work_completed_content
          }
          className="caseStudyContentSection caseStudyWorkCompleted"
        />
      ) : null}

      {caseStudy.results_enabled ? (
        <ContentSection
          eyebrow="Project impact"
          heading={
            caseStudy.results_heading
          }
          content={
            caseStudy.results_content
          }
          className="caseStudyContentSection caseStudyResults"
        />
      ) : null}

      <TimelineSection
        caseStudy={
          caseStudy
        }
        timeline={
          timeline
        }
      />

      <BeforeAfterSection
        galleryItems={
          galleryItems
        }
      />

      <GallerySection
        caseStudy={
          caseStudy
        }
        galleryItems={
          galleryItems
        }
      />

      <RelatedServicesSection
        caseStudy={
          caseStudy
        }
        relatedServices={
          relatedServices
        }
      />

      <CaseStudyCTA
        caseStudy={
          caseStudy
        }
      />

      <section className="caseStudyDetailBack">
        <Link href="/case-studies">
          <ArrowLeft
            size={16}
            aria-hidden={true}
          />

          Explore All Case Studies
        </Link>
      </section>
    </main>
  );
}
