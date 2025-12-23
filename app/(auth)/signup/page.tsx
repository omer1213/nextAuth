"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormInput } from "@/components/form-input";
import { SubmitButton } from "@/components/submit-button";
import { AlertMessage } from "@/components/alert-message";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [verificationLink, setVerificationLink] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    // Validate name
    if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate password
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call signup API
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        setIsLoading(false);
        return;
      }

      // Account created successfully! Show verification message
      setSuccess(true);
      setUserEmail(formData.email);
      setEmailSent(data.emailSent || false);
      if (data.verificationLink) {
        setVerificationLink(data.verificationLink);
      }
      setIsLoading(false);
    } catch (error) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign up to get started
          </p>
        </div>

        {/* Success Message */}
        {success ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Check Your Email! 📧
              </h3>
              <p className="text-gray-600 mb-4">
                We've sent a verification link to:
              </p>
              <p className="text-lg font-semibold text-blue-600 mb-6">
                {userEmail}
              </p>
            </div>

            {emailSent ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Next steps:</strong>
                </p>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Open your email inbox</li>
                  <li>Find the email from us (check spam if needed)</li>
                  <li>Click the "Verify Email" button</li>
                  <li>Return here to login!</li>
                </ol>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 mb-3">
                  <strong>⚠️ Email couldn't be sent</strong>
                  <br />
                  Click the link below to verify your email:
                </p>
                {verificationLink && (
                  <Link
                    href={verificationLink}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                  >
                    Verify Email Now →
                  </Link>
                )}
              </div>
            )}

            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Didn't receive the email?
              </p>
              <Link
                href="/resend-verification"
                className="inline-block text-blue-600 hover:text-blue-800 font-medium underline"
              >
                Resend verification email
              </Link>
            </div>

            <div className="text-center pt-4 border-t">
              <Link
                href="/login"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Go to Login Page
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Error Alert */}
            {error && (
              <AlertMessage type="error" message={error} />
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <FormInput
              id="name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={fieldErrors.name}
              required
              disabled={isLoading}
            />

            <FormInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={fieldErrors.email}
              required
              disabled={isLoading}
            />

            <FormInput
              id="password"
              label="Password"
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
              label="Confirm Password"
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

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="text-sm">
              <p className="text-gray-600 mb-1">Password strength:</p>
              <div className="flex gap-1">
                <div
                  className={`h-2 flex-1 rounded ${
                    formData.password.length >= 8
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
                <div
                  className={`h-2 flex-1 rounded ${
                    formData.password.length >= 10
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                <div
                  className={`h-2 flex-1 rounded ${
                    formData.password.length >= 12 &&
                    /[A-Z]/.test(formData.password) &&
                    /[0-9]/.test(formData.password)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <SubmitButton isLoading={isLoading} loadingText="Creating account...">
            Create Account
          </SubmitButton>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
          </>
        )}
      </div>
    </div>
  );
}
