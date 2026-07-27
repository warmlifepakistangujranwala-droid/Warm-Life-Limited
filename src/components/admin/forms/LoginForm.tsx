"use client";

/**
 * ============================================================
 * Project : Warm Life Ltd
 * File    : LoginForm.tsx
 * Module  : Admin Authentication
 *
 * Purpose :
 * Provides secure email and password authentication for
 * authorised Warm Life CMS administrators.
 *
 * Public website visitors do not use this form.
 *
 * Version : v0.2.0
 * ============================================================
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { createClient } from "@/lib/supabase/client";

/**
 * Email icon used inside the email input.
 */
function EmailIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 24 24"
      width="20"
    >
      <path
        d="M4 6.75h16v10.5H4V6.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />

      <path
        d="m5 8 7 5 7-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

/**
 * Lock icon used inside the password input.
 */
function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 24 24"
      width="20"
    >
      <rect
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
        width="14"
        x="5"
        y="10"
      />

      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

/**
 * Eye icon used for password visibility.
 */
function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 24 24"
      width="20"
    >
      <path
        d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />

      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      {hidden ? (
        <path
          d="m4 4 16 16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
      ) : null}
    </svg>
  );
}

/**
 * Small lock icon used inside the submit button.
 */
function ButtonLockIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
    >
      <rect
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
        width="14"
        x="5"
        y="10"
      />

      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

/**
 * Renders the administrator login form.
 */
export default function LoginForm() {
  // Create the browser-side Supabase client.
  const supabase = createClient();

  // Used to redirect the administrator after login.
  const router = useRouter();

  // Store administrator credentials.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Control password visibility.
  const [showPassword, setShowPassword] = useState(false);

  // Store submission and error states.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Authenticates an existing administrator through Supabase.
   *
   * @param event - Login form submission event.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Clear previous errors before submitting.
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage("The email address or password is incorrect.");
        return;
      }

      // Refresh server authentication state.
      router.refresh();

      // Redirect authenticated administrator to the dashboard.
      router.replace("/admin/dashboard");
    } catch {
      setErrorMessage(
        "We could not sign you in at this time. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={handleSubmit}>
      <header className="admin-login-form__heading">
        <p className="admin-login-form__eyebrow">Warm Life Ltd</p>

        <h1>
          Admin <span>CMS Login</span>
        </h1>

        <p className="admin-login-form__description">
          Sign in to manage website content, images, videos and enquiries.
        </p>
      </header>

      {errorMessage ? (
        <div className="admin-login-form__error" role="alert">
          {errorMessage}
        </div>
      ) : null}

      <div className="admin-login-form__field">
        <label htmlFor="admin-email">Email address</label>

        <div className="admin-login-form__input-wrapper">
          <span className="admin-login-form__input-icon">
            <EmailIcon />
          </span>

          <input
            id="admin-email"
            autoComplete="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@warmlife.co.uk"
            required
            type="email"
            value={email}
          />
        </div>
      </div>

      <div className="admin-login-form__field">
        <label htmlFor="admin-password">Password</label>

        <div className="admin-login-form__input-wrapper">
          <span className="admin-login-form__input-icon">
            <LockIcon />
          </span>

          <input
            id="admin-password"
            autoComplete="current-password"
            minLength={8}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            type={showPassword ? "text" : "password"}
            value={password}
          />

          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="admin-login-form__password-toggle"
            onClick={() => setShowPassword((currentValue) => !currentValue)}
            type="button"
          >
            <EyeIcon hidden={showPassword} />
          </button>
        </div>

        <Link
          className="admin-login-form__forgot-link"
          href="/admin/forgot-password"
        >
          Forgot password?
        </Link>
      </div>

      <button
        className="admin-login-form__submit"
        disabled={isSubmitting}
        type="submit"
      >
        <ButtonLockIcon />

        <span>{isSubmitting ? "Signing in..." : "Sign in"}</span>
      </button>

      <div className="admin-login-form__secure-divider">
        <span />

        <p>
          <svg
            aria-hidden="true"
            fill="none"
            height="17"
            viewBox="0 0 24 24"
            width="17"
          >
            <path
              d="M12 3 5 6v5c0 4.7 2.9 8.3 7 10 4.1-1.7 7-5.3 7-10V6l-7-3Z"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="1.7"
            />
          </svg>

          Secure access
        </p>

        <span />
      </div>

      <div className="admin-login-form__restricted">
        <div className="admin-login-form__restricted-icon">
          <svg
            aria-hidden="true"
            fill="none"
            height="26"
            viewBox="0 0 24 24"
            width="26"
          >
            <path
              d="M12 3 5 6v5c0 4.7 2.9 8.3 7 10 4.1-1.7 7-5.3 7-10V6l-7-3Z"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="1.7"
            />

            <path
              d="m9 12 2 2 4-4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
            />
          </svg>
        </div>

        <div>
          <strong>Access is restricted</strong>

          <p>This area is for authorised Warm Life administrators only.</p>
        </div>
      </div>
    </form>
  );
}