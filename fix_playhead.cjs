const fs = require('fs');

let timeline = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

const oldPlayhead = `<div className="absolute top-0 bottom-0 w-[3px] bg-[var(--color-accent)] group-hover:w-[4px] transition-all pointer-events-none opacity-90 mt-2" />
              <div className="w-[28px] h-[28px] bg-[var(--color-accent)] group-hover:scale-110 rounded-full pointer-events-none transition-transform border-[3px] border-panel-bg flex items-center justify-center mt-1 shadow-md" />`;
const newPlayhead = `<div className="absolute top-0 bottom-0 w-[3px] bg-[var(--color-accent)] group-hover:w-[4px] transition-all pointer-events-none opacity-90 mt-2" />
              <div className="w-[14px] h-[32px] bg-[var(--color-accent)] group-hover:scale-110 rounded-full pointer-events-none transition-transform border-[2px] border-panel-bg flex items-center justify-center mt-1 shadow-md" />`;

timeline = timeline.replace(oldPlayhead, newPlayhead);

fs.writeFileSync('src/components/Timeline.tsx', timeline);
