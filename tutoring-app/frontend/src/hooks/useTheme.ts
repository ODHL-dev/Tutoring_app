import { useThemeStore } from '../contexts/themeStore';
import { lightColors, darkColors } from '../styles/theme';

export function useTheme() {
  const { isDarkMode } = useThemeStore();
  const currentColors = isDarkMode ? darkColors : lightColors;

  return {
    isDarkMode,
    colors: currentColors,
  };
}
