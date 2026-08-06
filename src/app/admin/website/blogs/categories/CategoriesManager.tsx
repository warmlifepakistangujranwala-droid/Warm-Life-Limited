"use client";

import {
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createBlogCategory,
  updateBlogCategory,
} from "@/lib/actions/blogs";

import {
  createClient,
} from "@/lib/supabase/client";

import type {
  BlogCategory,
  CreateBlogCategoryInput,
  UpdateBlogCategoryInput,
} from "@/lib/types/blogs";

type Props = {
  initialItems: BlogCategory[];
};

type Draft = Omit<
  CreateBlogCategoryInput,
  never
>;

const EMPTY: Draft = {
  internal_name: "",
  name: "",
  slug: "",
  description: "",
  display_order: 0,
  is_active: true,
  is_published: true,
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toDraft(
  item: BlogCategory,
): Draft {
  return {
    internal_name:
      item.internal_name,
    name:
      item.name,
    slug:
      item.slug,
    description:
      item.description ?? "",
    display_order:
      item.display_order,
    is_active:
      item.is_active,
    is_published:
      item.is_published,
  };
}

export default function CategoriesManager({
  initialItems,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [draft, setDraft] =
    useState<Draft>(EMPTY);

  const [editing, setEditing] =
    useState<Record<string, Draft>>(
      Object.fromEntries(
        initialItems.map((item) => [
          item.id,
          toDraft(item),
        ]),
      ),
    );

  const [busyId, setBusyId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    setEditing(
      Object.fromEntries(
        initialItems.map((item) => [
          item.id,
          toDraft(item),
        ]),
      ),
    );
  }, [initialItems]);

  async function addItem() {
    if (!draft.name.trim()) {
      setMessage(
        "Category name is required.",
      );
      return;
    }

    setBusyId("new");
    setMessage("");

    const result =
      await createBlogCategory({
        ...draft,
        internal_name:
          draft.internal_name.trim() ||
          draft.name.trim(),
        slug:
          slugify(
            draft.slug ||
            draft.name,
          ),
        description:
          draft.description?.trim() ||
          null,
      });

    if (!result.success) {
      setMessage(
        result.message,
      );
    } else {
      setDraft({
        ...EMPTY,
        display_order:
          initialItems.length,
      });
      router.refresh();
    }

    setBusyId(null);
  }

  async function saveItem(
    id: string,
  ) {
    const value =
      editing[id];

    if (!value) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const payload:
      UpdateBlogCategoryInput = {
        ...value,
        internal_name:
          value.internal_name.trim() ||
          value.name.trim(),
        slug:
          slugify(
            value.slug ||
            value.name,
          ),
        description:
          value.description?.trim() ||
          null,
      };

    const result =
      await updateBlogCategory(
        id,
        payload,
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

  async function deleteItem(
    id: string,
  ) {
    if (
      !window.confirm(
        "Delete this Blog category?",
      )
    ) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const { error } =
      await supabase
        .from("blog_categories")
        .delete()
        .eq("id", id);

    if (error) {
      setMessage(
        error.message,
      );
    } else {
      router.refresh();
    }

    setBusyId(null);
  }

  function Fields({
    value,
    onChange,
  }: {
    value: Draft;
    onChange: (
      value: Draft,
    ) => void;
  }) {
    return (
      <div className="blogTaxonomyFields">
        <label>
          <span>
            Category name *
          </span>

          <input
            value={value.name}
            onChange={(event) =>
              onChange({
                ...value,
                name:
                  event.target.value,
                slug:
                  value.slug ||
                  slugify(
                    event.target.value,
                  ),
              })
            }
          />
        </label>

        <label>
          <span>
            Slug *
          </span>

          <input
            value={value.slug}
            onChange={(event) =>
              onChange({
                ...value,
                slug:
                  slugify(
                    event.target.value,
                  ),
              })
            }
          />
        </label>

        <label>
          <span>
            Internal name
          </span>

          <input
            value={
              value.internal_name
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
            Description
          </span>

          <textarea
            rows={5}
            value={
              value.description ?? ""
            }
            onChange={(event) =>
              onChange({
                ...value,
                description:
                  event.target.value,
              })
            }
          />
        </label>

        <div className="blogTaxonomyFields__toggles">
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

  return (
    <main className="blogTaxonomyManager">
      {message ? (
        <div className="blogTaxonomyManager__message">
          {message}
        </div>
      ) : null}

      <section className="blogTaxonomyManager__create">
        <header>
          <span>
            New category
          </span>

          <h2>
            Add Blog Category
          </h2>
        </header>

        <Fields
          value={draft}
          onChange={setDraft}
        />

        <button
          type="button"
          onClick={addItem}
          disabled={
            busyId !== null
          }
        >
          {busyId === "new" ? (
            <Loader2
              size={16}
              className="blogTaxonomySpin"
            />
          ) : (
            <Plus size={16} />
          )}

          Add Category
        </button>
      </section>

      <section className="blogTaxonomyManager__list">
        {initialItems.length === 0 ? (
          <div className="blogTaxonomyManager__empty">
            No categories created yet.
          </div>
        ) : null}

        {initialItems.map(
          (item) => {
            const value =
              editing[item.id] ??
              toDraft(item);

            return (
              <article
                className="blogTaxonomyCard"
                key={item.id}
              >
                <header>
                  <div>
                    <span>
                      Category
                    </span>

                    <h3>
                      {value.name}
                    </h3>

                    <small>
                      /blogs/category/{value.slug}
                    </small>
                  </div>

                  <strong>
                    Order {value.display_order}
                  </strong>
                </header>

                <Fields
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
                    onClick={() =>
                      saveItem(
                        item.id,
                      )
                    }
                    disabled={
                      busyId !== null
                    }
                  >
                    {busyId === item.id ? (
                      <Loader2
                        size={15}
                        className="blogTaxonomySpin"
                      />
                    ) : (
                      <Save size={15} />
                    )}

                    Save
                  </button>

                  <button
                    type="button"
                    className="isDelete"
                    onClick={() =>
                      deleteItem(
                        item.id,
                      )
                    }
                    disabled={
                      busyId !== null
                    }
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </footer>
              </article>
            );
          },
        )}
      </section>
    </main>
  );
}
