import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius } from '../styles/theme';
import { Icon, IconLibrary } from './Icon';

interface QuickActionButtonProps {
  iconName: string;
  iconLibrary?: IconLibrary;
  label: string;
  onPress: () => void;
  color?: string;
}

export function QuickActionButton({ 
  iconName,
  iconLibrary = 'Feather',
  label, 
  onPress, 
  color
}: QuickActionButtonProps) {
  const { colors } = useTheme();
  const buttonColor = color || colors.primary;
  const styles = StyleSheet.create({
    button: {
      flex: 1,
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      borderLeftWidth: 4,
      borderLeftColor: buttonColor,
    },
    iconWrapper: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: colors.gray50,
      borderWidth: 1,
      borderColor: colors.gray200,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      ...typography.body2,
      fontWeight: '600',
      color: colors.gray900,
      textAlign: 'center',
    },
  });

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrapper}>
        <Icon library={iconLibrary} name={iconName} size={26} color={buttonColor} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}
