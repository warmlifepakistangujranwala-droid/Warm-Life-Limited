"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  useState,
  useTransition,
} from "react";

import { createHomepageWhyChooseUsCard } from "@/lib/actions/homepage-why-choose-us";
import { createClient } from "@/lib/supabase/client";

import type {
  WhyChooseUsMediaType,
} from "@/lib/types/homepage-why-choose-us";

type CardFormProps = {
  sectionId: string;
};

type ImageSource = "upload" | "url";

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

export default function CardForm({
  sectionId,
}: CardFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const [message, setMessage] =
    useState("");

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [imageSource, setImageSource] =
    useState<ImageSource>("upload");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",

    media_type:
      "icon" as WhyChooseUsMediaType,

    icon_key: "shield",
    icon_color: "#139267",
    icon_background_color:
      "transparent",
    icon_size: 28,

    image_url: "",
    image_storage_path:
      null as string | null,
    image_alt:
      "Why choose us card image",
    image_height: 120,

    title_color: "#d6a824",
    title_size: 21,
    title_weight: 500,

    description_color:
      "#536158",
    description_size: 15,

    card_background_color:
      "#fffdf8",
    card_border_color:
      "#dfe4df",
    card_radius: 24,
    card_min_height: 310,
    card_padding: 24,

    display_order: 0,

    is_active: true,
    is_published: true,
  });

  function resetForm(): void {
    setForm({
      title: "",
      description: "",

      media_type: "icon",

      icon_key: "shield",
      icon_color: "#139267",
      icon_background_color:
        "transparent",
      icon_size: 28,

      image_url: "",
      image_storage_path: null,
      image_alt:
        "Why choose us card image",
      image_height: 120,

      title_color: "#d6a824",
      title_size: 21,
      title_weight: 500,

      description_color:
        "#536158",
      description_size: 15,

      card_background_color:
        "#fffdf8",
      card_border_color:
        "#dfe4df",
      card_radius: 24,
      card_min_height: 310,
      card_padding: 24,

      display_order: 0,

      is_active: true,
      is_published: true,
    });

    setImageFile(null);
    setImagePreview("");
    setImageSource("upload");
  }

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
      setIsSuccess(false);
      event.target.value = "";
      return;
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      setMessage(
        "Image must be smaller than 10 MB.",
      );
      setIsSuccess(false);
      event.target.value = "";
      return;
    }

    setImageFile(file);

    setImagePreview(
      URL.createObjectURL(file),
    );

    setMessage("");
    setIsSuccess(false);
  }

  function generateStoragePath(
    file: File,
  ): string {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "png";

    return `homepage/why-choose-us/${crypto.randomUUID()}.${extension}`;
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (!form.title.trim()) {
      setMessage(
        "Card title is required.",
      );
      return;
    }

    if (
      !form.description.trim()
    ) {
      setMessage(
        "Card description is required.",
      );
      return;
    }

    if (
      form.media_type ===
        "image" &&
      imageSource === "url" &&
      !form.image_url.trim()
    ) {
      setMessage(
        "Please enter an image URL.",
      );
      return;
    }

    if (
      form.media_type ===
        "image" &&
      imageSource === "upload" &&
      !imageFile
    ) {
      setMessage(
        "Please select an image.",
      );
      return;
    }

    startTransition(async () => {
      let uploadedPath:
        | string
        | null = null;

      try {
        let finalImageUrl =
          form.image_url.trim() ||
          null;

        let finalStoragePath =
          form.image_storage_path;

        if (
          form.media_type ===
            "image" &&
          imageSource ===
            "upload" &&
          imageFile
        ) {
          uploadedPath =
            generateStoragePath(
              imageFile,
            );

          const {
            error:
              uploadError,
          } =
            await supabase.storage
              .from(
                "website-media",
              )
              .upload(
                uploadedPath,
                imageFile,
                {
                  cacheControl:
                    "3600",
                  upsert: false,
                  contentType:
                    imageFile.type,
                },
              );

          if (uploadError) {
            throw new Error(
              uploadError.message,
            );
          }

          const { data } =
            supabase.storage
              .from(
                "website-media",
              )
              .getPublicUrl(
                uploadedPath,
              );

          finalImageUrl =
            data.publicUrl;

          finalStoragePath =
            uploadedPath;
        }

        if (
          form.media_type ===
          "icon"
        ) {
          finalImageUrl = null;
          finalStoragePath =
            null;
        }

        if (
          form.media_type ===
            "image" &&
          imageSource === "url"
        ) {
          finalStoragePath =
            null;
        }

        const result =
          await createHomepageWhyChooseUsCard(
            {
              section_id:
                sectionId,

              title:
                form.title.trim(),

              description:
                form.description.trim(),

              media_type:
                form.media_type,

              icon_key:
                form.icon_key,

              icon_color:
                form.icon_color,

              icon_background_color:
                form.icon_background_color,

              icon_size:
                Number(
                  form.icon_size,
                ),

              image_url:
                finalImageUrl,

              image_storage_path:
                finalStoragePath,

              image_alt:
                form.image_alt.trim() ||
                "Why choose us card image",

              image_height:
                Number(
                  form.image_height,
                ),

              title_color:
                form.title_color,

              title_size:
                Number(
                  form.title_size,
                ),

              title_weight:
                Number(
                  form.title_weight,
                ),

              description_color:
                form.description_color,

              description_size:
                Number(
                  form.description_size,
                ),

              card_background_color:
                form.card_background_color,

              card_border_color:
                form.card_border_color,

              card_radius:
                Number(
                  form.card_radius,
                ),

              card_min_height:
                Number(
                  form.card_min_height,
                ),

              card_padding:
                Number(
                  form.card_padding,
                ),

              display_order:
                Number(
                  form.display_order,
                ),

              is_active:
                form.is_active,

              is_published:
                form.is_published,
            },
          );

        if (!result.success) {
          throw new Error(
            result.errors.join(
              ", ",
            ),
          );
        }

        setIsSuccess(true);
        setMessage(
          "Card added successfully.",
        );

        resetForm();
        router.refresh();
      } catch (error) {
        if (uploadedPath) {
          await supabase.storage
            .from(
              "website-media",
            )
            .remove([
              uploadedPath,
            ]);
        }

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to create card.",
        );

        setIsSuccess(false);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">
            Add Why Choose Us Card
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            Add an unlimited number
            of icon or image cards.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? "Adding..."
            : "Add Card"}
        </button>
      </div>

      {message ? (
        <div
          className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${
            isSuccess
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Card Content
        </h4>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Card Title
            </span>

            <input
              value={form.title}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    title:
                      event
                        .target
                        .value,
                  }),
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Media Type
            </span>

            <select
              value={
                form.media_type
              }
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    media_type:
                      event
                        .target
                        .value as WhyChooseUsMediaType,
                  }),
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value="icon">
                Icon
              </option>

              <option value="image">
                Image
              </option>
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-slate-900">
              Description
            </span>

            <textarea
              rows={4}
              value={
                form.description
              }
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    description:
                      event
                        .target
                        .value,
                  }),
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>
        </div>
      </section>
            {form.media_type === "icon" ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h4 className="text-base font-bold text-slate-950">
            Icon Settings
          </h4>

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                Icon
              </span>

              <select
                value={form.icon_key}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    icon_key:
                      event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >
                <option value="shield">
                  Shield
                </option>

                <option value="users">
                  Users
                </option>

                <option value="leaf">
                  Leaf
                </option>

                <option value="wrench">
                  Wrench
                </option>

                <option value="map-pin">
                  Map Pin
                </option>

                <option value="home">
                  Home
                </option>

                <option value="check">
                  Check
                </option>

                <option value="badge">
                  Badge
                </option>
              </select>
            </label>

            <ColourField
              label="Icon Colour"
              value={form.icon_color}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  icon_color: value,
                }))
              }
            />

            <ColourField
              label="Icon Background"
              value={
                form.icon_background_color
              }
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  icon_background_color:
                    value,
                }))
              }
            />

            <NumberField
              label="Icon Size"
              value={form.icon_size}
              min={12}
              max={96}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  icon_size:
                    Number(value),
                }))
              }
            />
          </div>
        </section>
      ) : (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h4 className="text-base font-bold text-slate-950">
            Image Settings
          </h4>

          <p className="mt-2 text-sm text-slate-600">
            Upload from computer or use a direct public URL.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setImageSource("upload");
                setMessage("");
                setIsSuccess(false);
              }}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                imageSource === "upload"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Upload from Computer
            </button>

            <button
              type="button"
              onClick={() => {
                setImageSource("url");
                setImageFile(null);
                setImagePreview(
                  form.image_url,
                );
                setMessage("");
                setIsSuccess(false);
              }}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                imageSource === "url"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Use Direct URL
            </button>
          </div>

          {imageSource === "upload" ? (
            <label className="mt-5 block rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <span className="block text-sm font-semibold text-slate-900">
                Select card image
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                PNG, JPG, SVG or WebP. Maximum 10 MB.
              </span>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={chooseImage}
                className="mt-4 block w-full cursor-pointer text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-800"
              />

              {imageFile ? (
                <p className="mt-3 text-xs font-medium text-emerald-700">
                  Selected: {imageFile.name}
                </p>
              ) : null}
            </label>
          ) : (
            <label className="mt-5 block">
              <span className="text-sm font-semibold text-slate-900">
                Image URL
              </span>

              <input
                type="url"
                value={form.image_url}
                onChange={(event) => {
                  const value =
                    event.target.value;

                  setForm((current) => ({
                    ...current,
                    image_url: value,
                    image_storage_path:
                      null,
                  }));

                  setImagePreview(value);
                  setImageFile(null);
                }}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="https://example.com/image.png"
              />
            </label>
          )}

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                Image Alt Text
              </span>

              <input
                value={form.image_alt}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    image_alt:
                      event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>

            <NumberField
              label="Image Height"
              value={form.image_height}
              min={40}
              max={400}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  image_height:
                    Number(value),
                }))
              }
            />
          </div>

          {imagePreview ? (
            <div className="relative mt-5 grid min-h-56 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <Image
                src={imagePreview}
                alt={
                  form.image_alt ||
                  "Card image preview"
                }
                width={420}
                height={280}
                className="max-w-full object-contain"
                style={{
                  maxHeight: `${form.image_height}px`,
                }}
                unoptimized={
                  imagePreview.startsWith(
                    "blob:",
                  ) ||
                  imagePreview
                    .toLowerCase()
                    .includes(".svg")
                }
              />

              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview("");

                  setForm((current) => ({
                    ...current,
                    image_url: "",
                    image_storage_path:
                      null,
                  }));
                }}
                className="absolute right-4 top-4 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 shadow-sm hover:bg-red-50"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <div className="mt-5 grid min-h-56 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Upload an image or enter a direct URL to see the preview.
            </div>
          )}
        </section>
      )}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Text Styling
        </h4>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ColourField
            label="Title Colour"
            value={form.title_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                title_color: value,
              }))
            }
          />

          <NumberField
            label="Title Size"
            value={form.title_size}
            min={12}
            max={60}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                title_size:
                  Number(value),
              }))
            }
          />

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Title Weight
            </span>

            <select
              value={form.title_weight}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title_weight:
                    Number(
                      event.target.value,
                    ),
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value={300}>
                300 — Light
              </option>

              <option value={400}>
                400 — Regular
              </option>

              <option value={500}>
                500 — Medium
              </option>

              <option value={600}>
                600 — Semi Bold
              </option>

              <option value={700}>
                700 — Bold
              </option>

              <option value={800}>
                800 — Extra Bold
              </option>
            </select>
          </label>

          <ColourField
            label="Description Colour"
            value={
              form.description_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                description_color:
                  value,
              }))
            }
          />

          <NumberField
            label="Description Size"
            value={
              form.description_size
            }
            min={10}
            max={32}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                description_size:
                  Number(value),
              }))
            }
          />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Card Styling
        </h4>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ColourField
            label="Card Background"
            value={
              form.card_background_color
            }
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                card_background_color:
                  value,
              }))
            }
          />

          <ColourField
            label="Card Border Colour"
            value={form.card_border_color}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                card_border_color:
                  value,
              }))
            }
          />

          <NumberField
            label="Card Radius"
            value={form.card_radius}
            min={0}
            max={80}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                card_radius:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Card Minimum Height"
            value={
              form.card_min_height
            }
            min={120}
            max={700}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                card_min_height:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Card Padding"
            value={form.card_padding}
            min={8}
            max={80}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                card_padding:
                  Number(value),
              }))
            }
          />

          <NumberField
            label="Display Order"
            value={form.display_order}
            min={0}
            max={999}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                display_order:
                  Number(value),
              }))
            }
          />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Visibility
        </h4>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Active
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                Disable this card without deleting it.
              </span>
            </span>

            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  is_active:
                    event.target.checked,
                }))
              }
              className="h-5 w-5"
            />
          </label>

          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Published
              </span>

              <span className="mt-1 block text-xs text-slate-500">
                Show this card on the live homepage.
              </span>
            </span>

            <input
              type="checkbox"
              checked={
                form.is_published
              }
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  is_published:
                    event.target.checked,
                }))
              }
              className="h-5 w-5"
            />
          </label>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="text-base font-bold text-slate-950">
          Live Preview
        </h4>

        <article
          className="mt-5 overflow-hidden border shadow-sm"
          style={{
            backgroundColor:
              form.card_background_color,
            borderColor:
              form.card_border_color,
            borderRadius: `${form.card_radius}px`,
            minHeight: `${form.card_min_height}px`,
            padding: `${form.card_padding}px`,
          }}
        >
          {form.media_type === "image" &&
          imagePreview ? (
            <div
              className="mb-5 grid place-items-center overflow-hidden"
              style={{
                height: `${form.image_height}px`,
              }}
            >
              <Image
                src={imagePreview}
                alt={
                  form.image_alt ||
                  "Card image preview"
                }
                width={360}
                height={220}
                className="h-full w-full object-contain"
                unoptimized={
                  imagePreview.startsWith(
                    "blob:",
                  ) ||
                  imagePreview
                    .toLowerCase()
                    .includes(".svg")
                }
              />
            </div>
          ) : (
            <div
              className="mb-5 grid place-items-center rounded-2xl"
              style={{
                width: `${Math.max(
                  form.icon_size + 28,
                  56,
                )}px`,
                height: `${Math.max(
                  form.icon_size + 28,
                  56,
                )}px`,
                color:
                  form.icon_color,
                backgroundColor:
                  form.icon_background_color,
              }}
            >
              <span
                style={{
                  fontSize: `${form.icon_size}px`,
                }}
              >
                ◆
              </span>
            </div>
          )}

          <h5
            style={{
              color:
                form.title_color,
              fontSize: `${form.title_size}px`,
              fontWeight:
                form.title_weight,
            }}
          >
            {form.title ||
              "Card title"}
          </h5>

          <p
            className="mt-3 leading-7"
            style={{
              color:
                form.description_color,
              fontSize: `${form.description_size}px`,
            }}
          >
            {form.description ||
              "Card description will appear here."}
          </p>
        </article>
      </section>
    </form>
  );
}

type ColourFieldProps = {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
};

function ColourField({
  label,
  value,
  onChange,
}: ColourFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">
        {label}
      </span>

      <div className="mt-2 flex gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className="h-12 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
        />

        <input
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>
    </label>
  );
}

type NumberFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (
    value: string,
  ) => void;
};

function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: NumberFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">
        {label}
      </span>

      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
      />
    </label>
  );
}