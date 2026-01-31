import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius } from '../styles/theme';
import { Icon } from './Icon';

interface HeroCardProps {
  subject: string;
  title: string;
  progress: number;
  onPress: () => void;
}

export function HeroCard({ subject, title, progress, onPress }: HeroCardProps) {
  const { colors } = useTheme();
  const progressPercent = Math.round(progress * 100);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.xl,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 5,
    },
    gradient: {
      backgroundColor: colors.primary,
      opacity: 0.05,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    content: {
      position: 'relative',
      zIndex: 1,
    },
    badge: {
      backgroundColor: colors.accentLight,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
      marginBottom: spacing.md,
    },
    badgeContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    badgeText: {
      ...typography.label,
      color: colors.accent,
      fontWeight: '700',
    },
    subject: {
      ...typography.body2,
      color: colors.gray600,
      marginBottom: spacing.sm,
    },
    title: {
      ...typography.h3,
      color: colors.gray900,
      marginBottom: spacing.lg,
      fontWeight: '700',
    },
    progressContainer: {
      marginBottom: spacing.lg,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    progressLabel: {
      ...typography.caption,
      color: colors.gray600,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.gray200,
      borderRadius: borderRadius.full,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.secondary,
      width: `${progressPercent}%`,
    },
    ctaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    ctaButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      flex: 1,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    ctaText: {
      ...typography.body1,
      color: colors.white,
      fontWeight: '600',
    },
    arrow: {
      marginLeft: spacing.xs,
    },
  });

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.gradient} />
      <View style={styles.content}>
        <View style={styles.badge}>
          <View style={styles.badgeContent}>
            <Icon library="Feather" name="zap" size={14} color={colors.accent} />
            <Text style={styles.badgeText}>Continuer</Text>
          </View>
        </View>

        <Text style={styles.subject}>{subject}</Text>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progression</Text>
            <Text style={{ ...typography.caption, color: colors.primary, fontWeight: '600' }}>
              {progressPercent}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        <View style={styles.ctaContainer}>
          <TouchableOpacity 
            style={styles.ctaButton} 
            onPress={onPress}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaText}>Reprendre</Text>
            <View style={styles.arrow}>
              <Icon library="Feather" name="arrow-right" size={16} color={colors.white} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
