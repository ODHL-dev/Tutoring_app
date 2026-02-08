import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography } from '../styles/theme';
import { Icon, IconLibrary } from './Icon';

interface SectionTitleProps {
  title: string;
  iconName?: string;
  iconLibrary?: IconLibrary;
  actionText?: string;
}

export function SectionTitle({ title, iconName, iconLibrary = 'Feather', actionText }: SectionTitleProps) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      marginBottom: spacing.md,
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    icon: {
      marginRight: spacing.xs,
    },
    title: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
    },
    action: {
      ...typography.body2,
      color: colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        {iconName && (
          <View style={styles.icon}>
            <Icon library={iconLibrary} name={iconName} size={18} color={colors.gray700} />
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {actionText && <Text style={styles.action}>{actionText}</Text>}
    </View>
  );
}
