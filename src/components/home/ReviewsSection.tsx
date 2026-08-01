"use client";

import Image from "next/image";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
} from "lucide-react";
import {
  type TouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  HomepageReview,
  HomepageReviewsData,
  HomepageReviewsSection,
} from "@/lib/types/homepage-reviews";

type ReviewsSectionProps = {
  data: HomepageReviewsData;
};

function getSectionBackground(
  section: HomepageReviewsSection,
): string {
  if (section.background_type === "gradient") {
    return `linear-gradient(${section.gradient_direction}, ${section.gradient_start_color}, ${section.gradient_end_color})`;
  }

  return section.background_color;
}

function getVisibleSlides(
  section: HomepageReviewsSection,
  width: number,
): number {
  if (width < 640) {
    return Math.max(1, section.slides_mobile);
  }

  if (width < 1024) {
    return Math.max(1, section.slides_tablet);
  }

  return Math.max(1, section.slides_desktop);
}

function CustomerAvatar({
  review,
}: {
  review: HomepageReview;
}) {
  const imageUrl =
    review.customer_image_url ||
    review.google_profile_photo_url;

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={
          review.customer_image_alt ||
          `${review.customer_name} profile image`
        }
        width={64}
        height={64}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <span className="text-xl font-bold text-emerald-800">
      {review.customer_name.charAt(0).toUpperCase()}
    </span>
  );
}

function ReviewStars({
  rating,
  accentColor,
}: {
  rating: number;
  accentColor: string;
}) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < Math.round(rating);

        return (
          <Star
            key={index}
            size={18}
            strokeWidth={1.8}
            style={{
              color: filled ? accentColor : "#cbd5e1",
              fill: filled ? accentColor : "transparent",
            }}
          />
        );
      })}

      <span className="ml-2 text-sm font-bold text-slate-600">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function ReviewCard({
  review,
  section,
}: {
  review: HomepageReview;
  section: HomepageReviewsSection;
}) {
  const customerDetails = [
    review.designation,
    review.company_name,
    review.location,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden border shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        backgroundColor: section.card_background_color,
        borderColor: section.card_border_color,
        borderRadius: `${section.card_radius}px`,
        padding: `${section.card_padding}px`,
        minHeight: `${section.card_min_height}px`,
      }}
    >
      <Quote
        className="absolute right-6 top-6 opacity-10"
        size={54}
        style={{
          color: section.card_accent_color,
        }}
      />

      <div className="relative z-10 flex h-full flex-col">
        <ReviewStars
          rating={review.rating}
          accentColor={section.card_accent_color}
        />

        {review.review_title ? (
          <h3
            className="mt-5 pr-10 text-lg font-bold leading-snug"
            style={{
              color: section.card_title_color,
            }}
          >
            {review.review_title}
          </h3>
        ) : null}

        <p
          className="mt-4 flex-1 leading-7"
          style={{
            color: section.card_text_color,
          }}
        >
          “{review.review_text}”
        </p>

        <div className="mt-7 flex items-center gap-4 border-t border-slate-200/70 pt-5">
          <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            <CustomerAvatar review={review} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p
                className="truncate font-bold"
                style={{
                  color: section.card_title_color,
                }}
              >
                {review.customer_name}
              </p>

              {review.is_verified ? (
                <BadgeCheck
                  size={17}
                  className="shrink-0 text-emerald-600"
                  aria-label="Verified review"
                />
              ) : null}

              {review.source_type === "google" ? (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                  Google
                </span>
              ) : null}
            </div>

            <p
              className="mt-1 truncate text-sm"
              style={{
                color: section.card_text_color,
              }}
            >
              {customerDetails || "Customer"}
            </p>

            {review.source_type === "google" &&
            review.google_relative_time ? (
              <p className="mt-1 text-xs text-slate-400">
                {review.google_relative_time}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ReviewsSection({
  data,
}: ReviewsSectionProps) {
  const section = data.section;

  const reviews = useMemo(
    () =>
      data.reviews
        .filter(
          (review) =>
            review.is_active &&
            review.is_published,
        )
        .sort((first, second) => {
          if (
            first.is_featured !==
            second.is_featured
          ) {
            return first.is_featured ? -1 : 1;
          }

          if (
            first.display_order !==
            second.display_order
          ) {
            return (
              first.display_order -
              second.display_order
            );
          }

          return (
            new Date(second.created_at).getTime() -
            new Date(first.created_at).getTime()
          );
        }),
    [data.reviews],
  );

  const autoplayRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null,
    );

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [visibleSlides, setVisibleSlides] =
    useState(1);

  const [isHovered, setIsHovered] =
    useState(false);

  const [touchStartX, setTouchStartX] =
    useState<number | null>(null);

  const [touchEndX, setTouchEndX] =
    useState<number | null>(null);

  useEffect(() => {
    if (!section) {
      return;
    }

    const currentSection = section;

    function updateVisibleSlides(): void {
      setVisibleSlides(
        getVisibleSlides(
          currentSection,
          window.innerWidth,
        ),
      );
    }

    updateVisibleSlides();

    window.addEventListener(
      "resize",
      updateVisibleSlides,
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateVisibleSlides,
      );
    };
  }, [section]);

  const maxIndex = Math.max(
    0,
    reviews.length - visibleSlides,
  );

  useEffect(() => {
    setCurrentIndex((current) =>
      Math.min(current, maxIndex),
    );
  }, [maxIndex]);

  const goToPrevious = useCallback(() => {
    if (!section) {
      return;
    }

    setCurrentIndex((current) => {
      if (current <= 0) {
        return section.infinite_loop
          ? maxIndex
          : 0;
      }

      return current - 1;
    });
  }, [maxIndex, section]);

  const goToNext = useCallback(() => {
    if (!section) {
      return;
    }

    setCurrentIndex((current) => {
      if (current >= maxIndex) {
        return section.infinite_loop
          ? 0
          : maxIndex;
      }

      return current + 1;
    });
  }, [maxIndex, section]);

  useEffect(() => {
    if (
      !section ||
      !section.autoplay ||
      reviews.length <= visibleSlides ||
      (section.pause_on_hover && isHovered)
    ) {
      return;
    }

    autoplayRef.current = setInterval(
      goToNext,
      section.autoplay_delay,
    );

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [
    section,
    reviews.length,
    visibleSlides,
    isHovered,
    goToNext,
  ]);

  if (
    !section ||
    !section.is_active ||
    !section.is_published ||
    reviews.length === 0
  ) {
    return null;
  }

  const slideWidth = 100 / visibleSlides;
  const transform = currentIndex * slideWidth;

  function handleTouchStart(
    event: TouchEvent<HTMLDivElement>,
  ): void {
    setTouchEndX(null);
    setTouchStartX(
      event.targetTouches[0].clientX,
    );
  }

  function handleTouchMove(
    event: TouchEvent<HTMLDivElement>,
  ): void {
    setTouchEndX(
      event.targetTouches[0].clientX,
    );
  }

  function handleTouchEnd(): void {
    if (
      touchStartX === null ||
      touchEndX === null
    ) {
      return;
    }

    const distance =
      touchStartX - touchEndX;

    if (distance > 50) {
      goToNext();
    }

    if (distance < -50) {
      goToPrevious();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  }

  return (
    <section
      aria-labelledby="reviews-heading"
      className="relative overflow-hidden"
      style={{
        background:
          getSectionBackground(section),
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

      <div
        className="relative z-10 mx-auto px-5 sm:px-6"
        style={{
          maxWidth: `${section.content_max_width}px`,
        }}
      >
        <header
          style={{
            textAlign: section.text_alignment,
            marginBottom: `${section.heading_bottom_spacing}px`,
          }}
        >
          {section.eyebrow ? (
            <p
              className="uppercase tracking-[0.16em]"
              style={{
                color: section.eyebrow_color,
                fontSize: `${section.eyebrow_size}px`,
                fontWeight:
                  section.eyebrow_weight,
              }}
            >
              {section.eyebrow}
            </p>
          ) : null}

          <h2
            id="reviews-heading"
            className="mt-4 leading-[1.05] tracking-[-0.045em]"
            style={{
              color: section.heading_color,
              fontSize: `clamp(34px, 6vw, ${section.heading_size}px)`,
              fontWeight:
                section.heading_weight,
            }}
          >
            {section.heading}
          </h2>

          {section.subheading ? (
            <p
              className="mt-5 leading-8"
              style={{
                color:
                  section.subheading_color,
                fontSize: `${section.subheading_size}px`,
                maxWidth: "760px",
                marginLeft:
                  section.text_alignment ===
                  "center"
                    ? "auto"
                    : undefined,
                marginRight:
                  section.text_alignment ===
                  "center"
                    ? "auto"
                    : undefined,
              }}
            >
              {section.subheading}
            </p>
          ) : null}
        </header>

        <div
          className="relative"
          onMouseEnter={() =>
            setIsHovered(true)
          }
          onMouseLeave={() =>
            setIsHovered(false)
          }
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="overflow-hidden">
            <div
              className="flex"
              style={{
                gap: `${section.card_gap}px`,
                transform: `translateX(-${transform}%)`,
                transition: `transform ${section.transition_speed}ms ease`,
              }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="shrink-0"
                  style={{
                    width: `calc(${slideWidth}% - ${
                      (section.card_gap *
                        (visibleSlides - 1)) /
                      visibleSlides
                    }px)`,
                  }}
                >
                  <ReviewCard
                    review={review}
                    section={section}
                  />
                </div>
              ))}
            </div>
          </div>

          {section.show_arrows &&
          reviews.length > visibleSlides ? (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                disabled={
                  !section.infinite_loop &&
                  currentIndex === 0
                }
                aria-label="Previous reviews"
                className="absolute left-0 top-1/2 z-20 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-lg transition hover:scale-105 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={21} />
              </button>

              <button
                type="button"
                onClick={goToNext}
                disabled={
                  !section.infinite_loop &&
                  currentIndex === maxIndex
                }
                aria-label="Next reviews"
                className="absolute right-0 top-1/2 z-20 grid h-11 w-11 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-lg transition hover:scale-105 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={21} />
              </button>
            </>
          ) : null}
        </div>

        {section.show_dots &&
        reviews.length > visibleSlides ? (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {Array.from({
              length: maxIndex + 1,
            }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  setCurrentIndex(index)
                }
                aria-label={`Go to review slide ${
                  index + 1
                }`}
                className="h-2.5 rounded-full transition-all"
                style={{
                  width:
                    currentIndex === index
                      ? "30px"
                      : "10px",
                  backgroundColor:
                    currentIndex === index
                      ? section.card_accent_color
                      : `${section.card_accent_color}55`,
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
