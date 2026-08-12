const fs = require('fs');
let file = 'src/store/useStore.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('timelineTransparent: boolean;', 'timelineTransparent: boolean;\n  timelineTrackpadMode: boolean;\n  setTimelineTrackpadMode: (mode: boolean) => void;');
content = content.replace('timelineTransparent: false,', 'timelineTransparent: false,\n  timelineTrackpadMode: false,');
content = content.replace('setTimelineTransparent: (transparent) => set({ timelineTransparent: transparent }),', 'setTimelineTransparent: (transparent) => set({ timelineTransparent: transparent }),\n  setTimelineTrackpadMode: (mode) => set({ timelineTrackpadMode: mode }),');

fs.writeFileSync(file, content);
