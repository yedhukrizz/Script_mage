const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

content = content.replace(
  "const gridSize = gridOverlay === 'large' ? 150 : 50;",
  "const gridSize = (gridOverlay === 'large' ? 150 : 50) * scale;"
);

content = content.replace(
  "const size = backgroundType === 'scrolling-dots' ? 30 : 50;",
  "const size = (backgroundType === 'scrolling-dots' ? 30 : 50) * scale;"
);

content = content.replace(
  "let offsetY = (timeSec * backgroundSpeed * 50 / 15) % size;",
  "let offsetY = (timeSec * backgroundSpeed * 50 * scale / 15) % size;"
);

content = content.replace(
  "const size = 40;",
  "const size = 40 * scale;"
);

fs.writeFileSync('src/components/ExportButton.tsx', content);
