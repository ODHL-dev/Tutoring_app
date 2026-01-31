import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius } from '../styles/theme';
import { Icon, IconLibrary } from './Icon';

interface StatItem {
  iconName: string;
  iconLibrary?: IconLibrary;
  label: string;
  value: string | number;
  color: string;
}

interface StatsWidgetProps {
  title: string;
  stats: StatItem[];
}

export function StatsWidget({ title, stats }: StatsWidgetProps) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.h4,
      color: colors.gray900,
      marginBottom: spacing.lg,
      fontWeight: '700',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      gap: spacing.md,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      backgroundColor: colors.gray50,
      borderRadius: borderRadius.md,
      borderLeftWidth: 4,
    },
    iconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.gray200,
      alignItems: 'center',
      justifyContent: 'center',
    },
    value: {
      ...typography.h4,
      fontWeight: '700',
      textAlign: 'center',
    },
    label: {
      ...typography.caption,
      color: colors.gray600,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View 
            key={index} 
            style={[styles.statItem, { borderLeftColor: stat.color }]}
          >
            <View style={styles.iconWrapper}>
              <Icon
                library={stat.iconLibrary || 'Feather'}
                name={stat.iconName}
                size={18}
                color={stat.color}
              />
            </View>
            <Text style={[styles.value, { color: stat.color }]}>
              {stat.value}
            </Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
