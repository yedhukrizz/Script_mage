const fs = require('fs');

const filesToUpdate = [
  'src/components/SettingsModal.tsx',
  'src/components/ScriptModal.tsx',
  'src/components/TTSModal.tsx'
];

filesToUpdate.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Change modal containers to have beautiful rounded corners everywhere, not just sm:
  content = content.replace(/sm:rounded-\[32px\] rounded-2xl/g, 'rounded-[40px]');
  content = content.replace(/sm:rounded-\[32px\]/g, 'rounded-[40px]');
  content = content.replace(/rounded-2xl sm:rounded-3xl/g, 'rounded-[40px]');
  
  // Make sure header backgrounds aren't overriding the glass
  content = content.replace(/bg-app-bg z-10/g, 'z-10');
  
  fs.writeFileSync(file, content);
});
