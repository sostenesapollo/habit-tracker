export type ViewType = 'annual' | 'weekly' | 'semester';

export interface Habit {
  id: string;
  title: string;
  color: string;
  icon: string;
  completedDates: string[]; // Array of dates in YYYY-MM-DD format
  createdAt: string;
  updatedAt: string;
}

export interface HabitData {
  habits: Habit[];
  lastSync?: string;
}

