import Link from "next/link";

import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  Star,
} from "lucide-react";

import type {
  CSSProperties,
} from "react";

import {
  getPublishedCaseStudies,
} from "@/lib/actions/case-studies";

import {
  getCaseStudiesPageSettings,
} from "@/lib/actions/case-studies-page";

import "./case-studies.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type HeroStyle =
  CSSProperties &
  Record<`--${string}`, string | number>;

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(value),
  );
}

export default async function CaseStudiesPage() {
  const [
    caseStudies,
    pageSettings,
  ] = await Promise.all([
    getPublishedCaseStudies(),
    getCaseStudiesPageSettings(),
  ]);

  const featured =
    caseStudies.filter(
      (item) => item.is_featured,
    );

  const regular =
    caseStudies.filter(
      (item) => !item.is_featured,
    );

  const orderedCaseStudies = [
    ...featured,
    ...regular,
  ];

  const heroStyle: HeroStyle = {
    "--case-studies-hero-height":
      `${pageSettings?.hero_height ?? 520}px`,

    "--case-studies-hero-heading-size":
      `${pageSettings?.hero_heading_size ?? 92}px`,

    "--case-studies-hero-heading-size-mobile":
      `${pageSettings?.hero_heading_size_mobile ?? 50}px`,

    "--case-studies-hero-overlay":
      pageSettings?.hero_overlay_opacity ??
      0.72,

    backgroundImage:
      pageSettings?.hero_image_url
        ? `url("${pageSettings.hero_image_url}")`
        : undefined,
  };

  return (
    <main className="caseStudiesPage">
      <section
        className="caseStudiesHero"
        style={heroStyle}
      >
        <div className="caseStudiesHero__inner">
          <div className="caseStudiesHero__content">
            <span>
              {pageSettings?.hero_eyebrow ||
                "Warm Life Projects"}
            </span>

            <h1>
              {pageSettings?.hero_heading ||
                "Real Projects. Real Results."}
            </h1>

            <p>
              {pageSettings?.hero_description ||
                "Explore completed projects delivered by Warm Life."}
            </p>
          </div>
        </div>
      </section>

      <section
        className="caseStudiesListing"
        aria-labelledby="case-studies-heading"
      >
        <div className="caseStudiesListing__inner">
          <header className="caseStudiesListing__header">
            <div>
              <span>
                Completed work
              </span>

              <h2 id="case-studies-heading">
                Our Case Studies
              </h2>
            </div>

            <p>
              Each project shows the challenge,
              solution, completed work and results achieved.
            </p>
          </header>

          {orderedCaseStudies.length === 0 ? (
            <div className="caseStudiesListing__empty">
              <div>
                <BriefcaseBusiness size={34} />
              </div>

              <h3>
                Case studies coming soon
              </h3>

              <p>
                We are preparing detailed project stories.
              </p>
            </div>
          ) : (
            <div className="caseStudiesGrid">
              {orderedCaseStudies.map(
                (caseStudy) => (
                  <article
                    className="caseStudyCard"
                    key={caseStudy.id}
                  >
                    <div className="caseStudyCard__media">
                      {caseStudy.featured_image_url ? (
                        <img
                          src={
                            caseStudy.featured_image_url
                          }
                          alt={
                            caseStudy.featured_image_alt ||
                            caseStudy.title
                          }
                        />
                      ) : (
                        <div className="caseStudyCard__fallback">
                          <BriefcaseBusiness size={32} />
                        </div>
                      )}

                      {caseStudy.is_featured ? (
                        <span className="caseStudyCard__featured">
                          <Star size={13} />
                          Featured
                        </span>
                      ) : null}
                    </div>

                    <div className="caseStudyCard__body">
                      {caseStudy.eyebrow ? (
                        <span className="caseStudyCard__eyebrow">
                          {caseStudy.eyebrow}
                        </span>
                      ) : null}

                      <h3>
                        {caseStudy.title}
                      </h3>

                      {caseStudy.short_description ? (
                        <p>
                          {caseStudy.short_description}
                        </p>
                      ) : null}

                      <div className="caseStudyCard__meta">
                        {caseStudy.location ? (
                          <span>
                            <MapPin size={14} />
                            {caseStudy.location}
                          </span>
                        ) : null}

                        {caseStudy.completion_date ? (
                          <span>
                            <CalendarDays size={14} />
                            {formatDate(
                              caseStudy.completion_date,
                            )}
                          </span>
                        ) : null}
                      </div>

                      {caseStudy.show_view_button &&
                      caseStudy.has_detail_page ? (
                        <Link
                          href={`/case-studies/${caseStudy.slug}`}
                        >
                          {caseStudy.view_button_text ||
                            "View Case Study"}

                          <ArrowRight size={16} />
                        </Link>
                      ) : null}
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
