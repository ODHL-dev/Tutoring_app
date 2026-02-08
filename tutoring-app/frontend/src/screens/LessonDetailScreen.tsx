import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';
import { Icon, IconLibrary } from '../components/Icon';
import { Button } from '../components/Button';

interface Lesson {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  duration: string;
  progress: number;
  icon: string;
  iconLibrary: IconLibrary;
  description: string;
  objectives: string[];
  content: string;
}

interface Exercise {
  id: string;
  title: string;
  lessonId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  completed: boolean;
}

// Données simulées - à remplacer par Zustand store
const lessonData: Record<string, Lesson> = {
  '1': {
    id: '1',
    title: 'Introduction à l\'Algèbre',
    subject: 'Mathématiques',
    subjectCode: 'MATH',
    duration: '45 min',
    progress: 0.75,
    icon: 'calculator-variant',
    iconLibrary: 'MaterialCommunity',
    description: 'Découvrez les fondamentaux de l\'algèbre et apprenez à résoudre vos premières équations.',
    objectives: [
      'Comprendre les variables et les constantes',
      'Résoudre des équations simples',
      'Appliquer l\'algèbre à des problèmes concrets',
    ],
    content: `L'algèbre est la branche des mathématiques qui utilise des symboles (comme x, y) pour représenter des nombres inconnus.

Les bases à retenir:
• Une variable est un symbole représentant un nombre inconnu
• Une équation est une égalité contenant une ou plusieurs variables
• Résoudre une équation = trouver la valeur de la variable

Exemple: 2x + 3 = 7
Étapes:
1. Soustraire 3 des deux côtés: 2x = 4
2. Diviser par 2: x = 2

Vérification: 2(2) + 3 = 4 + 3 = 7 ✓`,
  },
  '2': {
    id: '2',
    title: 'Les Verbes au Passé Composé',
    subject: 'Français',
    subjectCode: 'FR',
    duration: '30 min',
    progress: 0.5,
    icon: 'book-open-variant',
    iconLibrary: 'MaterialCommunity',
    description: 'Maîtrisez la conjugaison des verbes au passé composé avec avoir et être.',
    objectives: [
      'Conjuguer au passé composé',
      'Identifier avoir vs être',
      'Accorder le participe passé',
    ],
    content: `Le passé composé est un temps composé formé de:
- Un auxiliaire (avoir ou être) au présent
- Le participe passé du verbe

Formation avec AVOIR:
J'ai mangé - Tu as parlé - Il a lu

Formation avec ÊTRE:
Je suis allé(e) - Tu es venu(e) - Elle est partie

Accord du participe passé:
- Avec avoir: accord si COD avant le verbe
- Avec être: accord avec le sujet

Exemples:
"Elle est allée au marché" (accord avec sujet féminin)
"Les filles sont venues" (accord avec sujet pluriel)`,
  },
  '3': {
    id: '3',
    title: 'La Photosynthèse',
    subject: 'Sciences',
    subjectCode: 'SCI',
    duration: '50 min',
    progress: 0.9,
    icon: 'atom',
    iconLibrary: 'MaterialCommunity',
    description: 'Explorez le processus vital par lequel les plantes transforment la lumière en énergie.',
    objectives: [
      'Comprendre le rôle de la chlorophylle',
      'Expliquer les équations de la photosynthèse',
      'Identifier les facteurs influençant la photosynthèse',
    ],
    content: `La photosynthèse est le processus par lequel les plantes utilisent la lumière solaire pour produire de l'énergie.

Équation générale:
CO₂ + H₂O + Lumière → Glucose (C₆H₁₂O₆) + O₂

Où cela se passe?
- Les chloroplastes dans les feuilles
- Particulièrement dans les cellules contenant de la chlorophylle

Les étapes:
1. Réactions lumineuses: convertissent l'énergie lumineuse
2. Cycle de Calvin: fabrique du glucose

Importance:
• Produit l'oxygène que nous respirons
• Crée la nourriture pour les plantes
• Base de la plupart des chaînes alimentaires`,
  },
};

const exercisesByLesson: Record<string, Exercise[]> = {
  '1': [
    { id: '1-1', title: 'Résoudre x + 5 = 12', lessonId: '1', difficulty: 'easy', points: 10, completed: true },
    { id: '1-2', title: 'Équations à deux variables', lessonId: '1', difficulty: 'medium', points: 25, completed: false },
    { id: '1-3', title: 'Problèmes contextualisés', lessonId: '1', difficulty: 'hard', points: 50, completed: false },
  ],
  '2': [
    { id: '2-1', title: 'Conjuguer au passé composé', lessonId: '2', difficulty: 'easy', points: 15, completed: true },
    { id: '2-2', title: 'Rédaction courte', lessonId: '2', difficulty: 'medium', points: 30, completed: true },
  ],
  '3': [
    { id: '3-1', title: 'Schéma annoté', lessonId: '3', difficulty: 'medium', points: 20, completed: false },
    { id: '3-2', title: 'QCM sur la photosynthèse', lessonId: '3', difficulty: 'hard', points: 40, completed: false },
  ],
};

export default function LessonDetailScreen({ route, navigation }: any) {
  const { colors } = useTheme();
  const { lessonId } = route.params || {};
  const lesson = lessonData[lessonId];
  const exercises = exercisesByLesson[lessonId] || [];
  const [activeTab, setActiveTab] = useState<'content' | 'exercises'>('content');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray50,
    },
    header: {
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray100,
    },
    headerContent: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      ...webMaxWidth(1100),
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.full,
      backgroundColor: colors.gray100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerInfo: {
      flex: 1,
      gap: spacing.xs,
    },
    headerSubject: {
      ...typography.body2,
      color: colors.gray600,
    },
    headerTitle: {
      ...typography.h3,
      color: colors.gray900,
      fontWeight: '700',
    },
    tabContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.gray200,
      backgroundColor: colors.white,
      ...webMaxWidth(1100),
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
      alignItems: 'center',
    },
    tabActive: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      ...typography.label,
      color: colors.gray600,
      fontWeight: '600',
    },
    tabTextActive: {
      color: colors.primary,
      fontWeight: '700',
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      ...webMaxWidth(1100),
    },
    objectiveCard: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    objectiveTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    objectiveTitle: {
      ...typography.label,
      color: colors.gray600,
    },
    objectiveList: {
      gap: spacing.sm,
    },
    objectiveItem: {
      flexDirection: 'row',
      gap: spacing.md,
      alignItems: 'flex-start',
    },
    objectiveBullet: {
      ...typography.body2,
      color: colors.primary,
      fontWeight: '700',
    },
    objectiveText: {
      ...typography.body2,
      color: colors.gray700,
      flex: 1,
    },
    descriptionCard: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    descriptionText: {
      ...typography.body1,
      color: colors.gray700,
      lineHeight: 22,
    },
    contentCard: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    contentText: {
      ...typography.body2,
      color: colors.gray700,
      lineHeight: 24,
      fontFamily: 'monospace',
    },
    exercisesContainer: {
      gap: spacing.md,
    },
    exerciseCard: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.gray100,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    exerciseInfo: {
      flex: 1,
      gap: spacing.xs,
    },
    exerciseTitle: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
    },
    exerciseMeta: {
      flexDirection: 'row',
      gap: spacing.md,
      alignItems: 'center',
    },
    difficultyBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    difficultyEasy: {
      backgroundColor: colors.primaryLight,
    },
    difficultyMedium: {
      backgroundColor: colors.secondary,
    },
    difficultyHard: {
      backgroundColor: colors.accent,
    },
    difficultyText: {
      ...typography.label,
      fontWeight: '600',
      color: colors.white,
    },
    pointsText: {
      ...typography.body2,
      color: colors.gray600,
    },
    startButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
  });

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Leçon non trouvée</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return styles.difficultyEasy;
      case 'medium':
        return styles.difficultyMedium;
      case 'hard':
        return styles.difficultyHard;
      default:
        return styles.difficultyEasy;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon library="Feather" name="arrow-left" size={20} color={colors.gray700} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerSubject}>{lesson.subject}</Text>
            <Text style={styles.headerTitle}>{lesson.title}</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'content' && styles.tabActive]}
            onPress={() => setActiveTab('content')}
          >
            <Text style={[styles.tabText, activeTab === 'content' && styles.tabTextActive]}>Contenu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'exercises' && styles.tabActive]}
            onPress={() => setActiveTab('exercises')}
          >
            <Text style={[styles.tabText, activeTab === 'exercises' && styles.tabTextActive]}>
              Exercices ({exercises.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'content' ? (
          <>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{lesson.description}</Text>
            </View>

            <View style={styles.objectiveCard}>
              <View style={styles.objectiveTitleRow}>
                <Icon library="Feather" name="book-open" size={16} color={colors.gray600} />
                <Text style={styles.objectiveTitle}>Objectifs de cette leçon</Text>
              </View>
              <View style={styles.objectiveList}>
                {lesson.objectives.map((objective, index) => (
                  <View key={index} style={styles.objectiveItem}>
                    <Text style={styles.objectiveBullet}>•</Text>
                    <Text style={styles.objectiveText}>{objective}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.contentCard}>
              <Text style={styles.contentText}>{lesson.content}</Text>
            </View>
          </>
        ) : (
          <View style={styles.exercisesContainer}>
            {exercises.length > 0 ? (
              exercises.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                    <View style={styles.exerciseMeta}>
                      <View style={[styles.difficultyBadge, getDifficultyColor(exercise.difficulty)]}>
                        <Text style={styles.difficultyText}>
                          {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                        </Text>
                      </View>
                      <Text style={styles.pointsText}>{exercise.points} pts</Text>
                      {exercise.completed && (
                        <Icon library="Feather" name="check-circle" size={16} color={colors.primary} />
                      )}
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Text style={{ ...typography.label, color: colors.primary, fontWeight: '700' }}>
                      {exercise.completed ? 'Revoir' : 'Faire'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.descriptionText}>Aucun exercice pour cette leçon.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
