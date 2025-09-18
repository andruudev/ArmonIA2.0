import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { User } from '@/hooks/useAuth';

// Types
export interface MoodEntry {
  id: string;
  mood: string;
  journal?: string;
  date: string;
  timestamp: string;
  userId: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  category: 'mood' | 'activity' | 'streak' | 'social';
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: 'breathing' | 'meditation' | 'exercise' | 'journaling';
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  completedAt?: string;
  userId: string;
}

export interface UserStats {
  totalMoodEntries: number;
  currentStreak: number;
  longestStreak: number;
  activitiesCompleted: number;
  achievementsUnlocked: number;
  totalPoints: number;
  level: number;
  joinedAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    dailyReminder: boolean;
    achievementAlerts: boolean;
    weeklyReport: boolean;
  };
  privacy: {
    shareStats: boolean;
    anonymousData: boolean;
  };
  preferences: {
    defaultMoodScale: 'emoji' | 'slider' | 'color';
    reminderTime: string;
    language: 'es' | 'en';
  };
}

// Store interface
interface AppState {
  // User data
  user: User | null;
  userStats: UserStats | null;
  settings: AppSettings;
  
  // Mood tracking
  moodEntries: MoodEntry[];
  currentMood: string | null;
  
  // Activities
  activities: Activity[];
  completedActivities: Activity[];
  
  // Achievements
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  sidebarCollapsed: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setUserStats: (stats: UserStats) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Mood actions
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp' | 'userId'>) => void;
  updateMoodEntry: (id: string, updates: Partial<MoodEntry>) => void;
  deleteMoodEntry: (id: string) => void;
  setCurrentMood: (mood: string | null) => void;
  
  // Activity actions
  completeActivity: (activityId: string) => void;
  addCustomActivity: (activity: Omit<Activity, 'id' | 'userId'>) => void;
  
  // Achievement actions
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Utility actions
  clearUserData: () => void;
  resetStore: () => void;
}

// Default settings
const defaultSettings: AppSettings = {
  theme: 'system',
  notifications: {
    dailyReminder: true,
    achievementAlerts: true,
    weeklyReport: false,
  },
  privacy: {
    shareStats: false,
    anonymousData: true,
  },
  preferences: {
    defaultMoodScale: 'emoji',
    reminderTime: '20:00',
    language: 'es',
  },
};

// Store implementation
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        user: null,
        userStats: null,
        settings: defaultSettings,
        moodEntries: [],
        currentMood: null,
        activities: [],
        completedActivities: [],
        achievements: [],
        unlockedAchievements: [],
        isLoading: false,
        error: null,
        sidebarCollapsed: false,

        // User actions
        setUser: (user) =>
          set((state) => {
            state.user = user;
            if (!user) {
              // Clear user-specific data when logging out
              state.moodEntries = [];
              state.completedActivities = [];
              state.unlockedAchievements = [];
              state.userStats = null;
              state.currentMood = null;
            }
          }),

        setUserStats: (stats) =>
          set((state) => {
            state.userStats = stats;
          }),

        updateSettings: (newSettings) =>
          set((state) => {
            state.settings = { ...state.settings, ...newSettings };
          }),

        // Mood actions
        addMoodEntry: (entryData) =>
          set((state) => {
            const user = get().user;
            if (!user) return;

            const newEntry: MoodEntry = {
              ...entryData,
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              userId: user.id,
            };

            state.moodEntries.unshift(newEntry);
            state.currentMood = entryData.mood;

            // Update stats
            if (state.userStats) {
              state.userStats.totalMoodEntries += 1;
              state.userStats.totalPoints += 10; // Points for mood entry
            }
          }),

        updateMoodEntry: (id, updates) =>
          set((state) => {
            const index = state.moodEntries.findIndex((entry) => entry.id === id);
            if (index !== -1) {
              state.moodEntries[index] = { ...state.moodEntries[index], ...updates };
            }
          }),

        deleteMoodEntry: (id) =>
          set((state) => {
            state.moodEntries = state.moodEntries.filter((entry) => entry.id !== id);
          }),

        setCurrentMood: (mood) =>
          set((state) => {
            state.currentMood = mood;
          }),

        // Activity actions
        completeActivity: (activityId) =>
          set((state) => {
            const user = get().user;
            if (!user) return;

            const activity = state.activities.find((a) => a.id === activityId);
            if (!activity) return;

            const completedActivity: Activity = {
              ...activity,
              completedAt: new Date().toISOString(),
              userId: user.id,
            };

            state.completedActivities.push(completedActivity);

            // Update stats
            if (state.userStats) {
              state.userStats.activitiesCompleted += 1;
              state.userStats.totalPoints += activity.difficulty === 'easy' ? 5 : activity.difficulty === 'medium' ? 10 : 15;
            }
          }),

        addCustomActivity: (activityData) =>
          set((state) => {
            const user = get().user;
            if (!user) return;

            const newActivity: Activity = {
              ...activityData,
              id: Date.now().toString(),
              userId: user.id,
            };

            state.activities.push(newActivity);
          }),

        // Achievement actions
        unlockAchievement: (achievementId) =>
          set((state) => {
            const achievement = state.achievements.find((a) => a.id === achievementId);
            if (!achievement) return;

            const unlockedAchievement: Achievement = {
              ...achievement,
              unlockedAt: new Date().toISOString(),
            };

            state.unlockedAchievements.push(unlockedAchievement);

            // Update stats
            if (state.userStats) {
              state.userStats.achievementsUnlocked += 1;
              state.userStats.totalPoints += 50; // Bonus points for achievement
            }
          }),

        updateAchievementProgress: (achievementId, progress) =>
          set((state) => {
            const achievement = state.achievements.find((a) => a.id === achievementId);
            if (achievement) {
              achievement.progress = Math.min(progress, achievement.maxProgress);
              
              // Auto-unlock if progress is complete
              if (achievement.progress >= achievement.maxProgress) {
                get().unlockAchievement(achievementId);
              }
            }
          }),

        // UI actions
        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        toggleSidebar: () =>
          set((state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
          }),

        setSidebarCollapsed: (collapsed) =>
          set((state) => {
            state.sidebarCollapsed = collapsed;
          }),

        // Utility actions
        clearUserData: () =>
          set((state) => {
            state.user = null;
            state.userStats = null;
            state.moodEntries = [];
            state.completedActivities = [];
            state.unlockedAchievements = [];
            state.currentMood = null;
            state.error = null;
          }),

        resetStore: () =>
          set(() => ({
            user: null,
            userStats: null,
            settings: defaultSettings,
            moodEntries: [],
            currentMood: null,
            activities: [],
            completedActivities: [],
            achievements: [],
            unlockedAchievements: [],
            isLoading: false,
            error: null,
            sidebarCollapsed: false,
          })),
      })),
      {
        name: 'armonia-app-store',
        partialize: (state) => ({
          settings: state.settings,
          sidebarCollapsed: state.sidebarCollapsed,
          // Don't persist user data - it should come from auth service
        }),
      }
    ),
    {
      name: 'ArmonIA App Store',
    }
  )
);

// Selectors for better performance
export const useUser = () => useAppStore((state) => state.user);
export const useUserStats = () => useAppStore((state) => state.userStats);
export const useSettings = () => useAppStore((state) => state.settings);
export const useMoodEntries = () => useAppStore((state) => state.moodEntries);
export const useCurrentMood = () => useAppStore((state) => state.currentMood);
export const useActivities = () => useAppStore((state) => state.activities);
export const useCompletedActivities = () => useAppStore((state) => state.completedActivities);
export const useAchievements = () => useAppStore((state) => state.achievements);
export const useUnlockedAchievements = () => useAppStore((state) => state.unlockedAchievements);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed);

// Action selectors
export const useAppActions = () => useAppStore((state) => ({
  setUser: state.setUser,
  setUserStats: state.setUserStats,
  updateSettings: state.updateSettings,
  addMoodEntry: state.addMoodEntry,
  updateMoodEntry: state.updateMoodEntry,
  deleteMoodEntry: state.deleteMoodEntry,
  setCurrentMood: state.setCurrentMood,
  completeActivity: state.completeActivity,
  addCustomActivity: state.addCustomActivity,
  unlockAchievement: state.unlockAchievement,
  updateAchievementProgress: state.updateAchievementProgress,
  setLoading: state.setLoading,
  setError: state.setError,
  toggleSidebar: state.toggleSidebar,
  setSidebarCollapsed: state.setSidebarCollapsed,
  clearUserData: state.clearUserData,
  resetStore: state.resetStore,
}));
