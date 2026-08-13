import React, { useRef, useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ElementRenderer } from './ElementRenderer';


function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16) || 255;
  const g = parseInt(hex.slice(3, 5), 16) || 255;
  const b = parseInt(hex.slice(5, 7), 16) || 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function Canvas() {
  const elements = useStore((state) => state.elements);
  const setSelectedElementId = useStore((state) => state.setSelectedElementId);
  const canvasAspectRatio = useStore((state) => state.canvasAspectRatio);
  const backgroundType = useStore((state) => state.backgroundType);
  const backgroundColor = useStore((state) => state.backgroundColor);
  const backgroundGradient = useStore((state) => state.backgroundGradient);
  const backgroundVideoUrl = useStore((state) => state.backgroundVideoUrl);
  const backgroundSpeed = useStore((state) => state.backgroundSpeed) || 1;
  const keylightType = useStore((state) => state.keylightType);
  const keylightColor = useStore((state) => state.keylightColor);
  const gridOverlay = useStore((state) => state.gridOverlay);
  const gridColor = useStore((state) => state.gridColor);
  const postProcessingFx = useStore((state) => state.postProcessingFx);
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useStore((state) => state.canvasScale);
  const setScale = useStore((state) => state.setCanvasScale);

  const baseWidth = canvasAspectRatio === '16/9' ? 1920 : canvasAspectRatio === '9/16' ? 1080 : 1080;
  const baseHeight = canvasAspectRatio === '16/9' ? 1080 : canvasAspectRatio === '9/16' ? 1920 : canvasAspectRatio === '4/5' ? 1350 : 1080;

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const scaleX = width / baseWidth;
        const scaleY = height / baseHeight;
        setScale(Math.min(scaleX, scaleY) * 0.95); // 95% to leave a tiny padding
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [baseWidth, baseHeight]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === document.getElementById('render-canvas') || (e.target as HTMLElement).classList.contains('canvas-background')) {
      setSelectedElementId(null);
    }
  };

  const placeholders = elements.filter(el => el.isPlaceholder);
  const normalElements = elements.filter(el => !el.isPlaceholder);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center p-2"
    >
      <div 
        className="relative flex-shrink-0"
        style={{ width: baseWidth * scale, height: baseHeight * scale }}
      >
        <div 
          id="render-canvas"
          className="canvas-background absolute top-0 left-0 outline outline-1 outline-zinc-700 shadow-2xl overflow-hidden pointer-events-auto"
          style={{ 
            width: baseWidth,
            height: baseHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            backgroundColor: backgroundType === 'solid' ? backgroundColor : '#000',
            backgroundImage: backgroundType === 'gradient' ? `linear-gradient(to bottom right, ${backgroundGradient[0]}, ${backgroundGradient[1] || backgroundGradient[0]})` : 'none'
          }}
          onClick={handleCanvasClick}
        >
          {placeholders.length > 0 && (
            <div className="absolute inset-0 z-0 pointer-events-auto">
              {placeholders.map((el) => (
                <ElementRenderer key={el.id} element={el} />
              ))}
            </div>
          )}
          
          {backgroundType === 'animated-gradient' && (
          <div 
            className="absolute inset-0 z-0 animate-gradient-bg" 
            style={{ 
              backgroundImage: `linear-gradient(-45deg, ${backgroundGradient[0]}, ${backgroundGradient[1] || '#000'}, ${backgroundGradient[2] || backgroundGradient[0]})`,
              backgroundSize: '400% 400%',
              animationDuration: `${15 / backgroundSpeed}s`
            }} 
          />
        )}
        {backgroundType === 'scrolling-grid' && (
          <div className="absolute inset-0 z-0 overflow-hidden bg-transparent">
            <div 
              className="absolute inset-[-100%] z-0 animate-scrolling-grid opacity-30" 
              style={{
                backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
                animationDuration: `${15 / backgroundSpeed}s`
              }}
            />
          </div>
        )}
        {backgroundType === 'scrolling-dots' && (
          <div className="absolute inset-0 z-0 overflow-hidden bg-transparent">
            <div 
              className="absolute inset-[-100%] z-0 animate-scrolling-dots opacity-40" 
              style={{
                backgroundImage: `radial-gradient(#555 1.5px, transparent 1.5px)`,
                backgroundSize: '30px 30px',
                animationDuration: `${15 / backgroundSpeed}s`
              }}
            />
          </div>
        )}
        {backgroundType === 'scrolling-lines' && (
          <div className="absolute inset-0 z-0 overflow-hidden bg-transparent">
            <div 
              className="absolute inset-[-100%] z-0 animate-scrolling-lines opacity-30" 
              style={{
                backgroundImage: `linear-gradient(to bottom, #333 2px, transparent 2px)`,
                backgroundSize: '100% 10px',
                animationDuration: `${15 / backgroundSpeed}s`
              }}
            />
          </div>
        )}
        {backgroundType === 'scanning-laser' && (
          <div className="absolute inset-0 z-0 overflow-hidden bg-transparent">
            <div 
              className="absolute inset-0 z-0 opacity-50" 
              style={{
                backgroundImage: `linear-gradient(to bottom, transparent, ${backgroundGradient[0] || 'var(--color-accent)'} 50%, transparent)`,
                backgroundSize: '100% 5px',
                backgroundRepeat: 'no-repeat',
                animation: `scanning-laser-animation ${5 / backgroundSpeed}s linear infinite`
              }}
            />
          </div>
        )}
        {backgroundType === 'scrolling-diagonal' && (
          <div className="absolute inset-0 z-0 overflow-hidden bg-transparent">
            <div 
              className="absolute inset-[-100%] z-0 animate-scrolling-diagonal opacity-30" 
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, #333 0, #333 1px, transparent 1px, transparent 50px)`,
                backgroundSize: '200% 200%',
                animationDuration: `${15 / backgroundSpeed}s`
              }}
            />
          </div>
        )}
        {backgroundType === 'pulse-grid' && (
          <div className="absolute inset-0 z-0 overflow-hidden bg-transparent">
            <div 
              className="absolute inset-0 z-0 animate-pulse-grid" 
              style={{
                backgroundImage: `linear-gradient(to right, ${backgroundGradient[0] || '#333'} 1px, transparent 1px), linear-gradient(to bottom, ${backgroundGradient[0] || '#333'} 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                animationDuration: `${4 / (backgroundSpeed || 1)}s`
              }}
            />
          </div>
        )}
        {backgroundType === 'radar-sweep' && (
          <div className="absolute inset-0 z-0 overflow-hidden bg-transparent flex items-center justify-center">
            <div 
              className="absolute inset-0 z-0 opacity-20" 
              style={{
                backgroundImage: `radial-gradient(circle, transparent 20%, #333 20%, #333 21%, transparent 21%, transparent 40%, #333 40%, #333 41%, transparent 41%, transparent 60%, #333 60%, #333 61%, transparent 61%, transparent 80%, #333 80%, #333 81%, transparent 81%)`
              }}
            />
            <div 
              className="absolute z-0 animate-radar-sweep opacity-50" 
              style={{
                width: '150%',
                height: '150%',
                background: `conic-gradient(from 0deg, transparent 70%, ${backgroundGradient[0] || '#0f0'} 100%)`,
                borderRadius: '50%',
                animationDuration: `${10 / backgroundSpeed}s`
              }}
            />
          </div>
        )}
        {backgroundType === 'video' && backgroundVideoUrl && (
          <video 
            src={backgroundVideoUrl} 
            className="absolute inset-0 w-full h-full object-cover z-0" 
            autoPlay 
            loop 
            muted 
            playsInline 
          />
        )}
        
        {gridOverlay !== 'none' && (
          <div className="absolute inset-0 z-0 pointer-events-none mix-blend-overlay opacity-30" style={{
            backgroundImage: `linear-gradient(to right, ${hexToRgba(gridColor, 0.2)} 1px, transparent 1px), linear-gradient(to bottom, ${hexToRgba(gridColor, 0.2)} 1px, transparent 1px)`,
            backgroundSize: gridOverlay === 'large' ? '150px 150px' : '50px 50px'
          }} />
        )}
        
        {keylightType !== 'none' && (
          <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-80" style={{
            backgroundImage: `linear-gradient(to ${keylightType === 'up' ? 'top' : 'bottom'}, transparent 40%, ${keylightColor})`
          }} />
        )}

        
        {postProcessingFx !== 'none' && (
          <div className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay opacity-30" style={{
            backgroundImage: postProcessingFx === 'crt' 
              ? 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))'
              : postProcessingFx === 'vhs'
              ? 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)'
              : postProcessingFx === 'noise'
              ? 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
              : 'none',
            backgroundSize: postProcessingFx === 'crt' ? '100% 4px, 6px 100%' : postProcessingFx === 'noise' ? '100px 100px' : '100% 4px'
          }} />
        )}
  
        <div className="absolute inset-0 z-10 pointer-events-none">
          {normalElements.map((el) => (
            <ElementRenderer key={el.id} element={el} />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
