"use client";

import type { ServiceFormCardProps } from "./service-form.types";

const objectPositionOptions = [
  { label: "Center", value: "center" },
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
  { label: "Top left", value: "top left" },
  { label: "Top right", value: "top right" },
  { label: "Bottom left", value: "bottom left" },
  { label: "Bottom right", value: "bottom right" },
];

export default function MediaCard({
  form,
  updateField,
  disabled = false,
}: ServiceFormCardProps) {
  const isVideo = form.media_type === "video";
  const isImage = form.media_type === "image";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
          Service media
        </p>

        <h2 className="mt-2 text-xl font-bold text-slate-950">
          Image or video
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          Choose whether this service should display an image or a
          video on the homepage.
        </p>
      </div>

      <div className="space-y-6">
        <fieldset disabled={disabled}>
          <legend className="mb-3 text-sm font-semibold text-slate-800">
            Media type
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <label
              className={`cursor-pointer rounded-2xl border p-4 transition ${
                isVideo
                  ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-100"
                  : "border-slate-300 bg-white hover:border-slate-400"
              } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="media_type"
                  value="video"
                  checked={isVideo}
                  onChange={() => updateField("media_type", "video")}
                  className="mt-1 size-4 accent-emerald-700"
                />

                <div>
                  <p className="font-semibold text-slate-950">
                    Video
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    Display a hosted video with an optional poster
                    image.
                  </p>
                </div>
              </div>
            </label>

            <label
              className={`cursor-pointer rounded-2xl border p-4 transition ${
                isImage
                  ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-100"
                  : "border-slate-300 bg-white hover:border-slate-400"
              } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="media_type"
                  value="image"
                  checked={isImage}
                  onChange={() => updateField("media_type", "image")}
                  className="mt-1 size-4 accent-emerald-700"
                />

                <div>
                  <p className="font-semibold text-slate-950">
                    Image
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    Display a single service image instead of a video.
                  </p>
                </div>
              </div>
            </label>
          </div>
        </fieldset>

        {isVideo ? (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="video_url"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Video URL
                <span className="ml-1 text-red-600">*</span>
              </label>

              <input
                id="video_url"
                name="video_url"
                type="url"
                required
                disabled={disabled}
                value={form.video_url}
                onChange={(event) =>
                  updateField("video_url", event.target.value)
                }
                placeholder="https://example.com/service-video.mp4"
                className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Use a direct video file URL, such as an MP4 URL from
                Supabase Storage.
              </p>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="video_poster_url"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Video poster URL
              </label>

              <input
                id="video_poster_url"
                name="video_poster_url"
                type="url"
                disabled={disabled}
                value={form.video_poster_url}
                onChange={(event) =>
                  updateField(
                    "video_poster_url",
                    event.target.value,
                  )
                }
                placeholder="https://example.com/video-poster.jpg"
                className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Optional image shown before the video loads or starts
                playing.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <label
              htmlFor="image_url"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Image URL
              <span className="ml-1 text-red-600">*</span>
            </label>

            <input
              id="image_url"
              name="image_url"
              type="url"
              required
              disabled={disabled}
              value={form.image_url}
              onChange={(event) =>
                updateField("image_url", event.target.value)
              }
              placeholder="https://example.com/service-image.jpg"
              className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Use a public image URL, preferably from Supabase
              Storage.
            </p>
          </div>
        )}

        <div>
          <label
            htmlFor="object_position"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Media position
          </label>

          <select
            id="object_position"
            name="object_position"
            disabled={disabled}
            value={form.object_position}
            onChange={(event) =>
              updateField("object_position", event.target.value)
            }
            className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            {objectPositionOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Controls which part of the image or video remains visible
            when the media is cropped.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-800">
            Media preview
          </p>

          <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {isVideo && form.video_url ? (
              <video
                key={form.video_url}
                controls
                muted
                playsInline
                poster={form.video_poster_url || undefined}
                className="size-full object-cover"
                style={{
                  objectPosition: form.object_position,
                }}
              >
                <source src={form.video_url} />
                Your browser does not support video playback.
              </video>
            ) : null}

            {isImage && form.image_url ? (
              // A normal img element is used because the admin can
              // enter arbitrary external URLs that may not be included
              // in the Next.js image remotePatterns configuration.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.image_url}
                alt={
                  form.service_name
                    ? `${form.service_name} preview`
                    : "Service media preview"
                }
                className="size-full object-cover"
                style={{
                  objectPosition: form.object_position,
                }}
              />
            ) : null}

            {isVideo && !form.video_url ? (
              <div className="flex size-full items-center justify-center px-6 text-center">
                <p className="max-w-sm text-sm leading-6 text-slate-500">
                  Enter a video URL to see the preview.
                </p>
              </div>
            ) : null}

            {isImage && !form.image_url ? (
              <div className="flex size-full items-center justify-center px-6 text-center">
                <p className="max-w-sm text-sm leading-6 text-slate-500">
                  Enter an image URL to see the preview.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}