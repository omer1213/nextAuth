/**
 * Password validation utility
 * Enforces strong password requirements
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const errors: string[] = [];

  // Minimum length
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // Uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  // Lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  // Number
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  // Special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*...)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function getPasswordStrengthMessage(password: string): string {
  const validation = validatePasswordStrength(password);
  
  if (validation.isValid) {
    return "Password meets all requirements";
  }
  
  return validation.errors.join(". ");
}
