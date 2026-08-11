/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/reset-password/ResetPasswordForm.tsx
 *
 * Purpose :
 * Allows an administrator with a valid Supabase recovery
 * session to securely set a new CMS password.
 *
 * Version : v0.1.0
 * ============================================================
 */

"use client";

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Save,
} from "lucide-react";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

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
   PASSWORD VALIDATION
   ============================================================ */

function validatePassword(
  password: string,
): string | null {
  if (
    password.length < 8
  ) {
    return "Password must contain at least 8 characters.";
  }

  if (
    !/[A-Z]/.test(
      password,
    )
  ) {
    return "Password must contain at least one uppercase letter.";
  }

  if (
    !/[a-z]/.test(
      password,
    )
  ) {
    return "Password must contain at least one lowercase letter.";
  }

  if (
    !/[0-9]/.test(
      password,
    )
  ) {
    return "Password must contain at least one number.";
  }

  if (
    !/[^A-Za-z0-9]/.test(
      password,
    )
  ) {
    return "Password must contain at least one special character.";
  }

  return null;
}


/* ============================================================
   COMPONENT
   ============================================================ */

export default function ResetPasswordForm() {
  const router =
    useRouter();

  const supabase =
    useMemo(
      () =>
        createClient(),
      [],
    );


  const [
    newPassword,
    setNewPassword,
  ] =
    useState("");


  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState("");


  const [
    showNewPassword,
    setShowNewPassword,
  ] =
    useState(false);


  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] =
    useState(false);


  const [
    isCheckingSession,
    setIsCheckingSession,
  ] =
    useState(true);


  const [
    hasRecoverySession,
    setHasRecoverySession,
  ] =
    useState(false);


  const [
    isSaving,
    setIsSaving,
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
     PASSWORD STRENGTH
     ========================================================== */

  const passwordChecks =
    useMemo(
      () => ({
        length:
          newPassword.length >=
          8,

        uppercase:
          /[A-Z]/.test(
            newPassword,
          ),

        lowercase:
          /[a-z]/.test(
            newPassword,
          ),

        number:
          /[0-9]/.test(
            newPassword,
          ),

        special:
          /[^A-Za-z0-9]/.test(
            newPassword,
          ),
      }),
      [
        newPassword,
      ],
    );


  const allChecksPassed =
    Object.values(
      passwordChecks,
    ).every(Boolean);


  /* ==========================================================
     CHECK RECOVERY SESSION
     ========================================================== */

  useEffect(() => {
    let isMounted =
      true;

    async function checkSession() {
      try {
        const {
          data: {
            session,
          },
        } =
          await supabase.auth
            .getSession();

        if (!isMounted) {
          return;
        }

        if (session) {
          setHasRecoverySession(
            true,
          );
        } else {
          setHasRecoverySession(
            false,
          );

          setMessage({
            type:
              "error",

            text:
              "This password recovery session is invalid or has expired. Please request a new reset link.",
          });
        }
      } catch {
        if (!isMounted) {
          return;
        }

        setHasRecoverySession(
          false,
        );

        setMessage({
          type:
            "error",

          text:
            "Unable to verify the password recovery session.",
        });
      } finally {
        if (
          isMounted
        ) {
          setIsCheckingSession(
            false,
          );
        }
      }
    }

    void checkSession();

    return () => {
      isMounted =
        false;
    };
  }, [
    supabase,
  ]);


  /* ==========================================================
     UPDATE PASSWORD
     ========================================================== */

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setMessage(
      null,
    );


    if (
      !hasRecoverySession
    ) {
      setMessage({
        type:
          "error",

        text:
          "Your password recovery session is not valid. Please request a new reset link.",
      });

      return;
    }


    const validationError =
      validatePassword(
        newPassword,
      );


    if (
      validationError
    ) {
      setMessage({
        type:
          "error",

        text:
          validationError,
      });

      return;
    }


    if (
      newPassword !==
      confirmPassword
    ) {
      setMessage({
        type:
          "error",

        text:
          "New password and confirmation password do not match.",
      });

      return;
    }


    setIsSaving(
      true,
    );


    try {
      const {
        error,
      } =
        await supabase.auth
          .updateUser({
            password:
              newPassword,
          });


      if (
        error
      ) {
        throw new Error(
          error.message,
        );
      }


      setNewPassword(
        "",
      );

      setConfirmPassword(
        "",
      );


      setMessage({
        type:
          "success",

        text:
          "Your administrator password has been reset successfully. Redirecting to the Admin Login page...",
      });


      await supabase.auth
        .signOut();


      window.setTimeout(
        () => {
          router.replace(
            "/admin/login",
          );

          router.refresh();
        },
        1800,
      );
    } catch (
      error
    ) {
      setMessage({
        type:
          "error",

        text:
          error instanceof Error
            ? error.message
            : "Unable to reset the administrator password.",
      });
    } finally {
      setIsSaving(
        false,
      );
    }
  }


  /* ==========================================================
     LOADING SESSION
     ========================================================== */

  if (
    isCheckingSession
  ) {
    return (
      <div className="adminResetSession">
        <Loader2
          size={22}
          className="adminResetForm__spinner"
        />

        <span>
          Verifying secure recovery session...
        </span>
      </div>
    );
  }


  /* ==========================================================
     INVALID SESSION
     ========================================================== */

  if (
    !hasRecoverySession
  ) {
    return (
      <div className="adminResetFormWrap">

        {message ? (
          <div className="adminResetForm__message isError">
            <AlertCircle
              size={18}
            />

            <span>
              {
                message.text
              }
            </span>
          </div>
        ) : null}


        <a
          href="/admin/forgot-password"
          className="adminResetForm__requestAgain"
        >
          Request a New Reset Link
        </a>
      </div>
    );
  }


  /* ==========================================================
     FORM
     ========================================================== */

  return (
    <div className="adminResetFormWrap">

      {message ? (
        <div
          className={`adminResetForm__message ${
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


      <form
        className="adminResetForm"
        onSubmit={
          handleSubmit
        }
      >

        {/* ==================================================
            NEW PASSWORD
            ================================================== */}

        <label className="adminResetForm__field">
          <span>
            New Password
          </span>

          <div className="adminResetForm__input">
            <KeyRound
              size={17}
            />

            <input
              type={
                showNewPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              value={
                newPassword
              }
              onChange={(
                event,
              ) => {
                setNewPassword(
                  event.target
                    .value,
                );

                setMessage(
                  null,
                );
              }}
              placeholder="Enter a new password"
              required
            />

            <button
              type="button"
              aria-label={
                showNewPassword
                  ? "Hide password"
                  : "Show password"
              }
              onClick={() =>
                setShowNewPassword(
                  (
                    current,
                  ) =>
                    !current,
                )
              }
            >
              {showNewPassword ? (
                <EyeOff
                  size={17}
                />
              ) : (
                <Eye
                  size={17}
                />
              )}
            </button>
          </div>
        </label>


        {/* ==================================================
            CONFIRM PASSWORD
            ================================================== */}

        <label className="adminResetForm__field">
          <span>
            Confirm New Password
          </span>

          <div className="adminResetForm__input">
            <KeyRound
              size={17}
            />

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              value={
                confirmPassword
              }
              onChange={(
                event,
              ) => {
                setConfirmPassword(
                  event.target
                    .value,
                );

                setMessage(
                  null,
                );
              }}
              placeholder="Confirm your new password"
              required
            />

            <button
              type="button"
              aria-label={
                showConfirmPassword
                  ? "Hide password"
                  : "Show password"
              }
              onClick={() =>
                setShowConfirmPassword(
                  (
                    current,
                  ) =>
                    !current,
                )
              }
            >
              {showConfirmPassword ? (
                <EyeOff
                  size={17}
                />
              ) : (
                <Eye
                  size={17}
                />
              )}
            </button>
          </div>
        </label>


        {/* ==================================================
            PASSWORD RULES
            ================================================== */}

        <div className="adminResetPasswordRules">
          <strong>
            Password requirements
          </strong>

          <div className="adminResetPasswordRules__grid">

            <span
              className={
                passwordChecks.length
                  ? "isValid"
                  : undefined
              }
            >
              <CheckCircle2
                size={14}
              />

              At least 8 characters
            </span>

            <span
              className={
                passwordChecks.uppercase
                  ? "isValid"
                  : undefined
              }
            >
              <CheckCircle2
                size={14}
              />

              One uppercase letter
            </span>

            <span
              className={
                passwordChecks.lowercase
                  ? "isValid"
                  : undefined
              }
            >
              <CheckCircle2
                size={14}
              />

              One lowercase letter
            </span>

            <span
              className={
                passwordChecks.number
                  ? "isValid"
                  : undefined
              }
            >
              <CheckCircle2
                size={14}
              />

              One number
            </span>

            <span
              className={
                passwordChecks.special
                  ? "isValid"
                  : undefined
              }
            >
              <CheckCircle2
                size={14}
              />

              One special character
            </span>

          </div>
        </div>


        {/* ==================================================
            MATCH STATUS
            ================================================== */}

        {confirmPassword ? (
          <div
            className={`adminResetPasswordMatch ${
              newPassword ===
              confirmPassword
                ? "isValid"
                : "isInvalid"
            }`}
          >
            {newPassword ===
            confirmPassword ? (
              <CheckCircle2
                size={15}
              />
            ) : (
              <AlertCircle
                size={15}
              />
            )}

            <span>
              {newPassword ===
              confirmPassword
                ? "Passwords match."
                : "Passwords do not match."}
            </span>
          </div>
        ) : null}


        {/* ==================================================
            SAVE
            ================================================== */}

        <button
          type="submit"
          className="adminResetForm__submit"
          disabled={
            isSaving ||
            !allChecksPassed ||
            newPassword !==
              confirmPassword
          }
        >
          {isSaving ? (
            <Loader2
              size={17}
              className="adminResetForm__spinner"
            />
          ) : (
            <Save
              size={17}
            />
          )}

          {isSaving
            ? "Resetting Password..."
            : "Set New Password"}
        </button>
      </form>
    </div>
  );
}