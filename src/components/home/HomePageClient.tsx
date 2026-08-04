"use client";

import {
  ArrowRight,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Home,
  Leaf,
  MapPin,
  MousePointer2,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HomepageCertificationsData } from "@/lib/types/homepage-certification";
import type { HomepagePartnersData } from "@/lib/types/homepage-partner";
import type { HomepageLocalAuthoritiesData } from "@/lib/types/homepage-local-authority";
import LocalAuthoritySection from "./LocalAuthoritySection";
import type { HomepageDeliveryData } from "@/lib/types/homepage-delivery";
import DeliveryPartnerSection from "./DeliveryPartnerSection";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import PartnerMarquee from "./PartnerMarquee";
import type { HeroSlide } from "@/lib/types/hero";
import type { HeroInsight } from "@/lib/types/hero-insight";
import type { HomepageWhyChooseUsData } from "@/lib/types/homepage-why-choose-us";
import CtaSection from "./CtaSection";
import type { HomepageCtaData } from "@/lib/types/homepage-cta";
import WhyChooseUsSection from "./WhyChooseUsSection";
import type { HomepageHowWeWorkData } from "@/lib/types/homepage-how-we-work";
import HowWeWorkSection from "./HowWeWorkSection";
import ReviewsSection from "./ReviewsSection";
import type { HomepageReviewsData } from "@/lib/types/homepage-reviews";

import type {
  HomepageService,
  HomepageServicesData,
} from "@/lib/types/homepage-service";

type HomePageClientProps = {
  heroSlides: HeroSlide[];
  heroInsights: HeroInsight[];
  homepageServices: HomepageServicesData;
  homepageCertifications: HomepageCertificationsData;
  homepagePartners: HomepagePartnersData;
  homepageLocalAuthorities: HomepageLocalAuthoritiesData;
  homepageDelivery: HomepageDeliveryData;
  homepageWhyChooseUs: HomepageWhyChooseUsData;
  homepageHowWeWork: HomepageHowWeWorkData;
  homepageReviews: HomepageReviewsData;
  homepageCta: HomepageCtaData;
};

export default function HomePageClient({
  heroSlides,
  heroInsights,
  homepageServices,
  homepageCertifications,
  homepagePartners,
  homepageLocalAuthorities,
  homepageDelivery,
  homepageWhyChooseUs,
  homepageHowWeWork,
  homepageReviews,
  homepageCta,
}: HomePageClientProps) {
  const serviceStoryRef = useRef<HTMLElement | null>(null);
  const wheelLockedRef = useRef(false);

  const certificationsViewportRef = useRef<HTMLDivElement | null>(null);
  const certificationsTrackRef = useRef<HTMLDivElement | null>(null);
  const certificationAnimationRef = useRef<number | null>(null);
  const certificationPositionRef = useRef(0);
  const certificationLastTimeRef = useRef<number | null>(null);
  const certificationPausedRef = useRef(false);
  const certificationDraggingRef = useRef(false);
  const certificationDragStartXRef = useRef(0);
  const certificationDragStartPositionRef = useRef(0);

  const servicesSection = homepageServices?.section ?? null;
  const services = homepageServices?.services ?? [];

  const certificationsSection =
    homepageCertifications?.section ?? null;
  const certifications =
    homepageCertifications?.certifications ?? [];
    const partnersSection =
  homepagePartners?.section ?? null;

const partners =
  homepagePartners?.partners ?? [];
  const visiblePartners = partners
  .filter(
    (partner) =>
      partner.is_active &&
      partner.is_published &&
      Boolean(partner.logo_url),
  )
  .sort(
    (firstPartner, secondPartner) =>
      firstPartner.display_order -
      secondPartner.display_order,
  );

  const [activeService, setActiveService] = useState(0);

  const animationDuration =
    servicesSection?.animation_duration ?? 720;

  const changeService = useCallback(
    (direction: 1 | -1): boolean => {
      if (wheelLockedRef.current || services.length === 0) {
        return false;
      }

      const next = activeService + direction;

      if (next < 0 || next >= services.length) {
        return false;
      }

      wheelLockedRef.current = true;
      setActiveService(next);

      window.setTimeout(() => {
        wheelLockedRef.current = false;
      }, animationDuration);

      return true;
    },
    [activeService, animationDuration, services.length],
  );

  useEffect(() => {
    if (services.length === 0) {
      setActiveService(0);
      return;
    }

    setActiveService((currentIndex) =>
      Math.min(currentIndex, services.length - 1),
    );
  }, [services.length]);

  useEffect(() => {
    const section = serviceStoryRef.current;

    if (!section || services.length === 0) {
      return;
    }

    const updateServiceFromScroll = (): void => {
      const rect = section.getBoundingClientRect();

      const scrollableDistance = Math.max(
        section.offsetHeight - window.innerHeight,
        1,
      );

      const travelled = Math.min(
        scrollableDistance,
        Math.max(0, -rect.top),
      );

      const progress = travelled / scrollableDistance;

      const nextIndex = Math.min(
        services.length - 1,
        Math.floor(progress * services.length),
      );

      setActiveService(nextIndex);
    };

    updateServiceFromScroll();

    window.addEventListener("scroll", updateServiceFromScroll, {
      passive: true,
    });
    window.addEventListener("resize", updateServiceFromScroll);

    return () => {
      window.removeEventListener("scroll", updateServiceFromScroll);
      window.removeEventListener("resize", updateServiceFromScroll);
    };
  }, [services.length]);


  const updateCertificationTrack = useCallback((): void => {
    const track = certificationsTrackRef.current;

    if (!track) {
      return;
    }

    const loopWidth = track.scrollWidth / 2;

    if (loopWidth <= 0) {
      return;
    }

    while (certificationPositionRef.current <= -loopWidth) {
      certificationPositionRef.current += loopWidth;
    }

    while (certificationPositionRef.current > 0) {
      certificationPositionRef.current -= loopWidth;
    }

    track.style.transform = `translate3d(${certificationPositionRef.current}px, 0, 0)`;
  }, []);

  useEffect(() => {
    const track = certificationsTrackRef.current;

    if (
      !track ||
      !certificationsSection?.is_active ||
      certifications.length === 0
    ) {
      return;
    }

    certificationPositionRef.current = 0;
    certificationLastTimeRef.current = null;
    updateCertificationTrack();

    const speed = Math.max(
      10,
      certificationsSection.autoplay_speed ?? 42,
    );

    const animate = (time: number): void => {
      if (certificationLastTimeRef.current === null) {
        certificationLastTimeRef.current = time;
      }

      const elapsed =
        (time - certificationLastTimeRef.current) / 1000;
      certificationLastTimeRef.current = time;

      if (
        !certificationPausedRef.current &&
        !certificationDraggingRef.current
      ) {
        certificationPositionRef.current -= speed * elapsed;
        updateCertificationTrack();
      }

      certificationAnimationRef.current =
        window.requestAnimationFrame(animate);
    };

    certificationAnimationRef.current =
      window.requestAnimationFrame(animate);

    const handleResize = (): void => {
      updateCertificationTrack();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (certificationAnimationRef.current !== null) {
        window.cancelAnimationFrame(
          certificationAnimationRef.current,
        );
      }

      certificationAnimationRef.current = null;
      certificationLastTimeRef.current = null;
      window.removeEventListener("resize", handleResize);
    };
  }, [
    certifications.length,
    certificationsSection?.autoplay_speed,
    certificationsSection?.is_active,
    updateCertificationTrack,
  ]);

  const handleCertificationsWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>): void => {
      event.preventDefault();

      const movement =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      certificationPositionRef.current -= movement * 0.65;
      updateCertificationTrack();
    },
    [updateCertificationTrack],
  );

  const handleCertificationPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): void => {
      certificationDraggingRef.current = true;
      certificationPausedRef.current = true;
      certificationDragStartXRef.current = event.clientX;
      certificationDragStartPositionRef.current =
        certificationPositionRef.current;

      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [],
  );

  const handleCertificationPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): void => {
      if (!certificationDraggingRef.current) {
        return;
      }

      const distance =
        event.clientX - certificationDragStartXRef.current;

      certificationPositionRef.current =
        certificationDragStartPositionRef.current + distance;

      updateCertificationTrack();
    },
    [updateCertificationTrack],
  );

  const stopCertificationDragging = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): void => {
      certificationDraggingRef.current = false;
      certificationPausedRef.current = false;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [],
  );

  const activeServiceData: HomepageService | null =
    services[activeService] ?? null;

  const scrollHeightPerService =
    servicesSection?.scroll_height ?? 650;

  const serviceSectionHeight =
    services.length > 1
      ? `calc(100vh + ${(services.length - 1) * scrollHeightPerService}px)`
      : "100vh";

  return (
    <>
      <main>
        <HeroSection
          heroSlides={heroSlides}
          heroInsights={heroInsights}
        />

        

         {servicesSection?.is_active &&
        activeServiceData &&
        services.length > 0 ? (
          <>
  <div
    style={{
      textAlign: "center",
      paddingTop: "28px",
      paddingBottom: "18px",
      backgroundColor:
        servicesSection.background_color,
    }}
  >
    <span
      style={{
        display: "inline-block",
        padding: "10px 24px",
        borderRadius: "999px",
        backgroundColor: "#ffffff",
        border:
          "1px solid rgba(23,37,29,0.10)",
        color: "#0f5132",
        fontSize: "14px",
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        boxShadow:
          "0 8px 24px rgba(0,0,0,0.06)",
      }}
    >
      Our Services
    </span>
  </div>
          
          <section
            className="serviceStory"
            id="services"
            ref={serviceStoryRef}
            style={{
              minHeight: serviceSectionHeight,
              backgroundColor: servicesSection.background_color,
              paddingTop: `${servicesSection.padding_top}px`,
              paddingBottom: `${servicesSection.padding_bottom}px`,
            }}
          >
            <div className="serviceExperience">
              <div className="serviceStage shell">
                <div className="videoPanel">
                  {activeServiceData.media_type === "video" &&
                  activeServiceData.video_url ? (
                    <video
                      key={activeServiceData.video_url}
                      className="serviceVideo isActive"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      poster={
                        activeServiceData.video_poster_url ?? undefined
                      }
                      style={{
                        objectPosition:
                          activeServiceData.object_position ?? "center",
                        transitionDuration: `${animationDuration}ms`,
                      }}
                    >
                      <source
                        src={activeServiceData.video_url}
                        type="video/mp4"
                      />
                    </video>
                  ) : activeServiceData.image_url ? (
                    <Image
                      key={activeServiceData.image_url}
                      src={activeServiceData.image_url}
                      alt={activeServiceData.service_name}
                      fill
                      priority={activeService === 0}
                      sizes="(max-width: 900px) 100vw, 55vw"
                      className="serviceVideo isActive object-cover"
                      style={{
                        objectPosition:
                          activeServiceData.object_position ?? "center",
                        transitionDuration: `${animationDuration}ms`,
                      }}
                    />
                  ) : (
                    <div
                      className="serviceVideo isActive"
                      aria-hidden="true"
                      style={{
                        backgroundColor:
                          servicesSection.background_color,
                      }}
                    />
                  )}

                  <div className="videoGradient" />

                  <div className="videoBadge">
                    <span>
                      {activeServiceData.display_number ??
                        String(activeService + 1).padStart(2, "0")}
                    </span>
                    {activeServiceData.eyebrow ??
                      activeServiceData.service_name}
                  </div>

                  <div className="videoNavigation">
                    <button
                      type="button"
                      onClick={() => changeService(-1)}
                      disabled={activeService === 0}
                      aria-label="Previous service"
                    >
                      <ChevronLeft size={19} />
                    </button>

                    <strong>
                      {String(activeService + 1).padStart(2, "0")} /{" "}
                      {String(services.length).padStart(2, "0")}
                    </strong>

                    <button
                      type="button"
                      onClick={() => changeService(1)}
                      disabled={activeService === services.length - 1}
                      aria-label="Next service"
                    >
                      <ChevronRight size={19} />
                    </button>
                  </div>
                </div>

                <div
                  className="serviceCopy"
                  key={activeServiceData.id}
                  style={{
                    textAlign: servicesSection.section_alignment,
                    transitionDuration: `${animationDuration}ms`,
                  }}
                >
                  <h2
                    style={{
                      marginTop: 0,
                      marginBottom: "24px",
                      color: servicesSection.section_heading_color,
                      fontSize: `${servicesSection.section_heading_size}px`,
                      fontWeight: servicesSection.section_heading_weight,
                    }}
                  >
                    {activeServiceData.service_name}
                  </h2>

                  <div
                    className="sectionKicker"
                    style={{
                      color:
                        activeServiceData.eyebrow_color ?? undefined,
                      fontSize: `${activeServiceData.eyebrow_size ?? 14}px`,
                    }}
                  >
                    {activeServiceData.eyebrow ??
                      `Upgrade ${
                        activeServiceData.display_number ??
                        String(activeService + 1).padStart(2, "0")
                      }`}
                  </div>

                  <h2
                    style={{
                      color: activeServiceData.title_color ?? undefined,
                      fontSize: `${activeServiceData.title_size ?? 54}px`,
                      fontWeight:
                        activeServiceData.title_weight ?? 700,
                    }}
                  >
                    {activeServiceData.title}
                  </h2>

                  {activeServiceData.description ? (
                    <p
                      style={{
                        color:
                          activeServiceData.description_color ??
                          undefined,
                        fontSize: `${
                          activeServiceData.description_size ?? 18
                        }px`,
                      }}
                    >
                      {activeServiceData.description}
                    </p>
                  ) : null}

                  {(activeServiceData.bullets ?? []).length > 0 ? (
                    <ul>
                      {(activeServiceData.bullets ?? []).map(
                        (bullet, index) => (
                          <li
                            key={bullet.id ?? `${activeServiceData.id}-${index}`}
                            style={{
                              color:
                                activeServiceData.bullet_color ??
                                undefined,
                              fontSize: `${
                                activeServiceData.bullet_size ?? 16
                              }px`,
                            }}
                          >
                            <Check size={17} />
                            {bullet.bullet_text}
                          </li>
                        ),
                      )}
                    </ul>
                  ) : null}

                  {activeServiceData.button_text &&
                  activeServiceData.button_link ? (
                    <a
                      href={activeServiceData.button_link}
                      target={
                        activeServiceData.open_in_new_tab
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        activeServiceData.open_in_new_tab
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="deliveryButton"
                      style={{
                        backgroundColor:
                          activeServiceData.button_background_color ??
                          "#0b2f24",
                        color:
                          activeServiceData.button_text_color ?? "#ffffff",
                        borderRadius: `${
                          activeServiceData.button_radius ?? 999
                        }px`,
                        fontSize: `${activeServiceData.button_size ?? 15}px`,
                      }}
                    >
                      {activeServiceData.button_text}
                      <ArrowRight size={16} />
                    </a>
                  ) : null}

                  <div className="wheelInstruction">
                    <MousePointer2 size={17} />

                    <div>
                      <strong>
                        {activeService === services.length - 1
                          ? "Continue scrolling to the next section"
                          : "Keep scrolling to reveal the next service"}
                      </strong>

                      <span>
                        This section stays in place while each service
                        changes with your scroll.
                      </span>
                    </div>
                  </div>

                  <div
                    className="serviceDots"
                    aria-label="Service progress"
                  >
                    {services.map((item, index) => (
                      <button
                        type="button"
                        key={item.id}
                        className={
                          index === activeService ? "isActive" : ""
                        }
                        onClick={() => setActiveService(index)}
                        aria-label={`View ${item.service_name}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          </>
        ) : null}


       <DeliveryPartnerSection
  data={homepageDelivery}
/>

        {certificationsSection?.is_active &&
        certifications.length > 0 ? (
          <section
            className="certificationsCmsSection"
            aria-labelledby="certifications-heading"
            style={{
              backgroundColor:
                certificationsSection.background_color,
              paddingTop: `${certificationsSection.padding_top}px`,
              paddingBottom: `${certificationsSection.padding_bottom}px`,
            }}
          >
            <div className="shell">
              <h2
                id="certifications-heading"
                className="certificationsCmsHeading"
                style={{
                  color: certificationsSection.heading_color,
                  fontSize: `clamp(30px, 4vw, ${certificationsSection.heading_size}px)`,
                  fontWeight:
                    certificationsSection.heading_weight,
                }}
              >
                {certificationsSection.heading}
              </h2>
            </div>

            <div
              ref={certificationsViewportRef}
              className="certificationsViewport"
              onMouseEnter={() => {
                certificationPausedRef.current = true;
              }}
              onMouseLeave={() => {
                if (!certificationDraggingRef.current) {
                  certificationPausedRef.current = false;
                }
              }}
              onWheel={handleCertificationsWheel}
              onPointerDown={handleCertificationPointerDown}
              onPointerMove={handleCertificationPointerMove}
              onPointerUp={stopCertificationDragging}
              onPointerCancel={stopCertificationDragging}
              aria-label="Certification logos"
            >
              <div
                ref={certificationsTrackRef}
                className="certificationsTrack"
              >
                {[...certifications, ...certifications].map(
                  (certification, index) => {
                    const logo = (
                      <div className="certificationLogoCard">
                        <Image
                          src={certification.logo_url}
                          alt={certification.name}
                          width={220}
                          height={120}
                          className="certificationLogoImage"
                          sizes="(max-width: 640px) 150px, 190px"
                        />
                        <span className="certificationLogoName">
                          {certification.name}
                        </span>
                      </div>
                    );

                    return certification.website_url ? (
                      <a
                        key={`${certification.id}-${index}`}
                        className="certificationLogoLink"
                        href={certification.website_url}
                        target={
                          certification.open_in_new_tab
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          certification.open_in_new_tab
                            ? "noopener noreferrer"
                            : undefined
                        }
                        aria-label={`Visit ${certification.name}`}
                        draggable={false}
                      >
                        {logo}
                      </a>
                    ) : (
                      <div
                        key={`${certification.id}-${index}`}
                        className="certificationLogoLink"
                      >
                        {logo}
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            <style jsx>{`
              .certificationsCmsSection {
                overflow: hidden;
              }

              .certificationsCmsHeading {
                margin: 0 0 52px;
                text-align: center;
                line-height: 1.08;
                letter-spacing: -0.035em;
              }

              .certificationsViewport {
                width: 100%;
                overflow: hidden;
                cursor: grab;
                touch-action: pan-y;
                user-select: none;
                padding: 18px 0 28px;
              }

              .certificationsViewport:active {
                cursor: grabbing;
              }

              .certificationsTrack {
                display: flex;
                width: max-content;
                align-items: center;
                gap: 28px;
                padding: 0 14px;
                will-change: transform;
              }

              .certificationLogoLink {
                display: block;
                flex: 0 0 auto;
                text-decoration: none;
                color: inherit;
              }

              .certificationLogoCard {
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

              .certificationLogoCard:hover {
                transform: translateY(-7px) scale(1.1);
                border-color: rgba(168, 132, 54, 0.48);
                background: #ffffff;
                box-shadow:
                  0 20px 44px rgba(23, 37, 29, 0.14),
                  0 0 0 4px rgba(168, 132, 54, 0.08);
                z-index: 2;
              }

              .certificationLogoImage {
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

              .certificationLogoCard:hover
                .certificationLogoImage {
                filter: grayscale(0);
                opacity: 1;
                transform: scale(1.03);
              }

              .certificationLogoName {
                max-width: 190px;
                font-size: 14px;
                font-weight: 700;
                line-height: 1.25;
                text-align: center;
                color: #17251d;
                pointer-events: none;
              }

              @media (max-width: 700px) {
                .certificationsCmsHeading {
                  margin-bottom: 34px;
                  padding: 0 20px;
                }

                .certificationsTrack {
                  gap: 18px;
                  padding: 0 9px;
                }

                .certificationLogoCard {
                  width: 178px;
                  min-height: 132px;
                  padding: 18px;
                  border-radius: 18px;
                }

                .certificationLogoImage {
                  height: 68px;
                }

                .certificationLogoName {
                  max-width: 145px;
                  font-size: 13px;
                }
              }

              @media (prefers-reduced-motion: reduce) {
                .certificationLogoCard,
                .certificationLogoImage {
                  transition: none;
                }
              }
            `}</style>
          </section>
        ) : null}

         {partnersSection?.is_active &&
visiblePartners.length > 0 ? (
  <section
    className="partnersCmsSection"
    aria-labelledby="partners-heading"
    style={{
      backgroundColor:
        partnersSection.background_color,
      paddingTop: `${partnersSection.padding_top}px`,
      paddingBottom: `${partnersSection.padding_bottom}px`,
      overflow: "hidden",
    }}
  >
    <div className="shell">
      <div className="partnersCmsHeading">
        {partnersSection.heading ? (
          <h2
            id="partners-heading"
            style={{
              margin: 0,
              color:
                partnersSection.heading_color,
              fontSize: `clamp(28px, 4vw, ${partnersSection.heading_size}px)`,
              fontWeight:
                partnersSection.heading_weight,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            {partnersSection.heading}
          </h2>
        ) : null}

        {partnersSection.subheading ? (
          <p
            style={{
              margin: "16px auto 0",
              maxWidth: "760px",
              color:
                partnersSection.subheading_color,
              fontSize: `clamp(15px, 2vw, ${partnersSection.subheading_size}px)`,
              lineHeight: 1.7,
            }}
          >
            {partnersSection.subheading}
          </p>
        ) : null}
      </div>
    </div>

    <PartnerMarquee
      partners={visiblePartners}
      autoplaySpeed={
        partnersSection.autoplay_speed ?? 42
      }
    />

    <style jsx>{`
      .partnersCmsHeading {
        margin-bottom: 44px;
        padding: 0 20px;
        text-align: center;
      }

      @media (max-width: 700px) {
        .partnersCmsHeading {
          margin-bottom: 30px;
        }
      }
    `}</style>
  </section>
) : null}

        <WhyChooseUsSection
  data={homepageWhyChooseUs}
/>
<HowWeWorkSection
  data={homepageHowWeWork}
/>
  <ReviewsSection
  data={homepageReviews}
/>      

        

        <LocalAuthoritySection
  data={homepageLocalAuthorities}
/>

        <CtaSection
  data={homepageCta}
/>
      </main>

      
    </>
  );
}
