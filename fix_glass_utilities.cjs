const fs = require('fs');
let file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

// Update glass panels to use dynamic inset border color for iOS style
content = content.replace(/0 0 0 1px inset rgba\(255, 255, 255, 0\.05\)/g, '0 0 0 1px inset var(--color-glass-rim)');

content = content.replace(/--color-app-bg: #f2f2f7;/g, '--color-app-bg: #f2f2f7;\n  --color-glass-rim: rgba(255, 255, 255, 1);');
content = content.replace(/--color-panel-border: rgba\(255, 255, 255, 1\);/g, '--color-panel-border: rgba(0, 0, 0, 0.08);'); // Outer border for light mode

content = content.replace(/--color-app-bg: #000000;\n  --color-shadow: rgba\(0, 0, 0, 0\.5\);/g, '--color-app-bg: #000000;\n  --color-shadow: rgba(0, 0, 0, 0.5);\n  --color-glass-rim: rgba(255, 255, 255, 0.05);');

content = content.replace(/--color-app-bg: #000000;\n  --color-shadow: rgba\(0, 0, 0, 0\.8\);/g, '--color-app-bg: #000000;\n  --color-shadow: rgba(0, 0, 0, 0.8);\n  --color-glass-rim: rgba(255, 255, 255, 0.08);');

fs.writeFileSync(file, content);
