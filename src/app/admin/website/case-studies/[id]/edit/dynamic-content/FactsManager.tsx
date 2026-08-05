/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/case-studies/[id]/edit/dynamic-content/FactsManager.tsx
 *
 * Purpose :
 * Manages repeatable Project Facts for a Case Study.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use client";

import {
  CircleDot,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  createCaseStudyFact,
  deleteCaseStudyFact,
  updateCaseStudyFact,
} from "@/lib/actions/case-studies";

import type {
  CaseStudyFact,
} from "@/lib/types/case-studies";

type FactsManagerProps = {
  caseStudyId: string;
  initialItems: CaseStudyFact[];
};

type FactDraft = {
  internal_name: string;
  label: string;
  value: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
};

const EMPTY_FACT: FactDraft = {
  internal_name: "",
  label: "",
  value: "",
  icon_name: "CircleDot",
  display_order: 0,
  is_active: true,
  is_published: true,
};

function toFactDraft(
  item: CaseStudyFact,
): FactDraft {
  return {
    internal_name:
      item.internal_name ?? "",
    label:
      item.label ?? "",
    value:
      item.value ?? "",
    icon_name:
      item.icon_name ?? "CircleDot",
    display_order:
      item.display_order ?? 0,
    is_active:
      item.is_active ?? true,
    is_published:
      item.is_published ?? true,
  };
}

function buildEditingState(
  items: CaseStudyFact[],
): Record<string, FactDraft> {
  return Object.fromEntries(
    items.map((item) => [
      item.id,
      toFactDraft(item),
    ]),
  );
}

export default function FactsManager({
  caseStudyId,
  initialItems,
}: FactsManagerProps) {
  const router = useRouter();

  const [draft, setDraft] =
    useState<FactDraft>(
      EMPTY_FACT,
    );

  const [editing, setEditing] =
    useState<
      Record<string, FactDraft>
    >(() =>
      buildEditingState(
        initialItems,
      ),
    );

  useEffect(() => {
    setEditing(
      buildEditingState(
        initialItems,
      ),
    );
  }, [initialItems]);

  const [busyId, setBusyId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  async function addFact(): Promise<void> {
    if (!draft.label.trim()) {
      setMessage(
        "Fact label is required.",
      );
      return;
    }

    if (!draft.value.trim()) {
      setMessage(
        "Fact value is required.",
      );
      return;
    }

    setBusyId("new");
    setMessage("");

    const result =
      await createCaseStudyFact({
        case_study_id:
          caseStudyId,

        ...draft,

        internal_name:
          draft.internal_name.trim() ||
          `${draft.label.trim()} - ${draft.value.trim()}`,
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

    setDraft(
      EMPTY_FACT,
    );

    setBusyId(null);
    router.refresh();
  }

  async function saveFact(
    id: string,
  ): Promise<void> {
    const item =
      editing[id];

    if (!item?.label.trim()) {
      setMessage(
        "Fact label is required.",
      );
      return;
    }

    if (!item.value.trim()) {
      setMessage(
        "Fact value is required.",
      );
      return;
    }

    setBusyId(id);
    setMessage("");

    const result =
      await updateCaseStudyFact(
        id,
        caseStudyId,
        {
          ...item,

          internal_name:
            item.internal_name.trim() ||
            `${item.label.trim()} - ${item.value.trim()}`,
        },
      );

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
    } else {
      router.refresh();
    }

    setBusyId(null);
  }

  async function removeFact(
    id: string,
  ): Promise<void> {
    if (
      !window.confirm(
        "Delete this project fact?",
      )
    ) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const result =
      await deleteCaseStudyFact(
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
            Repeatable content
          </span>

          <h3>
            Project Facts
          </h3>

          <p>
            Add useful project details such as location,
            duration, property type, installation size or
            completion date.
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

      <div className="caseStudyDynamicManager__create">
        <label>
          <span>
            Label *
          </span>

          <input
            value={draft.label}
            placeholder="Location"
            onChange={(event) =>
              setDraft({
                ...draft,
                label:
                  event.target.value,
              })
            }
          />
        </label>

        <label>
          <span>
            Value *
          </span>

          <input
            value={draft.value}
            placeholder="Manchester"
            onChange={(event) =>
              setDraft({
                ...draft,
                value:
                  event.target.value,
              })
            }
          />
        </label>

        <label>
          <span>
            Icon
          </span>

          <select
            value={
              draft.icon_name
            }
            onChange={(event) =>
              setDraft({
                ...draft,
                icon_name:
                  event.target.value,
              })
            }
          >
            <option value="CircleDot">
              General
            </option>

            <option value="MapPin">
              Location
            </option>

            <option value="CalendarDays">
              Date
            </option>

            <option value="Clock3">
              Duration
            </option>

            <option value="House">
              Property
            </option>

            <option value="Sun">
              Solar
            </option>

            <option value="Zap">
              Energy
            </option>

            <option value="BadgePoundSterling">
              Savings
            </option>
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
              draft.display_order
            }
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
          onClick={addFact}
          disabled={
            busyId !== null
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

          Add Fact
        </button>
      </div>

      <div className="caseStudyDynamicManager__list">
        {initialItems.length === 0 ? (
          <div className="caseStudyDynamicManager__empty">
            No project facts added yet.
          </div>
        ) : null}

        {initialItems.map(
          (item) => {
            const value =
              editing[item.id] ??
              toFactDraft(item);

            return (
              <div
                className="caseStudyDynamicManager__item"
                key={item.id}
              >
                <div className="caseStudyDynamicManager__icon">
                  <CircleDot
                    size={20}
                  />
                </div>

                <div className="caseStudyDynamicManager__fields">
                  <div className="caseStudyDynamicManager__two">
                    <input
                      value={
                        value.label
                      }
                      placeholder="Label"
                      onChange={(event) =>
                        setEditing({
                          ...editing,

                          [item.id]: {
                            ...value,

                            label:
                              event.target
                                .value,
                          },
                        })
                      }
                    />

                    <input
                      value={
                        value.value
                      }
                      placeholder="Value"
                      onChange={(event) =>
                        setEditing({
                          ...editing,

                          [item.id]: {
                            ...value,

                            value:
                              event.target
                                .value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="caseStudyDynamicManager__two">
                    <select
                      value={
                        value.icon_name
                      }
                      onChange={(event) =>
                        setEditing({
                          ...editing,

                          [item.id]: {
                            ...value,

                            icon_name:
                              event.target
                                .value,
                          },
                        })
                      }
                    >
                      <option value="CircleDot">
                        General
                      </option>

                      <option value="MapPin">
                        Location
                      </option>

                      <option value="CalendarDays">
                        Date
                      </option>

                      <option value="Clock3">
                        Duration
                      </option>

                      <option value="House">
                        Property
                      </option>

                      <option value="Sun">
                        Solar
                      </option>

                      <option value="Zap">
                        Energy
                      </option>

                      <option value="BadgePoundSterling">
                        Savings
                      </option>
                    </select>

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
                                event.target
                                  .value,
                              ),
                          },
                        })
                      }
                    />
                  </div>

                  <div className="caseStudyDynamicManager__options">
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

                <div className="caseStudyDynamicManager__actions">
                  <button
                    type="button"
                    className="isSave"
                    onClick={() =>
                      saveFact(
                        item.id,
                      )
                    }
                    disabled={
                      busyId !== null
                    }
                    aria-label="Save project fact"
                  >
                    {busyId ===
                    item.id ? (
                      <Loader2
                        className="caseStudyDynamicManager__spinner"
                        size={15}
                      />
                    ) : (
                      <Save
                        size={15}
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    className="isDelete"
                    onClick={() =>
                      removeFact(
                        item.id,
                      )
                    }
                    disabled={
                      busyId !== null
                    }
                    aria-label="Delete project fact"
                  >
                    <Trash2
                      size={15}
                    />
                  </button>
                </div>
              </div>
            );
          },
        )}
      </div>
    </article>
  );
}
