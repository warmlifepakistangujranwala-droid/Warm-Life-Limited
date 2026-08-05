/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/case-studies/[id]/edit/dynamic-content/TimelineManager.tsx
 *
 * Purpose :
 * Manages repeatable Case Study Timeline items.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use client";

import {
  CalendarDays,
  CircleDot,
  Clock3,
  House,
  Loader2,
  Plus,
  Save,
  Sun,
  Trash2,
  Zap,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  createCaseStudyTimelineItem,
  deleteCaseStudyTimelineItem,
  updateCaseStudyTimelineItem,
} from "@/lib/actions/case-studies";

import type {
  CaseStudyTimelineItem,
} from "@/lib/types/case-studies";

import "./timeline-manager.css";

type TimelineManagerProps = {
  caseStudyId: string;
  initialItems: CaseStudyTimelineItem[];
};

type TimelineDraft = {
  internal_name: string;
  step_number: string;
  title: string;
  description: string;
  date_label: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
};

const EMPTY_TIMELINE_ITEM: TimelineDraft = {
  internal_name: "",
  step_number: "",
  title: "",
  description: "",
  date_label: "",
  icon_name: "CircleDot",
  display_order: 0,
  is_active: true,
  is_published: true,
};

function toTimelineDraft(
  item: CaseStudyTimelineItem,
): TimelineDraft {
  return {
    internal_name:
      item.internal_name ?? "",
    step_number:
      item.step_number ?? "",
    title:
      item.title ?? "",
    description:
      item.description ?? "",
    date_label:
      item.date_label ?? "",
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
  items: CaseStudyTimelineItem[],
): Record<string, TimelineDraft> {
  return Object.fromEntries(
    items.map((item) => [
      item.id,
      toTimelineDraft(item),
    ]),
  );
}

function TimelineIcon({
  name,
}: {
  name: string;
}) {
  if (name === "CalendarDays") {
    return <CalendarDays size={20} />;
  }

  if (name === "Clock3") {
    return <Clock3 size={20} />;
  }

  if (name === "House") {
    return <House size={20} />;
  }

  if (name === "Sun") {
    return <Sun size={20} />;
  }

  if (name === "Zap") {
    return <Zap size={20} />;
  }

  return <CircleDot size={20} />;
}

export default function TimelineManager({
  caseStudyId,
  initialItems,
}: TimelineManagerProps) {
  const router = useRouter();

  const [draft, setDraft] =
    useState<TimelineDraft>(
      EMPTY_TIMELINE_ITEM,
    );

  const [editing, setEditing] =
    useState<
      Record<string, TimelineDraft>
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

  async function addTimelineItem(): Promise<void> {
    if (!draft.title.trim()) {
      setMessage(
        "Timeline title is required.",
      );
      return;
    }

    setBusyId("new");
    setMessage("");

    const result =
      await createCaseStudyTimelineItem({
        case_study_id:
          caseStudyId,

        ...draft,

        internal_name:
          draft.internal_name.trim() ||
          draft.title.trim(),
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
      EMPTY_TIMELINE_ITEM,
    );

    setBusyId(null);
    router.refresh();
  }

  async function saveTimelineItem(
    id: string,
  ): Promise<void> {
    const item =
      editing[id];

    if (!item?.title.trim()) {
      setMessage(
        "Timeline title is required.",
      );
      return;
    }

    setBusyId(id);
    setMessage("");

    const result =
      await updateCaseStudyTimelineItem(
        id,
        caseStudyId,
        {
          ...item,

          internal_name:
            item.internal_name.trim() ||
            item.title.trim(),
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

  async function removeTimelineItem(
    id: string,
  ): Promise<void> {
    if (
      !window.confirm(
        "Delete this timeline item?",
      )
    ) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const result =
      await deleteCaseStudyTimelineItem(
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
            Project Timeline
          </h3>

          <p>
            Add the main stages of the project, from initial
            assessment and planning to installation, testing
            and completion.
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

      <div className="caseStudyDynamicManager__create caseStudyTimelineCreate">
        <label>
          <span>
            Step number
          </span>

          <input
            value={
              draft.step_number
            }
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
          <span>
            Title *
          </span>

          <input
            value={draft.title}
            placeholder="Initial Assessment"
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
          <span>
            Date label
          </span>

          <input
            value={
              draft.date_label
            }
            placeholder="Day 1"
            onChange={(event) =>
              setDraft({
                ...draft,

                date_label:
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
          </select>
        </label>

        <label className="caseStudyTimelineCreate__description">
          <span>
            Description
          </span>

          <textarea
            rows={5}
            value={
              draft.description
            }
            placeholder="Explain what happened during this project stage."
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
          onClick={
            addTimelineItem
          }
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

          Add Timeline Item
        </button>
      </div>

      <div className="caseStudyDynamicManager__list">
        {initialItems.length === 0 ? (
          <div className="caseStudyDynamicManager__empty">
            No timeline items added yet.
          </div>
        ) : null}

        {initialItems.map(
          (item) => {
            const value =
              editing[item.id] ??
              toTimelineDraft(item);

            return (
              <div
                className="caseStudyDynamicManager__item"
                key={item.id}
              >
                <div className="caseStudyDynamicManager__icon">
                  <TimelineIcon
                    name={
                      value.icon_name
                    }
                  />
                </div>

                <div className="caseStudyDynamicManager__fields">
                  <div className="caseStudyTimelineItem__top">
                    <input
                      value={
                        value.step_number
                      }
                      placeholder="01"
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
                      value={
                        value.title
                      }
                      placeholder="Title"
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

                    <input
                      value={
                        value.date_label
                      }
                      placeholder="Date label"
                      onChange={(event) =>
                        setEditing({
                          ...editing,

                          [item.id]: {
                            ...value,

                            date_label:
                              event.target
                                .value,
                          },
                        })
                      }
                    />
                  </div>

                  <textarea
                    rows={4}
                    value={
                      value.description
                    }
                    placeholder="Description"
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

                  <div className="caseStudyTimelineItem__settings">
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
                    </select>

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
                                  event.target
                                    .value,
                                ),
                            },
                          })
                        }
                      />
                    </label>
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
                      saveTimelineItem(
                        item.id,
                      )
                    }
                    disabled={
                      busyId !== null
                    }
                    aria-label="Save timeline item"
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
                      removeTimelineItem(
                        item.id,
                      )
                    }
                    disabled={
                      busyId !== null
                    }
                    aria-label="Delete timeline item"
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
