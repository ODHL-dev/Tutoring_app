import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

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

  login: (email: string, password: string) => Promise<void>;
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
  immer((set, get) => ({
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
        // Pour maintenant, comptes de test en local
        const testUsers: Array<User & { password: string }> = [
          {
            id: 'test-teacher',
            name: 'Prof Test',
            firstName: 'Prof',
            lastName: 'Test',
            email: 'prof@test.com',
            password: '123456',
            role: 'teacher',
            teachingCycle: 'secondaire',
            createdAt: new Date(),
          },
          {
            id: 'test-web-student',
            name: 'Eleve Web',
            firstName: 'Eleve',
            lastName: 'Web',
            email: 'web@test.com',
            password: '123456',
            role: 'student',
            classCycle: 'secondaire',
            classLevel: '3e',
            series: 'A',
            createdAt: new Date(),
          },
          {
            id: 'test-student',
            name: 'Eleve Test',
            firstName: 'Eleve',
            lastName: 'Test',
            email: 'eleve@test.com',
            password: '123456',
            role: 'student',
            classCycle: 'secondaire',
            classLevel: '3e',
            series: 'A',
            createdAt: new Date(),
          },
        ];

        const matchedUser = testUsers.find(
          (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
        );

        if (!matchedUser) {
          throw new Error('Identifiants invalides');
        }

        const { password: _, ...mockUser } = matchedUser;

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

    register: async (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      role: User['role'],
      classCycle?: User['classCycle'],
      classLevel?: string,
      series?: string,
      teachingCycle?: User['teachingCycle']
    ) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // TODO: Intégrer avec l'enregistrement réelle
        const mockUser: User = {
          id: Date.now().toString(),
          name: `${firstName} ${lastName}`.trim(),
          firstName,
          lastName,
          email,
          role,
          classCycle: role === 'student' ? classCycle : undefined,
          classLevel: role === 'student' ? classLevel : undefined,
          series: role === 'student' ? series : undefined,
          teachingCycle: role === 'teacher' ? teachingCycle : undefined,
          createdAt: new Date(),
        };

        set((state) => {
          state.user = mockUser;
          state.isAuthenticated = false;
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

    updateUserName: (name: string) => {
      set((state) => {
        if (!state.user) {
          return;
        }
        state.user.name = name.trim();
      });
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
