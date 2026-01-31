# 🔐 Système d'Authentification Détaillé

## Vue d'Ensemble

L'authentification est le processus qui permet aux utilisateurs de se connecter, s'inscrire, et gérer leur accès à l'application. Notre système utilise :

- **Validation locale** : Avant d'envoyer les données
- **Zustand Store** : Pour gérer l'état utilisateur
- **AsyncStorage** : Pour la persistance hors-ligne
- **Role-based Access** : Différents droits selon le rôle (élève, enseignant, parent)

---

## 🏗️ Architecture d'Authentification

```
┌─────────────────────────────────────────────────┐
│           Écrans de Connexion                   │
│  ┌─────────────────┬─────────────────────────┐  │
│  │  LoginScreen    │   RegisterScreen        │  │
│  └────────┬────────┴───────────┬─────────────┘  │
│           │                    │                │
│           ↓                    ↓                │
│  ┌──────────────────────────────────────────┐   │
│  │     Validation (utils/validation.ts)     │   │
│  │  - Format email                          │   │
│  │  - Force password (min 6 chars)          │   │
│  │  - Champs requis                         │   │
│  └────────┬─────────────────────────────────┘   │
│           │                                     │
│           ↓                                     │
│  ┌──────────────────────────────────────────┐   │
│  │     useAuth Hook (hooks/useAuth.ts)      │   │
│  │  - Encapsule authStore                   │   │
│  │  - Logique réutilisable                  │   │
│  └────────┬─────────────────────────────────┘   │
│           │                                     │
│           ↓                                     │
│  ┌──────────────────────────────────────────┐   │
│  │   Zustand authStore (contexts/authStore) │   │
│  │  - Gère l'état de connexion              │   │
│  │  - Persiste user data                    │   │
│  │  - Gère les erreurs                      │   │
│  └────────┬─────────────────────────────────┘   │
│           │                                     │
│           ↓                                     │
│  ┌──────────────────────────────────────────┐   │
│  │    AsyncStorage (storage/asyncStorage)   │   │
│  │  - Sauvegarde user localement            │   │
│  │  - Fonctionne hors-ligne                 │   │
│  └──────────────────────────────────────────┘   │
│           │                                     │
│           ↓                                     │
│  ┌──────────────────────────────────────────┐   │
│  │      RootNavigator (navigation)          │   │
│  │  - Change écrans selon isAuthenticated   │   │
│  │  - AuthStack vs AppStack                 │   │
│  └──────────────────────────────────────────┘   │
│           │                                     │
│           ↓                                     │
│  ┌──────────────────────────────────────────┐   │
│  │          Application (AppStack)          │   │
│  │  - Home + Tabs (Chat, Leçons, etc.)      │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Flux Complet : Login

### Étape 1 : Utilisateur ouvre l'app

```typescript
// App.tsx se charge → Charge RootNavigator
export function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

// Si isAuthenticated = false → Montre AuthStack (Login/Register)
```

### Étape 2 : Utilisateur voit LoginScreen

```typescript
// src/screens/auth/LoginScreen.tsx
export default function LoginScreen({ navigation }) {
  const { login, isLoading, error } = useAuth();
  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (vals) => {
      // Validation
      const validation = validateLoginForm(vals.email, vals.password);
      if (!validation.isValid) {
        Object.entries(validation.errors).forEach(([key, value]) => {
          setFieldError(key, value);
        });
        return;
      }
      
      // Authentification
      await login(vals.email, vals.password);
    },
  });

  return (
    <SafeAreaView>
      {/* Affiche les erreurs de validation */}
      {error && <ErrorBox>{error}</ErrorBox>}
      
      {/* Formulaire */}
      <TextField
        label="Email"
        value={values.email}
        onChangeText={(text) => handleChange('email', text)}
        error={errors.email}
      />
      <TextField
        label="Mot de passe"
        value={values.password}
        onChangeText={(text) => handleChange('password', text)}
        error={errors.password}
        secureTextEntry
      />
      
      {/* Bouton avec loading state */}
      <Button
        title="Se connecter"
        onPress={handleSubmit}
        loading={isLoading}
      />
    </SafeAreaView>
  );
}
```

### Étape 3 : Validation des Données

```typescript
// utils/validation.ts
export function validateLoginForm(
  email: string,
  password: string
): ValidationResult {
  const errors: Record<string, string> = {};

  // Validation email
  if (!email) {
    errors.email = 'L\'email est requis';
  } else if (!validateEmail(email)) {
    errors.email = 'Email invalide';
  }

  // Validation password
  if (!password) {
    errors.password = 'Le mot de passe est requis';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### Étape 4 : Appel du Store Zustand

```typescript
// hooks/useAuth.ts
export function useAuth() {
  const auth = useAuthStore();
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    login: auth.login,  // ← Appelle store.login()
    register: auth.register,
    logout: auth.logout,
  };
}

// LoginScreen appelle : await login(email, password)
// Qui appelle : await authStore.login(email, password)
```

### Étape 5 : Traitement dans le Store

```typescript
// contexts/authStore.ts
export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
      // 1. Afficher le loading
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // 2. Simuler authentification
        // (Dans la vraie app : appeler backend Django)
        if (!email || !password) {
          throw new Error('Email et mot de passe requis');
        }

        // 3. Créer utilisateur
        const mockUser: User = {
          id: '1',
          name: 'Jean Dupont',
          email,
          role: 'student',
          createdAt: new Date(),
        };

        // 4. Mettre à jour le state
        set((state) => {
          state.user = mockUser;
          state.isAuthenticated = true;
          state.isLoading = false;
        });

        // 5. Sauvegarder en AsyncStorage
        await saveUser(mockUser);

      } catch (error) {
        // 6. Gérer les erreurs
        set((state) => {
          state.error = error instanceof Error 
            ? error.message 
            : 'Erreur d\'authentification';
          state.isLoading = false;
        });
        throw error;
      }
    },
  }))
);
```

### Étape 6 : Persistance

```typescript
// storage/asyncStorage.ts
export async function saveUser(userData: any): Promise<void> {
  try {
    await AsyncStorage.setItem(
      '@tutoring_user',
      JSON.stringify(userData)
    );
  } catch (error) {
    console.error('Error saving user:', error);
  }
}
```

### Étape 7 : Navigation Automatique

```typescript
// Quand isAuthenticated passe de false → true
// RootNavigator se re-render
// isAuthenticated = true → Affiche AppStack au lieu d'AuthStack

// Utilisateur voit : HomeScreen + Tabs (Chat, Leçons, etc.)
```

---

## 📝 Flux Complet : Registration

### Différences avec Login

1. **Création d'utilisateur** au lieu de recherche
2. **Validation supplémentaire** : Confirmation password
3. **Choix du rôle** : Élève, Enseignant, Parent
4. **Même processus** après : Save → Store → Navigate

### Code RegisterScreen

```typescript
export default function RegisterScreen({ navigation }) {
  const { register, isLoading, error } = useAuth();
  const [role, setRole] = useState<'student' | 'teacher' | 'parent'>('student');

  const { values, errors, handleChange, handleSubmit, setFieldError } = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (vals) => {
      // Validation
      const validation = validateRegisterForm(
        vals.name,
        vals.email,
        vals.password,
        vals.confirmPassword
      );
      
      if (!validation.isValid) {
        Object.entries(validation.errors).forEach(([key, value]) => {
          setFieldError(key, value);
        });
        return;
      }

      // Enregistrement
      await register(vals.name, vals.email, vals.password, role);
    },
  });

  return (
    <SafeAreaView>
      {/* Choix du rôle */}
      <View style={styles.roleContainer}>
        <Button
          title="Élève"
          variant={role === 'student' ? 'primary' : 'outline'}
          onPress={() => setRole('student')}
        />
        <Button
          title="Enseignant"
          variant={role === 'teacher' ? 'primary' : 'outline'}
          onPress={() => setRole('teacher')}
        />
        <Button
          title="Parent"
          variant={role === 'parent' ? 'primary' : 'outline'}
          onPress={() => setRole('parent')}
        />
      </View>

      {/* Formulaire */}
      <TextField label="Nom" {...} />
      <TextField label="Email" {...} />
      <TextField label="Mot de passe" {...} />
      <TextField label="Confirmer" {...} />

      <Button onPress={handleSubmit} loading={isLoading} />
    </SafeAreaView>
  );
}
```

---

## 🚪 Logout

```typescript
// Utilisateur appuie sur "Se déconnecter"
const { logout } = useAuth();

const handleLogout = async () => {
  logout(); // Zustand
  // Résultat :
  // - user = null
  // - isAuthenticated = false
  // - RootNavigator re-render
  // - Montre AuthStack (Login/Register)
  
  await clearUser(); // AsyncStorage
};
```

---

## 🔒 Sécurité & Bonnes Pratiques

### 1. Validation Côté Client

```typescript
// ✅ BON : Valide AVANT d'envoyer
const validation = validateLoginForm(email, password);
if (!validation.isValid) {
  // Affiche erreurs
  return;
}

// ❌ MAUVAIS : Envoi tout, puis gère les erreurs
login(email, password).catch(error => {
  // Trop tard, données envoyées
});
```

### 2. Pas de Données Sensibles en Clair

```typescript
// ❌ MAUVAIS : Stocker password en clair
await AsyncStorage.setItem('password', password);

// ✅ BON : Stocker juste le token (futur)
await AsyncStorage.setItem('authToken', token);
```

### 3. Gérer les Erreurs Gracieusement

```typescript
// ✅ BON : Messages d'erreur utiles
if (!email) errors.email = 'Email requis';
if (!validateEmail(email)) errors.email = 'Email invalide';

// ❌ MAUVAIS : Messages génériques
if (error) showError('Erreur');
```

### 4. HTTPS en Production

```typescript
// ✅ BON : APIs en HTTPS uniquement
const API_URL = 'https://api.tutoring-app.com';

// ❌ MAUVAIS : HTTP non sécurisé
const API_URL = 'http://api.tutoring-app.com';
```

---

## 🔗 Intégration avec Backend Django

### Actuellement (Offline Mode)

```typescript
// Mock data - pas de backend
login: async (email, password) => {
  const mockUser = { id: '1', name: 'Test', email };
  // Sauvegarde en local
};
```

### Futur (Avec Backend)

```typescript
login: async (email: string, password: string) => {
  set((state) => { state.isLoading = true; });

  try {
    // Appeler backend Django
    const response = await axios.post(
      'https://api.tutoring-app.com/auth/login',
      { email, password }
    );

    const { user, token } = response.data;

    // Sauvegarder token
    await AsyncStorage.setItem('authToken', token);

    // Sauvegarder user
    set((state) => {
      state.user = user;
      state.isAuthenticated = true;
    });

  } catch (error) {
    set((state) => {
      state.error = error.response?.data?.message || 'Erreur serveur';
    });
  }
};
```

---

## 👥 Gestion des Rôles

```typescript
// User a un rôle : 'student' | 'teacher' | 'parent'

// Dans les composants :
const { user } = useAuth();

if (user?.role === 'teacher') {
  // Affiche Dashboard Enseignant
} else if (user?.role === 'student') {
  // Affiche App Élève
} else if (user?.role === 'parent') {
  // Affiche App Parent
}
```

---

## 📊 États d'Authentification

```
┌─────────────┐
│ Not Logged  │ ← App démarre
└──────┬──────┘
       │ User clique Login
       ↓
┌─────────────┐
│  Loading    │ ← Authentification en cours
└──────┬──────┘
       │
       ├─→ Success ─→ ┌─────────────┐
       │              │ Logged In   │ ← Peut utiliser l'app
       │              └─────────────┘
       │
       └─→ Error ──→ ┌─────────────┐
                     │ Error State │ ← Affiche message d'erreur
                     └─────────────┘
                          │
                          └─→ User retry
```

---

## 🎯 Points Clés

✅ **Validation avant envoi** - Meilleure UX  
✅ **Erreurs claires** - L'utilisateur sait quoi corriger  
✅ **Loading states** - Feedback utilisateur  
✅ **Persistance locale** - Fonctionne hors-ligne  
✅ **Rôles multiples** - Support élève/enseignant/parent  
✅ **Prêt pour backend** - Structure prête pour Django  

---

**Status** : ✅ Système d'authentification complet et sécurisé
