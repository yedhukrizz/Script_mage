const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

const shadowSetupOld = `            ctx.shadowColor = 'transparent';
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

const shadowSetupNew = `            // Shadows will be applied iteratively during drawing`;

content = content.replace(shadowSetupOld, shadowSetupNew);

const renderLineOld = `                if (isOutline) {
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

const renderLineNew = `                const drawTextFn = () => isOutline ? ctx.strokeText(line, element.width / 2 + dx, startY + dy) : ctx.fillText(line, element.width / 2 + dx, startY + dy);
                
                // Base shadow resets
                ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
                
                if (effects.includes('drop-shadow')) {
                  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4 * scale;
                  drawTextFn();
                  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
                }
                if (effects.includes('bloom')) {
                  ctx.shadowColor = element.color || '#ffffff'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 0;
                  drawTextFn();
                  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
                }
                if (effects.includes('neon')) {
                  ctx.shadowColor = element.color || '#ffffff'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 0;
                  drawTextFn();
                  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
                }
                // Final solid draw
                drawTextFn();`;

content = content.replace(renderLineOld, renderLineNew);

const renderWordOld = `                  if (isOutline) {
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

const renderWordNew = `                  const drawWordFn = () => isOutline ? ctx.strokeText(word, 0, 0) : ctx.fillText(word, 0, 0);
                  
                  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
                  
                  if (effects.includes('drop-shadow')) {
                    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4 * scale;
                    drawWordFn();
                    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
                  }
                  if (effects.includes('bloom')) {
                    ctx.shadowColor = element.color || '#ffffff'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 0;
                    drawWordFn();
                    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
                  }
                  if (effects.includes('neon')) {
                    ctx.shadowColor = element.color || '#ffffff'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 0;
                    drawWordFn();
                    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
                  }
                  drawWordFn();`;

content = content.replace(renderWordOld, renderWordNew);
fs.writeFileSync('src/components/ExportButton.tsx', content);
