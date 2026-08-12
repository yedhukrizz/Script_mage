import React, { useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Timeline } from './components/Timeline';
import { useStore } from './store/useStore';
import { SettingsModal } from './components/SettingsModal';
import { ScriptModal } from './components/ScriptModal';
import { ProjectScreen } from './components/ProjectScreen';
import { ProjectMenu } from './components/ProjectMenu';
import { AboutModal } from './components/AboutModal';
import { ToastContainer } from './components/ToastContainer';
import { TTS_VOICES } from './lib/ttsVoices';
import { motion, AnimatePresence } from 'motion/react';

import { TTSModal } from './components/TTSModal';
import { TranslateModal } from './components/TranslateModal';
import { PlaceholderGallery } from './components/PlaceholderGallery';
import { UndoRedoControls } from './components/UndoRedoControls';
import { ChevronLeft } from 'lucide-react';

export default function App() {
  const isPlaying = useStore((state) => state.isPlaying);
  const duration = useStore((state) => state.duration);
  const setCurrentTime = useStore((state) => state.setCurrentTime);
  const selectedElementId = useStore((state) => state.selectedElementId);
  const showScriptModal = useStore((state) => state.showScriptModal);
  const setShowScriptModal = useStore((state) => state.setShowScriptModal);
  const showSettings = useStore((state) => state.showSettings);
  const setShowSettings = useStore((state) => state.setShowSettings);
  const showAboutModal = useStore((state) => state.showAboutModal);
  const setShowAboutModal = useStore((state) => state.setShowAboutModal);
  const currentProjectId = useStore((state) => state.currentProjectId);
  const showGlobalTTSModal = useStore((state) => state.showGlobalTTSModal);
  const setShowGlobalTTSModal = useStore((state) => state.setShowGlobalTTSModal);
  const showGlobalTranslateModal = useStore((state) => state.showGlobalTranslateModal);
  const setShowGlobalTranslateModal = useStore((state) => state.setShowGlobalTranslateModal);
  const showPlaceholderGallery = useStore((state) => state.showPlaceholderGallery);
  const setShowPlaceholderGallery = useStore((state) => state.setShowPlaceholderGallery);
  const elements = useStore((state) => state.elements);
  const currentTime = useStore((state) => state.currentTime);
  const backgroundAudioUrl = useStore((state) => state.backgroundAudioUrl);
  const backgroundAudioVolume = useStore((state) => state.backgroundAudioVolume);
  
  const [showUnsavedModal, setShowUnsavedModal] = React.useState(false);
  const toJSON = useStore(state => state.toJSON);
  const setCurrentProjectId = useStore(state => state.setCurrentProjectId);
  const addToast = useStore(state => state.addToast);

  const handleBackToGallery = async () => {
    if (!toJSON || !currentProjectId) return;
    try {
      const stored = localStorage.getItem('motion-projects');
      let projects = stored ? JSON.parse(stored) : [];
      const projectIndex = projects.findIndex((p: any) => p.id === currentProjectId);
      
      const currentData = await toJSON();
      
      if (projectIndex >= 0 && projects[projectIndex].data === currentData) {
        // No changes
        setCurrentProjectId(null);
      } else {
        // Unsaved changes
        setShowUnsavedModal(true);
      }
    } catch (e) {
      console.error(e);
      setShowUnsavedModal(true);
    }
  };

  const handleSaveAndGo = async () => {
    if (!toJSON || !currentProjectId) return;
    try {
      const stored = localStorage.getItem('motion-projects');
      let projects = stored ? JSON.parse(stored) : [];
      const projectIndex = projects.findIndex((p: any) => p.id === currentProjectId);
      
      const projectData = {
        id: currentProjectId,
        name: `Project ${currentProjectId.substring(0, 4)}`,
        lastModified: Date.now(),
        data: await toJSON()
      };

      if (projectIndex >= 0) {
        projectData.name = projects[projectIndex].name;
        projects[projectIndex] = projectData;
      } else {
        projects.push(projectData);
      }
      
      localStorage.setItem('motion-projects', JSON.stringify(projects));
      addToast('Project saved successfully', 'success');
      setCurrentProjectId(null);
      setShowUnsavedModal(false);
    } catch (e) {
      console.error(e);
      addToast('Failed to save project', 'error');
    }
  };

  const handleDontSaveAndGo = () => {
    setCurrentProjectId(null);
    setShowUnsavedModal(false);
  };
  
  const bgAudioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = backgroundAudioVolume;
    }
  }, [backgroundAudioVolume]);

  React.useEffect(() => {
    if (bgAudioRef.current) {
      if (isPlaying) {
        // Sync time if it's off by more than 0.5s to prevent stuttering
        if (Math.abs(bgAudioRef.current.currentTime - currentTime / 1000) > 0.5) {
          bgAudioRef.current.currentTime = currentTime / 1000;
        }
        if (bgAudioRef.current.paused) {
          bgAudioRef.current.play().catch(e => console.error("BG Audio play error:", e));
        }
      } else {
        bgAudioRef.current.pause();
        bgAudioRef.current.currentTime = currentTime / 1000;
      }
    }
  }, [isPlaying, currentTime]);

  // Playback loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    const activeTTS = new Map<string, HTMLAudioElement>();

    const loop = (time: number) => {
      if (useStore.getState().isPlaying) {
        const currentMs = useStore.getState().currentTime;
        const delta = time - lastTime;
        const nextTime = currentMs + delta;
        const finalTime = nextTime >= duration ? 0 : nextTime;
        
        setCurrentTime(() => finalTime);
        
        // Handle TTS
        elements.forEach(el => {
          if (el.type === 'text' && el.ttsVoice) {
            // If playhead crosses start time (or starts exactly on it)
            if (currentMs <= el.startTime && finalTime > el.startTime) {
              if (!activeTTS.has(el.id) && el.content.trim()) {
                if (el.ttsAudioUrl) {
                  const audio = new Audio(el.ttsAudioUrl);
                  activeTTS.set(el.id, audio);
                  audio.play().catch(e => {
                    if (e.name !== 'AbortError') console.error("TTS playback error:", e);
                  });
                  audio.onended = () => activeTTS.delete(el.id);
                  audio.onerror = () => activeTTS.delete(el.id);
                } else {
                  const voiceConfig = TTS_VOICES.find(v => v.id === el.ttsVoice);
                  let lang = 'en';
                  let voiceParam = '';
                  
                  if (voiceConfig) {
                    lang = voiceConfig.lang;
                    voiceParam = voiceConfig.voice ? `&voice=${encodeURIComponent(voiceConfig.voice)}` : '';
                  } else {
                    lang = el.ttsVoice.split('-')[0] || 'en';
                  }
                  
                  const audioUrl = `/api/tts?text=${encodeURIComponent(el.content)}&lang=${lang}${voiceParam}`;
                  // Set a placeholder to prevent multiple fetches
                  activeTTS.set(el.id, new Audio());
                  
                  fetch(audioUrl).then(res => {
                    if (!res.ok) throw new Error('TTS fetch failed');
                    const contentType = res.headers.get('content-type');
                    if (!contentType || !contentType.includes('audio')) {
                      throw new Error('TTS response is not audio (possibly blocked or invalid)');
                    }
                    return res.blob();
                  }).then((blob) => {
                    const url = URL.createObjectURL(blob);
                    const audio = new Audio(url);
                    
                    // Only play if it's still supposed to be active
                    if (activeTTS.has(el.id)) {
                      activeTTS.set(el.id, audio);
                      audio.play().catch(e => {
                        if (e.name !== 'AbortError') {
                          console.error("TTS playback error:", e);
                        }
                      });
                      audio.onended = () => {
                        activeTTS.delete(el.id);
                      };
                      audio.onerror = () => {
                        activeTTS.delete(el.id);
                      };
                    }
                  }).catch(e => {
                    console.error("TTS fetch/play error:", e);
                    activeTTS.delete(el.id);
                  });
                }
              }
            }
            // Stop if playhead goes past end time or jumps backwards before start time
            if (activeTTS.has(el.id) && (finalTime > el.endTime + 2000 || finalTime < el.startTime)) {
              const audio = activeTTS.get(el.id);
              if (audio) {
                audio.pause();
                audio.currentTime = 0;
              }
              activeTTS.delete(el.id);
            }
          }
        });
      } else {
        // If paused, clear all TTS
        activeTTS.forEach(audio => {
          audio.pause();
          audio.currentTime = 0;
        });
        activeTTS.clear();
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(loop);
    } else {
      activeTTS.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      activeTTS.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, [isPlaying, duration, setCurrentTime, elements]);

  const setCanvasAspectRatio = useStore((state) => state.setCanvasAspectRatio);
  const canvasAspectRatio = useStore((state) => state.canvasAspectRatio);
  const timelineExpanded = useStore((state) => state.timelineExpanded);
  const timelineTransparent = useStore((state) => state.timelineTransparent);

  const aspectRatios = [
    { label: '9:16', value: '9/16' },
    { label: '16:9', value: '16/9' },
    { label: '1:1', value: '1/1' },
    { label: '4:5', value: '4/5' },
    { label: '3:4', value: '3/4' },
    { label: '21:9', value: '21/9' },
    { label: '18:9', value: '18/9' }
  ];

  const uiTheme = useStore((state) => state.uiTheme);
  const uiAccentColor = useStore((state) => state.uiAccentColor);

  return (
    <AnimatePresence mode="wait">
      {!currentProjectId ? (
        <motion.div 
          key="project-screen"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`flex flex-col h-[100dvh] bg-app-bg text-text-main overflow-hidden font-sans ${uiTheme === 'light' ? 'theme-light' : uiTheme === 'black' ? 'theme-black' : ''} ${uiAccentColor === 'rainbow' ? 'rainbow-accent' : ''}`}
          style={uiAccentColor !== 'rainbow' ? { '--color-accent': uiAccentColor } as any : undefined}
        >
          <ProjectScreen />
        </motion.div>
      ) : (
        <motion.div 
          key="editor-screen"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`flex flex-col h-[100dvh] bg-app-bg text-text-main overflow-hidden font-sans ${uiTheme === 'light' ? 'theme-light' : uiTheme === 'black' ? 'theme-black' : ''} ${uiAccentColor === 'rainbow' ? 'rainbow-accent' : ''}`}
          style={uiAccentColor !== 'rainbow' ? { '--color-accent': uiAccentColor } as any : undefined}
        >
          {/* Header */}
      <header className="absolute top-0 left-0 right-0 h-14 sm:h-16 flex items-center justify-between pointer-events-none z-30 px-4 sm:px-6 mt-1 sm:mt-2">
        <div className="flex items-center pointer-events-auto gap-3 sm:gap-4">
          <button 
            onClick={handleBackToGallery}
            className="w-10 h-10 bg-button-bg hover:bg-button-hover text-text-main rounded-xl flex items-center justify-center transition-all shadow-md border border-panel-border"
            title="Back to Projects"
          >
            <ChevronLeft size={20} />
          </button>
          <img src="/favicon.ico" alt="Script Mage" className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-md" />
        </div>
      </header>

      {/* Main Content (Canvas Area) */}
      <main className="flex-1 min-h-0 bg-app-bg flex items-center justify-center relative p-4 sm:p-12 pb-20 sm:pb-24 group perspective-[1000px] overflow-hidden">
        {backgroundAudioUrl && (
          <audio ref={bgAudioRef} src={backgroundAudioUrl} loop />
        )}
        <Canvas />
        <Toolbar />
        <ProjectMenu />
        <UndoRedoControls />
        {selectedElementId && (
          <div className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-end items-center pb-8">
            <div className="pointer-events-auto">
              <PropertiesPanel />
            </div>
          </div>
        )}
        {timelineExpanded && (
          <div className={`absolute top-16 sm:top-20 bottom-0 inset-x-2 z-40 bg-panel-bg overflow-hidden border-t border-panel-border shadow-[0_-10px_40px_rgba(0,0,0,0.8)] rounded-t-3xl border-x transition-all duration-300 flex flex-col ${
            timelineTransparent ? 'opacity-40 hover:opacity-100 transition-opacity' : 'opacity-100'
          }`}>
            <div className="flex-1 min-h-0 flex flex-col">
              <Timeline />
            </div>
          </div>
        )}
      </main>

      {/* Bottom section (Timeline + Controls) */}
      <div className={`flex flex-col shrink-0 bg-panel-bg overflow-hidden border-t border-panel-border shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-3xl border-x mx-0 sm:mx-2 transition-all duration-300 ${
        timelineExpanded ? 'hidden' : 'max-h-[65vh] sm:max-h-[50vh]'
      } ${timelineTransparent ? 'opacity-40 hover:opacity-100 transition-opacity' : 'opacity-100'}`}>
        {/* Playback Controls & Timeline */}
        <div className="flex-1 min-h-0 flex flex-col">
          <Timeline />
        </div>
      </div>
      
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      <AnimatePresence>
        {showScriptModal && <ScriptModal onClose={() => setShowScriptModal(false)} />}
        {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} />}
        {showGlobalTTSModal && <TTSModal onClose={() => setShowGlobalTTSModal(false)} />}
        {showGlobalTranslateModal && <TranslateModal onClose={() => setShowGlobalTranslateModal(false)} />}
        {showPlaceholderGallery && <PlaceholderGallery onClose={() => setShowPlaceholderGallery(false)} />}
        
        {showUnsavedModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-panel-bg border border-panel-border rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col gap-6"
            >
              <div>
                <h3 className="text-xl font-bold text-text-main mb-2">Unsaved Changes</h3>
                <p className="text-sm text-text-muted">You have unsaved changes in this project. Do you want to save before leaving?</p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleSaveAndGo}
                  className="w-full py-3 bg-[var(--color-accent)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Save & Go to Gallery
                </button>
                <button 
                  onClick={handleDontSaveAndGo}
                  className="w-full py-3 bg-button-bg text-text-main rounded-xl font-semibold hover:bg-button-hover transition-colors border border-panel-border"
                >
                  Don't Save
                </button>
                <button 
                  onClick={() => setShowUnsavedModal(false)}
                  className="w-full py-3 bg-transparent text-text-muted hover:text-text-main rounded-xl font-semibold transition-colors mt-2"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
