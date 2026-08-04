/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/about/hero/[id]/edit/page.tsx
 *
 * Purpose :
 * Loads an existing About hero slide and renders the shared
 * hero slide form in edit mode.
 *
 * Version : v1.0.0
 * ============================================================
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Edit3,
  Info,
} from "lucide-react";

import {
  getAboutHeroSlideById,
  getAboutPageSettings,
} from "@/lib/actions/about-page";

import HeroSlideForm from "../../new/HeroSlideForm";
import "../../new/hero-form.css";

type EditAboutHeroSlidePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAboutHeroSlidePage({
  params,
}: EditAboutHeroSlidePageProps) {
  const { id } = await params;

  const [settings, slide] =
    await Promise.all([
      getAboutPageSettings(),
      getAboutHeroSlideById(id),
    ]);

  if (!slide) {
    notFound();
  }

  if (!settings) {
    return (
      <div className="heroFormPage">
        <div className="heroEditor__message isError">
          <Info size={18} />

          About page settings could not be
          loaded. Confirm that the default
          About settings record exists.
        </div>
      </div>
    );
  }

  return (
    <div className="heroFormPage">
      <header className="heroFormPage__header">
        <div>
          <div className="heroFormPage__breadcrumb">
            <Link href="/admin/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <Link href="/admin/website/about">
              About Page
            </Link>

            <span>/</span>

            <Link href="/admin/website/about/hero">
              Hero
            </Link>

            <span>/</span>

            <strong>Edit Hero Slide</strong>
          </div>

          <div className="heroFormPage__titleRow">
            <div className="heroFormPage__titleIcon">
              <Edit3
                size={25}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <span className="heroFormPage__eyebrow">
                About page hero
              </span>

              <h1>Edit Hero Slide</h1>

              <p>
                Update the selected hero slide,
                replace its media, adjust content
                and control its publication status.
              </p>
            </div>
          </div>
        </div>

        <div className="heroFormPage__headerActions">
          <Link
            href="/admin/website/about"
            className="heroFormPage__homepageButton"
          >
            About Page
          </Link>

          <Link
            href="/admin/website/about/hero"
            className="heroFormPage__backButton"
          >
            <ArrowLeft size={16} />
            Back to Hero Manager
          </Link>
        </div>
      </header>

      <HeroSlideForm
        aboutPageId={settings.id}
        initialSlide={slide}
        mode="edit"
      />
    </div>
  );
}
