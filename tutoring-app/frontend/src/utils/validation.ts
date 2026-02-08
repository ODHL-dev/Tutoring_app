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
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  profession: 'student' | 'teacher',
  classCycle?: 'primaire' | 'secondaire',
  classLevel?: string,
  series?: string,
  teachingCycle?: 'primaire' | 'secondaire'
): ValidationResult {
  const errors: Record<string, string> = {};

  const firstNameError = validateName(firstName);
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateName(lastName);
  if (lastNameError) errors.lastName = lastNameError;

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

  if (profession === 'student' && !classCycle) {
    errors.classCycle = 'Le cycle est requis';
  }

  if (profession === 'student' && !classLevel?.trim()) {
    errors.classLevel = 'La classe est requise';
  }

  if (profession === 'student' && classCycle === 'secondaire') {
    const needsSeries = ['2nde', '1ere', 'Terminale'].includes(classLevel ?? '');
    if (needsSeries && !series?.trim()) {
      errors.series = 'La serie est requise';
    }
  }

  if (profession === 'teacher' && !teachingCycle) {
    errors.teachingCycle = 'Le cycle est requis';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
