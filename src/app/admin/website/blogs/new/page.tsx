/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/blogs/new/page.tsx
 *
 * Purpose :
 * Loads Blog categories/authors and renders the Add Blog form.
 *
 * Version : v0.1.0
 * ============================================================
 */

import Link from "next/link";

import {
  ArrowLeft,
  FilePlus2,
} from "lucide-react";

import {
  getBlogAuthors,
  getBlogCategories,
} from "@/lib/actions/blogs";

import BlogForm from "./BlogForm";

import "./blog-form.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AddBlogPage() {
  const [
    categories,
    authors,
  ] = await Promise.all([
    getBlogCategories(),
    getBlogAuthors(),
  ]);

  return (
    <div className="blogEditorPage">
      <header className="blogEditorPage__header">
        <div>
          <nav
            className="blogEditorPage__breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link href="/admin/website/blogs">
              Blogs
            </Link>

            <span>/</span>

            <strong>
              Add Blog
            </strong>
          </nav>

          <div className="blogEditorPage__titleRow">
            <div className="blogEditorPage__titleIcon">
              <FilePlus2 size={24} />
            </div>

            <div>
              <span>
                Blog content
              </span>

              <h1>
                Add New Blog
              </h1>

              <p>
                Create a professional article with
                structured content, media, publishing
                controls and complete SEO foundations.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/website/blogs"
          className="blogEditorPage__backButton"
        >
          <ArrowLeft size={16} />
          Blog Manager
        </Link>
      </header>

      <BlogForm
        categories={categories}
        authors={authors}
      />
    </div>
  );
}
