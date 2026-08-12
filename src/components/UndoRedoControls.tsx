import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Undo2, Redo2 } from 'lucide-react';

export function UndoRedoControls() {
  const undo = useStore(state => state.undo);
  const redo = useStore(state => state.redo);
  const past = useStore(state => state.past);
  const future = useStore(state => state.future);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+Z or Ctrl+Z for Undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Check for Cmd+Shift+Z or Ctrl+Y for Redo
      if (((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) || 
          ((e.metaKey || e.ctrlKey) && e.key === 'y')) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="absolute left-[4.5rem] sm:left-24 bottom-4 sm:bottom-6 flex gap-2 z-50">
      <button 
        onClick={undo}
        disabled={past.length === 0}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-button-bg text-text-main border border-panel-border rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 hover:bg-button-hover"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={24} />
      </button>
      <button 
        onClick={redo}
        disabled={future.length === 0}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-button-bg text-text-main border border-panel-border rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 hover:bg-button-hover"
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 size={24} />
      </button>
    </div>
  );
}
