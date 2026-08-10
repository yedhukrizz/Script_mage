import React, { useState } from 'react';
import { X, Copy, Terminal, Lock, Unlock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { v4 as uuidv4 } from 'uuid';

const ENHANCEMENTS = [
  'Hooks', 'Viral worthy', 'ADHD style', 'Value packed', 
  'Storytelling', 'Action-oriented', 'Educational', 'Humorous', 
  'Inspiring', 'Minimalist', 'Punchy', 'Trendy',
  'Cinematic', 'Emotional', 'Fast-paced', 'Slow & ASMR',
  'Aesthetic', 'Documentary', 'Sales pitch', 'Relatable',
  'Tutorial style', 'Vlog style', 'Behind the scenes', 'Shocking',
  'Professional', 'Casual', 'Mysterious', 'Gen-Z', 
  'Corporate', 'Funny', 'Epic', 'Chill', 'Direct Response'
];

export function ScriptModal({ onClose }: { onClose: () => void }) {
  const [script, setScript] = useState('');
  const [position, setPosition] = useState<'top' | 'middle' | 'bottom'>('middle');
  const [videoInstruction, setVideoInstruction] = useState('');
  const [enhancements, setEnhancements] = useState<string[]>([]);
  const [lockColor, setLockColor] = useState(false);
  const [lockedColor, setLockedColor] = useState('#ffffff');
  const [generatePlaceholders, setGeneratePlaceholders] = useState(false);
  const addElement = useStore(state => state.addElement);
  const duration = useStore(state => state.duration);
  const setDuration = useStore(state => state.setDuration);
  const canvasAspectRatio = useStore((state) => state.canvasAspectRatio);
  const defaults = useStore(state => state.defaults.text);
  const mode = useStore(state => state.scriptModalMode);
  const addToast = useStore(state => state.addToast);

  const aiPrompt = `Generate a video script for my app.${videoInstruction ? `\nVideo Topic/Instruction: ${videoInstruction}` : ''}${
  enhancements.length > 0 ? `\nEnhance the script with these qualities: ${enhancements.join(', ')}` : ''
}

IMPORTANT: Adjust the timing according to the length of the text snippets. Longer text should get more screen time, shorter text should get less time.

Use the following exact format:
[MM:SS - MM:SS] "Text to display" size=<number>${lockColor ? '' : ' color=<#hex>'}

Example:
[00:00 - 0:02] "Welcome to our video" size=80${lockColor ? '' : ' color=#ffffff'}
[00:02 - 0:05] "Subscribe for more" size=120${lockColor ? '' : ' color=#ffcc00'}

Rules:
- Keep it to plain text, no markdown.
- Only output the bracketed script lines, no intro or outro text.
- Put each clip on a new line.${lockColor ? '\n- DO NOT output a color attribute.' : ''}`;

  const copyPrompt = () => {
    navigator.clipboard.writeText(aiPrompt);
    addToast('Copied AI Prompt to clipboard!', 'success');
  };

  const handleGenerate = () => {
    const regex = /\[(\d{1,2}):(\d{2})(?:\.(\d+))?\s*-\s*(\d{1,2}):(\d{2})(?:\.(\d+))?\]\s*"([^"]+)"(?:\s+size=(\d+))?(?:\s+color=(#[A-Fa-f0-9]{3,6}))?/g;

    const getCenteredTextProps = () => {
      const cw = canvasAspectRatio === '16/9' ? 1920 : canvasAspectRatio === '9/16' ? 1080 : 1080;
      const ch = canvasAspectRatio === '16/9' ? 1080 : canvasAspectRatio === '9/16' ? 1920 : canvasAspectRatio === '4/5' ? 1350 : 1080;
      
      const padding = 120;
      let width = cw - padding * 2;
      if (cw > ch && width > 1200) {
        width = 1200;
      }
      const height = 300; // Enough for 1-2 lines
      const x = (cw - width) / 2;
      
      let y = (ch - height) / 2;
      if (position === 'top') {
        y = padding;
      } else if (position === 'bottom') {
        y = ch - height - padding;
      }

      return { x, y, width, height };
    };

    const matches = Array.from(script.matchAll(regex));
    let maxEndTime = 0;

    matches.forEach((match: any) => {
      if (match) {
        const [_, startM, startS, startMs, endM, endS, endMs, text, sizeStr, colorStr] = match;
        
        // ... time parsing
        let startSec = parseInt(startM, 10) * 60 + parseInt(startS, 10);
        let endSec = parseInt(endM, 10) * 60 + parseInt(endS, 10);
        
        const startTime = startSec * 1000 + (startMs ? parseInt(startMs, 10) : 0);
        const endTime = endSec * 1000 + (endMs ? parseInt(endMs, 10) : 0);
        
        if (endTime > maxEndTime) {
          maxEndTime = endTime;
        }

        let size = sizeStr ? parseInt(sizeStr, 10) : 120;
        
        // Prevent font size from being insanely large (cap at 200)
        size = Math.min(size, 200);

        const color = lockColor ? lockedColor : (colorStr || '#ffffff');

        if (generatePlaceholders) {
          const cw = canvasAspectRatio === '16/9' ? 1920 : canvasAspectRatio === '9/16' ? 1080 : 1080;
          const ch = canvasAspectRatio === '16/9' ? 1080 : canvasAspectRatio === '9/16' ? 1920 : canvasAspectRatio === '4/5' ? 1350 : 1080;
          
          const placeholderDefaults = useStore.getState().defaults.placeholder || { mediaDimness: 0.5, animationIn: 'fade', animationOut: 'fade', mediaEffect: 'none' };
          addElement({
            id: uuidv4(),
            type: 'image',
            content: '', // Empty placeholder
            x: 0,
            y: 0,
            width: cw,
            height: ch,
            rotation: 0,
            opacity: 1, // Opacity is for fade animation
            mediaDimness: placeholderDefaults.mediaDimness, // Global dimness
            startTime: Math.max(0, startTime),
            endTime: endTime,
            animationIn: placeholderDefaults.animationIn, // Global transition
            animationOut: placeholderDefaults.animationOut,
            easing: 'ease-in-out',
            trackColor: '#666666',
            isPlaceholder: true,
            mediaEffect: placeholderDefaults.mediaEffect, // Global effect
          });
        }

        // Add element
        addElement({
          id: uuidv4(),
          type: 'text',
          content: text.trim(),
          ...getCenteredTextProps(),
          rotation: 0,
          opacity: 1,
          startTime: Math.max(0, startTime),
          endTime: endTime,
          animationIn: defaults.animationIn,
          animationOut: defaults.animationOut,
          easing: defaults.easing,
          fontFamily: defaults.fontFamily || 'Instrument Sans',
          textEffect: defaults.textEffect || 'none',
          fontWeight: defaults.fontWeight || 600,
          color,
          fontSize: size,
          trackColor: `hsl(${Math.floor(Math.random() * 360)}, 60%, 50%)`
        });
      }
    });

    if (maxEndTime > duration) {
      setDuration(maxEndTime);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-app-bg text-text-main w-full h-full flex flex-col pointer-events-auto">
        <div className="flex items-center justify-between p-6 border-b border-panel-border shrink-0">
          <div className="font-semibold text-lg tracking-tight shrink-0 flex items-center gap-2 text-text-main">
             {mode === 'generate' ? 'Script Mage AI Configurator' : 'Script Mage Importer'}
           </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-button-bg border border-panel-border flex items-center justify-center text-text-muted hover:text-text-main hover:bg-button-hover transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto flex flex-col gap-6 p-6">
          {mode === 'generate' && (
            <div className="bg-panel-bg border border-panel-border rounded-lg p-5 text-sm text-text-muted shadow-sm flex flex-col gap-6 shrink-0 h-full">
              <div>
                <p className="mb-2 text-text-main font-medium text-base">How to generate a script:</p>
                <ol className="list-decimal pl-5 space-y-1 mb-2">
                  <li>Configure the video instructions below.</li>
                  <li>Copy the AI Prompt and paste it into ChatGPT, Gemini, or Claude.</li>
                  <li>Open the Paste Script menu (Terminal icon) and paste the returned script.</li>
                  <li>Click "Generate Clips" to populate the timeline.</li>
                </ol>
              </div>
              
              <div className="flex flex-col gap-6 h-full">
                <div className="flex flex-col gap-2 relative group flex-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-text-main flex items-center gap-2">
                    Video Instruction 
                    <span className="text-[9px] text-text-muted font-normal capitalize bg-button-bg px-2 py-0.5 rounded-full">Describe your vision</span>
                  </label>
                  <div className="relative h-full">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-accent)] via-purple-500 to-[var(--color-accent)] rounded-xl opacity-20 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none animate-gradient-bg bg-[length:200%_auto]" />
                    <textarea 
                      placeholder="e.g. A 15 second promo for a fitness app focusing on morning routines..." 
                      value={videoInstruction} 
                      onChange={e => setVideoInstruction(e.target.value)} 
                      className="w-full min-h-[350px] sm:min-h-[400px] h-full bg-app-bg border border-panel-border rounded-xl px-5 py-4 text-base text-text-main outline-none focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent)]/20 transition-all duration-300 ease-out resize-none shadow-inner relative z-10 leading-relaxed placeholder:text-text-muted/50"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-text-main">Enhancements</label>
                  <div className="flex gap-2 flex-wrap">
                    {ENHANCEMENTS.map(enh => (
                      <button 
                        key={enh} 
                        onClick={() => setEnhancements(prev => prev.includes(enh) ? prev.filter(e => e !== enh) : [...prev, enh])} 
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${enhancements.includes(enh) ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white' : 'bg-transparent border-panel-border text-text-muted hover:text-text-main hover:border-panel-border'}`}
                      >
                        {enh}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-text-main">Text Color</label>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setLockColor(!lockColor)} 
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${lockColor ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-transparent border-panel-border text-text-muted hover:text-text-main hover:border-panel-border'}`}
                    >
                      {lockColor ? <Lock size={14} /> : <Unlock size={14} />}
                      {lockColor ? 'Locked (Skip AI Color)' : 'Generated by AI'}
                    </button>
                    {lockColor && (
                      <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                        <input 
                          type="color" 
                          value={lockedColor} 
                          onChange={e => setLockedColor(e.target.value)} 
                          className="w-6 h-6 rounded cursor-pointer bg-transparent border-none p-0" 
                        />
                        <span className="text-xs text-text-muted uppercase font-medium">{lockedColor}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex flex-col gap-3 pt-5 border-t border-panel-border">
                  <span className="text-xs text-text-muted">Configure your settings then copy the prompt.</span>
                  <button onClick={copyPrompt} className="flex items-center justify-center gap-2 bg-text-main hover:opacity-80 text-app-bg px-5 py-2.5 rounded-md transition-colors font-semibold w-full">
                    <Copy size={16} />
                    Copy AI Prompt
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {mode === 'paste' && (
            <div className="flex flex-col gap-3 h-full pb-4">
              <div className="flex items-center justify-between shrink-0">
                <label className="text-sm font-semibold text-text-main flex items-center gap-2">
                  Paste Script Here
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-muted hover:text-text-main transition-colors">
                    <input 
                      type="checkbox" 
                      checked={generatePlaceholders} 
                      onChange={e => setGeneratePlaceholders(e.target.checked)}
                      className="accent-[var(--color-accent)] cursor-pointer"
                    />
                    Generate Placeholders
                  </label>
                  <div className="h-4 w-px bg-panel-border" />
                  <span className="text-[10px] text-text-muted font-bold tracking-wide uppercase">Position:</span>
                  <div className="flex bg-panel-bg rounded-md p-1 border border-panel-border">
                    {(['top', 'middle', 'bottom'] as const).map(pos => (
                      <button
                        key={pos}
                        onClick={() => setPosition(pos)}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${position === pos ? 'bg-[var(--color-accent)] text-white shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-button-bg/50'}`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <textarea
                className="w-full min-h-[300px] h-full bg-app-bg border border-panel-border rounded-lg p-5 text-base text-text-main font-mono outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all resize-none shadow-inner leading-relaxed flex-1"
                placeholder={'[00:00 - 00:03] "Hello World" size=48 color=#ffffff\n...'}
                value={script}
                onChange={e => setScript(e.target.value)}
              />
              <div className="flex justify-end gap-3 mt-2 shrink-0">
                <button onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-text-muted hover:text-text-main transition-colors border border-transparent hover:border-panel-border rounded-md">
                  Cancel
                </button>
                <button onClick={handleGenerate} className="px-6 py-2.5 bg-[var(--color-accent)] hover:opacity-80 text-white text-sm font-semibold rounded-md transition-colors shadow-sm">
                  Generate Clips
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
