"use client";

import { useState } from "react";
import { FormInput } from "./form-input";
import { SubmitButton } from "./submit-button";
import { AlertMessage } from "./alert-message";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }
    
    if (!/[A-Z]/.test(newPassword)) {
      setError("Password must contain at least one uppercase letter");
      setLoading(false);
      return;
    }
    
    if (!/[a-z]/.test(newPassword)) {
      setError("Password must contain at least one lowercase letter");
      setLoading(false);
      return;
    }
    
    if (!/[0-9]/.test(newPassword)) {
      setError("Password must contain at least one number");
      setLoading(false);
      return;
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      setError("Password must contain at least one special character");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        // Clear form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(data.error || "Failed to change password");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && <AlertMessage type="error" message={error} />}
        {success && <AlertMessage type="success" message={success} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
            disabled={loading}
          />

          <FormInput
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            disabled={loading}
          />

          <FormInput
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            disabled={loading}
          />

          {newPassword && (
            <div className="text-xs space-y-1">
              <p className="text-gray-600 font-medium">Password requirements:</p>
              <ul className="space-y-0.5 text-gray-500">
                <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
                  {newPassword.length >= 8 ? "✓" : "○"} At least 8 characters
                </li>
                <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>
                  {/[A-Z]/.test(newPassword) ? "✓" : "○"} One uppercase letter
                </li>
                <li className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}>
                  {/[a-z]/.test(newPassword) ? "✓" : "○"} One lowercase letter
                </li>
                <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>
                  {/[0-9]/.test(newPassword) ? "✓" : "○"} One number
                </li>
                <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? "text-green-600" : ""}>
                  {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? "✓" : "○"} One special character
                </li>
              </ul>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <SubmitButton isLoading={loading} loadingText="Changing...">
              Change Password
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
