"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import type {
  HomepageLocalAuthoritiesData,
} from "@/lib/types/homepage-local-authority";

type LocalAuthoritiesMarqueeProps = {
  data: HomepageLocalAuthoritiesData;
};

export default function LocalAuthoritiesMarquee({
  data,
}: LocalAuthoritiesMarqueeProps) {
  const section = data.section;

  const viewportRef =
    useRef<HTMLDivElement | null>(null);

  const trackRef =
    useRef<HTMLDivElement | null>(null);

  const animationFrameRef =
    useRef<number | null>(null);

  const positionRef = useRef(0);

  const lastTimeRef =
    useRef<number | null>(null);

  const pausedRef = useRef(false);

  const draggingRef = useRef(false);

  const dragStartXRef = useRef(0);

  const dragStartPositionRef =
    useRef(0);

  const authorities = useMemo(
    () =>
      data.localAuthorities
        .filter(
          (authority) =>
            authority.is_active &&
            authority.is_published &&
            Boolean(
              authority.logo_url,
            ),
        )
        .sort(
          (
            firstAuthority,
            secondAuthority,
          ) =>
            firstAuthority.display_order -
            secondAuthority.display_order,
        ),
    [data.localAuthorities],
  );

  /*
   * Repeat each authority several times.
   * This ensures the marquee still fills
   * the screen when only one or two logos exist.
   */
  const marqueeGroup = useMemo(() => {
    if (authorities.length === 0) {
      return [];
    }

    const minimumCards = 8;

    const repeatCount = Math.max(
      1,
      Math.ceil(
        minimumCards /
          authorities.length,
      ),
    );

    return Array.from({
      length: repeatCount,
    }).flatMap(() => authorities);
  }, [authorities]);

  const marqueeItems = useMemo(
    () => [
      ...marqueeGroup,
      ...marqueeGroup,
    ],
    [marqueeGroup],
  );

  const updateTrackPosition =
    useCallback(() => {
      const track = trackRef.current;

      if (!track) {
        return;
      }

      const loopWidth =
        track.scrollWidth / 2;

      if (loopWidth <= 0) {
        return;
      }

      while (
        positionRef.current <=
        -loopWidth
      ) {
        positionRef.current +=
          loopWidth;
      }

      while (
        positionRef.current > 0
      ) {
        positionRef.current -=
          loopWidth;
      }

      track.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
    }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (
      !track ||
      !section?.is_active ||
      marqueeItems.length === 0
    ) {
      return;
    }

    positionRef.current = 0;
    lastTimeRef.current = null;

    updateTrackPosition();

    /*
     * autoplay_speed is treated as
     * pixels per second.
     *
     * 20 = slow
     * 40 = normal
     * 70 = fast
     */
    const speed = Math.max(
      5,
      section.autoplay_speed ?? 42,
    );

    const animate = (
      currentTime: number,
    ) => {
      if (
        lastTimeRef.current === null
      ) {
        lastTimeRef.current =
          currentTime;
      }

      const elapsedSeconds =
        (currentTime -
          lastTimeRef.current) /
        1000;

      lastTimeRef.current =
        currentTime;

      if (
        !pausedRef.current &&
        !draggingRef.current
      ) {
        positionRef.current -=
          speed * elapsedSeconds;

        updateTrackPosition();
      }

      animationFrameRef.current =
        window.requestAnimationFrame(
          animate,
        );
    };

    animationFrameRef.current =
      window.requestAnimationFrame(
        animate,
      );

    const handleResize = () => {
      updateTrackPosition();
    };

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      if (
        animationFrameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          animationFrameRef.current,
        );
      }

      animationFrameRef.current =
        null;

      lastTimeRef.current = null;

      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, [
    marqueeItems.length,
    section?.autoplay_speed,
    section?.is_active,
    updateTrackPosition,
  ]);

  const handleWheel = useCallback(
    (
      event: React.WheelEvent<HTMLDivElement>,
    ) => {
      // event.preventDefault();

      const movement =
        Math.abs(event.deltaX) >
        Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      positionRef.current -=
        movement * 0.65;

      updateTrackPosition();
    },
    [updateTrackPosition],
  );

  const handlePointerDown =
    useCallback(
      (
        event: React.PointerEvent<HTMLDivElement>,
      ) => {
        draggingRef.current = true;
        pausedRef.current = true;

        dragStartXRef.current =
          event.clientX;

        dragStartPositionRef.current =
          positionRef.current;

        event.currentTarget.setPointerCapture(
          event.pointerId,
        );
      },
      [],
    );

  const handlePointerMove =
    useCallback(
      (
        event: React.PointerEvent<HTMLDivElement>,
      ) => {
        if (!draggingRef.current) {
          return;
        }

        const distance =
          event.clientX -
          dragStartXRef.current;

        positionRef.current =
          dragStartPositionRef.current +
          distance;

        updateTrackPosition();
      },
      [updateTrackPosition],
    );

  const stopDragging = useCallback(
    (
      event: React.PointerEvent<HTMLDivElement>,
    ) => {
      draggingRef.current = false;
      pausedRef.current = false;

      if (
        event.currentTarget.hasPointerCapture(
          event.pointerId,
        )
      ) {
        event.currentTarget.releasePointerCapture(
          event.pointerId,
        );
      }
    },
    [],
  );

  if (
    !section ||
    !section.is_active ||
    authorities.length === 0
  ) {
    return null;
  }

  return (
    <section
      aria-labelledby="local-authorities-heading"
      className="localAuthoritiesSection"
      style={{
        backgroundColor:
          section.background_color,
        paddingTop: `${section.padding_top}px`,
        paddingBottom: `${section.padding_bottom}px`,
      }}
    >
      <div className="localAuthoritiesHeader">
        {section.heading ? (
          <h2
            id="local-authorities-heading"
            style={{
              color:
                section.heading_color,
              fontSize: `clamp(30px, 4vw, ${section.heading_size}px)`,
              fontWeight:
                section.heading_weight,
            }}
          >
            {section.heading}
          </h2>
        ) : null}

        {section.subheading ? (
          <p
            style={{
              color:
                section.subheading_color,
              fontSize: `clamp(15px, 2vw, ${section.subheading_size}px)`,
            }}
          >
            {section.subheading}
          </p>
        ) : null}
      </div>

      <div
        ref={viewportRef}
        className="localAuthoritiesViewport"
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          if (
            !draggingRef.current
          ) {
            pausedRef.current = false;
          }
        }}
        onWheel={handleWheel}
        onPointerDown={
          handlePointerDown
        }
        onPointerMove={
          handlePointerMove
        }
        onPointerUp={stopDragging}
        onPointerCancel={
          stopDragging
        }
        aria-label="Local authority partner logos"
      >
        <div
          ref={trackRef}
          className="localAuthoritiesTrack"
        >
          {marqueeItems.map(
            (authority, index) => {
              const card = (
                <div className="localAuthorityCard">
                  <Image
                    src={
                      authority.logo_url
                    }
                    alt={
                      authority.name
                    }
                    width={230}
                    height={130}
                    className="localAuthorityLogo"
                    sizes="(max-width: 640px) 150px, 210px"
                    draggable={false}
                  />

                  <span className="localAuthorityName">
                    {authority.name}
                  </span>
                </div>
              );

              return authority.website_url ? (
                <a
                  key={`${authority.id}-${index}`}
                  href={
                    authority.website_url
                  }
                  target={
                    authority.open_in_new_tab
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    authority.open_in_new_tab
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="localAuthorityLink"
                  draggable={false}
                  aria-label={`Visit ${authority.name}`}
                >
                  {card}
                </a>
              ) : (
                <div
                  key={`${authority.id}-${index}`}
                  className="localAuthorityLink"
                >
                  {card}
                </div>
              );
            },
          )}
        </div>
      </div>

      <style jsx>{`
        .localAuthoritiesSection {
          width: 100%;
          overflow: hidden;
        }

        .localAuthoritiesHeader {
          width: min(
            100% - 40px,
            1180px
          );
          margin: 0 auto 44px;
          text-align: center;
        }

        .localAuthoritiesHeader h2 {
          margin: 0;
          line-height: 1.08;
          letter-spacing: -0.035em;
        }

        .localAuthoritiesHeader p {
          max-width: 760px;
          margin: 16px auto 0;
          line-height: 1.7;
        }

        .localAuthoritiesViewport {
          width: 100%;
          overflow: hidden;
          cursor: grab;
          touch-action: pan-y;
          user-select: none;
          padding: 12px 0 24px;
        }

        .localAuthoritiesViewport:active {
          cursor: grabbing;
        }

        .localAuthoritiesTrack {
          display: flex;
          width: max-content;
          align-items: stretch;
          gap: 28px;
          padding: 0 14px;
          will-change: transform;
        }

        .localAuthorityLink {
          display: block;
          flex: 0 0 auto;
          color: inherit;
          text-decoration: none;
        }

        .localAuthorityCard {
          display: flex;
          width: 230px;
          min-height: 155px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 22px;
          border: 1px solid
            rgba(23, 37, 29, 0.12);
          border-radius: 18px;
          background: #ffffff;
          box-shadow: 0 10px 28px
            rgba(23, 37, 29, 0.08);
          transition:
            transform 250ms ease,
            box-shadow 250ms ease;
        }

        .localAuthorityCard:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 40px
            rgba(23, 37, 29, 0.15);
        }

        .localAuthorityLogo {
          width: 100%;
          height: 94px;
          object-fit: contain;
          pointer-events: none;
        }

        .localAuthorityName {
          max-width: 190px;
          color: #17251d;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.3;
          text-align: center;
          pointer-events: none;
        }

        @media (max-width: 700px) {
          .localAuthoritiesHeader {
            margin-bottom: 30px;
          }

          .localAuthoritiesTrack {
            gap: 18px;
            padding: 0 9px;
          }

          .localAuthorityCard {
            width: 180px;
            min-height: 135px;
            padding: 18px;
          }

          .localAuthorityLogo {
            height: 76px;
          }

          .localAuthorityName {
            max-width: 150px;
            font-size: 12px;
          }
        }
      `}</style>
    </section>
  );
}