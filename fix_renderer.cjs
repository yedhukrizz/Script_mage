const fs = require('fs');
let content = fs.readFileSync('src/components/ElementRenderer.tsx', 'utf8');

const oldRender = `        return isEditingText ? (
          <textarea
            ref={textInputRef as any}
            value={element.content}
            onChange={(e) => updateElement(element.id, { content: e.target.value })}
            onBlur={() => setIsEditingText(false)}
            onKeyDown={(e) => {
               if (e.key === 'Enter' && e.shiftKey) {
                 // Newline
               } else if (e.key === 'Enter') {
                 e.preventDefault();
                 setIsEditingText(false);
               }
            }}
            className={\`bg-transparent border-none outline-none w-full h-full flex items-center justify-center text-center resize-none whitespace-pre-wrap break-words \${textEffectClass}\`}
            style={{ color: element.color, fontSize: \`\${(element.fontSize || 32) * globalTextScale}px\`, lineHeight: 1.5, fontWeight: element.fontWeight || 600, fontFamily: \`"\${fontFamily}", sans-serif\` }}
          />
        ) : (
          <div
            onDoubleClick={() => setIsEditingText(true)}
            className={\`w-full h-full flex items-center justify-center cursor-text text-center select-none \${textEffectClass}\`}
            style={{ color: element.color, fontSize: \`\${(element.fontSize || 32) * globalTextScale}px\`, lineHeight: 1.5, fontWeight: element.fontWeight || 600, fontFamily: \`"\${fontFamily}", sans-serif\` }}
          >
            <span className="whitespace-pre-wrap break-words w-full" style={{ display: 'block' }}>{renderedText}</span>
          </div>
        );`;

const newRender = `        const staticEffectsClass = effects.filter(e => e !== 'none' && !['shiver', 'flicker', 'glitch', 'wave'].includes(e)).map(e => \`effect-\${e}\`).join(' ');
        const animEffects = effects.filter(e => ['shiver', 'flicker', 'glitch', 'wave'].includes(e)).map(e => \`effect-\${e}\`);

        let innerNode = isEditingText ? (
          <textarea
            ref={textInputRef as any}
            value={element.content}
            onChange={(e) => updateElement(element.id, { content: e.target.value })}
            onBlur={() => setIsEditingText(false)}
            onKeyDown={(e) => {
               if (e.key === 'Enter' && e.shiftKey) {
                 // Newline
               } else if (e.key === 'Enter') {
                 e.preventDefault();
                 setIsEditingText(false);
               }
            }}
            className={\`bg-transparent border-none outline-none w-full h-full flex items-center justify-center text-center resize-none whitespace-pre-wrap break-words \${staticEffectsClass}\`}
            style={{ color: element.color, '--effect-color': element.color, fontSize: \`\${(element.fontSize || 32) * globalTextScale}px\`, lineHeight: 1.5, fontWeight: element.fontWeight || 600, fontFamily: \`"\${fontFamily}", sans-serif\` } as React.CSSProperties}
          />
        ) : (
          <div
            onDoubleClick={() => setIsEditingText(true)}
            className={\`w-full h-full flex items-center justify-center cursor-text text-center select-none \${staticEffectsClass}\`}
            style={{ color: element.color, '--effect-color': element.color, fontSize: \`\${(element.fontSize || 32) * globalTextScale}px\`, lineHeight: 1.5, fontWeight: element.fontWeight || 600, fontFamily: \`"\${fontFamily}", sans-serif\` } as React.CSSProperties}
          >
            <span className="whitespace-pre-wrap break-words w-full" style={{ display: 'block' }}>{renderedText}</span>
          </div>
        );

        animEffects.forEach((animClass, idx) => {
           innerNode = <div key={\`anim-\${idx}\`} className={\`w-full h-full flex items-center justify-center \${animClass}\`}>{innerNode}</div>;
        });

        return innerNode;`;

content = content.replace(oldRender, newRender);
fs.writeFileSync('src/components/ElementRenderer.tsx', content);
