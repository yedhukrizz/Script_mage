const fs = require('fs');
let content = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

const clipOld = `function TimelineClip({ element, duration }: { element: any, duration: number, key?: string | number }) {
  
  const updateElement = useStore(state => state.updateElement);`;

const clipNew = `function TimelineClip({ element, duration }: { element: any, duration: number, key?: string | number }) {
  const timelineInteractionMode = useStore(state => state.timelineInteractionMode);
  const updateElement = useStore(state => state.updateElement);`;

content = content.replace(clipOld, clipNew);

fs.writeFileSync('src/components/Timeline.tsx', content);
