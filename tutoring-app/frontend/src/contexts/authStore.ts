import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import apiClient from '../api/client';

export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'teacher';
  classCycle?: 'primaire' | 'secondaire';
  classLevel?: string;
  series?: string;
  teachingCycle?: 'primaire' | 'secondaire';
  profilePicture?: string;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null; // Ajouté pour stocker le JWT
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
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
  updateUserName: (name: string) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    token: null,

    login: async (email, password) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // 1. Appel au backend Django pour obtenir le token
        const response = await apiClient.post('auth/login/', { 
          username: email, // Django utilise souvent le username, adapte si ton backend attend 'email'
          password 
        });
        
        const { access } = response.data;
        
        // 2. Configurer Axios pour les futures requêtes
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        
        // 3. Récupérer les infos réelles du profil depuis le backend
        const profileRes = await apiClient.get('auth/profile/');
        
        set((state) => {
          state.user = profileRes.data;
          state.token = access;
          state.isAuthenticated = true;
          state.isLoading = false;
        });

        return { success: true };
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || "Identifiants incorrects";
        set((state) => {
          state.error = errorMessage;
          state.isLoading = false;
        });
        return { success: false, error: errorMessage };
      }
    },

    register: async (firstName, lastName, email, password, role, classCycle, classLevel, series, teachingCycle) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // Ici tu pourras plus tard ajouter l'appel API : await apiClient.post('auth/register/', {...})
        const mockUser: User = {
          id: Date.now().toString(),
          name: `${firstName} ${lastName}`.trim(),
          firstName,
          lastName,
          email,
          role,
          classCycle,
          classLevel,
          series,
          teachingCycle,
          createdAt: new Date(),
        };

        set((state) => {
          state.user = mockUser;
          state.isAuthenticated = false; // On attend souvent la validation ou le login
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : "Erreur d'enregistrement";
          state.isLoading = false;
        });
        throw error;
      }
    },

    updateUserName: (name) => {
      set((state) => {
        if (state.user) state.user.name = name.trim();
      });
    },

    logout: () => {
      delete apiClient.defaults.headers.common['Authorization'];
      set((state) => {
        state.user = null;
        state.token = null;
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

