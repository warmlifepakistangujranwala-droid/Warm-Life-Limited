/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/about/hero/new/page.tsx
 *
 * Purpose :
 * Renders the Add About Hero Slide CMS page.
 *
 * Version : v1.0.0
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  Info,
  PlusCircle,
} from "lucide-react";

import {
  getAboutPageSettings,
} from "@/lib/actions/about-page";

import HeroSlideForm from "./HeroSlideForm";
import "./hero-form.css";

export default async function NewAboutHeroSlidePage() {
  const settings =
    await getAboutPageSettings();

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

            <strong>Add Hero Slide</strong>
          </div>

          <div className="heroFormPage__titleRow">
            <div className="heroFormPage__titleIcon">
              <PlusCircle
                size={25}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <span className="heroFormPage__eyebrow">
                About page hero
              </span>

              <h1>Add Hero Slide</h1>

              <p>
                Upload an image or video, add
                slide content and control its
                appearance, status and display
                order.
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
      />
    </div>
  );
}
