/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/services/page.tsx
 *
 * Purpose :
 * Renders the main Services page CMS manager and service list.
 *
 * Version : v1.1.0
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  ExternalLink,
  Film,
  Globe2,
  Plus,
  Settings2,
  Sparkles,
} from "lucide-react";

import {
  getServiceHeroSlides,
  getServices,
  getServicesPageSettings,
} from "@/lib/actions/services-page";

import "./services.css";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

export default async function ServicesManagerPage() {
  const [
    settings,
    services,
    heroSlides,
  ] = await Promise.all([
    getServicesPageSettings(),
    getServices(),
    getServiceHeroSlides(),
  ]);

  const publishedCount =
    services.filter(
      (service) =>
        service.is_published,
    ).length;

  const detailPageCount =
    services.filter(
      (service) =>
        service.has_detail_page,
    ).length;

  const featuredCount =
    services.filter(
      (service) =>
        service.is_featured,
    ).length;

  return (
    <div className="servicesManager">
      <header className="servicesManager__header">
        <div>
          <div className="servicesManager__breadcrumb">
            <Link href="/admin/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <strong>
              Services Page
            </strong>
          </div>

          <div className="servicesManager__titleRow">
            <div className="servicesManager__titleIcon">
              <Globe2 size={25} />
            </div>

            <div>
              <span>
                Website management
              </span>

              <h1>
                Services Manager
              </h1>

              <p>
                Manage the Services page hero,
                listing design and unlimited
                service detail pages.
              </p>
            </div>
          </div>
        </div>

        <div className="servicesManager__actions">
          <Link
            href="/admin/website"
            className="isSecondary"
          >
            <ArrowLeft size={16} />
            Website
          </Link>

          <Link
            href="/services"
            target="_blank"
            className="isSecondary"
          >
            <ExternalLink size={16} />
            Preview
          </Link>

          <Link
            href="/admin/website/services/new"
            className="isPrimary"
          >
            <Plus size={16} />
            Add Service
          </Link>
        </div>
      </header>

      <section className="servicesManager__stats">
        <article>
          <span>Total Services</span>
          <strong>
            {services.length}
          </strong>
        </article>

        <article>
          <span>Published</span>
          <strong>
            {publishedCount}
          </strong>
        </article>

        <article>
          <span>Detail Pages</span>
          <strong>
            {detailPageCount}
          </strong>
        </article>

        <article>
          <span>Featured</span>
          <strong>
            {featuredCount}
          </strong>
        </article>
      </section>

      <section className="servicesManager__modules">
        <Link
          href="/admin/website/services/settings"
          className="servicesModuleCard"
        >
          <Settings2 size={22} />

          <div>
            <span>
              Page settings
            </span>

            <h2>
              Hero & Listing Design
            </h2>

            <p>
              Control Services page content,
              colours, typography, spacing and
              layout.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/website/services/hero"
          className="servicesModuleCard"
        >
          <Film size={22} />

          <div>
            <span>
              Hero manager
            </span>

            <h2>
              Hero Slides
            </h2>

            <p>
              Manage image and video slides for
              the Services page hero.
            </p>

            <strong>
              {heroSlides.length} slides
            </strong>
          </div>
        </Link>
      </section>

      <section className="servicesManager__content">
        <div className="servicesManager__sectionHeading">
          <div>
            <span>
              Services content
            </span>

            <h2>
              All Services
            </h2>
          </div>

          <p>
            Add service cards and optionally
            create a complete dynamic detail
            page for each service.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="servicesManager__empty">
            <Sparkles size={32} />

            <h2>
              No services added yet
            </h2>

            <p>
              Create your first service to start
              building the public Services page.
            </p>

            <Link href="/admin/website/services/new">
              <Plus size={16} />
              Add First Service
            </Link>
          </div>
        ) : (
          <div className="servicesManager__grid">
            {services.map(
              (service) => (
                <article
                  className="serviceAdminCard"
                  key={service.id}
                >
                  <div className="serviceAdminCard__media">
                    {service.featured_image_url ? (
                      <img
                        src={
                          service.featured_image_url
                        }
                        alt={
                          service.featured_image_alt
                        }
                      />
                    ) : (
                      <div className="serviceAdminCard__placeholder">
                        <Sparkles size={26} />
                      </div>
                    )}
                  </div>

                  <div className="serviceAdminCard__body">
                    <div className="serviceAdminCard__badges">
                      <span
                        className={
                          service.is_published
                            ? "isPublished"
                            : "isDraft"
                        }
                      >
                        {service.is_published
                          ? "Published"
                          : "Draft"}
                      </span>

                      {service.has_detail_page ? (
                        <span>
                          Detail Page
                        </span>
                      ) : null}

                      {service.is_featured ? (
                        <span>
                          Featured
                        </span>
                      ) : null}
                    </div>

                    <h3>
                      {service.service_name}
                    </h3>

                    <p>
                      {service.short_description ||
                        "No short description added."}
                    </p>

                    <div className="serviceAdminCard__footer">
                      <span>
                        /services/
                        {service.slug}
                      </span>

                      <Link
                        href={`/admin/website/services/${service.id}/edit`}
                      >
                        <Edit3 size={15} />
                        Edit
                      </Link>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </section>

      {!settings ? (
        <div className="servicesManager__warning">
          Services page settings record could
          not be loaded.
        </div>
      ) : null}
    </div>
  );
}
