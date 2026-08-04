/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/about/team/page.tsx
 *
 * Purpose :
 * Manages About page team members.
 *
 * Version : v1.2.0
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import {
  createAboutTeamMember,
  deleteAboutTeamMember,
  getAboutDepartments,
  getAboutPageSettings,
  getAboutTeamMembers,
  updateAboutTeamMember,
} from "@/lib/actions/about-page";

import "./team.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function teamPageUrl(
  type: "success" | "error",
  message: string,
): string {
  const params = new URLSearchParams({
    [type]: message,
  });

  return `/admin/website/about/team?${params.toString()}`;
}

function optionalText(
  formData: FormData,
  name: string,
): string | null {
  const value = String(
    formData.get(name) ?? "",
  ).trim();

  return value || null;
}

function getImageExtension(
  file: File,
): string {
  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase();

  return extension || "jpg";
}

async function removeStoredImage(
  storagePath: string | null,
): Promise<void> {
  if (!storagePath) {
    return;
  }

  const supabase = await createClient();

  await supabase.storage
    .from("website-media")
    .remove([storagePath]);
}

async function saveTeamMemberAction(
  formData: FormData,
) {
  "use server";

  const id = String(
    formData.get("id") ?? "",
  );

  const currentImageUrl =
    optionalText(
      formData,
      "current_image_url",
    );

  const currentStoragePath =
    optionalText(
      formData,
      "current_image_storage_path",
    );

  const photoUrl =
    optionalText(
      formData,
      "image_url",
    );

  const removeImage =
    formData.get("remove_image") === "on";

  const imageFile =
    formData.get("image_file");

  let imageUrl = currentImageUrl;
  let imageStoragePath =
    currentStoragePath;
  let newlyUploadedPath: string | null = null;
  let oldPathToDelete: string | null = null;

  if (removeImage) {
    imageUrl = null;
    imageStoragePath = null;
    oldPathToDelete = currentStoragePath;
  } else if (
    imageFile instanceof File &&
    imageFile.size > 0
  ) {
    if (!imageFile.type.startsWith("image/")) {
      redirect(
        teamPageUrl(
          "error",
          "Please select a valid image file.",
        ),
      );
    }

    if (imageFile.size > 10 * 1024 * 1024) {
      redirect(
        teamPageUrl(
          "error",
          "Team member image must be smaller than 10 MB.",
        ),
      );
    }

    const supabase = await createClient();
    const storagePath =
      `about/team/${crypto.randomUUID()}.${getImageExtension(
        imageFile,
      )}`;

    const { error } =
      await supabase.storage
        .from("website-media")
        .upload(
          storagePath,
          imageFile,
          {
            cacheControl: "3600",
            upsert: false,
            contentType:
              imageFile.type,
          },
        );

    if (error) {
      redirect(
        teamPageUrl(
          "error",
          error.message,
        ),
      );
    }

    const { data } =
      supabase.storage
        .from("website-media")
        .getPublicUrl(storagePath);

    imageUrl = data.publicUrl;
    imageStoragePath = storagePath;
    newlyUploadedPath = storagePath;
    oldPathToDelete = currentStoragePath;
  } else if (photoUrl) {
    imageUrl = photoUrl;
    imageStoragePath = null;

    if (currentStoragePath) {
      oldPathToDelete = currentStoragePath;
    }
  }

  const aboutPageId = String(
    formData.get("about_page_id") ?? "",
  ).trim();

  const payload = {
    department_id: String(
      formData.get("department_id") ?? "",
    ),

    full_name: String(
      formData.get("full_name") ?? "",
    ).trim(),

    job_title: String(
      formData.get("job_title") ?? "",
    ).trim(),

    short_bio:
      optionalText(
        formData,
        "short_bio",
      ) ?? "",

    full_bio:
      optionalText(
        formData,
        "full_bio",
      ) ?? "",

    image_url: imageUrl,

    image_storage_path:
      imageStoragePath,

    image_alt:
      optionalText(
        formData,
        "image_alt",
      ) ?? "",

    email:
      optionalText(
        formData,
        "email",
      ),

    phone:
      optionalText(
        formData,
        "phone",
      ),

    linkedin_url:
      optionalText(
        formData,
        "linkedin_url",
      ),

    qualifications:
      optionalText(
        formData,
        "qualifications",
      ) ?? "",

    experience:
      optionalText(
        formData,
        "experience",
      ) ?? "",

    featured:
      formData.get("featured") === "on",

    display_order: Number(
      formData.get("display_order") ?? 0,
    ),

    is_active:
      formData.get("is_active") === "on",

    is_published:
      formData.get("is_published") === "on",
  };

  if (
    !payload.department_id ||
    !payload.full_name ||
    !payload.job_title
  ) {
    redirect(
      teamPageUrl(
        "error",
        "Department, full name and designation are required.",
      ),
    );
  }

  if (!id && !aboutPageId) {
    redirect(
      teamPageUrl(
        "error",
        "About page settings record could not be found.",
      ),
    );
  }

  const result = id
    ? await updateAboutTeamMember(
        id,
        payload,
      )
    : await createAboutTeamMember(
        aboutPageId,
        payload,
      );

  if (!result.success) {
    if (newlyUploadedPath) {
      await removeStoredImage(
        newlyUploadedPath,
      );
    }

    redirect(
      teamPageUrl(
        "error",
        result.errors.join(" "),
      ),
    );
  }

  if (
    oldPathToDelete &&
    oldPathToDelete !== imageStoragePath
  ) {
    await removeStoredImage(
      oldPathToDelete,
    );
  }

  revalidatePath(
    "/admin/website/about/team",
  );

  revalidatePath("/about");

  redirect(
    teamPageUrl(
      "success",
      id
        ? "Team member updated successfully."
        : "Team member added successfully.",
    ),
  );
}

async function deleteTeamMemberAction(
  formData: FormData,
) {
  "use server";

  const id = String(
    formData.get("id") ?? "",
  );

  const imageStoragePath =
    optionalText(
      formData,
      "image_storage_path",
    );

  if (!id) {
    redirect(
      teamPageUrl(
        "error",
        "Team member ID is missing.",
      ),
    );
  }

  const result =
    await deleteAboutTeamMember(id);

  if (
    result.success &&
    imageStoragePath
  ) {
    await removeStoredImage(
      imageStoragePath,
    );
  }

  revalidatePath(
    "/admin/website/about/team",
  );

  revalidatePath("/about");

  if (!result.success) {
    redirect(
      teamPageUrl(
        "error",
        result.errors.join(" "),
      ),
    );
  }

  redirect(
    teamPageUrl(
      "success",
      "Team member deleted successfully.",
    ),
  );
}

type AboutTeamPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function AboutTeamPage({
  searchParams,
}: AboutTeamPageProps) {
  const [
    settings,
    departments,
    teamMembers,
    resolvedSearchParams,
  ] = await Promise.all([
    getAboutPageSettings(),
    getAboutDepartments(),
    getAboutTeamMembers(),
    searchParams,
  ]);

  return (
    <div className="aboutTeamAdmin">
      <header className="aboutTeamAdmin__header">
        <div>
          <div className="aboutTeamAdmin__breadcrumb">
            <Link href="/admin/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <Link href="/admin/website/about">
              About Page
            </Link>

            <span>/</span>

            <strong>Team Members</strong>
          </div>

          <div className="aboutTeamAdmin__titleRow">
            <div className="aboutTeamAdmin__titleIcon">
              <Users size={25} />
            </div>

            <div>
              <span>
                About team content
              </span>

              <h1>Team Members</h1>

              <p>
                Add team members and assign each
                person to the correct department.
                Only department, name and
                designation are required.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/website/about"
          className="aboutTeamAdmin__back"
        >
          <ArrowLeft size={16} />
          About Manager
        </Link>
      </header>

      {resolvedSearchParams.success ? (
        <div className="aboutTeamNotice isSuccess">
          {resolvedSearchParams.success}
        </div>
      ) : null}

      {resolvedSearchParams.error ? (
        <div className="aboutTeamNotice isError">
          {resolvedSearchParams.error}
        </div>
      ) : null}

      <section
        className="aboutTeamCard"
        id="add-team-member"
      >
        <div className="aboutTeamCard__heading">
          <div>
            <span>Add team member</span>
            <h2>New team member</h2>
          </div>
        </div>

        <form
          action={saveTeamMemberAction}
          className="aboutTeamForm"
        >
          <input
            type="hidden"
            name="about_page_id"
            value={settings?.id ?? ""}
          />
          <label>
            <span>Department *</span>

            <select
              name="department_id"
              required
              defaultValue=""
            >
              <option
                value=""
                disabled
              >
                Select department
              </option>

              {departments.map(
                (department) => (
                  <option
                    key={department.id}
                    value={department.id}
                  >
                    {department.name}
                  </option>
                ),
              )}
            </select>
          </label>

          <label>
            <span>Full name *</span>

            <input
              type="text"
              name="full_name"
              required
            />
          </label>

          <label>
            <span>
              Designation / Job title *
            </span>

            <input
              type="text"
              name="job_title"
              required
            />
          </label>

          <div className="aboutTeamPhotoField">
            <span>Team member photo</span>

            <label className="aboutTeamPhotoUpload">
              <ImagePlus size={18} />
              Choose photo from computer

              <input
                type="file"
                name="image_file"
                accept="image/*"
              />
            </label>

            <small>
              JPG, PNG or WebP. Maximum 10 MB.
            </small>
          </div>

          <label>
            <span>Photo URL (optional)</span>

            <input
              type="url"
              name="image_url"
              placeholder="https://..."
            />
          </label>

          <label className="aboutTeamForm__wide">
            <span>Image alt text</span>

            <input
              type="text"
              name="image_alt"
            />
          </label>

          <label className="aboutTeamForm__wide">
            <span>Short bio</span>

            <textarea
              name="short_bio"
              rows={4}
            />
          </label>

          <label className="aboutTeamForm__wide">
            <span>Full bio</span>

            <textarea
              name="full_bio"
              rows={6}
            />
          </label>

          <label>
            <span>Email</span>

            <input
              type="email"
              name="email"
            />
          </label>

          <label>
            <span>Phone</span>

            <input
              type="text"
              name="phone"
            />
          </label>

          <label>
            <span>LinkedIn URL</span>

            <input
              type="url"
              name="linkedin_url"
            />
          </label>

          <label>
            <span>Display order</span>

            <input
              type="number"
              name="display_order"
              min="0"
              defaultValue="0"
            />
          </label>

          <label className="aboutTeamForm__wide">
            <span>Qualifications</span>

            <textarea
              name="qualifications"
              rows={4}
            />
          </label>

          <label className="aboutTeamForm__wide">
            <span>Experience</span>

            <textarea
              name="experience"
              rows={4}
            />
          </label>

          <label className="aboutTeamToggle">
            <input
              type="checkbox"
              name="featured"
            />
            <span>Featured</span>
          </label>

          <label className="aboutTeamToggle">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked
            />
            <span>Active</span>
          </label>

          <label className="aboutTeamToggle">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked
            />
            <span>Published</span>
          </label>

          <button type="submit">
            <Plus size={16} />
            Add Team Member
          </button>
        </form>
      </section>

      <section className="aboutTeamList">
        {teamMembers.length === 0 ? (
          <div className="aboutTeamEmpty">
            No team members added yet.
          </div>
        ) : (
          teamMembers.map((member) => (
            <article
              className="aboutTeamCard"
              key={member.id}
            >
              <div className="aboutTeamCard__heading">
                <div>
                  <span>
                    {
                      member.department
                        ?.name ??
                      "No department"
                    }
                  </span>

                  <h2>
                    {member.full_name}
                  </h2>

                  <p>
                    {member.job_title}
                  </p>
                </div>

                <form
                  action={
                    deleteTeamMemberAction
                  }
                >
                  <input
                    type="hidden"
                    name="id"
                    value={member.id}
                  />

                  <input
                    type="hidden"
                    name="image_storage_path"
                    value={
                      member.image_storage_path ??
                      ""
                    }
                  />

                  <button
                    type="submit"
                    className="aboutTeamDelete"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </form>
              </div>

              <form
                action={saveTeamMemberAction}
                className="aboutTeamForm"
              >
                <input
                  type="hidden"
                  name="id"
                  value={member.id}
                />

                <input
                  type="hidden"
                  name="current_image_url"
                  value={member.image_url ?? ""}
                />

                <input
                  type="hidden"
                  name="current_image_storage_path"
                  value={
                    member.image_storage_path ??
                    ""
                  }
                />

                <label>
                  <span>Department *</span>

                  <select
                    name="department_id"
                    required
                    defaultValue={
                      member.department_id ??
                      ""
                    }
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select department
                    </option>

                    {departments.map(
                      (department) => (
                        <option
                          key={department.id}
                          value={department.id}
                        >
                          {department.name}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label>
                  <span>Full name *</span>

                  <input
                    type="text"
                    name="full_name"
                    required
                    defaultValue={
                      member.full_name
                    }
                  />
                </label>

                <label>
                  <span>
                    Designation / Job title *
                  </span>

                  <input
                    type="text"
                    name="job_title"
                    required
                    defaultValue={
                      member.job_title
                    }
                  />
                </label>

                <div className="aboutTeamPhotoField">
                  <span>Team member photo</span>

                  {member.image_url ? (
                    <div className="aboutTeamPhotoPreview">
                      <img
                        src={member.image_url}
                        alt={
                          member.image_alt ||
                          member.full_name
                        }
                      />
                    </div>
                  ) : null}

                  <label className="aboutTeamPhotoUpload">
                    <ImagePlus size={18} />
                    {member.image_url
                      ? "Replace photo"
                      : "Choose photo from computer"}

                    <input
                      type="file"
                      name="image_file"
                      accept="image/*"
                    />
                  </label>

                  <label className="aboutTeamRemovePhoto">
                    <input
                      type="checkbox"
                      name="remove_image"
                    />
                    Remove existing photo
                  </label>
                </div>

                <label>
                  <span>Photo URL (optional)</span>

                  <input
                    type="url"
                    name="image_url"
                    defaultValue={
                      member.image_storage_path
                        ? ""
                        : member.image_url ?? ""
                    }
                  />
                </label>

                <label className="aboutTeamForm__wide">
                  <span>Image alt text</span>

                  <input
                    type="text"
                    name="image_alt"
                    defaultValue={
                      member.image_alt
                    }
                  />
                </label>

                <label className="aboutTeamForm__wide">
                  <span>Short bio</span>

                  <textarea
                    name="short_bio"
                    rows={4}
                    defaultValue={
                      member.short_bio
                    }
                  />
                </label>

                <label className="aboutTeamForm__wide">
                  <span>Full bio</span>

                  <textarea
                    name="full_bio"
                    rows={6}
                    defaultValue={
                      member.full_bio
                    }
                  />
                </label>

                <label>
                  <span>Email</span>

                  <input
                    type="email"
                    name="email"
                    defaultValue={
                      member.email ??
                      ""
                    }
                  />
                </label>

                <label>
                  <span>Phone</span>

                  <input
                    type="text"
                    name="phone"
                    defaultValue={
                      member.phone ??
                      ""
                    }
                  />
                </label>

                <label>
                  <span>LinkedIn URL</span>

                  <input
                    type="url"
                    name="linkedin_url"
                    defaultValue={
                      member.linkedin_url ??
                      ""
                    }
                  />
                </label>

                <label>
                  <span>Display order</span>

                  <input
                    type="number"
                    name="display_order"
                    min="0"
                    defaultValue={
                      member.display_order
                    }
                  />
                </label>

                <label className="aboutTeamForm__wide">
                  <span>Qualifications</span>

                  <textarea
                    name="qualifications"
                    rows={4}
                    defaultValue={
                      member.qualifications
                    }
                  />
                </label>

                <label className="aboutTeamForm__wide">
                  <span>Experience</span>

                  <textarea
                    name="experience"
                    rows={4}
                    defaultValue={
                      member.experience
                    }
                  />
                </label>

                <label className="aboutTeamToggle">
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={
                      member.featured
                    }
                  />
                  <span>Featured</span>
                </label>

                <label className="aboutTeamToggle">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={
                      member.is_active
                    }
                  />
                  <span>Active</span>
                </label>

                <label className="aboutTeamToggle">
                  <input
                    type="checkbox"
                    name="is_published"
                    defaultChecked={
                      member.is_published
                    }
                  />
                  <span>Published</span>
                </label>

                <button type="submit">
                  Save Changes
                </button>
              </form>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
