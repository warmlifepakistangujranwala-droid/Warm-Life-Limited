"use client";

import {
  ArrowDown,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";



import type { HeroSlide } from "@/lib/types/hero";
import type { HeroInsight } from "@/lib/types/hero-insight";

type HeroSectionProps = {
  heroSlides: HeroSlide[];
  heroInsights: HeroInsight[];
};

export default function HeroSection({
  heroSlides,
  heroInsights,
}: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  const [pointer, setPointer] = useState({
    x: 0,
    y: 0,
  });

  const [heroReady, setHeroReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /*
  ==========================================================
  ACTIVE HERO SLIDE
  ==========================================================
  */

  const availableHeroSlides = useMemo(() => {
    return heroSlides
      .filter(
        (slide) =>
          slide.is_active &&
          slide.is_published,
      )
      .sort(
        (firstSlide, secondSlide) =>
          firstSlide.display_order -
          secondSlide.display_order,
      );
  }, [heroSlides]);

  const activeHeroSlide =
    availableHeroSlides[0] ??
    heroSlides[0] ??
    null;

  /*
  ==========================================================
  HERO INSIGHTS
  ==========================================================
  */

  const currentHeroInsights = useMemo(() => {
    if (!activeHeroSlide) {
      return [];
    }

    return heroInsights
      .filter(
        (insight) =>
          insight.hero_slide_id === activeHeroSlide.id &&
          insight.is_visible,
      )
      .sort(
        (firstInsight, secondInsight) =>
          firstInsight.display_order -
          secondInsight.display_order,
      );
  }, [activeHeroSlide, heroInsights]);

  /*
  ==========================================================
  SELECT INSIGHT FROM POINTER POSITION
  ==========================================================
  */

  const activeInsightIndex = useMemo(() => {
    if (currentHeroInsights.length === 0) {
      return 0;
    }

    if (pointer.x < -0.17) {
      return 0;
    }

    if (pointer.x > 0.17) {
      return currentHeroInsights.length - 1;
    }

    return Math.min(
      1,
      currentHeroInsights.length - 1,
    );
  }, [currentHeroInsights.length, pointer.x]);

  const activeHeroInsight =
    currentHeroInsights[activeInsightIndex] ??
    currentHeroInsights[0] ??
    null;

  /*
  ==========================================================
  LOADER
  ==========================================================
  */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);

      document.body.classList.remove(
        "siteIsLoading",
      );
    }, 2400);

    document.body.classList.add(
      "siteIsLoading",
    );

    return () => {
      window.clearTimeout(timer);

      document.body.classList.remove(
        "siteIsLoading",
      );
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      document.body.classList.remove(
        "siteIsLoading",
      );
    }
  }, [isLoading]);

  /*
  ==========================================================
  POINTER ANIMATION
  ==========================================================
  */

  useEffect(() => {
    const hero = heroRef.current;
    const video = heroVideoRef.current;

    if (!hero || !video) {
      return;
    }

    const handlePointerMove = (
      event: PointerEvent,
    ) => {
      const rect = hero.getBoundingClientRect();

      const relativeX = Math.min(
        1,
        Math.max(
          0,
          (event.clientX - rect.left) /
            rect.width,
        ),
      );

      const relativeY = Math.min(
        1,
        Math.max(
          0,
          (event.clientY - rect.top) /
            rect.height,
        ),
      );

      setPointer({
        x: relativeX - 0.5,
        y: relativeY - 0.5,
      });

      if (!video.paused) {
        video.playbackRate =
          0.72 + relativeX * 0.7;
      }
    };

    const resetPointer = () => {
      setPointer({
        x: 0,
        y: 0,
      });

      video.playbackRate = 1;
    };

    hero.addEventListener(
      "pointermove",
      handlePointerMove,
    );

    hero.addEventListener(
      "pointerleave",
      resetPointer,
    );

    return () => {
      hero.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      hero.removeEventListener(
        "pointerleave",
        resetPointer,
      );
    };
  }, []);

  /*
  ==========================================================
  FALLBACK CONTENT
  ==========================================================
  */

  const eyebrow =
    activeHeroSlide?.eyebrow ??
    "Government-backed home upgrades";

  const titleLineOne =
    activeHeroSlide?.title_line_one ??
    "A warmer home,";

  const titleLineTwo =
    activeHeroSlide?.title_line_two ??
    "built around you.";

  const description =
    activeHeroSlide?.description ??
    "Move your cursor across the scene to control the house journey. Scroll down to explore each Warm Life service through video.";

  const videoUrl =
    activeHeroSlide?.video_url ??
    "/videos/hero-house.mp4";

  const videoPoster =
    activeHeroSlide?.video_poster_url ??
    undefined;

  const primaryButtonText =
    activeHeroSlide?.primary_button_text ??
    "Explore our services";

  const primaryButtonLink =
    activeHeroSlide?.primary_button_link ??
    "#services";

  const secondaryButtonText =
    activeHeroSlide?.secondary_button_text ??
    "Check eligibility";

  const secondaryButtonLink =
    activeHeroSlide?.secondary_button_link ??
    "#contact";

  return (
    <>
      <div
        className={`siteLoader ${
          isLoading
            ? "isVisible"
            : "isHidden"
        }`}
        aria-hidden={!isLoading}
      >
        <div className="loaderScene">
          <div className="loaderHouse">
            <div className="loaderRoof">
              <span className="loaderSolar loaderSolarOne" />

              <span className="loaderSolar loaderSolarTwo" />
            </div>

            <div className="loaderFront">
              <span className="loaderDoor" />

              <span className="loaderWindow loaderWindowOne" />

              <span className="loaderWindow loaderWindowTwo" />
            </div>

            <div className="loaderSide" />
          </div>

          <div className="loaderShadow" />
        </div>

        <Image
          className="loaderLogo"
          src="/images/warm-life-logo.png"
          alt="Warm Life Limited"
          width={390}
          height={126}
          priority
        />

        <div className="loaderProgress">
          <span />
        </div>

        <p>Preparing a warmer home</p>
      </div>

      <section
        className="hero"
        ref={heroRef}
      >
        <video
          key={videoUrl}
          ref={heroVideoRef}
          className={`heroVideo ${
            heroReady ? "isReady" : ""
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={videoPoster}
          onCanPlay={(event) => {
            setHeroReady(true);

            event.currentTarget
              .play()
              .catch(() => {
                // Browser retries playback after user interaction.
              });
          }}
          aria-label="Interactive cinematic view of a British family home"
        >
          <source
            src={videoUrl}
            type="video/mp4"
          />
        </video>

        <div className="heroOverlay" />

        <div
          className="cursorLight"
          style={{
            left: `${
              (pointer.x + 0.5) * 100
            }%`,
            top: `${
              (pointer.y + 0.5) * 100
            }%`,
          }}
        />

        

        <div
          className="heroContent shell"
          id="top"
        >
          <div
            className="heroCopy"
            style={{
              transform: `translate3d(${
                pointer.x * -18
              }px, ${
                pointer.y * -12
              }px, 0)`,
            }}
          >
            <div className="eyebrow">
              <ShieldCheck size={16} />

              {eyebrow}
            </div>

              <h1
      style={{
      color:
        activeHeroSlide?.title_line_one_color ??
        "#0b2f24",
      }}
      >
      {titleLineOne}

      {titleLineTwo ? (
      <span
        style={{
          color:
            activeHeroSlide?.title_line_two_color ??
            "#2f7a55",
        }}
      >
        {titleLineTwo}
      </span>
      ) : null}
      </h1>

      <p
      style={{
      color:
        activeHeroSlide?.description_color ??
        "#5f6f68",
      }}
      >
      {description}
      </p>

            

            <div className="actions">
              {primaryButtonText &&
              primaryButtonLink ? (
                <a
                  className="primaryButton"
                  href={primaryButtonLink}
                >
                  {primaryButtonText}

                  <ArrowDown size={18} />
                </a>
              ) : null}

              {secondaryButtonText &&
              secondaryButtonLink ? (
                <a
                  className="secondaryButton"
                  href={secondaryButtonLink}
                >
                  {secondaryButtonText}
                </a>
              ) : null}
            </div>
          </div>

          {activeHeroInsight ? (
            <div
              className="heroInsight"
              style={{
                transform: `translate3d(${
                  pointer.x * 12
                }px, ${
                  pointer.y * 7
                }px, 0)`,
              }}
            >
              <span className="heroInsightIndex">
                {String(
                  activeInsightIndex + 1,
                ).padStart(2, "0")}
              </span>

              <div key={activeHeroInsight.id}>
                <small>
                  {activeHeroInsight.label}
                </small>

                <strong>
                  {activeHeroInsight.title}
                </strong>

                {activeHeroInsight.description ? (
                  <p>
                    {
                      activeHeroInsight.description
                    }
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          <a
            className="scrollHint"
            href="#services"
          >
            Scroll to services

            <ArrowDown size={17} />
          </a>
        </div>
      </section>
    </>
  );
}