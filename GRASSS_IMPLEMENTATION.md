# 📚 Système GRASSS (Guided Learning RAG System)
## Documentation d'implémentation complète

---

## 📋 Vue d'ensemble

Le système **GRASSS** est un tunnel d'apprentissage personnalisé qui utilise la **Retrieval-Augmented Generation (RAG)** pour créer des expériences pédagogiques adaptées à chaque élève.

**Architecture du système :**
```
┌─────────────────────────────────────────────────────────────┐
│                    ÉLÈVE / FRONTEND                          │
│                  (TutoringScreen.tsx)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  ACTIONS:   │
                    │ diagnostic  │
                    │ exercise    │
                    │ tutor       │
                    │ remediation │
                    │ summary     │
                    └──────┬──────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│               BACKEND API                                   │
│         (TutorChatView + endpoints)                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  PROMPT TEMPLATING SYSTEM                          │    │
│  │  • diagnostic_prompt → Questions initiales         │    │
│  │  • exercise_prompt → QCM personnalisés             │    │
│  │  • tutor_prompt → Conversation adaptée             │    │
│  │  • remediation_prompt → Support en difficulté      │    │
│  │  • summary_prompt → Résumés de session            │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                 │
│  ┌────────────────────────▼──────────────────────────┐    │
│  │  RAG SERVICE (rag_grasss_service.py)               │    │
│  │  • Récupère contexte utilisateur                   │    │
│  │  • Stockage vectoriel (Chroma DB)                  │    │
│  │  • Gestion des résumés de conversation             │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                 │
│  ┌────────────────────────▼──────────────────────────┐    │
│  │  IA MODEL (via rag_service.get_ai_response)        │    │
│  │  • Claude, GPT ou autre LLM                         │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│           BASE DE DONNÉES (Django ORM)                      │
│                                                              │
│  Models:                                                    │
│  ├─ StudentProfile (niveau_global, style_apprentissage)    │
│  ├─ UserMatter (progression par matière/chapitre)          │
│  └─ ConversationSummary (historique apprentissage)         │
└──────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture Détaillée

### 1️⃣ **Modèles Django (models.py)**

#### `StudentProfile` (étendu)
```python
- niveau_global: beginner|intermediate|advanced|expert
- style_apprentissage: visual|auditory|kinesthetic|reading_writing|mixed
- diagnostic_completed: bool
- diagnostic_date: timestamp
```

#### `UserMatter` (nouveau)
Représente une matière scolaire pour un utilisateur
```python
- matiere: "Mathématiques"
- chapitre: "Algèbre"
- objectif: "Description pédagogique"
- niveau_difficulte: facile|moyen|difficile|expert
- progression: 0-100 (%)
- created_at, updated_at: timestamps
```

#### `ConversationSummary` (nouveau)
Archive les résumés de chaque session d'apprentissage
```python
- summary_text: Résumé généré par l'IA
- key_concepts: ["Concept 1", "Concept 2", ...]
- chroma_doc_id: ID du document vectoriel
- created_at: timestamp
```

### 2️⃣ **Système de Prompts (prompts_templates.py)**

6 templates de prompts pour couvrir tous les scénarios :

#### **DIAGNOSTIC PROMPT**
- Pose 5 questions progressives
- Évalue : niveau, lacunes, vitesse compréhension
- Retour JSON structuré

#### **EXERCISE_GENERATION_PROMPT**
- Génère QCM personnalisé
- Adapter au niveau, style d'apprentissage
- Inclut explications des bonnes/mauvaises réponses

#### **TUTOR_PROMPT**
- Conversation standard avec l'IA
- Utilise aussi le RAG context
- Pédagogue et encourageant

#### **REMEDIATION_PROMPT**
- Activé après 3+ échecs consécutifs
- Approche alternative, plus simple
- Exemples visuels/concrets

#### **CONVERSATION_SUMMARY_PROMPT**
- Génère résumé de session
- Identifie concepts clés
- Sauvegarde dans RAG et DB

### 3️⃣ **Service RAG (rag_grasss_service.py)**

```python
class RAGGRASSService:
    
    # Collections Chroma
    - user_{user_id}_data: Profil et diagnostic
    - user_{user_id}_matter_{matiere}: Historique matière
    
    # Méthodes clés:
    - store_user_profile()
    - store_user_diagnostic()
    - store_conversation_summary()
    - get_user_context()  # Récupère contexte pour prompts
    - get_matter_context()  # Contexte d'une matière
```

### 4️⃣ **API Endpoints**

#### **POST /auth/tutor/chat/**
Endpoint principal pour toutes les interactions
```json
{
  "action": "diagnostic|exercise|tutor|remediation|summary",
  "matiere": "Mathématiques",
  "chapitre": "Algèbre",
  "niveau_difficulte": "moyen",
  "message": "Contenu du message utilisateur"
}
```

**Réponses selon l'action :**
- `diagnostic` → Questions + guide pour l'évaluation
- `exercise` → QCM complet avec options
- `tutor` → Réponse pédagogique du tuteur
- `remediation` → Approche alternative
- `summary` → Résumé sauvegardé

#### **GET /auth/matters/**
Liste les matières de l'utilisateur

#### **GET /auth/learning/progress/**
Récupère la progression générale

#### **GET /auth/learning/history/**
Obtient l'historique des résumés de conversation

---

## 🔄 Flux Logique Détaillé

### **Premier accès d'un élève**
```
1. Élève clique "Tous les Tuteurs" / "Tutorat IA"
2. Frontend: TutoringScreen charge et affiche matières disponibles
3. Élève sélectionne une matière (ex: Mathématiques > Algèbre)
4. Frontend envoie action="diagnostic"
5. Backend: 
   - get_diagnostic_prompt() génère 5 questions
   - getai_response() obtient questions structurées de ChatGPT
   - Sauvegarde dans RAG (store_user_diagnostic)
6. Frontend: Affiche questions sous forme chat
7. Élève répond aux questions
8. Backend: Analyse réponses via RAG + IA → établit profil
9. StudentProfile.diagnostic_completed = True
10. Niveau_global + style_apprentissage mis à jour
```

### **Mode tutorat normal (après diagnostic)**
```
1. Élève demande aide ou explications
2. Frontend: action="tutor", message=la question
3. Backend:
   - get_matter_context(user_id, matiere) récupère historique
   - get_tutor_prompt() génère prompt avec RAG context
   - get_ai_response() obtient réponse pédagogique
4. Frontend: Affiche réponse en chat
5. Élève peut demander exercice: action="exercise"
```

### **Mode exercice**
```
1. Élève clique bouton "Exercice" (🎯)
2. Frontend: action="exercise"
3. Backend:
   - get_exercise_prompt() adapté au niveau/style
   - get_ai_response() génère QCM JSON
   - Retour structure: {question, options[{id, text, is_correct, explanation}], difficulty, hint}
4. Frontend: Parse JSON et affiche options cliquables
5. Élève sélectionne réponse(s)
6. Frontend envoie sélections
7. Backend: Vérifie si correcte, retourne feedback
8. Frontend: Affiche "✅ Bravo!" ou "❌ Pas tout à fait"
```

### **Fin de session**
```
1. Élève demande quitter: handleEndSession()
2. Alert: "Voulez-vous sauvegarder un résumé?"
3. Si oui:
   - Action="summary", conversation_history envoyée
   - Backend: get_summary_prompt() génère résumé
   - ConversationSummary créé en DB
   - rag_service.store_conversation_summary() sauvegarde vectoriel
4. Frontend: Retour à sélecteur de matière
```

---

## 📦 Installation et Configuration

### **Backend Setup**

1. **Ajouter les migrations:**
```bash
python manage.py migrate authentication
```

2. **Importer les modèles dans admin:**
```python
# authentication/admin.py
from .models import UserMatter, ConversationSummary

admin.site.register(UserMatter)
admin.site.register(ConversationSummary)
```

3. **Vérifier les variables d'environnement:**
```bash
# .env
OPENAI_API_KEY=sk-...  # Pour l'IA
CHROMA_DB_PATH=backend/chroma_db
```

### **Frontend Setup**

1. **Ajouter TutoringScreen à la navigation:**
```typescript
// navigation/RootNavigator.tsx
import TutoringScreen from '../screens/TutoringScreen';

// Dans MainTabs:
<Tab.Screen 
  name="Tutoring" 
  component={TutoringScreen}
  options={{ title: "Mon Tutorat IA" }}
/>
```

2. **Mettre à jour l'API client:**
```typescript
// api/client.ts
// Vérifier que les endpoints sont accessibles:
// /auth/tutor/chat/
// /auth/matters/
// /auth/learning/progress/
```

---

## 🎯 Points Clés d'Implémentation

### **1. Parsing des réponses QCM de l'IA**

L'IA doit retourner JSON structuré pour les exercices :
```json
{
  "question": "Texto de la question",
  "options": [
    {"id": "A", "text": "Réponse", "is_correct": true, "explanation": "Pourquoi"},
    ...
  ],
  "difficulty": "moyen",
  "competencies": ["Compétence 1"],
  "hint": "Indice"
}
```

**Frontend faire :** Parser le JSON et afficher les boutons cliquables

### **2. Sélection multiple d'options**

Pour certains QCM, plusieurs réponses correctes possible :
```typescript
const isCorrect = selectedAnswers.every(answerId =>
  currentExercise.options.find(opt => opt.id === answerId && opt.is_correct)
);
```

### **3. Résumés de conversation**

Chaque résumé devient un document dans la base vectorielle des matières, enrichissant le contexte pour

 les futures conversations.

### **4. Progression automatique**

À chaque exercice réussi :
```python
user_matter.progression = min(100, user_matter.progression + 5)
user_matter.save()
```

---

## 🧪 Checklist d'Implémentation

- [ ] Modèles Django créés et migrés
- [ ] `rag_grasss_service.py` déployé et testé
- [ ] `prompts_templates.py` complété et affiné
- [ ] `views_grasss.py` endpoints actifs
- [ ] TutoringScreen frontend fonctionnelle
- [ ] API intégration QCM parsing
- [ ] Tests: diagnostic → exercise → tutor → summary
- [ ] UI responsive et ergonomique
- [ ] Gestion des erreurs API
- [ ] Analytics: suivi progression

---

## 🔗 Fichiers à Mettre à Jour

```
backend/
  ├─ authentication/
  │  ├─ models.py (✅ FAIT)
  │  ├─ serializers.py (✅ FAIT)
  │  ├─ views_grasss.py (✅ FAIT)
  │  ├─ urls.py (✅ À mettre à jour)
  │  └─ migrations/0003_grasss_models.py (✅ FAIT)
  ├─ prompts_templates.py (✅ FAIT)
  ├─ rag_grasss_service.py (✅ FAIT)
  └─ settings.py (Ajouter: INSTALLED_APPS)
  
frontend/
  └─ src/
     └─ screens/
        └─ TutoringScreen.tsx (✅ FAIT)
```

---

## 🚀 Déploiement

1. **Backend :**
   ```bash
   cd backend
   python manage.py migrate
   python manage.py runserver
   ```

2. **Frontend :**
   ```bash
   cd tutoring-app/frontend
   npm start
   # ou
   npx expo start
   ```

---

## 📞 Support

Pour questions ou issues:
- Vérifier les logs de migration Django
- Tester endpoint /auth/tutor/chat/ avec Postman/Insomnia
- Vérifier clés API (OpenAI, etc.)
- Consulter console frontend (Expo)

---

**Version:** 1.0  
**Dernière mise à jour:** Février 2026  
**Status:** 🟢 Prêt pour intégration
