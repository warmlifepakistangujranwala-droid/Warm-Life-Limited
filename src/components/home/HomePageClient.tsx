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

import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";

import type { HeroSlide } from "@/lib/types/hero";
import type { HeroInsight } from "@/lib/types/hero-insight";
import type {
  HomepageService,
  HomepageServicesData,
} from "@/lib/types/homepage-service";

type HomePageClientProps = {
  heroSlides: HeroSlide[];
  heroInsights: HeroInsight[];
  homepageServices: HomepageServicesData;
};

export default function HomePageClient({
  heroSlides,
  heroInsights,
  homepageServices,
}: HomePageClientProps) {
  const serviceStoryRef = useRef<HTMLElement | null>(null);
  const wheelLockedRef = useRef(false);

  const servicesSection = homepageServices?.section ?? null;
  const services = homepageServices?.services ?? [];

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
        ) : null}

        <section className="deliverySection">
          <div className="shell deliveryGrid">
            <div className="deliveryCard">
              <small>
                Powering energy-efficient homes
              </small>

              <h2>
                Proven delivery partner for energy
                efficiency schemes.
              </h2>

              <p>
                With over 1,500 completed projects and 25+
                qualified technicians, Warm Life is a strong
                track record of delivering compliant and
                timely installations under schemes such as
                ECO, CGB, the Green Homes Grant and local
                authority programmes.
              </p>

              <p>
                We manage the complete journey, from home
                surveys and technical checks through to
                installation, quality assurance and resident
                handover.
              </p>

              <a
                className="deliveryButton"
                href="/contact"
              >
                Work with us
                <ArrowRight size={16} />
              </a>
            </div>

            <div
              className="deliveryStats"
              aria-label="Warm Life delivery statistics"
            >
              <article>
                <strong>1500+</strong>

                <span>
                  Successful installations delivered under
                  live energy schemes.
                </span>
              </article>

              <article>
                <strong>25+</strong>

                <span>
                  Qualified, accredited installers and
                  surveyors.
                </span>
              </article>

              <article>
                <strong>12+</strong>

                <span>
                  Energy-efficiency measures delivered
                  across insulation and heating.
                </span>
              </article>
            </div>
          </div>
        </section>

        <section className="brandBand certificationBand">
          <div className="shell">
            <div className="bandHeading">
              <small>Our certifications</small>

              <h2>
                Recognised standards behind every survey
                and installation.
              </h2>
            </div>

            <div className="logoRail fiveLogos">
              {[
                "TrustMark",
                "Gas Safe",
                "Elmhurst Energy",
                "Qualitymark Accredited",
                "Retrofit Academy",
              ].map((name) => (
                <div
                  className="logoTile"
                  key={name}
                >
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="brandBand partnerBand">
          <div className="shell">
            <div className="bandHeading">
              <small>Our partners</small>

              <h4>
                Working with trusted partners to deliver
                reliable and efficient energy solutions.
              </h4>
            </div>

            <div className="logoRail partnerRail">
              {[
                "Worcester Bosch",
                "SWIP",
                "EWI Pro",
                "City & Guilds",
                "Worcester Bosch",
              ].map((name, index) => (
                <div
                  className="logoTile"
                  key={`${name}-${index}`}
                >
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="whySection">
          <div className="shell">
            <div className="whyHeader">
              <div>
                <small>Why choose us?</small>

                <h2>
                  Energy efficiency made simple.
                </h2>
              </div>

              <span>
                PAS 2035 compliant processes
              </span>
            </div>

            <div className="whyGrid">
              <article>
                <ShieldCheck />

                <h3>Reliable compliance</h3>

                <p>
                  All installations are delivered with
                  clear processes, scheme-ready records and
                  quality checks.
                </p>
              </article>

              <article>
                <Users />

                <h3>Resident first approach</h3>

                <p>
                  Our team communicates clearly, respects
                  the home and keeps residents informed
                  throughout.
                </p>
              </article>

              <article>
                <Leaf />

                <h3>Fighting fuel poverty</h3>

                <p>
                  By improving fabric and heating
                  performance, we help households use less
                  energy and feel warmer.
                </p>
              </article>

              <article>
                <Wrench />

                <h3>
                  Flexible, responsive partner
                </h3>

                <p>
                  We adapt around delivery programmes,
                  property needs and changing project
                  requirements.
                </p>
              </article>

              <article>
                <MapPin />

                <h3>Local teams, national reach</h3>

                <p>
                  Regional installation teams supported by
                  consistent standards and central
                  oversight.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="workSection">
          <div className="shell">
            <div className="workHeading">
              <small>How we work?</small>

              <h2>
                A clear process for partners and
                households.
              </h2>
            </div>

            <div className="workColumns">
              <div className="workColumn">
                <h3>
                  <Building2 size={27} />
                  For local authorities &amp; contractors
                </h3>

                <ol>
                  <li>
                    <span>01</span>

                    <div>
                      <strong>
                        Project briefing
                      </strong>

                      <p>
                        We define objectives, target
                        properties and required measures.
                      </p>
                    </div>
                  </li>

                  <li>
                    <span>02</span>

                    <div>
                      <strong>
                        Survey &amp; planning
                      </strong>

                      <p>
                        Accurate technical surveys confirm
                        suitability and scope.
                      </p>
                    </div>
                  </li>

                  <li>
                    <span>03</span>

                    <div>
                      <strong>
                        Installation &amp; quality checks
                      </strong>

                      <p>
                        Our accredited teams complete
                        installation with structured QA.
                      </p>
                    </div>
                  </li>

                  <li>
                    <span>04</span>

                    <div>
                      <strong>
                        Handover &amp; documentation
                      </strong>

                      <p>
                        We provide compliant records,
                        certificates and programme
                        reporting.
                      </p>
                    </div>
                  </li>

                  <li>
                    <span>05</span>

                    <div>
                      <strong>
                        Ongoing support
                      </strong>

                      <p>
                        We remain available for queries,
                        resident support and follow-up.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="workColumn householdColumn">
                <h3>
                  <Home size={27} />
                  For households
                </h3>

                <ol>
                  <li>
                    <span>01</span>

                    <div>
                      <strong>
                        Details received
                      </strong>

                      <p>
                        We review your basic home and
                        contact details.
                      </p>
                    </div>
                  </li>

                  <li>
                    <span>02</span>

                    <div>
                      <strong>
                        Home survey booked
                      </strong>

                      <p>
                        Our assessor visits to identify
                        suitable measures.
                      </p>
                    </div>
                  </li>

                  <li>
                    <span>03</span>

                    <div>
                      <strong>
                        Installation day
                      </strong>

                      <p>
                        Our installers explain the work and
                        complete it carefully.
                      </p>
                    </div>
                  </li>

                  <li>
                    <span>04</span>

                    <div>
                      <strong>
                        Final checks &amp; handover
                      </strong>

                      <p>
                        We inspect the result and explain
                        warranties and aftercare.
                      </p>
                    </div>
                  </li>
                </ol>

                <div className="warmHomeNote">
                  <Sparkles size={18} />
                  Enjoy a warmer, more efficient home.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="reviewsSection">
          <div className="shell">
            <div className="reviewsHeading">
              <small>
                What people say about us
              </small>

              <h2>
                Stories from happy homeowners, based on
                verified customer feedback and Google
                Reviews.
              </h2>
            </div>

            <div className="reviewGrid">
              {[
                [
                  "Quick service, friendly and professional",
                  "Dennis Cox",
                  "Highly recommended. The team at Warm Life completed our installation efficiently and kept us informed throughout.",
                ],
                [
                  "Reliable and easy",
                  "Elva Magdalena Pochylska",
                  "I received support from Warm Life and the service was reliable from start to finish.",
                ],
                [
                  "Professional staff and services",
                  "Punam Mhatre",
                  "I am very happy with the service provided. The team was polite, professional and helpful.",
                ],
                [
                  "Efficient & hassle-free",
                  "Ahmed Mahmood",
                  "Warm Life helped with the work and everything was organised clearly from the first contact to completion.",
                ],
              ].map(([title, name, text]) => (
                <article key={title}>
                  <div
                    className="reviewStars"
                    aria-label="Five star review"
                  >
                    {[0, 1, 2, 3, 4].map(
                      (index) => (
                        <Star
                          key={index}
                          size={14}
                          fill="currentColor"
                        />
                      ),
                    )}
                  </div>

                  <h3>{title}</h3>

                  <strong>{name}</strong>

                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="authoritySection">
          <div className="shell">
            <div className="bandHeading authorityHeading">
              <small>
                Our local authority partners
              </small>

              <h2>
                Collaborating with local authorities across
                the UK to provide government-funded home
                energy upgrades.
              </h2>
            </div>

            <div className="logoRail authorityRail">
              {[
                "Watford Borough Council",
                "Local Authority Partner",
                "Wealden District Council",
                "Local Authority Partner",
                "Local Authority Partner",
              ].map((name, index) => (
                <div
                  className="logoTile"
                  key={`${name}-${index}`}
                >
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="approvalSection"
          id="contact"
        >
          <div className="shell approvalCard homeFinalCta">
            <div>
              <small>
                Start a conversation
              </small>

              <h2>
                Need a trusted delivery partner for your
                next energy-efficiency programme?
              </h2>

              <p>
                Speak with Warm Life about surveys,
                installation capacity, compliance and
                resident delivery.
              </p>
            </div>

            <div className="homeCtaActions">
              <a
                className="primaryButton darkButton"
                href="/contact"
              >
                Get a quote
                <ArrowRight size={18} />
              </a>

              <a
                className="contactPhone"
                href="tel:+442038399999"
              >
                <Phone size={19} />
                Contact us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}


