const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

content = content.replace(
  "for (let y = 0; y < targetHeight; y += 4) {",
  "for (let y = 0; y < targetHeight; y += 4 * scale) {"
);

content = content.replace(
  "ctx.fillRect(0, y + 2, targetWidth, 2);",
  "ctx.fillRect(0, y + 2 * scale, targetWidth, 2 * scale);"
);

content = content.replace(
  "for (let y = 0; y < targetHeight; y += 4) {",
  "for (let y = 0; y < targetHeight; y += 4 * scale) {"
);

content = content.replace(
  "ctx.fillRect(0, y + 2, targetWidth, 2);",
  "ctx.fillRect(0, y + 2 * scale, targetWidth, 2 * scale);"
);

content = content.replace(
  "for (let x = 0; x < targetWidth; x += 6) {",
  "for (let x = 0; x < targetWidth; x += 6 * scale) {"
);

content = content.replace(
  "ctx.fillStyle = 'red'; ctx.fillRect(x, 0, 2, targetHeight);",
  "ctx.fillStyle = 'red'; ctx.fillRect(x, 0, 2 * scale, targetHeight);"
);

content = content.replace(
  "ctx.fillStyle = 'green'; ctx.fillRect(x+2, 0, 2, targetHeight);",
  "ctx.fillStyle = 'green'; ctx.fillRect(x+2 * scale, 0, 2 * scale, targetHeight);"
);

content = content.replace(
  "ctx.fillStyle = 'blue'; ctx.fillRect(x+4, 0, 2, targetHeight);",
  "ctx.fillStyle = 'blue'; ctx.fillRect(x+4 * scale, 0, 2 * scale, targetHeight);"
);

fs.writeFileSync('src/components/ExportButton.tsx', content);
