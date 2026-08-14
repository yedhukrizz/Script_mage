const fs = require('fs');
let content = fs.readFileSync('src/store/useStore.ts', 'utf8');

content = content.replace(
  "timelineTrackpadMode: false,\n  setTimelineTransparent: (transparent) => set({ timelineTransparent: transparent }),\n  setTimelineTrackpadMode: (mode) => set({ timelineTrackpadMode: mode }),",
  "timelineInteractionMode: 'pan' as 'full' | 'select' | 'pan',\n  setTimelineInteractionMode: (mode) => set({ timelineInteractionMode: mode }),\n  timelineTrackpadMode: false,\n  setTimelineTransparent: (transparent) => set({ timelineTransparent: transparent }),\n  setTimelineTrackpadMode: (mode) => set({ timelineTrackpadMode: mode }),"
);

fs.writeFileSync('src/store/useStore.ts', content);
