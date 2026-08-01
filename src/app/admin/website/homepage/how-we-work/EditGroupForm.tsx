"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  useState,
  useTransition,
} from "react";

import { updateHomepageHowWeWorkGroup } from "@/lib/actions/homepage-how-we-work";
import { createClient } from "@/lib/supabase/client";
import type {
  HomepageHowWeWorkGroupWithSteps,
  HowWeWorkBackgroundType,
  HowWeWorkLayoutStyle,
  HowWeWorkMediaType,
  HowWeWorkShadowStyle,
} from "@/lib/types/homepage-how-we-work";

type Props = {
  group: HomepageHowWeWorkGroupWithSteps;
};

type ImageSource = "upload" | "url";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export default function EditGroupForm({ group }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [groupImageSource, setGroupImageSource] = useState<ImageSource>(
    group.image_storage_path ? "upload" : "url",
  );
  const [groupImageFile, setGroupImageFile] = useState<File | null>(null);
  const [groupImagePreview, setGroupImagePreview] = useState(
    group.image_url ?? "",
  );

  const [backgroundImageSource, setBackgroundImageSource] =
    useState<ImageSource>(
      group.background_image_storage_path ? "upload" : "url",
    );
  const [backgroundImageFile, setBackgroundImageFile] =
    useState<File | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState(
    group.background_image_url ?? "",
  );

  const [form, setForm] = useState({
    internal_name: group.internal_name,
    title: group.title,
    subtitle: group.subtitle ?? "",
    media_type: group.media_type as HowWeWorkMediaType,
    icon_key: group.icon_key,
    icon_color: group.icon_color,
    icon_background_color: group.icon_background_color,
    icon_size: group.icon_size,
    image_url: group.image_url ?? "",
    image_storage_path: group.image_storage_path,
    image_alt: group.image_alt,
    image_height: group.image_height,
    title_color: group.title_color,
    title_size: group.title_size,
    title_weight: group.title_weight,
    subtitle_color: group.subtitle_color,
    subtitle_size: group.subtitle_size,
    background_type: group.background_type as HowWeWorkBackgroundType,
    background_color: group.background_color,
    gradient_start_color: group.gradient_start_color,
    gradient_end_color: group.gradient_end_color,
    gradient_direction: group.gradient_direction,
    background_image_url: group.background_image_url ?? "",
    background_image_storage_path: group.background_image_storage_path,
    background_image_alt: group.background_image_alt,
    background_overlay_color: group.background_overlay_color,
    border_color: group.border_color,
    border_width: group.border_width,
    card_radius: group.card_radius,
    card_padding: group.card_padding,
    min_height: group.min_height,
    shadow_style: group.shadow_style as HowWeWorkShadowStyle,
    layout_style: group.layout_style as HowWeWorkLayoutStyle,
    highlight_enabled: group.highlight_enabled,
    highlight_text: group.highlight_text ?? "",
    highlight_icon_key: group.highlight_icon_key,
    highlight_text_color: group.highlight_text_color,
    highlight_background_color: group.highlight_background_color,
    highlight_radius: group.highlight_radius,
    highlight_padding: group.highlight_padding,
    display_order: group.display_order,
    is_active: group.is_active,
    is_published: group.is_published,
  });

  function validateImage(file: File): string | null {
    if (!file.type.startsWith("image/")) return "Please select a valid image.";
    if (file.size > MAX_IMAGE_SIZE) return "Image must be smaller than 10 MB.";
    return null;
  }

  function chooseImage(
    event: ChangeEvent<HTMLInputElement>,
    target: "group" | "background",
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateImage(file);
    if (error) {
      setMessage(error);
      setIsSuccess(false);
      event.target.value = "";
      return;
    }

    const preview = URL.createObjectURL(file);

    if (target === "group") {
      setGroupImageFile(file);
      setGroupImagePreview(preview);
    } else {
      setBackgroundImageFile(file);
      setBackgroundImagePreview(preview);
    }

    setMessage("");
  }

  function storagePath(
    file: File,
    folder: "group-media" | "group-backgrounds",
  ) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    return `homepage/how-we-work/${folder}/${crypto.randomUUID()}.${ext}`;
  }

  async function upload(
    file: File,
    folder: "group-media" | "group-backgrounds",
  ) {
    const path = storagePath(file, folder);
    const { error } = await supabase.storage
      .from("website-media")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw new Error(error.message);

    const publicUrl = supabase.storage
      .from("website-media")
      .getPublicUrl(path).data.publicUrl;

    return { path, publicUrl };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSuccess(false);

    if (!form.internal_name.trim()) {
      setMessage("Internal name is required.");
      return;
    }

    if (!form.title.trim()) {
      setMessage("Group title is required.");
      return;
    }

    if (form.highlight_enabled && !form.highlight_text.trim()) {
      setMessage("Highlight text is required.");
      return;
    }

    startTransition(async () => {
      let newGroupPath: string | null = null;
      let newBackgroundPath: string | null = null;

      try {
        let imageUrl = form.image_url.trim() || null;
        let imagePath = form.image_storage_path;

        let backgroundUrl = form.background_image_url.trim() || null;
        let backgroundPath = form.background_image_storage_path;

        if (
          form.media_type === "image" &&
          groupImageSource === "upload" &&
          groupImageFile
        ) {
          const uploaded = await upload(groupImageFile, "group-media");
          newGroupPath = uploaded.path;
          imagePath = uploaded.path;
          imageUrl = uploaded.publicUrl;
        }

        if (form.media_type !== "image") {
          imageUrl = null;
          imagePath = null;
        } else if (groupImageSource === "url") {
          imagePath = null;
        }

        if (
          form.background_type === "image" &&
          backgroundImageSource === "upload" &&
          backgroundImageFile
        ) {
          const uploaded = await upload(
            backgroundImageFile,
            "group-backgrounds",
          );
          newBackgroundPath = uploaded.path;
          backgroundPath = uploaded.path;
          backgroundUrl = uploaded.publicUrl;
        }

        if (form.background_type !== "image") {
          backgroundUrl = null;
          backgroundPath = null;
        } else if (backgroundImageSource === "url") {
          backgroundPath = null;
        }

        const result = await updateHomepageHowWeWorkGroup(group.id, {
          internal_name: form.internal_name.trim(),
          title: form.title.trim(),
          subtitle: form.subtitle.trim() || null,
          media_type: form.media_type,
          icon_key: form.icon_key,
          icon_color: form.icon_color,
          icon_background_color: form.icon_background_color,
          icon_size: Number(form.icon_size),
          image_url: imageUrl,
          image_storage_path: imagePath,
          image_alt: form.image_alt.trim() || "Process group image",
          image_height: Number(form.image_height),
          title_color: form.title_color,
          title_size: Number(form.title_size),
          title_weight: Number(form.title_weight),
          subtitle_color: form.subtitle_color,
          subtitle_size: Number(form.subtitle_size),
          background_type: form.background_type,
          background_color: form.background_color,
          gradient_start_color: form.gradient_start_color,
          gradient_end_color: form.gradient_end_color,
          gradient_direction: form.gradient_direction.trim() || "145deg",
          background_image_url: backgroundUrl,
          background_image_storage_path: backgroundPath,
          background_image_alt:
            form.background_image_alt.trim() || "Process group background",
          background_overlay_color:
            form.background_overlay_color.trim() || "rgba(5,55,40,0.72)",
          border_color: form.border_color,
          border_width: Number(form.border_width),
          card_radius: Number(form.card_radius),
          card_padding: Number(form.card_padding),
          min_height: Number(form.min_height),
          shadow_style: form.shadow_style,
          layout_style: form.layout_style,
          highlight_enabled: form.highlight_enabled,
          highlight_text: form.highlight_enabled
            ? form.highlight_text.trim()
            : null,
          highlight_icon_key: form.highlight_icon_key,
          highlight_text_color: form.highlight_text_color,
          highlight_background_color: form.highlight_background_color,
          highlight_radius: Number(form.highlight_radius),
          highlight_padding: Number(form.highlight_padding),
          display_order: Number(form.display_order),
          is_active: form.is_active,
          is_published: form.is_published,
        });

        if (!result.success) throw new Error(result.errors.join(", "));

        const oldPaths = [
          group.image_storage_path &&
          group.image_storage_path !== imagePath
            ? group.image_storage_path
            : null,
          group.background_image_storage_path &&
          group.background_image_storage_path !== backgroundPath
            ? group.background_image_storage_path
            : null,
        ].filter((value): value is string => Boolean(value));

        if (oldPaths.length) {
          await supabase.storage.from("website-media").remove(oldPaths);
        }

        setForm((current) => ({
          ...current,
          image_url: imageUrl ?? "",
          image_storage_path: imagePath,
          background_image_url: backgroundUrl ?? "",
          background_image_storage_path: backgroundPath,
        }));
        setGroupImagePreview(imageUrl ?? "");
        setBackgroundImagePreview(backgroundUrl ?? "");
        setGroupImageFile(null);
        setBackgroundImageFile(null);
        setIsSuccess(true);
        setMessage("Process group updated successfully.");
        router.refresh();
      } catch (error) {
        const paths = [newGroupPath, newBackgroundPath].filter(
          (value): value is string => Boolean(value),
        );
        if (paths.length) {
          await supabase.storage.from("website-media").remove(paths);
        }
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to update process group.",
        );
      }
    });
  }

  const previewBackground =
    form.background_type === "gradient"
      ? `linear-gradient(${form.gradient_direction}, ${form.gradient_start_color}, ${form.gradient_end_color})`
      : form.background_color;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Process Group Details</h2>
          <p className="mt-2 text-sm text-slate-600">Update content, media, styling and visibility.</p>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => router.push("/admin/website/homepage/how-we-work")} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold">
            Cancel
          </button>
          <button type="submit" disabled={isPending} className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {message ? (
        <div className={`rounded-xl border px-5 py-4 text-sm font-medium ${isSuccess ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {message}
        </div>
      ) : null}

      <Panel title="Content">
        <div className="grid gap-5 md:grid-cols-2">
          <TextField label="Internal Name" value={form.internal_name} onChange={(value) => setForm((c) => ({ ...c, internal_name: value }))} />
          <TextField label="Public Title" value={form.title} onChange={(value) => setForm((c) => ({ ...c, title: value }))} />
          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-slate-900">Subtitle</span>
            <textarea rows={4} value={form.subtitle} onChange={(e) => setForm((c) => ({ ...c, subtitle: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3" />
          </label>
        </div>
      </Panel>

      <Panel title="Media">
        <div className="grid gap-5 md:grid-cols-2">
          <SelectField label="Media Type" value={form.media_type} options={[["icon","Icon"],["image","Image"],["none","No Media"]]} onChange={(value) => setForm((c) => ({ ...c, media_type: value as HowWeWorkMediaType }))} />
          {form.media_type === "icon" ? (
            <TextField label="Icon Key" value={form.icon_key} onChange={(value) => setForm((c) => ({ ...c, icon_key: value }))} />
          ) : null}
        </div>

        {form.media_type === "icon" ? (
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <TextField label="Icon Colour" value={form.icon_color} onChange={(value) => setForm((c) => ({ ...c, icon_color: value }))} />
            <TextField label="Icon Background" value={form.icon_background_color} onChange={(value) => setForm((c) => ({ ...c, icon_background_color: value }))} />
            <NumberField label="Icon Size" value={form.icon_size} min={12} max={100} onChange={(value) => setForm((c) => ({ ...c, icon_size: Number(value) }))} />
          </div>
        ) : null}

        {form.media_type === "image" ? (
          <ImagePicker
            title="Group Image"
            source={groupImageSource}
            setSource={setGroupImageSource}
            file={groupImageFile}
            preview={groupImagePreview}
            url={form.image_url}
            alt={form.image_alt}
            height={form.image_height}
            onFile={(event) => chooseImage(event, "group")}
            onUrl={(value) => {
              setForm((c) => ({ ...c, image_url: value, image_storage_path: null }));
              setGroupImagePreview(value);
              setGroupImageFile(null);
            }}
            onAlt={(value) => setForm((c) => ({ ...c, image_alt: value }))}
            onHeight={(value) => setForm((c) => ({ ...c, image_height: Number(value) }))}
            onRemove={() => {
              setGroupImageFile(null);
              setGroupImagePreview("");
              setForm((c) => ({ ...c, image_url: "", image_storage_path: null }));
            }}
          />
        ) : null}
      </Panel>

      <Panel title="Typography">
        <div className="grid gap-5 md:grid-cols-3">
          <TextField label="Title Colour" value={form.title_color} onChange={(value) => setForm((c) => ({ ...c, title_color: value }))} />
          <NumberField label="Title Size" value={form.title_size} min={14} max={70} onChange={(value) => setForm((c) => ({ ...c, title_size: Number(value) }))} />
          <NumberField label="Title Weight" value={form.title_weight} min={100} max={900} step={100} onChange={(value) => setForm((c) => ({ ...c, title_weight: Number(value) }))} />
          <TextField label="Subtitle Colour" value={form.subtitle_color} onChange={(value) => setForm((c) => ({ ...c, subtitle_color: value }))} />
          <NumberField label="Subtitle Size" value={form.subtitle_size} min={10} max={36} onChange={(value) => setForm((c) => ({ ...c, subtitle_size: Number(value) }))} />
        </div>
      </Panel>

      <Panel title="Background">
        <div className="grid gap-5 md:grid-cols-3">
          <SelectField label="Background Type" value={form.background_type} options={[["solid","Solid"],["gradient","Gradient"],["image","Image"]]} onChange={(value) => setForm((c) => ({ ...c, background_type: value as HowWeWorkBackgroundType }))} />
          <TextField label="Background Colour" value={form.background_color} onChange={(value) => setForm((c) => ({ ...c, background_color: value }))} />
          <TextField label="Gradient Start" value={form.gradient_start_color} onChange={(value) => setForm((c) => ({ ...c, gradient_start_color: value }))} />
          <TextField label="Gradient End" value={form.gradient_end_color} onChange={(value) => setForm((c) => ({ ...c, gradient_end_color: value }))} />
          <TextField label="Gradient Direction" value={form.gradient_direction} onChange={(value) => setForm((c) => ({ ...c, gradient_direction: value }))} />
        </div>

        {form.background_type === "image" ? (
          <>
            <ImagePicker
              title="Background Image"
              source={backgroundImageSource}
              setSource={setBackgroundImageSource}
              file={backgroundImageFile}
              preview={backgroundImagePreview}
              url={form.background_image_url}
              alt={form.background_image_alt}
              height={240}
              onFile={(event) => chooseImage(event, "background")}
              onUrl={(value) => {
                setForm((c) => ({ ...c, background_image_url: value, background_image_storage_path: null }));
                setBackgroundImagePreview(value);
                setBackgroundImageFile(null);
              }}
              onAlt={(value) => setForm((c) => ({ ...c, background_image_alt: value }))}
              onHeight={() => undefined}
              onRemove={() => {
                setBackgroundImageFile(null);
                setBackgroundImagePreview("");
                setForm((c) => ({ ...c, background_image_url: "", background_image_storage_path: null }));
              }}
              showHeight={false}
            />
            <div className="mt-5">
              <TextField label="Overlay Colour" value={form.background_overlay_color} onChange={(value) => setForm((c) => ({ ...c, background_overlay_color: value }))} />
            </div>
          </>
        ) : null}
      </Panel>

      <Panel title="Layout">
        <div className="grid gap-5 md:grid-cols-3">
          <TextField label="Border Colour" value={form.border_color} onChange={(value) => setForm((c) => ({ ...c, border_color: value }))} />
          <NumberField label="Border Width" value={form.border_width} min={0} max={10} onChange={(value) => setForm((c) => ({ ...c, border_width: Number(value) }))} />
          <NumberField label="Card Radius" value={form.card_radius} min={0} max={100} onChange={(value) => setForm((c) => ({ ...c, card_radius: Number(value) }))} />
          <NumberField label="Card Padding" value={form.card_padding} min={12} max={100} onChange={(value) => setForm((c) => ({ ...c, card_padding: Number(value) }))} />
          <NumberField label="Minimum Height" value={form.min_height} min={220} max={1000} onChange={(value) => setForm((c) => ({ ...c, min_height: Number(value) }))} />
          <SelectField label="Shadow" value={form.shadow_style} options={[["none","None"],["soft","Soft"],["medium","Medium"],["strong","Strong"]]} onChange={(value) => setForm((c) => ({ ...c, shadow_style: value as HowWeWorkShadowStyle }))} />
          <SelectField label="Steps Layout" value={form.layout_style} options={[["timeline","Timeline"],["cards","Cards"],["numbered-list","Numbered List"]]} onChange={(value) => setForm((c) => ({ ...c, layout_style: value as HowWeWorkLayoutStyle }))} />
          <NumberField label="Display Order" value={form.display_order} min={0} max={999} onChange={(value) => setForm((c) => ({ ...c, display_order: Number(value) }))} />
        </div>
      </Panel>

      <Panel title="Highlight">
        <ToggleField label="Enable Highlight" checked={form.highlight_enabled} onChange={(checked) => setForm((c) => ({ ...c, highlight_enabled: checked }))} />
        {form.highlight_enabled ? (
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <TextField label="Highlight Text" value={form.highlight_text} onChange={(value) => setForm((c) => ({ ...c, highlight_text: value }))} />
            <TextField label="Highlight Icon" value={form.highlight_icon_key} onChange={(value) => setForm((c) => ({ ...c, highlight_icon_key: value }))} />
            <TextField label="Text Colour" value={form.highlight_text_color} onChange={(value) => setForm((c) => ({ ...c, highlight_text_color: value }))} />
            <TextField label="Background Colour" value={form.highlight_background_color} onChange={(value) => setForm((c) => ({ ...c, highlight_background_color: value }))} />
            <NumberField label="Radius" value={form.highlight_radius} min={0} max={100} onChange={(value) => setForm((c) => ({ ...c, highlight_radius: Number(value) }))} />
            <NumberField label="Padding" value={form.highlight_padding} min={6} max={60} onChange={(value) => setForm((c) => ({ ...c, highlight_padding: Number(value) }))} />
          </div>
        ) : null}
      </Panel>

      <Panel title="Visibility">
        <div className="grid gap-5 md:grid-cols-2">
          <ToggleField label="Active" checked={form.is_active} onChange={(checked) => setForm((c) => ({ ...c, is_active: checked }))} />
          <ToggleField label="Published" checked={form.is_published} onChange={(checked) => setForm((c) => ({ ...c, is_published: checked }))} />
        </div>
      </Panel>

      <Panel title="Live Preview">
        <article
          className="relative overflow-hidden"
          style={{
            background: previewBackground,
            borderColor: form.border_color,
            borderWidth: `${form.border_width}px`,
            borderStyle: "solid",
            borderRadius: `${form.card_radius}px`,
            padding: `${form.card_padding}px`,
            minHeight: `${form.min_height}px`,
          }}
        >
          {form.background_type === "image" && backgroundImagePreview ? (
            <>
              <Image src={backgroundImagePreview} alt={form.background_image_alt || "Background"} fill className="object-cover" unoptimized />
              <div className="absolute inset-0" style={{ backgroundColor: form.background_overlay_color }} />
            </>
          ) : null}

          <div className="relative z-10">
            <h3 style={{ color: form.title_color, fontSize: `${form.title_size}px`, fontWeight: form.title_weight }}>{form.title || "Group title"}</h3>
            {form.subtitle ? <p className="mt-3" style={{ color: form.subtitle_color, fontSize: `${form.subtitle_size}px` }}>{form.subtitle}</p> : null}
            {form.highlight_enabled ? (
              <div className="mt-8" style={{ color: form.highlight_text_color, backgroundColor: form.highlight_background_color, borderRadius: `${form.highlight_radius}px`, padding: `${form.highlight_padding}px` }}>
                {form.highlight_text || "Highlight message"}
              </div>
            ) : null}
          </div>
        </article>
      </Panel>
    </form>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3" />
    </label>
  );
}

function NumberField({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <input type="number" value={value} min={min} max={max} step={step} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3" />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: Array<[string,string]>; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3">
        {options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    </label>
  );
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5" />
    </label>
  );
}

function ImagePicker(props: {
  title: string;
  source: ImageSource;
  setSource: (value: ImageSource) => void;
  file: File | null;
  preview: string;
  url: string;
  alt: string;
  height: number;
  onFile: (event: ChangeEvent<HTMLInputElement>) => void;
  onUrl: (value: string) => void;
  onAlt: (value: string) => void;
  onHeight: (value: string) => void;
  onRemove: () => void;
  showHeight?: boolean;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
      <h4 className="font-bold text-slate-950">{props.title}</h4>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => props.setSource("upload")} className={`rounded-xl border px-4 py-3 text-sm font-semibold ${props.source === "upload" ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-slate-300"}`}>Upload from Computer</button>
        <button type="button" onClick={() => props.setSource("url")} className={`rounded-xl border px-4 py-3 text-sm font-semibold ${props.source === "url" ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-slate-300"}`}>Use URL</button>
      </div>

      {props.source === "upload" ? (
        <input type="file" accept="image/*" onChange={props.onFile} className="mt-5 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4" />
      ) : (
        <div className="mt-5"><TextField label="Image URL" value={props.url} onChange={props.onUrl} /></div>
      )}

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <TextField label="Alt Text" value={props.alt} onChange={props.onAlt} />
        {props.showHeight === false ? null : <NumberField label="Image Height" value={props.height} min={40} max={500} onChange={props.onHeight} />}
      </div>

      {props.preview ? (
        <div className="relative mt-5 grid min-h-52 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <Image src={props.preview} alt={props.alt || "Preview"} width={600} height={360} className="max-w-full object-contain" style={{ maxHeight: `${props.height}px` }} unoptimized />
          <button type="button" onClick={props.onRemove} className="absolute right-4 top-4 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700">Remove</button>
        </div>
      ) : null}
    </div>
  );
}