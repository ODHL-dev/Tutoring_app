import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeStore {
  isDarkMode: boolean;
  useSystemTheme: boolean;
  setDarkMode: (isDark: boolean) => void;
  setUseSystemTheme: (useSystem: boolean) => void;
  initializeTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  isDarkMode: false,
  useSystemTheme: true,

  setDarkMode: async (isDark: boolean) => {
    set({ isDarkMode: isDark });
    try {
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(isDark));
    } catch (error) {
      console.error('Erreur sauvegarde mode sombre:', error);
    }
  },

  setUseSystemTheme: async (useSystem: boolean) => {
    set({ useSystemTheme: useSystem });
    try {
      await AsyncStorage.setItem('useSystemTheme', JSON.stringify(useSystem));
    } catch (error) {
      console.error('Erreur sauvegarde système theme:', error);
    }
  },

  initializeTheme: async () => {
    try {
      const savedUseSystem = await AsyncStorage.getItem('useSystemTheme');
      const savedDarkMode = await AsyncStorage.getItem('isDarkMode');

      const useSystem = savedUseSystem !== null ? JSON.parse(savedUseSystem) : true;
      set({ useSystemTheme: useSystem });

      if (useSystem) {
        // La détection du système se fait via hook dans les composants
        // Pour l'initialisation, on utilise une valeur par défaut
        set({ isDarkMode: false });
      } else {
        const isDark = savedDarkMode !== null ? JSON.parse(savedDarkMode) : false;
        set({ isDarkMode: isDark });
      }
    } catch (error) {
      console.error('Erreur initialisation thème:', error);
    }
  },
}));
