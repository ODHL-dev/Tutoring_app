from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserSerializer, RegisterSerializer
from .models import User
from .serializers import ChangePasswordSerializer
from django.conf import settings
from backend.rag_service import get_ai_response

# Vue pour l'inscription
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer # <-- Utilise le nouveau serializer

# Vue pour voir son propre profil
class UserProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class ChangePasswordView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'Mot de passe mis à jour avec succès'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Chat avec le tuteur IA (temporaire en attendant ChromaDB)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def chat_with_tutor(request):
    user_message = request.data.get('message')
    if not user_message:
        return Response({'error': 'Message vide'}, status=400)
    # Appel au service RAG
    try:
        result = get_ai_response(user_message)
        return Response(result)
    except Exception as e:
        return Response({'error': 'Erreur interne lors de la génération de la réponse'}, status=500)