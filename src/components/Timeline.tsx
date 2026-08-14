import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Play, Pause, SkipBack, Scissors, Maximize2, Minimize2, Eye, EyeOff, ChevronDown, ChevronUp, UploadCloud, Image as ImageIcon, Video as VideoIcon, Lock, Unlock, ZoomIn } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function Timeline() {
  const elements = useStore((state) => state.elements);
  const currentTime = useStore((state) => state.currentTime);
  const duration = useStore((state) => state.duration);
  const isPlaying = useStore((state) => state.isPlaying);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const setCurrentTime = useStore((state) => state.setCurrentTime);
  const setSelectedElementId = useStore((state) => state.setSelectedElementId);
  const selectedElementId = useStore((state) => state.selectedElementId);
  const updateElement = useStore((state) => state.updateElement);
  const addElement = useStore((state) => state.addElement);
  const timelineExpanded = useStore((state) => state.timelineExpanded);
  const timelineMinimized = useStore((state) => state.timelineMinimized);
  const timelineTransparent = useStore((state) => state.timelineTransparent);
  const timelineZoom = useStore((state) => state.timelineZoom);
  const setTimelineZoom = useStore((state) => state.setTimelineZoom);
  const timelineLengthLock = useStore((state) => state.timelineLengthLock);
  const timelineInteractionMode = useStore((state) => state.timelineInteractionMode);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, scrollLeft: 0, y: 0, scrollTop: 0 });
  const setTimelineLengthLock = useStore((state) => state.setTimelineLengthLock);

  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [showZoomSlider, setShowZoomSlider] = useState(false);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSplit = () => {
    if (!selectedElementId) return;
    const el = elements.find(e => e.id === selectedElementId);
    if (el && currentTime > el.startTime && currentTime < el.endTime) {
      const el2 = { 
        ...el, 
        id: uuidv4(), 
        startTime: currentTime,
        trackColor: `hsl(${Math.floor(Math.random() * 360)}, 60%, 50%)`
      };
      updateElement(el.id, { endTime: currentTime });
      addElement(el2);
      setSelectedElementId(el2.id); 
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = ms / 1000;
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    const millis = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (!timelineRef.current) return;
    if ((timelineInteractionMode === 'pan')) return;
    const rect = timelineRef.current.getBoundingClientRect();
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const x = clientX - rect.left + timelineRef.current.scrollLeft;
    const scrollWidth = timelineRef.current.scrollWidth;
    const percentage = Math.max(0, Math.min(1, x / scrollWidth));
    setCurrentTime(percentage * duration);
  };

  const handleTimelineDrag = (e: MouseEvent | TouchEvent) => {
    if ((timelineInteractionMode === 'pan') && isPanning && timelineRef.current) {
       let clientX = 0;
       let clientY = 0;
       if ('touches' in e) {
         clientX = (e as TouchEvent).touches[0].clientX;
         clientY = (e as TouchEvent).touches[0].clientY;
       } else {
         clientX = (e as MouseEvent).clientX;
         clientY = (e as MouseEvent).clientY;
       }
       const dx = clientX - panStart.x;
       const dy = clientY - panStart.y;
       timelineRef.current.scrollLeft = panStart.scrollLeft - dx;
       timelineRef.current.scrollTop = panStart.scrollTop - dy;
       return;
    }

    if (!isDraggingPlayhead || !timelineRef.current) return;
    if ((timelineInteractionMode === 'pan')) return;
    const rect = timelineRef.current.getBoundingClientRect();
    let clientX = 0;
    if ('touches' in e) {
      clientX = (e as TouchEvent).touches[0].clientX;
    } else {
      clientX = (e as MouseEvent).clientX;
    }
    const x = clientX - rect.left + timelineRef.current.scrollLeft;
    const scrollWidth = timelineRef.current.scrollWidth;
    const percentage = Math.max(0, Math.min(1, x / scrollWidth));
    setCurrentTime(percentage * duration);
  };

  useEffect(() => {
    const handleUp = () => {
      setIsDraggingPlayhead(false);
      setIsPanning(false);
    };

    if (isDraggingPlayhead || isPanning) {
      window.addEventListener('mousemove', handleTimelineDrag);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchmove', handleTimelineDrag, { passive: false });
      window.addEventListener('touchend', handleUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleTimelineDrag);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleTimelineDrag);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDraggingPlayhead, duration, timelineInteractionMode, isPanning, panStart]);

  // Greedy track assignment
  const tracks = useMemo(() => {
    const sorted = [...elements].sort((a, b) => a.startTime - b.startTime);
    const textTracks: typeof elements[] = [];
    const mediaTracks: typeof elements[] = [];
    const audioTracks: typeof elements[] = [];
    const placeholderTracks: typeof elements[] = [];

    sorted.forEach(el => {
      let targetTracks = mediaTracks;
      if (el.type === 'audio') targetTracks = audioTracks;
      else if (el.type === 'text') targetTracks = textTracks;
      else if (el.isPlaceholder) targetTracks = placeholderTracks;
      
      let placed = false;
      for (const track of targetTracks) {
        const lastEl = track[track.length - 1];
        if (el.startTime >= lastEl.endTime) {
          track.push(el);
          placed = true;
          break;
        }
      }
      if (!placed) {
        targetTracks.push([el]);
      }
    });

    return [...audioTracks, ...mediaTracks, ...placeholderTracks, ...textTracks];
  }, [elements]);

  return (
    <div className="flex-1 flex flex-col shrink-0 min-h-[120px] sm:min-h-[150px]">
      {/* Timeline Controls */}
      <div className="h-12 border-b border-panel-border flex items-center bg-panel-bg shrink-0">
        
        {/* Left: Play Controls (Fixed) */}
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 shrink-0 bg-panel-bg z-10 ">
          <button onClick={handleReset} className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-main transition-colors hover:bg-button-hover rounded-full flex-shrink-0" title="Reset (Home)">
            <SkipBack size={16} />
          </button>
          <button onClick={handlePlayPause} className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-main transition-colors hover:bg-button-hover rounded-full flex-shrink-0" title="Play/Pause (Space)">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <div className="text-xs font-mono font-medium tracking-wide text-text-main w-16 sm:w-20 flex-shrink-0 text-center">
            {formatTime(currentTime)}
          </div>
        </div>
        
        {/* Right: Tools & Toggles (Scrollable on small screens) */}
        <div className="flex-1 flex items-center justify-start gap-1 sm:gap-2 px-2 sm:px-4 overflow-x-auto overflow-y-hidden hide-scrollbar">
          <div className="ml-auto flex-shrink-0" /><div className="flex items-center gap-1 overflow-hidden transition-all duration-300 flex-shrink-0">
            {showZoomSlider && (
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="0.1" 
                value={timelineZoom} 
                onChange={(e) => setTimelineZoom(parseFloat(e.target.value))}
                className="w-24 h-2 bg-button-bg rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)] animate-fade-in mx-2"
                title="Adjust Zoom Level"
              />
            )}
            <button 
              onClick={() => setShowZoomSlider(!showZoomSlider)}
              className={`w-10 h-10 flex items-center justify-center transition-colors hover:bg-button-hover rounded-full flex-shrink-0 ${showZoomSlider ? 'text-[var(--color-accent)]' : 'text-text-muted hover:text-text-main'}`}
              title="Toggle Zoom Slider"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          <button 
            onClick={handleSplit} 
            disabled={!selectedElementId}
            className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-main transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-button-hover rounded-full flex-shrink-0"
            title="Split Element at Playhead (Ctrl+B/Cmd+B)"
          >
            <Scissors size={16} />
          </button>
          <button
            onClick={() => setTimelineLengthLock((!timelineLengthLock && timelineInteractionMode !== 'select'))}
            className={`w-10 h-10 flex items-center justify-center transition-colors hover:bg-button-hover rounded-full flex-shrink-0 ${timelineLengthLock ? 'text-red-500' : 'text-text-muted hover:text-text-main'}`}
            title="Lock Clip Lengths"
          >
            {timelineLengthLock ? <Lock size={16} /> : <Unlock size={16} />}
          </button>
          <div className="w-px h-6 bg-panel-border mx-1 flex-shrink-0" />
          <button
            onClick={() => useStore.getState().setTimelineTransparent(!useStore.getState().timelineTransparent)}
            className={`w-10 h-10 flex items-center justify-center transition-colors hover:bg-button-hover rounded-full flex-shrink-0 ${timelineTransparent ? 'text-[var(--color-accent)]' : 'text-text-muted hover:text-text-main'}`}
            title="Toggle Timeline Opacity"
          >
            {timelineTransparent ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            onClick={() => useStore.getState().setTimelineExpanded(!useStore.getState().timelineExpanded)}
            className={`w-10 h-10 flex items-center justify-center transition-colors hover:bg-button-hover rounded-full flex-shrink-0 ${timelineExpanded ? 'text-[var(--color-accent)]' : 'text-text-muted hover:text-text-main'}`}
            title="Toggle Fullscreen Timeline"
          >
            {timelineExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={() => useStore.getState().setTimelineMinimized(!useStore.getState().timelineMinimized)}
            className={`w-10 h-10 flex items-center justify-center transition-colors hover:bg-button-hover rounded-full flex-shrink-0 ${timelineMinimized ? 'text-[var(--color-accent)]' : 'text-text-muted hover:text-text-main'}`}
            title="Minimize Timeline"
          >
            {timelineMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Timeline Tracks Area */}
      <div className="flex-1 min-h-[80px] sm:min-h-[100px] overflow-y-auto relative flex flex-col bg-app-bg">
        <div className="flex flex-1 relative overflow-x-auto overflow-y-auto w-full touch-none" ref={timelineRef} 
        onMouseDown={(e) => {
          if ((timelineInteractionMode === 'pan')) {
             setIsPanning(true);
             setPanStart({ x: e.clientX, y: e.clientY, scrollLeft: timelineRef.current?.scrollLeft || 0, scrollTop: timelineRef.current?.scrollTop || 0 });
          } else {
             handleTimelineClick(e);
             setIsDraggingPlayhead(true);
          }
        }}
        onTouchStart={(e) => {
          if ((timelineInteractionMode === 'pan')) {
             setIsPanning(true);
             setPanStart({ x: e.touches[0].clientX, y: e.touches[0].clientY, scrollLeft: timelineRef.current?.scrollLeft || 0, scrollTop: timelineRef.current?.scrollTop || 0 });
          } else {
             handleTimelineClick(e);
             setIsDraggingPlayhead(true);
          }
        }}>
          {/* Track Headers (Left/Sticky) - removed for generic capcut feel, let's just make clips floating */}
          <div className="absolute inset-0 timeline-bg" style={{ minWidth: `${100 * timelineZoom}%`, width: `${100 * timelineZoom}%`, minHeight: `${Math.max(100, tracks.length * 48 + 48)}px` }}>
            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 z-50 flex items-start justify-center cursor-ew-resize group"
              style={{ left: `${(currentTime / duration) * 100}%`, width: '80px', marginLeft: '-40px' }}
              onMouseDown={(e) => {
                if ((timelineInteractionMode === 'pan')) return;
                e.stopPropagation();
                setIsDraggingPlayhead(true);
              }}
              onTouchStart={(e) => {
                if ((timelineInteractionMode === 'pan')) return;
                e.stopPropagation();
                setIsDraggingPlayhead(true);
              }}
            >
              <div className="absolute top-0 bottom-0 w-[3px] bg-[var(--color-accent)] group-hover:w-[4px] transition-all pointer-events-none opacity-90 mt-2" />
              <div className="w-[14px] h-[32px] bg-[var(--color-accent)] group-hover:scale-110 rounded-full pointer-events-none transition-transform border-[2px] border-panel-bg flex items-center justify-center mt-1 shadow-md" />
            </div>

            {/* Grid lines */}
            {Array.from({ length: 10 * Math.ceil(timelineZoom) }).map((_, i) => (
              <div
                key={i}
                className="grid-line absolute top-0 bottom-0 w-px bg-button-bg/50 pointer-events-none"
                style={{ left: `${(i / (10 * Math.ceil(timelineZoom))) * 100}%` }}
              />
            ))}

            {/* Element Clips */}
            <div className="pt-10 flex flex-col gap-1">
              {tracks.map((track, trackIndex) => (
                <div key={trackIndex} className="h-10 relative flex items-center bg-button-bg/30 rounded-lg">
                  {track.map((el) => (
                    <TimelineClip key={el.id} element={el} duration={duration} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineClip({ element, duration }: { element: any, duration: number, key?: string | number }) {
  const timelineInteractionMode = useStore(state => state.timelineInteractionMode);
  const updateElement = useStore(state => state.updateElement);
  const setSelectedElementId = useStore(state => state.setSelectedElementId);
  const selectedElementId = useStore(state => state.selectedElementId);
  const currentTime = useStore(state => state.currentTime);
  const timelineLengthLock = useStore(state => state.timelineLengthLock);
  const isSelected = selectedElementId === element.id;
  const isActive = currentTime >= element.startTime && currentTime <= element.endTime;

  const leftPercent = (element.startTime / duration) * 100;
  const widthPercent = ((element.endTime - element.startTime) / duration) * 100;

  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'start' | 'end' | null>(null);
  const [startX, setStartX] = useState(0);
  const [initialStartTime, setInitialStartTime] = useState(0);
  const [initialEndTime, setInitialEndTime] = useState(0);

  const getClientX = (e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent) => {
    if ('touches' in e) {
      return e.touches[0].clientX;
    }
    return (e as React.MouseEvent | MouseEvent).clientX;
  };

  const handlePointerDown = (e: React.TouchEvent | React.MouseEvent, type: 'move' | 'start' | 'end') => {
    if ((timelineInteractionMode === 'pan')) return;
    e.stopPropagation();
    setSelectedElementId(element.id);
    setIsDragging(true);
    setDragType(type);
    setStartX(getClientX(e));
    setInitialStartTime(element.startTime);
    setInitialEndTime(element.endTime);
  };

  useEffect(() => {
    const handlePointerMove = (e: TouchEvent | MouseEvent) => {
      if (!isDragging || !dragType) return;

      const timelineEl = document.querySelector('.timeline-bg');
      if (!timelineEl) return;

      const rect = timelineEl.getBoundingClientRect();
      const deltaX = getClientX(e) - startX;
      e.preventDefault();
      const deltaMs = (deltaX / rect.width) * duration;

      if (dragType === 'move') {
        let newStart = initialStartTime + deltaMs;
        let newEnd = initialEndTime + deltaMs;
        if (newStart < 0) {
          newEnd -= newStart;
          newStart = 0;
        }
        if (newEnd > duration) {
          newStart -= (newEnd - duration);
          newEnd = duration;
        }
        updateElement(element.id, { startTime: newStart, endTime: newEnd });
      } else if (dragType === 'start') {
        let newStart = Math.max(0, Math.min(initialStartTime + deltaMs, element.endTime - 100));
        updateElement(element.id, { startTime: newStart });
      } else if (dragType === 'end') {
        let newEnd = Math.min(duration, Math.max(initialEndTime + deltaMs, element.startTime + 100));
        updateElement(element.id, { endTime: newEnd });
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setDragType(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, dragType, startX, initialStartTime, initialEndTime, duration, element.id, element.startTime, element.endTime, updateElement]);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (file.type.startsWith('video/')) {
        updateElement(element.id, { content: url, type: 'video' });
      } else if (file.type.startsWith('audio/')) {
        updateElement(element.id, { content: url, type: 'audio' });
      } else {
        updateElement(element.id, { content: url, type: 'image' });
      }
    }
  };

  return (
    <div
      className={`absolute h-8 rounded-md cursor-grab active:cursor-grabbing flex items-center group touch-none ${isSelected ? 'ring-2 ring-text-main z-20' : 'hover:brightness-110'} ${isActive ? 'brightness-125 shadow-lg shadow-white/10' : ''}`}
      style={{
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        top: '8px',
        backgroundColor: element.isPlaceholder ? '#8b5cf6' : (element.trackColor || '#3f3f46')
      }}
      onMouseDown={(e) => handlePointerDown(e, 'move')}
      onTouchStart={(e) => handlePointerDown(e, 'move')}
    >
      {(!timelineLengthLock && timelineInteractionMode !== 'select') && (
        <div
          className={`absolute left-0 top-0 bottom-0 w-12 -translate-x-6 cursor-ew-resize flex items-center justify-center touch-none z-10 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          onMouseDown={(e) => handlePointerDown(e, 'start')}
          onTouchStart={(e) => handlePointerDown(e, 'start')}
        >
          <div className={`w-4 h-full rounded-l-md transition-colors ${isSelected ? 'bg-text-main' : 'bg-button-bg opacity-50'}`} />
        </div>
      )}
      
      <div className="px-3 text-[10px] text-text-main truncate select-none flex-1 overflow-hidden z-0 font-medium flex items-center gap-2">
         {element.type === 'text' ? (
           <span className="pointer-events-none">{element.content}</span>
         ) : element.type === 'audio' ? (
           <span className="pointer-events-none flex items-center gap-1">🔊 Audio Track</span>
         ) : (
           <div className="flex items-center gap-2">
             {(element.type === 'image' || element.type === 'video') && (
               <label 
                 className="cursor-pointer transition-transform hover:scale-110 flex items-center justify-center bg-[var(--color-accent)] w-4 h-4 rounded-full flex-shrink-0 "
                 onMouseDown={(e) => e.stopPropagation()}
                 onTouchStart={(e) => e.stopPropagation()}
                 title="Replace Media"
               >
                 <div className="w-1.5 h-1.5 bg-white rounded-full pointer-events-none" />
                 <input 
                   type="file" 
                   accept="image/*,video/*,audio/*" 
                   className="hidden" 
                   onChange={handleMediaUpload}
                 />
               </label>
             )}
             <span className="pointer-events-none uppercase font-bold tracking-wider opacity-80">{element.isPlaceholder ? 'Placeholder' : element.type}</span>
           </div>
         )}
      </div>
      
      {(!timelineLengthLock && timelineInteractionMode !== 'select') && (
        <div
          className={`absolute right-0 top-0 bottom-0 w-12 translate-x-6 cursor-ew-resize flex items-center justify-center touch-none z-10 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          onMouseDown={(e) => handlePointerDown(e, 'end')}
          onTouchStart={(e) => handlePointerDown(e, 'end')}
        >
          <div className={`w-4 h-full rounded-r-md transition-colors ${isSelected ? 'bg-text-main' : 'bg-button-bg opacity-50'}`} />
        </div>
      )}
    </div>
  );
}
