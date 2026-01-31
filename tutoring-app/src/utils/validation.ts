export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) {
    return 'Le mot de passe doit contenir au moins 6 caractères';
  }
  return null;
}

export function validateName(name: string): string | null {
  if (name.trim().length < 2) {
    return 'Le nom doit contenir au moins 2 caractères';
  }
  return null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateLoginForm(email: string, password: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (!email) {
    errors.email = 'L\'email est requis';
  } else if (!validateEmail(email)) {
    errors.email = 'Email invalide';
  }

  if (!password) {
    errors.password = 'Le mot de passe est requis';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateRegisterForm(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult {
  const errors: Record<string, string> = {};

  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  if (!email) {
    errors.email = 'L\'email est requis';
  } else if (!validateEmail(email)) {
    errors.email = 'Email invalide';
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
