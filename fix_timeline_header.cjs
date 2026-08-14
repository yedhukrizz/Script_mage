const fs = require('fs');
let content = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

// 1. Add ZoomIn to imports
content = content.replace(
  'Lock, Unlock } from \'lucide-react\';',
  'Lock, Unlock, ZoomIn } from \'lucide-react\';'
);

// 2. Replace the entire Timeline Controls header block
const oldHeader = `<div className="h-12 border-b border-panel-border flex items-center px-2 sm:px-4 gap-2 sm:gap-4 bg-panel-bg shrink-0 overflow-x-auto overflow-y-hidden hide-scrollbar">
        <button onClick={handleReset} className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-main transition-colors hover:bg-button-hover rounded-full flex-shrink-0">
          <SkipBack size={16} />
        </button>
        <button onClick={handlePlayPause} className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-main transition-colors hover:bg-button-hover rounded-full flex-shrink-0">
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div className="text-xs font-mono font-medium tracking-wide text-text-main w-20 sm:w-24 flex-shrink-0">
          {formatTime(currentTime)}
        </div>
        <div className="flex-1 min-w-[1rem]" />
        
        {/* Zoom Slider */}
        <div className="flex items-center gap-2 mr-2">
          <input 
            type="range" 
            min="1" 
            max="10" 
            step="0.1" 
            value={timelineZoom} 
            onChange={(e) => setTimelineZoom(parseFloat(e.target.value))}
            className="w-24 h-2 bg-button-bg rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
            title="Zoom Timeline"
          />
        </div>

        <button 
          onClick={handleSplit} 
          disabled={!selectedElementId}
          className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-main transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-button-hover rounded-full flex-shrink-0"
          title="Split Element at Playhead (Ctrl+B/Cmd+B)"
        >
          <Scissors size={16} />
        </button>
        <button
          onClick={() => setTimelineLengthLock((!timelineLengthLock && timelineInteractionMode !== 'select'))}
          className={\`w-10 h-10 flex items-center justify-center transition-colors hover:bg-button-hover rounded-full flex-shrink-0 \${timelineLengthLock ? 'text-red-500' : 'text-text-muted hover:text-text-main'}\`}
          title="Lock Clip Lengths"
        >
          {timelineLengthLock ? <Lock size={16} /> : <Unlock size={16} />}
        </button>
        <div className="w-px h-6 bg-panel-border mx-1 flex-shrink-0" />
        <button
          onClick={() => useStore.getState().setTimelineTransparent(!useStore.getState().timelineTransparent)}
          className={\`w-10 h-10 flex items-center justify-center transition-colors hover:bg-button-hover rounded-full flex-shrink-0 \${timelineTransparent ? 'text-[var(--color-accent)]' : 'text-text-muted hover:text-text-main'}\`}
          title="Toggle Timeline Opacity"
        >
          {timelineTransparent ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        <button
          onClick={() => useStore.getState().setTimelineExpanded(!useStore.getState().timelineExpanded)}
          className={\`w-10 h-10 flex items-center justify-center transition-colors hover:bg-button-hover rounded-full flex-shrink-0 \${timelineExpanded ? 'text-[var(--color-accent)]' : 'text-text-muted hover:text-text-main'}\`}
          title="Toggle Fullscreen Timeline"
        >
          {timelineExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
        <button
          onClick={() => useStore.getState().setTimelineMinimized(!useStore.getState().timelineMinimized)}
          className={\`w-10 h-10 flex items-center justify-center transition-colors hover:bg-button-hover rounded-full flex-shrink-0 \${timelineMinimized ? 'text-[var(--color-accent)]' : 'text-text-muted hover:text-text-main'}\`}
          title="Minimize Timeline"
        >
          {timelineMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>`;

const newHeader = `<div className="h-12 border-b border-panel-border flex items-center bg-panel-bg shrink-0">
        
        {/* Left: Play Controls (Fixed) */}
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 shrink-0 bg-panel-bg z-10 border-r border-panel-border">
          <button onClick={handleReset} className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-main transition-colors hover:bg-button-hover rounded-full flex-shrink-0" title="Reset (Home)">
            <SkipBack size={16} />
          </button>
          <button onClick={handlePlayPause} className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-main transition-colors hover:bg-button-hover rounded-full flex-shrink-0" title="Play/Pause (Space)">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <div className="text-xs font-mono font-medium tracking-wide text-text-main w-16 sm:w-20 flex-shrink-0 text-center">
            {formatTime(currentTime)}
          </div>
        </div>
        
        {/* Right: Tools & Toggles (Scrollable on small screens) */}
        <div className="flex-1 flex items-center justify-end gap-1 sm:gap-2 px-2 sm:px-4 overflow-x-auto overflow-y-hidden hide-scrollbar">
          <button 
            onClick={() => {
              const nextZoom = timelineZoom >= 10 ? 1 : timelineZoom >= 5 ? 10 : timelineZoom >= 2 ? 5 : 2;
              setTimelineZoom(nextZoom);
            }}
            className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-main transition-colors hover:bg-button-hover rounded-full flex-shrink-0"
            title={\`Toggle Zoom (Current: \${timelineZoom}x)\`}
          >
            <ZoomIn size={16} />
          </button>

          <button 
            onClick={handleSplit} 
            disabled={!selectedElementId}
            className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-main transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-button-hover rounded-full flex-shrink-0"
            title="Split Element at Playhead (Ctrl+B/Cmd+B)"
          >
            <Scissors size={16} />
          </button>
          <button
            onClick={() => setTimelineLengthLock((!timelineLengthLock && timelineInteractionMode !== 'select'))}
            className={\`w-10 h-10 flex items-center justify-center transition-colors hover:bg-button-hover rounded-full flex-shrink-0 \${timelineLengthLock ? 'text-red-500' : 'text-text-muted hover:text-text-main'}\`}
            title="Lock Clip Lengths"
          >
            {timelineLengthLock ? <Lock size={16} /> : <Unlock size={16} />}
          </button>
          <div className="w-px h-6 bg-panel-border mx-1 flex-shrink-0" />
          <button
            onClick={() => useStore.getState().setTimelineTransparent(!useStore.getState().timelineTransparent)}
            className={\`w-10 h-10 flex items-center justify-center transition-colors hover:bg-button-hover rounded-full flex-shrink-0 \${timelineTransparent ? 'text-[var(--color-accent)]' : 'text-text-muted hover:text-text-main'}\`}
            title="Toggle Timeline Opacity"
          >
            {timelineTransparent ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            onClick={() => useStore.getState().setTimelineExpanded(!useStore.getState().timelineExpanded)}
            className={\`w-10 h-10 flex items-center justify-center transition-colors hover:bg-button-hover rounded-full flex-shrink-0 \${timelineExpanded ? 'text-[var(--color-accent)]' : 'text-text-muted hover:text-text-main'}\`}
            title="Toggle Fullscreen Timeline"
          >
            {timelineExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={() => useStore.getState().setTimelineMinimized(!useStore.getState().timelineMinimized)}
            className={\`w-10 h-10 flex items-center justify-center transition-colors hover:bg-button-hover rounded-full flex-shrink-0 \${timelineMinimized ? 'text-[var(--color-accent)]' : 'text-text-muted hover:text-text-main'}\`}
            title="Minimize Timeline"
          >
            {timelineMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>`;

content = content.replace(oldHeader, newHeader);

fs.writeFileSync('src/components/Timeline.tsx', content);
