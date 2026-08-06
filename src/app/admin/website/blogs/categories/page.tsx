import Link from "next/link";

import {
  ArrowLeft,
  FolderTree,
} from "lucide-react";

import {
  getBlogCategories,
} from "@/lib/actions/blogs";

import CategoriesManager from "./CategoriesManager";

import "./categories-manager.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogCategoriesPage() {
  const categories =
    await getBlogCategories();

  return (
    <div className="blogTaxonomyPage">
      <header className="blogTaxonomyPage__header">
        <div>
          <span>
            Blog organisation
          </span>

          <div>
            <div className="blogTaxonomyPage__icon">
              <FolderTree size={24} />
            </div>

            <div>
              <h1>
                Blog Categories
              </h1>

              <p>
                Organise articles into clear,
                reusable content groups.
              </p>
            </div>
          </div>
        </div>

        <Link href="/admin/website/blogs">
          <ArrowLeft size={16} />
          Blog Manager
        </Link>
      </header>

      <CategoriesManager
        initialItems={categories}
      />
    </div>
  );
}
