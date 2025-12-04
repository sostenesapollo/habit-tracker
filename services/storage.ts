import { Habit, HabitData } from '@/types';

const STORAGE_KEY = 'habit-tracker-data';
const SYNC_KEY = 'habit-tracker-sync';

class StorageService {
  async getHabits(): Promise<Habit[]> {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const parsed: HabitData = JSON.parse(data);
      return parsed.habits || [];
    } catch (error) {
      console.error('Error reading habits from storage:', error);
      return [];
    }
  }

  async saveHabits(habits: Habit[]): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const data: HabitData = {
        habits,
        lastSync: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving habits to storage:', error);
      throw error;
    }
  }

  async exportData(): Promise<string> {
    const habits = await this.getHabits();
    const data: HabitData = {
      habits,
      lastSync: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonString: string): Promise<void> {
    try {
      const data: HabitData = JSON.parse(jsonString);
      if (data.habits && Array.isArray(data.habits)) {
        await this.saveHabits(data.habits);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  async getSyncData(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(SYNC_KEY);
  }

  async setSyncData(data: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SYNC_KEY, data);
  }
}

export const storageService = new StorageService();

