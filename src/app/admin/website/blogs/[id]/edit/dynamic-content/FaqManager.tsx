/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/blogs/[id]/edit/dynamic-content/FaqManager.tsx
 *
 * Purpose :
 * Manages repeatable Blog FAQ items.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use client";

import {
  CircleHelp,
  Loader2,
  Plus,
  Save,
  Trash2,
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
  createBlogFaq,
  deleteBlogChildItem,
  updateBlogFaq,
} from "@/lib/actions/blogs";

import type {
  BlogFaq,
  CreateBlogFaqInput,
  UpdateBlogFaqInput,
} from "@/lib/types/blogs";

import "./faq-manager.css";

type FaqManagerProps = {
  blogId: string;
  initialItems: BlogFaq[];
  sectionHeading: string;
};

type FaqDraft = Omit<
  CreateBlogFaqInput,
  "blog_id"
>;

const EMPTY_FAQ: FaqDraft = {
  internal_name: "",
  question: "",
  answer: "",
  display_order: 0,
  is_active: true,
  is_published: true,
};

function toDraft(
  item: BlogFaq,
): FaqDraft {
  return {
    internal_name:
      item.internal_name ?? "",
    question:
      item.question ?? "",
    answer:
      item.answer ?? "",
    display_order:
      item.display_order ?? 0,
    is_active:
      item.is_active ?? true,
    is_published:
      item.is_published ?? true,
  };
}

function buildEditingState(
  items: BlogFaq[],
): Record<string, FaqDraft> {
  return Object.fromEntries(
    items.map((item) => [
      item.id,
      toDraft(item),
    ]),
  );
}

function FaqFields({
  value,
  onChange,
}: {
  value: FaqDraft;
  onChange: (
    value: FaqDraft,
  ) => void;
}) {
  return (
    <div className="blogFaqFields">
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

      <label className="isFull">
        <span>
          Question *
        </span>

        <input
          value={
            value.question
          }
          placeholder="Enter the question"
          onChange={(event) =>
            onChange({
              ...value,
              question:
                event.target.value,
            })
          }
        />
      </label>

      <label className="isFull">
        <span>
          Answer *
        </span>

        <textarea
          rows={7}
          value={
            value.answer
          }
          placeholder="Write a clear and useful answer."
          onChange={(event) =>
            onChange({
              ...value,
              answer:
                event.target.value,
            })
          }
        />
      </label>

      <div className="blogFaqFields__toggles">
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

export default function FaqManager({
  blogId,
  initialItems,
  sectionHeading,
}: FaqManagerProps) {
  const router = useRouter();

  const [draft, setDraft] =
    useState<FaqDraft>({
      ...EMPTY_FAQ,
      display_order:
        initialItems.length,
    });

  const [editing, setEditing] =
    useState<
      Record<string, FaqDraft>
    >(() =>
      buildEditingState(
        initialItems,
      ),
    );

  const [busyId, setBusyId] =
    useState<string | null>(
      null,
    );

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    setEditing(
      buildEditingState(
        initialItems,
      ),
    );
  }, [initialItems]);

  const sortedItems =
    useMemo(
      () =>
        [...initialItems].sort(
          (first, second) =>
            first.display_order -
            second.display_order,
        ),
      [initialItems],
    );

  async function addFaq():
    Promise<void> {
    if (!draft.question.trim()) {
      setMessage(
        "Question is required.",
      );
      return;
    }

    if (!draft.answer.trim()) {
      setMessage(
        "Answer is required.",
      );
      return;
    }

    setBusyId("new");
    setMessage("");

    const result =
      await createBlogFaq({
        blog_id: blogId,
        ...draft,
        internal_name:
          draft.internal_name?.trim() ||
          draft.question
            .trim()
            .slice(0, 100),
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
      ...EMPTY_FAQ,
      display_order:
        initialItems.length + 1,
    });

    setBusyId(null);
    router.refresh();
  }

  async function saveFaq(
    id: string,
  ): Promise<void> {
    const value =
      editing[id];

    if (!value) {
      return;
    }

    if (!value.question.trim()) {
      setMessage(
        "Question is required.",
      );
      return;
    }

    if (!value.answer.trim()) {
      setMessage(
        "Answer is required.",
      );
      return;
    }

    setBusyId(id);
    setMessage("");

    const payload:
      UpdateBlogFaqInput = {
        ...value,
        internal_name:
          value.internal_name?.trim() ||
          value.question
            .trim()
            .slice(0, 100),
      };

    const result =
      await updateBlogFaq(
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

  async function removeFaq(
    id: string,
  ): Promise<void> {
    if (
      !window.confirm(
        "Delete this FAQ?",
      )
    ) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const result =
      await deleteBlogChildItem(
        "blog_faqs",
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
    <article className="blogFaqManager">
      <div className="blogFaqManager__heading">
        <div>
          <span>
            Repeatable questions
          </span>

          <h3>
            FAQ Manager
          </h3>

          <p>
            Add common questions and answers
            that support readers and improve
            structured article content.
          </p>
        </div>

        <strong>
          {initialItems.length}
          {" "}
          FAQs
        </strong>
      </div>

      <div className="blogFaqManager__sectionName">
        Public section heading:
        {" "}
        <strong>
          {sectionHeading}
        </strong>
      </div>

      {message ? (
        <div className="blogFaqManager__message">
          {message}
        </div>
      ) : null}

      <div className="blogFaqManager__create">
        <div className="blogFaqManager__createTitle">
          <CircleHelp size={18} />

          <div>
            <strong>
              Add FAQ
            </strong>

            <span>
              Add one clear question and answer.
            </span>
          </div>
        </div>

        <FaqFields
          value={draft}
          onChange={setDraft}
        />

        <button
          type="button"
          onClick={addFaq}
          disabled={
            busyId !== null
          }
        >
          {busyId === "new" ? (
            <Loader2
              size={16}
              className="blogFaqManager__spinner"
            />
          ) : (
            <Plus size={16} />
          )}

          Add FAQ
        </button>
      </div>

      <div className="blogFaqManager__list">
        {sortedItems.length === 0 ? (
          <div className="blogFaqManager__empty">
            No FAQs added yet.
          </div>
        ) : null}

        {sortedItems.map(
          (item, index) => {
            const value =
              editing[item.id] ??
              toDraft(item);

            return (
              <section
                className="blogFaqCard"
                key={item.id}
              >
                <header>
                  <div className="blogFaqCard__number">
                    {String(index + 1).padStart(
                      2,
                      "0",
                    )}
                  </div>

                  <div>
                    <span>
                      FAQ
                    </span>

                    <strong>
                      {value.question ||
                        "Untitled question"}
                    </strong>
                  </div>

                  <div className="blogFaqCard__order">
                    Order {value.display_order}
                  </div>
                </header>

                <FaqFields
                  value={value}
                  onChange={(next) =>
                    setEditing({
                      ...editing,
                      [item.id]:
                        next,
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
                      saveFaq(
                        item.id,
                      )
                    }
                  >
                    {busyId ===
                    item.id ? (
                      <Loader2
                        size={15}
                        className="blogFaqManager__spinner"
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
                      removeFaq(
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
