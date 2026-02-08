import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useGroupStore } from '../contexts/groupStore';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';
import { Icon } from '../components/Icon';
import { Button } from '../components/Button';

export default function TeacherDashboardScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const {
    getGroupsByUser,
    getMembersByGroup,
    getEvaluationsByGroup,
    difficulties,
  } = useGroupStore();

  const groups = user ? getGroupsByUser(user.id) : [];

  const memberMap = useMemo(() => {
    const map = new Map<string, string>();
    groups.forEach((group) => {
      getMembersByGroup(group.id).forEach((member) => {
        map.set(member.userId, member.displayName);
      });
    });
    return map;
  }, [groups, getMembersByGroup]);

  const evaluations = useMemo(() => {
    return groups.flatMap((group) => getEvaluationsByGroup(group.id));
  }, [groups, getEvaluationsByGroup]);

  const stats = useMemo(() => {
    const totalMembers = groups.reduce((sum, group) => sum + group.memberCount, 0);
    const avgScore = evaluations.length
      ? Math.round(evaluations.reduce((sum, item) => sum + item.avgScore, 0) / evaluations.length)
      : 0;
    const avgAttendance = evaluations.length
      ? Math.round(
          evaluations.reduce((sum, item) => sum + item.attendancePct, 0) / evaluations.length
        )
      : 0;
    const avgProgression = evaluations.length
      ? Math.round(
          evaluations.reduce((sum, item) => sum + item.progressionPct, 0) / evaluations.length
        )
      : 0;
    return { totalMembers, avgScore, avgAttendance, avgProgression };
  }, [groups, evaluations]);

  const alerts = useMemo(() => {
    const groupIds = new Set(groups.map((group) => group.id));
    return difficulties
      .filter((item) => groupIds.has(item.groupId))
      .sort((a, b) => b.difficultyScore - a.difficultyScore)
      .slice(0, 4);
  }, [groups, difficulties]);

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
      ...webMaxWidth(1100),
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    headerTitle: {
      ...typography.h3,
      color: colors.gray900,
      fontWeight: '700',
    },
    headerSubtitle: {
      ...typography.body2,
      color: colors.gray600,
      marginTop: spacing.xs,
    },
    headerActions: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      ...webMaxWidth(1100),
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    statCard: {
      flexGrow: 1,
      minWidth: '46%',
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    statValue: {
      ...typography.h3,
      color: colors.primary,
      fontWeight: '700',
    },
    statLabel: {
      ...typography.body2,
      color: colors.gray600,
      marginTop: spacing.xs,
    },
    sectionTitle: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
      marginBottom: spacing.md,
    },
    groupCard: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    groupHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    groupName: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
    },
    groupMeta: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.xs,
    },
    groupMetaText: {
      ...typography.body2,
      color: colors.gray600,
    },
    groupCode: {
      marginTop: spacing.sm,
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
    alertsCard: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.gray100,
      marginBottom: spacing.lg,
    },
    alertRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray100,
    },
    alertName: {
      ...typography.body2,
      color: colors.gray900,
      fontWeight: '600',
    },
    alertMeta: {
      ...typography.body2,
      color: colors.gray600,
    },
    progressCard: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.gray200,
      borderRadius: borderRadius.full,
      overflow: 'hidden',
      marginTop: spacing.sm,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
    },
    emptyText: {
      ...typography.body2,
      color: colors.gray600,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Dashboard professeur</Text>
            <Text style={styles.headerSubtitle}>Bonjour, {user?.firstName ?? 'Prof'}</Text>
          </View>
          <View style={styles.headerActions}>
            <Button
              title="Groupes"
              size="sm"
              variant="outline"
              onPress={() => navigation.navigate('TeacherGroups')}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{groups.length}</Text>
            <Text style={styles.statLabel}>Groupes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalMembers}</Text>
            <Text style={styles.statLabel}>Membres</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.avgScore}%</Text>
            <Text style={styles.statLabel}>Moyenne</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.avgAttendance}%</Text>
            <Text style={styles.statLabel}>Assiduite</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Mes groupes</Text>
        {groups.length > 0 ? (
          groups.map((group) => (
            <View key={group.id} style={styles.groupCard}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupName}>{group.name}</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
                >
                  <Icon library="Feather" name="arrow-right" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.groupMeta}>
                <Text style={styles.groupMetaText}>{group.memberCount} membres</Text>
              </View>
              <View style={styles.groupCode}>
                <Text style={styles.groupCodeText}>Code: {group.code}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Aucun groupe pour le moment.</Text>
        )}

        <Text style={styles.sectionTitle}>Alertes</Text>
        <View style={styles.alertsCard}>
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <View
                key={alert.id}
                style={[styles.alertRow, index === alerts.length - 1 ? { borderBottomWidth: 0 } : null]}
              >
                <View>
                  <Text style={styles.alertName}>{memberMap.get(alert.userId) ?? 'Membre'}</Text>
                  <Text style={styles.alertMeta}>{alert.theme}</Text>
                </View>
                <Text style={styles.alertMeta}>{alert.difficultyScore}%</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Aucune alerte en cours.</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Progression globale</Text>
        <View style={styles.progressCard}>
          <Text style={styles.alertMeta}>{stats.avgProgression}% de progression moyenne</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${stats.avgProgression}%` }]} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
