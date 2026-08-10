import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { useStore } from '../store/useStore';
import { EditorElement } from '../types';
import { Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

const easings = {
  'linear': (t: number) => t,
  'ease-in': (t: number) => t * t,
  'ease-out': (t: number) => t * (2 - t),
  'ease-in-out': (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
};

export const ElementRenderer: React.FC<{ element: EditorElement }> = ({ element }) => {
  const currentTime = useStore((state) => state.currentTime);
  const selectedElementId = useStore((state) => state.selectedElementId);
  const setSelectedElementId = useStore((state) => state.setSelectedElementId);
  const updateElement = useStore((state) => state.updateElement);
  const globalTextScale = useStore((state) => state.globalTextScale) || 1;
  const canvasScale = useStore((state) => state.canvasScale);

  const isSelected = selectedElementId === element.id;
  const isVisible = currentTime >= element.startTime && currentTime <= element.endTime;

  const [isEditingText, setIsEditingText] = useState(false);
  const textInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isPlaying = useStore((state) => state.isPlaying);

  useEffect(() => {
    if (isEditingText && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isEditingText]);

  const baseOpacity = element.opacity ?? 1;
  let currentOpacity = baseOpacity;
  let currentScale = 1;
  let currentX = element.x;
  let currentY = element.y;

  const animDuration = 1000;
  const easeFn = easings[element.easing as keyof typeof easings] || easings['linear'];

  // In Animation
  if (currentTime < element.startTime + animDuration && currentTime >= element.startTime) {
    const progress = (currentTime - element.startTime) / animDuration;
    const easedProgress = easeFn(progress);

    if (element.animationIn === 'fade') {
      currentOpacity = baseOpacity * easedProgress;
    } else if (element.animationIn === 'scale') {
      currentScale = easedProgress;
    } else if (element.animationIn === 'slide') {
      currentX = element.x - 100 * (1 - easedProgress);
    } else if (element.animationIn === 'fade-slide') {
      currentOpacity = baseOpacity * easedProgress;
      currentX = element.x - 50 * (1 - easedProgress);
    } else if (element.animationIn === 'fade-slide-up') {
      currentOpacity = baseOpacity * easedProgress;
      currentY = element.y + 50 * (1 - easedProgress);
    } else if (element.animationIn === 'zoom-in') {
      currentScale = 0.8 + 0.2 * easedProgress;
    } else if (element.animationIn === 'fade-zoom-in') {
      currentOpacity = baseOpacity * easedProgress;
      currentScale = 0.8 + 0.2 * easedProgress;
    } else if (element.animationIn === 'fade-zoom-out') {
      currentOpacity = baseOpacity * easedProgress;
      currentScale = 1.2 - 0.2 * easedProgress;
    }
  }

  // Out Animation
  if (currentTime > element.endTime - animDuration && currentTime <= element.endTime) {
    // For exit animation, use ease-out if defaults or inverse
    const outEaseFn = easings['ease-out'];
    const progress = (element.endTime - currentTime) / animDuration; // goes 1 to 0
    const easedProgress = outEaseFn(progress);

    if (element.animationOut === 'fade') {
      currentOpacity = baseOpacity * easedProgress;
    } else if (element.animationOut === 'scale') {
      currentScale = easedProgress;
    } else if (element.animationOut === 'slide') {
      currentX = element.x + 100 * (1 - easedProgress);
    } else if (element.animationOut === 'fade-slide') {
      currentOpacity = baseOpacity * easedProgress;
      currentX = element.x + 50 * (1 - easedProgress);
    } else if (element.animationOut === 'fade-slide-up') {
      currentOpacity = baseOpacity * easedProgress;
      currentY = element.y - 50 * (1 - easedProgress);
    } else if (element.animationOut === 'zoom-out') {
      currentScale = 0.8 + 0.2 * easedProgress;
    } else if (element.animationOut === 'fade-zoom-in') {
      currentOpacity = baseOpacity * easedProgress;
      currentScale = 1.2 - 0.2 * easedProgress;
    } else if (element.animationOut === 'fade-zoom-out') {
      currentOpacity = baseOpacity * easedProgress;
      currentScale = 0.8 + 0.2 * easedProgress;
    }
  }

  useEffect(() => {
    const mediaEl = element.type === 'audio' ? audioRef.current : (element.type === 'video' ? videoRef.current : null);
    if (mediaEl) {
      const volumeMultiplier = baseOpacity > 0 ? (currentOpacity / baseOpacity) : 1;
      // Also apply fade if animation isn't explicitly fade but we want audio to fade out? 
      // The user just requested fade in/out so if they choose 'fade' it sets currentOpacity.
      mediaEl.volume = Math.max(0, Math.min(1, (element.volume ?? 1) * volumeMultiplier));
      const expectedTime = (currentTime - element.startTime) / 1000;
      
      if (isPlaying) {
         if (Math.abs(mediaEl.currentTime - expectedTime) > 0.5) {
           mediaEl.currentTime = Math.max(0, expectedTime);
         }
         if (mediaEl.paused) {
           mediaEl.play().catch(() => {});
         }
      } else {
         if (!mediaEl.paused) mediaEl.pause();
         mediaEl.currentTime = Math.max(0, expectedTime);
      }
    }
  }, [isPlaying, currentTime, element.startTime, element.endTime, element.type, element.volume, currentOpacity, baseOpacity]);

  if (!isVisible && !isSelected) {
    if (element.type === 'audio' && audioRef.current) {
      audioRef.current.pause();
    } else if (element.type === 'video' && videoRef.current) {
      videoRef.current.pause();
    }
    return null;
  }

  // Continuous Media Effect (Parallax)
  let mediaScale = 1;
  if (element.mediaEffect && element.mediaEffect !== 'none') {
    const totalDuration = element.endTime - element.startTime;
    if (totalDuration > 0) {
      const progress = Math.max(0, Math.min(1, (currentTime - element.startTime) / totalDuration));
      if (element.mediaEffect === 'parallax-zoom-in') {
         mediaScale = 1 + 0.15 * progress;
      } else if (element.mediaEffect === 'parallax-zoom-out') {
         mediaScale = 1.15 - 0.15 * progress;
      }
    }
  }
  currentScale *= mediaScale;

  if (!isVisible && isSelected) {
    currentOpacity = 0.3; // Show a ghost if selected but out of time bounds
  }

  const renderContent = () => {
    switch (element.type) {
      case 'text':
        const textEffectClass = element.textEffect && element.textEffect !== 'none' ? `effect-${element.textEffect}` : '';
        const fontFamily = element.fontFamily || 'Instrument Sans';
        return isEditingText ? (
          <textarea
            ref={textInputRef as any}
            value={element.content}
            onChange={(e) => updateElement(element.id, { content: e.target.value })}
            onBlur={() => setIsEditingText(false)}
            onKeyDown={(e) => {
               if (e.key === 'Enter' && e.shiftKey) {
                 // Newline
               } else if (e.key === 'Enter') {
                 e.preventDefault();
                 setIsEditingText(false);
               }
            }}
            className={`bg-transparent border-none outline-none w-full h-full flex items-center justify-center text-center resize-none whitespace-pre-wrap break-words ${textEffectClass}`}
            style={{ color: element.color, fontSize: `${(element.fontSize || 32) * globalTextScale}px`, lineHeight: 1.5, fontWeight: element.fontWeight || 600, fontFamily: `"${fontFamily}", sans-serif` }}
          />
        ) : (
          <div
            onDoubleClick={() => setIsEditingText(true)}
            className={`w-full h-full flex items-center justify-center cursor-text text-center select-none ${textEffectClass}`}
            style={{ color: element.color, fontSize: `${(element.fontSize || 32) * globalTextScale}px`, lineHeight: 1.5, fontWeight: element.fontWeight || 600, fontFamily: `"${fontFamily}", sans-serif` }}
          >
            <span className="whitespace-pre-wrap break-words w-full" style={{ display: 'block' }}>{element.content}</span>
          </div>
        );
      case 'image':
        if (!element.content) {
          return (
            <div className="w-full h-full bg-black pointer-events-none"></div>
          );
        }
        return (
          <div className="w-full h-full relative pointer-events-none">
            <img src={element.content} alt="" className="w-full h-full object-cover" />
            {element.mediaDimness !== undefined && element.mediaDimness > 0 && (
               <div className="absolute inset-0 bg-black" style={{ opacity: element.mediaDimness }} />
            )}
          </div>
        );
      case 'video':
        if (!element.content) {
          return (
            <div className="w-full h-full bg-black pointer-events-none"></div>
          );
        }
        return (
          <div className="w-full h-full relative pointer-events-none">
            <video ref={videoRef} src={element.content} className="w-full h-full object-cover" autoPlay loop muted playsInline />
            {element.mediaDimness !== undefined && element.mediaDimness > 0 && (
               <div className="absolute inset-0 bg-black" style={{ opacity: element.mediaDimness }} />
            )}
          </div>
        );
      case 'audio':
        if (!element.content) return null;
        return (
          <div className="w-full h-full relative pointer-events-none flex items-center justify-center bg-button-bg text-text-muted rounded-xl border border-panel-border shadow-sm">
            <audio ref={audioRef} src={element.content} />
            <div className="flex flex-col items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
              <span className="text-[10px] mt-1 font-medium text-text-muted">Audio Track</span>
            </div>
          </div>
        );
      case 'shape':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: element.color,
              borderRadius: element.content === 'circle' ? '50%' : '0',
            }}
          />
        );
      default:
        return null;
    }
  };

  if (element.type === 'audio') {
    return <audio ref={audioRef} src={element.content} style={{ display: 'none' }} />;
  }

  return (
    <Rnd
      position={{ x: currentX, y: currentY }}
      size={{ width: element.width, height: element.height }}
      onDragStop={(e, d) => {
        updateElement(element.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateElement(element.id, {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          ...position,
        });
      }}
      onClick={(e: any) => {
        e.stopPropagation();
        setSelectedElementId(element.id);
      }}
      className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        opacity: currentOpacity,
        zIndex: isSelected ? 10 : 1,
      }}
      disableDragging={!isSelected}
      enableResizing={isSelected ? {
        bottom: true, bottomLeft: true, bottomRight: true,
        left: true, right: true, top: true, topLeft: true, topRight: true
      } : false}
      scale={canvasScale}
    >
      <div style={{
        width: '100%', height: '100%',
        transform: `rotate(${element.rotation}deg) scale(${currentScale})`,
        transformOrigin: 'center center',
      }}>
        {renderContent()}
      </div>
    </Rnd>
  );
}
