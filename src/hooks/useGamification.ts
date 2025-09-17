import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useMoods } from './useMoods';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'consistency' | 'improvement' | 'exploration' | 'milestone';
  requirement: number;
  current: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserLevel {
  level: number;
  title: string;
  xp: number;
  xpToNext: number;
  progress: number;
  color: string;
}

export const useGamification = () => {
  const { user } = useAuth();
  const { entries, getMoodStats } = useMoods();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userLevel, setUserLevel] = useState<UserLevel>({
    level: 1,
    title: 'Principiante',
    xp: 0,
    xpToNext: 100,
    progress: 0,
    color: 'text-gray-500'
  });
  const [recentUnlocks, setRecentUnlocks] = useState<Achievement[]>([]);

  const levelThresholds = [
    { level: 1, title: 'Principiante', xp: 0, color: 'text-gray-500' },
    { level: 2, title: 'Explorador', xp: 100, color: 'text-green-500' },
    { level: 3, title: 'Practicante', xp: 250, color: 'text-blue-500' },
    { level: 4, title: 'Experto', xp: 500, color: 'text-purple-500' },
    { level: 5, title: 'Maestro', xp: 1000, color: 'text-yellow-500' },
    { level: 6, title: 'Gurú del Bienestar', xp: 2000, color: 'text-pink-500' },
    { level: 7, title: 'Guía Espiritual', xp: 3500, color: 'text-indigo-500' },
    { level: 8, title: 'Iluminado', xp: 5000, color: 'text-rainbow' }
  ];

  const allAchievements: Achievement[] = [
    // Consistency Achievements
    {
      id: 'first_entry',
      title: 'Primer Paso',
      description: 'Registra tu primer estado de ánimo',
      icon: '🌱',
      category: 'milestone',
      requirement: 1,
      current: 0,
      unlocked: false,
      rarity: 'common'
    },
    {
      id: 'week_streak',
      title: 'Constancia Semanal',
      description: 'Registra tu estado de ánimo por 7 días seguidos',
      icon: '📅',
      category: 'consistency',
      requirement: 7,
      current: 0,
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: 'month_streak',
      title: 'Maestro de la Constancia',
      description: 'Registra tu estado de ánimo por 30 días seguidos',
      icon: '🏆',
      category: 'consistency',
      requirement: 30,
      current: 0,
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: 'hundred_entries',
      title: 'Centenario',
      description: 'Registra 100 entradas de estado de ánimo',
      icon: '💯',
      category: 'milestone',
      requirement: 100,
      current: 0,
      unlocked: false,
      rarity: 'epic'
    },
    
    // Improvement Achievements
    {
      id: 'mood_improvement',
      title: 'Ascenso Emocional',
      description: 'Mejora tu estado de ánimo promedio en 1 punto',
      icon: '📈',
      category: 'improvement',
      requirement: 1,
      current: 0,
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: 'positive_week',
      title: 'Semana Positiva',
      description: 'Mantén un estado de ánimo promedio de 4+ por una semana',
      icon: '☀️',
      category: 'improvement',
      requirement: 1,
      current: 0,
      unlocked: false,
      rarity: 'rare'
    },
    
    // Exploration Achievements
    {
      id: 'breathing_master',
      title: 'Maestro de la Respiración',
      description: 'Completa 50 sesiones de respiración',
      icon: '🫁',
      category: 'exploration',
      requirement: 50,
      current: 0,
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: 'chat_explorer',
      title: 'Conversador',
      description: 'Envía 50 mensajes al chat con IA',
      icon: '💬',
      category: 'exploration',
      requirement: 50,
      current: 0,
      unlocked: false,
      rarity: 'common'
    },
    {
      id: 'journal_writer',
      title: 'Escritor Emocional',
      description: 'Escribe 20 reflexiones en tu diario',
      icon: '📝',
      category: 'exploration',
      requirement: 20,
      current: 0,
      unlocked: false,
      rarity: 'rare'
    },
    
    // Special Achievements
    {
      id: 'perfect_week',
      title: 'Semana Perfecta',
      description: 'Registra todos los días de la semana con estado de ánimo 4+',
      icon: '✨',
      category: 'milestone',
      requirement: 1,
      current: 0,
      unlocked: false,
      rarity: 'legendary'
    },
    {
      id: 'early_bird',
      title: 'Madrugador',
      description: 'Registra tu estado de ánimo antes de las 8 AM por 5 días',
      icon: '🌅',
      category: 'consistency',
      requirement: 5,
      current: 0,
      unlocked: false,
      rarity: 'rare'
    }
  ];

  useEffect(() => {
    if (user) {
      loadGamificationData();
    }
  }, [user, entries]);

  const loadGamificationData = () => {
    if (!user) return;

    const key = `armonia_gamification_${user.id}`;
    const stored = localStorage.getItem(key);
    
    if (stored) {
      const data = JSON.parse(stored);
      setAchievements(data.achievements || allAchievements);
      setUserLevel(data.userLevel || userLevel);
    } else {
      setAchievements(allAchievements);
    }
  };

  const calculateAchievements = () => {
    if (!user || entries.length === 0) return;

    const stats = getMoodStats();
    if (!stats) return;

    const newAchievements = [...achievements];
    const newUnlocks: Achievement[] = [];

    // Calculate current progress for each achievement
    newAchievements.forEach(achievement => {
      if (achievement.unlocked) return;

      let current = 0;
      
      switch (achievement.id) {
        case 'first_entry':
          current = entries.length >= 1 ? 1 : 0;
          break;
        case 'week_streak':
          current = calculateStreak();
          break;
        case 'month_streak':
          current = calculateStreak();
          break;
        case 'hundred_entries':
          current = entries.length;
          break;
        case 'mood_improvement':
          current = calculateMoodImprovement();
          break;
        case 'positive_week':
          current = calculatePositiveWeek();
          break;
        case 'breathing_master':
          current = getBreathingSessions();
          break;
        case 'chat_explorer':
          current = getChatMessages();
          break;
        case 'journal_writer':
          current = entries.filter(e => e.journal && e.journal.trim().length > 0).length;
          break;
        case 'perfect_week':
          current = calculatePerfectWeek();
          break;
        case 'early_bird':
          current = calculateEarlyBird();
          break;
      }

      achievement.current = current;

      if (current >= achievement.requirement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        newUnlocks.push(achievement);
      }
    });

    setAchievements(newAchievements);
    
    if (newUnlocks.length > 0) {
      setRecentUnlocks(prev => [...newUnlocks, ...prev].slice(0, 5));
    }

    // Calculate XP and level
    const totalXP = newAchievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => {
        const xpValues = { common: 10, rare: 25, epic: 50, legendary: 100 };
        return sum + xpValues[a.rarity];
      }, 0);

    const newLevel = calculateLevel(totalXP);
    setUserLevel(newLevel);

    // Save to localStorage
    const key = `armonia_gamification_${user.id}`;
    localStorage.setItem(key, JSON.stringify({
      achievements: newAchievements,
      userLevel: newLevel
    }));
  };

  const calculateStreak = () => {
    if (entries.length === 0) return 0;
    
    const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);
    let streak = 0;
    let currentDate = new Date();
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.timestamp);
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate = new Date(entryDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateMoodImprovement = () => {
    if (entries.length < 14) return 0;
    
    const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);
    const firstHalf = sortedEntries.slice(0, Math.floor(sortedEntries.length / 2));
    const secondHalf = sortedEntries.slice(Math.floor(sortedEntries.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, e) => sum + e.mood.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, e) => sum + e.mood.value, 0) / secondHalf.length;
    
    return secondAvg - firstAvg > 1 ? 1 : 0;
  };

  const calculatePositiveWeek = () => {
    const last7Days = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return entryDate >= weekAgo;
    });

    if (last7Days.length < 7) return 0;
    
    const avgMood = last7Days.reduce((sum, e) => sum + e.mood.value, 0) / last7Days.length;
    return avgMood >= 4 ? 1 : 0;
  };

  const getBreathingSessions = () => {
    if (!user) return 0;
    const key = `armonia_breathing_${user.id}`;
    const sessions = JSON.parse(localStorage.getItem(key) || '[]');
    return sessions.length;
  };

  const getChatMessages = () => {
    if (!user) return 0;
    const key = `armonia_chat_${user.id}`;
    const messages = JSON.parse(localStorage.getItem(key) || '[]');
    return messages.filter((m: any) => m.sender === 'user').length;
  };

  const calculatePerfectWeek = () => {
    const last7Days = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return entryDate >= weekAgo;
    });

    if (last7Days.length < 7) return 0;
    
    const allPositive = last7Days.every(entry => entry.mood.value >= 4);
    return allPositive ? 1 : 0;
  };

  const calculateEarlyBird = () => {
    const earlyEntries = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate.getHours() < 8;
    });
    
    return earlyEntries.length;
  };

  const calculateLevel = (xp: number): UserLevel => {
    const threshold = levelThresholds.find(t => xp < t.xp) || levelThresholds[levelThresholds.length - 1];
    const currentThreshold = levelThresholds[levelThresholds.findIndex(t => t.level === threshold.level) - 1] || levelThresholds[0];
    const nextThreshold = threshold;
    
    const progress = ((xp - currentThreshold.xp) / (nextThreshold.xp - currentThreshold.xp)) * 100;
    
    return {
      level: currentThreshold.level,
      title: currentThreshold.title,
      xp,
      xpToNext: nextThreshold.xp - xp,
      progress: Math.min(progress, 100),
      color: currentThreshold.color
    };
  };

  useEffect(() => {
    calculateAchievements();
  }, [entries]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-500';
      case 'rare': return 'text-blue-500';
      case 'epic': return 'text-purple-500';
      case 'legendary': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 border-gray-300';
      case 'rare': return 'bg-blue-100 border-blue-300';
      case 'epic': return 'bg-purple-100 border-purple-300';
      case 'legendary': return 'bg-yellow-100 border-yellow-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return {
    achievements,
    userLevel,
    recentUnlocks,
    getRarityColor,
    getRarityBg,
    calculateAchievements
  };
};
