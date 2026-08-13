const fs = require('fs');
let content = fs.readFileSync('src/components/PropertiesPanel.tsx', 'utf8');

const regex = /\{selectedElement\.type === 'text' && \(\s*<div className="flex flex-col gap-2 mb-4">\s*<span className="text-xs text-text-muted font-medium px-1">Text Content<\/span>\s*<textarea[\s\S]*?<\/div>\s*\)\}/;

const match = content.match(regex);
if (match) {
  content = content.replace(regex, '');
  
  const textTab = `{activeTab === 'text' && hasText && (
              <>
                <div className="flex flex-col gap-2 mb-4">
                  <span className="text-xs text-text-muted font-medium px-1">Text Content</span>
                  <textarea 
                    value={selectedElement.content || ''} 
                    onChange={(e) => handleChange('content', e.target.value)}
                    className="w-full bg-button-bg border border-panel-border hover:border-[var(--color-accent)] focus:border-[var(--color-accent)] rounded-xl px-3 py-2 text-sm text-text-main resize-none outline-none transition-colors min-h-[120px] custom-scrollbar"
                    placeholder="Enter text..."
                  />
                </div>
              </>
            )}

            `;
            
  content = content.replace("{activeTab === 'appearance' && hasAppearance && (", textTab + "{activeTab === 'appearance' && hasAppearance && (");
  
  fs.writeFileSync('src/components/PropertiesPanel.tsx', content);
  console.log('Fixed properties panel text tab');
} else {
  console.log('Regex match failed');
}

