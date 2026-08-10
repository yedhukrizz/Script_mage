import React from 'react';
import { useStore } from '../store/useStore';
import { Check, Info, XCircle } from 'lucide-react';

export function ToastContainer() {
  const toasts = useStore(state => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className="bg-button-bg border border-panel-border text-text-main px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto"
        >
          {toast.type === 'success' && <Check size={18} className="text-green-500" />}
          {toast.type === 'error' && <XCircle size={18} className="text-red-500" />}
          {toast.type === 'info' && <Info size={18} className="text-[var(--color-accent)]" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
