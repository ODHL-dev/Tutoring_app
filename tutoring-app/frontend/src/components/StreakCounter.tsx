import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius, shadows } from '../styles/theme';
import { Icon } from './Icon';

interface StreakCounterProps {
  streak: number;
  xp: number;
}

export function StreakCounter({ streak, xp }: StreakCounterProps) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.gray50,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.gray100,
      ...shadows.sm,
      marginBottom: spacing.lg,
    },
    streakContainer: {
      alignItems: 'center',
      gap: spacing.xs,
    },
    streakIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: colors.warningLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    streakValue: {
      ...typography.h4,
      color: colors.warning,
      fontWeight: '700',
    },
    streakLabel: {
      ...typography.caption,
      color: colors.gray600,
    },
    xpContainer: {
      alignItems: 'center',
      gap: spacing.xs,
    },
    xpIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: colors.secondaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    xpValue: {
      ...typography.h4,
      color: colors.secondary,
      fontWeight: '700',
    },
    xpLabel: {
      ...typography.caption,
      color: colors.gray600,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.streakContainer}>
        <View style={styles.streakIcon}>
          <Icon library="MaterialCommunity" name="fire" size={18} color={colors.warning} />
        </View>
        <Text style={styles.streakValue}>{streak}</Text>
        <Text style={styles.streakLabel}>jours</Text>
      </View>
      <View style={styles.xpContainer}>
        <View style={styles.xpIcon}>
          <Icon library="MaterialCommunity" name="star" size={18} color={colors.secondary} />
        </View>
        <Text style={styles.xpValue}>{xp}</Text>
        <Text style={styles.xpLabel}>XP</Text>
      </View>
    </View>
  );
}
