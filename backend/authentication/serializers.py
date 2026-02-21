from rest_framework import serializers
from .models import User, StudentProfile, TeacherProfile, UserMatter, ConversationSummary

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['class_cycle', 'class_level', 'series', 'diagnostic_completed']

class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = ['teaching_cycle']

# Utilisé pour voir son propre profil (GET)
class UserSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(read_only=True)
    teacher_profile = TeacherProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'avatar', 'bio', 'student_profile', 'teacher_profile']

# Utilisé spécifiquement pour l'Inscription (POST)
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    classCycle = serializers.CharField(write_only=True, required=False, allow_blank=True)
    classLevel = serializers.CharField(write_only=True, required=False, allow_blank=True)
    series = serializers.CharField(write_only=True, required=False, allow_blank=True)
    teachingCycle = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'role', 'classCycle', 'classLevel', 'series', 'teachingCycle']

    def create(self, validated_data):
        # 1. On extrait les données spécifiques aux profils
        role = validated_data.get('role', User.IS_STUDENT)
        class_cycle = validated_data.pop('classCycle', None)
        class_level = validated_data.pop('classLevel', None)
        series = validated_data.pop('series', None)
        teaching_cycle = validated_data.pop('teachingCycle', None)

        # 2. On crée l'utilisateur de base (avec mot de passe sécurisé)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password'],
            role=role
        )

        # 3. On crée le profil correspondant
        if role == User.IS_STUDENT:
            StudentProfile.objects.create(
                user=user,
                class_cycle=class_cycle,
                class_level=class_level,
                series=series
            )
        elif role == User.IS_TEACHER:
            TeacherProfile.objects.create(
                user=user,
                teaching_cycle=teaching_cycle
            )

        return user


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError('Le mot de passe doit contenir au moins 6 caractères')
        return value

    def validate(self, attrs):
        user = self.context['request'].user
        if not user.check_password(attrs.get('current_password')):
            raise serializers.ValidationError({'current_password': 'Mot de passe actuel incorrect'})
        return attrs

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user

# ====== SERIALIZERS POUR GRASSS ======

class UserMatterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMatter  # À importer
        fields = ['id', 'matiere', 'chapitre', 'objectif', 'niveau_difficulte', 'progression', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class ConversationSummarySerializer(serializers.ModelSerializer):
    matter_details = UserMatterSerializer(source='user_matter', read_only=True)
    
    class Meta:
        model = ConversationSummary  # À importer
        fields = ['id', 'summary_text', 'key_concepts', 'matter_details', 'created_at']
        read_only_fields = ['created_at']


class DiagnosticResponseSerializer(serializers.Serializer):
    """Serializer pour les réponses du diagnostic IA"""
    questions = serializers.ListField(
        child=serializers.DictField(),
        required=False
    )
    niveau_diagnostique = serializers.CharField(required=False)
    lacunes_identifiees = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    points_forts = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    vitesse_comprehension = serializers.CharField(required=False)
    style_apprentissage_probable = serializers.CharField(required=False)
    recommandations = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    plan_action = serializers.DictField(required=False)


class ExerciseResponseSerializer(serializers.Serializer):
    """Serializer pour les réponses d'exercices QCM"""
    question = serializers.CharField()
    options = serializers.ListField(
        child=serializers.DictField()
    )
    difficulty = serializers.CharField()
    competencies = serializers.ListField(
        child=serializers.CharField()
    )
    hint = serializers.CharField(required=False)


CLASS_LEVEL_CHOICES = ['3ème', 'Terminale D']


class TutorRequestSerializer(serializers.Serializer):
    """Serializer pour les requêtes au tuteur"""
    matiere = serializers.CharField(max_length=100)
    chapitre = serializers.CharField(max_length=200, required=False)
    niveau_difficulte = serializers.CharField(required=False, default='moyen')
    message = serializers.CharField(required=False)
    action = serializers.ChoiceField(
        choices=['diagnostic', 'exercise', 'tutor', 'remediation', 'summary'],
        default='tutor'
    )
    class_level = serializers.CharField(required=False, allow_blank=True)
    student_answers = serializers.JSONField(required=False)

    def validate_class_level(self, value):
        if not value or not value.strip():
            return value
        if value.strip() not in CLASS_LEVEL_CHOICES:
            raise serializers.ValidationError(
                f'Classe non autorisée. Choix: {", ".join(CLASS_LEVEL_CHOICES)}'
            )
        return value.strip()


class TutorResponseSerializer(serializers.Serializer):
    """Serializer pour les réponses du tuteur"""
    content = serializers.CharField()
    exercise = ExerciseResponseSerializer(required=False)
    metadata = serializers.DictField(required=False)
