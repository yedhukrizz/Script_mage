const fs = require('fs');

let content = fs.readFileSync('src/components/PropertiesPanel.tsx', 'utf8');

const target = `<CustomSelect 
                        value={selectedElement.textEffect || 'none'} 
                        onChange={(val) => handleChange('textEffect', val)}
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
                      />`;

const textEffectOptionsStr = `options={[
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

const replacement = `<div className="flex flex-col gap-3">
                        <CustomSelect 
                          value={selectedElement.textEffect || 'none'} 
                          onChange={(val) => handleChange('textEffect', val)}
                          ${textEffectOptionsStr}
                        />
                        <div className="flex items-center gap-2 mt-1 px-1">
                          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Stack 2</span>
                        </div>
                        <CustomSelect 
                          value={selectedElement.textEffect2 || 'none'} 
                          onChange={(val) => handleChange('textEffect2', val)}
                          ${textEffectOptionsStr}
                        />
                        <div className="flex items-center gap-2 mt-1 px-1">
                          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Stack 3</span>
                        </div>
                        <CustomSelect 
                          value={selectedElement.textEffect3 || 'none'} 
                          onChange={(val) => handleChange('textEffect3', val)}
                          ${textEffectOptionsStr}
                        />
                      </div>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/PropertiesPanel.tsx', content);
