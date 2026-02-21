from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserProfileView, chat_with_tutor, ChangePasswordView

urlpatterns = [
    # Inscription
    path('register/', RegisterView.as_view(), name='auth_register'),
    
    # Connexion (JWT)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Rafraîchir le token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profil utilisateur
    path('profile/', UserProfileView.as_view(), name='user_profile'),

    # Changement de mot de passe
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),

    # Chat avec le tuteur
    path('chat/', chat_with_tutor, name='chat_with_tutor'),
]

# ====== GRASSS TUTORING ROUTES ======

from .views_grasss import (
    UserMatterViewSet,
    TutorChatView,
    get_user_learning_progress,
    get_conversation_history
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'matters', UserMatterViewSet, basename='user-matter')

urlpatterns += [
    # UserMatter routes
    path('', include(router.urls)),
    
    # Tutoring endpoints
    path('tutor/chat/', TutorChatView.as_view(), name='tutor_chat'),
    path('learning/progress/', get_user_learning_progress, name='learning_progress'),
    path('learning/history/', get_conversation_history, name='conversation_history'),
]
