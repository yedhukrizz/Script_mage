import React from 'react';
import { useStore } from '../store/useStore';
import { Check, Info, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ToastContainer() {
  const toasts = useStore(state => state.toasts);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div 
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-button-bg border border-panel-border text-text-main px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 pointer-events-auto"
          >
            {toast.type === 'success' && <Check size={18} className="text-green-500" />}
            {toast.type === 'error' && <XCircle size={18} className="text-red-500" />}
            {toast.type === 'info' && <Info size={18} className="text-[var(--color-accent)]" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
