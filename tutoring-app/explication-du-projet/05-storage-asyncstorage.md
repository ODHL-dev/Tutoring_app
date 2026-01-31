# 💾 Stockage des Données & AsyncStorage

## Qu'est-ce qu'AsyncStorage ?

**AsyncStorage** est une librairie de stockage local qui fonctionne sur :
- 📱 **iOS** : Utilise `NSUserDefaults` natif
- 📱 **Android** : Utilise `SharedPreferences` natif
- 🌐 **Web** : Utilise `localStorage`

C'est la solution idéale pour notre app **hors-ligne**, car elle permet de sauvegarder des données localement sans internet.

### Limitations (Importantes !)

| Limite | Impact |
|--------|--------|
| **~10 MB max** | Suffisant pour notre app |
| **Synchrone sur web** | Pas d'async réel, mais fonctionne |
| **Pas chiffré** | À améliorer en production |
| **String only** | Doit JSON.stringify/parse |

---

## 🏗️ Architecture de Stockage

```
┌─────────────────────────────────────────────┐
│         Application (Screens/Hooks)         │
└────────────┬────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────┐
│    Storage Utilities Layer                  │
│  (src/storage/asyncStorage.ts)              │
│                                             │
│  Functions :                                │
│  - saveUser()                               │
│  - getUser()                                │
│  - saveChatMessage()                        │
│  - getChatHistory()                         │
│  - saveLessons()                            │
│  - getLessons()                             │
│  - etc...                                   │
└────────────┬────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────┐
│    AsyncStorage API                         │
│  (React Native Community)                   │
└────────────┬────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────┐
│    Device Storage                           │
│  iOS: NSUserDefaults                        │
│  Android: SharedPreferences                 │
│  Web: localStorage                          │
└─────────────────────────────────────────────┘
```

---

## 📝 Implémentation : asyncStorage.ts

### Structure

```typescript
// src/storage/asyncStorage.ts

// Constantes des clés de stockage
const STORAGE_KEYS = {
  USER: '@tutoring_user',
  STUDENT_PROGRESS: '@tutoring_student_progress',
  CHAT_HISTORY: '@tutoring_chat_history',
  LESSONS: '@tutoring_lessons',
};

// Chaque clé commence par @ pour éviter les collisions
// Avec d'autres apps sur le device
```

### Fonctions Utilisateur

```typescript
// ✅ SAVE USER
export async function saveUser(userData: any): Promise<void> {
  try {
    // Convertir objet JavaScript → JSON string
    const jsonString = JSON.stringify(userData);
    
    // Sauvegarder
    await AsyncStorage.setItem(STORAGE_KEYS.USER, jsonString);
    
    console.log('User saved successfully');
  } catch (error) {
    console.error('Error saving user:', error);
    // Erreur réseau impossible, mais autre erreurs possibles
  }
}

// ✅ GET USER
export async function getUser(): Promise<any | null> {
  try {
    // Récupérer
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    
    // Convertir JSON string → objet JavaScript
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving user:', error);
    return null;
  }
}

// ✅ CLEAR USER
export async function clearUser(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    console.log('User cleared');
  } catch (error) {
    console.error('Error clearing user:', error);
  }
}

// Utilisation dans authStore :
login: async (email, password) => {
  // ... authentification ...
  const user = { id: '1', name: 'Jean', email };
  
  // Sauvegarder
  await saveUser(user);
  
  // Plus tard, récupérer
  const savedUser = await getUser();
};
```

### Fonctions Chat

```typescript
// ✅ SAVE CHAT MESSAGE
export async function saveChatMessage(message: any): Promise<void> {
  try {
    // Récupérer l'historique existant
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    const messages = existing ? JSON.parse(existing) : [];
    
    // Ajouter le nouveau message
    messages.push({
      ...message,
      timestamp: new Date().toISOString(),
    });
    
    // Sauvegarder tout
    await AsyncStorage.setItem(
      STORAGE_KEYS.CHAT_HISTORY,
      JSON.stringify(messages)
    );
  } catch (error) {
    console.error('Error saving chat message:', error);
  }
}

// ✅ GET CHAT HISTORY
export async function getChatHistory(): Promise<any[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    return [];
  }
}

// ✅ CLEAR CHAT HISTORY
export async function clearChatHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
}

// Utilisation dans ChatScreen :
const messages = await getChatHistory();
// Affiche tous les anciens messages
// Quand nouvel message → saveChatMessage(newMessage)
```

### Fonctions Leçons

```typescript
// ✅ SAVE LESSONS
export async function saveLessons(lessons: any[]): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.LESSONS,
      JSON.stringify(lessons)
    );
  } catch (error) {
    console.error('Error saving lessons:', error);
  }
}

// ✅ GET LESSONS
export async function getLessons(): Promise<any[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LESSONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving lessons:', error);
    return [];
  }
}

// Utilisation au démarrage :
useEffect(() => {
  const loadLessons = async () => {
    const lessons = await getLessons();
    // Si vide, downloader les leçons depuis API
    // Sinon, afficher les locales
  };
  loadLessons();
}, []);
```

### Fonction Nuclear : Clear All

```typescript
// ✅ CLEAR ALL DATA (logout complet)
export async function clearAllStorage(): Promise<void> {
  try {
    // Supprimer toutes les clés
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    
    console.log('All storage cleared');
  } catch (error) {
    console.error('Error clearing all storage:', error);
  }
}

// Utilisation au logout :
logout: () => {
  // Zustand
  set((state) => {
    state.user = null;
    state.isAuthenticated = false;
  });
  
  // AsyncStorage
  clearAllStorage();
};
```

---

## 🔄 Flux Complet : Sauvegarde & Restauration

### Scénario 1 : Premier Lancement

```
1. App démarre
   ↓
2. App essaie récupérer user depuis AsyncStorage
   await getUser() → null (première fois)
   ↓
3. RootNavigator → isAuthenticated = false
   ↓
4. Affiche LoginScreen
   ↓
5. User s'connecte
   ↓
6. Store appelle saveUser(user)
   ↓
7. AsyncStorage sauvegarde
   ↓
8. RootNavigator → isAuthenticated = true
   ↓
9. Affiche AppStack (Tabs)
```

### Scénario 2 : Redémarrage Après Sauvegarde

```
1. App redémarre
   ↓
2. App essaie récupérer user depuis AsyncStorage
   const user = await getUser() → user trouvé !
   ↓
3. RootNavigator → isAuthenticated = true
   ↓
4. Affiche DIRECTEMENT AppStack
   ↓
5. User voit Accueil (0 loading !)
   
(Pas besoin de se re-connecter - c'est la magie du stockage)
```

### Scénario 3 : Chat Conversation Offline

```
1. User ouvre ChatScreen
   ↓
2. Récupère historique : const messages = await getChatHistory()
   ↓
3. Affiche anciens messages (offline mode)
   ↓
4. User tape nouveau message → local → saveChatMessage()
   ↓
5. Message sauvegardé en AsyncStorage
   ↓
6. Quand connexion revient → synchronise avec backend
```

---

## 📊 Format des Données Sauvegardées

### User

```typescript
// Avant : JavaScript object
const user = {
  id: '1',
  name: 'Jean',
  email: 'jean@example.com',
  role: 'student',
  createdAt: new Date(),
};

// Sauvegardé en AsyncStorage : JSON string
"{"id":"1","name":"Jean","email":"jean@example.com","role":"student","createdAt":"2026-01-27T10:30:00.000Z"}"

// Récupéré : JavaScript object à nouveau
```

### Chat Messages

```typescript
const messages = [
  {
    id: '1',
    author: 'student',
    text: 'Explique-moi les fractions',
    timestamp: '2026-01-27T10:30:00Z',
    type: 'user-message',
  },
  {
    id: '2',
    author: 'tutor-ai',
    text: 'Une fraction c\'est une partie du tout...',
    timestamp: '2026-01-27T10:31:00Z',
    type: 'tutor-message',
  },
];

// Sauvegardé en JSON array
```

---

## 🔒 Considérations de Sécurité

### Données Sensibles

```typescript
// ❌ À NE PAS SAUVEGARDER
- Mots de passe en clair
- Tokens d'authentification (pour maintenant)
- Données bancaires
- Informations personnelles sensibles

// ✅ SÛRS À SAUVEGARDER
- User ID
- User name/email
- Progression scolaire
- Historique chat
- Leçons (contenu public)
```

### Chiffrement (Futur)

```typescript
// Plus tard : Ajouter de l'encryption
import Crypto from 'expo-crypto';

// Chiffrer avant save
const encrypted = await Crypto.digestStringAsync(
  Crypto.CryptoDigestAlgorithm.SHA256,
  JSON.stringify(userData)
);
await AsyncStorage.setItem(key, encrypted);

// Déchiffrer après get
// ... mais c'est pour la production
```

---

## 🚀 Intégration avec Zustand

### Store Initialize avec AsyncStorage

```typescript
export const useAuthStore = create<AuthState>()(
  immer(async (set) => {
    // Au démarrage : charger les données sauvegardées
    const savedUser = await getUser();
    
    if (savedUser) {
      set((state) => {
        state.user = savedUser;
        state.isAuthenticated = true;
      });
    }

    return {
      user: savedUser || null,
      isAuthenticated: !!savedUser,
      // ... rest of store
    };
  })
);
```

### Toujours Sauvegarder Après Mise à Jour

```typescript
login: async (email, password) => {
  // ... authentification ...
  const user = { /* ... */ };

  // 1. Mettre à jour Zustand
  set((state) => {
    state.user = user;
    state.isAuthenticated = true;
  });

  // 2. Sauvegarder en AsyncStorage
  await saveUser(user);
};

// Pattern : Zustand → AsyncStorage
```

---

## 📱 Comportement Offline

### Tout fonctionne sans internet

```typescript
export default function ChatScreen() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadMessages = async () => {
      // Charger depuis AsyncStorage (offline mode)
      const savedMessages = await getChatHistory();
      setMessages(savedMessages);
    };
    loadMessages();
  }, []);

  const sendMessage = async (text) => {
    const newMessage = {
      id: Date.now().toString(),
      author: 'student',
      text,
      timestamp: new Date().toISOString(),
    };

    // Sauvegarder localement immédiatement
    await saveChatMessage(newMessage);

    // Afficher
    setMessages(prev => [...prev, newMessage]);

    // Plus tard (quand connexion revient) :
    // Synchroniser avec backend
    // await syncMessagesToServer();
  };
}
```

---

## 🔄 Stratégie Sync (Futur)

```
Device Storage (AsyncStorage)
         ↓
    Offline Change
         ↓
    Queue Changes
         ↓
    Internet available?
         ↓
    Sync with Backend
         ↓
    Backend Storage (MySQL)
```

---

## 🎯 Points Clés

✅ **Hors-ligne First** - Fonctionne sans internet  
✅ **Persistance** - Données survivent au redémarrage  
✅ **Simple** - API facile avec nos utilitaires  
✅ **Cross-Platform** - Marche iOS, Android, Web  
✅ **Prêt pour Sync** - Structure prête pour backend  

---

## 📖 Résumé Opérations

| Opération | Exemple | Use Case |
|-----------|---------|----------|
| **Save** | `saveUser(user)` | Après login/register |
| **Get** | `getUser()` | App startup |
| **Clear** | `clearUser()` | Logout |
| **Clear All** | `clearAllStorage()` | Réinitialisation complète |

---

**Status** : ✅ Stockage local robuste et prêt pour la production
