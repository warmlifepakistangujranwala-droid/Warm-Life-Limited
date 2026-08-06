/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/blogs/[id]/edit/dynamic-content/HighlightsManager.tsx
 *
 * Purpose :
 * Manages repeatable Key Takeaways and Helpful Tips.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use client";

import {
  BadgeCheck,
  CheckCircle2,
  CircleHelp,
  Lightbulb,
  Loader2,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Zap,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createBlogHighlight,
  deleteBlogChildItem,
  updateBlogHighlight,
} from "@/lib/actions/blogs";

import type {
  BlogHighlight,
  BlogHighlightType,
  CreateBlogHighlightInput,
  UpdateBlogHighlightInput,
} from "@/lib/types/blogs";

import "./highlights-manager.css";

type HighlightsManagerProps = {
  blogId: string;
  initialItems: BlogHighlight[];
  takeawaysEnabled: boolean;
  tipsEnabled: boolean;
  takeawaysHeading: string;
  tipsHeading: string;
};

type HighlightDraft = Omit<
  CreateBlogHighlightInput,
  "blog_id"
>;

const EMPTY_HIGHLIGHT: HighlightDraft = {
  highlight_type: "takeaway",
  internal_name: "",
  title: "",
  description: "",
  icon_name: "CheckCircle2",
  display_order: 0,
  is_active: true,
  is_published: true,
};

const ICON_OPTIONS = [
  "CheckCircle2",
  "Lightbulb",
  "Sparkles",
  "Zap",
  "Star",
  "BadgeCheck",
  "ShieldCheck",
  "CircleHelp",
] as const;

function toDraft(
  item: BlogHighlight,
): HighlightDraft {
  return {
    highlight_type:
      item.highlight_type,
    internal_name:
      item.internal_name ?? "",
    title:
      item.title ?? "",
    description:
      item.description ?? "",
    icon_name:
      item.icon_name || "CheckCircle2",
    display_order:
      item.display_order ?? 0,
    is_active:
      item.is_active ?? true,
    is_published:
      item.is_published ?? true,
  };
}

function buildEditingState(
  items: BlogHighlight[],
): Record<string, HighlightDraft> {
  return Object.fromEntries(
    items.map((item) => [
      item.id,
      toDraft(item),
    ]),
  );
}

function HighlightIcon({
  name,
}: {
  name: string;
}) {
  const iconMap = {
    CheckCircle2,
    Lightbulb,
    Sparkles,
    Zap,
    Star,
    BadgeCheck,
    ShieldCheck,
    CircleHelp,
  };

  const Icon =
    iconMap[
      name as keyof typeof iconMap
    ] ?? CheckCircle2;

  return <Icon size={19} />;
}

function HighlightFields({
  value,
  onChange,
  showType = true,
}: {
  value: HighlightDraft;
  onChange: (
    value: HighlightDraft,
  ) => void;
  showType?: boolean;
}) {
  return (
    <div className="blogHighlightFields">
      {showType ? (
        <label>
          <span>
            Highlight type
          </span>

          <select
            value={
              value.highlight_type
            }
            onChange={(event) =>
              onChange({
                ...value,
                highlight_type:
                  event.target
                    .value as BlogHighlightType,
              })
            }
          >
            <option value="takeaway">
              Key Takeaway
            </option>

            <option value="tip">
              Helpful Tip
            </option>
          </select>
        </label>
      ) : null}

      <label>
        <span>
          Icon
        </span>

        <select
          value={
            value.icon_name
          }
          onChange={(event) =>
            onChange({
              ...value,
              icon_name:
                event.target.value,
            })
          }
        >
          {ICON_OPTIONS.map(
            (iconName) => (
              <option
                key={iconName}
                value={iconName}
              >
                {iconName}
              </option>
            ),
          )}
        </select>
      </label>

      <label>
        <span>
          Internal name
        </span>

        <input
          value={
            value.internal_name ?? ""
          }
          placeholder="Admin reference"
          onChange={(event) =>
            onChange({
              ...value,
              internal_name:
                event.target.value,
            })
          }
        />
      </label>

      <label>
        <span>
          Title
        </span>

        <input
          value={
            value.title ?? ""
          }
          placeholder="Optional short title"
          onChange={(event) =>
            onChange({
              ...value,
              title:
                event.target.value,
            })
          }
        />
      </label>

      <label className="isFull">
        <span>
          Description *
        </span>

        <textarea
          rows={5}
          value={
            value.description
          }
          placeholder="Add the takeaway or practical tip."
          onChange={(event) =>
            onChange({
              ...value,
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
            value.display_order
          }
          onChange={(event) =>
            onChange({
              ...value,
              display_order:
                Number(
                  event.target.value,
                ),
            })
          }
        />
      </label>

      <div className="blogHighlightFields__toggles">
        <label>
          <input
            type="checkbox"
            checked={
              value.is_active
            }
            onChange={(event) =>
              onChange({
                ...value,
                is_active:
                  event.target.checked,
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
              onChange({
                ...value,
                is_published:
                  event.target.checked,
              })
            }
          />

          Published
        </label>
      </div>
    </div>
  );
}

export default function HighlightsManager({
  blogId,
  initialItems,
  takeawaysEnabled,
  tipsEnabled,
  takeawaysHeading,
  tipsHeading,
}: HighlightsManagerProps) {
  const router = useRouter();

  const [draft, setDraft] =
    useState<HighlightDraft>({
      ...EMPTY_HIGHLIGHT,
      highlight_type:
        takeawaysEnabled
          ? "takeaway"
          : "tip",
    });

  const [editing, setEditing] =
    useState<
      Record<string, HighlightDraft>
    >(() =>
      buildEditingState(
        initialItems,
      ),
    );

  const [busyId, setBusyId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    setEditing(
      buildEditingState(
        initialItems,
      ),
    );
  }, [initialItems]);

  const visibleTypes =
    useMemo(() => {
      const values:
        BlogHighlightType[] = [];

      if (takeawaysEnabled) {
        values.push("takeaway");
      }

      if (tipsEnabled) {
        values.push("tip");
      }

      return values;
    }, [
      takeawaysEnabled,
      tipsEnabled,
    ]);

  const sortedItems =
    useMemo(
      () =>
        [...initialItems].sort(
          (first, second) => {
            if (
              first.highlight_type !==
              second.highlight_type
            ) {
              return first.highlight_type.localeCompare(
                second.highlight_type,
              );
            }

            return (
              first.display_order -
              second.display_order
            );
          },
        ),
      [initialItems],
    );

  async function addHighlight():
    Promise<void> {
    if (
      !draft.description.trim()
    ) {
      setMessage(
        "Description is required.",
      );
      return;
    }

    if (
      !visibleTypes.includes(
        draft.highlight_type,
      )
    ) {
      setMessage(
        "Enable this highlight type in the Blog form first.",
      );
      return;
    }

    setBusyId("new");
    setMessage("");

    const result =
      await createBlogHighlight({
        blog_id: blogId,
        ...draft,
        internal_name:
          draft.internal_name?.trim() ||
          draft.title?.trim() ||
          draft.description
            .trim()
            .slice(0, 80),
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

    setDraft({
      ...EMPTY_HIGHLIGHT,
      highlight_type:
        visibleTypes[0] ??
        "takeaway",
      display_order:
        initialItems.filter(
          (item) =>
            item.highlight_type ===
            draft.highlight_type,
        ).length,
    });

    setBusyId(null);
    router.refresh();
  }

  async function saveHighlight(
    id: string,
  ): Promise<void> {
    const value =
      editing[id];

    if (!value) {
      return;
    }

    if (
      !value.description.trim()
    ) {
      setMessage(
        "Description is required.",
      );
      return;
    }

    setBusyId(id);
    setMessage("");

    const payload:
      UpdateBlogHighlightInput = {
        ...value,
        internal_name:
          value.internal_name?.trim() ||
          value.title?.trim() ||
          value.description
            .trim()
            .slice(0, 80),
      };

    const result =
      await updateBlogHighlight(
        id,
        payload,
      );

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
    } else {
      router.refresh();
    }

    setBusyId(null);
  }

  async function removeHighlight(
    id: string,
  ): Promise<void> {
    if (
      !window.confirm(
        "Delete this highlight?",
      )
    ) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const result =
      await deleteBlogChildItem(
        "blog_highlights",
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

  if (
    !takeawaysEnabled &&
    !tipsEnabled
  ) {
    return null;
  }

  return (
    <article className="blogHighlightsManager">
      <div className="blogHighlightsManager__heading">
        <div>
          <span>
            Repeatable article highlights
          </span>

          <h3>
            Takeaways & Tips
          </h3>

          <p>
            Add concise summaries and practical
            recommendations that readers can scan quickly.
          </p>
        </div>

        <div className="blogHighlightsManager__counts">
          {takeawaysEnabled ? (
            <span>
              {
                initialItems.filter(
                  (item) =>
                    item.highlight_type ===
                    "takeaway",
                ).length
              }
              {" "}
              takeaways
            </span>
          ) : null}

          {tipsEnabled ? (
            <span>
              {
                initialItems.filter(
                  (item) =>
                    item.highlight_type ===
                    "tip",
                ).length
              }
              {" "}
              tips
            </span>
          ) : null}
        </div>
      </div>

      <div className="blogHighlightsManager__sectionNames">
        {takeawaysEnabled ? (
          <span>
            Takeaways section:
            {" "}
            <strong>
              {takeawaysHeading}
            </strong>
          </span>
        ) : null}

        {tipsEnabled ? (
          <span>
            Tips section:
            {" "}
            <strong>
              {tipsHeading}
            </strong>
          </span>
        ) : null}
      </div>

      {message ? (
        <div className="blogHighlightsManager__message">
          {message}
        </div>
      ) : null}

      <div className="blogHighlightsManager__create">
        <div className="blogHighlightsManager__createTitle">
          <Plus size={18} />

          <div>
            <strong>
              Add Highlight
            </strong>

            <span>
              Choose Key Takeaway or Helpful Tip.
            </span>
          </div>
        </div>

        <HighlightFields
          value={draft}
          onChange={setDraft}
          showType={
            visibleTypes.length > 1
          }
        />

        <button
          type="button"
          onClick={addHighlight}
          disabled={
            busyId !== null
          }
        >
          {busyId === "new" ? (
            <Loader2
              size={16}
              className="blogHighlightsManager__spinner"
            />
          ) : (
            <Plus size={16} />
          )}

          Add Highlight
        </button>
      </div>

      <div className="blogHighlightsManager__list">
        {sortedItems.length === 0 ? (
          <div className="blogHighlightsManager__empty">
            No takeaways or tips added yet.
          </div>
        ) : null}

        {sortedItems.map(
          (item) => {
            const value =
              editing[item.id] ??
              toDraft(item);

            return (
              <section
                className={`blogHighlightCard is-${value.highlight_type}`}
                key={item.id}
              >
                <header>
                  <div className="blogHighlightCard__icon">
                    <HighlightIcon
                      name={
                        value.icon_name
                      }
                    />
                  </div>

                  <div>
                    <span>
                      {value.highlight_type ===
                      "takeaway"
                        ? "Key Takeaway"
                        : "Helpful Tip"}
                    </span>

                    <strong>
                      {value.title ||
                        value.internal_name ||
                        "Untitled highlight"}
                    </strong>
                  </div>

                  <div className="blogHighlightCard__order">
                    Order {value.display_order}
                  </div>
                </header>

                <HighlightFields
                  value={value}
                  onChange={(next) =>
                    setEditing({
                      ...editing,
                      [item.id]: next,
                    })
                  }
                />

                <footer>
                  <button
                    type="button"
                    className="isSave"
                    disabled={
                      busyId !== null
                    }
                    onClick={() =>
                      saveHighlight(
                        item.id,
                      )
                    }
                  >
                    {busyId === item.id ? (
                      <Loader2
                        size={15}
                        className="blogHighlightsManager__spinner"
                      />
                    ) : (
                      <Save size={15} />
                    )}

                    Save
                  </button>

                  <button
                    type="button"
                    className="isDelete"
                    disabled={
                      busyId !== null
                    }
                    onClick={() =>
                      removeHighlight(
                        item.id,
                      )
                    }
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </footer>
              </section>
            );
          },
        )}
      </div>
    </article>
  );
}
