"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import type { HomepageCertification } from "@/lib/types/homepage-certification";

type LogoMarqueeProps = {
  items: HomepageCertification[];
  speed?: number;
};

export default function LogoMarquee({
  items,
  speed = 42,
}: LogoMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, startScrollLeft: 0 });

  const loopItems = useMemo(() => {
    if (items.length === 0) return [];
    return [...items, ...items];
  }, [items]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || items.length === 0) return;

    const animate = (time: number): void => {
      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!pausedRef.current && !isDragging) {
        viewport.scrollLeft += (Math.max(speed, 10) * delta) / 1000;

        const halfwayPoint = viewport.scrollWidth / 2;
        if (viewport.scrollLeft >= halfwayPoint) {
          viewport.scrollLeft -= halfwayPoint;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      lastTimeRef.current = null;
    };
  }, [isDragging, items.length, speed]);

  function normalizeLoopPosition(): void {
    const viewport = viewportRef.current;
    if (!viewport || viewport.scrollWidth === 0) return;

    const halfwayPoint = viewport.scrollWidth / 2;
    if (viewport.scrollLeft >= halfwayPoint) viewport.scrollLeft -= halfwayPoint;
    if (viewport.scrollLeft < 0) viewport.scrollLeft += halfwayPoint;
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>): void {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;

    viewport.scrollLeft += movement;
    normalizeLoopPosition();
    event.preventDefault();
  }

  function startDrag(clientX: number): void {
    const viewport = viewportRef.current;
    if (!viewport) return;

    setIsDragging(true);
    pausedRef.current = true;
    dragState.current = {
      startX: clientX,
      startScrollLeft: viewport.scrollLeft,
    };
  }

  function moveDrag(clientX: number): void {
    const viewport = viewportRef.current;
    if (!viewport || !isDragging) return;

    viewport.scrollLeft =
      dragState.current.startScrollLeft - (clientX - dragState.current.startX);
    normalizeLoopPosition();
  }

  function endDrag(): void {
    setIsDragging(false);
    pausedRef.current = false;
  }

  if (items.length === 0) return null;

  return (
    <div
      ref={viewportRef}
      className={`certificateMarquee ${isDragging ? "isDragging" : ""}`}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
        endDrag();
      }}
      onWheel={handleWheel}
      onMouseDown={(event) => startDrag(event.clientX)}
      onMouseMove={(event) => moveDrag(event.clientX)}
      onMouseUp={endDrag}
      onTouchStart={(event) => startDrag(event.touches[0]?.clientX ?? 0)}
      onTouchMove={(event) => moveDrag(event.touches[0]?.clientX ?? 0)}
      onTouchEnd={endDrag}
      aria-label="Certification logos"
    >
      <div className="certificateMarquee__track">
        {loopItems.map((item, index) => {
          const content = (
            <div className="certificateLogoCard">
              <Image
                src={item.logo_url}
                alt={item.name}
                width={210}
                height={110}
                sizes="(max-width: 640px) 150px, 210px"
                className="certificateLogoCard__image"
                draggable={false}
              />
              <span className="srOnly">{item.name}</span>
            </div>
          );

          return item.website_url ? (
            <a
              key={`${item.id}-${index}`}
              href={item.website_url}
              target={item.open_in_new_tab ? "_blank" : undefined}
              rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
              className="certificateLogoCard__link"
              aria-label={`Visit ${item.name}`}
              draggable={false}
            >
              {content}
            </a>
          ) : (
            <div key={`${item.id}-${index}`}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
