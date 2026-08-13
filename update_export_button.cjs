const fs = require('fs');

let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

const isTypewriterStr = `            const isTypewriter = element.animationIn === 'typewriter' || element.textEffect === 'write-on';
            const isWordEffect = ['fly-words', 'fade-words', 'zoom-words'].includes(element.textEffect || '');`;

const newIsTypewriterStr = `            const effects = [element.textEffect, element.textEffect2, element.textEffect3].filter(Boolean) as string[];
            const isTypewriter = element.animationIn === 'typewriter' || effects.includes('write-on');
            const isWordEffect = effects.some(e => ['fly-words', 'fade-words', 'zoom-words'].includes(e));`;

content = content.replace(isTypewriterStr, newIsTypewriterStr);

content = content.replace(/element\.textEffect === 'shiver'/g, "effects.includes('shiver')");
content = content.replace(/element\.textEffect === 'flicker'/g, "effects.includes('flicker')");
content = content.replace(/element\.textEffect === 'glitch'/g, "effects.includes('glitch')");
content = content.replace(/element\.textEffect === 'bloom'/g, "effects.includes('bloom')");
content = content.replace(/element\.textEffect === 'neon'/g, "effects.includes('neon')");
content = content.replace(/element\.textEffect === 'fly-words'/g, "effects.includes('fly-words')");
content = content.replace(/element\.textEffect === 'zoom-words'/g, "effects.includes('zoom-words')");
content = content.replace(/element\.textEffect === 'fade-words'/g, "effects.includes('fade-words')");

fs.writeFileSync('src/components/ExportButton.tsx', content);
