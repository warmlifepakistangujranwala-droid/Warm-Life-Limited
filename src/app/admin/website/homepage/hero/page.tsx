import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Edit3,
  Eye,
  EyeOff,
  Film,
  Home,
  ListVideo,
  Plus,
  Trash2,
} from "lucide-react";

import {
  deleteHeroSlide,
  getHeroSlides,
  setHeroPublished,
} from "@/lib/actions/hero";

import { getHeroSlideStatusLabel } from "@/lib/types/hero";

import "./hero.css";

async function deleteHeroAction(formData: FormData) {
  "use server";

  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return;
  }

  await deleteHeroSlide(id);
}

async function publishHeroAction(formData: FormData) {
  "use server";

  const id = formData.get("id");
  const published = formData.get("published");

  if (typeof id !== "string" || !id) {
    return;
  }

  await setHeroPublished(id, published === "true");
}

export default async function HeroManagerPage() {
  const heroSlides = await getHeroSlides();

  const publishedCount = heroSlides.filter(
    (slide) => slide.is_published,
  ).length;

  const draftCount = heroSlides.filter(
    (slide) => !slide.is_published,
  ).length;

  const activeCount = heroSlides.filter(
    (slide) => slide.is_active,
  ).length;

  return (
    <div className="heroManager">
      <header className="heroManager__header">
        <div>
          <div className="heroManager__breadcrumb">
            <Link href="/admin/dashboard">Dashboard</Link>
            <span>/</span>

            <Link href="/admin/website/homepage">
              Homepage
            </Link>

            <span>/</span>
            <strong>Hero</strong>
          </div>

          <div className="heroManager__titleRow">
            <div className="heroManager__titleIcon">
              <ListVideo size={25} strokeWidth={1.8} />
            </div>

            <div>
              <span className="heroManager__eyebrow">
                Homepage content
              </span>

              <h1>Hero Manager</h1>

              <p>
                Add, organise and publish the videos and content displayed
                inside the Warm Life homepage hero section.
              </p>
            </div>
          </div>
        </div>

        <div className="heroManager__headerActions">
          <Link
            href="/admin/website/homepage"
            className="heroManager__backButton"
          >
            <ArrowLeft size={16} />
            Homepage
          </Link>

          <Link
            href="/admin/website/homepage/hero/new"
            className="heroManager__addButton"
          >
            <Plus size={17} />
            Add Hero Video
          </Link>
        </div>
      </header>

      <section className="heroManager__summary">
        <article className="heroSummaryCard heroSummaryCard--primary">
          <div className="heroSummaryCard__icon">
            <Film size={21} />
          </div>

          <div>
            <span>Total hero videos</span>
            <strong>{heroSlides.length}</strong>
          </div>
        </article>

        <article className="heroSummaryCard">
          <div className="heroSummaryCard__icon">
            <Eye size={21} />
          </div>

          <div>
            <span>Published</span>
            <strong>{publishedCount}</strong>
          </div>
        </article>

        <article className="heroSummaryCard">
          <div className="heroSummaryCard__icon">
            <EyeOff size={21} />
          </div>

          <div>
            <span>Draft</span>
            <strong>{draftCount}</strong>
          </div>
        </article>

        <article className="heroSummaryCard">
          <div className="heroSummaryCard__icon">
            <Home size={21} />
          </div>

          <div>
            <span>Active</span>
            <strong>{activeCount}</strong>
          </div>
        </article>
      </section>

      <section className="heroManager__content">
        <div className="heroManager__sectionHeading">
          <div>
            <span>Hero slides</span>
            <h2>Manage hero content</h2>
          </div>

          <p>
            Hero slides appear according to their display order. Only active
            and published slides will eventually appear on the public website.
          </p>
        </div>

        {heroSlides.length === 0 ? (
          <div className="heroEmptyState">
            <div className="heroEmptyState__icon">
              <Film size={34} strokeWidth={1.5} />
            </div>

            <span>No hero videos</span>

            <h2>Create your first hero slide</h2>

            <p>
              Upload a hero video and add the heading, description and action
              buttons shown on the homepage.
            </p>

            <Link
              href="/admin/website/homepage/hero/new"
              className="heroEmptyState__button"
            >
              <Plus size={17} />
              Add Hero Video
            </Link>
          </div>
        ) : (
          <div className="heroManager__list">
            {heroSlides.map((slide) => {
              const status = getHeroSlideStatusLabel(slide);

              return (
                <article
                  className="heroSlideCard"
                  key={slide.id}
                >
                  <div className="heroSlideCard__media">
                    {slide.video_poster_url ? (
                      <img
                        src={slide.video_poster_url}
                        alt={slide.title_line_one}
                      />
                    ) : slide.video_url ? (
                      <video
                        src={slide.video_url}
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <div className="heroSlideCard__placeholder">
                        <Film size={28} />
                        <span>No preview</span>
                      </div>
                    )}

                    <span className="heroSlideCard__order">
                      Order {slide.display_order}
                    </span>

                    <span
                      className={`heroSlideCard__status heroSlideCard__status--${status.toLowerCase()}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="heroSlideCard__body">
                    <div className="heroSlideCard__heading">
                      <div>
                        {slide.eyebrow && (
                          <span className="heroSlideCard__eyebrow">
                            {slide.eyebrow}
                          </span>
                        )}

                        <h3>
                          {slide.title_line_one}

                          {slide.title_line_two && (
                            <>
                              <br />
                              <span>{slide.title_line_two}</span>
                            </>
                          )}
                        </h3>
                      </div>

                      <span
                        className={`heroSlideCard__active ${
                          slide.is_active ? "isActive" : "isInactive"
                        }`}
                      >
                        {slide.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {slide.description && (
                      <p className="heroSlideCard__description">
                        {slide.description}
                      </p>
                    )}

                    <div className="heroSlideCard__details">
                      <div>
                        <span>Primary button</span>
                        <strong>
                          {slide.primary_button_text || "Not configured"}
                        </strong>
                      </div>

                      <div>
                        <span>Secondary button</span>
                        <strong>
                          {slide.secondary_button_text || "Not configured"}
                        </strong>
                      </div>

                      <div>
                        <span>Display order</span>
                        <strong>{slide.display_order}</strong>
                      </div>
                    </div>

                    <div className="heroSlideCard__footer">
                      <div className="heroSlideCard__dates">
                        <span>
                          Created{" "}
                          {new Date(slide.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      <div className="heroSlideCard__actions">
                        <form action={publishHeroAction}>
                          <input
                            type="hidden"
                            name="id"
                            value={slide.id}
                          />

                          <input
                            type="hidden"
                            name="published"
                            value={
                              slide.is_published ? "false" : "true"
                            }
                          />

                          <button
                            type="submit"
                            className="heroSlideCard__publishButton"
                          >
                            {slide.is_published ? (
                              <>
                                <EyeOff size={15} />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Eye size={15} />
                                Publish
                              </>
                            )}
                          </button>
                        </form>

                        <Link
                          href={`/admin/website/homepage/hero/${slide.id}`}
                          className="heroSlideCard__editButton"
                        >
                          <Edit3 size={15} />
                          Edit
                        </Link>

                        <form action={deleteHeroAction}>
                          <input
                            type="hidden"
                            name="id"
                            value={slide.id}
                          />

                          <button
                            type="submit"
                            className="heroSlideCard__deleteButton"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="heroManager__bottomAction">
          <Link href="/admin/website/homepage/hero/new">
            Add another hero video
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}