const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  /<div className="pointer-events-auto">\s*<Toolbar \/>\s*<\/div>/,
  '<div className="pointer-events-auto relative">\n            <Toolbar />\n          </div>'
);
fs.writeFileSync('src/App.tsx', content);
