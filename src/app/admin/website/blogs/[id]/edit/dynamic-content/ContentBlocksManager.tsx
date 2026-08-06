/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/blogs/[id]/edit/dynamic-content/ContentBlocksManager.tsx
 *
 * Purpose :
 * Manages repeatable Blog content blocks.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use client";

import {
  Code2,
  Heading2,
  Image as ImageIcon,
  Info,
  List,
  ListOrdered,
  Loader2,
  MessageSquareQuote,
  Plus,
  Save,
  Table2,
  Text,
  Trash2,
  Video,
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
  createBlogContentBlock,
  deleteBlogChildItem,
  updateBlogContentBlock,
} from "@/lib/actions/blogs";

import type {
  BlogCalloutStyle,
  BlogContentBlock,
  BlogContentBlockType,
  CreateBlogContentBlockInput,
  UpdateBlogContentBlockInput,
} from "@/lib/types/blogs";

type ContentBlocksManagerProps = {
  blogId: string;
  initialItems: BlogContentBlock[];
};

type BlockDraft = Omit<
  CreateBlogContentBlockInput,
  "blog_id"
>;

const EMPTY_BLOCK: BlockDraft = {
  internal_name: "",
  block_type: "paragraph",
  heading: "",
  content: "",
  heading_level: 2,
  image_url: null,
  image_storage_path: null,
  image_alt: "",
  image_caption: "",
  video_url: null,
  video_storage_path: null,
  video_poster_url: null,
  quote_author: "",
  quote_role: "",
  callout_style: "information",
  display_order: 0,
  is_active: true,
  is_published: true,
};

const BLOCK_TYPES: Array<{
  value: BlogContentBlockType;
  label: string;
}> = [
  {
    value: "paragraph",
    label: "Paragraph",
  },
  {
    value: "heading",
    label: "Heading",
  },
  {
    value: "image",
    label: "Image",
  },
  {
    value: "quote",
    label: "Quote",
  },
  {
    value: "video",
    label: "Video",
  },
  {
    value: "checklist",
    label: "Checklist",
  },
  {
    value: "numbered_list",
    label: "Numbered List",
  },
  {
    value: "table",
    label: "Table",
  },
  {
    value: "code",
    label: "Code",
  },
  {
    value: "callout",
    label: "Callout",
  },
];

function toDraft(
  item: BlogContentBlock,
): BlockDraft {
  return {
    internal_name:
      item.internal_name ?? "",
    block_type:
      item.block_type,
    heading:
      item.heading ?? "",
    content:
      item.content ?? "",
    heading_level:
      item.heading_level ?? 2,
    image_url:
      item.image_url ?? null,
    image_storage_path:
      item.image_storage_path ?? null,
    image_alt:
      item.image_alt ?? "",
    image_caption:
      item.image_caption ?? "",
    video_url:
      item.video_url ?? null,
    video_storage_path:
      item.video_storage_path ?? null,
    video_poster_url:
      item.video_poster_url ?? null,
    quote_author:
      item.quote_author ?? "",
    quote_role:
      item.quote_role ?? "",
    callout_style:
      item.callout_style ?? "information",
    display_order:
      item.display_order ?? 0,
    is_active:
      item.is_active ?? true,
    is_published:
      item.is_published ?? true,
  };
}

function buildEditingState(
  items: BlogContentBlock[],
): Record<string, BlockDraft> {
  return Object.fromEntries(
    items.map((item) => [
      item.id,
      toDraft(item),
    ]),
  );
}

function BlockIcon({
  type,
}: {
  type: BlogContentBlockType;
}) {
  const iconMap = {
    paragraph: Text,
    heading: Heading2,
    image: ImageIcon,
    quote: MessageSquareQuote,
    video: Video,
    checklist: List,
    numbered_list: ListOrdered,
    table: Table2,
    code: Code2,
    callout: Info,
  };

  const Icon =
    iconMap[type];

  return <Icon size={18} />;
}

function BlockFields({
  value,
  onChange,
}: {
  value: BlockDraft;
  onChange: (
    next: BlockDraft,
  ) => void;
}) {
  return (
    <div className="blogBlockFields">
      <label>
        <span>
          Internal name
        </span>

        <input
          value={
            value.internal_name ?? ""
          }
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
          Block type
        </span>

        <select
          value={value.block_type}
          onChange={(event) =>
            onChange({
              ...value,
              block_type:
                event.target
                  .value as BlogContentBlockType,
            })
          }
        >
          {BLOCK_TYPES.map(
            (type) => (
              <option
                key={type.value}
                value={type.value}
              >
                {type.label}
              </option>
            ),
          )}
        </select>
      </label>

      {value.block_type ===
      "heading" ? (
        <>
          <label className="isFull">
            <span>
              Heading text
            </span>

            <input
              value={
                value.heading ?? ""
              }
              onChange={(event) =>
                onChange({
                  ...value,
                  heading:
                    event.target.value,
                })
              }
            />
          </label>

          <label>
            <span>
              Heading level
            </span>

            <select
              value={
                value.heading_level ?? 2
              }
              onChange={(event) =>
                onChange({
                  ...value,
                  heading_level:
                    Number(
                      event.target.value,
                    ),
                })
              }
            >
              {[2, 3, 4, 5, 6].map(
                (level) => (
                  <option
                    key={level}
                    value={level}
                  >
                    H{level}
                  </option>
                ),
              )}
            </select>
          </label>
        </>
      ) : null}

      {[
        "paragraph",
        "checklist",
        "numbered_list",
        "table",
        "code",
        "callout",
      ].includes(
        value.block_type,
      ) ? (
        <>
          <label className="isFull">
            <span>
              Optional heading
            </span>

            <input
              value={
                value.heading ?? ""
              }
              onChange={(event) =>
                onChange({
                  ...value,
                  heading:
                    event.target.value,
                })
              }
            />
          </label>

          <label className="isFull">
            <span>
              Content
            </span>

            <textarea
              rows={8}
              value={
                value.content ?? ""
              }
              placeholder={
                value.block_type ===
                "checklist"
                  ? "One checklist item per line"
                  : value.block_type ===
                      "numbered_list"
                    ? "One numbered item per line"
                    : value.block_type ===
                        "table"
                      ? "Use CSV-style rows, one row per line"
                      : value.block_type ===
                          "code"
                        ? "Paste code here"
                        : "Enter content"
              }
              onChange={(event) =>
                onChange({
                  ...value,
                  content:
                    event.target.value,
                })
              }
            />
          </label>
        </>
      ) : null}

      {value.block_type ===
      "callout" ? (
        <label>
          <span>
            Callout style
          </span>

          <select
            value={
              value.callout_style ??
              "information"
            }
            onChange={(event) =>
              onChange({
                ...value,
                callout_style:
                  event.target
                    .value as BlogCalloutStyle,
              })
            }
          >
            <option value="information">
              Information
            </option>

            <option value="success">
              Success
            </option>

            <option value="warning">
              Warning
            </option>

            <option value="important">
              Important
            </option>
          </select>
        </label>
      ) : null}

      {value.block_type ===
      "image" ? (
        <>
          <label className="isFull">
            <span>
              Image URL
            </span>

            <input
              value={
                value.image_url ?? ""
              }
              onChange={(event) =>
                onChange({
                  ...value,
                  image_url:
                    event.target.value ||
                    null,
                })
              }
            />
          </label>

          <label>
            <span>
              Image alt text
            </span>

            <input
              value={
                value.image_alt ?? ""
              }
              onChange={(event) =>
                onChange({
                  ...value,
                  image_alt:
                    event.target.value,
                })
              }
            />
          </label>

          <label>
            <span>
              Image caption
            </span>

            <input
              value={
                value.image_caption ?? ""
              }
              onChange={(event) =>
                onChange({
                  ...value,
                  image_caption:
                    event.target.value,
                })
              }
            />
          </label>
        </>
      ) : null}

      {value.block_type ===
      "quote" ? (
        <>
          <label className="isFull">
            <span>
              Quote
            </span>

            <textarea
              rows={6}
              value={
                value.content ?? ""
              }
              onChange={(event) =>
                onChange({
                  ...value,
                  content:
                    event.target.value,
                })
              }
            />
          </label>

          <label>
            <span>
              Quote author
            </span>

            <input
              value={
                value.quote_author ?? ""
              }
              onChange={(event) =>
                onChange({
                  ...value,
                  quote_author:
                    event.target.value,
                })
              }
            />
          </label>

          <label>
            <span>
              Author role
            </span>

            <input
              value={
                value.quote_role ?? ""
              }
              onChange={(event) =>
                onChange({
                  ...value,
                  quote_role:
                    event.target.value,
                })
              }
            />
          </label>
        </>
      ) : null}

      {value.block_type ===
      "video" ? (
        <>
          <label className="isFull">
            <span>
              Video URL
            </span>

            <input
              value={
                value.video_url ?? ""
              }
              onChange={(event) =>
                onChange({
                  ...value,
                  video_url:
                    event.target.value ||
                    null,
                })
              }
            />
          </label>

          <label className="isFull">
            <span>
              Poster image URL
            </span>

            <input
              value={
                value.video_poster_url ??
                ""
              }
              onChange={(event) =>
                onChange({
                  ...value,
                  video_poster_url:
                    event.target.value ||
                    null,
                })
              }
            />
          </label>
        </>
      ) : null}

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

      <div className="blogBlockFields__toggles">
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

export default function ContentBlocksManager({
  blogId,
  initialItems,
}: ContentBlocksManagerProps) {
  const router = useRouter();

  const [draft, setDraft] =
    useState<BlockDraft>(
      EMPTY_BLOCK,
    );

  const [editing, setEditing] =
    useState<
      Record<string, BlockDraft>
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

  async function addBlock(): Promise<void> {
    setBusyId("new");
    setMessage("");

    const result =
      await createBlogContentBlock({
        blog_id: blogId,
        ...draft,
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
      ...EMPTY_BLOCK,
      display_order:
        initialItems.length,
    });

    setBusyId(null);
    router.refresh();
  }

  async function saveBlock(
    id: string,
  ): Promise<void> {
    const value =
      editing[id];

    if (!value) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const payload:
      UpdateBlogContentBlockInput = {
        ...value,
      };

    const result =
      await updateBlogContentBlock(
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

  async function removeBlock(
    id: string,
  ): Promise<void> {
    if (
      !window.confirm(
        "Delete this content block?",
      )
    ) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const result =
      await deleteBlogChildItem(
        "blog_content_blocks",
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
    <article className="blogContentManager">
      <div className="blogContentManager__heading">
        <div>
          <span>
            Repeatable builder
          </span>

          <h3>
            Content Blocks
          </h3>

          <p>
            Build the article using reusable,
            ordered content sections.
          </p>
        </div>

        <strong>
          {initialItems.length} blocks
        </strong>
      </div>

      {message ? (
        <div className="blogContentManager__message">
          {message}
        </div>
      ) : null}

      <div className="blogContentManager__create">
        <div className="blogContentManager__createTitle">
          <Plus size={18} />

          <div>
            <strong>
              Add Content Block
            </strong>

            <span>
              Select a block type and complete
              the relevant fields.
            </span>
          </div>
        </div>

        <BlockFields
          value={draft}
          onChange={setDraft}
        />

        <button
          type="button"
          onClick={addBlock}
          disabled={
            busyId !== null
          }
        >
          {busyId === "new" ? (
            <Loader2
              size={16}
              className="blogContentManager__spinner"
            />
          ) : (
            <Plus size={16} />
          )}

          Add Block
        </button>
      </div>

      <div className="blogContentManager__list">
        {sortedItems.length === 0 ? (
          <div className="blogContentManager__empty">
            No content blocks added yet.
          </div>
        ) : null}

        {sortedItems.map(
          (item) => {
            const value =
              editing[item.id] ??
              toDraft(item);

            return (
              <section
                className="blogContentBlock"
                key={item.id}
              >
                <header>
                  <div className="blogContentBlock__icon">
                    <BlockIcon
                      type={
                        value.block_type
                      }
                    />
                  </div>

                  <div>
                    <span>
                      {value.block_type.replace(
                        "_",
                        " ",
                      )}
                    </span>

                    <strong>
                      {value.internal_name ||
                        value.heading ||
                        "Untitled block"}
                    </strong>
                  </div>

                  <div className="blogContentBlock__order">
                    Order {value.display_order}
                  </div>
                </header>

                <BlockFields
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
                      saveBlock(
                        item.id,
                      )
                    }
                  >
                    {busyId ===
                    item.id ? (
                      <Loader2
                        size={15}
                        className="blogContentManager__spinner"
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
                      removeBlock(
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
