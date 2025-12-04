import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/types';
import { storageService } from '@/services/storage';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHabits = useCallback(async () => {
    try {
      const data = await storageService.getHabits();
      setHabits(data);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHabits();
    
    // Listen for storage changes (for sync)
    const handleStorageChange = () => {
      loadHabits();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('habitsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('habitsUpdated', handleStorageChange);
    };
  }, [loadHabits]);

  const addHabit = useCallback(async (habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt' | 'updatedAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      completedDates: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updated = [...habits, newHabit];
    await storageService.saveHabits(updated);
    setHabits(updated);
    window.dispatchEvent(new Event('habitsUpdated'));
  }, [habits]);

  const updateHabit = useCallback(async (id: string, updates: Partial<Habit>) => {
    const updated = habits.map(h => 
      h.id === id 
        ? { ...h, ...updates, updatedAt: new Date().toISOString() }
        : h
    );
    await storageService.saveHabits(updated);
    setHabits(updated);
    window.dispatchEvent(new Event('habitsUpdated'));
  }, [habits]);

  const deleteHabit = useCallback(async (id: string) => {
    const updated = habits.filter(h => h.id !== id);
    await storageService.saveHabits(updated);
    setHabits(updated);
    window.dispatchEvent(new Event('habitsUpdated'));
  }, [habits]);

  const toggleHabitDate = useCallback(async (habitId: string, date: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const dateStr = date;
    const isCompleted = habit.completedDates.includes(dateStr);
    
    const updatedDates = isCompleted
      ? habit.completedDates.filter(d => d !== dateStr)
      : [...habit.completedDates, dateStr].sort();

    await updateHabit(habitId, { completedDates: updatedDates });
  }, [habits, updateHabit]);

  return {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitDate,
    refreshHabits: loadHabits,
  };
}

