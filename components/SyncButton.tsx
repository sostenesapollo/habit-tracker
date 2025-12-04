'use client';

import { useState } from 'react';
import { Download, Upload, Check, AlertCircle } from 'lucide-react';
import { storageService } from '@/services/storage';
import { useHabits } from '@/hooks/useHabits';

export function SyncButton() {
  const { refreshHabits } = useHabits();
  const [status, setStatus] = useState<'idle' | 'exporting' | 'importing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    try {
      setStatus('exporting');
      const data = await storageService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setStatus('success');
      setMessage('Dados exportados com sucesso!');
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage('Erro ao exportar dados');
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 2000);
    }
  };

  const handleImport = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          setStatus('importing');
          const text = await file.text();
          await storageService.importData(text);
          await refreshHabits();
          
          setStatus('success');
          setMessage('Dados importados com sucesso!');
          setTimeout(() => {
            setStatus('idle');
            setMessage('');
          }, 2000);
        } catch (error) {
          setStatus('error');
          setMessage('Erro ao importar dados. Verifique o arquivo.');
          setTimeout(() => {
            setStatus('idle');
            setMessage('');
          }, 2000);
        }
      };
      
      input.click();
    } catch (error) {
      setStatus('error');
      setMessage('Erro ao importar dados');
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 2000);
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case 'exporting':
        return <>Exportando...</>;
      case 'importing':
        return <>Importando...</>;
      case 'success':
        return <><Check size={18} /> {message}</>;
      case 'error':
        return <><AlertCircle size={18} /> {message}</>;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <button
        className="btn btn-secondary"
        onClick={handleExport}
        disabled={status !== 'idle'}
      >
        <Download size={18} />
        Exportar
      </button>
      <button
        className="btn btn-secondary"
        onClick={handleImport}
        disabled={status !== 'idle'}
      >
        <Upload size={18} />
        Importar
      </button>
      {status !== 'idle' && (
        <span style={{ fontSize: '0.875rem', color: status === 'error' ? 'var(--danger)' : 'var(--accent)' }}>
          {getButtonContent()}
        </span>
      )}
    </div>
  );
}

