const fs = require('fs');
let content = fs.readFileSync('src/components/PlaceholderGallery.tsx', 'utf8');

// Replace flex-1 sm:flex-initial on the 3 control containers
content = content.replace(/flex-1 sm:flex-initial/g, 'w-full sm:w-auto');

fs.writeFileSync('src/components/PlaceholderGallery.tsx', content);
