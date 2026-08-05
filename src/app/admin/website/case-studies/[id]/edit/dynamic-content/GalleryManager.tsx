/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/case-studies/[id]/edit/dynamic-content/GalleryManager.tsx
 *
 * Purpose :
 * Manages Case Study gallery images, including standard,
 * before and after image types.
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
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  createCaseStudyGalleryItem,
  deleteCaseStudyGalleryItem,
  updateCaseStudyGalleryItem,
} from "@/lib/actions/case-studies";

import { createClient } from "@/lib/supabase/client";

import type {
  CaseStudyGalleryImageType,
  CaseStudyGalleryItem,
} from "@/lib/types/case-studies";

import "./gallery-manager.css";

type GalleryManagerProps = {
  caseStudyId: string;
  initialItems: CaseStudyGalleryItem[];
};

type GalleryDraft = {
  internal_name: string;
  image_url: string | null;
  image_storage_path: string | null;
  image_alt: string;
  caption: string;
  image_type: CaseStudyGalleryImageType;
  pair_key: string;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
};

const EMPTY_GALLERY_ITEM: GalleryDraft = {
  internal_name: "",
  image_url: null,
  image_storage_path: null,
  image_alt: "",
  caption: "",
  image_type: "standard",
  pair_key: "",
  display_order: 0,
  is_active: true,
  is_published: true,
};

function toGalleryDraft(
  item: CaseStudyGalleryItem,
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
    image_type:
      item.image_type ?? "standard",
    pair_key:
      item.pair_key ?? "",
    display_order:
      item.display_order ?? 0,
    is_active:
      item.is_active ?? true,
    is_published:
      item.is_published ?? true,
  };
}

function buildEditingState(
  items: CaseStudyGalleryItem[],
): Record<string, GalleryDraft> {
  return Object.fromEntries(
    items.map((item) => [
      item.id,
      toGalleryDraft(item),
    ]),
  );
}

export default function GalleryManager({
  caseStudyId,
  initialItems,
}: GalleryManagerProps) {
  const router = useRouter();
  const supabase = createClient();

  const [draft, setDraft] =
    useState<GalleryDraft>(
      EMPTY_GALLERY_ITEM,
    );

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
      URL.createObjectURL(
        file,
      ),
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
      `case-studies/gallery/${caseStudyId}/${crypto.randomUUID()}.${extension}`;

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

  async function addGalleryItem(): Promise<void> {
    if (
      !selectedFile &&
      !draft.image_url
    ) {
      setMessage(
        "Choose an image or add an image URL.",
      );
      return;
    }

    if (
      (
        draft.image_type ===
          "before" ||
        draft.image_type ===
          "after"
      ) &&
      !draft.pair_key.trim()
    ) {
      setMessage(
        "Pair key is required for before and after images.",
      );
      return;
    }

    setBusyId("new");
    setMessage("");

    let uploadedPath = "";

    try {
      const payload = {
        case_study_id:
          caseStudyId,

        ...draft,

        internal_name:
          draft.internal_name.trim() ||
          draft.caption.trim() ||
          draft.image_alt.trim() ||
          "Case Study Gallery Image",
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
        await createCaseStudyGalleryItem(
          payload,
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

        throw new Error(
          fieldErrors ||
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

      setDraft(
        EMPTY_GALLERY_ITEM,
      );

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
    const item =
      editing[id];

    if (!item) {
      return;
    }

    if (
      (
        item.image_type ===
          "before" ||
        item.image_type ===
          "after"
      ) &&
      !item.pair_key.trim()
    ) {
      setMessage(
        "Pair key is required for before and after images.",
      );
      return;
    }

    setBusyId(id);
    setMessage("");

    const result =
      await updateCaseStudyGalleryItem(
        id,
        caseStudyId,
        item,
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

  async function removeGalleryItem(
    item: CaseStudyGalleryItem,
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
      await deleteCaseStudyGalleryItem(
        item.id,
        caseStudyId,
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
    <article className="caseStudyDynamicManager">
      <div className="caseStudyDynamicManager__heading">
        <div>
          <span>
            Repeatable media
          </span>

          <h3>
            Project Gallery
          </h3>

          <p>
            Add standard project images or pair before and
            after images using the same pair key.
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

      <div className="caseStudyGalleryCreate">
        <div className="caseStudyGalleryUpload">
          <label>
            <Upload size={17} />
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
            placeholder="Image URL"
            value={
              draft.image_url ??
              ""
            }
            onChange={(event) =>
              setDraft({
                ...draft,

                image_url:
                  event.target.value ||
                  null,
              })
            }
          />
        </div>

        {preview ||
        draft.image_url ? (
          <img
            className="caseStudyGalleryPreview"
            src={
              preview ||
              draft.image_url ||
              ""
            }
            alt=""
          />
        ) : (
          <div className="caseStudyGalleryEmpty">
            <ImageIcon size={29} />
            <span>
              No image selected
            </span>
          </div>
        )}

        <div className="caseStudyGalleryCreate__fields">
          <label>
            <span>
              Image type
            </span>

            <select
              value={
                draft.image_type
              }
              onChange={(event) =>
                setDraft({
                  ...draft,

                  image_type:
                    event.target
                      .value as CaseStudyGalleryImageType,

                  pair_key:
                    event.target
                      .value ===
                    "standard"
                      ? ""
                      : draft.pair_key,
                })
              }
            >
              <option value="standard">
                Standard
              </option>

              <option value="before">
                Before
              </option>

              <option value="after">
                After
              </option>
            </select>
          </label>

          <label>
            <span>
              Pair key
            </span>

            <input
              value={
                draft.pair_key
              }
              disabled={
                draft.image_type ===
                "standard"
              }
              placeholder="roof-project-1"
              onChange={(event) =>
                setDraft({
                  ...draft,

                  pair_key:
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
                draft.image_alt
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
                draft.caption
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
                className="caseStudyDynamicManager__spinner"
                size={16}
              />
            ) : (
              <Plus size={16} />
            )}

            Add Image
          </button>
        </div>
      </div>

      <div className="caseStudyGalleryGrid">
        {initialItems.length === 0 ? (
          <div className="caseStudyDynamicManager__empty caseStudyGalleryGrid__empty">
            No gallery images added yet.
          </div>
        ) : null}

        {initialItems.map(
          (item) => {
            const value =
              editing[item.id] ??
              toGalleryDraft(item);

            return (
              <div
                className="caseStudyGalleryItem"
                key={item.id}
              >
                {item.image_url ? (
                  <img
                    src={
                      item.image_url
                    }
                    alt={
                      item.image_alt
                    }
                  />
                ) : (
                  <div className="caseStudyGalleryEmpty">
                    <ImageIcon size={25} />
                  </div>
                )}

                <span
                  className={`caseStudyGalleryItem__type is-${value.image_type}`}
                >
                  {value.image_type}
                </span>

                <select
                  value={
                    value.image_type
                  }
                  onChange={(event) =>
                    setEditing({
                      ...editing,

                      [item.id]: {
                        ...value,

                        image_type:
                          event.target
                            .value as CaseStudyGalleryImageType,

                        pair_key:
                          event.target
                            .value ===
                          "standard"
                            ? ""
                            : value.pair_key,
                      },
                    })
                  }
                >
                  <option value="standard">
                    Standard
                  </option>

                  <option value="before">
                    Before
                  </option>

                  <option value="after">
                    After
                  </option>
                </select>

                <input
                  value={
                    value.pair_key
                  }
                  disabled={
                    value.image_type ===
                    "standard"
                  }
                  placeholder="Pair key"
                  onChange={(event) =>
                    setEditing({
                      ...editing,

                      [item.id]: {
                        ...value,

                        pair_key:
                          event.target
                            .value,
                      },
                    })
                  }
                />

                <input
                  value={
                    value.image_alt
                  }
                  placeholder="Alt text"
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

                <input
                  value={
                    value.caption
                  }
                  placeholder="Caption"
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

                <div className="caseStudyGalleryItem__options">
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

                <div className="caseStudyGalleryItem__actions">
                  <button
                    type="button"
                    className="isSave"
                    onClick={() =>
                      saveGalleryItem(
                        item.id,
                      )
                    }
                    disabled={
                      busyId !== null
                    }
                    aria-label="Save gallery item"
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
                      removeGalleryItem(
                        item,
                      )
                    }
                    disabled={
                      busyId !== null
                    }
                    aria-label="Delete gallery item"
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
