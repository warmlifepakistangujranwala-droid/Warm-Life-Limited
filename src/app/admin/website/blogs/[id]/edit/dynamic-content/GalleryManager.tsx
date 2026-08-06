/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/blogs/[id]/edit/dynamic-content/GalleryManager.tsx
 *
 * Purpose :
 * Manages repeatable Blog gallery images.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use client";

import {
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

import {
  type ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createBlogGalleryItem,
  deleteBlogChildItem,
  updateBlogGalleryItem,
} from "@/lib/actions/blogs";

import {
  createClient,
} from "@/lib/supabase/client";

import type {
  BlogGalleryItem,
  CreateBlogGalleryItemInput,
  UpdateBlogGalleryItemInput,
} from "@/lib/types/blogs";

import "./gallery-manager.css";

type GalleryManagerProps = {
  blogId: string;
  initialItems: BlogGalleryItem[];
  sectionHeading: string;
};

type GalleryDraft = Omit<
  CreateBlogGalleryItemInput,
  "blog_id"
>;

const EMPTY_GALLERY_ITEM: GalleryDraft = {
  internal_name: "",
  image_url: null,
  image_storage_path: null,
  image_alt: "",
  caption: "",
  display_order: 0,
  is_active: true,
  is_published: true,
};

function toDraft(
  item: BlogGalleryItem,
): GalleryDraft {
  return {
    internal_name:
      item.internal_name ?? "",
    image_url:
      item.image_url ?? null,
    image_storage_path:
      item.image_storage_path ?? null,
    image_alt:
      item.image_alt ?? "",
    caption:
      item.caption ?? "",
    display_order:
      item.display_order ?? 0,
    is_active:
      item.is_active ?? true,
    is_published:
      item.is_published ?? true,
  };
}

function buildEditingState(
  items: BlogGalleryItem[],
): Record<string, GalleryDraft> {
  return Object.fromEntries(
    items.map((item) => [
      item.id,
      toDraft(item),
    ]),
  );
}

export default function GalleryManager({
  blogId,
  initialItems,
  sectionHeading,
}: GalleryManagerProps) {
  const router = useRouter();
  const supabase = createClient();

  const [draft, setDraft] =
    useState<GalleryDraft>({
      ...EMPTY_GALLERY_ITEM,
      display_order:
        initialItems.length,
    });

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [editing, setEditing] =
    useState<
      Record<string, GalleryDraft>
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

  function chooseImage(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      setMessage(
        "Please select a valid image.",
      );
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setMessage(
        "Image must be smaller than 10 MB.",
      );
      return;
    }

    if (
      preview.startsWith(
        "blob:",
      )
    ) {
      URL.revokeObjectURL(
        preview,
      );
    }

    setSelectedFile(file);

    setPreview(
      URL.createObjectURL(file),
    );

    setMessage("");
  }

  async function uploadImage(
    file: File,
  ): Promise<{
    publicUrl: string;
    storagePath: string;
  }> {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "jpg";

    const path =
      `blogs/gallery/${blogId}/${crypto.randomUUID()}.${extension}`;

    const { error } =
      await supabase.storage
        .from("website-media")
        .upload(
          path,
          file,
          {
            contentType:
              file.type,
            cacheControl:
              "3600",
            upsert: false,
          },
        );

    if (error) {
      throw new Error(
        error.message,
      );
    }

    const { data } =
      supabase.storage
        .from("website-media")
        .getPublicUrl(path);

    return {
      publicUrl:
        data.publicUrl,

      storagePath:
        path,
    };
  }

  async function addGalleryItem():
    Promise<void> {
    if (
      !selectedFile &&
      !draft.image_url
    ) {
      setMessage(
        "Choose an image or add an image URL.",
      );
      return;
    }

    setBusyId("new");
    setMessage("");

    let uploadedPath = "";

    try {
      const payload:
        CreateBlogGalleryItemInput = {
          blog_id: blogId,
          ...draft,
          internal_name:
            draft.internal_name?.trim() ||
            draft.caption?.trim() ||
            draft.image_alt?.trim() ||
            "Blog Gallery Image",
        };

      if (selectedFile) {
        const uploaded =
          await uploadImage(
            selectedFile,
          );

        uploadedPath =
          uploaded.storagePath;

        payload.image_url =
          uploaded.publicUrl;

        payload.image_storage_path =
          uploaded.storagePath;
      }

      const result =
        await createBlogGalleryItem(
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

        throw new Error(
          errors ||
          result.message,
        );
      }

      if (
        preview.startsWith(
          "blob:",
        )
      ) {
        URL.revokeObjectURL(
          preview,
        );
      }

      setDraft({
        ...EMPTY_GALLERY_ITEM,
        display_order:
          initialItems.length + 1,
      });

      setSelectedFile(null);
      setPreview("");
      router.refresh();
    } catch (error) {
      if (uploadedPath) {
        await supabase.storage
          .from("website-media")
          .remove([
            uploadedPath,
          ]);
      }

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to add gallery image.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function saveGalleryItem(
    id: string,
  ): Promise<void> {
    const value =
      editing[id];

    if (!value) {
      return;
    }

    if (!value.image_url) {
      setMessage(
        "Image URL is required.",
      );
      return;
    }

    setBusyId(id);
    setMessage("");

    const payload:
      UpdateBlogGalleryItemInput = {
        ...value,
        internal_name:
          value.internal_name?.trim() ||
          value.caption?.trim() ||
          value.image_alt?.trim() ||
          "Blog Gallery Image",
      };

    const result =
      await updateBlogGalleryItem(
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

  async function removeGalleryItem(
    item: BlogGalleryItem,
  ): Promise<void> {
    if (
      !window.confirm(
        "Delete this gallery image?",
      )
    ) {
      return;
    }

    setBusyId(item.id);
    setMessage("");

    const result =
      await deleteBlogChildItem(
        "blog_gallery",
        item.id,
      );

    if (!result.success) {
      setMessage(
        result.message,
      );

      setBusyId(null);
      return;
    }

    if (
      item.image_storage_path
    ) {
      await supabase.storage
        .from("website-media")
        .remove([
          item.image_storage_path,
        ]);
    }

    router.refresh();
    setBusyId(null);
  }

  return (
    <article className="blogGalleryManager">
      <div className="blogGalleryManager__heading">
        <div>
          <span>
            Repeatable article media
          </span>

          <h3>
            Gallery Manager
          </h3>

          <p>
            Add supporting images that appear
            in the public Blog gallery section.
          </p>
        </div>

        <strong>
          {initialItems.length}
          {" "}
          images
        </strong>
      </div>

      <div className="blogGalleryManager__sectionName">
        Public section heading:
        {" "}
        <strong>
          {sectionHeading}
        </strong>
      </div>

      {message ? (
        <div className="blogGalleryManager__message">
          {message}
        </div>
      ) : null}

      <div className="blogGalleryManager__create">
        <div className="blogGalleryManager__uploadRow">
          <label className="blogGalleryManager__upload">
            <Upload size={16} />
            Choose Image

            <input
              type="file"
              accept="image/*"
              onChange={
                chooseImage
              }
            />
          </label>

          <span>
            or
          </span>

          <input
            type="url"
            placeholder="Direct image URL"
            value={
              draft.image_url ??
              ""
            }
            onChange={(event) => {
              const value =
                event.target.value;

              setDraft({
                ...draft,
                image_url:
                  value || null,
                image_storage_path:
                  null,
              });

              setSelectedFile(null);
              setPreview(value);
            }}
          />
        </div>

        {preview ||
        draft.image_url ? (
          <img
            className="blogGalleryManager__preview"
            src={
              preview ||
              draft.image_url ||
              ""
            }
            alt=""
          />
        ) : (
          <div className="blogGalleryManager__emptyPreview">
            <ImageIcon size={30} />

            <span>
              No image selected
            </span>
          </div>
        )}

        <div className="blogGalleryManager__fields">
          <label>
            <span>
              Internal name
            </span>

            <input
              value={
                draft.internal_name ??
                ""
              }
              onChange={(event) =>
                setDraft({
                  ...draft,
                  internal_name:
                    event.target.value,
                })
              }
            />
          </label>

          <label>
            <span>
              Alt text
            </span>

            <input
              value={
                draft.image_alt ??
                ""
              }
              onChange={(event) =>
                setDraft({
                  ...draft,
                  image_alt:
                    event.target.value,
                })
              }
            />
          </label>

          <label>
            <span>
              Caption
            </span>

            <input
              value={
                draft.caption ??
                ""
              }
              onChange={(event) =>
                setDraft({
                  ...draft,
                  caption:
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
        </div>

        <button
          type="button"
          onClick={
            addGalleryItem
          }
          disabled={
            busyId !== null
          }
        >
          {busyId === "new" ? (
            <Loader2
              size={16}
              className="blogGalleryManager__spinner"
            />
          ) : (
            <Plus size={16} />
          )}

          Add Image
        </button>
      </div>

      <div className="blogGalleryManager__grid">
        {sortedItems.length === 0 ? (
          <div className="blogGalleryManager__empty">
            No gallery images added yet.
          </div>
        ) : null}

        {sortedItems.map(
          (item) => {
            const value =
              editing[item.id] ??
              toDraft(item);

            return (
              <section
                className="blogGalleryCard"
                key={item.id}
              >
                {item.image_url ? (
                  <img
                    src={
                      item.image_url
                    }
                    alt={
                      item.image_alt ??
                      ""
                    }
                  />
                ) : (
                  <div className="blogGalleryCard__fallback">
                    <ImageIcon size={27} />
                  </div>
                )}

                <div className="blogGalleryCard__fields">
                  <label>
                    <span>
                      Image URL
                    </span>

                    <input
                      value={
                        value.image_url ??
                        ""
                      }
                      onChange={(event) =>
                        setEditing({
                          ...editing,
                          [item.id]: {
                            ...value,
                            image_url:
                              event.target
                                .value ||
                              null,
                          },
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
                        value.internal_name ??
                        ""
                      }
                      onChange={(event) =>
                        setEditing({
                          ...editing,
                          [item.id]: {
                            ...value,
                            internal_name:
                              event.target
                                .value,
                          },
                        })
                      }
                    />
                  </label>

                  <label>
                    <span>
                      Alt text
                    </span>

                    <input
                      value={
                        value.image_alt ??
                        ""
                      }
                      onChange={(event) =>
                        setEditing({
                          ...editing,
                          [item.id]: {
                            ...value,
                            image_alt:
                              event.target
                                .value,
                          },
                        })
                      }
                    />
                  </label>

                  <label>
                    <span>
                      Caption
                    </span>

                    <input
                      value={
                        value.caption ??
                        ""
                      }
                      onChange={(event) =>
                        setEditing({
                          ...editing,
                          [item.id]: {
                            ...value,
                            caption:
                              event.target
                                .value,
                          },
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

                  <div className="blogGalleryCard__toggles">
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

                <footer>
                  <button
                    type="button"
                    className="isSave"
                    disabled={
                      busyId !== null
                    }
                    onClick={() =>
                      saveGalleryItem(
                        item.id,
                      )
                    }
                  >
                    {busyId ===
                    item.id ? (
                      <Loader2
                        size={15}
                        className="blogGalleryManager__spinner"
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
                      removeGalleryItem(
                        item,
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
