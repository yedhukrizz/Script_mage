import React from 'react';
import { useStore } from '../store/useStore';
import { X, Shuffle, Upload, Settings, Copy, Check, ExternalLink, AlertTriangle } from 'lucide-react';

const workerCode = `export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Only POST requests are accepted', { status: 405 });
    }

    try {
      const { prompt } = await request.json();
      if (!prompt) return new Response('Prompt is required', { status: 400 });

      // Balanced Model: SDXL Base (High quality, generous limits)
      const response = await env.AI.run(
        '@cf/stabilityai/stable-diffusion-xl-base-1.0',
        { prompt }
      );

      return new Response(response, {
        headers: {
          'content-type': 'image/png',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (e) {
      return new Response(e.message, { status: 500 });
    }
  }
};`;

function CloudflareSetupGuide() {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(workerCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 p-4 rounded-xl border border-panel-border bg-black/20 text-sm">
      <h4 className="font-semibold text-text-main mb-2">How to Setup a Free Cloudflare AI Worker</h4>
      <ol className="list-decimal pl-4 text-text-muted space-y-2 mb-4 text-xs">
        <li>Go to your Cloudflare Dashboard and navigate to <strong>Workers & Pages</strong>.</li>
        <li>Click <strong>Create application</strong>, then click <strong>Create Worker</strong>.</li>
        <li>On the next screen, scroll down and click <strong>Start with Hello World!</strong> (Do not connect git).</li>
        <li>Click <strong>Deploy</strong>.</li>
        <li>Once deployed, click <strong>Edit code</strong> (or Quick Edit).</li>
        <li>Replace the default code with the code below, then click <strong>Deploy</strong> or Save.</li>
        <li>Copy the newly generated worker URL (e.g., <code className="text-[10px] bg-button-bg px-1 py-0.5 rounded">https://your-worker.username.workers.dev</code>) and paste it above!</li>
      </ol>
      <div className="relative group">
        <button
          onClick={handleCopy}
          className="absolute right-2 top-2 p-1.5 rounded-lg bg-button-bg border border-panel-border hover:bg-button-hover text-text-muted hover:text-text-main transition-colors flex items-center gap-1.5 z-10"
          title="Copy code"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          <span className="text-[10px] font-semibold">{copied ? 'Copied' : 'Copy'}</span>
        </button>
        <pre className="bg-button-bg/50 p-4 rounded-lg overflow-x-auto text-[11px] font-mono text-text-muted border border-panel-border/50">
          <code>{workerCode}</code>
        </pre>
      </div>
      <p className="text-[10px] text-text-muted mt-3">
        Note: You may need to bind the <strong>AI</strong> service in your Worker settings. Go to your Worker's Settings &gt; Bindings &gt; Add Binding &gt; Workers AI. Set the variable name to <code>AI</code>.
      </p>
    </div>
  );
}

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const defaults = useStore((state) => state.defaults);
  const updateDefaults = useStore((state) => state.updateDefaults);
  const globalTextScale = useStore((state) => state.globalTextScale);
  const setGlobalTextScale = useStore((state) => state.setGlobalTextScale);

  const backgroundType = useStore((state) => state.backgroundType);
  const backgroundColor = useStore((state) => state.backgroundColor);
  const backgroundGradient = useStore((state) => state.backgroundGradient);
  const backgroundVideoUrl = useStore((state) => state.backgroundVideoUrl);
  const backgroundSpeed = useStore((state) => state.backgroundSpeed);
  const setBackgroundSpeed = useStore((state) => state.setBackgroundSpeed);
  const gridOverlay = useStore((state) => state.gridOverlay);
  const keylightType = useStore((state) => state.keylightType);
  const keylightColor = useStore((state) => state.keylightColor);
  const setGridOverlay = useStore((state) => state.setGridOverlay);
  const setKeylightType = useStore((state) => state.setKeylightType);
  const setKeylightColor = useStore((state) => state.setKeylightColor);
  const uiTheme = useStore((state) => state.uiTheme);
  const uiAccentColor = useStore((state) => state.uiAccentColor);
  const setUiTheme = useStore((state) => state.setUiTheme);
  const setUiAccentColor = useStore((state) => state.setUiAccentColor);
  const cloudflareWorkerUrl = useStore((state) => state.cloudflareWorkerUrl);
  const setCloudflareWorkerUrl = useStore((state) => state.setCloudflareWorkerUrl);
  const geminiApiKey = useStore((state) => state.geminiApiKey);
  const setGeminiApiKey = useStore((state) => state.setGeminiApiKey);
  const geminiModel = useStore((state) => state.geminiModel);
  const setGeminiModel = useStore((state) => state.setGeminiModel);
  const geminiFreeTier = useStore((state) => state.geminiFreeTier);
  const setGeminiFreeTier = useStore((state) => state.setGeminiFreeTier);
  const addToast = useStore((state) => state.addToast);

  const [activeGradientStop, setActiveGradientStop] = React.useState(0);
  const standardColors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#ffffff', '#a1a1aa', '#09090b', '#000000'];

  const handleSave = () => {
    onClose();
    addToast('Settings saved successfully', 'success');
  };

  const renderTypeSettings = (type: 'text' | 'image' | 'shape' | 'placeholder', title: string) => {
    const typeDefaults = defaults[type] || {};
    return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-text-main mb-2">{title}</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">In</label>
          <select 
            value={typeDefaults.animationIn || 'none'} 
            onChange={(e) => updateDefaults(type, { animationIn: e.target.value })}
            className="bg-button-bg border border-panel-border rounded px-3 py-2 text-sm text-text-main outline-none focus:border-panel-border"
          >
            <option value="none">None</option>
            <option value="fade">Fade</option>
            <option value="slide">Slide</option>
            <option value="scale">Scale</option>
            <option value="fade-slide">Fade & Slide</option>
            <option value="fade-slide-up">Fade & Slide Up</option>
            <option value="zoom-in">Zoom In</option>
            <option value="fade-zoom-in">Fade & Zoom In</option>
            <option value="fade-zoom-out">Fade & Zoom Out</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Out</label>
          <select 
            value={typeDefaults.animationOut || 'none'} 
            onChange={(e) => updateDefaults(type, { animationOut: e.target.value })}
            className="bg-button-bg border border-panel-border rounded px-3 py-2 text-sm text-text-main outline-none focus:border-panel-border"
          >
            <option value="none">None</option>
            <option value="fade">Fade</option>
            <option value="slide">Slide</option>
            <option value="scale">Scale</option>
            <option value="fade-slide">Fade & Slide</option>
            <option value="fade-slide-up">Fade & Slide Up</option>
            <option value="zoom-out">Zoom Out</option>
            <option value="fade-zoom-in">Fade & Zoom In</option>
            <option value="fade-zoom-out">Fade & Zoom Out</option>
          </select>
        </div>
        {type !== 'placeholder' && (
          <div className="flex flex-col">
            <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Easing</label>
            <select 
              value={typeDefaults.easing || 'linear'} 
              onChange={(e) => updateDefaults(type, { easing: e.target.value })}
              className="bg-button-bg border border-panel-border rounded px-3 py-2 text-sm text-text-main outline-none focus:border-panel-border"
            >
              <option value="linear">Linear</option>
              <option value="ease-in">Ease In</option>
              <option value="ease-out">Ease Out</option>
              <option value="ease-in-out">Ease In Out</option>
            </select>
          </div>
        )}
      </div>
      {type === 'text' && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Default Font</label>
            <select 
              value={typeDefaults.fontFamily || 'Instrument Sans'} 
              onChange={(e) => updateDefaults('text', { fontFamily: e.target.value })}
              className="bg-button-bg border border-panel-border rounded px-3 py-2 text-sm text-text-main outline-none focus:border-panel-border"
            >
              <option value="Instrument Sans">Instrument Sans</option>
              <option value="Inter">Inter</option>
              <option value="Outfit">Outfit</option>
              <option value="Space Grotesk">Space Grotesk</option>
              <option value="JetBrains Mono">JetBrains Mono</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Anton">Anton</option>
              <option value="Bebas Neue">Bebas Neue</option>
              <option value="Oswald">Oswald</option>
              <option value="Montserrat">Montserrat</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Default Text Effect</label>
            <select 
              value={typeDefaults.textEffect || 'none'} 
              onChange={(e) => updateDefaults('text', { textEffect: e.target.value })}
              className="bg-button-bg border border-panel-border rounded px-3 py-2 text-sm text-text-main outline-none focus:border-panel-border"
            >
              <option value="none">None</option>
              <option value="bloom">Bloom</option>
              <option value="shiver">Shiver</option>
              <option value="flicker">Flicker</option>
              <option value="neon">Neon</option>
            </select>
          </div>
        </div>
      )}
      {type === 'placeholder' && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Dimness (Opacity)</label>
            <input 
              type="range" 
              min="0" max="1" step="0.05"
              value={typeDefaults.mediaDimness ?? 0.5} 
              onChange={(e) => updateDefaults('placeholder', { mediaDimness: parseFloat(e.target.value) })}
              className="w-full accent-[var(--color-accent)]"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Continuous Effect</label>
            <select 
              value={typeDefaults.mediaEffect || 'none'} 
              onChange={(e) => updateDefaults('placeholder', { mediaEffect: e.target.value })}
              className="bg-button-bg border border-panel-border rounded px-3 py-2 text-sm text-text-main outline-none focus:border-panel-border"
            >
              <option value="none">None</option>
              <option value="parallax-zoom-in">Parallax Zoom In</option>
              <option value="parallax-zoom-out">Parallax Zoom Out</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )};

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200 p-0 sm:p-6">
      <div className="bg-app-bg text-text-main w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-6xl sm:rounded-2xl flex flex-col pointer-events-auto shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-panel-border shrink-0 bg-app-bg z-10">
          <div className="font-semibold text-lg tracking-tight shrink-0 flex items-center gap-2 text-text-main">
             Script Mage Settings
           </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-button-bg border border-panel-border flex items-center justify-center text-text-muted hover:text-text-main hover:bg-button-hover transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left Column: Editor & Canvas Settings */}
            <div className="flex flex-col">
              <div className="mb-8 border-b border-panel-border pb-8">
                <h3 className="text-base font-semibold text-text-main mb-4 flex items-center gap-2">
                  <Settings size={18} /> Workspace Accent
                </h3>
                
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase font-semibold">Highlight Accent</label>
                    <div className="flex gap-2 flex-wrap items-center">
                      {['#6366f1', '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#e879f9', '#a1a1aa'].map(c => (
                        <button key={c} onClick={() => setUiAccentColor(c)} className={`w-8 h-8 rounded-full border-2 transition-transform ${uiAccentColor === c ? 'scale-110 border-white' : 'border-transparent hover:scale-105'}`} style={{backgroundColor: c}} title={c} />
                      ))}
                      <button 
                        onClick={() => setUiAccentColor('rainbow')} 
                        className={`px-3 h-8 rounded-full border-2 text-xs font-bold bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-text-main transition-transform ${uiAccentColor === 'rainbow' ? 'scale-110 border-white' : 'border-transparent hover:scale-105'}`}
                      >
                        Rainbow
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8 lg:mb-0 lg:border-b-0 border-b border-panel-border lg:pb-0 pb-8">
                <h3 className="text-base font-semibold text-text-main mb-4">Background Settings</h3>
                
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Background Type</label>
                    <select 
                      value={backgroundType} 
                      onChange={(e) => useStore.getState().setBackgroundType(e.target.value as any)}
                      className="bg-button-bg border border-panel-border rounded px-3 py-2 text-sm text-text-main outline-none focus:border-panel-border"
                    >
                      <option value="solid">Solid Color</option>
                      <option value="gradient">Gradient</option>
                      <option value="animated-gradient">Animated Gradient</option>
                      <option value="scrolling-grid">Scrolling Grid</option>
                      <option value="scrolling-dots">Scrolling Dots</option>
                      <option value="scrolling-lines">Scrolling Lines</option>
                      <option value="scanning-laser">Scanning Laser</option>
                      <option value="scrolling-diagonal">Scrolling Diagonal</option>
                      <option value="pulse-grid">Pulse Grid</option>
                      <option value="radar-sweep">Radar Sweep</option>
                      <option value="video">Looping Video</option>
                    </select>
                  </div>

                  {['animated-gradient', 'scrolling-grid', 'scrolling-dots', 'scrolling-lines', 'scanning-laser', 'scrolling-diagonal', 'pulse-grid', 'radar-sweep'].includes(backgroundType) && (
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-text-muted uppercase font-semibold text-left w-full">Animation Speed: {backgroundSpeed.toFixed(1)}x</label>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="5" 
                        step="0.1" 
                        value={backgroundSpeed} 
                        onChange={(e) => setBackgroundSpeed(parseFloat(e.target.value))} 
                        className="w-full accent-[var(--color-accent)]"
                      />
                    </div>
                  )}

                  {backgroundType === 'solid' && (
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-text-muted uppercase font-semibold">Background Color</label>
                        <button 
                          onClick={() => {
                            const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
                            useStore.getState().setBackgroundColor(randomColor());
                          }} 
                          className="text-[10px] text-text-muted hover:text-text-main uppercase font-semibold flex items-center gap-1 transition-colors"
                          title="Randomize Color"
                        >
                          <Shuffle size={12} />
                          Randomize
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input type="color" value={backgroundColor} onChange={(e) => useStore.getState().setBackgroundColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0" />
                        <input type="text" value={backgroundColor} onChange={(e) => useStore.getState().setBackgroundColor(e.target.value)} className="flex-1 bg-button-bg border border-panel-border rounded px-3 py-2 text-sm text-text-main uppercase outline-none focus:border-panel-border" />
                      </div>
                      <div className="flex gap-2 flex-wrap mt-3">
                        {standardColors.map(c => (
                          <button key={c} onClick={() => useStore.getState().setBackgroundColor(c)} className="w-6 h-6 rounded-full border border-panel-border hover:scale-110 transition-transform" style={{backgroundColor: c}} title={c} />
                        ))}
                      </div>
                    </div>
                  )}

                  {(backgroundType === 'gradient' || backgroundType === 'animated-gradient') && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-text-muted uppercase font-semibold">Gradient Colors</label>
                        <button 
                          onClick={() => {
                            const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
                            useStore.getState().setBackgroundGradient([
                              randomColor(), 
                              randomColor(), 
                              backgroundType === 'animated-gradient' ? randomColor() : ''
                            ]);
                          }} 
                          className="text-[10px] text-text-muted hover:text-text-main uppercase font-semibold flex items-center gap-1 transition-colors"
                          title="Randomize Colors"
                        >
                          <Shuffle size={12} />
                          Randomize
                        </button>
                      </div>
                      <div className="flex gap-4">
                        <input type="color" value={backgroundGradient[0]} onClick={() => setActiveGradientStop(0)} onChange={(e) => {
                          const newGradient = [...backgroundGradient];
                          newGradient[0] = e.target.value;
                          useStore.getState().setBackgroundGradient(newGradient);
                        }} className={`w-8 h-8 rounded-full cursor-pointer bg-transparent border-none p-0 ring-2 ring-offset-2 ring-offset-app-bg transition-all ${activeGradientStop === 0 ? 'ring-text-main' : 'ring-transparent'}`} />
                        <input type="color" value={backgroundGradient[1] || ''} onClick={() => setActiveGradientStop(1)} onChange={(e) => {
                          const newGradient = [...backgroundGradient];
                          newGradient[1] = e.target.value;
                          useStore.getState().setBackgroundGradient(newGradient);
                        }} className={`w-8 h-8 rounded-full cursor-pointer bg-transparent border-none p-0 ring-2 ring-offset-2 ring-offset-app-bg transition-all ${activeGradientStop === 1 ? 'ring-text-main' : 'ring-transparent'}`} />
                        {backgroundType === 'animated-gradient' && (
                          <input type="color" value={backgroundGradient[2] || ''} onClick={() => setActiveGradientStop(2)} onChange={(e) => {
                            const newGradient = [...backgroundGradient];
                            newGradient[2] = e.target.value;
                            useStore.getState().setBackgroundGradient(newGradient);
                          }} className={`w-8 h-8 rounded-full cursor-pointer bg-transparent border-none p-0 ring-2 ring-offset-2 ring-offset-app-bg transition-all ${activeGradientStop === 2 ? 'ring-text-main' : 'ring-transparent'}`} />
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap mt-2">
                        {standardColors.map(c => (
                          <button key={c} onClick={() => {
                            const newGradient = [...backgroundGradient];
                            newGradient[activeGradientStop] = c;
                            useStore.getState().setBackgroundGradient(newGradient);
                          }} className="w-6 h-6 rounded-full border border-panel-border hover:scale-110 transition-transform" style={{backgroundColor: c}} title={c} />
                        ))}
                      </div>
                    </div>
                  )}

                  {backgroundType === 'video' && (
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Video Source (URL or Local File)</label>
                      <div className="flex gap-2 items-center">
                        <input type="text" value={backgroundVideoUrl} onChange={(e) => useStore.getState().setBackgroundVideoUrl(e.target.value)} placeholder="https://example.com/video.mp4" className="flex-1 bg-button-bg border border-panel-border rounded px-3 py-2 text-sm text-text-main outline-none focus:border-panel-border" />
                        <label className="bg-button-bg hover:bg-button-hover text-text-main px-3 h-[38px] rounded text-sm font-medium cursor-pointer transition-colors flex items-center justify-center shrink-0" title="Upload Local Video">
                          <Upload size={16} />
                          <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              useStore.getState().setBackgroundVideoUrl(url);
                            }
                          }} />
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-4 pt-4 mt-4 border-t border-panel-border">
                    <h4 className="text-sm font-semibold text-text-main">Overlays</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-text-muted uppercase font-semibold">Grid Overlay</label>
                        <select 
                          value={gridOverlay} 
                          onChange={(e) => setGridOverlay(e.target.value as any)}
                          className="bg-button-bg border border-panel-border rounded px-3 py-2 text-sm text-text-main outline-none focus:border-panel-border"
                        >
                          <option value="none">None</option>
                          <option value="small">Small Grid</option>
                          <option value="large">Large Grid</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-text-muted uppercase font-semibold">Keylight Direction</label>
                        <select 
                          value={keylightType} 
                          onChange={(e) => setKeylightType(e.target.value as any)}
                          className="bg-button-bg border border-panel-border rounded px-3 py-2 text-sm text-text-main outline-none focus:border-panel-border"
                        >
                          <option value="none">None</option>
                          <option value="up">Bottom-Up Keylight</option>
                          <option value="down">Top-Down Keylight</option>
                        </select>
                      </div>
                    </div>

                    {keylightType !== 'none' && (
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-text-muted uppercase font-semibold">Keylight Color</label>
                        <div className="flex gap-2">
                          <input type="color" value={keylightColor} onChange={(e) => setKeylightColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0" />
                          <input type="text" value={keylightColor} onChange={(e) => setKeylightColor(e.target.value)} className="flex-1 bg-button-bg border border-panel-border rounded px-3 py-2 text-sm text-text-main uppercase outline-none focus:border-panel-border" />
                        </div>
                        <div className="flex gap-2 flex-wrap mt-2">
                          {standardColors.map(c => (
                            <button key={c} onClick={() => setKeylightColor(c)} className="w-6 h-6 rounded-full border border-panel-border hover:scale-110 transition-transform" style={{backgroundColor: c}} title={c} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column: Element Defaults */}
            <div className="flex flex-col">
              <div className="mb-8 border-b border-panel-border pb-8">
                <h3 className="text-base font-semibold text-text-main mb-4">Global Element Settings</h3>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs text-text-muted uppercase font-semibold">Global Text Size Scale</label>
                    <span className="text-sm font-medium text-text-main">{globalTextScale.toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.1" max="3" step="0.05"
                    value={globalTextScale} 
                    onChange={(e) => setGlobalTextScale(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>
              
              {renderTypeSettings('text', 'Text Elements')}
              {renderTypeSettings('image', 'Image Elements')}
              {renderTypeSettings('shape', 'Shape Elements')}
              {renderTypeSettings('placeholder', 'Placeholder Settings')}

              <div className="mt-8 border-t border-panel-border pt-8">
                <h3 className="text-base font-semibold text-text-main mb-4">AI Integrations</h3>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-text-muted uppercase font-semibold">Cloudflare Worker URL</label>
                  <input 
                    type="text" 
                    value={cloudflareWorkerUrl} 
                    onChange={(e) => setCloudflareWorkerUrl(e.target.value)}
                    placeholder="https://your-worker.workers.dev"
                    className="bg-button-bg border border-panel-border rounded px-3 py-2 text-sm text-text-main outline-none focus:border-panel-border w-full max-w-full min-w-0"
                  />
                  <p className="text-xs text-text-muted mt-1">
                    Deploy a Cloudflare Worker using Workers AI to generate images for free.
                  </p>
                  <CloudflareSetupGuide />
                </div>
                
                <div className="flex flex-col gap-4 mt-6">
                  <h4 className="text-sm font-semibold text-text-main">Google Gemini API (Voice)</h4>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase font-semibold flex items-center justify-between">
                      Gemini API Key
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline flex items-center gap-1 font-normal lowercase tracking-normal">
                        get api key <ExternalLink size={10} />
                      </a>
                    </label>
                    <input 
                      type="password" 
                      value={geminiApiKey} 
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="bg-button-bg border border-panel-border rounded px-3 py-2 text-sm text-text-main outline-none focus:border-panel-border w-full max-w-full min-w-0"
                    />
                    <p className="text-xs text-text-muted mt-1">
                      Required for generating voice and scripts using Gemini. Your key is stored only in your browser.
                    </p>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mt-1 flex items-start gap-2 text-orange-200">
                      <AlertTriangle size={16} className="text-orange-400 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <p className="font-semibold text-orange-300">Disclaimer & Security</p>
                        <p className="leading-relaxed">Use API keys at your own risk. Your key is stored locally in your browser. Do not expose paid API keys to others. We are not responsible for any usage charges or liabilities arising from the use of your API keys.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase font-semibold">Voice Model</label>
                    <select
                      value={geminiModel}
                      onChange={(e) => setGeminiModel(e.target.value)}
                      className="bg-button-bg border border-panel-border rounded px-3 py-2 text-sm text-text-main outline-none focus:border-panel-border w-full"
                    >
                      <option value="gemini-3.1-flash-tts-preview">Gemini 3.1 Flash TTS (Cheap & Efficient)</option>
                      <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (More Credits, Advanced)</option>
                      <option value="gemini-3.5-flash">Gemini 3.5 Flash (Standard Text)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input 
                      type="checkbox" 
                      id="gemini-free-tier"
                      checked={geminiFreeTier} 
                      onChange={(e) => setGeminiFreeTier(e.target.checked)}
                      className="w-4 h-4 rounded border-panel-border bg-button-bg accent-[var(--color-accent)]"
                    />
                    <label htmlFor="gemini-free-tier" className="text-sm text-text-main font-medium cursor-pointer">
                      Using Free Tier API
                    </label>
                  </div>
                  <p className="text-xs text-text-muted -mt-1 ml-6">
                    Check this if you are using a free tier API key to apply rate limits and avoid maxing out your quota.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="p-4 sm:p-6 bg-panel-bg/95 backdrop-blur border-t border-panel-border flex flex-col sm:flex-row justify-between items-center gap-4 z-20 shrink-0 mt-auto">
          <button 
            onClick={() => {
              useStore.getState().applyDefaultsToProject();
              addToast('Settings applied to current project elements', 'success');
            }} 
            className="w-full sm:w-auto bg-button-bg hover:bg-button-hover text-text-main px-4 py-2.5 rounded-lg font-semibold transition-all shadow-sm border border-panel-border text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            Apply All Settings to Current Project
          </button>
          <button 
            onClick={handleSave} 
            className="w-full sm:w-auto bg-[var(--color-accent)] hover:opacity-90 text-white px-8 py-2.5 rounded-full font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
