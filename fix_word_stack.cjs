const fs = require('fs');
let content = fs.readFileSync('src/components/ElementRenderer.tsx', 'utf8');

const wordEffectsOld = `              if (effects.includes('fly-words')) {
                style.transform = \`translateY(\${(1 - p) * 50}px)\`;
                style.opacity = p;
              } else if (effects.includes('fade-words')) {
                style.opacity = p;
              } else if (effects.includes('zoom-words')) {
                style.transform = \`scale(\${0.2 + p * 0.8})\`;
                style.opacity = p;
              }`;

const wordEffectsNew = `              let transform = '';
              if (effects.includes('fly-words')) {
                transform += \` translateY(\${(1 - p) * 50}px)\`;
              }
              if (effects.includes('zoom-words')) {
                transform += \` scale(\${0.2 + p * 0.8})\`;
              }
              if (transform) {
                style.transform = transform.trim();
              }
              if (effects.includes('fly-words') || effects.includes('zoom-words') || effects.includes('fade-words')) {
                style.opacity = p;
              }`;

content = content.replace(wordEffectsOld, wordEffectsNew);
fs.writeFileSync('src/components/ElementRenderer.tsx', content);
