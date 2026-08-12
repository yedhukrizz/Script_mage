const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Submenu header
const submenuTarget = `<div className="sticky top-0 bg-panel-bg/95 backdrop-blur-md z-20 flex items-center justify-between border-b border-panel-border pb-2.5 mb-2.5 pt-0.5">`;
const submenuReplace = `<div className="sticky top-0 -mt-3 -mx-3 px-3 pt-4 pb-3 mb-3 bg-panel-bg/95 backdrop-blur-xl z-20 flex items-center justify-between border-b border-panel-border rounded-t-[23px]">`;

content = content.replace(submenuTarget, submenuReplace);

// Main menu sticky header
const mainTarget = `<div className="sticky top-0 bg-panel-bg z-20 pt-0.5 pb-1 -mt-0.5">`;
const mainReplace = `<div className="sticky top-0 -mt-3 -mx-3 px-3 pt-3 pb-2 mb-2 bg-panel-bg/95 backdrop-blur-xl z-20 border-b border-panel-border rounded-t-[23px]">`;

content = content.replace(mainTarget, mainReplace);

fs.writeFileSync(file, content);
