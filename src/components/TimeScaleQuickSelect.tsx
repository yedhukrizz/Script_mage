import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { FastForward } from 'lucide-react';

const SCALES = [
  { label: '0.5x', value: 2 },
  { label: '0.75x', value: 1.333 },
  { label: '1x', value: 1 },
  { label: '1.25x', value: 0.8 },
  { label: '1.5x', value: 0.666 },
  { label: '2x', value: 0.5 },
];

export function TimeScaleQuickSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const scaleTimeline = useStore((state) => state.scaleTimeline);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-12 h-12 rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold ${isOpen ? 'bg-button-hover text-text-main' : 'bg-button-bg text-text-main'}`}
        title="Scale Video Speed"
      >
        <FastForward size={20} />
      </button>

      {isOpen && (
        <div className="fixed sm:absolute bottom-24 sm:bottom-0 left-4 sm:left-auto sm:right-[calc(100%+8px)] right-20 sm:w-40 bg-button-bg border border-panel-border rounded-2xl shadow-2xl z-50 animate-in fade-in sm:slide-in-from-right-2 slide-in-from-bottom-2 duration-200 overflow-hidden flex flex-col">
          <div className="px-3 py-2 text-[10px] uppercase font-semibold text-text-muted tracking-wider border-b border-panel-border">
            Adjust Speed
          </div>
          <div className="p-1 flex flex-col gap-1">
            {SCALES.map((scale) => (
              <button
                key={scale.label}
                onClick={() => {
                  scaleTimeline(scale.value);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left transition-colors rounded-xl font-medium text-text-main hover:bg-button-hover"
              >
                {scale.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
