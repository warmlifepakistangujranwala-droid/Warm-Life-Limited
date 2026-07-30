import { notFound } from "next/navigation";

import LocalAuthorityForm from "../LocalAuthorityForm";

import { getHomepageLocalAuthoritiesData } from "@/lib/actions/homepage-local-authority";

export const dynamic = "force-dynamic";

export default async function NewLocalAuthorityPage() {
  const data =
    await getHomepageLocalAuthoritiesData();

  const section = data.section;

  if (!section) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-950">
          Add Local Authority
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Add a new Local Authority logo to
          the homepage carousel.
        </p>
      </header>

      <LocalAuthorityForm
        mode="create"
        section={section}
      />
    </main>
  );
}