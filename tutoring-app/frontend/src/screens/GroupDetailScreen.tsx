import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useGroupStore } from '../contexts/groupStore';
import { useAuthStore } from '../contexts/authStore';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';
import { Icon } from '../components/Icon';
import { Button } from '../components/Button';

export default function GroupDetailScreen({ route, navigation }: any) {
  const { colors } = useTheme();
  const { groupId } = route.params;
  const { user } = useAuthStore();

  const {
    getGroupById,
    getMembersByGroup,
    getMemberRole,
    getEvaluationsByGroup,
    getEvaluationByUser,
    getDifficultiesByUser,
    getNotesByUser,
  } = useGroupStore();

  const group = getGroupById(groupId);
  const members = getMembersByGroup(groupId);
  const evaluations = getEvaluationsByGroup(groupId);
  const role = user ? getMemberRole(groupId, user.id) : undefined;
  const isOwner = role === 'owner';

  const [activeTab, setActiveTab] = useState<'members' | 'me'>(isOwner ? 'members' : 'me');

  const evaluationMap = useMemo(() => {
    const map = new Map<string, typeof evaluations[number]>();
    evaluations.forEach((evaluation) => {
      map.set(evaluation.userId, evaluation);
    });
    return map;
  }, [evaluations]);

  const myEvaluation = user ? getEvaluationByUser(groupId, user.id) : undefined;
  const myDifficulties = user ? getDifficultiesByUser(groupId, user.id) : [];
  const myNotes = user ? getNotesByUser(groupId, user.id) : [];

  if (!group) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray50 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Groupe non trouve</Text>
        </View>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray50,
    },
    header: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray100,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.lg,
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
    headerTitle: {
      ...typography.h3,
      color: colors.gray900,
      fontWeight: '700',
    },
    headerSubtitle: {
      ...typography.body2,
      color: colors.gray600,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    headerActions: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.lg,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.primaryLight,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    statNumber: {
      ...typography.h4,
      color: colors.primary,
      fontWeight: '700',
    },
    statLabel: {
      ...typography.body2,
      fontSize: 12,
      color: colors.primary,
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
    memberCard: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.gray100,
      gap: spacing.sm,
    },
    memberHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    memberName: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
    },
    roleBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.gray100,
    },
    roleBadgeText: {
      ...typography.label,
      fontSize: 11,
      color: colors.gray700,
      fontWeight: '600',
    },
    kpiRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    kpiItem: {
      flex: 1,
      alignItems: 'center',
    },
    kpiValue: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
    },
    kpiLabel: {
      ...typography.body2,
      fontSize: 12,
      color: colors.gray600,
    },
    sectionTitle: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    emptyText: {
      ...typography.body1,
      color: colors.gray600,
      textAlign: 'center',
    },
    infoCard: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.gray100,
      gap: spacing.sm,
    },
    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.xs,
    },
    listLabel: {
      ...typography.body2,
      color: colors.gray700,
    },
    listValue: {
      ...typography.body2,
      color: colors.gray900,
      fontWeight: '600',
    },
  });

  const renderMembersTab = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {members.length > 0 ? (
        members.map((member) => {
          const evaluation = evaluationMap.get(member.userId);
          return (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberHeader}>
                <Text style={styles.memberName}>{member.displayName}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>
                    {member.role === 'owner' ? 'Createur' : 'Membre'}
                  </Text>
                </View>
              </View>
              <View style={styles.kpiRow}>
                <View style={styles.kpiItem}>
                  <Text style={styles.kpiValue}>{evaluation?.progressionPct ?? 0}%</Text>
                  <Text style={styles.kpiLabel}>Progression</Text>
                </View>
                <View style={styles.kpiItem}>
                  <Text style={styles.kpiValue}>{evaluation?.avgScore ?? 0}%</Text>
                  <Text style={styles.kpiLabel}>Moyenne</Text>
                </View>
                <View style={styles.kpiItem}>
                  <Text style={styles.kpiValue}>{evaluation?.attendancePct ?? 0}%</Text>
                  <Text style={styles.kpiLabel}>Assiduite</Text>
                </View>
              </View>
            </View>
          );
        })
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aucun membre pour le moment</Text>
        </View>
      )}
    </ScrollView>
  );

  const renderMyTab = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Mon suivi</Text>
      <View style={styles.infoCard}>
        <View style={styles.kpiRow}>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiValue}>{myEvaluation?.progressionPct ?? 0}%</Text>
            <Text style={styles.kpiLabel}>Progression</Text>
          </View>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiValue}>{myEvaluation?.avgScore ?? 0}%</Text>
            <Text style={styles.kpiLabel}>Moyenne</Text>
          </View>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiValue}>{myEvaluation?.attendancePct ?? 0}%</Text>
            <Text style={styles.kpiLabel}>Assiduite</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Difficultes</Text>
      {myDifficulties.length > 0 ? (
        <View style={styles.infoCard}>
          {myDifficulties.map((difficulty) => (
            <View key={difficulty.id} style={styles.listItem}>
              <Text style={styles.listLabel}>{difficulty.theme}</Text>
              <Text style={styles.listValue}>{difficulty.difficultyScore}%</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aucune difficulte enregistree</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Notes</Text>
      {myNotes.length > 0 ? (
        <View style={styles.infoCard}>
          {myNotes.map((note) => (
            <View key={note.id} style={styles.listItem}>
              <Text style={styles.listLabel}>{note.content}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aucune note pour le moment</Text>
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon library="Feather" name="arrow-left" size={20} color={colors.gray700} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{group.name}</Text>
            <Text style={styles.headerSubtitle}>Code: {group.code}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{group.memberCount}</Text>
            <Text style={styles.statLabel}>Membres</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{evaluations.length}</Text>
            <Text style={styles.statLabel}>Evaluations</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={{ ...styles.statLabel, fontSize: 14 }}>{role ?? 'membre'}</Text>
            <Text style={{ ...styles.statLabel, fontSize: 10 }}>Role</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          {isOwner ? (
            <>
              <Button
                title="Inviter"
                variant="outline"
                size="sm"
                onPress={() => navigation.navigate('GroupInvite', { groupId: group.id, mode: 'share' })}
              />
              <Button
                title="Scanner"
                size="sm"
                onPress={() => navigation.navigate('GroupInvite', { mode: 'scan' })}
              />
            </>
          ) : (
            <Button
              title="Scanner"
              size="sm"
              onPress={() => navigation.navigate('GroupInvite', { mode: 'scan' })}
            />
          )}
        </View>
      </View>

      <View style={styles.tabContainer}>
        {isOwner && (
          <TouchableOpacity
            style={[styles.tab, activeTab === 'members' && styles.tabActive]}
            onPress={() => setActiveTab('members')}
          >
            <Text style={[styles.tabText, activeTab === 'members' && styles.tabTextActive]}>
              Membres ({members.length})
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.tab, activeTab === 'me' && styles.tabActive]}
          onPress={() => setActiveTab('me')}
        >
          <Text style={[styles.tabText, activeTab === 'me' && styles.tabTextActive]}>
            Mon suivi
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'members' && isOwner ? renderMembersTab() : renderMyTab()}
    </SafeAreaView>
  );
}
