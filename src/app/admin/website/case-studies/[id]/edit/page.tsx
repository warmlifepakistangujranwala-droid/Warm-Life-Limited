/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/case-studies/[id]/edit/page.tsx
 *
 * Purpose :
 * Loads an existing case study and its dynamic content counts,
 * then renders the shared Add/Edit Case Study form.
 *
 * Version : v0.5.0
 * ============================================================
 */

import Link from "next/link";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Edit3,
  GalleryHorizontalEnd,
  ListChecks,
  Quote,
  Route,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import {
  getCaseStudyById,
  getCaseStudyFacts,
  getCaseStudyGallery,
  getCaseStudyRelatedServices,
  getCaseStudyTestimonials,
  getCaseStudyTimeline,
} from "@/lib/actions/case-studies";

import {
  getServices,
} from "@/lib/actions/services-page";

import CaseStudyForm from "../../new/CaseStudyForm";
import FactsManager from "./dynamic-content/FactsManager";
import TimelineManager from "./dynamic-content/TimelineManager";
import GalleryManager from "./dynamic-content/GalleryManager";
import RelatedServicesManager from "./dynamic-content/RelatedServicesManager";

import "../../new/case-study-form.css";
import "./edit-case-study.css";
import "./dynamic-content/dynamic-content.css";

type EditCaseStudyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditCaseStudyPage({
  params,
}: EditCaseStudyPageProps) {
  const { id } = await params;

  const caseStudy =
    await getCaseStudyById(id);

  if (!caseStudy) {
    notFound();
  }

  const [
    facts,
    timeline,
    galleryItems,
    testimonials,
    relatedServices,
    services,
  ] = await Promise.all([
    getCaseStudyFacts(
      caseStudy.id,
    ),

    getCaseStudyTimeline(
      caseStudy.id,
    ),

    getCaseStudyGallery(
      caseStudy.id,
    ),

    getCaseStudyTestimonials(
      caseStudy.id,
    ),

    getCaseStudyRelatedServices(
      caseStudy.id,
    ),

    getServices(),
  ]);

  return (
    <div className="caseStudyFormPage">
      <header className="caseStudyFormPage__header">
        <div>
          <div className="caseStudyFormPage__breadcrumb">
            <Link href="/admin/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <Link href="/admin/website/case-studies">
              Case Studies
            </Link>

            <span>/</span>

            <strong>
              Edit Case Study
            </strong>
          </div>

          <div className="caseStudyFormPage__titleRow">
            <div className="caseStudyFormPage__titleIcon">
              <Edit3 size={25} />
            </div>

            <div>
              <span>
                Website content
              </span>

              <h1>
                Edit {caseStudy.title}
              </h1>

              <p>
                Update the project card,
                detail page, media and
                dynamic project content.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/website/case-studies"
          className="caseStudyFormPage__back"
        >
          <ArrowLeft size={16} />
          Case Studies Manager
        </Link>
      </header>

      <section className="caseStudyEditSummary">
        <article>
          <div>
            <BriefcaseBusiness
              size={19}
            />
          </div>

          <span>
            Status
          </span>

          <strong>
            {caseStudy.is_published
              ? "Published"
              : "Draft"}
          </strong>
        </article>

        <article>
          <div>
            <ListChecks size={19} />
          </div>

          <span>
            Project Facts
          </span>

          <strong>
            {facts.length}
          </strong>
        </article>

        <article>
          <div>
            <Route size={19} />
          </div>

          <span>
            Timeline Items
          </span>

          <strong>
            {timeline.length}
          </strong>
        </article>

        <article>
          <div>
            <GalleryHorizontalEnd
              size={19}
            />
          </div>

          <span>
            Gallery Images
          </span>

          <strong>
            {galleryItems.length}
          </strong>
        </article>

        <article>
          <div>
            <Quote size={19} />
          </div>

          <span>
            Testimonials
          </span>

          <strong>
            {testimonials.length}
          </strong>
        </article>

        <article>
          <div>
            <BriefcaseBusiness
              size={19}
            />
          </div>

          <span>
            Related Services
          </span>

          <strong>
            {relatedServices.length}
          </strong>
        </article>
      </section>

      <CaseStudyForm
        initialCaseStudy={caseStudy}
      />

      {caseStudy.has_detail_page ? (
        <section
          id="dynamic-content"
          className="caseStudyDynamicManagers"
        >
          {caseStudy.facts_enabled ? (
            <FactsManager
              caseStudyId={caseStudy.id}
              initialItems={facts}
            />
          ) : null}

          {caseStudy.timeline_enabled ? (
            <TimelineManager
              caseStudyId={caseStudy.id}
              initialItems={timeline}
            />
          ) : null}

          {caseStudy.gallery_enabled ? (
            <GalleryManager
              caseStudyId={caseStudy.id}
              initialItems={galleryItems}
            />
          ) : null}

          {caseStudy.related_services_enabled ? (
            <RelatedServicesManager
              caseStudyId={caseStudy.id}
              initialItems={relatedServices}
              availableServices={services.map(
                (service) => ({
                  id: service.id,
                  service_name:
                    service.service_name,
                  slug: service.slug,
                }),
              )}
            />
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
