const fs = require('fs');

let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const targetStr = `<div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Default Text Effect</label>
                    <CustomSelect 
                      value={defaults.text?.textEffect || 'none'} 
                      onChange={(val) => updateDefaults('text', { textEffect: val })}
                      options={[
                        { value: 'none', label: 'None' },
                        { value: 'write-on', label: 'Write On (Typewriter)' },
                        { value: 'fade-words', label: 'Appearing Words' },
                        { value: 'fly-words', label: 'Flying Words' },
                        { value: 'zoom-words', label: 'Zooming Words' },
                        { value: 'shiver', label: 'Shiver (Continuous)' },
                        { value: 'flicker', label: 'Flicker (Continuous)' },
                        { value: 'bloom', label: 'Bloom (Continuous)' },
                        { value: 'neon', label: 'Neon Glow (Continuous)' },
                        { value: 'glitch', label: 'Glitch (Continuous)' }
                      ]}
                    />
                  </div>`;

const effectOptions = `options={[
                        { value: 'none', label: 'None' },
                        { value: 'write-on', label: 'Write On (Typewriter)' },
                        { value: 'fade-words', label: 'Appearing Words' },
                        { value: 'fly-words', label: 'Flying Words' },
                        { value: 'zoom-words', label: 'Zooming Words' },
                        { value: 'shiver', label: 'Shiver (Continuous)' },
                        { value: 'flicker', label: 'Flicker (Continuous)' },
                        { value: 'bloom', label: 'Bloom (Continuous)' },
                        { value: 'neon', label: 'Neon Glow (Continuous)' },
                        { value: 'glitch', label: 'Glitch (Continuous)' }
                      ]}`;

const newStr = `<div className="flex flex-col gap-2">
                    <label className="text-[10px] text-text-muted uppercase font-semibold mb-1">Default Text Effect</label>
                    <CustomSelect 
                      value={defaults.text?.textEffect || 'none'} 
                      onChange={(val) => updateDefaults('text', { textEffect: val })}
                      ${effectOptions}
                    />
                    <label className="text-[10px] text-text-muted uppercase font-semibold mb-1 mt-1">Effect Stack 2</label>
                    <CustomSelect 
                      value={defaults.text?.textEffect2 || 'none'} 
                      onChange={(val) => updateDefaults('text', { textEffect2: val })}
                      ${effectOptions}
                    />
                    <label className="text-[10px] text-text-muted uppercase font-semibold mb-1 mt-1">Effect Stack 3</label>
                    <CustomSelect 
                      value={defaults.text?.textEffect3 || 'none'} 
                      onChange={(val) => updateDefaults('text', { textEffect3: val })}
                      ${effectOptions}
                    />
                  </div>`;

if (content.includes("Default Text Effect")) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync('src/components/Toolbar.tsx', content);
    console.log('Fixed Defaults UI in Toolbar');
} else {
    console.log('Target string not found in Toolbar.tsx');
}
