const fs = require('fs');

// 1. Fix Timeline.tsx
let timeline = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

// Replace the container to remove justify-start and mask-image
timeline = timeline.replace(
  'className="flex-1 flex items-center justify-start gap-1 sm:gap-2 px-2 sm:px-4 overflow-x-auto overflow-y-hidden hide-scrollbar [mask-image:linear-gradient(to_right,transparent,black_10px,black_calc(100%-10px),transparent)]"',
  'className="flex-1 flex items-center gap-1 sm:gap-2 px-2 sm:px-4 overflow-x-auto overflow-y-hidden hide-scrollbar"'
);
timeline = timeline.replace(
  'className="flex-1 flex items-center justify-end gap-1 sm:gap-2 px-2 sm:px-4 overflow-x-auto overflow-y-hidden hide-scrollbar"',
  'className="flex-1 flex items-center gap-1 sm:gap-2 px-2 sm:px-4 overflow-x-auto overflow-y-hidden hide-scrollbar"'
);

// Add ml-auto to the zoom container
timeline = timeline.replace(
  '<div className="flex items-center gap-1 overflow-hidden transition-all duration-300">',
  '<div className="flex items-center gap-1 overflow-hidden transition-all duration-300 ml-auto">'
);

fs.writeFileSync('src/components/Timeline.tsx', timeline);

// 2. Fix App.tsx to remove the background pill
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  '<div className="flex items-end gap-2 pointer-events-auto bg-panel-bg/50 backdrop-blur-md p-2 rounded-[32px] border border-panel-border/50 shadow-sm">',
  '<div className="flex items-end gap-2 pointer-events-auto">'
);

fs.writeFileSync('src/App.tsx', app);

