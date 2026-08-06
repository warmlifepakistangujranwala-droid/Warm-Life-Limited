/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/blogs/page.tsx
 *
 * Purpose :
 * Public Blog listing page.
 *
 * Version : v0.2.1
 * ============================================================
 */

import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  Clock3,
  FolderTree,
  Pin,
  Star,
  UserRound,
} from "lucide-react";

import {
  getPublishedBlogs,
} from "@/lib/actions/blogs";

import {
  getBlogsPageSettings,
} from "@/lib/actions/blogs-page";

import "./blogs.css";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

export const metadata: Metadata = {
  title:
    "Blogs | Warm Life",
  description:
    "Read practical advice, expert guidance and useful insights about heating, insulation, renewable energy and home efficiency.",
};

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "";
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

export default async function BlogsPage() {
  const [
    blogs,
    pageSettings,
  ] = await Promise.all([
    getPublishedBlogs(),
    getBlogsPageSettings(),
  ]);

  const featured =
    blogs.find(
      (blog) =>
        blog.is_featured ||
        blog.is_sticky,
    ) ?? blogs[0] ?? null;

  const remainingBlogs =
    featured
      ? blogs.filter(
          (blog) =>
            blog.id !== featured.id,
        )
      : [];

  const heroStyle = {
    "--blogs-hero-height":
      `${pageSettings?.hero_height ?? 520}px`,

    "--blogs-hero-heading-size":
      `${pageSettings?.hero_heading_size ?? 92}px`,

    "--blogs-hero-heading-size-mobile":
      `${pageSettings?.hero_heading_size_mobile ?? 50}px`,

    "--blogs-hero-overlay":
  pageSettings?.hero_overlay_opacity ?? 0.45,
  } as React.CSSProperties &
    Record<`--${string}`, string | number>;

  return (
    <main className="blogsPage">
      <section
        className="blogsHero"
        style={heroStyle}
        aria-label={
          pageSettings?.hero_background_image_alt ||
          "Warm Life Blogs"
        }
      >
        {pageSettings?.hero_background_image_url ? (
          <img
            className="blogsHero__background"
            src={pageSettings.hero_background_image_url}
            alt={
              pageSettings.hero_background_image_alt ||
              "Warm Life Blogs"
            }
          />
        ) : null}

        <div className="blogsHero__overlay" />

        <div className="blogsHero__inner">
          <span>
            {pageSettings?.hero_eyebrow ||
              "Warm Life Insights"}
          </span>

          <h1>
            {pageSettings?.hero_heading ||
              "Practical Advice for a Warmer, More Efficient Home"}
          </h1>

          <p>
            {pageSettings?.hero_description ||
              "Explore expert guidance, useful tips and practical explanations covering heating, insulation, renewable energy and home efficiency."}
          </p>
        </div>
      </section>

      <section
        className="blogsListing"
        aria-labelledby="blogs-heading"
      >
        <div className="blogsListing__inner">
          <header className="blogsListing__header">
            <div>
              <span>
                {pageSettings?.listing_eyebrow ||
                  "Latest insights"}
              </span>

              <h2 id="blogs-heading">
                {pageSettings?.listing_heading ||
                  "Warm Life Blogs"}
              </h2>
            </div>

            <p>
              {pageSettings?.listing_description ||
                "Helpful information designed to make home improvement decisions clearer."}
            </p>
          </header>

          {blogs.length === 0 ? (
            <div className="blogsListing__empty">
              <div>
                <BookOpenText size={34} />
              </div>

              <h3>
                Articles coming soon
              </h3>

              <p>
                We are preparing practical guides and
                expert advice for homeowners.
              </p>
            </div>
          ) : (
            <>
              {featured ? (
                <article className="featuredBlog">
                  <div className="featuredBlog__media">
                    {featured.featured_image_url ? (
                      <img
                        src={
                          featured.featured_image_url
                        }
                        alt={
                          featured.featured_image_alt ||
                          featured.title
                        }
                      />
                    ) : (
                      <div className="featuredBlog__fallback">
                        <BookOpenText size={42} />
                      </div>
                    )}

                    <div className="featuredBlog__badges">
                      {featured.is_sticky ? (
                        <span>
                          <Pin size={13} />
                          Sticky
                        </span>
                      ) : null}

                      {featured.is_featured ? (
                        <span>
                          <Star size={13} />
                          Featured
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="featuredBlog__content">
                    <div className="featuredBlog__meta">
                      {featured.category ? (
                        <span>
                          <FolderTree size={14} />
                          {featured.category.name}
                        </span>
                      ) : null}

                      {featured.author ? (
                        <span>
                          <UserRound size={14} />
                          {featured.author.display_name}
                        </span>
                      ) : null}

                      {featured.publish_date ? (
                        <span>
                          <CalendarDays size={14} />
                          {formatDate(
                            featured.publish_date,
                          )}
                        </span>
                      ) : null}

                      <span>
                        <Clock3 size={14} />
                        {featured.reading_time_minutes}
                        {" "}
                        min read
                      </span>
                    </div>

                    {featured.eyebrow ? (
                      <span className="featuredBlog__eyebrow">
                        {featured.eyebrow}
                      </span>
                    ) : null}

                    <h2>
                      {featured.title}
                    </h2>

                    {featured.excerpt ? (
                      <p>
                        {featured.excerpt}
                      </p>
                    ) : null}

                    {featured.show_read_button &&
                    featured.has_detail_page ? (
                      <Link
                        href={`/blogs/${featured.slug}`}
                        target={
                          featured.open_in_new_tab
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          featured.open_in_new_tab
                            ? "noreferrer"
                            : undefined
                        }
                      >
                        {featured.read_button_text ||
                          "Read Article"}

                        <ArrowRight size={17} />
                      </Link>
                    ) : null}
                  </div>
                </article>
              ) : null}

              {remainingBlogs.length > 0 ? (
                <div className="blogsGrid">
                  {remainingBlogs.map(
                    (blog) => (
                      <article
                        className="blogCard"
                        key={blog.id}
                      >
                        <div className="blogCard__media">
                          {blog.featured_image_url ? (
                            <img
                              src={
                                blog.featured_image_url
                              }
                              alt={
                                blog.featured_image_alt ||
                                blog.title
                              }
                            />
                          ) : (
                            <div className="blogCard__fallback">
                              <BookOpenText size={31} />
                            </div>
                          )}

                          {blog.is_featured ? (
                            <span className="blogCard__featured">
                              <Star size={12} />
                              Featured
                            </span>
                          ) : null}
                        </div>

                        <div className="blogCard__body">
                          <div className="blogCard__taxonomy">
                            {blog.category ? (
                              <span>
                                <FolderTree size={13} />
                                {blog.category.name}
                              </span>
                            ) : null}

                            {blog.author ? (
                              <span>
                                <UserRound size={13} />
                                {blog.author.display_name}
                              </span>
                            ) : null}
                          </div>

                          <h3>
                            {blog.title}
                          </h3>

                          {blog.excerpt ? (
                            <p>
                              {blog.excerpt}
                            </p>
                          ) : null}

                          <div className="blogCard__meta">
                            {blog.publish_date ? (
                              <span>
                                <CalendarDays size={13} />
                                {formatDate(
                                  blog.publish_date,
                                )}
                              </span>
                            ) : null}

                            <span>
                              <Clock3 size={13} />
                              {blog.reading_time_minutes}
                              {" "}
                              min read
                            </span>
                          </div>

                          {blog.show_read_button &&
                          blog.has_detail_page ? (
                            <Link
                              href={`/blogs/${blog.slug}`}
                              target={
                                blog.open_in_new_tab
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                blog.open_in_new_tab
                                  ? "noreferrer"
                                  : undefined
                              }
                            >
                              {blog.read_button_text ||
                                "Read Article"}

                              <ArrowRight size={15} />
                            </Link>
                          ) : null}
                        </div>
                      </article>
                    ),
                  )}
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </main>
  );
}