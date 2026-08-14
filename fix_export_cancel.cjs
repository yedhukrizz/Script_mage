const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

const exportModalCancelOld = `<h3 className="text-xl font-bold mb-2">Exporting Video</h3>
              <p className="text-sm text-text-muted mb-6">Please wait while your video is being rendered. This might take a minute.</p>`;

const exportModalCancelNew = `<h3 className="text-xl font-bold mb-2">Exporting Video</h3>
              <p className="text-sm text-text-muted mb-6">Please wait while your video is being rendered. This might take a minute.</p>
              <button 
                onClick={() => { cancelRef.current = true; }} 
                className="mb-4 px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-xl font-bold transition-colors w-full border border-red-500/30"
              >
                Cancel Export
              </button>`;
content = content.replace(exportModalCancelOld, exportModalCancelNew);

fs.writeFileSync('src/components/ExportButton.tsx', content);
