/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/contact/ContactForm.tsx
 *
 * Purpose :
 * Public Contact enquiry form.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use client";

import {
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";

import {
  type FormEvent,
  useState,
} from "react";

import {
  createContactSubmission,
} from "@/lib/actions/contact-page";

import type {
  ContactEnquiryType,
} from "@/lib/types/contact-page";

type ContactFormProps = {
  contactPageId: string;
  enquiryTypes: ContactEnquiryType[];
  submitButtonText: string;
  successMessage: string;
};

type FormState = {
  full_name: string;
  email: string;
  phone: string;
  enquiry_type_id: string;
  subject: string;
  message: string;
};

const INITIAL_STATE: FormState = {
  full_name: "",
  email: "",
  phone: "",
  enquiry_type_id: "",
  subject: "",
  message: "",
};

export default function ContactForm({
  contactPageId,
  enquiryTypes,
  submitButtonText,
  successMessage,
}: ContactFormProps) {
  const [form, setForm] =
    useState<FormState>(
      INITIAL_STATE,
    );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  function updateField(
    field: keyof FormState,
    value: string,
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    const selectedEnquiryType =
      enquiryTypes.find(
        (item) =>
          item.id ===
          form.enquiry_type_id,
      );

    const result =
      await createContactSubmission({
        contact_page_id:
          contactPageId,

        enquiry_type_id:
          form.enquiry_type_id ||
          null,

        enquiry_type_label:
          selectedEnquiryType?.label ||
          null,

        full_name:
          form.full_name,

        email:
          form.email,

        phone:
          form.phone ||
          null,

        subject:
          form.subject ||
          null,

        message:
          form.message,

        source_page:
          "/contact",
      });

    if (!result.success) {
      const fieldErrors =
        result.errors
          ? Object.values(
              result.errors,
            )
              .flat()
              .filter(Boolean)
              .join(" ")
          : "";

      setError(
        fieldErrors ||
        result.message,
      );

      setIsSubmitting(false);
      return;
    }

    setForm(
      INITIAL_STATE,
    );

    setSuccess(true);
    setIsSubmitting(false);
  }

  if (success) {
    return (
      <div className="contactFormSuccess">
        <div>
          <CheckCircle2
            size={32}
          />
        </div>

        <h4>
          Enquiry received
        </h4>

        <p>
          {successMessage}
        </p>

        <button
          type="button"
          onClick={() =>
            setSuccess(false)
          }
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      className="contactPublicForm"
      onSubmit={submit}
    >
      {error ? (
        <div className="contactPublicForm__error">
          {error}
        </div>
      ) : null}

      <div className="contactPublicForm__grid">
        <label>
          <span>
            Full Name *
          </span>

          <input
            required
            autoComplete="name"
            value={
              form.full_name
            }
            onChange={(event) =>
              updateField(
                "full_name",
                event.target.value,
              )
            }
          />
        </label>

        <label>
          <span>
            Email Address *
          </span>

          <input
            required
            type="email"
            autoComplete="email"
            value={
              form.email
            }
            onChange={(event) =>
              updateField(
                "email",
                event.target.value,
              )
            }
          />
        </label>

        <label>
          <span>
            Phone Number
          </span>

          <input
            type="tel"
            autoComplete="tel"
            value={
              form.phone
            }
            onChange={(event) =>
              updateField(
                "phone",
                event.target.value,
              )
            }
          />
        </label>

        <label>
          <span>
            Enquiry Type
          </span>

          <select
            value={
              form.enquiry_type_id
            }
            onChange={(event) =>
              updateField(
                "enquiry_type_id",
                event.target.value,
              )
            }
          >
            <option value="">
              Select an option
            </option>

            {enquiryTypes.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.label}
                </option>
              ),
            )}
          </select>
        </label>

        <label className="isFull">
          <span>
            Subject
          </span>

          <input
            value={
              form.subject
            }
            onChange={(event) =>
              updateField(
                "subject",
                event.target.value,
              )
            }
          />
        </label>

        <label className="isFull">
          <span>
            Message *
          </span>

          <textarea
            required
            rows={7}
            value={
              form.message
            }
            onChange={(event) =>
              updateField(
                "message",
                event.target.value,
              )
            }
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={
          isSubmitting
        }
      >
        {isSubmitting ? (
          <Loader2
            size={17}
            className="contactPublicForm__spinner"
          />
        ) : (
          <Send size={17} />
        )}

        {submitButtonText}
      </button>
    </form>
  );
}
