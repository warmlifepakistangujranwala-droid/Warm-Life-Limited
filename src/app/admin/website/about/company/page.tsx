/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/about/company/page.tsx
 *
 * Purpose :
 * Loads the About company information settings and renders
 * the complete Company Information CMS editor.
 *
 * Version : v1.0.0
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Info,
} from "lucide-react";

import {
  getAboutPageSettings,
} from "@/lib/actions/about-page";

import CompanyInformationForm from "./CompanyInformationForm";
import "./company.css";

export default async function AboutCompanyPage() {
  const settings =
    await getAboutPageSettings();

  if (!settings) {
    return (
      <div className="aboutCompanyAdmin">
        <div className="aboutCompanyAdmin__missing">
          <Info size={30} />

          <h1>
            Company settings not found
          </h1>

          <p>
            Confirm that the About page default
            settings record exists in Supabase.
          </p>

          <Link href="/admin/website/about">
            Return to About Manager
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="aboutCompanyAdmin">
      <header className="aboutCompanyAdmin__header">
        <div>
          <div className="aboutCompanyAdmin__breadcrumb">
            <Link href="/admin/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <Link href="/admin/website/about">
              About Page
            </Link>

            <span>/</span>

            <strong>
              Company Information
            </strong>
          </div>

          <div className="aboutCompanyAdmin__titleRow">
            <div className="aboutCompanyAdmin__titleIcon">
              <Building2
                size={25}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <span className="aboutCompanyAdmin__eyebrow">
                About page content
              </span>

              <h1>
                Company Information
              </h1>

              <p>
                Manage the Warm Life company
                story, image, typography,
                colours, spacing and layout.
              </p>
            </div>
          </div>
        </div>

        <div className="aboutCompanyAdmin__headerActions">
          <Link
            href="/admin/website/about"
            className="aboutCompanyAdmin__backButton"
          >
            <ArrowLeft size={16} />
            About Manager
          </Link>

          <a
            href="/about#company-information"
            target="_blank"
            rel="noreferrer"
            className="aboutCompanyAdmin__previewButton"
          >
            Preview Section
          </a>
        </div>
      </header>

      <CompanyInformationForm
        settings={settings}
      />
    </div>
  );
}
