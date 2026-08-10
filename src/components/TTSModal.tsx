import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { X, Mic, Play, Loader2, Wand2, Search, Terminal } from 'lucide-react';
import { EditorElement } from '../types';
import { TTS_VOICES } from '../lib/ttsVoices';

interface TTSModalProps {
  element?: EditorElement;
  onClose: () => void;
}

const LANG_MAP: Record<string, string> = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'ja': 'Japanese',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ko': 'Korean',
  'zh-CN': 'Chinese',
  'ar': 'Arabic',
  'hi': 'Hindi'
};

export function TTSModal({ element, onClose }: TTSModalProps) {
  const elements = useStore((state) => state.elements);
  const updateElement = useStore((state) => state.updateElement);
  const addToast = useStore((state) => state.addToast);
  
  const initialVoice = element?.ttsVoice && TTS_VOICES.some(v => v.id === element.ttsVoice) 
      ? element.ttsVoice 
      : 'se-Brian';
      
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(initialVoice);
  
  const initialVoiceConfig = TTS_VOICES.find(v => v.id === initialVoice);
  const initialCategory = initialVoiceConfig ? initialVoiceConfig.category : 'Standard (Google)';
  
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [autoRetime, setAutoRetime] = useState(true);
  const [packTimeline, setPackTimeline] = useState(true);
  const [timeBuffer, setTimeBuffer] = useState(800);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(TTS_VOICES.map(v => v.category)));
    return cats.sort((a, b) => {
      if (a === 'Standard (Google)') return -1;
      if (b === 'Standard (Google)') return 1;
      if (a === 'English') return -1;
      if (b === 'English') return 1;
      return a.localeCompare(b);
    });
  }, []);

  const filteredVoices = useMemo(() => {
    return TTS_VOICES.filter(v => v.category === selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (!filteredVoices.some(v => v.id === selectedVoiceURI) && filteredVoices.length > 0) {
      setSelectedVoiceURI(filteredVoices[0].id);
    }
  }, [selectedCategory, filteredVoices, selectedVoiceURI]);

  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, []);

  const handlePreview = async () => {
    if (isPlayingPreview || isLoadingPreview) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
      setIsPlayingPreview(false);
      setIsLoadingPreview(false);
      return;
    }

    const textToPreview = element?.content?.trim() ? element.content : "This is a preview of the selected voice.";
    const voiceConfig = TTS_VOICES.find(v => v.id === selectedVoiceURI);
    
    let lang = 'en';
    let voiceParam = '';
    
    if (voiceConfig) {
      lang = voiceConfig.lang;
      voiceParam = voiceConfig.voice ? `&voice=${encodeURIComponent(voiceConfig.voice)}` : '';
    } else {
      lang = selectedVoiceURI || 'en';
    }

    const audioUrl = `/api/tts?text=${encodeURIComponent(textToPreview)}&lang=${lang}${voiceParam}`;
    
    try {
      setIsLoadingPreview(true);
      const res = await fetch(audioUrl);
      if (!res.ok) throw new Error('Failed to fetch audio');
      
      const blob = await res.blob();
      
      // Convert blob to base64 data URI to avoid iframe blob URL restrictions
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      const url = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      
      const audio = new Audio(url);
      previewAudioRef.current = audio;
      
      audio.onended = () => setIsPlayingPreview(false);
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setIsPlayingPreview(false);
      };
      
      await audio.play();
      setIsLoadingPreview(false);
      setIsPlayingPreview(true);
    } catch (e) {
      console.error(e);
      setIsLoadingPreview(false);
      setIsPlayingPreview(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedVoiceURI) return;
    
    setIsGenerating(true);
    setLogs([]);
    addLog(`Starting TTS generation using voice: ${selectedVoiceURI}...`);
    
    const estimateTTSDuration = (text: string) => {
      const words = text.trim().split(/\s+/).length;
      return Math.max(1000, Math.ceil(words * 400) + timeBuffer);
    };

    const getRealDuration = async (text: string, voiceURI: string): Promise<number> => {
      if (!text || !text.trim()) return 1000;
      try {
        const voiceConfig = TTS_VOICES.find(v => v.id === voiceURI);
        let lang = 'en';
        let voiceParam = '';
        
        if (voiceConfig) {
          lang = voiceConfig.lang;
          voiceParam = voiceConfig.voice ? `&voice=${encodeURIComponent(voiceConfig.voice)}` : '';
        } else {
          lang = voiceURI.split('-')[0] || 'en';
        }
        
        addLog(`Fetching real audio duration for: "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"`);
        const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}&lang=${lang}${voiceParam}`);
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
          const duration = (audioBuffer.duration * 1000) + timeBuffer;
          addLog(`  -> Real duration: ${Math.round(duration)}ms`);
          return duration;
        }
      } catch (e: any) {
        addLog(`  -> Error getting real duration: ${e.message}`);
        console.error("Failed to get real duration, falling back to estimate", e);
      }
      const estimate = estimateTTSDuration(text);
      addLog(`  -> Fallback estimate: ${estimate}ms`);
      return estimate;
    };

    try {
      if (element) {
        addLog(`Processing single element (ID: ${element.id})`);
        if (autoRetime) {
          const estimatedDuration = await getRealDuration(element.content, selectedVoiceURI);
          const newEndTime = element.startTime + estimatedDuration;
          
          const placeholder = elements.find(el => el.isPlaceholder && Math.abs(el.startTime - element.startTime) < 100);
          
          updateElement(element.id, { 
            ttsVoice: selectedVoiceURI,
            endTime: newEndTime
          });
          
          if (placeholder) {
            updateElement(placeholder.id, { endTime: newEndTime });
            addLog(`Updated corresponding placeholder end time.`);
          }

          if (newEndTime > useStore.getState().duration) {
            addLog(`Extended global duration to accommodate audio.`);
            useStore.getState().setDuration(newEndTime + 1000);
          }
        } else {
          updateElement(element.id, { ttsVoice: selectedVoiceURI });
          addLog(`Updated voice without retiming.`);
        }
      } else {
        // Global TTS update
        addLog(`Processing global TTS update for all text elements...`);
        if (autoRetime) {
          let newElements = [...elements];
          const groups: { text: any, placeholder: any | null }[] = [];
          
          const textElsOriginal = elements.filter(e => e.type === 'text').sort((a,b) => a.startTime - b.startTime);
          addLog(`Found ${textElsOriginal.length} text elements in timeline.`);
          
          for (const textEl of textElsOriginal) {
             const ph = elements.find(el => el.isPlaceholder && Math.abs(el.startTime - textEl.startTime) < 100);
             groups.push({
               text: { ...textEl },
               placeholder: ph ? { ...ph } : null
             });
          }
          
          let maxTime = 0;
          for (let i = 0; i < groups.length; i++) {
             const g = groups[i];
             addLog(`Processing element ${i+1}/${groups.length}: "${g.text.content.substring(0, 15)}..."`);
             const estimated = await getRealDuration(g.text.content, selectedVoiceURI);
             let newStartTime = g.text.startTime;
             
             if (i > 0) {
                const prev = groups[i-1];
                if (packTimeline) {
                   newStartTime = prev.text.endTime + 200; // Pack them with 200ms gap
                   addLog(`  -> Packing start time to ${newStartTime}ms`);
                } else if (newStartTime < prev.text.endTime) {
                   newStartTime = prev.text.endTime + 200; // Prevent overlap
                   addLog(`  -> Adjusting start time to prevent overlap: ${newStartTime}ms`);
                }
             }
             
             const newEndTime = newStartTime + estimated;
             
             g.text.startTime = newStartTime;
             g.text.endTime = newEndTime;
             g.text.ttsVoice = selectedVoiceURI;
             
             if (g.placeholder) {
                g.placeholder.startTime = newStartTime;
                g.placeholder.endTime = newEndTime;
             }
             
             maxTime = Math.max(maxTime, newEndTime);
          }
          
          groups.forEach(g => {
             const tIdx = newElements.findIndex(e => e.id === g.text.id);
             if (tIdx >= 0) newElements[tIdx] = g.text;
             
             if (g.placeholder) {
               const pIdx = newElements.findIndex(e => e.id === g.placeholder.id);
               if (pIdx >= 0) newElements[pIdx] = g.placeholder;
             }
          });
          
          useStore.getState().setElements(newElements);
          addLog(`Applied updated timeline elements.`);
          
          if (maxTime > useStore.getState().duration) {
             addLog(`Extended global duration to ${maxTime + 1000}ms.`);
             useStore.getState().setDuration(maxTime + 1000); // 1 sec padding
          }
        } else {
          let count = 0;
          elements.forEach(el => {
            if (el.type === 'text') {
              updateElement(el.id, { ttsVoice: selectedVoiceURI });
              count++;
            }
          });
          addLog(`Updated voice for ${count} elements without retiming.`);
        }
      }
      
      addLog(`Generation complete!`);
      setIsGenerating(false);
      addToast(element ? 'TTS Generated successfully!' : 'Global TTS Generated successfully!', 'success');
      setTimeout(() => {
         onClose();
      }, 2000);
    } catch (e: any) {
      addLog(`Fatal error: ${e.message}`);
      console.error(e);
      setIsGenerating(false);
      addToast('Failed to apply TTS', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-app-bg text-text-main w-full max-w-3xl rounded-2xl flex flex-col pointer-events-auto shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-panel-border shrink-0 bg-app-bg z-10 flex-wrap gap-3">
            <div className="font-semibold text-lg tracking-tight flex items-center gap-2">
              <Mic size={20} className="text-[var(--color-accent)]" /> 
              Voice Selection
            </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePreview}
                  disabled={isGenerating}
                  className="text-xs flex items-center gap-1.5 font-medium bg-button-bg hover:bg-button-hover border border-panel-border px-3 py-1.5 rounded-lg transition-colors text-text-main"
                >
                  {isLoadingPreview ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> Loading
                    </>
                  ) : isPlayingPreview ? (
                    <>
                       <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" /> Stop Preview
                    </>
                  ) : (
                    <>
                      <Play size={12} className="fill-current text-[var(--color-accent)]" /> Play Preview
                    </>
                  )}
                </button>
                <button 
                  onClick={() => {
                    window.speechSynthesis.cancel();
                    onClose();
                  }}
                  className="w-8 h-8 rounded-full bg-button-bg border border-panel-border flex items-center justify-center text-text-muted hover:text-text-main hover:bg-button-hover transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row flex-1 min-h-0 overflow-hidden">
              {/* Sidebar for Categories */}
              <div className="w-full sm:w-48 border-b sm:border-b-0 sm:border-r border-panel-border bg-button-bg/30 p-2 sm:p-3 overflow-x-auto sm:overflow-y-auto custom-scrollbar flex sm:flex-col gap-1 shrink-0 flex-row">
                <div className="text-[10px] text-text-muted uppercase font-semibold tracking-wider px-2 py-1 mb-1 hidden sm:block">
                  Categories
                </div>
                {categories.map((catName) => (
                  <button
                    key={catName}
                    onClick={() => setSelectedCategory(catName)}
                    className={`whitespace-nowrap sm:whitespace-normal text-left px-3 py-2 rounded-lg text-sm transition-colors flex-shrink-0 ${
                      selectedCategory === catName
                        ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium'
                        : 'hover:bg-button-hover text-text-main/80'
                    }`}
                  >
                    {catName}
                  </button>
                ))}
              </div>

              {/* Main content area */}
              <div className="flex-1 flex flex-col p-4 sm:p-5 overflow-y-auto custom-scrollbar space-y-6">
                
                <div className="space-y-3">
                  <label className="text-[10px] text-text-muted uppercase font-semibold tracking-wider">
                    Select Voice
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredVoices.map((voice) => (
                      <button
                        key={voice.id}
                        onClick={() => setSelectedVoiceURI(voice.id)}
                        className={`text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex flex-col gap-1 border ${
                          selectedVoiceURI === voice.id 
                            ? 'bg-[var(--color-accent)]/5 border-[var(--color-accent)] text-[var(--color-accent)]' 
                            : 'border-panel-border hover:bg-button-hover text-text-main bg-button-bg/50'
                        }`}
                      >
                        <div className="font-medium flex items-center justify-between w-full">
                           <span>{voice.name.split(' - ')[1] || voice.name.replace(' (Standard)', '')}</span>
                           {voice.gender && <span className="text-[10px] bg-button-bg px-1.5 py-0.5 rounded text-text-muted">{voice.gender}</span>}
                        </div>
                        <div className="text-xs opacity-70">
                          {voice.voice ? 'High Quality (Polly)' : 'Standard (Google)'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-button-bg/50 border border-panel-border rounded-xl">
                  <div className="flex justify-between items-center">
                     <label className="text-[10px] text-text-muted uppercase font-semibold tracking-wider">
                      Text
                    </label>
                  </div>
                  <div className="text-sm text-text-main line-clamp-3 italic opacity-80 border-l-2 border-[var(--color-accent)] pl-3">
                    "{element?.content || "This is a preview of the selected voice for all text elements."}"
                  </div>
                </div>
              </div>
            </div>
            
            {(logs.length > 0 || isGenerating) && (
              <div className="p-4 sm:p-5 border-t border-panel-border bg-[#0a0a0a] flex flex-col gap-2 shrink-0 h-32 sm:h-48">
                <div className="flex items-center gap-2 text-text-muted">
                  <Terminal size={14} />
                  <span className="text-xs font-semibold">Process Logs</span>
                </div>
                <div className="border border-panel-border rounded-lg p-3 overflow-y-auto font-mono text-[10px] text-text-muted whitespace-pre-wrap flex-1 custom-scrollbar">
                  {logs.length === 0 ? (
                    <span className="text-text-muted/50">Waiting for process to start...</span>
                  ) : (
                    logs.map((log, i) => (
                      <div key={i} className="mb-1">{log}</div>
                    ))
                  )}
                  <div ref={logsEndRef} />
                </div>
              </div>
            )}

            <div className="p-4 sm:p-5 border-t border-panel-border bg-button-bg/30 flex flex-col gap-2 sm:gap-3 shrink-0">
              <label className="flex items-center gap-2 text-sm text-text-main cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={autoRetime} 
                  onChange={(e) => setAutoRetime(e.target.checked)}
                  className="rounded border-panel-border bg-button-bg text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                />
                Auto-adjust text timing based on audio length
              </label>
              
              {autoRetime && (
                <div className="flex flex-col gap-2 pl-6">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-text-muted">Time Buffer (Padding)</label>
                    <span className="text-xs font-mono">{timeBuffer}ms</span>
                  </div>
                  <input 
                    type="range" 
                    min="200" 
                    max="3000" 
                    step="100"
                    value={timeBuffer}
                    onChange={(e) => setTimeBuffer(parseInt(e.target.value))}
                    className="w-full accent-[var(--color-accent)]"
                  />
                  <p className="text-[10px] text-text-muted/60 leading-tight">Adjust the trailing pause time added to the generated audio clip.</p>
                  
                  {!element && (
                    <label className="flex items-center gap-2 text-xs text-text-main cursor-pointer mt-2">
                      <input 
                        type="checkbox" 
                        checked={packTimeline} 
                        onChange={(e) => setPackTimeline(e.target.checked)}
                        className="rounded border-panel-border bg-button-bg text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                      />
                      Pack Timeline (Remove gaps between text clips)
                    </label>
                  )}
                </div>
              )}

              <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-4">
                <button 
                  onClick={() => {
                    onClose();
                  }} 
                  disabled={isGenerating}
                  className="flex-1 py-2.5 rounded-full font-medium transition-colors bg-button-bg border border-panel-border text-text-main hover:bg-button-hover disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="flex-[2] py-2.5 rounded-full font-medium transition-colors bg-[var(--color-accent)] text-white hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 size={16} /> {element ? 'Generate TTS' : 'Generate Global TTS'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
