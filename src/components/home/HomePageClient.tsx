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
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";


import { useCallback, useEffect, useRef, useState } from "react";
//import HeroSection from "@/components/home/HeroSection";

import type { HeroSlide } from "@/lib/types/hero";
import type { HeroInsight } from "@/lib/types/hero-insight";

type Service = {
  number: string;
  title: string;
  eyebrow: string;
  description: string;
  bullets: string[];
  video: string;
  objectPosition?: string;
};
type HomePageClientProps = {
  heroSlides: HeroSlide[];
  heroInsights: HeroInsight[];
};

const services: Service[] = [
  {
    number: "01",
    eyebrow: "Renewable energy",
    title: "Turn daylight into lower energy costs.",
    description:
      "Solar panels help households generate cleaner electricity at home, reduce reliance on the grid and support a more efficient energy future.",
    bullets: [
      "Cleaner electricity generated at home",
      "Reduced grid dependence",
      "Professional roof-mounted systems"
    ],
    video: "/videos/solar-installation.mp4",
    objectPosition: "center"
  },
  {
    number: "02",
    eyebrow: "Heat retention",
    title: "Keep valuable warmth inside your loft.",
    description:
      "Loft insulation helps slow heat loss through the roof, improving comfort during colder months while supporting lower household energy demand.",
    bullets: [
      "Less heat escaping through the roof",
      "Improved comfort in colder weather",
      "A practical whole-home efficiency upgrade"
    ],
    video: "/videos/loft-insulation.mp4",
    objectPosition: "center"
  },
  {
    number: "03",
    eyebrow: "Building fabric",
    title: "Protect the home through insulated cavity walls.",
    description:
      "Cavity wall insulation fills the space between internal and external walls, helping reduce heat loss and maintain a more stable indoor temperature.",
    bullets: [
      "Improved thermal performance",
      "Reduced heat loss through external walls",
      "A warmer and more consistent indoor environment"
    ],
    video: "/videos/cavity-wall.mp4",
    objectPosition: "center"
  }
];
export default function HomePageClient({
  heroSlides,
  heroInsights,
}: HomePageClientProps) {
  const serviceStoryRef = useRef<HTMLElement | null>(null);
  const wheelLockedRef = useRef(false);

  const [activeService, setActiveService] = useState(0);

  const changeService = useCallback(
    (direction: 1 | -1) => {
      if (wheelLockedRef.current) {
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
      }, 720);

      return true;
    },
    [activeService],
  );

  useEffect(() => {
    const section = serviceStoryRef.current;

    if (!section) {
      return;
    }

    const updateServiceFromScroll = () => {
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

    window.addEventListener(
      "scroll",
      updateServiceFromScroll,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      updateServiceFromScroll,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateServiceFromScroll,
      );

      window.removeEventListener(
        "resize",
        updateServiceFromScroll,
      );
    };
  }, []);

  const service = services[activeService];

  return (
    <>
      <main>
        <HeroSection
          heroSlides={heroSlides}
          heroInsights={heroInsights}
        />

        <section
          className="introSection"
          id="about"
        >
          <div className="shell introGrid">
            <span>One connected journey</span>

            <h2>
              See how every upgrade works together to create a
              warmer, more efficient home.
            </h2>
          </div>
        </section>

        <section
          className="serviceStory"
          id="services"
          ref={serviceStoryRef}
        >
          <div className="serviceExperience">
            <div className="serviceStage shell">
              <div className="videoPanel">
                <video
                  key={service.video}
                  className="serviceVideo isActive"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  style={{
                    objectPosition:
                      service.objectPosition ?? "center",
                  }}
                >
                  <source
                    src={service.video}
                    type="video/mp4"
                  />
                </video>

                <div className="videoGradient" />

                <div className="videoBadge">
                  <span>{service.number}</span>
                  {service.eyebrow}
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
                    {String(activeService + 1).padStart(
                      2,
                      "0",
                    )}{" "}
                    /{" "}
                    {String(services.length).padStart(
                      2,
                      "0",
                    )}
                  </strong>

                  <button
                    type="button"
                    onClick={() => changeService(1)}
                    disabled={
                      activeService ===
                      services.length - 1
                    }
                    aria-label="Next service"
                  >
                    <ChevronRight size={19} />
                  </button>
                </div>
              </div>

              <div
                className="serviceCopy"
                key={service.title}
              >
                <div className="sectionKicker">
                  Upgrade {service.number}
                </div>

                <h2>{service.title}</h2>

                <p>{service.description}</p>

                <ul>
                  {service.bullets.map((bullet) => (
                    <li key={bullet}>
                      <Check size={17} />
                      {bullet}
                    </li>
                  ))}
                </ul>

                <div className="wheelInstruction">
                  <MousePointer2 size={17} />

                  <div>
                    <strong>
                      {activeService ===
                      services.length - 1
                        ? "Continue scrolling to the next section"
                        : "Keep scrolling to reveal the next service"}
                    </strong>

                    <span>
                      This section stays in place while each
                      service changes with your scroll.
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
                      key={item.title}
                      className={
                        index === activeService
                          ? "isActive"
                          : ""
                      }
                      onClick={() =>
                        setActiveService(index)
                      }
                      aria-label={`View ${item.title}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

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



