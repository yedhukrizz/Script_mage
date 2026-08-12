const fs = require('fs');
let file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

// Add --color-shadow variable to themes
content = content.replace(/--color-app-bg: #f0f0f5;/, '--color-app-bg: #f0f0f5;\n  --color-shadow: rgba(0, 0, 0, 0.1);');
content = content.replace(/--color-app-bg: #09090b;/, '--color-app-bg: #09090b;\n  --color-shadow: rgba(0, 0, 0, 0.5);');
content = content.replace(/--color-app-bg: #000000;/, '--color-app-bg: #000000;\n  --color-shadow: rgba(0, 0, 0, 0.7);');

// Add standard Tailwind var
content = content.replace(/--color-input-bg: var\(--color-input-bg\);/, '--color-input-bg: var(--color-input-bg);\n  --color-shadow: var(--color-shadow);');

// Add .glass-panel utility
const glassUtility = `
@layer utilities {
  .glass-panel {
    background-color: var(--color-panel-bg);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    border: 1px solid var(--color-panel-border);
    box-shadow: 0 30px 60px -15px var(--color-shadow), 0 0 0 1px inset rgba(255, 255, 255, 0.05);
  }
  .glass-panel-heavy {
    background-color: var(--color-panel-bg);
    backdrop-filter: blur(48px);
    -webkit-backdrop-filter: blur(48px);
    border: 1px solid var(--color-panel-border);
    box-shadow: 0 40px 80px -20px var(--color-shadow), 0 0 0 1px inset rgba(255, 255, 255, 0.05);
  }
}
`;
content = content.replace(/@layer utilities \{/, '@layer utilities {' + glassUtility);

fs.writeFileSync(file, content);
