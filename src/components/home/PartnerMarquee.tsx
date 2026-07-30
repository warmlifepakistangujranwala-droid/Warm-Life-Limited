"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

import type { HomepagePartner } from "@/lib/types/homepage-partner";

type PartnerMarqueeProps = {
  partners: HomepagePartner[];
  autoplaySpeed: number;
};

export default function PartnerMarquee({
  partners,
  autoplaySpeed,
}: PartnerMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const pausedRef = useRef(false);
  const draggingRef = useRef(false);

  const dragStartXRef = useRef(0);
  const dragStartPositionRef = useRef(0);

  const updateTrack = useCallback(() => {
    const track = trackRef.current;

    if (!track) return;

    const loopWidth = track.scrollWidth / 2;

    if (loopWidth <= 0) return;

    while (positionRef.current <= -loopWidth) {
      positionRef.current += loopWidth;
    }

    while (positionRef.current > 0) {
      positionRef.current -= loopWidth;
    }

    track.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track || partners.length === 0) {
      return;
    }

    positionRef.current = 0;
    lastTimeRef.current = null;

    updateTrack();

    const speed = Math.max(10, autoplaySpeed ?? 42);

    const animate = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const elapsed =
        (time - lastTimeRef.current) / 1000;

      lastTimeRef.current = time;

      if (!pausedRef.current && !draggingRef.current) {
        positionRef.current -= speed * elapsed;
        updateTrack();
      }

      animationRef.current =
        window.requestAnimationFrame(animate);
    };

    animationRef.current =
      window.requestAnimationFrame(animate);

    const handleResize = () => {
      updateTrack();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }

      animationRef.current = null;
      lastTimeRef.current = null;

      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, [autoplaySpeed, partners.length, updateTrack]);

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      event.preventDefault();

      const movement =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      positionRef.current -= movement * 0.65;

      updateTrack();
    },
    [updateTrack],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      pausedRef.current = true;

      dragStartXRef.current = event.clientX;
      dragStartPositionRef.current =
        positionRef.current;

      event.currentTarget.setPointerCapture(
        event.pointerId,
      );
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;

      const distance =
        event.clientX - dragStartXRef.current;

      positionRef.current =
        dragStartPositionRef.current + distance;

      updateTrack();
    },
    [updateTrack],
  );

  const stopDragging = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
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

  const repeatedPartners = [
    ...partners,
    ...partners,
  ];

  return (
    <>
      <div
        ref={viewportRef}
        className="partnersViewport"
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          if (!draggingRef.current) {
            pausedRef.current = false;
          }
        }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        aria-label="Partner logos"
      >
        <div
          ref={trackRef}
          className="partnersTrack"
        >
          {repeatedPartners.map((partner, index) => {
            const logoCard = (
              <div className="partnerLogoCard">
                <Image
                  src={partner.logo_url}
                  alt={partner.name}
                  width={220}
                  height={120}
                  className="partnerLogoImage"
                  sizes="(max-width: 640px) 150px, 190px"
                  draggable={false}
                />

                <span className="partnerLogoName">
                  {partner.name}
                </span>
              </div>
            );

            return partner.website_url ? (
              <a
                key={`${partner.id}-${index}`}
                className="partnerLogoLink"
                href={partner.website_url}
                target={
                  partner.open_in_new_tab
                    ? "_blank"
                    : undefined
                }
                rel={
                  partner.open_in_new_tab
                    ? "noopener noreferrer"
                    : undefined
                }
                aria-label={`Visit ${partner.name}`}
                draggable={false}
              >
                {logoCard}
              </a>
            ) : (
              <div
                key={`${partner.id}-${index}`}
                className="partnerLogoLink"
              >
                {logoCard}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .partnersViewport {
          width: 100%;
          overflow: hidden;
          cursor: grab;
          touch-action: pan-y;
          user-select: none;
          padding: 18px 0 28px;
        }

        .partnersViewport:active {
          cursor: grabbing;
        }

        .partnersTrack {
          display: flex;
          width: max-content;
          align-items: center;
          gap: 28px;
          padding: 0 14px;
          will-change: transform;
        }

        .partnerLogoLink {
          display: block;
          flex: 0 0 auto;
          text-decoration: none;
          color: inherit;
        }

        .partnerLogoCard {
          width: 230px;
          min-height: 154px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 24px;
          border: 1px solid rgba(23, 37, 29, 0.11);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 10px 30px rgba(23, 37, 29, 0.06);
          transition:
            transform 280ms ease,
            box-shadow 280ms ease,
            border-color 280ms ease,
            background-color 280ms ease;
        }

        .partnerLogoCard:hover {
          transform: translateY(-7px) scale(1.1);
          border-color: rgba(168, 132, 54, 0.48);
          background: #ffffff;
          box-shadow:
            0 20px 44px rgba(23, 37, 29, 0.14),
            0 0 0 4px rgba(168, 132, 54, 0.08);
          z-index: 2;
        }

        .partnerLogoImage {
          width: 100%;
          height: 82px;
          object-fit: contain;
          pointer-events: none;
          filter: grayscale(1);
          opacity: 0.78;
          transition:
            filter 280ms ease,
            opacity 280ms ease,
            transform 280ms ease;
        }

        .partnerLogoCard:hover
          .partnerLogoImage {
          filter: grayscale(0);
          opacity: 1;
          transform: scale(1.03);
        }

        .partnerLogoName {
          max-width: 190px;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.25;
          text-align: center;
          color: #17251d;
          pointer-events: none;
        }

        @media (max-width: 700px) {
          .partnersTrack {
            gap: 18px;
            padding: 0 9px;
          }

          .partnerLogoCard {
            width: 178px;
            min-height: 132px;
            padding: 18px;
            border-radius: 18px;
          }

          .partnerLogoImage {
            height: 68px;
          }

          .partnerLogoName {
            max-width: 145px;
            font-size: 13px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .partnerLogoCard,
          .partnerLogoImage {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}