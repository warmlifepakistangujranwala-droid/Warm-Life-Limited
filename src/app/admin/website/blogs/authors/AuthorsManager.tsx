"use client";

import {
  Loader2,
  Plus,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createBlogAuthor,
  updateBlogAuthor,
} from "@/lib/actions/blogs";

import {
  createClient,
} from "@/lib/supabase/client";

import type {
  BlogAuthor,
  CreateBlogAuthorInput,
  UpdateBlogAuthorInput,
} from "@/lib/types/blogs";

type Props = {
  initialItems: BlogAuthor[];
};

type Draft =
  CreateBlogAuthorInput;

const EMPTY: Draft = {
  internal_name: "",
  display_name: "",
  job_title: "",
  biography: "",
  profile_image_url: null,
  profile_image_storage_path: null,
  profile_image_alt: "",
  linkedin_url: null,
  website_url: null,
  display_order: 0,
  is_active: true,
  is_published: true,
};

function toDraft(
  item: BlogAuthor,
): Draft {
  return {
    internal_name:
      item.internal_name,
    display_name:
      item.display_name,
    job_title:
      item.job_title ?? "",
    biography:
      item.biography ?? "",
    profile_image_url:
      item.profile_image_url,
    profile_image_storage_path:
      item.profile_image_storage_path,
    profile_image_alt:
      item.profile_image_alt ?? "",
    linkedin_url:
      item.linkedin_url,
    website_url:
      item.website_url,
    display_order:
      item.display_order,
    is_active:
      item.is_active,
    is_published:
      item.is_published,
  };
}

export default function AuthorsManager({
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
    if (!draft.display_name.trim()) {
      setMessage(
        "Author display name is required.",
      );
      return;
    }

    setBusyId("new");
    setMessage("");

    const result =
      await createBlogAuthor({
        ...draft,
        internal_name:
          draft.internal_name.trim() ||
          draft.display_name.trim(),
        job_title:
          draft.job_title?.trim() ||
          null,
        biography:
          draft.biography?.trim() ||
          null,
        profile_image_alt:
          draft.profile_image_alt?.trim() ||
          draft.display_name.trim(),
        linkedin_url:
          draft.linkedin_url?.trim() ||
          null,
        website_url:
          draft.website_url?.trim() ||
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
      UpdateBlogAuthorInput = {
        ...value,
        internal_name:
          value.internal_name.trim() ||
          value.display_name.trim(),
        job_title:
          value.job_title?.trim() ||
          null,
        biography:
          value.biography?.trim() ||
          null,
        profile_image_alt:
          value.profile_image_alt?.trim() ||
          value.display_name.trim(),
        linkedin_url:
          value.linkedin_url?.trim() ||
          null,
        website_url:
          value.website_url?.trim() ||
          null,
      };

    const result =
      await updateBlogAuthor(
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
        "Delete this Blog author?",
      )
    ) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const { error } =
      await supabase
        .from("blog_authors")
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
            Display name *
          </span>

          <input
            value={
              value.display_name
            }
            onChange={(event) =>
              onChange({
                ...value,
                display_name:
                  event.target.value,
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
            Job title
          </span>

          <input
            value={
              value.job_title ?? ""
            }
            onChange={(event) =>
              onChange({
                ...value,
                job_title:
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
            Biography
          </span>

          <textarea
            rows={6}
            value={
              value.biography ?? ""
            }
            onChange={(event) =>
              onChange({
                ...value,
                biography:
                  event.target.value,
              })
            }
          />
        </label>

        <label className="isFull">
          <span>
            Profile image URL
          </span>

          <input
            type="url"
            value={
              value.profile_image_url ??
              ""
            }
            onChange={(event) =>
              onChange({
                ...value,
                profile_image_url:
                  event.target.value ||
                  null,
                profile_image_storage_path:
                  null,
              })
            }
          />
        </label>

        <label className="isFull">
          <span>
            Profile image alt text
          </span>

          <input
            value={
              value.profile_image_alt ??
              ""
            }
            onChange={(event) =>
              onChange({
                ...value,
                profile_image_alt:
                  event.target.value,
              })
            }
          />
        </label>

        <label>
          <span>
            LinkedIn URL
          </span>

          <input
            type="url"
            value={
              value.linkedin_url ?? ""
            }
            onChange={(event) =>
              onChange({
                ...value,
                linkedin_url:
                  event.target.value ||
                  null,
              })
            }
          />
        </label>

        <label>
          <span>
            Website URL
          </span>

          <input
            type="url"
            value={
              value.website_url ?? ""
            }
            onChange={(event) =>
              onChange({
                ...value,
                website_url:
                  event.target.value ||
                  null,
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
            New author
          </span>

          <h2>
            Add Blog Author
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

          Add Author
        </button>
      </section>

      <section className="blogTaxonomyManager__list">
        {initialItems.length === 0 ? (
          <div className="blogTaxonomyManager__empty">
            No Blog authors created yet.
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
                  <div className="blogAuthorCard__identity">
                    {value.profile_image_url ? (
                      <img
                        src={
                          value.profile_image_url
                        }
                        alt={
                          value.profile_image_alt ||
                          value.display_name
                        }
                      />
                    ) : (
                      <div>
                        <UserRound size={21} />
                      </div>
                    )}

                    <div>
                      <span>
                        Author
                      </span>

                      <h3>
                        {value.display_name}
                      </h3>

                      <small>
                        {value.job_title ||
                          "No job title"}
                      </small>
                    </div>
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
