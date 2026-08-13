const fs = require('fs');

const fixModal = (file, isFlexCol) => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Normalize z-index to z-[100] (or 110/120) to ensure it's on top of everything
  // Normalize layout to flex items-center justify-center p-2 sm:p-4
  // Ensure the inner container has max-h-[95vh] or max-h-[90vh], overflow-y-auto, and responsive width.
  
  // First, find the fixed inset-0 element
  content = content.replace(/className="fixed inset-0[^"]*"/, (match) => {
    return 'className="fixed inset-0 bg-black/80 flex items-center justify-center z-[150] p-2 sm:p-4 md:p-6"';
  });
  
  fs.writeFileSync(file, content);
};

const filesToFix = [
  'src/components/SettingsModal.tsx',
  'src/components/ScriptModal.tsx',
  'src/components/TTSModal.tsx',
  'src/components/AboutModal.tsx',
  'src/components/TranslateModal.tsx'
];

filesToFix.forEach(f => {
  if(fs.existsSync(f)) {
     fixModal(f, false);
  }
});

// Fix Toolbar.tsx
let toolbar = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');
toolbar = toolbar.replace(/className={\`fixed inset-0 z-\[\d+\]/g, 'className={`fixed inset-0 z-[150]');
toolbar = toolbar.replace(/max-h-\[85vh\] w-\[320px\] sm:w-\[360px\]/g, 'max-h-[85vh] w-[92vw] max-w-[360px]');
fs.writeFileSync('src/components/Toolbar.tsx', toolbar);

