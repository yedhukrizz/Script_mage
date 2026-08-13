import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Undo2, Redo2, Heart, Hand } from 'lucide-react';
import { DonationModal } from './DonationModal';

export function UndoRedoControls() {
  const undo = useStore(state => state.undo);
  const redo = useStore(state => state.redo);
  const past = useStore(state => state.past);
  const future = useStore(state => state.future);
  const timelineTrackpadMode = useStore(state => state.timelineTrackpadMode);
  const setTimelineTrackpadMode = useStore(state => state.setTimelineTrackpadMode);
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
        <button 
          onClick={() => setTimelineTrackpadMode(!timelineTrackpadMode)}
          className={`w-12 h-12 sm:w-14 sm:h-14 border rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all ml-2 ${timelineTrackpadMode ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]' : 'bg-button-bg text-text-muted border-panel-border hover:bg-button-hover'}`}
          title={timelineTrackpadMode ? "Disable Timeline Pan (Trackpad Mode)" : "Enable Timeline Pan (Trackpad Mode)"}
        >
          <Hand size={24} className={timelineTrackpadMode ? "fill-white/20" : ""} />
        </button>
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
