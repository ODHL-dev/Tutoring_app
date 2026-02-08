import { StyleSheet, Platform, type ViewStyle } from 'react-native';

export const lightColors = {
  primary: '#6366F1', // Indigo
  primaryLight: '#E0E7FF',
  secondary: '#10B981', // Emerald
  secondaryLight: '#D1FAE5',
  accent: '#F59E0B', // Amber
  accentLight: '#FEF3C7',
  
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Status
  error: '#EF4444',
  errorLight: '#FEE2E2',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
};

export const darkColors = {
  primary: '#818CF8', // Indigo lighter
  primaryLight: '#3730A3', // Indigo darker
  secondary: '#34D399', // Emerald lighter
  secondaryLight: '#065F46', // Emerald darker
  accent: '#FBBF24', // Amber lighter
  accentLight: '#78350F', // Amber darker
  
  // Neutrals
  white: '#0F172A', // Dark background (instead of white)
  black: '#F8FAFC', // Light text (instead of black)
  gray50: '#1E293B',
  gray100: '#334155',
  gray200: '#475569',
  gray300: '#64748B',
  gray400: '#94A3B8',
  gray500: '#CBD5E1',
  gray600: '#E2E8F0',
  gray700: '#F1F5F9',
  gray800: '#F8FAFC',
  gray900: '#F8FAFC',
  
  // Status
  error: '#F87171',
  errorLight: '#7F1D1D',
  success: '#6EE7B7',
  successLight: '#064E3B',
  warning: '#FBBF24',
  warningLight: '#78350F',
  info: '#60A5FA',
  infoLight: '#1E3A8A',
};

// Export colors as default (light mode) - pour compatibilité rétroactive
export const colors = lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const typography = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
});

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = StyleSheet.create({
  sm: Platform.select({
    web: {
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
  }) as any,
  md: Platform.select({
    web: {
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  }) as any,
  lg: Platform.select({
    web: {
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
  }) as any,
});

export const getGlobalStyles = (isDark: boolean) => {
  const currentColors = isDark ? darkColors : lightColors;
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.white,
    },
    screenContainer: {
      flex: 1,
      backgroundColor: currentColors.gray50,
    },
    safeContainer: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    centerContent: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    spaceBetween: {
      justifyContent: 'space-between',
    },
  });
};

// Pour compatibilité rétroactive
export const globalStyles = getGlobalStyles(false);

export const webMaxWidth = (maxWidth: number): ViewStyle => {
  if (Platform.OS !== 'web') {
    return {};
  }

  return {
    width: '100%',
    maxWidth,
    alignSelf: 'center',
  };
};
