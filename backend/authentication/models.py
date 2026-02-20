from django.contrib.auth.models import AbstractUser
from django.db import models

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
class StudentProfile(models.fields.related.OneToOneField):
    pass # Remplacé par une vraie classe ci-dessous

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    class_cycle = models.CharField(max_length=20, blank=True, null=True) # primaire ou secondaire
    class_level = models.CharField(max_length=20, blank=True, null=True) # 6e, 5e, Terminale...
    series = models.CharField(max_length=5, blank=True, null=True) # A, C, D...

    def __str__(self):
        return f"Profil Élève de {self.user.username}"

# Profil pour les Enseignants
class TeacherProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
    teaching_cycle = models.CharField(max_length=20, blank=True, null=True) # primaire ou secondaire

    def __str__(self):
        return f"Profil Professeur de {self.user.username}"