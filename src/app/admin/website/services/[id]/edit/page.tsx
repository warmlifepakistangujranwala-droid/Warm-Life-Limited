/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/services/[id]/edit/page.tsx
 *
 * Purpose :
 * Loads an existing service, reusable service form and
 * repeatable Benefits, Process Steps and Gallery managers.
 *
 * Version : v1.2.0
 * ============================================================
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Edit3,
} from "lucide-react";

import {
  getServiceBenefits,
  getServiceById,
  getServiceGalleryItems,
  getServiceProcessSteps,
} from "@/lib/actions/services-page";

import ServiceForm from "../../new/ServiceForm";
import "../../new/service-form.css";

import BenefitsManager from "./detail-content/BenefitsManager";
import GalleryManager from "./detail-content/GalleryManager";
import ProcessManager from "./detail-content/ProcessManager";

import "./detail-content/detail-content.css";

type EditServicePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditServicePage({
  params,
}: EditServicePageProps) {
  const { id } = await params;

  const service =
    await getServiceById(id);

  if (!service) {
    notFound();
  }

  const [
    benefits,
    processSteps,
    galleryItems,
  ] = await Promise.all([
    getServiceBenefits(service.id),
    getServiceProcessSteps(service.id),
    getServiceGalleryItems(service.id),
  ]);

  return (
    <div className="serviceFormPage">
      <header className="serviceFormPage__header">
        <div>
          <div className="serviceFormPage__breadcrumb">
            <Link href="/admin/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <Link href="/admin/website/services">
              Services
            </Link>

            <span>/</span>

            <strong>Edit Service</strong>
          </div>

          <div className="serviceFormPage__titleRow">
            <div className="serviceFormPage__titleIcon">
              <Edit3 size={25} />
            </div>

            <div>
              <span>
                Services content
              </span>

              <h1>
                Edit {service.service_name}
              </h1>

              <p>
                Update the service card, detail
                page, media and repeatable content
                sections.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/website/services"
          className="serviceFormPage__back"
        >
          <ArrowLeft size={16} />
          Services Manager
        </Link>
      </header>

      <ServiceForm
        initialService={service}
        detailManagers={{
          benefits: (
            <BenefitsManager
              serviceId={service.id}
              initialItems={benefits}
            />
          ),
          process: (
            <ProcessManager
              serviceId={service.id}
              initialItems={processSteps}
            />
          ),
          gallery: (
            <GalleryManager
              serviceId={service.id}
              initialItems={galleryItems}
            />
          ),
        }}
      />

    </div>
  );
}
