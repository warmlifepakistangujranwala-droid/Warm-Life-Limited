/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/services/hero/page.tsx
 *
 * Purpose :
 * Renders the Services page hero slide manager.
 *
 * Version : v1.0.0
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  Film,
  Image as ImageIcon,
  Plus,
} from "lucide-react";

import {
  getServiceHeroSlides,
  getServicesPageSettings,
} from "@/lib/actions/services-page";

import HeroSlideActions from "./HeroSlideActions";
import "./hero.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ServicesHeroManagerPage() {
  const [
    settings,
    slides,
  ] = await Promise.all([
    getServicesPageSettings(),
    getServiceHeroSlides(),
  ]);

  return (
    <div className="servicesHeroManager">
      <header className="servicesHeroManager__header">
        <div>
          <div className="servicesHeroManager__breadcrumb">
            <Link href="/admin/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <Link href="/admin/website/services">
              Services
            </Link>

            <span>/</span>

            <strong>
              Hero Manager
            </strong>
          </div>

          <div className="servicesHeroManager__titleRow">
            <div className="servicesHeroManager__titleIcon">
              <Film size={25} />
            </div>

            <div>
              <span>
                Services page hero
              </span>

              <h1>
                Hero Slides
              </h1>

              <p>
                Manage image and video slides used
                by the Services page hero.
              </p>
            </div>
          </div>
        </div>

        <div className="servicesHeroManager__actions">
          <Link
            href="/admin/website/services"
            className="isSecondary"
          >
            <ArrowLeft size={16} />
            Services Manager
          </Link>

          <Link
            href="/admin/website/services/hero/new"
            className="isPrimary"
          >
            <Plus size={16} />
            Add Hero Slide
          </Link>
        </div>
      </header>

      <section className="servicesHeroManager__summary">
        <article>
          <span>Hero type</span>
          <strong>
            {settings?.hero_type ?? "Unknown"}
          </strong>
        </article>

        <article>
          <span>Total slides</span>
          <strong>
            {slides.length}
          </strong>
        </article>

        <article>
          <span>Published</span>
          <strong>
            {
              slides.filter(
                (slide) =>
                  slide.is_published,
              ).length
            }
          </strong>
        </article>

        <article>
          <span>Active</span>
          <strong>
            {
              slides.filter(
                (slide) =>
                  slide.is_active,
              ).length
            }
          </strong>
        </article>
      </section>

      <section className="servicesHeroManager__content">
        <div className="servicesHeroManager__sectionHeading">
          <div>
            <span>
              Hero content
            </span>

            <h2>
              All Hero Slides
            </h2>
          </div>

          <p>
            Slides appear according to display
            order. Only active and published
            slides appear on the public page.
          </p>
        </div>

        {slides.length === 0 ? (
          <div className="servicesHeroManager__empty">
            <Film size={34} />

            <h2>
              No hero slides added
            </h2>

            <p>
              Add the first image or video slide
              for the Services page hero.
            </p>

            <Link href="/admin/website/services/hero/new">
              <Plus size={16} />
              Add First Slide
            </Link>
          </div>
        ) : (
          <div className="servicesHeroManager__grid">
            {slides.map(
              (slide) => (
                <article
                  className="servicesHeroCard"
                  key={slide.id}
                >
                  <div className="servicesHeroCard__media">
                    {slide.media_type ===
                      "video" &&
                    slide.video_url ? (
                      <video
                        src={slide.video_url}
                        poster={
                          slide.poster_image_url ??
                          undefined
                        }
                        muted
                      />
                    ) : slide.image_url ? (
                      <img
                        src={slide.image_url}
                        alt={slide.image_alt}
                      />
                    ) : (
                      <div className="servicesHeroCard__placeholder">
                        {slide.media_type ===
                        "video" ? (
                          <Film size={28} />
                        ) : (
                          <ImageIcon size={28} />
                        )}
                      </div>
                    )}

                    <span className="servicesHeroCard__type">
                      {slide.media_type}
                    </span>
                  </div>

                  <div className="servicesHeroCard__body">
                    <div className="servicesHeroCard__badges">
                      <span
                        className={
                          slide.is_published
                            ? "isPublished"
                            : "isDraft"
                        }
                      >
                        {slide.is_published
                          ? "Published"
                          : "Draft"}
                      </span>

                      <span>
                        Order {slide.display_order}
                      </span>

                      {!slide.is_active ? (
                        <span className="isInactive">
                          Inactive
                        </span>
                      ) : null}
                    </div>

                    <span className="servicesHeroCard__internal">
                      {slide.internal_name}
                    </span>

                    <h3>{slide.heading}</h3>

                    <p>
                      {slide.description ||
                        "No description added."}
                    </p>

                    <div className="servicesHeroCard__footer">
                      <Link
                        href={`/admin/website/services/hero/${slide.id}/edit`}
                      >
                        <Edit3 size={15} />
                        Edit Slide
                      </Link>

                      <HeroSlideActions
                        slideId={slide.id}
                        isPublished={
                          slide.is_published
                        }
                      />
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}
