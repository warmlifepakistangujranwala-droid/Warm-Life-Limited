/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/blogs/[slug]/page.tsx
 *
 * Purpose :
 * Public dynamic Blog detail page.
 *
 * Version : v0.1.0
 * ============================================================
 */

import type {
  Metadata,
} from "next";

import type {
  CSSProperties,
} from "react";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FolderTree,
  Info,
  Lightbulb,
  ListChecks,
  Quote,
  UserRound,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import {
  getPublishedBlogDetailData,
} from "@/lib/actions/blogs";

import type {
  BlogContentBlock,
  BlogHighlight,
} from "@/lib/types/blogs";

import "./blog-detail.css";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type BlogStyle =
  CSSProperties &
  Record<`--${string}`, string | number>;

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
      month: "long",
      year: "numeric",
    },
  ).format(
    new Date(value),
  );
}

function splitLines(
  value: string | null,
): string[] {
  return (
    value
      ?.split("\n")
      .map(
        (item) =>
          item.trim(),
      )
      .filter(Boolean) ?? []
  );
}

function renderContentBlock(
  block: BlogContentBlock,
) {
  if (
    !block.is_active ||
    !block.is_published
  ) {
    return null;
  }

  if (
    block.block_type ===
    "heading"
  ) {
    const level =
      block.heading_level ?? 2;

    const heading =
      block.heading ||
      block.content ||
      "";

    if (!heading) {
      return null;
    }

    if (level === 3) {
      return <h3>{heading}</h3>;
    }

    if (level === 4) {
      return <h4>{heading}</h4>;
    }

    if (level === 5) {
      return <h5>{heading}</h5>;
    }

    if (level === 6) {
      return <h6>{heading}</h6>;
    }

    return <h2>{heading}</h2>;
  }

  if (
    block.block_type ===
    "paragraph"
  ) {
    return (
      <section className="blogContentBlock blogContentBlock--paragraph">
        {block.heading ? (
          <h2>
            {block.heading}
          </h2>
        ) : null}

        {splitLines(
          block.content,
        ).map(
          (paragraph, index) => (
            <p key={index}>
              {paragraph}
            </p>
          ),
        )}
      </section>
    );
  }

  if (
    block.block_type ===
    "image"
  ) {
    if (!block.image_url) {
      return null;
    }

    return (
      <figure className="blogContentBlock blogContentBlock--image">
        <img
          src={block.image_url}
          alt={
            block.image_alt ||
            block.heading ||
            ""
          }
        />

        {block.image_caption ? (
          <figcaption>
            {block.image_caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (
    block.block_type ===
    "quote"
  ) {
    return (
      <blockquote className="blogContentBlock blogContentBlock--quote">
        <Quote size={28} />

        <p>
          {block.content}
        </p>

        {block.quote_author ? (
          <footer>
            <strong>
              {block.quote_author}
            </strong>

            {block.quote_role ? (
              <span>
                {block.quote_role}
              </span>
            ) : null}
          </footer>
        ) : null}
      </blockquote>
    );
  }

  if (
    block.block_type ===
    "video"
  ) {
    if (!block.video_url) {
      return null;
    }

    return (
      <section className="blogContentBlock blogContentBlock--video">
        {block.heading ? (
          <h2>
            {block.heading}
          </h2>
        ) : null}

        <video
          controls
          preload="metadata"
          poster={
            block.video_poster_url ||
            undefined
          }
        >
          <source
            src={block.video_url}
          />
        </video>
      </section>
    );
  }

  if (
    block.block_type ===
    "checklist"
  ) {
    return (
      <section className="blogContentBlock blogContentBlock--list">
        {block.heading ? (
          <h2>
            {block.heading}
          </h2>
        ) : null}

        <ul>
          {splitLines(
            block.content,
          ).map(
            (item, index) => (
              <li key={index}>
                <CheckCircle2
                  size={18}
                />

                <span>
                  {item}
                </span>
              </li>
            ),
          )}
        </ul>
      </section>
    );
  }

  if (
    block.block_type ===
    "numbered_list"
  ) {
    return (
      <section className="blogContentBlock blogContentBlock--numbered">
        {block.heading ? (
          <h2>
            {block.heading}
          </h2>
        ) : null}

        <ol>
          {splitLines(
            block.content,
          ).map(
            (item, index) => (
              <li key={index}>
                {item}
              </li>
            ),
          )}
        </ol>
      </section>
    );
  }

  if (
    block.block_type ===
    "table"
  ) {
    const rows =
      splitLines(
        block.content,
      ).map((row) =>
        row
          .split(",")
          .map(
            (cell) =>
              cell.trim(),
          ),
      );

    if (rows.length === 0) {
      return null;
    }

    const [
      headerRow,
      ...bodyRows
    ] = rows;

    return (
      <section className="blogContentBlock blogContentBlock--table">
        {block.heading ? (
          <h2>
            {block.heading}
          </h2>
        ) : null}

        <div>
          <table>
            <thead>
              <tr>
                {headerRow.map(
                  (cell, index) => (
                    <th key={index}>
                      {cell}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {bodyRows.map(
                (row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map(
                      (
                        cell,
                        cellIndex,
                      ) => (
                        <td
                          key={
                            cellIndex
                          }
                        >
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (
    block.block_type ===
    "code"
  ) {
    return (
      <section className="blogContentBlock blogContentBlock--code">
        {block.heading ? (
          <h2>
            {block.heading}
          </h2>
        ) : null}

        <pre>
          <code>
            {block.content}
          </code>
        </pre>
      </section>
    );
  }

  if (
    block.block_type ===
    "callout"
  ) {
    return (
      <aside
        className={`blogContentBlock blogContentBlock--callout is-${
          block.callout_style ||
          "information"
        }`}
      >
        <Info size={22} />

        <div>
          {block.heading ? (
            <h3>
              {block.heading}
            </h3>
          ) : null}

          <p>
            {block.content}
          </p>
        </div>
      </aside>
    );
  }

  return null;
}

function HighlightSection({
  title,
  items,
  type,
}: {
  title: string;
  items: BlogHighlight[];
  type:
    | "takeaway"
    | "tip";
}) {
  const visibleItems =
    items.filter(
      (item) =>
        item.highlight_type ===
          type &&
        item.is_active &&
        item.is_published,
    );

  if (
    visibleItems.length === 0
  ) {
    return null;
  }

  return (
    <section
      className={`blogHighlights is-${type}`}
    >
      <header>
        <span>
          {type === "takeaway"
            ? "Article summary"
            : "Practical guidance"}
        </span>

        <h2>
          {title}
        </h2>
      </header>

      <div className="blogHighlights__grid">
        {visibleItems.map(
          (item) => (
            <article
              key={item.id}
            >
              <div>
                {type ===
                "takeaway" ? (
                  <CheckCircle2
                    size={21}
                  />
                ) : (
                  <Lightbulb
                    size={21}
                  />
                )}
              </div>

              {item.title ? (
                <h3>
                  {item.title}
                </h3>
              ) : null}

              <p>
                {item.description}
              </p>
            </article>
          ),
        )}
      </div>
    </section>
  );
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } =
    await params;

  const { blog } =
    await getPublishedBlogDetailData(
      slug,
    );

  if (!blog) {
    return {
      title:
        "Blog Not Found | Warm Life",
    };
  }

  const title =
    blog.seo_title ||
    blog.title;

  const description =
    blog.meta_description ||
    blog.excerpt ||
    blog.introduction ||
    undefined;

  const canonical =
    blog.canonical_url ||
    `/blogs/${blog.slug}`;

  const ogImage =
    blog.og_image_url ||
    blog.featured_image_url ||
    blog.hero_image_url ||
    undefined;

  const twitterImage =
    blog.twitter_image_url ||
    ogImage;

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    robots: {
      index:
        !blog.no_index,

      follow:
        !blog.no_follow,
    },

    openGraph: {
      type: "article",
      title:
        blog.og_title ||
        title,
      description:
        blog.og_description ||
        description,
      url: canonical,
      publishedTime:
        blog.publish_date ||
        undefined,
      authors:
        blog.author
          ? [
              blog.author
                .display_name,
            ]
          : undefined,
      images:
        ogImage
          ? [
              {
                url: ogImage,
                alt:
                  blog.og_image_alt ||
                  blog.featured_image_alt ||
                  blog.title,
              },
            ]
          : undefined,
    },

    twitter: {
      card:
        "summary_large_image",
      title:
        blog.twitter_title ||
        blog.og_title ||
        title,
      description:
        blog.twitter_description ||
        blog.og_description ||
        description,
      images:
        twitterImage
          ? [twitterImage]
          : undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } =
    await params;

  const {
    blog,
    contentBlocks,
    highlights,
    galleryItems,
    faqs,
    relatedServices,
    relatedBlogs,
  } =
    await getPublishedBlogDetailData(
      slug,
    );

  if (!blog) {
    notFound();
  }

  const style: BlogStyle = {
    "--blog-hero-heading-size":
      `${blog.hero_heading_size}px`,

    "--blog-hero-heading-size-mobile":
      `${blog.hero_heading_size_mobile}px`,

    "--blog-section-heading-size":
      `${blog.section_heading_size}px`,

    "--blog-section-heading-size-mobile":
      `${blog.section_heading_size_mobile}px`,

    "--blog-card-heading-size":
      `${blog.card_heading_size}px`,

    "--blog-cta-heading-size":
      `${blog.cta_heading_size}px`,

    "--blog-cta-heading-size-mobile":
      `${blog.cta_heading_size_mobile}px`,
  };

  const articleSchema = {
    "@context":
      "https://schema.org",
    "@type":
      "BlogPosting",
    headline:
      blog.title,
    description:
      blog.meta_description ||
      blog.excerpt ||
      blog.introduction ||
      undefined,
    image:
      blog.featured_image_url ||
      blog.hero_image_url ||
      undefined,
    datePublished:
      blog.publish_date ||
      undefined,
    dateModified:
      blog.updated_at,
    author:
      blog.author
        ? {
            "@type":
              "Person",
            name:
              blog.author
                .display_name,
          }
        : undefined,
    publisher: {
      "@type":
        "Organization",
      name:
        "Warm Life",
    },
    mainEntityOfPage:
      `/blogs/${blog.slug}`,
  };

  const visibleFaqs =
    faqs.filter(
      (faq) =>
        faq.is_active &&
        faq.is_published,
    );

  const faqSchema =
    visibleFaqs.length > 0
      ? {
          "@context":
            "https://schema.org",
          "@type":
            "FAQPage",
          mainEntity:
            visibleFaqs.map(
              (faq) => ({
                "@type":
                  "Question",
                name:
                  faq.question,
                acceptedAnswer: {
                  "@type":
                    "Answer",
                  text:
                    faq.answer,
                },
              }),
            ),
        }
      : null;

  return (
    <main
      className="blogDetailPage"
      style={style}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              articleSchema,
            ),
        }}
      />

      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                faqSchema,
              ),
          }}
        />
      ) : null}

      <section
        className={`blogDetailHero is-${blog.hero_type}`}
      >
        {blog.hero_type ===
          "video" &&
        blog.hero_video_url ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={
              blog.hero_poster_url ||
              undefined
            }
          >
            <source
              src={
                blog.hero_video_url
              }
            />
          </video>
        ) : blog.hero_image_url ||
          blog.featured_image_url ? (
          <img
            src={
              blog.hero_image_url ||
              blog.featured_image_url ||
              ""
            }
            alt={
              blog.hero_image_alt ||
              blog.featured_image_alt ||
              blog.title
            }
          />
        ) : null}

        <div className="blogDetailHero__overlay" />

        <div className="blogDetailHero__inner">
          <Link
            href="/blogs"
            className="blogDetailHero__back"
          >
            <ArrowLeft size={15} />
            All Blogs
          </Link>

          <div className="blogDetailHero__content">
            <span>
              {blog.hero_eyebrow ||
                blog.eyebrow ||
                blog.category?.name ||
                "Warm Life Insights"}
            </span>

            <h1>
              {blog.hero_heading ||
                blog.title}
            </h1>

            {blog.hero_description ||
            blog.excerpt ? (
              <p>
                {blog.hero_description ||
                  blog.excerpt}
              </p>
            ) : null}

            <div className="blogDetailHero__meta">
              {blog.category ? (
                <span>
                  <FolderTree
                    size={14}
                  />

                  {blog.category.name}
                </span>
              ) : null}

              {blog.author ? (
                <span>
                  <UserRound
                    size={14}
                  />

                  {blog.author.display_name}
                </span>
              ) : null}

              {blog.publish_date ? (
                <span>
                  <CalendarDays
                    size={14}
                  />

                  {formatDate(
                    blog.publish_date,
                  )}
                </span>
              ) : null}

              <span>
                <Clock3 size={14} />

                {blog.reading_time_minutes}
                {" "}
                min read
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="blogDetailLayout">
        <article className="blogArticle">
          {blog.introduction ? (
            <section className="blogIntroduction">
              <p>
                {blog.introduction}
              </p>
            </section>
          ) : null}

          <div className="blogDynamicContent">
            {contentBlocks.map(
              (block) => (
                <div key={block.id}>
                  {renderContentBlock(
                    block,
                  )}
                </div>
              ),
            )}
          </div>

          {blog.key_takeaways_enabled ? (
            <HighlightSection
              title={
                blog.key_takeaways_heading
              }
              items={highlights}
              type="takeaway"
            />
          ) : null}

          {blog.tips_enabled ? (
            <HighlightSection
              title={
                blog.tips_heading
              }
              items={highlights}
              type="tip"
            />
          ) : null}

          {blog.gallery_enabled &&
          galleryItems.length > 0 ? (
            <section className="blogGallery">
              <header>
                <span>
                  Supporting images
                </span>

                <h2>
                  {blog.gallery_heading}
                </h2>
              </header>

              <div className="blogGallery__grid">
                {galleryItems
                  .filter(
                    (item) =>
                      item.is_active &&
                      item.is_published &&
                      item.image_url,
                  )
                  .map(
                    (item) => (
                      <figure
                        key={item.id}
                      >
                        <img
                          src={
                            item.image_url ||
                            ""
                          }
                          alt={
                            item.image_alt ||
                            blog.title
                          }
                        />

                        {item.caption ? (
                          <figcaption>
                            {item.caption}
                          </figcaption>
                        ) : null}
                      </figure>
                    ),
                  )}
              </div>
            </section>
          ) : null}

          {blog.faq_enabled &&
          visibleFaqs.length > 0 ? (
            <section className="blogFaqs">
              <header>
                <span>
                  Common questions
                </span>

                <h2>
                  {blog.faq_heading}
                </h2>
              </header>

              <div>
                {visibleFaqs.map(
                  (faq) => (
                    <details
                      key={faq.id}
                    >
                      <summary>
                        {faq.question}
                      </summary>

                      <p>
                        {faq.answer}
                      </p>
                    </details>
                  ),
                )}
              </div>
            </section>
          ) : null}

          {blog.related_services_enabled &&
          relatedServices.length > 0 ? (
            <section className="blogRelatedServices">
              <header>
                <span>
                  Continue your journey
                </span>

                <h2>
                  {blog.related_services_heading}
                </h2>
              </header>

              <div className="blogRelatedServices__grid">
                {relatedServices.map(
                  (item) => {
                    const service =
                      item.service;

                    if (!service) {
                      return null;
                    }

                    return (
                      <article
                        key={item.id}
                      >
                        {service.featured_image_url ? (
                          <img
                            src={
                              service.featured_image_url
                            }
                            alt={
                              service.featured_image_alt ||
                              service.service_name
                            }
                          />
                        ) : (
                          <div className="blogRelatedServices__fallback">
                            <ListChecks
                              size={27}
                            />
                          </div>
                        )}

                        <div>
                          <h3>
                            {service.service_name}
                          </h3>

                          {service.short_description ? (
                            <p>
                              {service.short_description}
                            </p>
                          ) : null}

                          <Link
                            href={`/services/${service.slug}`}
                          >
                            {service.explore_button_text ||
                              "Explore Service"}

                            <ArrowRight
                              size={15}
                            />
                          </Link>
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            </section>
          ) : null}

          {blog.cta_enabled ? (
            <section className="blogCta">
              <span>
                Warm Life
              </span>

              <h2>
                {blog.cta_heading}
              </h2>

              {blog.cta_description ? (
                <p>
                  {blog.cta_description}
                </p>
              ) : null}

              <Link
                href={
                  blog.cta_button_link
                }
                target={
                  blog.cta_button_open_in_new_tab
                    ? "_blank"
                    : undefined
                }
                rel={
                  blog.cta_button_open_in_new_tab
                    ? "noreferrer"
                    : undefined
                }
              >
                {blog.cta_button_text}

                {blog.cta_button_open_in_new_tab ? (
                  <ExternalLink
                    size={16}
                  />
                ) : (
                  <ArrowRight
                    size={16}
                  />
                )}
              </Link>
            </section>
          ) : null}

          {blog.related_blogs_enabled &&
          relatedBlogs.length > 0 ? (
            <section className="blogRelatedArticles">
              <header>
                <span>
                  More useful reading
                </span>

                <h2>
                  {blog.related_blogs_heading}
                </h2>
              </header>

              <div className="blogRelatedArticles__grid">
                {relatedBlogs.map(
                  (item) => {
                    const related =
                      item.related_blog;

                    if (!related) {
                      return null;
                    }

                    return (
                      <article
                        key={item.id}
                      >
                        {related.featured_image_url ? (
                          <img
                            src={
                              related.featured_image_url
                            }
                            alt={
                              related.featured_image_alt ||
                              related.title
                            }
                          />
                        ) : (
                          <div className="blogRelatedArticles__fallback">
                            <BookOpenText
                              size={28}
                            />
                          </div>
                        )}

                        <div>
                          <span>
                            {related.category?.name ||
                              "Warm Life Blog"}
                          </span>

                          <h3>
                            {related.title}
                          </h3>

                          <div>
                            {related.publish_date ? (
                              <small>
                                {formatDate(
                                  related.publish_date,
                                )}
                              </small>
                            ) : null}

                            <small>
                              {related.reading_time_minutes}
                              {" "}
                              min read
                            </small>
                          </div>

                          <Link
                            href={`/blogs/${related.slug}`}
                          >
                            Read Article

                            <ArrowRight
                              size={15}
                            />
                          </Link>
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            </section>
          ) : null}
        </article>

        <aside className="blogSidebar">
          <div className="blogSidebar__card">
            <span>
              Article details
            </span>

            {blog.category ? (
              <div>
                <FolderTree size={16} />

                <p>
                  <small>
                    Category
                  </small>

                  <strong>
                    {blog.category.name}
                  </strong>
                </p>
              </div>
            ) : null}

            {blog.publish_date ? (
              <div>
                <CalendarDays size={16} />

                <p>
                  <small>
                    Published
                  </small>

                  <strong>
                    {formatDate(
                      blog.publish_date,
                    )}
                  </strong>
                </p>
              </div>
            ) : null}

            <div>
              <Clock3 size={16} />

              <p>
                <small>
                  Reading time
                </small>

                <strong>
                  {blog.reading_time_minutes}
                  {" "}
                  minutes
                </strong>
              </p>
            </div>
          </div>

          {blog.author ? (
            <div className="blogSidebar__author">
              {blog.author.profile_image_url ? (
                <img
                  src={
                    blog.author.profile_image_url
                  }
                  alt={
                    blog.author.profile_image_alt ||
                    blog.author.display_name
                  }
                />
              ) : (
                <div>
                  <UserRound
                    size={28}
                  />
                </div>
              )}

              <span>
                Written by
              </span>

              <h3>
                {blog.author.display_name}
              </h3>

              {blog.author.job_title ? (
                <strong>
                  {blog.author.job_title}
                </strong>
              ) : null}

              {blog.author.biography ? (
                <p>
                  {blog.author.biography}
                </p>
              ) : null}
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
