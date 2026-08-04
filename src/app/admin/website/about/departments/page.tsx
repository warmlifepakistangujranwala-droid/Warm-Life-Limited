/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/website/about/departments/page.tsx
 *
 * Purpose :
 * Manages About page team departments.
 *
 * Version : v1.0.0
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Plus,
  Trash2,
} from "lucide-react";
import { revalidatePath } from "next/cache";

import {
  createAboutDepartment,
  deleteAboutDepartment,
  getAboutDepartments,
  updateAboutDepartment,
} from "@/lib/actions/about-page";

import "./departments.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function saveDepartmentAction(
  formData: FormData,
) {
  "use server";

  const id = String(
    formData.get("id") ?? "",
  );

  const payload = {
    name: String(
      formData.get("name") ?? "",
    ).trim(),

    slug: String(
      formData.get("slug") ?? "",
    ).trim(),

    description: String(
      formData.get("description") ?? "",
    ).trim(),

    icon_name: String(
      formData.get("icon_name") ?? "Users",
    ).trim(),

    display_order: Number(
      formData.get("display_order") ?? 0,
    ),

    is_active:
      formData.get("is_active") === "on",

    is_published:
      formData.get("is_published") === "on",
  };

  if (!payload.name || !payload.slug) {
    return;
  }

  if (id) {
    await updateAboutDepartment(
      id,
      payload,
    );
  } else {
    await createAboutDepartment(
      payload,
    );
  }

  revalidatePath(
    "/admin/website/about/departments",
  );

  revalidatePath("/about");
}

async function deleteDepartmentAction(
  formData: FormData,
) {
  "use server";

  const id = String(
    formData.get("id") ?? "",
  );

  if (!id) {
    return;
  }

  await deleteAboutDepartment(id);

  revalidatePath(
    "/admin/website/about/departments",
  );

  revalidatePath("/about");
}

export default async function AboutDepartmentsPage() {
  const departments =
    await getAboutDepartments();

  return (
    <div className="aboutDepartmentsAdmin">
      <header className="aboutDepartmentsAdmin__header">
        <div>
          <div className="aboutDepartmentsAdmin__breadcrumb">
            <Link href="/admin/dashboard">
              Dashboard
            </Link>

            <span>/</span>

            <Link href="/admin/website/about">
              About Page
            </Link>

            <span>/</span>

            <strong>Departments</strong>
          </div>

          <div className="aboutDepartmentsAdmin__titleRow">
            <div className="aboutDepartmentsAdmin__titleIcon">
              <Building2 size={25} />
            </div>

            <div>
              <span>
                About team structure
              </span>

              <h1>Departments</h1>

              <p>
                Create and manage unlimited
                departments for the About page
                team section.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/website/about"
          className="aboutDepartmentsAdmin__back"
        >
          <ArrowLeft size={16} />
          About Manager
        </Link>
      </header>

      <section
        className="aboutDepartmentsCard"
        id="add-department"
      >
        <div className="aboutDepartmentsCard__heading">
          <div>
            <span>Add department</span>
            <h2>New department</h2>
          </div>
        </div>

        <form
          action={saveDepartmentAction}
          className="aboutDepartmentsForm"
        >
          <label>
            <span>Name *</span>
            <input
              type="text"
              name="name"
              required
            />
          </label>

          <label>
            <span>Slug *</span>
            <input
              type="text"
              name="slug"
              required
              placeholder="leadership"
            />
          </label>

          <label>
            <span>Icon</span>
            <select
              name="icon_name"
              defaultValue="Users"
            >
              <option value="Users">
                Users
              </option>

              <option value="BriefcaseBusiness">
                Briefcase
              </option>

              <option value="ClipboardCheck">
                Clipboard
              </option>

              <option value="Gauge">
                Gauge
              </option>

              <option value="Settings">
                Settings
              </option>

              <option value="Headphones">
                Headphones
              </option>
            </select>
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

          <label className="aboutDepartmentsForm__wide">
            <span>Description</span>
            <textarea
              name="description"
              rows={4}
            />
          </label>

          <label className="aboutDepartmentsToggle">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked
            />
            <span>Active</span>
          </label>

          <label className="aboutDepartmentsToggle">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked
            />
            <span>Published</span>
          </label>

          <button type="submit">
            <Plus size={16} />
            Add Department
          </button>
        </form>
      </section>

      <section className="aboutDepartmentsList">
        {departments.length === 0 ? (
          <div className="aboutDepartmentsEmpty">
            No departments added yet.
          </div>
        ) : (
          departments.map((department) => (
            <article
              className="aboutDepartmentsCard"
              key={department.id}
            >
              <div className="aboutDepartmentsCard__heading">
                <div>
                  <span>
                    Department
                  </span>

                  <h2>
                    {department.name}
                  </h2>
                </div>

                <form
                  action={
                    deleteDepartmentAction
                  }
                >
                  <input
                    type="hidden"
                    name="id"
                    value={department.id}
                  />

                  <button
                    type="submit"
                    className="aboutDepartmentsDelete"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </form>
              </div>

              <form
                action={saveDepartmentAction}
                className="aboutDepartmentsForm"
              >
                <input
                  type="hidden"
                  name="id"
                  value={department.id}
                />

                <label>
                  <span>Name *</span>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={
                      department.name
                    }
                  />
                </label>

                <label>
                  <span>Slug *</span>
                  <input
                    type="text"
                    name="slug"
                    required
                    defaultValue={
                      department.slug
                    }
                  />
                </label>

                <label>
                  <span>Icon</span>
                  <select
                    name="icon_name"
                    defaultValue={
                      department.icon_name
                    }
                  >
                    <option value="Users">
                      Users
                    </option>

                    <option value="BriefcaseBusiness">
                      Briefcase
                    </option>

                    <option value="ClipboardCheck">
                      Clipboard
                    </option>

                    <option value="Gauge">
                      Gauge
                    </option>

                    <option value="Settings">
                      Settings
                    </option>

                    <option value="Headphones">
                      Headphones
                    </option>
                  </select>
                </label>

                <label>
                  <span>Display order</span>
                  <input
                    type="number"
                    name="display_order"
                    min="0"
                    defaultValue={
                      department.display_order
                    }
                  />
                </label>

                <label className="aboutDepartmentsForm__wide">
                  <span>Description</span>
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={
                      department.description
                    }
                  />
                </label>

                <label className="aboutDepartmentsToggle">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={
                      department.is_active
                    }
                  />
                  <span>Active</span>
                </label>

                <label className="aboutDepartmentsToggle">
                  <input
                    type="checkbox"
                    name="is_published"
                    defaultChecked={
                      department.is_published
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
