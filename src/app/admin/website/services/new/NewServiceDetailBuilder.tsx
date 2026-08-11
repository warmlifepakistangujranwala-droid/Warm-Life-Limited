/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : NewServiceDetailBuilder.tsx
 *
 * Purpose :
 * Allows Benefits, Process Steps and Gallery items to be
 * prepared before a new Service has a database ID.
 *
 * Version : v1.0.0
 * ============================================================
 */

"use client";

import {
  CheckCircle2,
  CircleDot,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

import {
  type ChangeEvent,
  useEffect,
  useState,
} from "react";

import "./new-service-detail-builder.css";

export type NewBenefitDraft = {
  local_id: string;
  internal_name: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
};

export type NewProcessStepDraft = {
  local_id: string;
  internal_name: string;
  step_number: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
};

export type NewGalleryDraft = {
  local_id: string;
  internal_name: string;
  file: File | null;
  preview: string;
  image_url: string | null;
  image_alt: string;
  caption: string;
  display_order: number;
  is_active: boolean;
  is_published: boolean;
};

export type NewServiceDetailDrafts = {
  benefits: NewBenefitDraft[];
  processSteps: NewProcessStepDraft[];
  galleryItems: NewGalleryDraft[];
};

type Props = {
  benefitsEnabled: boolean;
  processEnabled: boolean;
  galleryEnabled: boolean;
  onChange: (
    value: NewServiceDetailDrafts,
  ) => void;
};

function newId(): string {
  return crypto.randomUUID();
}

function createBenefit(
  order: number,
): NewBenefitDraft {
  return {
    local_id: newId(),
    internal_name: "",
    title: "",
    description: "",
    icon_name: "CheckCircle2",
    display_order: order,
    is_active: true,
    is_published: true,
  };
}

function createStep(
  order: number,
): NewProcessStepDraft {
  return {
    local_id: newId(),
    internal_name: "",
    step_number:
      String(order + 1)
        .padStart(2, "0"),
    title: "",
    description: "",
    icon_name: "CircleDot",
    display_order: order,
    is_active: true,
    is_published: true,
  };
}

function createGallery(
  order: number,
): NewGalleryDraft {
  return {
    local_id: newId(),
    internal_name: "",
    file: null,
    preview: "",
    image_url: null,
    image_alt: "",
    caption: "",
    display_order: order,
    is_active: true,
    is_published: true,
  };
}

export default function NewServiceDetailBuilder({
  benefitsEnabled,
  processEnabled,
  galleryEnabled,
  onChange,
}: Props) {
  const [benefits, setBenefits] =
    useState<NewBenefitDraft[]>([]);

  const [processSteps, setProcessSteps] =
    useState<NewProcessStepDraft[]>([]);

  const [galleryItems, setGalleryItems] =
    useState<NewGalleryDraft[]>([]);

  useEffect(() => {
    onChange({
      benefits,
      processSteps,
      galleryItems,
    });
  }, [
    benefits,
    processSteps,
    galleryItems,
    onChange,
  ]);

  function chooseGalleryFile(
    localId: string,
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
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      return;
    }

    setGalleryItems(
      (current) =>
        current.map((item) => {
          if (
            item.local_id !==
            localId
          ) {
            return item;
          }

          if (
            item.preview.startsWith(
              "blob:",
            )
          ) {
            URL.revokeObjectURL(
              item.preview,
            );
          }

          return {
            ...item,
            file,
            preview:
              URL.createObjectURL(
                file,
              ),
            image_url: null,
          };
        }),
    );
  }

  return (
    <div className="newServiceDetailBuilder">

      {benefitsEnabled ? (
        <section className="newDetailBuilderSection">
          <header>
            <div>
              <span>
                Service benefits
              </span>

              <h3>
                Benefits
              </h3>

              <p>
                Add the benefit cards now.
                They will be saved when
                the Service is saved.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setBenefits(
                  (current) => [
                    ...current,
                    createBenefit(
                      current.length,
                    ),
                  ],
                )
              }
            >
              <Plus size={15} />
              Add Benefit
            </button>
          </header>

          {benefits.length === 0 ? (
            <button
              type="button"
              className="newDetailBuilderEmpty"
              onClick={() =>
                setBenefits([
                  createBenefit(0),
                ])
              }
            >
              <CheckCircle2
                size={24}
              />

              <strong>
                Add your first benefit
              </strong>

              <span>
                Title, description,
                icon and display order.
              </span>
            </button>
          ) : (
            <div className="newDetailBuilderList">
              {benefits.map(
                (item, index) => (
                  <article
                    key={item.local_id}
                    className="newDetailBuilderItem"
                  >
                    <div className="newDetailBuilderItem__top">
                      <strong>
                        Benefit {index + 1}
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          setBenefits(
                            (current) =>
                              current.filter(
                                (entry) =>
                                  entry.local_id !==
                                  item.local_id,
                              ),
                          )
                        }
                      >
                        <Trash2
                          size={14}
                        />
                      </button>
                    </div>

                    <div className="newDetailBuilderGrid">
                      <label>
                        <span>
                          Title *
                        </span>

                        <input
                          value={item.title}
                          onChange={(event) =>
                            setBenefits(
                              (current) =>
                                current.map(
                                  (entry) =>
                                    entry.local_id ===
                                    item.local_id
                                      ? {
                                          ...entry,
                                          title:
                                            event.target.value,
                                        }
                                      : entry,
                                ),
                            )
                          }
                        />
                      </label>

                      <label>
                        <span>
                          Icon
                        </span>

                        <select
                          value={item.icon_name}
                          onChange={(event) =>
                            setBenefits(
                              (current) =>
                                current.map(
                                  (entry) =>
                                    entry.local_id ===
                                    item.local_id
                                      ? {
                                          ...entry,
                                          icon_name:
                                            event.target.value,
                                        }
                                      : entry,
                                ),
                            )
                          }
                        >
                          <option value="CheckCircle2">
                            Check Circle
                          </option>
                          <option value="ShieldCheck">
                            Shield
                          </option>
                          <option value="Leaf">
                            Leaf
                          </option>
                          <option value="Zap">
                            Energy
                          </option>
                          <option value="BadgePoundSterling">
                            Savings
                          </option>
                        </select>
                      </label>

                      <label className="isFull">
                        <span>
                          Description
                        </span>

                        <textarea
                          rows={4}
                          value={item.description}
                          onChange={(event) =>
                            setBenefits(
                              (current) =>
                                current.map(
                                  (entry) =>
                                    entry.local_id ===
                                    item.local_id
                                      ? {
                                          ...entry,
                                          description:
                                            event.target.value,
                                        }
                                      : entry,
                                ),
                            )
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
                          value={item.display_order}
                          onChange={(event) =>
                            setBenefits(
                              (current) =>
                                current.map(
                                  (entry) =>
                                    entry.local_id ===
                                    item.local_id
                                      ? {
                                          ...entry,
                                          display_order:
                                            Number(
                                              event.target.value,
                                            ),
                                        }
                                      : entry,
                                ),
                            )
                          }
                        />
                      </label>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </section>
      ) : null}


      {processEnabled ? (
        <section className="newDetailBuilderSection">
          <header>
            <div>
              <span>
                Service process
              </span>

              <h3>
                Process Steps
              </h3>

              <p>
                Prepare each process
                step before saving the
                Service.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setProcessSteps(
                  (current) => [
                    ...current,
                    createStep(
                      current.length,
                    ),
                  ],
                )
              }
            >
              <Plus size={15} />
              Add Process Step
            </button>
          </header>

          {processSteps.length === 0 ? (
            <button
              type="button"
              className="newDetailBuilderEmpty"
              onClick={() =>
                setProcessSteps([
                  createStep(0),
                ])
              }
            >
              <CircleDot
                size={24}
              />

              <strong>
                Add your first process step
              </strong>

              <span>
                Step number, title,
                description and order.
              </span>
            </button>
          ) : (
            <div className="newDetailBuilderList">
              {processSteps.map(
                (item, index) => (
                  <article
                    key={item.local_id}
                    className="newDetailBuilderItem"
                  >
                    <div className="newDetailBuilderItem__top">
                      <strong>
                        Process Step {index + 1}
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          setProcessSteps(
                            (current) =>
                              current.filter(
                                (entry) =>
                                  entry.local_id !==
                                  item.local_id,
                              ),
                          )
                        }
                      >
                        <Trash2
                          size={14}
                        />
                      </button>
                    </div>

                    <div className="newDetailBuilderGrid">
                      <label>
                        <span>
                          Step number
                        </span>

                        <input
                          value={item.step_number}
                          onChange={(event) =>
                            setProcessSteps(
                              (current) =>
                                current.map(
                                  (entry) =>
                                    entry.local_id ===
                                    item.local_id
                                      ? {
                                          ...entry,
                                          step_number:
                                            event.target.value,
                                        }
                                      : entry,
                                ),
                            )
                          }
                        />
                      </label>

                      <label>
                        <span>
                          Title *
                        </span>

                        <input
                          value={item.title}
                          onChange={(event) =>
                            setProcessSteps(
                              (current) =>
                                current.map(
                                  (entry) =>
                                    entry.local_id ===
                                    item.local_id
                                      ? {
                                          ...entry,
                                          title:
                                            event.target.value,
                                        }
                                      : entry,
                                ),
                            )
                          }
                        />
                      </label>

                      <label className="isFull">
                        <span>
                          Description
                        </span>

                        <textarea
                          rows={4}
                          value={item.description}
                          onChange={(event) =>
                            setProcessSteps(
                              (current) =>
                                current.map(
                                  (entry) =>
                                    entry.local_id ===
                                    item.local_id
                                      ? {
                                          ...entry,
                                          description:
                                            event.target.value,
                                        }
                                      : entry,
                                ),
                            )
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
                          value={item.display_order}
                          onChange={(event) =>
                            setProcessSteps(
                              (current) =>
                                current.map(
                                  (entry) =>
                                    entry.local_id ===
                                    item.local_id
                                      ? {
                                          ...entry,
                                          display_order:
                                            Number(
                                              event.target.value,
                                            ),
                                        }
                                      : entry,
                                ),
                            )
                          }
                        />
                      </label>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </section>
      ) : null}


      {galleryEnabled ? (
        <section className="newDetailBuilderSection">
          <header>
            <div>
              <span>
                Service media
              </span>

              <h3>
                Gallery
              </h3>

              <p>
                Select images now.
                They will upload after
                the Service ID is created.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setGalleryItems(
                  (current) => [
                    ...current,
                    createGallery(
                      current.length,
                    ),
                  ],
                )
              }
            >
              <Plus size={15} />
              Add Gallery Image
            </button>
          </header>

          {galleryItems.length === 0 ? (
            <button
              type="button"
              className="newDetailBuilderEmpty"
              onClick={() =>
                setGalleryItems([
                  createGallery(0),
                ])
              }
            >
              <ImageIcon
                size={24}
              />

              <strong>
                Add your first gallery image
              </strong>

              <span>
                Upload an image or
                use a direct image URL.
              </span>
            </button>
          ) : (
            <div className="newDetailBuilderList">
              {galleryItems.map(
                (item, index) => (
                  <article
                    key={item.local_id}
                    className="newDetailBuilderItem"
                  >
                    <div className="newDetailBuilderItem__top">
                      <strong>
                        Gallery Image {index + 1}
                      </strong>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            item.preview.startsWith(
                              "blob:",
                            )
                          ) {
                            URL.revokeObjectURL(
                              item.preview,
                            );
                          }

                          setGalleryItems(
                            (current) =>
                              current.filter(
                                (entry) =>
                                  entry.local_id !==
                                  item.local_id,
                              ),
                          );
                        }}
                      >
                        <Trash2
                          size={14}
                        />
                      </button>
                    </div>

                    <div className="newGalleryPicker">
                      <label>
                        <Upload size={16} />
                        Choose Image

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            chooseGalleryFile(
                              item.local_id,
                              event,
                            )
                          }
                        />
                      </label>

                      <span>
                        or
                      </span>

                      <input
                        type="url"
                        placeholder="https://..."
                        value={
                          item.image_url ??
                          ""
                        }
                        onChange={(event) =>
                          setGalleryItems(
                            (current) =>
                              current.map(
                                (entry) =>
                                  entry.local_id ===
                                  item.local_id
                                    ? {
                                        ...entry,
                                        file: null,
                                        preview:
                                          event.target.value,
                                        image_url:
                                          event.target.value ||
                                          null,
                                      }
                                    : entry,
                              ),
                          )
                        }
                      />
                    </div>

                    {item.preview ||
                    item.image_url ? (
                      <img
                        className="newGalleryPreview"
                        src={
                          item.preview ||
                          item.image_url ||
                          ""
                        }
                        alt=""
                      />
                    ) : (
                      <div className="newGalleryEmpty">
                        <ImageIcon
                          size={25}
                        />
                        No image selected
                      </div>
                    )}

                    <div className="newDetailBuilderGrid">
                      <label>
                        <span>
                          Alt text
                        </span>

                        <input
                          value={item.image_alt}
                          onChange={(event) =>
                            setGalleryItems(
                              (current) =>
                                current.map(
                                  (entry) =>
                                    entry.local_id ===
                                    item.local_id
                                      ? {
                                          ...entry,
                                          image_alt:
                                            event.target.value,
                                        }
                                      : entry,
                                ),
                            )
                          }
                        />
                      </label>

                      <label>
                        <span>
                          Caption
                        </span>

                        <input
                          value={item.caption}
                          onChange={(event) =>
                            setGalleryItems(
                              (current) =>
                                current.map(
                                  (entry) =>
                                    entry.local_id ===
                                    item.local_id
                                      ? {
                                          ...entry,
                                          caption:
                                            event.target.value,
                                        }
                                      : entry,
                                ),
                            )
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
                          value={item.display_order}
                          onChange={(event) =>
                            setGalleryItems(
                              (current) =>
                                current.map(
                                  (entry) =>
                                    entry.local_id ===
                                    item.local_id
                                      ? {
                                          ...entry,
                                          display_order:
                                            Number(
                                              event.target.value,
                                            ),
                                        }
                                      : entry,
                                ),
                            )
                          }
                        />
                      </label>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
