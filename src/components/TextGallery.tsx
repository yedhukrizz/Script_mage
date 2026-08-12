import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { X, Type, Edit2, Check, LayoutTemplate, Palette, Sparkles, BoxSelect, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { CustomSelect } from './CustomSelect';

interface TextGalleryProps {
  onClose: () => void;
}

const FONTS = [
  'Instrument Sans', 'Inter', 'Outfit', 'Space Grotesk', 'JetBrains Mono',
  'Playfair Display', 'Anton', 'Bebas Neue', 'Oswald', 'Montserrat'
];

const EFFECTS = [
  { value: 'none', label: 'None' },
  { value: 'write-on', label: 'Write On (Typewriter)' },
  { value: 'fade-words', label: 'Appearing Words' },
  { value: 'fly-words', label: 'Flying Words' },
  { value: 'zoom-words', label: 'Zooming Words' },
  { value: 'shiver', label: 'Shiver (Continuous)' },
  { value: 'flicker', label: 'Flicker (Continuous)' },
  { value: 'bloom', label: 'Bloom (Continuous)' },
  { value: 'neon', label: 'Neon Glow (Continuous)' },
  { value: 'glitch', label: 'Glitch (Continuous)' }
];

const COLORS = [
  '#ffffff', '#000000', '#ff0055', '#00f3ff', '#ffcc00', '#00ff9d', '#ff00ff', '#8a2be2'
];

export function TextGallery({ onClose }: TextGalleryProps) {
  const elements = useStore((state) => state.elements);
  const updateElement = useStore((state) => state.updateElement);
  const removeElement = useStore((state) => state.removeElement);
  const addToast = useStore((state) => state.addToast);
  const setSelectedElementId = useStore((state) => state.setSelectedElementId);

  // Bulk State
  const [bulkFont, setBulkFont] = useState<string>('');
  const [bulkColor, setBulkColor] = useState<string>('');
  const [bulkEffect, setBulkEffect] = useState<string>('');

  const textElements = useMemo(() => {
    return elements.filter(el => el.type === 'text').sort((a, b) => a.startTime - b.startTime);
  }, [elements]);

  const handleApplyBulk = () => {
    if (!bulkFont && !bulkColor && !bulkEffect) {
      addToast('Select at least one property to apply', 'info');
      return;
    }
    
    textElements.forEach(el => {
      const updates: any = {};
      if (bulkFont) updates.fontFamily = bulkFont;
      if (bulkColor) updates.color = bulkColor;
      if (bulkEffect) updates.textEffect = bulkEffect;
      updateElement(el.id, updates);
    });
    
    addToast(`Applied to ${textElements.length} text clips`, 'success');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80  z-[100] flex flex-col"
    >
      {/* Header */}
      <div className="shrink-0 border-b border-panel-border bg-app-bg px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
            <Type className="text-[var(--color-accent)]" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-main">Text Gallery</h2>
            <p className="text-xs text-text-muted mt-0.5">Manage and bulk-edit all text elements</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-button-bg hover:bg-button-hover text-text-muted hover:text-text-main rounded-xl transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Bulk Edit Panel */}
      <div className="shrink-0 border-b border-panel-border bg-gradient-to-b from-[#18181b] to-black px-6 py-6 flex flex-col items-center z-20 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-transparent pointer-events-none rounded-full" />
        
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-text-muted tracking-[0.2em] uppercase mb-5">
          <BoxSelect size={14} className="text-[var(--color-accent)]" />
          Bulk Studio
        </div>
        
        <div className="flex flex-wrap lg:flex-nowrap items-stretch glass-panel rounded-2xl p-2 gap-4 max-w-5xl mx-auto w-full justify-between relative z-10">
          
          <div className="flex-1 min-w-[200px] px-2 py-1 flex flex-col justify-center">
            <span className="text-[10px] text-text-muted opacity-80 font-bold uppercase tracking-wider mb-1">Target Font</span>
            <CustomSelect 
              value={bulkFont || 'none'}
              onChange={(val) => setBulkFont(val === 'none' ? '' : val)}
              options={[
                { value: 'none', label: '— Unchanged —' },
                ...FONTS.map(f => ({ value: f, label: f }))
              ]}
            />
          </div>
          
          <div className="hidden lg:block w-px bg-button-bg my-2" />
          
          <div className="flex-1 min-w-[200px] px-2 py-1 flex flex-col justify-center">
            <span className="text-[10px] text-text-muted opacity-80 font-bold uppercase tracking-wider mb-1">Target Effect</span>
            <CustomSelect 
              value={bulkEffect || 'none'}
              onChange={(val) => setBulkEffect(val === 'none' ? '' : val)}
              options={[
                { value: 'none', label: '— Unchanged —' },
                ...EFFECTS
              ]}
            />
          </div>

          <div className="hidden lg:block w-px bg-button-bg my-2" />

          <div className="px-2 py-1 flex flex-col justify-center">
             <span className="text-[10px] text-text-muted opacity-80 font-bold uppercase tracking-wider mb-2">Target Color</span>
             <div className="flex items-center gap-1.5">
               {COLORS.map(color => (
                 <button
                   key={color}
                   className={`w-7 h-7 rounded-lg border ${bulkColor === color ? 'border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.3)]' : 'border-panel-border opacity-50 hover:opacity-100 hover:scale-110'} transition-all`}
                   style={{ backgroundColor: color }}
                   onClick={() => setBulkColor(bulkColor === color ? '' : color)}
                   title={color}
                 />
               ))}
             </div>
          </div>
          
          <div className="hidden lg:block w-px bg-button-bg my-2" />

          <div className="flex items-center px-2 py-1">
            <button
              onClick={handleApplyBulk}
              className="px-6 py-3 h-full bg-[var(--color-accent)] hover:opacity-90 active:scale-[0.98] text-text-main text-sm font-semibold rounded-xl transition-all shadow-lg flex items-center gap-2 whitespace-nowrap group"
            >
              <Check size={18} className="group-hover:scale-110 transition-transform" />
              Apply to All ({textElements.length})
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {textElements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-muted">
            <Type size={48} className="mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No Text Elements</h2>
            <p>Add some text to the timeline first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {textElements.map((el, index) => (
              <div key={el.id} className="glass-panel rounded-xl p-4 flex flex-col gap-4 group hover:border-panel-border transition-colors">
                <div className="flex items-center justify-between">
                   <div className="text-[10px] text-text-muted uppercase font-semibold tracking-wider bg-button-bg px-2 py-1 rounded-md">
                     Text {index + 1} • {((el.endTime - el.startTime)/1000).toFixed(1)}s
                   </div>
                   <div className="flex items-center gap-1">
                     <button 
                       onClick={() => { setSelectedElementId(el.id); onClose(); }}
                       className="p-1.5 text-text-muted hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 rounded-lg transition-colors"
                       title="Jump to timeline"
                     >
                       <Edit2 size={14} />
                     </button>
                     <button 
                       onClick={() => removeElement(el.id)}
                       className="p-1.5 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                       title="Delete text"
                     >
                       <Trash2 size={14} />
                     </button>
                   </div>
                </div>

                <textarea
                  value={el.content}
                  onChange={(e) => updateElement(el.id, { content: e.target.value })}
                  className="w-full bg-button-bg border border-panel-border hover:border-panel-border focus:border-[var(--color-accent)] rounded-lg p-3 text-sm text-text-main resize-none outline-none custom-scrollbar transition-colors h-24"
                  placeholder="Enter text..."
                />

                <div className="grid grid-cols-2 gap-2 mt-auto">
                   <div className="flex flex-col gap-1">
                     <span className="text-[10px] text-text-muted uppercase font-semibold flex items-center gap-1"><LayoutTemplate size={10}/> Font</span>
                     <CustomSelect 
                       value={el.fontFamily || 'Instrument Sans'}
                       onChange={(val) => updateElement(el.id, { fontFamily: val })}
                       options={FONTS.map(f => ({ value: f, label: f }))}
                     />
                   </div>
                   <div className="flex flex-col gap-1">
                     <span className="text-[10px] text-text-muted uppercase font-semibold flex items-center gap-1"><Sparkles size={10}/> Effect</span>
                     <CustomSelect 
                       value={el.textEffect || 'none'}
                       onChange={(val) => updateElement(el.id, { textEffect: val })}
                       options={EFFECTS}
                     />
                   </div>
                   <div className="flex flex-col gap-1 col-span-2">
                     <span className="text-[10px] text-text-muted uppercase font-semibold flex items-center gap-1"><Palette size={10}/> Color</span>
                     <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                       {COLORS.map(color => (
                         <button
                           key={color}
                           className={`shrink-0 w-6 h-6 rounded-md border ${el.color === color ? 'border-white scale-110' : 'border-panel-border opacity-70 hover:opacity-100 hover:scale-110'} transition-all`}
                           style={{ backgroundColor: color }}
                           onClick={() => updateElement(el.id, { color })}
                           title={color}
                         />
                       ))}
                     </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
