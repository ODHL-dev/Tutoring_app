# 🚀 GRASSS Quick Start Guide

## 📦 Ce qui a été créé

### Backend Files
```
backend/
├── authentication/
│   ├── models.py                    (Extended with StudentProfile, UserMatter, ConversationSummary)
│   ├── serializers.py               (Added GRASSS serializers)
│   ├── views_grasss.py              (New - tutoring views)
│   ├── urls.py                      (Updated with GRASSS routes)
│   └── migrations/
│       └── 0003_grasss_models.py    (New - DB schema)
├── prompts_templates.py             (New - AI prompt templates)
├── rag_grasss_service.py            (New - RAG vector DB service)
└── manage.py
```

### Frontend Files
```
frontend/src/
└── screens/
    └── TutoringScreen.tsx           (New - full tutoring UI)
```

### Documentation
```
./
├── GRASSS_IMPLEMENTATION.md         (Architecture & implementation guide)
├── API_GRASSS_GUIDE.md              (API endpoints reference)
├── GRASSS_CHECKLIST.md              (Implementation checklist)
└── GRASSS_QUICKSTART.md             (This file)
```

---

## ⚡ 5 Étapes pour Démarrer

### **Étape 1: Backend Setup (5 min)**

```bash
cd backend

# 1a. Migration DB
python manage.py migrate authentication

# 1b. Vérifier les modèles en admin
python manage.py shell
>>> from authentication.models import StudentProfile, UserMatter, ConversationSummary
>>> print("Modèles importés avec succès!")
```

### **Étape 2: Vérifier les Imports (2 min)**

```python
# Dans authentication/views_grasss.py, add imports:
from .models import User, UserMatter, ConversationSummary, StudentProfile
from .serializers import (
    UserMatterSerializer,
    ConversationSummarySerializer,
    TutorRequestSerializer,
    TutorResponseSerializer
)
from backend.rag_grasss_service import rag_service
from prompts_templates import (
    get_diagnostic_prompt,
    get_exercise_prompt,
    get_tutor_prompt,
    get_summary_prompt
)
from backend.rag_service import get_ai_response
```

### **Étape 3: Intégrer Frontend (3 min)**

```typescript
// Dans frontend/src/navigation/RootNavigator.tsx

import TutoringScreen from '../screens/TutoringScreen';

// Dans MainTabs ou votre structure:
<Tab.Screen 
  name="Tutoring" 
  component={TutoringScreen}
  options={{
    title: 'Mon Tutorat IA',
    tabBarIcon: ({ color }) => <Icon name="book" color={color} />
  }}
/>
```

### **Étape 4: Tester l'API (5 min)**

```bash
# Terminal 1: Lancer le backend
cd backend
python manage.py runserver

# Terminal 2: Tester avec curl
curl -X POST http://localhost:8000/auth/tutor/chat/ \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "tutor",
    "matiere": "Mathématiques",
    "message": "Bonjour"
  }'
```

### **Étape 5: Lancer Frontend (2 min)**

```bash
cd frontend
npm start
# ou
npx expo start
```

---

## 🔄 Flux Utilisateur Complet

```
UTILISATEUR FRONTEND                    BACKEND                     IA MODEL
     │                                    │                           │
     ├─ Lance l'app                       │                           │
     │                                    │                           │
     ├─ Ouvre "Mon Tutorat IA"           │                           │
     │  (TutoringScreen)                 │                           │
     │                                    │                           │
     ├─ Sélectionne matière              │                           │
     │     │                              │                           │
     │     └─ POST /tutor/chat/          │                           │
     │        action="tutor"              │                           │
     │                                    ├─ Récupère contexte RAG    │
     │                                    │                           │
     │                                    ├─ Génère prompt            │
     │                                    │     │                      │
     │                                    │     └──────────────────────▶ IA Response
     │                                    │                           │
     │                                    │ ◀──────────────────────────┤
     │                                    │  (JSON ou texte)           │
     │                                    │                           │
     │                                    ├─ Parse la réponse        │
     │                                    │                           │
     │                                    ├─ Sauvegarde RAG context  │
     │                                    │                           │
     │ ◀─ Response JSON ◀──────────────────┤                           │
     │                                    │                           │
     ├─ Affiche réponse/exercice         │                           │
     │                                    │                           │
     ├─ User interaction                 │                           │
     │  (répond, clique, etc.)           │                           │
     │                                    │                           │
     └─ Cycle continue...                │                           │
```

---

## 🎯 Logique des Actions

### **`action: "diagnostic"`**
Première visite → Pose 5 questions → Analyse réponses → Crée profil
```json
{
  "action": "diagnostic",
  "matiere": "Mathématiques"
}
```

### **`action: "exercise"`**
Génère un QCM adapté au niveau/style
```json
{
  "action": "exercise",
  "matiere": "Mathématiques",
  "niveau_difficulte": "moyen"
}
```

### **`action: "tutor"`** (Par défaut)
Conversation normale avec le tuteur
```json
{
  "action": "tutor",
  "matiere": "Mathématiques",
  "message": "Je ne comprends pas..."
}
```

### **`action: "remediation"`**
Aide spéciale après échecs multiples
```json
{
  "action": "remediation",
  "matiere": "Mathématiques",
  "message": "Je bloque sur..."
}
```

### **`action: "summary"`**
Termine la session avec résumé sauvegardé
```json
{
  "action": "summary",
  "matiere": "Mathématiques",
  "message": "[historique complet]"
}
```

---

## 🧪 Tester Rapidement

### **1. Avec Postman**
1. Importer `API_GRASSS_GUIDE.md` exemples
2. Configurer Bearer token
3. Tester endpoints un par un

### **2. Avec curl (Frontend intégration)**
```bash
# Vérifier API accessible
curl http://localhost:8000/auth/matters/ \
  -H "Authorization: Bearer <token>"
```

### **3. Directement dans Django Shell**
```python
python manage.py shell

from authentication.models import UserMatter
from rag_grasss_service import rag_service

# Créer une matière
matter = UserMatter.objects.create(
    user_id=1,
    matiere="Mathématiques",
    chapitre="Algèbre",
    niveau_difficulte="moyen"
)

# Tester RAG
context = rag_service.get_matter_context(1, "Mathématiques")
print(context)
```

---

## ⚙️ Configuration Requise

### **Backend**
```bash
# requirements.txt (à ajouter si absent)
chromadb>=0.3.21
django>=4.2
djangorestframework>=3.14
python-dotenv>=0.21.0
openai>=0.27.0  # ou anthropic
```

### **Frontend**
```bash
# Déjà present dans package.json
react-native
@react-navigation/native
zustand
```

### **Environment Variables** (.env)
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...  # Si using Claude
CHROMA_DB_PATH=backend/chroma_db
```

---

## 📊 Base de Données

### **Schéma Résumé**

```sql
-- StudentProfile
student_profile
├─ user (FK)
├─ niveau_global: "beginner"|"intermediate"|"advanced"|"expert"
├─ style_apprentissage: "visual"|"auditory"|"kinesthetic"|"reading_writing"|"mixed"
├─ diagnostic_completed: bool
└─ diagnostic_date: datetime

-- UserMatter
user_matter
├─ user (FK)
├─ matiere: string (100)
├─ chapitre: string (200)
├─ objectif: text
├─ niveau_difficulte: "facile"|"moyen"|"difficile"|"expert"
├─ progression: float (0-100)
├─ created_at: datetime
└─ updated_at: datetime

-- ConversationSummary
conversation_summary
├─ user (FK)
├─ user_matter (FK)
├─ summary_text: text
├─ key_concepts: JSON array
├─ chroma_doc_id: string (UUID)
├─ created_at: datetime
└─ conversation_date: datetime
```

---

## 🔗 Ressources Fichiers

| Fichier | Ligne | Description |
|---------|-------|-------------|
| `models.py` | L1-105 | Modèles étendus |
| `prompts_templates.py` | L1-500+ | Tous les prompts IA |
| `rag_grasss_service.py` | L1-400+ | Service Chroma DB |
| `views_grasss.py` | L1-500+ | Endpoints API |
| `serializers.py` | L25+ | Serializers GRASSS |
| `TutoringScreen.tsx` | L1-700+ | Interface complète |

---

## ✨ Prochaines Étapes Recommandées

1. **Tester le diagnostic** - Vérifier que les questions s'affichent
2. **Tester la génération d'exercice** - QCM fonctionnelle?
3. **Tester la conversation** - Réponses du tuteur?
4. **Tester les résumés** - Sauvegarde en BD?
5. **Performance** - Temps de réponse acceptable?
6. **UX Polish** - Animations, messages d'erreur, loading states
7. **Production** - Déployer sur serveur

---

## 🆘 Dépannage Rapide

| Problème | Solution |
|----------|----------|
| `ModuleNotFoundError: chromadb` | `pip install chromadb` |
| `Token invalid` | Vérifier Bearer token valide |
| `Matière not found` | Créer une matière via `/auth/matters/` POST |
| `IA timeout` | Vérifier OPENAI_API_KEY, augmenter timeout |
| `TutoringScreen not showing` | Vérifier navigation import |
| `Chroma error` | Vérifier CHROMA_DB_PATH, lancer sur Linux/Mac |

---

## 📞 Support

- **Erreurs Django:** Vérifier `python manage.py check`
- **Erreurs React Native:** Vérifier logs Expo
- **Erreurs API:** Tester avec curl avant fronten
- **Erreurs IA:** Vérifier clé API, quota

---

## 🎓 Résumé Architecture

```
Frontend             Backend            Vector DB          AI Model
┌─────────┐       ┌─────────┐       ┌──────────┐       ┌────────┐
│ React   │◀──────│ Django  │◀──────│  Chroma  │◀──────│ Claude │
│ Native  │  JSON │ REST    │ Query │ (Chroma) │ Embed │  /GPT  │
└─────────┘       └─────────┘       └──────────┘       └────────┘
     │                  │                  │
     └──────────────────┴──────────────────┘
           Real-Time Learning Experience
```

---

## ✅ Validation Finale

Run this checklist before going to production:

```bash
# 1. Backend
python manage.py check
python manage.py migrate
python manage.py test authentication

# 2. Chroma
python manage.py shell << EOF
from rag_grasss_service import rag_service
print(f"Chroma path: {rag_service.chroma_db_path}")
print("✓ RAG service initialized")
