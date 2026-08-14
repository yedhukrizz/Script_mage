const fs = require('fs');
let content = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

// Replace usages of timelineTrackpadMode
// Note: We use timelineInteractionMode === 'pan' instead of timelineTrackpadMode
content = content.replace(/timelineTrackpadMode/g, "(timelineInteractionMode === 'pan')");
// We need to import it
content = content.replace(
  'const timelineTrackpadMode = useStore((state) => state.timelineTrackpadMode);',
  "const timelineInteractionMode = useStore((state) => state.timelineInteractionMode);"
);

// We need to fix the duplicate local var if it exists
content = content.replace(
  'const timelineTrackpadMode = useStore(state => state.timelineTrackpadMode);',
  ''
);

// timelineLengthLock logic: if it's 'select' mode, we treat it as locked. 
// So where timelineLengthLock is used, we do `(timelineLengthLock || timelineInteractionMode === 'select')`
content = content.replace(/!timelineLengthLock/g, "(!timelineLengthLock && timelineInteractionMode !== 'select')");

// Also let's increase the space reserved for the playhead.
// It is currently `pt-4` on `<div className="pt-4 flex flex-col gap-1">`
content = content.replace(
  'className="pt-4 flex flex-col gap-1"',
  'className="pt-10 flex flex-col gap-1"'
);

// Make replace button a small dot.
const replaceOld = `<label 
                 className="cursor-pointer hover:text-text-main transition-colors flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded flex-shrink-0"
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
               </label>`;

const replaceNew = `<label 
                 className="cursor-pointer transition-transform hover:scale-110 flex items-center justify-center bg-[var(--color-accent)] w-4 h-4 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                 onMouseDown={(e) => e.stopPropagation()}
                 onTouchStart={(e) => e.stopPropagation()}
                 title="Replace Media"
               >
                 <div className="w-1.5 h-1.5 bg-white rounded-full pointer-events-none" />
                 <input 
                   type="file" 
                   accept="image/*,video/*,audio/*" 
                   className="hidden" 
                   onChange={handleMediaUpload}
                 />
               </label>`;

content = content.replace(replaceOld, replaceNew);

fs.writeFileSync('src/components/Timeline.tsx', content);
