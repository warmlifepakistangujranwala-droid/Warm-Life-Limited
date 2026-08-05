import Link from "next/link";

import {
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";

import {
  getCaseStudiesPageSettingsForAdmin,
} from "@/lib/actions/case-studies-page";

import CaseStudiesHeroForm from "./CaseStudiesHeroForm";

import "./case-studies-hero-form.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CaseStudiesHeroAdminPage() {
  const settings =
    await getCaseStudiesPageSettingsForAdmin();

  if (!settings) {
    return (
      <div className="caseStudiesHeroAdmin">
        <p>
          Case Studies page settings were not found.
          Run the supplied SQL migration first.
        </p>
      </div>
    );
  }

  return (
    <div className="caseStudiesHeroAdmin">
      <header className="caseStudiesHeroAdmin__header">
        <div>
          <span>
            Case Studies
          </span>

          <div>
            <ImageIcon size={25} />

            <div>
              <h1>
                Case Studies Hero
              </h1>

              <p>
                Manage the public Case Studies page hero.
              </p>
            </div>
          </div>
        </div>

        <Link href="/admin/website/case-studies">
          <ArrowLeft size={16} />
          Case Studies Manager
        </Link>
      </header>

      <CaseStudiesHeroForm
        initialSettings={settings}
      />
    </div>
  );
}
