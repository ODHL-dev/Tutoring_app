import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type GroupRole = 'owner' | 'member';

export interface Group {
  id: string;
  name: string;
  code: string;
  ownerId: string;
  createdAt: Date;
  memberCount: number;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  displayName: string;
  role: GroupRole;
  joinedAt: Date;
}

export interface ExerciseScore {
  exerciseId: string;
  score: number;
}

export interface Evaluation {
  id: string;
  groupId: string;
  userId: string;
  date: Date;
  avgScore: number;
  progressionPct: number;
  attendancePct: number;
  exerciseScores: ExerciseScore[];
}

export interface ThemeDifficulty {
  id: string;
  groupId: string;
  userId: string;
  theme: string;
  difficultyScore: number;
  lastUpdated: Date;
}

export interface Note {
  id: string;
  groupId: string;
  userId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

interface GroupState {
  groups: Group[];
  members: GroupMember[];
  evaluations: Evaluation[];
  difficulties: ThemeDifficulty[];
  notes: Note[];
  loading: boolean;
  error: string | null;

  createGroup: (name: string, ownerId: string, ownerName: string) => Group;
  joinGroupByCode: (code: string, userId: string, userName: string) => Group | null;
  getGroupById: (groupId: string) => Group | undefined;
  getGroupsByUser: (userId: string) => Group[];
  getMembersByGroup: (groupId: string) => GroupMember[];
  getMemberRole: (groupId: string, userId: string) => GroupRole | undefined;
  addEvaluation: (evaluation: Evaluation) => void;
  addThemeDifficulty: (difficulty: ThemeDifficulty) => void;
  addNote: (note: Note) => void;
  getEvaluationsByGroup: (groupId: string) => Evaluation[];
  getEvaluationByUser: (groupId: string, userId: string) => Evaluation | undefined;
  getDifficultiesByUser: (groupId: string, userId: string) => ThemeDifficulty[];
  getNotesByUser: (groupId: string, userId: string) => Note[];
}

const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Groupe Alpha',
    code: 'ALPHA1',
    ownerId: 'user-1',
    createdAt: new Date('2026-01-20T10:00:00.000Z'),
    memberCount: 3,
  },
];

const mockMembers: GroupMember[] = [
  {
    id: 'member-1',
    groupId: 'group-1',
    userId: 'user-1',
    displayName: 'Sara Ben',
    role: 'owner',
    joinedAt: new Date('2026-01-20T10:00:00.000Z'),
  },
  {
    id: 'member-2',
    groupId: 'group-1',
    userId: 'user-2',
    displayName: 'Yanis L',
    role: 'member',
    joinedAt: new Date('2026-01-21T12:30:00.000Z'),
  },
  {
    id: 'member-3',
    groupId: 'group-1',
    userId: 'user-3',
    displayName: 'Lina R',
    role: 'member',
    joinedAt: new Date('2026-01-22T08:15:00.000Z'),
  },
];

const mockEvaluations: Evaluation[] = [
  {
    id: 'eval-1',
    groupId: 'group-1',
    userId: 'user-2',
    date: new Date('2026-02-01T09:00:00.000Z'),
    avgScore: 78,
    progressionPct: 62,
    attendancePct: 90,
    exerciseScores: [
      { exerciseId: 'ex-1', score: 80 },
      { exerciseId: 'ex-2', score: 70 },
      { exerciseId: 'ex-3', score: 85 },
    ],
  },
  {
    id: 'eval-2',
    groupId: 'group-1',
    userId: 'user-3',
    date: new Date('2026-02-01T09:00:00.000Z'),
    avgScore: 91,
    progressionPct: 84,
    attendancePct: 96,
    exerciseScores: [
      { exerciseId: 'ex-1', score: 95 },
      { exerciseId: 'ex-2', score: 88 },
      { exerciseId: 'ex-3', score: 90 },
    ],
  },
];

const mockDifficulties: ThemeDifficulty[] = [
  {
    id: 'diff-1',
    groupId: 'group-1',
    userId: 'user-2',
    theme: 'Equations',
    difficultyScore: 72,
    lastUpdated: new Date('2026-02-02T15:00:00.000Z'),
  },
  {
    id: 'diff-2',
    groupId: 'group-1',
    userId: 'user-2',
    theme: 'Fractions',
    difficultyScore: 64,
    lastUpdated: new Date('2026-02-02T15:00:00.000Z'),
  },
  {
    id: 'diff-3',
    groupId: 'group-1',
    userId: 'user-3',
    theme: 'Geometrie',
    difficultyScore: 40,
    lastUpdated: new Date('2026-02-02T15:00:00.000Z'),
  },
];

const mockNotes: Note[] = [
  {
    id: 'note-1',
    groupId: 'group-1',
    userId: 'user-2',
    authorId: 'user-1',
    content: 'Bonne progression, attention aux equations.',
    createdAt: new Date('2026-02-03T10:20:00.000Z'),
  },
];

export const useGroupStore = create<GroupState>()(
  immer((set, get) => ({
    groups: mockGroups,
    members: mockMembers,
    evaluations: mockEvaluations,
    difficulties: mockDifficulties,
    notes: mockNotes,
    loading: false,
    error: null,

    createGroup: (name: string, ownerId: string, ownerName: string) => {
      const newGroup: Group = {
        id: `group-${Date.now()}`,
        name,
        code: generateCode(),
        ownerId,
        createdAt: new Date(),
        memberCount: 1,
      };

      const newMember: GroupMember = {
        id: `member-${Date.now()}`,
        groupId: newGroup.id,
        userId: ownerId,
        displayName: ownerName,
        role: 'owner',
        joinedAt: new Date(),
      };

      set((state) => {
        state.groups.push(newGroup);
        state.members.push(newMember);
      });

      return newGroup;
    },

    joinGroupByCode: (code: string, userId: string, userName: string) => {
      const group = get().groups.find((g) => g.code === code.toUpperCase());
      if (!group) {
        return null;
      }

      const alreadyMember = get().members.some(
        (member) => member.groupId === group.id && member.userId === userId
      );

      if (alreadyMember) {
        return group;
      }

      const newMember: GroupMember = {
        id: `member-${Date.now()}`,
        groupId: group.id,
        userId,
        displayName: userName,
        role: 'member',
        joinedAt: new Date(),
      };

      set((state) => {
        state.members.push(newMember);
        const groupToUpdate = state.groups.find((g) => g.id === group.id);
        if (groupToUpdate) {
          groupToUpdate.memberCount += 1;
        }
      });

      return group;
    },

    getGroupById: (groupId: string) => {
      return get().groups.find((g) => g.id === groupId);
    },

    getGroupsByUser: (userId: string) => {
      const groupIds = get()
        .members
        .filter((member) => member.userId === userId)
        .map((member) => member.groupId);
      return get().groups.filter((group) => groupIds.includes(group.id));
    },

    getMembersByGroup: (groupId: string) => {
      return get().members.filter((member) => member.groupId === groupId);
    },

    getMemberRole: (groupId: string, userId: string) => {
      return get()
        .members
        .find((member) => member.groupId === groupId && member.userId === userId)?.role;
    },

    addEvaluation: (evaluation: Evaluation) => {
      set((state) => {
        state.evaluations.push(evaluation);
      });
    },

    addThemeDifficulty: (difficulty: ThemeDifficulty) => {
      set((state) => {
        state.difficulties.push(difficulty);
      });
    },

    addNote: (note: Note) => {
      set((state) => {
        state.notes.push(note);
      });
    },

    getEvaluationsByGroup: (groupId: string) => {
      return get().evaluations.filter((evaluation) => evaluation.groupId === groupId);
    },

    getEvaluationByUser: (groupId: string, userId: string) => {
      return get().evaluations.find(
        (evaluation) => evaluation.groupId === groupId && evaluation.userId === userId
      );
    },

    getDifficultiesByUser: (groupId: string, userId: string) => {
      return get().difficulties.filter(
        (difficulty) => difficulty.groupId === groupId && difficulty.userId === userId
      );
    },

    getNotesByUser: (groupId: string, userId: string) => {
      return get().notes.filter((note) => note.groupId === groupId && note.userId === userId);
    },
  }))
);
