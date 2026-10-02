import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Question, Priority, Status } from '../data/questions';
import { QUESTIONS } from '../data/questions';

// ---- Types ----
export interface QuestionProgress {
  id: string;
  completed: boolean;
  status: Status;
  priority: Priority;
  comment: string;
}

export interface MyListItem {
  questionId: string;
  priority: Priority;
  customList?: string;
  addedAt: string;
}

export interface UserPreferences {
  selectedCategory: string | null;
  sidebarCollapsed: boolean;
  activeFilter: string;
  activeBadgeFilter: string;
  searchQuery: string;
  moodMode: string | null;
  activeCustomList: string | null;
}

export interface AppState {
  progress: Record<string, QuestionProgress>;
  myList: MyListItem[];
  customLists: string[];
  completionHistory: Record<string, string[]>; // YYYY-MM-DD -> questionId[]
  lastInteractedQuestionId: string | null;
  preferences: UserPreferences;
  lastUpdated: string;
}

// ---- Storage Keys ----
const STORAGE_KEY = 'dsa-os-state';

const DEFAULT_PROGRESS: Record<string, QuestionProgress> = {};
QUESTIONS.forEach((q) => {
  DEFAULT_PROGRESS[q.id] = {
    id: q.id,
    completed: false,
    status: 'not-started',
    priority: 'basic',
    comment: '',
  };
});

function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DEFAULT_STATE: AppState = {
  progress: DEFAULT_PROGRESS,
  myList: [],
  customLists: ['Revision Queue', 'Interview Must-Do'],
  completionHistory: {},
  lastInteractedQuestionId: null,
  preferences: {
    selectedCategory: null,
    sidebarCollapsed: false,
    activeFilter: 'all',
    activeBadgeFilter: 'all',
    searchQuery: '',
    moodMode: null,
    activeCustomList: null,
  },
  lastUpdated: new Date().toISOString(),
};

// ---- Load/Save ----
function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_STATE;

    // Merge new questions that may not be in saved state safely
    const parsedProgress = parsed.progress && typeof parsed.progress === 'object' ? parsed.progress : {};
    const progress = { ...DEFAULT_PROGRESS, ...parsedProgress };

    const customLists = Array.isArray(parsed.customLists) && parsed.customLists.length > 0
      ? parsed.customLists
      : DEFAULT_STATE.customLists;

    const myList = Array.isArray(parsed.myList) ? parsed.myList : [];
    const completionHistory = parsed.completionHistory && typeof parsed.completionHistory === 'object'
      ? parsed.completionHistory
      : {};

    const lastInteractedQuestionId = typeof parsed.lastInteractedQuestionId === 'string'
      ? parsed.lastInteractedQuestionId
      : null;

    const preferences = {
      ...DEFAULT_STATE.preferences,
      ...(parsed.preferences && typeof parsed.preferences === 'object' ? parsed.preferences : {}),
    };

    return {
      ...DEFAULT_STATE,
      progress,
      myList,
      customLists,
      completionHistory,
      lastInteractedQuestionId,
      preferences,
      lastUpdated: typeof parsed.lastUpdated === 'string' ? parsed.lastUpdated : new Date().toISOString(),
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable
  }
}

// ---- Context ----
interface AppContextType {
  state: AppState;
  toggleComplete: (id: string) => void;
  setStatus: (id: string, status: Status) => void;
  setPriority: (id: string, priority: Priority) => void;
  setComment: (id: string, comment: string) => void;
  setLastInteracted: (id: string) => void;
  addToMyList: (questionId: string, priority: Priority, customList?: string) => void;
  removeFromMyList: (questionId: string) => void;
  updateMyListPriority: (questionId: string, priority: Priority) => void;
  updateMyListCustomCategory: (questionId: string, customList?: string) => void;
  addCustomList: (name: string) => void;
  deleteCustomList: (name: string) => void;
  setSelectedCategory: (cat: string | null) => void;
  setSidebarCollapsed: (v: boolean) => void;
  setActiveFilter: (f: string) => void;
  setActiveBadgeFilter: (f: string) => void;
  setSearchQuery: (q: string) => void;
  setMoodMode: (m: string | null) => void;
  setActiveCustomList: (list: string | null) => void;
  getQuestionProgress: (id: string) => QuestionProgress;
  getCompletedCount: () => number;
  getCategoryProgress: (category: string) => { completed: number; total: number; percentage: number };
  isInMyList: (questionId: string) => boolean;
  getMyListItem: (questionId: string) => MyListItem | undefined;
  getQuestionsForMood: (mood: string) => Question[];
  getTodayCompletedCount: () => number;
  getCurrentStreak: () => number;
  getContinueQuestion: () => Question | undefined;
  getQuickPicks: () => Question[];
  getTodaysMission: (limit?: number) => Question[];
  resetAllProgress: () => void;
  exportBackup: () => string;
  importBackup: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  // Persist on every state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const setLastInteracted = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      lastInteractedQuestionId: id,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const updateProgress = useCallback((id: string, updates: Partial<QuestionProgress>) => {
    setState((prev) => {
      const current = prev.progress[id] || DEFAULT_PROGRESS[id];
      const updated = { ...current, ...updates };

      // Update completion history if completion toggled
      let completionHistory = { ...prev.completionHistory };
      const today = getTodayKey();
      const todayList = completionHistory[today] ? [...completionHistory[today]] : [];

      if (updates.completed === true && !todayList.includes(id)) {
        todayList.push(id);
        completionHistory[today] = todayList;
      } else if (updates.completed === false) {
        completionHistory[today] = todayList.filter((qid) => qid !== id);
      }

      return {
        ...prev,
        progress: {
          ...prev.progress,
          [id]: updated,
        },
        completionHistory,
        lastInteractedQuestionId: id,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setState((prev) => {
      const current = prev.progress[id] || DEFAULT_PROGRESS[id];
      const newCompleted = !current.completed;
      const today = getTodayKey();
      let completionHistory = { ...prev.completionHistory };
      const todayList = completionHistory[today] ? [...completionHistory[today]] : [];

      if (newCompleted && !todayList.includes(id)) {
        todayList.push(id);
        completionHistory[today] = todayList;
      } else if (!newCompleted) {
        completionHistory[today] = todayList.filter((qid) => qid !== id);
      }

      return {
        ...prev,
        progress: {
          ...prev.progress,
          [id]: {
            ...current,
            completed: newCompleted,
            status: newCompleted ? 'completed' : 'in-progress',
          },
        },
        completionHistory,
        lastInteractedQuestionId: id,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const setStatus = useCallback((id: string, status: Status) => {
    updateProgress(id, { status, completed: status === 'completed' });
  }, [updateProgress]);

  const setPriority = useCallback((id: string, priority: Priority) => {
    updateProgress(id, { priority });
  }, [updateProgress]);

  const setComment = useCallback((id: string, comment: string) => {
    updateProgress(id, { comment });
  }, [updateProgress]);

  const addToMyList = useCallback((questionId: string, priority: Priority, customList?: string) => {
    setState((prev) => {
      const exists = prev.myList.some((i) => i.questionId === questionId);
      if (exists) {
        return {
          ...prev,
          myList: prev.myList.map((i) =>
            i.questionId === questionId ? { ...i, priority, customList: customList !== undefined ? customList : i.customList } : i
          ),
          lastInteractedQuestionId: questionId,
          lastUpdated: new Date().toISOString(),
        };
      }
      return {
        ...prev,
        myList: [...prev.myList, { questionId, priority, customList, addedAt: new Date().toISOString() }],
        lastInteractedQuestionId: questionId,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const removeFromMyList = useCallback((questionId: string) => {
    setState((prev) => ({
      ...prev,
      myList: prev.myList.filter((i) => i.questionId !== questionId),
      lastInteractedQuestionId: questionId,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const updateMyListPriority = useCallback((questionId: string, priority: Priority) => {
    setState((prev) => ({
      ...prev,
      myList: prev.myList.map((i) => (i.questionId === questionId ? { ...i, priority } : i)),
      lastInteractedQuestionId: questionId,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const updateMyListCustomCategory = useCallback((questionId: string, customList?: string) => {
    setState((prev) => ({
      ...prev,
      myList: prev.myList.map((i) => (i.questionId === questionId ? { ...i, customList } : i)),
      lastInteractedQuestionId: questionId,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const addCustomList = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => {
      if (prev.customLists.includes(trimmed)) return prev;
      return {
        ...prev,
        customLists: [...prev.customLists, trimmed],
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const deleteCustomList = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      customLists: prev.customLists.filter((l) => l !== name),
      myList: prev.myList.map((item) => (item.customList === name ? { ...item, customList: undefined } : item)),
      preferences: {
        ...prev.preferences,
        activeCustomList: prev.preferences.activeCustomList === name ? null : prev.preferences.activeCustomList,
      },
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setState((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...updates },
    }));
  }, []);

  const setSelectedCategory = useCallback((cat: string | null) => updatePreferences({ selectedCategory: cat }), [updatePreferences]);
  const setSidebarCollapsed = useCallback((v: boolean) => updatePreferences({ sidebarCollapsed: v }), [updatePreferences]);
  const setActiveFilter = useCallback((f: string) => updatePreferences({ activeFilter: f }), [updatePreferences]);
  const setActiveBadgeFilter = useCallback((f: string) => updatePreferences({ activeBadgeFilter: f }), [updatePreferences]);
  const setSearchQuery = useCallback((q: string) => updatePreferences({ searchQuery: q }), [updatePreferences]);
  const setMoodMode = useCallback((m: string | null) => updatePreferences({ moodMode: m }), [updatePreferences]);
  const setActiveCustomList = useCallback((l: string | null) => updatePreferences({ activeCustomList: l }), [updatePreferences]);

  const getQuestionProgress = useCallback((id: string) => state.progress[id] || DEFAULT_PROGRESS[id], [state.progress]);

  const getCompletedCount = useCallback(() => {
    return Object.values(state.progress).filter((p) => p.completed).length;
  }, [state.progress]);

  const getCategoryProgress = useCallback((category: string) => {
    const questions = QUESTIONS.filter((q) => q.category === category);
    const completed = questions.filter((q) => state.progress[q.id]?.completed).length;
    const total = questions.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }, [state.progress]);

  const isInMyList = useCallback((questionId: string) => {
    return state.myList.some((i) => i.questionId === questionId);
  }, [state.myList]);

  const getMyListItem = useCallback((questionId: string) => {
    return state.myList.find((i) => i.questionId === questionId);
  }, [state.myList]);

  const getQuestionsForMood = useCallback((mood: string): Question[] => {
    const myListIds = new Set(state.myList.map((i) => i.questionId));
    const pool = state.myList.length > 0
      ? QUESTIONS.filter((q) => myListIds.has(q.id) && !state.progress[q.id]?.completed)
      : QUESTIONS.filter((q) => !state.progress[q.id]?.completed);

    if (mood === 'random') {
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 6);
    }

    const priorityMap: Record<string, Priority[]> = {
      easy: ['basic'],
      normal: ['basic', 'important'],
      grind: ['important', 'high'],
    };
    const priorities = priorityMap[mood] || ['basic', 'important', 'high'];
    const filtered = pool.filter((q) => {
      const qp = state.progress[q.id]?.priority || 'basic';
      return priorities.includes(qp);
    });
    return filtered.slice(0, 6).length > 0 ? filtered.slice(0, 6) : pool.slice(0, 6);
  }, [state.myList, state.progress]);

  const getTodayCompletedCount = useCallback(() => {
    const today = getTodayKey();
    return state.completionHistory[today]?.length || 0;
  }, [state.completionHistory]);

  const getCurrentStreak = useCallback(() => {
    let streak = 0;
    const d = new Date();

    const todayKey = getTodayKey();
    if ((state.completionHistory[todayKey]?.length || 0) > 0) {
      streak++;
    }

    for (let i = 1; i < 365; i++) {
      const prev = new Date(d);
      prev.setDate(prev.getDate() - i);
      const y = prev.getFullYear();
      const m = String(prev.getMonth() + 1).padStart(2, '0');
      const day = String(prev.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${day}`;

      if ((state.completionHistory[key]?.length || 0) > 0) {
        streak++;
      } else {
        if (i === 1 && streak === 0) {
          continue;
        }
        break;
      }
    }
    return streak;
  }, [state.completionHistory]);

  const getContinueQuestion = useCallback((): Question | undefined => {
    // 1. Try last interacted incomplete question
    if (state.lastInteractedQuestionId) {
      const q = QUESTIONS.find((item) => item.id === state.lastInteractedQuestionId);
      if (q && !state.progress[q.id]?.completed) {
        return q;
      }
    }

    // 2. Try highest priority incomplete question in My List
    const highInList = state.myList.find((i) => i.priority === 'high' && !state.progress[i.questionId]?.completed);
    if (highInList) {
      return QUESTIONS.find((q) => q.id === highInList.questionId);
    }
    const impInList = state.myList.find((i) => i.priority === 'important' && !state.progress[i.questionId]?.completed);
    if (impInList) {
      return QUESTIONS.find((q) => q.id === impInList.questionId);
    }
    const anyInList = state.myList.find((i) => !state.progress[i.questionId]?.completed);
    if (anyInList) {
      return QUESTIONS.find((q) => q.id === anyInList.questionId);
    }

    // 3. Fallback to first incomplete question in dataset
    return QUESTIONS.find((q) => !state.progress[q.id]?.completed);
  }, [state.lastInteractedQuestionId, state.progress, state.myList]);

  const getQuickPicks = useCallback((): Question[] => {
    const picks: Question[] = [];
    const usedIds = new Set<string>();

    // 1. Pick from My List if available
    for (const item of state.myList) {
      if (!state.progress[item.questionId]?.completed && !usedIds.has(item.questionId)) {
        const q = QUESTIONS.find((x) => x.id === item.questionId);
        if (q) {
          picks.push(q);
          usedIds.add(q.id);
          if (picks.length >= 3) return picks;
        }
      }
    }

    // 2. Pick top curated pattern problems that are still incomplete
    const curatedIds = [
      'ah-3',  // Two Sum
      'tp-1',  // 3Sum
      'sw-1',  // Best Time to Buy and Sell Stock
      'sq-1',  // Valid Parentheses
      'bs-1',  // Binary Search
      'll-1',  // Reverse Linked List
      'bt-1',  // Invert Binary Tree
      'dp-1',  // Climbing Stairs
      'rb-1',  // Subsets
      'gt-7',  // Number of Islands
    ];

    for (const cid of curatedIds) {
      if (!state.progress[cid]?.completed && !usedIds.has(cid)) {
        const q = QUESTIONS.find((x) => x.id === cid);
        if (q) {
          picks.push(q);
          usedIds.add(q.id);
          if (picks.length >= 3) return picks;
        }
      }
    }

    // 3. Any incomplete from dataset across categories
    for (const q of QUESTIONS) {
      if (!state.progress[q.id]?.completed && !usedIds.has(q.id)) {
        picks.push(q);
        usedIds.add(q.id);
        if (picks.length >= 3) break;
      }
    }

    return picks;
  }, [state.myList, state.progress]);

  const getTodaysMission = useCallback((limit = 5): Question[] => {
    const mission: Question[] = [];
    const usedIds = new Set<string>();

    // 1. High Priority questions (from My List first, then any in progress)
    for (const item of state.myList) {
      if (item.priority === 'high' && !state.progress[item.questionId]?.completed && !usedIds.has(item.questionId)) {
        const q = QUESTIONS.find((x) => x.id === item.questionId);
        if (q) {
          mission.push(q);
          usedIds.add(q.id);
          if (mission.length >= limit) return mission;
        }
      }
    }
    for (const q of QUESTIONS) {
      if (state.progress[q.id]?.priority === 'high' && !state.progress[q.id]?.completed && !usedIds.has(q.id)) {
        mission.push(q);
        usedIds.add(q.id);
        if (mission.length >= limit) return mission;
      }
    }

    // 2. Incomplete questions in My List (important, basic)
    for (const item of state.myList) {
      if (!state.progress[item.questionId]?.completed && !usedIds.has(item.questionId)) {
        const q = QUESTIONS.find((x) => x.id === item.questionId);
        if (q) {
          mission.push(q);
          usedIds.add(q.id);
          if (mission.length >= limit) return mission;
        }
      }
    }

    // 3. Foundational / high-yield pattern questions that are incomplete
    const foundationalIds = [
      'ah-3',  // Two Sum
      'sw-1',  // Best Time to Buy and Sell Stock
      'sq-1',  // Valid Parentheses
      'll-1',  // Reverse Linked List
      'bt-1',  // Invert Binary Tree
      'bs-1',  // Binary Search
      'dp-1',  // Climbing Stairs
      'gt-7',  // Number of Islands
      'tp-1',  // 3Sum
      'rb-1',  // Subsets
      'hp-1',  // Kth Largest Element in an Array
      'tr-1',  // Implement Trie (Prefix Tree)
      'gi-1',  // Maximum Subarray
      'bm-1',  // Single Number
    ];
    for (const fid of foundationalIds) {
      if (!state.progress[fid]?.completed && !usedIds.has(fid)) {
        const q = QUESTIONS.find((x) => x.id === fid);
        if (q) {
          mission.push(q);
          usedIds.add(q.id);
          if (mission.length >= limit) return mission;
        }
      }
    }

    // 4. Any remaining incomplete questions from dataset
    for (const q of QUESTIONS) {
      if (!state.progress[q.id]?.completed && !usedIds.has(q.id)) {
        mission.push(q);
        usedIds.add(q.id);
        if (mission.length >= limit) return mission;
      }
    }

    return mission;
  }, [state.myList, state.progress]);

  const resetAllProgress = useCallback(() => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const exportBackup = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importBackup = useCallback((jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr) as Partial<AppState>;
      if (!parsed.progress) return false;
      const progress = { ...DEFAULT_PROGRESS, ...parsed.progress };
      const newState: AppState = {
        ...DEFAULT_STATE,
        ...parsed,
        progress,
        lastInteractedQuestionId: parsed.lastInteractedQuestionId || null,
      };
      setState(newState);
      saveState(newState);
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        toggleComplete,
        setStatus,
        setPriority,
        setComment,
        setLastInteracted,
        addToMyList,
        removeFromMyList,
        updateMyListPriority,
        updateMyListCustomCategory,
        addCustomList,
        deleteCustomList,
        setSelectedCategory,
        setSidebarCollapsed,
        setActiveFilter,
        setActiveBadgeFilter,
        setSearchQuery,
        setMoodMode,
        setActiveCustomList,
        getQuestionProgress,
        getCompletedCount,
        getCategoryProgress,
        isInMyList,
        getMyListItem,
        getQuestionsForMood,
        getTodayCompletedCount,
        getCurrentStreak,
        getContinueQuestion,
        getQuickPicks,
        getTodaysMission,
        resetAllProgress,
        exportBackup,
        importBackup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
