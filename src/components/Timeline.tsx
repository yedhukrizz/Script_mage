import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Play, Pause, SkipBack, Scissors, Maximize2, Minimize2, Eye, EyeOff, UploadCloud, Image as ImageIcon, Video as VideoIcon, Lock, Unlock } from 'lucide-react';
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
  const timelineTransparent = useStore((state) => state.timelineTransparent);
  const timelineZoom = useStore((state) => state.timelineZoom);
  const setTimelineZoom = useStore((state) => state.setTimelineZoom);
  const timelineLengthLock = useStore((state) => state.timelineLengthLock);
  const setTimelineLengthLock = useStore((state) => state.setTimelineLengthLock);

  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);

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
    if (!isDraggingPlayhead || !timelineRef.current) return;
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
    if (isDraggingPlayhead) {
      window.addEventListener('mousemove', handleTimelineDrag);
      window.addEventListener('mouseup', () => setIsDraggingPlayhead(false));
      window.addEventListener('touchmove', handleTimelineDrag);
      window.addEventListener('touchend', () => setIsDraggingPlayhead(false));
    }
    return () => {
      window.removeEventListener('mousemove', handleTimelineDrag);
      window.removeEventListener('mouseup', () => setIsDraggingPlayhead(false));
      window.removeEventListener('touchmove', handleTimelineDrag);
      window.removeEventListener('touchend', () => setIsDraggingPlayhead(false));
    };
  }, [isDraggingPlayhead]);

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
      <div className="h-12 border-b border-panel-border flex items-center px-2 sm:px-4 gap-2 sm:gap-4 bg-panel-bg shrink-0 overflow-x-auto overflow-y-hidden hide-scrollbar">
        <button onClick={handleReset} className="p-2 text-text-muted hover:text-text-main transition-colors hover:bg-button-hover rounded-full flex-shrink-0">
          <SkipBack size={16} />
        </button>
        <button onClick={handlePlayPause} className="p-2 text-text-muted hover:text-text-main transition-colors hover:bg-button-hover rounded-full flex-shrink-0">
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div className="text-xs font-mono font-medium tracking-wide text-text-main w-20 sm:w-24 flex-shrink-0">
          {formatTime(currentTime)}
        </div>
        <div className="flex-1 min-w-[1rem]" />
        
        {/* Zoom Slider */}
        <div className="flex items-center gap-2 mr-2">
          <input 
            type="range" 
            min="1" 
            max="10" 
            step="0.1" 
            value={timelineZoom} 
            onChange={(e) => setTimelineZoom(parseFloat(e.target.value))}
            className="w-24 h-2 bg-button-bg rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
            title="Zoom Timeline"
          />
        </div>

        <button 
          onClick={handleSplit} 
          disabled={!selectedElementId}
          className="p-2 text-text-muted hover:text-text-main transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-button-hover rounded-full flex-shrink-0"
          title="Split Element at Playhead (Ctrl+B/Cmd+B)"
        >
          <Scissors size={16} />
        </button>
        <button
          onClick={() => setTimelineLengthLock(!timelineLengthLock)}
          className={`p-2 transition-colors hover:bg-button-hover rounded-full flex-shrink-0 ${timelineLengthLock ? 'text-red-500' : 'text-text-muted hover:text-text-main'}`}
          title="Lock Clip Lengths"
        >
          {timelineLengthLock ? <Lock size={16} /> : <Unlock size={16} />}
        </button>
        <div className="w-px h-6 bg-panel-border mx-1 flex-shrink-0" />
        <button
          onClick={() => useStore.getState().setTimelineTransparent(!useStore.getState().timelineTransparent)}
          className={`p-2 transition-colors hover:bg-button-hover rounded-full flex-shrink-0 ${timelineTransparent ? 'text-[var(--color-accent)]' : 'text-text-muted hover:text-text-main'}`}
          title="Toggle Timeline Opacity"
        >
          {timelineTransparent ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        <button
          onClick={() => useStore.getState().setTimelineExpanded(!useStore.getState().timelineExpanded)}
          className={`p-2 transition-colors hover:bg-button-hover rounded-full flex-shrink-0 ${timelineExpanded ? 'text-[var(--color-accent)]' : 'text-text-muted hover:text-text-main'}`}
          title="Toggle Fullscreen Timeline"
        >
          {timelineExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Timeline Tracks Area */}
      <div className="flex-1 min-h-[80px] sm:min-h-[100px] overflow-y-auto relative flex flex-col bg-app-bg">
        <div className="flex flex-1 relative overflow-x-auto overflow-y-auto w-full touch-none" ref={timelineRef} 
        onMouseDown={(e) => {
          handleTimelineClick(e);
          setIsDraggingPlayhead(true);
        }}
        onTouchStart={(e) => {
          handleTimelineClick(e);
          setIsDraggingPlayhead(true);
        }}>
          {/* Track Headers (Left/Sticky) - removed for generic capcut feel, let's just make clips floating */}
          <div className="absolute inset-0 timeline-bg" style={{ minWidth: `${100 * timelineZoom}%`, width: `${100 * timelineZoom}%`, minHeight: `${Math.max(100, tracks.length * 48 + 48)}px` }}>
            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-px bg-white z-50 pointer-events-none"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute top-0 -translate-x-1/2 rounded-b-md w-3 h-3 bg-white" />
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
            <div className="pt-4 flex flex-col gap-1">
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
      className={`absolute h-8 rounded-md cursor-grab active:cursor-grabbing flex items-center group touch-none ${isSelected ? 'ring-2 ring-white z-20' : 'hover:brightness-110'} ${isActive ? 'brightness-125 shadow-lg shadow-white/10' : ''}`}
      style={{
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        top: '8px',
        backgroundColor: element.trackColor || '#3f3f46'
      }}
      onMouseDown={(e) => handlePointerDown(e, 'move')}
      onTouchStart={(e) => handlePointerDown(e, 'move')}
    >
      {!timelineLengthLock && (
        <div
          className={`absolute left-0 top-0 bottom-0 w-12 -translate-x-6 cursor-ew-resize flex items-center justify-center touch-none z-10 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          onMouseDown={(e) => handlePointerDown(e, 'start')}
          onTouchStart={(e) => handlePointerDown(e, 'start')}
        >
          <div className={`w-4 h-full rounded-l-md transition-colors ${isSelected ? 'bg-white' : 'bg-white/50'}`} />
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
                 className="cursor-pointer hover:text-white transition-colors flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded flex-shrink-0"
                 onMouseDown={(e) => e.stopPropagation()}
                 onTouchStart={(e) => e.stopPropagation()}
               >
                 <UploadCloud size={12} />
                 <span className="text-[9px]">REPLACE</span>
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
      
      {!timelineLengthLock && (
        <div
          className={`absolute right-0 top-0 bottom-0 w-12 translate-x-6 cursor-ew-resize flex items-center justify-center touch-none z-10 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          onMouseDown={(e) => handlePointerDown(e, 'end')}
          onTouchStart={(e) => handlePointerDown(e, 'end')}
        >
          <div className={`w-4 h-full rounded-r-md transition-colors ${isSelected ? 'bg-white' : 'bg-white/50'}`} />
        </div>
      )}
    </div>
  );
}
