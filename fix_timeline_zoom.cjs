const fs = require('fs');
let content = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

// 1. Add showZoomSlider state
content = content.replace(
  'const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);',
  'const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);\n  const [showZoomSlider, setShowZoomSlider] = useState(false);'
);

// 2. Remove the clash border
content = content.replace(
  'border-r border-panel-border',
  ''
);

// 3. Replace the zoom button logic
const oldZoomBtn = `<button 
            onClick={() => {
              const nextZoom = timelineZoom >= 10 ? 1 : timelineZoom >= 5 ? 10 : timelineZoom >= 2 ? 5 : 2;
              setTimelineZoom(nextZoom);
            }}
            className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-main transition-colors hover:bg-button-hover rounded-full flex-shrink-0"
            title={\`Toggle Zoom (Current: \${timelineZoom}x)\`}
          >
            <ZoomIn size={16} />
          </button>`;

const newZoomBtn = `<div className="flex items-center gap-1 overflow-hidden transition-all duration-300">
            {showZoomSlider && (
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="0.1" 
                value={timelineZoom} 
                onChange={(e) => setTimelineZoom(parseFloat(e.target.value))}
                className="w-24 h-2 bg-button-bg rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)] animate-fade-in mx-2"
                title="Adjust Zoom Level"
              />
            )}
            <button 
              onClick={() => setShowZoomSlider(!showZoomSlider)}
              className={\`w-10 h-10 flex items-center justify-center transition-colors hover:bg-button-hover rounded-full flex-shrink-0 \${showZoomSlider ? 'text-[var(--color-accent)]' : 'text-text-muted hover:text-text-main'}\`}
              title="Toggle Zoom Slider"
            >
              <ZoomIn size={16} />
            </button>
          </div>`;

content = content.replace(oldZoomBtn, newZoomBtn);

fs.writeFileSync('src/components/Timeline.tsx', content);
