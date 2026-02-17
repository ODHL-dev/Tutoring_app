# 📐 Architecture Générale du Projet

## Vue d'Ensemble

Le projet **Tutoring App** est une plateforme éducative basée sur **React Native** avec Expo. L'innovation principale est l'utilisation de **React Native Web**, qui permet d'avoir un **seul codebase** compilable pour :

- 📱 **iOS** (natif)
- 📱 **Android** (natif)
- 🌐 **Web** (navigateur)

### Avantages de cette Approche

| Aspect | Bénéfice |
|--------|----------|
| **Code Unique** | Une seule base à maintenir pour mobile + web |
| **Développement Rapide** | Hot reload sur tous les appareils |
| **Budget 0€** | Expo gratuit + Firebase Hosting gratuit | Hein fnx
| **Performance** | Code natif sur mobile, optimisé sur web |
| **Scalabilité** | Facile d'ajouter des fonctionnalités |

---

## 🏗️ Architecture en Couches

```
┌─────────────────────────────────────────────────────┐
│          Presentation Layer (UI)                    │
│  ┌──────────────────────────────────────────────┐   │
│  │  Screens (5) + Components (réutilisables)   │   │
│  │  Login, Register, Home, Chat, Lessons, etc. │   │
│  └──────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│          State Management & Logic Layer             │
│  ┌──────────────────────────────────────────────┐   │
│  │  Zustand Stores + Custom Hooks              │   │
│  │  - authStore (authentification)             │   │
│  │  - studentStore (progression)               │   │
│  │  - useAuth, useForm (hooks)                 │   │
│  └──────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│          Data Persistence Layer                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  AsyncStorage + SQLite (future)             │   │
│  │  Stockage local de:                         │   │
│  │  - Utilisateur                              │   │
│  │  - Progression scolaire                     │   │
│  │  - Historique chat                          │   │
│  │  - Leçons offline                           │   │
│  └──────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│          Business Logic Layer                       │
│  ┌──────────────────────────────────────────────┐   │
│  │  Validation + Utilities                     │   │
│  │  - validation.ts (email, password, etc.)    │   │
│  │  - Algorithmes (spaced repetition, etc.)    │   │
│  └──────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│          Framework & Libraries                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  React Native + React Navigation + Expo     │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Organisation Physique des Fichiers

```
tutoring-app/
│
├── src/
│   ├── screens/                 # 🎬 Écrans de l'app
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx  # Connexion
│   │   │   └── RegisterScreen.tsx # Inscription
│   │   ├── HomeScreen.tsx       # Accueil
│   │   ├── ChatScreen.tsx       # Tuteur IA
│   │   ├── LessonsScreen.tsx    # Leçons
│   │   └── ProfileScreen.tsx    # Profil
│   │
│   ├── components/              # 🔧 Composants réutilisables
│   │   ├── Button.tsx           # Bouton standard
│   │   └── TextField.tsx        # Champ de texte
│   │
│   ├── hooks/                   # 🎣 Custom React Hooks
│   │   ├── useAuth.ts           # Gestion authentification
│   │   └── useForm.ts           # Gestion formulaires
│   │
│   ├── contexts/                # 🌍 État Global (Zustand)
│   │   ├── authStore.ts         # Store authentification
│   │   └── studentStore.ts      # Store progression
│   │
│   ├── storage/                 # 💾 Persistance Données
│   │   └── asyncStorage.ts      # Utilitaires AsyncStorage
│   │
│   ├── styles/                  # 🎨 Design System
│   │   └── theme.ts             # Couleurs, typo, spacing
│   │
│   ├── utils/                   # 🛠️ Utilitaires
│   │   └── validation.ts        # Validation formulaires
│   │
│   ├── navigation/              # 🗺️ Navigation
│   │   └── RootNavigator.tsx    # Configuration navigation
│   │
│   └── App.tsx                  # 🚀 Point d'entrée principal
│
├── index.tsx                    # Expo entry point
├── app.json                     # Configuration Expo
├── package.json                 # Dépendances npm
├── tsconfig.json                # Config TypeScript
├── .prettierrc                  # Format code
├── .eslintrc.json               # Linting
└── README.md                    # Documentation
```

---

## 🔄 Flux de Données Principal

### Exemple : Utilisateur se connecte

```
1. User remplit le formulaire Login
   ↓
2. handleSubmit() → validation (utils/validation.ts)
   ↓
3. useAuth() → appelle authStore.login()
   ↓
4. Store Zustand met à jour state
   ↓
5. Data sauvegardée en AsyncStorage
   ↓
6. isAuthenticated devient true
   ↓
7. Navigation change automatiquement vers AppStack
   ↓
8. User voit la page d'accueil
```

### Diagramme Flux Général

```
┌─────────────────┐
│  React Component│
│   (Screen/UI)   │
└────────┬────────┘
         │ onPress/onChange
         ↓
┌─────────────────────────────┐
│    Custom Hook              │
│  (useAuth, useForm, etc.)   │
└────────┬────────────────────┘
         │ Appelle store
         ↓
┌─────────────────────────────┐
│    Zustand Store            │
│  (authStore, studentStore)  │
└────────┬────────────────────┘
         │ Persiste données
         ↓
┌─────────────────────────────┐
│    AsyncStorage             │
│  (Stockage local device)    │
└─────────────────────────────┘

← Le state change
← Component se re-render automatiquement (via hook)
← UI mise à jour
```

---

## 🎯 Points Clés de l'Architecture

### 1. **Séparation des Responsabilités**
- **Screens** : Affichage uniquement
- **Hooks** : Logique métier
- **Stores** : Gestion état global
- **Utils** : Fonctions pures réutilisables

### 2. **Réactivité Automatique**
Avec Zustand + React hooks, les composants se mettent à jour automatiquement quand le state change. **Pas de Redux boilerplate**.

### 3. **Type Safety**
TypeScript strict partout → erreurs détectées au build, pas en production.

### 4. **Hors-Ligne First**
Tout fonctionne en local d'abord, synchronisation cloud après.

### 5. **Maintenabilité**
- Path aliases (`@components`, `@screens`, etc.)
- Naming conventions claires
- Dossiers organisés par feature

---

## 📊 Dépendances Principales

```javascript
{
  "React": "18.2.0",           // Framework UI
  "React Native": "0.72.0",     // Framework mobile
  "React Native Web": "0.18.11",// Web compilation
  "Expo": "49.0.0",             // Plateforme Expo
  "React Navigation": "6.1.9",  // Navigation
  "Zustand": "4.4.1",           // State management
  "AsyncStorage": "1.21.0",     // Local storage
  "TypeScript": "5.2.2"         // Type safety
}
```

---

## 🔐 Authentification & Sécurité

```
┌──────────────────────┐
│  User Actions        │
│ (Login/Register)     │
└──────────┬───────────┘
           ↓
┌──────────────────────────────┐
│ Validation                    │
│ - Email format               │
│ - Password strength          │
│ - Champs requis              │
└──────────┬───────────────────┘
           ↓
┌──────────────────────────────┐
│ Authentication Store (Zustand)│
│ - Encrypt & store credentials│
│ - Gère tokens (future)       │
└──────────┬───────────────────┘
           ↓
┌──────────────────────────────┐
│ AsyncStorage                  │
│ - Persistance locale          │
│ - Accessible offline          │
└──────────────────────────────┘
```

---

## 🚀 Cycle de Vie de l'App

```
1. App.tsx se charge
   ↓
2. RootNavigator lit isAuthenticated
   ↓
3. Si NOT authenticated → Montre LoginScreen/RegisterScreen
   Si authenticated → Montre HomeScreen + Tabs
   ↓
4. User peut naviguer entre les écrans
   ↓
5. Données sont automatiquement sauvegardées en AsyncStorage
   ↓
6. Si ferme l'app → Données restent (grâce au storage)
   ↓
7. Si rouvre l'app → State récupéré depuis le storage
```

---

## 🎓 Concepts Importants

### État Global avec Zustand
Le state est centralisé dans des "stores" Zustand. Pas besoin de passer props à travers 10 niveaux de composants.

### Persistance Automatique
AsyncStorage sauvegarde automatiquement les données importantes(Sauvegarde dans quoi ?). Hors-ligne = pas de problème.

### Navigation Intelligente
React Navigation change automatiquement l'écran selon `isAuthenticated`. Pas de logique conditionnelle compliquée.

### Validation Côté Client
Toutes les données sont validées AVANT d'être envoyées. Meilleure UX + moins de requêtes inutiles.

---

## ✅ Prochaines Étapes d'Intégration

1. **Backend API** → Remplacer les mock data par des vraies API
2. **Chat IA** → TensorFlow.js + Llama local
3. **OCR** → ML Kit pour exercices papier
4. **Synchronisation Cloud** → Django backend
5. **Gamification** → Avatar évolutif
6. **Tests** → Jest + React Testing Library

---

**Status** : ✅ Architecture fondamentale établie et documentée
