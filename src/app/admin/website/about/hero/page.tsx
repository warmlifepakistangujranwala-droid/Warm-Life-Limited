/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/about/hero/page.tsx
 *
 * Purpose :
 * Manages the About page hero settings and hero slides.
 *
 * Version : v1.1.0
 * ============================================================
 */

import Link from "next/link";
import { revalidatePath } from "next/cache";
import {
  ArrowLeft,
  Edit3,
  Eye,
  EyeOff,
  Film,
  Image as ImageIcon,
  Plus,
  Settings2,
  Trash2,
} from "lucide-react";

import {
  deleteAboutHeroSlide,
  getAboutHeroSlides,
  getAboutPageSettings,
  toggleAboutHeroSlidePublished,
} from "@/lib/actions/about-page";

import type { AboutHeroSlide } from "@/lib/types/about-page";

import "./hero.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function deleteSlideAction(formData: FormData) {
  "use server";

  const slideId = formData.get("slideId");

  if (typeof slideId !== "string" || !slideId) {
    return;
  }

  await deleteAboutHeroSlide(slideId);

  revalidatePath(
    "/admin/website/about/hero",
  );

  revalidatePath("/about");
}

async function togglePublishedAction(formData: FormData) {
  "use server";

  const slideId = formData.get("slideId");
  const published = formData.get("published");

  if (typeof slideId !== "string" || !slideId) {
    return;
  }

  await toggleAboutHeroSlidePublished(
    slideId,
    published === "true",
  );

  revalidatePath(
    "/admin/website/about/hero",
  );

  revalidatePath("/about");
}

export default async function AboutHeroManagerPage() {
  let settings = null;
  let slides: AboutHeroSlide[] = [];
  let loadError = "";

  try {
    [settings, slides] = await Promise.all([
      getAboutPageSettings(),
      getAboutHeroSlides(),
    ]);
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Unable to load About hero data.";
  }

  const publishedCount = slides.filter(
    (slide) => slide.is_published,
  ).length;

  const draftCount = slides.filter(
    (slide) => !slide.is_published,
  ).length;

  const activeCount = slides.filter(
    (slide) => slide.is_active,
  ).length;

  return (
    <div className="aboutHeroManager">
      <header className="aboutHeroManager__header">
        <div>
          <div className="aboutHeroManager__breadcrumb">
            <Link href="/admin/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <Link href="/admin/website/about">
              About Page
            </Link>

            <span>/</span>

            <strong>Hero</strong>
          </div>

          <div className="aboutHeroManager__titleRow">
            <div className="aboutHeroManager__titleIcon">
              <Film
                size={25}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <span className="aboutHeroManager__eyebrow">
                About page content
              </span>

              <h1>Hero Manager</h1>

              <p>
                Manage the About page hero type,
                media, content, typography,
                colours, layout and slider slides.
              </p>
            </div>
          </div>
        </div>

        <div className="aboutHeroManager__headerActions">
          <Link
            href="/admin/website/about"
            className="aboutHeroManager__backButton"
          >
            <ArrowLeft size={16} />
            About Page
          </Link>

          <Link
            href="/admin/website/about/hero/settings"
            className="aboutHeroManager__settingsButton"
          >
            <Settings2 size={16} />
            Hero Settings
          </Link>

          <Link
            href="/admin/website/about/hero/new"
            className="aboutHeroManager__addButton"
          >
            <Plus size={17} />
            Add Hero Slide
          </Link>
        </div>
      </header>

      {loadError ? (
        <div className="aboutHeroManager__loadError">
          <strong>
            Hero data could not be loaded.
          </strong>

          <p>{loadError}</p>

          <Link href="/admin/website/about">
            Return to About Manager
          </Link>
        </div>
      ) : null}

      <section className="aboutHeroManager__summary">
        <article className="aboutHeroSummaryCard aboutHeroSummaryCard--primary">
          <div className="aboutHeroSummaryCard__icon">
            <Film size={21} />
          </div>

          <div>
            <span>Hero type</span>
            <strong>
              {settings?.hero_type ?? "Not configured"}
            </strong>
          </div>
        </article>

        <article className="aboutHeroSummaryCard">
          <div className="aboutHeroSummaryCard__icon">
            <ImageIcon size={21} />
          </div>

          <div>
            <span>Total slides</span>
            <strong>{slides.length}</strong>
          </div>
        </article>

        <article className="aboutHeroSummaryCard">
          <div className="aboutHeroSummaryCard__icon">
            <Eye size={21} />
          </div>

          <div>
            <span>Published</span>
            <strong>{publishedCount}</strong>
          </div>
        </article>

        <article className="aboutHeroSummaryCard">
          <div className="aboutHeroSummaryCard__icon">
            <EyeOff size={21} />
          </div>

          <div>
            <span>Draft / Active</span>
            <strong>
              {draftCount} / {activeCount}
            </strong>
          </div>
        </article>
      </section>

      <section
        className="aboutHeroManager__content"
        id="hero-slides"
      >
        <div className="aboutHeroManager__sectionHeading">
          <div>
            <span>Hero slides</span>
            <h2>Manage hero media</h2>
          </div>

          <p>
            Slides appear according to their
            display order. Only active and
            published slides appear publicly.
          </p>
        </div>

        {slides.length === 0 ? (
          <div className="aboutHeroEmptyState">
            <div className="aboutHeroEmptyState__icon">
              <Film
                size={34}
                strokeWidth={1.5}
              />
            </div>

            <span>No hero slides</span>

            <h2>Create the first hero slide</h2>

            <p>
              Upload an image or video and add
              the content shown in the About
              page hero.
            </p>

            <Link
              href="/admin/website/about/hero/new"
              className="aboutHeroEmptyState__button"
            >
              <Plus size={17} />
              Add Hero Slide
            </Link>
          </div>
        ) : (
          <div className="aboutHeroManager__list">
            {slides.map((slide) => (
              <article
                className="aboutHeroSlideCard"
                key={slide.id}
              >
                <div className="aboutHeroSlideCard__media">
                  {slide.media_type === "video" &&
                  slide.video_url ? (
                    <video
                      src={slide.video_url}
                      poster={
                        slide.poster_image_url ??
                        undefined
                      }
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : slide.image_url ? (
                    <img
                      src={slide.image_url}
                      alt={slide.image_alt}
                    />
                  ) : (
                    <div className="aboutHeroSlideCard__placeholder">
                      <Film size={28} />
                      <span>No preview</span>
                    </div>
                  )}

                  <span className="aboutHeroSlideCard__order">
                    Order {slide.display_order}
                  </span>
                </div>

                <div className="aboutHeroSlideCard__body">
                  <div className="aboutHeroSlideCard__statusRow">
                    <span
                      className={
                        slide.is_published
                          ? "aboutHeroSlideCard__status isPublished"
                          : "aboutHeroSlideCard__status isDraft"
                      }
                    >
                      {slide.is_published
                        ? "Published"
                        : "Draft"}
                    </span>

                    <span
                      className={
                        slide.is_active
                          ? "aboutHeroSlideCard__active isActive"
                          : "aboutHeroSlideCard__active"
                      }
                    >
                      {slide.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <span className="aboutHeroSlideCard__type">
                    {slide.media_type}
                  </span>

                  <h3>{slide.internal_name}</h3>

                  <p>
                    {slide.heading ||
                      "No public heading configured."}
                  </p>

                  <div className="aboutHeroSlideCard__actions">
                    <Link
                      href={`/admin/website/about/hero/${slide.id}/edit`}
                      className="aboutHeroSlideCard__edit"
                    >
                      <Edit3 size={15} />
                      Edit
                    </Link>

                    <form action={togglePublishedAction}>
                      <input
                        type="hidden"
                        name="slideId"
                        value={slide.id}
                      />

                      <input
                        type="hidden"
                        name="published"
                        value={String(
                          !slide.is_published,
                        )}
                      />

                      <button
                        type="submit"
                        className="aboutHeroSlideCard__publish"
                      >
                        {slide.is_published ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}

                        {slide.is_published
                          ? "Unpublish"
                          : "Publish"}
                      </button>
                    </form>

                    <form action={deleteSlideAction}>
                      <input
                        type="hidden"
                        name="slideId"
                        value={slide.id}
                      />

                      <button
                        type="submit"
                        className="aboutHeroSlideCard__delete"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}