import Link from "next/link";

import PartnerForm from "../PartnerForm";

import { getHomepagePartnersData } from "@/lib/actions/homepage-partner";

export const dynamic = "force-dynamic";

export default async function NewPartnerPage() {
  const data = await getHomepagePartnersData();

  const section = data.section;

  if (!section?.id) {
    return (
      <main className="mx-auto max-w-3xl space-y-6 p-8">
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6">
          <h1 className="text-2xl font-bold text-amber-900">
            Partners Section Not Found
          </h1>

          <p className="mt-2 text-sm text-amber-800">
            The homepage partners section does not exist in
            the database. Please run the Partners CMS SQL
            setup first.
          </p>

          <Link
            href="/admin/website/homepage/partners"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Partners
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-8">
      <PartnerForm
        mode="create"
        sectionId={section.id}
      />
    </main>
  );
}