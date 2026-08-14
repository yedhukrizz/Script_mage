const fs = require('fs');
let content = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

const playheadOld = `{/* Playhead */}
            <div
              className="absolute top-0 bottom-0 z-50 flex items-start justify-center cursor-ew-resize group"
              style={{ left: \`\${(currentTime / duration) * 100}%\`, width: '40px', marginLeft: '-20px' }}
              onMouseDown={(e) => {
                if (timelineTrackpadMode) return;
                e.stopPropagation();
                setIsDraggingPlayhead(true);
              }}
              onTouchStart={(e) => {
                if (timelineTrackpadMode) return;
                e.stopPropagation();
                setIsDraggingPlayhead(true);
              }}
            >
              <div className="absolute top-0 bottom-0 w-[2px] bg-[var(--color-accent)] group-hover:w-[3px] transition-all pointer-events-none opacity-80 shadow-[0_0_8px_var(--color-accent)]" />
              <div className="w-[18px] h-[24px] bg-[var(--color-accent)] group-hover:scale-110 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)] pointer-events-none transition-transform border-[3px] border-panel-bg flex items-center justify-center mt-[-4px]" />
            </div>`;

const playheadNew = `{/* Playhead */}
            <div
              className="absolute top-0 bottom-0 z-50 flex items-start justify-center cursor-ew-resize group"
              style={{ left: \`\${(currentTime / duration) * 100}%\`, width: '80px', marginLeft: '-40px' }}
              onMouseDown={(e) => {
                if (timelineTrackpadMode) return;
                e.stopPropagation();
                setIsDraggingPlayhead(true);
              }}
              onTouchStart={(e) => {
                if (timelineTrackpadMode) return;
                e.stopPropagation();
                setIsDraggingPlayhead(true);
              }}
            >
              <div className="absolute top-0 bottom-0 w-[3px] bg-[var(--color-accent)] group-hover:w-[4px] transition-all pointer-events-none opacity-90 shadow-[0_0_12px_var(--color-accent)]" />
              <div className="w-[32px] h-[32px] bg-[var(--color-accent)] group-hover:scale-110 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.6)] pointer-events-none transition-transform border-[4px] border-panel-bg flex items-center justify-center mt-[-6px]" />
            </div>`;

content = content.replace(playheadOld, playheadNew);
fs.writeFileSync('src/components/Timeline.tsx', content);
