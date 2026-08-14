const fs = require('fs');
let exportBtn = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');
exportBtn = exportBtn.replace(
  'export function ExportButton({ className = "flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border float-border hover:border-[var(--color-accent)] transition-all gap-1 group",',
  'export function ExportButton({ className = "flex flex-col items-center justify-center p-2 w-full h-full bg-button-bg hover:bg-button-hover text-text-main rounded-xl border float-border hover:border-[var(--color-accent)] transition-all gap-1 group",'
);
fs.writeFileSync('src/components/ExportButton.tsx', exportBtn);
