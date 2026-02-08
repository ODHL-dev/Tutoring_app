import { useEffect, useState } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { useThemeStore } from '../contexts/themeStore';
import { lightColors, darkColors } from '../styles/theme';

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const [, setRefresh] = useState(0);
  const { isDarkMode, useSystemTheme } = useThemeStore();

  // Forcer un re-render quand le thème système change
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Force un re-render
      setRefresh((prev) => prev + 1);
    });

    return () => subscription.remove();
  }, []);

  // Déterminer le mode actuel avec fallback
  const isSystemDark = systemColorScheme === 'dark';
  const isCurrentlyDark = useSystemTheme ? isSystemDark : isDarkMode;
  const currentColors = isCurrentlyDark ? darkColors : lightColors;

  return {
    isDarkMode: isCurrentlyDark,
    useSystemTheme,
    colors: currentColors,
    systemColorScheme,
  };
}
