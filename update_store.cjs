const fs = require('fs');
let content = fs.readFileSync('src/store/useStore.ts', 'utf8');

// replace timelineTrackpadMode
content = content.replace(
  'timelineTrackpadMode: boolean;\n  setTimelineTrackpadMode: (mode: boolean) => void;',
  'timelineInteractionMode: \'full\' | \'select\' | \'pan\';\n  setTimelineInteractionMode: (mode: \'full\' | \'select\' | \'pan\') => void;\n  timelineTrackpadMode: boolean;\n  setTimelineTrackpadMode: (mode: boolean) => void;'
);

content = content.replace(
  'timelineTrackpadMode: false,\n  setTimelineTrackpadMode: (mode) => set({ timelineTrackpadMode: mode }),',
  'timelineInteractionMode: \'pan\',\n  setTimelineInteractionMode: (mode) => set({ timelineInteractionMode: mode }),\n  timelineTrackpadMode: false,\n  setTimelineTrackpadMode: (mode) => set({ timelineTrackpadMode: mode }),'
);

fs.writeFileSync('src/store/useStore.ts', content);
