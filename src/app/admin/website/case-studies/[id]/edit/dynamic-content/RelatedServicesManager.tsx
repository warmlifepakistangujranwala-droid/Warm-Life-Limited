/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/case-studies/[id]/edit/dynamic-content/RelatedServicesManager.tsx
 *
 * Purpose :
 * Manages services related to a Case Study.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use client";

import {
  Link2,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  attachRelatedService,
  detachRelatedService,
} from "@/lib/actions/case-studies";

import type {
  CaseStudyRelatedServiceWithService,
} from "@/lib/types/case-studies";

type ServiceOption = {
  id: string;
  service_name: string;
  slug: string;
};

type RelatedServicesManagerProps = {
  caseStudyId: string;
  initialItems:
    CaseStudyRelatedServiceWithService[];
  availableServices:
    ServiceOption[];
};

export default function RelatedServicesManager({
  caseStudyId,
  initialItems,
  availableServices,
}: RelatedServicesManagerProps) {
  const router = useRouter();

  const [selectedServiceId, setSelectedServiceId] =
    useState("");

  const [displayOrder, setDisplayOrder] =
    useState(0);

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
    availableServices.filter(
      (service) =>
        !linkedServiceIds.has(
          service.id,
        ),
    );

  async function attachService(): Promise<void> {
    if (!selectedServiceId) {
      setMessage(
        "Select a service first.",
      );
      return;
    }

    setBusyId("new");
    setMessage("");

    const result =
      await attachRelatedService({
        case_study_id:
          caseStudyId,
        service_id:
          selectedServiceId,
        display_order:
          displayOrder,
      });

    if (!result.success) {
      const fieldErrors =
        result.errors
          ? Object.values(
              result.errors,
            )
              .flat()
              .filter(Boolean)
              .join(" ")
          : "";

      setMessage(
        fieldErrors ||
        result.message,
      );

      setBusyId(null);
      return;
    }

    setSelectedServiceId("");
    setDisplayOrder(0);
    setBusyId(null);
    router.refresh();
  }

  async function removeService(
    id: string,
  ): Promise<void> {
    if (
      !window.confirm(
        "Remove this related service?",
      )
    ) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const result =
      await detachRelatedService(
        id,
        caseStudyId,
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
    <article className="caseStudyDynamicManager">
      <div className="caseStudyDynamicManager__heading">
        <div>
          <span>
            Cross-linking
          </span>

          <h3>
            Related Services
          </h3>

          <p>
            Connect this case study with relevant services.
            These services will appear on the public detail page.
          </p>
        </div>

        <strong>
          {initialItems.length} items
        </strong>
      </div>

      {message ? (
        <div className="caseStudyDynamicManager__message">
          {message}
        </div>
      ) : null}

      <div className="caseStudyRelatedServicesCreate">
        <label>
          <span>
            Select service
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
              Choose a service
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

        <button
          type="button"
          onClick={
            attachService
          }
          disabled={
            busyId !== null ||
            selectableServices.length === 0
          }
        >
          {busyId === "new" ? (
            <Loader2
              className="caseStudyDynamicManager__spinner"
              size={16}
            />
          ) : (
            <Plus size={16} />
          )}

          Attach Service
        </button>
      </div>

      <div className="caseStudyRelatedServicesList">
        {initialItems.length === 0 ? (
          <div className="caseStudyDynamicManager__empty">
            No related services attached yet.
          </div>
        ) : null}

        {initialItems.map(
          (item) => (
            <div
              className="caseStudyRelatedServiceItem"
              key={item.id}
            >
              <div className="caseStudyRelatedServiceItem__icon">
                <Link2 size={20} />
              </div>

              <div className="caseStudyRelatedServiceItem__content">
                <strong>
                  {item.service
                    ?.service_name ??
                    "Service unavailable"}
                </strong>

                <span>
                  {item.service
                    ? `/services/${item.service.slug}`
                    : "Missing service record"}
                </span>
              </div>

              <div className="caseStudyRelatedServiceItem__order">
                Order {item.display_order}
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
                aria-label="Remove related service"
              >
                {busyId ===
                item.id ? (
                  <Loader2
                    className="caseStudyDynamicManager__spinner"
                    size={15}
                  />
                ) : (
                  <Trash2 size={15} />
                )}
              </button>
            </div>
          ),
        )}
      </div>
    </article>
  );
}
