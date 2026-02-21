import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';
import { Icon } from '../components/Icon';
import { Button } from '../components/Button';

export default function TeacherDashboardScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { user } = useAuth();
  

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
            
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Résumé</Text>
        <View style={styles.progressCard}>
          <Text style={styles.alertMeta}>Aucune donnée spécifique disponible.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
