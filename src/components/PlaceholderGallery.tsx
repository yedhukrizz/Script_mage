import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { X, Copy, Image as ImageIcon, Video, Upload, Check, Wand2, ChevronDown, Sparkles, Loader2, Mic } from 'lucide-react';
import { PROMPT_ENHANCERS } from '../lib/promptEnhancers';
import { motion } from 'motion/react';
import { CustomSelect } from './CustomSelect';

interface PlaceholderGalleryProps {
  onClose: () => void;
}

export function PlaceholderGallery({ onClose }: PlaceholderGalleryProps) {
  const elements = useStore((state) => state.elements);
  const updateElement = useStore((state) => state.updateElement);
  const addToast = useStore((state) => state.addToast);
  const canvasAspectRatio = useStore((state) => state.canvasAspectRatio);
  const cloudflareWorkerUrl = useStore((state) => state.cloudflareWorkerUrl);
  const geminiApiKey = useStore((state) => state.geminiApiKey);
  const geminiModel = useStore((state) => state.geminiModel);
  const geminiFreeTier = useStore((state) => state.geminiFreeTier);
  const addElement = useStore((state) => state.addElement);
  const removeElement = useStore((state) => state.removeElement);
  const setShowSettings = useStore((state) => state.setShowSettings);
  
  const [selectedEnhancers, setSelectedEnhancers] = useState<string[]>([]);
  const [textPlacement, setTextPlacement] = useState('none');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showEnhancersMenu, setShowEnhancersMenu] = useState(false);
  const enhancersMenuRef = useRef<HTMLDivElement>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [cfGeneratingId, setCfGeneratingId] = useState<string | null>(null);
  const [geminiGeneratingId, setGeminiGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (enhancersMenuRef.current && !enhancersMenuRef.current.contains(event.target as Node)) {
        setShowEnhancersMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleEnhancer = (value: string) => {
    if (value === '') {
      setSelectedEnhancers([]);
      return;
    }
    setSelectedEnhancers(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  // Pair placeholders with closest text element
  const pairs = useMemo(() => {
    const placeholders = elements.filter(el => el.isPlaceholder).sort((a, b) => a.startTime - b.startTime);
    const textElements = elements.filter(el => el.type === 'text').sort((a, b) => a.startTime - b.startTime);

    return placeholders.map(ph => {
      // Find overlapping text or closest text
      let closestText = textElements.find(textEl => 
        (textEl.startTime <= ph.startTime && textEl.endTime > ph.startTime) || 
        (ph.startTime <= textEl.startTime && ph.endTime > textEl.startTime)
      );

      if (!closestText && textElements.length > 0) {
         closestText = textElements.reduce((prev, curr) => {
           return (Math.abs(curr.startTime - ph.startTime) < Math.abs(prev.startTime - ph.startTime) ? curr : prev);
         }, textElements[0]);
      }

      return {
        placeholder: ph,
        text: closestText
      };
    });
  }, [elements]);

  const handleCopyPrompt = (text: string, id: string) => {
    let tags = [];
    if (textPlacement !== 'none') {
      tags.push(`Leave empty space at the ${textPlacement} for text`);
    }
    if (selectedEnhancers.length > 0) {
      tags = [...tags, ...selectedEnhancers];
    }
    
    if (!tags.some(t => t.toLowerCase().includes('no text'))) {
      tags.push('Strictly no text, no watermarks, no logos');
    }
    
    const tagsStr = tags.length > 0 ? tags.join(', ') : '';
    const formattedRatio = canvasAspectRatio.replace('/', ':');
    
    const prompt = `Subject: '${text}', Aspect ratio: '${formattedRatio}', Important instructions: '${tagsStr}'`;
    
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    addToast('Prompt copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGeneratePuter = async (text: string, id: string) => {
    if (!(window as any).puter) {
      addToast('Puter.js is not loaded', 'error');
      return;
    }
    
    setGeneratingId(id);
    
    let tags = [];
    if (textPlacement !== 'none') {
      tags.push(`Leave empty space at the ${textPlacement} for text`);
    }
    if (selectedEnhancers.length > 0) {
      tags = [...tags, ...selectedEnhancers];
    }
    if (!tags.some(t => t.toLowerCase().includes('no text'))) {
      tags.push('Strictly no text, no watermarks, no logos');
    }
    const tagsStr = tags.length > 0 ? tags.join(', ') : '';
    const formattedRatio = canvasAspectRatio.replace('/', ':');
    
    const prompt = `Subject: '${text}', Aspect ratio: '${formattedRatio}', Important instructions: '${tagsStr}'`;

    try {
      const imageElement = await (window as any).puter.ai.txt2img(prompt, { model: 'nano-banana' });
      if (imageElement && imageElement.src) {
        updateElement(id, {
          content: imageElement.src,
          type: 'image'
        });
        addToast('Image generated successfully!', 'success');
      } else {
        throw new Error('No image returned');
      }
    } catch (error) {
      console.error('Error generating image via Puter:', error);
      addToast('Failed to generate image', 'error');
    } finally {
      setGeneratingId(null);
    }
  };

  const handleGenerateCloudflare = async (text: string, id: string) => {
    if (!cloudflareWorkerUrl) {
      addToast('Please set Cloudflare Worker URL in settings first', 'error');
      setShowSettings(true);
      return;
    }
    
    setCfGeneratingId(id);
    
    let tags = [];
    if (textPlacement !== 'none') {
      tags.push(`Leave empty space at the ${textPlacement} for text`);
    }
    if (selectedEnhancers.length > 0) {
      tags = [...tags, ...selectedEnhancers];
    }
    if (!tags.some(t => t.toLowerCase().includes('no text'))) {
      tags.push('Strictly no text, no watermarks, no logos');
    }
    const tagsStr = tags.length > 0 ? tags.join(', ') : '';
    const formattedRatio = canvasAspectRatio.replace('/', ':');
    
    const prompt = `Subject: '${text}', Aspect ratio: '${formattedRatio}', Important instructions: '${tagsStr}'`;

    try {
      const response = await fetch(cloudflareWorkerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      updateElement(id, {
        content: url,
        type: 'image'
      });
      addToast('Image generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating image via Cloudflare:', error);
      addToast('Failed to generate image', 'error');
    } finally {
      setCfGeneratingId(null);
    }
  };

  const handleGenerateGeminiVoice = async (text: string, placeholderId: string) => {
    if (!geminiApiKey) {
      addToast('Please set Gemini API Key in settings first', 'error');
      setShowSettings(true);
      return;
    }
    
    if (!text) {
      addToast('Cannot generate voice without text', 'error');
      return;
    }

    try {
      setGeminiGeneratingId(placeholderId);
      
      const res = await fetch('/api/gemini-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: geminiApiKey,
          text: text,
          model: geminiModel,
          voice: 'Kore' // Default voice
        })
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      if (!data.audio) throw new Error('No audio returned');

      const audioUrl = `data:audio/wav;base64,${data.audio}`;
      
      const placeholder = elements.find(el => el.id === placeholderId);
      // We need to find the text element paired with this placeholder
      const pair = pairs.find(p => p.placeholder.id === placeholderId);
      if (pair && pair.text) {
        updateElement(pair.text.id, {
          ttsAudioUrl: audioUrl,
          ttsVoice: 'gemini'
        });
        addToast('Voice generated successfully!', 'success');
      } else {
         addToast('No text element found to attach voice to', 'error');
      }
    } catch (error: any) {
      console.error('Error generating voice via Gemini:', error);
      addToast(error.message || 'Failed to generate voice', 'error');
    } finally {
      setGeminiGeneratingId(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, elementId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      updateElement(elementId, { 
        content: url,
        type: isVideo ? 'video' : 'image'
      });
      addToast('Media added to placeholder', 'success');
    }
  };

  const [isBulkGenerating, setIsBulkGenerating] = useState(false);

  const handleBulkGenerate = async (service: 'puter' | 'cloudflare' | 'gemini') => {
    if (service === 'cloudflare' && !cloudflareWorkerUrl) {
      addToast('Please set Cloudflare Worker URL in settings first', 'error');
      setShowSettings(true);
      return;
    }
    
    if (service === 'puter' && !(window as any).puter) {
      addToast('Puter.js is not loaded', 'error');
      return;
    }
    
    if (service === 'gemini' && !geminiApiKey) {
      addToast('Please set Gemini API Key in settings first', 'error');
      setShowSettings(true);
      return;
    }

    const placeholdersToGenerate = pairs.filter(p => !p.placeholder.content);
    if (placeholdersToGenerate.length === 0) {
      addToast('No empty placeholders found', 'info');
      return;
    }

    setIsBulkGenerating(true);
    addToast(`Starting bulk generation for ${placeholdersToGenerate.length} placeholders...`, 'info');

    for (let i = 0; i < placeholdersToGenerate.length; i++) {
      const { placeholder, text } = placeholdersToGenerate[i];
      
      // If service is Gemini and we successfully turned it to audio, it's not a placeholder anymore,
      // but here we just try to generate it.
      if (placeholder.content && service !== 'gemini') continue; 

      const textContent = text ? text.content : '';
      
      try {
        if (service === 'puter') {
          await handleGeneratePuter(textContent, placeholder.id);
        } else if (service === 'cloudflare') {
          await handleGenerateCloudflare(textContent, placeholder.id);
        } else if (service === 'gemini') {
          await handleGenerateGeminiVoice(textContent, placeholder.id);
        }
      } catch (err) {
        console.error(`Error in bulk generation for placeholder ${placeholder.id}:`, err);
      }
      
      // Delay to avoid rate limiting
      if (i < placeholdersToGenerate.length - 1) {
         let delayMs = 4000;
         if (service === 'gemini' && geminiFreeTier) {
           delayMs = 5000; // Free tier rate limit (15 RPM)
         } else if (service === 'gemini' && !geminiFreeTier) {
           delayMs = 1000; // Pay-as-you-go limit is much higher
         }
         await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    setIsBulkGenerating(false);
    addToast('Bulk generation complete', 'success');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col z-[100]"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-panel-border bg-app-bg shrink-0 flex-wrap gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] shrink-0">
            <ImageIcon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-text-main truncate">Placeholder Gallery</h1>
            <p className="text-xs sm:text-sm text-text-muted truncate">Generate prompts and add media for your timeline placeholders</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 sm:hidden flex items-center justify-center bg-button-bg hover:bg-button-hover border border-panel-border rounded-xl text-text-muted transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto flex-wrap">
          <div className="flex flex-wrap items-center gap-2 flex-1 sm:flex-initial">
            <button
              onClick={() => handleBulkGenerate('cloudflare')}
              disabled={isBulkGenerating || pairs.filter(p => !p.placeholder.content).length === 0}
              className="bg-orange-600 hover:bg-orange-500 border border-transparent rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs text-white outline-none focus:border-panel-border whitespace-nowrap disabled:opacity-50 flex items-center gap-1.5"
            >
              {isBulkGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              Bulk Gen (CF)
            </button>
            <button
              onClick={() => handleBulkGenerate('puter')}
              disabled={isBulkGenerating || pairs.filter(p => !p.placeholder.content).length === 0}
              className="bg-[var(--color-accent)] hover:opacity-80 border border-transparent rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs text-text-main outline-none focus:border-panel-border whitespace-nowrap disabled:opacity-50 flex items-center gap-1.5"
            >
              {isBulkGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              Bulk Gen (Puter)
            </button>
            <button
              onClick={() => handleBulkGenerate('gemini')}
              disabled={isBulkGenerating || pairs.filter(p => !p.placeholder.content).length === 0}
              className="bg-blue-600 hover:bg-blue-500 border border-transparent rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs text-white outline-none focus:border-panel-border whitespace-nowrap disabled:opacity-50 flex items-center gap-1.5"
            >
              {isBulkGenerating ? <Loader2 size={12} className="animate-spin" /> : <Mic size={12} />}
              Bulk Gen (Voice)
            </button>
          </div>
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <span className="text-xs sm:text-sm text-text-muted font-medium whitespace-nowrap hidden sm:inline">Placement:</span>
            <div className="w-full sm:w-36">
              <CustomSelect 
                value={textPlacement}
                onChange={(val) => setTextPlacement(val)}
                options={[
                  { value: 'none', label: 'Anywhere' },
                  { value: 'top', label: 'Top' },
                  { value: 'center', label: 'Center' },
                  { value: 'bottom', label: 'Bottom' }
                ]}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-1 sm:flex-initial relative" ref={enhancersMenuRef}>
            <span className="text-xs sm:text-sm text-text-muted font-medium whitespace-nowrap hidden sm:inline">Enhancers:</span>
            <button
              onClick={() => setShowEnhancersMenu(!showEnhancersMenu)}
              className="bg-button-bg border border-panel-border rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm text-text-main outline-none focus:border-panel-border w-full sm:w-48 flex items-center justify-between"
            >
              <span className="truncate">
                {selectedEnhancers.length === 0 ? 'None' : `${selectedEnhancers.length} selected`}
              </span>
              <ChevronDown size={14} className="opacity-50" />
            </button>
            
            {showEnhancersMenu && (
              <div className="absolute top-full right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-app-bg border border-panel-border rounded-xl shadow-2xl z-50 p-2 custom-scrollbar">
                {PROMPT_ENHANCERS.map(enhancer => {
                  const isSelected = selectedEnhancers.includes(enhancer.value);
                  const isNone = enhancer.value === '';
                  return (
                    <div 
                      key={enhancer.label} 
                      onClick={() => toggleEnhancer(enhancer.value)}
                      className={`px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between mb-1 last:mb-0 transition-colors ${
                        (isNone && selectedEnhancers.length === 0) || isSelected
                          ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium'
                          : 'text-text-main hover:bg-button-bg'
                      }`}
                    >
                      <span>{enhancer.label}</span>
                      {((isNone && selectedEnhancers.length === 0) || isSelected) && (
                        <Check size={14} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 hidden sm:flex items-center justify-center bg-button-bg hover:bg-button-hover border border-panel-border rounded-xl text-text-muted transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {pairs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-muted">
            <ImageIcon size={48} className="mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No Placeholders Found</h2>
            <p>Generate a script or add placeholders to the timeline to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1600px] mx-auto">
            {pairs.map(({ placeholder, text }, index) => {
              const hasMedia = placeholder.content && placeholder.content !== '';
              const isVideo = placeholder.type === 'video';
              
              return (
                <div key={placeholder.id} className="bg-app-bg border border-panel-border rounded-2xl overflow-hidden shadow-xl flex flex-col">
                  {/* Media Preview Area */}
                  <div className="aspect-video relative bg-[#0a0a0a] group border-b border-panel-border">
                    {hasMedia ? (
                      <>
                        {isVideo ? (
                          <video src={placeholder.content} className="w-full h-full object-cover" controls />
                        ) : (
                          <img src={placeholder.content} alt="Placeholder media" className="w-full h-full object-cover" />
                        )}
                        <label className="absolute inset-0 z-10 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                          <input 
                            type="file" 
                            accept="image/*,video/*" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, placeholder.id)}
                          />
                          <div className="flex flex-col items-center gap-2 text-white">
                            <Upload size={24} />
                            <span className="text-sm font-semibold">Replace Media</span>
                          </div>
                        </label>
                      </>
                    ) : (
                      <label className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group-hover:bg-white/5">
                        <input 
                          type="file" 
                          accept="image/*,video/*" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, placeholder.id)}
                        />
                        <div className="w-12 h-12 rounded-full bg-button-bg flex items-center justify-center mb-3 text-text-muted group-hover:text-white transition-colors group-hover:bg-[var(--color-accent)]">
                          <Upload size={20} />
                        </div>
                        <p className="text-sm font-semibold text-text-main group-hover:text-white">Click to add media</p>
                        <p className="text-xs text-text-muted mt-1">Image or Video</p>
                      </label>
                    )}
                    
                    <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-semibold text-white border border-white/10 shadow-lg">
                      Scene {index + 1}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex flex-col flex-1 gap-4">
                    <div className="flex-1">
                      <div className="text-[10px] text-text-muted uppercase font-semibold tracking-wider mb-2 flex items-center gap-1.5">
                        <Wand2 size={12} />
                        Associated Text
                      </div>
                      <p className="text-sm text-text-main leading-relaxed">
                        {text ? text.content : 'No text associated.'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleGeneratePuter(text ? text.content : '', placeholder.id)}
                        disabled={!text || generatingId === placeholder.id}
                        className="w-full py-2.5 bg-[var(--color-accent)] hover:opacity-90 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {generatingId === placeholder.id ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles size={16} />
                            Generate with Puter
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleGenerateCloudflare(text ? text.content : '', placeholder.id)}
                        disabled={!text || cfGeneratingId === placeholder.id}
                        className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {cfGeneratingId === placeholder.id ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles size={16} />
                            Generate with Cloudflare
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleGenerateGeminiVoice(text ? text.content : '', placeholder.id)}
                        disabled={!text || geminiGeneratingId === placeholder.id}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {geminiGeneratingId === placeholder.id ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Mic size={16} />
                            Generate Voice (Gemini)
                          </>
                        )}
                      </button>
                      
                      {text && text.ttsAudioUrl && (
                        <div className="w-full flex flex-col gap-1.5 mt-1">
                           <span className="text-[10px] text-text-muted uppercase font-semibold flex items-center gap-1"><Mic size={10} /> Voice Preview</span>
                           <audio src={text.ttsAudioUrl} controls className="w-full h-8" />
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleCopyPrompt(text ? text.content : '', placeholder.id)}
                        disabled={!text}
                        className="w-full py-2.5 bg-button-bg hover:bg-button-hover border border-panel-border rounded-xl text-sm font-semibold text-text-main transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {copiedId === placeholder.id ? (
                          <>
                            <Check size={16} className="text-green-400" />
                            <span className="text-green-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copy Prompt
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
