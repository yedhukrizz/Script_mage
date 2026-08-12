const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `className="bg-panel-bg/95 backdrop-blur-xl border border-panel-border p-3 rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] max-h-[85vh] overflow-y-auto custom-scrollbar w-[320px] sm:w-[360px] select-none"`,
  `className="bg-panel-bg/95 backdrop-blur-xl border border-panel-border p-3 rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] max-h-[85vh] overflow-y-auto overflow-x-hidden custom-scrollbar w-[320px] sm:w-[360px] select-none"`
);

fs.writeFileSync(file, content);
