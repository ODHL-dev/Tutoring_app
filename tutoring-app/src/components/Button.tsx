import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { typography, spacing, borderRadius, shadows } from '../styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.gray300;
    if (variant === 'primary') return colors.primary;
    if (variant === 'secondary') return colors.secondary;
    return 'transparent';
  };

  const getTextColor = () => {
    if (variant === 'outline') return colors.primary;
    return colors.white;
  };

  const getPadding = () => {
    if (size === 'sm') return spacing.md;
    if (size === 'lg') return spacing.lg;
    return spacing.md;
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: getBackgroundColor(),
      paddingVertical: getPadding(),
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      width: fullWidth ? '100%' : 'auto',
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: variant === 'outline' ? colors.primary : 'transparent',
      ...shadows.sm,
    },
    text: {
      color: getTextColor(),
      ...typography.label,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={styles.button}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{loading ? 'Chargement...' : title}</Text>
    </TouchableOpacity>
  );
}
