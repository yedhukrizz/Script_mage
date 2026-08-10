import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Trash2, Mic, Globe, Move, Type, Image as ImageIcon, Activity, Clock, SlidersHorizontal, Settings2, Play, X } from 'lucide-react';
import { TTSModal } from './TTSModal';

const easings = {
  'linear': 'Linear',
  'ease-in': 'Ease In',
  'ease-out': 'Ease Out',
  'ease-in-out': 'Ease In Out',
  'back-out': 'Back Out (Overshoot)',
  'elastic-out': 'Elastic Out',
  'bounce-out': 'Bounce Out'
};

const fonts = [
  { name: 'Instrument Sans' },
  { name: 'Inter' },
  { name: 'Outfit' },
  { name: 'Space Grotesk' },
  { name: 'Playfair Display' },
  { name: 'JetBrains Mono' },
  { name: 'Anton' },
  { name: 'Bebas Neue' },
  { name: 'Oswald' },
  { name: 'Montserrat' },
  { name: 'Manrope' },
  { name: 'Plus Jakarta Sans' },
  { name: 'Sora' },
  { name: 'Urbanist' },
  { name: 'DM Sans' },
  { name: 'Schibsted Grotesk' },
  { name: 'Onest' },
  { name: 'Public Sans' },
  { name: 'Albert Sans' },
  { name: 'Figtree' },
  { name: 'Be Vietnam Pro' },
  { name: 'Work Sans' },
  { name: 'Noto Sans' },
  { name: 'IBM Plex Sans' },
  { name: 'Commissioner' },
  { name: 'Golos Text' },
  { name: 'Archivo' },
  { name: 'Hind' },
  { name: 'Red Hat Display' },
  { name: 'Lexend' },
  { name: 'Epilogue' },
  { name: 'M PLUS 1' }
];

const ThickSlider = ({ label, value, min, max, step = 1, onChange, onChangeEnd, unit = '' }: any) => (
  <div className="flex flex-col gap-2 mb-4">
    <div className="flex justify-between items-center text-xs text-text-muted font-medium px-1">
      <span>{label}</span>
      <span className="font-mono text-text-main">{typeof value === 'number' ? Math.round(value * 100) / 100 : value}{unit}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))} 
      onPointerUp={onChangeEnd}
      onKeyUp={onChangeEnd}
      className="w-full h-6 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md cursor-pointer transition-all active:[&::-webkit-slider-thumb]:scale-90" 
    />
  </div>
);

const IconButton = ({ icon: Icon, active, onClick, className = '' }: any) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${active ? 'bg-white text-black shadow-md scale-105' : 'text-white hover:bg-white/10 hover:text-white'} ${className}`}
  >
    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
  </button>
);

import { get, set, keys } from 'idb-keyval';

export function PropertiesPanel() {
  const elements = useStore((state) => state.elements);
  const selectedElementId = useStore((state) => state.selectedElementId);
  const setSelectedElementId = useStore((state) => state.setSelectedElementId);
  const updateElement = useStore((state) => state.updateElement);
  const removeElement = useStore((state) => state.removeElement);
  const duration = useStore((state) => state.duration);
  const saveHistory = useStore((state) => state.saveHistory);
  
  const [activeTab, setActiveTab] = useState<'transform' | 'appearance' | 'media' | 'animation' | 'time' | 'tts' | null>(null);
  const [showTTSModal, setShowTTSModal] = useState(false);
  const [translateLang, setTranslateLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [customFonts, setCustomFonts] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadCustomFonts() {
      try {
        const storedKeys = await keys();
        const fontNames: string[] = [];
        for (const key of storedKeys) {
          if (typeof key === 'string' && key.startsWith('custom-font:')) {
            fontNames.push(key.replace('custom-font:', ''));
          }
        }
        if (fontNames.length > 0) {
          setCustomFonts(fontNames);
        }
      } catch (err) {
        console.error('Failed to load custom fonts in properties panel:', err);
      }
    }
    loadCustomFonts();
  }, []);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveTab(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedElement) return null;

  const handleChange = (field: string, value: any, skipHistory = false) => {
    updateElement(selectedElement.id, { [field]: value }, skipHistory);
  };

  const handleEnd = () => {
    saveHistory();
  };

  const handleTranslate = async () => {
    if (selectedElement.type !== 'text' || !selectedElement.content.trim()) return;
    setIsTranslating(true);
    try {
      const res = await fetch(`/api/translate?text=${encodeURIComponent(selectedElement.content)}&tl=${translateLang}`);
      if (!res.ok) throw new Error('Translation failed');
      const data = await res.json();
      if (data.translation) {
        updateElement(selectedElement.id, { 
          content: data.translation,
          ttsVoice: translateLang
        });
      }
    } catch (e) {
      console.error(e);
      alert('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const hasAppearance = selectedElement.type === 'text' || selectedElement.type === 'shape';
  const hasMedia = selectedElement.type === 'image' || selectedElement.type === 'video' || selectedElement.type === 'audio' || selectedElement.isPlaceholder;
  const hasTTS = selectedElement.type === 'text';

  // Deselect tab if invalid
  if (activeTab === 'appearance' && !hasAppearance) setActiveTab(null);
  if (activeTab === 'media' && !hasMedia) setActiveTab(null);
  if (activeTab === 'tts' && !hasTTS) setActiveTab(null);

  return (
    <div className="relative flex flex-col items-center pointer-events-auto" ref={containerRef} onMouseDown={(e) => e.stopPropagation()}>
      
      {/* Pop-up Inspector Pill */}
      {activeTab && (
        <div className="mb-4 bg-[#18181b]/95 backdrop-blur-xl p-5 rounded-[24px] shadow-2xl border border-white/10 w-[340px] max-w-[90vw] animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-white capitalize">{activeTab} Properties</h3>
          </div>

          <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar pointer-events-auto">
            {activeTab === 'transform' && (
              <>
                {selectedElement.type !== 'audio' && (
                  <>
                    <ThickSlider label="X Position" value={selectedElement.x} min={0} max={1920} onChange={(v: number) => handleChange('x', v, true)} onChangeEnd={handleEnd} unit="px" />
                    <ThickSlider label="Y Position" value={selectedElement.y} min={0} max={1080} onChange={(v: number) => handleChange('y', v, true)} onChangeEnd={handleEnd} unit="px" />
                    <ThickSlider label="Width" value={selectedElement.width} min={10} max={1000} onChange={(v: number) => handleChange('width', v, true)} onChangeEnd={handleEnd} unit="px" />
                    <ThickSlider label="Height" value={selectedElement.height} min={10} max={1000} onChange={(v: number) => handleChange('height', v, true)} onChangeEnd={handleEnd} unit="px" />
                    <ThickSlider label="Rotation" value={selectedElement.rotation} min={-180} max={180} onChange={(v: number) => handleChange('rotation', v, true)} onChangeEnd={handleEnd} unit="°" />
                    <ThickSlider label="Opacity" value={selectedElement.opacity} min={0} max={1} step={0.01} onChange={(v: number) => handleChange('opacity', v, true)} onChangeEnd={handleEnd} />
                  </>
                )}
              </>
            )}

            {activeTab === 'time' && (
              <>
                <ThickSlider label="Start Time" value={selectedElement.startTime / 1000} min={0} max={duration / 1000} step={0.1} onChange={(v: number) => handleChange('startTime', v * 1000, true)} onChangeEnd={handleEnd} unit="s" />
                <ThickSlider label="End Time" value={selectedElement.endTime / 1000} min={0} max={duration / 1000} step={0.1} onChange={(v: number) => handleChange('endTime', v * 1000, true)} onChangeEnd={handleEnd} unit="s" />
              </>
            )}

            {activeTab === 'media' && hasMedia && (
              <>
                {(selectedElement.type === 'video' || selectedElement.type === 'audio') && (
                  <ThickSlider label="Volume" value={selectedElement.volume ?? 1} min={0} max={1} step={0.05} onChange={(v: number) => handleChange('volume', v, true)} onChangeEnd={handleEnd} />
                )}
                {selectedElement.isPlaceholder && (
                  <ThickSlider label="Dimness" value={selectedElement.mediaDimness ?? 0.5} min={0} max={1} step={0.05} onChange={(v: number) => handleChange('mediaDimness', v, true)} onChangeEnd={handleEnd} />
                )}
                {(selectedElement.type === 'image' || selectedElement.type === 'video' || selectedElement.isPlaceholder) && (
                  <div className="flex flex-col gap-2 mb-4">
                    <span className="text-xs text-text-muted font-medium px-1">Continuous Effect</span>
                    <select 
                      value={selectedElement.mediaEffect || 'none'} 
                      onChange={(e) => handleChange('mediaEffect', e.target.value)}
                      className="w-full bg-white/10 text-white rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-white/20 appearance-none text-sm font-medium"
                    >
                      <option value="none">None</option>
                      <option value="parallax-slow">Slow Pan (Parallax)</option>
                      <option value="parallax-fast">Fast Pan</option>
                      <option value="zoom-in">Slow Zoom In</option>
                      <option value="zoom-out">Slow Zoom Out</option>
                    </select>
                  </div>
                )}
              </>
            )}

            {activeTab === 'appearance' && hasAppearance && (
              <>
                <div className="flex flex-col gap-2 mb-4">
                  <span className="text-xs text-text-muted font-medium px-1">Color</span>
                  <div className="flex gap-2">
                    <input type="color" value={selectedElement.color || '#ffffff'} onChange={(e) => handleChange('color', e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0 p-0" />
                    <input type="text" value={selectedElement.color || '#ffffff'} onChange={(e) => handleChange('color', e.target.value)} className="flex-1 bg-white/10 text-white rounded-xl px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-white/20" />
                  </div>
                </div>
                {selectedElement.type === 'text' && (
                  <>
                    <div className="flex flex-col gap-2 mb-4">
                      <span className="text-xs text-text-muted font-medium px-1">Font Family</span>
                      <select value={selectedElement.fontFamily || 'Inter'} onChange={(e) => handleChange('fontFamily', e.target.value)} className="w-full bg-white/10 text-white rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-white/20 appearance-none text-sm font-medium">
                        {customFonts.length > 0 && (
                          <optgroup label="Custom Fonts">
                            {customFonts.map(font => <option key={`custom-${font}`} value={font}>{font}</option>)}
                          </optgroup>
                        )}
                        <optgroup label="System & Google Fonts">
                          {fonts.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                        </optgroup>
                      </select>
                    </div>
                    <ThickSlider label="Font Size" value={selectedElement.fontSize || 48} min={12} max={400} step={1} onChange={(v: number) => handleChange('fontSize', v, true)} onChangeEnd={handleEnd} unit="px" />
                    <ThickSlider label="Font Weight" value={selectedElement.fontWeight || 600} min={100} max={900} step={100} onChange={(v: number) => handleChange('fontWeight', v, true)} onChangeEnd={handleEnd} />
                  </>
                )}
              </>
            )}

            {activeTab === 'animation' && (
              <>
                <div className="flex flex-col gap-2 mb-4">
                  <span className="text-xs text-text-muted font-medium px-1">In Animation</span>
                  <select value={selectedElement.animationIn || 'none'} onChange={(e) => handleChange('animationIn', e.target.value)} className="w-full bg-white/10 text-white rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-white/20 appearance-none text-sm font-medium">
                    <option value="none">None</option>
                    <option value="fade">Fade In</option>
                    <option value="scale">Scale Up</option>
                    <option value="slide">Slide In</option>
                    <option value="fade-slide">Fade & Slide</option>
                    <option value="fade-slide-up">Fade & Slide Up</option>
                    <option value="zoom-in">Zoom In</option>
                    <option value="fade-zoom-in">Fade & Zoom In</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <span className="text-xs text-text-muted font-medium px-1">Out Animation</span>
                  <select value={selectedElement.animationOut || 'none'} onChange={(e) => handleChange('animationOut', e.target.value)} className="w-full bg-white/10 text-white rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-white/20 appearance-none text-sm font-medium">
                    <option value="none">None</option>
                    <option value="fade">Fade Out</option>
                    <option value="scale">Scale Down</option>
                    <option value="slide">Slide Out</option>
                    <option value="fade-slide">Fade & Slide</option>
                    <option value="fade-slide-up">Fade & Slide Down</option>
                    <option value="zoom-out">Zoom Out</option>
                    <option value="fade-zoom-out">Fade & Zoom Out</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <span className="text-xs text-text-muted font-medium px-1">Easing</span>
                  <select value={selectedElement.easing || 'linear'} onChange={(e) => handleChange('easing', e.target.value)} className="w-full bg-white/10 text-white rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-white/20 appearance-none text-sm font-medium">
                    {Object.entries(easings).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                  </select>
                </div>
              </>
            )}

            {activeTab === 'tts' && hasTTS && (
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setShowTTSModal(true)}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Mic size={18} /> Edit TTS Voice
                </button>
                {selectedElement.ttsVoice && (
                  <button
                    onClick={() => handleChange('ttsVoice', undefined)}
                    className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} /> Remove TTS
                  </button>
                )}
                
                <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                   <span className="text-xs text-text-muted font-medium px-1">Translate Text & Audio</span>
                   <div className="flex gap-2">
                     <select 
                       value={translateLang}
                       onChange={(e) => setTranslateLang(e.target.value)}
                       className="flex-1 bg-white/10 text-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-white/20 appearance-none text-sm font-medium"
                     >
                       <option value="es">Spanish</option>
                       <option value="fr">French</option>
                       <option value="de">German</option>
                       <option value="it">Italian</option>
                       <option value="ja">Japanese</option>
                       <option value="ko">Korean</option>
                       <option value="zh-CN">Chinese</option>
                       <option value="hi">Hindi</option>
                     </select>
                     <button 
                       onClick={handleTranslate}
                       disabled={isTranslating}
                       className="px-4 py-2 bg-white text-black hover:bg-white/90 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                     >
                       {isTranslating ? '...' : <Globe size={16} />}
                     </button>
                   </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Floating Pill */}
      <div className="flex items-center gap-1 p-1.5 bg-[#18181b]/90 backdrop-blur-xl rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 pointer-events-auto">
        <IconButton icon={SlidersHorizontal} onClick={() => setActiveTab(activeTab === 'transform' ? null : 'transform')} active={activeTab === 'transform'} />
        {hasAppearance && <IconButton icon={Type} onClick={() => setActiveTab(activeTab === 'appearance' ? null : 'appearance')} active={activeTab === 'appearance'} />}
        {hasMedia && <IconButton icon={ImageIcon} onClick={() => setActiveTab(activeTab === 'media' ? null : 'media')} active={activeTab === 'media'} />}
        <IconButton icon={Activity} onClick={() => setActiveTab(activeTab === 'animation' ? null : 'animation')} active={activeTab === 'animation'} />
        <IconButton icon={Clock} onClick={() => setActiveTab(activeTab === 'time' ? null : 'time')} active={activeTab === 'time'} />
        {hasTTS && <IconButton icon={Mic} onClick={() => setActiveTab(activeTab === 'tts' ? null : 'tts')} active={activeTab === 'tts'} />}
        
        <div className="w-px h-6 bg-white/10 mx-1" />
        
        <IconButton icon={Trash2} onClick={() => removeElement(selectedElement.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10" />
        <IconButton icon={X} onClick={() => setSelectedElementId(null)} className="text-text-muted hover:text-white" />
      </div>

      {showTTSModal && (
        <TTSModal 
          element={selectedElement}
          onClose={() => setShowTTSModal(false)} 
        />
      )}
    </div>
  );
}
