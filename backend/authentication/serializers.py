from rest_framework import serializers
from .models import User, StudentProfile, TeacherProfile

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['class_cycle', 'class_level', 'series']

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