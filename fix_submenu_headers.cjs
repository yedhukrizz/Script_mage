const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const anchor = "{activeSubMenu === 'settings' && 'Settings'}";
const insert = "{activeSubMenu === 'settings' && 'Settings'}\n                      {activeSubMenu === 'defaultText' && 'Text Defaults'}\n                      {activeSubMenu === 'defaultImage' && 'Image Defaults'}\n                      {activeSubMenu === 'defaultShape' && 'Shape Defaults'}\n                      {activeSubMenu === 'defaultPlaceholder' && 'Placeholder Defaults'}";

if (content.includes(anchor) && !content.includes('Text Defaults')) {
  content = content.replace(anchor, insert);
  fs.writeFileSync('src/components/Toolbar.tsx', content);
  console.log("Added submenu titles.");
}
