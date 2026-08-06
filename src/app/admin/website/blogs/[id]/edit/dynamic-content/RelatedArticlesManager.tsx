/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/blogs/[id]/edit/dynamic-content/RelatedArticlesManager.tsx
 *
 * Purpose :
 * Manages manually selected related Blog articles.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use client";

import {
  BookOpenText,
  CalendarDays,
  Link2,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  attachBlogRelatedBlog,
  detachBlogRelatedBlog,
} from "@/lib/actions/blogs";

import type {
  BlogRelatedBlogWithBlog,
  BlogWithRelations,
} from "@/lib/types/blogs";

import "./related-articles-manager.css";

type RelatedArticlesManagerProps = {
  blogId: string;
  initialItems: BlogRelatedBlogWithBlog[];
  availableBlogs: BlogWithRelations[];
  sectionHeading: string;
};

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "No publish date";
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

export default function RelatedArticlesManager({
  blogId,
  initialItems,
  availableBlogs,
  sectionHeading,
}: RelatedArticlesManagerProps) {
  const router = useRouter();

  const [selectedBlogId, setSelectedBlogId] =
    useState("");

  const [displayOrder, setDisplayOrder] =
    useState(initialItems.length);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [busyId, setBusyId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const linkedBlogIds =
    useMemo(
      () =>
        new Set(
          initialItems.map(
            (item) =>
              item.related_blog_id,
          ),
        ),
      [initialItems],
    );

  const selectableBlogs =
    useMemo(
      () =>
        availableBlogs
          .filter(
            (blog) =>
              blog.id !== blogId &&
              !linkedBlogIds.has(
                blog.id,
              ),
          )
          .filter((blog) => {
            const query =
              searchQuery
                .trim()
                .toLowerCase();

            if (!query) {
              return true;
            }

            return (
              blog.title
                .toLowerCase()
                .includes(query) ||
              blog.slug
                .toLowerCase()
                .includes(query) ||
              blog.category?.name
                ?.toLowerCase()
                .includes(query) ||
              false
            );
          }),
      [
        availableBlogs,
        blogId,
        linkedBlogIds,
        searchQuery,
      ],
    );

  const selectedBlog =
    availableBlogs.find(
      (blog) =>
        blog.id === selectedBlogId,
    ) ?? null;

  async function attachArticle():
    Promise<void> {
    if (!selectedBlogId) {
      setMessage(
        "Select a related article first.",
      );
      return;
    }

    if (
      selectedBlogId === blogId
    ) {
      setMessage(
        "A blog cannot be related to itself.",
      );
      return;
    }

    setBusyId("new");
    setMessage("");

    const result =
      await attachBlogRelatedBlog({
        blog_id: blogId,
        related_blog_id:
          selectedBlogId,
        display_order:
          displayOrder,
      });

    if (!result.success) {
      const errors =
        result.errors
          ? Object.values(
              result.errors,
            )
              .flat()
              .filter(Boolean)
              .join(" ")
          : "";

      setMessage(
        errors ||
        result.message,
      );

      setBusyId(null);
      return;
    }

    setSelectedBlogId("");
    setSearchQuery("");
    setDisplayOrder(
      initialItems.length + 1,
    );
    setBusyId(null);
    router.refresh();
  }

  async function removeArticle(
    id: string,
  ): Promise<void> {
    if (
      !window.confirm(
        "Remove this related article?",
      )
    ) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const result =
      await detachBlogRelatedBlog(
        id,
      );

    if (!result.success) {
      setMessage(
        result.message,
      );
    } else {
      router.refresh();
    }

    setBusyId(null);
  }

  return (
    <article className="blogRelatedArticlesManager">
      <div className="blogRelatedArticlesManager__heading">
        <div>
          <span>
            Internal linking
          </span>

          <h3>
            Related Articles
          </h3>

          <p>
            Manually connect relevant articles
            to improve discovery and reader journeys.
          </p>
        </div>

        <strong>
          {initialItems.length}
          {" "}
          articles
        </strong>
      </div>

      <div className="blogRelatedArticlesManager__sectionName">
        Public section heading:
        {" "}
        <strong>
          {sectionHeading}
        </strong>
      </div>

      {message ? (
        <div className="blogRelatedArticlesManager__message">
          {message}
        </div>
      ) : null}

      <div className="blogRelatedArticlesManager__create">
        <div className="blogRelatedArticlesManager__search">
          <Search size={16} />

          <input
            value={searchQuery}
            placeholder="Search by title, slug or category"
            onChange={(event) =>
              setSearchQuery(
                event.target.value,
              )
            }
          />
        </div>

        <div className="blogRelatedArticlesManager__fields">
          <label>
            <span>
              Select article
            </span>

            <select
              value={
                selectedBlogId
              }
              onChange={(event) =>
                setSelectedBlogId(
                  event.target.value,
                )
              }
            >
              <option value="">
                Choose a Blog article
              </option>

              {selectableBlogs.map(
                (blog) => (
                  <option
                    key={blog.id}
                    value={blog.id}
                  >
                    {blog.title}
                  </option>
                ),
              )}
            </select>
          </label>

          <label>
            <span>
              Display order
            </span>

            <input
              type="number"
              min="0"
              value={
                displayOrder
              }
              onChange={(event) =>
                setDisplayOrder(
                  Number(
                    event.target.value,
                  ),
                )
              }
            />
          </label>
        </div>

        {selectedBlog ? (
          <div className="blogRelatedArticlesManager__selected">
            {selectedBlog.featured_image_url ? (
              <img
                src={
                  selectedBlog.featured_image_url
                }
                alt={
                  selectedBlog.featured_image_alt ||
                  selectedBlog.title
                }
              />
            ) : (
              <div>
                <BookOpenText
                  size={23}
                />
              </div>
            )}

            <div>
              <span>
                Selected article
              </span>

              <strong>
                {selectedBlog.title}
              </strong>

              <small>
                {selectedBlog.category?.name ||
                  "Uncategorised"}
                {" · "}
                {selectedBlog.reading_time_minutes}
                {" "}
                min read
              </small>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={
            attachArticle
          }
          disabled={
            busyId !== null ||
            !selectedBlogId
          }
        >
          {busyId === "new" ? (
            <Loader2
              size={16}
              className="blogRelatedArticlesManager__spinner"
            />
          ) : (
            <Plus size={16} />
          )}

          Add Related Article
        </button>
      </div>

      <div className="blogRelatedArticlesManager__list">
        {initialItems.length === 0 ? (
          <div className="blogRelatedArticlesManager__empty">
            No related articles selected yet.
          </div>
        ) : null}

        {initialItems.map(
          (item) => {
            const article =
              item.related_blog;

            return (
              <section
                className="blogRelatedArticleCard"
                key={item.id}
              >
                {article?.featured_image_url ? (
                  <img
                    src={
                      article.featured_image_url
                    }
                    alt={
                      article.featured_image_alt ||
                      article.title
                    }
                  />
                ) : (
                  <div className="blogRelatedArticleCard__fallback">
                    <BookOpenText
                      size={25}
                    />
                  </div>
                )}

                <div className="blogRelatedArticleCard__content">
                  <div className="blogRelatedArticleCard__label">
                    <Link2 size={13} />
                    Related article
                  </div>

                  <h4>
                    {article?.title ||
                      "Article unavailable"}
                  </h4>

                  <div className="blogRelatedArticleCard__meta">
                    {article?.category ? (
                      <span>
                        {article.category.name}
                      </span>
                    ) : null}

                    {article ? (
                      <span>
                        {article.reading_time_minutes}
                        {" "}
                        min read
                      </span>
                    ) : null}

                    {article ? (
                      <span>
                        <CalendarDays
                          size={13}
                        />

                        {formatDate(
                          article.publish_date,
                        )}
                      </span>
                    ) : null}
                  </div>

                  <small>
                    Display order:
                    {" "}
                    {item.display_order}
                  </small>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeArticle(
                      item.id,
                    )
                  }
                  disabled={
                    busyId !== null
                  }
                  aria-label="Remove related article"
                >
                  {busyId ===
                  item.id ? (
                    <Loader2
                      size={15}
                      className="blogRelatedArticlesManager__spinner"
                    />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </section>
            );
          },
        )}
      </div>
    </article>
  );
}
