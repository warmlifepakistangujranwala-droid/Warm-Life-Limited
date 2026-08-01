import Link from "next/link";
import {
  BadgeCheck,
  ExternalLink,
  Import,
  MessageSquareText,
  Plus,
  Star,
  Users,
} from "lucide-react";

import { getHomepageReviewsData } from "@/lib/actions/homepage-reviews";

import DeleteReviewButton from "./DeleteReviewButton";
import GoogleImportCard from "./GoogleImportCard";
import ReviewForm from "./ReviewForm";
import SectionSettingsForm from "./SectionSettingsForm";

export const dynamic = "force-dynamic";

export default async function ReviewsAdminPage() {
  const data =
    await getHomepageReviewsData();

  const section = data.section;
  const reviews = data.reviews;
  const googleSettings =
    data.googleSettings;

  const manualReviews =
    reviews.filter(
      (review) =>
        review.source_type ===
        "manual",
    ).length;

  const googleReviews =
    reviews.filter(
      (review) =>
        review.source_type ===
        "google",
    ).length;

  const publishedReviews =
    reviews.filter(
      (review) =>
        review.is_active &&
        review.is_published,
    ).length;

  const featuredReviews =
    reviews.filter(
      (review) =>
        review.is_featured,
    ).length;

  return (
    <main className="space-y-8 p-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-800 text-white">
              <MessageSquareText
                size={23}
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-950">
                Customer Reviews
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Manage the review
                section, add customer
                feedback and import
                reviews from Google.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Homepage

              <ExternalLink
                size={16}
              />
            </Link>

            <a
              href="#add-review"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <Plus size={17} />

              Add Review
            </a>
          </div>
        </div>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Reviews"
          value={reviews.length}
          description={`${manualReviews} manual and ${googleReviews} Google`}
          icon={Users}
        />

        <SummaryCard
          title="Live Reviews"
          value={publishedReviews}
          description="Active and published"
          icon={BadgeCheck}
        />

        <SummaryCard
          title="Featured"
          value={featuredReviews}
          description="Displayed with priority"
          icon={Star}
        />

        <SummaryCard
          title="Google Reviews"
          value={googleReviews}
          description={
            googleSettings?.is_active
              ? "Import enabled"
              : "Import disabled"
          }
          icon={Import}
        />
      </section>

      {!section ? (
        <section className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm font-medium text-amber-900">
          Reviews section was not
          found. Run the simplified
          Reviews SQL setup first.
        </section>
      ) : (
        <>
          <SectionSettingsForm
            section={section}
          />

          <GoogleImportCard
            settings={
              googleSettings
            }
          />

          <section
            id="add-review"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-950">
                Add Customer Review
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Add a review manually,
                upload a customer image
                and control how it
                appears on the homepage.
              </p>
            </div>

            <ReviewForm
              sectionId={
                section.id
              }
            />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Existing Reviews
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Edit, publish,
                  feature or remove
                  customer reviews.
                </p>
              </div>

              <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                {reviews.length}{" "}
                {reviews.length === 1
                  ? "review"
                  : "reviews"}
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <MessageSquareText
                  className="mx-auto text-slate-400"
                  size={34}
                />

                <h3 className="mt-4 font-bold text-slate-900">
                  No reviews added
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Add the first review
                  using the form above.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {reviews.map(
                  (review) => (
                    <article
                      key={
                        review.id
                      }
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                    >
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border border-slate-200 bg-white">
                            {review.customer_image_url ? (
                              <img
                                src={
                                  review.customer_image_url
                                }
                                alt={
                                  review.customer_image_alt
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-bold text-emerald-800">
                                {review.customer_name
                                  .charAt(
                                    0,
                                  )
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-slate-950">
                                {
                                  review.customer_name
                                }
                              </h3>

                              {review.is_verified ? (
                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                                  Verified
                                </span>
                              ) : null}

                              {review.is_featured ? (
                                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                                  Featured
                                </span>
                              ) : null}

                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                  review.source_type ===
                                  "google"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-slate-200 text-slate-700"
                                }`}
                              >
                                {review.source_type ===
                                "google"
                                  ? "Google"
                                  : "Manual"}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                              {[
                                review.designation,
                                review.company_name,
                                review.location,
                              ]
                                .filter(
                                  Boolean,
                                )
                                .join(
                                  " • ",
                                ) ||
                                "Customer"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-1">
                          {Array.from({
                            length: 5,
                          }).map(
                            (
                              _,
                              index,
                            ) => (
                              <Star
                                key={
                                  index
                                }
                                size={
                                  17
                                }
                                className={
                                  index <
                                  Math.round(
                                    review.rating,
                                  )
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-300"
                                }
                              />
                            ),
                          )}

                          <span className="ml-2 text-sm font-bold text-slate-700">
                            {
                              review.rating
                            }
                          </span>
                        </div>

                        {review.review_title ? (
                          <h4 className="mt-4 font-bold text-slate-950">
                            {
                              review.review_title
                            }
                          </h4>
                        ) : null}

                        <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
                          {
                            review.review_text
                          }
                        </p>
                      </div>

                      <div className="border-t border-slate-200 bg-white p-4">
                        <div className="mb-3 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              review.is_active &&
                              review.is_published
                                ? "bg-green-50 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {review.is_active &&
                            review.is_published
                              ? "Live"
                              : "Hidden"}
                          </span>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            Order{" "}
                            {
                              review.display_order
                            }
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Link
                            href={`/admin/website/homepage/reviews/${review.id}/edit`}
                            className="inline-flex items-center justify-center rounded-xl border border-emerald-700 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                          >
                            Edit Review
                          </Link>

                          <DeleteReviewButton
                            reviewId={
                              review.id
                            }
                            customerName={
                              review.customer_name
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
        </>
      )}
    </main>
  );
}
type SummaryCardProps = {
  title: string;
  value: number;
  description: string;
  icon: React.ComponentType<{
    size?: number;
  }>;
};

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: SummaryCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-950">
            {value}
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800">
          <Icon size={20} />
        </div>
      </div>
    </article>
  );
}