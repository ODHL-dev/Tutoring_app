# 🔌 Guide API - Système GRASSS

## Endpoints GRASSS

### 🎯 **1. Endpoint Principal - Tuteur Chat**

**URL:** `POST /auth/tutor/chat/`  
**Auth:** Obligatoire (Bearer Token)

#### **Request Payload:**

```json
{
  "action": "diagnostic|exercise|tutor|remediation|summary",
  "matiere": "Mathématiques",
  "chapitre": "Algèbre (optionnel)",
  "niveau_difficulte": "facile|moyen|difficile|expert (optionnel)",
  "message": "Contenu du message ou réponses (peut être vide)",
  "student_answers": { } // Pour action=diagnostic
}
```

#### **Actions disponibles :**

##### **Action: `diagnostic`** (Premier diagnostic)
```bash
curl -X POST http://localhost:8000/auth/tutor/chat/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "diagnostic",
    "matiere": "Mathématiques",
    "chapitre": "Algèbre"
  }'
```

**Response (première étape - poser questions) :**
```json
{
  "status": "diagnostic_questions_posed",
  "questions": [
    {
      "id": 1,
      "text": "Que signifie résoudre une équation?",
      "type": "open",
      "expected_level": "facile"
    },
    // ... 4 autres questions
  ],
  "next_action": "Répondez à ces questions puis continuez"
}
```

**Response (deuxième étape - analyse) :**
```json
{
  "status": "diagnostic_completed",
  "message": "Diagnostic terminé. Votre profil a été mis à jour."
}
```

---

##### **Action: `exercise`** (Générer exercice QCM)
```bash
curl -X POST http://localhost:8000/auth/tutor/chat/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "exercise",
    "matiere": "Mathématiques",
    "chapitre": "Algèbre",
    "niveau_difficulte": "moyen"
  }'
```

**Response :**
```json
{
  "status": "exercise_generated",
  "exercise": {
    "question": "Résoudre: 2x + 5 = 15",
    "options": [
      {
        "id": "A",
        "text": "x = 5",
        "is_correct": true,
        "explanation": "Soustrayez 5 des deux côtés: 2x = 10, divisez par 2"
      },
      {
        "id": "B",
        "text": "x = 10",
        "is_correct": false,
        "explanation": "Erreur à l'étape de division"
      },
      {
        "id": "C",
        "text": "x = 20",
        "is_correct": false,
        "explanation": "Erreur de calcul"
      },
      {
        "id": "D",
        "text": "x = 3",
        "is_correct": false,
        "explanation": "Erreur commune, à revoir"
      }
    ],
    "difficulty": "moyen",
    "competencies": ["Résolution", "Équations"],
    "hint": "Isolez le terme avec x en premier"
  },
  "metadata": {
    "matiere": "Mathématiques",
    "chapitre": "Algèbre",
    "difficulty": "moyen"
  }
}
```

---

##### **Action: `tutor`** (Conversation normale)
```bash
curl -X POST http://localhost:8000/auth/tutor/chat/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "tutor",
    "matiere": "Mathématiques",
    "chapitre": "Algèbre",
    "message": "Je ne comprends pas pourquoi 2x + 5 = 15 donne x = 5"
  }'
```

**Response :**
```json
{
  "status": "tutor_response",
  "content": "Excellente question! Je vais vous expliquer étape par étape:\n\n1. L'équation: 2x + 5 = 15\n2. Nous voulons isoler x\n3. D'abord, soustrayons 5 des deux côtés:\n   2x + 5 - 5 = 15 - 5\n   2x = 10\n4. Maintenant divisez par 2:\n   x = 10 ÷ 2\n   x = 5\n\nVous comprenez mieux maintenant?",
  "metadata": {
    "matiere": "Mathématiques",
    "progression": 35.0
  }
}
```

---

##### **Action: `remediation`** (Aide après échecs)
```bash
curl -X POST http://localhost:8000/auth/tutor/chat/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "remediation",
    "matiere": "Mathématiques",
    "chapitre": "Algèbre",
    "message": "Je n'\''arrive pas à résoudre les équations"
  }'
```

**Response :**
```json
{
  "status": "remediation_provided",
  "remediation": {
    "diagnostic": "Vous semblez avoir des difficultés avec l''isolement de la variable",
    "approche_remediation": "Nous allons revisiter les bases avec des exemples plus simples",
    "exercice_simple": "Résoudre: x + 3 = 7",
    "encouragement": "C'est normal d'avoir besoin de réviser! Vous progresserez rapidement."
  },
  "metadata": {
    "approach": "Approche de remédiation personnalisée"
  }
}
```

---

##### **Action: `summary`** (Sauvegarder résumé)
```bash
curl -X POST http://localhost:8000/auth/tutor/chat/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "summary",
    "matiere": "Mathématiques",
    "chapitre": "Algèbre",
    "message": "[historique complet de la conversation en texte]"
  }'
```

**Response :**
```json
{
  "status": "summary_saved",
  "summary": {
    "titre": "Introduction aux équations du premier degré",
    "resume_court": "Nous avons couvert les bases de la résolution d''équations linéaires...",
    "concepts_couverts": ["Équation", "Variable", "Isolement", "Vérification"],
    "competences_travaillees": ["Résolution", "Manipulation algébrique"],
    "points_cles": [...],
    "progression": "L'élève a progressé de 30% à 35%",
    "points_forts": ["Compréhension conceptuelle"],
    "axes_amelioration": ["Calcul mental"],
    "recommandations": "Continuer avec des équations à deux variables"
  },
  "metadata": {
    "id": 42,
    "saved_at": "2026-02-20T15:30:00Z"
  }
}
```

---

### 📊 **2. Gérer les Matières**

#### **GET /auth/matters/**
Récupérer les matières de l'utilisateur

```bash
curl http://localhost:8000/auth/matters/ \
  -H "Authorization: Bearer <token>"
```

**Response :**
```json
[
  {
    "id": 1,
    "matiere": "Mathématiques",
    "chapitre": "Algèbre",
    "objectif": "Maîtriser les équations du premier degré",
    "niveau_difficulte": "moyen",
    "progression": 35.0,
    "created_at": "2026-02-15T10:00:00Z",
    "updated_at": "2026-02-20T15:30:00Z"
  },
  {
    "id": 2,
    "matiere": "Français",
    "chapitre": "Conjugaison",
    "objectif": "Maîtriser les temps de base",
    "niveau_difficulte": "moyen",
    "progression": 50.0,
    "created_at": "2026-02-10T09:00:00Z",
    "updated_at": "2026-02-18T14:00:00Z"
  }
]
```

#### **POST /auth/matters/**
Créer une nouvelle matière

```bash
curl -X POST http://localhost:8000/auth/matters/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "matiere": "Anglais",
    "chapitre": "Present Tense",
    "objectif": "Apprendre le present simple",
    "niveau_difficulte": "moyen"
  }'
```

---

### 📈 **3. Suivi Progression**

#### **GET /auth/learning/progress/**
Obtenir la progression générale

```bash
curl http://localhost:8000/auth/learning/progress/ \
  -H "Authorization: Bearer <token>"
```

**Response :**
```json
{
  "user": "john_doe",
  "matters": [
    { "id": 1, "matiere": "Mathématiques", "progression": 35.0, ... },
    { "id": 2, "matiere": "Français", "progression": 50.0, ... }
  ],
  "total_progress": 42.5
}
```

---

### 📝 **4. Historique Conversations**

#### **GET /auth/learning/history/**
Récupérer résumés de conversation

```bash
curl http://localhost:8000/auth/learning/history/?matiere=Mathématiques \
  -H "Authorization: Bearer <token>"
```

**Response :**
```json
{
  "conversation_history": [
    {
      "id": 1,
      "summary_text": "Session du 20/02: Équations du premier degré",
      "key_concepts": ["Équation", "Variable", "Isolement"],
      "matter_details": {
        "matiere": "Mathématiques",
        "chapitre": "Algèbre",
        "progression": 35.0
      },
      "created_at": "2026-02-20T15:30:00Z"
    },
    {
      "id": 2,
      "summary_text": "Session du 18/02: Introduction à l'algèbre",
      "key_concepts": ["Basics", "Notation"],
      "matter_details": { ... },
      "created_at": "2026-02-18T14:00:00Z"
    }
  ]
}
```

---

## 🧪 Exemples de Test avec Postman

### **1. Configuration de base**

1. **Collection:** `GRASSS API`
2. **Environment variables:**
   ```
   base_url = http://localhost:8000
   token = <votre_bearer_token>
   ```

3. **Headers (pour tous les requests):**
   ```
   Authorization: Bearer {{token}}
   Content-Type: application/json
   ```

### **2. Test Workflow Complet**

**Test 1: Diagnostic Initial**
```
POST {{base_url}}/auth/tutor/chat/
Body:
{
  "action": "diagnostic",
  "matiere": "Mathématiques",
  "chapitre": "Algèbre"
}
```

**Test 2: Générer Exercice**
```
POST {{base_url}}/auth/tutor/chat/
Body:
{
  "action": "exercise",
  "matiere": "Mathématiques",
  "chapitre": "Algèbre"
}
```

**Test 3: Conversation Tuteur**
```
POST {{base_url}}/auth/tutor/chat/
Body:
{
  "action": "tutor",
  "matiere": "Mathématiques",
  "message": "Je ne comprends pas..."
}
```

**Test 4: Sauvegarder Résumé**
```
POST {{base_url}}/auth/tutor/chat/
Body:
{
  "action": "summary",
  "matiere": "Mathématiques",
  "message": "[conversation complète ici]"
}
```

---

## ⚠️ Codes d'Erreur

| Code | Description |
|------|-------------|
| `400` | Validation error - vérifier payload |
| `401` | Token invalide ou expiré |
| `403` | Permission refusée |
| `404` | Matière/ressource non trouvée |
| `500` | Erreur serveur - vérifier logs |

**Exemple d'erreur :**
```json
{
  "error": {
    "action": ["This field is required."],
    "matiere": ["Ensure this field has valid value."]
  }
}
```

---

## 🔐 Authentication

**Obtenir le token :**
```bash
curl -X POST http://localhost:8000/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response :**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

Utiliser la valeur `access` dans l'header `Authorization`.

---

## 📞 Debugging

### **Activer les logs détaillés (Django)**
```python
# settings.py
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
```

### **Vérifier l'état de Chroma**
```python
# Dans Django shell
python manage.py shell
>>> from rag_grasss_service import rag_service
>>> collections = rag_service.client.list_collections()
>>> for c in collections:
...     print(c.name)
```

---

**API Version:** 1.0  
**Last Updated:** Février 2026
