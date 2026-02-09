import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius } from '../styles/theme';
import { Icon } from './Icon';

interface HeaderUserProps {
  name: string;
  avatar?: string;
  onSettingsPress: () => void;
}

export function HeaderUser({ name, avatar = '', onSettingsPress }: HeaderUserProps) {
  const { colors } = useTheme();

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      marginBottom: spacing.lg,
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    avatarContainer: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.full,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.primaryLight,
    },
    avatar: {
      fontSize: 22,
    },
    avatarInitials: {
      ...typography.label,
      color: colors.white,
      fontWeight: '700',
    },
    textContent: {
      gap: spacing.xs,
    },
    greeting: {
      ...typography.body2,
      color: colors.gray600,
    },
    userName: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
    },
    settingsButton: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.full,
      backgroundColor: colors.gray100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    settingsIcon: {
      fontSize: 20,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Text style={styles.avatar}>{avatar}</Text>
          ) : (
            <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
          )}
        </View>
        <View style={styles.textContent}>
          <Text style={styles.greeting}>Bienvenue</Text>
          <Text style={styles.userName}>{name}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress} activeOpacity={0.7}>
        <Icon library="Material" name="settings" size={20} color={colors.gray600} />
      </TouchableOpacity>
    </View>
  );
}
