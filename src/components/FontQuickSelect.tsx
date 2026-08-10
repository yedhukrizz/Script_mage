import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Upload } from 'lucide-react';
import { get, set, keys } from 'idb-keyval';

const FONT_CATEGORIES = [
  {
    name: 'VIDEO TITLE / HOOK FONTS',
    fonts: ['Instrument Sans', 'Manrope', 'Plus Jakarta Sans', 'Outfit', 'Sora', 'Urbanist', 'DM Sans', 'Inter', 'Schibsted Grotesk', 'Onest']
  },
  {
    name: 'MAIN TEXT / UI / BODY',
    fonts: ['Inter', 'Instrument Sans', 'Manrope', 'DM Sans', 'Public Sans', 'Albert Sans', 'Figtree', 'Be Vietnam Pro', 'Work Sans', 'Noto Sans', 'IBM Plex Sans', 'Commissioner', 'Golos Text', 'Archivo', 'Hind']
  },
  {
    name: 'HEADINGS',
    fonts: ['Outfit', 'Plus Jakarta Sans', 'Urbanist', 'Space Grotesk', 'Schibsted Grotesk', 'Red Hat Display', 'Sora', 'Lexend', 'Epilogue', 'M PLUS 1']
  },
  {
    name: 'YOUTUBE / REELS / SHORTS CAPTIONS',
    fonts: ['Instrument Sans', 'Outfit', 'Manrope', 'Plus Jakarta Sans', 'Urbanist', 'Inter', 'DM Sans', 'Schibsted Grotesk', 'Sora', 'Figtree']
  },
  {
    name: 'PREMIUM / APPLE STYLE',
    fonts: ['Instrument Sans', 'Inter', 'Manrope', 'Onest', 'Plus Jakarta Sans', 'DM Sans', 'Albert Sans', 'Figtree', 'Schibsted Grotesk', 'Public Sans']
  },
  {
    name: 'MODERN STARTUP / AI STYLE',
    fonts: ['Instrument Sans', 'Inter', 'Plus Jakarta Sans', 'Outfit', 'Manrope', 'DM Sans', 'Urbanist', 'Onest', 'Sora', 'Space Grotesk']
  }
];

export function FontQuickSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const [customFonts, setCustomFonts] = useState<string[]>([]);
  const defaults = useStore((state) => state.defaults);
  const applyGlobalFont = useStore((state) => state.applyGlobalFont);
  const ref = useRef<HTMLDivElement>(null);

  const activeFont = defaults.text.fontFamily || 'Instrument Sans';

  useEffect(() => {
    async function loadCustomFonts() {
      try {
        const storedKeys = await keys();
        const fontNames: string[] = [];
        
        for (const key of storedKeys) {
          if (typeof key === 'string' && key.startsWith('custom-font:')) {
            const fontName = key.replace('custom-font:', '');
            const buffer = await get(key);
            if (buffer instanceof ArrayBuffer) {
              const fontFace = new FontFace(fontName, buffer);
              const loadedFace = await fontFace.load();
              document.fonts.add(loadedFace);
              fontNames.push(fontName);
            }
          }
        }
        
        if (fontNames.length > 0) {
          setCustomFonts(fontNames);
        }
      } catch (err) {
        console.error('Failed to load custom fonts from storage:', err);
      }
    }
    
    loadCustomFonts();
  }, []);

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

  const handleUploadFont = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fontName = file.name.split('.')[0].replace(/[^a-zA-Z0-9 ]/g, ' ').trim();
      const buffer = await file.arrayBuffer();
      
      // Save to idb
      await set(`custom-font:${fontName}`, buffer);
      
      const fontFace = new FontFace(fontName, buffer);
      
      const loadedFace = await fontFace.load();
      document.fonts.add(loadedFace);
      
      if (!customFonts.includes(fontName)) {
        setCustomFonts(prev => [...prev, fontName]);
      }
      applyGlobalFont(fontName);
    } catch (err) {
      console.error('Failed to load font:', err);
      alert('Failed to load custom font.');
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-12 h-12 rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold ${isOpen ? 'bg-button-hover text-text-main' : 'bg-button-bg text-text-main'}`}
        title="Global Font"
      >
        <span className="font-serif text-lg leading-none pt-0.5">Ag</span>
      </button>

      {isOpen && (
        <div className="fixed sm:absolute bottom-24 sm:bottom-0 left-4 sm:left-auto sm:right-[calc(100%+8px)] right-20 sm:w-64 bg-button-bg border border-panel-border rounded-2xl shadow-2xl z-50 animate-in fade-in sm:slide-in-from-right-2 slide-in-from-bottom-2 duration-200 overflow-hidden flex flex-col max-h-[50vh] sm:max-h-[400px]">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            
            {customFonts.length > 0 && (
              <div className="mb-4">
                <div className="px-2 py-1 text-[10px] uppercase font-semibold text-text-muted tracking-wider mb-1">
                  Custom Fonts
                </div>
                {customFonts.map((font) => (
                  <button
                    key={`custom-${font}`}
                    onClick={() => {
                      applyGlobalFont(font);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 text-sm w-full text-left transition-colors rounded-xl font-medium ${activeFont === font ? 'bg-[var(--color-accent)] text-white' : 'text-text-main hover:bg-button-hover'}`}
                    style={{ fontFamily: `"${font}", sans-serif` }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}

            {FONT_CATEGORIES.map((category) => (
              <div key={category.name} className="mb-4 last:mb-0">
                <div className="px-2 py-1 text-[10px] uppercase font-semibold text-text-muted tracking-wider mb-1">
                  {category.name}
                </div>
                {category.fonts.map((font) => (
                  <button
                    key={`${category.name}-${font}`}
                    onClick={() => {
                      applyGlobalFont(font);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 text-sm w-full text-left transition-colors rounded-xl font-medium ${activeFont === font ? 'bg-[var(--color-accent)] text-white' : 'text-text-main hover:bg-button-hover'}`}
                    style={{ fontFamily: `"${font}", sans-serif` }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-panel-border bg-button-bg">
            <label className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm w-full text-center transition-colors text-text-main hover:bg-button-hover rounded-xl cursor-pointer font-medium border border-dashed border-panel-border">
              <Upload size={14} className="opacity-70" /> 
              Upload Custom Font
              <input type="file" accept=".ttf,.otf,.woff,.woff2" className="hidden" onChange={handleUploadFont} />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
