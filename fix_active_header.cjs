const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `<span className="text-xs font-bold text-text-main capitalize">
                    {activeSubMenu === 'font' && 'Global Font'}
                    {activeSubMenu === 'background' && 'Canvas Background'}
                    {activeSubMenu === 'export' && 'Export Video'}
                    {activeSubMenu === 'settings' && 'Settings'}
                  </span>
                  <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-[var(--color-accent)] transition-colors p-1" title="Close Menu">
                    <X size={16} />
                  </button>`;

const replacement = `<div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-text-main capitalize">
                      {activeSubMenu === 'font' && 'Global Font'}
                      {activeSubMenu === 'background' && 'Canvas Background'}
                      {activeSubMenu === 'export' && 'Export Video'}
                      {activeSubMenu === 'settings' && 'Settings'}
                    </span>
                    <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-[var(--color-accent)] transition-colors p-1" title="Close Menu">
                      <X size={16} />
                    </button>
                  </div>`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
