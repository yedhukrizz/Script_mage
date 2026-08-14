const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

const mediaEffectInsertion = `
          if (element.mediaEffect && element.mediaEffect !== 'none') {
            const totalDuration = element.endTime - element.startTime;
            if (totalDuration > 0) {
              const progress = Math.max(0, Math.min(1, timeSinceStart / totalDuration));
              if (element.mediaEffect === 'parallax-zoom-in' || element.mediaEffect === 'zoom-in' || element.mediaEffect === 'parallax-slow') {
                 currentScale *= (1 + 0.15 * progress);
              } else if (element.mediaEffect === 'parallax-zoom-out' || element.mediaEffect === 'zoom-out' || element.mediaEffect === 'parallax-fast') {
                 currentScale *= (1.15 - 0.15 * progress);
              }
            }
          }
`;
content = content.replace('          ctx.save();\n          const centerX = currentX + element.width / 2;', mediaEffectInsertion + '\n          ctx.save();\n          const centerX = currentX + element.width / 2;');

fs.writeFileSync('src/components/ExportButton.tsx', content);
