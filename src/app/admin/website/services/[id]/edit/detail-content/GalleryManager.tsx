/**
 * Gallery Manager
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
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  createServiceGalleryItem,
  deleteServiceGalleryItem,
  updateServiceGalleryItem,
} from "@/lib/actions/services-page";

import { createClient } from "@/lib/supabase/client";

import type {
  ServiceGalleryItem,
} from "@/lib/types/services-page";

type GalleryManagerProps = {
  serviceId: string;
  initialItems: ServiceGalleryItem[];
};

type GalleryDraft = {
  internal_name: string;
  image_url: string | null;
  image_storage_path: string | null;
  image_alt: string;
  caption: string;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
};

const EMPTY_GALLERY: GalleryDraft = {
  internal_name: "",
  image_url: null,
  image_storage_path: null,
  image_alt: "",
  caption: "",
  display_order: 0,
  is_active: true,
  is_published: true,
};

export default function GalleryManager({
  serviceId,
  initialItems,
}: GalleryManagerProps) {
  const router = useRouter();
  const supabase = createClient();

  const [draft, setDraft] =
    useState<GalleryDraft>(
      EMPTY_GALLERY,
    );

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [editing, setEditing] =
    useState<Record<string, GalleryDraft>>(
      Object.fromEntries(
        initialItems.map((item) => [
          item.id,
          {
            internal_name:
              item.internal_name,
            image_url:
              item.image_url,
            image_storage_path:
              item.image_storage_path,
            image_alt:
              item.image_alt,
            caption:
              item.caption,
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

  function chooseImage(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
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
      `services/gallery/${serviceId}/${crypto.randomUUID()}.${extension}`;

    const { error } =
      await supabase.storage
        .from("website-media")
        .upload(path, file, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

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
      storagePath: path,
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

    setBusyId("new");
    setMessage("");

    let uploadedPath = "";

    try {
      const payload = {
        service_id: serviceId,
        ...draft,
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
        await createServiceGalleryItem(
          payload,
        );

      if (!result.success) {
        throw new Error(
          result.message,
        );
      }

      setDraft(EMPTY_GALLERY);
      setSelectedFile(null);
      setPreview("");
      router.refresh();
    } catch (error) {
      if (uploadedPath) {
        await supabase.storage
          .from("website-media")
          .remove([uploadedPath]);
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
    setBusyId(id);

    const result =
      await updateServiceGalleryItem(
        id,
        serviceId,
        editing[id],
      );

    if (!result.success) {
      setMessage(result.message);
    } else {
      router.refresh();
    }

    setBusyId(null);
  }

  async function removeGalleryItem(
    item: ServiceGalleryItem,
  ): Promise<void> {
    if (
      !window.confirm(
        "Delete this gallery image?",
      )
    ) {
      return;
    }

    setBusyId(item.id);

    const result =
      await deleteServiceGalleryItem(
        item.id,
        serviceId,
      );

    if (!result.success) {
      setMessage(result.message);
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
    <article className="detailManagerCard">
      <div className="detailManagerCard__heading">
        <div>
          <span>
            Service media
          </span>

          <h3>Gallery</h3>
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

      <div className="galleryManagerCreate">
        <div className="galleryManagerUpload">
          <label>
            <Upload size={17} />
            Choose Image
            <input
              type="file"
              accept="image/*"
              onChange={chooseImage}
            />
          </label>

          <span>or</span>

          <input
            type="url"
            placeholder="Image URL"
            value={
              draft.image_url ?? ""
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
            className="galleryManagerPreview"
            src={
              preview ||
              draft.image_url ||
              ""
            }
            alt=""
          />
        ) : (
          <div className="galleryManagerEmpty">
            <ImageIcon size={28} />
            No image selected
          </div>
        )}

        <div className="detailManagerCreate">
          <label>
            <span>Alt text</span>
            <input
              value={draft.image_alt}
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
            <span>Caption</span>
            <input
              value={draft.caption}
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
            onClick={addGalleryItem}
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

            Add Image
          </button>
        </div>
      </div>

      <div className="galleryManagerGrid">
        {initialItems.map((item) => {
          const value =
            editing[item.id];

          return (
            <div
              className="galleryManagerItem"
              key={item.id}
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.image_alt}
                />
              ) : (
                <div className="galleryManagerEmpty">
                  <ImageIcon size={25} />
                </div>
              )}

              <input
                value={value.image_alt}
                placeholder="Alt text"
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    [item.id]: {
                      ...value,
                      image_alt:
                        event.target.value,
                    },
                  })
                }
              />

              <input
                value={value.caption}
                placeholder="Caption"
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    [item.id]: {
                      ...value,
                      caption:
                        event.target.value,
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

              <div className="galleryManagerActions">
                <button
                  type="button"
                  className="isSave"
                  onClick={() =>
                    saveGalleryItem(
                      item.id,
                    )
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
                    removeGalleryItem(
                      item,
                    )
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
