import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  getHomepageServicesSection,
} from "@/lib/actions/homepage-service";

import ServicesSectionSettingsForm from "../_components/ServicesSectionSettingsForm";

export const metadata: Metadata = {
  title: "Homepage Services Settings",
  description:
    "Manage the homepage services section settings.",
};

export default async function HomepageServicesSettingsPage() {
  const section = await getHomepageServicesSection();

  if (!section) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
          Homepage CMS
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Services Section Settings
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Configure the heading, colours, spacing, alignment,
          animation and visibility of the homepage services section.
        </p>
      </div>

      <ServicesSectionSettingsForm
        section={section}
      />
    </main>
  );
}