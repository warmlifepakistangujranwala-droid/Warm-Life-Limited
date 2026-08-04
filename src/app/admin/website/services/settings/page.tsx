/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/services/settings/page.tsx
 *
 * Purpose :
 * Loads Services page settings and renders the complete
 * page settings CMS editor.
 *
 * Version : v1.0.0
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  Settings2,
} from "lucide-react";

import {
  getServicesPageSettings,
} from "@/lib/actions/services-page";

import ServicesSettingsForm from "./ServicesSettingsForm";
import "./settings.css";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

export default async function ServicesSettingsPage() {
  const settings =
    await getServicesPageSettings();

  if (!settings) {
    return (
      <div className="servicesSettingsPage">
        <div className="servicesSettingsPage__missing">
          <h1>
            Services page settings not found
          </h1>

          <p>
            Confirm that the default record exists
            in the website services settings table.
          </p>

          <Link href="/admin/website/services">
            Return to Services Manager
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="servicesSettingsPage">
      <header className="servicesSettingsPage__header">
        <div>
          <div className="servicesSettingsPage__breadcrumb">
            <Link href="/admin/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <Link href="/admin/website/services">
              Services
            </Link>

            <span>/</span>

            <strong>
              Page Settings
            </strong>
          </div>

          <div className="servicesSettingsPage__titleRow">
            <div className="servicesSettingsPage__titleIcon">
              <Settings2 size={25} />
            </div>

            <div>
              <span>
                Services page design
              </span>

              <h1>
                Hero & Listing Settings
              </h1>

              <p>
                Control the Services page hero,
                listing heading, colours,
                typography, spacing and layout.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/website/services"
          className="servicesSettingsPage__back"
        >
          <ArrowLeft size={16} />
          Services Manager
        </Link>
      </header>

      <ServicesSettingsForm
        settings={settings}
      />
    </div>
  );
}
