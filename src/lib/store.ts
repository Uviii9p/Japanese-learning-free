import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getXPLevel } from '@/content/courses';

export interface UserProgress {
  userId: string;
  displayName: string;
  avatar: string;
  // Core stats
  totalXP: number;
  streak: number;
  lastStudyDate: string | null;
  // Learning progress
  level: string; // 'beginner' | 'n5' | 'n4' | 'n3' | 'n2' | 'n1'
  jlptLevel: 'Beginner' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  // Learned items
  learnedHiragana: string[];
  learnedKatakana: string[];
  learnedVocabulary: string[];
  learnedKanji: string[];
  learnedGrammar: string[];
  // Completed lessons
  completedLessons: string[];
  // Skill scores (0-100)
  listeningScore: number;
  readingScore: number;
  writingScore: number;
  speakingScore: number;
  // Daily goal
  dailyGoalXP: number;
  todayXP: number;
  todayDate: string;
  // Achievements
  unlockedAchievements: string[];
  // Onboarding
  onboardingComplete: boolean;
  learningGoals: string[];
  // SRS queue
  reviewQueue: ReviewItem[];
  // Settings
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  furiganaMode: 'always' | 'learning' | 'never';
  animationsEnabled: boolean;
  // Bookmarks
  bookmarkedVocab: string[];
  bookmarkedKanji: string[];
  bookmarkedGrammar: string[];
  // Notes
  notes: Note[];
}

export interface ReviewItem {
  id: string;
  type: 'vocabulary' | 'kanji' | 'grammar';
  itemId: string;
  nextReview: string;
  interval: number; // days
  easeFactor: number;
  repetitions: number;
  correct: number;
  incorrect: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  date: string;
  xpEarned: number;
  lessonsCompleted: number;
  wordsReviewed: number;
  minutesStudied: number;
}

const defaultUser: UserProgress = {
  userId: 'local-user',
  displayName: 'Learner',
  avatar: '/avatar.png',
  totalXP: 0,
  streak: 0,
  lastStudyDate: null,
  level: 'beginner',
  jlptLevel: 'Beginner',
  learnedHiragana: [],
  learnedKatakana: [],
  learnedVocabulary: [],
  learnedKanji: [],
  learnedGrammar: [],
  completedLessons: [],
  listeningScore: 0,
  readingScore: 0,
  writingScore: 0,
  speakingScore: 0,
  dailyGoalXP: 40,
  todayXP: 0,
  todayDate: new Date().toDateString(),
  unlockedAchievements: [],
  onboardingComplete: false,
  learningGoals: [],
  reviewQueue: [],
  theme: 'dark',
  soundEnabled: true,
  furiganaMode: 'always',
  animationsEnabled: true,
  bookmarkedVocab: [],
  bookmarkedKanji: [],
  bookmarkedGrammar: [],
  notes: [],
};

interface AppStore extends UserProgress {
  // Actions
  setDisplayName: (name: string) => void;
  setAvatar: (avatar: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  completeOnboarding: (data: Partial<UserProgress>) => void;
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string, xp: number) => void;
  learnHiragana: (chars: string[]) => void;
  learnKatakana: (chars: string[]) => void;
  learnVocabulary: (ids: string[]) => void;
  learnKanji: (ids: string[]) => void;
  learnGrammar: (ids: string[]) => void;
  unlockAchievement: (id: string) => void;
  updateSkillScore: (skill: 'listening' | 'reading' | 'writing' | 'speaking', score: number) => void;
  addReviewItem: (item: Omit<ReviewItem, 'nextReview' | 'interval' | 'easeFactor' | 'repetitions' | 'correct' | 'incorrect'>) => void;
  updateReviewItem: (itemId: string, rating: 1 | 2 | 3 | 4) => void;
  toggleBookmark: (type: 'vocab' | 'kanji' | 'grammar', id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setDailyGoal: (xp: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setFuriganaMode: (mode: 'always' | 'learning' | 'never') => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  checkAndUpdateStreak: () => void;
  getDueReviews: () => ReviewItem[];
  getXPProgress: () => { current: number; max: number; level: number; title: string; percentage: number };
}

// SRS: SM-2 algorithm
function calculateNextReview(item: ReviewItem, rating: 1 | 2 | 3 | 4) {
  let { interval, easeFactor, repetitions } = item;
  
  if (rating < 3) {
    // Failed — reset
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  }
  
  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  
  return { interval, easeFactor, repetitions, nextReview: nextReview.toISOString() };
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...defaultUser,

      setDisplayName: (name) => set({ displayName: name }),
      setAvatar: (avatar) => set({ avatar }),
      setTheme: (theme) => set({ theme }),
      
      completeOnboarding: (data) => set({ ...data, onboardingComplete: true }),

      addXP: (amount) => {
        const { todayXP, todayDate, totalXP } = get();
        const today = new Date().toDateString();
        const newTodayXP = todayDate === today ? todayXP + amount : amount;
        set({ totalXP: totalXP + amount, todayXP: newTodayXP, todayDate: today });
      },

      completeLesson: (lessonId, xp) => {
        const { completedLessons } = get();
        if (!completedLessons.includes(lessonId)) {
          set({ completedLessons: [...completedLessons, lessonId] });
          get().addXP(xp);
        }
        get().checkAndUpdateStreak();
      },

      learnHiragana: (chars) => set(state => ({ learnedHiragana: [...new Set([...state.learnedHiragana, ...chars])] })),
      learnKatakana: (chars) => set(state => ({ learnedKatakana: [...new Set([...state.learnedKatakana, ...chars])] })),
      learnVocabulary: (ids) => set(state => ({ learnedVocabulary: [...new Set([...state.learnedVocabulary, ...ids])] })),
      learnKanji: (ids) => set(state => ({ learnedKanji: [...new Set([...state.learnedKanji, ...ids])] })),
      learnGrammar: (ids) => set(state => ({ learnedGrammar: [...new Set([...state.learnedGrammar, ...ids])] })),

      unlockAchievement: (id) => set(state => ({
        unlockedAchievements: state.unlockedAchievements.includes(id)
          ? state.unlockedAchievements
          : [...state.unlockedAchievements, id]
      })),

      updateSkillScore: (skill, score) => {
        const key = `${skill}Score` as keyof UserProgress;
        const current = get()[key] as number;
        set({ [key]: Math.round((current + score) / 2) } as any);
      },

      addReviewItem: (item) => {
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + 1);
        const newItem: ReviewItem = { ...item, nextReview: nextReview.toISOString(), interval: 1, easeFactor: 2.5, repetitions: 0, correct: 0, incorrect: 0 };
        set(state => ({ reviewQueue: [...state.reviewQueue.filter(r => r.itemId !== item.itemId), newItem] }));
      },

      updateReviewItem: (itemId, rating) => set(state => ({
        reviewQueue: state.reviewQueue.map(item => {
          if (item.itemId !== itemId) return item;
          const updated = calculateNextReview(item, rating);
          return {
            ...item,
            ...updated,
            correct: rating >= 3 ? item.correct + 1 : item.correct,
            incorrect: rating < 3 ? item.incorrect + 1 : item.incorrect,
          };
        })
      })),

      toggleBookmark: (type, id) => set(state => {
        if (type === 'vocab') {
          const exists = state.bookmarkedVocab.includes(id);
          return { bookmarkedVocab: exists ? state.bookmarkedVocab.filter(b => b !== id) : [...state.bookmarkedVocab, id] };
        }
        if (type === 'kanji') {
          const exists = state.bookmarkedKanji.includes(id);
          return { bookmarkedKanji: exists ? state.bookmarkedKanji.filter(b => b !== id) : [...state.bookmarkedKanji, id] };
        }
        const exists = state.bookmarkedGrammar.includes(id);
        return { bookmarkedGrammar: exists ? state.bookmarkedGrammar.filter(b => b !== id) : [...state.bookmarkedGrammar, id] };
      }),

      addNote: (note) => set(state => ({
        notes: [...state.notes, { ...note, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]
      })),

      updateNote: (id, note) => set(state => ({
        notes: state.notes.map(n => n.id === id ? { ...n, ...note, updatedAt: new Date().toISOString() } : n)
      })),

      deleteNote: (id) => set(state => ({ notes: state.notes.filter(n => n.id !== id) })),

      setDailyGoal: (xp) => set({ dailyGoalXP: xp }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setFuriganaMode: (mode) => set({ furiganaMode: mode }),
      setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),

      checkAndUpdateStreak: () => {
        const { lastStudyDate, streak } = get();
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (lastStudyDate === today) return;
        
        if (lastStudyDate === yesterday) {
          set({ streak: streak + 1, lastStudyDate: today });
        } else {
          set({ streak: 1, lastStudyDate: today });
        }
      },

      getDueReviews: () => {
        const now = new Date().toISOString();
        return get().reviewQueue.filter(item => item.nextReview <= now);
      },

      getXPProgress: () => {
        const xp = get().totalXP;
        const level = getXPLevel(xp);
        const nextLevel = getXPLevel(level.maxXP);
        const current = xp - level.minXP;
        const max = level.maxXP === Infinity ? 100000 : level.maxXP - level.minXP;
        return {
          current,
          max,
          level: level.level,
          title: level.title,
          percentage: Math.min(100, Math.round((current / max) * 100))
        };
      },
    }),
    {
      name: 'japanese-mastery-store',
      partialize: (state) => ({
        ...state,
        // Exclude computed/transient values
      }),
    }
  )
);
