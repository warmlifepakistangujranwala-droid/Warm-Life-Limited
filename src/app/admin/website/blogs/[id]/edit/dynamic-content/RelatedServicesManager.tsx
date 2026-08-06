/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/blogs/[id]/edit/dynamic-content/RelatedServicesManager.tsx
 *
 * Purpose :
 * Manages Services related to a Blog article.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  Link2,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  attachBlogRelatedService,
  detachBlogRelatedService,
} from "@/lib/actions/blogs";

import type {
  BlogRelatedServiceWithService,
} from "@/lib/types/blogs";

import "./related-services-manager.css";

type ServiceOption = {
  id: string;
  service_name: string;
  slug: string;
  short_description: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  explore_button_text: string | null;
};

type RelatedServicesManagerProps = {
  blogId: string;
  initialItems: BlogRelatedServiceWithService[];
  availableServices: ServiceOption[];
  sectionHeading: string;
};

export default function RelatedServicesManager({
  blogId,
  initialItems,
  availableServices,
  sectionHeading,
}: RelatedServicesManagerProps) {
  const router = useRouter();

  const [selectedServiceId, setSelectedServiceId] =
    useState("");

  const [displayOrder, setDisplayOrder] =
    useState(initialItems.length);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [busyId, setBusyId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const linkedServiceIds =
    useMemo(
      () =>
        new Set(
          initialItems.map(
            (item) =>
              item.service_id,
          ),
        ),
      [initialItems],
    );

  const selectableServices =
    useMemo(
      () =>
        availableServices
          .filter(
            (service) =>
              !linkedServiceIds.has(
                service.id,
              ),
          )
          .filter((service) => {
            const query =
              searchQuery
                .trim()
                .toLowerCase();

            if (!query) {
              return true;
            }

            return (
              service.service_name
                .toLowerCase()
                .includes(query) ||
              service.slug
                .toLowerCase()
                .includes(query) ||
              service.short_description
                ?.toLowerCase()
                .includes(query) ||
              false
            );
          }),
      [
        availableServices,
        linkedServiceIds,
        searchQuery,
      ],
    );

  const selectedService =
    availableServices.find(
      (service) =>
        service.id === selectedServiceId,
    ) ?? null;

  async function attachService():
    Promise<void> {
    if (!selectedServiceId) {
      setMessage(
        "Select a Service first.",
      );
      return;
    }

    setBusyId("new");
    setMessage("");

    const result =
      await attachBlogRelatedService({
        blog_id: blogId,
        service_id:
          selectedServiceId,
        display_order:
          displayOrder,
      });

    if (!result.success) {
      const errors =
        result.errors
          ? Object.values(
              result.errors,
            )
              .flat()
              .filter(Boolean)
              .join(" ")
          : "";

      setMessage(
        errors ||
        result.message,
      );

      setBusyId(null);
      return;
    }

    setSelectedServiceId("");
    setSearchQuery("");
    setDisplayOrder(
      initialItems.length + 1,
    );
    setBusyId(null);
    router.refresh();
  }

  async function removeService(
    id: string,
  ): Promise<void> {
    if (
      !window.confirm(
        "Remove this related Service?",
      )
    ) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const result =
      await detachBlogRelatedService(
        id,
      );

    if (!result.success) {
      setMessage(
        result.message,
      );
    } else {
      router.refresh();
    }

    setBusyId(null);
  }

  return (
    <article className="blogRelatedServicesManager">
      <div className="blogRelatedServicesManager__heading">
        <div>
          <span>
            Service cross-linking
          </span>

          <h3>
            Related Services
          </h3>

          <p>
            Connect this article with relevant Warm Life
            Services so readers can continue to a suitable
            solution or enquiry route.
          </p>
        </div>

        <strong>
          {initialItems.length}
          {" "}
          Services
        </strong>
      </div>

      <div className="blogRelatedServicesManager__sectionName">
        Public section heading:
        {" "}
        <strong>
          {sectionHeading}
        </strong>
      </div>

      {message ? (
        <div className="blogRelatedServicesManager__message">
          {message}
        </div>
      ) : null}

      <div className="blogRelatedServicesManager__create">
        <div className="blogRelatedServicesManager__search">
          <Search size={16} />

          <input
            value={searchQuery}
            placeholder="Search by Service name, slug or description"
            onChange={(event) =>
              setSearchQuery(
                event.target.value,
              )
            }
          />
        </div>

        <div className="blogRelatedServicesManager__fields">
          <label>
            <span>
              Select Service
            </span>

            <select
              value={
                selectedServiceId
              }
              onChange={(event) =>
                setSelectedServiceId(
                  event.target.value,
                )
              }
            >
              <option value="">
                Choose a Service
              </option>

              {selectableServices.map(
                (service) => (
                  <option
                    key={service.id}
                    value={service.id}
                  >
                    {service.service_name}
                  </option>
                ),
              )}
            </select>
          </label>

          <label>
            <span>
              Display order
            </span>

            <input
              type="number"
              min="0"
              value={
                displayOrder
              }
              onChange={(event) =>
                setDisplayOrder(
                  Number(
                    event.target.value,
                  ),
                )
              }
            />
          </label>
        </div>

        {selectedService ? (
          <div className="blogRelatedServicesManager__selected">
            {selectedService.featured_image_url ? (
              <img
                src={
                  selectedService.featured_image_url
                }
                alt={
                  selectedService.featured_image_alt ||
                  selectedService.service_name
                }
              />
            ) : (
              <div>
                <BriefcaseBusiness
                  size={24}
                />
              </div>
            )}

            <div>
              <span>
                Selected Service
              </span>

              <strong>
                {selectedService.service_name}
              </strong>

              <small>
                /services/{selectedService.slug}
              </small>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={
            attachService
          }
          disabled={
            busyId !== null ||
            !selectedServiceId
          }
        >
          {busyId === "new" ? (
            <Loader2
              size={16}
              className="blogRelatedServicesManager__spinner"
            />
          ) : (
            <Plus size={16} />
          )}

          Add Related Service
        </button>
      </div>

      <div className="blogRelatedServicesManager__list">
        {initialItems.length === 0 ? (
          <div className="blogRelatedServicesManager__empty">
            No related Services selected yet.
          </div>
        ) : null}

        {initialItems.map(
          (item) => {
            const service =
              item.service;

            return (
              <section
                className="blogRelatedServiceCard"
                key={item.id}
              >
                {service?.featured_image_url ? (
                  <img
                    src={
                      service.featured_image_url
                    }
                    alt={
                      service.featured_image_alt ||
                      service.service_name
                    }
                  />
                ) : (
                  <div className="blogRelatedServiceCard__fallback">
                    <BriefcaseBusiness
                      size={25}
                    />
                  </div>
                )}

                <div className="blogRelatedServiceCard__content">
                  <div className="blogRelatedServiceCard__label">
                    <Link2 size={13} />
                    Related Service
                  </div>

                  <h4>
                    {service?.service_name ||
                      "Service unavailable"}
                  </h4>

                  {service?.short_description ? (
                    <p>
                      {service.short_description}
                    </p>
                  ) : null}

                  <div className="blogRelatedServiceCard__meta">
                    {service ? (
                      <span>
                        /services/{service.slug}
                      </span>
                    ) : null}

                    <span>
                      Display order:
                      {" "}
                      {item.display_order}
                    </span>
                  </div>

                  {service ? (
                    <a
                      href={`/services/${service.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ArrowUpRight size={14} />
                      Preview Service
                    </a>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeService(
                      item.id,
                    )
                  }
                  disabled={
                    busyId !== null
                  }
                  aria-label="Remove related Service"
                >
                  {busyId ===
                  item.id ? (
                    <Loader2
                      size={15}
                      className="blogRelatedServicesManager__spinner"
                    />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </section>
            );
          },
        )}
      </div>
    </article>
  );
}
