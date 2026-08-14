import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Type, Image as ImageIcon, Square, Circle, Plus, Terminal, Sparkles, 
  Settings, LayoutTemplate, Mic, Globe, ImagePlus, Palette, FastForward, 
  ChevronLeft, Music, X, Wand2
, Layers, Activity } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ExportButton } from './ExportButton';
import { motion, AnimatePresence } from 'motion/react';
import { ThickSlider } from './ThickSlider';
import { CustomSelect } from './CustomSelect';

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
  const updateDefaults = useStore((state) => state.updateDefaults);
  const setShowScriptModal = useStore((state) => state.setShowScriptModal);
  const setShowGlobalTTSModal = useStore((state) => state.setShowGlobalTTSModal);
  const setShowGlobalTranslateModal = useStore((state) => state.setShowGlobalTranslateModal);
  const setShowPlaceholderGallery = useStore((state) => state.setShowPlaceholderGallery);
  const setShowTextGallery = useStore((state) => state.setShowTextGallery);
  const setShowSettings = useStore((state) => state.setShowSettings);
  const addToast = useStore((state) => state.addToast);

  // Zustand Store Actions & Settings
  const gridOverlay = useStore((state) => state.gridOverlay);
  const gridColor = useStore((state) => state.gridColor);
  const setGridColor = useStore((state) => state.setGridColor);
  const postProcessingFx = useStore((state) => state.postProcessingFx);
  const setPostProcessingFx = useStore((state) => state.setPostProcessingFx);
  const uiTheme = useStore((state) => state.uiTheme);
  const setUiTheme = useStore((state) => state.setUiTheme);
  const setGridOverlay = useStore((state) => state.setGridOverlay);
  const keylightType = useStore((state) => state.keylightType);
  const keylightColor = useStore((state) => state.keylightColor);
  const setKeylightColor = useStore((state) => state.setKeylightColor);
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
              className={`transition-all duration-300 flex flex-col max-h-[60vh] sm:max-h-[420px] w-[92vw] max-w-[360px] select-none ${isDraggingSlider ? "overflow-visible" : "glass-panel rounded-[24px] border float-border shadow-none overflow-hidden"}`}
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
                      {activeSubMenu === 'effect' && 'Global Text Effect'}
                      {activeSubMenu === 'background' && 'Canvas Background'}
                      {activeSubMenu === 'export' && 'Export Video'}
                      {activeSubMenu === 'settings' && 'Settings'}
                      {activeSubMenu === 'defaultText' && 'Text Defaults'}
                      {activeSubMenu === 'defaultImage' && 'Image Defaults'}
                      {activeSubMenu === 'defaultShape' && 'Shape Defaults'}
                      {activeSubMenu === 'defaultPlaceholder' && 'Placeholder Defaults'}
                      {activeSubMenu === 'aspectRatio' && 'Aspect Ratio'}
                      {activeSubMenu === 'overlay' && 'Overlays'}
                      {activeSubMenu === 'speed' && 'Transition Settings'}
                      {activeSubMenu === 'prompts' && 'AI Scripts'}
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
                    <button 
                      onClick={() => setActiveSubMenu('aspectRatio')}
                      className="bg-button-bg border border-panel-border rounded-lg w-full text-center h-7 text-xs font-semibold text-text-main hover:bg-button-hover hover:border-[var(--color-accent)] transition-all px-2 flex items-center justify-center gap-2"
                    >
                      {canvasAspectRatio === '9/16' ? '9:16 Portrait' : canvasAspectRatio === '16/9' ? '16:9 Landscape' : canvasAspectRatio === '1/1' ? '1:1 Square' : '4:5 Vertical'}
                    </button>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="ml-3 shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-button-bg hover:bg-button-hover border border-panel-border transition-colors text-text-muted hover:text-text-main" title="Close Menu">
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Scrollable Content Area */}
              <div className={`flex-1 overflow-x-hidden custom-scrollbar p-4 transition-all duration-300 ${isDraggingSlider ? "overflow-y-visible" : "overflow-y-auto"}`}>
                
                
          {activeSubMenu === 'effect' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Choose Global Effect</span>
              <div className="grid grid-cols-2 gap-2">
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
                    className="p-2 bg-button-bg hover:bg-button-hover text-left text-xs font-medium rounded-xl text-text-main transition-colors border border-transparent hover:border-[var(--color-accent)]"
                  >
                    {eff.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {activeSubMenu === 'aspectRatio' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Canvas Aspect Ratio</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: '9/16', label: '9:16 Portrait', desc: 'Reels, Shorts' },
                  { value: '16/9', label: '16:9 Landscape', desc: 'YouTube' },
                  { value: '1/1', label: '1:1 Square', desc: 'Feed' },
                  { value: '4/5', label: '4:5 Vertical', desc: 'Instagram' }
                ].map(ratio => (
                  <button
                    key={ratio.value}
                    onClick={() => {
                      setCanvasAspectRatio(ratio.value as any);
                      setActiveSubMenu('main');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${canvasAspectRatio === ratio.value ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)] text-[var(--color-accent)]' : 'bg-button-bg border-panel-border text-text-main hover:border-[var(--color-accent)]/50'}`}
                  >
                    <span className="font-bold text-sm">{ratio.label}</span>
                    <span className="text-[10px] opacity-70">{ratio.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

                                {/* MAIN MENU VIEW */}
                {activeSubMenu === 'main' && (
                  <div className="flex flex-col gap-3">
                    
                    {/* Tools Section */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Tools</span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                        <button 
                          onClick={() => setActiveSubMenu('speed')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Transition Settings"
                        >
                          <Activity size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Transition</span>
                        </button>
                        <button 
                          onClick={() => setActiveSubMenu('background')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Background Settings"
                        >
                          <ImageIcon size={18} className="text-sky-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Backdrop</span>
                        </button>
                        <button 
                          onClick={() => setActiveSubMenu('overlay')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Overlay Settings"
                        >
                          <Layers size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Overlays</span>
                        </button>

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
              
                    
                    
                    {/* Default Settings Section */}
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Element Defaults (Quick Settings)</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        <button 
                          onClick={() => setActiveSubMenu('defaultText')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                        >
                          <Type size={18} className="text-pink-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Text</span>
                        </button>
                        <button 
                          onClick={() => setActiveSubMenu('defaultImage')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                        >
                          <ImageIcon size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Image</span>
                        </button>
                        <button 
                          onClick={() => setActiveSubMenu('defaultShape')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                        >
                          <Square size={18} className="text-orange-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Shape</span>
                        </button>
                        <button 
                          onClick={() => setActiveSubMenu('defaultPlaceholder')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                        >
                          <LayoutTemplate size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Placeholder</span>
                        </button>
                      </div>
                    </div>

                    {/* Settings & Export Section */}
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Settings & Export</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button 
                          onClick={() => setActiveSubMenu('settings')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Quick Settings"
                        >
                          <Settings size={18} className="text-stone-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Settings</span>
                        </button>
                        <div className="col-span-1">
                          <ExportButton />
                        </div>
                      </div>
                    </div>

            </div>
          )}

          {/* FONT SUBMENU VIEW */}
          {activeSubMenu === 'font' && (
            <div className="flex flex-col gap-3">

              <div className={`flex flex-col gap-1.5 p-4 rounded-xl border transition-all duration-300 ${isDraggingSlider ? 'bg-panel-bg  border-panel-border  scale-110 -translate-y-6 sm:-translate-x-12 z-50' : 'bg-[var(--theme-input-bg)] border-panel-border'}`}>
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
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Canvas Background</span>
              <div className="flex flex-col gap-1.5">

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
            </div>
          )}

          {/* SPEED / TIME SCALE SUBMENU VIEW */}
          {activeSubMenu === 'speed' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Transition Speed</span>
              <p className="text-[10px] text-text-muted px-1 -mt-1 leading-tight">Scale all element timings and video duration together.</p>
              <div className="flex flex-col gap-1.5">

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
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">AI Scripts</span>
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
            </div>
          )}

          
          {activeSubMenu === 'overlay' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Canvas Overlays</span>
              <div className="flex flex-col gap-5">
              
              <div className="flex flex-col gap-3">
                <label className="text-[10px] text-text-muted uppercase font-semibold px-1">Grid Overlay</label>
                <div className="flex bg-button-bg border border-panel-border rounded-lg overflow-hidden p-0.5">
                  <button 
                    onClick={() => setGridOverlay('none')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${gridOverlay === 'none' ? 'bg-panel-bg text-text-main  border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}`}
                  >None</button>
                  <button 
                    onClick={() => setGridOverlay('small')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${gridOverlay === 'small' ? 'bg-panel-bg text-text-main  border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}`}
                  >Small</button>
                  <button 
                    onClick={() => setGridOverlay('large')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${gridOverlay === 'large' ? 'bg-panel-bg text-text-main  border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}`}
                  >Large</button>
                </div>
                {gridOverlay !== 'none' && (
                  <div className="flex flex-col gap-2 p-3 bg-panel-bg/50 border border-panel-border rounded-xl">
                    <label className="text-[10px] text-text-muted uppercase font-semibold">Grid Color</label>
                    <div className="flex flex-wrap gap-2 items-center">
                      {['#ffffff', '#000000', '#ff3366', '#33ccff', '#cc33ff', '#33ff99', '#ffcc00'].map(c => (
                        <button key={'grid-'+c} onClick={() => setGridColor(c)} className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${gridColor === c ? 'border-[var(--color-accent)] ' : 'border-transparent '}`} style={{backgroundColor: c}} title={c} />
                      ))}
                      <label className="w-7 h-7 rounded-full relative overflow-hidden cursor-pointer  border-2 border-transparent hover:scale-110 transition-transform flex items-center justify-center bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 ml-1">
                        <input type="color" value={gridColor} onChange={(e) => setGridColor(e.target.value)} className="absolute opacity-0 inset-0 w-full h-full cursor-pointer" title="Custom Color" />
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="w-full h-px bg-panel-border/50"></div>
              
              <div className="flex flex-col gap-3">
                <label className="text-[10px] text-text-muted uppercase font-semibold px-1">Keylight</label>
                <div className="flex bg-button-bg border border-panel-border rounded-lg overflow-hidden p-0.5">
                  <button 
                    onClick={() => setKeylightType('none')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${keylightType === 'none' ? 'bg-panel-bg text-text-main  border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}`}
                  >None</button>
                  <button 
                    onClick={() => setKeylightType('up')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${keylightType === 'up' ? 'bg-panel-bg text-text-main  border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}`}
                  >Bottom-Up</button>
                  <button 
                    onClick={() => setKeylightType('down')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${keylightType === 'down' ? 'bg-panel-bg text-text-main  border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}`}
                  >Top-Down</button>
                </div>
                {keylightType !== 'none' && (
                  <div className="flex flex-col gap-2 p-3 bg-panel-bg/50 border border-panel-border rounded-xl">
                    <label className="text-[10px] text-text-muted uppercase font-semibold">Keylight Color</label>
                    <div className="flex flex-wrap gap-2 items-center">
                      {['#ffffff', '#000000', '#ff3366', '#33ccff', '#cc33ff', '#33ff99', '#ffcc00'].map(c => (
                        <button key={'keylight-'+c} onClick={() => setKeylightColor(c)} className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${keylightColor === c ? 'border-[var(--color-accent)] ' : 'border-transparent '}`} style={{backgroundColor: c}} title={c} />
                      ))}
                      <label className="w-7 h-7 rounded-full relative overflow-hidden cursor-pointer  border-2 border-transparent hover:scale-110 transition-transform flex items-center justify-center bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 ml-1">
                        <input type="color" value={keylightColor} onChange={(e) => setKeylightColor(e.target.value)} className="absolute opacity-0 inset-0 w-full h-full cursor-pointer" title="Custom Color" />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full h-px bg-panel-border/50"></div>

              <div className="flex flex-col gap-3 pb-2">
                <label className="text-[10px] text-text-muted uppercase font-semibold px-1">Post-Processing FX</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'none', label: 'None' },
                    { value: 'crt', label: 'CRT Scanlines' },
                    { value: 'vhs', label: 'VHS Glitch' },
                    { value: 'noise', label: 'Static Noise' }
                  ].map(fx => (
                    <button 
                      key={fx.value}
                      onClick={() => setPostProcessingFx(fx.value as any)}
                      className={`p-2 text-xs font-semibold rounded-xl border transition-all ${postProcessingFx === fx.value ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)] text-[var(--color-accent)]' : 'bg-button-bg text-text-main border-panel-border hover:border-[var(--color-accent)]/50 hover:bg-button-hover'}`}
                    >
                      {fx.label}
                    </button>
                  ))}
                </div>
              </div>

              </div>
            </div>
          )}
          
          
          {['defaultText', 'defaultImage', 'defaultShape', 'defaultPlaceholder'].includes(activeSubMenu) && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">
                {activeSubMenu === 'defaultText' && 'Text Element Defaults'}
                {activeSubMenu === 'defaultImage' && 'Image Element Defaults'}
                {activeSubMenu === 'defaultShape' && 'Shape Element Defaults'}
                {activeSubMenu === 'defaultPlaceholder' && 'Placeholder Defaults'}
              </span>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">In Animation</label>
                <CustomSelect 
                  value={defaults[activeSubMenu.replace('default', '').toLowerCase()]?.animationIn || 'none'} 
                  onChange={(val) => updateDefaults(activeSubMenu.replace('default', '').toLowerCase() as any, { animationIn: val }
          )}
                  options={[
                    { value: 'none', label: 'None' },
                    { value: 'fade', label: 'Fade' },
                    { value: 'slide', label: 'Slide' },
                    { value: 'scale', label: 'Scale' },
                    { value: 'fade-slide', label: 'Fade & Slide' },
                    { value: 'fade-slide-up', label: 'Fade & Slide Up' },
                    { value: 'zoom-in', label: 'Zoom In' },
                    { value: 'fade-zoom-in', label: 'Fade & Zoom In' },
                    { value: 'fade-zoom-out', label: 'Fade & Zoom Out' },
                    ...(activeSubMenu === 'defaultText' ? [{ value: 'typewriter', label: 'Write Out (Typewriter)' }, { value: 'fly-in', label: 'Fly In (Bounce)' }] : [])
                  ]}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Out Animation</label>
                <CustomSelect 
                  value={defaults[activeSubMenu.replace('default', '').toLowerCase()]?.animationOut || 'none'} 
                  onChange={(val) => updateDefaults(activeSubMenu.replace('default', '').toLowerCase() as any, { animationOut: val })}
                  options={[
                    { value: 'none', label: 'None' },
                    { value: 'fade', label: 'Fade' },
                    { value: 'slide', label: 'Slide' },
                    { value: 'scale', label: 'Scale' },
                    { value: 'fade-slide', label: 'Fade & Slide' },
                    { value: 'fade-slide-up', label: 'Fade & Slide Up' },
                    { value: 'zoom-out', label: 'Zoom Out' },
                    { value: 'fade-zoom-in', label: 'Fade & Zoom In' },
                    { value: 'fade-zoom-out', label: 'Fade & Zoom Out' }
                  ]}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Easing</label>
                <CustomSelect 
                  value={defaults[activeSubMenu.replace('default', '').toLowerCase()]?.easing || 'linear'} 
                  onChange={(val) => updateDefaults(activeSubMenu.replace('default', '').toLowerCase() as any, { easing: val })}
                  options={[
                    { value: 'linear', label: 'Linear' },
                    { value: 'ease-in', label: 'Ease In' },
                    { value: 'ease-out', label: 'Ease Out' },
                    { value: 'ease-in-out', label: 'Ease In Out' }
                  ]}
                />
              </div>
              {activeSubMenu === 'defaultText' && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Font Family</label>
                    <CustomSelect 
                      value={defaults.text?.fontFamily || 'Inter'} 
                      onChange={(val) => updateDefaults('text', { fontFamily: val })}
                      options={STANDARD_FONTS.map(f => ({ value: f, label: f }))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Default Text Effect</label>
                    <CustomSelect 
                      value={defaults.text?.textEffect || 'none'} 
                      onChange={(val) => updateDefaults('text', { textEffect: val })}
                      options={[
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
                      ]}
                    />
                    <label className="text-[10px] text-text-muted uppercase font-semibold mb-1 mt-1">Effect Stack 2</label>
                    <CustomSelect 
                      value={defaults.text?.textEffect2 || 'none'} 
                      onChange={(val) => updateDefaults('text', { textEffect2: val })}
                      options={[
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
                      ]}
                    />
                    <label className="text-[10px] text-text-muted uppercase font-semibold mb-1 mt-1">Effect Stack 3</label>
                    <CustomSelect 
                      value={defaults.text?.textEffect3 || 'none'} 
                      onChange={(val) => updateDefaults('text', { textEffect3: val })}
                      options={[
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
                      ]}
                    />
                  </div>
                </>
              )}
              {(activeSubMenu === 'defaultImage' || activeSubMenu === 'defaultShape' || activeSubMenu === 'defaultPlaceholder') && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Continuous Effect</label>
                  <CustomSelect 
                    value={defaults[activeSubMenu.replace('default', '').toLowerCase()]?.mediaEffect || 'none'} 
                    onChange={(val) => updateDefaults(activeSubMenu.replace('default', '').toLowerCase() as any, { mediaEffect: val })}
                    options={[
                      { value: 'none', label: 'None' },
                      { value: 'parallax-zoom-in', label: 'Parallax Zoom In' },
                      { value: 'parallax-zoom-out', label: 'Parallax Zoom Out' }
                    ]}
                  />
                </div>
              )}
            </div>
          )}

          {activeSubMenu === 'settings' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Quick Settings</span>

              <div className={`flex flex-col gap-3 transition-opacity duration-300 ${isDraggingSlider ? 'opacity-0 hidden' : 'opacity-100'}`}>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-text-muted uppercase font-semibold">App Theme</label>
                <div className="flex bg-button-bg border border-panel-border rounded-lg overflow-hidden p-0.5">
                  <button 
                    onClick={() => setUiTheme('light')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${uiTheme === 'light' ? 'bg-panel-bg text-text-main  border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}`}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => setUiTheme('dark')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${uiTheme === 'dark' ? 'bg-panel-bg text-text-main  border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}`}
                  >
                    Dark
                  </button>
                  <button 
                    onClick={() => setUiTheme('black')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${uiTheme === 'black' ? 'bg-panel-bg text-text-main  border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}`}
                  >
                    OLED
                  </button>
                </div>
              </div>

              

              </div>
              <div className={`flex flex-col gap-1 transition-all duration-300 p-4 rounded-xl ${isDraggingSlider ? 'glass-panel-heavy  scale-110 -translate-y-6 sm:-translate-x-12 z-50' : ''}`}>
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
                  className="w-full bg-[var(--color-accent)] hover:opacity-90 text-white px-3 py-2 rounded-xl font-semibold transition-all  text-xs flex items-center justify-center gap-2"
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
              
              </div>
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
          className={`relative w-11 h-11 rounded-full flex items-center justify-center  hover:scale-105 active:scale-95 transition-all overflow-hidden ${isOpen ? 'bg-[var(--color-accent)] text-white' : 'bg-text-main text-app-bg border float-border'}`}
          title="Tools & Add Menu"
        >
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
            <Plus size={20} strokeWidth={2.5} />
          </div>
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}>
            <X size={20} />
          </div>
        </button>
      </div>
        </>

  );
}


