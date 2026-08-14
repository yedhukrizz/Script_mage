const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

// Fix shiver/flicker/glitch else-ifs
content = content.replace(
  "} else if (effects.includes('flicker')) {",
  "} if (effects.includes('flicker')) {"
);
content = content.replace(
  "} else if (effects.includes('glitch')) {",
  "} if (effects.includes('glitch')) {"
);
content = content.replace(
  "dx = (Math.random() - 0.5) * 15;",
  "dx += (Math.random() - 0.5) * 15;"
);

// Fix fly-words/zoom-words/fade-words else-ifs
content = content.replace(
  "} else if (effects.includes('zoom-words')) {",
  "} if (effects.includes('zoom-words')) {"
);
content = content.replace(
  "} else if (effects.includes('fade-words')) {",
  "} if (effects.includes('fade-words')) {"
);


// Fix outline vs others
const outlineRenderOld = `                if (isOutline) {
                  ctx.strokeText(line, element.width / 2 + dx, startY + dy);
                } else {
                  ctx.fillText(line, element.width / 2 + dx, startY + dy);
                  if (effects.includes('bloom') || effects.includes('neon') || effects.includes('drop-shadow')) {
                     ctx.fillText(line, element.width / 2 + dx, startY + dy);
                  }
                }`;

const outlineRenderNew = `                if (isOutline) {
                  ctx.strokeText(line, element.width / 2 + dx, startY + dy);
                  if (effects.includes('bloom') || effects.includes('neon') || effects.includes('drop-shadow')) {
                     ctx.strokeText(line, element.width / 2 + dx, startY + dy);
                  }
                } else {
                  ctx.fillText(line, element.width / 2 + dx, startY + dy);
                  if (effects.includes('bloom') || effects.includes('neon') || effects.includes('drop-shadow')) {
                     ctx.fillText(line, element.width / 2 + dx, startY + dy);
                  }
                }`;
content = content.replace(outlineRenderOld, outlineRenderNew);

const outlineWordOld = `                  if (isOutline) {
                    ctx.strokeText(word, 0, 0);
                  } else {
                    ctx.fillText(word, 0, 0);
                    if (effects.includes('bloom') || effects.includes('neon') || effects.includes('drop-shadow')) {
                       ctx.fillText(word, 0, 0);
                    }
                  }`;
const outlineWordNew = `                  if (isOutline) {
                    ctx.strokeText(word, 0, 0);
                    if (effects.includes('bloom') || effects.includes('neon') || effects.includes('drop-shadow')) {
                       ctx.strokeText(word, 0, 0);
                    }
                  } else {
                    ctx.fillText(word, 0, 0);
                    if (effects.includes('bloom') || effects.includes('neon') || effects.includes('drop-shadow')) {
                       ctx.fillText(word, 0, 0);
                    }
                  }`;
content = content.replace(outlineWordOld, outlineWordNew);


// Fix shadow else-ifs
const shadowOld = `            if (effects.includes('drop-shadow')) {
              ctx.shadowColor = 'rgba(0,0,0,0.5)';
              ctx.shadowBlur = 8;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 4 * scale;
            } else if (effects.includes('bloom')) {
              ctx.shadowColor = element.color || '#ffffff';
              ctx.shadowBlur = 20;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
            } else if (effects.includes('neon')) {
              ctx.shadowColor = element.color || '#ffffff';
              ctx.shadowBlur = 40;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
            } else {
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
            }`;

const shadowNew = `            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            if (effects.includes('drop-shadow')) {
              ctx.shadowColor = 'rgba(0,0,0,0.5)';
              ctx.shadowBlur = 8;
              ctx.shadowOffsetY = 4 * scale;
            }
            if (effects.includes('bloom')) {
              ctx.shadowColor = element.color || '#ffffff';
              ctx.shadowBlur = 20;
              ctx.shadowOffsetY = 0;
            }
            if (effects.includes('neon')) {
              ctx.shadowColor = element.color || '#ffffff';
              ctx.shadowBlur = 40;
              ctx.shadowOffsetY = 0;
            }`;
content = content.replace(shadowOld, shadowNew);

fs.writeFileSync('src/components/ExportButton.tsx', content);
