"""
Views API pour le système GRASSS
Endpoints pour le tutorat IA avec RAG
"""

import json
from django.utils import timezone
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User, UserMatter, ConversationSummary, StudentProfile
from .serializers import (
    UserMatterSerializer,
    ConversationSummarySerializer,
    TutorRequestSerializer,
    TutorResponseSerializer
)
from rag_grasss_service import rag_service
from prompts_templates import (
    get_diagnostic_prompt,
    get_exercise_prompt,
    get_tutor_prompt,
    get_summary_prompt,
    EVALUATION_ANALYSIS_PROMPT,
)
from backend.rag_service import get_ai_response  # Service IA existant (retourne {"reply": str, "sources": list})


def _get_reply_text(ai_result):
    """Extrait le texte de réponse du retour get_ai_response (dict ou str)."""
    if isinstance(ai_result, dict):
        return ai_result.get('reply', '') or ''
    return str(ai_result)


def _parse_json_from_reply(reply_text):
    """Parse du JSON depuis la réponse IA (peut être entourée de ```json ... ```)."""
    text = (reply_text or '').strip()
    if not text:
        return None
    # Enlever blocs markdown
    if '```' in text:
        for start in ('```json', '```'):
            if start in text:
                i = text.find(start) + len(start)
                j = text.find('```', i)
                if j != -1:
                    text = text[i:j].strip()
                break
    try:
        return json.loads(text)
    except Exception:
        return None


def _normalize_exercise_options(exercise_data):
    """Garantit que exercise a une liste options utilisable par le frontend."""
    options = exercise_data.get('options') if isinstance(exercise_data, dict) else None
    if not isinstance(options, list) or len(options) == 0:
        return [
            {"id": "A", "text": "Option 1", "is_correct": True, "explanation": ""},
            {"id": "B", "text": "Option 2", "is_correct": False, "explanation": ""},
        ]
    normalized = []
    for i, opt in enumerate(options):
        if not isinstance(opt, dict):
            continue
        normalized.append({
            "id": str(opt.get('id', chr(65 + i))),
            "text": str(opt.get('text', '')),
            "is_correct": bool(opt.get('is_correct', False)),
            "explanation": str(opt.get('explanation', '')),
        })
    return normalized if normalized else [
        {"id": "A", "text": "Option 1", "is_correct": True, "explanation": ""},
        {"id": "B", "text": "Option 2", "is_correct": False, "explanation": ""},
    ]


class UserMatterViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les matières scolaires de l'utilisateur"""
    serializer_class = UserMatterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Retourner les matières de l'utilisateur connecté"""
        return UserMatter.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Créer une nouvelle matière pour l'utilisateur"""
        serializer.save(user=self.request.user)


class TutorChatView(APIView):
    """Endpoint principal du tuteur IA avec système RAG"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Endpoint POST pour interagir avec le tuteur IA
        
        Payload:
        {
            "action": "diagnostic|exercise|tutor|remediation|summary",
            "matiere": "Mathématiques",
            "chapitre": "Algèbre (optionnel)",
            "niveau_difficulte": "moyen (optionnel)",
            "message": "La question ou le message de l'utilisateur",
            "student_answers": { } (pour diagnostic)
        }
        """
        serializer = TutorRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        try:
            student_profile = user.student_profile
        except StudentProfile.DoesNotExist:
            return Response(
                {"error": "Profil élève requis. Seuls les comptes élèves peuvent utiliser le tuteur."},
                status=status.HTTP_403_FORBIDDEN
            )
        matiere = serializer.validated_data.get('matiere')
        chapitre = serializer.validated_data.get('chapitre', '')
        action = serializer.validated_data.get('action', 'tutor')
        message = serializer.validated_data.get('message', '')

        # Créer ou récupérer la matière
        user_matter, created = UserMatter.objects.get_or_create(
            user=user,
            matiere=matiere,
            chapitre=chapitre,
            defaults={'niveau_difficulte': serializer.validated_data.get('niveau_difficulte', 'moyen')}
        )

        try:
            validated = serializer.validated_data
            if action == 'diagnostic' and not student_profile.diagnostic_completed:
                return self._handle_diagnostic(request, user, student_profile, matiere, user_matter, validated)
            
            elif action == 'exercise':
                return self._handle_exercise(user, student_profile, user_matter, message)
            
            elif action == 'remediation':
                return self._handle_remediation(user, student_profile, user_matter, message)
            
            elif action == 'summary':
                return self._handle_summary(user, user_matter, message)
            
            else:  # action == 'tutor' (par défaut)
                return self._handle_tutor(user, student_profile, user_matter, message)

        except Exception as e:
            return Response(
                {"error": f"Erreur du serveur: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # ========================================================================
    # HANDLERS POUR CHAQUE ACTION
    # ========================================================================

    def _handle_diagnostic(self, request, user, student_profile, matiere, user_matter, validated):
        """Gérer le diagnostic initial en 2 étapes. Classes autorisées: 3ème, Terminale D."""
        class_level = (validated.get('class_level') or '').strip()
        student_answers = validated.get('student_answers')

        # Mettre à jour la classe si fournie (obligatoire avant ou à la 1ère étape)
        if class_level:
            student_profile.class_level = class_level
            student_profile.save(update_fields=['class_level'])

        # Étape 2: réponses envoyées → analyser et terminer
        if student_answers is not None and isinstance(student_answers, dict):
            stored = student_profile.diagnostic_questions_json
            questions = stored.get('questions', []) if isinstance(stored, dict) else []
            if not questions:
                return Response(
                    {"error": "Aucune question en attente. Relancez l'évaluation depuis le début."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            prompt = EVALUATION_ANALYSIS_PROMPT.format(
                matiere=matiere,
                student_answers=json.dumps(student_answers, ensure_ascii=False),
                questions=json.dumps(questions, ensure_ascii=False)
            )
            raw = get_ai_response(prompt)
            reply_text = _get_reply_text(raw)
            analysis = _parse_json_from_reply(reply_text)
            if isinstance(analysis, dict):
                if analysis.get('niveau_diagnostique'):
                    student_profile.niveau_global = analysis['niveau_diagnostique']
                if analysis.get('style_apprentissage_probable'):
                    student_profile.style_apprentissage = analysis['style_apprentissage_probable']
            student_profile.diagnostic_completed = True
            student_profile.diagnostic_date = timezone.now()
            student_profile.diagnostic_questions_json = None
            student_profile.save(update_fields=[
                'niveau_global', 'style_apprentissage', 'diagnostic_completed',
                'diagnostic_date', 'diagnostic_questions_json'
            ])
            rag_service.store_user_diagnostic(user.id, analysis or {"raw": reply_text})
            return Response({
                "status": "diagnostic_completed",
                "message": "Diagnostic terminé. Votre profil a été mis à jour.",
                "analysis": analysis if isinstance(analysis, dict) else None
            }, status=status.HTTP_200_OK)

        # Étape 1: générer les questions (class_level doit être défini)
        niveau_scolaire = student_profile.class_level or class_level or '3ème'
        if not niveau_scolaire or niveau_scolaire not in ('3ème', 'Terminale D'):
            return Response(
                {"error": "Choisissez votre classe (3ème ou Terminale D) avant de lancer l'évaluation."},
                status=status.HTTP_400_BAD_REQUEST
            )
        prompt = get_diagnostic_prompt(matiere=matiere, niveau_scolaire=niveau_scolaire)
        raw = get_ai_response(prompt)
        reply_text = _get_reply_text(raw)
        diagnostic_data = _parse_json_from_reply(reply_text)
        if not isinstance(diagnostic_data, dict):
            diagnostic_data = {"raw_response": reply_text, "questions": []}
        questions = diagnostic_data.get('questions', [])
        if not questions and isinstance(diagnostic_data.get('raw_response'), str):
            questions = [{"id": 1, "text": diagnostic_data["raw_response"], "type": "open"}]
        student_profile.diagnostic_questions_json = diagnostic_data
        student_profile.save(update_fields=['diagnostic_questions_json'])
        rag_service.store_user_diagnostic(user.id, diagnostic_data)
        return Response({
            "status": "diagnostic_questions_posed",
            "questions": questions,
            "next_action": "Répondez à ces questions puis validez."
        }, status=status.HTTP_200_OK)

    def _handle_exercise(self, user, student_profile, user_matter, message):
        """Générer et retourner un exercice QCM"""
        
        # Récupérer le contexte du RAG
        rag_context = rag_service.get_matter_context(
            user_id=user.id,
            matiere=user_matter.matiere,
            query="exercice précédent lacunes"
        )
        
        prompt = get_exercise_prompt(
            matiere=user_matter.matiere,
            chapitre=user_matter.chapitre or 'Général',
            niveau_difficulte=user_matter.niveau_difficulte,
            style_apprentissage=student_profile.style_apprentissage,
            contexte_pedagogique=f"Progression actuelle: {user_matter.progression}%",
            rag_context=rag_context
        )
        
        # Appeler l'IA (retourne {"reply": str, "sources": list})
        raw = get_ai_response(prompt)
        reply_text = _get_reply_text(raw)
        exercise_data = _parse_json_from_reply(reply_text)
        if not isinstance(exercise_data, dict):
            exercise_data = {"question": reply_text or "Exercice généré"}
        exercise_data["options"] = _normalize_exercise_options(exercise_data)
        
        return Response({
            "status": "exercise_generated",
            "exercise": exercise_data,
            "metadata": {
                "matiere": user_matter.matiere,
                "chapitre": user_matter.chapitre,
                "difficulty": user_matter.niveau_difficulte
            }
        }, status=status.HTTP_200_OK)

    def _handle_tutor(self, user, student_profile, user_matter, message):
        """Gérer une conversation de tutorat normal"""
        
        # Récupérer le contexte du RAG
        rag_context = rag_service.get_matter_context(
            user_id=user.id,
            matiere=user_matter.matiere,
            query=message
        )
        
        prompt = get_tutor_prompt(
            user_name=user.first_name or user.username,
            matiere=user_matter.matiere,
            chapitre=user_matter.chapitre or 'Général',
            niveau_global=student_profile.niveau_global,
            style_apprentissage=student_profile.style_apprentissage,
            progression=user_matter.progression,
            rag_context=rag_context
        )
        
        # Ajouter le message de l'utilisateur au prompt
        final_prompt = prompt + f"\n\nÉlève: {message}"
        
        # Appeler l'IA (retourne {"reply": str, "sources": list})
        raw = get_ai_response(final_prompt)
        content = _get_reply_text(raw)
        return Response({
            "status": "tutor_response",
            "content": content,
            "metadata": {
                "matiere": user_matter.matiere,
                "progression": user_matter.progression
            }
        }, status=status.HTTP_200_OK)

    def _handle_remediation(self, user, student_profile, user_matter, message):
        """Gérer une session de remédiation (après plusieurs échecs)"""
        
        rag_context = rag_service.get_matter_context(
            user_id=user.id,
            matiere=user_matter.matiere,
            query="récentes erreurs lacunes"
        )
        
        from prompts_templates import REMEDIATION_PROMPT
        prompt = REMEDIATION_PROMPT.format(
            user_name=user.first_name or user.username,
            matiere=user_matter.matiere,
            chapitre=user_matter.chapitre or 'Général',
            failure_count=3,  # À implémenter proprement
            error_types=message,
            rag_context=rag_context
        )
        
        raw = get_ai_response(prompt)
        reply_text = _get_reply_text(raw)
        remediation_data = _parse_json_from_reply(reply_text)
        if not isinstance(remediation_data, dict):
            remediation_data = {"content": reply_text}
        
        return Response({
            "status": "remediation_provided",
            "remediation": remediation_data,
            "metadata": {
                "approach": "Approche de remédiation personnalisée"
            }
        }, status=status.HTTP_200_OK)

    def _handle_summary(self, user, user_matter, conversation_history):
        """Générer et sauvegarder un résumé de conversation"""
        
        prompt = get_summary_prompt(
            user_name=user.first_name or user.username,
            matiere=user_matter.matiere,
            date=str(user_matter.updated_at.date()),
            conversation_history=conversation_history
        )
        
        raw = get_ai_response(prompt)
        reply_text = _get_reply_text(raw)
        summary_data = _parse_json_from_reply(reply_text)
        if not isinstance(summary_data, dict):
            summary_data = {"resume": reply_text, "resume_court": (reply_text or '')[:500]}
        
        # Sauvegarder le résumé dans la BD
        conversation_summary = ConversationSummary.objects.create(
            user=user,
            user_matter=user_matter,
            summary_text=summary_data.get('resume_court', summary_data.get('resume', reply_text[:500])),
            key_concepts=summary_data.get('concepts_couverts', [])
        )
        
        # Sauvegarder dans le RAG
        chroma_id = rag_service.store_conversation_summary(
            user.id,
            user_matter.matiere,
            summary_data
        )
        conversation_summary.chroma_doc_id = chroma_id
        conversation_summary.save()
        
        return Response({
            "status": "summary_saved",
            "summary": summary_data,
            "metadata": {
                "id": conversation_summary.id,
                "saved_at": conversation_summary.created_at
            }
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_learning_progress(request):
    """Endpoint pour obtenir la progression d'apprentissage de l'utilisateur"""
    user = request.user
    
    matters = UserMatter.objects.filter(user=user)
    serializer = UserMatterSerializer(matters, many=True)
    
    return Response({
        "user": user.username,
        "matters": serializer.data,
        "total_progress": sum(m.progression for m in matters) / max(1, len(matters))
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_conversation_history(request):
    """Endpoint pour obtenir l'historique des résumés de conversation"""
    user = request.user
    matiere = request.query_params.get('matiere', None)
    
    if matiere:
        summaries = ConversationSummary.objects.filter(
            user=user,
            user_matter__matiere=matiere
        ).order_by('-created_at')
    else:
        summaries = ConversationSummary.objects.filter(user=user).order_by('-created_at')
    
    serializer = ConversationSummarySerializer(summaries, many=True)
    
    return Response({
        "conversation_history": serializer.data
    }, status=status.HTTP_200_OK)
