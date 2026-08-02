import Link from "next/link";
import {
  ExternalLink,
  Megaphone,
} from "lucide-react";

import { getHomepageCtaData } from "@/lib/actions/homepage-cta";

import CtaSettingsForm from "./CtaSettingsForm";

export const dynamic = "force-dynamic";

export default async function HomepageCtaAdminPage() {
  const data =
    await getHomepageCtaData();

  const section = data.section;

  return (
    <main className="space-y-8 p-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-800 text-white">
              <Megaphone size={23} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-950">
                Homepage CTA
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Manage the homepage call-to-action content,
                buttons, background, colours, spacing and
                visibility.
              </p>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View Homepage

            <ExternalLink size={16} />
          </Link>
        </div>
      </header>

      {!section ? (
        <section className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm font-medium text-amber-900">
          CTA section was not found. Run the homepage CTA SQL
          setup first.
        </section>
      ) : (
        <CtaSettingsForm section={section} />
      )}
    </main>
  );
}