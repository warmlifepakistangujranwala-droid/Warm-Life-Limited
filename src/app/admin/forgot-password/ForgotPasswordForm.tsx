/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/forgot-password/ForgotPasswordForm.tsx
 *
 * Purpose :
 * Sends a secure Supabase password recovery email for the
 * Warm Life CMS administrator account.
 *
 * Version : v0.2.0
 * ============================================================
 */

"use client";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Send,
} from "lucide-react";

import {
  type FormEvent,
  useMemo,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


type Message = {
  type:
    | "success"
    | "error";

  text: string;
} | null;


/* ============================================================
   COMPONENT
   ============================================================ */

export default function ForgotPasswordForm() {
  const supabase =
    useMemo(
      () =>
        createClient(),
      [],
    );


  const [
    email,
    setEmail,
  ] =
    useState("");


  const [
    isSending,
    setIsSending,
  ] =
    useState(false);


  const [
    message,
    setMessage,
  ] =
    useState<Message>(
      null,
    );


  /* ==========================================================
     SUBMIT
     ========================================================== */

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setMessage(
      null,
    );


    const cleanedEmail =
      email
        .trim()
        .toLowerCase();


    if (
      !cleanedEmail
    ) {
      setMessage({
        type:
          "error",

        text:
          "Please enter your administrator email address.",
      });

      return;
    }


    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanedEmail,
      )
    ) {
      setMessage({
        type:
          "error",

        text:
          "Please enter a valid email address.",
      });

      return;
    }


    setIsSending(
      true,
    );


    try {
      const redirectTo =
        `${window.location.origin}/auth/callback?next=/admin/reset-password`;


      const {
        error,
      } =
        await supabase.auth
          .resetPasswordForEmail(
            cleanedEmail,
            {
              redirectTo,
            },
          );


      if (
        error
      ) {
        throw new Error(
          error.message,
        );
      }


      setEmail(
        "",
      );


      setMessage({
        type:
          "success",

        text:
          "If this email is connected to a Warm Life CMS account, a secure password reset link has been sent. Please check your inbox and spam folder.",
      });
    } catch (
      error
    ) {
      setMessage({
        type:
          "error",

        text:
          error instanceof Error
            ? error.message
            : "Unable to send the password reset email.",
      });
    } finally {
      setIsSending(
        false,
      );
    }
  }


  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div className="adminForgotFormWrap">

      {/* ======================================================
          MESSAGE
          ====================================================== */}

      {message ? (
        <div
          className={`adminForgotForm__message ${
            message.type ===
            "success"
              ? "isSuccess"
              : "isError"
          }`}
        >
          {message.type ===
          "success" ? (
            <CheckCircle2
              size={18}
            />
          ) : (
            <AlertCircle
              size={18}
            />
          )}

          <span>
            {
              message.text
            }
          </span>
        </div>
      ) : null}


      {/* ======================================================
          FORM
          ====================================================== */}

      <form
        className="adminForgotForm"
        onSubmit={
          handleSubmit
        }
      >

        <label className="adminForgotForm__field">
          <span>
            Administrator Email
          </span>

          <div className="adminForgotForm__input">
            <Mail
              size={18}
            />

            <input
              type="email"
              autoComplete="email"
              value={
                email
              }
              onChange={(
                event,
              ) => {
                setEmail(
                  event.target
                    .value,
                );

                setMessage(
                  null,
                );
              }}
              placeholder="admin@example.com"
              required
            />
          </div>
        </label>


        <button
          type="submit"
          className="adminForgotForm__submit"
          disabled={
            isSending
          }
        >
          {isSending ? (
            <Loader2
              size={17}
              className="adminForgotForm__spinner"
            />
          ) : (
            <Send
              size={17}
            />
          )}

          {isSending
            ? "Sending Reset Link..."
            : "Send Password Reset Link"}
        </button>

      </form>
    </div>
  );
}