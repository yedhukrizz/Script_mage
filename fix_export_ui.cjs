const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

// Change export button signature
content = content.replace(
  'export function ExportButton({ className = "flex items-center justify-center w-10 h-10 bg-text-main text-app-bg rounded-full hover:opacity-80 transition-all disabled:opacity-50", iconSize = 18 }: { className?: string, iconSize?: number }) {',
  'export function ExportButton({ className = "flex items-center justify-center gap-2 px-4 h-10 bg-[var(--color-accent)] text-white font-bold rounded-full hover:opacity-90 transition-all disabled:opacity-50 shadow-lg", iconSize = 18 }: { className?: string, iconSize?: number }) {'
);

// Add label
content = content.replace(
  '<Upload size={iconSize} />\n      </button>',
  '<Upload size={iconSize} />\n        <span className="text-sm">Export</span>\n      </button>'
);

// Add cancel button
const exportModalCancelOld = `              <h3 className="text-xl font-bold mb-2">Exporting Video</h3>
              <p className="text-sm text-text-muted mb-6">Rendering frames and muxing audio... do not close the tab.</p>`;
const exportModalCancelNew = `              <h3 className="text-xl font-bold mb-2">Exporting Video</h3>
              <p className="text-sm text-text-muted mb-6">Rendering frames and muxing audio... do not close the tab.</p>
              <button 
                onClick={() => { cancelRef.current = true; }} 
                className="mb-4 px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-xl font-bold transition-colors w-full border border-red-500/30"
              >
                Cancel Export
              </button>`;
content = content.replace(exportModalCancelOld, exportModalCancelNew);

fs.writeFileSync('src/components/ExportButton.tsx', content);
