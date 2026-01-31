import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent';
  profilePicture?: string;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: User['role']) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // TODO: Intégrer avec l'authentification réelle
        // Pour maintenant, simulation en local
        const mockUser: User = {
          id: '1',
          name: 'Utilisateur Test',
          email,
          role: 'student',
          createdAt: new Date(),
        };

        set((state) => {
          state.user = mockUser;
          state.isAuthenticated = true;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Erreur d\'authentification';
          state.isLoading = false;
        });
        throw error;
      }
    },

    register: async (name: string, email: string, password: string, role: User['role']) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // TODO: Intégrer avec l'enregistrement réelle
        const mockUser: User = {
          id: Date.now().toString(),
          name,
          email,
          role,
          createdAt: new Date(),
        };

        set((state) => {
          state.user = mockUser;
          state.isAuthenticated = true;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Erreur d\'enregistrement';
          state.isLoading = false;
        });
        throw error;
      }
    },

    logout: () => {
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
