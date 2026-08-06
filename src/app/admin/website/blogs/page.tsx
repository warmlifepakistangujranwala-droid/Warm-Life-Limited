/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/blogs/page.tsx
 *
 * Purpose :
 * Displays and manages all Blog CMS records.
 *
 * Version : v0.2.0
 * ============================================================
 */

import Link from "next/link";

import {
  ArrowUpRight,
  BookOpenText,
  CalendarDays,
  Eye,
  EyeOff,
  FilePlus2,
  FolderTree,
  Image,
  Pencil,
  Pin,
  Star,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  deleteBlog,
  getBlogAuthors,
  getBlogCategories,
  getBlogs,
  toggleBlogPublished,
} from "@/lib/actions/blogs";

import "./blog-manager.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "Not scheduled";
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

  const nextPublished =
    String(
      formData.get(
        "nextPublished",
      ) ?? "",
    ) === "true";

  await toggleBlogPublished(
    id,
    nextPublished,
  );
}

async function deleteBlogAction(
  formData: FormData,
): Promise<void> {
  "use server";

  const id =
    String(
      formData.get("id") ?? "",
    );

  await deleteBlog(id);
}

export default async function BlogManagerPage() {
  const [
    blogs,
    categories,
    authors,
  ] = await Promise.all([
    getBlogs(),
    getBlogCategories(),
    getBlogAuthors(),
  ]);

  const publishedCount =
    blogs.filter(
      (blog) =>
        blog.is_published,
    ).length;

  const draftCount =
    blogs.filter(
      (blog) =>
        !blog.is_published,
    ).length;

  const featuredCount =
    blogs.filter(
      (blog) =>
        blog.is_featured,
    ).length;

  const stickyCount =
    blogs.filter(
      (blog) =>
        blog.is_sticky,
    ).length;

  return (
    <div className="blogManager">
      <header className="blogManager__header">
        <div>
          <div className="blogManager__eyebrow">
            Website content
          </div>

          <div className="blogManager__titleRow">
            <div className="blogManager__titleIcon">
              <BookOpenText
                size={25}
              />
            </div>

            <div>
              <h1>
                Blog Manager
              </h1>

              <p>
                Create professional articles,
                organise categories and authors,
                manage publishing and prepare
                content for search visibility.
              </p>
            </div>
          </div>
        </div>

        <div className="blogManager__headerActions">
          <Link
            href="/admin/website/blogs/hero"
            className="blogManager__secondaryButton"
          >
            <Image size={16} />
            Hero Settings
          </Link>

          <Link
            href="/admin/website/blogs/categories"
            className="blogManager__secondaryButton"
          >
            <FolderTree size={16} />
            Categories
          </Link>

          <Link
            href="/admin/website/blogs/authors"
            className="blogManager__secondaryButton"
          >
            <UsersRound size={16} />
            Authors
          </Link>

          <Link
            href="/admin/website/blogs/new"
            className="blogManager__addButton"
          >
            <FilePlus2 size={17} />
            Add Blog
          </Link>
        </div>
      </header>

      <section className="blogManager__summary">
        <article>
          <span>
            Total Blogs
          </span>

          <strong>
            {blogs.length}
          </strong>

          <small>
            All articles
          </small>
        </article>

        <article>
          <span>
            Published
          </span>

          <strong>
            {publishedCount}
          </strong>

          <small>
            Visible publicly
          </small>
        </article>

        <article>
          <span>
            Drafts
          </span>

          <strong>
            {draftCount}
          </strong>

          <small>
            Work in progress
          </small>
        </article>

        <article>
          <span>
            Featured
          </span>

          <strong>
            {featuredCount}
          </strong>

          <small>
            Priority content
          </small>
        </article>

        <article>
          <span>
            Sticky
          </span>

          <strong>
            {stickyCount}
          </strong>

          <small>
            Pinned articles
          </small>
        </article>

        <article>
          <span>
            Categories
          </span>

          <strong>
            {categories.length}
          </strong>

          <small>
            Content groups
          </small>
        </article>

        <article>
          <span>
            Authors
          </span>

          <strong>
            {authors.length}
          </strong>

          <small>
            Blog contributors
          </small>
        </article>
      </section>

      {blogs.length === 0 ? (
        <section className="blogManager__empty">
          <div>
            <BookOpenText
              size={34}
            />
          </div>

          <h2>
            No blog posts yet
          </h2>

          <p>
            Create your first professional
            Warm Life article with structured
            content blocks, media and SEO fields.
          </p>

          <Link href="/admin/website/blogs/new">
            <FilePlus2 size={16} />
            Add First Blog
          </Link>
        </section>
      ) : (
        <section className="blogManager__grid">
          {blogs.map(
            (blog) => (
              <article
                className="blogAdminCard"
                key={blog.id}
              >
                <div className="blogAdminCard__media">
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
                    <div className="blogAdminCard__fallback">
                      <BookOpenText
                        size={31}
                      />
                    </div>
                  )}

                  <div className="blogAdminCard__badges">
                    <span
                      className={
                        blog.is_published
                          ? "isPublished"
                          : "isDraft"
                      }
                    >
                      {blog.is_published
                        ? "Published"
                        : "Draft"}
                    </span>

                    <div>
                      {blog.is_sticky ? (
                        <span className="isSticky">
                          <Pin size={11} />
                          Sticky
                        </span>
                      ) : null}

                      {blog.is_featured ? (
                        <span className="isFeatured">
                          <Star size={11} />
                          Featured
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="blogAdminCard__content">
                  <div className="blogAdminCard__taxonomy">
                    {blog.category ? (
                      <span>
                        <FolderTree
                          size={13}
                        />

                        {blog.category.name}
                      </span>
                    ) : (
                      <span>
                        Uncategorized
                      </span>
                    )}

                    {blog.author ? (
                      <span>
                        <UserRound
                          size={13}
                        />

                        {blog.author.display_name}
                      </span>
                    ) : null}
                  </div>

                  <h2>
                    {blog.title}
                  </h2>

                  {blog.excerpt ? (
                    <p>
                      {blog.excerpt}
                    </p>
                  ) : null}

                  <div className="blogAdminCard__meta">
                    <span>
                      <CalendarDays
                        size={14}
                      />

                      {formatDate(
                        blog.publish_date,
                      )}
                    </span>

                    <span>
                      {blog.reading_time_minutes}
                      {" "}
                      min read
                    </span>
                  </div>

                  <div className="blogAdminCard__seo">
                    <span>
                      SEO
                    </span>

                    <strong
                      className={
                        blog.seo_title &&
                        blog.meta_description
                          ? "isReady"
                          : "isMissing"
                      }
                    >
                      {blog.seo_title &&
                      blog.meta_description
                        ? "Ready"
                        : "Needs attention"}
                    </strong>
                  </div>
                </div>

                <footer className="blogAdminCard__actions">
                  <Link
                    href={`/admin/website/blogs/${blog.id}/edit`}
                    title="Edit blog"
                  >
                    <Pencil size={15} />
                    Edit
                  </Link>

                  {blog.has_detail_page &&
                  blog.is_published ? (
                    <Link
                      href={`/blogs/${blog.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      title="View public blog"
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
                      value={blog.id}
                    />

                    <input
                      type="hidden"
                      name="nextPublished"
                      value={String(
                        !blog.is_published,
                      )}
                    />

                    <button
                      type="submit"
                      className="isPublish"
                      title={
                        blog.is_published
                          ? "Unpublish blog"
                          : "Publish blog"
                      }
                    >
                      {blog.is_published ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}

                      {blog.is_published
                        ? "Unpublish"
                        : "Publish"}
                    </button>
                  </form>

                  <form
                    action={
                      deleteBlogAction
                    }
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={blog.id}
                    />

                    <button
                      type="submit"
                      className="isDelete"
                      title="Delete blog"
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
