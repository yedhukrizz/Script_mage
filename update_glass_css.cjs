const fs = require('fs');
let file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

// Update Root (Dark)
content = content.replace(/--color-panel-bg: rgba\(24, 24, 27, 0\.6\);/, '--color-panel-bg: rgba(24, 24, 27, 0.4);');
content = content.replace(/--color-panel-border: rgba\(255, 255, 255, 0\.08\);/g, '--color-panel-border: rgba(255, 255, 255, 0.12);');

// Update Light
content = content.replace(/--color-panel-bg: rgba\(255, 255, 255, 0\.8\);/, '--color-panel-bg: rgba(255, 255, 255, 0.35);');
content = content.replace(/--color-panel-border: rgba\(0, 0, 0, 0\.06\);/, '--color-panel-border: rgba(255, 255, 255, 0.7);');
content = content.replace(/--color-button-bg: rgba\(0, 0, 0, 0\.03\);/, '--color-button-bg: rgba(255, 255, 255, 0.5);');
content = content.replace(/--color-input-bg: rgba\(0, 0, 0, 0\.05\);/, '--color-input-bg: rgba(255, 255, 255, 0.4);');
content = content.replace(/--color-button-hover: rgba\(0, 0, 0, 0\.06\);/, '--color-button-hover: rgba(255, 255, 255, 0.7);');
content = content.replace(/--color-app-bg: #fafafa;/, '--color-app-bg: #f0f0f5;'); // slightly darker background so the white glass pops

// Update OLED (Black)
content = content.replace(/--color-panel-bg: rgba\(25, 25, 25, 0\.5\);/, '--color-panel-bg: rgba(5, 5, 5, 0.4);');
// OLED border already updated by the global regex above.

fs.writeFileSync(file, content);
