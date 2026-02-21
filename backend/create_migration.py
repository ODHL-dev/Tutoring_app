import os
import sys
import django

# Ajouter le chemin du projet
project_path = "/home/felix/Documents/Documents/L3/Programmation web avancee/version1/Tutoring_app/backend"
sys.path.insert(0, project_path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django.setup()

from django.core.management import call_command
call_command('makemigrations', 'authentication', verbosity=2)
