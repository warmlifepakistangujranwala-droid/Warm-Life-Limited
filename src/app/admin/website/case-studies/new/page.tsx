/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/case-studies/new/page.tsx
 *
 * Purpose :
 * Renders the Add Case Study admin page.
 *
 * Version : v0.1.0
 * ============================================================
 */

import Link from "next/link";

import {
  ArrowLeft,
  FilePlus2,
} from "lucide-react";

import CaseStudyForm from "./CaseStudyForm";

import "./case-study-form.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AddCaseStudyPage() {
  return (
    <div className="caseStudyFormPage">
      <header className="caseStudyFormPage__header">
        <div>
          <div className="caseStudyFormPage__breadcrumb">
            <Link href="/admin/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <Link href="/admin/website/case-studies">
              Case Studies
            </Link>

            <span>/</span>

            <strong>
              Add Case Study
            </strong>
          </div>

          <div className="caseStudyFormPage__titleRow">
            <div className="caseStudyFormPage__titleIcon">
              <FilePlus2 size={25} />
            </div>

            <div>
              <span>
                Website content
              </span>

              <h1>
                Add Case Study
              </h1>

              <p>
                Create a project card and its complete
                dynamic detail page.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/website/case-studies"
          className="caseStudyFormPage__back"
        >
          <ArrowLeft size={16} />
          Case Studies Manager
        </Link>
      </header>

      <CaseStudyForm />
    </div>
  );
}
