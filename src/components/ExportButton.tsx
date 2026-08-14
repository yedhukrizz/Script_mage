import React, { useState, useRef } from 'react';
import { CustomSelect } from './CustomSelect';
import { Upload, Share, Download, Loader2, Film, Settings, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Muxer, ArrayBufferTarget, FileSystemWritableFileStreamTarget } from 'mp4-muxer';
import { TTS_VOICES } from '../lib/ttsVoices';
import { motion, AnimatePresence } from 'motion/react';

export function ExportButton({ className = "flex flex-col items-center justify-center p-2 w-full h-full bg-button-bg hover:bg-button-hover text-text-main rounded-xl border float-border hover:border-[var(--color-accent)] transition-all gap-1 group", iconSize = 18, showText = true }: { className?: string, iconSize?: number, showText?: boolean }) {
  
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [resolution, setResolution] = useState('1080p');
  const [fps, setFps] = useState(30);
  const cancelRef = useRef(false);

  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exportLogs, setExportLogs] = useState<string[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const duration = useStore((state) => state.duration);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const setCurrentTime = useStore((state) => state.setCurrentTime);
  const elements = useStore((state) => state.elements);
  const geminiApiKey = useStore((state) => state.geminiApiKey);
  const globalTextScale = useStore((state) => state.globalTextScale) || 1;
  const canvasAspectRatio = useStore((state) => state.canvasAspectRatio);
  const backgroundType = useStore((state) => state.backgroundType);
  const backgroundColor = useStore((state) => state.backgroundColor);
  const backgroundGradient = useStore((state) => state.backgroundGradient);
  const backgroundVideoUrl = useStore((state) => state.backgroundVideoUrl);
  const backgroundSpeed = useStore((state) => state.backgroundSpeed) || 1;
  const gridOverlay = useStore((state) => state.gridOverlay);
  const gridColor = useStore((state) => state.gridColor);
  const postProcessingFx = useStore((state) => state.postProcessingFx);
  const keylightType = useStore((state) => state.keylightType);
  const keylightColor = useStore((state) => state.keylightColor);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [exportLogs]);

  const handleExport = async () => {
      setIsExporting(true);
      setProgress(0);
      setExportLogs(['> Initializing export pipeline...']);
      setIsPlaying(false);
      setCurrentTime(0);

      // Wait a tick for canvas to reset
      await new Promise(resolve => setTimeout(resolve, 100));

      setExportLogs(prev => [...prev, '> Targeting render canvas for frame extraction...', `> Processing ${elements.length} timeline elements...`]);
      const renderCanvas = document.getElementById('render-canvas');
      if (!renderCanvas) {
        setIsExporting(false);
        return;
      }


      // Apply selected FPS


      // Determine target resolution based on aspect ratio
      let baseRes = 1080;
      if (resolution === '720p') baseRes = 720;
      else if (resolution === '4k') baseRes = 2160;
      else if (resolution === '8k') baseRes = 4320;

      let targetWidth = baseRes;
      let targetHeight = baseRes;
      const [wRatio, hRatio] = canvasAspectRatio.split('/').map(Number);
      if (wRatio && hRatio) {
        if (wRatio > hRatio) {
          targetHeight = baseRes;
          targetWidth = Math.round(baseRes * (wRatio / hRatio));
        } else {
          targetWidth = baseRes;
          targetHeight = Math.round(baseRes * (hRatio / wRatio));
        }
      }


      // Ensure even dimensions for video codecs
      targetWidth = Math.round(targetWidth / 2) * 2;
      targetHeight = Math.round(targetHeight / 2) * 2;

      const hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = targetWidth;
      hiddenCanvas.height = targetHeight;
      setExportLogs(prev => [...prev, `> Setting up hidden canvas context...`, `> Resolution: ${targetWidth}x${targetHeight}`, `> Framerate: ${fps} fps`]);
      const ctx = hiddenCanvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        setIsExporting(false);
        return;
      }


      
      const maxElementTime = elements.length > 0 ? Math.max(...elements.map(el => el.endTime)) : 0;
      const exportDurationMs = maxElementTime > 0 ? maxElementTime : duration;
      const totalFrames = Math.ceil((exportDurationMs / 1000) * fps);

      const frameDuration = 1000 / fps;

      let muxer = null;
      let videoEncoder = null;
      let audioEncoder = null;
      const audioCtx = new AudioContext({ sampleRate: 44100 });
      const bgAudioUrl = useStore.getState().backgroundAudioUrl;
      const bgAudioVol = useStore.getState().backgroundAudioVolume;

      try {
        let fileHandle = null;
        try {
          if ('showSaveFilePicker' in window) {
            fileHandle = await (window as any).showSaveFilePicker({
              suggestedName: 'export.mp4',
              types: [{ description: 'MP4 Video', accept: { 'video/mp4': ['.mp4'] } }],
            });
          }
        } catch (err: any) {
          if (err.name === 'AbortError') {
            setIsExporting(false);
            return;
          }
          console.warn('FilePicker error, falling back to memory target', err);
        }

        // Preload images
        const imageCache: Record<string, HTMLImageElement> = {};
        for (const el of elements) {
          if (el.type === 'image' && el.content && !imageCache[el.content]) {
            try {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              const imgPromise = new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
              });
              img.src = el.content;
              await imgPromise;
              imageCache[el.content] = img;
            } catch (e) {
              console.error("Failed to load image", el.content);
            }
          }
        }

        
        if (postProcessingFx === 'noise') {
           const noiseUrl = 'data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E';
           try {
              const img = new Image();
              const imgPromise = new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
              });
              img.src = noiseUrl;
              await imgPromise;
              imageCache['noise_svg_fx'] = img;
           } catch(e) {}
        }

        // Fetch and decode TTS Audio
        const audioBuffers: { el?: any, isBg?: boolean, buffer: AudioBuffer }[] = [];
      for (const el of elements) {
        if (el.type === 'text' && el.ttsVoice && el.content.trim()) {
          try {
            // Using TTS Proxy
            const voiceConfig = TTS_VOICES.find(v => v.id === el.ttsVoice);
            let lang = 'en';
            let voiceParam = '';
            
            if (voiceConfig) {
               lang = voiceConfig.lang;
               voiceParam = voiceConfig.voice ? `&voice=${encodeURIComponent(voiceConfig.voice)}` : '';
            } else {
               lang = el.ttsVoice.split('-')[0] || 'en';
            }
            
            const res = await fetch(`${voiceConfig?.category === 'Gemini' ? '/api/gemini-tts' : '/api/tts'}?text=${encodeURIComponent(el.content)}&lang=${lang}${voiceParam}${(useStore.getState().geminiApiKey ? '&apiKey=' + encodeURIComponent(useStore.getState().geminiApiKey) : '')}`);
            if (res.ok) {
              const arrayBuffer = await res.arrayBuffer();
              const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
              audioBuffers.push({ el, buffer: audioBuffer });
            } else {
              const err = await res.text();
              if (err.includes('API key not valid') || err.includes('API_KEY_INVALID')) {
                 useStore.getState().addToast('Invalid Gemini API Key! Please check your Settings.', 'error');
                 throw new Error('Invalid Gemini API Key! Please check your Settings.');
              }
              throw new Error(err);
            }
          } catch (e) {
            console.error("Failed to load TTS for element", el.id, e);
          }
        } else if ((el.type === 'audio' || el.type === 'video') && el.content) {
          try {
            const res = await fetch(el.content);
            if (res.ok) {
              const arrayBuffer = await res.arrayBuffer();
              const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
              audioBuffers.push({ el, buffer: audioBuffer });
            }
          } catch (e) {
            console.error(`Failed to load audio for ${el.type} element`, el.id, e);
          }
        }
      }
      
      if (bgAudioUrl) {
        try {
          const res = await fetch(bgAudioUrl);
          if (res.ok) {
            const arrayBuffer = await res.arrayBuffer();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            audioBuffers.push({ isBg: true, buffer: audioBuffer });
          }
        } catch(e) {
          console.error("Failed to load bg audio", e);
        }
      }



      let writableStream = null;
      
      const muxerConfig: any = {
        video: { codec: 'avc', width: targetWidth, height: targetHeight },
        fastStart: false,
      };
      
      if (audioBuffers.length > 0) {
        muxerConfig.audio = { codec: 'aac', sampleRate: 44100, numberOfChannels: 2 };
      }

      if (fileHandle) {
        writableStream = await fileHandle.createWritable();
        setExportLogs(prev => [...prev, '> Initializing MP4 muxer...']);
      muxer = new Muxer({
          target: new FileSystemWritableFileStreamTarget(writableStream),
          ...muxerConfig
        });
      } else {
        muxer = new Muxer({
          target: new ArrayBufferTarget(),
          ...muxerConfig
        });
      }

      let encoderError = null;
      videoEncoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: e => {
          console.error("VideoEncoder error:", e);
          encoderError = e;
        }
      });

      let avcLevel = '32'; // 5.0
      const pixels = targetWidth * targetHeight;
      if (pixels > 8912896) {
        avcLevel = '3E'; // 6.2
      } else if (pixels > 5652480) {
        avcLevel = '34'; // 5.2
      }

      setExportLogs(prev => [...prev, '> Video encoder configured. Starting frame generation...']);
      videoEncoder.configure({
        codec: `avc1.6400${avcLevel}`,
        width: targetWidth,
        height: targetHeight,
        bitrate: pixels > 5000000 ? 30_000_000 : 8_000_000, 
        framerate: fps,
      });

      if (audioBuffers.length > 0 && typeof AudioEncoder !== 'undefined') {
        audioEncoder = new AudioEncoder({
          output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
          error: e => console.error(e),
        });
        audioEncoder.configure({
          codec: 'mp4a.40.2',
          sampleRate: 44100,
          numberOfChannels: 2,
          bitrate: 128000
        });

        // Render entire audio timeline
        const offlineCtx = new OfflineAudioContext(2, Math.max(1, Math.ceil(44100 * (exportDurationMs / 1000))), 44100);
        for (const { el, isBg, buffer } of audioBuffers) {
          const source = offlineCtx.createBufferSource();
          source.buffer = buffer;
          
          const gainNode = offlineCtx.createGain();
          if (isBg) {
            gainNode.gain.value = bgAudioVol;
            source.loop = true;
          } else if (el) {
            // Element Volume or default
            const targetVol = el.volume ?? 1.0;
            const startSeconds = Math.max(0, el.startTime / 1000);
            const endSeconds = Math.max(0, el.endTime / 1000);
            const animDur = 1.0; // 1 second animation

            if (el.animationIn?.includes('fade')) {
              gainNode.gain.setValueAtTime(0, startSeconds);
              gainNode.gain.linearRampToValueAtTime(targetVol, startSeconds + Math.min(animDur, endSeconds - startSeconds));
            } else {
              gainNode.gain.setValueAtTime(targetVol, startSeconds);
            }

            if (el.animationOut?.includes('fade')) {
              const fadeOutStart = Math.max(startSeconds, endSeconds - animDur);
              gainNode.gain.setValueAtTime(targetVol, fadeOutStart);
              gainNode.gain.linearRampToValueAtTime(0, endSeconds);
            }
          }
          
          source.connect(gainNode);
          gainNode.connect(offlineCtx.destination);
          
          if (isBg) {
            source.start(0, 0, exportDurationMs / 1000);
          } else if (el) {
            const startSeconds = Math.max(0, el.startTime / 1000);
            const durationSeconds = Math.max(0, (el.endTime - el.startTime) / 1000);
            source.start(startSeconds, 0, durationSeconds);
          }
        }
        
        const renderedBuffer = await offlineCtx.startRendering();
        const numChannels = renderedBuffer.numberOfChannels;
        const length = renderedBuffer.length;
        const chunkSize = 4096;
        
        for (let offset = 0; offset < length; offset += chunkSize) {
          const size = Math.min(chunkSize, length - offset);
          const buffer = new Float32Array(size * numChannels);
          for (let c = 0; c < numChannels; c++) {
            const channelData = renderedBuffer.getChannelData(c);
            buffer.set(channelData.subarray(offset, offset + size), c * size);
          }
          const audioData = new AudioData({
            format: 'f32-planar',
            sampleRate: 44100,
            numberOfFrames: size,
            numberOfChannels: numChannels,
            timestamp: (offset / 44100) * 1e6,
            data: buffer
          });
          audioEncoder.encode(audioData);
          audioData.close();
        }
        await audioEncoder.flush();
      }



      const easingFunctions: Record<string, (t: number) => number> = {
        'linear': t => t,
        'ease-in': t => t * t,
        'ease-out': t => t * (2 - t),
        'ease-in-out': t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      };

      
      let logicalWidth = 1080;
      if (wRatio && hRatio && wRatio > hRatio) {
         logicalWidth = Math.round(1080 * (wRatio / hRatio));
      }
      const scale = targetWidth / logicalWidth;

      const offsetX = 0;
      const offsetY = 0;

      for (let i = 0; i <= totalFrames; i++) {
        const time = i * frameDuration;
        if (i % 5 === 0) setCurrentTime(time);

        const timeSec = time / 1000;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        if (backgroundType === 'solid') {
          ctx.fillStyle = backgroundColor || '#000000';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        } else if (backgroundType === 'gradient' || backgroundType === 'animated-gradient') {
          let x1 = 0, y1 = 0, x2 = targetWidth, y2 = targetHeight;
          if (backgroundType === 'animated-gradient') {
            const angle = timeSec * backgroundSpeed * 0.5;
            const cx = targetWidth / 2;
            const cy = targetHeight / 2;
            const r = Math.max(targetWidth, targetHeight);
            x1 = cx + Math.cos(angle) * r;
            y1 = cy + Math.sin(angle) * r;
            x2 = cx - Math.cos(angle) * r;
            y2 = cy - Math.sin(angle) * r;
          }
          const grad = ctx.createLinearGradient(x1, y1, x2, y2);
          grad.addColorStop(0, backgroundGradient[0] || backgroundColor);
          grad.addColorStop(0.5, backgroundGradient[1] || backgroundGradient[0] || backgroundColor);
          if (backgroundType === 'animated-gradient') {
            grad.addColorStop(1, backgroundGradient[2] || backgroundGradient[0] || backgroundColor);
          } else {
            grad.addColorStop(1, backgroundGradient[1] || backgroundGradient[0] || backgroundColor);
          }
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        } else if (backgroundType === 'scrolling-grid' || backgroundType === 'scrolling-diagonal' || backgroundType === 'scrolling-lines' || backgroundType === 'scrolling-dots') {
          ctx.fillStyle = backgroundType === 'scrolling-dots' ? '#555555' : 'transparent';
          ctx.strokeStyle = '#333333';
          ctx.lineWidth = backgroundType === 'scrolling-lines' ? 2 : 1;
          
          const size = (backgroundType === 'scrolling-dots' ? 30 : 50) * scale;
          let offsetY = (timeSec * backgroundSpeed * 50 * scale / 15) % size;
          let offsetX = backgroundType === 'scrolling-diagonal' ? offsetY : 0;
          
          if (backgroundType === 'scrolling-lines') {
             ctx.beginPath();
             for (let y = offsetY - size; y <= targetHeight; y += 10) {
                ctx.moveTo(0, y);
                ctx.lineTo(targetWidth, y);
             }
             ctx.stroke();
          } else {
             for (let x = offsetX - size; x <= targetWidth + size; x += size) {
               for (let y = offsetY - size; y <= targetHeight + size; y += size) {
                 if (backgroundType === 'scrolling-dots') {
                   ctx.beginPath();
                   ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                   ctx.fill();
                 } else {
                   ctx.beginPath();
                   ctx.moveTo(x, 0); ctx.lineTo(x, targetHeight);
                   ctx.moveTo(0, y); ctx.lineTo(targetWidth, y);
                   ctx.stroke();
                 }
               }
             }
          }
        } else if (backgroundType === 'pulse-grid') {
          ctx.strokeStyle = backgroundGradient[0] || '#333333';
          ctx.lineWidth = 1;
          const opacity = 0.2 + 0.4 * (0.5 + 0.5 * Math.sin(timeSec * backgroundSpeed * Math.PI * 2 / 4));
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          const size = 40 * scale;
          for (let x = 0; x <= targetWidth; x += size) {
             ctx.moveTo(x, 0); ctx.lineTo(x, targetHeight);
          }
          for (let y = 0; y <= targetHeight; y += size) {
             ctx.moveTo(0, y); ctx.lineTo(targetWidth, y);
          }
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        } else if (backgroundType === 'radar-sweep') {
          const cx = targetWidth / 2;
          const cy = targetHeight / 2;
          const r = Math.max(targetWidth, targetHeight);
          
          ctx.globalAlpha = 0.2;
          ctx.strokeStyle = '#333333';
          ctx.lineWidth = 1;
          for(let i=1; i<=5; i++) {
             ctx.beginPath();
             ctx.arc(cx, cy, r * (i/5), 0, Math.PI*2);
             ctx.stroke();
          }
          ctx.globalAlpha = 1.0;

          const angle = (timeSec * backgroundSpeed * Math.PI * 2 / 10);
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(angle);
          
          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.arc(0, 0, r, 0, -Math.PI/4, true);
          ctx.lineTo(0,0);
          
          const grad = ctx.createLinearGradient(0,0, Math.cos(-Math.PI/8)*r, Math.sin(-Math.PI/8)*r);
          grad.addColorStop(0, 'transparent');
          grad.addColorStop(1, backgroundGradient[0] || '#00ff00');
          ctx.fillStyle = grad;
          ctx.globalAlpha = 0.5;
          ctx.fill();
          
          ctx.restore();
          ctx.globalAlpha = 1.0;
        } else if (backgroundType === 'scanning-laser') {
          const period = 5 / (backgroundSpeed || 1);
          const progress = (timeSec % period) / period;
          const y = progress * targetHeight;
          
          ctx.fillStyle = backgroundGradient[0] || '#ff0000';
          ctx.globalAlpha = 0.5;
          ctx.fillRect(0, y - 10, targetWidth, 20);
          ctx.globalAlpha = 1.0;
        }

        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);

        elements.forEach(element => {
          if (time < element.startTime || time > element.endTime) return;
          
          const timeSinceStart = time - element.startTime;
          const timeLeft = element.endTime - time;
          const animDuration = 500;

          let currentOpacity = element.opacity;
          let currentScale = 1;
          let currentX = element.x;
          let currentY = element.y;

          if (timeSinceStart < animDuration && element.animationIn !== 'none') {
            const progress = Math.max(0, timeSinceStart / animDuration);
            const easedProgress = easingFunctions[element.easing || 'linear']?.(progress) || progress;
            if (element.animationIn === 'fade') currentOpacity = element.opacity * easedProgress;
            else if (element.animationIn === 'slide') currentX = element.x - 50 * (1 - easedProgress);
            else if (element.animationIn === 'scale') { currentScale = easedProgress; currentOpacity = element.opacity * easedProgress; }
            else if (element.animationIn === 'fade-slide') { currentOpacity = element.opacity * easedProgress; currentX = element.x - 50 * (1 - easedProgress); }
            else if (element.animationIn === 'fade-slide-up') { currentOpacity = element.opacity * easedProgress; currentY = element.y + 50 * (1 - easedProgress); }
            else if (element.animationIn === 'zoom-in') currentScale = 0.8 + 0.2 * easedProgress;
            else if (element.animationIn === 'fade-zoom-in') { currentScale = 0.8 + 0.2 * easedProgress; currentOpacity = element.opacity * easedProgress; }
            else if (element.animationIn === 'fade-zoom-out') { currentScale = 1.2 - 0.2 * easedProgress; currentOpacity = element.opacity * easedProgress; }
            else if (element.animationIn === 'fly-in') { currentY = element.y - 200 * (1 - easedProgress); currentScale = 0.5 + 0.5 * easedProgress; currentOpacity = element.opacity * easedProgress; }
          } else if (timeLeft < animDuration && element.animationOut !== 'none') {
            const progress = Math.max(0, timeLeft / animDuration);
            const easedProgress = easingFunctions[element.easing || 'linear']?.(progress) || progress;
            if (element.animationOut === 'fade') currentOpacity = element.opacity * easedProgress;
            else if (element.animationOut === 'slide') currentX = element.x + 50 * (1 - easedProgress);
            else if (element.animationOut === 'scale') { currentScale = easedProgress; currentOpacity = element.opacity * easedProgress; }
            else if (element.animationOut === 'fade-slide') { currentOpacity = element.opacity * easedProgress; currentX = element.x + 50 * (1 - easedProgress); }
            else if (element.animationOut === 'fade-slide-up') { currentOpacity = element.opacity * easedProgress; currentY = element.y - 50 * (1 - easedProgress); }
            else if (element.animationOut === 'zoom-out') currentScale = 0.8 + 0.2 * easedProgress;
            else if (element.animationOut === 'fade-zoom-in') { currentScale = 1.2 - 0.2 * easedProgress; currentOpacity = element.opacity * easedProgress; }
            else if (element.animationOut === 'fade-zoom-out') { currentScale = 0.8 + 0.2 * easedProgress; currentOpacity = element.opacity * easedProgress; }
          }


          if (element.mediaEffect && element.mediaEffect !== 'none') {
            const totalDuration = element.endTime - element.startTime;
            if (totalDuration > 0) {
              const progress = Math.max(0, Math.min(1, timeSinceStart / totalDuration));
              if (element.mediaEffect === 'parallax-zoom-in' || element.mediaEffect === 'zoom-in' || element.mediaEffect === 'parallax-slow') {
                 currentScale *= (1 + 0.15 * progress);
              } else if (element.mediaEffect === 'parallax-zoom-out' || element.mediaEffect === 'zoom-out' || element.mediaEffect === 'parallax-fast') {
                 currentScale *= (1.15 - 0.15 * progress);
              }
            }
          }

          ctx.save();
          const centerX = currentX + element.width / 2;
          const centerY = currentY + element.height / 2;

          ctx.globalAlpha = Math.max(0, Math.min(1, currentOpacity));
          ctx.translate(centerX, centerY);
          ctx.rotate(element.rotation * Math.PI / 180);
          ctx.scale(currentScale, currentScale);
          ctx.translate(-element.width / 2, -element.height / 2);

          if (element.type === 'shape') {
            ctx.fillStyle = element.color || '#ffffff';
            ctx.fillRect(0, 0, element.width, element.height);
          } else if (element.type === 'text') {
            let renderedText = element.content;
            const effects = [element.textEffect].filter(Boolean) as string[];
            const isTypewriter = element.animationIn === 'typewriter' || effects.includes('write-on');
            const isWordEffect = effects.some(e => ['fly-words', 'fade-words', 'zoom-words'].includes(e));
            const textEffectDuration = Math.min(element.endTime - element.startTime, Math.max(1000, element.content.length * 50));

            if (isTypewriter && timeSinceStart < textEffectDuration) {
              const progress = timeSinceStart / textEffectDuration;
              const chars = Math.max(0, Math.floor(progress * element.content.length));
              renderedText = element.content.substring(0, chars);
            }

            const fontSize = (element.fontSize || 32) * globalTextScale;
            // Text Effects modifying opacity/position before drawing
            let renderOpacity = Math.max(0, Math.min(1, currentOpacity));
            let dx = 0;
            let dy = 0;
            
            if (effects.includes('shiver')) {
              dx = (Math.random() - 0.5) * 6;
              dy = (Math.random() - 0.5) * 6;
            } if (effects.includes('flicker')) {
              if (Math.random() > 0.8) renderOpacity = renderOpacity * 0.3;
            } if (effects.includes('glitch')) {
              if (Math.random() > 0.8) {
                 dx += (Math.random() - 0.5) * 15;
              }
            }

            ctx.globalAlpha = renderOpacity;
            
            const fontWeight = element.fontWeight || 600;
            const fontFamily = element.fontFamily || 'Instrument Sans';
            ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", ui-sans-serif, system-ui, sans-serif`;
            ctx.fillStyle = element.color || '#ffffff';
            ctx.textBaseline = 'middle';
            
            // Shadows will be applied iteratively during drawing
            
            const isOutline = effects.includes('outline');
            if (isOutline) {
              ctx.lineWidth = 2 * scale;
              ctx.strokeStyle = element.color || '#ffffff';
              ctx.fillStyle = 'transparent';
            }
            
            if (effects.includes('wave')) {
               const waveProgress = (time % 2000) / 2000;
               dy += Math.sin(waveProgress * Math.PI * 2) * 5 * scale;
            }

            
            const paragraphs = (renderedText || '').split('\n');
            const lines: string[] = [];
            const maxWidth = element.width;
            
            paragraphs.forEach(p => {
              const words = p.split(' ');
              let currentLine = '';
              
              for (let j = 0; j < words.length; j++) {
                const testLine = currentLine + (currentLine ? ' ' : '') + words[j];
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && j > 0) {
                  lines.push(currentLine);
                  currentLine = words[j];
                } else {
                  currentLine = testLine;
                }
              }
              lines.push(currentLine);
            });
            
            const lineHeight = fontSize * 1.5;
            const totalHeight = lines.length * lineHeight;
            let startY = (element.height - totalHeight) / 2 + lineHeight / 2;
            
            const totalWords = element.content.split(/\s+/).filter(w => w.trim().length > 0).length;
            let wordCount = 0;
            const spaceWidth = ctx.measureText(' ').width;
            
            lines.forEach(line => {
              if (!isWordEffect) {
                ctx.textAlign = 'center';
                const drawTextFn = () => isOutline ? ctx.strokeText(line, element.width / 2 + dx, startY + dy) : ctx.fillText(line, element.width / 2 + dx, startY + dy);
                
                // Base shadow resets
                ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
                
                if (effects.includes('drop-shadow')) {
                  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4 * scale;
                  drawTextFn();
                  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
                }
                if (effects.includes('bloom')) {
                  ctx.shadowColor = element.color || '#ffffff'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 0;
                  drawTextFn();
                  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
                }
                if (effects.includes('neon')) {
                  ctx.shadowColor = element.color || '#ffffff'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 0;
                  drawTextFn();
                  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
                }
                // Final solid draw
                drawTextFn();
              } else {
                const words = line.split(' ');
                const lineWidth = ctx.measureText(line).width;
                let currentX = element.width / 2 - lineWidth / 2;
                
                words.forEach((word) => {
                  if (word.trim().length === 0) {
                    currentX += spaceWidth;
                    return;
                  }
                  
                  const w = ctx.measureText(word).width;
                  const myIdx = wordCount++;
                  const wordStartTime = (myIdx / totalWords) * (textEffectDuration * 0.7);
                  const wordDuration = textEffectDuration * 0.3;
                  
                  let p = 1;
                  if (timeSinceStart < wordStartTime) {
                    p = 0;
                  } else if (timeSinceStart >= wordStartTime && timeSinceStart < wordStartTime + wordDuration) {
                    const t = (timeSinceStart - wordStartTime) / wordDuration;
                    p = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad
                  }
                  
                  ctx.save();
                  let wordRenderOp = renderOpacity;
                  let wordDx = dx;
                  let wordDy = dy;
                  let scale = 1;
                  
                  if (effects.includes('fly-words')) {
                    wordDy += (1 - p) * 50;
                    wordRenderOp *= p;
                  } if (effects.includes('zoom-words')) {
                    scale = 0.2 + p * 0.8;
                    wordRenderOp *= p;
                  } if (effects.includes('fade-words')) {
                    wordRenderOp *= p;
                  }
                  
                  ctx.globalAlpha = wordRenderOp;
                  ctx.translate(currentX + w / 2 + wordDx, startY + wordDy);
                  ctx.scale(scale, scale);
                  ctx.textAlign = 'center';
                  const drawWordFn = () => isOutline ? ctx.strokeText(word, 0, 0) : ctx.fillText(word, 0, 0);
                  
                  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
                  
                  if (effects.includes('drop-shadow')) {
                    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4 * scale;
                    drawWordFn();
                    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
                  }
                  if (effects.includes('bloom')) {
                    ctx.shadowColor = element.color || '#ffffff'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 0;
                    drawWordFn();
                    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
                  }
                  if (effects.includes('neon')) {
                    ctx.shadowColor = element.color || '#ffffff'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 0;
                    drawWordFn();
                    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
                  }
                  drawWordFn();
                  ctx.restore();
                  
                  currentX += w + spaceWidth;
                });
              }
              startY += lineHeight;
            });
            
            // reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          } else if (element.type === 'image') {
            const img = imageCache[element.content];
            if (img) {
              const imgAspect = img.width / img.height;
              const elAspect = element.width / element.height;
              let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;

              if (imgAspect > elAspect) {
                // Image is wider than element
                sWidth = img.height * elAspect;
                sx = (img.width - sWidth) / 2;
              } else {
                // Image is taller than element
                sHeight = img.width / elAspect;
                sy = (img.height - sHeight) / 2;
              }
              ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, element.width, element.height);
              if (element.mediaDimness !== undefined && element.mediaDimness > 0) {
                 ctx.fillStyle = 'black';
                 ctx.globalAlpha = element.mediaDimness * currentOpacity;
                 ctx.fillRect(0, 0, element.width, element.height);
              }
            }
          }

          ctx.restore();
        });


        ctx.restore();

        // Render global overlays (grid, keylight, post-processing)
        if (gridOverlay !== 'none') {
           ctx.save();
           ctx.globalCompositeOperation = 'overlay';
           ctx.globalAlpha = 0.3 * 0.2;
           const gridSize = (gridOverlay === 'large' ? 150 : 50) * scale;
           ctx.strokeStyle = gridColor || '#ffffff';
           ctx.lineWidth = 1;
           ctx.beginPath();
           for (let x = 0; x <= targetWidth; x += gridSize) {
              ctx.moveTo(x, 0); ctx.lineTo(x, targetHeight);
           }
           for (let y = 0; y <= targetHeight; y += gridSize) {
              ctx.moveTo(0, y); ctx.lineTo(targetWidth, y);
           }
           ctx.stroke();
           ctx.restore();
        }

        if (keylightType !== 'none') {
           ctx.save();
           ctx.globalCompositeOperation = 'screen';
           ctx.globalAlpha = 0.8;
           const grad = keylightType === 'up' 
             ? ctx.createLinearGradient(0, targetHeight, 0, 0)
             : ctx.createLinearGradient(0, 0, 0, targetHeight);
           grad.addColorStop(0, 'rgba(0,0,0,0)');
           grad.addColorStop(0.4, 'rgba(0,0,0,0)');
           grad.addColorStop(1, keylightColor || '#ffffff');
           ctx.fillStyle = grad;
           ctx.fillRect(0, 0, targetWidth, targetHeight);
           ctx.restore();
        }

        if (postProcessingFx !== 'none') {
           ctx.save();
           ctx.globalCompositeOperation = 'overlay';
           ctx.globalAlpha = 0.3;
           if (postProcessingFx === 'vhs') {
              ctx.fillStyle = 'rgba(0,0,0,0.1)';
              for (let y = 0; y < targetHeight; y += 4 * scale) {
                 ctx.fillRect(0, y + 2 * scale, targetWidth, 2 * scale);
              }
           } else if (postProcessingFx === 'crt') {
              ctx.fillStyle = 'rgba(0,0,0,0.25)';
              for (let y = 0; y < targetHeight; y += 4 * scale) {
                 ctx.fillRect(0, y + 2 * scale, targetWidth, 2 * scale);
              }
              ctx.globalAlpha = 0.05;
              for (let x = 0; x < targetWidth; x += 6 * scale) {
                 ctx.fillStyle = 'red'; ctx.fillRect(x, 0, 2 * scale, targetHeight);
                 ctx.fillStyle = 'green'; ctx.fillRect(x+2 * scale, 0, 2 * scale, targetHeight);
                 ctx.fillStyle = 'blue'; ctx.fillRect(x+4 * scale, 0, 2 * scale, targetHeight);
              }
           } else if (postProcessingFx === 'noise') {
              const noiseImg = imageCache['noise_svg_fx'];
              if (noiseImg) {
                 const pattern = ctx.createPattern(noiseImg, 'repeat');
                 if (pattern) {
                    ctx.fillStyle = pattern;
                    ctx.fillRect(0, 0, targetWidth, targetHeight);
                 }
              }
           }
           ctx.restore();
        }

        if (encoderError) throw new Error('Video encoder error: ' + encoderError.message);
        const frame = new VideoFrame(hiddenCanvas, { timestamp: i * 1e6 / fps });
        videoEncoder.encode(frame, { keyFrame: i % 30 === 0 });
        frame.close();

        setProgress(i / totalFrames);
        if (i % 30 === 0) {
          const pct = Math.round((i / totalFrames) * 100);
          setExportLogs(prev => [...prev, `> Rendered frame ${i}/${totalFrames} (${pct}%) - Size: ${targetWidth}x${targetHeight}`]);
        }
        if (i % 5 === 0) {
          await new Promise(r => setTimeout(r, 0)); // yield
        }
      }

      setExportLogs(prev => [...prev, '> Flushing remaining video frames...']);
      await videoEncoder.flush();
      if (audioEncoder) {
        audioEncoder.close();
      }
      videoEncoder.close();
      setExportLogs(prev => [...prev, '> Finalizing MP4 container...']);
      muxer.finalize();
      
      if (writableStream) {
        await writableStream.close();
      } else {
        const buffer = (muxer.target as ArrayBufferTarget).buffer;
        setExportLogs(prev => [...prev, '> Creating video blob...']);
      const blob = new Blob([buffer], { type: 'video/mp4' });
        setExportLogs(prev => [...prev, '> Export complete. Triggering download...']);
      const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'export.mp4';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
      setProgress(0);
      setCurrentTime(0);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowSettingsModal(true)}
        disabled={isExporting}
        title="Export Video"
        className={className}
      >
        <Upload size={iconSize} className="text-stone-400 group-hover:scale-110 transition-transform group-hover:text-[var(--color-accent)]" />
        {showText && <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Export</span>}
      </button>

      <AnimatePresence>
        {showSettingsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="glass-panel-heavy text-text-main w-full max-w-sm rounded-[24px] flex flex-col p-6 pointer-events-auto shadow-none border float-border"
            >
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xl font-bold flex items-center gap-2"><Settings size={20} className="text-[var(--color-accent)]" /> Export Settings</h3>
                 <button onClick={() => setShowSettingsModal(false)} className="w-8 h-8 flex items-center justify-center bg-button-bg hover:bg-button-hover rounded-xl transition-colors"><X size={16} /></button>
              </div>

              <div className="flex flex-col gap-4 mb-8">
                 <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-muted">Resolution</label>
                    <CustomSelect 
                       value={resolution}
                       onChange={(val) => setResolution(val)}
                       options={[
                         { value: '720p', label: '720p (HD)' },
                         { value: '1080p', label: '1080p (FHD)' },
                         { value: '4k', label: '4K (UHD)' },
                         { value: '8k', label: '8K (FUHD)' }
                       ]}
                    />
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-muted">Framerate (FPS)</label>
                    <CustomSelect 
                       value={fps.toString()}
                       onChange={(val) => setFps(parseInt(val, 10))}
                       options={[
                         { value: '12', label: '12 fps' },
                         { value: '24', label: '24 fps (Cinematic)' },
                         { value: '30', label: '30 fps (Standard)' },
                         { value: '60', label: '60 fps (Smooth)' },
                         { value: '90', label: '90 fps' },
                         { value: '120', label: '120 fps' }
                       ]}
                    />
                 </div>
              </div>

              <button 
                onClick={() => {
                   setShowSettingsModal(false);
                   cancelRef.current = false;
                   handleExport();
                }}
                className="w-full py-3 bg-[var(--color-accent)] text-text-main font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Start Export
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExporting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]  p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="glass-panel-heavy text-text-main w-full max-w-md rounded-[32px] flex flex-col p-6 sm:p-8 items-center text-center pointer-events-auto"
            >
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)] shadow-inner mb-6">
                <Film size={32} className="animate-pulse" />
              </div>
              <h3 className="text-xl font-bold mb-2">Exporting Video</h3>
              <p className="text-sm text-text-muted mb-6">Please wait while your video is being rendered. This might take a minute.</p>
              <button 
                onClick={() => { cancelRef.current = true; }} 
                className="mb-4 px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-xl font-bold transition-colors w-full border border-red-500/30"
              >
                Cancel Export
              </button>
              
                            <div className="w-full bg-[var(--theme-input-bg)] rounded-full h-3 mb-2 overflow-hidden border border-panel-border">
                <div 
                  className="bg-[var(--color-accent)] h-full transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <span className="text-sm font-semibold mb-4">{Math.round(progress * 100)}%</span>
              
              <div 
                ref={scrollRef}
                className="w-full h-32 bg-black/60 rounded-xl p-3 overflow-y-auto text-left flex flex-col gap-1 border border-panel-border/30 custom-scrollbar mt-2"
              >
                {exportLogs.map((log, i) => (
                  <span key={i} className="text-[10px] font-mono text-emerald-400 opacity-90 break-words leading-tight">
                    {log}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
