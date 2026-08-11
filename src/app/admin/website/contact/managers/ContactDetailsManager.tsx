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
  createContactPageDetail,
  deleteContactPageDetail,
  updateContactPageDetail,
} from "@/lib/actions/contact-page";

import type {
  ContactDetailType,
  ContactPageDetail,
  CreateContactPageDetailInput,
  UpdateContactPageDetailInput,
} from "@/lib/types/contact-page";

type Props = {
  contactPageId: string;
  initialItems: ContactPageDetail[];
};

type Draft = Omit<
  CreateContactPageDetailInput,
  "contact_page_id"
>;

const EMPTY: Draft = {
  internal_name: "",
  detail_type: "phone",
  icon_name: "",
  label: "",
  value: "",
  link: "",
  open_in_new_tab: false,
  display_order: 0,
  is_active: true,
  is_published: true,
};

function toDraft(item: ContactPageDetail): Draft {
  return {
    internal_name: item.internal_name ?? "",
    detail_type: item.detail_type,
    icon_name: item.icon_name ?? "",
    label: item.label,
    value: item.value,
    link: item.link ?? "",
    open_in_new_tab: item.open_in_new_tab,
    display_order: item.display_order,
    is_active: item.is_active,
    is_published: item.is_published,
  };
}

export default function ContactDetailsManager({
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
      await createContactPageDetail({
        contact_page_id: contactPageId,
        ...draft,
        internal_name:
          draft.internal_name?.trim() || null,
        icon_name:
          draft.icon_name?.trim() || null,
        link:
          draft.link?.trim() || null,
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

    const payload: UpdateContactPageDetailInput = {
      ...value,
      internal_name:
        value.internal_name?.trim() || null,
      icon_name:
        value.icon_name?.trim() || null,
      link:
        value.link?.trim() || null,
    };

    const result =
      await updateContactPageDetail(id, payload);

    if (!result.success) {
      setMessage(result.message);
    } else {
      router.refresh();
    }

    setBusyId(null);
  }

  async function removeItem(id: string) {
    if (!window.confirm("Delete this Contact detail?")) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const result =
      await deleteContactPageDetail(id);

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
          <span>Type</span>
          <select
            value={value.detail_type}
            onChange={(event) =>
              onChange({
                ...value,
                detail_type:
                  event.target.value as ContactDetailType,
              })
            }
          >
            <option value="phone">Phone</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
            <option value="working_hours">Working Hours</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="custom">Custom</option>
          </select>
        </label>

        <label>
          <span>Label</span>
          <input
            value={value.label}
            onChange={(event) =>
              onChange({
                ...value,
                label: event.target.value,
              })
            }
          />
        </label>

        <label className="isFull">
          <span>Value</span>
          <input
            value={value.value}
            onChange={(event) =>
              onChange({
                ...value,
                value: event.target.value,
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
          <span>Icon name</span>
          <input
            placeholder="Phone, Mail, MapPin..."
            value={value.icon_name ?? ""}
            onChange={(event) =>
              onChange({
                ...value,
                icon_name: event.target.value,
              })
            }
          />
        </label>

        <label className="isFull">
          <span>Link</span>
          <input
            placeholder="tel:, mailto:, https://..."
            value={value.link ?? ""}
            onChange={(event) =>
              onChange({
                ...value,
                link: event.target.value,
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

        <div className="contactManagerToggles">
          <label>
            <input
              type="checkbox"
              checked={value.open_in_new_tab}
              onChange={(event) =>
                onChange({
                  ...value,
                  open_in_new_tab: event.target.checked,
                })
              }
            />
            New tab
          </label>

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
          <span>Contact information</span>
          <h2>Contact Details Manager</h2>
          <p>
            Manage phone numbers, email addresses, location,
            working hours, WhatsApp and custom contact cards.
          </p>
        </div>

        <strong>{initialItems.length} items</strong>
      </header>

      {message ? (
        <div className="contactManagerMessage">
          {message}
        </div>
      ) : null}

      <div className="contactManagerCreate">
        <h3>Add Contact Detail</h3>
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
          Add Contact Detail
        </button>
      </div>

      <div className="contactManagerList">
        {initialItems.map((item) => {
          const value = editing[item.id] ?? toDraft(item);

          return (
            <article className="contactManagerCard" key={item.id}>
              <div className="contactManagerCard__title">
                <div>
                  <span>{value.detail_type.replace("_", " ")}</span>
                  <h3>{value.label || "Untitled detail"}</h3>
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
