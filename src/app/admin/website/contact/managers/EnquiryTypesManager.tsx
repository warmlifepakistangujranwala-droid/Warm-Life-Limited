"use client";

import {
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createContactEnquiryType,
  deleteContactEnquiryType,
  updateContactEnquiryType,
} from "@/lib/actions/contact-page";

import type {
  ContactEnquiryType,
  CreateContactEnquiryTypeInput,
  UpdateContactEnquiryTypeInput,
} from "@/lib/types/contact-page";

type Props = {
  contactPageId: string;
  initialItems: ContactEnquiryType[];
};

type Draft = Omit<
  CreateContactEnquiryTypeInput,
  "contact_page_id"
>;

const EMPTY: Draft = {
  internal_name: "",
  label: "",
  value: "",
  description: "",
  display_order: 0,
  is_active: true,
  is_published: true,
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toDraft(item: ContactEnquiryType): Draft {
  return {
    internal_name: item.internal_name ?? "",
    label: item.label,
    value: item.value,
    description: item.description ?? "",
    display_order: item.display_order,
    is_active: item.is_active,
    is_published: item.is_published,
  };
}

export default function EnquiryTypesManager({
  contactPageId,
  initialItems,
}: Props) {
  const router = useRouter();

  const [draft, setDraft] =
    useState<Draft>({
      ...EMPTY,
      display_order: initialItems.length,
    });

  const [editing, setEditing] =
    useState<Record<string, Draft>>(
      Object.fromEntries(
        initialItems.map((item) => [
          item.id,
          toDraft(item),
        ]),
      ),
    );

  const [busyId, setBusyId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    setEditing(
      Object.fromEntries(
        initialItems.map((item) => [
          item.id,
          toDraft(item),
        ]),
      ),
    );
  }, [initialItems]);

  async function addItem() {
    setBusyId("new");
    setMessage("");

    const result =
      await createContactEnquiryType({
        contact_page_id: contactPageId,
        ...draft,
        internal_name:
          draft.internal_name?.trim() || null,
        value:
          slugify(draft.value || draft.label),
        description:
          draft.description?.trim() || null,
      });

    if (!result.success) {
      setMessage(result.message);
    } else {
      setDraft({
        ...EMPTY,
        display_order: initialItems.length + 1,
      });
      router.refresh();
    }

    setBusyId(null);
  }

  async function saveItem(id: string) {
    const value = editing[id];
    if (!value) return;

    setBusyId(id);
    setMessage("");

    const payload: UpdateContactEnquiryTypeInput = {
      ...value,
      internal_name:
        value.internal_name?.trim() || null,
      value:
        slugify(value.value || value.label),
      description:
        value.description?.trim() || null,
    };

    const result =
      await updateContactEnquiryType(id, payload);

    if (!result.success) {
      setMessage(result.message);
    } else {
      router.refresh();
    }

    setBusyId(null);
  }

  async function removeItem(id: string) {
    if (!window.confirm("Delete this enquiry type?")) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const result =
      await deleteContactEnquiryType(id);

    if (!result.success) {
      setMessage(result.message);
    } else {
      router.refresh();
    }

    setBusyId(null);
  }

  function Fields({
    value,
    onChange,
  }: {
    value: Draft;
    onChange: (next: Draft) => void;
  }) {
    return (
      <div className="contactManagerFields">
        <label>
          <span>Label</span>
          <input
            value={value.label}
            onChange={(event) =>
              onChange({
                ...value,
                label: event.target.value,
                value:
                  value.value ||
                  slugify(event.target.value),
              })
            }
          />
        </label>

        <label>
          <span>Value / slug</span>
          <input
            value={value.value}
            onChange={(event) =>
              onChange({
                ...value,
                value: slugify(event.target.value),
              })
            }
          />
        </label>

        <label>
          <span>Internal name</span>
          <input
            value={value.internal_name ?? ""}
            onChange={(event) =>
              onChange({
                ...value,
                internal_name: event.target.value,
              })
            }
          />
        </label>

        <label>
          <span>Display order</span>
          <input
            type="number"
            min="0"
            value={value.display_order}
            onChange={(event) =>
              onChange({
                ...value,
                display_order: Number(event.target.value),
              })
            }
          />
        </label>

        <label className="isFull">
          <span>Description</span>
          <textarea
            rows={4}
            value={value.description ?? ""}
            onChange={(event) =>
              onChange({
                ...value,
                description: event.target.value,
              })
            }
          />
        </label>

        <div className="contactManagerToggles">
          <label>
            <input
              type="checkbox"
              checked={value.is_active}
              onChange={(event) =>
                onChange({
                  ...value,
                  is_active: event.target.checked,
                })
              }
            />
            Active
          </label>

          <label>
            <input
              type="checkbox"
              checked={value.is_published}
              onChange={(event) =>
                onChange({
                  ...value,
                  is_published: event.target.checked,
                })
              }
            />
            Published
          </label>
        </div>
      </div>
    );
  }

  return (
    <section className="contactRepeatableManager">
      <header>
        <div>
          <span>Contact form options</span>
          <h2>Enquiry Types Manager</h2>
          <p>
            Control the enquiry options visitors can choose
            from on the public Contact form.
          </p>
        </div>

        <strong>{initialItems.length} types</strong>
      </header>

      {message ? (
        <div className="contactManagerMessage">
          {message}
        </div>
      ) : null}

      <div className="contactManagerCreate">
        <h3>Add Enquiry Type</h3>
        <Fields value={draft} onChange={setDraft} />

        <button
          type="button"
          onClick={addItem}
          disabled={busyId !== null}
        >
          {busyId === "new" ? (
            <Loader2 size={15} className="contactManagerSpin" />
          ) : (
            <Plus size={15} />
          )}
          Add Enquiry Type
        </button>
      </div>

      <div className="contactManagerList">
        {initialItems.map((item) => {
          const value = editing[item.id] ?? toDraft(item);

          return (
            <article className="contactManagerCard" key={item.id}>
              <div className="contactManagerCard__title">
                <div>
                  <span>Enquiry type</span>
                  <h3>{value.label}</h3>
                  <small>{value.value}</small>
                </div>

                <strong>Order {value.display_order}</strong>
              </div>

              <Fields
                value={value}
                onChange={(next) =>
                  setEditing({
                    ...editing,
                    [item.id]: next,
                  })
                }
              />

              <footer>
                <button
                  type="button"
                  className="isSave"
                  onClick={() => saveItem(item.id)}
                  disabled={busyId !== null}
                >
                  {busyId === item.id ? (
                    <Loader2 size={15} className="contactManagerSpin" />
                  ) : (
                    <Save size={15} />
                  )}
                  Save
                </button>

                <button
                  type="button"
                  className="isDelete"
                  onClick={() => removeItem(item.id)}
                  disabled={busyId !== null}
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}
