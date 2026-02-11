import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useColorScheme, Appearance, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { lightColors, darkColors } from './styles/theme';
import { useThemeStore } from './contexts/themeStore';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  const systemColorScheme = useColorScheme();
  const { isDarkMode, useSystemTheme, initializeTheme } = useThemeStore();
  const [, setRefresh] = useState(0);

  // Initialiser le thème au démarrage
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Forcer un re-render quand le thème système change
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setRefresh((prev) => prev + 1);
    });

    return () => subscription.remove();
  }, []);

  // Déterminer le mode actuel
  const isCurrentlyDark = useSystemTheme ? systemColorScheme === 'dark' : isDarkMode;
  const currentColors = isCurrentlyDark ? darkColors : lightColors;

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    const root = document.getElementById('root');
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.overflow = 'auto';
    document.body.style.overscrollBehavior = 'none';
    document.body.style.backgroundColor = currentColors.gray50;
    if (root) {
      root.style.height = '100%';
      root.style.backgroundColor = currentColors.gray50;
    }
  }, [currentColors.gray50]);

  console.log('=== App rendering ===');
  console.log('isDarkMode:', isCurrentlyDark, 'useSystemTheme:', useSystemTheme, 'systemScheme:', systemColorScheme);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.white,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle={isCurrentlyDark ? 'light-content' : 'dark-content'} 
        backgroundColor={currentColors.white} 
      />
      <RootNavigator />
    </View>
  );
}
