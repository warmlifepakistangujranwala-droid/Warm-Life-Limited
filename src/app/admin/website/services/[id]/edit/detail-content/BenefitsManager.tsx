/**
 * Benefits Manager
 */

"use client";

import {
  CheckCircle2,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  createServiceBenefit,
  deleteServiceBenefit,
  updateServiceBenefit,
} from "@/lib/actions/services-page";

import type {
  ServiceBenefit,
} from "@/lib/types/services-page";

type BenefitsManagerProps = {
  serviceId: string;
  initialItems: ServiceBenefit[];
};

type BenefitDraft = {
  internal_name: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
};

const EMPTY_BENEFIT: BenefitDraft = {
  internal_name: "",
  title: "",
  description: "",
  icon_name: "CheckCircle2",
  display_order: 0,
  is_active: true,
  is_published: true,
};

export default function BenefitsManager({
  serviceId,
  initialItems,
}: BenefitsManagerProps) {
  const router = useRouter();

  const [draft, setDraft] =
    useState<BenefitDraft>(
      EMPTY_BENEFIT,
    );

  const [editing, setEditing] =
    useState<Record<string, BenefitDraft>>(
      Object.fromEntries(
        initialItems.map((item) => [
          item.id,
          {
            internal_name:
              item.internal_name,
            title: item.title,
            description:
              item.description,
            icon_name:
              item.icon_name,
            display_order:
              item.display_order,
            is_active:
              item.is_active,
            is_published:
              item.is_published,
          },
        ]),
      ),
    );

  const [busyId, setBusyId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  async function addBenefit(): Promise<void> {
    if (!draft.title.trim()) {
      setMessage(
        "Benefit title is required.",
      );
      return;
    }

    setBusyId("new");
    setMessage("");

    const result =
      await createServiceBenefit({
        service_id: serviceId,
        ...draft,
        internal_name:
          draft.internal_name.trim() ||
          draft.title.trim(),
      });

    if (!result.success) {
      setMessage(result.message);
      setBusyId(null);
      return;
    }

    setDraft(EMPTY_BENEFIT);
    setBusyId(null);
    router.refresh();
  }

  async function saveBenefit(
    id: string,
  ): Promise<void> {
    const item = editing[id];

    if (!item?.title.trim()) {
      setMessage(
        "Benefit title is required.",
      );
      return;
    }

    setBusyId(id);
    setMessage("");

    const result =
      await updateServiceBenefit(
        id,
        serviceId,
        item,
      );

    if (!result.success) {
      setMessage(result.message);
    } else {
      router.refresh();
    }

    setBusyId(null);
  }

  async function removeBenefit(
    id: string,
  ): Promise<void> {
    if (
      !window.confirm(
        "Delete this benefit?",
      )
    ) {
      return;
    }

    setBusyId(id);

    const result =
      await deleteServiceBenefit(
        id,
        serviceId,
      );

    if (!result.success) {
      setMessage(result.message);
    } else {
      router.refresh();
    }

    setBusyId(null);
  }

  return (
    <article className="detailManagerCard">
      <div className="detailManagerCard__heading">
        <div>
          <span>
            Service benefits
          </span>

          <h3>Benefits</h3>
        </div>

        <strong>
          {initialItems.length} items
        </strong>
      </div>

      {message ? (
        <div className="detailManagerMessage">
          {message}
        </div>
      ) : null}

      <div className="detailManagerCreate">
        <label>
          <span>Title *</span>
          <input
            value={draft.title}
            onChange={(event) =>
              setDraft({
                ...draft,
                title:
                  event.target.value,
              })
            }
          />
        </label>

        <label>
          <span>Icon</span>
          <select
            value={draft.icon_name}
            onChange={(event) =>
              setDraft({
                ...draft,
                icon_name:
                  event.target.value,
              })
            }
          >
            <option value="CheckCircle2">
              Check Circle
            </option>
            <option value="ShieldCheck">
              Shield
            </option>
            <option value="Leaf">
              Leaf
            </option>
            <option value="Zap">
              Energy
            </option>
            <option value="BadgePoundSterling">
              Savings
            </option>
          </select>
        </label>

        <label className="isFull">
          <span>Description</span>
          <textarea
            rows={4}
            value={draft.description}
            onChange={(event) =>
              setDraft({
                ...draft,
                description:
                  event.target.value,
              })
            }
          />
        </label>

        <label>
          <span>Display order</span>
          <input
            type="number"
            min="0"
            value={draft.display_order}
            onChange={(event) =>
              setDraft({
                ...draft,
                display_order:
                  Number(
                    event.target.value,
                  ),
              })
            }
          />
        </label>

        <button
          type="button"
          onClick={addBenefit}
          disabled={busyId !== null}
        >
          {busyId === "new" ? (
            <Loader2
              className="detailManagerSpinner"
              size={16}
            />
          ) : (
            <Plus size={16} />
          )}

          Add Benefit
        </button>
      </div>

      <div className="detailManagerList">
        {initialItems.map((item) => {
          const value =
            editing[item.id];

          return (
            <div
              className="detailManagerItem"
              key={item.id}
            >
              <div className="detailManagerItem__icon">
                <CheckCircle2 size={20} />
              </div>

              <div className="detailManagerItem__fields">
                <input
                  value={value.title}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      [item.id]: {
                        ...value,
                        title:
                          event.target.value,
                      },
                    })
                  }
                />

                <textarea
                  rows={3}
                  value={value.description}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      [item.id]: {
                        ...value,
                        description:
                          event.target.value,
                      },
                    })
                  }
                />

                <div className="detailManagerItem__options">
                  <label>
                    Order
                    <input
                      type="number"
                      min="0"
                      value={
                        value.display_order
                      }
                      onChange={(event) =>
                        setEditing({
                          ...editing,
                          [item.id]: {
                            ...value,
                            display_order:
                              Number(
                                event
                                  .target
                                  .value,
                              ),
                          },
                        })
                      }
                    />
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        value.is_active
                      }
                      onChange={(event) =>
                        setEditing({
                          ...editing,
                          [item.id]: {
                            ...value,
                            is_active:
                              event
                                .target
                                .checked,
                          },
                        })
                      }
                    />
                    Active
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        value.is_published
                      }
                      onChange={(event) =>
                        setEditing({
                          ...editing,
                          [item.id]: {
                            ...value,
                            is_published:
                              event
                                .target
                                .checked,
                          },
                        })
                      }
                    />
                    Published
                  </label>
                </div>
              </div>

              <div className="detailManagerItem__actions">
                <button
                  type="button"
                  className="isSave"
                  onClick={() =>
                    saveBenefit(item.id)
                  }
                  disabled={busyId !== null}
                >
                  {busyId === item.id ? (
                    <Loader2
                      className="detailManagerSpinner"
                      size={15}
                    />
                  ) : (
                    <Save size={15} />
                  )}
                </button>

                <button
                  type="button"
                  className="isDelete"
                  onClick={() =>
                    removeBenefit(
                      item.id,
                    )
                  }
                  disabled={busyId !== null}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
