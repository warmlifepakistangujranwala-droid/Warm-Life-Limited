"use client";

import Image from "next/image";
import {
  type ChangeEvent,
  type FormEvent,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  ImageIcon,
  Loader2,
  Plus,
  Star,
  Upload,
  X,
} from "lucide-react";

import { createHomepageReview } from "@/lib/actions/homepage-reviews";
import { createClient } from "@/lib/supabase/client";

type ReviewFormProps = {
  sectionId: string;
};

type ImageSource =
  | "upload"
  | "url";

const MAX_IMAGE_SIZE =
  10 * 1024 * 1024;

export default function ReviewForm({
  sectionId,
}: ReviewFormProps) {
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

  const [
    imagePreview,
    setImagePreview,
  ] = useState("");

  const [form, setForm] = useState({
    customer_name: "",
    company_name: "",
    designation: "",
    location: "",

    rating: 5,

    review_title: "",
    review_text: "",

    customer_image_url: "",
    customer_image_storage_path:
      null as string | null,
    customer_image_alt:
      "Customer profile image",

    is_verified: true,
    is_featured: false,

    display_order: 0,

    is_active: true,
    is_published: true,
  });

  function resetForm(): void {
    setForm({
      customer_name: "",
      company_name: "",
      designation: "",
      location: "",

      rating: 5,

      review_title: "",
      review_text: "",

      customer_image_url: "",
      customer_image_storage_path:
        null,
      customer_image_alt:
        "Customer profile image",

      is_verified: true,
      is_featured: false,

      display_order: 0,

      is_active: true,
      is_published: true,
    });

    setImageSource("upload");
    setImageFile(null);
    setImagePreview("");
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
        "Please select a valid image file.",
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
        "Customer image must be smaller than 10 MB.",
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

    return `homepage/reviews/customers/${crypto.randomUUID()}.${extension}`;
  }

  function selectUploadSource(): void {
    setImageSource("upload");

    setMessage("");
    setIsSuccess(false);
  }

  function selectUrlSource(): void {
    setImageSource("url");

    setImageFile(null);

    setImagePreview(
      form.customer_image_url,
    );

    setMessage("");
    setIsSuccess(false);
  }

  function removeImage(): void {
    setImageFile(null);
    setImagePreview("");

    setForm((current) => ({
      ...current,

      customer_image_url: "",

      customer_image_storage_path:
        null,
    }));

    setMessage("");
    setIsSuccess(false);
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    setMessage("");
    setIsSuccess(false);

    if (!form.customer_name.trim()) {
      setMessage(
        "Customer name is required.",
      );

      return;
    }

    if (!form.review_text.trim()) {
      setMessage(
        "Review text is required.",
      );

      return;
    }

    if (
      form.rating < 1 ||
      form.rating > 5
    ) {
      setMessage(
        "Rating must be between 1 and 5.",
      );

      return;
    }

    if (
      imageSource === "url" &&
      form.customer_image_url.trim()
    ) {
      try {
        const imageUrl =
          new URL(
            form.customer_image_url.trim(),
          );

        if (
          imageUrl.protocol !==
            "http:" &&
          imageUrl.protocol !==
            "https:"
        ) {
          setMessage(
            "Customer image URL must use http or https.",
          );

          return;
        }
      } catch {
        setMessage(
          "Please enter a valid customer image URL.",
        );

        return;
      }
    }

    startTransition(async () => {
      let uploadedPath:
        | string
        | null = null;

      try {
        let finalImageUrl =
          form.customer_image_url.trim() ||
          null;

        let finalStoragePath =
          form.customer_image_storage_path;

        if (
          imageSource === "upload" &&
          imageFile
        ) {
          uploadedPath =
            generateStoragePath(
              imageFile,
            );

          const {
            error: uploadError,
          } = await supabase.storage
            .from("website-media")
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
              .from("website-media")
              .getPublicUrl(
                uploadedPath,
              );

          finalImageUrl =
            data.publicUrl;

          finalStoragePath =
            uploadedPath;
        }

        if (
          imageSource === "url"
        ) {
          finalStoragePath =
            null;
        }

        const result =
          await createHomepageReview({
            section_id:
              sectionId,

            customer_name:
              form.customer_name.trim(),

            company_name:
              form.company_name.trim() ||
              null,

            designation:
              form.designation.trim() ||
              null,

            location:
              form.location.trim() ||
              null,

            rating:
              Number(form.rating),

            review_title:
              form.review_title.trim() ||
              null,

            review_text:
              form.review_text.trim(),

            customer_image_url:
              finalImageUrl,

            customer_image_storage_path:
              finalStoragePath,

            customer_image_alt:
              form.customer_image_alt.trim() ||
              `${form.customer_name.trim()} profile image`,

            source_type:
              "manual",

            google_review_id:
              null,

            google_author_url:
              null,

            google_profile_photo_url:
              null,

            google_relative_time:
              null,

            google_review_time:
              null,

            is_verified:
              form.is_verified,

            is_featured:
              form.is_featured,

            display_order:
              Number(
                form.display_order,
              ),

            is_active:
              form.is_active,

            is_published:
              form.is_published,
          });

        if (!result.success) {
          throw new Error(
            result.errors.join(", "),
          );
        }

        setIsSuccess(true);

        setMessage(
          "Customer review added successfully.",
        );

        resetForm();
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
            : "Unable to create customer review.",
        );

        setIsSuccess(false);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {message ? (
        <div
          className={`rounded-xl border px-5 py-4 text-sm font-medium ${
            isSuccess
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Customer Details
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Customer Name
            </span>

            <input
              value={
                form.customer_name
              }
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,

                    customer_name:
                      event.target.value,
                  }),
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              placeholder="Sarah Thompson"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Company Name
            </span>

            <input
              value={
                form.company_name
              }
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,

                    company_name:
                      event.target.value,
                  }),
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              placeholder="Optional"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Designation
            </span>

            <input
              value={
                form.designation
              }
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,

                    designation:
                      event.target.value,
                  }),
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              placeholder="Homeowner"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Location
            </span>

            <input
              value={form.location}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,

                    location:
                      event.target.value,
                  }),
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              placeholder="Manchester"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Review Content
        </h3>

        <div className="mt-5 grid gap-5">
          <div>
            <span className="text-sm font-semibold text-slate-900">
              Rating
            </span>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {Array.from({
                length: 5,
              }).map((_, index) => {
                const value =
                  index + 1;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setForm(
                        (current) => ({
                          ...current,

                          rating:
                            value,
                        }),
                      )
                    }
                    className="rounded-lg p-1 transition hover:scale-110"
                    aria-label={`Set rating to ${value}`}
                  >
                    <Star
                      size={27}
                      className={
                        value <=
                        form.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }
                    />
                  </button>
                );
              })}

              <span className="ml-2 text-sm font-bold text-slate-700">
                {form.rating}/5
              </span>
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Review Title
            </span>

            <input
              value={
                form.review_title
              }
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,

                    review_title:
                      event.target.value,
                  }),
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              placeholder="Professional from beginning to end"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Review Text
            </span>

            <textarea
              rows={6}
              value={
                form.review_text
              }
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,

                    review_text:
                      event.target.value,
                  }),
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              placeholder="Write the full customer review..."
            />

            <span className="mt-2 block text-xs text-slate-500">
              {
                form.review_text
                  .length
              }{" "}
              characters
            </span>
          </label>
        </div>
      </section>
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-3">
          <ImageIcon
            size={20}
            className="text-emerald-700"
          />

          <h3 className="text-lg font-bold text-slate-950">
            Customer Image
          </h3>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={selectUploadSource}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              imageSource === "upload"
                ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Upload from Computer
          </button>

          <button
            type="button"
            onClick={selectUrlSource}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              imageSource === "url"
                ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Use Direct URL
          </button>
        </div>

        {imageSource === "upload" ? (
          <label className="mt-5 block rounded-xl border border-dashed border-slate-300 bg-white p-5">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Upload size={17} />

              Select customer image
            </span>

            <span className="mt-2 block text-xs leading-5 text-slate-500">
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
              Customer Image URL
            </span>

            <input
              type="url"
              value={form.customer_image_url}
              onChange={(event) => {
                const value =
                  event.target.value;

                setForm((current) => ({
                  ...current,

                  customer_image_url:
                    value,

                  customer_image_storage_path:
                    null,
                }));

                setImagePreview(value);
                setImageFile(null);
              }}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              placeholder="https://example.com/customer.jpg"
            />
          </label>
        )}

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-slate-900">
            Image Alt Text
          </span>

          <input
            value={form.customer_image_alt}
            onChange={(event) =>
              setForm((current) => ({
                ...current,

                customer_image_alt:
                  event.target.value,
              }))
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            placeholder="Customer profile image"
          />
        </label>

        {imagePreview ? (
          <div className="relative mt-5 grid min-h-56 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
            <Image
              src={imagePreview}
              alt={
                form.customer_image_alt ||
                "Customer image preview"
              }
              width={260}
              height={260}
              className="h-44 w-44 rounded-full object-cover"
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
              onClick={removeImage}
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 shadow-sm hover:bg-red-50"
            >
              <X size={14} />

              Remove Image
            </button>
          </div>
        ) : (
          <div className="mt-5 grid min-h-44 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
            <div>
              <ImageIcon
                className="mx-auto text-slate-400"
                size={30}
              />

              <p className="mt-3 text-sm text-slate-500">
                Upload an image or enter a direct URL to see the preview.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Display Settings
        </h3>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">
              Display Order
            </span>

            <input
              type="number"
              min={0}
              max={999}
              value={form.display_order}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,

                  display_order:
                    Number(
                      event.target.value,
                    ),
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            />
          </label>

          <ToggleCard
            title="Verified Review"
            description="Show the verified badge on this review."
            checked={form.is_verified}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,

                is_verified: checked,
              }))
            }
          />

          <ToggleCard
            title="Featured Review"
            description="Give this review priority in the slider."
            checked={form.is_featured}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,

                is_featured: checked,
              }))
            }
          />

          <ToggleCard
            title="Active"
            description="Disable this review without deleting it."
            checked={form.is_active}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,

                is_active: checked,
              }))
            }
          />

          <ToggleCard
            title="Published"
            description="Show this review on the live homepage."
            checked={form.is_published}
            onChange={(checked) =>
              setForm((current) => ({
                ...current,

                is_published: checked,
              }))
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">
          Live Preview
        </h3>

        <article className="mt-5 rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt={
                    form.customer_image_alt ||
                    "Customer preview"
                  }
                  width={120}
                  height={120}
                  className="h-full w-full object-cover"
                  unoptimized={
                    imagePreview.startsWith(
                      "blob:",
                    ) ||
                    imagePreview
                      .toLowerCase()
                      .includes(".svg")
                  }
                />
              ) : (
                <span className="text-xl font-bold text-emerald-800">
                  {form.customer_name
                    .charAt(0)
                    .toUpperCase() ||
                    "C"}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-bold text-slate-950">
                  {form.customer_name ||
                    "Customer Name"}
                </h4>

                {form.is_verified ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                    Verified
                  </span>
                ) : null}

                {form.is_featured ? (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                    Featured
                  </span>
                ) : null}
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {[
                  form.designation,
                  form.company_name,
                  form.location,
                ]
                  .filter(Boolean)
                  .join(" • ") ||
                  "Customer"}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-1">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <Star
                key={index}
                size={18}
                className={
                  index <
                  Math.round(
                    form.rating,
                  )
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }
              />
            ))}

            <span className="ml-2 text-sm font-bold text-slate-700">
              {form.rating}
            </span>
          </div>

          {form.review_title ? (
            <h5 className="mt-5 text-lg font-bold text-slate-950">
              {form.review_title}
            </h5>
          ) : null}

          <p className="mt-3 leading-7 text-slate-600">
            {form.review_text ||
              "The customer review will appear here."}
          </p>
        </article>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Plus size={18} />
          )}

          {isPending
            ? "Adding Review..."
            : "Add Review"}
        </button>
      </div>
    </form>
  );
}

type ToggleCardProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (
    checked: boolean,
  ) => void;
};

function ToggleCard({
  title,
  description,
  checked,
  onChange,
}: ToggleCardProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <span>
        <span className="block text-sm font-semibold text-slate-900">
          {title}
        </span>

        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked,
          )
        }
        className="h-5 w-5 shrink-0"
      />
    </label>
  );
}