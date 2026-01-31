# Tutoring App - Architecture & Setup

## 📦 Structure du Projet

```
tutoring-app/
├── src/
│   ├── screens/              # Écrans de l'application
│   │   ├── auth/             # Écrans d'authentification
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx    # Écran d'accueil
│   │   ├── ChatScreen.tsx    # Interface tuteur IA
│   │   ├── LessonsScreen.tsx # Gestion des leçons
│   │   └── ProfileScreen.tsx # Profil utilisateur
│   │
│   ├── components/           # Composants réutilisables
│   │   ├── Button.tsx        # Bouton
│   │   └── TextField.tsx     # Champ de texte
│   │
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.ts        # Hook authentification
│   │   └── useForm.ts        # Hook gestion formulaires
│   │
│   ├── contexts/             # État global (Zustand)
│   │   ├── authStore.ts      # Store authentification
│   │   └── studentStore.ts   # Store progression élève
│   │
│   ├── storage/              # Gestion du stockage local
│   │   └── asyncStorage.ts   # AsyncStorage utilities
│   │
│   ├── styles/               # Styles & thème
│   │   └── theme.ts          # Couleurs, typography, spacing
│   │
│   ├── utils/                # Utilitaires
│   │   └── validation.ts     # Fonctions validation
│   │
│   ├── navigation/           # Navigation
│   │   └── RootNavigator.tsx # Configuration navigation
│   │
│   └── App.tsx               # Point d'entrée principal
│
├── index.tsx                 # Entry point Expo
├── app.json                  # Configuration Expo
├── tsconfig.json             # Configuration TypeScript
├── package.json              # Dépendances
├── .env                      # Variables d'environnement
├── .gitignore                # Fichiers à ignorer
├── .prettierrc                # Configuration Prettier
└── .eslintrc.json            # Configuration ESLint
```

## 🚀 Installation & Démarrage

### Prérequis
- Node.js >= 16
- npm ou yarn
- Expo CLI : `npm install -g expo-cli`

### Installation
```bash
cd tutoring-app
npm install
```

### Démarrage du projet

**Mode développement (tous les appareils) :**
```bash
npm start
```

**Spécifique :**
```bash
npm run web      # Web
npm run ios      # iOS
npm run android  # Android
```

## 📱 Architecture Frontend

### State Management (Zustand)
- `authStore.ts` : Authentification utilisateur
- `studentStore.ts` : Progression scolaire

### Storage Local (AsyncStorage)
- Persistance utilisateur
- Historique chat
- Progression élève
- Données leçons

### Navigation (React Navigation)
- Stack Navigator : Authentification
- Bottom Tab Navigator : App principale

## 🎨 Design System

### Couleurs
- **Primary** : Indigo (#6366F1)
- **Secondary** : Émeraude (#10B981)
- **Accent** : Ambre (#F59E0B)
- **Status** : Rouge (erreur), Vert (succès), Orange (warning)

### Typography
- H1, H2, H3, H4 : Titres
- Body1, Body2 : Corps de texte
- Caption, Label : Petit texte

### Spacing
- xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 24px, xxl: 32px

## 🔄 Flux de Données

```
User Input → Hook (useForm, useAuth)
         ↓
Store (Zustand)
         ↓
Storage (AsyncStorage)
         ↓
Render (Components)
```

## 🔐 Authentification

**Flow :**
1. User remplit Login/Register
2. Validation via `utils/validation.ts`
3. `useAuth()` appelle store
4. Store sauvegarde en AsyncStorage
5. Navigation change automatiquement

## ✅ Prochaines Étapes

- [ ] Intégrer backend API (Django)
- [ ] Implémenter Chat IA (TensorFlow.js + Llama)
- [ ] OCR pour exercices papier
- [ ] Synchronisation Cloud
- [ ] Dashboard Enseignant
- [ ] Gamification & Avatar

---

**Status** : ✅ Base fonctionnelle | 🔄 En développement
