import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeStore {
  isDarkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
  initializeTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDarkMode: false,

  setDarkMode: async (isDark: boolean) => {
    set({ isDarkMode: isDark });
    try {
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(isDark));
    } catch (error) {
      console.error('Erreur sauvegarde mode sombre:', error);
    }
  },

  initializeTheme: async () => {
    try {
      const savedDarkMode = await AsyncStorage.getItem('isDarkMode');
      const isDark = savedDarkMode !== null ? JSON.parse(savedDarkMode) : false;
      set({ isDarkMode: isDark });
    } catch (error) {
      console.error('Erreur initialisation thème:', error);
    }
  },
}));
