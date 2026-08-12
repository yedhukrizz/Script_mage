const fs = require('fs');
let file = 'src/components/Timeline.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. In Timeline component, grab timelineTrackpadMode
content = content.replace(
  '  const timelineLengthLock = useStore((state) => state.timelineLengthLock);',
  '  const timelineLengthLock = useStore((state) => state.timelineLengthLock);\n  const timelineTrackpadMode = useStore((state) => state.timelineTrackpadMode);\n  const [isPanning, setIsPanning] = useState(false);\n  const [panStart, setPanStart] = useState({ x: 0, scrollLeft: 0, y: 0, scrollTop: 0 });'
);

// 2. Modify handleTimelineClick and handleTimelineDrag to respect timelineTrackpadMode
const handleTimelineClickOld = `  const handleTimelineClick = (e: React.MouseEvent | React.TouchEvent) => {
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
  };`;

const handleTimelineClickNew = `  const handleTimelineClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (!timelineRef.current) return;
    if (timelineTrackpadMode) return;
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
  };`;
content = content.replace(handleTimelineClickOld, handleTimelineClickNew);

const handleTimelineDragOld = `  const handleTimelineDrag = (e: MouseEvent | TouchEvent) => {
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
  };`;
  
const handleTimelineDragNew = `  const handleTimelineDrag = (e: MouseEvent | TouchEvent) => {
    if (timelineTrackpadMode && isPanning && timelineRef.current) {
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
    if (timelineTrackpadMode) return;
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
  };`;
content = content.replace(handleTimelineDragOld, handleTimelineDragNew);

// 3. Update useEffect for mouse up/move
const useEffOld = `  useEffect(() => {
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
  }, [isDraggingPlayhead, duration, timelineTrackpadMode, isPanning]);`;

const useEffNew = `  useEffect(() => {
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
  }, [isDraggingPlayhead, duration, timelineTrackpadMode, isPanning, panStart]);`;

// Just manually do regex replace since the exact string might be slightly different
content = content.replace(/  useEffect\(\(\) => \{\n    if \(isDraggingPlayhead\)[^]*?  \}, \[.*?\]\);/g, useEffNew);

// 4. Update the onMouseDown of the timeline container
const onMouseDownOld = `        onMouseDown={(e) => {
          handleTimelineClick(e);
          setIsDraggingPlayhead(true);
        }}
        onTouchStart={(e) => {
          handleTimelineClick(e);
          setIsDraggingPlayhead(true);
        }}`;
const onMouseDownNew = `        onMouseDown={(e) => {
          if (timelineTrackpadMode) {
             setIsPanning(true);
             setPanStart({ x: e.clientX, y: e.clientY, scrollLeft: timelineRef.current?.scrollLeft || 0, scrollTop: timelineRef.current?.scrollTop || 0 });
          } else {
             handleTimelineClick(e);
             setIsDraggingPlayhead(true);
          }
        }}
        onTouchStart={(e) => {
          if (timelineTrackpadMode) {
             setIsPanning(true);
             setPanStart({ x: e.touches[0].clientX, y: e.touches[0].clientY, scrollLeft: timelineRef.current?.scrollLeft || 0, scrollTop: timelineRef.current?.scrollTop || 0 });
          } else {
             handleTimelineClick(e);
             setIsDraggingPlayhead(true);
          }
        }}`;
content = content.replace(onMouseDownOld, onMouseDownNew);

// 5. In TimelineClip, ignore drag if trackpad mode is on
const timelineClipAnchor = `function TimelineClip({ element, duration }: { element: any, duration: number, key?: string | number }) {`;
const timelineClipAnchorNew = timelineClipAnchor + `\n  const timelineTrackpadMode = useStore(state => state.timelineTrackpadMode);`;
content = content.replace(timelineClipAnchor, timelineClipAnchorNew);

const handlePointerDownOld = `  const handlePointerDown = (e: React.TouchEvent | React.MouseEvent, type: 'move' | 'start' | 'end') => {
    e.stopPropagation();`;
const handlePointerDownNew = `  const handlePointerDown = (e: React.TouchEvent | React.MouseEvent, type: 'move' | 'start' | 'end') => {
    if (timelineTrackpadMode) return;
    e.stopPropagation();`;
content = content.replace(handlePointerDownOld, handlePointerDownNew);

// Prevent default on move if panning
const ePreventOld = `const deltaMs = (deltaX / rect.width) * duration;`;
const ePreventNew = `e.preventDefault();\n      const deltaMs = (deltaX / rect.width) * duration;`;
content = content.replace(ePreventOld, ePreventNew);


fs.writeFileSync(file, content);
