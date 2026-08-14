const fs = require('fs');
let content = fs.readFileSync('src/components/TextGallery.tsx', 'utf8');

const oldEffects = `const EFFECTS = [
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
];`;

const newEffects = `const EFFECTS = [
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
];`;

content = content.replace(oldEffects, newEffects);

fs.writeFileSync('src/components/TextGallery.tsx', content);
