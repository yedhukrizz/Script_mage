const fs = require('fs');
let content = fs.readFileSync('src/components/TextGallery.tsx', 'utf8');

// Fix bulkFont
content = content.replace(
  "value={bulkFont || 'none'}",
  "value={bulkFont || 'unchanged'}"
).replace(
  "onChange={(val) => setBulkFont(val === 'none' ? '' : val)}",
  "onChange={(val) => setBulkFont(val === 'unchanged' ? '' : val)}"
).replace(
  "{ value: 'none', label: '— Unchanged —' },\n                ...FONTS",
  "{ value: 'unchanged', label: '— Unchanged —' },\n                ...FONTS"
);

// Fix bulkEffect
content = content.replace(
  "value={bulkEffect || 'none'}",
  "value={bulkEffect || 'unchanged'}"
).replace(
  "onChange={(val) => setBulkEffect(val === 'none' ? '' : val)}",
  "onChange={(val) => setBulkEffect(val === 'unchanged' ? '' : val)}"
).replace(
  "{ value: 'none', label: '— Unchanged —' },\n                ...EFFECTS",
  "{ value: 'unchanged', label: '— Unchanged —' },\n                ...EFFECTS"
);

fs.writeFileSync('src/components/TextGallery.tsx', content);
