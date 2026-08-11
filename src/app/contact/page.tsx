/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/contact/page.tsx
 *
 * Purpose :
 * Public dynamic Contact Page.
 *
 * Version : v0.2.0
 * ============================================================
 */

import type {
  CSSProperties,
} from "react";

import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  ArrowRight,
  Clock3,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Twitter,
} from "lucide-react";

import {
  getContactPageData,
} from "@/lib/actions/contact-page";

import ContactForm from "./ContactForm";

import "./contact.css";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

type ContactStyle =
  CSSProperties &
  Record<
    `--${string}`,
    string | number
  >;

function getIcon(
  name: string | null,
) {
  const key =
    name?.toLowerCase() ??
    "";

  if (
    key.includes("phone")
  ) {
    return (
      <Phone size={22} />
    );
  }

  if (
    key.includes("mail")
  ) {
    return (
      <Mail size={22} />
    );
  }

  if (
    key.includes("map")
  ) {
    return (
      <MapPin size={22} />
    );
  }

  if (
    key.includes("clock")
  ) {
    return (
      <Clock3 size={22} />
    );
  }

  if (
    key.includes(
      "whatsapp",
    ) ||
    key.includes(
      "message",
    )
  ) {
    return (
      <MessageCircle
        size={22}
      />
    );
  }

  if (
    key.includes(
      "instagram",
    )
  ) {
    return (
      <Instagram
        size={20}
      />
    );
  }

  if (
    key.includes(
      "facebook",
    )
  ) {
    return (
      <Facebook
        size={20}
      />
    );
  }

  if (
    key.includes(
      "linkedin",
    )
  ) {
    return (
      <Linkedin
        size={20}
      />
    );
  }

  if (
    key.includes(
      "twitter",
    ) ||
    key.includes("x")
  ) {
    return (
      <Twitter
        size={20}
      />
    );
  }

  return (
    <Send size={20} />
  );
}


/* ============================================================
   GOOGLE MAP EMBED
   ============================================================ */

function getGoogleMapsEmbedUrl(
  value: string | null,
): string | null {
  if (!value) {
    return null;
  }

  const trimmed =
    value.trim();

  if (
    trimmed.includes(
      "<iframe",
    )
  ) {
    const srcMatch =
      trimmed.match(
        /src=["']([^"']+)["']/i,
      );

    return (
      srcMatch?.[1] ??
      null
    );
  }

  if (
    trimmed.includes(
      "google.com/maps/embed",
    ) ||
    trimmed.includes(
      "google.co.uk/maps/embed",
    )
  ) {
    return trimmed;
  }

  return null;
}


/* ============================================================
   SEO
   ============================================================ */

export async function generateMetadata():
  Promise<Metadata> {
  const {
    settings,
  } =
    await getContactPageData();

  const title =
    settings?.seo_title ||
    settings?.hero_heading ||
    "Contact Warm Life";

  const description =
    settings?.meta_description ||
    settings?.hero_description ||
    "Contact Warm Life for heating, insulation and renewable energy enquiries.";

  const canonical =
    settings?.canonical_url ||
    "/contact";

  const ogImage =
    settings?.og_image_url ||
    settings
      ?.hero_background_image_url ||
    undefined;

  const twitterImage =
    settings
      ?.twitter_image_url ||
    ogImage;

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    robots: {
      index:
        !settings?.no_index,

      follow:
        !settings?.no_follow,
    },

    openGraph: {
      type: "website",

      title:
        settings?.og_title ||
        title,

      description:
        settings
          ?.og_description ||
        description,

      url:
        canonical,

      images:
        ogImage
          ? [
              {
                url:
                  ogImage,

                alt:
                  settings
                    ?.og_image_alt ||
                  settings
                    ?.hero_background_image_alt ||
                  title,
              },
            ]
          : undefined,
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        settings
          ?.twitter_title ||
        settings
          ?.og_title ||
        title,

      description:
        settings
          ?.twitter_description ||
        settings
          ?.og_description ||
        description,

      images:
        twitterImage
          ? [
              twitterImage,
            ]
          : undefined,
    },
  };
}


/* ============================================================
   PAGE
   ============================================================ */

export default async function ContactPage() {
  const {
    settings,
    details,
    enquiryTypes,
    socialLinks,
  } =
    await getContactPageData();

  if (!settings) {
    return (
      <main className="contactPage">
        <section className="contactUnavailable">
          <h1>
            Contact Page
            Unavailable
          </h1>

          <p>
            Please try again
            later.
          </p>
        </section>
      </main>
    );
  }


  /* ==========================================================
     MAP
     ========================================================== */

  const mapEmbedUrl =
    getGoogleMapsEmbedUrl(
      settings.map_embed_url,
    );


  /* ==========================================================
     DYNAMIC CMS STYLES
     ========================================================== */

  const style:
    ContactStyle = {
    "--contact-hero-height":
      `${settings.hero_height}px`,

    "--contact-hero-heading-size":
      `${settings.hero_heading_size}px`,

    "--contact-hero-heading-size-mobile":
      `${settings.hero_heading_size_mobile}px`,

    "--contact-hero-overlay":
      settings
        .hero_overlay_opacity,

    "--contact-intro-heading-size":
      `${settings.intro_heading_size}px`,

    "--contact-intro-heading-size-mobile":
      `${settings.intro_heading_size_mobile}px`,

    "--contact-details-heading-size":
      `${settings.contact_details_heading_size}px`,

    "--contact-details-heading-size-mobile":
      `${settings.contact_details_heading_size_mobile}px`,

    "--contact-card-value-size":
      `${settings.contact_card_value_size}px`,

    "--contact-card-value-size-mobile":
      `${settings.contact_card_value_size_mobile}px`,

    "--contact-form-heading-size":
      `${settings.form_heading_size}px`,

    "--contact-form-heading-size-mobile":
      `${settings.form_heading_size_mobile}px`,

    "--contact-map-heading-size":
      `${settings.map_heading_size}px`,

    "--contact-map-heading-size-mobile":
      `${settings.map_heading_size_mobile}px`,

    "--contact-cta-heading-size":
      `${settings.cta_heading_size}px`,

    "--contact-cta-heading-size-mobile":
      `${settings.cta_heading_size_mobile}px`,
  };


  return (
    <main
      className="contactPage"
      style={style}
    >

      {/* ======================================================
          HERO
          ====================================================== */}

      <section className="contactHero">
        {settings
          .hero_background_image_url ? (
          <img
            className="contactHero__background"
            src={
              settings
                .hero_background_image_url
            }
            alt={
              settings
                .hero_background_image_alt ||
              settings
                .hero_heading
            }
          />
        ) : null}

        <div className="contactHero__overlay" />

        <div className="contactHero__inner">
          <span>
            {
              settings
                .hero_eyebrow
            }
          </span>

          <h1>
            {
              settings
                .hero_heading
            }
          </h1>

          {settings
            .hero_description ? (
            <p>
              {
                settings
                  .hero_description
              }
            </p>
          ) : null}
        </div>
      </section>


      {/* ======================================================
          MAIN CONTENT
          ====================================================== */}

      <section className="contactMain">
        <div className="contactMain__inner">

          {/* INTRO */}

          <header className="contactIntro">
            {settings
              .intro_eyebrow ? (
              <span>
                {
                  settings
                    .intro_eyebrow
                }
              </span>
            ) : null}

            <h2>
              {
                settings
                  .intro_heading
              }
            </h2>

            {settings
              .intro_description ? (
              <p>
                {
                  settings
                    .intro_description
                }
              </p>
            ) : null}
          </header>


          <div className="contactMain__layout">
            <div className="contactMain__left">

              {/* CONTACT DETAILS */}

              {settings
                .contact_details_enabled ? (
                <section className="contactDetailsSection">
                  <header>
                    <h3>
                      {
                        settings
                          .contact_details_heading
                      }
                    </h3>

                    {settings
                      .contact_details_description ? (
                      <p>
                        {
                          settings
                            .contact_details_description
                        }
                      </p>
                    ) : null}
                  </header>

                  <div className="contactDetailsGrid">
                    {details.map(
                      (
                        detail,
                      ) => {
                        const content = (
                          <>
                            <div className="contactDetailCard__icon">
                              {getIcon(
                                detail.icon_name ||
                                  detail.detail_type,
                              )}
                            </div>

                            <div>
                              <span>
                                {
                                  detail
                                    .label
                                }
                              </span>

                              <strong>
                                {
                                  detail
                                    .value
                                }
                              </strong>
                            </div>
                          </>
                        );

                        return detail.link ? (
                          <a
                            key={
                              detail.id
                            }
                            className="contactDetailCard"
                            href={
                              detail.link
                            }
                            target={
                              detail
                                .open_in_new_tab
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              detail
                                .open_in_new_tab
                                ? "noreferrer"
                                : undefined
                            }
                          >
                            {
                              content
                            }
                          </a>
                        ) : (
                          <div
                            key={
                              detail.id
                            }
                            className="contactDetailCard"
                          >
                            {
                              content
                            }
                          </div>
                        );
                      },
                    )}
                  </div>
                </section>
              ) : null}


              {/* SOCIAL LINKS */}

              {socialLinks.length >
              0 ? (
                <section className="contactSocials">
                  <span>
                    Follow Warm Life
                  </span>

                  <div>
                    {socialLinks.map(
                      (
                        link,
                      ) => (
                        <a
                          key={
                            link.id
                          }
                          href={
                            link.url
                          }
                          target={
                            link
                              .open_in_new_tab
                              ? "_blank"
                              : undefined
                          }
                          rel={
                            link
                              .open_in_new_tab
                              ? "noreferrer"
                              : undefined
                          }
                          aria-label={
                            link.label ||
                            link.platform
                          }
                        >
                          {getIcon(
                            link.icon_name ||
                              link.platform,
                          )}
                        </a>
                      ),
                    )}
                  </div>
                </section>
              ) : null}
            </div>


            {/* CONTACT FORM */}

            {settings
              .form_enabled ? (
              <section className="contactFormCard">
                <header>
                  {settings
                    .form_eyebrow ? (
                    <span>
                      {
                        settings
                          .form_eyebrow
                      }
                    </span>
                  ) : null}

                  <h3>
                    {
                      settings
                        .form_heading
                    }
                  </h3>

                  {settings
                    .form_description ? (
                    <p>
                      {
                        settings
                          .form_description
                      }
                    </p>
                  ) : null}
                </header>

                <ContactForm
                  contactPageId={
                    settings.id
                  }
                  enquiryTypes={
                    enquiryTypes
                  }
                  submitButtonText={
                    settings
                      .form_submit_button_text
                  }
                  successMessage={
                    settings
                      .form_success_message
                  }
                />
              </section>
            ) : null}
          </div>
        </div>
      </section>


      {/* ======================================================
          MAP
          ====================================================== */}

      {settings.map_enabled ? (
        <section className="contactMapSection">
          <div className="contactMapSection__inner">
            <div>
              {settings
                .map_eyebrow ? (
                <span>
                  {
                    settings
                      .map_eyebrow
                  }
                </span>
              ) : null}

              <h2>
                {
                  settings
                    .map_heading
                }
              </h2>

              {settings
                .map_description ? (
                <p>
                  {
                    settings
                      .map_description
                  }
                </p>
              ) : null}
            </div>

            {mapEmbedUrl ? (
              <div className="contactMapSection__frame">
                <iframe
                  src={
                    mapEmbedUrl
                  }
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title={
                    settings
                      .map_heading ||
                    "Warm Life Location"
                  }
                />
              </div>
            ) : (
              <div className="contactMapSection__frame">
                <div className="contactMapSection__mapError">
                  <MapPin
                    size={30}
                  />

                  <strong>
                    Map unavailable
                  </strong>

                  <p>
                    Please add a
                    valid Google
                    Maps Embed URL
                    in the Contact
                    CMS.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}


      {/* ======================================================
          CTA
          ====================================================== */}

      {settings.cta_enabled ? (
        <section className="contactCta">
          {settings
            .cta_background_image_url ? (
            <img
              className="contactCta__background"
              src={
                settings
                  .cta_background_image_url
              }
              alt={
                settings
                  .cta_background_image_alt ||
                settings
                  .cta_heading
              }
            />
          ) : null}

          <div className="contactCta__overlay" />

          <div className="contactCta__inner">
            {settings
              .cta_eyebrow ? (
              <span>
                {
                  settings
                    .cta_eyebrow
                }
              </span>
            ) : null}

            <h2>
              {
                settings
                  .cta_heading
              }
            </h2>

            {settings
              .cta_description ? (
              <p>
                {
                  settings
                    .cta_description
                }
              </p>
            ) : null}

            <div className="contactCta__actions">
              <Link
                href={
                  settings
                    .cta_primary_button_link
                }
              >
                {
                  settings
                    .cta_primary_button_text
                }

                <ArrowRight
                  size={16}
                />
              </Link>

              {settings
                .cta_secondary_button_text &&
              settings
                .cta_secondary_button_link ? (
                <Link
                  href={
                    settings
                      .cta_secondary_button_link
                  }
                  className="isSecondary"
                >
                  {
                    settings
                      .cta_secondary_button_text
                  }
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}