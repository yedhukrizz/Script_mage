import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Settings, X } from 'lucide-react';

export function SettingsQuickSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const uiTheme = useStore((state) => state.uiTheme);
  const setUiTheme = useStore((state) => state.setUiTheme);
  const gridOverlay = useStore((state) => state.gridOverlay);
  const setGridOverlay = useStore((state) => state.setGridOverlay);
  const keylightType = useStore((state) => state.keylightType);
  const setKeylightType = useStore((state) => state.setKeylightType);
  const globalTextScale = useStore((state) => state.globalTextScale);
  const setGlobalTextScale = useStore((state) => state.setGlobalTextScale);

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
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors ${isOpen ? 'bg-button-hover text-text-main' : 'bg-button-bg text-text-main'}`}
        title="Quick Settings"
      >
        <Settings size={20} />
      </button>

      {isOpen && (
        <div className="fixed sm:absolute bottom-24 sm:bottom-auto sm:top-0 left-4 sm:left-auto sm:right-[calc(100%+16px)] right-4 sm:w-64 bg-panel-bg border border-panel-border rounded-xl shadow-2xl p-4 z-50 animate-in fade-in sm:slide-in-from-right-2 slide-in-from-bottom-2 duration-200">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-panel-border">
            <h4 className="text-sm font-semibold text-text-main">Quick Settings</h4>
            <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text-main"><X size={16}/></button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-text-muted uppercase font-semibold">Grid Overlay</label>
              <select 
                value={gridOverlay} 
                onChange={(e) => setGridOverlay(e.target.value as any)}
                className="bg-button-bg border border-panel-border rounded px-2 py-1.5 text-xs text-text-main outline-none focus:border-panel-border"
              >
                <option value="none">None</option>
                <option value="small">Small Grid</option>
                <option value="large">Large Grid</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-text-muted uppercase font-semibold">Keylight Direction</label>
              <select 
                value={keylightType} 
                onChange={(e) => setKeylightType(e.target.value as any)}
                className="bg-button-bg border border-panel-border rounded px-2 py-1.5 text-xs text-text-main outline-none focus:border-panel-border"
              >
                <option value="none">None</option>
                <option value="up">Bottom-Up</option>
                <option value="down">Top-Down</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-text-muted uppercase font-semibold">Text Scale</label>
                <span className="text-[10px] text-text-main">{globalTextScale.toFixed(2)}x</span>
              </div>
              <input 
                type="range" 
                min="0.1" max="3" step="0.05"
                value={globalTextScale} 
                onChange={(e) => setGlobalTextScale(parseFloat(e.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
            </div>
            
            {useStore.getState().backgroundAudioUrl && (
              <div className="flex flex-col gap-2 border-t border-panel-border pt-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-text-muted uppercase font-semibold">BGM Volume</label>
                  <span className="text-[10px] text-text-main">{Math.round(useStore.getState().backgroundAudioVolume * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="1" step="0.05"
                  value={useStore.getState().backgroundAudioVolume} 
                  onChange={(e) => useStore.getState().setBackgroundAudioVolume(parseFloat(e.target.value))}
                  className="w-full accent-[var(--color-accent)]"
                />
              </div>
            )}
            
            <div className="pt-2">
              <button 
                onClick={() => {
                  useStore.getState().applyDefaultsToProject();
                  useStore.getState().addToast('Settings applied to current project elements', 'success');
                }} 
                className="w-full bg-[var(--color-accent)] hover:opacity-90 text-white px-3 py-2 rounded-lg font-semibold transition-all shadow-sm text-xs flex items-center justify-center gap-2"
              >
                Apply to Current Project
              </button>
            </div>
            
            <button 
              onClick={() => {
                useStore.getState().setShowSettings(true);
                setIsOpen(false);
              }}
              className="text-xs text-text-muted hover:text-text-main mt-1 text-center w-full"
            >
              Open Full Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
