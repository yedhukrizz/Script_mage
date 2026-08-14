const fs = require('fs');
let content = fs.readFileSync('src/components/PropertiesPanel.tsx', 'utf8');

const effectOptionsOld = `
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
`;

const effectOptionsNew = `
                          { value: 'none', label: 'None' },
                          { value: 'write-on', label: 'Write On (Typewriter)' },
                          { value: 'fade-words', label: 'Appearing Words' },
                          { value: 'fly-words', label: 'Flying Words' },
                          { value: 'zoom-words', label: 'Zooming Words' },
                          { value: 'shiver', label: 'Shiver (Continuous)' },
                          { value: 'flicker', label: 'Flicker (Continuous)' },
                          { value: 'bloom', label: 'Bloom (Continuous)' },
                          { value: 'neon', label: 'Neon Glow (Continuous)' },
                          { value: 'glitch', label: 'Glitch (Continuous)' },
                          { value: 'drop-shadow', label: 'Drop Shadow' },
                          { value: 'outline', label: 'Outline (Stroked)' },
                          { value: 'wave', label: 'Wave (Continuous)' }
`;

content = content.replace(new RegExp(effectOptionsOld.replace(/[.*+?^$|(){}\\[\\]\\\\]/g, '\\\\$&'), 'g'), effectOptionsNew);
fs.writeFileSync('src/components/PropertiesPanel.tsx', content);
