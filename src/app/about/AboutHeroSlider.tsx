/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/about/AboutHeroSlider.tsx
 *
 * Purpose :
 * Renders the functional About page hero slider with CMS
 * autoplay, looping, navigation, pagination and swipe controls.
 *
 * Version : v1.0.0
 * ============================================================
 */

"use client";

import type {
  CSSProperties,
  PointerEvent,
} from "react";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import type {
  AboutHeroSlide,
  AboutPageSettings,
} from "@/lib/types/about-page";

type AboutHeroSliderProps = {
  settings: AboutPageSettings;
  slides: AboutHeroSlide[];
};

type CSSVariableProperties =
  CSSProperties &
  Record<`--${string}`, string | number>;

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
          settings.hero_overlay_opacity) /
          100,
      ),

    "--about-slide-eyebrow-color":
      slide.eyebrow_color ||
      settings.hero_eyebrow_color,

    "--about-slide-eyebrow-size":
      `${slide.eyebrow_size ??
        settings.hero_eyebrow_size}px`,

    "--about-slide-eyebrow-weight":
      slide.eyebrow_weight ??
      settings.hero_eyebrow_weight,

    "--about-slide-heading-color":
      slide.heading_color ||
      settings.hero_heading_color,

    "--about-slide-heading-size":
      `${slide.heading_size ??
        settings.hero_heading_size}px`,

    "--about-slide-heading-weight":
      slide.heading_weight ??
      settings.hero_heading_weight,

    "--about-slide-heading-line-height":
      slide.heading_line_height ??
      settings.hero_heading_line_height,

    "--about-slide-description-color":
      slide.description_color ||
      settings.hero_description_color,

    "--about-slide-description-size":
      `${slide.description_size ??
        settings.hero_description_size}px`,

    "--about-slide-description-weight":
      slide.description_weight ??
      settings.hero_description_weight,

    "--about-slide-description-line-height":
      slide.description_line_height ??
      settings.hero_description_line_height,

    "--about-slide-button-text":
      slide.button_text_color ||
      settings.hero_button_text_color,

    "--about-slide-button-background":
      slide.button_background_color ||
      settings.hero_button_background_color,

    "--about-slide-button-border":
      slide.button_border_color ||
      settings.hero_button_border_color,

    "--about-slide-button-hover-text":
      slide.button_hover_text_color ||
      settings.hero_button_hover_text_color,

    "--about-slide-button-hover-background":
      slide.button_hover_background_color ||
      settings.hero_button_hover_background_color,

    "--about-slide-button-hover-border":
      slide.button_hover_border_color ||
      settings.hero_button_hover_border_color,

    "--about-slide-button-size":
      `${slide.button_font_size ??
        settings.hero_button_font_size}px`,

    "--about-slide-button-weight":
      slide.button_font_weight ??
      settings.hero_button_font_weight,

    "--about-slide-button-padding-x":
      `${slide.button_padding_x ??
        settings.hero_button_padding_x}px`,

    "--about-slide-button-padding-y":
      `${slide.button_padding_y ??
        settings.hero_button_padding_y}px`,

    "--about-slide-button-radius":
      `${slide.button_radius ??
        settings.hero_button_radius}px`,

    "--about-slide-media-position":
      slide.media_object_position ||
      "center",
  };
}

function SliderMedia({
  slide,
}: {
  slide: AboutHeroSlide;
}) {
  if (
    slide.media_type === "video" &&
    slide.video_url
  ) {
    return (
      <video
        className="aboutHero__media"
        autoPlay={slide.video_autoplay}
        muted={slide.video_muted}
        loop={slide.video_loop}
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

function SliderContent({
  slide,
  settings,
}: {
  slide: AboutHeroSlide;
  settings: AboutPageSettings;
}) {
  const eyebrow =
    slide.eyebrow ||
    settings.hero_eyebrow;

  const heading =
    slide.heading ||
    settings.hero_heading;

  const description =
    slide.description ||
    settings.hero_description;

  const buttonText =
    slide.button_text ||
    settings.hero_button_text;

  const buttonLink =
    slide.button_link ||
    settings.hero_button_link;

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

      {slide.show_button &&
      buttonText &&
      buttonLink ? (
        <Link
          href={buttonLink}
          className="aboutHero__button"
          target={
            slide.button_open_in_new_tab
              ? "_blank"
              : undefined
          }
          rel={
            slide.button_open_in_new_tab
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

export default function AboutHeroSlider({
  settings,
  slides,
}: AboutHeroSliderProps) {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const [isPaused, setIsPaused] =
    useState(false);

  const pointerStartX =
    useRef<number | null>(null);

  const slideCount = slides.length;

  const goToSlide = useCallback(
    (nextIndex: number) => {
      if (slideCount <= 1) {
        setActiveIndex(0);
        return;
      }

      if (settings.hero_loop) {
        setActiveIndex(
          (nextIndex + slideCount) %
            slideCount,
        );

        return;
      }

      setActiveIndex(
        Math.min(
          Math.max(nextIndex, 0),
          slideCount - 1,
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
      !settings.hero_autoplay ||
      isPaused ||
      slideCount <= 1
    ) {
      return;
    }

    if (
      !settings.hero_loop &&
      activeIndex === slideCount - 1
    ) {
      return;
    }

    const timer = window.setInterval(
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
    slideCount,
  ]);

  useEffect(() => {
    if (activeIndex >= slideCount) {
      setActiveIndex(0);
    }
  }, [activeIndex, slideCount]);

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

    if (Math.abs(distance) < 45) {
      return;
    }

    if (distance > 0) {
      previousSlide();
    } else {
      nextSlide();
    }
  }

  return (
    <section
      className={[
        "aboutHero",
        "aboutHero--slider",
        `aboutHero--horizontal-${settings.hero_content_alignment}`,
        `aboutHero--vertical-${settings.hero_vertical_alignment}`,
      ].join(" ")}
      aria-label={settings.hero_heading}
      aria-roledescription="carousel"
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
      onFocusCapture={() => {
        if (
          settings.hero_pause_on_hover
        ) {
          setIsPaused(true);
        }
      }}
      onBlurCapture={() =>
        setIsPaused(false)
      }
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStartX.current = null;
      }}
    >
      <div className="aboutHero__viewport">
        <div
          className="aboutHero__slides"
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
          {slides.map(
            (slide, index) => (
              <article
                className={[
                  "aboutHero__slide",
                  index === activeIndex
                    ? "isActive"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={slide.id}
                style={getSlideVariables(
                  slide,
                  settings,
                )}
                aria-hidden={
                  index !== activeIndex
                }
                aria-label={`Slide ${index + 1} of ${slideCount}`}
              >
                <SliderMedia
                  slide={slide}
                />

                <div
                  className="aboutHero__overlay"
                  aria-hidden={true}
                />

                <SliderContent
                  slide={slide}
                  settings={settings}
                />
              </article>
            ),
          )}
        </div>
      </div>

      {settings.hero_navigation_style !==
        "none" &&
      slideCount > 1 ? (
        <div className="aboutHero__navigation">
          <button
            type="button"
            onClick={previousSlide}
            disabled={
              !settings.hero_loop &&
              activeIndex === 0
            }
            aria-label="Previous hero slide"
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
            aria-label="Next hero slide"
          >
            <ArrowRight
              size={18}
              aria-hidden={true}
            />
          </button>
        </div>
      ) : null}

      {settings.hero_pagination_style !==
        "none" &&
      slideCount > 1 ? (
        <div className="aboutHero__pagination">
          {slides.map(
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
                aria-label={`Open hero slide ${index + 1}`}
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

      <div
        className="aboutHero__announcement"
        aria-live="polite"
        aria-atomic="true"
      >
        Slide {activeIndex + 1} of{" "}
        {slideCount}
      </div>
    </section>
  );
}
