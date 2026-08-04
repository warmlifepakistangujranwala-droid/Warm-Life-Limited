/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/services/new/page.tsx
 *
 * Purpose :
 * Renders the Add New Service CMS page.
 *
 * Version : v1.0.0
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  PlusCircle,
} from "lucide-react";

import ServiceForm from "./ServiceForm";
import "./service-form.css";

export default function AddServicePage() {
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

            <strong>Add Service</strong>
          </div>

          <div className="serviceFormPage__titleRow">
            <div className="serviceFormPage__titleIcon">
              <PlusCircle size={25} />
            </div>

            <div>
              <span>
                Services content
              </span>

              <h1>Add New Service</h1>

              <p>
                Create a service card and optionally
                enable a complete dynamic service
                detail page.
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

      <ServiceForm />
    </div>
  );
}
