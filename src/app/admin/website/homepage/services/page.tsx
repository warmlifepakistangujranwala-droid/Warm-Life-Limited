import Link from "next/link";

import {
  getHomepageServices,
  getHomepageServicesSection,
} from "@/lib/actions/homepage-service";

export const metadata = {
  title: "Homepage Services | Admin",
};

export default async function HomepageServicesAdminPage() {
  const [section, services] = await Promise.all([
    getHomepageServicesSection(),
    getHomepageServices(),
  ]);

  const totalServices = services.length;

  const publishedServices = services.filter(
    (service) => service.is_published,
  ).length;

  const activeServices = services.filter(
    (service) => service.is_active,
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Page header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Homepage CMS
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Services
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Manage the homepage services section, service
              content, media, buttons, bullets and display order.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {section ? (
              <Link
                href="/admin/website/homepage/services/settings"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-100"
              >
                Section settings
              </Link>
            ) : null}

            <Link
              href="/admin/website/homepage/services/new"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              Add new service
            </Link>
          </div>
        </div>

        {/* Section summary */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Current section heading
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                {section?.section_heading || "Our Services"}
              </h2>

              {section?.section_label ? (
                <p className="mt-1 text-sm text-slate-600">
                  Label: {section.section_label}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
                  section?.is_active
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                Section{" "}
                {section?.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total services
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {totalServices}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Published
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {publishedServices}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
            <p className="text-sm font-medium text-slate-500">
              Active
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-700">
              {activeServices}
            </p>
          </article>
        </section>

        {/* Services list */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                All services
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Services are displayed according to their display
                order.
              </p>
            </div>

            <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
              {totalServices}{" "}
              {totalServices === 1 ? "service" : "services"}
            </span>
          </div>

          {services.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
                +
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-950">
                No services added
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                Create your first homepage service and add its
                content, image or video, bullets and explore button.
              </p>

              <Link
                href="/admin/website/homepage/services/new"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Create first service
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                      Order
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Service
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Media
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Bullets
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                                    {services.map((service) => (
                    <tr
                      key={service.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-5 py-5 sm:px-6">
                        <div className="space-y-1">
                          <div className="text-lg font-bold text-slate-900">
                            {service.display_order}
                          </div>

                          <div className="text-xs text-slate-500">
                            Display No:{" "}
                            {service.display_number || "-"}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-slate-900">
                            {service.service_name}
                          </h3>

                          <p className="line-clamp-1 text-sm text-slate-600">
                            {service.title}
                          </p>

                          {service.slug ? (
                            <p className="text-xs text-slate-400">
                              /{service.slug}
                            </p>
                          ) : null}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            service.media_type === "video"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {service.media_type === "video"
                            ? "Video"
                            : "Image"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-5">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {service.bullets?.length ?? 0}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex flex-col gap-2">
                          <span
                            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                              service.is_published
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {service.is_published
                              ? "Published"
                              : "Draft"}
                          </span>

                          <span
                            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                              service.is_active
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {service.is_active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-right sm:px-6">
                        <div className="flex justify-end gap-2">
                                                    <Link
                            href={`/admin/website/homepage/services/${service.id}/edit`}
                            className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            Edit
                          </Link>

                          <form
                            action={async () => {
                              "use server";

                              const {
                                setHomepageServicePublished,
                              } = await import(
                                "@/lib/actions/homepage-service"
                              );

                              await setHomepageServicePublished(
                                service.id,
                                !service.is_published,
                              );
                            }}
                          >
                            <button
                              type="submit"
                              className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-semibold text-white transition ${
                                service.is_published
                                  ? "bg-amber-600 hover:bg-amber-700"
                                  : "bg-emerald-700 hover:bg-emerald-800"
                              }`}
                            >
                              {service.is_published
                                ? "Unpublish"
                                : "Publish"}
                            </button>
                          </form>

                          <form
                            action={async () => {
                              "use server";

                              const {
                                deleteHomepageService,
                              } = await import(
                                "@/lib/actions/homepage-service"
                              );

                              await deleteHomepageService(
                                service.id,
                              );
                            }}
                          >
                            <button
                              type="submit"
                              className="inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}