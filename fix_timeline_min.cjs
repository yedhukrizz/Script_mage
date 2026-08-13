const fs = require('fs');
let file = 'src/components/Timeline.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add imports
if (!content.includes('ChevronDown')) {
  content = content.replace(/Maximize2, Minimize2, Eye, EyeOff/, 'Maximize2, Minimize2, Eye, EyeOff, ChevronDown, ChevronUp');
}

// Add state hook
if (!content.includes('const timelineMinimized = useStore((state) => state.timelineMinimized);')) {
  content = content.replace(/const timelineExpanded = useStore\(\(state\) => state\.timelineExpanded\);/, 
    'const timelineExpanded = useStore((state) => state.timelineExpanded);\n  const timelineMinimized = useStore((state) => state.timelineMinimized);');
}

// Add the button next to full screen button
const newButton = `
        <button
          onClick={() => useStore.getState().setTimelineMinimized(!useStore.getState().timelineMinimized)}
          className={\`p-2 transition-colors hover:bg-button-hover rounded-full flex-shrink-0 \${timelineMinimized ? 'text-[var(--color-accent)]' : 'text-text-muted hover:text-text-main'}\`}
          title="Minimize Timeline"
        >
          {timelineMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>`;

content = content.replace(/<\/button>\n\s*<\/div>\n\n\s*{\/\* Timeline Tracks Area \*\/}/, 
  `</button>${newButton}\n\n      {/* Timeline Tracks Area */}`);

fs.writeFileSync(file, content);
