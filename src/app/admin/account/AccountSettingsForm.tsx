/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : src/app/admin/account/AccountSettingsForm.tsx
 *
 * Purpose :
 * Allows the authenticated administrator to securely update
 * the current Supabase Auth email address and password.
 *
 * Version : v0.2.0
 * ============================================================
 */

"use client";

import {
  AlertCircle,
  AtSign,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  MailCheck,
  Save,
  ShieldCheck,
} from "lucide-react";

import {
  type FormEvent,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/client";


type AccountSettingsFormProps = {
  email: string;

  section:
    | "email"
    | "password";
};


type Message = {
  type:
    | "success"
    | "error";

  text: string;
} | null;


/* ============================================================
   PASSWORD RULES
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

export default function AccountSettingsForm({
  email,
  section,
}: AccountSettingsFormProps) {
  const router =
    useRouter();

  const supabase =
    useMemo(
      () =>
        createClient(),
      [],
    );


  /* ==========================================================
     EMAIL STATE
     ========================================================== */

  const [
    newEmail,
    setNewEmail,
  ] =
    useState("");

  const [
    confirmEmail,
    setConfirmEmail,
  ] =
    useState("");

  const [
    isUpdatingEmail,
    setIsUpdatingEmail,
  ] =
    useState(false);

  const [
    emailMessage,
    setEmailMessage,
  ] =
    useState<Message>(
      null,
    );


  /* ==========================================================
     PASSWORD STATE
     ========================================================== */

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
     EMAIL UPDATE
     ========================================================== */

  async function handleEmailSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setEmailMessage(
      null,
    );


    const cleanedEmail =
      newEmail
        .trim()
        .toLowerCase();

    const cleanedConfirmation =
      confirmEmail
        .trim()
        .toLowerCase();


    if (
      !cleanedEmail
    ) {
      setEmailMessage({
        type:
          "error",

        text:
          "Please enter your new email address.",
      });

      return;
    }


    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanedEmail,
      )
    ) {
      setEmailMessage({
        type:
          "error",

        text:
          "Please enter a valid email address.",
      });

      return;
    }


    if (
      cleanedEmail !==
      cleanedConfirmation
    ) {
      setEmailMessage({
        type:
          "error",

        text:
          "New email and confirmation email do not match.",
      });

      return;
    }


    if (
      cleanedEmail ===
      email
        .trim()
        .toLowerCase()
    ) {
      setEmailMessage({
        type:
          "error",

        text:
          "The new email address is the same as your current email.",
      });

      return;
    }


    setIsUpdatingEmail(
      true,
    );


    try {
      const {
        data: {
          user,
        },

        error:
          userError,
      } =
        await supabase.auth
          .getUser();


      if (
        userError ||
        !user
      ) {
        throw new Error(
          "Your administrator session is no longer valid. Please sign in again.",
        );
      }


      const {
        error,
      } =
        await supabase.auth
          .updateUser({
            email:
              cleanedEmail,
          });


      if (
        error
      ) {
        throw new Error(
          error.message,
        );
      }


      setNewEmail(
        "",
      );

      setConfirmEmail(
        "",
      );


      setEmailMessage({
        type:
          "success",

        text:
          "Email change requested successfully. Please check the confirmation email and complete the verification before using the new email to sign in.",
      });


      router.refresh();
    } catch (
      error
    ) {
      setEmailMessage({
        type:
          "error",

        text:
          error instanceof Error
            ? error.message
            : "Unable to update the administrator email.",
      });
    } finally {
      setIsUpdatingEmail(
        false,
      );
    }
  }


  /* ==========================================================
     PASSWORD UPDATE
     ========================================================== */

  async function handlePasswordSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setMessage(null);


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


    setIsSaving(true);


    try {
      const {
        data: {
          user,
        },

        error:
          userError,
      } =
        await supabase.auth
          .getUser();


      if (
        userError ||
        !user
      ) {
        throw new Error(
          "Your administrator session is no longer valid. Please sign in again.",
        );
      }


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
          "Administrator password updated successfully.",
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
            : "Unable to update the administrator password.",
      });
    } finally {
      setIsSaving(
        false,
      );
    }
  }


  /* ==========================================================
     EMAIL FORM
     ========================================================== */

  if (
    section === "email"
  ) {
    return (
      <div className="adminAccountSecurity">

        <div className="adminAccountSecurity__notice">
          <div>
            <MailCheck
              size={20}
            />
          </div>

          <div>
            <strong>
              Current login email
            </strong>

            <p>
              Your current CMS
              login email is
              <strong>
                {" "}
                {email}
              </strong>
              . Changing this
              address will also
              change the email used
              for future password
              recovery.
            </p>
          </div>
        </div>


        {emailMessage ? (
          <div
            className={`adminAccountSecurity__message ${
              emailMessage.type ===
              "success"
                ? "isSuccess"
                : "isError"
            }`}
          >
            {emailMessage.type ===
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
                emailMessage
                  .text
              }
            </span>
          </div>
        ) : null}


        <form
          className="adminAccountSecurity__form"
          onSubmit={
            handleEmailSubmit
          }
        >
          <label className="adminAccountSecurity__field">
            <span>
              New Email Address
            </span>

            <div className="adminAccountSecurity__input">
              <AtSign
                size={17}
              />

              <input
                type="email"
                autoComplete="email"
                value={
                  newEmail
                }
                onChange={(
                  event,
                ) => {
                  setNewEmail(
                    event.target
                      .value,
                  );

                  setEmailMessage(
                    null,
                  );
                }}
                placeholder="admin@example.com"
                required
              />
            </div>
          </label>


          <label className="adminAccountSecurity__field">
            <span>
              Confirm New Email
            </span>

            <div className="adminAccountSecurity__input">
              <AtSign
                size={17}
              />

              <input
                type="email"
                autoComplete="email"
                value={
                  confirmEmail
                }
                onChange={(
                  event,
                ) => {
                  setConfirmEmail(
                    event.target
                      .value,
                  );

                  setEmailMessage(
                    null,
                  );
                }}
                placeholder="Re-enter new email"
                required
              />
            </div>
          </label>


          {confirmEmail ? (
            <div
              className={`adminAccountPasswordMatch ${
                newEmail
                  .trim()
                  .toLowerCase() ===
                confirmEmail
                  .trim()
                  .toLowerCase()
                  ? "isValid"
                  : "isInvalid"
              }`}
            >
              {newEmail
                .trim()
                .toLowerCase() ===
              confirmEmail
                .trim()
                .toLowerCase() ? (
                <CheckCircle2
                  size={15}
                />
              ) : (
                <AlertCircle
                  size={15}
                />
              )}

              <span>
                {newEmail
                  .trim()
                  .toLowerCase() ===
                confirmEmail
                  .trim()
                  .toLowerCase()
                  ? "Email addresses match."
                  : "Email addresses do not match."}
              </span>
            </div>
          ) : null}


          <button
            type="submit"
            className="adminAccountSecurity__submit"
            disabled={
              isUpdatingEmail ||
              !newEmail.trim() ||
              newEmail
                .trim()
                .toLowerCase() !==
                confirmEmail
                  .trim()
                  .toLowerCase()
            }
          >
            {isUpdatingEmail ? (
              <Loader2
                size={17}
                className="adminAccountSecurity__spinner"
              />
            ) : (
              <AtSign
                size={17}
              />
            )}

            {isUpdatingEmail
              ? "Sending Verification..."
              : "Change Email Address"}
          </button>
        </form>
      </div>
    );
  }


  /* ==========================================================
     PASSWORD FORM
     ========================================================== */

  return (
    <div className="adminAccountSecurity">

      <div className="adminAccountSecurity__notice">
        <div>
          <ShieldCheck
            size={20}
          />
        </div>

        <div>
          <strong>
            Secure password update
          </strong>

          <p>
            You are changing the
            password for
            <strong>
              {" "}
              {email}
            </strong>
            . The new password will
            be used the next time
            you sign in to the Warm
            Life CMS.
          </p>
        </div>
      </div>


      {message ? (
        <div
          className={`adminAccountSecurity__message ${
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
            {message.text}
          </span>
        </div>
      ) : null}


      <form
        className="adminAccountSecurity__form"
        onSubmit={
          handlePasswordSubmit
        }
      >
        <label className="adminAccountSecurity__field">
          <span>
            New Password
          </span>

          <div className="adminAccountSecurity__input">
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
              placeholder="Enter new password"
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


        <label className="adminAccountSecurity__field">
          <span>
            Confirm New Password
          </span>

          <div className="adminAccountSecurity__input">
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
              placeholder="Confirm new password"
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


        <div className="adminAccountPasswordRules">
          <strong>
            Password requirements
          </strong>

          <div className="adminAccountPasswordRules__grid">
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

              At least 8
              characters
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

              One uppercase
              letter
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

              One lowercase
              letter
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

              One special
              character
            </span>
          </div>
        </div>


        {confirmPassword ? (
          <div
            className={`adminAccountPasswordMatch ${
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


        <button
          type="submit"
          className="adminAccountSecurity__submit"
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
              className="adminAccountSecurity__spinner"
            />
          ) : (
            <Save
              size={17}
            />
          )}

          {isSaving
            ? "Updating Password..."
            : "Update Password"}
        </button>
      </form>
    </div>
  );
}