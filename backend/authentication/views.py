from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from .models import User

from rest_framework.decorators import api_view
from rest_framework.response import Response
#from .rag_service import get_ai_response  Import du service créé à l'étape 3


from .rag_service import get_ai_response  # On importe la logique IA

# Vue pour l'inscription
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

# Vue pour voir son propre profil
class UserProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    

   

@api_view(['POST'])
def chat_with_tutor(request):
    user_message = request.data.get('message')
    if not user_message:
        return Response({'error': 'Message vide'}, status=400)
    
    try:
        ai_reply = get_ai_response(user_message)
        return Response({'reply': ai_reply})
    except Exception as e:
        return Response({'error': str(e)}, status=500)