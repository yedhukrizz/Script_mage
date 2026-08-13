const fs = require('fs');

let content = fs.readFileSync('src/components/ElementRenderer.tsx', 'utf8');

const targetStr = `        const textEffectClass = element.textEffect && element.textEffect !== 'none' ? \`effect-\${element.textEffect}\` : '';
        const fontFamily = element.fontFamily || 'Instrument Sans';
        
        let renderedText: React.ReactNode = element.content;
        
        const isTypewriter = element.animationIn === 'typewriter' || element.textEffect === 'write-on';
        const isWordEffect = ['fly-words', 'fade-words', 'zoom-words'].includes(element.textEffect || '');`;

const newStr = `        const effects = [element.textEffect, element.textEffect2, element.textEffect3].filter(Boolean) as string[];
        const textEffectClass = effects.filter(e => e !== 'none').map(e => \`effect-\${e}\`).join(' ');
        const fontFamily = element.fontFamily || 'Instrument Sans';
        
        let renderedText: React.ReactNode = element.content;
        
        const isTypewriter = element.animationIn === 'typewriter' || effects.includes('write-on');
        const isWordEffect = effects.some(e => ['fly-words', 'fade-words', 'zoom-words'].includes(e));`;

content = content.replace(targetStr, newStr);

// Also we need to replace `element.textEffect === ...` in the loop
content = content.replace(/element\.textEffect === 'fly-words'/g, "effects.includes('fly-words')");
content = content.replace(/element\.textEffect === 'fade-words'/g, "effects.includes('fade-words')");
content = content.replace(/element\.textEffect === 'zoom-words'/g, "effects.includes('zoom-words')");

fs.writeFileSync('src/components/ElementRenderer.tsx', content);
