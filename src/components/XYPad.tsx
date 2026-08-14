import React, { useRef, useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export function XYPad({ element }: { element: any }) {
  const padRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const updateElement = useStore((state) => state.updateElement);
  const saveHistory = useStore((state) => state.saveHistory);

  // Default canvas dims
  const maxX = 1920;
  const maxY = 1080;

  // Touch gesture state
  const initialPinchDistance = useRef<number | null>(null);
  const initialScale = useRef<number>(1);
  
  const initialRotationAngle = useRef<number | null>(null);
  const initialElementRotation = useRef<number>(0);

  const getDistance = (touches: TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getAngle = (touches: TouchList) => {
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    saveHistory();

    if ('touches' in e && e.touches.length === 2) {
      initialPinchDistance.current = getDistance(e.touches);
      initialScale.current = element.width; // using width as base scale proxy
      initialRotationAngle.current = getAngle(e.touches);
      initialElementRotation.current = element.rotation || 0;
      setIsDragging(true);
      return;
    }

    setIsDragging(true);
    handleMove(e);
  };

  const handleMove = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if (!padRef.current) return;

    if ('touches' in e && (e as TouchEvent).touches.length === 2) {
       // Handle pinch to zoom and rotate
       const touches = (e as TouchEvent).touches;
       
       if (initialPinchDistance.current !== null) {
         const currentDistance = getDistance(touches);
         const scaleMultiplier = currentDistance / initialPinchDistance.current;
         const newWidth = Math.max(10, Math.min(1000, initialScale.current * scaleMultiplier));
         
         const currentAngle = getAngle(touches);
         let angleDiff = currentAngle - (initialRotationAngle.current || 0);
         const newRotation = (initialElementRotation.current + angleDiff) % 360;

         // Need proportional height if using width as scale, but we just set width and height same ratio
         const ratio = element.height / element.width;
         const newHeight = newWidth * ratio;

         updateElement(element.id, { width: newWidth, height: newHeight, rotation: newRotation }, true);
       }
       return;
    }

    const rect = padRef.current.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;
    
    if ('touches' in e) {
      clientX = (e as TouchEvent).touches[0].clientX;
      clientY = (e as TouchEvent).touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    let x = ((clientX - rect.left) / rect.width) * maxX;
    let y = ((clientY - rect.top) / rect.height) * maxY;

    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    updateElement(element.id, { x, y }, true);
  };

  const handleEnd = () => {
    setIsDragging(false);
    initialPinchDistance.current = null;
    initialRotationAngle.current = null;
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const dotX = (element.x / maxX) * 100;
  const dotY = (element.y / maxY) * 100;

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
       // Zoom
       const delta = e.deltaY * -0.5;
       const newWidth = Math.max(10, Math.min(1000, element.width + delta));
       const ratio = element.height / element.width;
       updateElement(element.id, { width: newWidth, height: newWidth * ratio }, true);
    } else {
       // Rotate
       const newRotation = ((element.rotation || 0) + (e.deltaY * 0.5)) % 360;
       updateElement(element.id, { rotation: newRotation }, true);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-2">
      <div className="flex justify-between items-center px-1">
        <span className="text-xs text-text-muted font-medium">Position & Transform</span>
        <span className="text-[9px] text-text-muted">Drag dot, pinch/wheel to scale/rotate</span>
      </div>
      <div 
        ref={padRef}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onWheel={handleWheel}
        className="w-full aspect-video bg-black/10 border border-panel-border rounded-xl relative overflow-hidden cursor-crosshair touch-none shadow-inner"
      >
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--color-text-main) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-main) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
           <div className="w-full h-px bg-[var(--color-text-main)]"></div>
           <div className="h-full w-px bg-[var(--color-text-main)] absolute"></div>
        </div>
        
        {/* The Dot */}
        <div 
          className="absolute w-6 h-6 bg-[var(--color-accent)] rounded-full -ml-3 -mt-3 shadow-md border-2 border-white pointer-events-none transition-transform"
          style={{ 
            left: `${dotX}%`, 
            top: `${dotY}%`,
            transform: `rotate(${element.rotation || 0}deg) scale(${Math.max(0.5, Math.min(2, element.width / 400))})`
          }}
        >
          {/* Direction indicator for rotation */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2.5 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
