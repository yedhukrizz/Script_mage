import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Undo2, Redo2, Coffee, Hand, MousePointer2, MousePointerClick } from 'lucide-react';
import { DonationModal } from './DonationModal';

export function UndoRedoControls() {
  const undo = useStore(state => state.undo);
  const redo = useStore(state => state.redo);
  const past = useStore(state => state.past);
  const future = useStore(state => state.future);
  const timelineInteractionMode = useStore(state => state.timelineInteractionMode);
  const setTimelineInteractionMode = useStore(state => state.setTimelineInteractionMode);
  const [showDonation, setShowDonation] = useState(false);

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
    <>
      <div className="relative flex gap-2 z-50">
        <button 
          onClick={undo}
          disabled={past.length === 0}
          className="w-11 h-11 bg-button-bg text-text-main rounded-full border float-border flex items-center justify-center  hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 hover:bg-button-hover"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} />
        </button>
        <button 
          onClick={redo}
          disabled={future.length === 0}
          className="w-11 h-11 bg-button-bg text-text-main rounded-full border float-border flex items-center justify-center  hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 hover:bg-button-hover"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={18} />
        </button>

        <div className="flex bg-button-bg rounded-full overflow-hidden border float-border ml-2 h-11">
           <button 
             onClick={() => setTimelineInteractionMode('full')}
             className={`w-11 flex items-center justify-center transition-all ${timelineInteractionMode === 'full' ? 'bg-[var(--color-accent)] text-white' : 'text-text-muted hover:bg-button-hover hover:text-text-main'}`}
             title="Full Control (Move & Resize)"
           >
             <MousePointer2 size={18} />
           </button>
           <button 
             onClick={() => setTimelineInteractionMode('select')}
             className={`w-11 border-l border-r border-panel-border/30 flex items-center justify-center transition-all ${timelineInteractionMode === 'select' ? 'bg-[var(--color-accent)] text-white' : 'text-text-muted hover:bg-button-hover hover:text-text-main'}`}
             title="Select Only (No Resize)"
           >
             <MousePointerClick size={18} />
           </button>
           <button 
             onClick={() => setTimelineInteractionMode('pan')}
             className={`w-11 flex items-center justify-center transition-all ${timelineInteractionMode === 'pan' ? 'bg-[var(--color-accent)] text-white' : 'text-text-muted hover:bg-button-hover hover:text-text-main'}`}
             title="Pan Mode"
           >
             <Hand size={18} />
           </button>
        </div>

        <button 
          onClick={() => setShowDonation(true)}
          className="w-11 h-11 bg-button-bg text-amber-500 rounded-full border float-border flex items-center justify-center  hover:scale-105 active:scale-95 transition-all hover:bg-button-hover hover:text-amber-400 hover:border-amber-500/30"
          title="Support the Project"
        >
          <Coffee size={18} />
        </button>
      </div>

      {showDonation && <DonationModal onClose={() => setShowDonation(false)} />}
    </>
  );
}
