'use client';

import { ViewType } from '@/types';
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react';

interface ViewSelectorProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ViewSelector({ view, onViewChange }: ViewSelectorProps) {
  const views: { type: ViewType; label: string; icon: React.ReactNode }[] = [
    { type: 'weekly', label: 'Semanal', icon: <CalendarDays size={16} /> },
    { type: 'semester', label: 'Semestral', icon: <CalendarRange size={16} /> },
    { type: 'annual', label: 'Anual', icon: <Calendar size={16} /> },
  ];

  return (
    <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
      {views.map((v) => (
        <button
          key={v.type}
          onClick={() => onViewChange(v.type)}
          className="btn"
          style={{
            backgroundColor: view === v.type ? 'var(--accent)' : 'transparent',
            color: view === v.type ? 'white' : 'var(--text-primary)',
            border: 'none',
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            fontWeight: view === v.type ? '600' : '400',
          }}
        >
          {v.icon}
          <span style={{ marginLeft: '0.25rem' }}>{v.label}</span>
        </button>
      ))}
    </div>
  );
}

