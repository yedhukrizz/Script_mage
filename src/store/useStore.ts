import { create } from 'zustand';
import { EditorElement } from '../types';

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface EditorState {
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  elements: EditorElement[];
  setElements: (elements: EditorElement[]) => void;
  selectedElementId: string | null;
  currentTime: number;
  isPlaying: boolean;
  duration: number; // in milliseconds
  canvasAspectRatio: string;
  globalTextScale: number;
  canvasScale: number;
  setCanvasScale: (scale: number) => void;
  backgroundType: 'solid' | 'gradient' | 'animated-gradient' | 'video' | 'scrolling-grid' | 'scrolling-dots' | 'scrolling-lines' | 'scanning-laser' | 'scrolling-diagonal' | 'pulse-grid' | 'radar-sweep';
  backgroundColor: string;
  backgroundGradient: string[];
  backgroundVideoUrl: string;
  backgroundSpeed: number;
  backgroundAudioUrl: string | null;
  backgroundAudioVolume: number;
  setBackgroundAudioUrl: (url: string | null) => void;
  setBackgroundAudioVolume: (volume: number) => void;
  keylightType: 'none' | 'up' | 'down';
  keylightColor: string;
  gridOverlay: 'none' | 'small' | 'large';
  setBackgroundType: (type: 'solid' | 'gradient' | 'animated-gradient' | 'video' | 'scrolling-grid' | 'scrolling-dots' | 'scrolling-lines' | 'scanning-laser' | 'scrolling-diagonal' | 'pulse-grid' | 'radar-sweep') => void;
  setBackgroundColor: (color: string) => void;
  setBackgroundGradient: (gradient: string[]) => void;
  setBackgroundVideoUrl: (url: string) => void;
  setBackgroundSpeed: (speed: number) => void;
  setKeylightType: (type: 'none' | 'up' | 'down') => void;
  setKeylightColor: (color: string) => void;
  setGridOverlay: (type: 'none' | 'small' | 'large') => void;
  showGlobalTTSModal: boolean;
  setShowGlobalTTSModal: (show: boolean) => void;
  showGlobalTranslateModal: boolean;
  setShowGlobalTranslateModal: (show: boolean) => void;
  showPlaceholderGallery: boolean;
  setShowPlaceholderGallery: (show: boolean) => void;
  showTextGallery: boolean;
  setShowTextGallery: (show: boolean) => void;
  showScriptModal: boolean;
  scriptModalMode: 'generate' | 'paste';
  setShowScriptModal: (show: boolean, mode?: 'generate' | 'paste') => void;
  timelineExpanded: boolean;
  timelineMinimized: boolean;
  setTimelineExpanded: (expanded: boolean) => void;
  setTimelineMinimized: (minimized: boolean) => void;
  timelineTransparent: boolean;
  timelineTrackpadMode: boolean;
  setTimelineTrackpadMode: (mode: boolean) => void;
  setTimelineTransparent: (transparent: boolean) => void;
  uiTheme: 'dark' | 'light' | 'black';
  setUiTheme: (theme: 'dark' | 'light' | 'black') => void;
  timelineZoom: number;
  setTimelineZoom: (zoom: number) => void;
  timelineLengthLock: boolean;
  setTimelineLengthLock: (lock: boolean) => void;
  uiAccentColor: string;
  setUiAccentColor: (color: string) => void;
  addElement: (element: EditorElement) => void;
  updateElement: (id: string, updates: Partial<EditorElement>, skipHistory?: boolean) => void;
  removeElement: (id: string) => void;
  setSelectedElementId: (id: string | null) => void;
  setCurrentTime: (time: number | ((prev: number) => number)) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setDuration: (duration: number) => void;
  setCanvasAspectRatio: (ratio: string) => void;
  customFonts: string[];
  setCustomFonts: (fonts: string[]) => void;
  setGlobalTextScale: (scale: number) => void;
  defaults: {
    text: { animationIn: string, animationOut: string, easing: string, fontFamily?: string, textEffect?: string, fontWeight?: number },
    image: { animationIn: string, animationOut: string, easing: string },
    shape: { animationIn: string, animationOut: string, easing: string },
    placeholder: { mediaDimness: number, animationIn: string, animationOut: string, mediaEffect: string },
  };
  updateDefaults: (type: 'text' | 'image' | 'shape' | 'placeholder', updates: any) => void;
  applyGlobalFont: (fontFamily: string) => void;
  applyDefaultsToProject: () => void;
  scaleTimeline: (factor: number) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showAboutModal: boolean;
  setShowAboutModal: (show: boolean) => void;
  toJSON: () => Promise<string>;
  loadFromJSON: (json: string) => void;
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
  resetProject: () => void;
  cloudflareWorkerUrl: string;
  setCloudflareWorkerUrl: (url: string) => void;
  past: EditorElement[][];
  future: EditorElement[][];
  undo: () => void;
  redo: () => void;
  saveHistory: (newElements?: EditorElement[]) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  geminiModel: string;
  setGeminiModel: (model: string) => void;
  geminiFreeTier: boolean;
  setGeminiFreeTier: (isFree: boolean) => void;
}

export const useStore = create<EditorState>((set) => ({
  past: [],
  future: [],
  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    return {
      past: newPast,
      future: [state.elements, ...state.future],
      elements: previous,
      selectedElementId: null // Clear selection to prevent editing a non-existent element
    };
  }),
  redo: () => set((state) => {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    return {
      past: [...state.past, state.elements],
      future: newFuture,
      elements: next,
      selectedElementId: null
    };
  }),
  saveHistory: (newElements?: EditorElement[]) => set((state) => {
    const currentState = newElements || state.elements;
    // Keep maximum 50 states in history
    const past = [...state.past, currentState].slice(-50);
    return { past, future: [] };
  }),
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),
  currentProjectId: null,
  setCurrentProjectId: (id) => set({ currentProjectId: id }),
  resetProject: () => set({
    elements: [],
    duration: 10000,
    currentTime: 0,
    isPlaying: false,
    selectedElementId: null,
    backgroundType: 'solid',
    backgroundColor: '#09090b',
  }),
  cloudflareWorkerUrl: localStorage.getItem('motion-cf-worker') || '',
  setCloudflareWorkerUrl: (url) => {
    localStorage.setItem('motion-cf-worker', url);
    set({ cloudflareWorkerUrl: url });
  },
  geminiApiKey: localStorage.getItem('motion-gemini-key') || '',
  setGeminiApiKey: (key) => {
    localStorage.setItem('motion-gemini-key', key);
    set({ geminiApiKey: key });
  },
  geminiModel: localStorage.getItem('motion-gemini-model') || 'gemini-3.1-flash-tts-preview',
  setGeminiModel: (model) => {
    localStorage.setItem('motion-gemini-model', model);
    set({ geminiModel: model });
  },
  geminiFreeTier: localStorage.getItem('motion-gemini-free') !== 'false',
  setGeminiFreeTier: (isFree) => {
    localStorage.setItem('motion-gemini-free', String(isFree));
    set({ geminiFreeTier: isFree });
  },
  elements: [],
  selectedElementId: null,
  currentTime: 0,
  isPlaying: false,
  duration: 10000, // 10 seconds default
  canvasAspectRatio: '9/16',
  globalTextScale: 1,
  customFonts: [],
  setCustomFonts: (fonts) => set({ customFonts: fonts }),
  canvasScale: 1,
  defaults: {
    text: { animationIn: 'fade-slide-up', animationOut: 'fade-slide-up', easing: 'ease-in-out', fontFamily: 'Instrument Sans', textEffect: 'none', fontWeight: 600 },
    image: { animationIn: 'fade-slide-up', animationOut: 'fade-slide-up', easing: 'ease-in-out' },
    shape: { animationIn: 'fade-slide-up', animationOut: 'fade-slide-up', easing: 'ease-in-out' },
    placeholder: { mediaDimness: 0.5, animationIn: 'fade', animationOut: 'fade', mediaEffect: 'none' },
  },
  backgroundType: 'solid',
  backgroundColor: '#09090b',
  backgroundGradient: ['#ff00cc', '#333399'],
  backgroundVideoUrl: '',
  backgroundAudioUrl: null,
  backgroundAudioVolume: 0.5,
  setBackgroundAudioUrl: (url) => set({ backgroundAudioUrl: url }),
  setBackgroundAudioVolume: (volume) => set({ backgroundAudioVolume: volume }),
  backgroundSpeed: 1,
  keylightType: 'none',
  keylightColor: '#ff0000',
  gridOverlay: 'none',
  setBackgroundType: (type) => set({ backgroundType: type }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setBackgroundGradient: (gradient) => set({ backgroundGradient: gradient }),
  setBackgroundVideoUrl: (url) => set({ backgroundVideoUrl: url }),
  setBackgroundSpeed: (speed) => set({ backgroundSpeed: speed }),
  setKeylightType: (type) => set({ keylightType: type }),
  setKeylightColor: (color) => set({ keylightColor: color }),
  setGridOverlay: (type) => set({ gridOverlay: type }),
  showGlobalTTSModal: false,
  setShowGlobalTTSModal: (show) => set({ showGlobalTTSModal: show }),
  showGlobalTranslateModal: false,
  setShowGlobalTranslateModal: (show) => set({ showGlobalTranslateModal: show }),
  showPlaceholderGallery: false,
  setShowPlaceholderGallery: (show) => set({ showPlaceholderGallery: show }),
  showTextGallery: false,
  setShowTextGallery: (show) => set({ showTextGallery: show }),
  showScriptModal: false,
  scriptModalMode: 'generate',
  setShowScriptModal: (show, mode = 'generate') => set({ showScriptModal: show, scriptModalMode: mode }),
  timelineExpanded: false,
  timelineMinimized: false,
  setTimelineExpanded: (expanded) => set({ timelineExpanded: expanded }),
  setTimelineMinimized: (minimized) => set({ timelineMinimized: minimized }),
  timelineTransparent: false,
  timelineTrackpadMode: false,
  setTimelineTransparent: (transparent) => set({ timelineTransparent: transparent }),
  setTimelineTrackpadMode: (mode) => set({ timelineTrackpadMode: mode }),
  uiTheme: 'dark',
  setUiTheme: (theme) => set({ uiTheme: theme }),
  timelineZoom: 1,
  setTimelineZoom: (zoom) => set({ timelineZoom: zoom }),
  timelineLengthLock: false,
  setTimelineLengthLock: (lock) => set({ timelineLengthLock: lock }),
  uiAccentColor: '#6366f1',
  setUiAccentColor: (color) => set({ uiAccentColor: color }),
  addElement: (element) => set((state) => ({
    past: [...state.past, state.elements].slice(-50),
    future: [],
    elements: [...state.elements, element] 
  })),
  setElements: (elements) => set((state) => ({ 
    past: [...state.past, state.elements].slice(-50),
    future: [],
    elements 
  })),
  updateElement: (id, updates, skipHistory = false) => set((state) => ({
    ...(skipHistory ? {} : { past: [...state.past, state.elements].slice(-50), future: [] }),
    elements: state.elements.map((el) => el.id === id ? { ...el, ...updates } : el)
  })),
  removeElement: (id) => set((state) => ({
    past: [...state.past, state.elements].slice(-50),
    future: [],
    elements: state.elements.filter((el) => el.id !== id),
    selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
  })),
  setSelectedElementId: (id) => set({ selectedElementId: id }),
  setCurrentTime: (time) => set((state) => ({
    currentTime: typeof time === 'function' ? time(state.currentTime) : time
  })),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setDuration: (duration) => set({ duration }),
  setCanvasAspectRatio: (ratio) => set((state) => {
    const getDims = (r: string) => {
      if (r === '16/9') return { w: 1920, h: 1080 };
      if (r === '9/16') return { w: 1080, h: 1920 };
      if (r === '1/1') return { w: 1080, h: 1080 };
      if (r === '4/5') return { w: 1080, h: 1350 };
      return { w: 1080, h: 1920 };
    };

    const oldDims = getDims(state.canvasAspectRatio);
    const newDims = getDims(ratio);
    
    const scaleX = newDims.w / oldDims.w;
    const scaleY = newDims.h / oldDims.h;

    const elements = state.elements.map(el => ({
      ...el,
      x: el.x * scaleX,
      y: el.y * scaleY,
      width: el.width * scaleX,
      height: el.height * scaleY,
      fontSize: el.fontSize ? el.fontSize * Math.min(scaleX, scaleY) : undefined
    }));

    return { canvasAspectRatio: ratio, elements };
  }),
  setCanvasScale: (scale) => set((state) => {
    if (Math.abs(state.canvasScale - scale) < 0.001) return state;
    return { canvasScale: scale };
  }),
  setGlobalTextScale: (scale) => set({ globalTextScale: scale }),
  updateDefaults: (type, updates) => set((state) => ({
    defaults: {
      ...state.defaults,
      [type]: { ...state.defaults[type], ...updates }
    }
  })),
  applyGlobalFont: (fontFamily) => set((state) => ({
    defaults: { ...state.defaults, text: { ...state.defaults.text, fontFamily } },
    elements: state.elements.map(el => el.type === 'text' ? { ...el, fontFamily } : el)
  })),
  applyDefaultsToProject: () => set((state) => ({
    elements: state.elements.map(el => {
      const pDefaults = state.defaults.placeholder || { mediaDimness: 0.5, animationIn: 'fade', animationOut: 'fade', mediaEffect: 'none' };
      if (el.isPlaceholder || (el.type === 'image' || el.type === 'video')) {
        let updates: any = {
          animationIn: pDefaults.animationIn,
          animationOut: pDefaults.animationOut,
          mediaEffect: pDefaults.mediaEffect,
        };
        if (el.isPlaceholder) {
           updates.mediaDimness = pDefaults.mediaDimness;
        }
        return { ...el, ...updates };
      } else if (el.type === 'text') {
        return {
          ...el,
          animationIn: state.defaults.text.animationIn,
          animationOut: state.defaults.text.animationOut,
          easing: state.defaults.text.easing,
          fontFamily: state.defaults.text.fontFamily,
          textEffect: state.defaults.text.textEffect,
          fontWeight: state.defaults.text.fontWeight,
        };
      } else if (el.type === 'shape') {
        return {
          ...el,
          animationIn: state.defaults.shape.animationIn,
          animationOut: state.defaults.shape.animationOut,
          easing: state.defaults.shape.easing,
        };
      }
      return el;
    })
  })),
  scaleTimeline: (factor) => set((state) => {
    const newDuration = Math.round(state.duration * factor);
    const newElements = state.elements.map(el => ({
      ...el,
      startTime: Math.round(el.startTime * factor),
      endTime: Math.round(el.endTime * factor)
    }));
    return {
      duration: newDuration,
      elements: newElements,
      currentTime: Math.min(state.currentTime, newDuration)
    };
  }),
  showSettings: false,
  setShowSettings: (show) => set({ showSettings: show }),
  showAboutModal: false,
  setShowAboutModal: (show) => set({ showAboutModal: show }),
  toJSON: async () => {
    const s = useStore.getState();
    
    const blobUrlToBase64 = async (url: string) => {
      if (!url.startsWith('blob:')) return url;
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        console.error("Failed to convert blob to base64", e);
        return url;
      }
    };

    const newElements = await Promise.all(s.elements.map(async (el) => {
      if (el.content && el.content.startsWith('blob:')) {
        return { ...el, content: await blobUrlToBase64(el.content) };
      }
      return el;
    }));

    let newBgVideo = s.backgroundVideoUrl;
    if (newBgVideo && newBgVideo.startsWith('blob:')) {
      newBgVideo = await blobUrlToBase64(newBgVideo);
    }
    
    let newBgAudio = s.backgroundAudioUrl;
    if (newBgAudio && newBgAudio.startsWith('blob:')) {
      newBgAudio = await blobUrlToBase64(newBgAudio);
    }

    return JSON.stringify({
      elements: newElements,
      duration: s.duration,
      canvasAspectRatio: s.canvasAspectRatio,
      backgroundType: s.backgroundType,
      backgroundColor: s.backgroundColor,
      backgroundGradient: s.backgroundGradient,
      backgroundVideoUrl: newBgVideo,
      backgroundSpeed: s.backgroundSpeed,
      keylightType: s.keylightType,
      keylightColor: s.keylightColor,
      gridOverlay: s.gridOverlay,
      backgroundAudioUrl: newBgAudio,
      backgroundAudioVolume: s.backgroundAudioVolume,
      cloudflareWorkerUrl: s.cloudflareWorkerUrl,
      defaults: s.defaults
    }, null, 2);
  },
  loadFromJSON: (json) => {
    try {
      const data = JSON.parse(json);
      
      const currentDefaults = useStore.getState().defaults;
      const loadedDefaults = data.defaults || {};
      
      set({
        elements: data.elements || [],
        duration: data.duration || 10000,
        canvasAspectRatio: data.canvasAspectRatio || '9/16',
        backgroundType: data.backgroundType || 'solid',
        backgroundColor: data.backgroundColor || '#09090b',
        backgroundGradient: data.backgroundGradient || ['#ff00cc', '#333399'],
        backgroundVideoUrl: data.backgroundVideoUrl || '',
        backgroundSpeed: data.backgroundSpeed ?? 1,
        keylightType: data.keylightType || 'none',
        keylightColor: data.keylightColor || '#ff0000',
        gridOverlay: data.gridOverlay || 'none',
        backgroundAudioUrl: data.backgroundAudioUrl || null,
        backgroundAudioVolume: data.backgroundAudioVolume ?? 0.5,
        cloudflareWorkerUrl: data.cloudflareWorkerUrl || '',
        defaults: {
          text: { ...currentDefaults.text, ...loadedDefaults.text },
          image: { ...currentDefaults.image, ...loadedDefaults.image },
          shape: { ...currentDefaults.shape, ...loadedDefaults.shape },
          placeholder: { ...currentDefaults.placeholder, ...loadedDefaults.placeholder }
        }
      });
    } catch(e) {
      console.error(e);
    }
  }
}));
