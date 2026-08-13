const fs = require('fs');
let file = 'src/components/PropertiesPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add 'text' to the union type
content = content.replace(
  /useState\<'transform' \| 'appearance' \| 'media' \| 'animation' \| 'time' \| 'tts' \| null\>/,
  "useState<'transform' | 'text' | 'appearance' | 'media' | 'animation' | 'time' | 'tts' | null>"
);

// Add 'text' type checker
if (!content.includes("const hasText =")) {
  content = content.replace(
    /const hasAppearance = selectedElement.type === 'text' \|\| selectedElement.type === 'shape';/,
    "const hasAppearance = selectedElement.type === 'text' || selectedElement.type === 'shape';\n  const hasText = selectedElement.type === 'text';"
  );
}

if (!content.includes("activeTab === 'text' && !hasText")) {
  content = content.replace(
    /if \(activeTab === 'appearance' && !hasAppearance\) setActiveTab\(null\);/,
    "if (activeTab === 'appearance' && !hasAppearance) setActiveTab(null);\n  if (activeTab === 'text' && !hasText) setActiveTab(null);"
  );
}

// Check if we haven't already replaced the icon bar
if (!content.includes("activeTab === 'text' ? null : 'text'")) {
  const oldIconBar = "{hasAppearance && <IconButton icon={Type} onClick={() => setActiveTab(activeTab === 'appearance' ? null : 'appearance')} active={activeTab === 'appearance'} />}";
  const newIconBar = `{hasText && <IconButton icon={Type} onClick={() => setActiveTab(activeTab === 'text' ? null : 'text')} active={activeTab === 'text'} />}
        {hasAppearance && <IconButton icon={Palette} onClick={() => setActiveTab(activeTab === 'appearance' ? null : 'appearance')} active={activeTab === 'appearance'} />}`;
  content = content.replace(oldIconBar, newIconBar);
}

if (!content.includes('Palette,')) {
  content = content.replace(/Type, /, 'Type, Palette, ');
}

// Now replace the tab render blocks
const blockStart = "{activeTab === 'appearance' && hasAppearance && (";
if (content.includes(blockStart) && !content.includes("{activeTab === 'text' && hasText && (")) {
  const appearanceIdx = content.indexOf(blockStart);
  
  const textCheck = "{selectedElement.type === 'text' && (\\s*<div className=\"flex flex-col gap-2 mb-4\">\\s*<span className=\"text-xs text-text-muted font-medium px-1\">Text Content</span>\\s*<textarea[\\s\\S]*?/>\\s*</div>\\s*)}";
  
  // Extract text content area inside appearance tab using regex
  const rx = new RegExp(textCheck);
  const match = content.match(rx);
  if (match) {
    const textMarkup = match[0].replace("{selectedElement.type === 'text' && (", "").replace(/}\)$/, "");
    
    // Remove it from the appearance tab
    content = content.replace(match[0], "");
    
    // Add the new text tab
    const textTab = `{activeTab === 'text' && hasText && (
              <>
                ${textMarkup}
              </>
            )}

            `;
            
    content = content.substring(0, appearanceIdx) + textTab + content.substring(appearanceIdx);
  }
}


fs.writeFileSync(file, content);
console.log("PropertiesPanel updated!");
