from django.db import models

# Create your models here.
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