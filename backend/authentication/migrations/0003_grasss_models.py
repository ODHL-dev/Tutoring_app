# Generated migration for GRASSS system

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_studentprofile_teacherprofile'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentprofile',
            name='niveau_global',
            field=models.CharField(default='beginner', max_length=20),
        ),
        migrations.AddField(
            model_name='studentprofile',
            name='style_apprentissage',
            field=models.CharField(
                choices=[('visual', 'Visuel'), ('auditory', 'Auditif'), ('kinesthetic', 'Kinesthésique'), ('reading_writing', 'Lecture/Écriture'), ('mixed', 'Mixte')],
                default='mixed',
                max_length=20
            ),
        ),
        migrations.AddField(
            model_name='studentprofile',
            name='diagnostic_completed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='studentprofile',
            name='diagnostic_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name='UserMatter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('matiere', models.CharField(max_length=100)),
                ('chapitre', models.CharField(blank=True, max_length=200, null=True)),
                ('objectif', models.TextField(blank=True)),
                ('niveau_difficulte', models.CharField(
                    choices=[('facile', 'Facile'), ('moyen', 'Moyen'), ('difficile', 'Difficile'), ('expert', 'Expert')],
                    default='moyen',
                    max_length=20
                )),
                ('progression', models.FloatField(default=0.0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matters', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'matiere', 'chapitre')},
            },
        ),
        migrations.CreateModel(
            name='ConversationSummary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('summary_text', models.TextField()),
                ('key_concepts', models.JSONField(default=list)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('conversation_date', models.DateTimeField(auto_now=True)),
                ('chroma_doc_id', models.CharField(blank=True, max_length=255, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='conversation_summaries', to=settings.AUTH_USER_MODEL)),
                ('user_matter', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='authentication.usermatter')),
            ],
        ),
    ]
