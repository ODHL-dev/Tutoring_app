import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius } from '../styles/theme';
import { Icon, IconLibrary, MaterialIcons } from './Icon';

interface CourseCardProps {
  iconName: string;
  iconLibrary?: IconLibrary;
  code: string;
  name: string;
  level: number;
  onPress: () => void;
}

export function CourseCard({ iconName, iconLibrary = 'MaterialCommunity', code, name, level, onPress }: CourseCardProps) {
  const { colors } = useTheme();
  const getLevelColor = (lvl: number) => {
    if (lvl >= 4) return colors.secondary;
    if (lvl >= 3) return colors.accent;
    return colors.info;
  };

  const getRatingStars = (lvl: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <MaterialIcons
        key={index}
        name={index < lvl ? 'star' : 'star-border'}
        size={12}
        color={getLevelColor(lvl)}
      />
    ));
  };

  const styles = StyleSheet.create({
    container: {
      width: 140,
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginRight: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    iconWrapper: {
      width: 52,
      height: 52,
      borderRadius: 14,
      backgroundColor: colors.gray50,
      borderWidth: 1,
      borderColor: colors.gray200,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: spacing.sm,
    },
    code: {
      ...typography.label,
      color: colors.gray500,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    name: {
      ...typography.body2,
      color: colors.gray900,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    rating: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 2,
    },
  });

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrapper}>
        <Icon library={iconLibrary} name={iconName} size={26} color={colors.primary} />
      </View>
      <Text style={styles.code}>{code}</Text>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.rating}>{getRatingStars(level)}</View>
    </TouchableOpacity>
  );
}
