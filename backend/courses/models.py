from django.db import models

# Create your models here.
from django.db import models

class Subject(models.Model):
    name = models.CharField(max_length=100) # ex: Mathématiques
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, default='book')

    def __str__(self):
        return self.name

class Lesson(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    pdf_file = models.CharField(max_length=255) # Le nom du fichier PDF correspondant pour le RAG
    content_summary = models.TextField(blank=True) # Résumé court pour l'affichage
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.subject.name} - {self.title}"