/**
 * Blogs Hero Settings Page
 * Version: v0.1.0
 */

import Link from "next/link";

import {
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";

import {
  getBlogsPageSettings,
} from "@/lib/actions/blogs-page";

import BlogsHeroForm from "./BlogsHeroForm";

import "./blogs-hero-form.css";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

export default async function BlogsHeroSettingsPage() {
  const settings =
    await getBlogsPageSettings();

  if (!settings) {
    return (
      <div className="blogsHeroAdmin">
        <div className="blogsHeroAdmin__missing">
          Blogs page settings were not found.
          Run the supplied SQL migration first.
        </div>
      </div>
    );
  }

  return (
    <div className="blogsHeroAdmin">
      <header className="blogsHeroAdmin__header">
        <div>
          <span>
            Blogs listing page
          </span>

          <div>
            <div className="blogsHeroAdmin__icon">
              <ImageIcon size={24} />
            </div>

            <div>
              <h1>
                Blogs Hero Settings
              </h1>

              <p>
                Manage the public Blogs hero and
                listing section text.
              </p>
            </div>
          </div>
        </div>

        <Link href="/admin/website/blogs">
          <ArrowLeft size={16} />
          Blog Manager
        </Link>
      </header>

      <BlogsHeroForm
        initialSettings={settings}
      />
    </div>
  );
}
