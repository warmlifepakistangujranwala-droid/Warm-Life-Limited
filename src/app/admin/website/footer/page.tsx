import Link from "next/link";
import {
  ExternalLink,
  PanelBottom,
  Plus,
} from "lucide-react";

import { getSiteFooterData } from "@/lib/actions/site-footer";

import FooterSettingsForm from "./FooterSettingsForm";
import FooterContactForm from "./FooterContactForm";
import FooterNavigationForm from "./FooterNavigationForm";
import FooterNavigationList from "./FooterNavigationList";
import FooterSocialForm from "./FooterSocialForm";
import FooterSocialList from "./FooterSocialList";

export const dynamic = "force-dynamic";

export default async function SiteFooterAdminPage() {
  const data = await getSiteFooterData();

  const settings = data.settings;
  const contact = data.contact;
  const navigation = data.navigation;
  const socialLinks = data.socialLinks;
  const services = data.services;

  return (
    <main className="space-y-8 p-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-800 text-white">
              <PanelBottom size={23} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-950">
                Global Footer
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Manage footer branding, layout, colours,
                contact details, dynamic services, page links,
                social media and copyright settings.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Website
              <ExternalLink size={16} />
            </Link>

            <a
              href="#add-footer-link"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <Plus size={17} />
              Add Footer Link
            </a>
          </div>
        </div>
      </header>

      {!settings ? (
        <section className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm font-medium text-amber-900">
          Footer settings were not found. Run the global
          footer SQL setup first.
        </section>
      ) : (
        <>
          <FooterSettingsForm settings={settings} />

          {contact ? (
            <FooterContactForm contact={contact} />
          ) : (
            <section className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm font-medium text-amber-900">
              Footer contact record was not found. Check the
              SQL setup and default contact insert.
            </section>
          )}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Dynamic Services
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  These services are loaded automatically
                  from active and published service records.
                  They are not hardcoded in the footer.
                </p>
              </div>

              <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                {services.length}{" "}
                {services.length === 1
                  ? "service"
                  : "services"}
              </span>
            </div>

            {services.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="font-semibold text-slate-900">
                  No published services found
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Publish services in the services CMS and
                  they will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="font-semibold text-slate-950">
                      {service.title}
                    </p>

                    <p className="mt-2 break-all text-xs text-slate-500">
                      {service.href}
                    </p>

                    <p className="mt-2 text-xs font-medium text-emerald-700">
                      Order: {service.display_order}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section
            id="add-footer-link"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-950">
                Add Footer Link
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add quick links, legal links, support links
                or resource links to the footer.
              </p>
            </div>

            <FooterNavigationForm
              footerId={settings.id}
            />
          </section>

          <FooterNavigationList
            items={navigation}
          />

          <section
            id="add-social-link"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-950">
                Add Social Link
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add social platforms and choose the icon
                name used by the live footer.
              </p>
            </div>

            <FooterSocialForm
              footerId={settings.id}
            />
          </section>

          <FooterSocialList
            links={socialLinks}
          />
        </>
      )}
    </main>
  );
}