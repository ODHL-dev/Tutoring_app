import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, StyleSheet, FlatList, Text, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useGroupStore } from '../contexts/groupStore';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';
import { HeaderUser } from '../components/HeaderUser';
import { StreakCounter } from '../components/StreakCounter';
import { QuickActionButton } from '../components/QuickActionButton';
import { HeroCard } from '../components/HeroCard';
import { SectionTitle } from '../components/SectionTitle';
import { CourseCard } from '../components/CourseCard';
import { StatsWidget } from '../components/StatsWidget';
import { Icon, IconLibrary } from '../components/Icon';

// Types pour les données
interface Course {
  id: string;
  iconName: string;
  iconLibrary?: IconLibrary;
  code: string;
  name: string;
  level: number;
}

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { getGroupsByUser } = useGroupStore();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWide = isWeb && width >= 1024;

  // État simulé - à remplacer par Zustand store
  const [streak] = useState(5);
  const [xp] = useState(2450);
  const [currentProgress] = useState(0.6);
  const groups = user ? getGroupsByUser(user.id) : [];

  const courses: Course[] = [
    { id: '1', iconName: 'book-open-variant', iconLibrary: 'MaterialCommunity', code: 'FR', name: 'Français', level: 4 },
    { id: '2', iconName: 'calculator-variant', iconLibrary: 'MaterialCommunity', code: 'MATH', name: 'Maths', level: 3 },
    { id: '3', iconName: 'atom', iconLibrary: 'MaterialCommunity', code: 'SCI', name: 'Sciences', level: 2 },
    { id: '4', iconName: 'earth', iconLibrary: 'MaterialCommunity', code: 'GEO', name: 'Géographie', level: 3 },
  ];

  const weeklyStats = [
    { iconName: 'book', iconLibrary: 'Feather' as IconLibrary, label: 'Leçons', value: 12, color: colors.primary },
    { iconName: 'clock', iconLibrary: 'Feather' as IconLibrary, label: 'Temps', value: '4h30', color: colors.secondary },
    { iconName: 'target', iconLibrary: 'Feather' as IconLibrary, label: 'Réussite', value: '85%', color: colors.accent },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray50,
    },
    scrollContent: {
      paddingBottom: spacing.xl,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      ...webMaxWidth(1100),
    },
    grid: {
      flexDirection: isWide ? 'row' : 'column',
      gap: spacing.xl,
    },
    column: {
      flex: 1,
      minWidth: 0,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitleWrapper: {
      marginHorizontal: isWeb ? 0 : -spacing.lg,
    },
    quickActionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    quickActionWrapper: {
      width: isWide ? '31%' : '48%',
      minWidth: isWeb ? 170 : undefined,
      marginBottom: spacing.md,
    },
    coursesScroll: {
      paddingTop: spacing.sm,
    },
    coursesContent: {
      gap: spacing.md,
      paddingRight: spacing.lg,
    },
    courseGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    objectiveCard: {
      backgroundColor: colors.white,
      borderRadius: 14,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.gray100,
      ...(isWeb
        ? { boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.08)' }
        : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 2,
          }),
    },
    footerButton: {
      marginTop: spacing.lg,
    },
    groupCard: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.gray100,
      ...(isWeb
        ? { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)' }
        : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    groupInfo: {
      flex: 1,
      gap: spacing.xs,
    },
    groupName: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
    },
    groupMeta: {
      ...typography.body2,
      color: colors.gray600,
    },
    groupCode: {
      marginTop: spacing.xs,
      alignSelf: 'flex-start',
      backgroundColor: colors.primaryLight,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    groupCodeText: {
      ...typography.label,
      color: colors.primary,
      fontWeight: '700',
    },
    emptyText: {
      ...typography.body1,
      color: colors.gray600,
      textAlign: 'center',
    },
  });


  const handleCoursePress = (courseId: string) => {
    console.log('Cours sélectionné:', courseId);
    // navigation.navigate('CourseDetail', { courseId });
  };

  const handleContinue = () => {
    console.log('Continuer la leçon');
    navigation.navigate('Lessons');
  };

  const handleChatPress = () => {
    console.log('Ouvrir le chat');
    navigation.navigate('Chat');
  };

  const handleExercisesPress = () => {
    console.log('Ouvrir les exercices');
    navigation.navigate('Exercises');
  };

  const handleLessonsPress = () => {
    console.log('Ouvrir les leçons');
    navigation.navigate('Lessons');
  };

  const handleProgressPress = () => {
    console.log('Ouvrir la progression');
    navigation.navigate('Progress');
  };

  const handleJoinGroupPress = () => {
    navigation.navigate('GroupInvite', { mode: 'join' });
  };

  const coursesContent = isWide ? (
    <View style={styles.courseGrid}>
      {courses.map((item) => (
        <CourseCard
          key={item.id}
          iconName={item.iconName}
          iconLibrary={item.iconLibrary}
          code={item.code}
          name={item.name}
          level={item.level}
          onPress={() => handleCoursePress(item.id)}
        />
      ))}
    </View>
  ) : (
    <FlatList
      data={courses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CourseCard
          iconName={item.iconName}
          iconLibrary={item.iconLibrary}
          code={item.code}
          name={item.name}
          level={item.level}
          onPress={() => handleCoursePress(item.id)}
        />
      )}
      horizontal
      scrollEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.coursesContent}
    />
  );

  const headerSection = (
    <View style={styles.section}>
      <HeaderUser name={user?.name || 'Étudiant'} onSettingsPress={() => {}} />
    </View>
  );

  const streakSection = (
    <View style={styles.section}>
      <StreakCounter streak={streak} xp={xp} />
    </View>
  );

  const quickActionsSection = (
    <View style={styles.section}>
      <View style={styles.sectionTitleWrapper}>
        <SectionTitle title="Raccourcis" iconName="zap" iconLibrary="Feather" actionText="Personnaliser" />
      </View>
      <View style={styles.quickActionsContainer}>
        <View style={styles.quickActionWrapper}>
          <QuickActionButton
            iconName="message-circle"
            iconLibrary="Feather"
            label="Chat"
            onPress={handleChatPress}
            color={colors.primary}
          />
        </View>
        <View style={styles.quickActionWrapper}>
          <QuickActionButton
            iconName="edit-3"
            iconLibrary="Feather"
            label="Exercices"
            onPress={handleExercisesPress}
            color={colors.secondary}
          />
        </View>
        <View style={styles.quickActionWrapper}>
          <QuickActionButton
            iconName="book-open"
            iconLibrary="Feather"
            label="Leçons"
            onPress={handleLessonsPress}
            color={colors.accent}
          />
        </View>
        <View style={styles.quickActionWrapper}>
          <QuickActionButton
            iconName="bar-chart-2"
            iconLibrary="Feather"
            label="Progression"
            onPress={handleProgressPress}
            color={colors.info}
          />
        </View>
        <View style={styles.quickActionWrapper}>
          <QuickActionButton
            iconName="users"
            iconLibrary="Feather"
            label="Rejoindre"
            onPress={handleJoinGroupPress}
            color={colors.primary}
          />
        </View>
      </View>
    </View>
  );

  const heroSection = (
    <View style={styles.section}>
      <HeroCard
        subject="Mathématiques"
        title="Fractions - Niveau 2"
        progress={currentProgress}
        onPress={handleContinue}
      />
    </View>
  );

  const objectiveSection = (
    <View style={styles.section}>
      <View style={styles.objectiveCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              backgroundColor: colors.accentLight,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon library="MaterialCommunity" name="target" size={18} color={colors.accent} />
          </View>
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.gray900 }}>Objectif du jour</Text>
            <Text style={{ fontSize: 12, color: colors.gray600 }}>
              Complétez 3 exercices pour obtenir 50 XP
            </Text>
          </View>
        </View>
        <View style={{ marginTop: spacing.md, flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.secondary }} />
          <View
            style={{
              flex: 1,
              height: 8,
              backgroundColor: colors.gray200,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <View style={{ width: '60%', height: '100%', backgroundColor: colors.secondary }} />
          </View>
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.secondary }}>60%</Text>
        </View>
      </View>
    </View>
  );

  const coursesSection = (
    <View style={styles.section}>
      <View style={styles.sectionTitleWrapper}>
        <SectionTitle title="Vos cours" iconName="book" iconLibrary="Feather" actionText="Voir plus" />
      </View>
      <View style={styles.coursesScroll}>{coursesContent}</View>
    </View>
  );

  const groupsSection = (
    <View style={styles.section}>
      <View style={styles.sectionTitleWrapper}>
        <SectionTitle title="Mes groupes" iconName="users" iconLibrary="Feather" actionText="Voir tout" />
      </View>
      {groups.length > 0 ? (
        groups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={styles.groupCard}
            onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
            activeOpacity={0.7}
          >
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupMeta}>{group.memberCount} membres</Text>
              <View style={styles.groupCode}>
                <Text style={styles.groupCodeText}>Code: {group.code}</Text>
              </View>
            </View>
            <Icon library="Feather" name="chevron-right" size={20} color={colors.gray400} />
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.emptyText}>Vous n'avez pas encore rejoint de groupe.</Text>
      )}
    </View>
  );

  const statsSection = (
    <View style={styles.section}>
      <StatsWidget title="Votre semaine" stats={weeklyStats} />
    </View>
  );

  const contentBody = isWide ? (
    <View style={styles.grid}>
      <View style={styles.column}>
        {headerSection}
        {streakSection}
        {quickActionsSection}
        {groupsSection}
      </View>
      <View style={styles.column}>
        {heroSection}
        {objectiveSection}
        {coursesSection}
        {statsSection}
      </View>
    </View>
  ) : (
    <>
      {headerSection}
      {streakSection}
      {quickActionsSection}
      {heroSection}
      {objectiveSection}
      {coursesSection}
      {groupsSection}
      {statsSection}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>{contentBody}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
