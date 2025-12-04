'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { HabitGrid } from '@/components/HabitGrid';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { useHabits } from '@/hooks/useHabits';
import { useDarkMode } from '@/hooks/useDarkMode';
import { ViewType } from '@/types';

export default function Home() {
  const { habits, loading } = useHabits();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [view, setView] = useState<ViewType>('annual');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container">
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            paddingTop: '1rem',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.25rem' }}>
              Habit Tracker
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Controle seus hábitos diários
            </p>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="container">
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          paddingTop: '1rem',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.25rem' }}>
            Habit Tracker
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {habits.length > 0
              ? `${habits.length} ${habits.length === 1 ? 'hábito' : 'hábitos'}`
              : 'Controle seus hábitos diários'}
          </p>
        </div>
        <button
          onClick={() => setSettingsOpen(true)}
          className="btn btn-secondary"
          style={{ padding: '0.75rem', flexShrink: 0, marginLeft: '1rem' }}
          aria-label="Configurações"
        >
          <Settings size={20} />
        </button>
      </header>

      {habits.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {habits.map((habit) => (
            <HabitGrid key={habit.id} habit={habit} view={view} />
          ))}
        </div>
      ) : (
        !loading && (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: 'var(--text-secondary)',
            }}
          >
            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
              Nenhum hábito cadastrado
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              Abra as configurações para adicionar seu primeiro hábito
            </p>
          </div>
        )
      )}

      <SettingsDrawer
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        view={view}
        onViewChange={setView}
        darkMode={darkMode}
        onDarkModeToggle={toggleDarkMode}
      />
    </div>
  );
}

