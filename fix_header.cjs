const fs = require('fs');
let content = fs.readFileSync('src/components/PlaceholderGallery.tsx', 'utf8');

const oldHeader = `<div className="flex items-center justify-between p-4 sm:p-6 border-b border-panel-border bg-panel-bg shrink-0 flex-wrap gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] shrink-0">
            <ImageIcon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-text-main truncate">Placeholder Gallery</h1>
            <p className="text-xs sm:text-sm text-text-muted truncate">Generate prompts and add media for your timeline placeholders</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 sm:hidden flex items-center justify-center bg-button-bg hover:bg-button-hover border border-panel-border rounded-xl text-text-muted transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto flex-wrap">
                    <div className="flex flex-wrap items-center gap-2 flex-1 sm:flex-initial relative" ref={bulkMenuRef}>`;

const newHeader = `<div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 sm:p-6 border-b border-panel-border bg-panel-bg shrink-0 gap-4">
        <div className="flex items-center justify-between gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] shrink-0">
              <ImageIcon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-text-main truncate">Placeholder Gallery</h1>
              <p className="text-xs sm:text-sm text-text-muted truncate">Generate prompts and add media for your timeline placeholders</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 lg:hidden flex items-center justify-center bg-button-bg hover:bg-button-hover border border-panel-border rounded-xl text-text-muted transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2 flex-1 sm:flex-initial relative" ref={bulkMenuRef}>`;

content = content.replace(oldHeader, newHeader);

// Also replace the hidden close button on desktop:
content = content.replace(/className="w-10 h-10 hidden sm:flex items-center justify-center bg-button-bg hover:bg-button-hover border border-panel-border rounded-xl text-text-muted transition-colors shrink-0"/, 
'className="w-10 h-10 hidden lg:flex items-center justify-center bg-button-bg hover:bg-button-hover border border-panel-border rounded-xl text-text-muted transition-colors shrink-0"');

fs.writeFileSync('src/components/PlaceholderGallery.tsx', content);
