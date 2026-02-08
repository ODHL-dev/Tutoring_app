import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface PDF {
  id: string;
  name: string;
  fileName: string;
  classId: string;
  subject: string;
  uploadedAt: Date;
  vectorized: boolean; // Indique si l'IA a traité le PDF
  url?: string;
  size: number; // en bytes
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  classId: string;
  completedExercises: number;
  totalExercises: number;
  averageScore: number;
  progressionPercentage: number;
  lastActivityDate: Date;
}

export interface Class {
  id: string;
  name: string;
  code: string; // Code d'accès pour les élèves
  subject: string;
  teacherId: string;
  createdAt: Date;
  studentCount: number;
  pdfs: PDF[];
}

interface TeacherState {
  classes: Class[];
  pdfs: PDF[];
  studentProgression: StudentProgress[];
  loading: boolean;
  error: string | null;

  // Classes
  addClass: (name: string, subject: string, teacherId: string) => void;
  updateClass: (classId: string, name: string, subject: string) => void;
  deleteClass: (classId: string) => void;
  getClassById: (classId: string) => Class | undefined;

  // PDFs
  addPDF: (pdf: PDF) => void;
  deletePDF: (pdfId: string) => void;
  getPDFsByClass: (classId: string) => PDF[];
  markPDFAsVectorized: (pdfId: string) => void;

  // Student Progression
  updateStudentProgress: (progress: StudentProgress) => void;
  getClassProgress: (classId: string) => StudentProgress[];
  getStudentProgress: (studentId: string) => StudentProgress | undefined;
}

export const useTeacherStore = create<TeacherState>()(
  immer((set, get) => ({
    classes: [],
    pdfs: [],
    studentProgression: [],
    loading: false,
    error: null,

    // Classes
    addClass: (name: string, subject: string, teacherId: string) => {
      const newClass: Class = {
        id: `class-${Date.now()}`,
        name,
        subject,
        teacherId,
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        createdAt: new Date(),
        studentCount: 0,
        pdfs: [],
      };

      set((state) => {
        state.classes.push(newClass);
      });
    },

    updateClass: (classId: string, name: string, subject: string) => {
      set((state) => {
        const classToUpdate = state.classes.find((c) => c.id === classId);
        if (classToUpdate) {
          classToUpdate.name = name;
          classToUpdate.subject = subject;
        }
      });
    },

    deleteClass: (classId: string) => {
      set((state) => {
        state.classes = state.classes.filter((c) => c.id !== classId);
        state.pdfs = state.pdfs.filter((p) => p.classId !== classId);
        state.studentProgression = state.studentProgression.filter((p) => p.classId !== classId);
      });
    },

    getClassById: (classId: string) => {
      return get().classes.find((c) => c.id === classId);
    },

    // PDFs
    addPDF: (pdf: PDF) => {
      set((state) => {
        state.pdfs.push(pdf);
        const classToUpdate = state.classes.find((c) => c.id === pdf.classId);
        if (classToUpdate) {
          classToUpdate.pdfs.push(pdf);
        }
      });
    },

    deletePDF: (pdfId: string) => {
      set((state) => {
        state.pdfs = state.pdfs.filter((p) => p.id !== pdfId);
        state.classes.forEach((c) => {
          c.pdfs = c.pdfs.filter((p) => p.id !== pdfId);
        });
      });
    },

    getPDFsByClass: (classId: string) => {
      return get().pdfs.filter((p) => p.classId === classId);
    },

    markPDFAsVectorized: (pdfId: string) => {
      set((state) => {
        const pdf = state.pdfs.find((p) => p.id === pdfId);
        if (pdf) {
          pdf.vectorized = true;
        }
      });
    },

    // Student Progression
    updateStudentProgress: (progress: StudentProgress) => {
      set((state) => {
        const existing = state.studentProgression.find((p) => p.studentId === progress.studentId);
        if (existing) {
          Object.assign(existing, progress);
        } else {
          state.studentProgression.push(progress);
        }
      });
    },

    getClassProgress: (classId: string) => {
      return get().studentProgression.filter((p) => p.classId === classId);
    },

    getStudentProgress: (studentId: string) => {
      return get().studentProgression.find((p) => p.studentId === studentId);
    },
  }))
);
