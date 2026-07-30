import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";

import DeleteCertificationButton from "./DeleteCertificationButton";
import SectionSettingsForm from "./SectionSettingsForm";

import { createClient } from "@/lib/supabase/server";
import type {
  HomepageCertification,
  HomepageCertificationsSection,
} from "@/lib/types/homepage-certification";

export default async function CertificationsPage() {
  const supabase = await createClient();

  const [
    { data: section, error: sectionError },
    { data: certifications, error: certificationsError },
  ] = await Promise.all([
    supabase
      .from("homepage_certifications_section")
      .select("*")
      .limit(1)
      .maybeSingle(),
    supabase
      .from("certifications")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  if (sectionError) {
    console.error(
      "Failed to load certifications section settings:",
      sectionError.message,
    );
  }

  if (certificationsError) {
    console.error(
      "Failed to load certifications:",
      certificationsError.message,
    );
  }

  const typedSection =
    section as HomepageCertificationsSection | null;
  const items =
    (certifications ?? []) as HomepageCertification[];

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-800 text-white">
            <Award size={22} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-950">
              Certifications
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Manage the section design and the continuously
              scrolling certification logos.
            </p>
          </div>
        </div>

        <Link
          href="/admin/website/homepage/certifications/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Add Certificate
          <ArrowRight size={16} />
        </Link>
      </header>

      {typedSection ? (
        <SectionSettingsForm section={typedSection} />
      ) : (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          Certifications section settings were not found.
          Run the Certifications SQL migration first.
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Certificates
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {items.length} certificate
              {items.length === 1 ? "" : "s"} added.
            </p>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="grid h-36 place-items-center rounded-xl bg-slate-50 p-5">
                  <Image
                    src={item.logo_url}
                    alt={item.name}
                    width={220}
                    height={120}
                    className="max-h-24 w-auto object-contain"
                  />
                </div>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-950">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Order {item.display_order}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      item.is_active && item.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.is_active && item.is_published
                      ? "Live"
                      : "Hidden"}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Link
                    href={`/admin/website/homepage/certifications/${item.id}/edit`}
                    className="inline-flex items-center justify-center rounded-xl border border-emerald-700 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                  >
                    Edit
                  </Link>

                  <DeleteCertificationButton
                    certificationId={item.id}
                    certificationName={item.name}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-950">
              No certificates added
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Add the first certificate logo to display it
              on the homepage.
            </p>

            <Link
              href="/admin/website/homepage/certifications/new"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
            >
              Add Certificate
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
