from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserProfileView

urlpatterns = [
    # Inscription
    path('register/', RegisterView.as_view(), name='auth_register'),
    
    # Connexion (récupère les tokens Access et Refresh)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Rafraîchir le token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profil utilisateur
    path('profile/', UserProfileView.as_view(), name='user_profile'),
]