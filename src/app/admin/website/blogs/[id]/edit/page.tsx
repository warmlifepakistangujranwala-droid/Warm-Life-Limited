/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/blogs/[id]/edit/page.tsx
 *
 * Purpose :
 * Loads an existing Blog and renders the master edit page.
 *
 * Version : v0.7.0
 * ============================================================
 */

import Link from "next/link";

import {
  ArrowLeft,
  BookOpenText,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import {
  getBlogAuthors,
  getBlogCategories,
  getBlogContentBlocks,
  getBlogHighlights,
  getBlogFaqs,
  getBlogGallery,
  getBlogRelatedBlogs,
  getBlogRelatedServices,
  getBlogs,
  getBlogById,
} from "@/lib/actions/blogs";

import {
  getServices,
} from "@/lib/actions/services-page";

import BlogEditForm from "./BlogEditForm";
import ContentBlocksManager from "./dynamic-content/ContentBlocksManager";
import HighlightsManager from "./dynamic-content/HighlightsManager";
import FaqManager from "./dynamic-content/FaqManager";
import GalleryManager from "./dynamic-content/GalleryManager";
import RelatedArticlesManager from "./dynamic-content/RelatedArticlesManager";
import RelatedServicesManager from "./dynamic-content/RelatedServicesManager";

import "./blog-edit.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type EditBlogPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBlogPage({
  params,
}: EditBlogPageProps) {
  const { id } = await params;

  const [
    blog,
    categories,
    authors,
    contentBlocks,
    highlights,
    faqs,
    galleryItems,
    relatedBlogs,
    availableBlogs,
    relatedServices,
    availableServices,
  ] = await Promise.all([
    getBlogById(id),
    getBlogCategories(),
    getBlogAuthors(),
    getBlogContentBlocks(id),
    getBlogHighlights(id),
    getBlogFaqs(id),
    getBlogGallery(id),
    getBlogRelatedBlogs(id),
    getBlogs(),
    getBlogRelatedServices(id),
    getServices(),
  ]);

  if (!blog) {
    notFound();
  }

  return (
    <div className="blogEditPage">
      <header className="blogEditPage__header">
        <div>
          <nav
            className="blogEditPage__breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link href="/admin/website/blogs">
              Blogs
            </Link>

            <span>/</span>

            <strong>
              Edit Blog
            </strong>
          </nav>

          <div className="blogEditPage__titleRow">
            <div className="blogEditPage__titleIcon">
              <BookOpenText size={24} />
            </div>

            <div>
              <span>
                Blog content
              </span>

              <h1>
                Edit {blog.title}
              </h1>

              <p>
                Update the blog record and manage
                repeatable article content blocks.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/website/blogs"
          className="blogEditPage__backButton"
        >
          <ArrowLeft size={16} />
          Blog Manager
        </Link>
      </header>

      <BlogEditForm
        initialBlog={blog}
        categories={categories}
        authors={authors}
      />

      {blog.has_detail_page ? (
        <section className="blogEditDynamic">
          <header className="blogEditDynamic__header">
            <span>
              Article builder
            </span>

            <h2>
              Dynamic Content Managers
            </h2>

            <p>
              Add and organise repeatable content
              that appears on the public blog detail page.
            </p>
          </header>

          <ContentBlocksManager
            blogId={blog.id}
            initialItems={contentBlocks}
          />

          {(blog.key_takeaways_enabled ||
            blog.tips_enabled) ? (
            <HighlightsManager
              blogId={blog.id}
              initialItems={highlights}
              takeawaysEnabled={
                blog.key_takeaways_enabled
              }
              tipsEnabled={
                blog.tips_enabled
              }
              takeawaysHeading={
                blog.key_takeaways_heading
              }
              tipsHeading={
                blog.tips_heading
              }
            />
          ) : null}

          {blog.faq_enabled ? (
            <FaqManager
              blogId={blog.id}
              initialItems={faqs}
              sectionHeading={
                blog.faq_heading
              }
            />
          ) : null}

          {blog.gallery_enabled ? (
            <GalleryManager
              blogId={blog.id}
              initialItems={galleryItems}
              sectionHeading={
                blog.gallery_heading
              }
            />
          ) : null}

          {blog.related_blogs_enabled ? (
            <RelatedArticlesManager
              blogId={blog.id}
              initialItems={relatedBlogs}
              availableBlogs={availableBlogs}
              sectionHeading={
                blog.related_blogs_heading
              }
            />
          ) : null}

          {blog.related_services_enabled ? (
            <RelatedServicesManager
              blogId={blog.id}
              initialItems={relatedServices}
              availableServices={availableServices.map(
                (service) => ({
                  id: service.id,
                  service_name:
                    service.service_name,
                  slug: service.slug,
                  short_description:
                    service.short_description ??
                    null,
                  featured_image_url:
                    service.featured_image_url ??
                    null,
                  featured_image_alt:
                    service.featured_image_alt ??
                    null,
                  explore_button_text:
                    service.explore_button_text ??
                    null,
                }),
              )}
              sectionHeading={
                blog.related_services_heading
              }
            />
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
