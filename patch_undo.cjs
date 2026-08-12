const fs = require('fs');
let file = 'src/components/UndoRedoControls.tsx';
let content = fs.readFileSync(file, 'utf8');

const importOld = "import { Undo2, Redo2, Heart } from 'lucide-react';";
const importNew = "import { Undo2, Redo2, Heart, Hand } from 'lucide-react';";
content = content.replace(importOld, importNew);

const storeHooksAnchor = "  const future = useStore(state => state.future);";
const storeHooksNew = "  const future = useStore(state => state.future);\n  const timelineTrackpadMode = useStore(state => state.timelineTrackpadMode);\n  const setTimelineTrackpadMode = useStore(state => state.setTimelineTrackpadMode);";
content = content.replace(storeHooksAnchor, storeHooksNew);

const heartButtonOld = `        <button 
          onClick={() => setShowDonation(true)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-button-bg text-red-400 border border-panel-border rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all hover:bg-button-hover hover:text-red-500 hover:border-red-500/30 ml-2"
          title="Support the Project"
        >
          <Heart size={24} fill="currentColor" />
        </button>`;

const heartButtonNew = `        <button 
          onClick={() => setTimelineTrackpadMode(!timelineTrackpadMode)}
          className={\`w-12 h-12 sm:w-14 sm:h-14 border rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all ml-2 \${timelineTrackpadMode ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]' : 'bg-button-bg text-text-muted border-panel-border hover:bg-button-hover'}\`}
          title={timelineTrackpadMode ? "Disable Timeline Pan (Trackpad Mode)" : "Enable Timeline Pan (Trackpad Mode)"}
        >
          <Hand size={24} className={timelineTrackpadMode ? "fill-white/20" : ""} />
        </button>
        <button 
          onClick={() => setShowDonation(true)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-button-bg text-red-400 border border-panel-border rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all hover:bg-button-hover hover:text-red-500 hover:border-red-500/30"
          title="Support the Project"
        >
          <Heart size={24} fill="currentColor" />
        </button>`;

content = content.replace(heartButtonOld, heartButtonNew);

fs.writeFileSync(file, content);
