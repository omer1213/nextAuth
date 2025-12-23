"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { FormInput } from "@/components/form-input";
import { SubmitButton } from "@/components/submit-button";
import { AlertMessage } from "@/components/alert-message";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetToken("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send reset email");
        setIsLoading(false);
        return;
      }

      setMessage(data.message);
      // In development, show the reset token
      if (data.resetToken) {
        setResetToken(data.resetToken);
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
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Error Alert */}
        {error && <AlertMessage type="error" message={error} />}

        {/* Success Alert */}
        {message && <AlertMessage type="success" message={message} />}

        {/* Development Token Display */}
        {resetToken && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm font-medium text-yellow-800 mb-2">
              Development Mode - Reset Link:
            </p>
            <Link
              href={`/reset-password/${resetToken}`}
              className="text-sm text-blue-600 hover:text-blue-500 break-all"
            >
              /reset-password/{resetToken}
            </Link>
            <p className="text-xs text-yellow-700 mt-2">
              In production, this would be sent via email.
            </p>
          </div>
        )}

        {/* Forgot Password Form */}
        {!message && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <SubmitButton isLoading={isLoading} loadingText="Sending...">
              Send Reset Link
            </SubmitButton>
          </form>
        )}

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
