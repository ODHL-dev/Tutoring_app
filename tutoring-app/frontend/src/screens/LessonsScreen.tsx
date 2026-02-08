import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';
import { Icon, IconLibrary } from '../components/Icon';

interface Lesson {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  duration: string;
  progress: number;
  icon: string;
  iconLibrary: IconLibrary;
}

interface Exercise {
  id: string;
  title: string;
  lessonId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  completed: boolean;
}

export default function LessonsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'courses' | 'exercises'>('courses');
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

  // Données simulées - à remplacer par Zustand store
  const lessons: Lesson[] = [
    {
      id: '1',
      title: 'Introduction à l\'Algèbre',
      subject: 'Mathématiques',
      subjectCode: 'MATH',
      duration: '45 min',
      progress: 0.75,
      icon: 'calculator-variant',
      iconLibrary: 'MaterialCommunity',
    },
    {
      id: '2',
      title: 'Les Verbes au Passé Composé',
      subject: 'Français',
      subjectCode: 'FR',
      duration: '30 min',
      progress: 0.5,
      icon: 'book-open-variant',
      iconLibrary: 'MaterialCommunity',
    },
    {
      id: '3',
      title: 'La Photosynthèse',
      subject: 'Sciences',
      subjectCode: 'SCI',
      duration: '50 min',
      progress: 0.9,
      icon: 'atom',
      iconLibrary: 'MaterialCommunity',
    },
  ];

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray50,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      ...webMaxWidth(1100),
    },
    headerTitle: {
      ...typography.h3,
      color: colors.gray900,
      fontWeight: '700',
      marginBottom: spacing.lg,
    },
    tabContainer: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.lg,
      ...webMaxWidth(1100),
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
      alignItems: 'center',
      backgroundColor: colors.white,
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
      ...webMaxWidth(1100),
    },
    lessonCard: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    lessonHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    lessonInfo: {
      flex: 1,
      gap: spacing.xs,
    },
    lessonTitle: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
    },
    lessonMeta: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    metaText: {
      ...typography.body2,
      color: colors.gray600,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.gray200,
      borderRadius: borderRadius.full,
      overflow: 'hidden',
      marginVertical: spacing.sm,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
    },
    expandButton: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.full,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    exerciseContainer: {
      backgroundColor: colors.gray50,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginTop: spacing.md,
    },
    exerciseItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray200,
    },
    exerciseItemLast: {
      borderBottomWidth: 0,
    },
    exerciseInfo: {
      flex: 1,
      gap: spacing.xs,
    },
    exerciseName: {
      ...typography.body2,
      color: colors.gray900,
      fontWeight: '600',
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
      alignSelf: 'flex-start',
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
      ...typography.body2,
      fontWeight: '600',
      color: colors.white,
    },
    pointsText: {
      ...typography.body2,
      color: colors.gray600,
    },
    checkIconSpacer: {
      marginLeft: spacing.md,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
    },
    emptyText: {
      ...typography.body1,
      color: colors.gray600,
      textAlign: 'center',
    },
  });

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

  const LessonCardComponent = ({ lesson }: { lesson: Lesson }) => {
    const isExpanded = expandedLessonId === lesson.id;
    const exercises = exercisesByLesson[lesson.id] || [];

    return (
      <TouchableOpacity 
        style={styles.lessonCard}
        onPress={() => navigation.navigate('LessonDetail', { lessonId: lesson.id })}
        activeOpacity={0.7}
      >
        <View style={styles.lessonHeader}>
          <View style={styles.lessonInfo}>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <View style={styles.lessonMeta}>
              <Text style={styles.metaText}>{lesson.subject}</Text>
              <Text style={styles.metaText}>•</Text>
              <Text style={styles.metaText}>{lesson.duration}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
          >
            <Icon
              library="Feather"
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${lesson.progress * 100}%` }]} />
        </View>

        {isExpanded && (
          <View style={styles.exerciseContainer}>
            <Text style={styles.lessonTitle}>Exercices</Text>
            {exercises.length > 0 ? (
              exercises.map((exercise, index) => (
                <View
                  key={exercise.id}
                  style={[styles.exerciseItem, index === exercises.length - 1 && styles.exerciseItemLast]}
                >
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.title}</Text>
                    <View style={styles.exerciseMeta}>
                      <View style={getDifficultyColor(exercise.difficulty)}>
                        <Text style={styles.difficultyText}>
                          {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                        </Text>
                      </View>
                      <Text style={styles.pointsText}>{exercise.points} pts</Text>
                    </View>
                  </View>
                  {exercise.completed && (
                    <View style={styles.checkIconSpacer}>
                      <Icon
                        library="Feather"
                        name="check-circle"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Aucun exercice</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderCourses = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {lessons.map((lesson) => (
        <LessonCardComponent key={lesson.id} lesson={lesson} />
      ))}
    </ScrollView>
  );

  const renderExercises = () => {
    const allExercises = Object.values(exercisesByLesson).flat();
    const incompleteExercises = allExercises.filter((ex) => !ex.completed);

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {incompleteExercises.length > 0 ? (
          incompleteExercises.map((exercise) => {
            const lesson = lessons.find((l) => l.id === exercise.lessonId);
            return (
              <View key={exercise.id} style={styles.lessonCard}>
                <Text style={styles.metaText}>{lesson?.subject}</Text>
                <Text style={styles.lessonTitle}>{exercise.title}</Text>
                <Text style={styles.metaText}>{lesson?.title}</Text>
                <View style={styles.exerciseMeta}>
                  <View style={getDifficultyColor(exercise.difficulty)}>
                    <Text style={styles.difficultyText}>
                      {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                    </Text>
                  </View>
                  <Text style={styles.pointsText}>{exercise.points} pts</Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>✓ Tous les exercices sont complétés!</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Leçons</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'courses' && styles.tabActive]}
            onPress={() => setActiveTab('courses')}
          >
            <Text style={[styles.tabText, activeTab === 'courses' && styles.tabTextActive]}>Cours</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'exercises' && styles.tabActive]}
            onPress={() => setActiveTab('exercises')}
          >
            <Text style={[styles.tabText, activeTab === 'exercises' && styles.tabTextActive]}>Exercices</Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'courses' ? renderCourses() : renderExercises()}
    </SafeAreaView>
  );
}
