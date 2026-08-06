import Link from "next/link";

import {
  ArrowLeft,
  UsersRound,
} from "lucide-react";

import {
  getBlogAuthors,
} from "@/lib/actions/blogs";

import AuthorsManager from "./AuthorsManager";

import "../categories/categories-manager.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogAuthorsPage() {
  const authors =
    await getBlogAuthors();

  return (
    <div className="blogTaxonomyPage">
      <header className="blogTaxonomyPage__header">
        <div>
          <span>
            Blog contributors
          </span>

          <div>
            <div className="blogTaxonomyPage__icon">
              <UsersRound size={24} />
            </div>

            <div>
              <h1>
                Blog Authors
              </h1>

              <p>
                Manage author profiles, biographies
                and public contributor details.
              </p>
            </div>
          </div>
        </div>

        <Link href="/admin/website/blogs">
          <ArrowLeft size={16} />
          Blog Manager
        </Link>
      </header>

      <AuthorsManager
        initialItems={authors}
      />
    </div>
  );
}
