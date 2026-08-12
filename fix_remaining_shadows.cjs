const fs = require('fs');

const filesToUpdate = [
  'src/components/SettingsModal.tsx',
  'src/components/ScriptModal.tsx',
  'src/components/ExportButton.tsx',
  'src/components/CustomSelect.tsx',
  'src/components/TTSModal.tsx'
];

filesToUpdate.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Strip any lingering hardcoded shadows and borders that conflict with the clean glass look
  content = content.replace(/shadow-\[.*?\] /g, '');
  content = content.replace(/border border-panel-border /g, ''); // the glass class has its own border rules natively
  
  fs.writeFileSync(file, content);
});
