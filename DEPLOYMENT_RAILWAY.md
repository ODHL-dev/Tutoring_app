# 🚀 Guide Déploiement sur Railway

## 📋 Prérequis

- Compte Railway (gratuit: https://railway.app)
- Variables d'environnement configurées
- Dépendances de production dans `requirements.txt`

## 🔧 Configuration Locale Avant Déploiement

### 1. Générer SECRET_KEY

```bash
cd backend

# Générer une clé sécurisée
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copie la clé générée.

### 2. Configurerle fichier `.env` local

```bash
# Copier depuis exemple
cp .env.example .env

# Éditer et remplir:
nano .env
```

Contenu minimum pour local:
```
SECRET_KEY=<clé générée ci-dessus>
DEBUG=True
DATABASE_URL=  # Laisse vide pour SQLite local
GEMINI_API_KEY=<ta clé Gemini pour RAG>
```

### 3. Tester localement

```bash
cd backend

# Installer dépendances
pip install -r requirements.txt

# Vérifier que ça démarre
python manage.py runserver

# Tester en production-like (avec Gunicorn)
gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 1
```

---

## 🚂 Déploiement sur Railway

### **Option A: Via Interface Web Railway**

1. **Créer nouveau projet Railway**
   - Connecter ton GitHub ou upload local
   - Sélectionner le repo/dossier `backend/`

2. **Ajouter add-ons**
   - PostgreSQL OU MySQL (dropdown "Add Services")
   - → La variable `DATABASE_URL` sera auto-créée

3. **Configurer variables d'environnement** (Dashboard → Variables)
   ```
   SECRET_KEY = <ta clé générée>
   DEBUG = False
   ENVIRONMENT = production
   ALLOWED_HOSTS = yourdomain.railway.app,*.railway.app
   GEMINI_API_KEY = <ta clé>
   ```

4. **Déployer**
   - Clique "Deploy" ou configure auto-deploy depuis GitHub
   - Railway exécute `Procfile` automatiquement

---

### **Option B: Via Railway CLI**

```bash
# 1. Installer Railway CLI
npm install -g @railway/cli

# 2. Initialiser projet Railway
railway login
railway init

# 3. Lier à ton projet Django
railway link <project-id>

# 4. Ajouter PostgreSQL/MySQL
railway add

# 5. Déployer
railway up

# 6. Voir logs
railway logs
```

---

## 🔑 Variables d'Environnement Railway

| Variable | Valeur | Exemple |
|----------|--------|---------|
| `SECRET_KEY` | Clé secrète générée | (voir ci-dessus) |
| `DEBUG` | False pour prod | `False` |
| `ENVIRONMENT` | production | `production` |
| `ALLOWED_HOSTS` | Domaines autorisés | `app.railway.app` |
| `DATABASE_URL` | Auto-fourni par Railway | MySQL/PostgreSQL add-on |
| `GEMINI_API_KEY` | Clé Google AI | (de aistudio.google.com) |
| `PORT` | Auto-fourni par Railway | `$PORT` |

---

## 📊 Build & Startup Commands

Railway utilise automatiquement les commandes du `Procfile`:

```bash
# ✅ Build install (automatique)
cd backend && pip install -r requirements.txt

# ✅ Release (migrations avant start)
python manage.py migrate --noinput && python manage.py collectstatic --noinput

# ✅ Web process (Gunicorn)
gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --workers 3
```

---

## ✅ Checks Post-Déploiement

### 1. Vérifier que le site est UP

```bash
curl https://yourapp.railway.app/api/auth/profile/
# Devrait retourner: {"detail":"Authentication credentials were not provided."}
```

### 2. Voir les logs

```bash
# Via CLI
railway logs

# Ou dans Dashboard → Logs tab
```

### 3. Tester un endpoint

```bash
# Avec curl
curl -X GET https://yourapp.railway.app/api/auth/profile/

# Ou Postman
GET https://yourapp.railway.app/api/auth/profile/
Authorization: Bearer <ton_token_jwt>
```

---

## 🐛 Troubleshooting

### ❌ "SECRET_KEY not configured"
→ Configure `SECRET_KEY` dans Railway Dashboard variables

### ❌ "DATABASE_URL not set, using SQLite"
→ Ajoute l'add-on MySQL/PostgreSQL à ton projet Railway
→ Redéploie ou relance le container

### ❌ "502 Bad Gateway"
→ Vérifier logs: `railway logs` 
→ Vérifier que Gunicorn écoute sur `0.0.0.0:$PORT`

### ❌ "Static files not loading"
→ Ensure `STATIC_ROOT` and `STATIC_URL` configured (déjà fait dans `settings.py`)
→ Gunicorn utilise WhiteNoise pour servir les static files

### ❌ "Database migration failed"
→ Voir les logs de la "Release" phase
→ Vérifier que `DATABASE_URL` est valide

---

## 📝 Fichiers Importants

| Fichier | Usage |
|---------|-------|
| `Procfile` | Commandes build/release/start pour Railway |
| `.env.example` | Template pour variables d'environnement |
| `requirements.txt` | Dépendances production (allégées) |
| `backend/settings.py` | Configuration Django adaptée production |
| `re.txt` | Dépendances développement complet (backup) |

---

## 🔗 Bonnes Pratiques

1. ✅ **Toujours utiliser `DATABASE_URL`** pour la DB
2. ✅ **Ne jamais commiter `.env`** (ajoute à `.gitignore`)
3. ✅ **Secret_key unique par environnement**
4. ✅ **DEBUG=False en production**
5. ✅ **Configurer CORS pour le frontend** (si sur domaine différent)
6. ✅ **Monitorer les logs** après déploiement

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Django Deployment: https://docs.djangoproject.com/en/6.0/howto/deployment/
- Gunicorn Config: https://gunicorn.org/
