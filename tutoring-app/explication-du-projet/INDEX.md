# 📚 Index Complet - Explication du Projet

## Bienvenue ! 👋

Ce répertoire contient la **documentation complète** du projet **Tutoring App**. Chaque fichier explique en détail une grande partie du projet.

---

## 📖 Table des Matières

### 1️⃣ [Architecture Générale](01-architecture-generale.md)
**Où?** `explication-du-projet/01-architecture-generale.md`

Comprendre la structure globale du projet :
- Vue d'ensemble (React Native + Web)
- Architecture en couches
- Organisation des fichiers
- Flux de données principal
- Points clés de l'architecture

**Pour qui?** Développeurs qui veulent comprendre le "grand tableau"

---

### 2️⃣ [State Management avec Zustand](02-state-management.md)
**Où?** `explication-du-projet/02-state-management.md`

Comment gérer l'état global de l'application :
- Qu'est-ce que Zustand et pourquoi l'utiliser
- Store d'authentification
- Store de progression élève
- Hooks personnalisés pour accéder aux stores
- Intégration avec AsyncStorage
- Patterns et bonnes pratiques

**Pour qui?** Développeurs travaillant sur logique métier et état

**Fichiers associés:**
- `src/contexts/authStore.ts`
- `src/contexts/studentStore.ts`
- `src/hooks/useAuth.ts`

---

### 3️⃣ [Système d'Authentification](03-authentification.md)
**Où?** `explication-du-projet/03-authentification.md`

Comprendre le flux complet d'authentification :
- Architecture d'authentification
- Flux Login détaillé (8 étapes)
- Flux Register détaillé
- Validation des données
- Gestion des erreurs
- Sécurité et bonnes pratiques
- Intégration future avec backend Django

**Pour qui?** Développeurs travaillant sur auth/login

**Fichiers associés:**
- `src/screens/auth/LoginScreen.tsx`
- `src/screens/auth/RegisterScreen.tsx`
- `src/contexts/authStore.ts`
- `src/utils/validation.ts`

---

### 4️⃣ [Navigation et Routing](04-navigation.md)
**Où?** `explication-du-projet/04-navigation.md`

Comprendre la navigation de l'app :
- Qu'est-ce que React Navigation
- Architecture Stack + Tab
- RootNavigator (le coeur de la nav)
- Navigation conditionnelle (Auth vs App)
- Transitions et animations
- Deep linking
- Passage de paramètres

**Pour qui?** Développeurs ajoutant nouveaux écrans

**Fichiers associés:**
- `src/navigation/RootNavigator.tsx`
- `src/screens/auth/LoginScreen.tsx` (navigation)
- `src/screens/HomeScreen.tsx` (navigation)

---

### 5️⃣ [Stockage des Données & AsyncStorage](05-storage-asyncstorage.md)
**Où?** `explication-du-projet/05-storage-asyncstorage.md`

Comment persister les données localement :
- Qu'est-ce qu'AsyncStorage
- Fonctions de sauvegarde/récupération
- Utilisateur storage
- Chat history storage
- Leçons storage
- Flux complet offline mode
- Sécurité et chiffrement
- Intégration avec Zustand
- Stratégie de sync (futur)

**Pour qui?** Développeurs travaillant sur persistance/offline

**Fichiers associés:**
- `src/storage/asyncStorage.ts`
- `src/contexts/authStore.ts` (integration)

---

### 6️⃣ [Design System & Styles](06-design-system.md)
**Où?** `explication-du-projet/06-design-system.md`

Créer une UI cohérente et belle :
- Pourquoi un Design System
- Système de couleurs (Indigo, Émeraude, etc.)
- Typography hierarchy
- Spacing system
- Border radius & shadows
- Global styles
- Utilisation dans les composants
- Responsive design
- Dark mode (futur)

**Pour qui?** Designers et dev frontend travaillant sur UI

**Fichiers associés:**
- `src/styles/theme.ts`
- `src/components/Button.tsx`
- `src/components/TextField.tsx`

---

### 7️⃣ [Hooks & Utilitaires Personnalisés](07-hooks-utilitaires.md)
**Où?** `explication-du-projet/07-hooks-utilitaires.md`

Créer et utiliser les hooks réutilisables :
- Qu'est-ce qu'un custom hook
- Hook useAuth (accès au store)
- Hook useForm (gestion formulaires)
- Validation functions (email, password, name)
- Validation forms complets
- Pattern Hook + Validation + Store
- Bonnes pratiques
- Futurs hooks

**Pour qui?** Développeurs créant features réutilisables

**Fichiers associés:**
- `src/hooks/useAuth.ts`
- `src/hooks/useForm.ts`
- `src/utils/validation.ts`

---

### 8️⃣ [Refonte UI Responsive](08-refonte-ui-responsive.md)
**Où?** `explication-du-projet/08-refonte-ui-responsive.md`

Comprendre la mise en forme responsive mobile + web :
- Migration de NativeWind à @expo/vector-icons
- Design system centralisé (theme.ts)
- Système d'icônes vectorielles (@expo/vector-icons)
- Composants réutilisables et stylisés
- Layout responsive (2 colonnes mobile, 4 colonnes web)
- Breakpoints et stratégie mobile-first
- Principes d'accessibilité
- Fixes layout et spacing
- Problèmes résolus (Quick Actions, superposition)

**Pour qui?** Designers et développeurs travaillant sur l'UI/UX

**Fichiers associés:**
- `src/styles/theme.ts` (design system)
- `src/components/Icon.tsx` (wrapper icônes)
- `src/components/QuickActionButton.tsx` (raccourcis)
- `src/screens/auth/LoginScreen.tsx`
- `src/screens/auth/RegisterScreen.tsx`
- `src/screens/HomeScreen.tsx`

---

### 9️⃣ [Dark Mode & Thème Système](09-dark-mode.md)
**Où?** `explication-du-projet/09-dark-mode.md`

Implémenter un système de thème clair/sombre :
- Pourquoi un mode sombre (UX, batterie, accessibilité)
- Architecture du système de thème
- Palettes de couleurs (lightColors vs darkColors)
- themeStore.ts avec Zustand et AsyncStorage
- Hook useTheme() personnalisé
- Détection du thème système (Appearance)
- Toggle manuel vs. thème système
- Integration dans tous les composants
- Animations et transitions
- Performance et optimisations

**Pour qui?** Designers et développeurs travaillant sur UI/UX et thème

**Fichiers associés:**
- `src/contexts/themeStore.ts`
- `src/hooks/useTheme.ts`
- `src/styles/theme.ts` (lightColors, darkColors)
- `src/screens/SettingsScreen.tsx` (toggle)
- `src/App.tsx` (initialization)

---

### 🔟 [Settings Screen & User Preferences](10-settings-screen.md)
**Où?** `explication-du-projet/10-settings-screen.md`

Créer l'écran des paramètres utilisateur :
- Structure de SettingsScreen
- 4 sections principales :
  * Préférences (notifications, sons, langue, dark mode, thème système)
  * Compte (profil, sécurité, confidentialité)
  * Support (aide, contact, évaluer app)
  * À propos (version, conditions, politique)
- Integration avec themeStore et useTheme()
- Navigation depuis HeaderUser
- État persistant avec AsyncStorage
- Icônes vectorielles @expo/vector-icons
- Responsive et accessible

**Pour qui?** Développeurs créant features de paramètres

**Fichiers associés:**
- `src/screens/SettingsScreen.tsx`
- `src/contexts/themeStore.ts`
- `src/hooks/useTheme.ts`
- `src/components/HeaderUser.tsx` (navigation settings)

---

### 1️⃣1️⃣ [Password Visibility & Enhanced TextField](11-password-visibility.md)
**Où?** `explication-du-projet/11-password-visibility.md`

Améliorer la sécurité et l'UX du TextField :
- Composant TextField réutilisable
- Toggle voir/masquer mot de passe
- Icônes eye/eye-off (@expo/vector-icons Feather)
- Gestion d'état (showPassword boolean)
- Props secureTextEntry et TextInput
- Styling et positionnement de l'icône
- Utilisations dans LoginScreen et RegisterScreen
- Accessibilité et conventions UX
- Sécurité (cache écran, presse-papiers)

**Pour qui?** Développeurs créant formulaires et features de sécurité

**Fichiers associés:**
- `src/components/TextField.tsx`
- `src/screens/auth/LoginScreen.tsx` (usage)
- `src/screens/auth/RegisterScreen.tsx` (usage)
- `src/components/Icon.tsx` (wrapper icônes)

---

```
LOGIN SCREEN
    ↓
useForm (gère email/password)
    ↓
TextField (see/hide password toggle)
    ↓
validation.ts (valide format)
    ↓
useAuth (appelle store)
    ↓
authStore Zustand (Zustand gère)
    ↓
AsyncStorage (sauvegarde local + thème)
    ↓
themeStore (détecte thème système)
    ↓
RootNavigator détecte isAuthenticated = true
    ↓
HOME SCREEN (avec thème dynamique)
    ↓
SettingsScreen (toggle thème manuel)
```

---

## 🎯 Par Rôle

### Je suis Frontend Developer

Lire dans cet ordre :
1. [Architecture Générale](01-architecture-generale.md) - Comprendre la structure
2. [Navigation](04-navigation.md) - Ajouter des écrans
3. [Design System](06-design-system.md) - Créer une belle UI
4. [State Management](02-state-management.md) - Connecter les données

### Je suis Developer Backend/API

Lire dans cet ordre :
1. [Architecture Générale](01-architecture-generale.md)
2. [Authentication](03-authentification.md) - Points de connexion API
3. [State Management](02-state-management.md) - Comment les données arrivent

### Je suis Lead Developer

Lire tout dans cet ordre :
1. [Architecture Générale](01-architecture-generale.md)
2. [State Management](02-state-management.md)
3. [Navigation](04-navigation.md)
4. [Authentication](03-authentification.md)
5. [Storage](05-storage-asyncstorage.md)
6. [Design System](06-design-system.md)
7. [Hooks & Utils](07-hooks-utilitaires.md)

### Je débute en React Native

Lire dans cet ordre :
1. [Architecture Générale](01-architecture-generale.md) - Vue d'ensemble
2. [Hooks & Utilitaires](07-hooks-utilitaires.md) - Les bases
3. [Design System](06-design-system.md) - Comment styliser
4. [State Management](02-state-management.md) - Gérer l'état
5. [Navigation](04-navigation.md) - Les écrans

---

## 📁 Structure du Répertoire

```
explication-du-projet/
├── 01-architecture-generale.md       ← À lire en premier
├── 02-state-management.md            ← Zustand & stores
├── 03-authentification.md            ← Login/Register flow
├── 04-navigation.md                  ← Écrans et routing
├── 05-storage-asyncstorage.md        ← Sauvegarde locale
├── 06-design-system.md               ← UI/Styles
├── 07-hooks-utilitaires.md           ← Hooks personnalisés
├── 08-refonte-ui-responsive.md       ← Migration NativeWind → Icônes
├── 09-dark-mode.md                   ← Thème clair/sombre + système
├── 10-settings-screen.md             ← Écran paramètres utilisateur
├── 11-password-visibility.md         ← TextField avec see/hide password
└── INDEX.md                          ← Ce fichier
```

---

## 🔗 Liens entre Documents

### Architecture Générale
→ Introduit tous les concepts, liés vers autres docs

### State Management
← Référencé par Architecture
→ Utilise Hooks & Utils
→ Utilise Storage

### Authentication
← Référencé par Architecture
→ Utilise State Management
→ Utilise Navigation
→ Utilise Hooks & Utils

### Navigation
← Référencé par Architecture
→ Utilise Authentication
→ Modifie State Management

### Storage
← Référencé par State Management
← Référencé par Authentication

### Design System
← Référencé par Architecture
→ Utilisé par tous les composants

### Hooks & Utils
← Référencé par Authentication
← Référencé par State Management
→ Utilise Design System

---

## 🚀 Quickstart : Commencer à Développer

1. **Lire [Architecture Générale](01-architecture-generale.md)** (15 min)
   → Comprendre la structure

2. **Lire [Navigation](04-navigation.md)** (10 min)
   → Comprendre comment ajouter un écran

3. **Lire [Design System](06-design-system.md)** (10 min)
   → Comprendre comment styliser

4. **Lire [Hooks & Utils](07-hooks-utilitaires.md)** (15 min)
   → Comprendre comment créer logique réutilisable

5. **Code !**
   → Créer une feature simple (button → écran → navigation)

---

## ❓ FAQ

**Q: Par où commencer si je suis nouveau ?**
A: [Architecture Générale](01-architecture-generale.md), puis naviguez selon votre rôle ci-dessus.

**Q: Je veux juste styliser un composant ?**
A: [Design System](06-design-system.md) section "Utilisation dans les Composants".

**Q: Je veux comprendre le login ?**
A: [Authentication](03-authentification.md) section "Flux Complet : Login".

**Q: Comment ajouter un nouvel écran ?**
A: [Navigation](04-navigation.md) section "Navigation entre Écrans".

**Q: Où faire mes changements ?**
A: Voir `../src/` pour le code, `../README.md` pour overview générale.

---

## 📊 Métadonnées

| Document | Fichiers Associés | Lecture | Difficulté |
|----------|-------------------|---------|-----------|
| Architecture | Tous | 20 min | ⭐ Facile |
| State Management | contexts, hooks | 25 min | ⭐⭐ Moyen |
| Authentication | screens/auth, utils | 30 min | ⭐⭐ Moyen |
| Navigation | navigation, screens | 20 min | ⭐ Facile |
| Storage | storage, contexts | 15 min | ⭐ Facile |
| Design System | styles, components | 25 min | ⭐ Facile |
| Hooks & Utils | hooks, utils | 20 min | ⭐⭐ Moyen |
| Refonte UI | components, screens | 20 min | ⭐⭐ Moyen |
| Dark Mode | contexts, hooks, styles | 20 min | ⭐⭐ Moyen |
| Settings | screens, contexts | 15 min | ⭐ Facile |
| Password Visibility | components, screens | 10 min | ⭐ Facile |

---

## ✅ Checklist : Avant de Coder

- [ ] Lire [Architecture Générale](01-architecture-generale.md)
- [ ] Lire le document lié à ma tâche
- [ ] Regarder les fichiers associés mentionnés
- [ ] Comprendre le flux de données
- [ ] Demander si quelque chose est pas clair

---

## 💡 Conseils

✅ **Lire les docs dans l'ordre suggéré** - Elles s'appuient les unes sur les autres

✅ **Ouvrir le code pendant la lecture** - Voir le code réel aux côtés des explications

✅ **Tester localement** - Lancer l'app avec `npm start` et explorer

✅ **Poser des questions** - Si une explication n'est pas claire, améliore-la

---

## 🎓 Ressources Externes

- **React Native Docs** : https://reactnative.dev
- **Expo Docs** : https://docs.expo.dev
- **React Navigation** : https://reactnavigation.org
- **Zustand** : https://github.com/pmndrs/zustand
- **TypeScript** : https://www.typescriptlang.org

---

## 📝 Version & Status

- **Dernière mise à jour** : 27 Janvier 2026
- **Status** : ✅ Documentation complète (11 sections)
- **Version du Projet** : 0.2.0 (UI + Dark Mode + Settings)
- **Base architecture stable** ✅
- **Dark mode système** ✅
- **Settings & Preferences** ✅

---

**Besoin d'aide ?** Lire l'index, puis le document pertinent. Si toujours pas clair, ouvrir le code associé.

**Bonne lecture ! 🚀**
