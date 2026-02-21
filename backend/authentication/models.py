from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class User(AbstractUser):
    IS_TEACHER = 'teacher'
    IS_STUDENT = 'student'
    
    ROLE_CHOICES = [
        (IS_TEACHER, 'Enseignant'),
        (IS_STUDENT, 'Élève'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=IS_STUDENT)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


# Profil pour les Élèves
class StudentProfile(models.Model):
    LEARNING_STYLES = [
        ('visual', 'Visuel'),
        ('auditory', 'Auditif'),
        ('kinesthetic', 'Kinesthésique'),
        ('reading_writing', 'Lecture/Écriture'),
        ('mixed', 'Mixte'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    class_cycle = models.CharField(max_length=20, blank=True, null=True)  # primaire ou secondaire
    class_level = models.CharField(max_length=20, blank=True, null=True)  # 6e, 5e, Terminale...
    series = models.CharField(max_length=5, blank=True, null=True)  # A, C, D...
    
    # Données du tunnel d'apprentissage (GRASSS)
    niveau_global = models.CharField(max_length=20, default='beginner')  # beginner, intermediate, advanced
    style_apprentissage = models.CharField(max_length=20, choices=LEARNING_STYLES, default='mixed')
    date_inscription = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    
    # État du diagnostic initial
    diagnostic_completed = models.BooleanField(default=False)
    diagnostic_date = models.DateTimeField(null=True, blank=True)
    diagnostic_questions_json = models.JSONField(null=True, blank=True)  # questions en attente de réponses

    def __str__(self):
        return f"Profil Élève de {self.user.username}"


# Modèle pour les matières scolaires par utilisateur
class UserMatter(models.Model):
    DIFFICULTY_LEVELS = [
        ('facile', 'Facile'),
        ('moyen', 'Moyen'),
        ('difficile', 'Difficile'),
        ('expert', 'Expert'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matters')
    matiere = models.CharField(max_length=100)  # Mathématiques, Français, etc.
    chapitre = models.CharField(max_length=200, blank=True, null=True)  # Algèbre, Conjugaison, etc.
    objectif = models.TextField(blank=True)  # Objectif pédagogique
    niveau_difficulte = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS, default='moyen')
    progression = models.FloatField(default=0.0)  # Pourcentage 0-100
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'matiere', 'chapitre')

    def __str__(self):
        return f"{self.user.username} - {self.matiere} ({self.chapitre})"


# Modèle pour les résumés de conversations
class ConversationSummary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversation_summaries')
    user_matter = models.ForeignKey(UserMatter, on_delete=models.CASCADE, null=True, blank=True)
    
    # Contenu du résumé
    summary_text = models.TextField()  # Texte du résumé de la conversation
    key_concepts = models.JSONField(default=list)  # Liste des concepts clés couverts
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    conversation_date = models.DateTimeField(auto_now=True)
    
    # Stockage vectoriel (id du document Chroma)
    chroma_doc_id = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Résumé - {self.user.username} ({self.created_at.strftime('%Y-%m-%d')})"


# Profil pour les Enseignants
class TeacherProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
    teaching_cycle = models.CharField(max_length=20, blank=True, null=True)  # primaire ou secondaire

    def __str__(self):
        return f"Profil Professeur de {self.user.username}"
