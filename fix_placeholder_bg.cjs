const fs = require('fs');

let elementRenderer = fs.readFileSync('src/components/ElementRenderer.tsx', 'utf8');

elementRenderer = elementRenderer.replace(
  '<div className="w-full h-full bg-black pointer-events-none"></div>',
  '<div className="w-full h-full pointer-events-none bg-gradient-to-br from-panel-bg via-button-bg to-panel-border opacity-50 shadow-inner"></div>'
);
elementRenderer = elementRenderer.replace(
  '<div className="w-full h-full bg-black pointer-events-none"></div>',
  '<div className="w-full h-full pointer-events-none bg-gradient-to-br from-panel-bg via-button-bg to-panel-border opacity-50 shadow-inner"></div>'
);

fs.writeFileSync('src/components/ElementRenderer.tsx', elementRenderer);
