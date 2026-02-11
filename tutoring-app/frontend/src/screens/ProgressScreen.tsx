import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';
import { Icon } from '../components/Icon';

export default function ProgressScreen() {
  const { colors } = useTheme();

  const subjects = [
    { id: 'math', label: 'Maths', progress: 0.7, color: colors.primary },
    { id: 'fr', label: 'Francais', progress: 0.5, color: colors.secondary },
    { id: 'sci', label: 'Sciences', progress: 0.35, color: colors.accent },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray50,
    },
    content: {
      padding: spacing.lg,
      gap: spacing.lg,
      ...webMaxWidth(900),
    },
    header: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    headerTitle: {
      ...typography.h3,
      color: colors.gray900,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },
    headerSubtitle: {
      ...typography.body2,
      color: colors.gray600,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    cardTitle: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
      marginBottom: spacing.md,
    },
    row: {
      marginBottom: spacing.md,
    },
    rowHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    rowLabel: {
      ...typography.body1,
      color: colors.gray800,
      fontWeight: '600',
    },
    rowPct: {
      ...typography.body2,
      color: colors.gray600,
      fontWeight: '600',
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.gray200,
      borderRadius: borderRadius.full,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: borderRadius.full,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    summaryIcon: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryText: {
      ...typography.body1,
      color: colors.gray700,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Progression</Text>
          <Text style={styles.headerSubtitle}>Suivez vos avancees par matiere et objectifs.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resume</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryIcon}>
              <Icon library="Feather" name="bar-chart-2" size={20} color={colors.primary} />
            </View>
            <Text style={styles.summaryText}>Vous etes a 52% de votre objectif hebdomadaire.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Par matiere</Text>
          {subjects.map((item, index) => (
            <View key={item.id} style={[styles.row, index === subjects.length - 1 ? { marginBottom: 0 } : null]}>
              <View style={styles.rowHeader}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowPct}>{Math.round(item.progress * 100)}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${item.progress * 100}%`, backgroundColor: item.color }]} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
