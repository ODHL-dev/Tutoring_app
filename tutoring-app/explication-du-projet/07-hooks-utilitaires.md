# 🎣 Hooks & Utilitaires Personnalisés

## Qu'est-ce qu'un Hook ?

Un **Hook** est une fonction React qui permet de :
- Utiliser l'état (useState)
- Exécuter des effets secondaires (useEffect)
- Accéder au contexte (useContext)
- Créer une logique réutilisable

**Custom Hook** = Hook créé par nous pour encapsuler de la logique métier.

### Avantages

| Avantage | Bénéfice |
|----------|----------|
| **Réutilisabilité** | Même logique dans plusieurs composants |
| **Abstraction** | Composant ne connaît pas les détails |
| **Testabilité** | Facile de tester la logique isolée |
| **Composition** | Combiner plusieurs hooks |

---

## 🎣 Hook 1 : useAuth

### Rôle

Encapsuler l'accès au store Zustand d'authentification, en fournissant une interface propre au composant.

### Implémentation

```typescript
// src/hooks/useAuth.ts
import { useAuthStore } from '@contexts/authStore';

export function useAuth() {
  const auth = useAuthStore();

  return {
    // État
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,

    // Actions
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    clearError: auth.clearError,
  };
}
```

### Avantages de l'Abstraction

```typescript
// ❌ SANS HOOK : Importer directement le store
import { useAuthStore } from '@contexts/authStore';

export default function LoginScreen() {
  const store = useAuthStore();
  const { user, login } = store;
  // Composant connaît les détails internes
}

// ✅ AVEC HOOK : Interface propre
import { useAuth } from '@hooks/useAuth';

export default function LoginScreen() {
  const { user, login } = useAuth();
  // Composant ignore que c'est Zustand
}

// Futur : Si on change Zustand → Redux, juste le hook change
```

### Utilisation

```typescript
export default function LoginScreen() {
  const { isLoading, error, login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      // User maintenant connecté, navigation change automatiquement
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      {error && <ErrorBox>{error}</ErrorBox>}
      {isLoading && <ActivityIndicator />}
      <Button onPress={handleLogin}>Se connecter</Button>
    </View>
  );
}
```

---

## 🎣 Hook 2 : useForm

### Rôle

Gérer l'état d'un formulaire : valeurs, erreurs, submission.

### Implémentation

```typescript
// src/hooks/useForm.ts
import { useState, useCallback } from 'react';

interface UseFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mettre à jour une valeur et effacer erreur associée
  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Effacer erreur quand l'utilisateur corrige
    if (errors[name as string]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  // Soumettre le formulaire
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit]);

  // Définir manuellement une erreur
  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  // Réinitialiser le formulaire
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldError,
    resetForm,
    setValues,
  };
}
```

### Utilisation : Login Form

```typescript
export default function LoginScreen() {
  const { values, errors, isSubmitting, handleChange, handleSubmit, setFieldError } = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (vals) => {
      // 1. Valider
      const validation = validateLoginForm(vals.email, vals.password);
      if (!validation.isValid) {
        Object.entries(validation.errors).forEach(([key, value]) => {
          setFieldError(key, value);
        });
        return;
      }

      // 2. Soumettre
      await login(vals.email, vals.password);
    },
  });

  return (
    <SafeAreaView>
      {/* Email input */}
      <TextField
        label="Email"
        value={values.email}
        onChangeText={(text) => handleChange('email', text)}
        error={errors.email}
      />

      {/* Password input */}
      <TextField
        label="Mot de passe"
        value={values.password}
        onChangeText={(text) => handleChange('password', text)}
        error={errors.password}
        secureTextEntry
      />

      {/* Submit button */}
      <Button
        title="Se connecter"
        onPress={handleSubmit}
        loading={isSubmitting}
      />
    </SafeAreaView>
  );
}
```

### Flow du Hook

```
1. User tape dans email
   ↓
2. handleChange('email', 'jean@email.com')
   ↓
3. values.email = 'jean@email.com'
   ↓
4. TextField se re-render avec nouvelle valeur
   ↓
5. User appuie sur "Se connecter"
   ↓
6. handleSubmit() appelé
   ↓
7. Validation → Erreurs ?
   → setFieldError() → affiche erreur
   → Pas d'erreur → onSubmit() → login()
   ↓
8. isSubmitting = true → Button affiche "Chargement..."
   ↓
9. Après → isSubmitting = false
```

### Avantages

✅ **Logique centralisée** - Pas de useState/validation partout  
✅ **Erreurs auto-gérées** - Effacées quand l'utilisateur corrige  
✅ **TypeScript safe** - Generic T pour tout type de form  
✅ **Réutilisable** - Login, Register, Profile form, etc.  

---

## 🛠️ Utilitaires : validation.ts

### Rôle

Fonctions de validation réutilisables pour les formulaires.

### Email Validation

```typescript
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Tests
validateEmail('jean@email.com')    // true
validateEmail('jean.dupont@test.co.uk') // true
validateEmail('jeanATgmail')       // false
validateEmail('jean@')             // false
```

### Password Validation

```typescript
export function validatePassword(password: string): string | null {
  if (password.length < 6) {
    return 'Le mot de passe doit contenir au moins 6 caractères';
  }
  // Futur : Ajouter uppercase, numbers, special chars
  return null;
}

// Utilisation
const error = validatePassword('123');
if (error) console.log(error); // "Le mot de passe doit contenir..."
```

### Name Validation

```typescript
export function validateName(name: string): string | null {
  if (name.trim().length < 2) {
    return 'Le nom doit contenir au moins 2 caractères';
  }
  return null;
}
```

### Login Form Validation

```typescript
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateLoginForm(
  email: string,
  password: string
): ValidationResult {
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

// Utilisation
const validation = validateLoginForm('jean@email.com', '123456');
if (!validation.isValid) {
  console.log(validation.errors);
  // { password: "Le mot de passe doit contenir..." }
}
```

### Register Form Validation

```typescript
export function validateRegisterForm(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult {
  const errors: Record<string, string> = {};

  // Valider name
  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  // Valider email
  if (!email) {
    errors.email = 'L\'email est requis';
  } else if (!validateEmail(email)) {
    errors.email = 'Email invalide';
  }

  // Valider password
  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  // Valider confirmation
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

---

## 🔄 Pattern : Hook + Validation + Store

### Flux Complet

```
Component
    ↓
useForm Hook
    ↓
handleChange() → Met à jour values
    ↓
handleSubmit() → Valide avec validation.ts
    ↓
Si erreur → setFieldError() → Affiche erreur
    ↓
Si OK → onSubmit() → Appelle useAuth().login()
    ↓
useAuth() → Appelle authStore.login()
    ↓
Store → Zustand → Sauvegarde + AsyncStorage
    ↓
isAuthenticated change → Navigation change
```

---

## 🎯 Bonnes Pratiques

### 1. Garder les Hooks Simples

```typescript
// ✅ BON : Hook a une responsabilité
export function useForm() {
  // Gère formulaires uniquement
}

// ❌ MAUVAIS : Hook fait trop
export function useFormAndAuth() {
  // Formulaire + authentification
  // Mélange les responsabilités
}
```

### 2. Utiliser useCallback pour Optimisation

```typescript
// ✅ BON : Fonction stable
const handleChange = useCallback((name, value) => {
  setValues(prev => ({ ...prev, [name]: value }));
}, []);

// Évite re-render du composant qui reçoit cette fonction en prop
```

### 3. Typage TypeScript Strict

```typescript
// ✅ BON
export function useForm<T extends Record<string, any>>({
  initialValues: T,
  onSubmit: (values: T) => Promise<void>,
}: UseFormProps<T>) {
  // Type-safe
}

// ❌ MAUVAIS
export function useForm(initialValues: any, onSubmit: any) {
  // Pas de typage
}
```

---

## 📊 Résumé Hooks & Utilitaires

| Hook/Util | Rôle | Utilisation |
|-----------|------|-------------|
| **useAuth** | Accès au store auth | Tous les composants auth |
| **useForm** | Gestion formulaire | Login, Register, Profile |
| **validateEmail** | Valider email | useForm + composition |
| **validatePassword** | Valider password | useForm + composition |
| **validateLoginForm** | Valider login complet | LoginScreen |
| **validateRegisterForm** | Valider register complet | RegisterScreen |

---

## 🚀 Futurs Hooks

```typescript
// Progressivement ajouter :

// useStudent - Gestion progression élève
export function useStudent() {
  const { progress, addLesson } = useStudentStore();
  return { progress, addLesson };
}

// useChat - Gestion conversations IA
export function useChat() {
  const [messages, setMessages] = useState([]);
  const sendMessage = async (text) => {
    // Envoyer à IA + sauvegarder
  };
  return { messages, sendMessage };
}

// useLessons - Charger leçons
export function useLessons() {
  const [lessons, setLessons] = useState([]);
  useEffect(() => {
    loadLessons();
  }, []);
  return { lessons };
}
```

---

**Status** : ✅ Hooks et utilitaires bien structurés et réutilisables
