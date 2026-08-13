import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Type, Image as ImageIcon, Square, Circle, Plus, Terminal, Sparkles, 
  Settings, LayoutTemplate, Mic, Globe, ImagePlus, Palette, FastForward, 
  ChevronLeft, Music, X, Wand2
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ExportButton } from './ExportButton';
import { motion, AnimatePresence } from 'motion/react';
import { ThickSlider } from './ThickSlider';

const STANDARD_FONTS = [
  'Instrument Sans', 'Playfair Display', 'Inter', 'Montserrat', 'Poppins', 
  'Roboto', 'Oswald', 'Cinzel', 'Pacifico', 'Space Grotesk', 'Bebas Neue', 'Caveat', 'Dancing Script'
];

const BACKGROUND_OPTIONS = [
  { label: 'Solid Color', value: 'solid' },
  { label: 'Gradient', value: 'gradient' },
  { label: 'Animated Gradient', value: 'animated-gradient' },
  { label: 'Canvas Video', value: 'video' },
  { label: 'Scrolling Grid', value: 'scrolling-grid' },
  { label: 'Scrolling Dots', value: 'scrolling-dots' },
  { label: 'Scrolling Lines', value: 'scrolling-lines' },
  { label: 'Scanning Laser', value: 'scanning-laser' },
  { label: 'Scrolling Diagonal', value: 'scrolling-diagonal' },
  { label: 'Pulse Grid', value: 'pulse-grid' },
  { label: 'Radar Sweep', value: 'radar-sweep' }
];

const SPEED_PRESETS = [
  { label: '0.5x (Slow Down 2x)', value: 0.5 },
  { label: '0.75x (Slow Down 1.33x)', value: 0.75 },
  { label: '1.0x (Normal Speed)', value: 1.0 },
  { label: '1.25x (Speed Up 1.25x)', value: 1.25 },
  { label: '1.5x (Speed Up 1.5x)', value: 1.5 },
  { label: '2.0x (Speed Up 2x)', value: 2.0 }
];

const EMPTY_CUSTOM_FONTS: string[] = [];

export function Toolbar() {
  const addElement = useStore((state) => state.addElement);
  const duration = useStore((state) => state.duration);
  const canvasAspectRatio = useStore((state) => state.canvasAspectRatio);
  const setCanvasAspectRatio = useStore((state) => state.setCanvasAspectRatio);
  const defaults = useStore((state) => state.defaults);
  const setShowScriptModal = useStore((state) => state.setShowScriptModal);
  const setShowGlobalTTSModal = useStore((state) => state.setShowGlobalTTSModal);
  const setShowGlobalTranslateModal = useStore((state) => state.setShowGlobalTranslateModal);
  const setShowPlaceholderGallery = useStore((state) => state.setShowPlaceholderGallery);
  const setShowTextGallery = useStore((state) => state.setShowTextGallery);
  const setShowSettings = useStore((state) => state.setShowSettings);
  const addToast = useStore((state) => state.addToast);

  // Zustand Store Actions & Settings
  const gridOverlay = useStore((state) => state.gridOverlay);
  const uiTheme = useStore((state) => state.uiTheme);
  const setUiTheme = useStore((state) => state.setUiTheme);
  const setGridOverlay = useStore((state) => state.setGridOverlay);
  const keylightType = useStore((state) => state.keylightType);
  const setKeylightType = useStore((state) => state.setKeylightType);
  const globalTextScale = useStore((state) => state.globalTextScale);
  const setGlobalTextScale = useStore((state) => state.setGlobalTextScale);
  const backgroundAudioUrl = useStore((state) => state.backgroundAudioUrl);
  const backgroundAudioVolume = useStore((state) => state.backgroundAudioVolume);
  const setBackgroundAudioVolume = useStore((state) => state.setBackgroundAudioVolume);
  const applyDefaultsToProject = useStore((state) => state.applyDefaultsToProject);
  const applyGlobalFont = useStore((state) => state.applyGlobalFont);
  const applyGlobalTextEffect = useStore((state) => state.applyGlobalTextEffect);
  const backgroundType = useStore((state) => state.backgroundType);
  const setBackgroundType = useStore((state) => state.setBackgroundType);
  const scaleTimeline = useStore((state) => state.scaleTimeline);
  const storeCustomFonts = useStore((state) => state.customFonts);
  const setCustomFonts = useStore((state) => state.setCustomFonts);
  const elements = useStore((state) => state.elements);
  const currentTime = useStore((state) => state.currentTime);
  const setCurrentTime = useStore((state) => state.setCurrentTime);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  const customFonts = storeCustomFonts || EMPTY_CUSTOM_FONTS;

  const [isOpen, setIsOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<'main' | 'settings' | 'font' | 'background' | 'speed'>('main');
  const [fontSearch, setFontSearch] = useState('');

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setActiveSubMenu('main');
  };

  const getCenteredProps = (elementAspectRatio: number = 1) => {
    const cw = canvasAspectRatio === '16/9' ? 1920 : canvasAspectRatio === '9/16' ? 1080 : 1080;
    const ch = canvasAspectRatio === '16/9' ? 1080 : canvasAspectRatio === '9/16' ? 1920 : canvasAspectRatio === '4/5' ? 1350 : 1080;
    
    const size = Math.min(cw, ch) * 0.3;
    let width = size;
    let height = size;

    if (elementAspectRatio > 1) {
      width = size * elementAspectRatio;
      height = size;
    } else {
      width = size;
      height = size / elementAspectRatio;
    }

    const x = (cw - width) / 2;
    const y = (ch - height) / 2;

    return { x, y, width, height };
  };

  const getCenteredTextProps = () => {
    const cw = canvasAspectRatio === '16/9' ? 1920 : canvasAspectRatio === '9/16' ? 1080 : 1080;
    const ch = canvasAspectRatio === '16/9' ? 1080 : canvasAspectRatio === '9/16' ? 1920 : canvasAspectRatio === '4/5' ? 1350 : 1080;
    
    const padding = 120;
    let width = cw - padding * 2;
    if (cw > ch && width > 1200) {
      width = 1200;
    }
    const height = 400;
    const x = (cw - width) / 2;
    const y = (ch - height) / 2;

    return { x, y, width, height };
  };

  const getRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 60%, 50%)`;

  const handleAddText = () => {
    addElement({
      id: uuidv4(),
      type: 'text',
      content: 'Double click to edit',
      ...getCenteredTextProps(),
      rotation: 0, opacity: 1,
      startTime: 0, endTime: Math.max(0, duration),
      animationIn: defaults.text.animationIn as any, 
      animationOut: defaults.text.animationOut as any, 
      easing: defaults.text.easing as any,
      fontFamily: defaults.text.fontFamily || 'Instrument Sans',
      textEffect: defaults.text.textEffect || 'none',
      fontWeight: defaults.text.fontWeight || 600,
      color: '#ffffff', fontSize: 120,
      trackColor: getRandomColor()
    });
    setIsOpen(false);
  };

  const handleAddShape = (shapeType: string) => {
    addElement({
      id: uuidv4(),
      type: 'shape',
      content: shapeType,
      ...getCenteredProps(1),
      rotation: 0, opacity: 1,
      startTime: 0, endTime: Math.max(0, duration),
      animationIn: defaults.shape.animationIn as any, 
      animationOut: defaults.shape.animationOut as any, 
      easing: defaults.shape.easing as any,
      color: '#ffffff',
      trackColor: getRandomColor()
    });
    setIsOpen(false);
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addElement({
        id: uuidv4(),
        type: 'image',
        content: url,
        ...getCenteredProps(1),
        rotation: 0, opacity: 1,
        startTime: 0, endTime: Math.max(0, duration),
        animationIn: defaults.image.animationIn as any, 
        animationOut: defaults.image.animationOut as any, 
        easing: defaults.image.easing as any,
        trackColor: getRandomColor()
      });
      setIsOpen(false);
    }
  };

  const handleAddMusic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addElement({
        id: uuidv4(),
        type: 'audio',
        content: url,
        x: 100, y: 100, width: 300, height: 100,
        rotation: 0, opacity: 1, volume: 1,
        startTime: 0, endTime: Math.max(0, duration),
        animationIn: 'none', animationOut: 'none', easing: 'linear',
        trackColor: getRandomColor()
      });
      setIsOpen(false);
    }
  };

  const handleAddPlaceholder = () => {
    const cw = canvasAspectRatio === '16/9' ? 1920 : canvasAspectRatio === '9/16' ? 1080 : 1080;
    const ch = canvasAspectRatio === '16/9' ? 1080 : canvasAspectRatio === '9/16' ? 1920 : canvasAspectRatio === '4/5' ? 1350 : 1080;
    
    const placeholderDefaults = defaults.placeholder || { mediaDimness: 0.5, animationIn: 'fade', animationOut: 'fade', mediaEffect: 'none' };
    
    addElement({
      id: uuidv4(),
      type: 'image',
      content: '',
      x: 0,
      y: 0,
      width: cw,
      height: ch,
      rotation: 0,
      opacity: 1,
      mediaDimness: placeholderDefaults.mediaDimness,
      startTime: 0,
      endTime: Math.max(0, duration),
      animationIn: placeholderDefaults.animationIn as any,
      animationOut: placeholderDefaults.animationOut as any,
      easing: 'ease-in-out',
      trackColor: getRandomColor(),
      isPlaceholder: true,
      mediaEffect: placeholderDefaults.mediaEffect,
    });
    setIsOpen(false);
  };

  const allFonts = Array.from(new Set([...customFonts, ...STANDARD_FONTS]));
  const filteredFonts = fontSearch ? allFonts.filter(f => f.toLowerCase().includes(fontSearch.toLowerCase())) : allFonts;

  const handleSliderStart = () => {
    setIsDraggingSlider(true);
    
    // Snap to nearest text element in time
    const textElements = elements.filter(e => e.type === 'text' || e.type === 'caption');
    if (textElements.length > 0) {
      let closestText = textElements[0];
      let minDistance = Infinity;
      
      textElements.forEach(el => {
        let distance;
        if (currentTime >= el.startTime && currentTime <= el.endTime) {
           distance = 0;
        } else {
           distance = Math.min(Math.abs(currentTime - el.startTime), Math.abs(currentTime - el.endTime));
        }
        if (distance < minDistance) {
           minDistance = distance;
           closestText = el;
        }
      });
      
      // Jump to center of the closest text element
      setCurrentTime(closestText.startTime + (closestText.endTime - closestText.startTime) / 2);
    }
  };

  const handleSliderEnd = () => {
    setIsDraggingSlider(false);
  };


  return (
    
    <>
      <AnimatePresence>
        {isOpen && (
          
    <>
          <div className="fixed inset-0 z-[140]" onClick={() => setIsOpen(false)} />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-[100%] right-0 mb-4 z-[150] flex flex-col justify-end items-end origin-bottom-right"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`transition-all duration-300 flex flex-col max-h-[60vh] sm:max-h-[420px] w-[92vw] max-w-[360px] select-none ${isDraggingSlider ? "overflow-visible" : "glass-panel rounded-[24px] overflow-hidden"}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Active Submenu Header (Fixed outside scroll area) */}
              {activeSubMenu !== 'main' && (
                <div className={`shrink-0 flex items-center justify-between px-4 py-3 bg-panel-bg/90 border-b border-panel-border/50 rounded-t-[24px] z-20 transition-opacity duration-300 ${isDraggingSlider ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                  <button 
                    onClick={() => setActiveSubMenu('main')}
                    className="flex items-center gap-1 text-xs font-semibold text-[var(--color-accent)] hover:underline"
                  >
                    <ChevronLeft size={16} />
                    <span>Back to Menu</span>
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-text-main capitalize">
                      {activeSubMenu === 'font' && 'Global Font'}
                      {activeSubMenu === 'effect' && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Choose Global Effect</span>
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {[
                  { value: 'none', label: 'None' },
                  { value: 'typewriter', label: 'Typewriter' },
                  { value: 'bounce', label: 'Bounce' },
                  { value: 'pulse', label: 'Pulse' },
                  { value: 'shake', label: 'Shake' },
                  { value: 'neon', label: 'Neon Glow' },
                  { value: 'glitch', label: 'Glitch' },
                  { value: 'fade-slide', label: 'Fade & Slide' },
                ].map(eff => (
                  <button
                    key={eff.value}
                    onClick={() => {
                      applyGlobalTextEffect(eff.value);
                      addToast('Applied global text effect', 'success');
                      setActiveSubMenu('main');
                    }}
                    className="p-2 bg-button-bg hover:bg-button-hover text-left text-xs font-medium rounded-lg text-text-main transition-colors border border-transparent hover:border-[var(--color-accent)]"
                  >
                    {eff.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSubMenu === 'background' && 'Canvas Background'}
                      {activeSubMenu === 'export' && 'Export Video'}
                      {activeSubMenu === 'settings' && 'Settings'}
                      {activeSubMenu === 'effect' && 'Global Text Effect'}
                    </span>
                    <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-[var(--color-accent)] transition-colors p-1" title="Close Menu">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Main Menu Header (Fixed outside scroll area) */}
              {activeSubMenu === 'main' && (
                <div className={`shrink-0 flex items-center px-4 pt-4 pb-3 bg-panel-bg/90 rounded-t-[24px] z-20 border-b border-panel-border/50 transition-opacity duration-300 ${isDraggingSlider ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                  <div className="flex-1 flex items-center gap-2 bg-button-bg/80 p-1.5 rounded-xl border border-panel-border">

                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider pl-1.5 shrink-0">Ratio:</span>
                    <select 
                      value={canvasAspectRatio} 
                      onChange={(e) => setCanvasAspectRatio(e.target.value)}
                      className="appearance-none bg-button-bg border border-panel-border rounded-lg w-full text-center h-7 text-xs font-semibold text-text-main outline-none focus:border-[var(--color-accent)] cursor-pointer hover:bg-button-hover transition-colors px-2"
                    >
                      <option value="9/16">9:16 Portrait (Reels/Shorts)</option>
                      <option value="16/9">16:9 Landscape (YouTube)</option>
                      <option value="1/1">1:1 Square (Feed)</option>
                      <option value="4/5">4:5 Vertical (Instagram)</option>
                    </select>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="ml-3 shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-button-bg hover:bg-button-hover border border-panel-border transition-colors text-text-muted hover:text-text-main" title="Close Menu">
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Scrollable Content Area */}
              <div className={`flex-1 overflow-x-hidden custom-scrollbar p-4 transition-all duration-300 ${isDraggingSlider ? "overflow-y-visible" : "overflow-y-auto"}`}>
                
                {/* MAIN MENU VIEW */}
                {activeSubMenu === 'main' && (
                  <div className="flex flex-col gap-2.5">
                    
                    {/* Tools Section */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Tools</span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                        <button 
                          onClick={() => { setShowScriptModal(true, 'generate'); setIsOpen(false); }}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Generate Video Script"
                        >
                          <Sparkles size={18} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Gen Script</span>
                        </button>

                        <button 
                          onClick={() => { setShowPlaceholderGallery(true); setIsOpen(false); }}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Manage Media Placeholders"
                        >
                          <ImageIcon size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Placeholders</span>
                        </button>

                        <button 
                          onClick={() => { setShowScriptModal(true, 'paste'); setIsOpen(false); }}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Paste Script Code"
                        >
                          <Terminal size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Paste Script</span>
                        </button>

                        <button 
                          onClick={() => { setShowGlobalTTSModal(true); setIsOpen(false); }}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Global Text-to-Speech"
                        >
                          <Mic size={18} className="text-rose-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">TTS Voice</span>
                        </button>

                        <button 
                          onClick={() => { setShowGlobalTranslateModal(true); setIsOpen(false); }}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Global Translation"
                        >
                          <Globe size={18} className="text-sky-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Translate</span>
                        </button>

                        <button 
                          onClick={() => { setShowTextGallery(true); setIsOpen(false); }}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Manage Text Blocks"
                        >
                          <Type size={18} className="text-pink-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Text Gallery</span>
                        </button>
                      </div>
                    </div>

                    {/* Add Section */}{/* Add Section */}
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Add</span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                  <button 
                    onClick={handleAddText}
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                    title="Add Text Block"
                  >
                    <Type size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Text</span>
                  </button>
                  
                  <button 
                    onClick={() => handleAddShape('circle')}
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                    title="Add Circle"
                  >
                    <Circle size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Circle</span>
                  </button>
                  
                  <button 
                    onClick={() => handleAddShape('rectangle')}
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                    title="Add Rectangle"
                  >
                    <Square size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Rectangle</span>
                  </button>
                  
                  <label 
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 cursor-pointer group"
                    title="Upload Image"
                  >
                    <ImageIcon size={18} className="group-hover:scale-110 transition-transform text-indigo-400" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                      onChange={handleAddImage} 
                    />
                  </label>

                  <label 
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 cursor-pointer group"
                    title="Upload Background Music / Audio"
                  >
                    <Music size={18} className="group-hover:scale-110 transition-transform text-pink-400" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Music</span>
                    <input 
                      type="file" 
                      accept="audio/*" 
                      className="hidden" 
                      onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                      onChange={handleAddMusic} 
                    />
                  </label>
                </div>
              </div>
              {/* Export Section */}
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Export</span>
                <ExportButton />
              </div>
            </div>
          )}

          {/* FONT SUBMENU VIEW */}
          {activeSubMenu === 'font' && (
            <div className="flex flex-col gap-2.5">
              <div className={`flex flex-col gap-1.5 p-4 rounded-xl border transition-all duration-300 ${isDraggingSlider ? 'bg-panel-bg  border-panel-border shadow-2xl scale-110 -translate-y-6 sm:-translate-x-12 z-50' : 'bg-[var(--theme-input-bg)] border-panel-border'}`}>
                <ThickSlider 
                  label="Global Font Size" 
                  value={globalTextScale} 
                  min={0.5} 
                  max={3} 
                  step={0.1} 
                  onChange={setGlobalTextScale} 
                  onChangeStart={handleSliderStart}
                  onChangeEnd={handleSliderEnd}
                  unit="x"
                />
              </div>
              <div className={`flex flex-col gap-2.5 transition-opacity duration-300 ${isDraggingSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <input 
                type="text" 
                placeholder="Search fonts..." 
                value={fontSearch}
                onChange={(e) => setFontSearch(e.target.value)}
                className="w-full bg-button-bg border border-panel-border rounded-xl px-3 py-1.5 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-[var(--color-accent)] mt-1"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a Google Font name..."
                  className="flex-1 bg-button-bg border border-panel-border rounded-xl px-3 py-1.5 text-xs text-text-main outline-none focus:border-[var(--color-accent)]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = e.currentTarget.value.trim();
                      if (val) {
                         const newFonts = Array.from(new Set([...customFonts, val]));
                         setCustomFonts(newFonts);
                         import(`idb-keyval`).then(({ set }) => {
                           set('custom-font:' + val, true);
                         });
                         applyGlobalFont(val);
                         addToast('Added custom font: ' + val, 'success');
                         e.currentTarget.value = '';
                      }
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto custom-scrollbar pr-0.5">
                {filteredFonts.map((font) => (
                  <button
                    key={font}
                    onClick={() => {
                      applyGlobalFont(font);
                      addToast(`Applied font "${font}" to project text`, 'success');
                      setActiveSubMenu('main');
                    }}
                    className={`flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors font-medium text-left ${
                      defaults.text.fontFamily === font 
                        ? 'bg-[var(--color-accent)] text-white font-bold' 
                        : 'text-text-main hover:bg-button-hover bg-button-bg/40'
                    }`}
                  >
                    <span style={{ fontFamily: `"${font}", sans-serif` }}>{font}</span>
                    <span className="text-[10px] opacity-70">Sample</span>
                  </button>
                ))}
              </div>
            </div>
            </div>
          )}

          {/* BACKGROUND SUBMENU VIEW */}
          {activeSubMenu === 'background' && (
            <div className="flex flex-col gap-1 max-h-[260px] overflow-y-auto custom-scrollbar pr-0.5">
              {BACKGROUND_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setBackgroundType(opt.value as any);
                    addToast(`Background changed to ${opt.label}`, 'success');
                    setActiveSubMenu('main');
                  }}
                  className={`flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors font-medium text-left ${
                    backgroundType === opt.value 
                      ? 'bg-[var(--color-accent)] text-white font-bold' 
                      : 'text-text-main hover:bg-button-hover bg-button-bg/40'
                  }`}
                >
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* SPEED / TIME SCALE SUBMENU VIEW */}
          {activeSubMenu === 'speed' && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-text-muted">Scale all element timings and video duration together:</span>
              <div className="flex flex-col gap-1">
                {SPEED_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      scaleTimeline(preset.value);
                      addToast(`Scaled timeline speed by ${preset.value}x`, 'success');
                      setActiveSubMenu('main');
                    }}
                    className="flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors font-medium text-left bg-button-bg/40 hover:bg-button-hover text-text-main"
                  >
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUICK SETTINGS SUBMENU VIEW */}
          {activeSubMenu === 'prompts' && (
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { setShowScriptModal(true, 'generate'); setIsOpen(false); }}
                className="flex items-center gap-3 p-3 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
                  <Sparkles size={16} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-text-main group-hover:text-[var(--color-accent)] transition-colors">Video Script Prompt</span>
                  <span className="text-[10px] text-text-muted">Generate a script timeline for ChatGPT</span>
                </div>
              </button>

              <button 
                onClick={() => { setShowPlaceholderGallery(true); setIsOpen(false); }}
                className="flex items-center gap-3 p-3 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0">
                  <ImagePlus size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-text-main group-hover:text-amber-400 transition-colors">Media Placeholders</span>
                  <span className="text-[10px] text-text-muted">Generate images for canvas placeholders</span>
                </div>
              </button>
            </div>
          )}

          {activeSubMenu === 'settings' && (
            <div className="flex flex-col gap-3">
              <div className={`flex flex-col gap-3 transition-opacity duration-300 ${isDraggingSlider ? 'opacity-0 hidden' : 'opacity-100'}`}>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-text-muted uppercase font-semibold">App Theme</label>
                <div className="flex bg-button-bg border border-panel-border rounded-lg overflow-hidden p-0.5">
                  <button 
                    onClick={() => setUiTheme('light')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${uiTheme === 'light' ? 'bg-panel-bg text-text-main shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}`}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => setUiTheme('dark')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${uiTheme === 'dark' ? 'bg-panel-bg text-text-main shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}`}
                  >
                    Dark
                  </button>
                  <button 
                    onClick={() => setUiTheme('black')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${uiTheme === 'black' ? 'bg-panel-bg text-text-main shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}`}
                  >
                    OLED
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-text-muted uppercase font-semibold">Grid Overlay</label>
                <select 
                  value={gridOverlay} 
                  onChange={(e) => setGridOverlay(e.target.value as any)}
                  className="bg-button-bg border border-panel-border rounded-lg px-2 py-1.5 text-xs text-text-main outline-none focus:border-[var(--color-accent)] cursor-pointer"
                >
                  <option value="none">None</option>
                  <option value="small">Small Grid</option>
                  <option value="large">Large Grid</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-text-muted uppercase font-semibold">Keylight Direction</label>
                <select 
                  value={keylightType} 
                  onChange={(e) => setKeylightType(e.target.value as any)}
                  className="bg-button-bg border border-panel-border rounded-lg px-2 py-1.5 text-xs text-text-main outline-none focus:border-[var(--color-accent)] cursor-pointer"
                >
                  <option value="none">None</option>
                  <option value="up">Bottom-Up</option>
                  <option value="down">Top-Down</option>
                </select>
              </div>

              </div>
              <div className={`flex flex-col gap-1 transition-all duration-300 p-4 rounded-xl ${isDraggingSlider ? 'glass-panel-heavy shadow-2xl scale-110 -translate-y-6 sm:-translate-x-12 z-50' : ''}`}>
                <ThickSlider 
                  label="Global Text Scale" 
                  value={globalTextScale} 
                  min={0.1} 
                  max={3} 
                  step={0.05} 
                  onChange={setGlobalTextScale} 
                  onChangeStart={handleSliderStart}
                  onChangeEnd={handleSliderEnd}
                  unit="x"
                />
              </div>
              <div className={`flex flex-col gap-3 transition-opacity duration-300 ${isDraggingSlider ? 'opacity-0 hidden' : 'opacity-100'}`}>

              {backgroundAudioUrl && (
                <div className="flex flex-col gap-1 border-t border-panel-border pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-text-muted uppercase font-semibold">BGM Volume</label>
                    <span className="text-[10px] font-mono text-text-main">{Math.round(backgroundAudioVolume * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.05"
                    value={backgroundAudioVolume} 
                    onChange={(e) => setBackgroundAudioVolume(parseFloat(e.target.value))}
                    className="w-full accent-[var(--color-accent)]"
                  />
                </div>
              )}

              <div className="pt-1 flex flex-col gap-1.5">
                <button 
                  onClick={() => {
                    applyDefaultsToProject();
                    addToast('Applied current defaults to project elements', 'success');
                  }} 
                  className="w-full bg-[var(--color-accent)] hover:opacity-90 text-white px-3 py-2 rounded-xl font-semibold transition-all shadow-sm text-xs flex items-center justify-center gap-2"
                >
                  Apply Defaults to Current Elements
                </button>

                <button 
                  onClick={() => {
                    setShowSettings(true);
                    setIsOpen(false);
                  }}
                  className="text-xs text-text-muted hover:text-text-main text-center w-full py-1"
                >
                  Open Full Settings
                </button>
              </div>
              </div> {/* Close hiding wrapper */}
            </div>
          )}

            </div> {/* Close Scrollable Area */}
            </motion.div>
            </motion.div>
              </>

        )}
      </AnimatePresence>

      <div className="relative flex items-center justify-center z-[70]">
        <button 
          onClick={toggleOpen} 
          className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden ${isOpen ? 'bg-[var(--color-accent)] text-white' : 'bg-text-main text-app-bg'}`}
          title="Tools & Add Menu"
        >
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
            <Wand2 size={24} />
          </div>
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}>
            <X size={24} />
          </div>
        </button>
      </div>
        </>

  );
}


