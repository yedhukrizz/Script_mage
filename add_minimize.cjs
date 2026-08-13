const fs = require('fs');
let file = 'src/store/useStore.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('timelineMinimized')) {
  content = content.replace(/timelineExpanded: boolean;/g, 'timelineExpanded: boolean;\n  timelineMinimized: boolean;');
  content = content.replace(/setTimelineExpanded: \(expanded: boolean\) => void;/g, 'setTimelineExpanded: (expanded: boolean) => void;\n  setTimelineMinimized: (minimized: boolean) => void;');
  content = content.replace(/timelineExpanded: false,/g, 'timelineExpanded: false,\n  timelineMinimized: false,');
  content = content.replace(/setTimelineExpanded: \(expanded\) => set\(\{ timelineExpanded: expanded \}\),/g, 'setTimelineExpanded: (expanded) => set({ timelineExpanded: expanded }),\n  setTimelineMinimized: (minimized) => set({ timelineMinimized: minimized }),');
  fs.writeFileSync(file, content);
}
