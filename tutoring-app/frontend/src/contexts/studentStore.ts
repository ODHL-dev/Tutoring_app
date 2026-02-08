import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface StudentProgress {
  studentId: string;
  totalLessonsCompleted: number;
  currentLevel: 'débutant' | 'amateur' | 'pro' | 'expert';
  score: number;
  revisionSchedule: Array<{
    lessonId: string;
    nextReviewDate: Date;
  }>;
}

interface StudentState {
  progress: StudentProgress | null;
  isLoading: boolean;

  loadProgress: (studentId: string) => Promise<void>;
  updateProgress: (progress: Partial<StudentProgress>) => void;
  addCompletedLesson: (lessonId: string) => void;
}

export const useStudentStore = create<StudentState>()(
  immer((set) => ({
    progress: null,
    isLoading: false,

    loadProgress: async (studentId: string) => {
      set((state) => {
        state.isLoading = true;
      });

      try {
        // TODO: Charger depuis SQLite/AsyncStorage
        const mockProgress: StudentProgress = {
          studentId,
          totalLessonsCompleted: 0,
          currentLevel: 'débutant',
          score: 0,
          revisionSchedule: [],
        };

        set((state) => {
          state.progress = mockProgress;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    updateProgress: (updates: Partial<StudentProgress>) => {
      set((state) => {
        if (state.progress) {
          Object.assign(state.progress, updates);
        }
      });
    },

    addCompletedLesson: (lessonId: string) => {
      set((state) => {
        if (state.progress) {
          state.progress.totalLessonsCompleted += 1;
          state.progress.score += 10;
        }
      });
    },
  }))
);
