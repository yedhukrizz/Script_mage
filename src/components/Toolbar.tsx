import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Type, Image as ImageIcon, Square, Circle, Plus, Terminal, Sparkles, Settings, LayoutTemplate, Mic, Globe, ImagePlus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { BackgroundQuickSelect } from './BackgroundQuickSelect';
import { FontQuickSelect } from './FontQuickSelect';
import { TimeScaleQuickSelect } from './TimeScaleQuickSelect';
import { SettingsQuickSelect } from './SettingsQuickSelect';
import { ExportButton } from './ExportButton';
import { Music } from 'lucide-react';

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
  const setShowSettings = useStore((state) => state.setShowSettings);
  const [isOpen, setIsOpen] = useState(false);

  const getCenteredProps = (elementAspectRatio: number = 1) => {
    const cw = canvasAspectRatio === '16/9' ? 1920 : canvasAspectRatio === '9/16' ? 1080 : 1080;
    const ch = canvasAspectRatio === '16/9' ? 1080 : canvasAspectRatio === '9/16' ? 1920 : canvasAspectRatio === '4/5' ? 1350 : 1080;
    
    // 30% of canvas width or height depending on aspect ratio
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
    const height = 400; // Enough for 2-3 lines at size 120
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
        x: 100, y: 100, width: 300, height: 100, // Small box just to be selectable
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
      opacity: 1, // Global dimness is via mediaDimness
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

  return (
    <div className="absolute right-6 bottom-6 flex flex-col-reverse items-center gap-3 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-14 h-14 bg-text-main text-app-bg rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all ${isOpen ? 'rotate-45' : 'rotate-0'}`}
      >
        <Plus size={24} />
      </button>

      {isOpen && (
        <div className="bg-button-bg border border-panel-border p-2 rounded-2xl shadow-2xl mb-2 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-200">
          <div className="flex flex-col gap-1 w-full relative group/tools mb-1 px-1">
             <select 
               value={canvasAspectRatio} 
               onChange={(e) => setCanvasAspectRatio(e.target.value)}
               className="appearance-none bg-button-bg border border-panel-border rounded-xl w-full text-center h-10 text-xs font-medium text-text-main outline-none focus:border-panel-border flex-shrink-0 cursor-pointer hover:bg-button-hover transition-colors"
             >
               <option value="9/16">9:16 Portrait</option>
               <option value="16/9">16:9 Landscape</option>
               <option value="1/1">1:1 Square</option>
               <option value="4/5">4:5 Vertical</option>
             </select>
          </div>
          
          <div className="grid grid-cols-2 gap-1 w-full relative group/tools">
            <SettingsQuickSelect />
            <ExportButton className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold" iconSize={20} />
            
            <TimeScaleQuickSelect />
            <button 
              onClick={() => {
                setShowScriptModal(true, 'generate');
                setIsOpen(false);
              }} 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold" 
              title="AI Script Generator"
            >
              <Sparkles size={20} />
            </button>
            <button 
              onClick={() => {
                setShowPlaceholderGallery(true);
                setIsOpen(false);
              }} 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold" 
              title="Placeholder Gallery (Prompt Copier)"
            >
              <ImagePlus size={20} />
            </button>
            <button 
              onClick={() => {
                setShowGlobalTTSModal(true);
                setIsOpen(false);
              }} 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-accent)] text-white rounded-xl flex justify-center items-center hover:opacity-90 transition-opacity" 
              title="Global Text-to-Speech"
            >
               <Mic size={20} />
            </button>
            <button 
              onClick={() => {
                setShowGlobalTranslateModal(true);
                setIsOpen(false);
              }} 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors" 
              title="Global Translation"
            >
               <Globe size={20} />
            </button>
            <button 
              onClick={() => {
                setShowScriptModal(true, 'paste');
                setIsOpen(false);
              }} 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors text-xs font-semibold" 
              title="Paste Script"
            >
               <Terminal size={20} />
            </button>
            <FontQuickSelect />
            <BackgroundQuickSelect />

            <button onClick={() => handleAddShape('circle')} className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors" title="Circle">
              <Circle size={20} />
            </button>
            
            <button onClick={() => handleAddShape('rectangle')} className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors" title="Rectangle">
              <Square size={20} />
            </button>

            <label className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors cursor-pointer" title="Image">
              <ImageIcon size={20} />
              <input type="file" accept="image/*" className="hidden" onChange={handleAddImage} />
            </label>
            
            <label className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors cursor-pointer" title="Add Background Music">
              <Music size={20} />
              <input type="file" accept="audio/*" className="hidden" onChange={handleAddMusic} />
            </label>
            
            <button onClick={handleAddText} className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors" title="Text">
              <Type size={20} />
            </button>
            
            <button onClick={handleAddPlaceholder} className="w-10 h-10 sm:w-12 sm:h-12 bg-button-bg text-text-main rounded-xl flex justify-center items-center hover:bg-button-hover hover:text-text-main transition-colors" title="Background Placeholder">
              <LayoutTemplate size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

