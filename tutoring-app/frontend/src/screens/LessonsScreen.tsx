import React, { useMemo, useState, useEffect } from 'react'; // Ajout de useEffect
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';
import { Icon } from '../components/Icon';
import apiClient from '../api/client'; // Import de ton client API

// On adapte l'interface à ce que le backend SubjectSerializer renvoie
interface Lesson {
  id: number;
  title: string;
  pdf_file: string;
  content_summary: string;
  order: number;
}

interface Subject {
  id: number;
  name: string;
  slug: string;
  icon: string;
  lessons: Lesson[];
}

export default function LessonsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'courses' | 'exercises'>('courses');
  const [subjects, setSubjects] = useState<Subject[]>([]); // État pour les données réelles
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSubjectId, setExpandedSubjectId] = useState<number | null>(null);

  // 1. Récupération des données depuis Django
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('courses/subjects/');
        setSubjects(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des cours:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculs basés sur les données réelles
  const allLessons = useMemo(() => subjects.flatMap(s => s.lessons), [subjects]);
  
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.gray50 },
    header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, ...webMaxWidth(1100) },
    headerTitle: { ...typography.h3, color: colors.gray900, fontWeight: '700', marginBottom: spacing.lg },
    tabContainer: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg, ...webMaxWidth(1100) },
    tab: { flex: 1, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: 'center', backgroundColor: colors.white },
    tabActive: { borderBottomColor: colors.primary, borderBottomWidth: 3 },
    content: { flex: 1, paddingHorizontal: spacing.lg, ...webMaxWidth(1100) },
    card: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.gray100 },
    subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    lessonItem: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.gray100, flexDirection: 'row', justifyContent: 'space-between' },
    badge: { backgroundColor: colors.primaryLight, padding: 4, borderRadius: 4, color: colors.primary, fontSize: 10 }
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderCourses = () => (
    <ScrollView style={styles.content}>
      {subjects.map((subject) => (
        <View key={subject.id} style={styles.card}>
          <TouchableOpacity 
            style={styles.subjectHeader}
            onPress={() => setExpandedSubjectId(expandedSubjectId === subject.id ? null : subject.id)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Icon library="MaterialCommunity" name={subject.icon as any} size={24} color={colors.primary} />
              <Text style={typography.h4}>{subject.name}</Text>
            </View>
            <Icon library="Feather" name={expandedSubjectId === subject.id ? "chevron-up" : "chevron-down"} size={20} color={colors.gray400} />
          </TouchableOpacity>

          {expandedSubjectId === subject.id && (
            <View style={{ marginTop: spacing.md }}>
              {subject.lessons.map((lesson) => (
                <TouchableOpacity 
                  key={lesson.id} 
                  style={styles.lessonItem}
                  onPress={() => navigation.navigate('LessonDetail', { lessonId: lesson.id })}
                >
                  <Text style={typography.body1}>{lesson.title}</Text>
                  <Icon library="Feather" name="play-circle" size={18} color={colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Leçons</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, activeTab === 'courses' && styles.tabActive]} onPress={() => setActiveTab('courses')}>
            <Text style={{ color: activeTab === 'courses' ? colors.primary : colors.gray600 }}>Cours</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'exercises' && styles.tabActive]} onPress={() => setActiveTab('exercises')}>
            <Text style={{ color: activeTab === 'exercises' ? colors.primary : colors.gray600 }}>Exercices</Text>
          </TouchableOpacity>
        </View>
      </View>
      {activeTab === 'courses' ? renderCourses() : (
        <View style={styles.content}><Text>Les exercices seront liés aux leçons du backend bientôt.</Text></View>
      )}
    </SafeAreaView>
  );
}