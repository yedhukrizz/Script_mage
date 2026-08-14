const fs = require('fs');

const content = `import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Undo2, Redo2, Heart, Hand, MousePointer2, MousePointerClick } from 'lucide-react';
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

        <div className="flex bg-button-bg border border-panel-border rounded-full shadow-lg overflow-hidden ml-2 h-12 sm:h-14">
           <button 
             onClick={() => setTimelineInteractionMode('full')}
             className={\`flex-1 px-3 sm:px-4 flex items-center justify-center transition-all \${timelineInteractionMode === 'full' ? 'bg-[var(--color-accent)] text-white' : 'text-text-muted hover:bg-button-hover hover:text-text-main'}\`}
             title="Full Control (Move & Resize)"
           >
             <MousePointer2 size={20} />
           </button>
           <button 
             onClick={() => setTimelineInteractionMode('select')}
             className={\`flex-1 px-3 sm:px-4 border-l border-r border-panel-border flex items-center justify-center transition-all \${timelineInteractionMode === 'select' ? 'bg-[var(--color-accent)] text-white' : 'text-text-muted hover:bg-button-hover hover:text-text-main'}\`}
             title="Select Only (No Resize)"
           >
             <MousePointerClick size={20} />
           </button>
           <button 
             onClick={() => setTimelineInteractionMode('pan')}
             className={\`flex-1 px-3 sm:px-4 flex items-center justify-center transition-all \${timelineInteractionMode === 'pan' ? 'bg-[var(--color-accent)] text-white' : 'text-text-muted hover:bg-button-hover hover:text-text-main'}\`}
             title="Pan Mode"
           >
             <Hand size={20} />
           </button>
        </div>

        <button 
          onClick={() => setShowDonation(true)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-button-bg text-red-400 border border-panel-border rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all hover:bg-button-hover hover:text-red-500 hover:border-red-500/30"
          title="Support the Project"
        >
          <Heart size={24} fill="currentColor" />
        </button>
      </div>

      {showDonation && <DonationModal onClose={() => setShowDonation(false)} />}
    </>
  );
}
`;

fs.writeFileSync('src/components/UndoRedoControls.tsx', content);
