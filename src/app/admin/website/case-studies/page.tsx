/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/case-studies/page.tsx
 *
 * Purpose :
 * Displays and manages all Case Studies CMS records.
 *
 * Version : v0.1.0
 * ============================================================
 */

import Link from "next/link";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Eye,
  EyeOff,
  FilePlus2,
  Image,
  MapPin,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

import {
  deleteCaseStudy,
  getCaseStudies,
  setCaseStudyPublished,
} from "@/lib/actions/case-studies";

import "./case-studies-manager.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(value),
  );
}

async function togglePublishAction(
  formData: FormData,
): Promise<void> {
  "use server";

  const id =
    String(
      formData.get("id") ?? "",
    );

  const nextValue =
    String(
      formData.get(
        "nextPublished",
      ) ?? "",
    ) === "true";

  await setCaseStudyPublished(
    id,
    nextValue,
  );
}

async function deleteCaseStudyAction(
  formData: FormData,
): Promise<void> {
  "use server";

  const id =
    String(
      formData.get("id") ?? "",
    );

  await deleteCaseStudy(id);
}

export default async function CaseStudiesManagerPage() {
  const caseStudies =
    await getCaseStudies();

  const publishedCount =
    caseStudies.filter(
      (item) =>
        item.is_published,
    ).length;

  const featuredCount =
    caseStudies.filter(
      (item) =>
        item.is_featured,
    ).length;

  return (
    <div className="caseStudiesManager">
      <header className="caseStudiesManager__header">
        <div>
          <div className="caseStudiesManager__eyebrow">
            Website content
          </div>

          <div className="caseStudiesManager__titleRow">
            <div className="caseStudiesManager__titleIcon">
              <BriefcaseBusiness
                size={25}
              />
            </div>

            <div>
              <h1>
                Case Studies Manager
              </h1>

              <p>
                Create, organise and publish
                project case studies with
                dynamic detail pages.
              </p>
            </div>
          </div>
        </div>

        <div className="caseStudiesManager__headerActions">
  <Link
    href="/admin/website/case-studies/hero"
    className="caseStudiesManager__heroButton"
  >
    <Image size={17} />
    Hero Settings
  </Link>

  <Link
    href="/admin/website/case-studies/new"
    className="caseStudiesManager__addButton"
  >
    <FilePlus2 size={17} />
    Add Case Study
  </Link>
</div>
      </header>

      <section className="caseStudiesManager__summary">
        <article>
          <span>Total</span>
          <strong>
            {caseStudies.length}
          </strong>
          <small>
            All case studies
          </small>
        </article>

        <article>
          <span>Published</span>
          <strong>
            {publishedCount}
          </strong>
          <small>
            Visible publicly
          </small>
        </article>

        <article>
          <span>Featured</span>
          <strong>
            {featuredCount}
          </strong>
          <small>
            Priority projects
          </small>
        </article>
      </section>

      {caseStudies.length === 0 ? (
        <section className="caseStudiesManager__empty">
          <div>
            <BriefcaseBusiness
              size={33}
            />
          </div>

          <h2>
            No case studies yet
          </h2>

          <p>
            Add your first completed
            project and create its
            detailed public case study.
          </p>

          <Link href="/admin/website/case-studies/new">
            <FilePlus2 size={16} />
            Add First Case Study
          </Link>
        </section>
      ) : (
        <section className="caseStudiesManager__grid">
          {caseStudies.map(
            (caseStudy) => (
              <article
                className="caseStudyAdminCard"
                key={caseStudy.id}
              >
                <div className="caseStudyAdminCard__media">
                  {caseStudy.featured_image_url ? (
                    <img
                      src={
                        caseStudy.featured_image_url
                      }
                      alt={
                        caseStudy.featured_image_alt ||
                        caseStudy.title
                      }
                    />
                  ) : (
                    <div className="caseStudyAdminCard__fallback">
                      <BriefcaseBusiness
                        size={30}
                      />
                    </div>
                  )}

                  <div className="caseStudyAdminCard__badges">
                    <span
                      className={
                        caseStudy.is_published
                          ? "isPublished"
                          : "isDraft"
                      }
                    >
                      {caseStudy.is_published
                        ? "Published"
                        : "Draft"}
                    </span>

                    {caseStudy.is_featured ? (
                      <span className="isFeatured">
                        <Star size={12} />
                        Featured
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="caseStudyAdminCard__content">
                  {caseStudy.eyebrow ? (
                    <span className="caseStudyAdminCard__eyebrow">
                      {caseStudy.eyebrow}
                    </span>
                  ) : null}

                  <h2>
                    {caseStudy.title}
                  </h2>

                  {caseStudy.short_description ? (
                    <p>
                      {caseStudy.short_description}
                    </p>
                  ) : null}

                  <div className="caseStudyAdminCard__meta">
                    {caseStudy.location ? (
                      <span>
                        <MapPin size={14} />
                        {caseStudy.location}
                      </span>
                    ) : null}

                    <span>
                      <CalendarDays
                        size={14}
                      />
                      {formatDate(
                        caseStudy.completion_date,
                      )}
                    </span>
                  </div>

                  <div className="caseStudyAdminCard__status">
                    <span>
                      Detail page
                    </span>

                    <strong>
                      {caseStudy.has_detail_page
                        ? "Enabled"
                        : "Disabled"}
                    </strong>
                  </div>
                </div>

                <footer className="caseStudyAdminCard__actions">
                  <Link
                    href={`/admin/website/case-studies/${caseStudy.id}/edit`}
                    title="Edit case study"
                  >
                    <Pencil size={15} />
                    Edit
                  </Link>

                  {caseStudy.has_detail_page &&
                  caseStudy.is_published ? (
                    <Link
                      href={`/case-studies/${caseStudy.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      title="View public case study"
                    >
                      <ArrowUpRight
                        size={15}
                      />
                      View
                    </Link>
                  ) : null}

                  <form
                    action={
                      togglePublishAction
                    }
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={caseStudy.id}
                    />

                    <input
                      type="hidden"
                      name="nextPublished"
                      value={String(
                        !caseStudy.is_published,
                      )}
                    />

                    <button
                      type="submit"
                      className="isPublish"
                      title={
                        caseStudy.is_published
                          ? "Unpublish"
                          : "Publish"
                      }
                    >
                      {caseStudy.is_published ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}

                      {caseStudy.is_published
                        ? "Unpublish"
                        : "Publish"}
                    </button>
                  </form>

                  <form
                    action={
                      deleteCaseStudyAction
                    }
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={caseStudy.id}
                    />

                    <button
                      type="submit"
                      className="isDelete"
                      title="Delete case study"
                    >
                      <Trash2 size={15} />
                    </button>
                  </form>
                </footer>
              </article>
            ),
          )}
        </section>
      )}
    </div>
  );
}
