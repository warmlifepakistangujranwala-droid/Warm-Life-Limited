import Link from "next/link";
import {
  ExternalLink,
  Menu,
  Plus,
} from "lucide-react";

import { getSiteHeaderData } from "@/lib/actions/site-header";

// import HeaderSettingsForm from "./HeaderSettingsForm";
import HeaderSettingsForm from "./HeaderSettingsForm";
import NavigationItemForm from "./NavigationItemForm";
import NavigationItemsList from "./NavigationItemsList";
export const dynamic = "force-dynamic";

export default async function SiteHeaderAdminPage() {
  const data = await getSiteHeaderData();

  const settings = data.settings;
  const navigation = data.navigation;

  return (
    <main className="space-y-8 p-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-800 text-white">
              <Menu size={23} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-950">
                Global Header
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Manage the global navbar, logo, menu links,
                CTA button, announcement bar, mobile menu,
                colours, typography and spacing.
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
              href="#add-navigation-item"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <Plus size={17} />
              Add Menu Item
            </a>
          </div>
        </div>
      </header>

      {!settings ? (
        <section className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm font-medium text-amber-900">
          Header settings were not found. Run the global
          header SQL setup first.
        </section>
      ) : (
        <>
          <HeaderSettingsForm settings={settings} />

          <section
            id="add-navigation-item"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-950">
                Add Navigation Item
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add a new menu item and control its label,
                link, display order and visibility.
              </p>
            </div>

            <NavigationItemForm headerId={settings.id} />
          </section>

          <NavigationItemsList items={navigation} />
        </>
      )}
    </main>
  );
}