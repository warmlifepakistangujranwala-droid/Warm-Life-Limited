/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/services/ServicesHero.tsx
 *
 * Purpose :
 * Renders the functional Services page image, video or slider
 * hero from CMS settings.
 *
 * Version : v1.0.0
 * ============================================================
 */

"use client";

import Link from "next/link";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import {
  type CSSProperties,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  ServiceHeroSlide,
  ServicesPageSettings,
} from "@/lib/types/services-page";

type ServicesHeroProps = {
  settings: ServicesPageSettings;
  slides: ServiceHeroSlide[];
};

type CSSVariableProperties =
  CSSProperties &
  Record<`--${string}`, string | number>;

function getHeroVariables(
  settings: ServicesPageSettings,
): CSSVariableProperties {
  return {
    "--services-hero-height":
      `${settings.hero_min_height}px`,

    "--services-hero-content-width":
      `${settings.hero_content_max_width}px`,

    "--services-hero-padding-top":
      `${settings.hero_padding_top}px`,

    "--services-hero-padding-bottom":
      `${settings.hero_padding_bottom}px`,

    "--services-hero-padding-left":
      `${settings.hero_padding_left}px`,

    "--services-hero-padding-right":
      `${settings.hero_padding_right}px`,

    "--services-hero-background":
      settings.hero_background_color,

    "--services-hero-eyebrow":
      settings.hero_eyebrow_color,

    "--services-hero-eyebrow-size":
      `${settings.hero_eyebrow_size}px`,

    "--services-hero-eyebrow-weight":
      settings.hero_eyebrow_weight,

    "--services-hero-eyebrow-spacing":
      `${settings.hero_eyebrow_letter_spacing}px`,

    "--services-hero-heading":
      settings.hero_heading_color,

    "--services-hero-heading-size":
      `${settings.hero_heading_size}px`,

    "--services-hero-heading-weight":
      settings.hero_heading_weight,

    "--services-hero-heading-line-height":
      settings.hero_heading_line_height,

    "--services-hero-heading-spacing":
      `${settings.hero_heading_letter_spacing}px`,

    "--services-hero-description":
      settings.hero_description_color,

    "--services-hero-description-size":
      `${settings.hero_description_size}px`,

    "--services-hero-description-weight":
      settings.hero_description_weight,

    "--services-hero-description-line-height":
      settings.hero_description_line_height,

    "--services-hero-button-text":
      settings.hero_button_text_color,

    "--services-hero-button-background":
      settings.hero_button_background_color,

    "--services-hero-button-border":
      settings.hero_button_border_color,

    "--services-hero-button-hover-text":
      settings.hero_button_hover_text_color,

    "--services-hero-button-hover-background":
      settings.hero_button_hover_background_color,

    "--services-hero-button-hover-border":
      settings.hero_button_hover_border_color,

    "--services-hero-button-size":
      `${settings.hero_button_font_size}px`,

    "--services-hero-button-weight":
      settings.hero_button_font_weight,

    "--services-hero-button-padding-x":
      `${settings.hero_button_padding_x}px`,

    "--services-hero-button-padding-y":
      `${settings.hero_button_padding_y}px`,

    "--services-hero-button-radius":
      `${settings.hero_button_radius}px`,

    "--services-hero-button-gap":
      `${settings.hero_button_gap}px`,

    "--services-hero-overlay":
      settings.hero_overlay_color,

    "--services-hero-overlay-opacity":
      String(
        settings.hero_overlay_opacity /
          100,
      ),
  };
}

function getSlideVariables(
  slide: ServiceHeroSlide,
): CSSVariableProperties {
  return {
    "--services-slide-overlay":
      slide.overlay_color,

    "--services-slide-overlay-opacity":
      String(
        slide.overlay_opacity / 100,
      ),

    "--services-slide-position":
      slide.media_object_position ||
      "center",
  };
}

function HeroMedia({
  slide,
}: {
  slide: ServiceHeroSlide;
}) {
  if (
    slide.media_type === "video" &&
    slide.video_url
  ) {
    return (
      <video
        className="servicesHero__media"
        autoPlay={slide.video_autoplay}
        loop={slide.video_loop}
        muted={slide.video_muted}
        controls={slide.video_controls}
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
          className="servicesHero__media"
          src={slide.image_url}
          alt={slide.image_alt}
        />
      </picture>
    );
  }

  return (
    <div
      className="servicesHero__mediaFallback"
      aria-hidden={true}
    />
  );
}

function HeroContent({
  settings,
  slide,
}: {
  settings: ServicesPageSettings;
  slide?: ServiceHeroSlide;
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
    <div className="servicesHero__content">
      {settings.hero_show_breadcrumb ? (
        <nav
          className="servicesHero__breadcrumb"
          aria-label="Breadcrumb"
        >
          <Link href="/">
            {settings.hero_breadcrumb_home_text}
          </Link>

          <span aria-hidden={true}>/</span>

          <strong>
            {settings.hero_breadcrumb_current_text}
          </strong>
        </nav>
      ) : null}

      {eyebrow ? (
        <span className="servicesHero__eyebrow">
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
          className="servicesHero__button"
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

export default function ServicesHero({
  settings,
  slides,
}: ServicesHeroProps) {
  const availableSlides =
    slides.filter(
      (slide) =>
        slide.is_active &&
        slide.is_published,
    );

  const sliderSlides =
    settings.hero_type === "slider"
      ? availableSlides
      : availableSlides.slice(0, 1);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [isPaused, setIsPaused] =
    useState(false);

  const pointerStartX =
    useRef<number | null>(null);

  const slideCount =
    sliderSlides.length;

  const goToSlide = useCallback(
    (index: number) => {
      if (slideCount <= 1) {
        setActiveIndex(0);
        return;
      }

      if (settings.hero_loop) {
        setActiveIndex(
          (index + slideCount) %
            slideCount,
        );
        return;
      }

      setActiveIndex(
        Math.max(
          0,
          Math.min(
            index,
            slideCount - 1,
          ),
        ),
      );
    },
    [
      settings.hero_loop,
      slideCount,
    ],
  );

  const nextSlide = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const previousSlide =
    useCallback(() => {
      goToSlide(activeIndex - 1);
    }, [activeIndex, goToSlide]);

  useEffect(() => {
    if (
      settings.hero_type !==
        "slider" ||
      !settings.hero_autoplay ||
      isPaused ||
      slideCount <= 1
    ) {
      return;
    }

    if (
      !settings.hero_loop &&
      activeIndex ===
        slideCount - 1
    ) {
      return;
    }

    const timer =
      window.setInterval(
        nextSlide,
        Math.max(
          settings.hero_autoplay_delay,
          1000,
        ),
      );

    return () => {
      window.clearInterval(timer);
    };
  }, [
    activeIndex,
    isPaused,
    nextSlide,
    settings.hero_autoplay,
    settings.hero_autoplay_delay,
    settings.hero_loop,
    settings.hero_type,
    slideCount,
  ]);

  function handlePointerDown(
    event: PointerEvent<HTMLElement>,
  ): void {
    pointerStartX.current =
      event.clientX;
  }

  function handlePointerUp(
    event: PointerEvent<HTMLElement>,
  ): void {
    if (
      pointerStartX.current === null
    ) {
      return;
    }

    const distance =
      event.clientX -
      pointerStartX.current;

    pointerStartX.current = null;

    if (
      Math.abs(distance) < 45
    ) {
      return;
    }

    if (distance > 0) {
      previousSlide();
    } else {
      nextSlide();
    }
  }

  if (sliderSlides.length === 0) {
    return (
      <section
        className={[
          "servicesHero",
          "servicesHero--fallback",
          `servicesHero--horizontal-${settings.hero_content_alignment}`,
          `servicesHero--vertical-${settings.hero_vertical_alignment}`,
        ].join(" ")}
        style={getHeroVariables(settings)}
      >
        <div className="servicesHero__fallbackBackground" />

        <div className="servicesHero__defaultOverlay" />

        <HeroContent
          settings={settings}
        />

        {settings.hero_show_scroll_indicator ? (
          <a
            href="#services-list"
            className="servicesHero__scroll"
          >
            <span>
              {settings.hero_scroll_indicator_text}
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

  return (
    <section
      className={[
        "servicesHero",
        settings.hero_type ===
        "slider"
          ? "servicesHero--slider"
          : "servicesHero--single",
        `servicesHero--horizontal-${settings.hero_content_alignment}`,
        `servicesHero--vertical-${settings.hero_vertical_alignment}`,
      ].join(" ")}
      style={getHeroVariables(settings)}
      aria-label={settings.hero_heading}
      aria-roledescription={
        settings.hero_type ===
        "slider"
          ? "carousel"
          : undefined
      }
      onMouseEnter={() => {
        if (
          settings.hero_pause_on_hover
        ) {
          setIsPaused(true);
        }
      }}
      onMouseLeave={() =>
        setIsPaused(false)
      }
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStartX.current = null;
      }}
    >
      <div className="servicesHero__viewport">
        <div
          className="servicesHero__track"
          style={{
            transform:
              `translate3d(-${activeIndex * 100}%, 0, 0)`,
            transitionDuration:
              `${Math.max(
                settings.hero_transition_speed,
                100,
              )}ms`,
          }}
        >
          {sliderSlides.map(
            (slide, index) => (
              <article
                className={[
                  "servicesHero__slide",
                  index === activeIndex
                    ? "isActive"
                    : "",
                  `servicesHero__slide--horizontal-${slide.content_alignment}`,
                  `servicesHero__slide--vertical-${slide.vertical_alignment}`,
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={getSlideVariables(
                  slide,
                )}
                key={slide.id}
                aria-hidden={
                  index !== activeIndex
                }
              >
                <HeroMedia
                  slide={slide}
                />

                <div className="servicesHero__slideOverlay" />

                <HeroContent
                  settings={settings}
                  slide={slide}
                />
              </article>
            ),
          )}
        </div>
      </div>

      {settings.hero_type ===
        "slider" &&
      settings.hero_navigation_style !==
        "none" &&
      slideCount > 1 ? (
        <div className="servicesHero__navigation">
          <button
            type="button"
            onClick={previousSlide}
            disabled={
              !settings.hero_loop &&
              activeIndex === 0
            }
            aria-label="Previous service hero slide"
          >
            <ArrowLeft
              size={18}
              aria-hidden={true}
            />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            disabled={
              !settings.hero_loop &&
              activeIndex ===
                slideCount - 1
            }
            aria-label="Next service hero slide"
          >
            <ArrowRight
              size={18}
              aria-hidden={true}
            />
          </button>
        </div>
      ) : null}

      {settings.hero_type ===
        "slider" &&
      settings.hero_pagination_style !==
        "none" &&
      slideCount > 1 ? (
        <div className="servicesHero__pagination">
          {sliderSlides.map(
            (slide, index) => (
              <button
                type="button"
                key={slide.id}
                className={
                  index === activeIndex
                    ? "isActive"
                    : undefined
                }
                onClick={() =>
                  goToSlide(index)
                }
                aria-label={`Open service hero slide ${index + 1}`}
                aria-current={
                  index === activeIndex
                    ? "true"
                    : undefined
                }
              >
                {settings.hero_pagination_style ===
                "numbers"
                  ? String(
                      index + 1,
                    ).padStart(2, "0")
                  : null}
              </button>
            ),
          )}
        </div>
      ) : null}

      {settings.hero_show_scroll_indicator ? (
        <a
          href="#services-list"
          className="servicesHero__scroll"
        >
          <span>
            {settings.hero_scroll_indicator_text}
          </span>

          <ArrowDown
            size={16}
            aria-hidden={true}
          />
        </a>
      ) : null}

      <div
        className="servicesHero__announcement"
        aria-live="polite"
      >
        Slide {activeIndex + 1} of{" "}
        {slideCount}
      </div>
    </section>
  );
}
