/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/services/hero/[id]/edit/page.tsx
 *
 * Purpose :
 * Loads an existing Services hero slide and renders the
 * reusable slide editor.
 *
 * Version : v1.0.0
 * ============================================================
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Edit3,
} from "lucide-react";

import {
  getServiceHeroSlideById,
  getServicesPageSettings,
} from "@/lib/actions/services-page";

import ServiceHeroSlideForm from "../../new/ServiceHeroSlideForm";
import "../../new/hero-slide-form.css";

type EditServiceHeroSlidePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditServiceHeroSlidePage({
  params,
}: EditServiceHeroSlidePageProps) {
  const { id } = await params;

  const [
    settings,
    slide,
  ] = await Promise.all([
    getServicesPageSettings(),
    getServiceHeroSlideById(id),
  ]);

  if (!settings || !slide) {
    notFound();
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

            <strong>Edit Slide</strong>
          </div>

          <div className="serviceHeroFormPage__titleRow">
            <div className="serviceHeroFormPage__titleIcon">
              <Edit3 size={25} />
            </div>

            <div>
              <span>
                Services hero
              </span>

              <h1>
                Edit {slide.internal_name}
              </h1>

              <p>
                Update slide content, media,
                overlay, alignment and publishing
                status.
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
        initialSlide={slide}
      />
    </div>
  );
}
