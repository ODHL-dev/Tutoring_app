# SETUP.md - Guide de Configuration

## 🚀 Mise en Place du Projet

### Étape 1 : Initialiser le repository Git

```bash
cd tutoring-app
git init
git add .
git commit -m "Initial commit: Expo project base structure"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tutoring-app.git
git push -u origin main
```

### Étape 2 : Installer les dépendances

```bash
npm install
# ou
yarn install
```

### Étape 3 : Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine :

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=30000

# Firebase Configuration (optionnel)
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_PROJECT_ID=your_project_id

# Expo Configuration
EXPO_PUBLIC_PROJECT_ID=your_eas_project_id
```

### Étape 4 : Démarrer le développement

#### Mode Web (React Native Web)
```bash
npm run web
```
Accédez à `http://localhost:19006`

#### Mode Mobile (Expo)
```bash
npm start
```
- **iOS** : Tapez `i`
- **Android** : Tapez `a`
- **Web** : Tapez `w`

### Étape 5 : Build pour Production

#### Web (Static Export)
```bash
npm run build:web
# Sortie : `web-build/` (à déployer sur Firebase/Vercel)
```

#### iOS/Android (EAS)
```bash
# Configuration EAS (une fois)
eas init

# Build iOS
npm run build:ios

# Build Android
npm run build:android
```

## 📦 Structure des Branches Git

```
main (Production)
  ↑
  └── develop (Staging)
       ├── feature/chat-ia
       ├── feature/ocr-scanner
       ├── feature/sync-cloud
       └── feature/gamification
```

## 🔧 Scripts Disponibles

| Script | Description |
|--------|-------------|
| `npm start` | Démarrer dev server |
| `npm run web` | Démarrer mode Web |
| `npm run ios` | Démarrer iOS simulator |
| `npm run android` | Démarrer Android emulator |
| `npm run lint` | Analyser le code |
| `npm run format` | Formater le code |
| `npm run build:web` | Build web production |
| `npm run build:ios` | Build iOS |
| `npm run build:android` | Build Android |

## 🔑 Configuration EAS (pour les builds)

### 1. Créer un compte Expo
```bash
expo login
```

### 2. Initialiser EAS
```bash
eas init
```

### 3. Configurer `eas.json`
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "production": {
      "ios": {
        "image": "latest"
      },
      "android": {
        "image": "latest"
      }
    }
  }
}
```

## 🌐 Déploiement Web

### Firebase Hosting (Gratuit)

1. **Installer Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialiser Firebase**
   ```bash
   firebase init hosting
   ```

3. **Configuration dans `.firebaserc`**
   ```json
   {
     "projects": {
       "default": "tutoring-app-dev"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run build:web
   firebase deploy
   ```

### Alternative : Vercel

```bash
npm install -g vercel
vercel
```

## 📱 Compilation Web

La beauté de React Native Web :
- **Même code** pour mobile et web
- **Pas de duplication** entre projets
- **StyleSheet React Native** → CSS automatique

### Limitations & Contournements

| Limitation | Solution |
|-----------|----------|
| Platform-specific code | `Platform.select({ web: ..., native: ... })` |
| Navigation web | React Navigation gère automatiquement |
| Storage | AsyncStorage fonctionne partout |
| Images locales | Utilisez require() ou assets folder |

## 🐛 Debugging

### VS Code
1. Installer l'extension "React Native Tools"
2. Démarrer `npm start`
3. Ouvrir Debug Console

### Web Console
```bash
npm run web
# Ouvrir DevTools (F12)
```

### Expo DevTools
```bash
expo start
# Ouvrir l'app Expo sur device
# Secouer pour ouvrir le menu
```

## 📚 Ressources Utiles

- **React Native** : https://reactnative.dev
- **Expo Docs** : https://docs.expo.dev
- **React Navigation** : https://reactnavigation.org
- **Zustand Docs** : https://github.com/pmndrs/zustand
- **TypeScript Guide** : https://www.typescriptlang.org

## ❓ FAQ

**Q: Pourquoi React Native Web ?**
A: Une seule base de code pour mobile + web = développement 3x plus rapide et maintenance simplifiée.

**Q: Peut-on utiliser des packages npm standards ?**
A: Oui, la plupart marche. Vérifiez la compatibilité React Native.

**Q: Comment tester hors-ligne ?**
A: Le storage AsyncStorage fonctionne sans internet. Testez avec les DevTools.

**Q: Coût d'hébergement ?**
A: Zéro euro avec Expo.dev (gratuit) + Firebase Hosting (gratuit les 100 MB).

---

**Status** : ✅ Prêt à développer !
