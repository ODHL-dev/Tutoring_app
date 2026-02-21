import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

export interface StudentProfileInfo {
  diagnosticCompleted: boolean;
  classLevel?: string | null;
}

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  role: 'student';
  classCycle?: 'primaire' | 'secondaire';
  classLevel?: string;
  series?: string;
  profilePicture?: string;
  createdAt: Date;
  /** Présent pour les élèves : utilisé pour rediriger vers l'évaluation au premier login */
  studentProfile?: StudentProfileInfo | null;
}    

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** true tant que la session stockée n'a pas été vérifiée au démarrage (évite flash Login) */
  isRehydrating: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: User['role'],
    classCycle?: User['classCycle'],
    classLevel?: string,
    series?: string,
    teachingCycle?: string
  ) => Promise<void>;
  
  logout: () => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
  /** Restaure la session depuis les tokens stockés (au chargement / après refresh) */
  rehydrateAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  immer((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isRehydrating: true,
    error: null,

    // --- CONNEXION (implémentation finale) et INSCRIPTION ---

    register: async (username, firstName, lastName, email, password, role, classCycle, classLevel, series, teachingCycle) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const payload = {
          username,
          email,
          first_name: firstName,
          last_name: lastName,
          password,
          role,
          classCycle: classCycle || '',
          classLevel: classLevel || '',
          series: series || '',
          teachingCycle: teachingCycle || '',
        };

        await apiClient.post('auth/register/', payload);

        // On ne se logge pas automatiquement ici — la redirection vers Login
        // est gérée par l'écran RegisterScreen. On conserve juste l'état.
        set((state) => {
          state.isLoading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.response?.data || error.message || 'Erreur d\'enregistrement';
          state.isLoading = false;
        });
        throw error;
      }
    },

    login: async (username, password) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // 1. Récupération des jetons JWT
        const response = await apiClient.post('auth/login/', {
          username: username, 
          password: password
        });

        const { access, refresh } = response.data;

        // 2. Sauvegarde immédiate dans le téléphone
        await AsyncStorage.setItem('accessToken', access);
        await AsyncStorage.setItem('refreshToken', refresh);

        // 3. Appel au backend pour récupérer le VRAI profil
        // On force le header ici car AsyncStorage met quelques millisecondes à s'actualiser
        const profileResponse = await apiClient.get('auth/profile/', {
          headers: {
            Authorization: `Bearer ${access}`
          }
        });

        const userData = profileResponse.data;
        const sp = userData.student_profile;

        // 4. Mise à jour de l'état global avec les vraies données
        set((state) => {
          state.isAuthenticated = true;
          state.user = {
            id: userData.id.toString(),
            username: userData.username,
            name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.username,
            role: 'student',
            createdAt: new Date(),
            studentProfile: sp ? {
              diagnosticCompleted: !!sp.diagnostic_completed,
              classLevel: sp.class_level ?? undefined,
            } : null,
          };
          state.isLoading = false;
        });

      } catch (error: any) {
        set((state) => {
          state.isLoading = false;
          state.error = error.response?.data?.detail || "Erreur de connexion avec le serveur";
        });
        throw error;
      }
    },

    // updateUserName removed — no-op (username changes handled server-side if at all)

    // --- NOUVELLE LOGIQUE DE DECONNEXION ---
    logout: async () => {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      
      set((state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },

    refreshProfile: async () => {
      try {
        const res = await apiClient.get('auth/profile/');
        const userData = res.data;
        const sp = userData.student_profile;
        set((state) => {
          if (state.user) {
            state.user.studentProfile = sp ? {
              diagnosticCompleted: !!sp.diagnostic_completed,
              classLevel: sp.class_level ?? undefined,
            } : null;
          }
        });
      } catch {
        // ignore
      }
    },

    rehydrateAuth: async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token || !token.trim()) {
          set((state) => { state.isRehydrating = false; });
          return;
        }
        const profileResponse = await apiClient.get('auth/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = profileResponse.data;
        const sp = userData.student_profile;
        set((state) => {
          state.isAuthenticated = true;
          state.user = {
            id: userData.id.toString(),
            username: userData.username,
            name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.username,
            role: 'student',
            createdAt: new Date(),
            studentProfile: sp ? {
              diagnosticCompleted: !!sp.diagnostic_completed,
              classLevel: sp.class_level ?? undefined,
            } : null,
          };
          state.isRehydrating = false;
        });
      } catch {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.isRehydrating = false;
        });
      }
    },
  }))
);