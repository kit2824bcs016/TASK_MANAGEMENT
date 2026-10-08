import { VALIDATION_LIMITS } from '../lib/constants';

export interface AuthValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return 'Email address is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address.';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required.';
  if (password.length < VALIDATION_LIMITS.PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${VALIDATION_LIMITS.PASSWORD_MIN_LENGTH} characters.`;
  }
  return null;
}

export function validateDisplayName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Display name is required.';
  if (trimmed.length > VALIDATION_LIMITS.DISPLAY_NAME_MAX_LENGTH) {
    return `Display name cannot exceed ${VALIDATION_LIMITS.DISPLAY_NAME_MAX_LENGTH} characters.`;
  }
  return null;
}

export function validateRegistrationForm(
  email: string,
  password: string,
  confirmPassword: string,
  displayName: string
): AuthValidationResult {
  const errors: Record<string, string> = {};

  const nameError = validateDisplayName(displayName);
  if (nameError) errors.displayName = nameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLoginForm(email: string, password: string): AuthValidationResult {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) {
    errors.password = 'Password is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
