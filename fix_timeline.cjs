const fs = require('fs');
let content = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

// Fix the import issue
content = content.replace(/const \(timelineInteractionMode === 'pan'\) = useStore\(\(state\) => state\.\(timelineInteractionMode === 'pan'\)\);/g, "const timelineInteractionMode = useStore((state) => state.timelineInteractionMode);");
content = content.replace(/const \(timelineInteractionMode === 'pan'\) = useStore\(state => state\.\(timelineInteractionMode === 'pan'\)\);/g, "");

content = content.replace(/\[isDraggingPlayhead, duration, \(timelineInteractionMode === 'pan'\), isPanning, panStart\]/g, "[isDraggingPlayhead, duration, timelineInteractionMode, isPanning, panStart]");

fs.writeFileSync('src/components/Timeline.tsx', content);
