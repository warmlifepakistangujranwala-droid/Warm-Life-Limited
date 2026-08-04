/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/services/hero/new/page.tsx
 *
 * Purpose :
 * Renders the Add Services Hero Slide page.
 *
 * Version : v1.0.0
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  PlusCircle,
} from "lucide-react";

import {
  getServicesPageSettings,
} from "@/lib/actions/services-page";

import ServiceHeroSlideForm from "./ServiceHeroSlideForm";
import "./hero-slide-form.css";

export const dynamic = "force-dynamic";

export default async function AddServiceHeroSlidePage() {
  const settings =
    await getServicesPageSettings();

  if (!settings) {
    return (
      <div className="serviceHeroFormPage">
        <div className="serviceHeroFormPage__missing">
          Services page settings were not found.
        </div>
      </div>
    );
  }

  return (
    <div className="serviceHeroFormPage">
      <header className="serviceHeroFormPage__header">
        <div>
          <div className="serviceHeroFormPage__breadcrumb">
            <Link href="/admin/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <Link href="/admin/website/services">
              Services
            </Link>

            <span>/</span>

            <Link href="/admin/website/services/hero">
              Hero
            </Link>

            <span>/</span>

            <strong>Add Slide</strong>
          </div>

          <div className="serviceHeroFormPage__titleRow">
            <div className="serviceHeroFormPage__titleIcon">
              <PlusCircle size={25} />
            </div>

            <div>
              <span>
                Services hero
              </span>

              <h1>
                Add Hero Slide
              </h1>

              <p>
                Add an image or video slide with
                responsive media, content,
                button and overlay controls.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/website/services/hero"
          className="serviceHeroFormPage__back"
        >
          <ArrowLeft size={16} />
          Hero Manager
        </Link>
      </header>

      <ServiceHeroSlideForm
        servicesPageId={settings.id}
      />
    </div>
  );
}
