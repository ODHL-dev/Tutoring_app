# 🌍 State Management avec Zustand

## Qu'est-ce que Zustand ?

**Zustand** est une librairie légère de gestion d'état global pour React. Elle permet de :
- Centraliser l'état de l'application
- Éviter les "prop drilling" (passer des props à travers 10 composants)
- Partager des données entre n'importe quels composants sans dépendances
- Garder le code simple et minimal

### Zustand vs Redux

| Aspect | Zustand | Redux |
|--------|---------|-------|
| **Boilerplate** | Minimal | Beaucoup |
| **Apprentissage** | Facile | Difficile |
| **Performance** | Excellent | Bon |
| **DevTools** | Intégré | Extension |
| **Taille** | ~2KB | ~50KB |

Pour ce projet, **Zustand est parfait** car nous n'avons pas besoin de la complexité de Redux.

---

## Architecture Zustand du Projet

```
┌─────────────────────────────────────────┐
│       Application                       │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Any Component                   │  │
│  │  const { user } = useAuthStore() │  │
│  └──────────────────────────────────┘  │
│                  ↕                      │
│  ┌──────────────────────────────────┐  │
│  │  Zustand Store                   │  │
│  │  - authStore                     │  │
│  │  - studentStore                  │  │
│  └──────────────────────────────────┘  │
│                  ↕                      │
│  ┌──────────────────────────────────┐  │
│  │  Immer Middleware                │  │
│  │  (Mutations faciles)             │  │
│  └──────────────────────────────────┘  │
│                  ↕                      │
│  ┌──────────────────────────────────┐  │
│  │  Données Persistantes            │  │
│  │  (AsyncStorage)                  │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 1️⃣ Store d'Authentification (authStore.ts)

### Structure

```typescript
interface AuthState {
  // État
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    // État initial
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Actions
    login: async (email, password) => { /* ... */ },
    register: async (name, email, password, role) => { /* ... */ },
    logout: () => { /* ... */ },
    clearError: () => { /* ... */ },
  }))
);
```

### Utilisation dans un Composant

```typescript
import { useAuthStore } from '@contexts/authStore';

export default function LoginScreen() {
  const { user, isLoading, error, login } = useAuthStore();

  const handleLogin = async () => {
    await login(email, password);
    // user est automatiquement mis à jour !
  };

  return (
    <View>
      {error && <Text>{error}</Text>}
      {isLoading && <Text>Connexion en cours...</Text>}
      {user && <Text>Bienvenue {user.name}</Text>}
    </View>
  );
}
```

### Flux d'Authentification Détaillé

```
1. Utilisateur remplit le formulaire et appelle login()
   
   const { login } = useAuthStore();
   await login('email@example.com', 'password123');

2. Action login() s'exécute dans le store :
   
   login: async (email: string, password: string) => {
     set((state) => {
       state.isLoading = true;    // Affiche "Connexion..."
       state.error = null;
     });

     try {
       // Validation & authentification
       const user = await authenticateUser(email, password);
       
       set((state) => {
         state.user = user;         // User connecté
         state.isAuthenticated = true;
         state.isLoading = false;
       });
     } catch (error) {
       set((state) => {
         state.error = error.message;
         state.isLoading = false;
       });
     }
   }

3. Le composant se re-render avec le nouvel état
   - isLoading passe de true à false
   - user est maintenant défini
   - Composant affiche l'écran d'accueil

4. RootNavigator détecte isAuthenticated = true
   - Affiche AppStack à la place d'AuthStack
   - Utilisateur voit l'app principale
```

### Middleware Immer

**Immer** permet d'écrire du state mutation code (plus facile) qui se transforme automatiquement en immutable updates :

```typescript
// ❌ Sans Immer (compliqué)
set((state) => ({
  user: {
    ...state.user,
    name: 'Nouveau nom'
  }
}));

// ✅ Avec Immer (facile)
set((state) => {
  state.user.name = 'Nouveau nom';
});
```

---

## 2️⃣ Store de Progression Élève (studentStore.ts)

### Structure

```typescript
export interface StudentProgress {
  studentId: string;
  totalLessonsCompleted: number;
  currentLevel: 'débutant' | 'amateur' | 'pro' | 'expert';
  score: number;
  revisionSchedule: Array<{
    lessonId: string;
    nextReviewDate: Date;
  }>;
}

export const useStudentStore = create<StudentState>()(
  immer((set) => ({
    // État
    progress: null,
    isLoading: false,

    // Actions
    loadProgress: async (studentId: string) => { /* ... */ },
    updateProgress: (updates: Partial<StudentProgress>) => { /* ... */ },
    addCompletedLesson: (lessonId: string) => { /* ... */ },
  }))
);
```

### Utilisation

```typescript
export default function HomeScreen() {
  const { progress, loadProgress } = useStudentStore();

  useEffect(() => {
    loadProgress(userId);
  }, [userId]);

  return (
    <View>
      <Text>Score : {progress?.score}</Text>
      <Text>Niveau : {progress?.currentLevel}</Text>
      <Text>Leçons complétées : {progress?.totalLessonsCompleted}</Text>
    </View>
  );
}
```

### Mise à Jour de la Progression

Quand un élève complète une leçon :

```typescript
const { addCompletedLesson } = useStudentStore();

const handleLessonComplete = async () => {
  // Leçon réussie
  addCompletedLesson('lesson-123');
  
  // Le store met à jour automatiquement :
  // - totalLessonsCompleted += 1
  // - score += 10
  // - currentLevel peut passer au suivant
};
```

---

## 3️⃣ Hooks Personnalisés pour Accéder aux Stores

### useAuth.ts

```typescript
import { useAuthStore } from '@contexts/authStore';

export function useAuth() {
  const auth = useAuthStore();

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    clearError: auth.clearError,
  };
}
```

**Avantage** : Abstraction. Si on change de librairie d'état, on change juste le hook, pas 100 fichiers.

### Utilisation

```typescript
// ✅ Via hook (recommandé)
const { user, login } = useAuth();

// ❌ Directement du store (à éviter)
const { user, login } = useAuthStore();
```

---

## 🔄 Cycle de Vie Complet : Inscription → Accueil

### Étape 1 : Utilisateur s'inscrit

```typescript
// RegisterScreen.tsx
const { register } = useAuth();

const handleRegister = async () => {
  await register('Jean', 'jean@email.com', 'password', 'student');
};
```

### Étape 2 : Store exécute register()

```typescript
// authStore.ts
register: async (name, email, password, role) => {
  set((state) => {
    state.isLoading = true;
    state.error = null;
  });

  try {
    // Créer utilisateur en local (ou via API future)
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      createdAt: new Date(),
    };

    set((state) => {
      state.user = newUser;
      state.isAuthenticated = true;
      state.isLoading = false;
    });
  } catch (error) {
    set((state) => {
      state.error = error.message;
      state.isLoading = false;
    });
  }
};
```

### Étape 3 : RootNavigator détecte le changement

```typescript
// RootNavigator.tsx
export function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

// Quand isAuthenticated passe de false → true
// Le composant se re-render et affiche AppStack
```

### Étape 4 : Utilisateur voit l'app

```
AuthStack (Login/Register) → AppStack (Home + Tabs)
```

### Étape 5 : Persistance

```typescript
// Données sauvegardées en AsyncStorage automatiquement
// Au redémarrage de l'app :
const savedUser = await AsyncStorage.getItem('@tutoring_user');
// utilisateur reste connecté ✅
```

---

## 🎯 Patterns & Bonnes Pratiques

### 1. Garder le Store Minimal

```typescript
// ✅ BON : Store a juste l'état et actions
const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// ❌ MAUVAIS : Logique métier dans le store
const useStore = create((set) => ({
  user: null,
  complexBusinessLogic: () => { /* 100 lignes */ },
}));
```

### 2. Utiliser des Hooks pour Accéder

```typescript
// ✅ BON : Accès via hook
const { user } = useAuth();

// ❌ MAUVAIS : Accès direct au store partout
import { useAuthStore } from '@contexts/authStore';
const { user } = useAuthStore();
```

### 3. Séparer Lecture et Écriture

```typescript
// ✅ BON : Composant lit l'état
const MyComponent = () => {
  const user = useAuthStore((state) => state.user);
  // Se re-render juste si user change
};

// ❌ MAUVAIS : Lit tout l'état
const MyComponent = () => {
  const allState = useAuthStore();
  // Se re-render si n'importe quoi change
};
```

### 4. Gérer les Erreurs Proprement

```typescript
// ✅ BON : Error handling dans le store
login: async (email, password) => {
  try {
    // Authentification
  } catch (error) {
    set((state) => {
      state.error = error.message; // Store l'erreur
    });
  }
};

// Composant affiche l'erreur
if (error) <Text>{error}</Text>;
```

---

## 💾 Intégration avec AsyncStorage

```typescript
// Après chaque changement d'état, sauvegarder
login: async (email, password) => {
  // ... authentification ...
  
  set((state) => {
    state.user = user;
    state.isAuthenticated = true;
  });

  // Sauvegarder pour persistence
  await saveUser(user);
};
```

---

## 🚀 Évolution Future

### Avec Backend API

```typescript
login: async (email: string, password: string) => {
  set((state) => { state.isLoading = true; });

  try {
    // Appeler backend Django
    const response = await axios.post('/api/auth/login', {
      email,
      password,
    });

    const user = response.data.user;

    set((state) => {
      state.user = user;
      state.isAuthenticated = true;
      state.isLoading = false;
    });

    // Sauvegarder token
    await saveUser(user);
  } catch (error) {
    set((state) => {
      state.error = error.message;
      state.isLoading = false;
    });
  }
};
```

---

## 📊 Vue Résumée

| Composant | Rôle |
|-----------|------|
| **authStore** | Gère connexion, inscription, logout |
| **studentStore** | Gère progression scolaire |
| **useAuth hook** | Accès facile à authStore |
| **Immer** | Mutations faciles du state |
| **AsyncStorage** | Persistance données locales |

---

**Status** : ✅ State management simple, efficace et scalable
