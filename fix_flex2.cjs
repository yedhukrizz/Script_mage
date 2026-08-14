const fs = require('fs');
let content = fs.readFileSync('src/components/PlaceholderGallery.tsx', 'utf8');

// Replace flex-1 sm:flex-initial on the 3 control containers
content = content.replace(/gap-2 w-full sm:w-auto/g, 'gap-2 w-full sm:w-auto md:w-auto justify-stretch sm:justify-start');

// Let's make sure the buttons also take full width on mobile
content = content.replace(/className="bg-\[var\(--color-accent\)\] hover:opacity-90 border border-transparent rounded-lg px-3 py-2 text-xs text-text-main outline-none focus:border-panel-border whitespace-nowrap disabled:opacity-50 flex items-center gap-2"/,
'className="bg-[var(--color-accent)] w-full sm:w-auto justify-center hover:opacity-90 border border-transparent rounded-lg px-3 py-2 text-xs text-text-main outline-none focus:border-panel-border whitespace-nowrap disabled:opacity-50 flex items-center gap-2"');

fs.writeFileSync('src/components/PlaceholderGallery.tsx', content);
