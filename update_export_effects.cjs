const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

const effectSetupOld = `            if (effects.includes('bloom')) {
              ctx.shadowColor = element.color || '#ffffff';
              ctx.shadowBlur = 20;
            } else if (effects.includes('neon')) {
              ctx.shadowColor = element.color || '#ffffff';
              ctx.shadowBlur = 40;
            } else {
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;
            }`;

const effectSetupNew = `            if (effects.includes('drop-shadow')) {
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
            }
            
            const isOutline = effects.includes('outline');
            if (isOutline) {
              ctx.lineWidth = 2 * scale;
              ctx.strokeStyle = element.color || '#ffffff';
              ctx.fillStyle = 'transparent';
            }
            
            if (effects.includes('wave')) {
               const waveProgress = (time % 2000) / 2000;
               dy += Math.sin(waveProgress * Math.PI * 2) * 5 * scale;
            }
`;

content = content.replace(effectSetupOld, effectSetupNew);

const renderLineOld = `              if (!isWordEffect) {
                ctx.textAlign = 'center';
                ctx.fillText(line, element.width / 2 + dx, startY + dy);
                if (effects.includes('bloom') || effects.includes('neon')) {
                   ctx.fillText(line, element.width / 2 + dx, startY + dy);
                }
              } else {`;

const renderLineNew = `              if (!isWordEffect) {
                ctx.textAlign = 'center';
                if (isOutline) {
                  ctx.strokeText(line, element.width / 2 + dx, startY + dy);
                } else {
                  ctx.fillText(line, element.width / 2 + dx, startY + dy);
                  if (effects.includes('bloom') || effects.includes('neon') || effects.includes('drop-shadow')) {
                     ctx.fillText(line, element.width / 2 + dx, startY + dy);
                  }
                }
              } else {`;

content = content.replace(renderLineOld, renderLineNew);

const renderWordOld = `                  ctx.fillText(word, 0, 0);
                  if (effects.includes('bloom') || effects.includes('neon')) {
                     ctx.fillText(word, 0, 0);
                  }`;

const renderWordNew = `                  if (isOutline) {
                    ctx.strokeText(word, 0, 0);
                  } else {
                    ctx.fillText(word, 0, 0);
                    if (effects.includes('bloom') || effects.includes('neon') || effects.includes('drop-shadow')) {
                       ctx.fillText(word, 0, 0);
                    }
                  }`;

content = content.replace(renderWordOld, renderWordNew);

const resetShadowOld = `            // reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;`;

const resetShadowNew = `            // reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;`;

content = content.replace(resetShadowOld, resetShadowNew);

fs.writeFileSync('src/components/ExportButton.tsx', content);
