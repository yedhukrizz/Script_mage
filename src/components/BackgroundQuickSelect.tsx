import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Palette, Play, Square, Settings as SettingsIcon } from 'lucide-react';

export function BackgroundQuickSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const backgroundType = useStore((state) => state.backgroundType);
  const setBackgroundType = useStore((state) => state.setBackgroundType);
  const ref = useRef<HTMLDivElement>(null);

  const options = [
    { value: 'solid', label: 'Solid', icon: <Square size={14} className="fill-current opacity-50" /> },
    { value: 'gradient', label: 'Gradient', icon: <Palette size={14} /> },
    { value: 'animated-gradient', label: 'Anim. Gradient', icon: <Play size={14} /> },
    { value: 'scrolling-grid', label: 'Grid', icon: <div className="w-3 h-3 border border-current opacity-50 grid grid-cols-2 grid-rows-2"><div className="border-r border-b border-current"></div><div className="border-b border-current"></div><div className="border-r border-current"></div><div></div></div> },
    { value: 'scrolling-dots', label: 'Dots', icon: <div className="w-3 h-3 flex items-center justify-center gap-[2px]"><div className="w-1 h-1 bg-current rounded-full"></div><div className="w-1 h-1 bg-current rounded-full"></div></div> },
    { value: 'scrolling-lines', label: 'Lines', icon: <div className="w-3 h-3 flex flex-col gap-1 items-center justify-center opacity-50"><div className="w-full h-[1px] bg-current" /><div className="w-full h-[1px] bg-current" /></div> },
    { value: 'scanning-laser', label: 'Laser', icon: <div className="w-3 h-3 border-b-2 border-red-500 opacity-80 shadow-[0_0_2px_red]" /> },
    { value: 'scrolling-diagonal', label: 'Diagonal', icon: <div className="w-3 h-3 text-[10px] leading-none transform rotate-45 opacity-50">||</div> },
    { value: 'pulse-grid', label: 'Pulse', icon: <div className="w-3 h-3 border border-current grid grid-cols-2 grid-rows-2 animate-pulse"><div className="border-r border-b border-current"></div><div className="border-b border-current"></div><div className="border-r border-current"></div><div></div></div> },
    { value: 'radar-sweep', label: 'Radar', icon: <div className="w-3 h-3 rounded-full border border-current opacity-50 flex items-center justify-center"><div className="w-1 h-1 bg-current rounded-full" /></div> },
  ];

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
        className={`w-12 h-12 rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors ${isOpen ? 'bg-button-hover text-text-main' : 'bg-button-bg text-text-main'}`}
        title="Background Type"
      >
        <Palette size={20} />
      </button>

      {isOpen && (
        <div className="fixed sm:absolute bottom-24 sm:bottom-auto sm:top-0 left-4 sm:left-auto sm:right-[calc(100%+16px)] right-20 sm:w-48 bg-panel-bg border border-panel-border rounded-xl shadow-2xl py-2 z-50 animate-in fade-in sm:slide-in-from-right-2 slide-in-from-bottom-2 duration-200">
          <div className="px-3 py-1 text-[10px] uppercase font-semibold text-text-muted tracking-wider mb-1">
            Background Type
          </div>
          <div className="flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setBackgroundType(opt.value as any);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 text-sm w-full text-left transition-colors ${backgroundType === opt.value ? 'bg-[var(--color-accent)] text-white' : 'text-text-main hover:bg-button-hover'}`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
            <div className="h-[1px] bg-panel-border mx-3 my-1"></div>
            <button
              onClick={() => {
                setBackgroundType('video');
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2 text-sm w-full text-left transition-colors ${backgroundType === 'video' ? 'bg-[var(--color-accent)] text-white' : 'text-text-main hover:bg-button-hover'}`}
            >
              <Play size={14} className="opacity-50" />
              Custom Video
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
