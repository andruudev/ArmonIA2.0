import { useState, useEffect } from 'react';
import { MoodType } from '@/components/MoodSlider';
import { useAuth } from './useAuth';

export interface MoodEntry {
  id: string;
  mood: MoodType;
  journal: string;
  date: string;
  timestamp: number;
}

export const useMoods = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMoodEntries();
    }
  }, [user]);

  const loadMoodEntries = () => {
    if (!user) return;
    
    const key = `armonia_moods_${user.id}`;
    const storedEntries = localStorage.getItem(key);
    
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
    setIsLoading(false);
  };

  const addMoodEntry = (mood: MoodType, journal: string, date?: string) => {
    if (!user) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood,
      journal,
      date: date || new Date().toISOString().split('T')[0],
      timestamp: Date.now()
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);

    const key = `armonia_moods_${user.id}`;
    localStorage.setItem(key, JSON.stringify(updatedEntries));
  };

  const getMoodStats = () => {
    if (entries.length === 0) return null;

    const last7Days = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return entryDate >= weekAgo;
    });

    const avgMood = last7Days.reduce((sum, entry) => sum + entry.mood.value, 0) / last7Days.length;
    const mostCommonMood = last7Days.reduce((acc, entry) => {
      acc[entry.mood.name] = (acc[entry.mood.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominant = Object.entries(mostCommonMood).sort(([,a], [,b]) => b - a)[0];

    return {
      averageMood: avgMood,
      totalEntries: entries.length,
      last7Days: last7Days.length,
      dominantMood: dominant ? dominant[0] : null,
      trend: calculateTrend(last7Days)
    };
  };

  const calculateTrend = (recentEntries: MoodEntry[]) => {
    if (recentEntries.length < 2) return 'stable';
    
    const firstHalf = recentEntries.slice(-Math.ceil(recentEntries.length / 2));
    const secondHalf = recentEntries.slice(0, Math.floor(recentEntries.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.mood.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.mood.value, 0) / secondHalf.length;
    
    const diff = firstAvg - secondAvg;
    
    if (diff > 0.3) return 'improving';
    if (diff < -0.3) return 'declining';
    return 'stable';
  };

  const getChartData = () => {
    const last30Days = entries
      .filter(entry => {
        const entryDate = new Date(entry.timestamp);
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return entryDate >= monthAgo;
      })
      .sort((a, b) => a.timestamp - b.timestamp);

    return last30Days.map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString('es-ES', { 
        month: 'short', 
        day: 'numeric' 
      }),
      mood: entry.mood.value,
      name: entry.mood.name
    }));
  };

  return {
    entries,
    isLoading,
    addMoodEntry,
    getMoodStats,
    getChartData
  };
};