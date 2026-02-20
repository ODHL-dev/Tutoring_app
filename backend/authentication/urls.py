from django.urls import path
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