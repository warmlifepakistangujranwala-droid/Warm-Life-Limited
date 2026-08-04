/**
 * Process Manager
 */

"use client";

import {
  CircleDot,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  createServiceProcessStep,
  deleteServiceProcessStep,
  updateServiceProcessStep,
} from "@/lib/actions/services-page";

import type {
  ServiceProcessStep,
} from "@/lib/types/services-page";

type ProcessManagerProps = {
  serviceId: string;
  initialItems: ServiceProcessStep[];
};

type ProcessDraft = {
  internal_name: string;
  step_number: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
};

const EMPTY_STEP: ProcessDraft = {
  internal_name: "",
  step_number: "",
  title: "",
  description: "",
  icon_name: "CircleDot",
  display_order: 0,
  is_active: true,
  is_published: true,
};

export default function ProcessManager({
  serviceId,
  initialItems,
}: ProcessManagerProps) {
  const router = useRouter();

  const [draft, setDraft] =
    useState<ProcessDraft>(
      EMPTY_STEP,
    );

  const [editing, setEditing] =
    useState<Record<string, ProcessDraft>>(
      Object.fromEntries(
        initialItems.map((item) => [
          item.id,
          {
            internal_name:
              item.internal_name,
            step_number:
              item.step_number,
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

  async function addStep(): Promise<void> {
    if (!draft.title.trim()) {
      setMessage(
        "Process step title is required.",
      );
      return;
    }

    setBusyId("new");
    setMessage("");

    const result =
      await createServiceProcessStep({
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

    setDraft(EMPTY_STEP);
    setBusyId(null);
    router.refresh();
  }

  async function saveStep(
    id: string,
  ): Promise<void> {
    const item = editing[id];

    setBusyId(id);

    const result =
      await updateServiceProcessStep(
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

  async function removeStep(
    id: string,
  ): Promise<void> {
    if (
      !window.confirm(
        "Delete this process step?",
      )
    ) {
      return;
    }

    setBusyId(id);

    const result =
      await deleteServiceProcessStep(
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
            Service process
          </span>

          <h3>Process Steps</h3>
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
          <span>Step number</span>
          <input
            value={draft.step_number}
            placeholder="01"
            onChange={(event) =>
              setDraft({
                ...draft,
                step_number:
                  event.target.value,
              })
            }
          />
        </label>

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
          onClick={addStep}
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

          Add Step
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
                <CircleDot size={20} />
              </div>

              <div className="detailManagerItem__fields">
                <div className="detailManagerItem__two">
                  <input
                    value={
                      value.step_number
                    }
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        [item.id]: {
                          ...value,
                          step_number:
                            event.target
                              .value,
                        },
                      })
                    }
                  />

                  <input
                    value={value.title}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        [item.id]: {
                          ...value,
                          title:
                            event.target
                              .value,
                        },
                      })
                    }
                  />
                </div>

                <textarea
                  rows={3}
                  value={value.description}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      [item.id]: {
                        ...value,
                        description:
                          event.target
                            .value,
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
                              event.target
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
                              event.target
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
                    saveStep(item.id)
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
                    removeStep(item.id)
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
