const fs = require('fs');

const files = [
  'src/components/AboutModal.tsx',
  'src/components/DonationModal.tsx',
  'src/components/ScriptModal.tsx',
  'src/components/SettingsModal.tsx',
  'src/components/TTSModal.tsx',
  'src/components/TranslateModal.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Change backgrounds to bg-black/60
  content = content.replace(/bg-black\/80/g, 'bg-black/60');
  
  // Standardize the padding
  content = content.replace(/p-2 sm:p-4 md:p-6/g, 'p-4 sm:p-6');
  
  // Standardize rounded corners (specifically looking for rounded-3xl or rounded-[32px] and forcing to rounded-[24px])
  content = content.replace(/rounded-\[32px\]/g, 'rounded-[24px]');
  content = content.replace(/sm:rounded-\[32px\]/g, 'rounded-[24px]');
  content = content.replace(/rounded-3xl/g, 'rounded-[24px]');
  content = content.replace(/sm:rounded-3xl/g, 'rounded-[24px]');
  
  fs.writeFileSync(file, content);
}
