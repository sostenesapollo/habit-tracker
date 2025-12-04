'use client';

import { useState } from 'react';
import { X, Settings, Moon, Sun } from 'lucide-react';
import { HabitManager } from './HabitManager';
import { ViewSelector } from './ViewSelector';
import { SyncButton } from './SyncButton';
import { ViewType } from '@/types';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

export function SettingsDrawer({
  isOpen,
  onClose,
  view,
  onViewChange,
  darkMode,
  onDarkModeToggle,
}: SettingsDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal-overlay"
        onClick={onClose}
        style={{ zIndex: 1000 }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '100%',
          maxWidth: 'min(400px, 85vw)',
          backgroundColor: 'var(--bg-primary)',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
          zIndex: 1001,
          overflowY: 'auto',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={24} />
              Configurações
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-primary)',
              }}
            >
              <X size={24} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                Visualização
              </h3>
              <ViewSelector view={view} onViewChange={onViewChange} />
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                Aparência
              </h3>
              <button
                onClick={onDarkModeToggle}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>Modo Escuro</span>
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                Sincronização
              </h3>
              <SyncButton />
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                Gerenciar Hábitos
              </h3>
              <HabitManager />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

