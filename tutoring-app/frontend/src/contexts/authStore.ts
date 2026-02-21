import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

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
}    

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Modifié pour utiliser username au lieu de email pour le login
  login: (username: string, password: string) => Promise<void>; 
  register: (

    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: User['role'],
    classCycle?: User['classCycle'],
    classLevel?: string,
    series?: string,
    teachingCycle?: User['teachingCycle'],
    // ... autres propriétés
    username: string, // <-- Ajoute ceci !
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: User['role'],
    classCycle?: User['classCycle'],
    classLevel?: string,
    series?: string,
    teachingCycle?: User['teachingCycle']
  ) => Promise<void>;
  
  // updateUserName removed — username changes are not supported from the app
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
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

        // 4. Mise à jour de l'état global avec les vraies données
        set((state) => {
          state.isAuthenticated = true;
          state.user = { 
            id: userData.id.toString(), 
            username: userData.username,
            // Si l'utilisateur n'a pas de nom/prénom, on affiche son pseudo
            name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.username, 
            role: 'student',
            createdAt: new Date() 
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
  }))
);