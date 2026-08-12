const fs = require('fs');
let file = 'src/components/PropertiesPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const importStatement = `import { ThickSlider } from './ThickSlider';\n`;

content = content.replace(`import { CustomSelect } from './CustomSelect';`, `import { CustomSelect } from './CustomSelect';\n` + importStatement);

const startIdx = content.indexOf(`  <div className="flex flex-col gap-2 mb-4">`);
const endIdx = content.indexOf(`  </div>\n);`);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.slice(0, startIdx) + content.slice(endIdx + 9);
}

fs.writeFileSync(file, content);
