const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const regex = /<span className="text-\[10px\] font-semibold text-text-muted uppercase tracking-wider pl-1\.5 shrink-0">Ratio:<\/span>\s*<select[\s\S]*?<\/select>/;

const newRatioBtn = `<span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider pl-1.5 shrink-0">Ratio:</span>
                    <button 
                      onClick={() => setActiveSubMenu('aspectRatio')}
                      className="bg-button-bg border border-panel-border rounded-lg w-full text-center h-7 text-xs font-semibold text-text-main hover:bg-button-hover hover:border-[var(--color-accent)] transition-all px-2 flex items-center justify-center gap-2"
                    >
                      {canvasAspectRatio === '9/16' ? '9:16 Portrait' : canvasAspectRatio === '16/9' ? '16:9 Landscape' : canvasAspectRatio === '1/1' ? '1:1 Square' : '4:5 Vertical'}
                    </button>`;

if (regex.test(content)) {
  content = content.replace(regex, newRatioBtn);
  fs.writeFileSync('src/components/Toolbar.tsx', content);
  console.log("Ratio replaced");
} else {
  console.log("Ratio not found");
}
