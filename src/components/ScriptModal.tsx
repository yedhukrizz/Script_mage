import React, { useState } from 'react';
import { 
  X, Copy, Terminal, Lock, Unlock, Info, Sparkles, 
  Check, FileText, Sliders, Wand2, ChevronDown, ChevronUp, Palette, Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { v4 as uuidv4 } from 'uuid';

const ENHANCEMENTS = [
  'Hooks', 'Viral worthy', 'ADHD style', 'Value packed', 
  'Storytelling', 'Action-oriented', 'Educational', 'Humorous', 
  'Inspiring', 'Minimalist', 'Punchy', 'Trendy',
  'Cinematic', 'Emotional', 'Fast-paced', 'Slow & ASMR',
  'Aesthetic', 'Documentary', 'Sales pitch', 'Relatable',
  'Tutorial style', 'Vlog style', 'Gen-Z', 'Epic', 'Direct Response'
];

const PRESET_IDEAS = [
  '15s Promo for a productivity app focusing on daily habits',
  'Viral Tech Review with fast hooks and bold callouts',
  'Motivational storytelling quote with cinematic flow',
  'Quick 3-step tutorial with punchy key points'
];

const QUICK_COLORS = ['#ffffff', '#ffcc00', '#00f3ff', '#ff0055', '#00ff9d', '#ff9900'];

export function ScriptModal({ onClose }: { onClose: () => void }) {
  const [script, setScript] = useState('');
  const [position, setPosition] = useState<'top' | 'middle' | 'bottom'>('middle');
  const [videoInstruction, setVideoInstruction] = useState('');
  const [enhancements, setEnhancements] = useState<string[]>([]);
  const [lockColor, setLockColor] = useState(false);
  const [lockedColor, setLockedColor] = useState('#ffffff');
  const [requestAiImages, setRequestAiImages] = useState(false);
  const [generatePlaceholders, setGeneratePlaceholders] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showEnhancements, setShowEnhancements] = useState(true);

  const [copied, setCopied] = useState(false);
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
[MM:SS - MM:SS] "Text to display" size=<number>${lockColor ? '' : ' color=<#hex>'}${requestAiImages ? ' image="<public_url>"' : ''}

Example:
[00:00 - 0:02] "Welcome to our video" size=80${lockColor ? '' : ' color=#ffffff'}${requestAiImages ? ' image="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=80"' : ''}
[00:02 - 0:05] "Subscribe for more" size=120${lockColor ? '' : ' color=#ffcc00'}${requestAiImages ? ' image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80"' : ''}

Rules:
- Keep it to plain text, no markdown.
- Only output the bracketed script lines, no intro or outro text.
- Put each clip on a new line.${lockColor ? '\n- DO NOT output a color attribute.' : ''}${requestAiImages ? '\n- For the image property, provide a real, working public image URL (e.g. from Unsplash) relevant to the clip.' : ''}`;

  const copyPrompt = () => {
    navigator.clipboard.writeText(aiPrompt);
    addToast('Copied AI Prompt to clipboard!', 'success');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertSample = () => {
    const sample = `[00:00 - 00:02.5] "Welcome to Script Mage" size=110 color=#ffffff\n[00:02.5 - 00:05] "Create Motion Graphics Fast" size=130 color=#ffcc00\n[00:05 - 00:08] "Export High Quality Video" size=100 color=#00f3ff`;
    setScript(sample);
    addToast('Sample script loaded!', 'info');
  };

  const handleGenerate = () => {
    if (!script.trim()) {
      addToast('Please paste a script first', 'error');
      return;
    }

    const regex = /\[(\d{1,2}):(\d{2})(?:\.(\d+))?\s*-\s*(\d{1,2}):(\d{2})(?:\.(\d+))?\]\s*"([^"]+)"(?:\s+size=(\d+))?(?:\s+color=(#[A-Fa-f0-9]{3,6}))?(?:\s+image=["']?([^"'\s>]+)["']?)?/gi;

    const getCenteredTextProps = () => {
      const cw = canvasAspectRatio === '16/9' ? 1920 : canvasAspectRatio === '9/16' ? 1080 : 1080;
      const ch = canvasAspectRatio === '16/9' ? 1080 : canvasAspectRatio === '9/16' ? 1920 : canvasAspectRatio === '4/5' ? 1350 : 1080;
      
      const padding = 120;
      let width = cw - padding * 2;
      if (cw > ch && width > 1200) {
        width = 1200;
      }
      const height = 300;
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

    if (matches.length === 0) {
      addToast('No valid script clips found. Check formatting!', 'error');
      return;
    }

    matches.forEach((match: any) => {
      if (match) {
        const [_, startM, startS, startMs, endM, endS, endMs, text, sizeStr, colorStr, imageUrl] = match;
        
        let startSec = parseInt(startM, 10) * 60 + parseInt(startS, 10);
        let endSec = parseInt(endM, 10) * 60 + parseInt(endS, 10);
        
        const startTime = startSec * 1000 + (startMs ? parseInt(startMs, 10) : 0);
        const endTime = endSec * 1000 + (endMs ? parseInt(endMs, 10) : 0);
        
        if (endTime > maxEndTime) {
          maxEndTime = endTime;
        }

        let size = sizeStr ? parseInt(sizeStr, 10) : 120;
        size = Math.min(size, 200);

        const color = lockColor ? lockedColor : (colorStr || '#ffffff');

        if (generatePlaceholders || imageUrl) {
          const cw = canvasAspectRatio === '16/9' ? 1920 : canvasAspectRatio === '9/16' ? 1080 : 1080;
          const ch = canvasAspectRatio === '16/9' ? 1080 : canvasAspectRatio === '9/16' ? 1920 : canvasAspectRatio === '4/5' ? 1350 : 1080;
          
          const placeholderDefaults = useStore.getState().defaults.placeholder || { mediaDimness: 0.5, animationIn: 'fade', animationOut: 'fade', mediaEffect: 'none' };
          addElement({
            id: uuidv4(),
            type: 'image',
            content: imageUrl || '',
            x: 0,
            y: 0,
            width: cw,
            height: ch,
            rotation: 0,
            opacity: 1,
            mediaDimness: placeholderDefaults.mediaDimness,
            startTime: Math.max(0, startTime),
            endTime: endTime,
            animationIn: placeholderDefaults.animationIn,
            animationOut: placeholderDefaults.animationOut,
            easing: 'ease-in-out',
            trackColor: '#666666',
            isPlaceholder: !imageUrl,
            mediaEffect: placeholderDefaults.mediaEffect,
          });
        }

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

    addToast(`Successfully added ${matches.length} clips!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 backdrop-blur-xl p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-panel-bg/85 backdrop-blur-2xl border border-white/10 text-text-main w-full max-w-5xl rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col my-auto max-h-[92vh] sm:max-h-[88vh] overflow-hidden pointer-events-auto relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-panel-bg/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)] shadow-sm">
              {mode === 'generate' ? <Sparkles size={18} /> : <Terminal size={18} />}
            </div>
            <div>
              <h2 className="font-semibold text-sm sm:text-base tracking-tight text-text-main flex items-center gap-2">
                {mode === 'generate' ? 'Script Mage AI Configurator' : 'Script Mage Importer'}
              </h2>
              <p className="text-[11px] text-text-muted hidden sm:block">
                {mode === 'generate' ? 'Craft custom video prompts for ChatGPT or Gemini' : 'Convert formatted script lines into animated clips'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border ${showInfo ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]/40 text-[var(--color-accent)] shadow-sm' : 'bg-white/5 hover:bg-white/10 border-white/10 text-text-muted hover:text-text-main'}`}
              title="Toggle Instructions"
            >
              <Info size={16} />
              <span className="hidden sm:inline">Guide</span>
            </button>
            <button 
              onClick={onClose} 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-text-muted hover:text-text-main transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Info Guide Popover / Collapsible */}
        {showInfo && (
          <div className="bg-panel-bg/90 backdrop-blur-md border-b border-white/10 p-4 sm:p-5 text-xs sm:text-sm text-text-muted animate-in slide-in-from-top-2 duration-200 shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Sparkles size={18} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-text-main text-sm mb-1">How it works:</h4>
                  <ol className="list-decimal pl-4 space-y-1 text-xs text-text-muted">
                    <li>Describe your video vision or select tone enhancements below.</li>
                    <li>Copy the generated prompt and send it to ChatGPT, Gemini, or Claude.</li>
                    <li>Open <strong>Paste Script</strong> (Terminal icon) and paste the AI output.</li>
                    <li>Click <strong>Generate Clips</strong> to automatically populate your canvas timeline.</li>
                  </ol>
                </div>
              </div>
              <button onClick={() => setShowInfo(false)} className="text-text-muted hover:text-text-main text-xs font-medium">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-5">
          {mode === 'generate' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
              
              {/* Left Column: Instructions & Preset Ideas (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider font-bold text-text-main flex items-center gap-1.5">
                      <Wand2 size={14} className="text-[var(--color-accent)]" />
                      Video Topic / Vision
                    </label>
                    <span className="text-[10px] text-text-muted bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
                      Custom Prompt
                    </span>
                  </div>
                  
                  <textarea 
                    placeholder="e.g. A 15-second promo for a morning routine fitness app with energetic hooks and bold typography..." 
                    value={videoInstruction} 
                    onChange={e => setVideoInstruction(e.target.value)} 
                    className="w-full h-36 sm:h-44 bg-black/40 border border-white/10 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm text-text-main outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all resize-none shadow-inner leading-relaxed placeholder:text-text-muted/40 font-sans"
                  />
                </div>

                {/* Preset Prompt Ideas */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-medium text-text-muted">Quick Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_IDEAS.map((idea, idx) => (
                      <button
                        key={idx}
                        onClick={() => setVideoInstruction(idea)}
                        className="text-[11px] text-left bg-white/5 hover:bg-white/10 border border-white/10 text-text-muted hover:text-text-main px-2.5 py-1.5 rounded-xl transition-all truncate max-w-xs backdrop-blur-sm"
                      >
                        {idea}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone & Quality Enhancements */}
                <div className="flex flex-col gap-2.5 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setShowEnhancements(!showEnhancements)}
                      className="text-xs font-semibold text-text-main flex items-center gap-1.5 hover:text-[var(--color-accent)] transition-colors"
                    >
                      <Sliders size={14} />
                      Tone & Style Qualities ({enhancements.length})
                      {showEnhancements ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {enhancements.length > 0 && (
                      <button onClick={() => setEnhancements([])} className="text-[10px] text-text-muted hover:text-red-400">
                        Clear All
                      </button>
                    )}
                  </div>

                  {showEnhancements && (
                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 custom-scrollbar bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl">
                      {ENHANCEMENTS.map(enh => {
                        const isSelected = enhancements.includes(enh);
                        return (
                          <button 
                            key={enh} 
                            onClick={() => setEnhancements(prev => isSelected ? prev.filter(e => e !== enh) : [...prev, enh])} 
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all border ${isSelected ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/20' : 'bg-white/5 border-white/10 text-text-muted hover:text-text-main hover:bg-white/10'}`}
                          >
                            {enh}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Text Color & AI Prompt Output Preview (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-4 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
                
                <div className="flex flex-col gap-4">
                  {/* Color Lock Toggle */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-text-main flex items-center gap-1.5">
                        <Palette size={14} />
                        Media & Styling
                      </label>
                      
                      <button 
                        onClick={() => setLockColor(!lockColor)} 
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all border ${lockColor ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-white/5 border-white/10 text-text-muted hover:text-text-main'}`}
                      >
                        {lockColor ? <Lock size={12} /> : <Unlock size={12} />}
                        {lockColor ? 'Fixed Color' : 'AI Auto-Color'}
                      </button>
                    </div>

                    {lockColor && (
                      <div className="flex flex-col gap-2 p-3 bg-black/40 border border-white/10 rounded-xl animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-text-muted">Choose Fixed Color:</span>
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="color" 
                              value={lockedColor} 
                              onChange={e => setLockedColor(e.target.value)} 
                              className="w-5 h-5 rounded cursor-pointer bg-transparent border-none p-0" 
                            />
                            <span className="text-[11px] font-mono font-medium text-text-main uppercase">{lockedColor}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                          {QUICK_COLORS.map(c => (
                            <button
                              key={c}
                              onClick={() => setLockedColor(c)}
                              style={{ backgroundColor: c }}
                              className={`w-6 h-6 rounded-full border transition-transform ${lockedColor === c ? 'scale-110 border-white ring-2 ring-[var(--color-accent)]' : 'border-white/20 hover:scale-105'}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Images Toggle */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <label className="text-xs font-semibold text-text-main flex items-center gap-1.5">
                      <ImageIcon size={14} /> 
                      Request AI Image URLs
                    </label>
                    
                    <button 
                      onClick={() => setRequestAiImages(!requestAiImages)} 
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all border ${requestAiImages ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/10 text-text-muted hover:text-text-main'}`}
                    >
                      {requestAiImages ? 'Included' : 'Off'}
                    </button>
                  </div>

                  {/* AI Prompt Preview Box */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Generated AI Prompt</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-text-muted font-mono">{aiPrompt.length} chars</span>
                        <button
                          onClick={copyPrompt}
                          className="text-[10px] text-[var(--color-accent)] hover:underline font-semibold flex items-center gap-1 bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 px-2 py-0.5 rounded-lg transition-all"
                        >
                          {copied ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                    <pre className="w-full h-36 sm:h-40 bg-black/50 border border-white/10 rounded-2xl p-3 text-[11px] text-text-muted font-mono overflow-y-auto whitespace-pre-wrap custom-scrollbar select-all">
                      {aiPrompt}
                    </pre>
                  </div>
                </div>

              </div>

            </div>
          )}

          {mode === 'paste' && (
            <div className="flex flex-col gap-4">
              
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/30 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl">
                
                {/* Custom Toggle Switch for Placeholders */}
                <button
                  type="button"
                  onClick={() => setGeneratePlaceholders(!generatePlaceholders)}
                  className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-text-main group"
                >
                  <div className={`w-9 h-5 rounded-full p-0.5 transition-colors relative ${generatePlaceholders ? 'bg-[var(--color-accent)]' : 'bg-white/10 border border-white/15'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${generatePlaceholders ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <span>Generate Media Placeholders</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
                  <span className="text-xs text-text-muted font-medium">Text Position:</span>
                  <div className="flex bg-black/40 rounded-xl p-1 border border-white/10">
                    {(['top', 'middle', 'bottom'] as const).map(pos => (
                      <button
                        key={pos}
                        onClick={() => setPosition(pos)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${position === pos ? 'bg-[var(--color-accent)] text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleInsertSample}
                    className="text-xs text-[var(--color-accent)] hover:underline font-medium px-2 py-1 rounded-lg hover:bg-[var(--color-accent)]/15 transition-colors"
                  >
                    Sample
                  </button>
                </div>
              </div>

              {/* Text Area */}
              <div className="flex flex-col gap-1">
                <textarea
                  className="w-full h-64 sm:h-80 bg-black/40 border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-text-main font-mono outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all resize-none shadow-inner leading-relaxed custom-scrollbar placeholder:text-text-muted/40"
                  placeholder={'Paste output from AI here:\n[00:00 - 00:02.5] "Welcome to Script Mage" size=110 color=#ffffff\n[00:02.5 - 00:05] "Create Motion Graphics Fast" size=130 color=#ffcc00'}
                  value={script}
                  onChange={e => setScript(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  onClick={onClose} 
                  className="px-4 py-2.5 text-xs sm:text-sm font-medium text-text-muted hover:text-text-main border border-white/10 hover:bg-white/5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleGenerate} 
                  className="px-5 py-2.5 bg-[var(--color-accent)] hover:opacity-90 active:scale-[0.99] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-lg flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  Generate Clips
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Integrated Glassmorphic Footer Bar for Generate Mode (outside scroll area, fixed at modal bottom) */}
        {mode === 'generate' && (
          <div className="shrink-0 border-t border-white/10 bg-panel-bg/90 backdrop-blur-2xl px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 z-20">
            <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
              <Sparkles size={15} className="text-[var(--color-accent)] shrink-0" />
              <span>Copy prompt to ChatGPT or Gemini, then switch to <strong>Paste Script</strong>.</span>
            </div>
            <button 
              onClick={copyPrompt} 
              className={`w-full sm:w-auto ml-auto flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl transition-all font-semibold text-xs sm:text-sm shadow-xl ${
                copied 
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-500/50' 
                  : 'bg-[var(--color-accent)] hover:opacity-90 active:scale-[0.98] text-white shadow-[var(--color-accent)]/30 ring-1 ring-white/20'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy AI Prompt'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

