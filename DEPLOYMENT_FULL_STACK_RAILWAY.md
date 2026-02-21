# 🚀 Guide Déploiement Complet : Backend + Frontend sur Railway

## 📊 Architecture de Déploiement

```
              ┌─────────────────────────────────────┐
              │      RAILWAY INFRASTRUCTURE         │
              │                                     │
    ┌─────────▼─────────┐          ┌──────────────▼─────────┐
    │  FRONTEND (Node)  │          │  BACKEND (Django)      │
    │  Port 3000        │◄────────►│  Port 8000             │
    │  ├─ Expo Web      │  HTTP    │  ├─ Django API        │
    │  ├─ React App     │  Proxy   │  ├─ Gunicorn         │
    │  └─ Express       │          │  └─ WhiteNoise        │
    └─────────┬─────────┘          └──────────────┬─────────┘
              │                                   │
              │                                   │
    ┌─────────▼───────────────────────────────────▼──┐
    │      RAILWAY MANAGED SERVICES                  │
    ├──────────────────────────────────────────────┤
    │  ├─ MySQL Database (auto DATABASE_URL)       │
    │  ├─ Static Files Storage                      │
    │  └─ Environment Variables                     │
    └──────────────────────────────────────────────┘
```

---

## 🔧 Prérequis

1. **Compte Railway** : https://railway.app
2. **Git repository** avec structure :
   ```
   Tutoring_app/
   ├── backend/                 (Django)
   │   ├── backend/
   │   ├── authentication/
   │   ├── manage.py
   │   ├── requirements.txt
   │   ├── Procfile
   │   └── .env.example
   └── tutoring-app/            (Frontend - React Native)
       ├── frontend/
       ├── server.js
       ├── Procfile
       ├── package.json
       └── .env.example
   ```

---

## 📝 ÉTAPE 1 : Configuration Locale

### Backend

```bash
cd backend

# Générer SECRET_KEY
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Créer .env
cp .env.example .env

# Remplir:
# - SECRET_KEY (de la commande ci-dessus)
# - DEBUG=False (pour tester prod)
# - DATABASE_URL= (local = vide, utilise SQLite)
```

### Frontend

```bash
cd tutoring-app/frontend

# Installer
npm install

# Créer .env
cp ../.env.example ../.env

# Remplir:
# - REACT_APP_API_URL=http://localhost:8000 (local)
# - REACT_APP_ENV=development

# Tester local
npm start
```

---

## 🚂 ÉTAPE 2 : Déploiement Railway

### Option A: Via GitHub (Recommandé)

1. **Commit & Push**
```bash
git add .
git commit -m "chore: prepare Railway deployment"
git push origin main
```

2. **Railway Dashboard**
   - Créer nouveau projet
   - Connecter GitHub repo
   - Sélectionner branche `main`

3. **Configurer Services**

   a) **Backend (Django)**
   ```
   Service: backend/
   Build Command: cd backend && pip install -r requirements.txt
   Start Command: gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --workers 3
   ```

   b) **Frontend (Node.js)**
   ```
   Service: tutoring-app/
   Build Command: cd frontend && npm install && npm run build:web
   Start Command: npm run serve (from tutoring-app/)
   ```

   c) **Database (MySQL)**
   - Ajouter add-on "MySQL"
   - Railway crée automatiquement `DATABASE_URL`

---

## 🔑 ÉTAPE 3 : Variables d'Environnement Railway

### Backend Variables (Django Service)
```
SECRET_KEY = <clé générée>
DEBUG = False
ENVIRONMENT = production
ALLOWED_HOSTS = your-app.railway.app,*.railway.app
GEMINI_API_KEY = <ta clé>
DATABASE_URL = (auto-créé par MySQL add-on)
PORT = $PORT
```

### Frontend Variables (Node Service)
```
REACT_APP_API_URL = https://backend-yourapp.railway.app
REACT_APP_ENV = production
NODE_ENV = production
PORT = $PORT
```

---

## 📦 ÉTAPE 4 : Build & Deploy Commands

| Composant | Build | Start |
|-----------|-------|-------|
| **Backend** | `cd backend && pip install -r requirements.txt` | `gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --workers 3` |
| **Frontend** | `cd frontend && npm install && npm run build:web` | `npm run serve` (depuis root tutoring-app/) |

---

## ✅ Checks Post-Déploiement

### 1. Backend API
```bash
curl https://your-backend.railway.app/api/auth/profile/
# Expected: {"detail":"Authentication credentials were not provided."}
```

### 2. Frontend Web
```bash
curl https://your-frontend.railway.app/
# Expected: HTML du Expo Web app
```

### 3. Connectivity
```bash
# Dans frontend, vérifier REACT_APP_API_URL pointe vers backend
# Test depuis browser: app.railway.app fait requète à backend-app.railway.app
```

---

## 🔗 Communication Backend ↔ Frontend

### Côté Backend (Django)
```python
# backend/settings.py - CORS autorise frontend
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend.railway.app",
    "http://localhost:3000",
]
```

### Côté Frontend (React)
```typescript
// src/config.ts
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Utilisation
fetch(`${API_URL}/api/auth/login/`, {
  method: 'POST',
  body: JSON.stringify({ ...credentials })
})
```

---

## 🐛 Troubleshooting

### ❌ "Frontend can't reach backend"
**Cause**: REACT_APP_API_URL pointe vers localhost
**Fix**: Définir `REACT_APP_API_URL=https://your-backend.railway.app` dans Railway variables

### ❌ "CORS error"
**Cause**: Backend n'autorise pas domaine frontend
**Fix**: Ajouter frontend URL à `CORS_ALLOWED_ORIGINS` dans settings.py

### ❌ "502 Bad Gateway"
**Cause**: Port mismatch ou process crash
**Fix**: Vérifier logs (`railway logs`) et que process écoute sur `$PORT`

### ❌ "Static files not loading"
**Cause**: WhiteNoise pas configuré correctement
**Fix**: Vérifier STATIC_ROOT et STATICFILES_STORAGE dans settings.py

---

## 📊 Monitoring

### Logs Backend
```bash
railway logs -s backend
```

### Logs Frontend  
```bash
railway logs -s tutoring-app
```

### Database
```bash
# Accéder MySQL (via Railway dashboard)
# Ou CLI: railway database shell
```

---

## 🔄 Updates & Redeployment

### Push code update
```bash
git add .
git commit -m "feat: new feature"
git push origin main
# → Railway auto-redeploy
```

### Modifier variables env (sans code change)
1. Railway Dashboard → Your Project → Variables
2. Modifier et Save
3. Redeploy service

### Migrations Django
```bash
# Via Procfile "release" command (automatique)
# OU manuel:
railway run python manage.py migrate
```

---

## 📱 Version Mobile (Bonus)

Si tu veux aussi une app mobile :

```bash
# Build Android via EAS
npm run build:android

# Build iOS via EAS  
npm run build:ios

# OU test sur device
npm run android
npm run ios
```

⚠️ EAS Mobile ≠ Railway (déploie ailleurs)

---

## 📋 Checklist Final

- [ ] Backend Procfile créé
- [ ] Frontend Procfile créé
- [ ] requirements.txt production (backend)
- [ ] package.json updated (frontend)
- [ ] .env.example rempli (backend + frontend)
- [ ] DATABASE_URL configuré (Railway MySQL add-on)
- [ ] SECRET_KEY défini (backend var)
- [ ] CORS_ALLOWED_ORIGINS configuré (backend settings.py)
- [ ] REACT_APP_API_URL défini (frontend var → backend URL)
- [ ] Git push vers main
- [ ] Railway auto-deploy activé
- [ ] Tests API + Frontend fonctionnels

---

**👉 Prochaine étape**: Veux-tu que j'ajoute les infos sur l'indexation PDF ou le déploiement mobile EAS ?
