'use client';

import { useState } from 'react';
import { Plus, X, Edit2, Trash2, Save } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { Habit } from '@/types';

const COLORS = [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
];

const ICONS = [
  '💪', '🏃', '📚', '🧘', '💧', '🍎', '😴', '🎯', '✍️', '🎵',
  '🎨', '🌱', '📱', '🚫', '☕', '🧠', '❤️', '🌟', '🔥', '⚡',
];

export function HabitManager() {
  const { habits, addHabit, updateHabit, deleteHabit } = useHabits();
  const [isOpen, setIsOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState(ICONS[0]);

  const handleOpen = (habit?: Habit) => {
    if (habit) {
      setEditingHabit(habit);
      setTitle(habit.title);
      setColor(habit.color);
      setIcon(habit.icon);
    } else {
      setEditingHabit(null);
      setTitle('');
      setColor(COLORS[0]);
      setIcon(ICONS[0]);
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingHabit(null);
    setTitle('');
    setColor(COLORS[0]);
    setIcon(ICONS[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingHabit) {
      await updateHabit(editingHabit.id, { title, color, icon });
    } else {
      await addHabit({ title, color, icon });
    }
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este hábito?')) {
      await deleteHabit(id);
      handleClose();
    }
  };

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Hábitos</h3>
          <button className="btn btn-primary" onClick={() => handleOpen()} style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}>
            <Plus size={16} />
            Adicionar
          </button>
        </div>

        {habits.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {habits.map((habit) => (
              <div
                key={habit.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '1.25rem' }}>{habit.icon}</span>
                  <span style={{ fontWeight: '500', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{habit.title}</span>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '2px',
                      backgroundColor: habit.color,
                      flexShrink: 0,
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleOpen(habit)}
                    style={{ padding: '0.375rem' }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(habit.id)}
                    style={{ padding: '0.375rem' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                {editingHabit ? 'Editar Hábito' : 'Novo Hábito'}
              </h2>
              <button
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                  Título
                </label>
                <input
                  type="text"
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Exercitar-se"
                  required
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                  Cor
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '0.5rem',
                        backgroundColor: c,
                        border: color === c ? '3px solid var(--accent)' : '2px solid var(--border)',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                  Ícone
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {ICONS.map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIcon(i)}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '0.5rem',
                        border: icon === i ? '3px solid var(--accent)' : '2px solid var(--border)',
                        cursor: 'pointer',
                        fontSize: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: icon === i ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                      }}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                {editingHabit && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(editingHabit.id)}
                  >
                    <Trash2 size={18} />
                    Excluir
                  </button>
                )}
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={18} />
                  {editingHabit ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

