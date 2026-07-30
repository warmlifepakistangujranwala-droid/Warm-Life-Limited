import Link from "next/link";

// import DeleteLocalAuthorityButton from "./DeleteLocalAuthorityButton";
import DeleteLocalAuthorityButton from "./DeleteLocalAuthorityButton";
import SectionSettingsForm from "./SectionSettingsForm";
import { getHomepageLocalAuthoritiesData } from "@/lib/actions/homepage-local-authority";

export const dynamic = "force-dynamic";

export default async function LocalAuthoritiesPage() {
  const data =
    await getHomepageLocalAuthoritiesData();

  const section = data.section;

  const localAuthorities =
    data.localAuthorities;

  return (
    <main className="space-y-8 p-8">
      <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            Homepage Local Authorities
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Manage the Local Authority
            Partners section displayed on
            the homepage.
          </p>
        </div>

        {section ? (
          <Link
            href={`/admin/website/homepage/local-authorities/new?sectionId=${section.id}`}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Add Local Authority
          </Link>
        ) : null}
      </header>

      {section ? (
        <SectionSettingsForm
          section={section}
        />
      ) : (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
          No Local Authority section found.
        </div>
      )}

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Local Authorities
          </h2>

          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {localAuthorities.length} Total
          </span>
        </div>

        {localAuthorities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No Local Authorities have been
            added yet.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {localAuthorities.map(
              (authority) => (
                <article
                  key={authority.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="aspect-[3/2] overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <img
                      src={
                        authority.logo_url
                      }
                      alt={
                        authority.name
                      }
                      className="h-full w-full object-contain p-6"
                    />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {authority.name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Display Order:{" "}
                    {
                      authority.display_order
                    }
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        authority.is_active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {authority.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        authority.is_published
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {authority.is_published
                        ? "Published"
                        : "Draft"}
                    </span>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link
                      href={`/admin/website/homepage/local-authorities/${authority.id}/edit`}
                      className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Edit
                    </Link>

                    <DeleteLocalAuthorityButton
                      authorityId={
                        authority.id
                      }
                      authorityName={
                        authority.name
                      }
                    />
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </section>
    </main>
  );
}