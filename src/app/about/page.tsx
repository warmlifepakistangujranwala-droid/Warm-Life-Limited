/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/about/page.tsx
 *
 * Purpose :
 * Renders the public About Us page using published CMS content,
 * including the hero, company information, mission and vision,
 * department-filtered team and closing company statement.
 *
 * Version : v1.3.0
 * ============================================================
 */

import type {
  CSSProperties,
} from "react";

import type { Metadata } from "next";

import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  ClipboardCheck,
  Eye,
  Gauge,
  Headphones,
  Settings,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

import {
  getPublishedAboutPageData,
} from "@/lib/actions/about-page";

import type {
  AboutDepartment,
  AboutHeroSlide,
  AboutPageSettings,
  AboutTeamMemberWithDepartment,
} from "@/lib/types/about-page";

import AboutHeroSlider from "./AboutHeroSlider";

import AboutClosingStatement from "./AboutClosingStatement";

import "./about-page.css";
import "./about-closing.css";

type AboutPageProps = {
  searchParams: Promise<{
    department?: string;
  }>;
};

type CSSVariableProperties =
  CSSProperties &
  Record<`--${string}`, string | number>;

type IconComponent = LucideIcon;

const ICONS: Record<string, IconComponent> = {
  Target,
  Eye,
  Users,
  BriefcaseBusiness,
  ClipboardCheck,
  Gauge,
  Settings,
  Headphones,
};

function getIcon(
  iconName: string,
  fallback: IconComponent,
): IconComponent {
  return ICONS[iconName] ?? fallback;
}

function getPageVariables(
  settings: AboutPageSettings,
): CSSVariableProperties {
  return {
    "--about-content-max-width":
      `${settings.content_max_width ?? 1280}px`,

    "--about-section-padding-top":
      `${settings.section_padding_top ?? 88}px`,

    "--about-section-padding-bottom":
      `${settings.section_padding_bottom ?? 88}px`,

    "--about-mobile-breakpoint":
      `${settings.mobile_breakpoint ?? 900}px`,

    "--about-hero-min-height":
      `${settings.hero_min_height}px`,

    "--about-hero-content-width":
      `${settings.hero_content_max_width}px`,

    "--about-hero-padding-top":
      `${settings.hero_padding_top}px`,

    "--about-hero-padding-bottom":
      `${settings.hero_padding_bottom}px`,

    "--about-hero-padding-left":
      `${settings.hero_padding_left}px`,

    "--about-hero-padding-right":
      `${settings.hero_padding_right}px`,

    "--about-hero-background":
      settings.hero_background_color,

    "--about-hero-heading":
      settings.hero_heading_color,

    "--about-hero-description":
      settings.hero_description_color,

    "--about-hero-eyebrow":
      settings.hero_eyebrow_color,

    "--about-hero-button-text":
      settings.hero_button_text_color,

    "--about-hero-button-background":
      settings.hero_button_background_color,

    "--about-hero-button-border":
      settings.hero_button_border_color,

    "--about-hero-button-hover-text":
      settings.hero_button_hover_text_color,

    "--about-hero-button-hover-background":
      settings.hero_button_hover_background_color,

    "--about-hero-button-hover-border":
      settings.hero_button_hover_border_color,

    "--about-hero-button-radius":
      `${settings.hero_button_radius}px`,

    "--about-company-background":
      settings.company_background_color,

    "--about-company-heading":
      settings.company_heading_color,

    "--about-company-text":
      settings.company_text_color,

    "--about-company-width":
      `${settings.company_content_max_width}px`,

    "--about-company-padding-top":
      `${settings.company_padding_top}px`,

    "--about-company-padding-bottom":
      `${settings.company_padding_bottom}px`,

    "--about-company-gap":
      `${settings.company_content_gap}px`,

    "--about-company-image-radius":
      `${settings.company_image_radius}px`,

    "--about-company-image-height":
      `${settings.company_image_height}px`,

    "--about-company-image-position":
      settings.company_image_object_position,

    "--about-company-text-align":
      settings.company_text_alignment,

    "--about-company-eyebrow-color":
      settings.company_eyebrow_color,

    "--about-company-eyebrow-size":
      `${settings.company_eyebrow_size}px`,

    "--about-company-eyebrow-weight":
      settings.company_eyebrow_weight,

    "--about-company-eyebrow-spacing":
      `${settings.company_eyebrow_letter_spacing}px`,

    "--about-company-heading-size":
      `${settings.company_heading_size}px`,

    "--about-company-heading-weight":
      settings.company_heading_weight,

    "--about-company-heading-line-height":
      settings.company_heading_line_height,

    "--about-company-description-size":
      `${settings.company_description_size}px`,

    "--about-company-description-weight":
      settings.company_description_weight,

    "--about-company-description-line-height":
      settings.company_description_line_height,

    "--about-purpose-background":
      settings.mission_vision_background_color,

    "--about-purpose-card-background":
      settings.mission_vision_card_background_color,

    "--about-purpose-heading":
      settings.mission_vision_heading_color,

    "--about-purpose-text":
      settings.mission_vision_text_color,

    "--about-purpose-icon":
      settings.mission_vision_icon_color,

    "--about-purpose-radius":
      `${settings.mission_vision_card_radius}px`,

    "--about-purpose-gap":
      `${settings.mission_vision_card_gap}px`,

    "--about-purpose-eyebrow-color":
      settings.mission_vision_eyebrow_color,

    "--about-purpose-eyebrow-size":
      `${settings.mission_vision_eyebrow_size}px`,

    "--about-purpose-eyebrow-weight":
      settings.mission_vision_eyebrow_weight,

    "--about-purpose-heading-size":
      `${settings.mission_vision_section_heading_size}px`,

    "--about-purpose-heading-weight":
      settings.mission_vision_section_heading_weight,

    "--about-purpose-heading-line-height":
      settings.mission_vision_section_heading_line_height,

    "--about-purpose-description-size":
      `${settings.mission_vision_section_description_size}px`,

    "--about-purpose-description-weight":
      settings.mission_vision_section_description_weight,

    "--about-purpose-description-line-height":
      settings.mission_vision_section_description_line_height,

    "--about-purpose-card-title-size":
      `${settings.mission_vision_card_title_size}px`,

    "--about-purpose-card-title-weight":
      settings.mission_vision_card_title_weight,

    "--about-purpose-card-description-size":
      `${settings.mission_vision_card_description_size}px`,

    "--about-purpose-card-description-weight":
      settings.mission_vision_card_description_weight,

    "--about-purpose-card-description-line-height":
      settings.mission_vision_card_description_line_height,

    "--about-purpose-card-padding":
      `${settings.mission_vision_card_padding}px`,

    "--about-purpose-icon-size":
      `${settings.mission_vision_icon_size}px`,

    "--about-purpose-icon-background":
      settings.mission_vision_icon_background_color,

    "--about-purpose-icon-radius":
      `${settings.mission_vision_icon_radius}px`,

    "--about-purpose-width":
      `${settings.mission_vision_content_max_width}px`,

    "--about-purpose-padding-top":
      `${settings.mission_vision_padding_top}px`,

    "--about-purpose-padding-bottom":
      `${settings.mission_vision_padding_bottom}px`,

    "--about-purpose-text-align":
      settings.mission_vision_text_alignment,

    "--about-team-background":
      settings.team_background_color,

    "--about-team-heading":
      settings.team_heading_color,

    "--about-team-text":
      settings.team_text_color,

    "--about-team-card-background":
      settings.team_card_background_color,

    "--about-team-card-heading":
      settings.team_card_heading_color,

    "--about-team-card-text":
      settings.team_card_text_color,

    "--about-team-card-radius":
      `${settings.team_card_radius}px`,

    "--about-team-card-gap":
      `${settings.team_card_gap}px`,

    "--about-team-image-radius":
      `${settings.team_image_radius}px`,

    "--about-team-image-ratio":
      settings.team_image_aspect_ratio,

    "--about-team-width":
      `${settings.team_content_max_width}px`,

    "--about-team-padding-top":
      `${settings.team_padding_top}px`,

    "--about-team-padding-bottom":
      `${settings.team_padding_bottom}px`,

    "--about-closing-background":
      settings.closing_background_color,

    "--about-closing-text":
      settings.closing_text_color,

    "--about-closing-width":
      `${settings.closing_content_max_width}px`,

    "--about-closing-padding-top":
      `${settings.closing_padding_top}px`,

    "--about-closing-padding-bottom":
      `${settings.closing_padding_bottom}px`,
  };
}

function getSlideVariables(
  slide: AboutHeroSlide,
  settings: AboutPageSettings,
): CSSVariableProperties {
  return {
    "--about-slide-overlay":
      slide.overlay_color ||
      settings.hero_overlay_color,

    "--about-slide-overlay-opacity":
      String(
        (slide.overlay_opacity ??
          settings.hero_overlay_opacity) / 100,
      ),
  };
}

function HeroMedia({
  slide,
  settings,
}: {
  slide: AboutHeroSlide;
  settings: AboutPageSettings;
}) {
  if (
    slide.media_type === "video" &&
    slide.video_url
  ) {
    return (
      <video
        className="aboutHero__media"
        autoPlay={settings.hero_autoplay}
        muted={settings.hero_muted}
        loop={settings.hero_loop}
        playsInline
        poster={
          slide.poster_image_url ??
          undefined
        }
      >
        <source src={slide.video_url} />
      </video>
    );
  }

  if (slide.image_url) {
    return (
      <picture>
        {slide.mobile_image_url ? (
          <source
            media="(max-width: 700px)"
            srcSet={slide.mobile_image_url}
          />
        ) : null}

        <img
          className="aboutHero__media"
          src={slide.image_url}
          alt={slide.image_alt}
        />
      </picture>
    );
  }

  return (
    <div
      className="aboutHero__media aboutHero__media--fallback"
      aria-hidden={true}
    />
  );
}

function HeroContent({
  settings,
  slide,
}: {
  settings: AboutPageSettings;
  slide?: AboutHeroSlide;
}) {
  const eyebrow =
    slide?.eyebrow ||
    settings.hero_eyebrow;

  const heading =
    slide?.heading ||
    settings.hero_heading;

  const description =
    slide?.description ||
    settings.hero_description;

  const showButton =
    slide
      ? slide.show_button
      : settings.hero_show_button;

  const buttonText =
    slide?.button_text ||
    settings.hero_button_text;

  const buttonLink =
    slide?.button_link ||
    settings.hero_button_link;

  const openInNewTab =
    slide
      ? slide.button_open_in_new_tab
      : settings.hero_button_open_in_new_tab;

  return (
    <div className="aboutHero__content">
      {settings.hero_show_breadcrumb ? (
        <div className="aboutHero__breadcrumb">
          <Link href="/">
            {
              settings
                .hero_breadcrumb_home_text
            }
          </Link>

          <span aria-hidden={true}>/</span>

          <strong>
            {
              settings
                .hero_breadcrumb_current_text
            }
          </strong>
        </div>
      ) : null}

      {eyebrow ? (
        <span className="aboutHero__eyebrow">
          {eyebrow}
        </span>
      ) : null}

      <h1>{heading}</h1>

      {description ? (
        <p>{description}</p>
      ) : null}

      {showButton &&
      buttonText &&
      buttonLink ? (
        <Link
          href={buttonLink}
          className="aboutHero__button"
          target={
            openInNewTab
              ? "_blank"
              : undefined
          }
          rel={
            openInNewTab
              ? "noreferrer"
              : undefined
          }
        >
          {buttonText}
          <ArrowRight
            size={17}
            aria-hidden={true}
          />
        </Link>
      ) : null}
    </div>
  );
}

function AboutHero({
  settings,
  slides,
}: {
  settings: AboutPageSettings;
  slides: AboutHeroSlide[];
}) {
  const availableSlides =
    slides.filter(
      (slide) =>
        slide.is_active &&
        slide.is_published,
    );

  const primarySlide =
    availableSlides[0];

  if (
    settings.hero_type === "slider" &&
    availableSlides.length > 0
  ) {
    return (
      <AboutHeroSlider
        settings={settings}
        slides={availableSlides}
      />
    );
  }

  return (
    <section
      className={[
        "aboutHero",
        "aboutHero--single",
        `aboutHero--horizontal-${settings.hero_content_alignment}`,
        `aboutHero--vertical-${settings.hero_vertical_alignment}`,
      ].join(" ")}
      style={
        primarySlide
          ? getSlideVariables(
              primarySlide,
              settings,
            )
          : undefined
      }
    >
      {primarySlide ? (
        <HeroMedia
          slide={primarySlide}
          settings={settings}
        />
      ) : (
        <div
          className="aboutHero__media aboutHero__media--fallback"
          aria-hidden={true}
        />
      )}

      <div
        className="aboutHero__overlay"
        aria-hidden={true}
      />

      <HeroContent
        settings={settings}
        slide={primarySlide}
      />

      {settings.hero_show_scroll_indicator ? (
        <a
          href="#company-information"
          className="aboutHero__scroll"
        >
          <span>
            {
              settings
                .hero_scroll_indicator_text
            }
          </span>

          <ArrowDown
            size={16}
            aria-hidden={true}
          />
        </a>
      ) : null}
    </section>
  );
}

function CompanySection({
  settings,
}: {
  settings: AboutPageSettings;
}) {
  if (!settings.company_section_enabled) {
    return null;
  }

  return (
    <section
      id="company-information"
      className={[
        "aboutCompany",
        `aboutCompany--image-${settings.company_image_position}`,
      ].join(" ")}
    >
      <div className="aboutCompany__inner">
        <div className="aboutCompany__content">
          {settings.company_eyebrow ? (
            <span className="aboutSectionEyebrow">
              {settings.company_eyebrow}
            </span>
          ) : null}

          <h2>
            {settings.company_heading}
          </h2>

          <div className="aboutCompany__description">
            {settings.company_description
              .split(/\n+/)
              .filter(Boolean)
              .map((paragraph) => (
                <p key={paragraph}>
                  {paragraph}
                </p>
              ))}
          </div>
        </div>

        {settings.company_image_url ? (
          <div className="aboutCompany__media">
            <img
              src={
                settings.company_image_url
              }
              alt={
                settings.company_image_alt
              }
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function MissionVisionSection({
  settings,
}: {
  settings: AboutPageSettings;
}) {
  if (!settings.mission_vision_enabled) {
    return null;
  }

  const MissionIcon = getIcon(
    settings.mission_icon_name,
    Target,
  );

  const VisionIcon = getIcon(
    settings.vision_icon_name,
    Eye,
  );

  return (
    <section id="mission-vision" className="aboutPurpose">
      <div className="aboutPurpose__inner">
        <header className="aboutSectionHeader">
          {settings.mission_vision_eyebrow ? (
            <span className="aboutSectionEyebrow">
              {
                settings
                  .mission_vision_eyebrow
              }
            </span>
          ) : null}

          <h2>
            {
              settings
                .mission_vision_heading
            }
          </h2>

          {settings
            .mission_vision_description ? (
            <p>
              {
                settings
                  .mission_vision_description
              }
            </p>
          ) : null}
        </header>

        <div className="aboutPurpose__grid">
          <article
            className="aboutPurposeCard"
            tabIndex={0}
            aria-label={settings.mission_title}
          >
            <div className="aboutPurposeCard__icon">
              <MissionIcon
                size={
                  settings
                    .mission_vision_icon_size
                }
                strokeWidth={1.8}
                aria-hidden={true}
              />
            </div>

            <h3>
              {settings.mission_title}
            </h3>

            <p>
              {
                settings
                  .mission_description
              }
            </p>
          </article>

          <article
            className="aboutPurposeCard"
            tabIndex={0}
            aria-label={settings.vision_title}
          >
            <div className="aboutPurposeCard__icon">
              <VisionIcon
                size={
                  settings
                    .mission_vision_icon_size
                }
                strokeWidth={1.8}
                aria-hidden={true}
              />
            </div>

            <h3>
              {settings.vision_title}
            </h3>

            <p>
              {
                settings
                  .vision_description
              }
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function DepartmentTabs({
  departments,
  selectedDepartment,
}: {
  departments: AboutDepartment[];
  selectedDepartment?: string;
}) {
  return (
    <nav
      className="aboutTeam__tabs"
      aria-label="Team departments"
    >
      <Link
        href="/about#our-team"
        className={
          !selectedDepartment
            ? "isActive"
            : undefined
        }
      >
        All
      </Link>

      {departments.map(
        (department) => {
          const Icon = getIcon(
            department.icon_name,
            Users,
          );

          return (
            <Link
              key={department.id}
              href={`/about?department=${encodeURIComponent(
                department.slug,
              )}#our-team`}
              className={
                selectedDepartment ===
                department.slug
                  ? "isActive"
                  : undefined
              }
            >
              <Icon
                size={15}
                strokeWidth={1.8}
                aria-hidden={true}
              />

              {department.name}
            </Link>
          );
        },
      )}
    </nav>
  );
}

function TeamMemberCard({
  member,
  settings,
}: {
  member: AboutTeamMemberWithDepartment;
  settings: AboutPageSettings;
}) {
  return (
    <article
      className={[
        "aboutTeamCard",
        `aboutTeamCard--${settings.team_card_style}`,
      ].join(" ")}
    >
      {member.image_url ? (
        <div className="aboutTeamCard__media">
          <img
            src={member.image_url}
            alt={member.image_alt}
          />
        </div>
      ) : (
        <div
          className="aboutTeamCard__media aboutTeamCard__media--placeholder"
          aria-hidden={true}
        >
          <Users size={34} />
        </div>
      )}

      <div className="aboutTeamCard__content">
        {member.department ? (
          <span className="aboutTeamCard__department">
            {member.department.name}
          </span>
        ) : null}

        <h3>{member.full_name}</h3>

        <strong>
          {member.job_title}
        </strong>

        {settings.team_show_member_bio &&
        member.short_bio ? (
          <p>{member.short_bio}</p>
        ) : null}

        {settings
          .team_show_member_qualifications &&
        member.qualifications ? (
          <div className="aboutTeamCard__detail">
            {member.qualifications}
          </div>
        ) : null}

        <div className="aboutTeamCard__links">
          {settings.team_show_member_email &&
          member.email ? (
            <a
              href={`mailto:${member.email}`}
            >
              Email
            </a>
          ) : null}

          {settings
            .team_show_member_linkedin &&
          member.linkedin_url ? (
            <a
              href={member.linkedin_url}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function TeamSection({
  settings,
  departments,
  teamMembers,
  selectedDepartment,
}: {
  settings: AboutPageSettings;
  departments: AboutDepartment[];
  teamMembers: AboutTeamMemberWithDepartment[];
  selectedDepartment?: string;
}) {
  if (!settings.team_section_enabled) {
    return null;
  }

  const filteredMembers =
    selectedDepartment
      ? teamMembers.filter(
          (member) =>
            member.department?.slug ===
            selectedDepartment,
        )
      : teamMembers;

  return (
    <section
      id="our-team"
      className="aboutTeam"
    >
      <div className="aboutTeam__inner">
        <header className="aboutSectionHeader">
          {settings.team_eyebrow ? (
            <span className="aboutSectionEyebrow">
              {settings.team_eyebrow}
            </span>
          ) : null}

          <h2>
            {settings.team_heading}
          </h2>

          {settings.team_description ? (
            <p>
              {settings.team_description}
            </p>
          ) : null}
        </header>

        {settings
          .team_show_department_tabs &&
        departments.length > 0 ? (
          <DepartmentTabs
            departments={departments}
            selectedDepartment={
              selectedDepartment
            }
          />
        ) : null}

        {filteredMembers.length > 0 ? (
          <div className="aboutTeam__grid">
            {filteredMembers.map(
              (member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  settings={settings}
                />
              ),
            )}
          </div>
        ) : (
          <div className="aboutTeam__empty">
            <Users
              size={28}
              aria-hidden={true}
            />

            <p>
              No published team members are
              currently available in this
              department.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function ClosingSection({
  settings,
}: {
  settings: AboutPageSettings;
}) {
  if (!settings.closing_section_enabled) {
    return null;
  }

  return (
    <AboutClosingStatement
      text={settings.closing_text}
      backgroundColor={
        settings.closing_background_color
      }
      textColor={
        settings.closing_text_color
      }
      contentMaxWidth={
        settings.closing_content_max_width
      }
      paddingTop={
        settings.closing_padding_top
      }
      paddingBottom={
        settings.closing_padding_bottom
      }
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { settings } =
    await getPublishedAboutPageData();

  if (!settings) {
    return {
      title: "About Warm Life",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const openGraphImages =
    settings.og_image_url
      ? [
          {
            url: settings.og_image_url,
            alt: settings.og_image_alt,
          },
        ]
      : undefined;

  return {
    title: settings.seo_title,
    description:
      settings.seo_description,

    alternates: {
      canonical:
        settings.canonical_url ??
        "/about",
    },

    openGraph: {
      type: "website",
      title: settings.og_title,
      description:
        settings.og_description,
      url:
        settings.canonical_url ??
        "/about",
      images: openGraphImages,
    },
  };
}

export default async function AboutPage({
  searchParams,
}: AboutPageProps) {
  const [
    { settings, heroSlides, departments, teamMembers },
    resolvedSearchParams,
  ] = await Promise.all([
    getPublishedAboutPageData(),
    searchParams,
  ]);

  if (!settings) {
    return null;
  }

  const selectedDepartment =
    resolvedSearchParams.department;

  const publishedDepartments =
    departments.filter(
      (department) =>
        department.is_active &&
        department.is_published,
    );

  const publishedTeamMembers =
    teamMembers.filter(
      (member) =>
        member.is_active &&
        member.is_published,
    );

  return (
    <main
      className="aboutPage"
      style={getPageVariables(settings)}
    >
      <AboutHero
        settings={settings}
        slides={heroSlides}
      />

      <CompanySection
        settings={settings}
      />

      <MissionVisionSection
        settings={settings}
      />

      <TeamSection
        settings={settings}
        departments={
          publishedDepartments
        }
        teamMembers={
          publishedTeamMembers
        }
        selectedDepartment={
          selectedDepartment
        }
      />

      <ClosingSection
        settings={settings}
      />
    </main>
  );
}