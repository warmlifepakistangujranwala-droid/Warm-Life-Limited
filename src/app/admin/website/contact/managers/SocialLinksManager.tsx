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
  createContactSocialLink,
  deleteContactSocialLink,
  updateContactSocialLink,
} from "@/lib/actions/contact-page";

import type {
  ContactPageSocialLink,
  CreateContactPageSocialLinkInput,
  UpdateContactPageSocialLinkInput,
} from "@/lib/types/contact-page";

type Props = {
  contactPageId: string;
  initialItems: ContactPageSocialLink[];
};

type Draft = Omit<
  CreateContactPageSocialLinkInput,
  "contact_page_id"
>;

const EMPTY: Draft = {
  platform: "",
  label: "",
  icon_name: "",
  url: "",
  open_in_new_tab: true,
  display_order: 0,
  is_active: true,
  is_published: true,
};

function toDraft(item: ContactPageSocialLink): Draft {
  return {
    platform: item.platform,
    label: item.label ?? "",
    icon_name: item.icon_name ?? "",
    url: item.url,
    open_in_new_tab: item.open_in_new_tab,
    display_order: item.display_order,
    is_active: item.is_active,
    is_published: item.is_published,
  };
}

export default function SocialLinksManager({
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
      await createContactSocialLink({
        contact_page_id: contactPageId,
        ...draft,
        label:
          draft.label?.trim() || null,
        icon_name:
          draft.icon_name?.trim() || null,
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

    const payload: UpdateContactPageSocialLinkInput = {
      ...value,
      label:
        value.label?.trim() || null,
      icon_name:
        value.icon_name?.trim() || null,
    };

    const result =
      await updateContactSocialLink(id, payload);

    if (!result.success) {
      setMessage(result.message);
    } else {
      router.refresh();
    }

    setBusyId(null);
  }

  async function removeItem(id: string) {
    if (!window.confirm("Delete this social link?")) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const result =
      await deleteContactSocialLink(id);

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
          <span>Platform</span>
          <input
            placeholder="Facebook, Instagram, LinkedIn..."
            value={value.platform}
            onChange={(event) =>
              onChange({
                ...value,
                platform: event.target.value,
              })
            }
          />
        </label>

        <label>
          <span>Label</span>
          <input
            value={value.label ?? ""}
            onChange={(event) =>
              onChange({
                ...value,
                label: event.target.value,
              })
            }
          />
        </label>

        <label>
          <span>Icon name</span>
          <input
            placeholder="Facebook, Instagram..."
            value={value.icon_name ?? ""}
            onChange={(event) =>
              onChange({
                ...value,
                icon_name: event.target.value,
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
          <span>URL</span>
          <input
            type="url"
            value={value.url}
            onChange={(event) =>
              onChange({
                ...value,
                url: event.target.value,
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
          <span>Social channels</span>
          <h2>Social Links Manager</h2>
          <p>
            Add public social channels to the Contact page.
          </p>
        </div>

        <strong>{initialItems.length} links</strong>
      </header>

      {message ? (
        <div className="contactManagerMessage">
          {message}
        </div>
      ) : null}

      <div className="contactManagerCreate">
        <h3>Add Social Link</h3>
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
          Add Social Link
        </button>
      </div>

      <div className="contactManagerList">
        {initialItems.map((item) => {
          const value = editing[item.id] ?? toDraft(item);

          return (
            <article className="contactManagerCard" key={item.id}>
              <div className="contactManagerCard__title">
                <div>
                  <span>Social link</span>
                  <h3>{value.platform}</h3>
                  <small>{value.url}</small>
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
