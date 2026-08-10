import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Muxer, ArrayBufferTarget, FileSystemWritableFileStreamTarget } from 'mp4-muxer';
import { TTS_VOICES } from '../lib/ttsVoices';

export function ExportButton({ className = "flex items-center justify-center w-10 h-10 bg-text-main text-app-bg rounded-full hover:opacity-80 transition-all disabled:opacity-50", iconSize = 18 }: { className?: string, iconSize?: number }) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const duration = useStore((state) => state.duration);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const setCurrentTime = useStore((state) => state.setCurrentTime);
  const elements = useStore((state) => state.elements);
  const globalTextScale = useStore((state) => state.globalTextScale) || 1;
  const canvasAspectRatio = useStore((state) => state.canvasAspectRatio);
  const backgroundType = useStore((state) => state.backgroundType);
  const backgroundColor = useStore((state) => state.backgroundColor);
  const backgroundGradient = useStore((state) => state.backgroundGradient);
  const backgroundVideoUrl = useStore((state) => state.backgroundVideoUrl);
  const backgroundSpeed = useStore((state) => state.backgroundSpeed) || 1;

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);
    setIsPlaying(false);
    setCurrentTime(0);

    // Wait a tick for canvas to reset
    await new Promise(resolve => setTimeout(resolve, 100));

    const renderCanvas = document.getElementById('render-canvas');
    if (!renderCanvas) {
      setIsExporting(false);
      return;
    }

    // Determine target resolution based on aspect ratio
    let targetWidth = 1080;
    let targetHeight = 1080;
    const [wRatio, hRatio] = canvasAspectRatio.split('/').map(Number);
    if (wRatio && hRatio) {
      if (wRatio > hRatio) {
        targetHeight = 1080;
        targetWidth = Math.round(1080 * (wRatio / hRatio));
      } else {
        targetWidth = 1080;
        targetHeight = Math.round(1080 * (hRatio / wRatio));
      }
    }

    // Ensure even dimensions for video codecs
    targetWidth = Math.round(targetWidth / 2) * 2;
    targetHeight = Math.round(targetHeight / 2) * 2;

    const hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = targetWidth;
    hiddenCanvas.height = targetHeight;
    const ctx = hiddenCanvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
      setIsExporting(false);
      return;
    }

    const fps = 30;
    const totalFrames = Math.ceil((duration / 1000) * fps);
    const frameDuration = 1000 / fps;

    let muxer = null;
    let videoEncoder = null;
    let audioEncoder = null;
    const audioCtx = new AudioContext({ sampleRate: 44100 });
    const bgAudioUrl = useStore.getState().backgroundAudioUrl;
    const bgAudioVol = useStore.getState().backgroundAudioVolume;

    try {
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
            
            const res = await fetch(`/api/tts?text=${encodeURIComponent(el.content)}&lang=${lang}${voiceParam}`);
            if (res.ok) {
              const arrayBuffer = await res.arrayBuffer();
              const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
              audioBuffers.push({ el, buffer: audioBuffer });
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

      videoEncoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: e => console.error(e),
      });

      videoEncoder.configure({
        codec: 'avc1.640032', // High profile, level 5.0
        width: targetWidth,
        height: targetHeight,
        bitrate: 8_000_000, 
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
        const offlineCtx = new OfflineAudioContext(2, Math.max(1, Math.ceil(44100 * (duration / 1000))), 44100);
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
            source.start(0, 0, duration / 1000);
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

      const easingFunctions: Record<string, (t: number) => number> = {
        'linear': t => t,
        'ease-in': t => t * t,
        'ease-out': t => t * (2 - t),
        'ease-in-out': t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      };

      const scale = 1;
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
          
          const size = backgroundType === 'scrolling-dots' ? 30 : 50;
          let offsetY = (timeSec * backgroundSpeed * 50 / 15) % size;
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
          const size = 40;
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
          } else if (timeLeft < animDuration && element.animationOut !== 'none') {
            const progress = Math.max(0, timeLeft / animDuration);
            const easedProgress = easingFunctions[element.easing || 'linear']?.(progress) || progress;
            if (element.animationOut === 'fade') currentOpacity = element.opacity * easedProgress;
            else if (element.animationOut === 'slide') currentX = element.x + 50 * (1 - easedProgress);
            else if (element.animationOut === 'scale') { currentScale = easedProgress; currentOpacity = element.opacity * easedProgress; }
            else if (element.animationOut === 'fade-slide') { currentOpacity = element.opacity * easedProgress; currentX = element.x + 50 * (1 - easedProgress); }
            else if (element.animationOut === 'fade-slide-up') { currentOpacity = element.opacity * easedProgress; currentY = element.y - 50 * (1 - easedProgress); }
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
            const fontSize = (element.fontSize || 32) * globalTextScale;
            // Text Effects modifying opacity/position before drawing
            let renderOpacity = Math.max(0, Math.min(1, currentOpacity));
            let dx = 0;
            let dy = 0;
            
            if (element.textEffect === 'shiver') {
              dx = (Math.random() - 0.5) * 6;
              dy = (Math.random() - 0.5) * 6;
            } else if (element.textEffect === 'flicker') {
              if (Math.random() > 0.8) renderOpacity = renderOpacity * 0.3;
            }

            ctx.globalAlpha = renderOpacity;
            
            const fontWeight = element.fontWeight || 600;
            const fontFamily = element.fontFamily || 'Instrument Sans';
            ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", ui-sans-serif, system-ui, sans-serif`;
            ctx.fillStyle = element.color || '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            if (element.textEffect === 'bloom') {
              ctx.shadowColor = element.color || '#ffffff';
              ctx.shadowBlur = 20;
            } else if (element.textEffect === 'neon') {
              ctx.shadowColor = element.color || '#ffffff';
              ctx.shadowBlur = 40;
            } else {
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;
            }
            
            const paragraphs = (element.content || '').split('\n');
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
            
            lines.forEach(line => {
              ctx.fillText(line, element.width / 2 + dx, startY + dy);
              if (element.textEffect === 'bloom' || element.textEffect === 'neon') {
                 // double draw for extra glow
                 ctx.fillText(line, element.width / 2 + dx, startY + dy);
              }
              startY += lineHeight;
            });
            
            // reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
          } else if (element.type === 'image') {
            const img = imageCache[element.content];
            if (img) {
              ctx.drawImage(img, 0, 0, element.width, element.height);
            }
          }

          ctx.restore();
        });

        ctx.restore();

        const frame = new VideoFrame(hiddenCanvas, { timestamp: i * 1e6 / fps });
        videoEncoder.encode(frame, { keyFrame: i % 30 === 0 });
        frame.close();

        setProgress(i / totalFrames);
        if (i % 5 === 0) {
          await new Promise(r => setTimeout(r, 0)); // yield
        }
      }

      await videoEncoder.flush();
      if (audioEncoder) {
        audioEncoder.close();
      }
      videoEncoder.close();
      muxer.finalize();
      
      if (writableStream) {
        await writableStream.close();
      } else {
        const buffer = (muxer.target as ArrayBufferTarget).buffer;
        const blob = new Blob([buffer], { type: 'video/mp4' });
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
    <button
      onClick={handleExport}
      disabled={isExporting}
      title="Export Video"
      className={className}
    >
      {isExporting ? (
        <Loader2 size={iconSize} className="animate-spin" />
      ) : (
        <Download size={iconSize} />
      )}
    </button>
  );
}
