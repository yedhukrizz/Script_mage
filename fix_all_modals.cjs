const fs = require('fs');

const filesToUpdate = [
  'src/components/SettingsModal.tsx',
  'src/components/ScriptModal.tsx',
  'src/components/TTSModal.tsx',
  'src/components/ExportButton.tsx',
  'src/components/CustomSelect.tsx'
];

filesToUpdate.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Change modal containers to have beautiful rounded corners everywhere, not just sm:
  content = content.replace(/w-full h-full sm:h-auto sm:max-h-\[90vh\]/g, 'w-full max-h-[90vh]');
  content = content.replace(/sm:max-h-\[88vh\]/g, '');
  content = content.replace(/w-full max-w-5xl rounded-\[40px\] flex flex-col my-auto max-h-\[92vh\]  overflow-hidden/g, 'w-full max-w-5xl rounded-[32px] sm:rounded-[40px] flex flex-col my-auto max-h-[90vh] overflow-hidden');

  fs.writeFileSync(file, content);
});
