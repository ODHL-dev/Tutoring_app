"""
Views API pour le système GRASSS
Endpoints pour le tutorat IA avec RAG
"""

import json
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
    get_summary_prompt
)
from backend.rag_service import get_ai_response  # Service IA existant


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
        student_profile = user.student_profile
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
            # Routing logique basé sur l'action
            if action == 'diagnostic' and not student_profile.diagnostic_completed:
                return self._handle_diagnostic(user, student_profile, matiere, user_matter)
            
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

    def _handle_diagnostic(self, user, student_profile, matiere, user_matter):
        """Gérer le diagnostic initial"""
        
        # Étape 1: Poser des questions
        if not hasattr(user, '_diagnostic_questions_posed'):
            prompt = get_diagnostic_prompt(
                matiere=matiere,
                niveau_scolaire=student_profile.class_level or 'Unknown'
            )
            
            # Appeler l'IA pour obtenir les questions
            ai_response = get_ai_response(prompt)
            
            try:
                diagnostic_data = json.loads(ai_response)
            except:
                diagnostic_data = {"raw_response": ai_response}
            
            # Stocker dans le RAG
            rag_service.store_user_diagnostic(user.id, diagnostic_data)
            
            return Response({
                "status": "diagnostic_questions_posed",
                "questions": diagnostic_data.get('questions', []),
                "next_action": "Répondez à ces questions puis continuez"
            }, status=status.HTTP_200_OK)
        
        # Étape 2: Analyser les réponses
        else:
            # Ce serait implémenté avec l'analyse des réponses
            # Mettre à jour le profil utilisateur
            student_profile.diagnostic_completed = True
            student_profile.save()
            
            return Response({
                "status": "diagnostic_completed",
                "message": "Diagnostic terminé. Votre profil a été mis à jour."
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
        
        # Appeler l'IA
        ai_response = get_ai_response(prompt)
        
        try:
            exercise_data = json.loads(ai_response)
        except:
            exercise_data = {"question": ai_response}
        
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
        
        # Appeler l'IA
        tutor_response = get_ai_response(final_prompt)
        
        return Response({
            "status": "tutor_response",
            "content": tutor_response,
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
        
        ai_response = get_ai_response(prompt)
        
        try:
            remediation_data = json.loads(ai_response)
        except:
            remediation_data = {"content": ai_response}
        
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
        
        ai_response = get_ai_response(prompt)
        
        try:
            summary_data = json.loads(ai_response)
        except:
            summary_data = {"resume": ai_response}
        
        # Sauvegarder le résumé dans la BD
        conversation_summary = ConversationSummary.objects.create(
            user=user,
            user_matter=user_matter,
            summary_text=summary_data.get('resume_court', ai_response),
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
