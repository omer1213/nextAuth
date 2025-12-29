"use client";

import { useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FormInput } from "@/components/form-input";
import { SubmitButton } from "@/components/submit-button";
import { AlertMessage } from "@/components/alert-message";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const errors = {
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    // Validate password strength
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = "Password must contain at least one lowercase letter";
      isValid = false;
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = "Password must contain at least one number";
      isValid = false;
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
      errors.password = "Password must contain at least one special character";
      isValid = false;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setFieldErrors({
      password: "",
      confirmPassword: "",
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Password Reset Successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Set New Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        {/* Error Alert */}
        {error && <AlertMessage type="error" message={error} />}

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <FormInput
              id="password"
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={fieldErrors.password}
              required
              disabled={isLoading}
            />

            <FormInput
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              error={fieldErrors.confirmPassword}
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Requirements */}
          {formData.password && (
            <div className="text-xs space-y-1">
              <p className="text-gray-600 font-medium">Password requirements:</p>
              <ul className="space-y-0.5 text-gray-500">
                <li className={formData.password.length >= 8 ? "text-green-600" : ""}>
                  {formData.password.length >= 8 ? "✓" : "○"} At least 8 characters
                </li>
                <li className={/[A-Z]/.test(formData.password) ? "text-green-600" : ""}>
                  {/[A-Z]/.test(formData.password) ? "✓" : "○"} One uppercase letter
                </li>
                <li className={/[a-z]/.test(formData.password) ? "text-green-600" : ""}>
                  {/[a-z]/.test(formData.password) ? "✓" : "○"} One lowercase letter
                </li>
                <li className={/[0-9]/.test(formData.password) ? "text-green-600" : ""}>
                  {/[0-9]/.test(formData.password) ? "✓" : "○"} One number
                </li>
                <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? "text-green-600" : ""}>
                  {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? "✓" : "○"} One special character
                </li>
              </ul>
            </div>
          )}

          <SubmitButton isLoading={isLoading} loadingText="Resetting...">
            Reset Password
          </SubmitButton>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
